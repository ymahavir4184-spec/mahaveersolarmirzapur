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
  unit_price numeric(14,2) not null check (unit_price >= 0),
  gst_rate numeric(5,2) not null default 0 check (gst_rate in (0, 5, 12, 18, 28)),
  taxable_amount numeric(14,2) not null check (taxable_amount >= 0),
  cgst_amount numeric(14,2) not null default 0 check (cgst_amount >= 0),
  sgst_amount numeric(14,2) not null default 0 check (sgst_amount >= 0),
  igst_amount numeric(14,2) not null default 0 check (igst_amount >= 0),
  line_total numeric(14,2) not null check (line_total >= 0),
  unique (bill_id, line_number)
);

create index if not exists bills_date_idx on public.bills (invoice_date desc, created_at desc);
create index if not exists bills_mobile_idx on public.bills (customer_mobile);
create index if not exists bills_customer_name_idx on public.bills (lower(customer_name));
create index if not exists bill_items_bill_id_idx on public.bill_items (bill_id, line_number);

alter table public.bills enable row level security;
alter table public.bill_items enable row level security;
revoke all on table public.bills, public.bill_items from anon, authenticated;
grant all on table public.bills, public.bill_items to service_role;
