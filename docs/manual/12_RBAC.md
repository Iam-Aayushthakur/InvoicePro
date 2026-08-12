# InvoicePro Development Manual: 12 RBAC

## 1. Purpose
Define the Role-Based Access Control (RBAC) model, role hierarchy, permission matrix, and enforcement mechanisms.

## 2. Business Requirements
- Enforce least-privilege security across system actions.
- Support 6 standard system roles (`OWNER`, `ADMIN`, `ACCOUNTANT`, `CASHIER`, `WAREHOUSE_MANAGER`, `EMPLOYEE`).

## 3. User Stories
- As an **Admin**, I want to assign specific roles to new employees so that cashiers can create invoices but cannot delete customers or view profit reports.

## 4. User Flow
Admin Assigns Role -> `company_members.role_id` Updated -> Permission Check Middleware Evaluates Action -> Allowed / Denied.

## 5. UI Requirements
- Role management UI drawer in Team Settings page.

## 6. Frontend Files
- `frontend/src/constants/roles.ts`: System roles.
- `frontend/src/constants/permissions.ts`: System permissions.
- `frontend/src/hooks/use-permissions.ts`: Permission check hook.

## 7. Backend Files
- `backend/src/config/roles.ts`: Backend roles config.
- `backend/src/config/permissions.ts`: Permission codes.
- `backend/src/middleware/role.middleware.ts`: Role guard middleware.
- `backend/src/middleware/permission.middleware.ts`: Permission guard middleware.

## 8. Database Tables
- `roles`, `permissions`, `role_permissions`, `company_members`.

## 9. Database Relationships
- `roles (1) -> (N) role_permissions (N) <- (1) permissions`

## 10. API Endpoints
- `GET /api/v1/roles`: List available system roles.

## 11. Request Format
- Header: `Authorization: Bearer <token>`

## 12. Response Format
- Role list array with associated permission codes.

## 13. Validation Rules
- `is_system` roles cannot be deleted.

## 14. Authentication Requirements
- Authenticated member session required.

## 15. RBAC Requirements
- Only `OWNER` or `ADMIN` can modify user roles.

## 16. RLS Requirements
- `has_company_permission()` function used for granular policy enforcement.

## 17. Error Handling
- Permission denial returns HTTP 403 Forbidden with missing permission code.

## 18. Edge Cases
- Revoking permissions takes effect immediately on next API request.

## 19. Security Considerations
- Role escalation prevention: `ADMIN` cannot assign `OWNER` role.

## 20. Testing Strategy
- Matrix unit tests verifying every role against all 30+ permissions.

## 21. Acceptance Criteria
- Unauthorized role access blocked consistently at API and DB layers.

## 22. Implementation Steps
1. Seed default roles and permissions (`supabase/seed/roles.sql`).
2. Implement PL/pgSQL `has_company_permission()` helper.
3. Wire API middleware guards.

## 23. Troubleshooting
- Inspect active user permissions in `role_permissions` join table.

## 24. Future Improvements
- Custom tenant-defined role creation for Enterprise subscribers.
