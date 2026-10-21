-- Server-side staff sessions with a shared 30-minute inactivity policy.
-- The browser receives only a random HttpOnly token; Supabase stores its hash.
create table if not exists public.staff_sessions (
  session_hash text primary key check (session_hash ~ '^[0-9a-f]{64}$'),
  staff_login_id text not null check (char_length(staff_login_id) between 1 and 120),
  created_at timestamptz not null default clock_timestamp(),
  last_activity_at timestamptz not null default clock_timestamp(),
  expires_at timestamptz not null,
  revoked_at timestamptz
);

create index if not exists staff_sessions_expiry_idx
  on public.staff_sessions (expires_at);
create index if not exists staff_sessions_activity_idx
  on public.staff_sessions (last_activity_at);

alter table public.staff_sessions enable row level security;
revoke all on table public.staff_sessions from public, anon, authenticated;
grant all on table public.staff_sessions to service_role;

create or replace function public.touch_staff_session_v1(
  p_session_hash text,
  p_idle_timeout_seconds integer default 1800
) returns text
language plpgsql volatile security definer set search_path = public, pg_temp as $$
declare
  v_now timestamptz := clock_timestamp();
  v_login_id text;
begin
  if p_session_hash is null or p_session_hash !~ '^[0-9a-f]{64}$'
    or p_idle_timeout_seconds is null or p_idle_timeout_seconds < 60 or p_idle_timeout_seconds > 3600 then
    raise exception 'invalid_staff_session_arguments';
  end if;

  -- Keep cleanup bounded. An inactive or expired row cannot be revived by this function.
  delete from public.staff_sessions
    where session_hash in (
      select session_hash
      from public.staff_sessions
      where expires_at <= v_now or revoked_at is not null
      order by expires_at
      limit 100
    );

  update public.staff_sessions
    set last_activity_at = v_now,
        expires_at = v_now + interval '90 days'
    where session_hash = p_session_hash
      and revoked_at is null
      and expires_at > v_now
      and last_activity_at > v_now - make_interval(secs => p_idle_timeout_seconds)
    returning staff_login_id into v_login_id;

  return v_login_id;
end;
$$;

revoke all on function public.touch_staff_session_v1(text, integer) from public, anon, authenticated;
grant execute on function public.touch_staff_session_v1(text, integer) to service_role;
