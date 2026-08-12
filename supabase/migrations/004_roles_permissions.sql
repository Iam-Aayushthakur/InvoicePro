-- ==================================================
-- MIGRATION 004: Roles and Permissions (RBAC Database Engine)
-- Purpose: System & Custom RBAC definition tables
-- ==================================================

CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL, -- OWNER, ADMIN, ACCOUNTANT, CASHIER, WAREHOUSE_MANAGER, EMPLOYEE
    description TEXT,
    is_system BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) UNIQUE NOT NULL, -- e.g. 'invoices.create', 'reports.read'
    module VARCHAR(100) NOT NULL, -- invoices, customers, inventory, etc.
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (role_id, permission_id)
);

CREATE INDEX IF NOT EXISTS idx_permissions_code ON public.permissions(code);
CREATE INDEX IF NOT EXISTS idx_permissions_module ON public.permissions(module);

COMMENT ON TABLE public.roles IS 'Role definitions for system and tenants';
COMMENT ON TABLE public.permissions IS 'Fine-grained system permission keys';
COMMENT ON TABLE public.role_permissions IS 'Mapping table connecting roles to permissions';
