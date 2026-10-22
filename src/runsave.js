// ── runsave.js ───────────────────────────────────────────────────────────
// Saves the run in progress to localStorage (chronos_run) and reads it back
// when the app reopens, so minimising, closing or reloading never loses it.
// Device only: it knows nothing about the cloud. Design and the reasons
// behind each rule: documentation/RUN_SAVE.md. Applying a loaded run to the
// game is resumeSavedRun (game.js).
// Depends on: state.js (deck, timeline, currentCard, cardCluesUsed, score,
//             streak, lives, hints, skip, gameMode, playMode, eraFilter,
//             gameActive), cards.js (CARDS, INTERVALS), progression.js
//             (RECORD_MODES), game.js (runFlags, PLAY_MODE_RULES, daily run
//             flags, _runStartedDay, normalizeEraFilter, cardYear, _dayStamp)
// ─────────────────────────────────────────────────────────────────────────

var RUN_SAVE_KEY = 'chronos_run';
var RUN_SAVE_VERSION = 1;
var RUN_SAVE_MAX_CHARS = 64 * 1024;   // a full deck as names is ~10 KB
var RUN_SAVE_NAME_MAX = 100;          // longest card name is 38 chars

/* runFlags saved with the run, each with the value it loads as when missing
   or invalid. dailyFinished is left out: endGame sets it. A new run flag that
   changes the end result must be listed here (PERSISTENCE.md, checklist 5).
   A null default marks a card name (loaded only if the card still exists). */
var RUN_SAVE_FLAGS = { aidsUsed: false, minGap: Infinity, maxMissDelta: 0, lastLifeHits: 0, maxStreak: 0, lastMiss: null };

// Infinity isn't JSON: unlimited hints/skips and an unset minGap save as null
function _runNum(n) { return isFinite(n) ? n : null; }

// Writes the running game. A run with no card placed isn't saved: there is
// nothing to lose yet, and a daily attempt is only burned by the first card.
function saveRun() {
  if (!gameActive || !timeline.length) return;
  var flags = {};
  Object.keys(RUN_SAVE_FLAGS).forEach(function(k) {
    var def = RUN_SAVE_FLAGS[k];
    flags[k] = def === null ? (typeof runFlags[k] === 'string' ? runFlags[k] : null)
      : typeof def === 'number' ? _runNum(runFlags[k]) : !!runFlags[k];
  });
  var data = {
    v: RUN_SAVE_VERSION,
    savedAt: new Date().toISOString(),
    startedDay: _runStartedDay || _dayStamp(new Date()),
    mode: gameMode, playMode: playMode, eraFilter: normalizeEraFilter(eraFilter),
    deck: deck.map(function(c) { return c.name; }),
    timeline: timeline.map(function(c) { return c.name; }),
    current: currentCard ? currentCard.name : null,
    clues: cardCluesUsed,
    score: score, streak: streak, lives: lives,
    hints: _runNum(hints), skip: _runNum(skip),
    flags: flags,
    daily: _isDailyChallenge && _dailyRunDate
      ? { date: _dayStamp(_dailyRunDate), attempt: _dailyAttempt, recover: !!_isRecoverRun }
      : null
  };
  try { localStorage.setItem(RUN_SAVE_KEY, JSON.stringify(data)); } catch(e) {}
}

function clearRun() {
  try { localStorage.removeItem(RUN_SAVE_KEY); } catch(e) {}
}

/* The saved run, validated, with card names resolved to card objects and the
   daily date as a Date — or null. An invalid save is removed, so a broken one
   can't fail again on every boot. */
function loadRun() {
  var raw = null;
  try { raw = localStorage.getItem(RUN_SAVE_KEY); } catch(e) {}
  if (!raw) return null;
  var run = raw.length <= RUN_SAVE_MAX_CHARS ? _parseRun(raw) : null;
  if (!run) clearRun();
  return run;
}

function _runInt(n, min, max) { return typeof n === 'number' && Math.floor(n) === n && n >= min && n <= max; }
function _runIsDay(s) { return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s); }
function _runDay(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }

function _parseRun(raw) {
  var s;
  try { s = JSON.parse(raw); } catch(e) { return null; }
  if (!s || typeof s !== 'object' || s.v !== RUN_SAVE_VERSION) return null;

  var all = CARDS.concat(INTERVALS);
  var modes = RECORD_MODES.map(function(m) { return m.id; }).filter(function(id) { return id !== 'daily'; });
  if (modes.indexOf(s.mode) < 0) return null;
  if (!Object.prototype.hasOwnProperty.call(PLAY_MODE_RULES, s.playMode)) return null;
  if (!_runIsDay(s.startedDay) || !Array.isArray(s.eraFilter)) return null;
  // Loose cap: an update may remove cards, and a full Classic save must still
  // load (its unknown names are dropped below)
  if (!Array.isArray(s.deck) || !Array.isArray(s.timeline) || s.deck.length + s.timeline.length > 2 * all.length) return null;
  if (!_runInt(s.clues, 0, 3) || !_runInt(s.score, 0, 1e9) || !_runInt(s.streak, 0, all.length) || !_runInt(s.lives, 0, 99)) return null;
  if (!(s.hints === null || _runInt(s.hints, 0, 1e4)) || !(s.skip === null || _runInt(s.skip, 0, 1e4))) return null;

  var daily = null;
  if (s.daily != null) {
    var d = s.daily;
    if (typeof d !== 'object' || !_runIsDay(d.date) || !_runInt(d.attempt, 1, 1e4) || typeof d.recover !== 'boolean') return null;
    daily = { date: _runDay(d.date), attempt: d.attempt, recover: d.recover };
  }

  // Cards by name. Names an update renamed or removed, and repeats, are dropped
  var byName = {}, seen = {};
  all.forEach(function(c) { byName[c.name] = c; });
  var resolve = function(name) {
    if (typeof name !== 'string' || name.length > RUN_SAVE_NAME_MAX) return null;
    if (!Object.prototype.hasOwnProperty.call(byName, name) || seen[name]) return null;
    seen[name] = true;
    return byName[name];
  };
  var timeline = s.timeline.map(resolve).filter(Boolean);
  if (!timeline.length) return null;
  timeline.sort(function(a, b) { return cardYear(a) - cardYear(b); });   // in case an update changed a date
  var current = s.current == null ? null : resolve(s.current);
  var deck = s.deck.map(resolve).filter(Boolean);

  var flags = {}, f = (s.flags && typeof s.flags === 'object') ? s.flags : {};
  Object.keys(RUN_SAVE_FLAGS).forEach(function(k) {
    var def = RUN_SAVE_FLAGS[k], v = f[k];
    if (def === null) flags[k] = (typeof v === 'string' && v.length <= RUN_SAVE_NAME_MAX && Object.prototype.hasOwnProperty.call(byName, v)) ? v : null;
    else if (typeof def === 'boolean') flags[k] = typeof v === 'boolean' ? v : def;
    else flags[k] = (typeof v === 'number' && isFinite(v) && v >= 0) ? v : def;
  });

  return {
    startedDay: s.startedDay, mode: s.mode, playMode: s.playMode,
    eraFilter: normalizeEraFilter(s.eraFilter),
    deck: deck, timeline: timeline, current: current, clues: current ? s.clues : 0,
    score: s.score, streak: s.streak, lives: s.lives, hints: s.hints, skip: s.skip,
    flags: flags, daily: daily
  };
}
