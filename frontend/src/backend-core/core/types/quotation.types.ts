export interface QuotationItem {
  id: string;
  quotation_id: string;
  product_id: string;
  description: string | null;
  quantity: number;
  unit_price: number;
  discount: number;
  tax_rate: number;
  line_total: number;
}

export interface Quotation {
  id: string;
  company_id: string;
  customer_id: string;
  quotation_number: string;
  quotation_date: string;
  valid_until: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'DECLINED' | 'CONVERTED';
  subtotal: number;
  discount_total: number;
  tax_total: number;
  grand_total: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  items?: QuotationItem[];
}

export interface CreateQuotationItemInput {
  product_id: string;
  description?: string;
  quantity: number;
  unit_price: number;
  discount?: number;
  tax_rate?: number;
}

export interface CreateQuotationInput {
  customer_id: string;
  quotation_number: string;
  quotation_date?: string;
  valid_until?: string;
  status?: Quotation['status'];
  notes?: string;
  items: CreateQuotationItemInput[];
}

export interface UpdateQuotationStatusInput {
  status: Quotation['status'];
}
