-- ==================================================
-- MIGRATION 008: Categories (Hierarchical Product Cataloging)
-- Purpose: Hierarchical product category tree per tenant
-- ==================================================

CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,

    CONSTRAINT uq_categories_company_name UNIQUE (company_id, name)
);

CREATE INDEX IF NOT EXISTS idx_categories_company_id ON public.categories(company_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id);

COMMENT ON TABLE public.categories IS 'Product categories per tenant';
