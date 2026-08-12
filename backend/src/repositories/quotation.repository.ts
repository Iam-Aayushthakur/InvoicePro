import { Env, supabaseGetOne, supabaseInsert, supabasePatch, supabaseList, supabaseHeaders } from './base.repository.js';
import type { Quotation, QuotationItem, CreateQuotationInput } from '../core/types/quotation.types.js';

export const QuotationRepository = {
  async findById(id: string, companyId: string, env: Env): Promise<Quotation | null> {
    const quotation = await supabaseGetOne<Quotation>(env, 'quotations', `id=eq.${id}&company_id=eq.${companyId}`);
    if (!quotation) return null;
    
    const itemsRes = await fetch(`${env.SUPABASE_URL}/rest/v1/quotation_items?quotation_id=eq.${id}`, { headers: supabaseHeaders(env) });
    if (itemsRes.ok) quotation.items = await itemsRes.json();
    return quotation;
  },

  async create(companyId: string, data: CreateQuotationInput, totals: any, userId: string, env: Env): Promise<Quotation> {
    const payload = {
      company_id: companyId,
      customer_id: data.customer_id,
      quotation_number: data.quotation_number,
      quotation_date: data.quotation_date,
      valid_until: data.valid_until,
      status: data.status,
      notes: data.notes,
      subtotal: totals.subtotal,
      discount_total: totals.discount_total,
      tax_total: totals.tax_total,
      grand_total: totals.grand_total,
      created_by: userId
    };
    
    const quotation = await supabaseInsert<Quotation>(env, 'quotations', payload);

    const itemsPayload = data.items.map((item: any, i: number) => ({
      quotation_id: quotation.id,
      product_id: item.product_id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      discount: item.discount || 0,
      tax_rate: item.tax_rate || 0,
      line_total: totals.lineTotals[i].line_total
    }));

    await fetch(`${env.SUPABASE_URL}/rest/v1/quotation_items`, {
      method: 'POST', headers: supabaseHeaders(env), body: JSON.stringify(itemsPayload)
    });

    return this.findById(quotation.id, companyId, env) as Promise<Quotation>;
  },

  async updateStatus(id: string, companyId: string, status: string, userId: string, env: Env): Promise<Quotation> {
    return supabasePatch<Quotation>(env, 'quotations', `id=eq.${id}&company_id=eq.${companyId}`, { status, updated_by: userId });
  },

  async list(companyId: string, page: number, limit: number, env: Env) {
    return supabaseList<Quotation & { customers: { name: string } }>(
      env, 'quotations', `company_id=eq.${companyId}&select=*,customers(name)&order=created_at.desc`, page, limit
    );
  }
};
