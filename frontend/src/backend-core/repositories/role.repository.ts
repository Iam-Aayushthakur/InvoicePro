import type { Role, Permission } from '../core/types/role.types.js';
import { NotFoundError } from '../core/errors/index.js';

interface Env { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; }
function h(env: Env) { return { 'Content-Type': 'application/json', apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`, Prefer: 'return=representation' }; }

export const RoleRepository = {
  async listRoles(env: Env): Promise<Role[]> {
    const r = await fetch(`${env.SUPABASE_URL}/rest/v1/roles?select=*&order=name.asc`, { headers: h(env) });
    return r.ok ? await r.json() as Role[] : [];
  },
  async findRoleById(id: string, env: Env): Promise<Role | null> {
    const r = await fetch(`${env.SUPABASE_URL}/rest/v1/roles?id=eq.${id}&select=*`, { headers: h(env) });
    if (!r.ok) return null;
    const rows = await r.json() as Role[];
    return rows[0] || null;
  },
  async listPermissions(env: Env): Promise<Permission[]> {
    const r = await fetch(`${env.SUPABASE_URL}/rest/v1/permissions?select=*&order=module.asc,code.asc`, { headers: h(env) });
    return r.ok ? await r.json() as Permission[] : [];
  },
  async listPermissionsByModule(module: string, env: Env): Promise<Permission[]> {
    const r = await fetch(`${env.SUPABASE_URL}/rest/v1/permissions?module=eq.${module}&select=*&order=code.asc`, { headers: h(env) });
    return r.ok ? await r.json() as Permission[] : [];
  },
  async getRolePermissions(roleId: string, env: Env): Promise<Permission[]> {
    const r = await fetch(`${env.SUPABASE_URL}/rest/v1/role_permissions?role_id=eq.${roleId}&select=permissions(*)`, { headers: h(env) });
    if (!r.ok) return [];
    const rows = await r.json() as Array<{ permissions: Permission }>;
    return rows.map(rp => rp.permissions);
  },
  async setRolePermissions(roleId: string, permissionIds: string[], env: Env): Promise<void> {
    // Delete existing
    await fetch(`${env.SUPABASE_URL}/rest/v1/role_permissions?role_id=eq.${roleId}`, { method: 'DELETE', headers: h(env) });
    // Insert new
    if (permissionIds.length > 0) {
      const body = permissionIds.map(pid => ({ role_id: roleId, permission_id: pid }));
      await fetch(`${env.SUPABASE_URL}/rest/v1/role_permissions`, { method: 'POST', headers: h(env), body: JSON.stringify(body) });
    }
  },
};
