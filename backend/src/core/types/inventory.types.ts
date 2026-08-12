export interface Inventory {
  id: string;
  company_id: string;
  product_id: string;
  quantity: number;
  reserved_quantity: number;
  available_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface InventoryTransaction {
  id: string;
  company_id: string;
  product_id: string;
  transaction_type: 'OPENING' | 'PURCHASE' | 'SALE' | 'SALE_RETURN' | 'PURCHASE_RETURN' | 'ADJUSTMENT' | 'DAMAGE' | 'TRANSFER';
  quantity: number;
  reference_type: string | null;
  reference_id: string | null;
  previous_quantity: number;
  new_quantity: number;
  notes: string | null;
  created_at: string;
  created_by: string | null;
}

export interface RecordTransactionInput {
  product_id: string;
  transaction_type: InventoryTransaction['transaction_type'];
  quantity: number;
  reference_type?: string;
  reference_id?: string;
  notes?: string;
}
