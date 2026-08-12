-- ==================================================
-- MIGRATION 019: Subscription Plans
-- Purpose: System plan tiers (FREE, STARTER, PRO, BUSINESS, ENTERPRISE) with feature limits
-- ==================================================

CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL, -- FREE, STARTER, PRO, BUSINESS, ENTERPRISE
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price_monthly NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    price_yearly NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    trial_days INT NOT NULL DEFAULT 14,
    features JSONB NOT NULL DEFAULT '{}'::jsonb, -- Flexible UI capabilities
    limits JSONB NOT NULL DEFAULT '{}'::jsonb, -- Numeric usage caps ({ maxInvoices: 200, maxUsers: 5 })
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscription_plans_code ON public.subscription_plans(code);

COMMENT ON TABLE public.subscription_plans IS 'Master SaaS subscription tier catalog';
