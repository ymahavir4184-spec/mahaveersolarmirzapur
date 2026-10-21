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
