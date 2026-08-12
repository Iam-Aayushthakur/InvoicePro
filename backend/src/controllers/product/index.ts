import { ProductService } from '../../services/product.service.js';
import { successResponse, errorResponse } from '../../core/responses/index.js';
import { validateCreateProduct, validateUpdateProduct } from '../../core/validators/product.validator.js';
import { UserContext } from '../../core/permissions.js';
import { AppError } from '../../core/errors/index.js';

interface Env { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; }

export const ProductController = {
  async list(request: Request, user: UserContext, env: Env): Promise<Response> {
    try {
      const url = new URL(request.url);
      const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
      const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10)));
      const search = url.searchParams.get('search') || null;
      
      const { data, total } = await ProductService.listProducts(user, page, limit, search, env);
      return successResponse({ products: data, total, page, limit, totalPages: Math.ceil(total / limit) });
    } catch (e) { return handleErr(e); }
  },
  async get(id: string, user: UserContext, env: Env): Promise<Response> {
    try { return successResponse({ product: await ProductService.getProduct(id, user, env) }); }
    catch (e) { return handleErr(e); }
  },
  async create(request: Request, user: UserContext, env: Env): Promise<Response> {
    try {
      const body = await request.json();
      const val = validateCreateProduct(body);
      if (!val.success) return errorResponse('Validation failed', 400, 'VALIDATION_ERROR', val.errors);
      return successResponse({ product: await ProductService.createProduct(val.data!, user, env) }, 201);
    } catch (e) { return handleErr(e); }
  },
  async update(request: Request, id: string, user: UserContext, env: Env): Promise<Response> {
    try {
      const body = await request.json();
      const val = validateUpdateProduct(body);
      if (!val.success) return errorResponse('Validation failed', 400, 'VALIDATION_ERROR', val.errors);
      return successResponse({ product: await ProductService.updateProduct(id, val.data!, user, env) });
    } catch (e) { return handleErr(e); }
  },
  async deactivate(id: string, user: UserContext, env: Env): Promise<Response> {
    try {
      await ProductService.deactivateProduct(id, user, env);
      return successResponse({ message: 'Product deactivated' });
    } catch (e) { return handleErr(e); }
  }
};

function handleErr(e: unknown) {
  return e instanceof AppError ? errorResponse(e.message, e.statusCode, e.code) : errorResponse('Server error', 500, 'SERVER_ERROR');
}
