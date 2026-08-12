-- ==================================================
-- MIGRATION 005: Company Memberships
-- Purpose: Join table linking Users to Tenant Companies with explicit Role assignments
-- ==================================================

CREATE TABLE IF NOT EXISTS public.company_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE RESTRICT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT uq_company_members_user_company UNIQUE (company_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_company_members_company_id ON public.company_members(company_id);
CREATE INDEX IF NOT EXISTS idx_company_members_user_id ON public.company_members(user_id);
CREATE INDEX IF NOT EXISTS idx_company_members_role_id ON public.company_members(role_id);

COMMENT ON TABLE public.company_members IS 'User memberships within tenant companies';
