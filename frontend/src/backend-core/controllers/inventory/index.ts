import { InventoryService } from '../../services/inventory.service.js';
import { successResponse, errorResponse } from '../../core/responses/index.js';
import { validateRecordTransaction } from '../../core/validators/inventory.validator.js';
import { UserContext } from '../../core/permissions.js';
import { AppError } from '../../core/errors/index.js';

interface Env { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; }

export const InventoryController = {
  async list(request: Request, user: UserContext, env: Env): Promise<Response> {
    try {
      const url = new URL(request.url);
      const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
      const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '50', 10)));
      
      const { data, total } = await InventoryService.listInventory(user, page, limit, env);
      return successResponse({ inventory: data, total, page, limit, totalPages: Math.ceil(total / limit) });
    } catch (e) { return handleErr(e); }
  },
  async get(productId: string, user: UserContext, env: Env): Promise<Response> {
    try { return successResponse({ inventory: await InventoryService.getInventory(productId, user, env) }); }
    catch (e) { return handleErr(e); }
  },
  async transactions(request: Request, productId: string, user: UserContext, env: Env): Promise<Response> {
    try {
      const url = new URL(request.url);
      const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
      const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '50', 10)));
      
      const { data, total } = await InventoryService.listTransactions(productId, user, page, limit, env);
      return successResponse({ transactions: data, total, page, limit, totalPages: Math.ceil(total / limit) });
    } catch (e) { return handleErr(e); }
  },
  async adjust(request: Request, user: UserContext, env: Env): Promise<Response> {
    try {
      const body = await request.json();
      const val = validateRecordTransaction(body);
      if (!val.success) return errorResponse('Validation failed', 400, 'VALIDATION_ERROR', val.errors);
      return successResponse({ transaction: await InventoryService.recordTransaction(val.data!, user, env) }, 201);
    } catch (e) { return handleErr(e); }
  }
};

function handleErr(e: unknown) {
  return e instanceof AppError ? errorResponse(e.message, e.statusCode, e.code) : errorResponse('Server error', 500, 'SERVER_ERROR');
}
