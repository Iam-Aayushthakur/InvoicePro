// Centralized Permission Engine for InvoicePro
// Evaluates fine-grained RBAC permissions for authenticated user context

export interface UserContext {
  userId: string;
  companyId: string;
  role: string;
  permissions: string[]; // List of active permission codes (e.g. ['invoices.create', 'reports.read'])
}

/**
 * Checks if the user holds a specific permission code.
 * Owners and Admins possess all permissions implicitly.
 */
export function can(user: UserContext | null | undefined, permissionCode: string): boolean {
  if (!user || !user.userId || !user.companyId) {
    return false;
  }

  // System OWNER role has implicit full access
  if (user.role === 'OWNER') {
    return true;
  }

  // Check if explicit permission code exists in user's assigned permissions array
  return user.permissions.includes(permissionCode);
}

/**
 * Ensures user context has required permission or throws Forbidden error
 */
export function assertPermission(user: UserContext | null | undefined, permissionCode: string): void {
  if (!can(user, permissionCode)) {
    throw new Error(`FORBIDDEN: Missing required permission '${permissionCode}'`);
  }
}
