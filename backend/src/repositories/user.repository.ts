// User Repository — Data access layer for users and company_members tables

import type { User, UpdateUserProfileInput } from '../core/types/user.types.js';
import { NotFoundError } from '../core/errors/index.js';

export interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

function headers(env: Env) {
  return {
    'Content-Type': 'application/json',
    apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    Prefer: 'return=representation',
  };
}

export const UserRepository = {
  /**
   * Find user by their application user ID.
   */
  async findById(userId: string, env: Env): Promise<User | null> {
    const url = `${env.SUPABASE_URL}/rest/v1/users?id=eq.${userId}&select=*`;
    const resp = await fetch(url, { headers: headers(env) });
    if (!resp.ok) return null;
    const rows = await resp.json() as User[];
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Find user by ID or throw NotFoundError.
   */
  async findByIdOrThrow(userId: string, env: Env): Promise<User> {
    const user = await this.findById(userId, env);
    if (!user) throw new NotFoundError(`User '${userId}' not found`);
    return user;
  },

  /**
   * Find user by email address.
   */
  async findByEmail(email: string, env: Env): Promise<User | null> {
    const url = `${env.SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}&select=*`;
    const resp = await fetch(url, { headers: headers(env) });
    if (!resp.ok) return null;
    const rows = await resp.json() as User[];
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Find user by Supabase auth_user_id.
   */
  async findByAuthId(authUserId: string, env: Env): Promise<User | null> {
    const url = `${env.SUPABASE_URL}/rest/v1/users?auth_user_id=eq.${authUserId}&select=*`;
    const resp = await fetch(url, { headers: headers(env) });
    if (!resp.ok) return null;
    const rows = await resp.json() as User[];
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Update user profile fields.
   */
  async updateProfile(userId: string, data: UpdateUserProfileInput, env: Env): Promise<User> {
    const url = `${env.SUPABASE_URL}/rest/v1/users?id=eq.${userId}`;
    const payload = { ...data, updated_at: new Date().toISOString() };
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: headers(env),
      body: JSON.stringify(payload),
    });
    if (!resp.ok) {
      throw new Error(`Failed to update user profile: ${await resp.text()}`);
    }
    const rows = await resp.json() as User[];
    if (rows.length === 0) throw new NotFoundError(`User '${userId}' not found`);
    return rows[0];
  },

  /**
   * Deactivate a user (soft delete).
   */
  async deactivate(userId: string, env: Env): Promise<User> {
    const url = `${env.SUPABASE_URL}/rest/v1/users?id=eq.${userId}`;
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: headers(env),
      body: JSON.stringify({ is_active: false, updated_at: new Date().toISOString() }),
    });
    if (!resp.ok) throw new Error(`Failed to deactivate user: ${await resp.text()}`);
    const rows = await resp.json() as User[];
    if (rows.length === 0) throw new NotFoundError(`User '${userId}' not found`);
    return rows[0];
  },

  /**
   * Create a new user profile (used during invitation flow).
   */
  async create(data: { auth_user_id: string; email: string; full_name: string; phone?: string }, env: Env): Promise<User> {
    const url = `${env.SUPABASE_URL}/rest/v1/users`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: headers(env),
      body: JSON.stringify(data),
    });
    if (!resp.ok) throw new Error(`Failed to create user: ${await resp.text()}`);
    const rows = await resp.json() as User[];
    return rows[0];
  },

  /**
   * List members of a company with user profiles and roles.
   * Supports pagination via offset/limit.
   */
  async listCompanyMembers(
    companyId: string,
    page: number,
    limit: number,
    search: string | null,
    env: Env
  ): Promise<{ data: Array<{ id: string; user_id: string; role_id: string; is_active: boolean; joined_at: string; users: User; roles: { id: string; name: string } }>; total: number }> {
    const offset = (page - 1) * limit;

    // Count query
    const countUrl = `${env.SUPABASE_URL}/rest/v1/company_members?company_id=eq.${companyId}&select=id&is_active=eq.true`;
    const countResp = await fetch(countUrl, {
      headers: { ...headers(env), Prefer: 'count=exact' },
      method: 'HEAD',
    });
    const total = parseInt(countResp.headers.get('content-range')?.split('/')[1] || '0', 10);

    // Data query with joins
    let dataUrl = `${env.SUPABASE_URL}/rest/v1/company_members?company_id=eq.${companyId}&is_active=eq.true&select=id,user_id,role_id,is_active,joined_at,users(id,auth_user_id,email,full_name,phone,avatar_url,is_active),roles(id,name)&order=joined_at.desc&offset=${offset}&limit=${limit}`;

    if (search) {
      dataUrl += `&users.full_name=ilike.*${encodeURIComponent(search)}*`;
    }

    const resp = await fetch(dataUrl, { headers: headers(env) });
    if (!resp.ok) return { data: [], total: 0 };
    const data = await resp.json() as Array<{ id: string; user_id: string; role_id: string; is_active: boolean; joined_at: string; users: User; roles: { id: string; name: string } }>;
    return { data, total };
  },

  /**
   * Add a member to a company with a specific role.
   */
  async addMember(companyId: string, userId: string, roleId: string, env: Env): Promise<void> {
    const url = `${env.SUPABASE_URL}/rest/v1/company_members`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: headers(env),
      body: JSON.stringify({
        company_id: companyId,
        user_id: userId,
        role_id: roleId,
      }),
    });
    if (!resp.ok) {
      const errText = await resp.text();
      if (errText.includes('uq_company_members_user_company')) {
        throw new Error('CONFLICT:User is already a member of this company');
      }
      throw new Error(`Failed to add member: ${errText}`);
    }
  },

  /**
   * Update a member's role within a company.
   */
  async updateMemberRole(membershipId: string, roleId: string, env: Env): Promise<void> {
    const url = `${env.SUPABASE_URL}/rest/v1/company_members?id=eq.${membershipId}`;
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: headers(env),
      body: JSON.stringify({ role_id: roleId, updated_at: new Date().toISOString() }),
    });
    if (!resp.ok) throw new Error(`Failed to update member role: ${await resp.text()}`);
  },

  /**
   * Deactivate a membership (remove member from company).
   */
  async deactivateMember(membershipId: string, env: Env): Promise<void> {
    const url = `${env.SUPABASE_URL}/rest/v1/company_members?id=eq.${membershipId}`;
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: headers(env),
      body: JSON.stringify({ is_active: false, updated_at: new Date().toISOString() }),
    });
    if (!resp.ok) throw new Error(`Failed to deactivate membership: ${await resp.text()}`);
  },

  /**
   * Find a specific membership record.
   */
  async findMembership(companyId: string, userId: string, env: Env): Promise<{ id: string; role_id: string; is_active: boolean; roles: { name: string } } | null> {
    const url = `${env.SUPABASE_URL}/rest/v1/company_members?company_id=eq.${companyId}&user_id=eq.${userId}&select=id,role_id,is_active,roles(name)`;
    const resp = await fetch(url, { headers: headers(env) });
    if (!resp.ok) return null;
    const rows = await resp.json() as Array<{ id: string; role_id: string; is_active: boolean; roles: { name: string } }>;
    return rows.length > 0 ? rows[0] : null;
  },
};
