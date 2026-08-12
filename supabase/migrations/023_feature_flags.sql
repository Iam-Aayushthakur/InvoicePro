-- ==================================================
-- MIGRATION 023: Feature Flags
-- Purpose: Dynamic system & tenant feature toggles
-- ==================================================

CREATE TABLE IF NOT EXISTS public.feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE, -- NULL for global flags
    flag_key VARCHAR(100) NOT NULL, -- e.g. 'e_invoicing_enabled', 'offline_mode'
    is_enabled BOOLEAN NOT NULL DEFAULT false,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feature_flags_flag_key ON public.feature_flags(flag_key);
CREATE INDEX IF NOT EXISTS idx_feature_flags_company_id ON public.feature_flags(company_id);

COMMENT ON TABLE public.feature_flags IS 'Dynamic system and per-tenant feature toggles';
