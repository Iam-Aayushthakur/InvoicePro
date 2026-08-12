// User Controller — Request/Response handler for user and member endpoints

import { UserService } from '../../services/user.service.js';
import { successResponse, errorResponse } from '../../core/responses/index.js';
import { validateUpdateProfile, validateInviteMember, validateUpdateMemberRole } from '../../core/validators/user.validator.js';
import { UserContext } from '../../core/permissions.js';
import { AppError } from '../../core/errors/index.js';

interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

export const UserController = {
  /**
   * GET /api/v1/users/me
   */
  async getMyProfile(user: UserContext, env: Env): Promise<Response> {
    try {
      const profile = await UserService.getMyProfile(user, env);
      return successResponse({ user: profile });
    } catch (err) {
      return handleErr(err);
    }
  },

  /**
   * PATCH /api/v1/users/me
   */
  async updateMyProfile(request: Request, user: UserContext, env: Env): Promise<Response> {
    try {
      const body = await request.json();
      const validation = validateUpdateProfile(body);
      if (!validation.success) {
        return errorResponse('Validation failed', 400, 'VALIDATION_ERROR', validation.errors);
      }
      const profile = await UserService.updateMyProfile(validation.data!, user, env);
      return successResponse({ user: profile });
    } catch (err) {
      return handleErr(err);
    }
  },

  /**
   * GET /api/v1/users/:id
   */
  async getUserById(targetUserId: string, user: UserContext, env: Env): Promise<Response> {
    try {
      const profile = await UserService.getUserById(targetUserId, user, env);
      return successResponse({ user: profile });
    } catch (err) {
      return handleErr(err);
    }
  },

  /**
   * GET /api/v1/users/members
   */
  async listMembers(request: Request, user: UserContext, env: Env): Promise<Response> {
    try {
      const url = new URL(request.url);
      const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
      const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10)));
      const search = url.searchParams.get('search') || null;

      const result = await UserService.listCompanyMembers(user, page, limit, search, env);
      return successResponse(result);
    } catch (err) {
      return handleErr(err);
    }
  },

  /**
   * POST /api/v1/users/invite
   */
  async inviteMember(request: Request, user: UserContext, env: Env): Promise<Response> {
    try {
      const body = await request.json();
      const validation = validateInviteMember(body);
      if (!validation.success) {
        return errorResponse('Validation failed', 400, 'VALIDATION_ERROR', validation.errors);
      }
      const result = await UserService.inviteMember(validation.data!, user, env);
      return successResponse(result, 201);
    } catch (err) {
      return handleErr(err);
    }
  },

  /**
   * PATCH /api/v1/users/:id/role
   */
  async updateMemberRole(request: Request, targetUserId: string, user: UserContext, env: Env): Promise<Response> {
    try {
      const body = await request.json();
      const validation = validateUpdateMemberRole(body);
      if (!validation.success) {
        return errorResponse('Validation failed', 400, 'VALIDATION_ERROR', validation.errors);
      }
      const result = await UserService.updateMemberRole(targetUserId, validation.data!, user, env);
      return successResponse(result);
    } catch (err) {
      return handleErr(err);
    }
  },

  /**
   * DELETE /api/v1/users/:id/membership
   */
  async removeMember(targetUserId: string, user: UserContext, env: Env): Promise<Response> {
    try {
      const result = await UserService.removeMember(targetUserId, user, env);
      return successResponse(result);
    } catch (err) {
      return handleErr(err);
    }
  },
};

function handleErr(err: unknown): Response {
  if (err instanceof AppError) {
    return errorResponse(err.message, err.statusCode, err.code, err.details);
  }
  console.error('[UserController Error]:', err);
  return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500, 'SERVER_ERROR');
}
