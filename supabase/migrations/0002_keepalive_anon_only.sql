-- ── 0002_keepalive_anon_only.sql ──────────────────────────────────────────
-- keepalive() is called only by the GitHub keep-alive workflow, which is not
-- signed in (anon). Signed-in players never need it. Supabase grants EXECUTE
-- on new functions to anon and authenticated by default, so 0001's
-- "revoke ... from public" did not remove that grant.
-- The Security Advisor keeps one intentional warning: anon can execute this
-- SECURITY DEFINER function. It is safe: the function takes no input and only
-- updates one timestamp in a table nobody else can read or write.
-- ─────────────────────────────────────────────────────────────────────────

revoke execute on function public.keepalive() from authenticated;
