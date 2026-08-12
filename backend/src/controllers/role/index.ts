import { RoleService } from '../../services/role.service.js';
import { successResponse, errorResponse } from '../../core/responses/index.js';
import { validateAssignPermissions } from '../../core/validators/role.validator.js';
import { UserContext } from '../../core/permissions.js';
import { AppError } from '../../core/errors/index.js';

interface Env { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; }

export const RoleController = {
  async listRoles(user: UserContext, env: Env): Promise<Response> {
    try { return successResponse({ roles: await RoleService.listRoles(user, env) }); }
    catch (e) { return e instanceof AppError ? errorResponse(e.message, e.statusCode, e.code) : errorResponse('Server error', 500, 'SERVER_ERROR'); }
  },
  async listPermissions(request: Request, user: UserContext, env: Env): Promise<Response> {
    try {
      const module = new URL(request.url).searchParams.get('module');
      const perms = module ? await RoleService.listPermissionsByModule(module, user, env) : await RoleService.listPermissions(user, env);
      return successResponse({ permissions: perms });
    } catch (e) { return e instanceof AppError ? errorResponse(e.message, e.statusCode, e.code) : errorResponse('Server error', 500, 'SERVER_ERROR'); }
  },
  async getRolePermissions(roleId: string, user: UserContext, env: Env): Promise<Response> {
    try { return successResponse(await RoleService.getRoleWithPermissions(roleId, user, env)); }
    catch (e) { return e instanceof AppError ? errorResponse(e.message, e.statusCode, e.code) : errorResponse('Server error', 500, 'SERVER_ERROR'); }
  },
  async updateRolePermissions(request: Request, roleId: string, user: UserContext, env: Env): Promise<Response> {
    try {
      const body = await request.json();
      const validation = validateAssignPermissions(body);
      if (!validation.success) return errorResponse('Validation failed', 400, 'VALIDATION_ERROR', validation.errors);
      return successResponse(await RoleService.updateRolePermissions(roleId, validation.data!.permission_ids, user, env));
    } catch (e) { return e instanceof AppError ? errorResponse(e.message, e.statusCode, e.code) : errorResponse('Server error', 500, 'SERVER_ERROR'); }
  },
};
