import { AuthController } from '../../controllers/auth/index.js';
import { authenticateRequest } from '../../middleware/auth.middleware.js';
import { resolveTenantContext } from '../../middleware/tenant.middleware.js';
import { errorResponse } from '../../core/responses/index.js';

export async function handleAuthRoutes(
  request: Request,
  pathSegments: string[],
  env: { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string }
): Promise<Response> {
  const method = request.method;
  const subRoute = pathSegments[0]; // e.g. /api/v1/auth/register or /api/v1/auth/me

  if (method === 'POST' && subRoute === 'register') {
    return AuthController.register(request, env);
  }

  if (method === 'GET' && subRoute === 'me') {
    try {
      const session = await authenticateRequest(request, env);
      const requestedCompany = request.headers.get('x-company-id');
      const userContext = await resolveTenantContext(session.authUserId, requestedCompany, env);
      return AuthController.getMe(userContext);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unauthorized';
      return errorResponse(msg, 401, 'UNAUTHORIZED');
    }
  }

  return errorResponse('Route not found', 404, 'NOT_FOUND');
}
