// ── sync.js ──────────────────────────────────────────────────────────────
// Login, session and progress sync with Supabase — the only file of the game
// that touches the network or knows the server exists. Design and the reasons
// behind each rule: documentation/CLOUD_SYNC_SPEC.md.
// localStorage stays the source of truth: this file reads the chronos_* keys,
// merges them with the other devices of the account, writes them back and
// asks the game to reload its in-memory state. It knows the data's shapes and
// ids (to validate them), never the game's rules.
// Logged out it makes no request at all and doesn't even load the client
// library (src/vendor/), which is loaded on demand.
// Depends on: i18n.js (t), state.js (gameActive, PLAYER_NAME_MAX via
//             progression.js), cards.js (CARDS, INTERVALS), trophies.js
//             (TROPHY_DEFS), progression.js (CUSTOMIZATIONS, RECORD_MODES),
//             game.js (ERA_FILTER_KEYS, DAILY_TIMELINE_RETENTION_DAYS,
//             DAILY_DECK_SIZE, _dayStamp), ui.js (renderAccount,
//             onSyncApplied, queueNotice)
// ─────────────────────────────────────────────────────────────────────────

// Public by design (the publishable key replaces the legacy anon key): the
// data is protected by row level security. The secret key never goes here.
var SYNC_URL = 'https://egyrmnrabblsskebkvuh.supabase.co';
var SYNC_KEY = 'sb_publishable_HAnGk0sed9nTULaRIEXvWg_F3mk-p4p';
var SYNC_LIB = 'src/vendor/supabase-2.117.2.js';
// Where the client library keeps the session (and, during a login, the PKCE
// code verifier under the same prefix). Device only — see PERSISTENCE.md.
var SYNC_SESSION_KEY = 'sb-egyrmnrabblsskebkvuh-auth-token';
var SYNC_META_KEY = 'chronos_sync';   // this device's sync bookkeeping (device only)
var SYNC_SCHEMA = 1;                  // shape of device_states.state written here
var SYNC_RETRY_MIN = [1, 5, 15, 60];  // minutes between retries after a failure
var SYNC_FOREGROUND_MS = 5 * 60 * 1000;   // back in the foreground after this long → sync
var SYNC_CURSOR_OVERLAP_MS = 60 * 1000;   // re-read a minute back: merges are idempotent
var SYNC_DELETED_MAX = 100;           // history deletions remembered

var _syncClient = null;
var _syncLibLoading = null;
// Session: 'out' (logged out) | 'starting' (reading the session / finishing a login) | 'in'
var syncStatus = 'out';
var syncEmail = '';
// Sync: 'idle' | 'syncing' | 'offline' (failed, will retry) | 'update' (a newer
// app wrote the cloud data) | 'other' (this device holds another account's progress)
var syncPhase = 'idle';
var _syncInFlight = null;
var _syncSoonTimer = null;
var _syncRetryTimer = null;
var _syncRetryStep = 0;
var _syncHiddenAt = 0;

// ── CLIENT ────────────────────────────────────────────────────────────────
function _syncLoadLib() {
  if (_syncLibLoading) return _syncLibLoading;
  _syncLibLoading = new Promise(function(resolve, reject) {
    if (window.supabase && window.supabase.createClient) { resolve(); return; }
    var s = document.createElement('script');
    s.src = SYNC_LIB;
    s.onload = function() { resolve(); };
    s.onerror = function() { _syncLibLoading = null; reject(new Error('sync: client library not loaded')); };
    document.head.appendChild(s);
  });
  return _syncLibLoading;
}

/* PKCE: the login comes back with a one-time ?code=, exchanged here for the
   session, so no token ever appears in the address bar. */
function _syncGetClient() {
  return _syncLoadLib().then(function() {
    if (!_syncClient) {
      _syncClient = window.supabase.createClient(SYNC_URL, SYNC_KEY, {
        auth: { flowType: 'pkce', persistSession: true, autoRefreshToken: true,
                detectSessionInUrl: true, storageKey: SYNC_SESSION_KEY }
      });
      _syncClient.auth.onAuthStateChange(function(event, session) {
        // Fires on login, logout, token refresh and a refresh that failed for good
        _syncApplySession(session);
        if (event === 'SIGNED_IN') syncSoon();
      });
    }
    return _syncClient;
  });
}

function _syncApplySession(session) {
  var email = session && session.user && session.user.email;
  syncStatus = email ? 'in' : 'out';
  syncEmail = email ? String(email).slice(0, 254) : '';
  _syncRender();
}

function _syncRender() {
  if (typeof renderAccount === 'function') renderAccount();
}
function _syncSetPhase(p) { syncPhase = p; _syncRender(); }

function _syncHasStoredSession() {
  try { return !!localStorage.getItem(SYNC_SESSION_KEY); } catch(e) { return false; }
}

// Offline (or server paused) the library can't confirm the session, but the
// account is still this device's: show it from what is stored.
function _syncStoredEmail() {
  try {
    var s = JSON.parse(localStorage.getItem(SYNC_SESSION_KEY) || 'null');
    var email = s && s.user && s.user.email;
    return typeof email === 'string' ? email.slice(0, 254) : '';
  } catch(e) { return ''; }
}

// Removes the ?code= / ?error= a login leaves in the address, so a reload
// doesn't try to use it again
function _syncCleanUrl() {
  try {
    var q = new URLSearchParams(location.search);
    ['code', 'error', 'error_code', 'error_description', 'state'].forEach(function(k) { q.delete(k); });
    var rest = q.toString();
    history.replaceState(history.state, '', location.pathname + (rest ? '?' + rest : '') + location.hash);
  } catch(e) {}
}

// ── SMALL HELPERS ─────────────────────────────────────────────────────────
// Non-negative integer, or 0
function _sN(x) { return (typeof x === 'number' && isFinite(x) && x >= 0) ? Math.floor(x) : 0; }
function _sIsDay(s) { return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s); }
function _sIsIso(s) { return typeof s === 'string' && s.length <= 40 && !isNaN(Date.parse(s)); }
function _sStr(s, max) { return typeof s === 'string' ? s.slice(0, max) : ''; }
function _sArr(a) { return Array.isArray(a) ? a : []; }
function _sObj(o) { return (o && typeof o === 'object' && !Array.isArray(o)) ? o : {}; }
function _sEach(o, fn) { o = _sObj(o); Object.keys(o).forEach(function(k) { fn(k, o[k]); }); }
function _sHas(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
// A card counter [ok, miss, amiss]. Rows and metadata written before amiss
// existed (v59 and older) hold [ok, miss]: every miss then counted in any
// mode, so amiss falls back to miss — and amiss is never below miss.
function _sCard(v) {
  v = _sArr(v);
  return [_sN(v[0]), _sN(v[1]), Math.max(_sN(v[1]), _sN(v[2]))];
}
function _sNewId() {
  var b = new Uint8Array(16);
  (window.crypto || {}).getRandomValues ? window.crypto.getRandomValues(b) : b.forEach(function(_, i) { b[i] = Math.floor(Math.random() * 256); });
  return Array.prototype.map.call(b, function(x) { return ('0' + x.toString(16)).slice(-2); }).join('');
}
// 32-bit FNV-1a: tells whether the own row changed since the last upload
function _sHash(str) {
  var h = 0x811c9dc5;
  for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16);
}

// Ids the cloud data may use — anything else is dropped on download
var _syncKnownCache = null;
function _syncKnown() {
  if (_syncKnownCache) return _syncKnownCache;
  var K = { cards: {}, trophies: {}, custom: {}, modes: {}, gameModes: {}, eras: {} };
  CARDS.concat(INTERVALS).forEach(function(c) { K.cards[c.name] = true; });
  TROPHY_DEFS.forEach(function(d) { K.trophies[d.id] = true; });
  CUSTOMIZATIONS.forEach(function(c) { K.custom[c.id] = c.cat; });
  RECORD_MODES.forEach(function(m) { K.modes[m.id] = true; if (m.id !== 'daily') K.gameModes[m.id] = true; });
  ERA_FILTER_KEYS.forEach(function(k) { K.eras[k] = true; });
  return (_syncKnownCache = K);
}

// ── LOCAL SNAPSHOT ────────────────────────────────────────────────────────
function _sRaw(k) { try { return localStorage.getItem(k); } catch(e) { return null; } }
function _sJSON(k, def) { var r = _sRaw(k); if (r == null) return def; try { return JSON.parse(r); } catch(e) { return def; } }
function _sIntKey(k) { return _sN(parseInt(_sRaw(k), 10)); }

// A daily/recovery record as the game reads it (_getDailyRecord /
// _getRecoverRecord), minus the day-rollover of the recovery budget
function _syncNormDay(raw, recover) {
  if (raw === '1') return { v: 1, attempts: 1, won: false, score: 0, placed: 0, timeline: [] };
  var r; try { r = JSON.parse(raw); } catch(e) { return null; }
  if (!r || typeof r !== 'object') return null;
  if (typeof r.placed !== 'number') r.placed = 0;
  if (typeof r.score !== 'number') r.score = 0;
  if (typeof r.won !== 'boolean') r.won = r.placed >= DAILY_DECK_SIZE;
  if (typeof r.attempts !== 'number' || r.attempts < 1) r.attempts = 1;
  if (!Array.isArray(r.timeline)) r.timeline = [];
  if (recover && (typeof r.tries !== 'number' || r.tries < r.attempts)) r.tries = r.attempts;
  return r;
}

// Every synced key of this device, parsed (PERSISTENCE.md, "Synced progress")
function _syncReadLocal() {
  var L = {
    xp: _sIntKey('chronos_xp'), runs: _sIntKey('chronos_runs_played'), bestStreak: _sIntKey('chronos_best_streak'),
    cardStats: _sObj(_sJSON('chronos_card_stats', {})), modeRecords: _sObj(_sJSON('chronos_mode_records', {})),
    trophies: _sObj(_sJSON('chronos_trophies', {})), discovered: _sArr(_sJSON('chronos_discovered', [])),
    customKnown: _sJSON('chronos_custom_known', null), custom: _sObj(_sJSON('chronos_custom', {})),
    name: _sRaw('chronos_player_name') || '', review: _sArr(_sJSON('chronos_review_history', [])),
    history: _sArr(_sJSON('chronos_history', [])).filter(function(e) { return e && typeof e === 'object'; }),
    daily: {}, recover: {}
  };
  if (!Array.isArray(L.customKnown)) L.customKnown = null;
  try {
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i) || '', m;
      if ((m = /^chronos_daily_(\d{4}-\d{2}-\d{2})$/.exec(k))) { var d = _syncNormDay(_sRaw(k), false); if (d) L.daily[m[1]] = d; }
      else if ((m = /^chronos_recover_(\d{4}-\d{2}-\d{2})$/.exec(k))) { var r = _syncNormDay(_sRaw(k), true); if (r) L.recover[m[1]] = r; }
    }
  } catch(e) {}
  return L;
}

// ── VALIDATION OF DOWNLOADED ROWS ─────────────────────────────────────────
// Cloud data is data, not code: every field is rebuilt from known types,
// ids and sizes; anything else is dropped (the entry, not the whole row).
function _syncCleanTl(c) {
  if (!c || typeof c !== 'object') return null;
  var y = (typeof c.year === 'number' && isFinite(c.year)) ? Math.max(-100000, Math.min(100000, Math.round(c.year))) : 0;
  var o = { name: _sStr(c.name, 100), year: y, span: c.span == null ? null : _sStr(c.span, 40), era: _sStr(c.era, 20) };
  if (c.cat != null) o.cat = _sStr(c.cat, 60);
  return o;
}
function _syncCleanEntry(e) {
  var K = _syncKnown();
  if (!e || typeof e !== 'object' || !_sIsIso(e.date)) return null;
  var o = {
    date: e.date, mode: K.gameModes[e.mode] ? e.mode : 'classic',
    playMode: (e.playMode === 'review' || e.playMode === 'free') ? e.playMode : 'lives',
    livesMode: e.livesMode !== false, eraFilter: _sArr(e.eraFilter).filter(function(k) { return K.eras[k]; }),
    lang: e.lang === 'pt' ? 'pt' : 'en', score: _sN(e.score), placed: _sN(e.placed), won: !!e.won,
    timeline: _sArr(e.timeline).slice(0, 300).map(_syncCleanTl).filter(Boolean)
  };
  // Optional: the card of the run's last miss (buildGameRecord), keyed by its English name
  var miss = _syncCleanTl(e.miss);
  if (miss && typeof e.miss.key === 'string' && e.miss.key) { miss.key = _sStr(e.miss.key, 100); o.miss = miss; }
  return o;
}
function _syncCleanDay(r, recover) {
  if (!r || typeof r !== 'object') return null;
  var o = { v: _sN(r.v) || 2, attempts: Math.min(1000, _sN(r.attempts)), won: !!r.won, score: _sN(r.score),
            placed: Math.min(1000, _sN(r.placed)), timeline: _sArr(r.timeline).slice(0, 60).map(_syncCleanTl).filter(Boolean) };
  if (recover) { o.day = _sIsDay(r.day) ? r.day : ''; o.tries = _sN(r.tries); }
  return o;
}
function _syncCleanState(s) {
  if (!s || typeof s !== 'object' || s.v !== SYNC_SCHEMA) return null;
  var K = _syncKnown(), c = _sObj(s.counters);
  var o = { v: SYNC_SCHEMA, counters: { xp: _sN(c.xp), runs: _sN(c.runs), modes: {}, cards: {} } };
  _sEach(c.modes, function(k, v) { if (K.modes[k]) o.counters.modes[k] = _sN(v); });
  _sEach(c.cards, function(k, v) { if (K.cards[k] && Array.isArray(v)) o.counters.cards[k] = _sCard(v); });
  o.trophies = {};
  _sEach(s.trophies, function(k, v) { if (K.trophies[k] && _sIsIso(v)) o.trophies[k] = v; });
  o.discovered = _sArr(s.discovered).filter(function(n) { return typeof n === 'string' && K.cards[n]; });
  o.customKnown = Array.isArray(s.customKnown) ? s.customKnown.filter(function(id) { return typeof id === 'string' && K.custom[id]; }) : null;
  o.bestStreak = _sN(s.bestStreak);
  o.modes = {};
  _sEach(s.modes, function(k, r) {
    if (!K.modes[k] || !r || typeof r !== 'object') return;
    var m = { best: _sN(r.best), bestDate: _sIsIso(r.bestDate) ? r.bestDate : '', mostPlaced: _sN(r.mostPlaced) };
    if (r.bestStreak != null) m.bestStreak = _sN(r.bestStreak);
    o.modes[k] = m;
  });
  o.cardLast = {};
  _sEach(s.cardLast, function(k, v) { if (K.cards[k] && _sIsDay(v)) o.cardLast[k] = v; });
  var ch = _sObj(s.choices);
  o.choices = { custom: {}, name: null, review: null };
  _sEach(ch.custom, function(cat, x) { if (x && typeof x.v === 'string' && K.custom[x.v] === cat) o.choices.custom[cat] = { v: x.v, t: _sN(x.t) }; });
  if (ch.name && typeof ch.name.v === 'string') o.choices.name = { v: ch.name.v.trim().slice(0, PLAYER_NAME_MAX), t: _sN(ch.name.t) };
  if (ch.review && Array.isArray(ch.review.v)) o.choices.review = { t: _sN(ch.review.t),
    v: ch.review.v.filter(Array.isArray).slice(0, 2).map(function(l) { return l.filter(function(n) { return typeof n === 'string' && K.cards[n]; }).slice(0, 60); }) };
  var h = _sObj(s.history);
  o.history = { entries: _sArr(h.entries).slice(0, 30).map(_syncCleanEntry).filter(Boolean),
                deleted: _sArr(h.deleted).filter(_sIsIso).slice(0, SYNC_DELETED_MAX) };
  o.daily = {}; o.recover = {};
  _sEach(s.daily, function(d, r) { if (_sIsDay(d)) { var x = _syncCleanDay(r, false); if (x) o.daily[d] = x; } });
  _sEach(s.recover, function(d, r) { if (_sIsDay(d)) { var x = _syncCleanDay(r, true); if (x) o.recover[d] = x; } });
  return o;
}

// ── MERGE ─────────────────────────────────────────────────────────────────
/* Counters ({ xp, runs, modes: { mode: runs }, cards: { name: [ok, miss, amiss] } })
   are merged by per-device contribution: each device keeps its own share
   ("own"), and the account's total is the sum of every device's latest share.
   CLOUD_SYNC_SPEC.md, "Counters". */
function _syncEmptyCounters() { return { xp: 0, runs: 0, modes: {}, cards: {} }; }
function _syncCopyCounters(c) {
  var o = _syncEmptyCounters();
  c = c || o;
  o.xp = _sN(c.xp); o.runs = _sN(c.runs);
  _sEach(c.modes, function(k, v) { o.modes[k] = _sN(v); });
  _sEach(c.cards, function(k, v) { o.cards[k] = _sCard(v); });
  return o;
}
function _syncAddCounters(t, c) {
  t.xp += _sN(c.xp); t.runs += _sN(c.runs);
  _sEach(c.modes, function(k, v) { t.modes[k] = (t.modes[k] || 0) + _sN(v); });
  _sEach(c.cards, function(k, v) {
    var a = t.cards[k] || (t.cards[k] = [0, 0, 0]), n = _sCard(v);
    a[0] += n[0]; a[1] += n[1]; a[2] += n[2];
  });
}

/* Folds what this device did since the last sync into its own row: counter
   deltas (local value − value written by the last sync), choices that changed
   (stamped now), history entries deleted (they were there last time). A
   device that never synced has no base, so all of its progress becomes its
   contribution; its choices are stamped 0 so the account's choices win. */
function _syncFold(L, meta, now) {
  var base = _syncCopyCounters(meta.base), own = _syncCopyCounters(meta.own);
  var d = function(cur, b) { return Math.max(0, _sN(cur) - _sN(b)); };
  own.xp += d(L.xp, base.xp);
  own.runs += d(L.runs, base.runs);
  _sEach(L.modeRecords, function(m, r) { if (r && typeof r === 'object') own.modes[m] = (own.modes[m] || 0) + d(r.runs, base.modes[m]); });
  _sEach(L.cardStats, function(n, s) {
    if (!s || typeof s !== 'object') return;
    var b = base.cards[n] || [0, 0, 0], o = own.cards[n] || (own.cards[n] = [0, 0, 0]);
    o[0] += d(s.ok, b[0]); o[1] += d(s.miss, b[1]);
    o[2] += d(Math.max(_sN(s.miss), _sN(s.amiss)), b[2]);   // amiss missing → miss, as _sCard
  });
  var prev = meta.choices || { custom: {} };
  // −1 = "before anything the account chose": loses to every stored choice
  // (downloaded ones are ≥ 0), so a fresh or never-synced phone takes the
  // account's name and emblem instead of overwriting them
  var pick = function(p, value) {
    if (p && JSON.stringify(p.v) === JSON.stringify(value)) return p;
    return { v: value, t: meta.choices ? now : -1 };
  };
  var choices = { custom: {}, name: pick(prev.name, L.name), review: pick(prev.review, L.review) };
  _sEach(prev.custom, function(cat, p) { choices.custom[cat] = p; });
  _sEach(L.custom, function(cat, v) { if (typeof v === 'string') choices.custom[cat] = pick(prev.custom && prev.custom[cat], v); });
  var deleted = _sArr(meta.deleted).slice(), here = {};
  L.history.forEach(function(e) { here[e.date] = true; });
  _sArr(meta.histIds).forEach(function(id) { if (!here[id] && deleted.indexOf(id) < 0) deleted.push(id); });
  return { own: own, choices: choices, deleted: deleted };
}

function _syncBetterRun(a, b) {   // same order as _saveDailyResult: more cards, then score
  if (_sN(a.placed) !== _sN(b.placed)) return _sN(a.placed) > _sN(b.placed);
  return _sN(a.score) > _sN(b.score);
}
function _syncMergeDay(a, b, recover) {
  if (!a) return b;
  if (!b) return a;
  var best = _syncBetterRun(b, a) ? b : a;
  var r = { v: Math.max(_sN(a.v), _sN(b.v)) || 2, attempts: Math.max(_sN(a.attempts), _sN(b.attempts)),
            won: !!(a.won || b.won), score: _sN(best.score), placed: _sN(best.placed), timeline: _sArr(best.timeline) };
  if (recover) {
    var later = (a.day || '') >= (b.day || '') ? a : b;
    r.day = later.day || '';
    if (a.day !== b.day) r.attempts = _sN(later.attempts);   // the budget belongs to its day
    r.tries = Math.max(_sN(a.tries), _sN(b.tries));
  }
  return r;
}
function _syncLatest(a, b) {   // choice merge: most recent change wins (tie: the first)
  if (!a) return b; if (!b) return a;
  var ta = typeof a.t === 'number' ? a.t : 0, tb = typeof b.t === 'number' ? b.t : 0;
  return tb > ta ? b : a;
}

/* Merged view of the account: this device's local data and fold, the other
   devices' rows downloaded now, and every other device's latest counters. */
function _syncMerge(L, fold, peers, peerCounters, today) {
  var total = _syncCopyCounters(fold.own);
  _sEach(peerCounters, function(dev, c) { _syncAddCounters(total, c); });
  var M = { xp: total.xp, runs: total.runs };

  M.cardStats = {};
  var last = {};
  _sEach(L.cardStats, function(n, s) { if (s && _sIsDay(s.last)) last[n] = s.last; });
  peers.forEach(function(p) { _sEach(p.cardLast, function(n, v) { if (!last[n] || v > last[n]) last[n] = v; }); });
  var cardNames = {};
  [L.cardStats, total.cards, last].forEach(function(o) { _sEach(o, function(n) { cardNames[n] = true; }); });
  Object.keys(cardNames).forEach(function(n) {
    var c = total.cards[n] || [0, 0, 0];
    M.cardStats[n] = { ok: c[0], miss: c[1], amiss: c[2], last: last[n] || '' };
  });

  M.modeRecords = {};
  var modeNames = {};
  [L.modeRecords, total.modes].forEach(function(o) { _sEach(o, function(m) { modeNames[m] = true; }); });
  peers.forEach(function(p) { _sEach(p.modes, function(m) { modeNames[m] = true; }); });
  Object.keys(modeNames).forEach(function(m) {
    var cands = [L.modeRecords[m]].concat(peers.map(function(p) { return p.modes[m]; })).filter(function(r) { return r && typeof r === 'object'; });
    var r = { best: 0, bestDate: '', mostPlaced: 0, runs: total.modes[m] || 0 }, streak = null;
    cands.forEach(function(x) {
      var b = _sN(x.best), bd = _sIsIso(x.bestDate) ? x.bestDate : '';
      if (b > r.best || (b === r.best && bd && (!r.bestDate || bd < r.bestDate))) { r.best = b; r.bestDate = bd; }
      r.mostPlaced = Math.max(r.mostPlaced, _sN(x.mostPlaced));
      if (x.bestStreak != null) streak = Math.max(streak || 0, _sN(x.bestStreak));
    });
    if (streak != null) r.bestStreak = streak;
    M.modeRecords[m] = r;
  });

  M.trophies = {};
  _sEach(L.trophies, function(k, v) { M.trophies[k] = v; });
  peers.forEach(function(p) { _sEach(p.trophies, function(k, v) { if (!M.trophies[k] || v < M.trophies[k]) M.trophies[k] = v; }); });

  var union = function(lists) {
    var seen = {}, out = [];
    lists.forEach(function(l) { _sArr(l).forEach(function(x) { if (typeof x === 'string' && !seen[x]) { seen[x] = true; out.push(x); } }); });
    return out;
  };
  M.discovered = union([L.discovered].concat(peers.map(function(p) { return p.discovered; })));
  var knownLists = [L.customKnown].concat(peers.map(function(p) { return p.customKnown; })).filter(Array.isArray);
  M.customKnown = knownLists.length ? union(knownLists) : null;
  M.bestStreak = peers.reduce(function(b, p) { return Math.max(b, p.bestStreak); }, L.bestStreak);

  M.choices = { custom: {}, name: fold.choices.name, review: fold.choices.review };
  _sEach(fold.choices.custom, function(cat, x) { M.choices.custom[cat] = x; });
  peers.forEach(function(p) {
    _sEach(p.choices.custom, function(cat, x) { M.choices.custom[cat] = _syncLatest(M.choices.custom[cat], x); });
    M.choices.name = _syncLatest(M.choices.name, p.choices.name);
    M.choices.review = _syncLatest(M.choices.review, p.choices.review);
  });
  M.custom = {};
  _sEach(M.choices.custom, function(cat, x) { M.custom[cat] = x.v; });
  M.name = M.choices.name ? M.choices.name.v : '';
  M.review = M.choices.review ? M.choices.review.v : [];

  var deleted = union([fold.deleted].concat(peers.map(function(p) { return p.history.deleted; })));
  deleted.sort(); deleted = deleted.slice(-SYNC_DELETED_MAX);
  var gone = {}; deleted.forEach(function(id) { gone[id] = true; });
  var byDate = {};
  L.history.concat.apply(L.history, peers.map(function(p) { return p.history.entries; })).forEach(function(e) {
    if (e && typeof e.date === 'string' && !gone[e.date] && !byDate[e.date]) byDate[e.date] = e;
  });
  M.history = Object.keys(byDate).sort().reverse().slice(0, 30).map(function(d) { return byDate[d]; });
  M.deleted = deleted;

  var cutoff = new Date(today); cutoff.setHours(0, 0, 0, 0);
  cutoff.setDate(cutoff.getDate() - DAILY_TIMELINE_RETENTION_DAYS);
  var cut = _dayStamp(cutoff);
  ['daily', 'recover'].forEach(function(kind) {
    var out = {};
    _sEach(L[kind], function(d, r) { out[d] = r; });
    peers.forEach(function(p) { _sEach(p[kind], function(d, r) { out[d] = _syncMergeDay(out[d], r, kind === 'recover'); }); });
    // A merge never brings back a timeline the retention sweep already dropped
    _sEach(out, function(d, r) { if (d < cut && r.timeline && r.timeline.length) { out[d] = Object.assign({}, r, { timeline: [] }); } });
    M[kind] = out;
  });
  return M;
}

// The row this device uploads: the merged view plus its own counters
function _syncRowState(M, own) {
  var modes = {}, cardLast = {};
  _sEach(M.modeRecords, function(m, r) {
    modes[m] = { best: r.best, bestDate: r.bestDate, mostPlaced: r.mostPlaced };
    if (r.bestStreak != null) modes[m].bestStreak = r.bestStreak;
  });
  _sEach(M.cardStats, function(n, s) { if (s.last) cardLast[n] = s.last; });
  return { v: SYNC_SCHEMA, counters: own, trophies: M.trophies, discovered: M.discovered, customKnown: M.customKnown,
           bestStreak: M.bestStreak, modes: modes, cardLast: cardLast, choices: M.choices,
           history: { entries: M.history, deleted: M.deleted }, daily: M.daily, recover: M.recover };
}

// Writes the merged view where it differs from what is stored; true if anything changed
function _syncWriteLocal(L, M) {
  var changed = false;
  var put = function(key, value, before) {
    if (value === before) return;
    try { localStorage.setItem(key, value); changed = true; } catch(e) {}
  };
  var js = JSON.stringify;
  put('chronos_xp', String(M.xp), String(L.xp));
  put('chronos_runs_played', String(M.runs), String(L.runs));
  put('chronos_best_streak', String(M.bestStreak), String(L.bestStreak));
  put('chronos_card_stats', js(M.cardStats), js(L.cardStats));
  put('chronos_mode_records', js(M.modeRecords), js(L.modeRecords));
  put('chronos_trophies', js(M.trophies), js(L.trophies));
  put('chronos_discovered', js(M.discovered), js(L.discovered));
  if (M.customKnown) put('chronos_custom_known', js(M.customKnown), js(L.customKnown));
  put('chronos_custom', js(M.custom), js(L.custom));
  put('chronos_player_name', M.name, L.name);
  put('chronos_review_history', js(M.review), js(L.review));
  put('chronos_history', js(M.history), js(L.history));
  _sEach(M.daily, function(d, r) { put('chronos_daily_' + d, js(r), L.daily[d] ? js(L.daily[d]) : null); });
  _sEach(M.recover, function(d, r) { put('chronos_recover_' + d, js(r), L.recover[d] ? js(L.recover[d]) : null); });
  return changed;
}

// ── METADATA (chronos_sync) ───────────────────────────────────────────────
function _syncMetaLoad() {
  var m = _sJSON(SYNC_META_KEY, null);
  return (m && typeof m === 'object' && m.v === 1 && typeof m.device === 'string') ? m : null;
}
function _syncMetaSave(m) {
  try { localStorage.setItem(SYNC_META_KEY, JSON.stringify(m)); return true; } catch(e) { return false; }
}

// ── SYNC CYCLE ────────────────────────────────────────────────────────────
function _syncFail(code) { var e = new Error('sync: ' + code); e.syncCode = code; return e; }

/* One cycle: download the other devices' rows changed since the last cycle,
   merge in one synchronous step (the game can't write in between), write
   localStorage, let the game reload, upload this device's row. */
function _syncCycle() {
  var client, session, meta;
  return _syncGetClient().then(function(c) {
    client = c;
    return c.auth.getSession();
  }).then(function(res) {
    session = res && res.data && res.data.session;
    if (!session || !session.user) throw _syncFail('nosession');
    meta = _syncMetaLoad();
    if (meta && meta.user && meta.user !== session.user.id) throw _syncFail('other');
    if (!meta) meta = { v: 1, user: session.user.id, device: _sNewId(), cursor: null, own: null, base: null,
                        peers: {}, choices: null, histIds: [], deleted: [], rowSig: '' };
    var q = client.from('device_states').select('device_id,schema_version,state,updated_at')
      .neq('device_id', meta.device);
    if (meta.cursor) q = q.gte('updated_at', meta.cursor);
    return q.order('updated_at', { ascending: true });
  }).then(function(res) {
    if (res.error) throw res.error;
    var rows = _sArr(res.data);
    if (rows.some(function(r) { return _sN(r.schema_version) > SYNC_SCHEMA; })) throw _syncFail('update');
    if (gameActive) throw _syncFail('busy');   // a run started meanwhile: endGame syncs again

    // ── synchronous from here to the upload ──
    var peers = [], maxAt = null;
    meta.peers = _sObj(meta.peers);
    rows.forEach(function(r) {
      if (typeof r.device_id !== 'string' || r.device_id.length < 16 || r.device_id.length > 64) return;
      var st = _syncCleanState(r.state);
      if (!st) return;
      peers.push(st);
      meta.peers[r.device_id] = st.counters;
      if (_sIsIso(r.updated_at) && (!maxAt || Date.parse(r.updated_at) > Date.parse(maxAt))) maxAt = r.updated_at;
    });
    var L = _syncReadLocal(), now = Date.now();
    var fold = _syncFold(L, meta, now);
    var M = _syncMerge(L, fold, peers, meta.peers, new Date(now));
    var base = { xp: M.xp, runs: M.runs, modes: {}, cards: {} };
    _sEach(M.modeRecords, function(m, r) { base.modes[m] = r.runs; });
    _sEach(M.cardStats, function(n, s) { base.cards[n] = [s.ok, s.miss, s.amiss]; });
    if (maxAt) meta.cursor = new Date(Date.parse(maxAt) - SYNC_CURSOR_OVERLAP_MS).toISOString();
    meta.own = fold.own; meta.base = base; meta.choices = M.choices; meta.deleted = M.deleted;
    meta.histIds = M.history.map(function(e) { return e.date; });
    meta.lastSync = new Date(now).toISOString();
    // Metadata first: if a later write fails, the next cycle can't count a delta twice
    _syncMetaSave(meta);
    if (_syncWriteLocal(L, M) && typeof onSyncApplied === 'function') onSyncApplied();

    var state = _syncRowState(M, fold.own), sig = _sHash(JSON.stringify(state));
    if (sig === meta.rowSig) return null;   // nothing new to upload
    return client.from('device_states')
      .upsert({ user_id: session.user.id, device_id: meta.device, schema_version: SYNC_SCHEMA, state: state },
              { onConflict: 'user_id,device_id' })
      .then(function(up) {
        if (up && up.error) throw up.error;
        meta.rowSig = sig;
        _syncMetaSave(meta);
        return null;
      });
  });
}

function _syncScheduleRetry() {
  clearTimeout(_syncRetryTimer);
  var min = SYNC_RETRY_MIN[Math.min(_syncRetryStep, SYNC_RETRY_MIN.length - 1)];
  _syncRetryStep++;
  _syncRetryTimer = setTimeout(syncNow, min * 60 * 1000);
}

// ── PUBLIC ────────────────────────────────────────────────────────────────
// Runs a cycle now. Resolves true on success. Never during a run, never
// twice at once (a second call joins the one in flight; other tabs wait on a lock).
function syncNow() {
  if (_syncInFlight) return _syncInFlight;
  if (syncStatus !== 'in' || syncPhase === 'other' || syncPhase === 'update') return Promise.resolve(false);
  if (gameActive) return Promise.resolve(false);   // endGame calls syncSoon
  if (navigator.onLine === false) { _syncSetPhase('offline'); _syncScheduleRetry(); return Promise.resolve(false); }
  _syncSetPhase('syncing');
  var run = function() { return _syncCycle(); };
  var p = (navigator.locks && navigator.locks.request) ? navigator.locks.request('chronos-sync', run) : run();
  _syncInFlight = Promise.resolve(p).then(function() {
    _syncRetryStep = 0;
    clearTimeout(_syncRetryTimer);
    _syncInFlight = null;
    _syncSetPhase('idle');
    return true;
  }, function(err) {
    _syncInFlight = null;
    var code = err && err.syncCode;
    if (code === 'other' || code === 'update') _syncSetPhase(code);
    else if (code === 'busy') _syncSetPhase('idle');
    else if (code === 'nosession') { _syncApplySession(null); _syncSetPhase('idle'); }
    else { _syncSetPhase('offline'); _syncScheduleRetry(); }
    return false;
  });
  return _syncInFlight;
}

// Asks for a cycle shortly (calls close together become one). Safe to call
// from anywhere, logged out included (it then does nothing).
function syncSoon() {
  if (syncStatus !== 'in') return;
  clearTimeout(_syncSoonTimer);
  _syncSoonTimer = setTimeout(syncNow, 1500);
}

// Called once on boot by ui.js. Logged out and not coming back from a login:
// returns at once, no library, no network.
function syncBoot() {
  window.addEventListener('online', syncSoon);
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) { _syncHiddenAt = Date.now(); return; }
    if (_syncHiddenAt && Date.now() - _syncHiddenAt >= SYNC_FOREGROUND_MS) syncSoon();
  });
  var q = new URLSearchParams(location.search);
  var returning = q.has('code') || q.has('error');
  if (!returning && !_syncHasStoredSession()) return;
  syncStatus = 'starting';
  syncEmail = _syncStoredEmail();
  _syncGetClient().then(function(client) {
    return client.auth.getSession();   // waits for the ?code= exchange, if any
  }).then(function(res) {
    var session = res && res.data && res.data.session;
    var failed = q.has('error') || (returning && !session);
    _syncCleanUrl();
    _syncApplySession(session);
    if (failed && typeof queueNotice === 'function') queueNotice({ text: t('acc_login_failed') });
    if (session) syncSoon();
  }).catch(function() {
    _syncCleanUrl();
    // No network or no library: keep showing the stored account, retry later
    syncStatus = syncEmail ? 'in' : 'out';
    if (syncStatus === 'in') _syncSetPhase('offline'); else _syncRender();
    if (syncStatus === 'in') _syncScheduleRetry();
  });
}

// Leaves the page for Google's login; it comes back to this same address.
function syncLogin() {
  if (navigator.onLine === false) { queueNotice({ text: t('acc_offline') }); return; }
  _syncGetClient().then(function(client) {
    return client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: location.origin + location.pathname }
    });
  }).then(function(res) {
    if (res && res.error) throw res.error;
  }).catch(function() {
    queueNotice({ text: t('acc_login_failed') });
  });
}

// Synced keys removed from this device at logout (PERSISTENCE.md, "Synced
// progress"); device preferences stay
var SYNC_WIPE_KEYS = ['chronos_xp', 'chronos_runs_played', 'chronos_card_stats', 'chronos_mode_records',
  'chronos_trophies', 'chronos_discovered', 'chronos_custom_known', 'chronos_best_streak', 'chronos_custom',
  'chronos_player_name', 'chronos_review_history', 'chronos_history', SYNC_META_KEY];
var SYNC_WIPE_PREFIXES = ['chronos_daily_', 'chronos_recover_', SYNC_SESSION_KEY];

function _syncWipeDevice() {
  try {
    var keys = SYNC_WIPE_KEYS.slice();
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i) || '';
      if (SYNC_WIPE_PREFIXES.some(function(p) { return k.indexOf(p) === 0; })) keys.push(k);
    }
    keys.forEach(function(k) { localStorage.removeItem(k); });
  } catch(e) {}
}

/* Logout: sync first, then clear this device's progress (it stays in the
   cloud and comes back on the next login) and reload into a fresh profile.
   Resolves { ok:false } when the sync failed — ui.js then asks whether to log
   out anyway, losing what wasn't synced (force = true). */
function syncLogout(force) {
  var ready = force ? Promise.resolve(true) : syncNow();
  return ready.then(function(ok) {
    if (!ok) return { ok: false };
    var finish = function() { _syncWipeDevice(); location.reload(); return { ok: true }; };
    if (!_syncClient && !_syncHasStoredSession()) return finish();
    return _syncGetClient().then(function(client) {
      return client.auth.signOut({ scope: 'local' });   // ends only this device's session
    }).then(finish, finish);
  });
}

// What ui.js needs to draw the account block
function syncAccountInfo() {
  var meta = syncStatus === 'in' ? _syncMetaLoad() : null;
  return { status: syncStatus, email: syncEmail, phase: syncPhase, lastSync: meta && meta.lastSync || '' };
}
