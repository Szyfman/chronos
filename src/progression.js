// ── progression.js ───────────────────────────────────────────────────────
// Player profile: name, XP → level, level titles, unlockable UI
// customizations, per-mode records and era mastery. Data + logic only;
// rendering is in ui.js.
// XP = final score of each run (awarded by endGame in game.js).
// Depends on: state.js (playerName, playerXp, playerCustom, cardStats,
//             modeRecords), cards.js (CARDS, INTERVALS),
//             game.js (earnedTrophies), trophies.js (TROPHY_DEFS)
// ─────────────────────────────────────────────────────────────────────────

const PLAYER_NAME_MAX = 20;

// Highest entry whose minLevel the player has reached is the current title.
// Provisional thresholds — the definitive list is still to come.
const PLAYER_TITLES = [
  { minLevel: 1,   name: 'Student',              name_pt: 'Aluno' },
  { minLevel: 5,   name: 'Scribe',               name_pt: 'Escriba' },
  { minLevel: 10,  name: 'Chronicler',           name_pt: 'Cronista' },
  { minLevel: 20,  name: 'Historian',            name_pt: 'Historiador' },
  { minLevel: 35,  name: "Alexandria's Guardian", name_pt: 'Guardião de Alexandria' },
  { minLevel: 50,  name: 'Time Lord',            name_pt: 'Senhor do Tempo' },
  { minLevel: 100, name: 'The Lore Keeper',      name_pt: 'The Lore Keeper' }
];

// Each category holds exactly one selected item in playerCustom[cat.id].
const CUSTOM_CATEGORIES = [
  { id: 'emblem', name: 'Emblem',        name_pt: 'Emblema' },
  { id: 'frame',  name: 'Profile Frame', name_pt: 'Moldura do Perfil' }
];

/* unlock: null            → available from the start
           { level: n }    → reach player level n
           { trophy: id }  → earn that trophy (TROPHY_DEFS id)
   Frames carry `style`, mapped to the .pf-frame-<style> CSS class. */
const CUSTOMIZATIONS = [
  { id: 'emblem_hourglass', cat: 'emblem', icon: '⏳', name: 'Hourglass', name_pt: 'Ampulheta',   unlock: null },
  { id: 'emblem_scroll',    cat: 'emblem', icon: '📜', name: 'Scroll',    name_pt: 'Pergaminho',  unlock: null },
  { id: 'emblem_owl',       cat: 'emblem', icon: '🦉', name: 'Owl',       name_pt: 'Coruja',      unlock: { level: 5 } },
  { id: 'emblem_dragon',    cat: 'emblem', icon: '🐉', name: 'Dragon',    name_pt: 'Dragão',      unlock: { level: 10 } },
  { id: 'emblem_column',    cat: 'emblem', icon: '🏛️', name: 'Column',    name_pt: 'Coluna',      unlock: { trophy: 'pax_romana' } },
  { id: 'emblem_crown',     cat: 'emblem', icon: '👑', name: 'Crown',     name_pt: 'Coroa',       unlock: { trophy: 'king_of_kings' } },
  { id: 'emblem_rocket',    cat: 'emblem', icon: '🚀', name: 'Rocket',    name_pt: 'Foguete',     unlock: { trophy: 'rocket_man' } },

  { id: 'frame_classic',  cat: 'frame', style: 'classic',  name: 'Classic',  name_pt: 'Clássica', unlock: null },
  { id: 'frame_bronze',   cat: 'frame', style: 'bronze',   name: 'Bronze',   name_pt: 'Bronze',   unlock: { level: 3 } },
  { id: 'frame_silver',   cat: 'frame', style: 'silver',   name: 'Silver',   name_pt: 'Prata',    unlock: { level: 10 } },
  { id: 'frame_imperial', cat: 'frame', style: 'imperial', name: 'Imperial', name_pt: 'Imperial', unlock: { level: 20 } },
  { id: 'frame_ember',    cat: 'frame', style: 'ember',    name: 'Ember',    name_pt: 'Brasa',    unlock: { trophy: 'on_fire' } }
];

// ── XP CURVE ──────────────────────────────────────────────────────────────
/* XP to go from level L to L+1:
     L < capLevel:  base + growth × (L−1)^exponent, rounded to the nearest `step`
     L ≥ capLevel:  flat — same cost as (capLevel−1) → capLevel, forever
   XP comes from the final score of each run, so ~400 XP ≈ one average game.
   With the values below: L2 ≈ 4 games, L10 ≈ 44 games, L50 ≈ 1,100 games,
   L100 ≈ 6,200 games; past 100, ~160 games per level.
   Tuning: `base` sets how fast the first levels feel, `growth` scales the
   whole mid/late game, `exponent` bends the curve (1 = linear, higher =
   steeper end). Changing any of them re-levels every player, since only
   total XP is stored. */
const XP_CURVE = { base: 1500, growth: 40, exponent: 1.6, capLevel: 100, step: 100 };

function xpToNextLevel(level) {
  var L = Math.min(level, XP_CURVE.capLevel - 1);
  var raw = XP_CURVE.base + XP_CURVE.growth * Math.pow(L - 1, XP_CURVE.exponent);
  return Math.round(raw / XP_CURVE.step) * XP_CURVE.step;
}

// Total XP → level, XP into that level, and XP the level costs.
// Spare XP carries over, so one big gain can climb several levels at once.
function levelInfoFor(totalXp) {
  var level = 1, xpLeft = Math.max(0, Math.floor(totalXp || 0));
  while (level < XP_CURVE.capLevel && xpLeft >= xpToNextLevel(level)) {
    xpLeft -= xpToNextLevel(level);
    level++;
  }
  // Past the cap every level costs the same, so skip the loop
  if (level === XP_CURVE.capLevel) {
    var flat = xpToNextLevel(level);
    level += Math.floor(xpLeft / flat);
    xpLeft = xpLeft % flat;
  }
  return { level: level, xp: xpLeft, xpNeeded: xpToNextLevel(level), totalXp: Math.max(0, Math.floor(totalXp || 0)) };
}

function formatXp(n) {
  return n.toLocaleString(lang === 'pt' ? 'pt-BR' : 'en-US');
}

function playerLevelInfo() {
  return levelInfoFor(playerXp);
}

/* Adds XP and persists it. Returns before/after level info plus the new
   title when a level-up crossed a title threshold (null otherwise).
   Every XP source (final score now; trophies and daily bonuses later)
   should come through here. */
function awardXp(amount) {
  var gained = Math.max(0, Math.floor(amount || 0));
  var before = playerLevelInfo();
  playerXp += gained;
  try { localStorage.setItem('chronos_xp', String(playerXp)); } catch(e) {}
  var after = playerLevelInfo();
  var oldTitle = playerTitle(before.level), newTitle = playerTitle(after.level);
  return { gained: gained, before: before, after: after, newTitle: newTitle !== oldTitle ? newTitle : null };
}

function playerTitle(level) {
  var title = PLAYER_TITLES[0];
  PLAYER_TITLES.forEach(function(t) { if (level >= t.minLevel) title = t; });
  return title;
}

function isCustomUnlocked(item) {
  if (!item.unlock) return true;
  if (item.unlock.level) return playerLevelInfo().level >= item.unlock.level;
  if (item.unlock.trophy) return !!earnedTrophies[item.unlock.trophy];
  return false;
}

// Falls back to the category's first item if the saved one is missing or
// no longer unlocked (e.g. definitions changed between versions).
function selectedCustom(catId) {
  var item = CUSTOMIZATIONS.find(function(c) { return c.id === playerCustom[catId]; });
  if (item && item.cat === catId && isCustomUnlocked(item)) return item;
  return CUSTOMIZATIONS.find(function(c) { return c.cat === catId; });
}

function selectCustomization(id) {
  var item = CUSTOMIZATIONS.find(function(c) { return c.id === id; });
  if (!item || !isCustomUnlocked(item)) return false;
  playerCustom[item.cat] = id;
  try { localStorage.setItem('chronos_custom', JSON.stringify(playerCustom)); } catch(e) {}
  return true;
}

function setPlayerName(name) {
  playerName = String(name || '').trim().slice(0, PLAYER_NAME_MAX);
  try { localStorage.setItem('chronos_player_name', playerName); } catch(e) {}
}

// ── MODE RECORDS ──────────────────────────────────────────────────────────
// Shown in this order. `label` is an i18n key. The daily challenge runs as
// classic but keeps its own record, since its 18-card deck isn't comparable.
const RECORD_MODES = [
  { id: 'classic',    icon: '📜', label: 'classic_lbl' },
  { id: 'empires',    icon: '🏛️', label: 'empires_lbl' },
  { id: 'characters', icon: '👤', label: 'characters_lbl' },
  { id: 'abrahamic',  icon: '✡️', label: 'biblical_lbl' },
  { id: 'roman',      icon: '🏛️', label: 'mc_roman_title' },
  { id: 'eastern',    icon: '☯️', label: 'mc_eastern_title' },
  { id: 'daily',      icon: '📅', label: 'daily_title' }
];

/* Called by endGame for every run with at least one card placed. Only runs
   with lives count: Free play has no stakes, so its scores aren't records.
   Returns true when the run beat an earlier record of its mode — the very
   first run of a mode sets the record but isn't announced as a new one. */
function recordModeResult(modeId, finalScore, placedCount, withLives) {
  if (!withLives || !modeId) return false;
  var r = modeRecords[modeId];
  if (!r || typeof r !== 'object') r = modeRecords[modeId] = { best: 0, bestDate: '', mostPlaced: 0, runs: 0 };
  var hadRuns = (r.runs | 0) > 0;
  r.runs = (r.runs | 0) + 1;
  r.mostPlaced = Math.max(r.mostPlaced | 0, placedCount | 0);
  var isBest = finalScore > (r.best | 0);
  if (isBest) { r.best = finalScore; r.bestDate = new Date().toISOString(); }
  saveModeRecords();
  return isBest && hadRuns;
}

// ── ERA MASTERY ───────────────────────────────────────────────────────────
// Eras in chronological order; `id` matches card.era.
const MASTERY_ERAS = [
  { id: 'Ancient',      name: 'Ancient',      name_pt: 'Antiguidade' },
  { id: 'Classical',    name: 'Classical',    name_pt: 'Antiguidade Clássica' },
  { id: 'Medieval',     name: 'Medieval',     name_pt: 'Idade Média' },
  { id: 'Renaissance',  name: 'Renaissance',  name_pt: 'Renascimento' },
  { id: 'Early Modern', name: 'Early Modern', name_pt: 'Início da Idade Moderna' },
  { id: 'Modern',       name: 'Modern',       name_pt: 'Era Moderna' },
  { id: 'Contemporary', name: 'Contemporary', name_pt: 'Contemporânea' }
];

/* Seals, lowest first. A card is "hit" once placed correctly at least once,
   and "mastered" once it has 2+ correct placements and more hits than misses.
   `share` is the fraction of the era's cards that must meet `need`. */
const MASTERY_SEALS = [
  { id: 'bronze', icon: '🥉', need: 'hit',      share: 0.25, name: 'Bronze', name_pt: 'Bronze' },
  { id: 'silver', icon: '🥈', need: 'hit',      share: 0.60, name: 'Silver', name_pt: 'Prata' },
  { id: 'gold',   icon: '🥇', need: 'mastered', share: 0.90, name: 'Gold',   name_pt: 'Ouro' }
];

function isCardHit(s)      { return !!s && (s.ok | 0) >= 1; }
function isCardMastered(s) { return !!s && (s.ok | 0) >= 2 && (s.ok | 0) > (s.miss | 0); }

/* Per-era summary from cardStats (state.js):
   { era, total, hit, mastered, seal (highest earned or null),
     next ({ seal, count, goal }, or null once gold) } */
function eraMastery() {
  var all = CARDS.concat(INTERVALS);
  return MASTERY_ERAS.map(function(era) {
    var cards = all.filter(function(c) { return c.era === era.id; });
    var hit = 0, mastered = 0;
    cards.forEach(function(c) {
      var s = cardStats[c.name];
      if (isCardHit(s)) hit++;
      if (isCardMastered(s)) mastered++;
    });
    var total = cards.length, seal = null, next = null;
    MASTERY_SEALS.forEach(function(m) {
      var count = m.need === 'mastered' ? mastered : hit;
      var goal = Math.ceil(total * m.share);
      if (total && count >= goal) seal = m;
      else if (!next) next = { seal: m, count: count, goal: goal };
    });
    return { era: era, total: total, hit: hit, mastered: mastered, seal: seal, next: next };
  });
}
