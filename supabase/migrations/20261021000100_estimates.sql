-- Staff-only A4 estimate storage. Run once in the Supabase SQL Editor.
create sequence if not exists public.estimate_number_seq;

create table if not exists public.estimates (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique,
  estimate_number text not null unique,
  estimate_date date not null default current_date,
  customer_name text not null check (length(trim(customer_name)) between 2 and 160),
  customer_mobile text not null check (length(trim(customer_mobile)) between 10 and 16),
  customer_address text not null default '',
  document_details jsonb not null default '{}'::jsonb,
  tax_mode text not null default 'none' check (tax_mode in ('none', 'intra', 'inter')),
  subtotal numeric(14,2) not null check (subtotal >= 0),
  tax_total numeric(14,2) not null check (tax_total >= 0),
  grand_total numeric(14,2) not null check (grand_total >= 0),
  items jsonb not null check (jsonb_typeof(items) = 'array' and jsonb_array_length(items) between 1 and 100),
  seller_snapshot jsonb not null default '{}'::jsonb,
  created_by text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists estimates_date_idx on public.estimates (estimate_date desc, created_at desc);
create index if not exists estimates_mobile_idx on public.estimates (customer_mobile);
create index if not exists estimates_customer_name_idx on public.estimates (lower(customer_name));

-- Recover numbering after an older/manual import so newly saved estimates stay unique.
do $$
declare
  v_max_number bigint;
  v_last_number bigint;
begin
  select coalesce(max(substring(estimate_number from '([0-9]+)$')::bigint), 0)
    into v_max_number from public.estimates;
  select last_value into v_last_number from public.estimate_number_seq;
  if v_max_number > v_last_number then
    perform setval('public.estimate_number_seq', v_max_number, true);
  end if;
end;
$$;

alter table public.estimates enable row level security;
revoke all on table public.estimates from anon, authenticated;
grant all on table public.estimates to service_role;

create or replace function public.create_estimate_v1(
  p_request_id uuid,
  p_estimate_prefix text,
  p_customer_name text,
  p_customer_mobile text,
  p_customer_address text,
  p_tax_mode text,
  p_items jsonb,
  p_seller_snapshot jsonb,
  p_created_by text
) returns jsonb
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_existing public.estimates%rowtype;
  v_estimate public.estimates%rowtype;
  v_item jsonb;
  v_lines jsonb := '[]'::jsonb;
  v_name text;
  v_hsn text;
  v_unit text;
  v_quantity numeric;
  v_price numeric;
  v_rate numeric;
  v_taxable numeric;
  v_tax numeric;
  v_cgst numeric;
  v_sgst numeric;
  v_igst numeric;
  v_subtotal numeric := 0;
  v_tax_total numeric := 0;
  v_grand_total numeric := 0;
  v_estimate_number text;
  v_prefix text;
  v_estimate_date date := (now() at time zone 'Asia/Kolkata')::date;
  v_fiscal_year text;
  v_index integer := 0;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_request_id::text, 0));
  select * into v_existing from public.estimates where request_id = p_request_id;
  if found then
    return jsonb_build_object('estimate', to_jsonb(v_existing), 'items', v_existing.items);
  end if;

  if p_tax_mode not in ('none', 'intra', 'inter') then raise exception 'invalid_tax_mode'; end if;
  if coalesce(jsonb_typeof(p_items), '') <> 'array'
    or coalesce(jsonb_array_length(p_items), 0) < 1
    or coalesce(jsonb_array_length(p_items), 0) > 100 then
    raise exception 'invalid_items';
  end if;

  for v_item in select value from jsonb_array_elements(p_items) loop
    v_index := v_index + 1;
    v_name := nullif(trim(v_item->>'productName'), '');
    v_hsn := coalesce(trim(v_item->>'hsnSac'), '');
    v_unit := coalesce(nullif(trim(v_item->>'unit'), ''), 'pcs');
    v_quantity := coalesce(nullif(v_item->>'quantity', '')::numeric, 1);
    v_price := coalesce(nullif(v_item->>'unitPrice', '')::numeric, 0);
    v_rate := coalesce(nullif(v_item->>'gstRate', '')::numeric, 0);
    if v_name is null or length(v_name) > 240 or v_quantity <= 0 or v_price < 0
      or v_rate not in (0, 5, 12, 18, 28) then
      raise exception 'invalid_item';
    end if;
    if p_tax_mode = 'none' and v_rate > 0 then raise exception 'tax_mode_required'; end if;

    v_taxable := round(v_quantity * v_price, 2);
    v_tax := round(v_taxable * v_rate / 100, 2);
    v_cgst := case when p_tax_mode = 'intra' then round(v_tax / 2, 2) else 0 end;
    v_sgst := case when p_tax_mode = 'intra' then v_tax - v_cgst else 0 end;
    v_igst := case when p_tax_mode = 'inter' then v_tax else 0 end;
    v_lines := v_lines || jsonb_build_array(jsonb_build_object(
      'line_number', v_index, 'product_name', v_name, 'hsn_sac', v_hsn, 'unit', v_unit,
      'quantity', v_quantity, 'unit_price', v_price, 'gst_rate', v_rate,
      'taxable_amount', v_taxable, 'cgst_amount', v_cgst, 'sgst_amount', v_sgst,
      'igst_amount', v_igst, 'line_total', v_taxable + v_tax
    ));
    v_subtotal := v_subtotal + v_taxable;
    v_tax_total := v_tax_total + v_tax;
  end loop;

  v_grand_total := round(v_subtotal + v_tax_total, 2);
  v_prefix := upper(regexp_replace(coalesce(nullif(trim(p_estimate_prefix), ''), 'ME'), '[^A-Z0-9-]', '', 'g'));
  v_prefix := left(coalesce(nullif(v_prefix, ''), 'ME'), 12);
  if extract(month from v_estimate_date) >= 4 then
    v_fiscal_year := to_char(v_estimate_date, 'YYYY') || '-' || right((extract(year from v_estimate_date)::integer + 1)::text, 2);
  else
    v_fiscal_year := (extract(year from v_estimate_date)::integer - 1)::text || '-' || right(to_char(v_estimate_date, 'YYYY'), 2);
  end if;
  v_estimate_number := v_prefix || '/EST/' || v_fiscal_year || '/' || lpad(nextval('public.estimate_number_seq')::text, 6, '0');

  insert into public.estimates (
    request_id, estimate_number, estimate_date, customer_name, customer_mobile,
    customer_address, tax_mode, subtotal, tax_total, grand_total, items, seller_snapshot, created_by
  ) values (
    p_request_id, v_estimate_number, v_estimate_date, trim(p_customer_name), trim(p_customer_mobile),
    coalesce(trim(p_customer_address), ''), p_tax_mode, v_subtotal, v_tax_total, v_grand_total,
    v_lines, coalesce(p_seller_snapshot, '{}'::jsonb), coalesce(p_created_by, '')
  ) returning * into v_estimate;

  return jsonb_build_object('estimate', to_jsonb(v_estimate), 'items', v_lines);
end;
$$;

revoke all on function public.create_estimate_v1(uuid, text, text, text, text, text, jsonb, jsonb, text) from public, anon, authenticated;
grant execute on function public.create_estimate_v1(uuid, text, text, text, text, text, jsonb, jsonb, text) to service_role;
