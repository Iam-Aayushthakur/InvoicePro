import { SupplierRepository } from '../repositories/supplier.repository.js';
import { UserContext, assertPermission } from '../core/permissions.js';
import { NotFoundError } from '../core/errors/index.js';
import type { Supplier, CreateSupplierInput, UpdateSupplierInput } from '../core/types/supplier.types.js';

interface Env { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; }

export const SupplierService = {
  async getSupplier(id: string, user: UserContext, env: Env): Promise<Supplier> {
    assertPermission(user, 'suppliers.read');
    const sup = await SupplierRepository.findById(id, user.companyId, env);
    if (!sup) throw new NotFoundError('Supplier not found');
    return sup;
  },
  async listSuppliers(user: UserContext, page: number, limit: number, search: string | null, env: Env) {
    assertPermission(user, 'suppliers.read');
    return SupplierRepository.list(user.companyId, page, limit, search, env);
  },
  async createSupplier(data: CreateSupplierInput, user: UserContext, env: Env): Promise<Supplier> {
    assertPermission(user, 'suppliers.create');
    return SupplierRepository.create(user.companyId, { ...data, created_by: user.userId }, env);
  },
  async updateSupplier(id: string, data: UpdateSupplierInput, user: UserContext, env: Env): Promise<Supplier> {
    assertPermission(user, 'suppliers.update');
    await this.getSupplier(id, user, env); // verify existence
    return SupplierRepository.update(id, user.companyId, { ...data, updated_by: user.userId }, env);
  },
  async deactivateSupplier(id: string, user: UserContext, env: Env): Promise<void> {
    assertPermission(user, 'suppliers.delete');
    await this.getSupplier(id, user, env);
    await SupplierRepository.update(id, user.companyId, { is_active: false, updated_by: user.userId }, env);
  }
};
