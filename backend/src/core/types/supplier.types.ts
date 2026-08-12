export interface Supplier {
  id: string;
  company_id: string;
  name: string;
  business_name: string | null;
  email: string | null;
  phone: string | null;
  address: string;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string;
  gstin: string | null;
  pan: string | null;
  opening_balance: number;
  outstanding_balance: number;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface CreateSupplierInput {
  name: string;
  business_name?: string;
  email?: string;
  phone?: string;
  address: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  gstin?: string;
  pan?: string;
  opening_balance?: number;
  notes?: string;
}

export type UpdateSupplierInput = Partial<CreateSupplierInput>;
