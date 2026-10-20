-- ── 0001_sync.sql ─────────────────────────────────────────────────────────
-- Cloud sync (Part B): one row per device, keep-alive. Design and the reasons
-- behind each rule: documentation/CLOUD_SYNC_SPEC.md.
-- Run once in the Supabase dashboard (SQL Editor → New query → Run).
-- Every table has row level security on; no table is left without a policy
-- decision (keepalive has none on purpose: only its function touches it).
-- ─────────────────────────────────────────────────────────────────────────

-- ── DEVICE STATES ─────────────────────────────────────────────────────────
-- Each device writes only its own row: its merged view of the progress plus
-- its own contribution to every counter. Rows are never deleted by clients —
-- a row's contributions are part of the account's totals.
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

create policy "read own rows" on public.device_states
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "insert own rows" on public.device_states
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "update own rows" on public.device_states
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Explicit grants, so the table's exposure never depends on project defaults
revoke all on public.device_states from anon, authenticated;
grant select, insert, update on public.device_states to authenticated;

-- updated_at always comes from the server clock, never from the client
create function public.touch_updated_at() returns trigger
  language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

create trigger device_states_touch
  before insert or update on public.device_states
  for each row execute function public.touch_updated_at();

-- ── KEEP-ALIVE ────────────────────────────────────────────────────────────
-- Free projects pause after 7 days of low database activity. A GitHub Actions
-- workflow (.github/workflows/supabase-keepalive.yml) calls keepalive() once a
-- day: it updates one timestamp and returns it. The table itself is readable
-- and writable by nobody but this function.
create table public.keepalive (
  id        int primary key check (id = 1),
  pinged_at timestamptz not null
);

alter table public.keepalive enable row level security;
revoke all on public.keepalive from anon, authenticated;

insert into public.keepalive values (1, now());

create function public.keepalive() returns timestamptz
  language sql security definer set search_path = '' as $$
  update public.keepalive set pinged_at = now() where id = 1 returning pinged_at
$$;

revoke all on function public.keepalive() from public;
grant execute on function public.keepalive() to anon, authenticated;
