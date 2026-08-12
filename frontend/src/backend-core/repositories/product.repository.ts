import { Env, supabaseGetOne, supabaseInsert, supabasePatch, supabaseList } from './base.repository.js';
import type { Product, CreateProductInput, UpdateProductInput } from '../core/types/product.types.js';

export const ProductRepository = {
  async findById(id: string, companyId: string, env: Env): Promise<Product | null> {
    return supabaseGetOne<Product>(env, 'products', `id=eq.${id}&company_id=eq.${companyId}`);
  },
  async create(companyId: string, data: CreateProductInput & { created_by: string }, env: Env): Promise<Product> {
    const payload = { ...data, company_id: companyId };
    return supabaseInsert<Product>(env, 'products', payload);
  },
  async update(id: string, companyId: string, data: UpdateProductInput & { updated_by: string }, env: Env): Promise<Product> {
    return supabasePatch<Product>(env, 'products', `id=eq.${id}&company_id=eq.${companyId}`, data);
  },
  async list(companyId: string, page: number, limit: number, search: string | null, env: Env) {
    let query = `company_id=eq.${companyId}&is_active=eq.true&select=*&order=name.asc`;
    if (search) query += `&name=ilike.*${encodeURIComponent(search)}*`;
    return supabaseList<Product>(env, 'products', query, page, limit);
  }
};
