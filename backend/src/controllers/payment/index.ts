import { PaymentService } from '../../services/payment.service.js';
import { successResponse, errorResponse } from '../../core/responses/index.js';
import { validateCreatePayment } from '../../core/validators/payment.validator.js';
import { UserContext } from '../../core/permissions.js';
import { AppError } from '../../core/errors/index.js';

interface Env { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; }

export const PaymentController = {
  async list(request: Request, user: UserContext, env: Env): Promise<Response> {
    try {
      const url = new URL(request.url);
      const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
      const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10)));
      
      const { data, total } = await PaymentService.listPayments(user, page, limit, env);
      return successResponse({ payments: data, total, page, limit, totalPages: Math.ceil(total / limit) });
    } catch (e) { return handleErr(e); }
  },
  async get(id: string, user: UserContext, env: Env): Promise<Response> {
    try { return successResponse({ payment: await PaymentService.getPayment(id, user, env) }); }
    catch (e) { return handleErr(e); }
  },
  async create(request: Request, user: UserContext, env: Env): Promise<Response> {
    try {
      const body = await request.json();
      const val = validateCreatePayment(body);
      if (!val.success) return errorResponse('Validation failed', 400, 'VALIDATION_ERROR', val.errors);
      return successResponse({ payment: await PaymentService.createPayment(val.data!, user, env) }, 201);
    } catch (e) { return handleErr(e); }
  }
};

function handleErr(e: unknown) {
  return e instanceof AppError ? errorResponse(e.message, e.statusCode, e.code) : errorResponse('Server error', 500, 'SERVER_ERROR');
}
