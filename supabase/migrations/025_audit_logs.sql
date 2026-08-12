-- ==================================================
-- MIGRATION 025: Audit Logs (Security Ledger)
-- Purpose: Immutable security audit trail recording action, entity_type, entity_id, old/new payload diffs, IP, and user_agent
-- ==================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- e.g. INVOICE_CREATED, USER_ROLE_CHANGED, COMPANY_UPDATED
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_company_id ON public.audit_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(company_id, created_at DESC);

COMMENT ON TABLE public.audit_logs IS 'Immutable security and change audit log';
