import { Env, supabaseGetOne, supabaseInsert, supabasePatch, supabaseList } from './base.repository.js';
import type { Supplier, CreateSupplierInput, UpdateSupplierInput } from '../core/types/supplier.types.js';

export const SupplierRepository = {
  async findById(id: string, companyId: string, env: Env): Promise<Supplier | null> {
    return supabaseGetOne<Supplier>(env, 'suppliers', `id=eq.${id}&company_id=eq.${companyId}`);
  },
  async create(companyId: string, data: CreateSupplierInput & { created_by: string }, env: Env): Promise<Supplier> {
    const payload = {
      ...data,
      company_id: companyId,
      outstanding_balance: data.opening_balance || 0
    };
    return supabaseInsert<Supplier>(env, 'suppliers', payload);
  },
  async update(id: string, companyId: string, data: UpdateSupplierInput & { updated_by: string }, env: Env): Promise<Supplier> {
    return supabasePatch<Supplier>(env, 'suppliers', `id=eq.${id}&company_id=eq.${companyId}`, data);
  },
  async list(companyId: string, page: number, limit: number, search: string | null, env: Env) {
    let query = `company_id=eq.${companyId}&is_active=eq.true&select=*&order=name.asc`;
    if (search) query += `&name=ilike.*${encodeURIComponent(search)}*`;
    return supabaseList<Supplier>(env, 'suppliers', query, page, limit);
  }
};
