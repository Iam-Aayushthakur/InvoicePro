-- ==================================================
-- MIGRATION 012: Sales Invoices (Header)
-- Purpose: Store GST sales invoice header information, totals, tax breakdowns, and status
-- ==================================================

CREATE TABLE IF NOT EXISTS public.sales_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    invoice_number VARCHAR(100) NOT NULL,
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT', -- DRAFT, ISSUED, PAID, PARTIALLY_PAID, CANCELLED, OVERDUE
    subtotal NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    discount_total NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    taxable_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    cgst_total NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    sgst_total NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    igst_total NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    tax_total NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    round_off NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    grand_total NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    paid_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    balance_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    terms TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,

    CONSTRAINT uq_sales_invoices_company_number UNIQUE (company_id, invoice_number)
);

CREATE INDEX IF NOT EXISTS idx_sales_invoices_company_id ON public.sales_invoices(company_id);
CREATE INDEX IF NOT EXISTS idx_sales_invoices_customer_id ON public.sales_invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_invoices_status ON public.sales_invoices(company_id, status);
CREATE INDEX IF NOT EXISTS idx_sales_invoices_date ON public.sales_invoices(company_id, invoice_date DESC);

COMMENT ON TABLE public.sales_invoices IS 'Header master for GST sales invoices';
