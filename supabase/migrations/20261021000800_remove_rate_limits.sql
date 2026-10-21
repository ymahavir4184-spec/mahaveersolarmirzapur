-- Rate limiting and lead cooldowns were removed from the application.
-- Drop the old staff-delete attempt counter table and its RPC.
begin;

drop function if exists public.consume_staff_login_limit_v1(text, integer, integer);
drop table if exists public.staff_login_rate_limits;

commit;
