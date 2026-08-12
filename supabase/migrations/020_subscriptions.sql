-- ==================================================
-- MIGRATION 020: Subscriptions (Tenant Active Subscription)
-- Purpose: Active tenant subscription state (TRIAL, ACTIVE, PAST_DUE, PAUSED, CANCELLED, EXPIRED)
-- ==================================================

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID UNIQUE NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.subscription_plans(id) ON DELETE RESTRICT,
    status VARCHAR(50) NOT NULL DEFAULT 'TRIAL', -- TRIAL, ACTIVE, PAST_DUE, PAUSED, CANCELLED, EXPIRED
    billing_interval VARCHAR(20) NOT NULL DEFAULT 'MONTHLY', -- MONTHLY, YEARLY
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_period_end TIMESTAMPTZ NOT NULL,
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    provider VARCHAR(50), -- RAZORPAY, STRIPE, MANUAL
    provider_subscription_id VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_company_id ON public.subscriptions(company_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

COMMENT ON TABLE public.subscriptions IS 'Active SaaS subscription record for tenant companies';
