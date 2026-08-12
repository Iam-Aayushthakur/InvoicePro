-- ==================================================
-- MIGRATION 002: Companies (Tenant Master Entity)
-- Purpose: Store company business profile, tax parameters, state codes, and settings
-- ==================================================

CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    business_type VARCHAR(100) NOT NULL DEFAULT 'RETAIL', -- RETAIL, WHOLESALE, SERVICE, MANUFACTURING
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    postal_code VARCHAR(20) NOT NULL,
    state_code VARCHAR(2) NOT NULL, -- 2-digit GST state code (e.g. 27 for Maharashtra)
    gstin VARCHAR(15), -- 15-digit GSTIN (optional for non-registered entities)
    pan VARCHAR(10), -- 10-digit PAN
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    timezone VARCHAR(50) NOT NULL DEFAULT 'Asia/Kolkata',
    logo_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    
    CONSTRAINT chk_companies_gstin_length CHECK (gstin IS NULL OR LENGTH(gstin) = 15),
    CONSTRAINT chk_companies_pan_length CHECK (pan IS NULL OR LENGTH(pan) = 10)
);

CREATE INDEX IF NOT EXISTS idx_companies_email ON public.companies(email);
CREATE INDEX IF NOT EXISTS idx_companies_gstin ON public.companies(gstin);
CREATE INDEX IF NOT EXISTS idx_companies_is_active ON public.companies(is_active);

COMMENT ON TABLE public.companies IS 'Multi-tenant company accounts';
