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
// `id` is what emblem unlocks point to ({ title: id }).
const PLAYER_TITLES = [
  { id: 'student',     minLevel: 1,   name: 'Student',               name_pt: 'Aluno' },
  { id: 'scribe',      minLevel: 5,   name: 'Scribe',                name_pt: 'Escriba' },
  { id: 'chronicler',  minLevel: 10,  name: 'Chronicler',            name_pt: 'Cronista' },
  { id: 'historian',   minLevel: 20,  name: 'Historian',             name_pt: 'Historiador' },
  { id: 'guardian',    minLevel: 35,  name: "Alexandria's Guardian", name_pt: 'Guardião de Alexandria' },
  { id: 'time_lord',   minLevel: 50,  name: 'Time Lord',             name_pt: 'Senhor do Tempo' },
  { id: 'lore_keeper', minLevel: 100, name: 'The Lore Keeper',       name_pt: 'The Lore Keeper' }
];

// Each category holds exactly one selected item in playerCustom[cat.id].
const CUSTOM_CATEGORIES = [
  { id: 'emblem', name: 'Emblem',        name_pt: 'Emblema' },
  { id: 'frame',  name: 'Profile Frame', name_pt: 'Moldura do Perfil' }
];

/* unlock: null            → available from the start
           { title: id }   → reach that title (PLAYER_TITLES id)
           { level: n }    → reach player level n
           { trophy: id }  → earn that trophy (TROPHY_DEFS id)
   The first item of each category must always be unlocked: it is the
   fallback when a saved choice is missing or locked.
   Emblems: one per title, in title order, then the trophy ones. Each carries
   trivia/trivia_pt for the detail modal (the unlock rule is described from
   `unlock`, so it never drifts from the data).
   Frames carry `style`, mapped to the .pf-frame-<style> CSS class. */
const CUSTOMIZATIONS = [
  { id: 'emblem_hourglass', cat: 'emblem', icon: '⏳', name: 'Hourglass', name_pt: 'Ampulheta', unlock: { title: 'student' },
    trivia: 'No one knows who invented the hourglass, but it appears suddenly in 14th-century Europe — its first known picture is in Ambrogio Lorenzetti\'s fresco of Good Government in Siena, painted around 1338. Sand glasses were prized at sea, where a rolling ship made water clocks useless: sailors turned a half-hour glass day and night and struck a bell at every turn — the origin of the "bells" that still mark the watches on a ship.',
    trivia_pt: 'Ninguém sabe quem inventou a ampulheta, mas ela surge de repente na Europa do século XIV — sua primeira imagem conhecida está no afresco do Bom Governo de Ambrogio Lorenzetti, em Siena, pintado por volta de 1338. As ampulhetas eram preciosas no mar, onde o balanço do navio tornava inúteis os relógios de água: os marinheiros viravam uma ampulheta de meia hora dia e noite e tocavam um sino a cada virada — a origem dos "toques de sino" que ainda marcam os turnos a bordo.' },
  { id: 'emblem_scroll', cat: 'emblem', icon: '📜', name: 'Scroll', name_pt: 'Pergaminho', unlock: { title: 'scribe' },
    trivia: 'Before books had pages, they were rolled. A Roman book was a volumen — from volvere, "to roll" — which is why we still speak of a "volume". The Greek word for a papyrus roll, biblion, came from Byblos, the Phoenician port through which Egyptian papyrus reached Greece; from it come "Bible" and "bibliography". A reader unrolled the scroll with one hand while rolling up the part already read with the other.',
    trivia_pt: 'Antes de os livros terem páginas, eles eram enrolados. Um livro romano era um volumen — de volvere, "enrolar" — e por isso ainda falamos em "volume". A palavra grega para rolo de papiro, biblion, veio de Biblos, o porto fenício por onde o papiro egípcio chegava à Grécia; dela vêm "Bíblia" e "bibliografia". O leitor desenrolava o rolo com uma mão enquanto enrolava com a outra a parte já lida.' },
  { id: 'emblem_owl', cat: 'emblem', icon: '🦉', name: 'Owl', name_pt: 'Coruja', unlock: { title: 'chronicler' },
    trivia: 'The little owl was the bird of Athena, goddess of wisdom and patron of Athens, and from the 5th century BCE it was stamped on the city\'s silver tetradrachms — coins so trusted across the Mediterranean that people simply called them "owls". In Aristophanes\' comedy The Birds, "bringing owls to Athens" already meant doing something pointless, like carrying coals to Newcastle. Greece put the same owl on its modern one-euro coin.',
    trivia_pt: 'A pequena coruja era a ave de Atena, deusa da sabedoria e protetora de Atenas, e a partir do século V AEC foi cunhada nos tetradracmas de prata da cidade — moedas tão confiáveis em todo o Mediterrâneo que as pessoas as chamavam simplesmente de "corujas". Na comédia As Aves, de Aristófanes, "levar corujas a Atenas" já significava fazer algo inútil, como chover no molhado. A Grécia pôs a mesma coruja na sua moeda moderna de um euro.' },
  { id: 'emblem_dragon', cat: 'emblem', icon: '🐉', name: 'Dragon', name_pt: 'Dragão', unlock: { title: 'historian' },
    trivia: 'In imperial China the dragon stood for the emperor himself, the "True Dragon, Son of Heaven". Under the Ming and Qing dynasties the five-clawed dragon was reserved for the emperor and his closest family; officials had to make do with four-clawed creatures, and using the imperial dragon without permission could be punished as treason. Unlike the dragons of Western legend, the Chinese long was a benevolent spirit of water and rain, not a monster to be slain.',
    trivia_pt: 'Na China imperial, o dragão representava o próprio imperador, o "Verdadeiro Dragão, Filho do Céu". Nas dinastias Ming e Qing, o dragão de cinco garras era reservado ao imperador e à sua família mais próxima; os funcionários tinham de se contentar com criaturas de quatro garras, e usar o dragão imperial sem permissão podia ser punido como traição. Diferente dos dragões das lendas ocidentais, o long chinês era um espírito benevolente da água e da chuva, não um monstro a ser abatido.' },
  { id: 'emblem_key', cat: 'emblem', icon: '🗝️', name: 'Key', name_pt: 'Chave', unlock: { title: 'guardian' },
    trivia: 'The guardians of the Library of Alexandria were famously ruthless collectors. According to the physician Galen, Ptolemy III ordered every ship that docked at Alexandria to be searched for books: the scrolls were copied, the library kept the originals and the owners got the copies. He is also said to have borrowed Athens\' official texts of Aeschylus, Sophocles and Euripides against a huge deposit of 15 talents of silver — and then kept the books, happily giving up the money.',
    trivia_pt: 'Os guardiões da Biblioteca de Alexandria eram colecionadores famosos pela falta de escrúpulos. Segundo o médico Galeno, Ptolomeu III mandou revistar em busca de livros todo navio que atracasse em Alexandria: os rolos eram copiados, a biblioteca ficava com os originais e os donos recebiam as cópias. Conta-se também que ele pediu emprestados os textos oficiais de Atenas de Ésquilo, Sófocles e Eurípides em troca de um enorme depósito de 15 talentos de prata — e depois ficou com os livros, abrindo mão do dinheiro de bom grado.' },
  { id: 'emblem_clock', cat: 'emblem', icon: '🕰️', name: 'Clock', name_pt: 'Relógio', unlock: { title: 'time_lord' },
    trivia: 'Around 1090, in the Song capital of Kaifeng, the scholar Su Song built an astronomical clock tower more than ten metres tall. A great water wheel, held back by an escapement, turned an armillary sphere, a celestial globe and wooden figures that struck bells and gongs to announce the hours — long before mechanical clocks appeared on European towers. When the Jurchen took Kaifeng in 1127 they dismantled it and carried it north, and no one ever managed to make it run again.',
    trivia_pt: 'Por volta de 1090, em Kaifeng, capital da dinastia Song, o erudito Su Song construiu uma torre-relógio astronômica com mais de dez metros de altura. Uma grande roda d\'água, contida por um escapamento, girava uma esfera armilar, um globo celeste e bonecos de madeira que tocavam sinos e gongos para anunciar as horas — muito antes de os relógios mecânicos aparecerem nas torres europeias. Quando os jurchéns tomaram Kaifeng em 1127, desmontaram a torre e a levaram para o norte, e ninguém conseguiu fazê-la funcionar de novo.' },
  { id: 'emblem_crown', cat: 'emblem', icon: '👑', name: 'Crown', name_pt: 'Coroa', unlock: { title: 'lore_keeper' },
    trivia: 'Few crowns carry as much legend as the Iron Crown of Lombardy, kept in the cathedral of Monza. Tradition says its thin inner band was hammered from a nail of the True Cross, brought from Jerusalem by Helena, mother of Constantine. Medieval kings of Italy were crowned with it — and in 1805 Napoleon placed it on his own head in Milan, declaring: "God gave it to me; beware whoever touches it." Modern analysis found that the famous "iron" band is in fact almost entirely silver.',
    trivia_pt: 'Poucas coroas carregam tanta lenda quanto a Coroa de Ferro da Lombardia, guardada na catedral de Monza. Segundo a tradição, seu fino aro interno foi forjado com um prego da Verdadeira Cruz, trazido de Jerusalém por Helena, mãe de Constantino. Reis medievais da Itália foram coroados com ela — e em 1805 Napoleão a pôs na própria cabeça em Milão, declarando: "Deus me deu; ai de quem tocá-la." Análises modernas revelaram que o famoso aro "de ferro" é, na verdade, quase todo de prata.' },
  { id: 'emblem_column', cat: 'emblem', icon: '🏛️', name: 'Column', name_pt: 'Coluna', unlock: { trophy: 'pax_romana' },
    trivia: 'Trajan\'s Column, dedicated in 113 CE, is a 30-metre comic strip in marble: a carved band about 190 metres long winds 23 times around the shaft, telling the story of Trajan\'s two wars in Dacia through some 2,600 figures. A spiral staircase of 185 steps runs up inside it, and its base became the tomb of the emperor\'s ashes. In 1587 Pope Sixtus V crowned it with a bronze statue of Saint Peter, which replaced the long-lost statue of Trajan and still stands there today.',
    trivia_pt: 'A Coluna de Trajano, inaugurada em 113 EC, é uma história em quadrinhos de mármore com 30 metros: uma faixa esculpida de cerca de 190 metros dá 23 voltas em torno do fuste, contando as duas guerras de Trajano na Dácia com cerca de 2.600 figuras. Uma escada em caracol de 185 degraus sobe por dentro, e sua base se tornou o túmulo das cinzas do imperador. Em 1587, o Papa Sisto V colocou no topo uma estátua de bronze de São Pedro, que substituiu a estátua de Trajano, perdida havia muito tempo, e continua lá até hoje.' },
  { id: 'emblem_rocket', cat: 'emblem', icon: '🚀', name: 'Rocket', name_pt: 'Foguete', unlock: { trophy: 'rocket_man' },
    trivia: 'Rockets are centuries older than spaceflight: by the 13th century Chinese armies were firing gunpowder "fire arrows", and the Mongols helped carry the idea west. Spaceflight itself began with a deaf Russian schoolteacher, Konstantin Tsiolkovsky, who published the rocket equation in 1903 — the formula that still tells engineers how much fuel a launch needs. He summed up his dream in one line: "Earth is the cradle of humanity, but one cannot live in the cradle forever."',
    trivia_pt: 'Os foguetes são séculos mais velhos que o voo espacial: no século XIII os exércitos chineses já disparavam "flechas de fogo" movidas a pólvora, e os mongóis ajudaram a levar a ideia para o Ocidente. O voo espacial em si começou com um professor russo surdo, Konstantin Tsiolkovsky, que publicou a equação do foguete em 1903 — a fórmula que ainda diz aos engenheiros quanto combustível um lançamento exige. Ele resumiu seu sonho numa frase: "A Terra é o berço da humanidade, mas não se pode viver no berço para sempre."' },

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
  if (item.unlock.title) {
    var title = PLAYER_TITLES.find(function(t) { return t.id === item.unlock.title; });
    return !!title && playerLevelInfo().level >= title.minLevel;
  }
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
