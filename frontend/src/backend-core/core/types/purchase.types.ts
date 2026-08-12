export interface PurchaseItem {
  id: string;
  purchase_id: string;
  product_id: string;
  description: string | null;
  quantity: number;
  unit_price: number;
  discount: number;
  tax_rate: number;
  line_total: number;
}

export interface Purchase {
  id: string;
  company_id: string;
  supplier_id: string;
  purchase_number: string;
  purchase_date: string;
  due_date: string | null;
  status: 'DRAFT' | 'ORDERED' | 'RECEIVED' | 'PAID' | 'CANCELLED';
  subtotal: number;
  discount_total: number;
  tax_total: number;
  grand_total: number;
  paid_amount: number;
  balance_amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  items?: PurchaseItem[];
}

export interface CreatePurchaseItemInput {
  product_id: string;
  description?: string;
  quantity: number;
  unit_price: number;
  discount?: number;
  tax_rate?: number;
}

export interface CreatePurchaseInput {
  supplier_id: string;
  purchase_number: string;
  purchase_date?: string;
  due_date?: string;
  status?: Purchase['status'];
  notes?: string;
  items: CreatePurchaseItemInput[];
}

export interface UpdatePurchaseStatusInput {
  status: Purchase['status'];
}
