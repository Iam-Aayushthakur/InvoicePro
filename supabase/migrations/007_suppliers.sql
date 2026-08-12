-- ==================================================
-- MIGRATION 007: Suppliers (Tenant-scoped Directory)
-- Purpose: Store vendor/supplier master records, tax IDs, and payable balances
-- ==================================================

CREATE TABLE IF NOT EXISTS public.suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    business_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'India',
    gstin VARCHAR(15),
    pan VARCHAR(10),
    opening_balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    outstanding_balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,

    CONSTRAINT chk_suppliers_gstin_length CHECK (gstin IS NULL OR LENGTH(gstin) = 15)
);

CREATE INDEX IF NOT EXISTS idx_suppliers_company_id ON public.suppliers(company_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_company_email ON public.suppliers(company_id, email);
CREATE INDEX IF NOT EXISTS idx_suppliers_company_phone ON public.suppliers(company_id, phone);

COMMENT ON TABLE public.suppliers IS 'Tenant supplier/vendor master list';
