-- Private inbound lead storage. Keep in sync with supabase/schema.sql, which is
-- the SQL Editor bootstrap file for client deployments.
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc'::text, now()),
  name text not null,
  phone text not null,
  category text default 'General Solar Enquiry',
  source text not null default 'quote',
  page_path text default '/',
  language text default 'en',
  consent boolean not null default true,
  consent_at timestamptz not null default timezone('utc'::text, now()),
  user_agent text,
  email text,
  city text,
  monthly_bill text,
  message text,
  status text not null default 'new'
);

create index if not exists idx_leads_created_at on public.leads (created_at desc);
create index if not exists idx_leads_phone on public.leads (phone);
create index if not exists idx_leads_status on public.leads (status);
create index if not exists idx_leads_source on public.leads (source);

alter table public.leads enable row level security;
revoke all on table public.leads from anon, authenticated;
grant all on table public.leads to service_role;

comment on table public.leads is 'Stores inbound solar installation enquiries from web forms and popups.';
