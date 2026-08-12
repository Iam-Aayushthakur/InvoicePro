# InvoicePro Development Manual: 08 Backend Architecture

## 1. Purpose
Define the Cloudflare Worker serverless backend execution model, REST API v1 routing, middleware processing pipeline, controller layer, and Supabase database interactions.

## 2. Business Requirements
- Ultra-low latency, scalable serverless REST API operating on Cloudflare's global edge network.
- Secure tenant isolation and RBAC authorization on all non-public endpoints.

## 3. User Stories
- As a **System Architect**, I want a clean layered architecture (Worker -> Middleware -> Controller -> Service -> Repository -> Supabase) to keep business logic maintainable.

## 4. User Flow
HTTP Request -> Cloudflare Worker fetch() -> Auth Middleware -> Tenant Middleware -> Permission Middleware -> Controller -> Service -> Repository -> PostgreSQL DB -> Response.

## 5. UI Requirements
- N/A (Headless REST API).

## 6. Frontend Files
- Invoked by `frontend/src/services/*`.

## 7. Backend Files
- `backend/src/workers/index.ts`: Worker entry point.
- `backend/src/routes/v1/*`: REST API endpoint routes.
- `backend/src/middleware/*`: Middleware processing stack (`auth`, `tenant`, `role`, `permission`, `rate-limit`, `error`).
- `backend/src/controllers/*`: Request & response handlers.
- `backend/src/services/*`: Core domain logic.
- `backend/src/repositories/*`: Data access repositories.

## 8. Database Tables
- All 27 PostgreSQL database tables accessed via Supabase client.

## 9. Database Relationships
- Foreign keys and RLS policies enforced in PostgreSQL.

## 10. API Endpoints
- `/api/v1/auth/*`, `/api/v1/customers/*`, `/api/v1/products/*`, `/api/v1/invoices/*`, `/api/v1/subscriptions/*`, etc.

## 11. Request Format
- HTTP REST JSON payloads.

## 12. Response Format
- Standard JSON envelope (`{ success: true, data: ... }`).

## 13. Validation Rules
- Zod schema validation at controller boundary.

## 14. Authentication Requirements
- `auth.middleware.ts` validates JWT Bearer tokens.

## 15. RBAC Requirements
- Centralized `can(user, permission)` evaluation in `core/permissions.ts`.

## 16. RLS Requirements
- PostgreSQL RLS enforces `company_id` isolation.

## 17. Error Handling
- `error.middleware.ts` catches uncaught exceptions and formats sanitized JSON errors.

## 18. Edge Cases
- Worker execution memory limits and V8 isolate compatibility.

## 19. Security Considerations
- CORS policy restrictions, rate limiting per IP/Tenant, service key isolation.

## 20. Testing Strategy
- Integration tests in `tests/auth/` and `tests/api/`.

## 21. Acceptance Criteria
- API endpoint response times under 100ms globally.

## 22. Implementation Steps
1. Build Worker entry and route dispatchers.
2. Build middleware chain.
3. Build controllers and services.

## 23. Troubleshooting
- Monitor Cloudflare Worker logs via `wrangler tail`.

## 24. Future Improvements
- GraphQL endpoint interface for complex analytics queries.
