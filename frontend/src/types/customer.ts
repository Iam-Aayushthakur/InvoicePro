export interface Customer {
  id: string;
  companyId: string;
  name: string;
  email?: string;
  phone?: string;
  gstin?: string;
  billingAddress: string;
  shippingAddress?: string;
  outstandingBalance: number;
}
