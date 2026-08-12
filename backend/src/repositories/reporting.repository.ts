import { Env, supabaseHeaders } from './base.repository.js';
import type { ReportParams, SalesReportData, GSTReportData } from '../core/types/reporting.types.js';

export const ReportingRepository = {
  async getSalesReport(companyId: string, params: ReportParams, env: Env): Promise<SalesReportData> {
    const headers = supabaseHeaders(env);
    // Simple filter by date
    const query = `company_id=eq.${companyId}&invoice_date=gte.${params.start_date}&invoice_date=lte.${params.end_date}&status=neq.CANCELLED`;
    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/sales_invoices?${query}&select=grand_total,tax_total,invoice_number,invoice_date,status`, { headers });
    
    const invoices = res.ok ? await res.json() : [];
    
    let total_sales = 0;
    let total_tax = 0;
    invoices.forEach((i: any) => {
      total_sales += Number(i.grand_total);
      total_tax += Number(i.tax_total);
    });

    return { total_sales, total_tax, invoices_count: invoices.length, invoices };
  },

  async getGSTReport(companyId: string, params: ReportParams, env: Env): Promise<GSTReportData> {
    const headers = supabaseHeaders(env);
    const query = `company_id=eq.${companyId}&invoice_date=gte.${params.start_date}&invoice_date=lte.${params.end_date}&status=neq.CANCELLED`;
    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/sales_invoices?${query}&select=taxable_amount,cgst_total,sgst_total,igst_total,tax_total`, { headers });
    
    const invoices = res.ok ? await res.json() : [];
    
    let total_cgst = 0, total_sgst = 0, total_igst = 0, total_tax = 0, taxable_amount = 0;
    
    invoices.forEach((i: any) => {
      total_cgst += Number(i.cgst_total);
      total_sgst += Number(i.sgst_total);
      total_igst += Number(i.igst_total);
      total_tax += Number(i.tax_total);
      taxable_amount += Number(i.taxable_amount);
    });

    return { total_cgst, total_sgst, total_igst, total_tax, taxable_amount };
  }
};
