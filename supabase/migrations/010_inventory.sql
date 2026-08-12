-- ==================================================
-- MIGRATION 010: Inventory (Current Stock State)
-- Purpose: Track available and reserved stock balances per product
-- ==================================================

CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    product_id UUID UNIQUE NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 0,
    reserved_quantity INT NOT NULL DEFAULT 0,
    available_quantity INT GENERATED ALWAYS AS (quantity - reserved_quantity) STORED,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_company_id ON public.inventory(company_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON public.inventory(product_id);

COMMENT ON TABLE public.inventory IS 'Current stock state per product';
