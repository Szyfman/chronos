# Run Save — Specification (Part A)

Proposed design for saving the run in progress on the device, so it survives the app being minimised, killed in the background, closed mid-run or reloaded by a service worker update. Part A of `CLOUD_SYNC.md`; the key it adds (`chronos_run`) and the "event vs end" rule it relies on are registered in `PERSISTENCE.md`. **Status: draft, awaiting approval** — decisions marked ❓ are open. Reviewed against v51.

## Problem today

A run lives only in memory (`deck`, `timeline`, `currentCard`, `score`… in state.js). Anything that reloads the page loses it:

- the OS kills the PWA in the background (common on Android/iOS);
- the player swipes the app away;
- **a new deploy**: `pwa-init` in index.html reloads the page 2 s after a new service worker installs — even mid-run.

What the lost run had already written stays (card stats, mid-game trophies, best streak, the burned daily attempt); everything counted at the end (XP, records, runs played, Compendium, the day's best result) is lost.

## Rules

| | |
|---|---|
| What is saved | the running game only: deck, timeline, card in hand, score, streak, lives, hints, skips, mode, play mode, era filter, run flags, daily/recovery info |
| Where | one key, `chronos_run`, on this device only (never synced — see Part B) |
| When it is written | after every state change of the run (card drawn, placement, hint, skip) and on `visibilitychange` (hidden) / `pagehide` |
| When it is cleared | first thing in `endGame` (any outcome), and when a new run starts |
| Runs with 0 cards placed | never saved — nothing to lose, and the daily attempt isn't burned yet |
| On reopening | dialog **"Run in progress"** with **Continue** / **End run** ❓ (see decision 1) |
| End run | same as the in-game End run button: the run is finalised and counted once, gameover screen shown |
| Daily / recovery | can be continued only on the calendar day it was started; after midnight only End run is offered ❓ (decision 2) |

## No double counting

Everything the game counts happens either **at the event** or **at the end**:

| Counted | Where | Why a resumed run can't count it twice |
|---|---|---|
| Card stats (`ok`/`miss`), best streak, mid-game trophies and the customizations they unlock, daily attempt burned, review targets | at the event (`recordCardResult`, `attemptPlacement`, `checkTrophies(true)` → `announceCustomUnlocks`, `_commitDailyAttempt`, `initGame`) | already persisted when it happens; the run save is written right after, in the same JS task, so the resumed run starts *after* the event and never replays it |
| Runs played, mode records (incl. the run's best streak), XP, end trophies, customizations unlocked by level or mastery, Compendium, daily result, gameover history record | only in `endGame` | `endGame` runs once per run, and its first step clears `chronos_run`: a run that reached the end can never be offered again |

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
- `flags` mirrors `runFlags` (game.js). A new run flag — or any other in-memory value that changes the end result — must be added here too, or a resumed run silently loses it (`PERSISTENCE.md`, checklist item 5). Loading tolerates missing flags (default value), so adding one doesn't invalidate older saves.

### Validation on load
Even local data is checked before use (the same discipline Part B will need for cloud data). The save is **discarded silently** if:
- the JSON doesn't parse, `v` is unknown, or the raw string is over 64 KB;
- `mode` / `playMode` aren't known values, numbers aren't finite non-negative integers in sane ranges, arrays aren't arrays of strings ≤ 100 chars, or deck + timeline + current exceed the card count;
- the timeline ends up empty.

Names that no longer exist (a card renamed or removed by an update) are dropped; the run continues without them. If the card in hand is gone, the next one is drawn.

## Resume flow

1. On boot (`DOMContentLoaded`), `loadRun()` returns the validated save or `null`.
2. A run saved during its last 700 ms (lives at 0, waiting for `endGame`) is finalised directly: gameover screen, no dialog.
3. Otherwise the dialog shows mode · play mode, cards placed, score and lives (bilingual), with **Continue** and **End run**. It is modal: the menu can't start another run while a save is pending.
4. **Continue** → `resumeRun(save)` (game.js): applies the state, resets the run's DOM like `initGame` does, re-applies the daily overrides (hint/skip hidden), shows the card in hand with its revealed clue, or draws the next one. It does **not** rebuild the deck, re-record review targets, re-commit the daily attempt or show the Empires tutorial.
5. **End run** → same restore, then `endGame(false)` as a voluntary end.

## Daily challenge

### Current behaviour (unchanged)
- The attempt is burned on the **first placement** (`_commitDailyAttempt`), not at the end. That is what already stops "close the app for another try": a killed run today simply loses that attempt, and the day counts for the streak.
- Before the first placement nothing is written, and the next launch gets the same attempt number — hence the same deck. So there is no way to swap cards either.
- `_saveDailyResult` (at `endGame`) keeps the day's best run; recovery runs write `chronos_recover_*` and never touch `chronos_daily_*` (the streak).

### With run save
- **No extra attempt**: the save only exists after the first placement, i.e. after the attempt is burned. Continue keeps playing the same attempt; End run finalises it (best result recorded — better than today, where it is lost). Neither gives a new try.
- **No card swap**: the saved deck is the seeded deck of that attempt, in the same order. A new attempt still gets the reshuffle of the existing retry rules.
- **Expiry at midnight** ❓: a daily or recovery run can be continued only on `startedDay`. After that only End run is offered. Reasons: the attempt budget is per day (recovery budget is stamped with the day it was spent), and the date/hour secret trophies (`daily_on_date`, `daily_at_hour`) read the device clock at the end — pausing a daily for days would game them. When an expired run is ended:
  - its result goes to its own day's record, as today;
  - a recovery run doesn't spend **today's** recovery budget (fix in `_saveDailyResult`: no `attempts` bump for an expired run — otherwise `_writeRecoverRecord` would stamp today);
  - it doesn't set `runFlags.dailyFinished`;
  - the gameover shows no Retry button (Retry would launch *today's* daily with yesterday's attempt label).

So Part A protects the daily too — it doesn't have to be left out.

## Implementation

| File | Change |
|---|---|
| `src/runsave.js` (new) | `saveRun()`, `loadRun()` (validated, or `null`), `clearRun()`. Reads the run variables of state.js and the daily flags of game.js; only `localStorage`, no knowledge of the cloud. Header: what it depends on. |
| `src/game.js` | `initGame`'s DOM reset extracted to a helper shared with the new `resumeRun(save)` / `endSavedRun(save)`; `saveRun()` after placement, hint and skip; `clearRun()` at the top of `endGame` (both branches); expired-run handling in `_saveDailyResult` / `_renderDailyGameover`. |
| `src/ui.js` | `drawCard` split into draw + `renderHandCard()` (so a restored card can be shown without popping the deck); `saveRun()` after a draw; resume dialog; save on `visibilitychange` / `pagehide`. |
| `index.html` | `<script src="src/runsave.js">` after game.js; dialog markup (same look as the End run confirm). |
| `src/i18n.js` | dialog strings, en + pt. |
| `sw.js` | `src/runsave.js` in `FILES`; version bump. |
| `documentation/CLAUDE.md` | `runsave.js` row in File Responsibilities moves from "planned" to current. |
| `documentation/PERSISTENCE.md` | `chronos_run` moves from "planned" to current. |

## Testing (desktop browser, before merging)

For each case, compare `chronos_xp`, `chronos_runs_played`, `chronos_mode_records`, `chronos_card_stats` and the daily key in DevTools → Application before and after.

- Reload mid-run in Lives, Review, Free (∞ hints/skips), Empires (tutorial not shown again), a culture mode → Continue: same hand, deck, score, lives, hints, skips, revealed clue; finishing counts everything exactly once.
- Reload → End run: gameover shows, counted once; reload again: no dialog.
- Reload while the fact panel is open → Continue draws the next card.
- Lose the last life and reload within 700 ms → gameover on boot, counted once.
- Daily: reload mid-run → Continue → win: card unlocked, attempt count unchanged. Reload → End run → Retry offers the next attempt with a reshuffled deck.
- Daily/recovery expiry: edit `startedDay` to yesterday → only End run; today's recovery budget untouched; no Retry.
- Reload before placing the first card → no dialog, daily attempt not burned.
- Corrupt `chronos_run` by hand → discarded silently, game boots normally.
- Switch language after Continue; switch theme.
- Then on the phone: minimise, kill the app, deploy a new version mid-run.

## Open decisions

1. ❓ **Dialog or resume directly?** Proposed: always the dialog. It is one tap, it covers "I came back three days later", and it is where an expired daily gets End run. Alternative: resume directly when the save is recent (e.g. under 30 min) and ask only otherwise.
2. ❓ **Daily after midnight**: proposed as above (End run only). Alternative: allow continuing on any day, keeping the pinned date — simpler, but opens the trophy/budget edges listed.
3. ❓ **End run vs Discard**: proposed End run (counts the run, like the in-game button). A "discard without counting" option seems to have no use and loses XP.
4. ❓ **Service worker reload mid-run**: with the save, a deploy mid-run becomes "reload → dialog → Continue". Optional extra: postpone the automatic reload while `gameActive`. Proposed: leave it out of Part A.

## Out of scope

- The gameover screen's unsaved timeline (`_pendingGameRecord`, saved only by "Save Timeline") is still lost if the app closes on the gameover screen — the run itself is already fully counted by then.
- Two tabs of the game open at once on a desktop could both offer Continue. Not guarded (the phone PWA runs one instance).
