# Cloud Sync — Specification (Part B)

Login and progress sync between devices with Supabase. Part B of `CLOUD_SYNC.md`; built on the key registry of `PERSISTENCE.md` and on the run save of `RUN_SAVE.md` (Part A). **Status: approved 2026-10-19** — decisions recorded at the end. B1 (setup, login, security) merged as v53 and tested on Android and iPhone. B2 (sync) implemented on `feat/sync-b2` — see *B2 implementation notes*. Written against v52.

## Goals

- Log in on another phone and get all progress back.
- Play on the same account on more than one device, offline included, without losing or doubling anything.
- The game stays **offline-first**: `localStorage` remains the source of truth and the game works the same logged out, offline, or with the server paused. The cloud is a copy.

## Supabase free plan — facts this design relies on

Checked on 2026-10-19 in Supabase's official pages ([pricing](https://supabase.com/pricing), [project pausing](https://supabase.com/docs/guides/platform/free-project-pausing), [changelog: 90-day restore](https://supabase.com/changelog/27497-paused-free-plan-projects-are-restorable-for-90-days), [auth rate limits](https://supabase.com/docs/guides/auth/rate-limits), [auth SMTP](https://supabase.com/docs/guides/auth/auth-smtp)).

| Limit (Free) | Value | What it means for Chronos |
|---|---|---|
| Active projects | 2 | one is enough |
| Database | 500 MB per project | a player is a few rows of ≤ 1 MB — thousands of players fit |
| Egress | 5 GB / month (+ 5 GB cached) | sync downloads only what changed (see *Sync cycle*) |
| Auth users | 50,000 monthly active | far above need |
| Edge Functions | 500,000 invocations / month | only Part C would use them |
| Backups | **none** on Free | the devices' `localStorage` is the real backup (see *Server lost*) |
| Built-in auth email | **2 emails / hour**, and only to addresses that are members of the project's team; "not meant for production" | e-mail login for anyone else needs a custom SMTP provider (decision 1) |

**Pausing**: Free projects with *low database activity over 7 days* are paused; "a few user requests to the database each day" is enough to prevent it. Supabase emails the owner about a week before pausing and again once paused.
**Restoring**: one click (*Resume project*) in the dashboard brings back data and configuration. The official changelog says restorable for **90 days** after the pause (the docs page contradicts itself between 90 days and 1 year — we plan for 90). After that window the dashboard only offers a download of the last backup (taken just before the pause) to move into a new project.
**While paused or offline**: every request fails; the game ignores the failure, keeps working locally and retries later in silence.

## Phases

| Phase | Content | Why separate |
|---|---|---|
| **B1** | Supabase project and schema, keep-alive, login/logout UI (no sync yet), escaping of stored text, Content Security Policy | login inside an installed PWA is the riskiest part — it must be proven on the phone before building on it |
| **B2** | sync engine (merge, metadata, triggers), sync status UI | — |

Each phase: own branch, tests, commits; browser test → `sw.js` bump → merge → phone test.

## Architecture

```
game files ──read/write──► localStorage (chronos_*)  ◄──read/merge/write── sync.js ──HTTPS──► Supabase
                                                       └─ tells the game to reload its in-memory state
```

- `src/sync.js` is the only file that touches the network or knows Supabase exists.
- `src/vendor/supabase-2.117.2.js`: the official client (`@supabase/supabase-js`, UMD build), pinned, served from the repo and cached by the service worker.
- `ui.js` draws the account block and the sync status, calling functions of sync.js.
- `supabase/` holds the SQL (schema, policies, functions), so the server never has configuration that exists only in the dashboard. `.github/workflows/` holds the keep-alive.

### One row per device

The account's data is **one row per device** (`device_states`). Each device writes **only its own row** — its full local view of the merged data, plus its *own contribution* to every counter — and reads the others' rows to merge.

Why: no device ever overwrites another device's data, so two devices syncing at the same moment can't clobber each other, and no locking is needed. Every merge rule below is commutative and idempotent (union, max, sum of per-device contributions, latest choice), so merging rows in any order, any number of times, gives the same result.

### Counters (XP, runs played, `ok`/`miss`, mode `runs`)

Plain sum counts the shared base twice; plain max loses the other device's progress. Instead each device keeps **its own contribution** to each counter (a "grow-only counter"):

- `sync.js` remembers, per counter, the merged value it last wrote (`base`) and this device's contribution (`own`).
- At the next sync, local value `L` minus `base` is what was earned here since: `own += max(0, L − base)`.
- Merged value = `own` + the latest `own` of every other device. It is written back to `localStorage`, and becomes the new `base`.

The game code is unchanged: it keeps adding to `chronos_xp` etc. as today. A device that has never synced has `base = 0`, so all its local progress becomes its contribution — which is exactly right for a first login.

## Data per key

From the registry in `PERSISTENCE.md`. "Row" is what the device uploads.

| Key | Row holds | Merge |
|---|---|---|
| `chronos_xp`, `chronos_runs_played` | own contribution | sum of contributions |
| `chronos_card_stats` | per card: own `ok`, own `miss`; `last` | `ok`/`miss`: sum of contributions; `last`: max |
| `chronos_mode_records` | per mode: `best` + `bestDate`, `mostPlaced`, `bestStreak`; own `runs` | `best` max (its `bestDate` follows; tie → earlier date); `mostPlaced`, `bestStreak` max; `runs` sum of contributions |
| `chronos_trophies` | id → date | union, earliest date per id |
| `chronos_discovered`, `chronos_custom_known` | set | union, never remove |
| `chronos_best_streak` | value | max |
| `chronos_custom` | per category: item id + time it changed | latest change wins, per category |
| `chronos_player_name`, `chronos_review_history` | value + time it changed | latest change wins |
| `chronos_history` | entries (id = `date`) + ids deleted | union of entries minus deleted ids, newest first, cut to 30 |
| `chronos_daily_*` | every day's record | per day: `attempts` max, `won` OR, best run (won, then placed, then score) with its timeline |
| `chronos_recover_*` | every day's record | per day: `won` OR, best run as above, `tries` max, `attempts` from the most recent `day` |

Details:
- **"Time it changed"**: the game doesn't record when a choice changes. `sync.js` compares the local value with the value it last synced; if different, the change is stamped with the time it noticed it. Device clocks may disagree by minutes — acceptable for a name or an emblem.
- **History deletions**: entries present at the last sync and now missing locally were deleted by the player → their ids go into the deleted set, which syncs, so the deletion reaches the other devices instead of the entry coming back. The deleted set keeps the latest 100 ids.
- **Daily timelines**: after merging, timelines older than `DAILY_TIMELINE_RETENTION_DAYS` are stripped again, so a merge never undoes the pruning.
- **Two phones, same day, offline**: if both play attempt 1 of the same daily offline, the merged day shows 1 attempt used, not 2 — the player gets one extra try across devices. Accepted (needs two phones offline on the same day).
- **Unknown data from a newer version** (a new trophy, a renamed card): an older client drops what it doesn't know from its *local* view, but never from the other device's row, so nothing is lost; it shows up once the device updates.
- **Never synced**: everything in *Device only* of `PERSISTENCE.md` — `chronos_run`, volumes, mute, `chronos_placed_trivia`, `chronos_prune_mark`, and `chronos_theme` / `chronos_lang` (both per device).

## Sync cycle

Runs only when logged in, online, **no run is active** (`gameActive` false — a resumed run included) and no other cycle is running.

1. **Download** the rows of this account updated since the last cycle (cursor = latest server `updated_at` seen; the first cycle downloads all). The own row is skipped.
2. **Validate** every row (see *Security*). A row with a newer `schema_version` than this client supports pauses sync and shows "Update the app to sync".
3. **Merge — synchronous, one JS task** (so the game can't write in between): read the local keys → fold local changes into the own row (counter deltas, changed choices, deleted history ids) → merge own row + every other device's latest row → write the merged keys to `localStorage` → save the metadata (`chronos_sync`).
4. **Reload the game's in-memory state** from `localStorage` (`xp`, trophies, card stats… — the loaders in state.js/game.js become a function called at boot and here) and re-render the open screen.
5. **Upload** the own row (upsert). If it fails, nothing is lost: the contributions are already in the metadata and go up at the next cycle.

Other devices' latest counter contributions are cached in the metadata, so step 1 never needs to re-download rows that didn't change.

### When it runs
- app opened (after the run-save check; deferred until the run ends if one was resumed);
- end of a run (after the gameover screen is drawn);
- after logging in;
- back online (`online` event), or back in the foreground after ≥ 5 minutes;
- "Sync now" button.
Failures retry in silence (1, 5, 15, 60 min) while the app is open. Never during a run, never blocking the screen.

## Scenarios

| Situation | What happens | What the player sees |
|---|---|---|
| **First login, phone already has progress, account also has progress** | this phone's progress becomes its contribution and is merged with the account | both add up: XP of both, all trophies, all cards; nothing is lost or doubled |
| **New phone, empty** | downloads everything | full progress after the first sync, a few seconds after logging in |
| **Two phones syncing at the same time** | each writes its own row; nothing conflicts | each phone sees the other's latest progress at its next sync (next opening or end of a run) |
| **Played offline on two phones** | each keeps its contribution locally | everything adds up when they come online |
| **Server paused or offline** | requests fail silently, retried later | game works normally; the account block says "No connection — will retry" |
| **Logout** | sync, then clear the synced keys on this device | the phone goes back to a fresh profile; logging in again brings everything back. Offline: "Connect to log out without losing progress", with a "Log out anyway" option |
| **Browser data cleared, then login again** | new device id; downloads the account | everything comes back except what was played after the last sync |
| **Phone lost** | its row stays in the account (its contributions are part of the totals) | nothing to do; progress is safe up to that phone's last sync |
| **Server lost** (project deleted, or paused > 90 days) | each device still has its full progress locally | log in to a new project and the devices fill it again; only progress that existed on no surviving device is lost |

## Schema (`supabase/migrations/0001_sync.sql`)

```sql
create table public.device_states (
  user_id        uuid not null default auth.uid() references auth.users(id) on delete cascade,
  device_id      text not null check (char_length(device_id) between 16 and 64),
  schema_version int  not null check (schema_version >= 1),
  app_version    text check (char_length(app_version) <= 16),
  state          jsonb not null check (octet_length(state::text) <= 1048576),   -- 1 MB
  updated_at     timestamptz not null default now(),
  primary key (user_id, device_id)
);
alter table public.device_states enable row level security;

create policy "read own rows"   on public.device_states for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "insert own rows" on public.device_states for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "update own rows" on public.device_states for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
-- No delete policy: a device row holds counter contributions; deleting it would drop progress.

-- updated_at comes from the server clock, never from the client
create function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;
create trigger device_states_touch before insert or update on public.device_states
  for each row execute function public.touch_updated_at();

-- Keep-alive (see below): one row, readable by nobody, touched by a function
create table public.keepalive (id int primary key check (id = 1), pinged_at timestamptz not null);
alter table public.keepalive enable row level security;   -- no policies: no direct access
insert into public.keepalive values (1, now());
create function public.keepalive() returns timestamptz
  language sql security definer set search_path = '' as $$
  update public.keepalive set pinged_at = now() where id = 1 returning pinged_at $$;
revoke all on function public.keepalive() from public;
grant execute on function public.keepalive() to anon, authenticated;
```

Every table has RLS on; `device_states` has a policy per operation, limited to the user's own rows; `keepalive` has none (only its function touches it). Account deletion cascades to the rows.

## Security

- **Keys**: the project URL and the *publishable* key (`sb_publishable_…`, which replaces the legacy `anon` key — Supabase deprecates the legacy keys by the end of 2026, [API keys](https://supabase.com/docs/guides/api/api-keys)) go in `sync.js` — public by design, protected by RLS. It is sent in the `apikey` header. The secret key (formerly `service_role`) and the database password are never used by the game or the workflow, and never go to git.
- **Login flow**: OAuth with PKCE (`flowType: 'pkce'`), so no token ever appears in the URL. Google scopes: only `openid email profile`.
- **Where the session lives**: the client keeps the session in this device's `localStorage` under `sb-<project-ref>-auth-token` (an access token valid ~1 h and a refresh token). Any script running on the page could read it and act as the player — but only on the player's own rows (RLS). That is why the game must have **no path that runs HTML or script from outside**:
  - **Stored text is escaped** (B1, before any cloud data exists): `renderHistoryPanel` and the daily calendar entry build HTML from stored records today (card names, era, mode, score). They switch to `esc()` / `textContent`; the mode goes through a whitelist before becoming a CSS class. Every other `innerHTML` that shows saved data (trophy dates, mode records, daily card footer) is audited the same way.
  - **Downloaded data is validated** before it reaches `localStorage`: known types and shapes only, numbers finite integers in range, strings length-capped (name ≤ 20, card names ≤ 100), ids checked against `TROPHY_DEFS` / `CUSTOMIZATIONS` / the card list, dates in `YYYY-MM-DD` or ISO form, a row over 1 MB rejected. An invalid entry is dropped, not the whole row.
  - **Content Security Policy**, as a `<meta>` in index.html: scripts only from the site itself (`'unsafe-inline'` is still needed for the 80 inline `onclick` handlers), network only to the site, Supabase and Google Fonts. Even if something slipped through, it couldn't send the token anywhere else.
    `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; media-src 'self' data:; connect-src 'self' https://<project-ref>.supabase.co; base-uri 'none'; form-action 'none'`
- **Third-party code**: the client library is a pinned file in the repo (a version published at least two weeks earlier), its SHA-256 recorded here; updating it is a deliberate commit. Current: `src/vendor/supabase-2.117.2.js` = the npm package's `dist/umd/supabase.js` (published 2026-09-25), SHA-256 `59d39487c3589843b410322d8a3d562ce022aba1e5ccb16898ef3fb2a0da2ecd` — the CDN copy and the npm tarball matched. Kept byte-exact by `src/vendor/.gitattributes`.
- **Size and abuse**: rows capped at 1 MB by the database itself; a client can only ever write its own rows.

## Keep-alive

The game's own syncs are database activity, but a week without playing would still pause the project. A **GitHub Actions** workflow (`.github/workflows/supabase-keepalive.yml`) calls the `keepalive()` database function on a schedule.

- **How often**: **once a day**. Supabase pauses on *low* activity over 7 days and cites "a few requests each day" as enough; one call every 6 days might be judged too little, and GitHub may delay or skip a scheduled run when it is busy. A daily call costs nothing.
- It uses the publishable key (a repository secret, for tidiness) and does nothing but update one timestamp.
- **If it fails** (server paused, key changed), the run fails and GitHub emails you.
- **GitHub's 60-day rule**: in a public repository, scheduled workflows are switched off after 60 days without any commit. Commits are frequent in this project; if the game ever goes two months untouched, the workflow must be re-enabled in the Actions tab. Two more safety nets remain: Supabase's warning email a week before pausing, and the 90-day one-click restore.
- It can also be started by hand (Actions → *Supabase keep-alive* → *Run workflow*), which is also how it is tested.

## UI

An **Account** section in the Progress tab, under the profile and level bar — where the player's identity already lives. It folds like Stats and Customization (closed when the panel opens; the folded header says "Signed in" / "Not signed in"). Nothing changes on the game screen.
- Logged out: one line ("Keep your progress safe and play on any phone") and the login button(s).
- Logged in: the account's e-mail; status — "Synced just now" / "Synced 3 h ago" / "No connection — will retry" / "Update the app to sync"; **Sync now**; **Log out**.
All text in en + pt.

## Files

| File | Change |
|---|---|
| `src/sync.js` (new) | session, login/logout, sync cycle, merge (pure functions, testable in Node), metadata |
| `src/vendor/supabase-2.117.2.js` (new) | pinned client library |
| `src/state.js`, `src/game.js` | loaders become functions, so sync can reload the in-memory state |
| `src/ui.js` | account block, status, re-render after a sync; escaping of stored text (B1) |
| `src/i18n.js` | account/sync strings, en + pt |
| `index.html` | scripts, account block markup, CSP `<meta>` |
| `sw.js` | new files in `FILES`; version bump; Supabase calls stay uncached (cross-origin) |
| `supabase/migrations/0001_sync.sql` (new) | schema above |
| `.github/workflows/supabase-keepalive.yml` (new) | keep-alive |
| `documentation/SUPABASE_SETUP.md` (new) | step-by-step setup outside VS Code (Supabase, Google, GitHub) |
| `documentation/PERSISTENCE.md`, `CLAUDE.md` | new keys, `sync.js` and `supabase/` from planned to current |

### New `localStorage` keys (device only)
- `chronos_sync` — sync metadata (full description in `PERSISTENCE.md`). Removed at logout.
- `sb-<project-ref>-auth-token` — the login session, written by the client library. Removed at logout.

## B2 implementation notes

Details settled while building B2 (`src/sync.js`), beyond the design above:

- **Choices on a first sync**: a device that never synced stamps its local choices (name, emblem, frame, review history) with time −1, below anything stored in the account (≥ 0). So a fresh phone — or one played logged out for months — takes the account's name and emblem instead of overwriting them; later changes on it are stamped with the real time and win normally. The first device of a brand-new account keeps its own (there is nothing else).
- **Order of writes**: the metadata (`chronos_sync`, with the new `own` and `base`) is saved before the merged keys. If a write fails halfway, the next cycle can't count a delta twice.
- **Download cursor**: the latest server `updated_at` seen, minus one minute — rows are re-read a little (merges are idempotent) so a row committed late is never skipped.
- **Upload only on change**: a hash of the last uploaded row; an unchanged row is not sent again.
- **One cycle at a time**: a second call joins the one in flight; other tabs of the same browser wait on a Web Lock (`navigator.locks`) where available.
- **Never during a run**: `syncNow` refuses while `gameActive`, and a cycle whose download finished after a run started stops before writing; `endGame` calls `syncSoon()` once the gameover is drawn.
- **In-memory reload**: `onSyncApplied` (ui.js) → `reloadSavedProgress` (game.js: `loadSavedProgress` in state.js + `_loadTrophies`) and a redraw of whatever panel is open.
- **Another account on this phone** (the metadata belongs to a different user id — only possible if a session expired and someone else logged in): sync pauses and the account block asks to sign out, which clears the phone.
- **Logout**: always asks first ("your progress stays in your account and is removed from this phone"); if the final sync fails it asks again, saying what would be lost. Signing out reloads the page into a fresh profile. Device preferences (volume, theme, language, trivia) stay.
- **Status line** in the account block: synced just now / n min / n h ago / on a date, syncing, no connection (retrying 1, 5, 15, 60 min), update the app, another account.
- **Tests**: `sync_test.js` (multi-device, fake server) covers the scenarios table, a forged row, a newer schema, server down and back, logout and login again.

## Ready for Part C (ranking)

- Rankings never read `device_states`: that data is written by the client and can be forged.
- Part C adds its own tables — e.g. `runs` (started by an Edge Function that hands out the deck seed) and `scores` (written **only** by an Edge Function that recomputes the score from the placements, using the same card data) — with RLS that lets clients read the leaderboard and write nothing.
- Part B already provides what C needs: an authenticated user id (`auth.uid()`), RLS on every table, versioned SQL in `supabase/`. A public display name will need its own validated table then.

## Testing

- **Node** (like Part A): the merge functions with two or three simulated devices — offline play on both then sync, first login with progress on both sides, simultaneous syncs, history deletion, logout and login again, cleared data, a forged/oversized row, a row from a newer schema. Check that totals never double and never drop.
- **Desktop browser** against the real project: login, sync between two browser profiles (= two devices), offline (DevTools) and back.
- **Phone**: login inside the installed app (B1), then two devices for real (B2).

## Login on Android and iPhone

**Tested 2026-10-20 (v53): login works inside the installed app on Android and on iPhone (Home Screen app) — none of the fallbacks below was needed.** Kept here in case a future iOS version changes the behaviour.

Login is Google only. Inside an installed app, Google's page is outside the app's address, so the phone shows it in a browser view and then has to come back to the app with the login:

- **Android** (the developer's phone, tested first): Chrome installed apps share the browser's storage and return to the app when the login redirects back to `https://szyfman.github.io/chronos/`. Expected to work; proven in B1.
- **iPhone** (friends' phones — not optional, but tested after Android): an app added to the Home Screen keeps its storage **separate from Safari**. If iOS opens Google's page in Safari and the redirect lands there, the login ends up in Safari, not in the app. This must be tested on a real iPhone during B1. If it fails, options in order of preference:
  1. Google's own sign-in button (Google Identity Services), which returns an ID token to the page without leaving it, passed to Supabase with `signInWithIdToken`;
  2. a one-time pairing code: a phone already logged in shows a short code that the iPhone types in;
  3. an e-mail 6-digit code (needs a custom SMTP account).
  Logged-out play keeps working on any phone meanwhile.

## Decisions (approved 2026-10-19)

1. **Login**: Google only. Android first; iPhone must work before Part B is considered done (see above).
2. **Client library**: `@supabase/supabase-js` 2.117.2, pinned copy in `src/vendor/`.
3. **Logout**: sync, then clear this device's progress; offline, warn before logging out.
4. **Account block**: Progress tab, under the profile.
5. **Theme and language**: per device. The `chronos_lang` boot bug is fixed in B1.
6. **Keep-alive**: once a day.
7. **When to sync**: the moments in *When it runs*.
8. **Content Security Policy**: added in B1.

## Out of scope

- Account deletion from inside the game (done by hand in the dashboard if ever asked).
- Merging two different accounts into one.
- Live sync while two phones are open at once (each sees the other at its next cycle).
- Part C itself.
