import { CategoryRepository } from '../repositories/category.repository.js';
import { UserContext, assertPermission } from '../core/permissions.js';
import { NotFoundError } from '../core/errors/index.js';
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '../core/types/category.types.js';

interface Env { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; }

export const CategoryService = {
  async getCategory(id: string, user: UserContext, env: Env): Promise<Category> {
    assertPermission(user, 'products.read');
    const cat = await CategoryRepository.findById(id, user.companyId, env);
    if (!cat) throw new NotFoundError('Category not found');
    return cat;
  },
  async listCategories(user: UserContext, page: number, limit: number, search: string | null, env: Env) {
    assertPermission(user, 'products.read');
    return CategoryRepository.list(user.companyId, page, limit, search, env);
  },
  async createCategory(data: CreateCategoryInput, user: UserContext, env: Env): Promise<Category> {
    assertPermission(user, 'products.create');
    return CategoryRepository.create(user.companyId, { ...data, created_by: user.userId }, env);
  },
  async updateCategory(id: string, data: UpdateCategoryInput, user: UserContext, env: Env): Promise<Category> {
    assertPermission(user, 'products.update');
    await this.getCategory(id, user, env);
    return CategoryRepository.update(id, user.companyId, { ...data, updated_by: user.userId }, env);
  },
  async deactivateCategory(id: string, user: UserContext, env: Env): Promise<void> {
    assertPermission(user, 'products.delete');
    await this.getCategory(id, user, env);
    await CategoryRepository.update(id, user.companyId, { is_active: false, updated_by: user.userId }, env);
  }
};
