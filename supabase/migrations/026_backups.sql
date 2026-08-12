-- ==================================================
-- MIGRATION 026: Backups Metadata
-- Purpose: Track automated and manual database snapshot metadata
-- ==================================================

CREATE TABLE IF NOT EXISTS public.backups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    backup_type VARCHAR(50) NOT NULL DEFAULT 'MANUAL', -- AUTOMATED, MANUAL
    storage_path TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, COMPLETED, FAILED
    size_bytes BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_backups_company_id ON public.backups(company_id);

COMMENT ON TABLE public.backups IS 'Tenant backup metadata logs';
