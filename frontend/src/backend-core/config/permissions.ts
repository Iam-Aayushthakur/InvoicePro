export const BACKEND_PERMISSIONS = {
  OWNER_FULL: 'owner:*',
  ADMIN_MANAGE: 'admin:*',
  INVOICE_CREATE: 'invoice:create',
  INVOICE_READ: 'invoice:read',
  INVOICE_UPDATE: 'invoice:update',
  INVOICE_DELETE: 'invoice:delete',
} as const;
