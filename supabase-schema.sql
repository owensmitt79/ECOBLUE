-- ==============================================================================
-- EcoBlue Environmental Services Ltd. - Supabase Database Schema
-- Production Ready Schema with Indexes and Row Level Security (RLS)
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. QUOTES & CONSULTATION TABLE
-- Stores: Service quote requests, consultation bookings (/consultation), and /request
-- Generated ID format: QUO-YYYY-XXX
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quotes (
  id TEXT PRIMARY KEY,
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  status TEXT DEFAULT 'Pending' NOT NULL,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  "wasteType" TEXT,
  location TEXT NOT NULL,
  timeline TEXT,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON public.quotes ("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON public.quotes (status);

-- ------------------------------------------------------------------------------
-- 2. INQUIRIES TABLE
-- Stores: General contact messages from the /contact page
-- Generated ID format: INQ-YYYY-XXX
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inquiries (
  id TEXT PRIMARY KEY,
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  status TEXT DEFAULT 'Pending' NOT NULL,
  "fullName" TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries ("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries (status);

-- ------------------------------------------------------------------------------
-- 3. PARTNERSHIPS TABLE
-- Stores: Institutional & corporate partnership inquiries from /partnerships
-- Generated ID format: PRT-YYYY-XXX
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.partnerships (
  id TEXT PRIMARY KEY,
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  status TEXT DEFAULT 'Pending' NOT NULL,
  organization TEXT NOT NULL,
  "contactPerson" TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  track TEXT NOT NULL,
  "scopeSummary" TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_partnerships_created_at ON public.partnerships ("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_partnerships_status ON public.partnerships (status);

-- ------------------------------------------------------------------------------
-- 4. CAREERS TABLE
-- Stores: Job applications submitted through /careers
-- Generated ID format: APP-YYYY-XXX
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.careers (
  id TEXT PRIMARY KEY,
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  status TEXT DEFAULT 'Pending' NOT NULL,
  "fullName" TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  position TEXT NOT NULL,
  experience TEXT NOT NULL,
  qualification TEXT NOT NULL,
  "cvFileName" TEXT,
  "coverLetter" TEXT
);

CREATE INDEX IF NOT EXISTS idx_careers_created_at ON public.careers ("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_careers_status ON public.careers (status);

-- ------------------------------------------------------------------------------
-- 5. CONSULTANTS TABLE
-- Stores: External specialists & expert roster registrations from /consultants
-- Generated ID format: CST-YYYY-XXX
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.consultants (
  id TEXT PRIMARY KEY,
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  status TEXT DEFAULT 'Pending' NOT NULL,
  "fullName" TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  specialization TEXT NOT NULL,
  "experienceYears" TEXT NOT NULL,
  certifications TEXT,
  "profileSummary" TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_consultants_created_at ON public.consultants ("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_consultants_status ON public.consultants (status);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enables public form submissions and staff dashboard operations using anon key
-- ==============================================================================

ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultants ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY['quotes', 'inquiries', 'partnerships', 'careers', 'consultants'])
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Public full access for %I" ON public.%I', tbl, tbl);
    EXECUTE format('CREATE POLICY "Public full access for %I" ON public.%I FOR ALL TO anon USING (true) WITH CHECK (true)', tbl, tbl);
  END LOOP;
END $$;
