import { Env, supabaseGetOne, supabaseInsert, supabasePatch, supabaseList } from './base.repository.js';
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '../core/types/category.types.js';

export const CategoryRepository = {
  async findById(id: string, companyId: string, env: Env): Promise<Category | null> {
    return supabaseGetOne<Category>(env, 'categories', `id=eq.${id}&company_id=eq.${companyId}`);
  },
  async create(companyId: string, data: CreateCategoryInput & { created_by: string }, env: Env): Promise<Category> {
    const payload = { ...data, company_id: companyId };
    return supabaseInsert<Category>(env, 'categories', payload);
  },
  async update(id: string, companyId: string, data: UpdateCategoryInput & { updated_by: string }, env: Env): Promise<Category> {
    return supabasePatch<Category>(env, 'categories', `id=eq.${id}&company_id=eq.${companyId}`, data);
  },
  async list(companyId: string, page: number, limit: number, search: string | null, env: Env) {
    let query = `company_id=eq.${companyId}&is_active=eq.true&select=*&order=name.asc`;
    if (search) query += `&name=ilike.*${encodeURIComponent(search)}*`;
    return supabaseList<Category>(env, 'categories', query, page, limit);
  }
};
