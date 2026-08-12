import { SubscriptionController } from '../../controllers/subscription/index.js';
import { authenticateRequest } from '../../middleware/auth.middleware.js';
import { resolveTenantContext } from '../../middleware/tenant.middleware.js';
import { errorResponse } from '../../core/responses/index.js';

interface Env { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; }

export async function handleSubscriptionRoutes(request: Request, pathSegments: string[], env: Env): Promise<Response> {
  try {
    const session = await authenticateRequest(request, env);
    const user = await resolveTenantContext(session.authUserId, request.headers.get('x-company-id'), env);
    const method = request.method;

    if (method === 'GET') return SubscriptionController.get(request, user, env);

    return errorResponse('Subscription route not found', 404, 'NOT_FOUND');
  } catch (err: any) {
    return errorResponse(err.message || 'Server error', err.statusCode || 500, err.code || 'SERVER_ERROR');
  }
}
