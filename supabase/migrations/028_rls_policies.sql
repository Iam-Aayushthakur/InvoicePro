-- ==================================================
-- MIGRATION 028: Row Level Security (RLS) Policies
-- Purpose: Complete PostgreSQL multi-tenant isolation security policies
-- ==================================================

-- 1. COMPANIES
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own companies"
ON public.companies FOR SELECT
TO authenticated
USING (public.is_company_member(id));

CREATE POLICY "Owners and Admins can update company profile"
ON public.companies FOR UPDATE
TO authenticated
USING (public.has_company_role(id, 'OWNER') OR public.has_company_role(id, 'ADMIN'));

-- 2. USERS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile and company colleagues"
ON public.users FOR SELECT
TO authenticated
USING (
  auth_user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.company_members cm1
    JOIN public.company_members cm2 ON cm1.company_id = cm2.company_id
    JOIN public.users u2 ON cm2.user_id = u2.id
    WHERE u2.auth_user_id = auth.uid() AND cm1.user_id = public.users.id
  )
);

CREATE POLICY "Users can update their own profile"
ON public.users FOR UPDATE
TO authenticated
USING (auth_user_id = auth.uid());

-- 3. ROLES, PERMISSIONS, ROLE_PERMISSIONS
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read roles" ON public.roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read permissions" ON public.permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read role_permissions" ON public.role_permissions FOR SELECT TO authenticated USING (true);

-- 4. COMPANY MEMBERS
ALTER TABLE public.company_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view colleagues in their company"
ON public.company_members FOR SELECT
TO authenticated
USING (public.is_company_member(company_id));

CREATE POLICY "Owners and Admins can manage company members"
ON public.company_members FOR ALL
TO authenticated
USING (public.has_company_role(company_id, 'OWNER') OR public.has_company_role(company_id, 'ADMIN'));

-- 5. CUSTOMERS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant members can view customers" ON public.customers FOR SELECT TO authenticated USING (public.is_company_member(company_id));
CREATE POLICY "Tenant members with permission can insert customers" ON public.customers FOR INSERT TO authenticated WITH CHECK (public.is_company_member(company_id));
CREATE POLICY "Tenant members with permission can update customers" ON public.customers FOR UPDATE TO authenticated USING (public.is_company_member(company_id));
CREATE POLICY "Owners and Admins can delete customers" ON public.customers FOR DELETE TO authenticated USING (public.has_company_role(company_id, 'OWNER') OR public.has_company_role(company_id, 'ADMIN'));

-- 6. SUPPLIERS
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant members can view suppliers" ON public.suppliers FOR SELECT TO authenticated USING (public.is_company_member(company_id));
CREATE POLICY "Tenant members can manage suppliers" ON public.suppliers FOR ALL TO authenticated USING (public.is_company_member(company_id));

-- 7. CATEGORIES
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant members can view categories" ON public.categories FOR SELECT TO authenticated USING (public.is_company_member(company_id));
CREATE POLICY "Tenant members can manage categories" ON public.categories FOR ALL TO authenticated USING (public.is_company_member(company_id));

-- 8. PRODUCTS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant members can view products" ON public.products FOR SELECT TO authenticated USING (public.is_company_member(company_id));
CREATE POLICY "Tenant members can manage products" ON public.products FOR ALL TO authenticated USING (public.is_company_member(company_id));

-- 9. INVENTORY & TRANSACTIONS
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant members can view inventory" ON public.inventory FOR SELECT TO authenticated USING (public.is_company_member(company_id));
CREATE POLICY "Tenant members can view inventory transactions" ON public.inventory_transactions FOR SELECT TO authenticated USING (public.is_company_member(company_id));

-- 10. SALES INVOICES & ITEMS
ALTER TABLE public.sales_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_invoice_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant members can view sales invoices" ON public.sales_invoices FOR SELECT TO authenticated USING (public.is_company_member(company_id));
CREATE POLICY "Tenant members can manage sales invoices" ON public.sales_invoices FOR ALL TO authenticated USING (public.is_company_member(company_id));

CREATE POLICY "Tenant members can view invoice items" ON public.sales_invoice_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.sales_invoices i WHERE i.id = sales_invoice_items.invoice_id AND public.is_company_member(i.company_id)));
CREATE POLICY "Tenant members can manage invoice items" ON public.sales_invoice_items FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.sales_invoices i WHERE i.id = sales_invoice_items.invoice_id AND public.is_company_member(i.company_id)));

-- 11. QUOTATIONS & ITEMS
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant members can view quotations" ON public.quotations FOR SELECT TO authenticated USING (public.is_company_member(company_id));
CREATE POLICY "Tenant members can manage quotations" ON public.quotations FOR ALL TO authenticated USING (public.is_company_member(company_id));
CREATE POLICY "Tenant members can view quotation items" ON public.quotation_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.quotations q WHERE q.id = quotation_items.quotation_id AND public.is_company_member(q.company_id)));

-- 12. PURCHASES & ITEMS
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant members can view purchases" ON public.purchases FOR SELECT TO authenticated USING (public.is_company_member(company_id));
CREATE POLICY "Tenant members can manage purchases" ON public.purchases FOR ALL TO authenticated USING (public.is_company_member(company_id));
CREATE POLICY "Tenant members can view purchase items" ON public.purchase_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.purchases p WHERE p.id = purchase_items.purchase_id AND public.is_company_member(p.company_id)));

-- 13. PAYMENTS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant members can view payments" ON public.payments FOR SELECT TO authenticated USING (public.is_company_member(company_id));
CREATE POLICY "Tenant members can manage payments" ON public.payments FOR ALL TO authenticated USING (public.is_company_member(company_id));

-- 14. SUBSCRIPTION PLANS & SUBSCRIPTIONS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read subscription plans" ON public.subscription_plans FOR SELECT TO authenticated USING (true);
CREATE POLICY "Tenant members can view subscription status" ON public.subscriptions FOR SELECT TO authenticated USING (public.is_company_member(company_id));
CREATE POLICY "Tenant members can view subscription events" ON public.subscription_events FOR SELECT TO authenticated USING (public.is_company_member(company_id));
CREATE POLICY "Tenant members can view usage records" ON public.usage_records FOR SELECT TO authenticated USING (public.is_company_member(company_id));

-- 15. FEATURE FLAGS & NOTIFICATIONS
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant members can view feature flags" ON public.feature_flags FOR SELECT TO authenticated USING (company_id IS NULL OR public.is_company_member(company_id));
CREATE POLICY "Tenant members can view notifications" ON public.notifications FOR SELECT TO authenticated USING (public.is_company_member(company_id));

-- 16. AUDIT LOGS & BACKUPS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners and Admins can view audit logs" ON public.audit_logs FOR SELECT TO authenticated USING (public.has_company_role(company_id, 'OWNER') OR public.has_company_role(company_id, 'ADMIN'));
CREATE POLICY "Owners can view backups" ON public.backups FOR SELECT TO authenticated USING (public.has_company_role(company_id, 'OWNER'));
