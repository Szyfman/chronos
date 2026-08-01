// ── game.js ──────────────────────────────────────────────────────────────
// Core game logic: pool building, game lifecycle, placement, scoring,
// daily challenge, streak calculation, and trophy checking.
// Depends on: state.js, i18n.js (t, cName, cardYear, etc.), cards.js,
//             trophies.js (TROPHY_DEFS), ui.js (render functions)
// ─────────────────────────────────────────────────────────────────────────
// Which game eras map to each filter
const ERA_FILTER_MAP={
  all:null, // null = no filter = all cards
  ancient:['Ancient','Classical'],
  medieval:['Medieval','Renaissance'],
  modern:['Early Modern','Modern','Contemporary']
};

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

// ── DAILY CHALLENGE STATE ─────────────────────────────────────────────────
var DAILY_MAX_ATTEMPTS = 3;   // tries allowed per calendar day
var DAILY_DECK_SIZE    = 18;  // cards to place to win the daily

var _isDailyChallenge = false;
var _dailyAttempt     = 0;     // 1-based index of the attempt being played
var _dailyRunDate     = null;  // date pinned at launch — immune to midnight rollover
var _dailyCommitted   = false; // has this attempt been written to localStorage yet?
var _lastDailyResult  = null;  // {won, attempts, attemptsLeft, date} for the gameover screen

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

// Launches (or relaunches) today's daily. Shared by the Streak-tab button and
// the gameover retry button — the only difference is which attempt it is.
function _launchDaily(){
  var today = new Date(); today.setHours(0,0,0,0);
  var st = _dailyStatus(today);
  if(st.locked) return;   // already won today, or out of attempts
  _dailyRunDate    = today;
  _dailyAttempt    = st.attemptsUsed + 1;
  _dailyCommitted  = false;
  _lastDailyResult = null;
  gameMode = 'classic';
  eraFilter = 'all';
  livesMode = true;
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
function startDailyChallenge(){ _launchDaily(); }
function retryDailyChallenge(){ _launchDaily(); }

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
// so killing the app mid-run can't hand out unlimited tries — and it's what
// makes the day count towards the streak.
function _commitDailyAttempt(){
  if(!_dailyRunDate) return;
  var rec = _getDailyRecord(_dailyRunDate) || {v:2,attempts:0,won:false,score:0,placed:0,timeline:[]};
  rec.v = 2;
  rec.attempts = Math.max(rec.attempts, _dailyAttempt);
  _writeDailyRecord(_dailyRunDate, rec);
  _dailyCommitted = true;
}

// Called from endGame: merges this attempt into the day's record, keeping only
// the best run, and remembers the outcome for the gameover screen.
function _saveDailyResult(won){
  var date = _dailyRunDate || new Date();
  var rec = _getDailyRecord(date) || {v:2,attempts:0,won:false,score:0,placed:0,timeline:[]};
  rec.v = 2;
  rec.attempts = Math.max(rec.attempts, _dailyAttempt);
  var better = won || timeline.length > rec.placed
            || (timeline.length === rec.placed && score > rec.score);
  if(better){
    rec.score = score;
    rec.placed = timeline.length;
    rec.timeline = _dailyTimelineSnapshot();
  }
  rec.won = rec.won || !!won;
  _writeDailyRecord(date, rec);
  _lastDailyResult = {
    won: rec.won,
    attempts: rec.attempts,
    attemptsLeft: rec.won ? 0 : Math.max(0, DAILY_MAX_ATTEMPTS - rec.attempts),
    date: date
  };
  _isDailyChallenge = false;
  _dailyCommitted = false;
}


var earnedTrophies = {};
try { var _et=localStorage.getItem('chronos_trophies'); if(_et) earnedTrophies=JSON.parse(_et); } catch(e) {}

function saveTrophies(){
  try { localStorage.setItem('chronos_trophies', JSON.stringify(earnedTrophies)); } catch(e) {}
}

function checkTrophies(){
  var placed = timeline.map(function(c){ return c.name; });
  var intervals_placed = timeline.filter(function(c){ return c.startYear !== undefined; }).length;
  var newlyEarned = [];

  TROPHY_DEFS.forEach(function(def){
    if(earnedTrophies[def.id]) return;
    var earned = false;
    if(def.special === 'compendium_complete'){
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
    } else if(def.special === 'score_500'){
      earned = score >= 500;
    } else if(def.special === 'streak_50'){
      earned = streak >= 50;
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
    _showTrophyToastQueue(newlyEarned, 0);
  }
}

// Also check streak trophy mid-game when streak hits 10
function checkStreakTrophy(){
  if(streak >= 50 && !earnedTrophies['on_fire']){
    earnedTrophies['on_fire'] = new Date().toISOString();
    saveTrophies();
    _showTrophyToastQueue([TROPHY_DEFS.find(function(d){ return d.id==='on_fire'; })], 0);
  }
}


// ── BUILD POOL ────────────────────────────────────────────────────────────
function buildPool(mode, eraFilter){
  let pool;
  if(mode==='empires'){
    const allowedEras=ERA_FILTER_MAP[eraFilter];
    pool=allowedEras?INTERVALS.filter(c=>allowedEras.includes(c.era)):INTERVALS;
    if(pool.length<4) pool=[...INTERVALS];
  } else if(mode==='abrahamic'){
    const biblIntervals=INTERVALS.filter(c=>Array.isArray(c.tags)&&c.tags.includes('abrahamic'));
    pool=[...CARDS.filter(c=>Array.isArray(c.tags)&&c.tags.includes('abrahamic')),...biblIntervals];
  } else if(mode==='roman'){
    pool=[...CARDS,...INTERVALS].filter(c=>Array.isArray(c.tags)&&c.tags.includes('roman'));
    if(pool.length<4) pool=[...CARDS.filter(c=>c.era==='Classical')];
  } else if(mode==='eastern'){
    pool=[...CARDS,...INTERVALS].filter(c=>Array.isArray(c.tags)&&c.tags.includes('eastern'));
    if(pool.length<4) pool=[...CARDS,...INTERVALS].filter(c=>Array.isArray(c.tags)&&c.tags.includes('eastern'));
  } else if(mode==='characters'){
    const allowedEras=ERA_FILTER_MAP[eraFilter];
    const charPool=CARDS.filter(c=>c.cat==='People'||c.cat_pt==='Pessoas');
    pool=allowedEras?charPool.filter(c=>allowedEras.includes(c.era)):charPool;
    if(pool.length<4) pool=[...charPool];
  } else {
    // Classic: mixed CARDS + INTERVALS, apply era filter
    const allowedEras=ERA_FILTER_MAP[eraFilter];
    const allCards=[...CARDS,...INTERVALS];
    pool=allowedEras?allCards.filter(c=>allowedEras.includes(c.era)):allCards;
    if(pool.length<4) pool=[...allCards];
  }
  return pool;
}

function initGame(){
  _pendingGameRecord = null;
  _voluntaryEnd = false;
  currentCard = null;
  reviewMode = false;

  // ── FULL DOM RESET — wipe every trace of the previous run ────────────
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
  // ─────────────────────────────────────────────────────────────────────

  deck=shuffle([...buildPool(gameMode,eraFilter)]);timeline=[];score=0;streak=0;lives=3;hints=3;skip=1;cardCluesUsed=0;gameActive=true;_pendingDraw=false;
  // Daily challenge overrides
  if(_isDailyChallenge){
    // Two-stage seeding: WHICH 18 cards comes from the plain day seed, so every
    // player faces the same set. Retries reshuffle only the ORDER, so a second
    // attempt can't be won from memory. Attempt 1 is byte-identical to before.
    var _seed=_dailySeedFor(_dailyRunDate||new Date());
    var _base=_seededShuffle([...CARDS,...INTERVALS],_seededRNG(_seed)).slice(0,DAILY_DECK_SIZE);
    deck=_dailyAttempt>1
      ?_seededShuffle(_base,_seededRNG(_seed+_dailyAttempt*104729))
      :_base;
    hints=0; skip=0;
    var _hcEl=document.getElementById('hint-count');
    if(_hcEl) _hcEl.textContent='0';
    for(var _dhi=0;_dhi<3;_dhi++){
      var _dhd=document.getElementById('hd'+_dhi);
      if(_dhd) _dhd.classList.add('used');
    }
    // Hide hint and skip buttons entirely
    var _hBtn=document.getElementById('hint-btn');
    var _sBtn=document.getElementById('skip-btn');
    if(_hBtn) _hBtn.style.display='none';
    if(_sBtn) _sBtn.style.display='none';
  }
    // Hide history access during play
  document.getElementById('hist-btn').style.visibility='hidden';
  document.getElementById('hdr-mode').textContent=_isDailyChallenge?t('daily_title'):t(MODE_LABEL[gameMode]||'subtitle');
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
  const clueEl=document.getElementById('hc-clue');
  clueEl.textContent='💡 '+pool[cardCluesUsed];
  clueEl.classList.add('show');
  cardCluesUsed++;
  renderSideBtns();
}
function useSkip(){
  if(!currentCard||!gameActive||skip<=0)return;
  skip--;
  // Put current card back at a random position in remaining deck (not at top)
  const card=currentCard;currentCard=null;
  const insertAt=Math.max(0,Math.floor(Math.random()*(deck.length-1)));
  deck.splice(insertAt,0,card);
  renderSideBtns();
  drawCard();
}

// ── GAME LOGIC ────────────────────────────────────────────────────────────
function attemptPlacement(idx){
  if(!currentCard||!gameActive)return;
  // Burn the daily attempt on the very first placement, not at endGame
  if(_isDailyChallenge&&!_dailyCommitted)_commitDailyAttempt();
  const card=currentCard;
  const cy=cardYear(card);
  const prev=timeline[idx-1],next=timeline[idx];
  const valid=(!prev||cy>=cardYear(prev))&&(!next||cy<=cardYear(next));
  if(valid){
    // Interval scoring: bonus for duration (longer empires = harder to place precisely)
    SFX.play('correct');
    const basePoints=isInterval(card)?Math.min(30,10+Math.floor((card.endYear-card.startYear)/100)):10;
    timeline.splice(idx,0,card);score+=basePoints+streak*2;streak++;currentCard=null;
    if(streak>0&&streak%20===0){hints++;renderSideBtns();showStreakToast();}
    checkStreakTrophy();
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
    if(livesMode){
      lives--;renderLives();
      if(lives<=0)setTimeout(()=>endGame(false),700);
    }
  }
}

// ── GAME OVER ─────────────────────────────────────────────────────────────
function endGame(won){
  gameActive=false;
  // Zero cards placed: skip gameover, return to intro.
  // No attempt was committed either, so the daily stays fully available.
  if(timeline.length===0){
    document.getElementById('hist-btn').style.visibility='';
    _pendingGameRecord=null; _voluntaryEnd=false;
    _isDailyChallenge=false; _dailyCommitted=false; _lastDailyResult=null;
    showIntro(); return;
  }
  // Record the daily attempt (win or loss) — also clears _isDailyChallenge
  if(_isDailyChallenge){ _saveDailyResult(won); }
  _pendingGameRecord = buildGameRecord(won);
  _eagerSaveDiscovered();
  checkTrophies();
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
  var _saveBtn=document.getElementById('go-save-btn');
  if(_saveBtn){_saveBtn.textContent=lang==='pt'?'💾 Salvar Timeline':'💾 Save Timeline';_saveBtn.disabled=false;_saveBtn.style.opacity='';}
  document.getElementById('go-again-btn').textContent=t('play_again');
  _renderDailyGameover();
  // stopMusic(true);
  document.getElementById('gameover').classList.add('show');
}

// ── DAILY GAMEOVER CONTROLS ───────────────────────────────────────────────
function _hideDailyGameoverBtns(){
  var r=document.getElementById('go-retry-btn'); if(r) r.style.display='none';
  var c=document.getElementById('go-dcard-btn'); if(c) c.style.display='none';
}
function _dailyAttemptLabel(n){
  return t('daily_attempt_of').replace('{n}',n).replace('{max}',DAILY_MAX_ATTEMPTS);
}
// Decorates the gameover screen for a daily run: retry, reward card, or nothing
function _renderDailyGameover(){
  _hideDailyGameoverBtns();
  if(!_lastDailyResult) return;
  var res=_lastDailyResult;
  var retry=document.getElementById('go-retry-btn');
  var dcard=document.getElementById('go-dcard-btn');
  var again=document.getElementById('go-again-btn');
  if(again) again.textContent=t('daily_exit');
  if(res.won){
    if(dcard){
      dcard.style.display='';
      dcard.textContent=t('daily_view_card');
      dcard.onclick=function(){
        openDailyCard(res.date.getFullYear(),res.date.getMonth(),res.date.getDate());
      };
    }
  } else if(res.attemptsLeft>0){
    var _sub=document.getElementById('go-sub');
    if(_sub) _sub.textContent=t('daily_try_again_sub');
    if(retry){
      retry.style.display='';
      retry.textContent=t('daily_retry')+' · '+_dailyAttemptLabel(res.attempts+1);
      retry.onclick=function(){ retryDailyChallenge(); };
    }
  } else {
    var _sub2=document.getElementById('go-sub');
    if(_sub2) _sub2.textContent=t('daily_out_of_tries');
  }
}

// ── HISTORY ───────────────────────────────────────────────────────────────
function buildGameRecord(won) {
  return {
    date: new Date().toISOString(),
    mode: gameMode, livesMode: livesMode, eraFilter: eraFilter,
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
function _dailyKey(date){
  var y=date.getFullYear();
  var m=String(date.getMonth()+1).padStart(2,'0');
  var d=String(date.getDate()).padStart(2,'0');
  return 'chronos_daily_'+y+'-'+m+'-'+d;
}
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
function _writeDailyRecord(date, rec){
  try{
    localStorage.setItem(_dailyKey(date), JSON.stringify(rec));
    return true;
  }catch(e){
    // Only a full quota justifies the fallback. Any other failure (storage
    // disabled, private-mode restrictions, a transient error) would otherwise
    // destroy every stored timeline for nothing.
    if(_isQuotaError(e) && _pruneDailyTimelines(0)){
      try{
        localStorage.setItem(_dailyKey(date), JSON.stringify(rec));
        return true;
      }catch(e2){}
    }
    try{ console.warn('chronos: daily record not saved — storage full'); }catch(e3){}
    return false;
  }
}
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
      if(!k||k.lastIndexOf(_DAILY_PREFIX,0)!==0) continue;
      var ds=k.slice(_DAILY_PREFIX.length);
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
  if(!ef||ef==='all')return t('era_all');
  if(ef==='ancient')return t('era_ancient');
  if(ef==='medieval')return t('era_medieval');
  if(ef==='modern')return t('era_modern');
  return t('era_all');
}
// history badge for mode
function modeBadgeLabel(mode,lm){
  const lives=(lm===false)?(' · '+t('free_lbl')):'';
  if(mode==='empires')return t('empires_lbl')+lives;
  if(mode==='abrahamic')return t('biblical_lbl')+lives;
  if(mode==='roman')return t('mc_roman_title')+lives;
  if(mode==='eastern')return t('mc_eastern_title')+lives;
  if(mode==='characters')return t('characters_lbl')+lives;
  return t('classic_lbl')+lives;
}
