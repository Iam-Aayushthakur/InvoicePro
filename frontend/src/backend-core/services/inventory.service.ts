import { InventoryRepository } from '../repositories/inventory.repository.js';
import { UserContext, assertPermission } from '../core/permissions.js';
import type { RecordTransactionInput, Inventory, InventoryTransaction } from '../core/types/inventory.types.js';

interface Env { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; }

export const InventoryService = {
  async getInventory(productId: string, user: UserContext, env: Env): Promise<Inventory> {
    assertPermission(user, 'inventory.read');
    return InventoryRepository.ensureInventoryExists(productId, user.companyId, env);
  },
  async listInventory(user: UserContext, page: number, limit: number, env: Env) {
    assertPermission(user, 'inventory.read');
    return InventoryRepository.listInventory(user.companyId, page, limit, env);
  },
  async listTransactions(productId: string, user: UserContext, page: number, limit: number, env: Env) {
    assertPermission(user, 'inventory.read');
    return InventoryRepository.listTransactions(productId, user.companyId, page, limit, env);
  },
  async recordTransaction(data: RecordTransactionInput, user: UserContext, env: Env): Promise<InventoryTransaction> {
    assertPermission(user, 'inventory.update');
    return InventoryRepository.recordTransaction(user.companyId, { ...data, created_by: user.userId }, env);
  }
};
