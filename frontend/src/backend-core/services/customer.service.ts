import { CustomerRepository } from '../repositories/customer.repository.js';
import { UserContext, assertPermission } from '../core/permissions.js';
import { NotFoundError } from '../core/errors/index.js';
import type { Customer, CreateCustomerInput, UpdateCustomerInput } from '../core/types/customer.types.js';

interface Env { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; }

export const CustomerService = {
  async getCustomer(id: string, user: UserContext, env: Env): Promise<Customer> {
    assertPermission(user, 'customers.read');
    const cust = await CustomerRepository.findById(id, user.companyId, env);
    if (!cust) throw new NotFoundError('Customer not found');
    return cust;
  },
  async listCustomers(user: UserContext, page: number, limit: number, search: string | null, env: Env) {
    assertPermission(user, 'customers.read');
    return CustomerRepository.list(user.companyId, page, limit, search, env);
  },
  async createCustomer(data: CreateCustomerInput, user: UserContext, env: Env): Promise<Customer> {
    assertPermission(user, 'customers.create');
    return CustomerRepository.create(user.companyId, { ...data, created_by: user.userId }, env);
  },
  async updateCustomer(id: string, data: UpdateCustomerInput, user: UserContext, env: Env): Promise<Customer> {
    assertPermission(user, 'customers.update');
    await this.getCustomer(id, user, env); // verify existence
    return CustomerRepository.update(id, user.companyId, { ...data, updated_by: user.userId }, env);
  },
  async deactivateCustomer(id: string, user: UserContext, env: Env): Promise<void> {
    assertPermission(user, 'customers.delete');
    await this.getCustomer(id, user, env);
    await CustomerRepository.update(id, user.companyId, { is_active: false, updated_by: user.userId }, env);
  }
};
