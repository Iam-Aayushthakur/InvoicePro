// User Service — Business logic for user profile management and team member operations
// Enforces authorization and tenant isolation.

import { UserRepository, Env } from '../repositories/user.repository.js';
import { UserContext, assertPermission } from '../core/permissions.js';
import { ForbiddenError, NotFoundError, ConflictError } from '../core/errors/index.js';
import type { User, UpdateUserProfileInput, InviteMemberInput, UpdateMemberRoleInput, PaginatedResult } from '../core/types/user.types.js';

export const UserService = {
  /**
   * Get the authenticated user's own profile.
   * Any authenticated user can view their own profile.
   */
  async getMyProfile(user: UserContext, env: Env): Promise<User> {
    return UserRepository.findByIdOrThrow(user.userId, env);
  },

  /**
   * Update the authenticated user's own profile (full_name, phone, avatar_url).
   * Any authenticated user can update their own profile.
   */
  async updateMyProfile(data: UpdateUserProfileInput, user: UserContext, env: Env): Promise<User> {
    return UserRepository.updateProfile(user.userId, data, env);
  },

  /**
   * Get a specific user profile within the same tenant company.
   * Permission: users.read
   */
  async getUserById(targetUserId: string, user: UserContext, env: Env): Promise<User> {
    assertPermission(user, 'users.read');

    // Verify target user is a member of the same company
    const membership = await UserRepository.findMembership(user.companyId, targetUserId, env);
    if (!membership) {
      throw new NotFoundError('User is not a member of your company');
    }

    return UserRepository.findByIdOrThrow(targetUserId, env);
  },

  /**
   * List all active members of the current tenant company.
   * Permission: users.read
   * Supports pagination and search by name.
   */
  async listCompanyMembers(
    user: UserContext,
    page: number,
    limit: number,
    search: string | null,
    env: Env
  ): Promise<PaginatedResult<{ id: string; user_id: string; email: string; full_name: string; role_name: string; is_active: boolean; joined_at: string }>> {
    assertPermission(user, 'users.read');

    const { data, total } = await UserRepository.listCompanyMembers(user.companyId, page, limit, search, env);

    const mapped = data.map((m) => ({
      id: m.id,
      user_id: m.user_id,
      email: m.users.email,
      full_name: m.users.full_name,
      role_name: m.roles.name,
      is_active: m.is_active,
      joined_at: m.joined_at,
    }));

    return {
      data: mapped,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  /**
   * Invite a new member to the current tenant company.
   * Permission: users.create
   * Creates Supabase Auth identity if user doesn't exist, then assigns company membership.
   */
  async inviteMember(input: InviteMemberInput, user: UserContext, env: Env): Promise<{ userId: string; message: string }> {
    assertPermission(user, 'users.create');

    // Prevent role escalation: non-OWNER cannot assign OWNER role
    const roleResp = await fetch(`${env.SUPABASE_URL}/rest/v1/roles?id=eq.${input.role_id}&select=name`, {
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    });
    const roleRows = await roleResp.json() as Array<{ name: string }>;
    if (!roleRows || roleRows.length === 0) {
      throw new NotFoundError(`Role '${input.role_id}' not found`);
    }
    const targetRoleName = roleRows[0].name;
    if (targetRoleName === 'OWNER' && user.role !== 'OWNER') {
      throw new ForbiddenError('Only the OWNER can assign the OWNER role');
    }

    // Check if user already exists in the system
    let existingUser = await UserRepository.findByEmail(input.email, env);

    if (!existingUser) {
      // Create Supabase Auth identity with a temporary password (user resets on first login)
      const tempPassword = `InvPro_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      const authResp = await fetch(`${env.SUPABASE_URL}/auth/v1/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          email: input.email,
          password: tempPassword,
          email_confirm: false, // Send verification email
        }),
      });

      if (!authResp.ok) {
        const errText = await authResp.text();
        throw new Error(`Failed to create auth identity for invited user: ${errText}`);
      }

      const authUser = await authResp.json() as { id: string; email: string };

      // Create application user profile
      existingUser = await UserRepository.create({
        auth_user_id: authUser.id,
        email: input.email,
        full_name: input.full_name,
      }, env);
    }

    // Check for existing membership
    const existingMembership = await UserRepository.findMembership(user.companyId, existingUser.id, env);
    if (existingMembership && existingMembership.is_active) {
      throw new ConflictError('User is already an active member of this company');
    }

    // Add membership
    try {
      await UserRepository.addMember(user.companyId, existingUser.id, input.role_id, env);
    } catch (err) {
      if (err instanceof Error && err.message.startsWith('CONFLICT:')) {
        throw new ConflictError(err.message.replace('CONFLICT:', ''));
      }
      throw err;
    }

    return { userId: existingUser.id, message: `Member invited successfully with role '${targetRoleName}'` };
  },

  /**
   * Update a member's role within the current tenant company.
   * Permission: users.update
   * Prevents role escalation (non-OWNER cannot assign OWNER).
   * Prevents self-demotion of the last OWNER.
   */
  async updateMemberRole(
    targetUserId: string,
    input: UpdateMemberRoleInput,
    user: UserContext,
    env: Env
  ): Promise<{ message: string }> {
    assertPermission(user, 'users.update');

    const membership = await UserRepository.findMembership(user.companyId, targetUserId, env);
    if (!membership || !membership.is_active) {
      throw new NotFoundError('Member not found in your company');
    }

    // Prevent role escalation
    const roleResp = await fetch(`${env.SUPABASE_URL}/rest/v1/roles?id=eq.${input.role_id}&select=name`, {
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    });
    const roleRows = await roleResp.json() as Array<{ name: string }>;
    if (!roleRows || roleRows.length === 0) {
      throw new NotFoundError(`Role '${input.role_id}' not found`);
    }
    const newRoleName = roleRows[0].name;
    if (newRoleName === 'OWNER' && user.role !== 'OWNER') {
      throw new ForbiddenError('Only the OWNER can assign the OWNER role');
    }

    // Prevent demoting the last OWNER
    if (membership.roles.name === 'OWNER' && newRoleName !== 'OWNER') {
      // Check if there are other active OWNERs
      const ownerRoleResp = await fetch(`${env.SUPABASE_URL}/rest/v1/roles?name=eq.OWNER&select=id`, {
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      });
      const ownerRoleRows = await ownerRoleResp.json() as Array<{ id: string }>;
      if (ownerRoleRows.length > 0) {
        const ownerCountResp = await fetch(
          `${env.SUPABASE_URL}/rest/v1/company_members?company_id=eq.${user.companyId}&role_id=eq.${ownerRoleRows[0].id}&is_active=eq.true&select=id`,
          { headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` } }
        );
        const ownerMembers = await ownerCountResp.json() as Array<{ id: string }>;
        if (ownerMembers.length <= 1) {
          throw new ForbiddenError('Cannot demote the last OWNER. Transfer ownership to another member first.');
        }
      }
    }

    await UserRepository.updateMemberRole(membership.id, input.role_id, env);
    return { message: `Member role updated to '${newRoleName}'` };
  },

  /**
   * Remove a member from the current tenant company (deactivate membership).
   * Permission: users.delete
   * Cannot remove yourself. Cannot remove the last OWNER.
   */
  async removeMember(targetUserId: string, user: UserContext, env: Env): Promise<{ message: string }> {
    assertPermission(user, 'users.delete');

    // Cannot remove yourself
    if (targetUserId === user.userId) {
      throw new ForbiddenError('You cannot remove yourself from the company. Transfer ownership first.');
    }

    const membership = await UserRepository.findMembership(user.companyId, targetUserId, env);
    if (!membership || !membership.is_active) {
      throw new NotFoundError('Member not found in your company');
    }

    // Cannot remove the last OWNER
    if (membership.roles.name === 'OWNER') {
      throw new ForbiddenError('Cannot remove an OWNER. Demote them first.');
    }

    await UserRepository.deactivateMember(membership.id, env);
    return { message: 'Member removed from company successfully' };
  },
};
