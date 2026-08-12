import { Env, supabaseHeaders } from './base.repository.js';
import type { DashboardStats } from '../core/types/dashboard.types.js';

export const DashboardRepository = {
  async getStats(companyId: string, env: Env): Promise<DashboardStats> {
    // For a real production app, this would be a database view or RPC call.
    // Given we are avoiding RPCs right now, we will perform sequential aggregated queries 
    // or fetch data and aggregate in the worker. Since we can't do SQL sum directly easily with PostgREST 
    // without views, we will fetch minimal payloads and aggregate here.
    
    const headers = supabaseHeaders(env);
    const url = env.SUPABASE_URL;

    // We can use PostgREST aggregation features if configured, but let's just fetch simplified data.
    // Actually PostgREST doesn't support sum() easily without views. We will just do a lightweight fetch.
    // Or we can rely on an RPC if it existed.
    // For now, let's fetch all relevant invoices to calculate totals (This is not scalable, but works for Phase 4 mock up).
    
    const [invRes, purRes, payRes] = await Promise.all([
      fetch(`${url}/rest/v1/sales_invoices?company_id=eq.${companyId}&select=grand_total,balance_amount,status,invoice_number,customer_id`, { headers }),
      fetch(`${url}/rest/v1/purchases?company_id=eq.${companyId}&select=balance_amount`, { headers }),
      fetch(`${url}/rest/v1/payments?company_id=eq.${companyId}&invoice_id=not.is.null&select=amount`, { headers })
    ]);

    const invoices = invRes.ok ? await invRes.json() : [];
    const purchases = purRes.ok ? await purRes.json() : [];
    const payments = payRes.ok ? await payRes.json() : [];

    let total_sales = 0;
    let receivables = 0;
    invoices.forEach((i: any) => {
      if (i.status !== 'CANCELLED') total_sales += Number(i.grand_total);
      receivables += Number(i.balance_amount);
    });

    let payables = 0;
    purchases.forEach((p: any) => {
      payables += Number(p.balance_amount);
    });

    let total_revenue = 0;
    payments.forEach((p: any) => {
      total_revenue += Number(p.amount);
    });

    const recent_invoices = invoices.slice(0, 5);

    return { total_sales, receivables, payables, total_revenue, recent_invoices };
  }
};
