# Persistence — Contract

Every piece of data Chronos keeps between sessions, and the rules for adding more. **Any change that reads or writes `localStorage` must keep this file in sync** — it is what the run save (Part A, `RUN_SAVE.md`) and the cloud sync (Part B, `CLOUD_SYNC.md`) are built on. Last reviewed against **v51** (2026-10-19).

## Principles

- **The device is the source of truth.** Everything lives in `localStorage` under `chronos_*` keys and the game works fully offline. The cloud (Part B) is a synchronised copy: it reads these keys, merges, writes them back and tells the game to reload its in-memory state. No other file knows the cloud exists.
- **Only `src/sync.js` touches the network** (Part B). Every other file keeps reading and writing `localStorage` as today.
- **Every key has a merge rule.** Two devices on the same account may both have played offline; their data is merged per data type, never "last write wins for everything".
- **Stored data is data, not code.** Whatever is read back — from this device or, later, from the cloud — is validated (type, shape, size) before use, and stored text is never inserted with `innerHTML` unescaped.

## When things are counted

A run changes saved data at two moments only. New code must pick one of them, because the run save's "never count twice" guarantee depends on it (`RUN_SAVE.md`, *No double counting*):

- **At the event** — written the moment it happens (a card placed, a mid-game trophy, a customization unlocked, the daily attempt burned). Must be persisted right away, in the same function.
- **At the end** — written only inside `endGame` (game.js), which runs once per run and, from Part A on, starts by clearing the run save.

Anything else that affects the end result but lives only in memory during the run (score, lives, `runFlags`…) must be part of the run save shape.

## Key registry

### Synced progress (Part B, `src/sync.js`, since v55)

Merge rules are defined at the bottom of this file.

| Key | Shape | Written by | When | Merge |
|---|---|---|---|---|
| `chronos_xp` | integer, total XP | `awardXp` (progression.js) | end | **counter** |
| `chronos_runs_played` | integer — runs finished with ≥ 1 card, any mode | `endGame` (game.js) | end | **counter** |
| `chronos_card_stats` | `{ "<card name>": { ok, miss, amiss, last } }`, `last` = 'YYYY-MM-DD'; every placement except a run's first card, skips don't count. By play mode (`REVIEW_MODE.md`, *Card stats and mastery*): `ok` = Lives + Review hits, `miss` = Lives misses (both feed mastery); `amiss` (since v60) = misses in every mode, feeds the Review deck; Free hits are not recorded. Saved before v60: `amiss` missing → loaded as `miss` (`loadSavedProgress`) | `recordCardResult` (game.js) | event | per card: `ok`, `miss`, `amiss` **counter** (`amiss` read as `max(miss, amiss)`); `last` **max** |
| `chronos_mode_records` | `{ "<mode>": { best, bestDate, mostPlaced, bestStreak, runs } }` (modes of `RECORD_MODES`, incl. `daily`); Lives runs only. `best` also unlocks the culture themes (`{ record }` rule, read only) | `recordModeResult` (progression.js) | end | per mode: `best` **max** (with its `bestDate`); `mostPlaced`, `bestStreak` **max**; `runs` **counter** |
| `chronos_trophies` | `{ "<trophy id>": ISO date }` | `checkTrophies` (game.js), family back-fill on load | event + end | **union**, earliest date per id |
| `chronos_discovered` | `["<card name>", …]` | `_eagerSaveDiscovered` (game.js) | end | **union** |
| `chronos_custom_known` | `["<customization id>", …]` — every item ever unlocked; keeps it unlocked for good (`isCustomUnlocked`, since v58) and stops repeated unlock notices | `checkCustomUnlocks` (progression.js) | event + end | **union, never remove** (an unlocked item is never lost, even if its requirement changes) |
| `chronos_best_streak` | integer — only where streak trophies can unlock; seeded on load from streak trophies earned | `attemptPlacement` (game.js) | event | **max** |
| `chronos_custom` | `{ "<category id>": "<item id>" }` — the item chosen per category (`CUSTOM_CATEGORIES`: `emblem`, `frame`, `title` since v58; `effect`, `theme` since phase 3 — a theme also overrides the dark/light look of `chronos_theme` while in use, without changing it); ids are checked against `CUSTOMIZATIONS`, so a new category or item needs no sync.js change | `selectCustomization` (progression.js) | on choice | **choice**, per category |
| `chronos_player_name` | string, ≤ `PLAYER_NAME_MAX` (20) | `setPlayerName` (progression.js) | on edit | **choice** |
| `chronos_review_history` | `[[names], [names]]`, newest first | `_rememberReviewTargets` (game.js) | Review run start | **choice**, whole value |
| `chronos_history` | `[record, …]`, newest first, max 30; a record may carry `miss` — the card of the run's last miss when it never made it into the timeline, `{ key (English name), name, year, span, era, cat }` (`buildGameRecord`, game.js) | `saveAndOpenHistory` (game.js), `confirmDel` (ui.js) | "Save timeline" / delete | **capped list** (`miss` travels with its record; optional, so no `SYNC_SCHEMA` bump) |
| `chronos_daily_YYYY-MM-DD` | `{ v:2, attempts, won, score, placed, timeline }` (legacy: `'1'` or v1 object) | `_commitDailyAttempt` (first placement), `_saveDailyResult` (end) | event + end | **daily record**; key presence = the streak |
| `chronos_recover_YYYY-MM-DD` | `{ v:3, day, attempts, tries, won, score, placed, timeline }` | same functions, recovery runs | event + end | **daily record** (recovery variant) |

### Device only — never synced

| Key | Shape | Why it stays |
|---|---|---|
| `chronos_sync` | sync bookkeeping (sync.js): user and device id, download cursor, last sync time, this device's counter contribution (`own`) and the totals last written (`base`), the other devices' latest contributions, the choices and history ids last synced, deleted history ids, a hash of the last uploaded row | describes this device's place in the account; removed at logout. Losing it while keeping the progress would make the next sync count this device's progress again — never delete it by hand |
| `chronos_run` | the run in progress (`RUN_SAVE.md`), written by `saveRun` / cleared by `clearRun` (runsave.js) | a run belongs to the device it is played on; syncing it would allow resuming on two phones and counting it twice |
| `sb-egyrmnrabblsskebkvuh-auth-token` (and keys with that prefix, e.g. `…-code-verifier` during a login) | the login session, written by the Supabase client library (sync.js) | a secret of this device; removed at logout. Not a `chronos_` key because the library names it |
| `chronos_prune_mark` | 'YYYY-MM-DD' watermark of the timeline sweep | housekeeping of this device's storage |
| `chronos_music_vol`, `chronos_sfx_vol` | 0–100 | device preference |
| `chronos_music_mute`, `chronos_sfx_mute` | 'true' / 'false' | device preference |
| `chronos_placed_trivia` | 'true' / 'false' | device preference |
| `chronos_hit_fx` | 'true' / 'false' — hit effects on or off (Settings → Appearance, `toggleHitFx` in ui.js); missing = on | device preference (phase 3) |
| `chronos_theme` | 'light' / 'dark' | device preference |
| `chronos_lang` | 'en' / 'pt' | device preference; written by `setLang`, applied on boot (ui.js) since B1 |

### Removed — do not reuse these names

| Key | Removed in | Notes |
|---|---|---|
| `chronos_tp_open` | v51 | trophy sections now always start closed; ui.js deletes the key on boot |

### Never stored

Kept in memory on purpose: preview-mode choices (`_previewCustom`, progression.js — preview never writes to `localStorage`), menu selections (`menuPlayMode`, `eraSelection`), `empiresShownTutorial`, the notice queue, the unsaved gameover record (`_pendingGameRecord`).

## Merge rules

Exact algorithms belong to the Part B spec; these are the categories every key must fit in.

- **union** — set union; ids are never removed by a merge.
- **max** — the larger value wins.
- **counter** — a number that only grows by adding (XP, runs, `ok`/`miss`). Never merged by plain sum (counts the shared base twice) nor by max (loses the other device's progress). Part B stores contributions per device, or deltas, so the merged total is exact.
- **choice** — a value the player picks. The most recent choice wins, per field; needs a change timestamp (Part B).
- **capped list** — merged by entry identity (`date`), newest first, cut to the cap. Deletions need a record of their own (tombstone), or a merge would bring a deleted entry back.
- **daily record** — per day: `attempts` max, `won` OR, the best run kept by the same rule as `_saveDailyResult` (won, then more cards placed, then higher score) together with its `timeline`. Recovery records also keep `tries` max and take `attempts` from the most recent `day`. After merging, timelines older than `DAILY_TIMELINE_RETENTION_DAYS` (120) are stripped again, so a merge never undoes the pruning.

## Adding or changing persisted data — checklist

For any new key, a new field inside an existing key, or a change of shape:

1. **Name**: `chronos_` + snake_case. Never reuse a removed name.
2. **Load** inside `loadSavedProgress()` (state.js) — or, for trophies, `_loadTrophies()` (game.js) — inside `try/catch`, checking the type and falling back to a default: old versions, other devices and hand edits all produce unexpected values. A load done anywhere else is not refreshed after a cloud sync.
3. **Register** it in the tables above: shape, writer, when, sync class and merge rule. A new field in a synced key needs its own merge rule (example: `bestStreak` → max).
4. **Prefer shapes that merge cleanly**: sets and maxima over counters, ISO dates, one key per independent piece. If a counter can be derived from data that is already stored, derive it instead.
5. **Pick the moment** — event or end (see *When things are counted*). If it is computed during the run from in-memory state, add that state to the run save: a new `runFlags` entry goes into `RUN_SAVE_FLAGS` (runsave.js); any other run variable goes into `saveRun` / `_parseRun` / `resumeSavedRun` and the shape in `RUN_SAVE.md`.
6. **Render stored text safely**: `textContent`, `.value` or `esc()` (ui.js). Never put stored strings into `innerHTML` unescaped.
7. **Bound the size**: caps on lists and strings (history 30, name 20). The whole store must stay well under 5 MB.
8. **Renames and removals**: keep reading the old form (lazy migration, like v1 daily records) or delete the old key on boot (like `chronos_tp_open`), and list it under *Removed*.
9. **Preview mode never writes** to `localStorage`.
10. **No secrets** in `localStorage` other than the login session Part B will document.
11. **Privacy policy**: if the change adds data that leaves the device (a new synced key, anything server-side), update `privacy.html` (pt + en) in the same change.
12. **Sync it**: a new synced key, or a new field in one, only reaches the cloud once `src/sync.js` knows it — read (`_syncReadLocal`), validated (`_syncCleanState`), merged (`_syncMerge`, plus `_syncFold` for a counter), uploaded (`_syncRowState`), written back (`_syncWriteLocal`) and wiped at logout (`SYNC_WIPE_KEYS`). Add a case to the multi-device test. A change that older clients could misread raises `SYNC_SCHEMA` (they then pause sync and ask to be updated); a new optional field doesn't.

## Fixed debt

- B1 (v53): `renderHistoryPanel` and the daily calendar escape stored text (`esc()`, numbers forced, mode whitelisted) before `innerHTML`; downloaded rows are validated by `_syncCleanState` before they reach `localStorage`.
