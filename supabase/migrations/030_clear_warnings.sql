-- MIGRATION 030: Clear Security Definer Warnings completely
-- The Supabase linter warns if SECURITY DEFINER functions exist in an API-exposed schema (public).
-- By moving these internal RLS helper functions to a private schema, they are removed from the PostgREST API.
-- PostgreSQL automatically resolves OID dependencies, so existing RLS policies in public will continue to work.

CREATE SCHEMA IF NOT EXISTS private;

ALTER FUNCTION public.has_company_permission(uuid, varchar) SET SCHEMA private;
ALTER FUNCTION public.has_company_role(uuid, varchar) SET SCHEMA private;
ALTER FUNCTION public.is_company_member(uuid) SET SCHEMA private;

-- If rls_auto_enable exists, move it too
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc JOIN pg_namespace ON pg_proc.pronamespace = pg_namespace.oid WHERE proname = 'rls_auto_enable' AND nspname = 'public') THEN
    ALTER FUNCTION public.rls_auto_enable() SET SCHEMA private;
  END IF;
END $$;
