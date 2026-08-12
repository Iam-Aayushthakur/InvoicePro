import { QuotationRepository } from '../repositories/quotation.repository.js';
import { UserContext, assertPermission } from '../core/permissions.js';
import { NotFoundError } from '../core/errors/index.js';
import type { Quotation, CreateQuotationInput, UpdateQuotationStatusInput } from '../core/types/quotation.types.js';
import { calculateLineTax, calculateInvoiceTotals } from './gst.service.js';

interface Env { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; }

export const QuotationService = {
  async getQuotation(id: string, user: UserContext, env: Env): Promise<Quotation> {
    assertPermission(user, 'sales.read');
    const quo = await QuotationRepository.findById(id, user.companyId, env);
    if (!quo) throw new NotFoundError('Quotation not found');
    return quo;
  },
  async listQuotations(user: UserContext, page: number, limit: number, env: Env) {
    assertPermission(user, 'sales.read');
    return QuotationRepository.list(user.companyId, page, limit, env);
  },
  async createQuotation(data: CreateQuotationInput, user: UserContext, env: Env): Promise<Quotation> {
    assertPermission(user, 'sales.create');
    
    const lineResults = data.items.map(item => calculateLineTax({
      quantity: item.quantity,
      unit_price: item.unit_price,
      discount: item.discount || 0,
      tax_rate: item.tax_rate || 0,
      seller_state_code: 'Same',
      buyer_state_code: 'Same'
    }));

    const totals = calculateInvoiceTotals(lineResults);
    const totalsWithLines = { ...totals, lineTotals: lineResults };

    return QuotationRepository.create(user.companyId, data, totalsWithLines, user.userId, env);
  },
  
  async updateStatus(id: string, data: UpdateQuotationStatusInput, user: UserContext, env: Env): Promise<Quotation> {
    assertPermission(user, 'sales.update');
    await this.getQuotation(id, user, env);
    return QuotationRepository.updateStatus(id, user.companyId, data.status, user.userId, env);
  }
};
