-- Supabase SQL Editor setup for Solar Website Platform.
-- Open Supabase Dashboard -> SQL Editor, paste/run this entire file once.
-- It creates the leads, quotations, billing, estimates, and shared login-limit objects with RLS.
-- Do not additionally run migrations/20261020000000_leads.sql; it duplicates
-- the leads setup for CLI migration workflows.


-- ==============================================================================
-- 01 — Leads (supabase/schema.sql)
-- ==============================================================================

-- ==============================================================================
-- AuraSun Solar Website Platform - Supabase Database Schema
-- Leads schema component. For the complete SQL Editor setup, run supabase/setup.sql.
-- ==============================================================================

-- 1. Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    category TEXT DEFAULT 'General Solar Enquiry',
    source TEXT NOT NULL DEFAULT 'quote', -- 'quote' | 'contact' | 'popup'
    page_path TEXT DEFAULT '/',
    language TEXT DEFAULT 'en', -- 'en' | 'hi'
    consent BOOLEAN NOT NULL DEFAULT true,
    consent_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    user_agent TEXT,
    email TEXT,
    city TEXT,
    monthly_bill TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'new' -- 'new' | 'contacted' | 'survey_scheduled' | 'converted' | 'archived'
);

-- 2. Indexes for fast query performance in Supabase Dashboard
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON public.leads (phone);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON public.leads (source);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Browser roles stay locked out; writes come from the server-only service role.
REVOKE ALL ON TABLE public.leads FROM anon, authenticated;
GRANT ALL ON TABLE public.leads TO service_role;

-- 4. Security Policies:
-- By default, with RLS enabled and NO public policies defined, ALL anon/public requests
-- via the browser are rejected.
-- ONLY the server-side API using the SUPABASE_SERVICE_ROLE_KEY can insert/read records.
-- Leads are managed securely and privately via the Supabase Dashboard.

COMMENT ON TABLE public.leads IS 'Stores inbound solar installation enquiries from web forms and popups.';


-- ==============================================================================
-- 02 — Quotations (supabase/migrations/20261020000100_quotations.sql)
-- ==============================================================================

-- Staff-only quotation storage. Apply before deploying the quotation API changes.
create table if not exists public.quotations (
  id text primary key,
  ref_no text not null unique,
  name text not null,
  phone text not null,
  address text not null default '',
  capacity_kw numeric(8,2) not null check (capacity_kw > 0),
  system_type text not null,
  property_type text not null default 'residential',
  roof_type text not null default 'rcc',
  panel_watt integer not null default 550 check (panel_watt > 0),
  panel_count integer not null default 0 check (panel_count >= 0),
  notes text not null default '',
  status text not null default 'pending' check (status in ('pending', 'completed')),
  is_purchased boolean not null default false,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists quotations_created_at_idx on public.quotations (created_at desc);
create index if not exists quotations_phone_idx on public.quotations (phone);

alter table public.quotations enable row level security;
revoke all on table public.quotations from anon, authenticated;
grant all on table public.quotations to service_role;


-- ==============================================================================
-- 03 — Billing tables (supabase/migrations/20261020000200_billing_tables.sql)
-- ==============================================================================

-- Invoice data is private to the server-side service role; no browser policies are added.
create sequence if not exists public.bill_number_seq;

create table if not exists public.bills (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique,
  bill_number text not null unique,
  invoice_date date not null default current_date,
  customer_name text not null check (length(trim(customer_name)) between 2 and 160),
  customer_mobile text not null check (length(trim(customer_mobile)) between 10 and 16),
  customer_address text not null default '',
  document_details jsonb not null default '{}'::jsonb,
  tax_mode text not null default 'none' check (tax_mode in ('none', 'intra', 'inter')),
  subtotal numeric(14,2) not null check (subtotal >= 0),
  tax_total numeric(14,2) not null check (tax_total >= 0),
  grand_total numeric(14,2) not null check (grand_total >= 0),
  seller_snapshot jsonb not null default '{}'::jsonb,
  created_by text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.bill_items (
  id uuid primary key default gen_random_uuid(),
  bill_id uuid not null references public.bills(id) on delete cascade,
  line_number integer not null check (line_number > 0),
  product_name text not null check (length(trim(product_name)) between 1 and 240),
  hsn_sac text not null default '',
  quantity numeric(12,3) not null check (quantity > 0),
  unit text not null default 'pcs' check (length(trim(unit)) between 1 and 24),
  unit_price numeric(14,2) not null check (unit_price >= 0),
  gst_rate numeric(5,2) not null default 0 check (gst_rate in (0, 5, 12, 18, 28)),
  taxable_amount numeric(14,2) not null check (taxable_amount >= 0),
  cgst_amount numeric(14,2) not null default 0 check (cgst_amount >= 0),
  sgst_amount numeric(14,2) not null default 0 check (sgst_amount >= 0),
  igst_amount numeric(14,2) not null default 0 check (igst_amount >= 0),
  line_total numeric(14,2) not null check (line_total >= 0),
  unique (bill_id, line_number)
);

alter table public.bill_items add column if not exists unit text not null default 'pcs';
alter table public.bills add column if not exists document_details jsonb not null default '{}'::jsonb;

create index if not exists bills_date_idx on public.bills (invoice_date desc, created_at desc);
create index if not exists bills_mobile_idx on public.bills (customer_mobile);
create index if not exists bills_customer_name_idx on public.bills (lower(customer_name));
create index if not exists bill_items_bill_id_idx on public.bill_items (bill_id, line_number);

select setval(
  'public.bill_number_seq',
  greatest(
    79,
    (select last_value from public.bill_number_seq),
    coalesce((select max(substring(bill_number from '([0-9]+)$')::bigint)
      from public.bills
      where invoice_date >= date '2026-04-01' and invoice_date < date '2027-04-01'), 0)
  ),
  true
);

alter table public.bills enable row level security;
alter table public.bill_items enable row level security;
revoke all on table public.bills, public.bill_items from anon, authenticated;
grant all on table public.bills, public.bill_items to service_role;


-- ==============================================================================
-- 04 — Billing functions (supabase/migrations/20261020000300_billing_functions.sql)
-- ==============================================================================

-- Creates a bill and its line items as one database transaction, with idempotent retries.
create or replace function public.create_bill_v1(
  p_request_id uuid,
  p_bill_prefix text,
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
  v_existing public.bills%rowtype;
  v_bill public.bills%rowtype;
  v_item jsonb;
  v_line jsonb;
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
  v_bill_number text;
  v_invoice_date date;
  v_fiscal_year_start integer;
  v_fiscal_year text;
  v_index integer := 0;
begin
  -- Serialize retries with the same request ID so only one invoice is ever created.
  perform pg_advisory_xact_lock(hashtextextended(p_request_id::text, 0));
  select * into v_existing from public.bills where request_id = p_request_id;
  if found then
    return jsonb_build_object(
      'bill', to_jsonb(v_existing),
      'items', coalesce((select jsonb_agg(to_jsonb(i) order by i.line_number) from public.bill_items i where i.bill_id = v_existing.id), '[]'::jsonb)
    );
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
    if v_name is null or length(v_unit) > 24 or v_quantity <= 0 or v_price < 0 or v_rate not in (0, 5, 12, 18, 28) then
      raise exception 'invalid_item';
    end if;
    if p_tax_mode = 'none' and v_rate > 0 then raise exception 'tax_mode_required'; end if;

    v_taxable := round(v_quantity * v_price, 2);
    v_tax := round(v_taxable * v_rate / 100, 2);
    v_cgst := case when p_tax_mode = 'intra' then round(v_tax / 2, 2) else 0 end;
    v_sgst := case when p_tax_mode = 'intra' then v_tax - v_cgst else 0 end;
    v_igst := case when p_tax_mode = 'inter' then v_tax else 0 end;
    v_lines := v_lines || jsonb_build_array(jsonb_build_object(
      'line_number', v_index, 'product_name', v_name, 'hsn_sac', v_hsn,
      'quantity', v_quantity, 'unit', v_unit, 'unit_price', v_price, 'gst_rate', v_rate,
      'taxable_amount', v_taxable, 'cgst_amount', v_cgst, 'sgst_amount', v_sgst,
      'igst_amount', v_igst, 'line_total', v_taxable + v_tax
    ));
    v_subtotal := v_subtotal + v_taxable;
    v_tax_total := v_tax_total + v_tax;
  end loop;

  v_grand_total := round(v_subtotal + v_tax_total, 2);
  v_invoice_date := (now() at time zone 'Asia/Kolkata')::date;
  v_fiscal_year_start := case when extract(month from v_invoice_date) >= 4 then extract(year from v_invoice_date)::integer else extract(year from v_invoice_date)::integer - 1 end;
  v_fiscal_year := v_fiscal_year_start::text || '-' || lpad(((v_fiscal_year_start + 1) % 100)::text, 2, '0');
  v_bill_number := upper(coalesce(nullif(trim(p_bill_prefix), ''), 'ME')) || '/' || v_fiscal_year || '/' || nextval('public.bill_number_seq')::text;

  insert into public.bills (
    request_id, bill_number, invoice_date, customer_name, customer_mobile,
    customer_address, tax_mode, subtotal, tax_total, grand_total, seller_snapshot, created_by
  ) values (
    p_request_id, v_bill_number, v_invoice_date, trim(p_customer_name), trim(p_customer_mobile),
    coalesce(trim(p_customer_address), ''), p_tax_mode, v_subtotal, v_tax_total,
    v_grand_total, coalesce(p_seller_snapshot, '{}'::jsonb), coalesce(p_created_by, '')
  ) returning * into v_bill;

  for v_line in select value from jsonb_array_elements(v_lines) loop
    insert into public.bill_items (
      bill_id, line_number, product_name, hsn_sac, quantity, unit, unit_price, gst_rate,
      taxable_amount, cgst_amount, sgst_amount, igst_amount, line_total
    ) values (
      v_bill.id, (v_line->>'line_number')::integer, v_line->>'product_name', v_line->>'hsn_sac',
      (v_line->>'quantity')::numeric, v_line->>'unit', (v_line->>'unit_price')::numeric, (v_line->>'gst_rate')::numeric,
      (v_line->>'taxable_amount')::numeric, (v_line->>'cgst_amount')::numeric,
      (v_line->>'sgst_amount')::numeric, (v_line->>'igst_amount')::numeric,
      (v_line->>'line_total')::numeric
    );
  end loop;

  return jsonb_build_object(
    'bill', to_jsonb(v_bill),
    'items', coalesce((select jsonb_agg(to_jsonb(i) order by i.line_number) from public.bill_items i where i.bill_id = v_bill.id), '[]'::jsonb)
  );
end;
$$;

-- Search is parameterized and returns full bill rows with their line items.
create or replace function public.list_bills_v1(
  p_search text default null, p_from date default null, p_to date default null,
  p_limit integer default 50, p_offset integer default 0
) returns setof jsonb
language sql stable security definer set search_path = public, pg_temp as $$
  select to_jsonb(b) || jsonb_build_object(
    'items', coalesce(jsonb_agg(to_jsonb(i) order by i.line_number) filter (where i.id is not null), '[]'::jsonb)
  )
  from public.bills b left join public.bill_items i on i.bill_id = b.id
  where (p_from is null or b.invoice_date >= p_from)
    and (p_to is null or b.invoice_date <= p_to)
    and (nullif(trim(p_search), '') is null or b.bill_number ilike '%' || trim(p_search) || '%'
      or b.customer_name ilike '%' || trim(p_search) || '%' or b.customer_mobile ilike '%' || trim(p_search) || '%')
  group by b.id
  order by b.invoice_date desc, b.created_at desc
  limit least(greatest(coalesce(p_limit, 50), 1), 100) offset greatest(coalesce(p_offset, 0), 0);
$$;

-- Period summary is computed in PostgreSQL, so it covers every matching bill, not just one UI page.
create or replace function public.bill_report_v1(p_search text default null, p_from date default null, p_to date default null)
returns jsonb language sql stable security definer set search_path = public, pg_temp as $$
  select jsonb_build_object(
    'bill_count', count(*), 'subtotal', coalesce(sum(subtotal), 0),
    'tax_total', coalesce(sum(tax_total), 0), 'grand_total', coalesce(sum(grand_total), 0),
    'daily', coalesce((
      select jsonb_agg(jsonb_build_object('date', d.invoice_date, 'bill_count', d.bill_count, 'grand_total', d.grand_total) order by d.invoice_date)
      from (
        select invoice_date, count(*) as bill_count, sum(grand_total) as grand_total
        from public.bills
        where (p_from is null or invoice_date >= p_from) and (p_to is null or invoice_date <= p_to)
          and (nullif(trim(p_search), '') is null or bill_number ilike '%' || trim(p_search) || '%'
            or customer_name ilike '%' || trim(p_search) || '%' or customer_mobile ilike '%' || trim(p_search) || '%')
        group by invoice_date
      ) d
    ), '[]'::jsonb)
  )
  from public.bills
  where (p_from is null or invoice_date >= p_from) and (p_to is null or invoice_date <= p_to)
    and (nullif(trim(p_search), '') is null or bill_number ilike '%' || trim(p_search) || '%'
      or customer_name ilike '%' || trim(p_search) || '%' or customer_mobile ilike '%' || trim(p_search) || '%');
$$;

revoke all on function public.create_bill_v1(uuid, text, text, text, text, text, jsonb, jsonb, text) from public, anon, authenticated;
revoke all on function public.list_bills_v1(text, date, date, integer, integer) from public, anon, authenticated;
revoke all on function public.bill_report_v1(text, date, date) from public, anon, authenticated;
grant execute on function public.create_bill_v1(uuid, text, text, text, text, text, jsonb, jsonb, text) to service_role;
grant execute on function public.list_bills_v1(text, date, date, integer, integer) to service_role;
grant execute on function public.bill_report_v1(text, date, date) to service_role;


-- ==============================================================================
-- 05 — A4 Estimates (supabase/migrations/20261021000100_estimates.sql)
-- ==============================================================================
-- Staff-only estimate storage. This is also available as a standalone migration
-- for projects that already ran setup.sql before estimates were added.

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
alter table public.estimates add column if not exists document_details jsonb not null default '{}'::jsonb;

-- Recover the estimate sequence if an older/manual import left saved numbers ahead of it.
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
  p_request_id uuid, p_estimate_prefix text, p_customer_name text, p_customer_mobile text,
  p_customer_address text, p_tax_mode text, p_items jsonb, p_seller_snapshot jsonb, p_created_by text
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
      or v_rate not in (0, 5, 12, 18, 28) then raise exception 'invalid_item'; end if;
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

-- v2 wrappers keep optional document fields in the same transaction as each record.
create or replace function public.create_bill_v2(
  p_request_id uuid, p_bill_prefix text, p_customer_name text, p_customer_mobile text,
  p_customer_address text, p_tax_mode text, p_items jsonb, p_seller_snapshot jsonb,
  p_created_by text, p_document_details jsonb
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

create or replace function public.create_estimate_v2(
  p_request_id uuid, p_estimate_prefix text, p_customer_name text, p_customer_mobile text,
  p_customer_address text, p_tax_mode text, p_items jsonb, p_seller_snapshot jsonb,
  p_created_by text, p_document_details jsonb
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

-- ==============================================================================
-- 06 — Remove rate-limit storage from existing SQL Editor setups
-- ==============================================================================

drop function if exists public.consume_staff_login_limit_v1(text, integer, integer);
drop table if exists public.staff_login_rate_limits;

-- ==============================================================================
-- 07 — Server-side staff sessions with 30-minute inactivity logout
-- ==============================================================================

create table if not exists public.staff_sessions (
  session_hash text primary key check (session_hash ~ '^[0-9a-f]{64}$'),
  staff_login_id text not null check (char_length(staff_login_id) between 1 and 120),
  created_at timestamptz not null default clock_timestamp(),
  last_activity_at timestamptz not null default clock_timestamp(),
  expires_at timestamptz not null,
  revoked_at timestamptz
);
create index if not exists staff_sessions_expiry_idx on public.staff_sessions (expires_at);
create index if not exists staff_sessions_activity_idx on public.staff_sessions (last_activity_at);
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

  delete from public.staff_sessions
    where session_hash in (
      select session_hash from public.staff_sessions
      where expires_at <= v_now or revoked_at is not null
      order by expires_at limit 100
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

-- Combine staff-session validation and record creation into one RPC request.
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
    p_request_id, p_bill_prefix, p_customer_name, p_customer_mobile,
    p_customer_address, p_tax_mode, p_items, p_seller_snapshot,
    v_staff_login_id, p_document_details
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
    p_request_id, p_estimate_prefix, p_customer_name, p_customer_mobile,
    p_customer_address, p_tax_mode, p_items, p_seller_snapshot,
    v_staff_login_id, p_document_details
  );
end;
$$;
revoke all on function public.create_estimate_with_staff_session_v1(text, integer, uuid, text, text, text, text, text, jsonb, jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.create_estimate_with_staff_session_v1(text, integer, uuid, text, text, text, text, text, jsonb, jsonb, jsonb) to service_role;

-- 08 — Minimal, protected estimate deletion audit log (no recovery snapshots)
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
