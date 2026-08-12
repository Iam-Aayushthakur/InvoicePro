export interface InvoiceItem {
  id: string;
  invoice_id: string;
  product_id: string;
  description: string | null;
  quantity: number;
  unit: string;
  unit_price: number;
  discount: number;
  tax_rate: number;
  taxable_amount: number;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  tax_amount: number;
  line_total: number;
}

export interface Invoice {
  id: string;
  company_id: string;
  customer_id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  status: 'DRAFT' | 'ISSUED' | 'PAID' | 'PARTIALLY_PAID' | 'CANCELLED' | 'OVERDUE';
  subtotal: number;
  discount_total: number;
  taxable_amount: number;
  cgst_total: number;
  sgst_total: number;
  igst_total: number;
  tax_total: number;
  round_off: number;
  grand_total: number;
  paid_amount: number;
  balance_amount: number;
  notes: string | null;
  terms: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  items?: InvoiceItem[];
}

export interface CreateInvoiceItemInput {
  product_id: string;
  description?: string;
  quantity: number;
  unit?: string;
  unit_price: number;
  discount?: number;
  tax_rate?: number;
}

export interface CreateInvoiceInput {
  customer_id: string;
  invoice_number: string;
  invoice_date?: string;
  due_date: string;
  status?: Invoice['status'];
  notes?: string;
  terms?: string;
  items: CreateInvoiceItemInput[];
}

export interface UpdateInvoiceStatusInput {
  status: Invoice['status'];
}
