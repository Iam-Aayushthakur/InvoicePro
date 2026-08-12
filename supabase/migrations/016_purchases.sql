-- ==================================================
-- MIGRATION 016: Purchases (Vendor Orders & Bills Header)
-- Purpose: Purchase orders, vendor bill headers, totals, and payment status
-- ==================================================

CREATE TABLE IF NOT EXISTS public.purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
    purchase_number VARCHAR(100) NOT NULL,
    purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'ORDERED', -- DRAFT, ORDERED, RECEIVED, PAID, CANCELLED
    subtotal NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    discount_total NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    tax_total NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    grand_total NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    paid_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    balance_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,

    CONSTRAINT uq_purchases_company_number UNIQUE (company_id, purchase_number)
);

CREATE INDEX IF NOT EXISTS idx_purchases_company_id ON public.purchases(company_id);
CREATE INDEX IF NOT EXISTS idx_purchases_supplier_id ON public.purchases(supplier_id);

COMMENT ON TABLE public.purchases IS 'Purchase orders and vendor bills header';
