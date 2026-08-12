export interface PaymentRecord {
  id: string;
  companyId: string;
  invoiceId?: string;
  amount: number;
  provider: 'RAZORPAY' | 'STRIPE' | 'CASH' | 'BANK_TRANSFER';
  transactionId?: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  createdAt: string;
}
