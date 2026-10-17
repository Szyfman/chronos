// state.js
var lang = 'en'; // move this from i18n.js if you already put it there

var gameMode = 'classic';
var livesMode = true;
var eraFilter = [];     // era filter of the running game ([] = all eras)
var eraSelection = [];  // eras toggled on the main menu; copied into eraFilter by startGame()
var empiresShownTutorial = false;

var deck = [];
var timeline = [];
var currentCard = null;

var score = 0;
var streak = 0;
var lives = 3;
var hints = 3;
var skip = 1;
var gameActive = false;
var cardCluesUsed = 0;

var isDragging = false;
var currentDropZone = null;

var reviewMode = false;
var _pendingDraw = false;

var gameHistory = [];
try { gameHistory = JSON.parse(localStorage.getItem('chronos_history') || '[]'); } catch(e) {}

var discoveredCards = new Set();
try {
  var _dc = JSON.parse(localStorage.getItem('chronos_discovered') || '[]');
  _dc.forEach(function(n){ discoveredCards.add(n); });
} catch(e) {}

// Player profile (see progression.js)
var playerName = '';
var playerXp = 0;
var playerCustom = {};
try {
  playerName = localStorage.getItem('chronos_player_name') || '';
  playerXp = parseInt(localStorage.getItem('chronos_xp'), 10) || 0;
  playerCustom = JSON.parse(localStorage.getItem('chronos_custom') || '{}') || {};
} catch(e) {}

function saveDiscovered() {
  try { localStorage.setItem('chronos_discovered', JSON.stringify([...discoveredCards])); } catch(e) {}
}

// Per-card placement results, keyed by the card's English name (same key as
// discoveredCards): { ok, miss, last } — last is the 'YYYY-MM-DD' of the most
// recent attempt. Recorded by recordCardResult (game.js); feeds era mastery
// and the Review deck. Starts empty: past runs are not back-filled.
var cardStats = {};
try {
  var _cs = JSON.parse(localStorage.getItem('chronos_card_stats') || '{}');
  if (_cs && typeof _cs === 'object' && !Array.isArray(_cs)) cardStats = _cs;
} catch(e) {}

function saveCardStats() {
  try { localStorage.setItem('chronos_card_stats', JSON.stringify(cardStats)); } catch(e) {}
}
