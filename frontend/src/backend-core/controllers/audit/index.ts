import { AuditService } from '../../services/audit.service.js';
import { successResponse, errorResponse } from '../../core/responses/index.js';
import { UserContext } from '../../core/permissions.js';
import { AppError } from '../../core/errors/index.js';

interface Env { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; }

export const AuditController = {
  async list(request: Request, user: UserContext, env: Env): Promise<Response> {
    try {
      const url = new URL(request.url);
      const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
      const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '50', 10)));
      
      const { data, total } = await AuditService.listAuditLogs(user, page, limit, env);
      return successResponse({ auditLogs: data, total, page, limit, totalPages: Math.ceil(total / limit) });
    } catch (e) { 
      return e instanceof AppError ? errorResponse(e.message, e.statusCode, e.code) : errorResponse('Server error', 500, 'SERVER_ERROR'); 
    }
  }
};
