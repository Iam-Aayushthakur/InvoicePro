import { Env, supabaseGetOne, supabaseInsert, supabaseList } from './base.repository.js';
import type { Payment, CreatePaymentInput } from '../core/types/payment.types.js';

export const PaymentRepository = {
  async findById(id: string, companyId: string, env: Env): Promise<Payment | null> {
    return supabaseGetOne<Payment>(env, 'payments', `id=eq.${id}&company_id=eq.${companyId}`);
  },

  async create(companyId: string, data: CreatePaymentInput, userId: string, env: Env): Promise<Payment> {
    const payload = {
      company_id: companyId,
      customer_id: data.customer_id,
      supplier_id: data.supplier_id,
      invoice_id: data.invoice_id,
      purchase_id: data.purchase_id,
      amount: data.amount,
      payment_method: data.payment_method,
      payment_date: data.payment_date,
      reference_number: data.reference_number,
      status: data.status,
      notes: data.notes,
      created_by: userId
    };
    return supabaseInsert<Payment>(env, 'payments', payload);
  },

  async list(companyId: string, page: number, limit: number, env: Env) {
    return supabaseList<Payment>(
      env, 'payments', `company_id=eq.${companyId}&select=*&order=created_at.desc`, page, limit
    );
  }
};
