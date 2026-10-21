-- Password-confirmed logical deletion for staff estimates.
-- Archive and active-table deletion happen in one PostgreSQL transaction.

create table if not exists public.estimate_deletion_archive (
  archive_id uuid primary key default gen_random_uuid(),
  estimate_id uuid not null,
  estimate_number text not null,
  snapshot jsonb not null check (jsonb_typeof(snapshot) = 'object'),
  deleted_by text not null check (char_length(deleted_by) between 1 and 120),
  deleted_at timestamptz not null default clock_timestamp()
);

create index if not exists estimate_deletion_archive_deleted_at_idx
  on public.estimate_deletion_archive (deleted_at desc);
create index if not exists estimate_deletion_archive_estimate_number_idx
  on public.estimate_deletion_archive (estimate_number);

alter table public.estimate_deletion_archive enable row level security;
revoke all on table public.estimate_deletion_archive from public, anon, authenticated;
grant all on table public.estimate_deletion_archive to service_role;

create or replace function public.archive_and_delete_estimate_v1(
  p_estimate_id uuid,
  p_confirmation text,
  p_deleted_by text
) returns jsonb
language plpgsql volatile security definer set search_path = public, pg_temp as $$
declare
  v_estimate public.estimates%rowtype;
  v_archive_id uuid;
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

  insert into public.estimate_deletion_archive (
    estimate_id, estimate_number, snapshot, deleted_by, deleted_at
  ) values (
    v_estimate.id,
    v_estimate.estimate_number,
    to_jsonb(v_estimate),
    left(trim(p_deleted_by), 120),
    v_deleted_at
  ) returning archive_id into v_archive_id;

  delete from public.estimates where id = v_estimate.id;
  if not found then
    raise exception 'estimate_delete_failed';
  end if;

  return jsonb_build_object(
    'archive_id', v_archive_id,
    'estimate_id', v_estimate.id,
    'estimate_number', v_estimate.estimate_number,
    'deleted_at', v_deleted_at
  );
end;
$$;

revoke all on function public.archive_and_delete_estimate_v1(uuid, text, text) from public, anon, authenticated;
grant execute on function public.archive_and_delete_estimate_v1(uuid, text, text) to service_role;
