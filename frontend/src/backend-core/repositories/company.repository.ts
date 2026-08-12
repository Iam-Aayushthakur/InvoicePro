// Company Repository — Data access layer for the companies table
// All queries use Supabase REST API via Service Role Key (server-side only)

import type { Company, CreateCompanyInput, UpdateCompanyInput, CompanyMember } from '../core/types/company.types.js';
import { NotFoundError } from '../core/errors/index.js';

export interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

function supabaseHeaders(env: Env) {
  return {
    'Content-Type': 'application/json',
    apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    Prefer: 'return=representation',
  };
}

export const CompanyRepository = {
  /**
   * Find company by ID. Returns null if not found.
   */
  async findById(companyId: string, env: Env): Promise<Company | null> {
    const url = `${env.SUPABASE_URL}/rest/v1/companies?id=eq.${companyId}&select=*`;
    const resp = await fetch(url, { headers: supabaseHeaders(env) });
    if (!resp.ok) return null;
    const rows = await resp.json() as Company[];
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Find company by ID or throw NotFoundError.
   */
  async findByIdOrThrow(companyId: string, env: Env): Promise<Company> {
    const company = await this.findById(companyId, env);
    if (!company) {
      throw new NotFoundError(`Company '${companyId}' not found`);
    }
    return company;
  },

  /**
   * Create a new company record.
   */
  async create(data: CreateCompanyInput & { created_by?: string }, env: Env): Promise<Company> {
    const url = `${env.SUPABASE_URL}/rest/v1/companies`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: supabaseHeaders(env),
      body: JSON.stringify(data),
    });
    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`Failed to create company: ${err}`);
    }
    const rows = await resp.json() as Company[];
    return rows[0];
  },

  /**
   * Update company fields. Only provided fields are patched.
   */
  async update(companyId: string, data: UpdateCompanyInput & { updated_by?: string }, env: Env): Promise<Company> {
    const url = `${env.SUPABASE_URL}/rest/v1/companies?id=eq.${companyId}`;
    const payload = { ...data, updated_at: new Date().toISOString() };
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: supabaseHeaders(env),
      body: JSON.stringify(payload),
    });
    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`Failed to update company: ${err}`);
    }
    const rows = await resp.json() as Company[];
    if (rows.length === 0) {
      throw new NotFoundError(`Company '${companyId}' not found`);
    }
    return rows[0];
  },

  /**
   * List all companies the user is a member of.
   */
  async listByUser(userId: string, env: Env): Promise<Company[]> {
    const url = `${env.SUPABASE_URL}/rest/v1/company_members?select=companies(*)&user_id=eq.${userId}&is_active=eq.true`;
    const resp = await fetch(url, { headers: supabaseHeaders(env) });
    if (!resp.ok) return [];
    const rows = await resp.json() as Array<{ companies: Company }>;
    return rows.map((r) => r.companies).filter(Boolean);
  },

  /**
   * List members of a company with their user profiles and roles.
   */
  async listMembers(companyId: string, env: Env): Promise<CompanyMember[]> {
    const url = `${env.SUPABASE_URL}/rest/v1/company_members?select=id,company_id,user_id,role_id,is_active,joined_at,users(id,email,full_name),roles(id,name)&company_id=eq.${companyId}&is_active=eq.true`;
    const resp = await fetch(url, { headers: supabaseHeaders(env) });
    if (!resp.ok) return [];
    return await resp.json() as CompanyMember[];
  },

  /**
   * Deactivate a company (soft delete).
   */
  async deactivate(companyId: string, updatedBy: string, env: Env): Promise<Company> {
    return this.update(companyId, { is_active: false, updated_by: updatedBy } as UpdateCompanyInput & { updated_by: string; is_active: boolean }, env);
  },
};
