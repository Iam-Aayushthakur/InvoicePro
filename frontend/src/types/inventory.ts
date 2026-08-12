export interface InventoryTransaction {
  id: string;
  productId: string;
  companyId: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  reason?: string;
  createdAt: string;
}
