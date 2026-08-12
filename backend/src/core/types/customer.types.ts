export interface Customer {
  id: string;
  company_id: string;
  name: string;
  business_name: string | null;
  email: string | null;
  phone: string | null;
  alternate_phone: string | null;
  billing_address: string;
  shipping_address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string;
  gstin: string | null;
  pan: string | null;
  credit_limit: number;
  opening_balance: number;
  outstanding_balance: number;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface CreateCustomerInput {
  name: string;
  business_name?: string;
  email?: string;
  phone?: string;
  alternate_phone?: string;
  billing_address: string;
  shipping_address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  gstin?: string;
  pan?: string;
  credit_limit?: number;
  opening_balance?: number;
  notes?: string;
}

export type UpdateCustomerInput = Partial<CreateCustomerInput>;
