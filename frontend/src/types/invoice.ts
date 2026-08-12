export interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  hsnCode: string;
  quantity: number;
  unitPrice: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalAmount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  companyId: string;
  customerId: string;
  subtotal: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  grandTotal: number;
  status: 'DRAFT' | 'ISSUED' | 'PAID' | 'CANCELLED';
  items: InvoiceItem[];
  createdAt: string;
}
