import { ForbiddenError } from '../core/errors/index.js';
import { UserContext } from '../core/permissions.js';

export function requireRole(allowedRoles: string[]) {
  return (user: UserContext): void => {
    if (!user || !allowedRoles.includes(user.role)) {
      throw new ForbiddenError(`FORBIDDEN: Operation requires one of the following roles: [${allowedRoles.join(', ')}]`);
    }
  };
}
