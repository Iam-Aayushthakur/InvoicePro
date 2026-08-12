export interface PurchaseOrder {
  id: string;
  companyId: string;
  supplierId: string;
  totalAmount: number;
  status: 'ORDERED' | 'RECEIVED' | 'CANCELLED';
  createdAt: string;
}
