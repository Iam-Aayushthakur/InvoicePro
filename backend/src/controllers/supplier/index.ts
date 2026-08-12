import { SupplierService } from '../../services/supplier.service.js';
import { successResponse, errorResponse } from '../../core/responses/index.js';
import { validateCreateSupplier, validateUpdateSupplier } from '../../core/validators/supplier.validator.js';
import { UserContext } from '../../core/permissions.js';
import { AppError } from '../../core/errors/index.js';

interface Env { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; }

export const SupplierController = {
  async list(request: Request, user: UserContext, env: Env): Promise<Response> {
    try {
      const url = new URL(request.url);
      const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
      const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10)));
      const search = url.searchParams.get('search') || null;
      
      const { data, total } = await SupplierService.listSuppliers(user, page, limit, search, env);
      return successResponse({ suppliers: data, total, page, limit, totalPages: Math.ceil(total / limit) });
    } catch (e) { return handleErr(e); }
  },
  async get(id: string, user: UserContext, env: Env): Promise<Response> {
    try { return successResponse({ supplier: await SupplierService.getSupplier(id, user, env) }); }
    catch (e) { return handleErr(e); }
  },
  async create(request: Request, user: UserContext, env: Env): Promise<Response> {
    try {
      const body = await request.json();
      const val = validateCreateSupplier(body);
      if (!val.success) return errorResponse('Validation failed', 400, 'VALIDATION_ERROR', val.errors);
      return successResponse({ supplier: await SupplierService.createSupplier(val.data!, user, env) }, 201);
    } catch (e) { return handleErr(e); }
  },
  async update(request: Request, id: string, user: UserContext, env: Env): Promise<Response> {
    try {
      const body = await request.json();
      const val = validateUpdateSupplier(body);
      if (!val.success) return errorResponse('Validation failed', 400, 'VALIDATION_ERROR', val.errors);
      return successResponse({ supplier: await SupplierService.updateSupplier(id, val.data!, user, env) });
    } catch (e) { return handleErr(e); }
  },
  async deactivate(id: string, user: UserContext, env: Env): Promise<Response> {
    try {
      await SupplierService.deactivateSupplier(id, user, env);
      return successResponse({ message: 'Supplier deactivated' });
    } catch (e) { return handleErr(e); }
  }
};

function handleErr(e: unknown) {
  return e instanceof AppError ? errorResponse(e.message, e.statusCode, e.code) : errorResponse('Server error', 500, 'SERVER_ERROR');
}
