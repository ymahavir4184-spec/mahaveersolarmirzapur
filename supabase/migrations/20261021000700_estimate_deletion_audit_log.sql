-- Replace full recovery snapshots with a compact, immutable deletion audit log.
-- Estimate row deletion and audit insertion run atomically in one transaction.

drop function if exists public.archive_and_delete_estimate_v1(uuid, text, text);
drop table if exists public.estimate_deletion_archive;

create table if not exists public.estimate_deletion_log (
  audit_id uuid primary key default gen_random_uuid(),
  estimate_id uuid not null unique,
  estimate_number text not null,
  estimate_date date not null,
  customer_name text not null,
  grand_total numeric(14,2) not null check (grand_total >= 0),
  deleted_by text not null check (char_length(deleted_by) between 1 and 120),
  deleted_at timestamptz not null default clock_timestamp()
);

create index if not exists estimate_deletion_log_deleted_at_idx
  on public.estimate_deletion_log (deleted_at desc);

alter table public.estimate_deletion_log enable row level security;
revoke all on table public.estimate_deletion_log from public, anon, authenticated;
revoke all on table public.estimate_deletion_log from service_role;
grant select on table public.estimate_deletion_log to service_role;

create or replace function public.delete_estimate_with_audit_v1(
  p_estimate_id uuid,
  p_confirmation text,
  p_deleted_by text
) returns jsonb
language plpgsql volatile security definer set search_path = public, pg_temp as $$
declare
  v_estimate public.estimates%rowtype;
  v_audit_id uuid;
  v_deleted_at timestamptz := clock_timestamp();
begin
  if p_estimate_id is null
    or p_confirmation is null
    or char_length(p_confirmation) > 160
    or p_deleted_by is null
    or char_length(trim(p_deleted_by)) not between 1 and 120 then
    raise exception 'invalid_estimate_delete_arguments' using errcode = '22023';
  end if;

  select * into v_estimate
    from public.estimates
    where id = p_estimate_id
    for update;

  if not found then
    raise exception 'estimate_not_found' using errcode = 'P0002';
  end if;
  if p_confirmation <> v_estimate.estimate_number then
    raise exception 'estimate_confirmation_mismatch' using errcode = '22023';
  end if;

  insert into public.estimate_deletion_log (
    estimate_id, estimate_number, estimate_date, customer_name, grand_total, deleted_by, deleted_at
  ) values (
    v_estimate.id, v_estimate.estimate_number, v_estimate.estimate_date,
    v_estimate.customer_name, v_estimate.grand_total,
    left(trim(p_deleted_by), 120), v_deleted_at
  ) returning audit_id into v_audit_id;

  delete from public.estimates where id = v_estimate.id;
  if not found then raise exception 'estimate_delete_failed'; end if;

  return jsonb_build_object(
    'audit_id', v_audit_id,
    'estimate_id', v_estimate.id,
    'estimate_number', v_estimate.estimate_number,
    'grand_total', v_estimate.grand_total,
    'deleted_by', left(trim(p_deleted_by), 120),
    'deleted_at', v_deleted_at
  );
end;
$$;

revoke all on function public.delete_estimate_with_audit_v1(uuid, text, text) from public, anon, authenticated;
grant execute on function public.delete_estimate_with_audit_v1(uuid, text, text) to service_role;
