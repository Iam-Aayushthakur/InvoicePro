import { NotificationService } from '../../services/notification.service.js';
import { successResponse, errorResponse } from '../../core/responses/index.js';
import { validateCreateNotification } from '../../core/validators/notification.validator.js';
import { UserContext } from '../../core/permissions.js';
import { AppError } from '../../core/errors/index.js';

interface Env { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; }

export const NotificationController = {
  async list(request: Request, user: UserContext, env: Env): Promise<Response> {
    try {
      const url = new URL(request.url);
      const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
      const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '50', 10)));
      
      const { data, total } = await NotificationService.listNotifications(user, page, limit, env);
      return successResponse({ notifications: data, total, page, limit, totalPages: Math.ceil(total / limit) });
    } catch (e) { return handleErr(e); }
  },
  async create(request: Request, user: UserContext, env: Env): Promise<Response> {
    try {
      const body = await request.json();
      const val = validateCreateNotification(body);
      if (!val.success) return errorResponse('Validation failed', 400, 'VALIDATION_ERROR', val.errors);
      return successResponse({ notification: await NotificationService.createNotification(val.data!, user, env) }, 201);
    } catch (e) { return handleErr(e); }
  },
  async markRead(request: Request, id: string, user: UserContext, env: Env): Promise<Response> {
    try { return successResponse({ notification: await NotificationService.markAsRead(id, user, env) }); }
    catch (e) { return handleErr(e); }
  },
  async markAllRead(request: Request, user: UserContext, env: Env): Promise<Response> {
    try { 
      await NotificationService.markAllAsRead(user, env); 
      return successResponse({ success: true, message: 'All notifications marked as read' });
    } catch (e) { return handleErr(e); }
  }
};

function handleErr(e: unknown) {
  return e instanceof AppError ? errorResponse(e.message, e.statusCode, e.code) : errorResponse('Server error', 500, 'SERVER_ERROR');
}
