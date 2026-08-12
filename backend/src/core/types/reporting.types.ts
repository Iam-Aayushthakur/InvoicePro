export interface ReportParams {
  start_date: string;
  end_date: string;
  report_type: 'SALES' | 'PURCHASES' | 'GST';
}

export interface SalesReportData {
  total_sales: number;
  total_tax: number;
  invoices_count: number;
  invoices: any[];
}

export interface GSTReportData {
  total_cgst: number;
  total_sgst: number;
  total_igst: number;
  total_tax: number;
  taxable_amount: number;
}
