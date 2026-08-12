import { Env, supabaseGetOne, supabaseInsert, supabasePatch, supabaseList, supabaseHeaders } from './base.repository.js';
import type { Purchase, PurchaseItem, CreatePurchaseInput } from '../core/types/purchase.types.js';

export const PurchaseRepository = {
  async findById(id: string, companyId: string, env: Env): Promise<Purchase | null> {
    const purchase = await supabaseGetOne<Purchase>(env, 'purchases', `id=eq.${id}&company_id=eq.${companyId}`);
    if (!purchase) return null;
    
    // Fetch items
    const itemsRes = await fetch(`${env.SUPABASE_URL}/rest/v1/purchase_items?purchase_id=eq.${id}`, { headers: supabaseHeaders(env) });
    if (itemsRes.ok) purchase.items = await itemsRes.json();
    return purchase;
  },

  async create(companyId: string, data: CreatePurchaseInput, totals: any, userId: string, env: Env): Promise<Purchase> {
    // Insert Header
    const payload = {
      company_id: companyId,
      supplier_id: data.supplier_id,
      purchase_number: data.purchase_number,
      purchase_date: data.purchase_date,
      due_date: data.due_date,
      status: data.status,
      notes: data.notes,
      subtotal: totals.subtotal,
      discount_total: totals.discount_total,
      tax_total: totals.tax_total,
      grand_total: totals.grand_total,
      balance_amount: totals.grand_total,
      created_by: userId
    };
    
    const purchase = await supabaseInsert<Purchase>(env, 'purchases', payload);

    // Insert Items
    const itemsPayload = data.items.map((item: any, i: number) => ({
      purchase_id: purchase.id,
      product_id: item.product_id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      discount: item.discount || 0,
      tax_rate: item.tax_rate || 0,
      line_total: totals.lineTotals[i].line_total
    }));

    await fetch(`${env.SUPABASE_URL}/rest/v1/purchase_items`, {
      method: 'POST', headers: supabaseHeaders(env), body: JSON.stringify(itemsPayload)
    });

    return this.findById(purchase.id, companyId, env) as Promise<Purchase>;
  },

  async updateStatus(id: string, companyId: string, status: string, userId: string, env: Env): Promise<Purchase> {
    return supabasePatch<Purchase>(env, 'purchases', `id=eq.${id}&company_id=eq.${companyId}`, { status, updated_by: userId });
  },

  async list(companyId: string, page: number, limit: number, env: Env) {
    return supabaseList<Purchase & { suppliers: { name: string } }>(
      env, 'purchases', `company_id=eq.${companyId}&select=*,suppliers(name)&order=created_at.desc`, page, limit
    );
  }
};
