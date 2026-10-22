-- Validate and touch the staff session in the same RPC transaction that saves
-- a bill or estimate, avoiding a separate session-validation network request.
-- Existing bill and estimate data is not migrated or rewritten.

create or replace function public.create_bill_with_staff_session_v1(
  p_session_hash text,
  p_idle_timeout_seconds integer,
  p_request_id uuid,
  p_bill_prefix text,
  p_customer_name text,
  p_customer_mobile text,
  p_customer_address text,
  p_tax_mode text,
  p_items jsonb,
  p_seller_snapshot jsonb,
  p_document_details jsonb
) returns jsonb
language plpgsql volatile security definer set search_path = public, pg_temp as $$
declare
  v_staff_login_id text;
begin
  v_staff_login_id := public.touch_staff_session_v1(p_session_hash, p_idle_timeout_seconds);
  if v_staff_login_id is null then
    raise exception 'staff_session_invalid' using errcode = '28000';
  end if;

  return public.create_bill_v2(
    p_request_id,
    p_bill_prefix,
    p_customer_name,
    p_customer_mobile,
    p_customer_address,
    p_tax_mode,
    p_items,
    p_seller_snapshot,
    v_staff_login_id,
    p_document_details
  );
end;
$$;

revoke all on function public.create_bill_with_staff_session_v1(text, integer, uuid, text, text, text, text, text, jsonb, jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.create_bill_with_staff_session_v1(text, integer, uuid, text, text, text, text, text, jsonb, jsonb, jsonb) to service_role;

create or replace function public.create_estimate_with_staff_session_v1(
  p_session_hash text,
  p_idle_timeout_seconds integer,
  p_request_id uuid,
  p_estimate_prefix text,
  p_customer_name text,
  p_customer_mobile text,
  p_customer_address text,
  p_tax_mode text,
  p_items jsonb,
  p_seller_snapshot jsonb,
  p_document_details jsonb
) returns jsonb
language plpgsql volatile security definer set search_path = public, pg_temp as $$
declare
  v_staff_login_id text;
begin
  v_staff_login_id := public.touch_staff_session_v1(p_session_hash, p_idle_timeout_seconds);
  if v_staff_login_id is null then
    raise exception 'staff_session_invalid' using errcode = '28000';
  end if;

  return public.create_estimate_v2(
    p_request_id,
    p_estimate_prefix,
    p_customer_name,
    p_customer_mobile,
    p_customer_address,
    p_tax_mode,
    p_items,
    p_seller_snapshot,
    v_staff_login_id,
    p_document_details
  );
end;
$$;

revoke all on function public.create_estimate_with_staff_session_v1(text, integer, uuid, text, text, text, text, text, jsonb, jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.create_estimate_with_staff_session_v1(text, integer, uuid, text, text, text, text, text, jsonb, jsonb, jsonb) to service_role;
