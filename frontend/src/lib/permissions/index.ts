export interface ClientUserContext {
  userId: string;
  companyId: string;
  role: string;
  permissions: string[];
}

export function can(user: ClientUserContext | null | undefined, permissionCode: string): boolean {
  if (!user || !user.companyId) {
    return false;
  }
  if (user.role === 'OWNER') {
    return true;
  }
  return user.permissions.includes(permissionCode);
}
