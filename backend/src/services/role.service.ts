import { RoleRepository } from '../repositories/role.repository.js';
import { UserContext, assertPermission } from '../core/permissions.js';
import { ForbiddenError } from '../core/errors/index.js';
import type { Role, Permission, RoleWithPermissions } from '../core/types/role.types.js';

interface Env { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; }

export const RoleService = {
  async listRoles(user: UserContext, env: Env): Promise<Role[]> {
    return RoleRepository.listRoles(env);
  },
  async listPermissions(user: UserContext, env: Env): Promise<Permission[]> {
    return RoleRepository.listPermissions(env);
  },
  async listPermissionsByModule(module: string, user: UserContext, env: Env): Promise<Permission[]> {
    return RoleRepository.listPermissionsByModule(module, env);
  },
  async getRoleWithPermissions(roleId: string, user: UserContext, env: Env): Promise<RoleWithPermissions> {
    const role = await RoleRepository.findRoleById(roleId, env);
    if (!role) throw new ForbiddenError('Role not found');
    const permissions = await RoleRepository.getRolePermissions(roleId, env);
    return { ...role, permissions };
  },
  async updateRolePermissions(roleId: string, permissionIds: string[], user: UserContext, env: Env): Promise<{ message: string }> {
    assertPermission(user, 'settings.update');
    const role = await RoleRepository.findRoleById(roleId, env);
    if (!role) throw new ForbiddenError('Role not found');
    if (role.name === 'OWNER') throw new ForbiddenError('Cannot modify OWNER role permissions');
    await RoleRepository.setRolePermissions(roleId, permissionIds, env);
    return { message: `Permissions updated for role '${role.name}'` };
  },
};
