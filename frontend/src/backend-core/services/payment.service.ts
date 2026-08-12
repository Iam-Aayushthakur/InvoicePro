import { PaymentRepository } from '../repositories/payment.repository.js';
import { InvoiceRepository } from '../repositories/invoice.repository.js';
import { PurchaseRepository } from '../repositories/purchase.repository.js';
import { UserContext, assertPermission } from '../core/permissions.js';
import { NotFoundError, AppError } from '../core/errors/index.js';
import type { Payment, CreatePaymentInput } from '../core/types/payment.types.js';
import { supabasePatch } from '../repositories/base.repository.js';

interface Env { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; }

export const PaymentService = {
  async getPayment(id: string, user: UserContext, env: Env): Promise<Payment> {
    assertPermission(user, 'sales.read'); // Using sales.read for simplicity, or reporting.read
    const pay = await PaymentRepository.findById(id, user.companyId, env);
    if (!pay) throw new NotFoundError('Payment not found');
    return pay;
  },
  async listPayments(user: UserContext, page: number, limit: number, env: Env) {
    assertPermission(user, 'sales.read');
    return PaymentRepository.list(user.companyId, page, limit, env);
  },
  async createPayment(data: CreatePaymentInput, user: UserContext, env: Env): Promise<Payment> {
    assertPermission(user, 'sales.create');

    // Basic REST transaction logic for updating balances
    if (data.invoice_id) {
      const inv = await InvoiceRepository.findById(data.invoice_id, user.companyId, env);
      if (!inv) throw new NotFoundError('Invoice not found');
      
      const newPaid = Number(inv.paid_amount) + Number(data.amount);
      const newBalance = Number(inv.grand_total) - newPaid;
      const newStatus = newBalance <= 0 ? 'PAID' : 'PARTIALLY_PAID';

      await supabasePatch(env, 'sales_invoices', `id=eq.${inv.id}`, {
        paid_amount: newPaid, balance_amount: newBalance, status: newStatus
      });
    }

    if (data.purchase_id) {
      const pur = await PurchaseRepository.findById(data.purchase_id, user.companyId, env);
      if (!pur) throw new NotFoundError('Purchase not found');
      
      const newPaid = Number(pur.paid_amount) + Number(data.amount);
      const newBalance = Number(pur.grand_total) - newPaid;
      const newStatus = newBalance <= 0 ? 'PAID' : pur.status; // Or partially paid if we had that state

      await supabasePatch(env, 'purchases', `id=eq.${pur.id}`, {
        paid_amount: newPaid, balance_amount: newBalance, status: newStatus
      });
    }

    return PaymentRepository.create(user.companyId, data, user.userId, env);
  }
};
