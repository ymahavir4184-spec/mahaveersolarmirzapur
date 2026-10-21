-- Optional order, dispatch and delivery fields printed in both bills and estimates.
alter table public.bills
  add column if not exists document_details jsonb not null default '{}'::jsonb;

alter table public.estimates
  add column if not exists document_details jsonb not null default '{}'::jsonb;

comment on column public.bills.document_details is 'Optional invoice header fields; empty values are printed blank.';
comment on column public.estimates.document_details is 'Optional estimate header fields; empty values are printed blank.';

-- Save optional invoice fields in the same transaction as the bill and its lines.
create or replace function public.create_bill_v2(
  p_request_id uuid,
  p_bill_prefix text,
  p_customer_name text,
  p_customer_mobile text,
  p_customer_address text,
  p_tax_mode text,
  p_items jsonb,
  p_seller_snapshot jsonb,
  p_created_by text,
  p_document_details jsonb
) returns jsonb
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_result jsonb;
  v_bill jsonb;
  v_existing public.bills%rowtype;
begin
  if p_document_details is not null and jsonb_typeof(p_document_details) <> 'object' then
    raise exception 'invalid_document_details';
  end if;
  perform pg_advisory_xact_lock(hashtextextended(p_request_id::text, 0));
  select * into v_existing from public.bills where request_id = p_request_id;
  if found then
    return jsonb_build_object(
      'bill', to_jsonb(v_existing),
      'items', coalesce((select jsonb_agg(to_jsonb(i) order by i.line_number) from public.bill_items i where i.bill_id = v_existing.id), '[]'::jsonb)
    );
  end if;
  v_result := public.create_bill_v1(
    p_request_id, p_bill_prefix, p_customer_name, p_customer_mobile, p_customer_address,
    p_tax_mode, p_items, p_seller_snapshot, p_created_by
  );
  -- The request lock above makes this a first creation, not a retry that can
  -- overwrite the original document details.
  update public.bills as b
    set document_details = coalesce(p_document_details, '{}'::jsonb)
    where b.id = (v_result #>> '{bill,id}')::uuid
    returning to_jsonb(b) into v_bill;
  if v_bill is null then raise exception 'bill_not_found'; end if;
  return jsonb_set(v_result, '{bill}', v_bill, true);
end;
$$;

revoke all on function public.create_bill_v2(uuid, text, text, text, text, text, jsonb, jsonb, text, jsonb) from public, anon, authenticated;
grant execute on function public.create_bill_v2(uuid, text, text, text, text, text, jsonb, jsonb, text, jsonb) to service_role;

-- Save optional estimate fields atomically with the estimate record.
create or replace function public.create_estimate_v2(
  p_request_id uuid,
  p_estimate_prefix text,
  p_customer_name text,
  p_customer_mobile text,
  p_customer_address text,
  p_tax_mode text,
  p_items jsonb,
  p_seller_snapshot jsonb,
  p_created_by text,
  p_document_details jsonb
) returns jsonb
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_result jsonb;
  v_estimate jsonb;
  v_existing public.estimates%rowtype;
begin
  if p_document_details is not null and jsonb_typeof(p_document_details) <> 'object' then
    raise exception 'invalid_document_details';
  end if;
  perform pg_advisory_xact_lock(hashtextextended(p_request_id::text, 0));
  select * into v_existing from public.estimates where request_id = p_request_id;
  if found then
    return jsonb_build_object('estimate', to_jsonb(v_existing), 'items', v_existing.items);
  end if;
  v_result := public.create_estimate_v1(
    p_request_id, p_estimate_prefix, p_customer_name, p_customer_mobile, p_customer_address,
    p_tax_mode, p_items, p_seller_snapshot, p_created_by
  );
  update public.estimates as e
    set document_details = coalesce(p_document_details, '{}'::jsonb)
    where e.id = (v_result #>> '{estimate,id}')::uuid
    returning to_jsonb(e) into v_estimate;
  if v_estimate is null then raise exception 'estimate_not_found'; end if;
  return jsonb_set(v_result, '{estimate}', v_estimate, true);
end;
$$;

revoke all on function public.create_estimate_v2(uuid, text, text, text, text, text, jsonb, jsonb, text, jsonb) from public, anon, authenticated;
grant execute on function public.create_estimate_v2(uuid, text, text, text, text, text, jsonb, jsonb, text, jsonb) to service_role;
