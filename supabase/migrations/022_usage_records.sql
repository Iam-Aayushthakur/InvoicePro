-- ==================================================
-- MIGRATION 022: Usage Records
-- Purpose: Track monthly tenant usage metrics (e.g. invoice count, storage bytes) against plan limits
-- ==================================================

CREATE TABLE IF NOT EXISTS public.usage_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL, -- invoices_generated, storage_bytes, user_accounts
    usage_count BIGINT NOT NULL DEFAULT 0,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_usage_records_company_metric_period UNIQUE (company_id, metric_name, period_start)
);

CREATE INDEX IF NOT EXISTS idx_usage_records_company_id ON public.usage_records(company_id);

COMMENT ON TABLE public.usage_records IS 'Monthly resource usage metrics per tenant';
