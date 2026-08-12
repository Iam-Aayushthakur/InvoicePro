export function usePermissions() {
  // TODO: Check RBAC permissions for active user & company role
  return { hasPermission: (_permission: string) => true };
}
