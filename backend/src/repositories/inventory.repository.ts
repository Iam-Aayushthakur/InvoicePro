import { Env, supabaseGetOne, supabaseInsert, supabasePatch, supabaseList } from './base.repository.js';
import type { Inventory, InventoryTransaction, RecordTransactionInput } from '../core/types/inventory.types.js';

export const InventoryRepository = {
  async getByProductId(productId: string, companyId: string, env: Env): Promise<Inventory | null> {
    return supabaseGetOne<Inventory>(env, 'inventory', `product_id=eq.${productId}&company_id=eq.${companyId}`);
  },
  
  async ensureInventoryExists(productId: string, companyId: string, env: Env): Promise<Inventory> {
    let inv = await this.getByProductId(productId, companyId, env);
    if (!inv) {
      inv = await supabaseInsert<Inventory>(env, 'inventory', { company_id: companyId, product_id: productId, quantity: 0, reserved_quantity: 0 });
    }
    return inv;
  },

  async recordTransaction(companyId: string, data: RecordTransactionInput & { created_by: string }, env: Env): Promise<InventoryTransaction> {
    const inv = await this.ensureInventoryExists(data.product_id, companyId, env);
    const prevQty = inv.quantity;
    const newQty = prevQty + data.quantity;
    
    // Create transaction log
    const tx = await supabaseInsert<InventoryTransaction>(env, 'inventory_transactions', {
      company_id: companyId,
      product_id: data.product_id,
      transaction_type: data.transaction_type,
      quantity: data.quantity,
      reference_type: data.reference_type,
      reference_id: data.reference_id,
      previous_quantity: prevQty,
      new_quantity: newQty,
      notes: data.notes,
      created_by: data.created_by,
    });
    
    // Update master quantity
    await supabasePatch<Inventory>(env, 'inventory', `id=eq.${inv.id}`, { quantity: newQty });
    return tx;
  },

  async listInventory(companyId: string, page: number, limit: number, env: Env) {
    return supabaseList<Inventory & { products: { name: string, sku: string } }>(
      env, 'inventory', `company_id=eq.${companyId}&select=*,products(name,sku)`, page, limit
    );
  },
  
  async listTransactions(productId: string, companyId: string, page: number, limit: number, env: Env) {
    return supabaseList<InventoryTransaction>(
      env, 'inventory_transactions', `company_id=eq.${companyId}&product_id=eq.${productId}&select=*&order=created_at.desc`, page, limit
    );
  }
};
