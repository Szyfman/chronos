// ── sync.js ──────────────────────────────────────────────────────────────
// Login and session with Supabase — the only file of the game that touches
// the network or knows the server exists. Design and the reasons behind each
// rule: documentation/CLOUD_SYNC_SPEC.md.
// Phase B1: Google login and logout only. Progress sync (B2) is not here yet,
// so nothing of the game's progress leaves the device.
// Logged out it makes no request at all and doesn't even load the client
// library (src/vendor/), which is loaded on demand.
// Depends on: i18n.js (t), ui.js (renderAccount, queueNotice)
// ─────────────────────────────────────────────────────────────────────────

// Public by design (the publishable key replaces the legacy anon key): the
// data is protected by row level security. The secret key never goes here.
var SYNC_URL = 'https://egyrmnrabblsskebkvuh.supabase.co';
var SYNC_KEY = 'sb_publishable_HAnGk0sed9nTULaRIEXvWg_F3mk-p4p';
var SYNC_LIB = 'src/vendor/supabase-2.117.2.js';
// Where the client library keeps the session (and, during a login, the PKCE
// code verifier under the same prefix). Device only — see PERSISTENCE.md.
var SYNC_SESSION_KEY = 'sb-egyrmnrabblsskebkvuh-auth-token';

var _syncClient = null;
var _syncLibLoading = null;
// 'out' (logged out) | 'starting' (reading the session / finishing a login) | 'in'
var syncStatus = 'out';
var syncEmail = '';

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
      });
    }
    return _syncClient;
  });
}

function _syncApplySession(session) {
  var email = session && session.user && session.user.email;
  syncStatus = email ? 'in' : 'out';
  syncEmail = email ? String(email).slice(0, 254) : '';
  if (typeof renderAccount === 'function') renderAccount();
}

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

// ── PUBLIC ────────────────────────────────────────────────────────────────
// Called once on boot by ui.js. Logged out and not coming back from a login:
// returns at once, no library, no network.
function syncBoot() {
  var q = new URLSearchParams(location.search);
  var returning = q.has('code') || q.has('error');
  if (!returning && !_syncHasStoredSession()) return;
  syncStatus = 'starting';
  syncEmail = _syncStoredEmail();
  _syncGetClient().then(function(client) {
    return client.auth.getSession();   // waits for the ?code= exchange, if any
  }).then(function(res) {
    var failed = q.has('error') || (returning && !(res && res.data && res.data.session));
    _syncCleanUrl();
    _syncApplySession(res && res.data && res.data.session);
    if (failed && typeof queueNotice === 'function') queueNotice({ text: t('acc_login_failed') });
  }).catch(function() {
    _syncCleanUrl();
    // No network or no library: keep showing the stored account, retry next boot
    syncStatus = syncEmail ? 'in' : 'out';
    if (typeof renderAccount === 'function') renderAccount();
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

/* Phase B1: logging out only forgets the session on this device. The
   progress stays — nothing has been synced yet, so clearing it would lose it.
   B2 adds "sync first, then clear this device" (CLOUD_SYNC_SPEC.md). */
function syncLogout() {
  var done = function() {
    try {
      var keys = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf(SYNC_SESSION_KEY) === 0) keys.push(k);
      }
      keys.forEach(function(k) { localStorage.removeItem(k); });
    } catch(e) {}
    _syncApplySession(null);
  };
  // scope 'local': ends only this device's session; offline it still logs out here
  _syncGetClient().then(function(client) {
    return client.auth.signOut({ scope: 'local' });
  }).then(done, done);
}

// What ui.js needs to draw the account block
function syncAccountInfo() {
  return { status: syncStatus, email: syncEmail };
}
