# Run Save — Specification (Part A)

Saving the run in progress on the device, so it survives the app being minimised, killed in the background, closed mid-run or reloaded by a service worker update. Part A of `CLOUD_SYNC.md`; the key it adds (`chronos_run`) and the "event vs end" rule it relies on are registered in `PERSISTENCE.md`. **Status: approved 2026-10-19, implemented on `feat/run-save`** merged as v52; automated, desktop browser and phone tests passed. Reviewed against v51.

## Problem it solves

A run lived only in memory (`deck`, `timeline`, `currentCard`, `score`… in state.js). Anything that reloaded the page lost it:

- the OS kills the PWA in the background (common on Android/iOS);
- the player swipes the app away;
- **a new deploy**: `pwa-init` in index.html reloads the page 2 s after a new service worker installs — even mid-run.

What the lost run had already written stayed (card stats, mid-game trophies, best streak, the burned daily attempt); everything counted at the end (XP, records, runs played, Compendium, the day's best result) was lost.

## Rules

| | |
|---|---|
| What is saved | the running game only: deck, timeline, card in hand, score, streak, lives, hints, skips, mode, play mode, era filter, run flags, daily/recovery info |
| Where | one key, `chronos_run`, on this device only (never synced — see `PERSISTENCE.md`) |
| When it is written | after every state change of the run (card drawn, placement, hint; a skip draws a card) and on `visibilitychange` (hidden) / `pagehide` |
| When it is cleared | first thing in `endGame` (any outcome), and when a new run starts |
| Runs with 0 cards placed | never saved — nothing to lose, and the daily attempt isn't burned yet |
| On reopening | **the run resumes directly**, no dialog: same hand, deck, timeline, score, lives, hints, skips |
| Leaving a run | the existing End run button (with its confirmation) — the run counts, as today. There is no "discard": every run with a card placed counts |
| Fact panel open when the app closed | not restored: the resumed run draws the next card |
| Daily / recovery | resume only on the calendar day the run was started; reopened on a later day, the run is ended on boot (gameover screen) with the cards already placed |

### What the player sees
- Reopening the app with a run saved lands straight in the game, where it stopped. No extra tap.
- To play something else, the current run must be ended first (End run), and it counts: XP for its score, runs played, the mode record.
- Lost on close: a drag in progress (the card goes back to the hand), the trivia panel that was open, notices still waiting in the queue (the trophy itself is earned and shows in the Trophies tab).
- A run lost on its last life, closed during the 700 ms before the gameover: the gameover screen shows on boot.
- A deploy mid-run: the screen reloads and the run continues where it was.
- A corrupt save: the game opens on the menu as usual; only that run is lost.

## No double counting

Everything the game counts happens either **at the event** or **at the end**:

| Counted | Where | Why a resumed run can't count it twice |
|---|---|---|
| Card stats (`ok`/`miss`), best streak, mid-game trophies and the customizations they unlock, daily attempt burned, review targets | at the event (`recordCardResult`, `attemptPlacement`, `checkTrophies(true)` → `announceCustomUnlocks`, `_commitDailyAttempt`, `initGame`) | already persisted when it happens; the run save is written right after, in the same JS task, so the resumed run starts *after* the event and never replays it |
| Runs played, mode records (incl. the run's best streak), XP, end trophies, customizations unlocked by level or mastery, Compendium, daily result, gameover history record | only in `endGame` | `endGame` runs once per run, and its first step clears `chronos_run`: a run that reached the end can never be resumed again |

Remaining window: the app dying *inside* the single JS task between `recordCardResult` and the run save (microseconds). Accepted.

## Saved shape (`chronos_run`, v1)

```js
{
  v: 1,
  savedAt: '2026-10-18T14:00:00.000Z',
  startedDay: '2026-10-18',   // local day the run began (daily expiry)
  mode: 'classic', playMode: 'lives', eraFilter: ['ancient'],
  deck: ['Fall of Rome', …],  // card names, in draw order (pop from the end)
  timeline: ['Julius Caesar', …],
  current: 'Augustus',        // card in hand, or null (fact panel / tutorial was open)
  clues: 1,                   // clues already revealed on the card in hand
  score: 340, streak: 4, lives: 2,
  hints: 2, skip: 1,          // null = unlimited (Free play: Infinity isn't JSON)
  flags: { aidsUsed: true, minGap: 12, maxMissDelta: 300, lastLifeHits: 0, maxStreak: 7 },  // runFlags minus dailyFinished (set by endGame); minGap null = Infinity
  daily: null                 // or { date: '2026-10-18', attempt: 2, recover: false }
}
```

- Cards are stored by **English name** (the same key as `chronos_card_stats` / `chronos_discovered`; all 505 names are unique) and looked up in `CARDS`/`INTERVALS` on resume. The full deck as names is ~10 KB.
- The deck is stored **in order**, so the resumed run draws exactly the same cards: closing the app never re-rolls the hand or the deck.
- `flags` mirrors `runFlags` (game.js, `RUN_SAVE_FLAGS` in runsave.js). A new run flag — or any other in-memory value that changes the end result — must be added here too, or a resumed run silently loses it (`PERSISTENCE.md`, checklist item 5). Loading tolerates missing flags (default value), so adding one doesn't invalidate older saves.

### Validation on load
Even local data is checked before use (the same discipline Part B needs for cloud data). The save is **discarded** (and the key removed) if:
- the JSON doesn't parse, `v` is unknown, or the raw string is over 64 KB;
- `mode` / `playMode` aren't known values, numbers aren't integers in sane ranges, arrays aren't arrays of strings ≤ 100 chars, or deck + timeline hold more than twice the card count (loose on purpose: an update that removes a card must not discard a full Classic save);
- the timeline ends up empty.

Names that no longer exist (a card renamed or removed by an update) are dropped, and so are repeats; the run continues without them. The timeline is re-sorted by year, in case an update changed a date. If the card in hand is gone, the next one is drawn.

## Resume flow

1. On boot (end of ui.js `DOMContentLoaded`), `resumeSavedRun()` (game.js) asks `loadRun()` (runsave.js) for the validated save; `null` → the menu shows as usual.
2. The state is applied without `initGame`'s deck building: no new deck, no new review targets, no new daily attempt, no Empires tutorial. The run's DOM is reset the same way (shared helpers), the daily overrides (hint/skip hidden) are re-applied, and the main-menu choices follow the resumed run so "Play again" stays in the same mode.
3. Then, in order:
   - a daily/recovery run from an earlier day → ended (see below);
   - lives at 0 (closed in the last 700 ms) → `endGame(false)`;
   - a card in hand → shown with its last revealed clue;
   - otherwise → the next card is drawn (an empty deck ends the run as a win, as usual).

## Daily challenge

### Behaviour kept from before
- The attempt is burned on the **first placement** (`_commitDailyAttempt`), not at the end — and that is also when the day starts counting for the streak. Opening the daily and leaving without placing a card spends nothing and counts nothing.
- Before the first placement nothing is written, and the next launch gets the same attempt number — hence the same deck. So there is no way to swap cards.
- `_saveDailyResult` (at `endGame`) keeps the day's best run; recovery runs write `chronos_recover_*` and never touch `chronos_daily_*` (the streak).
- Playing on with the app open past midnight still works: the run keeps its pinned date. The rule below only applies to closing and reopening.

### With run save
- **No extra attempt**: the save only exists after the first placement, i.e. after the attempt is burned. Resuming keeps playing the same attempt; ending it records its best result (before, a killed run's result was lost). Neither gives a new try.
- **No card swap**: the saved deck is the seeded deck of that attempt, in the same order. A new attempt still gets the reshuffle of the existing retry rules.
- **Expiry at midnight**: a daily or recovery run resumes only on `startedDay`. Reopened on a later day, the run is ended on boot as a voluntary end. Reasons: the attempt budget is per day (the recovery budget is stamped with the day it was spent), and the date/hour secret trophies (`daily_on_date`, `daily_at_hour`) read the device clock at the end — pausing a daily for days would game them. An expired run, when ended:
  - goes to its own day's record, like any daily result, and counts like End run (XP, runs played, daily record);
  - doesn't spend **today's** recovery budget (`_saveDailyResult` skips the `attempts` bump, otherwise `_writeRecoverRecord` would stamp it on today);
  - doesn't set `runFlags.dailyFinished`;
  - shows a gameover line saying the day closed at midnight, and no Retry button (Retry would launch *today's* daily with yesterday's attempt label). The day's remaining tries are gone, as they were before; an unwon card can still be recovered.

## Implementation

| File | Change |
|---|---|
| `src/runsave.js` (new) | `saveRun()`, `loadRun()` (validated, or `null`), `clearRun()`. Reads the run variables of state.js and the daily flags of game.js; only `localStorage`, no knowledge of the cloud. |
| `src/game.js` | `initGame` split into shared helpers (`_resetRunDom`, `_applyDailyControls`, `_renderRunHeader`) used by the new `resumeSavedRun()`; `_runStartedDay` / `_runExpired`; `saveRun()` after placement and hint; `clearRun()` at the top of `endGame`; expired-run handling in `endGame`, `_saveDailyResult`, `_renderDailyGameover`. |
| `src/ui.js` | `drawCard` split into draw + `renderHandCard()` (shows a restored card without popping the deck); `saveRun()` after a draw; save on `visibilitychange` / `pagehide`; resume on boot. |
| `index.html` | `<script src="src/runsave.js">` after game.js. |
| `src/i18n.js` | expired-run gameover lines, en + pt. |
| `sw.js` | `src/runsave.js` in `FILES`; version bump. |
| `documentation/CLAUDE.md`, `PERSISTENCE.md` | `runsave.js` and `chronos_run` move from "planned" to current. |

## Testing (desktop browser, before merging)

For each case, compare `chronos_xp`, `chronos_runs_played`, `chronos_mode_records`, `chronos_card_stats` and the daily key in DevTools → Application before and after.

- Reload mid-run in Lives, Review, Free (∞ hints/skips), Empires (tutorial not shown again), a culture mode: same hand, deck, score, lives, hints, skips, revealed clue; finishing counts everything exactly once.
- Reload → End run: gameover shows, counted once; reload again: menu.
- Reload while the fact panel is open → the next card is drawn.
- Lose the last life and reload within 700 ms → gameover on boot, counted once.
- Daily: reload mid-run → win: card unlocked, attempt count unchanged. Reload → End run → Retry offers the next attempt with a reshuffled deck.
- Daily/recovery expiry: edit `startedDay` to yesterday → gameover on boot with the "closed at midnight" line; no Retry; today's recovery budget untouched.
- Reload before placing the first card → menu, daily attempt not burned.
- Corrupt `chronos_run` by hand → discarded, game boots on the menu.
- Switch language after resuming; switch theme.
- Then on the phone: minimise, kill the app, deploy a new version mid-run.

## Out of scope

- Postponing the service worker's automatic reload while a run is active: with the run save, a deploy mid-run only blinks the screen. Revisit if it bothers on the phone (small change in index.html).
- The gameover screen's unsaved timeline (`_pendingGameRecord`, saved only by "Save Timeline") is still lost if the app closes on the gameover screen — the run itself is already fully counted by then.
- Two tabs of the game open at once on a desktop would both resume the same run. Not guarded (the phone PWA runs one instance).
