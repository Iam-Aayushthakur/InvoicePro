import { PurchaseRepository } from '../repositories/purchase.repository.js';
import { InventoryRepository } from '../repositories/inventory.repository.js';
import { UserContext, assertPermission } from '../core/permissions.js';
import { NotFoundError, ConflictError } from '../core/errors/index.js';
import type { Purchase, CreatePurchaseInput, UpdatePurchaseStatusInput } from '../core/types/purchase.types.js';
import { calculateLineTax, calculateInvoiceTotals } from './gst.service.js';

interface Env { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; }

export const PurchaseService = {
  async getPurchase(id: string, user: UserContext, env: Env): Promise<Purchase> {
    assertPermission(user, 'purchases.read');
    const pur = await PurchaseRepository.findById(id, user.companyId, env);
    if (!pur) throw new NotFoundError('Purchase order not found');
    return pur;
  },
  async listPurchases(user: UserContext, page: number, limit: number, env: Env) {
    assertPermission(user, 'purchases.read');
    return PurchaseRepository.list(user.companyId, page, limit, env);
  },
  async createPurchase(data: CreatePurchaseInput, user: UserContext, env: Env): Promise<Purchase> {
    assertPermission(user, 'purchases.create');
    
    // Calculate authoritative totals using GST service
    // Assuming same state for simplicity in purchases unless supplier state is fetched
    const lineResults = data.items.map(item => calculateLineTax({
      quantity: item.quantity,
      unit_price: item.unit_price,
      discount: item.discount || 0,
      tax_rate: item.tax_rate || 0,
      seller_state_code: 'Same', // Mock
      buyer_state_code: 'Same'
    }));

    const totals = calculateInvoiceTotals(lineResults);
    const totalsWithLines = { ...totals, lineTotals: lineResults };

    const purchase = await PurchaseRepository.create(user.companyId, data, totalsWithLines, user.userId, env);

    // If immediately received, increment inventory
    if (purchase.status === 'RECEIVED' && purchase.items) {
      await this.processInventoryReceive(purchase, user, env);
    }

    return purchase;
  },
  
  async updateStatus(id: string, data: UpdatePurchaseStatusInput, user: UserContext, env: Env): Promise<Purchase> {
    assertPermission(user, 'purchases.update');
    const purchase = await this.getPurchase(id, user, env);

    if (purchase.status === 'RECEIVED' && data.status !== 'RECEIVED') {
      throw new ConflictError('Cannot change status of an already received purchase order.');
    }

    const updated = await PurchaseRepository.updateStatus(id, user.companyId, data.status, user.userId, env);

    // If transitioned to RECEIVED, increment inventory
    if (purchase.status !== 'RECEIVED' && data.status === 'RECEIVED' && updated.items) {
      await this.processInventoryReceive(updated, user, env);
    }

    return updated;
  },

  async processInventoryReceive(purchase: Purchase, user: UserContext, env: Env) {
    if (!purchase.items) return;
    for (const item of purchase.items) {
      await InventoryRepository.recordTransaction(user.companyId, {
        product_id: item.product_id,
        transaction_type: 'PURCHASE',
        quantity: item.quantity,
        reference_type: 'PURCHASE_ORDER',
        reference_id: purchase.id,
        notes: `Received from PO #${purchase.purchase_number}`,
        created_by: user.userId
      }, env);
    }
  }
};
