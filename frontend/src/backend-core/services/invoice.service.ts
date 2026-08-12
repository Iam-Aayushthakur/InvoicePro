import { InvoiceRepository } from '../repositories/invoice.repository.js';
import { InventoryRepository } from '../repositories/inventory.repository.js';
import { UserContext, assertPermission } from '../core/permissions.js';
import { NotFoundError, ConflictError } from '../core/errors/index.js';
import type { Invoice, CreateInvoiceInput, UpdateInvoiceStatusInput } from '../core/types/invoice.types.js';
import { calculateLineTax, calculateInvoiceTotals } from './gst.service.js';

interface Env { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; }

export const InvoiceService = {
  async getInvoice(id: string, user: UserContext, env: Env): Promise<Invoice> {
    assertPermission(user, 'sales.read');
    const inv = await InvoiceRepository.findById(id, user.companyId, env);
    if (!inv) throw new NotFoundError('Invoice not found');
    return inv;
  },
  async listInvoices(user: UserContext, page: number, limit: number, env: Env) {
    assertPermission(user, 'sales.read');
    return InvoiceRepository.list(user.companyId, page, limit, env);
  },
  async createInvoice(data: CreateInvoiceInput, user: UserContext, env: Env): Promise<Invoice> {
    assertPermission(user, 'sales.create');
    
    // Mocking inter/intra state check for simplicity
    const isInterState = false; 

    const lineResults = data.items.map(item => calculateLineTax({
      quantity: item.quantity,
      unit_price: item.unit_price,
      discount: item.discount || 0,
      tax_rate: item.tax_rate || 0,
      seller_state_code: 'Same',
      buyer_state_code: isInterState ? 'Different' : 'Same'
    }));

    const totals = calculateInvoiceTotals(lineResults);
    const totalsWithLines = { ...totals, lineTotals: lineResults };

    const invoice = await InvoiceRepository.create(user.companyId, data, totalsWithLines, user.userId, env);

    // If issued immediately, deduct inventory
    if (invoice.status === 'ISSUED' && invoice.items) {
      await this.processInventoryIssue(invoice, user, env);
    }

    return invoice;
  },
  
  async updateStatus(id: string, data: UpdateInvoiceStatusInput, user: UserContext, env: Env): Promise<Invoice> {
    assertPermission(user, 'sales.update');
    const invoice = await this.getInvoice(id, user, env);

    if (invoice.status !== 'DRAFT' && invoice.status !== 'OVERDUE' && data.status === 'ISSUED') {
      throw new ConflictError('Invoice is already issued or paid.');
    }

    const updated = await InvoiceRepository.updateStatus(id, user.companyId, data.status, user.userId, env);

    // Transitioning from DRAFT to ISSUED reduces inventory
    if (invoice.status === 'DRAFT' && data.status === 'ISSUED' && updated.items) {
      await this.processInventoryIssue(updated, user, env);
    }

    return updated;
  },

  async processInventoryIssue(invoice: Invoice, user: UserContext, env: Env) {
    if (!invoice.items) return;
    for (const item of invoice.items) {
      await InventoryRepository.recordTransaction(user.companyId, {
        product_id: item.product_id,
        transaction_type: 'SALE',
        quantity: -item.quantity, // deduction
        reference_type: 'INVOICE',
        reference_id: invoice.id,
        notes: `Sold via Invoice #${invoice.invoice_number}`,
        created_by: user.userId
      }, env);
    }
  }
};
