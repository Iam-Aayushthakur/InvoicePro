import { CustomerController } from '../../controllers/customer/index.js';
import { authenticateRequest } from '../../middleware/auth.middleware.js';
import { resolveTenantContext } from '../../middleware/tenant.middleware.js';
import { errorResponse } from '../../core/responses/index.js';
import { AppError } from '../../core/errors/index.js';

interface Env { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; }

export async function handleCustomerRoutes(request: Request, pathSegments: string[], env: Env): Promise<Response> {
  try {
    const session = await authenticateRequest(request, env);
    const user = await resolveTenantContext(session.authUserId, request.headers.get('x-company-id'), env);
    const method = request.method;
    const seg1 = pathSegments[0] || '';

    if (method === 'GET' && seg1 === '') return CustomerController.list(request, user, env);
    if (method === 'POST' && seg1 === '') return CustomerController.create(request, user, env);
    if (method === 'GET' && seg1) return CustomerController.get(seg1, user, env);
    if (method === 'PATCH' && seg1) return CustomerController.update(request, seg1, user, env);
    if (method === 'DELETE' && seg1) return CustomerController.deactivate(seg1, user, env);

    return errorResponse('Customer route not found', 404, 'NOT_FOUND');
  } catch (err) {
    return err instanceof AppError ? errorResponse(err.message, err.statusCode, err.code) : errorResponse('Server error', 500, 'SERVER_ERROR');
  }
}
