// ── game.js ──────────────────────────────────────────────────────────────
// Core game logic: pool building, game lifecycle, placement, scoring,
// daily challenge, streak calculation, and trophy checking.
// Depends on: state.js, i18n.js (t, cName, cardYear, etc.), cards.js,
//             trophies.js (TROPHY_DEFS), ui.js (render functions)
// ─────────────────────────────────────────────────────────────────────────
// Which game eras map to each filter
const ERA_FILTER_MAP={
  ancient:['Ancient','Classical'],
  medieval:['Medieval','Renaissance'],
  modern:['Early Modern','Modern'],
  contemporary:['Contemporary']
};
const ERA_FILTER_KEYS=Object.keys(ERA_FILTER_MAP);

// Normalises an era filter to an array of ERA_FILTER_MAP keys.
// Accepts the current array form and the legacy single-string form
// ('all' | 'ancient' | …) still stored in old history entries.
function normalizeEraFilter(ef){
  if(Array.isArray(ef)) return ef.filter(k=>ERA_FILTER_MAP[k]);
  if(ef&&ERA_FILTER_MAP[ef]) return [ef];
  return [];
}

// Game eras allowed by a filter selection, or null when nothing is selected
// (no filter = all cards).
function allowedErasFor(ef){
  const keys=normalizeEraFilter(ef);
  if(!keys.length) return null;
  return keys.reduce((acc,k)=>acc.concat(ERA_FILTER_MAP[k]),[]);
}

// ── MODE MAPS ─────────────────────────────────────────────────────────────
const MODE_LABEL={
  empires:   'empires_lbl',
  abrahamic: 'biblical_lbl',
  roman:     'mc_roman_title',
  eastern:   'mc_eastern_title',
  characters:'characters_lbl'
};
const MODE_DRAG_LABEL={
  empires:   'drag_label_empires',
  abrahamic: 'drag_label_biblical',
  roman:     'drag_label_roman',
  eastern:   'drag_label_eastern',
  characters:'drag_label_characters'
};
const MODE_WON={
  empires:   'sub_empires_won',
  abrahamic: 'sub_biblical_won',
  characters:'sub_characters_won'
};
const MODE_LOST={
  empires:   'sub_empires_lost',
  abrahamic: 'sub_biblical_lost',
  characters:'sub_characters_lost'
};

var _pendingGameRecord = null;
var _voluntaryEnd = false;
// Run save (runsave.js, documentation/RUN_SAVE.md): the local day the run
// began, and whether it is a daily/recovery run resumed on a later day —
// such a run is ended on boot instead of resumed.
var _runStartedDay = null;
var _runExpired = false;

// ── DAILY CHALLENGE STATE ─────────────────────────────────────────────────
var DAILY_MAX_ATTEMPTS = 3;   // tries allowed per calendar day
var DAILY_DECK_SIZE    = 18;  // cards to place to win the daily

var DAILY_EPOCH_YEAR   = 2026; // first month the challenge calendar covers —
var DAILY_EPOCH_MONTH  = 2;    // March 2026 (0-indexed). Also the recovery floor.

var _isDailyChallenge = false;
var _dailyAttempt     = 0;     // 1-based index of the attempt being played
var _dailyRunDate     = null;  // date pinned at launch — immune to midnight rollover
var _dailyCommitted   = false; // has this attempt been written to localStorage yet?
var _isRecoverRun     = false; // is the run in progress a past-day catch-up?
var _lastDailyResult  = null;  // {won, attempts, attemptsLeft, date, recover} for the gameover screen

// Seeded PRNG (mulberry32) — same seed = same sequence every time
function _seededRNG(seed){
  return function(){
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function _dailySeedFor(date){
  // seed = YYYYMMDD as integer
  return date.getFullYear() * 10000 + (date.getMonth()+1) * 100 + date.getDate();
}
function _dailySeed(){ return _dailySeedFor(new Date()); }
function _seededShuffle(arr, rng){
  var a = arr.slice();
  for(var i = a.length - 1; i > 0; i--){
    var j = Math.floor(rng() * (i + 1));
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

// Starts a daily run for `date`. Shared by today's daily (Streak tab and the
// gameover retry) and by past-day recovery — the only differences are which
// date seeds the deck and which attempt budget the run spends.
function _beginDailyRun(date, attempt, isRecover){
  _dailyRunDate    = date;
  _dailyAttempt    = attempt;
  _dailyCommitted  = false;
  _lastDailyResult = null;
  _isRecoverRun    = !!isRecover;
  gameMode = 'classic';
  eraFilter = [];
  setPlayMode('lives');   // the daily always has lives; the menu choice is left alone
  _isDailyChallenge = true;
  // Close all overlays cleanly, same as startGame()
  document.getElementById('history-panel').classList.remove('open');
  document.getElementById('intro').classList.remove('show');
  var _cs=document.getElementById('cultures-screen');
  if(_cs) _cs.classList.remove('show');
  document.getElementById('gameover').classList.remove('show');
  _hideDailyGameoverBtns();
  // Restore hint/skip visibility (will be re-hidden inside initGame daily block)
  var _hBtnR=document.getElementById('hint-btn');
  var _sBtnR=document.getElementById('skip-btn');
  if(_hBtnR) _hBtnR.style.display='';
  if(_sBtnR) _sBtnR.style.display='';
  initGame();
}
// Today's daily. No-op once the day is won or out of attempts.
function _launchDaily(){
  var today = new Date(); today.setHours(0,0,0,0);
  var st = _dailyStatus(today);
  if(st.locked) return;
  _beginDailyRun(today, st.attemptsUsed + 1, false);
}
// A past day, replayed only to unlock its card — see RECOVERY below.
function _launchRecover(date){
  var d = new Date(date); d.setHours(0,0,0,0);
  if(!_recoverEligible(d) || !_recoverGateOpen()) return;
  _beginDailyRun(d, _recoverStatus(d).attemptsUsed + 1, true);
}
function startDailyChallenge(){ _launchDaily(); }
function startRecoverChallenge(yr,mo,d){ _launchRecover(new Date(yr,mo,d)); }
// Single retry entry point for the gameover button (also wired inline in
// index.html), so it resumes whichever kind of run just ended.
function retryDailyChallenge(){
  if(_lastDailyResult && _lastDailyResult.recover) _launchRecover(_lastDailyResult.date);
  else _launchDaily();
}

// Timeline snapshot as stored inside a daily record
function _dailyTimelineSnapshot(){
  return timeline.map(function(c){
    return {
      name: cName(c),
      year: cardYear(c),
      span: isInterval(c) ? formatYear(c.startYear)+' – '+formatYear(c.endYear) : null,
      era: c.era
    };
  });
}

// Called on the first placement of a daily run. Burns the attempt immediately
// so killing the app mid-run can't hand out unlimited tries — and, for a live
// run, it's what makes the day count towards the streak. A recovery run lands
// in the other store and so never affects the streak.
function _commitDailyAttempt(){
  if(!_dailyRunDate) return;
  var rec = _runRecord(_dailyRunDate) || {v:2,attempts:0,won:false,score:0,placed:0,timeline:[]};
  rec.v = 2;
  rec.attempts = Math.max(rec.attempts, _dailyAttempt);
  // Bumped once per catch-up run, right here where the attempt is burned —
  // the daily budget resets, so `attempts` can't be what orders the decks.
  if(_isRecoverRun) rec.tries = (rec.tries||0) + 1;
  _writeRunRecord(_dailyRunDate, rec);
  _dailyCommitted = true;
}

// Read/write for the run in progress. Both dispatch on _isRecoverRun because a
// recovery run must never touch chronos_daily_* — that prefix IS the streak.
function _runRecord(date){
  return _isRecoverRun ? _getRecoverRecord(date) : _getDailyRecord(date);
}
function _writeRunRecord(date, rec){
  return _isRecoverRun ? _writeRecoverRecord(date, rec) : _writeDailyRecord(date, rec);
}

// Called from endGame: merges this attempt into the day's record, keeping only
// the best run, and remembers the outcome for the gameover screen.
function _saveDailyResult(won){
  var date = _dailyRunDate || new Date();
  var recover = _isRecoverRun;
  var rec = _runRecord(date) || {v:2,attempts:0,won:false,score:0,placed:0,timeline:[]};
  rec.v = 2;
  // An expired run (resumed on a later day) spent its attempt on its own day;
  // counting it here would stamp it on today's recovery budget
  if(!_runExpired) rec.attempts = Math.max(rec.attempts, _dailyAttempt);
  var better = won || timeline.length > rec.placed
            || (timeline.length === rec.placed && score > rec.score);
  if(better){
    rec.score = score;
    rec.placed = timeline.length;
    rec.timeline = _dailyTimelineSnapshot();
  }
  rec.won = rec.won || !!won;
  _writeRunRecord(date, rec);
  _lastDailyResult = {
    won: rec.won,
    attempts: rec.attempts,
    attemptsLeft: (rec.won || _runExpired) ? 0 : Math.max(0, DAILY_MAX_ATTEMPTS - rec.attempts),
    date: date,
    recover: recover,
    expired: _runExpired
  };
  _isDailyChallenge = false;
  _dailyCommitted = false;
  _isRecoverRun = false;   // after the write — _writeRunRecord reads this flag
  _runExpired = false;
}


var earnedTrophies = {};
// Reads chronos_trophies — on boot and, through reloadSavedProgress, after a
// cloud sync merged new trophies in.
// Trophy families (same `family`, listed in level order) are climbed level by
// level. Whoever already holds a higher level — On Fire from before the streak
// tiers existed, or the old Librarian, now the top Compendium level — gets the
// lower levels silently, dated the same day, so a card never reads "1 of 4".
function _loadTrophies(){
  earnedTrophies = {};
  try { var _et=localStorage.getItem('chronos_trophies'); if(_et) earnedTrophies=JSON.parse(_et)||{}; } catch(e) {}
  if(typeof earnedTrophies!=='object'||Array.isArray(earnedTrophies)) earnedTrophies = {};
  var changed = false, fams = {};
  TROPHY_DEFS.forEach(function(d){ if(d.family) (fams[d.family] = fams[d.family] || []).push(d.id); });
  Object.keys(fams).forEach(function(f){
    var ids = fams[f], date = null;
    for(var i = ids.length - 1; i >= 0; i--){
      if(earnedTrophies[ids[i]]){ if(!date) date = earnedTrophies[ids[i]]; }
      else if(date){ earnedTrophies[ids[i]] = date; changed = true; }
    }
  });
  if(changed){ try { localStorage.setItem('chronos_trophies', JSON.stringify(earnedTrophies)); } catch(e) {} }
  // The best-streak record starts at the highest streak level already earned
  TROPHY_DEFS.forEach(function(d){
    if(d.special === 'streak' && earnedTrophies[d.id] && d.goal > bestStreak){ bestStreak = d.goal; saveBestStreak(); }
  });
}
_loadTrophies();

// Re-reads all saved progress into memory. Called by sync.js after it merged
// data from other devices into localStorage — never during a run.
function reloadSavedProgress(){
  loadSavedProgress();
  _loadTrophies();
}

function saveTrophies(){
  try { localStorage.setItem('chronos_trophies', JSON.stringify(earnedTrophies)); } catch(e) {}
}

// ── LONG-TERM PROGRESS ────────────────────────────────────────────────────
// Specials judged from saved progress (not the current run): checkTrophies
// unlocks them when trophyProgress reaches its goal, and the trophy tab draws
// the same numbers as a bar, so the two can never disagree. Thresholds live
// on each trophy (goal, score, modes) in trophies.js.
var PROGRESS_TROPHY_SPECIALS = ['compendium_share','total_correct','runs_played','era_gold','mode_records','daily_months','weak_overcome'];

// Distinct calendar months (1-12) with a recorded daily challenge
function _dailyMonthsPlayed(){
  var months = {};
  try{
    for(var i=0;i<localStorage.length;i++){
      var m = /^chronos_daily_\d{4}-(\d{2})-\d{2}$/.exec(localStorage.key(i)||'');
      if(m) months[m[1]] = true;
    }
  }catch(e){}
  return Object.keys(months).length;
}

/* { n, goal, bar } for trophies with measurable progress, else null.
   bar:false means the goal is a yes/no condition (no bar is drawn). */
function trophyProgress(def){
  var all = CARDS.length + INTERVALS.length;
  switch(def.special){
    case 'compendium_share':
    case 'compendium_complete': {
      var found = CARDS.concat(INTERVALS).filter(function(c){ return discoveredCards.has(c.name); }).length;
      return { n: found, goal: def.special==='compendium_share' ? Math.ceil(all*def.goal) : all, bar: true };
    }
    case 'total_correct': {
      var ok = 0; for(var k in cardStats) ok += (cardStats[k] && cardStats[k].ok) | 0;
      return { n: ok, goal: def.goal, bar: true };
    }
    case 'streak':
      return { n: bestStreak, goal: def.goal, bar: true };
    case 'runs_played':
      return { n: runsPlayed, goal: def.goal, bar: true };
    case 'era_gold': {
      var em = eraMastery();
      var gold = em.filter(function(m){ return m.seal && m.seal.id === 'gold'; }).length;
      return { n: gold, goal: def.goal === 'all' ? em.length : def.goal, bar: true };
    }
    case 'mode_records': {
      var modes = def.modes || [];
      var done = modes.filter(function(m){ return modeRecords[m] && (modeRecords[m].best|0) >= def.score; }).length;
      return { n: done, goal: modes.length, bar: true };
    }
    case 'daily_months':
      return { n: _dailyMonthsPlayed(), goal: def.goal, bar: true };
    case 'daily_streak_7':
    case 'daily_streak_40':
      return { n: _calcStreak().longest, goal: def.special==='daily_streak_7' ? 7 : 40, bar: true };
    case 'weak_overcome': {
      var hit = Object.keys(cardStats).some(function(k){ var s=cardStats[k]; return s && (s.miss|0) >= def.goal && isCardMastered(s); });
      return { n: hit ? 1 : 0, goal: 1, bar: false };
    }
  }
  return null;
}

// Events of the running game that skill/secret trophies look back on.
// Reset by initGame; thresholds stay on each trophy (goal, card, month...).
var runFlags = {};
function _resetRunFlags(){
  runFlags = {
    aidsUsed: false,       // any hint or skip used (Pure Memory)
    minGap: Infinity,      // tightest year gap a correct card was placed into (Scalpel)
    maxMissDelta: 0,       // biggest miss, in years (Anachronism)
    lastLifeHits: 0,       // correct cards placed while on the last life (Phoenix)
    maxStreak: 0,          // longest streak of the run (mode records)
    dailyFinished: false   // the run was a live daily (Carpe Diem, Midnight Bells)
  };
}
_resetRunFlags();
// The card just missed, set only while checkTrophies runs right after the miss
// (miss_card trophies are won on the spot, so nothing is kept in the run)
var _missedCard = null;

// Specials that can only be judged once the run is over: the Compendium is
// saved at game end, an empty deck only counts as a finished run, and the
// daily streak only grows when a daily attempt is recorded.
var END_ONLY_TROPHY_SPECIALS = ['compendium_complete','full_deck','daily_streak_7','daily_streak_40',
  'daily_on_date','daily_at_hour','friday_13'].concat(PROGRESS_TROPHY_SPECIALS);

/* Runs at game end and, with midGame=true, after every correct card — so a
   trophy that depends only on the current run pops up the moment it is won.
   Streaks must be caught mid-game anyway: a miss resets them before the end. */
function checkTrophies(midGame){
  if(playModeRules().trophies==='none') return;   // Free play never unlocks trophies
  var placed = timeline.map(function(c){ return c.name; });
  var intervals_placed = timeline.filter(function(c){ return c.startYear !== undefined; }).length;
  var newlyEarned = [];

  TROPHY_DEFS.forEach(function(def){
    if(earnedTrophies[def.id]) return;
    if(!trophyAllowedInMode(def)) return;
    if(midGame && END_ONLY_TROPHY_SPECIALS.indexOf(def.special) >= 0) return;
    var earned = false;
    if(PROGRESS_TROPHY_SPECIALS.indexOf(def.special) >= 0){
      var prog = trophyProgress(def);
      earned = !!prog && prog.n >= prog.goal;
    } else if(def.special === 'compendium_complete'){
      earned = discoveredCards.size >= (CARDS.length + INTERVALS.length);
    } else if(def.special === 'hundred_cards'){
      earned = placed.length >= 100;
    } else if(def.special === 'warlord'){
      var wars = ['World War I','World War II','Korean War','Vietnam War','Hundred Years War',
                  "Thirty Years' War",'Persian Wars','First Punic War','Second Punic War',
                  'Third Punic War','American Civil War','American Revolution','French Revolution',
                  'Trojan War','Cold War'];
      var warCount = wars.filter(function(w){ return placed.indexOf(w) >= 0; }).length;
      earned = warCount >= 8;
    } else if(def.special === 'ten_intervals'){
      earned = intervals_placed >= 10;
    } else if(def.special === 'full_deck'){
      earned = deck.length === 0 && gameActive === false && placed.length > 0;
    } else if(def.special === 'score'){
      earned = score >= def.goal;
    } else if(def.special === 'streak'){
      earned = streak >= def.goal;
    } else if(def.special === 'no_aids'){
      earned = !runFlags.aidsUsed && placed.length >= def.goal;
    } else if(def.special === 'scalpel'){
      earned = runFlags.minGap <= def.goal;
    } else if(def.special === 'specialist'){
      earned = normalizeEraFilter(eraFilter).length === 1 && score >= def.goal;
    } else if(def.special === 'phoenix'){
      earned = runFlags.lastLifeHits >= def.goal;
    } else if(def.special === 'miss_card'){
      earned = _missedCard === def.card;
    } else if(def.special === 'anachronism'){
      earned = runFlags.maxMissDelta > def.goal;
    } else if(def.special === 'ides'){
      var _now = new Date();
      earned = _now.getMonth()+1 === def.month && _now.getDate() === def.day && placed.indexOf(def.card) >= 0;
    } else if(def.special === 'daily_on_date'){
      var _d = new Date();
      earned = runFlags.dailyFinished && _d.getMonth()+1 === def.month && _d.getDate() === def.day;
    } else if(def.special === 'daily_at_hour'){
      earned = runFlags.dailyFinished && new Date().getHours() === def.hour;
    } else if(def.special === 'friday_13'){
      var _f = new Date();
      earned = _f.getDay() === 5 && _f.getDate() === 13 && placed.length > 0;
    } else if(def.special === 'daily_streak_7'){
      earned = _calcStreak().longest >= 7;
    } else if(def.special === 'daily_streak_40'){
      earned = _calcStreak().longest >= 40;
    } else if(def.needed){
      earned = def.needed.every(function(n){ return placed.indexOf(n) >= 0; });
    }
    if(earned){
      earnedTrophies[def.id] = new Date().toISOString();
      newlyEarned.push(def);
    }
  });

  if(newlyEarned.length > 0){
    saveTrophies();
    newlyEarned.forEach(function(def){ queueNotice({ trophy: def }); });
    announceCustomUnlocks();   // a trophy may unlock an emblem or frame
  }
}

// Customizations unlocked since the last check, each as a notice after the
// trophies that unlocked them. Runs mid-game (trophies) and at game end
// (XP levels, mastery seals).
function announceCustomUnlocks(){
  checkCustomUnlocks().forEach(function(item){ queueNotice({ custom: item }); });
}


// ── BUILD POOL ────────────────────────────────────────────────────────────
function buildPool(mode, eraFilter){
  let pool;
  if(mode==='empires'){
    const allowedEras=allowedErasFor(eraFilter);
    pool=allowedEras?INTERVALS.filter(c=>allowedEras.includes(c.era)):INTERVALS;
    if(pool.length<4) pool=[...INTERVALS];
  } else if(mode==='abrahamic'){
    const biblIntervals=INTERVALS.filter(c=>Array.isArray(c.tags)&&c.tags.includes('abrahamic'));
    pool=[...CARDS.filter(c=>Array.isArray(c.tags)&&c.tags.includes('abrahamic')),...biblIntervals];
  } else if(mode==='roman'){
    pool=[...CARDS,...INTERVALS].filter(c=>Array.isArray(c.tags)&&c.tags.includes('roman'));
  } else if(mode==='eastern'){
    pool=[...CARDS,...INTERVALS].filter(c=>Array.isArray(c.tags)&&c.tags.includes('eastern'));
  } else if(mode==='characters'){
    const allowedEras=allowedErasFor(eraFilter);
    const charPool=CARDS.filter(c=>c.cat==='People'||c.cat_pt==='Pessoas');
    pool=allowedEras?charPool.filter(c=>allowedEras.includes(c.era)):charPool;
    if(pool.length<4) pool=[...charPool];
  } else {
    // Classic: mixed CARDS + INTERVALS, apply era filter
    const allowedEras=allowedErasFor(eraFilter);
    const allCards=[...CARDS,...INTERVALS];
    pool=allowedEras?allCards.filter(c=>allowedEras.includes(c.era)):allCards;
    if(pool.length<4) pool=[...allCards];
  }
  return pool;
}

// ── REVIEW DECK ───────────────────────────────────────────────────────────
/* Builds the Review deck from cardStats. Full design and the reasons behind
   each rule: documentation/REVIEW_MODE.md. In short: weak cards become
   targets, grouped into up to 4 "regions" (contiguous stretches of the mode's
   timeline) that prefer the first region's era band; every target keeps the
   cards right before and after it; the rest of each region is drawn at random. */
const REVIEW_MIN_LEVEL=5;
const REVIEW_MODES=['classic','empires','characters'];
const REVIEW_DECK={
  min:18, max:30,            // deck size
  regionMin:6, regionMax:12, // drawn size of each region (may grow past max to reach `min`)
  regionsMax:4,
  join:5,                    // a weak card this many positions from a region joins it
  apart:3,                   // a new region starts at least this far from the others
  cooldown:[0.5,0.75]        // weight of targets from the last / second-to-last review
};
// Era band (index into ERA_FILTER_KEYS) of each game era
const ERA_BAND={};
ERA_FILTER_KEYS.forEach(function(k,i){ ERA_FILTER_MAP[k].forEach(function(e){ ERA_BAND[e]=i; }); });

// Weak = missed at least once and not mastered yet (same rule as era mastery)
function _isWeakCard(c){
  var s=cardStats[c.name];
  return !!s&&(s.miss|0)>0&&!isCardMastered(s);
}
function reviewWeakCards(mode, ef){
  var allowed=allowedErasFor(ef);
  return buildPool(mode,[]).filter(function(c){ return (!allowed||allowed.indexOf(c.era)>=0)&&_isWeakCard(c); });
}
// { ok } or { ok:false, reason:'level'|'mode'|'empty' } — checked when the
// player picks Review and again when the run starts (mode/filter may change)
function reviewAvailability(mode, ef){
  if(playerLevelInfo().level<REVIEW_MIN_LEVEL) return { ok:false, reason:'level' };
  if(REVIEW_MODES.indexOf(mode)<0) return { ok:false, reason:'mode' };
  if(!reviewWeakCards(mode, ef).length) return { ok:false, reason:'empty' };
  return { ok:true };
}

// Returns { deck, targets } (targets = card names), or null when there is no
// weak card. `rand` is injectable for tests.
function buildReviewDeck(mode, ef, rand){
  rand=rand||Math.random;
  var R=REVIEW_DECK;
  var allowed=allowedErasFor(ef);
  var inF=function(c){ return !allowed||allowed.indexOf(c.era)>=0; };
  // The mode's whole timeline: neighbours may come from outside the filter
  var S=buildPool(mode,[]).slice().sort(function(a,b){ return cardYear(a)-cardYear(b)||(a.name<b.name?-1:a.name>b.name?1:0); });
  var pos={}; S.forEach(function(c,i){ pos[c.name]=i; });
  var weak=S.filter(function(c){ return inF(c)&&_isWeakCard(c); });
  if(!weak.length) return null;
  var recent=reviewHistory.map(function(list){ return list||[]; });
  var weight=function(c){
    var s=cardStats[c.name], w=Math.max(1,(s.miss|0)-(s.ok|0)+1);
    R.cooldown.forEach(function(f,k){ if(recent[k]&&recent[k].indexOf(c.name)>=0) w*=f; });
    return w;
  };
  var pick=function(list){
    var tot=list.reduce(function(n,c){ return n+weight(c); },0), r=rand()*tot;
    for(var i=0;i<list.length;i++){ r-=weight(list[i]); if(r<=0) return list[i]; }
    return list[list.length-1];
  };

  var taken=[], count=0, regions=[], isTarget={};
  // Nearest free card beyond a region's edge on side d (−1 / +1): skips cards
  // outside the filter unless `pierce`; −1 if the timeline ends there or
  // another region is in the way
  var nextIdx=function(r,d,pierce){
    for(var i=(d<0?r.lo:r.hi)+d; i>=0&&i<S.length; i+=d){
      if(taken[i]) return -1;
      if(pierce||inF(S[i])) return i;
    }
    return -1;
  };
  var take=function(r,i){ taken[i]=true; count++; r.n++; if(i<r.lo) r.lo=i; if(i>r.hi) r.hi=i; };
  // One growth step: the preferred side, else the opposite one — a region
  // never shrinks and never asks for a card that doesn't exist. When piercing,
  // the nearer side wins.
  var grow=function(r,side,pierce){
    var a=nextIdx(r,side,pierce), b=nextIdx(r,-side,pierce);
    if(pierce&&a>=0&&b>=0&&Math.abs(b-(side<0?r.hi:r.lo))<Math.abs(a-(side<0?r.lo:r.hi))) a=b;
    var i=a>=0?a:b;
    if(i<0) return false;
    take(r,i); return true;
  };
  var randSide=function(){ return rand()<0.5?-1:1; };
  var bandOf=function(c){ return ERA_BAND[c.era]; };
  var distTo=function(i){ return regions.reduce(function(d,r){ return Math.min(d, i<r.lo?r.lo-i:(i>r.hi?i-r.hi:0)); },Infinity); };

  while(regions.length<R.regionsMax&&count+R.regionMin<=R.max){
    var cand=weak.filter(function(c){ var i=pos[c.name]; return !taken[i]&&distTo(i)>=R.apart; });
    if(!cand.length) break;
    // Strong preference: same era band as the first region, then the adjacent ones
    if(regions.length){
      var b0=bandOf(regions[0].seed);
      var same=cand.filter(function(c){ return bandOf(c)===b0; });
      var near=cand.filter(function(c){ return Math.abs(bandOf(c)-b0)===1; });
      cand=same.length?same:(near.length?near:cand);
    }
    var seed=pick(cand), p=pos[seed.name];
    var room=R.max-count;
    var r={ seed:seed, lo:p, hi:p, n:0, goal:Math.min(room, R.regionMin+Math.floor(rand()*(R.regionMax-R.regionMin+1))) };
    regions.push(r);
    take(r,p); isTarget[seed.name]=true;
    // Fixed: the target's own boundary cards
    grow(r,-1,false); grow(r,1,false);
    // Weak cards nearby join as extra targets (nearest first), with their
    // boundary cards, while the region stays within its goal
    for(;;){
      var best=null, bestD=Infinity;
      weak.forEach(function(c){
        var i=pos[c.name];
        if(isTarget[c.name]||(taken[i]&&(i<r.lo||i>r.hi))) return;
        var d=i<r.lo?r.lo-i:(i>r.hi?i-r.hi:0);
        if(d<=R.join&&d<bestD){ best=c; bestD=d; }
      });
      if(!best) break;
      var bi=pos[best.name], lo=r.lo, hi=r.hi;
      var prevIn=bi-1; while(prevIn>=0&&!inF(S[prevIn])) prevIn--;
      var nextIn=bi+1; while(nextIn<S.length&&!inF(S[nextIn])) nextIn++;
      lo=Math.min(lo, prevIn>=0?prevIn:bi); hi=Math.max(hi, nextIn<S.length?nextIn:bi);
      var add=[], blocked=false;
      for(var k=lo;k<=hi;k++){
        if(k>=r.lo&&k<=r.hi) continue;
        if(taken[k]){ blocked=true; break; }
        if(inF(S[k])) add.push(k);
      }
      if(blocked||r.n+add.length>Math.max(r.goal, r.n)) break;   // stop at the first one that doesn't fit
      add.forEach(function(k){ take(r,k); });
      isTarget[best.name]=true;
    }
    // Variable part: pad to the drawn size, growing towards random sides
    while(r.n<r.goal&&grow(r,randSide(),false)){}
  }
  // Below the minimum (few weak cards): widen every region round-robin, past
  // regionMax if needed; pierce the filter silently only as a last resort
  [false,true].forEach(function(pierce){
    var grew=true;
    while(count<R.min&&grew){
      grew=false;
      regions.forEach(function(r){ if(count<R.min&&grow(r,randSide(),pierce)) grew=true; });
    }
  });

  var deck=[], targets=[];
  for(var i=0;i<S.length;i++) if(taken[i]){ deck.push(S[i]); if(isTarget[S[i].name]) targets.push(S[i].name); }
  shuffle(deck);
  // drawCard() pops from the end: the first card lands on an empty timeline
  // and can't be missed, so it must never be a target
  var last=deck.length-1;
  if(last>0&&isTarget[deck[last].name]){
    for(var j=last-1;j>=0;j--) if(!isTarget[deck[j].name]){ var tmp=deck[j]; deck[j]=deck[last]; deck[last]=tmp; break; }
  }
  return { deck:deck, targets:targets };
}

// Remembers this review's targets for the cooldown (newest first, last two)
function _rememberReviewTargets(targets){
  reviewHistory=[targets.slice()].concat(reviewHistory.slice(0,1));
  saveReviewHistory();
}

// ── RUN SETUP ─────────────────────────────────────────────────────────────
// Shared by initGame (a new run) and resumeSavedRun (a run restored from
// chronos_run, see RESUME below).

// Wipes every trace of the previous run from the screen
function _resetRunDom(){
  // Hide gameover overlay immediately
  document.getElementById('gameover').classList.remove('show');

  // Reset score, streak & placed display
  var _sv = document.getElementById('score-val');
  var _stv = document.getElementById('streak-val');
  var _pv = document.getElementById('placed-val');
  if(_sv) _sv.textContent = '0';
  if(_stv) _stv.textContent = '0';
  if(_pv) _pv.textContent = '0';

  // Reset hand card to blank state
  var _hcName = document.getElementById('hc-name');
  var _hcCat  = document.getElementById('hc-cat');
  var _hcEra  = document.getElementById('hc-era');
  var _hcHint = document.getElementById('hc-hint');
  var _hcClue = document.getElementById('hc-clue');
  var _hcBar  = document.getElementById('hc-bar');
  var _hcSpan = document.getElementById('hc-span');
  var _hcReg  = document.getElementById('hc-region');
  var _hcCult = document.getElementById('hc-culture');
  if(_hcName) _hcName.textContent = '—';
  if(_hcCat)  _hcCat.textContent  = '—';
  if(_hcEra)  _hcEra.textContent  = '—';
  if(_hcHint) _hcHint.textContent = '';
  if(_hcClue) _hcClue.textContent = '';
  if(_hcBar)  _hcBar.style.background = '';
  if(_hcSpan) { _hcSpan.textContent = ''; _hcSpan.style.display = 'none'; }
  if(_hcReg)  { _hcReg.textContent  = ''; _hcReg.style.display  = 'none'; }
  if(_hcCult) { _hcCult.textContent = ''; _hcCult.style.display = 'none'; }

  // Close confirm dialog if lingering
  var _cd = document.getElementById('confirm-dialog');
  if(_cd) _cd.classList.remove('show');

  // Close fact panel and clear review state
  var _fp = document.getElementById('fact-panel');
  if(_fp) {
    _fp.classList.remove('open');
    _fp.classList.remove('review-mode');
  }

  // Clear timeline DOM immediately
  var _tl = document.getElementById('timeline');
  if(_tl) _tl.innerHTML = '';

  // Clear pending feedback timer and reset element
  clearTimeout(_feedbackTimer);
  var _fb = document.getElementById('feedback');
  if(_fb) { _fb.className = ''; _fb.textContent = ''; }

  // Reset hint/skip counts to starting values
  var _hc = document.getElementById('hint-count');
  var _sc = document.getElementById('skip-count');
  if(_hc) _hc.textContent = '3';
  if(_sc) _sc.textContent = '1';
  // Reset hint dots visual state
  for(var _di=0; _di<3; _di++){
    var _dot=document.getElementById('hd'+_di);
    if(_dot) _dot.classList.remove('used');
  }
  // Reset _fromGameover flag
  _fromGameover = false;
}

// Daily challenge: no hints or skips, and their buttons hidden entirely
function _applyDailyControls(){
  var _hcEl=document.getElementById('hint-count');
  if(_hcEl) _hcEl.textContent='0';
  for(var _dhi=0;_dhi<3;_dhi++){
    var _dhd=document.getElementById('hd'+_dhi);
    if(_dhd) _dhd.classList.add('used');
  }
  var _hBtn=document.getElementById('hint-btn');
  var _sBtn=document.getElementById('skip-btn');
  if(_hBtn) _hBtn.style.display='none';
  if(_sBtn) _sBtn.style.display='none';
}

// Header, labels, lives, side buttons and timeline of the running game
function _renderRunHeader(){
  // Hide history access during play
  document.getElementById('hist-btn').style.visibility='hidden';
  document.getElementById('hdr-mode').textContent=_isDailyChallenge?_dailyHeaderLabel():t(MODE_LABEL[gameMode]||'subtitle');
  document.getElementById('streak-lbl').textContent=t('streak');
  document.getElementById('score-lbl').textContent=t('score');
  var _plbl=document.getElementById('placed-lbl');if(_plbl)_plbl.textContent=t('placed_lbl');
  document.getElementById('bottom-label').textContent=t(MODE_DRAG_LABEL[gameMode]||'drag_label');
  // Pills permanently hidden — no mode label in header
  document.getElementById('free-pill').style.display='none';
  document.getElementById('empires-pill').style.display='none';
  document.getElementById('biblical-pill').style.display='none';
  document.getElementById('characters-pill').style.display='none';
  document.getElementById('lives-stat').style.display=livesMode?'flex':'none';
  renderLives();renderSideBtns();renderTimeline();
}

function initGame(){
  _pendingGameRecord = null;
  _voluntaryEnd = false;
  currentCard = null;
  reviewMode = false;
  _runStartedDay = _dayStamp(new Date());
  _runExpired = false;
  clearRun();   // a new run replaces any saved one
  _resetRunDom();

  deck=shuffle([...buildPool(gameMode,eraFilter)]);timeline=[];score=0;streak=0;cardCluesUsed=0;gameActive=true;_pendingDraw=false;
  _resetRunFlags();
  // Review swaps in its own deck. startGame() already checked it can be built;
  // if it somehow can't, the run falls back to Lives rather than a full deck.
  if(playMode==='review'){
    var _rd=buildReviewDeck(gameMode,eraFilter);
    if(_rd){ deck=_rd.deck; _rememberReviewTargets(_rd.targets); }
    else setPlayMode('lives');
  }
  var _rules=playModeRules();
  lives=_rules.lives;hints=_rules.hints;skip=_rules.skip;
  // Daily challenge overrides
  if(_isDailyChallenge){
    // Two-stage seeding: WHICH 18 cards comes from the plain day seed, so every
    // player faces the same set. Retries reshuffle only the ORDER, so a second
    // attempt can't be won from memory. Attempt 1 is byte-identical to before.
    var _seed=_dailySeedFor(_dailyRunDate||new Date());
    var _base=_seededShuffle([...CARDS,...INTERVALS],_seededRNG(_seed)).slice(0,DAILY_DECK_SIZE);
    // Catch-up runs continue the same seed line past the live attempts (which
    // occupy 1..3), keyed on the LIFETIME try count rather than today's — the
    // daily budget resets, and orders must not reset with it. `tries` counts
    // runs already burned, so the first catch-up lands on 4.
    var _ord=_dailyAttempt;
    if(_isRecoverRun){
      var _rr=_getRecoverRecord(_dailyRunDate);
      _ord=DAILY_MAX_ATTEMPTS+((_rr&&_rr.tries)||0)+1;
    }
    deck=_ord>1
      ?_seededShuffle(_base,_seededRNG(_seed+_ord*104729))
      :_base;
    hints=0; skip=0;
    _applyDailyControls();
  }
  _renderRunHeader();
  // Show tutorial first time in empires mode
  if(gameMode==='empires'&&!empiresShownTutorial){
    empiresShownTutorial=true;
    document.getElementById('tutorial').classList.add('show');
  } else {
    drawCard();
  }
}
function closeTutorial(){
  document.getElementById('tutorial').classList.remove('show');
  drawCard();
}

// ── RESUME ────────────────────────────────────────────────────────────────
/* Restores the run saved in chronos_run (runsave.js) when the app reopens,
   straight into the game — design in documentation/RUN_SAVE.md. Called once
   on boot by ui.js; returns whether a run was restored. Unlike initGame it
   records nothing a run records when it starts (deck, review targets, daily
   attempt), so a resumed run never counts anything twice. */
function resumeSavedRun(){
  var s=loadRun();
  if(!s) return false;
  _pendingGameRecord=null; _voluntaryEnd=false; reviewMode=false; _lastDailyResult=null;
  gameMode=s.mode; setPlayMode(s.playMode); eraFilter=s.eraFilter.slice();
  _isDailyChallenge=!!s.daily;
  _isRecoverRun=!!(s.daily&&s.daily.recover);
  _dailyRunDate=s.daily?s.daily.date:null;
  _dailyAttempt=s.daily?s.daily.attempt:0;
  _dailyCommitted=_isDailyChallenge;   // a run is saved only after its first placement
  _runStartedDay=s.startedDay;
  _runExpired=_isDailyChallenge&&s.startedDay!==_dayStamp(new Date());
  // The menu follows the resumed run, so Play Again stays in its mode
  if(!_isDailyChallenge){
    menuPlayMode=playMode;
    if(gameMode==='classic'||gameMode==='empires'||gameMode==='characters'){
      selectMode(gameMode); eraSelection=eraFilter.slice(); syncEraChips();
    }
    syncPlayModeButtons();
  }

  var _rules=playModeRules();
  deck=s.deck; timeline=s.timeline; currentCard=null; cardCluesUsed=0;
  score=s.score; streak=s.streak; lives=s.lives;
  hints=s.hints===null?_rules.hints:s.hints;   // null = unlimited (Free)
  skip=s.skip===null?_rules.skip:s.skip;
  if(_isDailyChallenge){ hints=0; skip=0; }
  _resetRunFlags();
  Object.keys(s.flags).forEach(function(k){ runFlags[k]=s.flags[k]; });
  gameActive=true; _pendingDraw=false;

  document.getElementById('intro').classList.remove('show');
  _resetRunDom();
  if(_isDailyChallenge) _applyDailyControls();
  _renderRunHeader();
  document.getElementById('score-val').textContent=score;
  document.getElementById('streak-val').textContent=streak;
  var _pv=document.getElementById('placed-val');if(_pv)_pv.textContent=timeline.length;

  if(_runExpired){ _voluntaryEnd=true; endGame(false); return true; }   // the day closed at midnight
  if(livesMode&&lives<=0){ endGame(false); return true; }              // closed in the last 700 ms
  if(s.current){ currentCard=s.current; cardCluesUsed=s.clues; renderHandCard(); }
  else drawCard();   // the fact panel was open: go on to the next card
  return true;
}
function shuffle(arr){for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}return arr;}

// ── RENDER ────────────────────────────────────────────────────────────────

const isInterval=c=>c.startYear!==undefined;
const cardYear=c=>isInterval(c)?c.startYear:c.year;
const formatSpan=c=>isInterval(c)?formatYear(c.startYear)+' – '+formatYear(c.endYear):formatYear(c.year);
const cRegion=c=>lang==='pt'?(c.region_pt||c.region):c.region;
const cCulture=c=>lang==='pt'?(c.culture_pt||c.culture):c.culture;

function useHint(){
  if(!currentCard||!gameActive||hints<=0||cardCluesUsed>=3)return;
  const pool=lang==='pt'?currentCard.clues_pt:currentCard.clues;
  if(!pool||!pool[cardCluesUsed])return;
  hints--;
  runFlags.aidsUsed=true;
  const clueEl=document.getElementById('hc-clue');
  clueEl.textContent='💡 '+pool[cardCluesUsed];
  clueEl.classList.add('show');
  cardCluesUsed++;
  saveRun();
  renderSideBtns();
}
function useSkip(){
  if(!currentCard||!gameActive||skip<=0)return;
  skip--;
  runFlags.aidsUsed=true;
  // Put current card back at a random position in remaining deck (not at top)
  const card=currentCard;currentCard=null;
  const insertAt=Math.max(0,Math.floor(Math.random()*(deck.length-1)));
  deck.splice(insertAt,0,card);
  renderSideBtns();
  drawCard();
}

// ── PLAY MODE RULES ───────────────────────────────────────────────────────
/* Per play mode (playMode in state.js): starting lives / hints / skips, the
   share of the final score that becomes XP, and which trophies can unlock
   ('all' | 'none' | 'sections' = only the TROPHY_SECTIONS ids in `sections`,
   minus `excludeTrophies`).
   Infinity = unlimited; a card still has only 3 clues.
   The daily challenge overrides hints/skips to 0 in initGame. */
const PLAY_MODE_RULES={
  lives: { lives:3, hints:3,        skip:1,        xp:1,   trophies:'all'  },
  // A ~18–30 card deck would make emptying it (The End of History) trivial
  review:{ lives:5, hints:10,       skip:3,        xp:0.5, trophies:'sections', sections:['skill','longterm','secret'], excludeTrophies:['time_lord'] },
  free:  { lives:3, hints:Infinity, skip:Infinity, xp:0,   trophies:'none' }
};
function playModeRules(){ return PLAY_MODE_RULES[playMode]||PLAY_MODE_RULES.lives; }
function trophyAllowedInMode(def){
  var r=playModeRules();
  if(r.trophies==='none') return false;
  if(r.trophies==='sections') return (r.sections||[]).indexOf(def.section)>=0&&(r.excludeTrophies||[]).indexOf(def.id)<0;
  return true;
}

// ── GAME LOGIC ────────────────────────────────────────────────────────────
/* Streak multiplier: grows ×STREAK_MULT_GROWTH for every full block of
   STREAK_STEP consecutive hits, up to STREAK_MULT_MAX. `streakBefore` is the
   streak before this card, so cards 1–5 score 1×, 6–10 2×, 11–15 4×,
   16–20 8×, 21–25 16×, 26+ 32×. A miss resets it to 1×.
   The cap matters because score becomes XP: uncapped, a 50-hit streak
   would be worth ~51k points and a 100-hit one ~51M. */
const STREAK_STEP = 5, STREAK_MULT_GROWTH = 2, STREAK_MULT_MAX = 32;
function streakMultiplier(streakBefore){
  return Math.min(STREAK_MULT_MAX, Math.pow(STREAK_MULT_GROWTH, Math.floor(streakBefore / STREAK_STEP)));
}

// Tallies one placement attempt in cardStats (state.js) and saves right away,
// so a closed tab never loses it. Skipped cards are not attempts.
function recordCardResult(card, ok){
  var key = card && card.name;
  if(!key) return;
  var s = cardStats[key];
  if(!s || typeof s !== 'object') s = cardStats[key] = { ok:0, miss:0, last:'' };
  if(ok) s.ok = (s.ok|0) + 1; else s.miss = (s.miss|0) + 1;
  s.last = _dayStamp(new Date());
  saveCardStats();
}

function attemptPlacement(idx){
  if(!currentCard||!gameActive)return;
  // Burn the daily attempt on the very first placement, not at endGame
  if(_isDailyChallenge&&!_dailyCommitted)_commitDailyAttempt();
  const card=currentCard;
  const cy=cardYear(card);
  const prev=timeline[idx-1],next=timeline[idx];
  const valid=(!prev||cy>=cardYear(prev))&&(!next||cy<=cardYear(next));
  // The first card of a run lands on an empty timeline and can't be wrong,
  // so it says nothing about the player's knowledge
  if(timeline.length>0) recordCardResult(card, valid);
  if(valid){
    // Run events for skill/secret trophies: the tightest gap filled (Scalpel)
    // and hits made while on the last life (Phoenix)
    if(prev&&next){ var _gap=cardYear(next)-cardYear(prev); if(_gap>0&&_gap<runFlags.minGap) runFlags.minGap=_gap; }
    if(livesMode&&lives===1) runFlags.lastLifeHits++;
    // Interval scoring: bonus for duration (longer empires = harder to place precisely)
    SFX.play('correct');
    const basePoints=isInterval(card)?Math.min(30,10+Math.floor((card.endYear-card.startYear)/100)):10;
    timeline.splice(idx,0,card);score+=Math.round(basePoints*streakMultiplier(streak));streak++;currentCard=null;
    // Best streak only where streak trophies can unlock, so its bar never runs ahead of them
    if(streak>bestStreak&&playModeRules().trophies!=='none'){ bestStreak=streak; saveBestStreak(); }
    if(streak>(runFlags.maxStreak|0)) runFlags.maxStreak=streak;
    // Streak reward: +1 hint every 20 in a row (pointless when hints are unlimited)
    if(streak>0&&streak%20===0&&isFinite(hints)){hints++;renderSideBtns();showStreakToast();}
    saveRun();   // right after the card stats, so a resumed run starts after this card
    checkTrophies(true);
    renderTimeline();
    document.getElementById('score-val').textContent=score;
    document.getElementById('streak-val').textContent=streak;
    var _pv=document.getElementById('placed-val');if(_pv)_pv.textContent=timeline.length;
    setTimeout(()=>{const cards=document.querySelectorAll('.timeline-card');if(cards[idx])cards[idx].scrollIntoView({behavior:'smooth',block:'center'});},100);
    _pendingDraw=true;showFeedback(true,null);
    if(typeof _showPlacedTrivia==='undefined'||_showPlacedTrivia){showFact(card,false);}
    else{_pendingDraw=false;drawCard();}
  } else {
    SFX.play('wrong');
    streak=0;document.getElementById('streak-val').textContent=streak;
    let hint='none';
    let yearDelta=null;
    if(timeline.length>0){
      const firstNewerIdx=timeline.findIndex(c=>cy<cardYear(c));
      let correctSlot=firstNewerIdx===-1?timeline.length:firstNewerIdx;
      hint=correctSlot<idx?'earlier':'later';
      // Find the neighbour at the attempted slot closest to the card's year
      const nBefore=timeline[idx-1]?cardYear(timeline[idx-1]):null;
      const nAfter=timeline[idx]?cardYear(timeline[idx]):null;
      if(nBefore!==null&&nAfter!==null){
        yearDelta=Math.min(Math.abs(cy-nBefore),Math.abs(cy-nAfter));
      } else if(nBefore!==null){
        yearDelta=Math.abs(cy-nBefore);
      } else if(nAfter!==null){
        yearDelta=Math.abs(cy-nAfter);
      }
    }
    showFeedback(false,hint,yearDelta);
    // Trophies won by a miss — the biggest miss of the run (Anachronism) and
    // missing a given card (Raiders of the Lost Ark) — are checked right away,
    // as misses otherwise only reach checkTrophies on the next correct card
    if(yearDelta!==null&&yearDelta>runFlags.maxMissDelta) runFlags.maxMissDelta=yearDelta;
    _missedCard=card.name; checkTrophies(true); _missedCard=null;
    if(livesMode){ lives--; renderLives(); }
    saveRun();
    if(livesMode&&lives<=0) setTimeout(()=>endGame(false),700);
  }
}

// ── GAME OVER ─────────────────────────────────────────────────────────────
function endGame(won){
  gameActive=false;
  clearRun();   // first: a run that reached its end can never be resumed (RUN_SAVE.md)
  // Zero cards placed: skip gameover, return to intro.
  // No attempt was committed either, so the daily stays fully available.
  if(timeline.length===0){
    document.getElementById('hist-btn').style.visibility='';
    _pendingGameRecord=null; _voluntaryEnd=false;
    _isDailyChallenge=false; _dailyCommitted=false; _isRecoverRun=false; _lastDailyResult=null;
    showIntro(); return;
  }
  runsPlayed++; saveRunsPlayed();   // every finished run, any mode (Veteran trophy)
  // A live daily (not a past-day recovery) — read by the date/hour secret trophies
  // (not one resumed on a later day: that would game the date/hour trophies)
  if(_isDailyChallenge&&!_isRecoverRun&&!_runExpired) runFlags.dailyFinished=true;
  // Personal best for the mode — must run before _saveDailyResult clears the daily flag
  var _recordMode=_isDailyChallenge?'daily':gameMode;
  var _newRecord=recordModeResult(_recordMode, score, timeline.length, runFlags.maxStreak|0, playMode==='lives');
  // Record the daily attempt (win or loss) — also clears _isDailyChallenge
  if(_isDailyChallenge){ _saveDailyResult(won); }
  _pendingGameRecord = buildGameRecord(won);
  _eagerSaveDiscovered();
  checkTrophies();
  _lastXpResult = awardXp(Math.floor(score*playModeRules().xp));
  announceCustomUnlocks();
  // Restore history button
  document.getElementById('hist-btn').style.visibility='';
  document.getElementById('go-title').textContent=won?t('go_won'):t('go_lost');
  const goSub=won
    ?t(MODE_WON[gameMode]||'sub_won')
    :(_voluntaryEnd?t('sub_ended')
      :(livesMode?t(MODE_LOST[gameMode]||'sub_lost'):t('sub_free')));
  _voluntaryEnd=false;
  document.getElementById('go-sub').textContent=goSub;
  document.getElementById('go-score').textContent=score;
  document.getElementById('go-score-lbl').textContent=t('final_score');
  var _recMode=_newRecord&&RECORD_MODES.find(function(m){ return m.id===_recordMode; });
  document.getElementById('go-record').textContent=_recMode?t('go_new_record').replace('{mode}',t(_recMode.label)):'';
  var _saveBtn=document.getElementById('go-save-btn');
  if(_saveBtn){_saveBtn.textContent=lang==='pt'?'💾 Salvar Timeline':'💾 Save Timeline';_saveBtn.disabled=false;_saveBtn.style.opacity='';}
  document.getElementById('go-again-btn').textContent=t('play_again');
  _renderDailyGameover();
  _renderGameoverXp(true);
  // stopMusic(true);
  document.getElementById('gameover').classList.add('show');
  // Everything this run counted is saved: let the cloud copy catch up
  // (sync.js; does nothing when logged out)
  syncSoon();
}

// ── GAMEOVER XP ───────────────────────────────────────────────────────────
var _lastXpResult = null;

// XP gained this run + level bar. With `animate`, the bar fills from where the
// run started (from empty if the player levelled up) to where it ends.
function _renderGameoverXp(animate){
  var box=document.getElementById('go-xp');
  if(!box) return;
  var r=_lastXpResult;
  if(!r){ box.innerHTML=''; return; }
  var a=r.after, leveled=a.level>r.before.level;
  var pct=function(info){ return Math.round(100*info.xp/info.xpNeeded); };
  // A mode that gives no XP says so instead of showing "+0 XP"
  var html=playModeRules().xp>0
    ?'<div class="go-xp-gain">'+t('go_xp_gain').replace('{n}',formatXp(r.gained))+'</div>'
    :'<div class="go-xp-note">'+t('go_xp_free')+'</div>';
  if(playModeRules().xp>0&&playModeRules().xp<1) html+='<div class="go-xp-note">'+t('go_xp_review')+'</div>';
  html+='<div class="pf-level-row"><span class="pf-level-lbl">'+t('pf_level').replace('{n}',a.level)+'</span>';
  html+='<span class="pf-xp-txt">'+t('pf_xp').replace('{xp}',formatXp(a.xp)).replace('{max}',formatXp(a.xpNeeded))+'</span></div>';
  html+='<div class="pf-xp-bar"><div class="pf-xp-fill" id="go-xp-fill" style="width:'+(animate?(leveled?0:pct(r.before)):pct(a))+'%"></div></div>';
  if(leveled) html+='<div class="go-xp-note">'+t('go_level_up').replace('{n}',a.level)+'</div>';
  if(r.newTitle) html+='<div class="go-xp-note">'+t('go_new_title').replace('{name}',lang==='pt'?r.newTitle.name_pt:r.newTitle.name)+'</div>';
  box.innerHTML=html;
  if(animate) setTimeout(function(){ var f=document.getElementById('go-xp-fill'); if(f) f.style.width=pct(a)+'%'; }, 350);
}

// ── DAILY GAMEOVER CONTROLS ───────────────────────────────────────────────
function _hideDailyGameoverBtns(){
  var r=document.getElementById('go-retry-btn'); if(r) r.style.display='none';
  var c=document.getElementById('go-dcard-btn'); if(c) c.style.display='none';
}
function _dailyAttemptLabel(n){
  return t('daily_attempt_of').replace('{n}',n).replace('{max}',DAILY_MAX_ATTEMPTS);
}
// Short date, used wherever a past day has to name itself
function _dailyShortDate(date){
  return date.toLocaleDateString(lang==='pt'?'pt-BR':'en-US',{day:'numeric',month:'short'});
}
// In-game header: a recovery run says which day it is replaying, so the player
// is never confused about whose 18 cards these are.
function _dailyHeaderLabel(){
  if(!_isRecoverRun) return t('daily_title');
  return t('daily_recover_title')+' · '+_dailyShortDate(_dailyRunDate||new Date());
}
// Decorates the gameover screen for a daily run: retry, reward card, or nothing
function _renderDailyGameover(){
  _hideDailyGameoverBtns();
  if(!_lastDailyResult) return;
  var res=_lastDailyResult;
  var retry=document.getElementById('go-retry-btn');
  var dcard=document.getElementById('go-dcard-btn');
  var again=document.getElementById('go-again-btn');
  var rc=!!res.recover;
  if(again) again.textContent=t('daily_exit');
  // Resumed on a later day: ended on boot, nothing left to retry
  if(res.expired){
    var _sube=document.getElementById('go-sub');
    if(_sube) _sube.textContent=t(rc?'daily_recover_expired_sub':'daily_expired_sub').replace('{date}',_dailyShortDate(res.date));
    return;
  }
  if(res.won){
    if(dcard){
      dcard.style.display='';
      dcard.textContent=rc?t('daily_view_card_past'):t('daily_view_card');
      dcard.onclick=function(){
        openDailyCard(res.date.getFullYear(),res.date.getMonth(),res.date.getDate());
      };
    }
    // A recovered card is worth the card and nothing else — say so, or the
    // player will go looking for a streak that did not move.
    if(rc){
      var _subw=document.getElementById('go-sub');
      if(_subw) _subw.textContent=t('daily_recover_won_sub');
    }
  } else if(res.attemptsLeft>0){
    var _sub=document.getElementById('go-sub');
    if(_sub) _sub.textContent=rc?t('daily_recover_again_sub'):t('daily_try_again_sub');
    if(retry){
      retry.style.display='';
      retry.textContent=t('daily_retry')+' · '+_dailyAttemptLabel(res.attempts+1);
      retry.onclick=function(){ retryDailyChallenge(); };
    }
  } else {
    var _sub2=document.getElementById('go-sub');
    if(_sub2) _sub2.textContent=rc
      ?t('daily_recover_out').replace('{max}',DAILY_MAX_ATTEMPTS)
      :t('daily_out_of_tries');
  }
}

// ── HISTORY ───────────────────────────────────────────────────────────────
function buildGameRecord(won) {
  return {
    date: new Date().toISOString(),
    mode: gameMode, playMode: playMode, livesMode: livesMode, eraFilter: eraFilter,
    lang: lang, score: score, placed: timeline.length, won: won,
    timeline: timeline.map(function(c) {
      return {
        name: cName(c), year: cardYear(c),
        span: isInterval(c) ? formatYear(c.startYear)+' – '+formatYear(c.endYear) : null,
        era: c.era, cat: isInterval(c) ? cCulture(c) : cCat(c)
      };
    })
  };
}

function _eagerSaveDiscovered() {
  timeline.forEach(function(c){ var k=c.name||c.name_en; if(k) discoveredCards.add(k); });
  saveDiscovered();
}

function saveAndOpenHistory() {
  if (_pendingGameRecord) {
    gameHistory.unshift(_pendingGameRecord);
    if (gameHistory.length > 30) gameHistory = gameHistory.slice(0, 30);
    try { localStorage.setItem('chronos_history', JSON.stringify(gameHistory)); } catch(e) {}
    _pendingGameRecord = null;
    var btn = document.getElementById('go-save-btn');
    if (btn) { btn.textContent = '✓ '+(lang==='pt'?'Salvo!':'Saved!'); btn.disabled = true; btn.style.opacity = '0.6'; }
  }
  setTimeout(function(){ openHistoryFromGameover(); }, 300);
}


// ── STREAK HELPERS ────────────────────────────────────────────────────────
// 'YYYY-MM-DD' for a local date. Used for both key prefixes and, below, to
// tell which calendar day a catch-up budget was spent on.
function _dayStamp(date){
  return date.getFullYear()+'-'
    +String(date.getMonth()+1).padStart(2,'0')+'-'
    +String(date.getDate()).padStart(2,'0');
}
function _dailyKey(date){ return 'chronos_daily_'+_dayStamp(date); }
// NOTE: "done" means the day was PLAYED, win or loss — this is what feeds the
// streak, and it deliberately stays key-presence only. Whether the day can
// still be played is a separate question, answered by _dailyStatus().locked.
function _isDailyDone(date){
  try{ return !!localStorage.getItem(_dailyKey(date)); }catch(e){ return false; }
}
// Browsers disagree on how a full quota surfaces: the spec name, Firefox's
// legacy name, and older WebKit's numeric code 22 are all in the wild.
function _isQuotaError(e){
  if(!e) return false;
  return e.name==='QuotaExceededError'
      || e.name==='NS_ERROR_DOM_QUOTA_REACHED'
      || e.code===22 || e.code===1014;
}

// Returns whether the write actually landed. A silent failure here is the
// worst outcome in the app: the key never appears, so _isDailyDone reads false,
// the run is forgotten and the streak breaks with no signal to the player.
// If the quota is what stopped us, free the timelines and retry once.
function _writeRecordAt(key, rec){
  try{
    localStorage.setItem(key, JSON.stringify(rec));
    return true;
  }catch(e){
    // Only a full quota justifies the fallback. Any other failure (storage
    // disabled, private-mode restrictions, a transient error) would otherwise
    // destroy every stored timeline for nothing.
    if(_isQuotaError(e) && _pruneDailyTimelines(0)){
      try{
        localStorage.setItem(key, JSON.stringify(rec));
        return true;
      }catch(e2){}
    }
    try{ console.warn('chronos: daily record not saved — storage full'); }catch(e3){}
    return false;
  }
}
function _writeDailyRecord(date, rec){ return _writeRecordAt(_dailyKey(date), rec); }
function _getDailyRecord(date){
  try{
    var raw=localStorage.getItem(_dailyKey(date));
    if(!raw) return null;
    if(raw==='1') return {v:1,attempts:1,won:false,score:0,placed:0,timeline:[]};
    var rec=JSON.parse(raw);
    if(!rec||typeof rec!=='object') return null;
    // Lazy migration for v1 records (no attempt/win tracking): the stored
    // `placed` still tells us whether the day was actually completed.
    // Nothing is rewritten here — normalisation persists on the next write.
    if(typeof rec.placed!=='number') rec.placed=0;
    if(typeof rec.score!=='number') rec.score=0;
    if(typeof rec.won!=='boolean') rec.won=rec.placed>=DAILY_DECK_SIZE;
    if(typeof rec.attempts!=='number'||rec.attempts<1) rec.attempts=1;
    if(!Array.isArray(rec.timeline)) rec.timeline=[];
    return rec;
  }catch(e){ return null; }
}
// Single source of truth for "what can the player do with this day?"
function _dailyStatus(date){
  var rec=_getDailyRecord(date);
  var used=rec?rec.attempts:0;
  var won=!!(rec&&rec.won);
  return {
    rec: rec,
    attemptsUsed: used,
    won: won,
    attemptsLeft: won?0:Math.max(0,DAILY_MAX_ATTEMPTS-used),
    locked: won||used>=DAILY_MAX_ATTEMPTS
  };
}
function _dailyTodayStatus(){
  var d=new Date(); d.setHours(0,0,0,0);
  return _dailyStatus(d);
}

// ── RECOVERY: unlocking a missed day's card ───────────────────────────────
// A past day whose card was never unlocked can be replayed later, purely for
// the card. Three rules, and they are the whole feature:
//   • DAILY_MAX_ATTEMPTS tries per calendar day, refilled every new day, and
//     independent of the tries the day itself had — so no card is ever lost for
//     good: a player who keeps coming back can always reach the whole content;
//   • only while today's daily is closed out (won, or all tries spent), so
//     recovery can never become a way of dodging today's challenge;
//   • it does NOT repair the streak.
// That last rule is why recovery gets its own key prefix: the streak is read
// from the mere presence of chronos_daily_* keys (_isDailyDone, _calcStreak),
// so recording a recovery run there would silently mend a broken streak.
// Nothing below writes to that prefix.
var _RECOVER_PREFIX='chronos_recover_';
// RECORD SHAPE (v3): {day, attempts, tries, won, score, placed, timeline}
//   day       'YYYY-MM-DD' — the calendar day `attempts` was spent on
//   attempts  tries spent ON THAT DAY; read as 0 once the day turns over
//   tries     lifetime count, never reset — it is what keeps successive card
//             orders distinct, since `attempts` cycles 1..3 every day
function _recoverKey(date){ return _RECOVER_PREFIX+_dayStamp(date); }
// Every write here belongs to a catch-up run happening now, so this is the one
// place that has to stamp which calendar day the budget was spent on.
function _writeRecoverRecord(date, rec){
  rec.v = 3;
  rec.day = _dayStamp(new Date());
  return _writeRecordAt(_recoverKey(date), rec);
}
function _getRecoverRecord(date){
  try{
    var raw=localStorage.getItem(_recoverKey(date));
    if(!raw) return null;
    var rec=JSON.parse(raw);
    if(!rec||typeof rec!=='object') return null;
    if(typeof rec.placed!=='number') rec.placed=0;
    if(typeof rec.score!=='number') rec.score=0;
    if(typeof rec.won!=='boolean') rec.won=rec.placed>=DAILY_DECK_SIZE;
    if(typeof rec.attempts!=='number'||rec.attempts<1) rec.attempts=1;
    if(typeof rec.tries!=='number'||rec.tries<rec.attempts) rec.tries=rec.attempts;
    if(!Array.isArray(rec.timeline)) rec.timeline=[];
    // The budget refill lives here, on the read side, so everything downstream
    // — status, the attempt counter, the gameover copy — sees a fresh day
    // without each having to know about the rollover. Nothing is rewritten;
    // the reset persists on the next write.
    if(rec.day!==_dayStamp(new Date())) rec.attempts=0;
    return rec;
  }catch(e){ return null; }
}
// Mirrors _dailyStatus, over TODAY's catch-up budget for one past day. `locked`
// here means "not right now" — it lifts by itself at midnight.
function _recoverStatus(date){
  var rec=_getRecoverRecord(date);
  var used=rec?rec.attempts:0;
  var won=!!(rec&&rec.won);
  return {
    rec: rec,
    attemptsUsed: used,
    won: won,
    attemptsLeft: won?0:Math.max(0,DAILY_MAX_ATTEMPTS-used),
    locked: won||used>=DAILY_MAX_ATTEMPTS
  };
}
// The gate — today's challenge has to be finished, won or all tries burned.
// Same condition as "today can no longer be played".
function _recoverGateOpen(){ return _dailyTodayStatus().locked; }
// Day-level eligibility, deliberately gate-free: the UI needs to tell "this
// day is out of recovery tries" apart from "come back after today's run".
function _recoverEligible(date){
  var today=new Date(); today.setHours(0,0,0,0);
  var d=new Date(date); d.setHours(0,0,0,0);
  if(d.getTime()>=today.getTime()) return false;   // today is the daily itself
  if(d.getTime()<new Date(DAILY_EPOCH_YEAR,DAILY_EPOCH_MONTH,1).getTime()) return false;
  if(_isCardUnlocked(d)) return false;             // nothing left to win
  return !_recoverStatus(d).locked;
}
// The card is unlocked by a win, whichever budget paid for it.
function _isCardUnlocked(date){
  return _dailyStatus(date).won || _recoverStatus(date).won;
}
// Which run to show in the card footer. A live win outranks a recovery one;
// with no win at all, fall back to whatever run exists so the footer still
// carries the day's best attempt.
function _cardUnlockRun(date){
  var live=_getDailyRecord(date);
  if(live&&live.won) return {rec:live,recovered:false};
  var rr=_getRecoverRecord(date);
  if(rr&&rr.won) return {rec:rr,recovered:true};
  if(live) return {rec:live,recovered:false};
  return {rec:rr,recovered:!!rr};
}
function _calcStreak(){
  var today=new Date(); today.setHours(0,0,0,0);
  var cur=0,longest=0,run=0;
  // If today isn't done yet, count back from yesterday so the streak
  // reflects completed days rather than showing 0 all day until you play
  var checking=new Date(today);
  if(!_isDailyDone(checking)) checking.setDate(checking.getDate()-1);
  while(_isDailyDone(checking)){
    cur++;
    checking.setDate(checking.getDate()-1);
  }
  var keys=[];
  try{
    for(var i=0;i<localStorage.length;i++){
      var k=localStorage.key(i);
      if(k&&k.startsWith('chronos_daily_')) keys.push(k);
    }
  }catch(e){}
  keys.sort();
  run=0;
  for(var j=0;j<keys.length;j++){
    if(j===0){ run=1; }
    else{
      var prev=new Date(keys[j-1].replace('chronos_daily_',''));
      var curr=new Date(keys[j].replace('chronos_daily_',''));
      var diff=(curr-prev)/(1000*60*60*24);
      run=diff===1?run+1:1;
    }
    if(run>longest) longest=run;
  }
  return {cur:cur,longest:longest};
}
function _todayDone(){
  var t=new Date(); t.setHours(0,0,0,0);
  return _isDailyDone(t);
}

// ── STORAGE HYGIENE ───────────────────────────────────────────────────────
// Daily records are the only unbounded store in the game: one key per day,
// kept forever. Everything else has a ceiling — history at 30 entries, the
// discovered set at deck size, the rest scalars — and together they stall
// around 110KB. A daily record is ~1.3KB and roughly 95% of it is the 18-card
// timeline snapshot, which exists only so a recent run can be re-read from the
// calendar. At one key per day that reaches the ~5MB localStorage ceiling in
// about five years, and localStorage offers no way to ask for more.
//
// So we put a ceiling on the one thing that lacks one: drop the timeline once
// it is older than the retention window. score/placed/won/attempts total ~80
// chars and are kept forever, so the calendar, the streak and the reward card
// are unaffected; only "review that day's timeline" expires. The renderer
// already guards on an empty timeline (ui.js:760), so it degrades to the
// date-and-score header on its own.
var DAILY_TIMELINE_RETENTION_DAYS = 120;
var _DAILY_PREFIX   = 'chronos_daily_';
var _PRUNE_MARK_KEY = 'chronos_prune_mark';  // deliberately NOT _DAILY_PREFIX,
                                             // or the sweep would scan itself

// Strips stored timelines dated strictly BEFORE (today - retentionDays); the
// cutoff day itself is kept. That boundary is load-bearing, not incidental: it
// is what makes retentionDays=0 mean "every past day, but never today", so the
// quota fallback below can free space without eating the run it is trying to
// save. Returns true only if something was actually freed, so the caller knows
// whether a retry is worth attempting.
// Recovery records carry a timeline of the same shape and age the same way, so
// the sweep covers both prefixes. Their date suffix is identical, which is what
// lets one watermark serve the two of them.
function _recordDateSuffix(k){
  if(k.lastIndexOf(_DAILY_PREFIX,0)===0)   return k.slice(_DAILY_PREFIX.length);
  if(k.lastIndexOf(_RECOVER_PREFIX,0)===0) return k.slice(_RECOVER_PREFIX.length);
  return null;
}
function _pruneDailyTimelines(retentionDays){
  var freed=false;
  try{
    var cutoff=new Date(); cutoff.setHours(0,0,0,0);
    cutoff.setDate(cutoff.getDate()-retentionDays);
    var cutoffStr=_dailyKey(cutoff).slice(_DAILY_PREFIX.length);
    // Days at or below the watermark were swept on an earlier boot and hold no
    // timeline any more. Only the window that has aged past the cutoff since
    // then needs re-reading — without this the sweep would re-read every key
    // on every boot, forever.
    var mark=retentionDays>0?(localStorage.getItem(_PRUNE_MARK_KEY)||''):'';
    var stale=[];
    for(var i=0;i<localStorage.length;i++){
      var k=localStorage.key(i);
      if(!k) continue;
      var ds=_recordDateSuffix(k);
      if(ds===null) continue;
      // 'YYYY-MM-DD' sorts lexicographically, so a string compare is a date
      // compare. Length check also rejects any non-date key sharing the prefix.
      if(ds.length!==10||ds>=cutoffStr||ds<=mark) continue;
      stale.push(k);
    }
    // Collected first, mutated after: never write to localStorage while
    // walking it by index.
    stale.forEach(function(k){
      var raw=localStorage.getItem(k);
      // Cheap string test skips already-pruned and v1 records without parsing.
      if(!raw||raw.indexOf('"timeline":[]')>=0||raw.indexOf('"timeline"')<0) return;
      try{
        var rec=JSON.parse(raw);
        if(!rec||!Array.isArray(rec.timeline)||!rec.timeline.length) return;
        rec.timeline=[];
        localStorage.setItem(k,JSON.stringify(rec));
        freed=true;
      }catch(e){}
    });
    if(retentionDays>0) localStorage.setItem(_PRUNE_MARK_KEY,cutoffStr);
  }catch(e){}
  return freed;
}

// Does not raise the quota — nothing can — but marks the origin as persistent
// so the browser will not evict this data under disk pressure, and so Safari's
// cap on script-writable storage does not sweep it. For a game whose whole
// value is a multi-year streak, being evicted is worse than filling up.
function _requestPersistentStorage(){
  try{
    if(!navigator.storage||!navigator.storage.persist||!navigator.storage.persisted) return;
    navigator.storage.persisted().then(function(already){
      if(!already) return navigator.storage.persist();
    }).catch(function(){});
  }catch(e){}
}

// Deferred so neither one delays first paint.
setTimeout(function(){
  _pruneDailyTimelines(DAILY_TIMELINE_RETENTION_DAYS);
  _requestPersistentStorage();
},0);

// ── DAILY REWARD CARD ─────────────────────────────────────────────────────
// Content lives in dailycards.js, keyed by MM-DD so 366 entries cover every
// year. A day may hold several alternates; pick one deterministically by year.
function _dailyCardKey(date){
  return String(date.getMonth()+1).padStart(2,'0')+'-'+String(date.getDate()).padStart(2,'0');
}
function _dailyCardFor(date){
  if(typeof DAILY_CARDS==='undefined') return null;
  var arr=DAILY_CARDS[_dailyCardKey(date)];
  if(!Array.isArray(arr)||!arr.length) return null;
  return arr.length===1?arr[0]:arr[date.getFullYear()%arr.length];
}
// Localised accessors, matching the cName/cHint pattern in i18n.js
function dcTitle(c){ return (lang==='pt'?c.title_pt:c.title)||c.title||''; }
function dcText(c){ return (lang==='pt'?c.text_pt:c.text)||c.text||''; }
function dcRegion(c){ return (lang==='pt'?(c.region_pt||c.region):c.region)||''; }
function dcTag(c){ return (lang==='pt'?(c.tag_pt||c.tag):c.tag)||''; }
function dcFacts(c){
  var f=lang==='pt'?(c.facts_pt||c.facts):(c.facts||c.facts_pt);
  return Array.isArray(f)?f:[];
}


// ── ERA TAG HELPER ───────────────────────────────────────────────────────
function eraTagLabel(ef){
  const keys=normalizeEraFilter(ef);
  if(!keys.length||keys.length===ERA_FILTER_KEYS.length)return t('era_all');
  return ERA_FILTER_KEYS.filter(k=>keys.includes(k)).map(k=>t('era_'+k)).join(' · ');
}
// history badge for mode
// Play mode of a saved history entry. Entries from before playMode existed
// only carry the livesMode boolean.
function entryPlayMode(entry){
  if(entry&&(entry.playMode==='lives'||entry.playMode==='review'||entry.playMode==='free'))return entry.playMode;
  return (entry&&entry.livesMode===false)?'free':'lives';
}
function modeBadgeLabel(mode,pm){
  const lives=(pm==='free')?(' · '+t('free_lbl')):(pm==='review'?(' · '+t('lo_review')):'');
  if(mode==='empires')return t('empires_lbl')+lives;
  if(mode==='abrahamic')return t('biblical_lbl')+lives;
  if(mode==='roman')return t('mc_roman_title')+lives;
  if(mode==='eastern')return t('mc_eastern_title')+lives;
  if(mode==='characters')return t('characters_lbl')+lives;
  return t('classic_lbl')+lives;
}
