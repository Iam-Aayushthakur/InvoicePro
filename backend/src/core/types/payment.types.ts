export interface Payment {
  id: string;
  company_id: string;
  customer_id: string | null;
  supplier_id: string | null;
  invoice_id: string | null;
  purchase_id: string | null;
  amount: number;
  payment_method: string;
  payment_date: string;
  reference_number: string | null;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  notes: string | null;
  created_at: string;
  created_by: string | null;
}

export interface CreatePaymentInput {
  customer_id?: string;
  supplier_id?: string;
  invoice_id?: string;
  purchase_id?: string;
  amount: number;
  payment_method: string;
  payment_date?: string;
  reference_number?: string;
  status?: Payment['status'];
  notes?: string;
}
