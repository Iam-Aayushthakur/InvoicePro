-- ==================================================
-- MIGRATION 027: RLS Helper Functions
-- Purpose: Security functions for tenant isolation & permission checks in RLS policies
-- SECURITY DEFINER and STABLE performance optimization
-- ==================================================

-- Helper to check if current authenticated user is a member of specified company
CREATE OR REPLACE FUNCTION public.is_company_member(target_company_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.company_members cm
    JOIN public.users u ON cm.user_id = u.id
    WHERE cm.company_id = target_company_id
      AND u.auth_user_id = auth.uid()
      AND cm.is_active = true
      AND u.is_active = true
  );
$$;

-- Helper to check if current authenticated user has specific role in specified company
CREATE OR REPLACE FUNCTION public.has_company_role(target_company_id UUID, required_role VARCHAR)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.company_members cm
    JOIN public.users u ON cm.user_id = u.id
    JOIN public.roles r ON cm.role_id = r.id
    WHERE cm.company_id = target_company_id
      AND u.auth_user_id = auth.uid()
      AND r.name = required_role
      AND cm.is_active = true
      AND u.is_active = true
  );
$$;

-- Helper to check if current authenticated user has specific granular permission code in specified company
CREATE OR REPLACE FUNCTION public.has_company_permission(target_company_id UUID, required_permission VARCHAR)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.company_members cm
    JOIN public.users u ON cm.user_id = u.id
    JOIN public.role_permissions rp ON cm.role_id = rp.role_id
    JOIN public.permissions p ON rp.permission_id = p.id
    WHERE cm.company_id = target_company_id
      AND u.auth_user_id = auth.uid()
      AND p.code = required_permission
      AND cm.is_active = true
      AND u.is_active = true
  );
$$;

COMMENT ON FUNCTION public.is_company_member IS 'Returns true if auth.uid() belongs to target_company_id';
COMMENT ON FUNCTION public.has_company_role IS 'Returns true if auth.uid() holds required_role in target_company_id';
COMMENT ON FUNCTION public.has_company_permission IS 'Returns true if auth.uid() holds required_permission in target_company_id';
