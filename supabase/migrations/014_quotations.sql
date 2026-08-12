-- ==================================================
-- MIGRATION 014: Quotations (Header)
-- Purpose: Sales quotes, estimates, proposals, and validity terms
-- ==================================================

CREATE TABLE IF NOT EXISTS public.quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    quotation_number VARCHAR(100) NOT NULL,
    quotation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_until DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT', -- DRAFT, SENT, ACCEPTED, DECLINED, CONVERTED
    subtotal NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    discount_total NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    tax_total NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    grand_total NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,

    CONSTRAINT uq_quotations_company_number UNIQUE (company_id, quotation_number)
);

CREATE INDEX IF NOT EXISTS idx_quotations_company_id ON public.quotations(company_id);
CREATE INDEX IF NOT EXISTS idx_quotations_customer_id ON public.quotations(customer_id);

COMMENT ON TABLE public.quotations IS 'Quotations and price estimates header';
