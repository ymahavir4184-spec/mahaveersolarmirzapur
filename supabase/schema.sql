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
