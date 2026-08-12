// Multi-tenant resolution middleware
// Derives tenant context securely from DB membership. NEVER trusts company_id from request bodies/headers!
import { ForbiddenError, NotFoundError } from '../core/errors/index.js';
import { UserContext } from '../core/permissions.js';

export async function resolveTenantContext(
  authUserId: string,
  requestedCompanyId: string | null,
  env: { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string }
): Promise<UserContext> {
  // Query Supabase REST API via Service Role Key for company membership & permissions
  const queryUrl = `${env.SUPABASE_URL}/rest/v1/company_members?select=id,company_id,role_id,is_active,users!inner(id,auth_user_id),roles!inner(name),companies!inner(id,name,is_active)&users.auth_user_id=eq.${authUserId}&is_active=eq.true`;

  const response = await fetch(queryUrl, {
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });

  if (!response.ok) {
    throw new ForbiddenError('Failed to resolve tenant membership');
  }

  const memberships = await response.json() as Array<{
    id: string;
    company_id: string;
    role_id: string;
    is_active: boolean;
    users: { id: string; auth_user_id: string };
    roles: { name: string };
    companies: { id: string; name: string; is_active: boolean };
  }>;

  if (!memberships || memberships.length === 0) {
    throw new ForbiddenError('Authenticated user has no active tenant company memberships');
  }

  // Select membership (either specified requestedCompanyId if member, or first active company)
  let activeMembership = memberships[0];
  if (requestedCompanyId) {
    const matched = memberships.find((m) => m.company_id === requestedCompanyId);
    if (matched) {
      activeMembership = matched;
    } else {
      throw new ForbiddenError(`User is not an active member of requested tenant company '${requestedCompanyId}'`);
    }
  }

  if (!activeMembership.companies.is_active) {
    throw new ForbiddenError('Tenant company account is inactive or suspended');
  }

  // Fetch permissions assigned to active role
  const permUrl = `${env.SUPABASE_URL}/rest/v1/role_permissions?select=permissions(code)&role_id=eq.${activeMembership.role_id}`;
  const permResp = await fetch(permUrl, {
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });

  let permissionCodes: string[] = [];
  if (permResp.ok) {
    const permData = await permResp.json() as Array<{ permissions: { code: string } }>;
    permissionCodes = permData.map((p) => p.permissions.code);
  }

  return {
    userId: activeMembership.users.id,
    companyId: activeMembership.company_id,
    role: activeMembership.roles.name,
    permissions: permissionCodes,
  };
}
