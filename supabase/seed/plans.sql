-- ==================================================
-- SEED DATA: SaaS Subscription Plans
-- ==================================================

INSERT INTO public.subscription_plans (code, name, description, price_monthly, price_yearly, currency, trial_days, features, limits) VALUES
('FREE', 'Free Trial', 'Basic invoicing for freelancers and tiny shops', 0.00, 0.00, 'INR', 14, 
  '{"customLogo": false, "reports": false, "multiUser": false}'::jsonb, 
  '{"maxInvoices": 20, "maxUsers": 1, "maxProducts": 50}'::jsonb),

('STARTER', 'Starter Plan', 'Essential GST invoicing for small businesses', 499.00, 4990.00, 'INR', 14, 
  '{"customLogo": true, "reports": true, "multiUser": false}'::jsonb, 
  '{"maxInvoices": 200, "maxUsers": 2, "maxProducts": 500}'::jsonb),

('PRO', 'Pro Business', 'Full featured business management & inventory', 999.00, 9990.00, 'INR', 14, 
  '{"customLogo": true, "reports": true, "multiUser": true, "offlineSync": true}'::jsonb, 
  '{"maxInvoices": 1000, "maxUsers": 5, "maxProducts": 2500}'::jsonb),

('BUSINESS', 'Business Scale', 'High concurrency for multi-branch retail & trade', 1999.00, 19990.00, 'INR', 14, 
  '{"customLogo": true, "reports": true, "multiUser": true, "offlineSync": true, "auditLogs": true}'::jsonb, 
  '{"maxInvoices": 10000, "maxUsers": 15, "maxProducts": 10000}'::jsonb),

('ENTERPRISE', 'Enterprise Unlimited', 'Custom SLA, dedicated database, and unlimited volume', 4999.00, 49990.00, 'INR', 14, 
  '{"customLogo": true, "reports": true, "multiUser": true, "offlineSync": true, "auditLogs": true, "dedicatedSupport": true}'::jsonb, 
  '{"maxInvoices": -1, "maxUsers": -1, "maxProducts": -1}'::jsonb)
ON CONFLICT (code) DO NOTHING;
