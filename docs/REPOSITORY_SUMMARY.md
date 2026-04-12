# Chronos - Repository Summary

## Project Overview

**Chronos** is a historical timeline game implemented as a Progressive Web App (PWA). Players place historical events, people, and empires in chronological order without seeing the dates, testing and building their knowledge of world history.

### Core Concept
- Players draw cards representing historical items (events, people, empires)
- Each card's date is hidden initially
- Players must place each card in the correct chronological position on their timeline
- Correct placements build score and streak; wrong placements break streak (and cost lives in Lives mode)
- After placement, the date is revealed along with historical facts and trivia

### Key Features
- **Multiple Game Modes**: Classic, Empires, Characters, Biblical, Greco-Roman, Eastern
- **Era Filters**: Ancient, Medieval, Modern, or All Ages
- **Lives & Free Modes**: Play with 3 lives or practice freely
- **Daily Challenge**: Seeded daily puzzle with fixed deck (18 cards, no hints/skips)
- **Streak System**: Build streaks for bonus points; earn hints every 20 cards
- **Trophy System**: 21 unlockable achievements with historical trivia
- **Compendium**: Discover and unlock cards with full historical information
- **History Tracking**: Save and review past games with full timelines
- **Bilingual**: Full English and Portuguese support with real-time language switching
- **Audio**: Background music and sound effects (all base64-embedded)
- **Offline Support**: Full PWA with service worker caching

---

## Architecture

### Technology Stack
- **Pure JavaScript** - No frameworks, vanilla ES5/ES6
- **HTML5 + CSS3** - Single page application
- **localStorage** - All persistence (game state, history, settings, progress)
- **Service Worker** - PWA offline functionality
- **Web Audio API** - Background music and sound effects

### File Structure

```
chronos/
├── index.html          # Main HTML structure (53k+ tokens)
├── sw.js               # Service worker for caching
├── README.md           # Project documentation (bilingual)
├── src/                # JavaScript source files
│   ├── state.js        # Global game state variables
│   ├── game.js         # Core game mechanics (22KB)
│   ├── ui.js           # UI rendering and interactions (63KB)
│   ├── i18n.js         # Internationalization and translations (19KB)
│   ├── cards.js        # Historical card data (727KB, 1200+ cards)
│   ├── trophies.js     # Trophy definitions and checking logic (41KB)
│   ├── sfx.js          # Sound effects engine (8KB)
│   └── bgm.js          # Background music (1.3MB, base64 data)
├── assets/             # Static assets
│   ├── manifest.json   # PWA manifest
│   ├── apple-touch-icon.png  # iOS home screen icon
│   ├── icon-192.png    # PWA icon (192x192)
│   ├── icon-512.png    # PWA icon (512x512)
│   └── icon-1024.png   # High-res icon
├── docs/               # Documentation
│   ├── CLAUDE.md       # Comprehensive guide for AI agents
│   └── REPOSITORY_SUMMARY.md  # This file
└── .gitignore          # Git ignore rules
```

---

## Core Components

### 1. State Management (`state.js`)

**Purpose**: Central store for all game state variables.

**Key Variables**:
```javascript
// Language
var lang = 'en';  // 'en' or 'pt'

// Game configuration
var gameMode = 'classic';      // 'classic', 'empires', 'characters', 'abrahamic', 'roman', 'eastern'
var livesMode = true;          // true = 3 lives, false = free play
var eraFilter = 'all';         // 'all', 'ancient', 'medieval', 'modern'
var empiresShownTutorial = false;

// Game state
var deck = [];                 // Cards remaining to draw
var timeline = [];             // Cards placed in chronological order
var currentCard = null;        // Card in hand

// Scoring
var score = 0;                 // Total points
var streak = 0;                // Consecutive correct placements
var lives = 3;                 // Remaining lives (Lives mode only)
var hints = 3;                 // Remaining hints
var skip = 1;                  // Remaining skips (max 1)
var gameActive = false;        // Is a game currently running
var cardCluesUsed = 0;         // Clues used for current card (max 3)

// UI state
var isDragging = false;
var currentDropZone = null;
var reviewMode = false;
var _pendingDraw = false;

// Persistence
var gameHistory = [];          // Array of past game records
var discoveredCards = Set();   // Cards encountered across all games
var earnedTrophies = {};       // Trophy ID -> date earned
```

**Persistence**:
- All state persists to `localStorage` under `chronos_*` keys
- Game history limited to 30 most recent games
- Discovered cards saved as JSON array
- Trophies saved with ISO timestamp of unlock

---

### 2. Card Data (`cards.js`)

**Purpose**: Stores all historical content (2787 lines).

**Structure**:
```javascript
// Single-year events/people
var CARDS = [
  {
    name: 'Julius Caesar',          // English name
    name_pt: 'Júlio César',         // Portuguese name
    year: -44,                       // BCE = negative, CE = positive
    cat: 'People',                   // Category
    cat_pt: 'Pessoas',              // Portuguese category
    era: 'Classical',                // Historical era
    hint: 'Roman general...',        // Short description
    hint_pt: 'General romano...',   // Portuguese description
    facts: ['Fact 1', 'Fact 2'],    // Array of trivia
    facts_pt: ['Fato 1', 'Fato 2'], // Portuguese trivia
    clues: ['Clue 1', ...],         // Progressive hints (max 3)
    clues_pt: ['Pista 1', ...],     // Portuguese clues
    tags: ['roman', ...]             // Mode tags (for filtering)
  },
  // ... ~1000+ cards
];

// Intervals (empires/eras)
var INTERVALS = [
  {
    name: 'Roman Empire',
    name_pt: 'Império Romano',
    startYear: -27,                  // Empire start
    endYear: 476,                    // Empire end
    era: 'Classical',
    region: 'Mediterranean',
    region_pt: 'Mediterrâneo',
    culture: 'Roman',
    culture_pt: 'Romano',
    description: 'Full description...',
    description_pt: 'Descrição...',
    facts: ['Fact 1', ...],
    facts_pt: ['Fato 1', ...],
    clues: ['Clue 1', ...],
    clues_pt: ['Pista 1', ...],
    tags: ['roman']
  },
  // ... ~200+ intervals
];
```

**Categories**:
- **People**: Historical figures (rulers, scientists, artists, etc.)
- **Events**: Wars, revolutions, inventions, disasters
- **Intervals** (Empires/Eras): Spanning ranges with start and end dates

**Era Classification**:
- Ancient (before ~500 BCE)
- Classical (~500 BCE - 500 CE)
- Medieval (500-1400)
- Renaissance (1400-1600)
- Early Modern (1600-1800)
- Modern (1800-1945)
- Contemporary (1945-present)
- Biblical (special era for religious history)

**Tags for Mode Filtering**:
- `abrahamic`: Biblical/Abrahamic history
- `roman`: Greco-Roman civilization
- `eastern`: Asian/Middle Eastern civilizations
- No tag = general Classic mode content

---

### 3. Game Logic (`game.js`)

**Purpose**: Core game mechanics, scoring, and lifecycle.

#### Key Functions

**Pool Building**:
```javascript
function buildPool(mode, eraFilter)
```
- Filters cards based on game mode and era selection
- Returns array of eligible cards for the deck
- Mode filtering:
  - `classic`: CARDS + INTERVALS, filtered by era
  - `empires`: INTERVALS only, filtered by era
  - `characters`: People category only, filtered by era
  - `abrahamic`: Cards/intervals with 'abrahamic' tag
  - `roman`: Cards/intervals with 'roman' tag
  - `eastern`: Cards/intervals with 'eastern' tag

**Game Initialization**:
```javascript
function initGame()
```
- Resets all game state (score, streak, lives, hints)
- Builds deck from selected pool, shuffles it
- Special handling for daily challenge (seeded shuffle, 18 cards, no hints/skips)
- Clears DOM (timeline, feedback, panels)
- Calls `drawCard()` to start

**Card Drawing**:
```javascript
function drawCard()
```
- Pops card from deck
- Updates hand card display (name, category, era, hint)
- Hides date/span for intervals
- Resets clue usage counter

**Placement Logic**:
```javascript
function attemptPlacement(idx)
```
- Validates placement position:
  - Card year must be ≥ previous card's year
  - Card year must be ≤ next card's year
- **On Success**:
  - Plays correct sound
  - Calculates points: base 10 (intervals: 10-30 based on duration) + streak bonus (×2)
  - Increments streak
  - Inserts card into timeline at index
  - Updates score, streak, placed count displays
  - Every 20 streak: award +1 hint
  - Shows fact panel (unless disabled)
  - Scrolls timeline to newly placed card
- **On Failure**:
  - Plays wrong sound
  - Resets streak to 0
  - Determines hint direction (earlier/later) and proximity (close/off/far)
  - In Lives mode: decrements lives, ends game if lives = 0
  - Shows feedback message

**Scoring System**:
- Base points per card: 10 (events/people), 10-30 (empires, based on duration)
- Streak multiplier: +2 points per streak level
- Example: At streak 10, placing a card = 10 + (10 × 2) = 30 points
- Longer empires = more points (harder to place precisely)

**Hints & Skips**:
```javascript
function useHint()
```
- Reveals progressive clues (max 3 per card from card.clues)
- Costs 1 hint from pool
- Earned via streak (every 20 correct placements)
- Starting hints: 3 (Classic/Empires/Characters), 0 (Daily Challenge)

```javascript
function useSkip()
```
- Returns current card to random position in remaining deck
- Costs 1 skip (max 1 per game)
- Draws next card

**Game End**:
```javascript
function endGame(won)
```
- Won = true if deck emptied, false if lives lost or voluntary end
- Builds game record with metadata (mode, score, placed count, timeline)
- Saves discovered cards eagerly
- Checks and awards trophies
- Shows gameover overlay
- Records daily challenge completion if applicable

**Daily Challenge**:
- Seed: `YYYYMMDD` as integer (e.g., 20260409)
- Uses seeded PRNG (mulberry32) for deterministic shuffle
- Fixed deck: 18 cards from full pool (CARDS + INTERVALS)
- No hints, no skips
- Stored in localStorage per day: `chronos_daily_YYYY-MM-DD`
- Streak tracking: current streak, longest streak across all time

---

### 4. UI Rendering (`ui.js`)

**Purpose**: All user interface rendering, interactions, and visual feedback.

#### Panel Management

**Intro Screen**:
```javascript
function showIntro()
```
- Main menu with mode selection
- Lives/Free toggle
- Era filter chips (for Classic/Empires/Characters)
- Hub buttons: History, Compendium, Trophies, Settings
- Language selection

**Cultures Hub**:
```javascript
function openCultures()
```
- Dedicated screen for Biblical, Greco-Roman, Eastern modes
- Mode cards with descriptions
- Lives/Free toggle
- Same hub buttons as intro

**Game Screen**:
- Header: Mode title, score, streak, lives (if applicable), placed count
- Timeline area: Scrollable vertical timeline with placed cards
- Hand card: Currently drawn card with name, category, era, hint
- Bottom area: Hint and Skip buttons (with counts)
- Ghost card: Follows cursor during drag
- Drop zones: Appear between timeline cards (click or drop to place)

**Timeline Card Structure**:
```javascript
function makeTCard(card, idx)
```
- Era dot (colored by era)
- Card name
- Year/span display
- Era · Category metadata
- Info button (ℹ) to review card facts
- Click handler opens review panel

**Drag & Drop**:
```javascript
function startDrag(e)
function onDrag(e)
function endDrag(e)
```
- Pointer events (works on touch and mouse)
- Ghost card follows cursor
- Drop zones highlight on hover
- Auto-scroll timeline during drag
- Haptic-style visual feedback

**Fact Panel**:
```javascript
function showFact(card, isReview)
```
- Overlay panel showing:
  - Card name
  - Full date/span
  - Era and region (for intervals)
  - Random fact from card.facts array
  - Continue button (post-placement) or Close (review mode)
- Review mode: triggered by tapping placed timeline cards
- Post-placement mode: auto-shows after correct placement (can be disabled)

**Feedback System**:
```javascript
function showFeedback(ok, hint, yearDelta)
```
- Animated banner at top of screen
- Correct: "✓ Correct" (green)
- Incorrect: Contextual message based on:
  - Direction: "earlier" or "later"
  - Proximity: "close" (<100 years), "off" (100-500 years), "far" (>500 years)
- Examples:
  - "✗ So close! Just a little later"
  - "✗ Not quite — a few centuries too early"
  - "✗ Wrong era — place it MUCH earlier"

**History Panel**:
```javascript
function renderHistoryPanel()
```
- Two tabs: Timelines, Streak
- **Timelines Tab**:
  - List of past games (up to 30)
  - Each entry: date, time, mode, era, score, placed count
  - Expandable: click to see full timeline
  - Delete button per entry
- **Streak Tab**:
  - Current daily streak counter
  - Longest daily streak
  - This week grid (Mon-Sun, dots show completion)
  - Monthly calendar with completion markers
  - Month/year picker (drum-roll style)
  - Click completed days to view their timelines
  - "Play Today's Challenge" button (disabled if already done)

**Compendium**:
```javascript
function renderCP()
```
- Searchable encyclopedia of all cards
- Filters: Type (All, People, Events, Empires, Biblical), Era (All, Ancient, Medieval, Modern)
- Search bar (filters by name)
- Discovered count: "X / Y discovered"
- Card list: chronologically sorted
- Locked cards: "?????" name and year until discovered
- Expandable: click to reveal facts, clues, full description

**Trophy System**:
```javascript
function renderTrophies()
```
- Grid of trophy cards
- Earned: colored, shows icon and date unlocked
- Locked: grayed out, shows requirements
- Click trophy to open modal:
  - **Earned**: Shows historical trivia (what's special about this achievement)
  - **Locked**: Shows how to unlock it
- Toast notifications when trophies are unlocked during gameplay

**Settings Panel**:
```javascript
function updateSettingsUI()
```
- Theme: Dark / Light mode
- Language: English / Portuguese (instant switch)
- Audio: Music and SFX volume sliders with mute toggles
- Trivia on Placement: On / Off toggle

**Gameover Overlay**:
```javascript
function endGame(won)
```
- Title: "Well Played" (won) or "Time Ends" (lost)
- Subtitle: Contextual message (e.g., "All cards placed!", "All lives lost")
- Final score display
- Buttons: Save Timeline (saves to history), Play Again, View History

#### Visual Design System

**Era Colors**:
```javascript
const ERA_COLORS = {
  'Ancient': '#c17f3a',        // Bronze
  'Classical': '#3a7ab8',      // Blue
  'Medieval': '#8a4ab8',       // Purple
  'Renaissance': '#b87a3a',    // Copper
  'Early Modern': '#3ab87a',   // Green
  'Modern': '#b83a3a',         // Red
  'Contemporary': '#5a8ab8',   // Sky blue
  'Biblical': '#b8943a',       // Gold
  'Jewish History': '#d4a853'  // Light gold
};
```

**Theme System**:
- Dark mode (default): #0d0c0a background, #c9a84c gold accents
- Light mode: White background, adjusted contrast
- Toggle persists to localStorage
- Instant CSS class switching on `<body>`

---

### 5. Internationalization (`i18n.js`)

**Purpose**: Bilingual support with real-time language switching.

**Translation System**:
```javascript
const S = {
  en: { subtitle: 'Timeline', drag_label: '...', ... },
  pt: { subtitle: 'Linha do Tempo', drag_label: '...', ... }
};
const t = k => S[lang][k] || k;  // Translation lookup
```

**Helper Functions**:
```javascript
const cName = c => lang === 'pt' ? c.name_pt : c.name;
const cCat = c => lang === 'pt' ? c.cat_pt : c.cat;
const cHint = c => lang === 'pt' ? c.hint_pt : c.hint;
const cFact = c => { /* Returns random fact in current language */ };
const formatYear = y => y < 0 
  ? `${Math.abs(y)} ${lang === 'pt' ? 'a.C.' : 'BCE'}`
  : `${y} ${lang === 'pt' ? 'd.C.' : 'CE'}`;
```

**Language Switching**:
```javascript
function setLang(l, btn)
```
- Updates global `lang` variable
- Saves to localStorage
- Triggers `_applyAllTranslations()`
- Re-renders all visible UI elements:
  - Intro screen labels and buttons
  - Game screen labels (score, streak, placed, mode title)
  - Hand card content (name, category, hint, active clues)
  - Timeline cards (re-renders all)
  - Open panels (history, compendium, trophies, settings)
  - Gameover screen
- Immediate, no page reload

**Translated Content**:
- All UI labels and buttons
- All card names, categories, hints, facts, clues
- Feedback messages (wrong placement directional hints)
- Trophy names, descriptions, unlock hints, trivia
- Date formatting (BCE/CE vs a.C./d.C.)
- Modal and panel content

---

### 6. Trophy System (`trophies.js`)

**Purpose**: 21 unlockable achievements with historical trivia rewards.

**Trophy Structure**:
```javascript
{
  id: 'trophy_id',                    // Unique identifier
  icon: '🏅',                         // Emoji icon
  name: 'Trophy Name',                // English name
  name_pt: 'Nome do Troféu',         // Portuguese name
  desc: 'Short description',          // English description
  desc_pt: 'Descrição curta',        // Portuguese description
  hint: 'How to unlock...',           // Unlock requirements
  hint_pt: 'Como desbloquear...',    // Portuguese requirements
  trivia: 'Historical fact...',       // Reward: historical trivia
  trivia_pt: 'Curiosidade...',       // Portuguese trivia
  needed: ['Card 1', 'Card 2'],      // Required cards (if applicable)
  special: 'special_condition'        // Special check function (if not card-based)
}
```

**Trophy Categories**:

1. **Dynasty Trophies** (card combos):
   - End of an Era: First & Last Ancient Olympics
   - Pax Romana: Rome founding → Republic → Empire → Fall
   - Julio-Claudian: Augustus, Tiberius, Caligula, Claudius, Nero
   - Flavian: Vespasian, Titus, Domitian
   - Five Good Emperors: Nerva, Trajan, Hadrian, Antoninus Pius, Marcus Aurelius
   - King of Kings: All 17 Roman/Byzantine emperors

2. **Thematic Trophies**:
   - Crusader: All 9 Crusades
   - Silk Trader: Silk Road, Great Wall, Pharaonic Egypt
   - Renaissancist: Leonardo, Michelangelo, Galileo, Shakespeare, Renaissance era
   - Scientist: Archimedes, Copernicus, Galileo, Newton, Darwin
   - Age of Revolutions: American, French, Russian, Haitian revolutions
   - The Great Wars: WWI, WWII, Hiroshima/Nagasaki bombing
   - Cold Warrior: Cold War, Cuban Missile Crisis, Korean War, Vietnam War
   - Vienna Crossover: Hitler, Freud, Stalin (all lived in Vienna 1908-1913)
   - Rocket Man: First Man in Space, Moon Landing, Space Age

3. **Milestone Trophies**:
   - Warlord: 8+ war cards in one game
   - Empire Builder: 10+ intervals in one game
   - Centurion: 100+ cards in one game
   - Iron Mind: 500+ points in one game
   - On Fire: 50+ streak in one game
   - Time Lord: Empty entire deck (win by completion)
   - Librarian of Alexandria: Discover all cards in compendium

4. **Daily Challenge Trophies**:
   - Creature of Habit: 7-day daily streak
   - The Long Count: 40-day daily streak

**Checking Logic**:
```javascript
function checkTrophies()
```
- Called at game end
- Checks all trophy conditions
- For card-based: verifies all needed cards are in current timeline
- For special: calls specific check functions (score, streak, deck empty, etc.)
- Compares against `earnedTrophies` object (prevents duplicates)
- Awards new trophies: saves timestamp, queues toast notifications
- Toast queue: shows each trophy one at a time with 3.2s display + 0.5s gap

**Streak Trophy Mid-Game**:
```javascript
function checkStreakTrophy()
```
- Called during gameplay when streak reaches 50
- Awards "On Fire" trophy immediately with toast
- Allows player to see milestone achievement in real-time

**Historical Trivia**:
- Each trophy unlock reveals a detailed historical fact
- Facts are thematically related to the achievement
- Examples:
  - "End of an Era" trivia: Ancient Olympics history, Theodosius ban, modern revival
  - "Vienna Crossover" trivia: Hitler, Freud, Stalin, Trotsky, Franz Ferdinand all in Vienna 1908-1913
  - "The Long Count" trivia: Maya Long Count calendar system

---

### 7. Audio System (`bgm.js`, `sfx.js`, `ui.js`)

**Background Music (`bgm.js`)**:
- Single looping track embedded as base64 data URL
- Trimmed: loops from 3-second mark (skip intro)
- Auto-plays on first user interaction
- Persisted volume (0-100) and mute state in localStorage
- Functions:
  - `playMusic()`: Start/resume playback
  - `stopMusic(fade)`: Stop, optionally with 800ms fade-out
  - `fadeInMusic()`: Gradual volume ramp over 1 second
  - `setMusicVolume(val)`: Update volume slider
  - `toggleMusicMute()`: Mute/unmute
- Pauses on page visibility change (user tabs away)

**Sound Effects (`sfx.js`)**:
- Engine: `SFX` object with cache and play method
- Effects (partially implemented):
  - `drop`: Card placement sound (implemented)
  - `correct`, `wrong`, `pickup`: Placeholder (null)
  - `streak`, `trophy`, `win`, `lose`: Placeholder (null)
- Volume and mute controlled separately from music
- Plays via `SFX.play('name')` - creates new Audio() instance each time

**Audio UI Controls (`ui.js`)**:
- Settings panel sliders:
  - Music volume: 0-100 slider
  - SFX volume: 0-100 slider
- Mute buttons: ON/OFF toggle per audio type
- Real-time updates: volume changes apply immediately
- Persisted to localStorage:
  - `chronos_music_vol`
  - `chronos_sfx_vol`
  - `chronos_music_mute`
  - `chronos_sfx_mute`

**Initialization**:
- Audio systems initialized on first user interaction (pointerdown or keydown)
- Ensures autoplay policy compliance across browsers
- Background music starts automatically, SFX cache loaded

---

### 8. Service Worker (`sw.js`)

**Purpose**: Progressive Web App offline functionality.

**Cache Strategy**:
- Cache name: `chronos-v4` (increment on every deployment)
- Files cached:
  - All HTML, JS, CSS files
  - Manifest and icons
  - **Excludes** bgm.js (large base64, browser cache handles it)

**Lifecycle**:
- **Install**: Caches all files listed in FILES array
- **Activate**: Deletes old cache versions
- **Fetch**: Cache-first strategy with network fallback

**Update Flow**:
1. User loads page
2. Service worker checks for updates
3. If new version found, downloads and installs in background
4. On next page load, new version activates
5. Old cache deleted automatically

**User Experience**:
- First visit: Downloads and caches all files
- Subsequent visits: Instant load from cache
- Offline: Full functionality (except fresh card data updates)
- Updates: Seamless background updates

---

## Data Flow

### Game Start Flow
```
User clicks mode & Begin
  → startGame()
  → initGame()
  → buildPool(gameMode, eraFilter)
  → shuffle(pool) → deck
  → renderTimeline() (empty)
  → drawCard()
  → Display hand card
```

### Card Placement Flow
```
User drags card / clicks drop zone
  → attemptPlacement(idx)
  → Validate position (year ≥ prev, year ≤ next)
  
  IF CORRECT:
    → Insert into timeline[idx]
    → Add points (base + streak bonus)
    → Increment streak
    → Check streak milestone (every 20 → +1 hint)
    → Update displays (score, streak, placed)
    → renderTimeline() (with new card)
    → showFact(card) (if enabled)
    → drawCard() (when fact panel closed)
  
  IF INCORRECT:
    → Reset streak to 0
    → Decrement lives (Lives mode)
    → showFeedback(false, hint, yearDelta)
    → Check lives == 0 → endGame(false)
    → Keep same card in hand (no new draw)
```

### Game End Flow
```
Deck empty OR lives == 0 OR user ends voluntarily
  → endGame(won)
  → Build game record (metadata + timeline)
  → Save discovered cards
  → Check all trophy conditions
  → Award new trophies (with toasts)
  → Show gameover overlay
  → Option to save to history
  → Restore intro / cultures screen
```

### Daily Challenge Flow
```
User clicks "Play Today's Challenge"
  → Check if already done today (localStorage key)
  → If done: Button disabled
  → If not done:
    → Generate seed from date (YYYYMMDD)
    → Seeded shuffle of full pool → first 18 cards
    → Set hints = 0, skip = 0
    → Hide hint/skip buttons
    → Play normal game
    → On end: Mark today complete (save score & timeline)
    → Update streak counters
```

### Language Switch Flow
```
User selects language
  → setLang(lang)
  → Update global `lang` variable
  → Save to localStorage
  → _applyAllTranslations()
    → Update all static labels
    → Re-render hand card (if active)
    → Re-render timeline cards
    → Re-render open panels
    → Update gameover screen (if visible)
  → No page reload, instant switch
```

### Trophy Unlock Flow
```
Game ends
  → checkTrophies()
  → For each trophy definition:
    → Check if already earned (skip if so)
    → Evaluate condition:
      - Card combo: Check all needed cards in timeline
      - Special: Call specific check (score ≥ 500, streak ≥ 50, etc.)
    → If earned:
      → Save to earnedTrophies[id] = ISO timestamp
      → Add to newlyEarned array
  → If any new trophies:
    → saveTrophies() to localStorage
    → _showTrophyToastQueue(newlyEarned, 0)
      → Show first trophy toast (icon + name)
      → After 3.2s, hide and show next
      → Repeat until all shown
```

---

## Persistence & Storage

### localStorage Keys

**Game State**:
- `chronos_lang`: 'en' or 'pt'
- `chronos_theme`: 'light' or 'dark'
- `chronos_history`: JSON array of game records (max 30)
- `chronos_discovered`: JSON array of card names seen
- `chronos_trophies`: JSON object of trophy IDs → unlock timestamps
- `chronos_placed_trivia`: 'true' or 'false' (show fact panel on placement)

**Daily Challenge**:
- `chronos_daily_YYYY-MM-DD`: JSON object per day
  - `{ score: number, placed: number, timeline: [...] }`
- Used for streak calculation and calendar display

**Audio Settings**:
- `chronos_music_vol`: 0-100 (default 40)
- `chronos_sfx_vol`: 0-100 (default 80)
- `chronos_music_mute`: 'true' or 'false'
- `chronos_sfx_mute`: 'true' or 'false'

**Size Estimates**:
- Game history (30 games): ~50-100 KB
- Discovered cards (full set): ~10 KB
- Trophies: ~2 KB
- Daily challenges (365 days): ~100-150 KB
- Total: ~200-300 KB (well within localStorage limits)

---

## Game Modes

### Classic Mode
- **Pool**: All CARDS + INTERVALS, filtered by era
- **Era Filters**: All Ages, Ancient, Medieval, Modern
- **Lives**: Optional (3 lives or Free)
- **Deck Size**: ~60-300 cards depending on era filter
- **Description**: "Place people, events and discoveries in order"

### Empires Mode
- **Pool**: INTERVALS only (empires/eras), filtered by era
- **Era Filters**: All Ages, Ancient, Medieval, Modern
- **Lives**: Optional (3 lives or Free)
- **Special**: Shows duration, region, culture for each empire
- **Scoring**: Bonus points for longer empires (10-30 points)
- **Tutorial**: First-time popup explaining interval mechanics
- **Description**: "Place empires and eras by their rise and fall"

### Characters Mode
- **Pool**: CARDS where cat === 'People', filtered by era
- **Era Filters**: All Ages, Ancient, Medieval, Modern
- **Lives**: Optional (3 lives or Free)
- **Description**: "Order the greatest figures in history"

### Biblical Mode (Cultures Hub)
- **Pool**: CARDS + INTERVALS with 'abrahamic' tag
- **Era Filter**: All Ages only
- **Lives**: Optional (3 lives or Free)
- **Description**: "Prophets, kings and sacred history"

### Greco-Roman Mode (Cultures Hub)
- **Pool**: CARDS + INTERVALS with 'roman' tag
- **Era Filter**: All Ages only
- **Lives**: Optional (3 lives or Free)
- **Description**: "Ancient Greece, Rome and Byzantium"

### Eastern Mode (Cultures Hub)
- **Pool**: CARDS + INTERVALS with 'eastern' tag
- **Era Filter**: All Ages only
- **Lives**: Optional (3 lives or Free)
- **Description**: "Persia, China, India and Islam"

### Daily Challenge
- **Pool**: All CARDS + INTERVALS (no filters)
- **Seeded**: Deterministic shuffle based on current date
- **Deck Size**: Fixed 18 cards
- **Hints**: 0 (disabled entirely, buttons hidden)
- **Skips**: 0 (disabled entirely)
- **Lives**: 3 (always Lives mode)
- **Streak**: Tracks current and longest daily streaks
- **Persistence**: One attempt per day, saved with score and timeline
- **Description**: "Same cards for everyone today"

---

## Scoring System

### Base Points
- **Events/People**: 10 points
- **Intervals**: 10-30 points (scales with duration)
  - Formula: `Math.min(30, 10 + Math.floor(duration / 100))`
  - Example: 500-year empire = 10 + 5 = 15 points
  - Example: 1000-year empire = 10 + 10 = 20 points
  - Example: 2000+ year empire = 30 points (capped)

### Streak Multiplier
- Bonus: `streak × 2` points per card
- Example progression:
  - Streak 1: 10 + 2 = 12 points
  - Streak 10: 10 + 20 = 30 points
  - Streak 50: 10 + 100 = 110 points
- Combined with empire bonuses:
  - 1000-year empire at streak 30: 20 + 60 = 80 points

### Hint Rewards
- Every 20 correct placements: +1 hint
- Streak milestones: 20, 40, 60, 80, 100...
- Toast notification on hint earned

### Lives Mode Penalties
- Incorrect placement: -1 life
- Lives reach 0: Game over (loss)
- No point deductions (only lose life)

### Free Mode
- Incorrect placement: No penalty (except broken streak)
- Game continues until deck empty or voluntary end
- Useful for learning and exploration

---

## Technical Implementation Details

### Seeded RNG for Daily Challenge
```javascript
function _seededRNG(seed) {
  return function() {
    seed |= 0;
    seed = seed + 0x6D2B79F5 | 0;
    var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
```
- Mulberry32 PRNG algorithm
- Deterministic: Same seed → same sequence
- Seed = YYYYMMDD as integer (e.g., 20260409)
- Used for daily challenge deck shuffle

### Drag & Drop Implementation
```javascript
// Pointer events (mouse + touch compatible)
startDrag(e) → isDragging = true, show ghost, attach listeners
onDrag(e) → move ghost, highlight drop zone, auto-scroll timeline
endDrag(e) → hide ghost, attempt placement if over drop zone
```
- Ghost card: Invisible positioned element that follows cursor
- Drop zones: Highlight on hover (within 30px tolerance)
- Auto-scroll: Timeline scrolls when dragging near top/bottom edges
- Touch support: Full pointer events API (no separate touch handlers)

### Timeline Rendering Optimization
```javascript
function renderTimeline() {
  const el = document.getElementById('timeline');
  el.innerHTML = '';  // Clear all
  el.appendChild(makeDZ(0));  // First drop zone
  timeline.forEach((card, idx) => {
    el.appendChild(makeTCard(card, idx));
    el.appendChild(makeDZ(idx + 1));
  });
}
```
- Full re-render on every change (simple, reliable)
- No virtual DOM or diffing (small scale, fast enough)
- Drop zones interspersed: 1 before each card + 1 at end
- Empty state: Helpful hint when timeline.length === 0

### Fact Panel Smart Behavior
- **Post-Placement Mode** (`reviewMode = false`):
  - Shows automatically after correct placement
  - "Continue" button draws next card
  - `_pendingDraw = true` flag prevents double-draw
- **Review Mode** (`reviewMode = true`):
  - Triggered by clicking placed timeline cards
  - "Close" button returns to game (no new card drawn)
  - Can review any card at any time during or after game

### Feedback Messages with Context
```javascript
function showFeedback(ok, hint, yearDelta)
```
- Calculates year difference to closest neighbor at attempted slot
- Bands: <100 years = "close", 100-500 = "off", >500 = "far"
- Combines with direction: earlier/later
- 6 unique incorrect messages (earlier×3 + later×3)
- Bilingual: Each message translated in i18n.js

### Compendium Discovery System
```javascript
var discoveredCards = new Set();  // Card names (English keys)
```
- Cards added to Set when drawn OR placed
- Persists to localStorage as JSON array
- Compendium shows locked cards (???) until discovered
- Progress counter: "X / Y discovered"
- Trophy unlocked at 100% discovery

### Trophy Toast Queue
```javascript
function _showTrophyToastQueue(list, idx) {
  if (idx >= list.length) return;
  var def = list[idx];
  // Show toast with icon + name
  setTimeout(() => {
    // Hide toast
    setTimeout(() => _showTrophyToastQueue(list, idx + 1), 500);
  }, 3200);
}
```
- Recursive function with delays
- Shows each trophy sequentially (not overlapping)
- 3.2s display + 0.5s gap between trophies
- Prevents notification spam when multiple trophies earned

### Calendar Picker (Month/Year Selection)
- Drum-roll style scrolling columns
- Two columns: Month (12 options), Year (2026–current)
- Centered selection with highlight bar
- Scroll to select, tap to jump
- Confirm button applies selection
- Min date: March 2026 (project start)
- Max date: Today (can't view future)
- Disable invalid month/year combinations

---

## Browser Compatibility

### Target Browsers
- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile, Samsung Internet)

### Required Features
- ES6 support (arrow functions, template literals, let/const)
- Pointer Events API (pointer down/move/up)
- localStorage
- Service Workers (for PWA)
- Web Audio API (for music/SFX)
- CSS Grid & Flexbox

### Fallbacks
- No polyfills included (assumes modern browser)
- Service worker: Graceful degradation if not supported
- Audio: Silent failure if autoplay blocked (user can unmute)

### Known Limitations
- localStorage quota: 5-10 MB (sufficient for this app)
- No IndexedDB usage (localStorage adequate for data size)
- No server: Fully client-side (all data embedded in JS)

---

## Content Scale

### Current Content
- **CARDS**: ~1000+ single-year events and people
- **INTERVALS**: ~200+ empires and eras
- **Total**: ~1200+ historical items
- **Eras**: 9 distinct historical periods
- **Languages**: Full English + Portuguese translations
- **Trophies**: 21 unlockable achievements

### Content Distribution
- **Ancient/Classical**: Heavy focus (Egypt, Greece, Rome)
- **Medieval/Renaissance**: Moderate coverage
- **Modern/Contemporary**: Good coverage (1800-present)
- **Biblical**: Special mode content (~50-100 items)
- **Greco-Roman**: Special mode content (~100-150 items)
- **Eastern**: Special mode content (~80-120 items)

### Translation Coverage
- 100% UI strings translated
- 100% card content translated
- 100% trophy content translated
- Bilingual facts, hints, clues for all cards

---

## Future Considerations

### Potential Enhancements
1. **More Modes**: Scientific, Artistic, American, African, etc.
2. **Multiplayer**: Real-time or async head-to-head
3. **Custom Decks**: User-created card sets
4. **Achievements**: More granular milestones
5. **Statistics**: Detailed analytics (accuracy by era, category strengths)
6. **Educational Mode**: Explicit teaching with explanations
7. **Card Contributions**: Community-submitted cards (with moderation)

### Scalability Notes
- Current architecture supports 2000-3000 cards easily
- Beyond that: Consider chunking cards.js, lazy loading by era/mode
- Service worker: Need to re-version and re-cache on card updates
- localStorage: May need IndexedDB for very large history (100+ games)

### Performance
- Rendering 100+ timeline cards: Smooth on modern devices
- Smooth 60fps animations and drag interactions
- Service worker caching: Instant loads on repeat visits
- No network requests during gameplay (fully offline)

---

## Development Workflow

### File Modification Protocol
1. Edit source files (HTML, JS)
2. Test locally (open index.html in browser)
3. Increment cache version in sw.js: `const CACHE = 'chronos-vX';`
4. Commit changes
5. Deploy (push to hosting, GitHub Pages, etc.)
6. Service worker auto-updates on next user visit

### Testing Checklist
- [ ] All game modes start and play correctly
- [ ] Lives mode ends game at 0 lives
- [ ] Free mode allows unlimited failures
- [ ] Scoring calculates correctly (base + streak)
- [ ] Hints reveal clues progressively (max 3)
- [ ] Skip returns card to deck and draws new one
- [ ] Daily challenge: seeded, no hints/skips, 18 cards
- [ ] Language switch updates all UI instantly
- [ ] Theme switch applies correctly
- [ ] Trophies unlock with correct conditions
- [ ] Compendium filters and search work
- [ ] History saves and displays correctly
- [ ] Service worker caches all files
- [ ] Audio plays (music + SFX) with volume/mute controls

### Card Addition Process
1. Add card object to CARDS or INTERVALS array in cards.js
2. Include all required fields (name, name_pt, year/startYear/endYear, etc.)
3. Write facts, hints, clues in both languages
4. Add tags if applicable (roman, abrahamic, eastern)
5. Test: Draw card in relevant game mode
6. Verify: Compendium displays card correctly
7. Check: Trophy conditions still work (if card affects them)

---

## Code Organization Philosophy

### Separation of Concerns
- **state.js**: Data only, no logic
- **cards.js**: Content only, no game logic
- **game.js**: Game mechanics, no rendering
- **ui.js**: Rendering and interaction, no game logic
- **i18n.js**: Translation and language handling
- **trophies.js**: Achievement definitions and checks

### Naming Conventions
- Global variables: `camelCase` (e.g., `gameMode`, `currentCard`)
- Functions: `camelCase` (e.g., `startGame()`, `drawCard()`)
- Private helpers: `_leadingUnderscore` (e.g., `_seededRNG()`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `ERA_COLORS`)
- DOM IDs: `kebab-case` (e.g., `hand-card`, `timeline-area`)
- CSS classes: `kebab-case` (e.g., `.timeline-card`, `.drop-zone`)

### Code Style
- No frameworks or build tools (pure vanilla JS)
- ES5/ES6 mix (arrow functions, let/const, template literals)
- Inline CSS-in-JS for dynamic styles (era colors, visibility toggles)
- Event listeners: Direct DOM manipulation (no virtual DOM)
- Comments: Section headers with ASCII art dividers

### Error Handling
- localStorage: Try-catch blocks (graceful failure if quota exceeded)
- Audio: Catch promises (autoplay may be blocked)
- Service worker: Optional (app works without it)
- Minimal error messages to user (silent failures for non-critical features)

---

## Accessibility Considerations

### Current Implementation
- Semantic HTML where applicable
- Keyboard shortcuts: Escape closes panels
- Touch and mouse both supported (pointer events)
- High contrast modes: Dark and light themes
- Text is readable (no tiny fonts)

### Known Gaps
- No ARIA labels or roles
- No keyboard navigation for drag-drop (mouse/touch only)
- No screen reader support
- No reduced motion preferences respected
- No focus management for modals

### Future Improvements
- Add ARIA labels to all interactive elements
- Implement keyboard-only placement (arrow keys, Enter to place)
- Add screen reader announcements for score, streak, feedback
- Respect `prefers-reduced-motion` for animations
- Improve focus trapping in modals

---

## License & Attribution

### Code License
Not specified in repository (assume all rights reserved unless stated)

### Content Attribution
- Historical facts: Public domain knowledge
- Dates and events: Verified against multiple sources
- No third-party APIs or data services used
- All content written by project authors

### Assets
- Icons: Custom (PNG files included)
- Audio: Custom or royalty-free (base64 embedded)
- No external fonts (uses system fonts: Inter, sans-serif fallback)

---

## Contact & Contribution

### Git Information
- Repository: Local git repository initialized
- Current branch: `main`
- Recent commits:
  - "chore: messages +17 cards added"
  - "card_correction: Chola Empire"
  - "feat: trivia on/off button"
  - "feat: trivia tap out upgrade"
  - "chore: +8 cards"
- Unstaged changes: cards.js (modified)

### Contributing Guidelines
(Not specified in repository - to be defined)

---

## Appendix: Key Algorithms

### Placement Validation
```javascript
function attemptPlacement(idx) {
  const cy = cardYear(card);
  const prev = timeline[idx - 1];
  const next = timeline[idx];
  const valid = (!prev || cy >= cardYear(prev)) && (!next || cy <= cardYear(next));
  // ...
}
```
- Binary search not used (small timeline, linear check is fast)
- Validates both boundaries: card year ≥ previous AND ≤ next

### Streak Calculation (Daily Challenge)
```javascript
function _calcStreak() {
  var today = new Date(); today.setHours(0,0,0,0);
  var cur = 0, longest = 0;
  var checking = new Date(today);
  if (!_isDailyDone(checking)) checking.setDate(checking.getDate() - 1);
  while (_isDailyDone(checking)) {
    cur++;
    checking.setDate(checking.getDate() - 1);
  }
  // ... calculate longest by iterating all localStorage keys
  return { cur: cur, longest: longest };
}
```
- Current streak: Count backwards from yesterday (or today if done) until first gap
- Longest streak: Iterate all daily keys, find longest consecutive run
- Gaps break streak: Missing a day resets current streak to 0

### Era Filter Mapping
```javascript
const ERA_FILTER_MAP = {
  all: null,  // null = no filter
  ancient: ['Ancient', 'Classical'],
  medieval: ['Medieval', 'Renaissance'],
  modern: ['Early Modern', 'Modern', 'Contemporary']
};
```
- Null filter: Include all eras
- Era groups: Logical historical groupings
- Used in buildPool() to filter cards

### Points Calculation for Intervals
```javascript
const basePoints = isInterval(card)
  ? Math.min(30, 10 + Math.floor((card.endYear - card.startYear) / 100))
  : 10;
```
- Duration in years / 100 = bonus points
- Capped at 30 total
- Rewards: Longer empires are harder to place precisely

---

*This summary was generated on 2026-04-09 based on repository analysis.*
