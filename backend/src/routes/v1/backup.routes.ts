import { BackupController } from '../../controllers/backup/index.js';
import { authenticateRequest } from '../../middleware/auth.middleware.js';
import { resolveTenantContext } from '../../middleware/tenant.middleware.js';
import { errorResponse } from '../../core/responses/index.js';
import { AppError } from '../../core/errors/index.js';

interface Env { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; }

export async function handleBackupRoutes(request: Request, pathSegments: string[], env: Env): Promise<Response> {
  try {
    const session = await authenticateRequest(request, env);
    const user = await resolveTenantContext(session.authUserId, request.headers.get('x-company-id'), env);
    const method = request.method;

    if (method === 'GET') return BackupController.list(request, user, env);
    if (method === 'POST') return BackupController.create(request, user, env);

    return errorResponse('Backup route not found', 404, 'NOT_FOUND');
  } catch (err: any) {
    return err instanceof AppError ? errorResponse(err.message, err.statusCode, err.code) : errorResponse('Server error', 500, 'SERVER_ERROR');
  }
}
