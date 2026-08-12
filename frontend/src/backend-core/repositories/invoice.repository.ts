import { Env, supabaseGetOne, supabaseInsert, supabasePatch, supabaseList, supabaseHeaders } from './base.repository.js';
import type { Invoice, InvoiceItem, CreateInvoiceInput } from '../core/types/invoice.types.js';

export const InvoiceRepository = {
  async findById(id: string, companyId: string, env: Env): Promise<Invoice | null> {
    const invoice = await supabaseGetOne<Invoice>(env, 'sales_invoices', `id=eq.${id}&company_id=eq.${companyId}`);
    if (!invoice) return null;
    
    const itemsRes = await fetch(`${env.SUPABASE_URL}/rest/v1/sales_invoice_items?invoice_id=eq.${id}`, { headers: supabaseHeaders(env) });
    if (itemsRes.ok) invoice.items = await itemsRes.json();
    return invoice;
  },

  async create(companyId: string, data: CreateInvoiceInput, totals: any, userId: string, env: Env): Promise<Invoice> {
    const payload = {
      company_id: companyId,
      customer_id: data.customer_id,
      invoice_number: data.invoice_number,
      invoice_date: data.invoice_date,
      due_date: data.due_date,
      status: data.status,
      notes: data.notes,
      terms: data.terms,
      subtotal: totals.subtotal,
      discount_total: totals.discount_total,
      taxable_amount: totals.taxable_amount,
      cgst_total: totals.cgst_total,
      sgst_total: totals.sgst_total,
      igst_total: totals.igst_total,
      tax_total: totals.tax_total,
      round_off: totals.round_off,
      grand_total: totals.grand_total,
      balance_amount: totals.grand_total,
      created_by: userId
    };
    
    const invoice = await supabaseInsert<Invoice>(env, 'sales_invoices', payload);

    const itemsPayload = data.items.map((item: any, i: number) => {
      const lt = totals.lineTotals[i];
      return {
        invoice_id: invoice.id,
        product_id: item.product_id,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit || 'PCS',
        unit_price: item.unit_price,
        discount: item.discount || 0,
        tax_rate: item.tax_rate || 0,
        taxable_amount: lt.taxable_amount,
        cgst_amount: lt.cgst_amount,
        sgst_amount: lt.sgst_amount,
        igst_amount: lt.igst_amount,
        tax_amount: lt.tax_amount,
        line_total: lt.line_total
      };
    });

    await fetch(`${env.SUPABASE_URL}/rest/v1/sales_invoice_items`, {
      method: 'POST', headers: supabaseHeaders(env), body: JSON.stringify(itemsPayload)
    });

    return this.findById(invoice.id, companyId, env) as Promise<Invoice>;
  },

  async updateStatus(id: string, companyId: string, status: string, userId: string, env: Env): Promise<Invoice> {
    return supabasePatch<Invoice>(env, 'sales_invoices', `id=eq.${id}&company_id=eq.${companyId}`, { status, updated_by: userId });
  },

  async list(companyId: string, page: number, limit: number, env: Env) {
    return supabaseList<Invoice & { customers: { name: string } }>(
      env, 'sales_invoices', `company_id=eq.${companyId}&select=*,customers(name)&order=created_at.desc`, page, limit
    );
  }
};
