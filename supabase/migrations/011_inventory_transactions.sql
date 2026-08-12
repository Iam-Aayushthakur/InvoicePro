-- ==================================================
-- MIGRATION 011: Inventory Transactions Audit Log
-- Purpose: Immutable transaction log of all stock movements (OPENING, SALE, PURCHASE, ADJUSTMENT, etc.)
-- ==================================================

CREATE TABLE IF NOT EXISTS public.inventory_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL, -- OPENING, PURCHASE, SALE, SALE_RETURN, PURCHASE_RETURN, ADJUSTMENT, DAMAGE, TRANSFER
    quantity INT NOT NULL,
    reference_type VARCHAR(50), -- INVOICE, PURCHASE_ORDER, MANUAL
    reference_id UUID,
    previous_quantity INT NOT NULL,
    new_quantity INT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_inventory_transactions_company_id ON public.inventory_transactions(company_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_product_id ON public.inventory_transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_created_at ON public.inventory_transactions(company_id, created_at DESC);

COMMENT ON TABLE public.inventory_transactions IS 'Immutable stock transaction ledger';
