import { ForbiddenError } from '../core/errors/index.js';
import { UserContext, can } from '../core/permissions.js';

export function requirePermission(permissionCode: string) {
  return (user: UserContext): void => {
    if (!can(user, permissionCode)) {
      throw new ForbiddenError(`FORBIDDEN: User lacks required permission '${permissionCode}'`);
    }
  };
}
