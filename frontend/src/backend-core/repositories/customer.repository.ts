import { Env, supabaseGetOne, supabaseInsert, supabasePatch, supabaseList } from './base.repository.js';
import type { Customer, CreateCustomerInput, UpdateCustomerInput } from '../core/types/customer.types.js';

export const CustomerRepository = {
  async findById(id: string, companyId: string, env: Env): Promise<Customer | null> {
    return supabaseGetOne<Customer>(env, 'customers', `id=eq.${id}&company_id=eq.${companyId}`);
  },
  async create(companyId: string, data: CreateCustomerInput & { created_by: string }, env: Env): Promise<Customer> {
    const payload = {
      ...data,
      company_id: companyId,
      outstanding_balance: data.opening_balance || 0
    };
    return supabaseInsert<Customer>(env, 'customers', payload);
  },
  async update(id: string, companyId: string, data: UpdateCustomerInput & { updated_by: string }, env: Env): Promise<Customer> {
    return supabasePatch<Customer>(env, 'customers', `id=eq.${id}&company_id=eq.${companyId}`, data);
  },
  async list(companyId: string, page: number, limit: number, search: string | null, env: Env) {
    let query = `company_id=eq.${companyId}&is_active=eq.true&select=*&order=name.asc`;
    if (search) query += `&name=ilike.*${encodeURIComponent(search)}*`;
    return supabaseList<Customer>(env, 'customers', query, page, limit);
  }
};
