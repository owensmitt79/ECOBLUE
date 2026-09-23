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
-- Stores: General job applications submitted through /careers
-- Generated ID format: CAR-YYYY-XXX
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
-- 5. DRIVER APPLICATIONS TABLE
-- Stores: Official 8-section driver recruitment dossiers from /careers/driver-application
-- Generated ID format: DRV-YYYY-XXXX
-- Run ALTER TABLE if upgrading from the old careers-only approach
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.driver_applications (
  -- Core Identifiers
  id TEXT PRIMARY KEY,
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  status TEXT DEFAULT 'Pending' NOT NULL,

  -- SECTION 1: Personal Information
  "fullName" TEXT NOT NULL,
  dob DATE,
  gender TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  "residentialAddress" TEXT,
  "stateOfOrigin" TEXT,
  lga TEXT,
  nationality TEXT DEFAULT 'Nigerian',
  "maritalStatus" TEXT,
  dependants INTEGER DEFAULT 0,

  -- SECTION 2: Identification & Licensing
  nin TEXT,
  "licenseNumber" TEXT,
  "licenseClass" TEXT,
  "licenseIssueDate" DATE,
  "licenseExpiryDate" DATE,

  -- SECTION 3: Driving Experience & Track Record
  "yearsExperience" TEXT,
  "drivingTypes" TEXT,                 -- Comma-separated list of experience types
  "previousCompany" TEXT,
  "previousPosition" TEXT,
  "yearsWorked" TEXT,
  "familiarRoutes" TEXT,
  "drivingOutsideState" TEXT DEFAULT 'No',
  "accidentHistory" TEXT DEFAULT 'No',
  "accidentDetails" TEXT,
  "trafficViolation" TEXT DEFAULT 'No',
  "violationDetails" TEXT,

  -- SECTION 4: Vehicle Particulars
  "ownsVehicle" TEXT DEFAULT 'No',
  "vehicleOwnerName" TEXT,
  "vehicleType" TEXT,
  "vehicleMake" TEXT,
  "vehicleModel" TEXT,
  "vehicleYear" TEXT,
  "vehicleColour" TEXT,
  "plateNumber" TEXT,
  "vehicleRegNumber" TEXT,
  "insurancePolicyNumber" TEXT,
  "insuranceExpiryDate" DATE,

  -- SECTION 5: Employment Preferences
  "positionApplied" TEXT,
  "preferredLocation" TEXT,
  "preferredHours" TEXT,
  "employmentType" TEXT,
  "expectedSalary" TEXT,
  "availableStartDate" DATE,
  "prevEmployerName" TEXT,
  "prevEmployerPhone" TEXT,
  "reasonForLeaving" TEXT,

  -- SECTION 6: Emergency Contact
  "emergencyName" TEXT,
  "emergencyRelationship" TEXT,
  "emergencyPhone" TEXT,
  "emergencyAltPhone" TEXT,
  "emergencyAddress" TEXT,

  -- SECTION 7: Guarantor Information
  "guarantorName" TEXT,
  "guarantorPhone" TEXT,
  "guarantorEmail" TEXT,
  "guarantorAddress" TEXT,
  "guarantorOccupation" TEXT,
  "guarantorEmployer" TEXT,
  "guarantorRelationship" TEXT,
  "guarantorAttestation" BOOLEAN DEFAULT FALSE,

  -- SECTION 8: Documents Submitted (file names for reference)
  "passportPhotoFile" TEXT,
  "driverLicenseFile" TEXT,
  "nationalIdFile" TEXT,
  "roadworthinessCertFile" TEXT,

  -- Full Dossier Text (kept for legacy/backup admin viewing)
  "fullDossier" TEXT
);

CREATE INDEX IF NOT EXISTS idx_driver_applications_created_at ON public.driver_applications ("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_driver_applications_status ON public.driver_applications (status);
CREATE INDEX IF NOT EXISTS idx_driver_applications_email ON public.driver_applications (email);

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
-- ROW LEVEL SECURITY (RLS) POLICIES & PERMISSIONS
-- Enables public form submissions and staff dashboard operations using anon key
-- ==============================================================================

GRANT ALL ON TABLE public.quotes TO anon, authenticated;
GRANT ALL ON TABLE public.inquiries TO anon, authenticated;
GRANT ALL ON TABLE public.partnerships TO anon, authenticated;
GRANT ALL ON TABLE public.careers TO anon, authenticated;
GRANT ALL ON TABLE public.driver_applications TO anon, authenticated;
GRANT ALL ON TABLE public.consultants TO anon, authenticated;

ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public access for quotes" ON public.quotes;
CREATE POLICY "Public access for quotes" ON public.quotes FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for inquiries" ON public.inquiries;
CREATE POLICY "Public access for inquiries" ON public.inquiries FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for partnerships" ON public.partnerships;
CREATE POLICY "Public access for partnerships" ON public.partnerships FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for careers" ON public.careers;
CREATE POLICY "Public access for careers" ON public.careers FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for driver_applications" ON public.driver_applications;
CREATE POLICY "Public access for driver_applications" ON public.driver_applications FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for consultants" ON public.consultants;
CREATE POLICY "Public access for consultants" ON public.consultants FOR ALL TO public USING (true) WITH CHECK (true);

