// User Routes — REST API /api/v1/users/*
import { UserController } from '../../controllers/user/index.js';
import { authenticateRequest } from '../../middleware/auth.middleware.js';
import { resolveTenantContext } from '../../middleware/tenant.middleware.js';
import { errorResponse } from '../../core/responses/index.js';
import { AppError } from '../../core/errors/index.js';

interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

export async function handleUserRoutes(
  request: Request,
  pathSegments: string[],
  env: Env
): Promise<Response> {
  try {
    // Authenticate + resolve tenant
    const session = await authenticateRequest(request, env);
    const requestedCompany = request.headers.get('x-company-id');
    const user = await resolveTenantContext(session.authUserId, requestedCompany, env);

    const method = request.method;
    const seg1 = pathSegments[0] || '';
    const seg2 = pathSegments[1] || '';

    // GET /api/v1/users/me → Own profile
    if (method === 'GET' && seg1 === 'me') {
      return UserController.getMyProfile(user, env);
    }

    // PATCH /api/v1/users/me → Update own profile
    if (method === 'PATCH' && seg1 === 'me') {
      return UserController.updateMyProfile(request, user, env);
    }

    // GET /api/v1/users/members → List company members (paginated)
    if (method === 'GET' && seg1 === 'members') {
      return UserController.listMembers(request, user, env);
    }

    // POST /api/v1/users/invite → Invite new member
    if (method === 'POST' && seg1 === 'invite') {
      return UserController.inviteMember(request, user, env);
    }

    // GET /api/v1/users/:id → Get specific user
    if (method === 'GET' && seg1 && !seg2) {
      return UserController.getUserById(seg1, user, env);
    }

    // PATCH /api/v1/users/:id/role → Update member role
    if (method === 'PATCH' && seg1 && seg2 === 'role') {
      return UserController.updateMemberRole(request, seg1, user, env);
    }

    // DELETE /api/v1/users/:id/membership → Remove member
    if (method === 'DELETE' && seg1 && seg2 === 'membership') {
      return UserController.removeMember(seg1, user, env);
    }

    return errorResponse('User route not found', 404, 'NOT_FOUND');
  } catch (err) {
    if (err instanceof AppError) {
      return errorResponse(err.message, err.statusCode, err.code);
    }
    console.error('[UserRoutes Error]:', err);
    return errorResponse('Internal server error', 500, 'SERVER_ERROR');
  }
}
