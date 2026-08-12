# InvoicePro Development Manual: 06 Folder Structure

## 1. Purpose
Define the exact filesystem hierarchy, naming conventions, and file organization rules for InvoicePro.

## 2. Business Requirements
- Clear separation between frontend web app, backend Cloudflare Worker API, Supabase database artifacts, and documentation.

## 3. User Stories
- As a **Developer**, I want a deterministic file organization pattern so that locating components and routes is effortless.

## 4. User Flow
Developer Navigation -> Modular Directory Traversal -> Quick File Edits.

## 5. UI Requirements
- Next.js App Router route groups (`(marketing)`, `(auth)`) for visual routing separation.

## 6. Frontend Files
- `frontend/src/app/*`: Next.js pages and layouts.
- `frontend/src/components/*`: Shared UI primitives and widgets.
- `frontend/src/modules/*`: Feature domain implementations.
- `frontend/src/lib/*`: Libraries and helpers.
- `frontend/src/hooks/*`: Custom React hooks.
- `frontend/src/stores/*`: Zustand state management.
- `frontend/src/services/*`: API client functions.
- `frontend/src/types/*`: TypeScript type definitions.
- `frontend/src/schemas/*`: Zod validation schemas.
- `frontend/src/constants/*`: Application constants.
- `frontend/src/offline/*`: PWA & IndexedDB offline engine.

## 7. Backend Files
- `backend/src/workers/*`: Cloudflare Worker execution.
- `backend/src/config/*`: Environment & plan configuration.
- `backend/src/core/*`: Shared backend utilities & base errors.
- `backend/src/middleware/*`: Request processing pipeline.
- `backend/src/routes/v1/*`: REST endpoints.
- `backend/src/controllers/*`: Request handlers.
- `backend/src/services/*`: Business services.
- `backend/src/repositories/*`: DB data access layer.
- `backend/src/database/*`: Supabase client wrappers & migrations.
- `backend/src/integrations/*`: External gateways (Razorpay, Stripe, Resend).

## 8. Database Tables
- Database schema scripts in `supabase/migrations/*.sql`.

## 9. Database Relationships
- Foreign key dependencies reflected in migration naming order (`001_*.sql` to `018_*.sql`).

## 10. API Endpoints
- Route filenames match URL path segments (`invoices.routes.ts` -> `/api/v1/invoices`).

## 11. Request Format
- JSON payload format.

## 12. Response Format
- JSON API response envelope.

## 13. Validation Rules
- Filename kebab-case naming standard (`customer.service.ts`, `use-auth.ts`).

## 14. Authentication Requirements
- Middleware files isolated in `backend/src/middleware/`.

## 15. RBAC Requirements
- Role permissions defined in `backend/src/config/permissions.ts`.

## 16. RLS Requirements
- RLS policy SQL files located in `supabase/migrations/018_rls_policies.sql`.

## 17. Error Handling
- Error classes located in `backend/src/core/errors/index.ts`.

## 18. Edge Cases
- Legacy standalone `src/` folder preserved at workspace root for legacy reference.

## 19. Security Considerations
- Sensitive deployment configs restricted to `.env` and `infrastructure/` subdirectories.

## 20. Testing Strategy
- Test file structure mirrored in `frontend/tests/`, `backend/tests/`, and root `tests/`.

## 21. Acceptance Criteria
- 100% adherence to defined folder layout across monorepo workspace.

## 22. Implementation Steps
1. Create directory hierarchy.
2. Place `index.ts` or `.gitkeep` placeholder files.
3. Validate paths in `tsconfig.json`.

## 23. Troubleshooting
- Check path alias resolution errors in Vite/Next/TS configs.

## 24. Future Improvements
- Automated linter rule to enforce folder placement conventions.
