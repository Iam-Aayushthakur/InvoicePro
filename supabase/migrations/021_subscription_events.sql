-- ==================================================
-- MIGRATION 021: Subscription Events Audit Trail
-- Purpose: Log subscription state transitions, upgrades, downgrades, renewals, and cancellations
-- ==================================================

CREATE TABLE IF NOT EXISTS public.subscription_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL, -- CREATED, RENEWED, UPGRADED, DOWNGRADED, CANCELLED, PAYMENT_FAILED
    previous_status VARCHAR(50),
    new_status VARCHAR(50),
    data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscription_events_company_id ON public.subscription_events(company_id);
CREATE INDEX IF NOT EXISTS idx_subscription_events_subscription_id ON public.subscription_events(subscription_id);

COMMENT ON TABLE public.subscription_events IS 'Audit history of subscription lifecycle events';
