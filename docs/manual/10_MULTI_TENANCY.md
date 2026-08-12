# InvoicePro Development Manual: 10 Multi-Tenancy

## 1. Purpose
Define the multi-tenant architecture, tenant resolution mechanism, database isolation boundaries, and anti-tampering security rules.

## 2. Business Requirements
- Guarantee 100% data isolation between distinct company accounts.
- Prevent cross-tenant data leaks even under compromised API parameters.

## 3. User Stories
- As a **Tenant Owner**, I want complete privacy and security so that competing companies cannot view or modify my invoices or customer list.

## 4. User Flow
User Authenticates -> JWT Issued with `company_id` -> Request sent with JWT -> Worker Resolves Tenant -> PostgreSQL RLS Filters Query by `company_id` -> Response Returned.

## 5. UI Requirements
- Workspace switcher interface allowing multi-company owners to switch active company context safely.

## 6. Frontend Files
- `frontend/src/stores/company.store.ts`: Active company state store.
- `frontend/src/hooks/use-company.ts`: Tenant resolution hook.

## 7. Backend Files
- `backend/src/middleware/tenant.middleware.ts`: Server-side tenant resolution middleware.
- `backend/src/database/supabase/client.ts`: Supabase client wrapper.

## 8. Database Tables
- `companies`, `company_members`, `users`.

## 9. Database Relationships
- `users (1) -> (N) company_members (N) <- (1) companies`

## 10. API Endpoints
- `GET /api/v1/companies/current`: Fetch active tenant profile.

## 11. Request Format
- HTTP Bearer Token containing authenticated user claims.

## 12. Response Format
- Current company context payload.

## 13. Validation Rules
- Never accept `company_id` directly from user POST/PUT bodies to override tenant context.

## 14. Authentication Requirements
- Authenticated session verified against `public.company_members`.

## 15. RBAC Requirements
- Role permissions evaluated within active company scope.

## 16. RLS Requirements
- Mandatory RLS policy on all tenant tables using `public.is_company_member(company_id)`.

## 17. Error Handling
- Unauthorized tenant access attempts trigger HTTP 403 Forbidden.

## 18. Edge Cases
- User belonging to multiple companies: active company context selected from active token claim.

## 19. Security Considerations
- PostgreSQL RLS acts as the immutable final security perimeter.

## 20. Testing Strategy
- Cross-tenant SQL query injection tests and RLS policy verification (`tests/database/rls.test.ts`).

## 21. Acceptance Criteria
- Zero data leakage across tenant boundaries under all test scenarios.

## 22. Implementation Steps
1. Add `company_id` to all business tables.
2. Deploy `is_company_member()` security function.
3. Apply RLS policies to all tables.

## 23. Troubleshooting
- Inspect RLS policy trace logs in Supabase SQL editor.

## 24. Future Improvements
- Schema-per-tenant support for enterprise custom tier deployments.
