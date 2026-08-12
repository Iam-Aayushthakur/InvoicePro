-- ==================================================
-- MIGRATION 006: Customers (Tenant-scoped Directory)
-- Purpose: Store customer directory, billing/shipping addresses, GSTIN, and ledger credit limits
-- ==================================================

CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    business_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    alternate_phone VARCHAR(50),
    billing_address TEXT NOT NULL,
    shipping_address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'India',
    gstin VARCHAR(15),
    pan VARCHAR(10),
    credit_limit NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    opening_balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    outstanding_balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    
    CONSTRAINT chk_customers_gstin_length CHECK (gstin IS NULL OR LENGTH(gstin) = 15)
);

CREATE INDEX IF NOT EXISTS idx_customers_company_id ON public.customers(company_id);
CREATE INDEX IF NOT EXISTS idx_customers_company_email ON public.customers(company_id, email);
CREATE INDEX IF NOT EXISTS idx_customers_company_phone ON public.customers(company_id, phone);
CREATE INDEX IF NOT EXISTS idx_customers_company_gstin ON public.customers(company_id, gstin);

COMMENT ON TABLE public.customers IS 'Tenant customer master list';
