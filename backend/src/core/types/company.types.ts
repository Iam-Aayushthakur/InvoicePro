// Company domain types
export interface Company {
  id: string;
  name: string;
  legal_name: string | null;
  business_type: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  state_code: string;
  gstin: string | null;
  pan: string | null;
  currency: string;
  timezone: string;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface CreateCompanyInput {
  name: string;
  legal_name?: string;
  business_type?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country?: string;
  postal_code: string;
  state_code: string;
  gstin?: string;
  pan?: string;
  currency?: string;
  timezone?: string;
}

export interface UpdateCompanyInput {
  name?: string;
  legal_name?: string;
  business_type?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  state_code?: string;
  gstin?: string;
  pan?: string;
  currency?: string;
  timezone?: string;
  logo_url?: string;
}

export interface CompanyMember {
  id: string;
  company_id: string;
  user_id: string;
  role_id: string;
  is_active: boolean;
  joined_at: string;
  users: { id: string; email: string; full_name: string };
  roles: { id: string; name: string };
}
