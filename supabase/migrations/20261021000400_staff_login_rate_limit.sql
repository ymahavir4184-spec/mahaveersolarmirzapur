-- Shared atomic staff password-attempt limiter for serverless and multi-device deployments.
-- Legacy table/function names are retained; the login endpoint no longer uses this limiter.
-- Only the trusted server-side service role may use this table or function.
create table if not exists public.staff_login_rate_limits (
  ip_hash text primary key check (ip_hash ~ '^[0-9a-f]{24}$'),
  window_started_at timestamptz not null,
  attempt_count integer not null check (attempt_count > 0),
  expires_at timestamptz not null,
  updated_at timestamptz not null default now()
);

create index if not exists staff_login_rate_limits_expiry_idx
  on public.staff_login_rate_limits (expires_at);

alter table public.staff_login_rate_limits enable row level security;
revoke all on table public.staff_login_rate_limits from public, anon, authenticated;
grant all on table public.staff_login_rate_limits to service_role;

create or replace function public.consume_staff_login_limit_v1(
  p_ip_hash text,
  p_limit integer default 5,
  p_window_seconds integer default 900
) returns jsonb
language plpgsql volatile security definer set search_path = public, pg_temp as $$
declare
  v_now timestamptz := clock_timestamp();
  v_attempt_count integer;
begin
  if p_ip_hash is null or p_ip_hash !~ '^[0-9a-f]{24}$'
    or p_limit is null or p_limit < 1 or p_limit > 20
    or p_window_seconds is null or p_window_seconds < 60 or p_window_seconds > 3600 then
    raise exception 'invalid_rate_limit_arguments';
  end if;

  -- Bound cleanup work while removing stale anonymous IP hashes over time.
  delete from public.staff_login_rate_limits
    where ip_hash in (
      select ip_hash from public.staff_login_rate_limits
      where expires_at <= v_now order by expires_at limit 100
    );

  insert into public.staff_login_rate_limits as stored (
    ip_hash, window_started_at, attempt_count, expires_at, updated_at
  ) values (
    p_ip_hash, v_now, 1, v_now + make_interval(secs => p_window_seconds), v_now
  )
  on conflict (ip_hash) do update set
    attempt_count = case
      when stored.window_started_at <= v_now - make_interval(secs => p_window_seconds) then 1
      else stored.attempt_count + 1
    end,
    window_started_at = case
      when stored.window_started_at <= v_now - make_interval(secs => p_window_seconds) then v_now
      else stored.window_started_at
    end,
    expires_at = case
      when stored.window_started_at <= v_now - make_interval(secs => p_window_seconds)
        then v_now + make_interval(secs => p_window_seconds)
      else stored.expires_at
    end,
    updated_at = v_now
  returning attempt_count into v_attempt_count;

  return jsonb_build_object(
    'allowed', v_attempt_count <= p_limit,
    'remaining', greatest(0, p_limit - v_attempt_count)
  );
end;
$$;

revoke all on function public.consume_staff_login_limit_v1(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_staff_login_limit_v1(text, integer, integer) to service_role;
