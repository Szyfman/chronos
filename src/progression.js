// ── progression.js ───────────────────────────────────────────────────────
// Player profile: name, XP → level, level titles and unlockable UI
// customizations. Data + unlock/selection logic only; rendering is in ui.js.
// XP is not awarded by gameplay yet — playerXp stays 0 until game.js does.
// Depends on: state.js (playerName, playerXp, playerCustom),
//             game.js (earnedTrophies), trophies.js (TROPHY_DEFS)
// ─────────────────────────────────────────────────────────────────────────

const PLAYER_NAME_MAX = 20;

// Highest entry whose minLevel the player has reached is the current title.
const PLAYER_TITLES = [
  { minLevel: 1,  name: "Scribe's Apprentice", name_pt: 'Aprendiz de Escriba' },
  { minLevel: 5,  name: 'Scribe',              name_pt: 'Escriba' },
  { minLevel: 10, name: 'Chronicler',          name_pt: 'Cronista' },
  { minLevel: 20, name: 'Historian',           name_pt: 'Historiador' },
  { minLevel: 35, name: 'Keeper of Ages',      name_pt: 'Guardião das Eras' },
  { minLevel: 50, name: 'Master of Chronos',   name_pt: 'Mestre de Chronos' }
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

// Provisional curve until the XP system is designed: going from level L to
// L+1 costs 100×L XP (L1→2: 100, L2→3: 200, ...).
function xpToNextLevel(level) {
  return 100 * level;
}

function playerLevelInfo() {
  var level = 1, xpLeft = playerXp;
  while (xpLeft >= xpToNextLevel(level)) {
    xpLeft -= xpToNextLevel(level);
    level++;
  }
  return { level: level, xp: xpLeft, xpNeeded: xpToNextLevel(level) };
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
