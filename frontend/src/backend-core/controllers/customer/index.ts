import { CustomerService } from '../../services/customer.service.js';
import { successResponse, errorResponse } from '../../core/responses/index.js';
import { validateCreateCustomer, validateUpdateCustomer } from '../../core/validators/customer.validator.js';
import { UserContext } from '../../core/permissions.js';
import { AppError } from '../../core/errors/index.js';

interface Env { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; }

export const CustomerController = {
  async list(request: Request, user: UserContext, env: Env): Promise<Response> {
    try {
      const url = new URL(request.url);
      const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
      const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10)));
      const search = url.searchParams.get('search') || null;
      
      const { data, total } = await CustomerService.listCustomers(user, page, limit, search, env);
      return successResponse({ customers: data, total, page, limit, totalPages: Math.ceil(total / limit) });
    } catch (e) { return handleErr(e); }
  },
  async get(id: string, user: UserContext, env: Env): Promise<Response> {
    try { return successResponse({ customer: await CustomerService.getCustomer(id, user, env) }); }
    catch (e) { return handleErr(e); }
  },
  async create(request: Request, user: UserContext, env: Env): Promise<Response> {
    try {
      const body = await request.json();
      const val = validateCreateCustomer(body);
      if (!val.success) return errorResponse('Validation failed', 400, 'VALIDATION_ERROR', val.errors);
      return successResponse({ customer: await CustomerService.createCustomer(val.data!, user, env) }, 201);
    } catch (e) { return handleErr(e); }
  },
  async update(request: Request, id: string, user: UserContext, env: Env): Promise<Response> {
    try {
      const body = await request.json();
      const val = validateUpdateCustomer(body);
      if (!val.success) return errorResponse('Validation failed', 400, 'VALIDATION_ERROR', val.errors);
      return successResponse({ customer: await CustomerService.updateCustomer(id, val.data!, user, env) });
    } catch (e) { return handleErr(e); }
  },
  async deactivate(id: string, user: UserContext, env: Env): Promise<Response> {
    try {
      await CustomerService.deactivateCustomer(id, user, env);
      return successResponse({ message: 'Customer deactivated' });
    } catch (e) { return handleErr(e); }
  }
};

function handleErr(e: unknown) {
  return e instanceof AppError ? errorResponse(e.message, e.statusCode, e.code) : errorResponse('Server error', 500, 'SERVER_ERROR');
}
