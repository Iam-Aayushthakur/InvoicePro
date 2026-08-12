-- ==================================================
-- MIGRATION 013: Sales Invoice Items (Line Items)
-- Purpose: Line-item product entries, itemized taxes, and line totals for sales invoices
-- ==================================================

CREATE TABLE IF NOT EXISTS public.sales_invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES public.sales_invoices(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    description TEXT,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit VARCHAR(50) NOT NULL DEFAULT 'PCS',
    unit_price NUMERIC(15, 2) NOT NULL CHECK (unit_price >= 0),
    discount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    taxable_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    cgst_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    sgst_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    igst_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    line_total NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sales_invoice_items_invoice_id ON public.sales_invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_sales_invoice_items_product_id ON public.sales_invoice_items(product_id);

COMMENT ON TABLE public.sales_invoice_items IS 'Line items for GST sales invoices';
