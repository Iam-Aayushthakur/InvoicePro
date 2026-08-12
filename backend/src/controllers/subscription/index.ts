import { SubscriptionService } from '../../services/subscription.service.js';
import { successResponse, errorResponse } from '../../core/responses/index.js';
import { UserContext } from '../../core/permissions.js';
import { AppError } from '../../core/errors/index.js';

interface Env { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; }

export const SubscriptionController = {
  async get(request: Request, user: UserContext, env: Env): Promise<Response> {
    try {
      const data = await SubscriptionService.getSubscriptionDetails(user, env);
      return successResponse(data);
    } catch (e) { 
      return e instanceof AppError ? errorResponse(e.message, e.statusCode, e.code) : errorResponse('Server error', 500, 'SERVER_ERROR'); 
    }
  }
};
