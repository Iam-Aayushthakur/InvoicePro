import { ProductRepository } from '../repositories/product.repository.js';
import { UserContext, assertPermission } from '../core/permissions.js';
import { NotFoundError } from '../core/errors/index.js';
import type { Product, CreateProductInput, UpdateProductInput } from '../core/types/product.types.js';

interface Env { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; }

export const ProductService = {
  async getProduct(id: string, user: UserContext, env: Env): Promise<Product> {
    assertPermission(user, 'products.read');
    const prod = await ProductRepository.findById(id, user.companyId, env);
    if (!prod) throw new NotFoundError('Product not found');
    return prod;
  },
  async listProducts(user: UserContext, page: number, limit: number, search: string | null, env: Env) {
    assertPermission(user, 'products.read');
    return ProductRepository.list(user.companyId, page, limit, search, env);
  },
  async createProduct(data: CreateProductInput, user: UserContext, env: Env): Promise<Product> {
    assertPermission(user, 'products.create');
    return ProductRepository.create(user.companyId, { ...data, created_by: user.userId }, env);
  },
  async updateProduct(id: string, data: UpdateProductInput, user: UserContext, env: Env): Promise<Product> {
    assertPermission(user, 'products.update');
    await this.getProduct(id, user, env);
    return ProductRepository.update(id, user.companyId, { ...data, updated_by: user.userId }, env);
  },
  async deactivateProduct(id: string, user: UserContext, env: Env): Promise<void> {
    assertPermission(user, 'products.delete');
    await this.getProduct(id, user, env);
    await ProductRepository.update(id, user.companyId, { is_active: false, updated_by: user.userId }, env);
  }
};
