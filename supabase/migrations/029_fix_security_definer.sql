-- MIGRATION 029: Fix Security Definer Permissions
-- Revokes public and anon execute permissions from SECURITY DEFINER functions to resolve linter warnings.
-- These functions are only meant to be called by authenticated users during RLS evaluation.

-- Revoke from PUBLIC (which includes everyone) and explicitly from anon
REVOKE EXECUTE ON FUNCTION public.has_company_permission(uuid, varchar) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_company_permission(uuid, varchar) FROM anon;

REVOKE EXECUTE ON FUNCTION public.has_company_role(uuid, varchar) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_company_role(uuid, varchar) FROM anon;

REVOKE EXECUTE ON FUNCTION public.is_company_member(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_company_member(uuid) FROM anon;

-- Note: The function public.rls_auto_enable() was flagged but is not in our migration history.
-- We will attempt to revoke it if it exists.
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'rls_auto_enable') THEN
    REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC;
    REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon;
  END IF;
END $$;

-- Explicitly grant execute to authenticated role so RLS policies can still use them
GRANT EXECUTE ON FUNCTION public.has_company_permission(uuid, varchar) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_company_role(uuid, varchar) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_company_member(uuid) TO authenticated;
