-- ==================================================
-- MIGRATION 009: Products Catalog
-- Purpose: Product & service items catalog storing SKU, barcode, HSN/SAC, pricing, and tax rates
-- ==================================================

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    barcode VARCHAR(100),
    description TEXT,
    unit VARCHAR(50) NOT NULL DEFAULT 'PCS', -- PCS, KG, LTR, BOX, MTR, HOURS
    purchase_price NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    selling_price NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 18.00, -- Default GST tax percentage (0, 5, 12, 18, 28)
    hsn_sac VARCHAR(20), -- HSN for goods, SAC for services
    track_inventory BOOLEAN NOT NULL DEFAULT true,
    minimum_stock INT NOT NULL DEFAULT 10,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,

    CONSTRAINT uq_products_company_sku UNIQUE (company_id, sku)
);

CREATE INDEX IF NOT EXISTS idx_products_company_id ON public.products(company_id);
CREATE INDEX IF NOT EXISTS idx_products_company_sku ON public.products(company_id, sku);
CREATE INDEX IF NOT EXISTS idx_products_company_barcode ON public.products(company_id, barcode);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);

COMMENT ON TABLE public.products IS 'Tenant product catalog with tax and HSN details';
