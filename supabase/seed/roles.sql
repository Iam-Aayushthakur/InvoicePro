-- ==================================================
-- SEED DATA: System Roles
-- ==================================================

INSERT INTO public.roles (name, description, is_system) VALUES
('OWNER', 'Company Owner with full administrative, billing, and system rights', true),
('ADMIN', 'Company Administrator managing users, settings, and business modules', true),
('ACCOUNTANT', 'Financial specialist managing invoices, GST reports, payments, and ledgers', true),
('CASHIER', 'Front-desk point-of-sale operator creating sales invoices and receiving payments', true),
('WAREHOUSE_MANAGER', 'Inventory manager tracking stock transfers, adjustments, and supplier bills', true),
('EMPLOYEE', 'Standard employee with view-only or restricted access', true)
ON CONFLICT (name) DO NOTHING;
