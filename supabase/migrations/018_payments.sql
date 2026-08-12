-- ==================================================
-- MIGRATION 018: Payments (Financial Transactions Ledger)
-- Purpose: Payment transaction records for sales invoices and purchase bills
-- ==================================================

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE RESTRICT,
    supplier_id UUID REFERENCES public.suppliers(id) ON DELETE RESTRICT,
    invoice_id UUID REFERENCES public.sales_invoices(id) ON DELETE SET NULL,
    purchase_id UUID REFERENCES public.purchases(id) ON DELETE SET NULL,
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    payment_method VARCHAR(50) NOT NULL, -- RAZORPAY, STRIPE, CASH, BANK_TRANSFER, CHEQUE, UPI
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    reference_number VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'SUCCESS', -- PENDING, SUCCESS, FAILED, REFUNDED
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_payments_company_id ON public.payments(company_id);
CREATE INDEX IF NOT EXISTS idx_payments_customer_id ON public.payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_supplier_id ON public.payments(supplier_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON public.payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_purchase_id ON public.payments(purchase_id);

COMMENT ON TABLE public.payments IS 'Payment transactions for customer invoices and vendor bills';
