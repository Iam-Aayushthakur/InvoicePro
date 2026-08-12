-- ==================================================
-- MIGRATION 024: Notifications
-- Purpose: In-app user notifications and system alerts
-- ==================================================

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE, -- NULL for company-wide notifications
    type VARCHAR(50) NOT NULL, -- SYSTEM, BILLING, LOW_STOCK, OVERDUE_INVOICE
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}'::jsonb,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_company_id ON public.notifications(company_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(company_id, user_id) WHERE read_at IS NULL;

COMMENT ON TABLE public.notifications IS 'In-app notifications and alert messages';
