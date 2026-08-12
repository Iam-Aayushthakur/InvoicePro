# InvoicePro Development Manual: 03 System Architecture

## 1. Purpose
Document the system topology, multi-tier execution model, edge compute architecture, and database layout.

## 2. Business Requirements
- Ultra-low latency edge request processing globally via Cloudflare Workers.
- Database level tenant isolation via PostgreSQL Row-Level Security (RLS).
- High availability with automated failover and offline synchronization.

## 3. User Stories
- As a **Developer**, I want a clear separation of concerns between Next.js frontend, Cloudflare API workers, and Supabase PostgreSQL.

## 4. User Flow
Client Request -> Cloudflare CDN -> Pages/Worker Edge -> Supabase Auth & PostgreSQL RLS -> JSON Response.

## 5. UI Requirements
- Single Page Application (SPA) experience powered by Next.js App Router with server-side rendering for marketing pages.

## 6. Frontend Files
- `frontend/src/lib/api/index.ts`: API client layer.
- `frontend/src/lib/supabase/*`: Supabase client and server wrappers.

## 7. Backend Files
- `backend/src/workers/index.ts`: Edge execution entry point.
- `backend/src/middleware/*`: Worker middleware stack.

## 8. Database Tables
- PostgreSQL system schemas and RLS security policies.

## 9. Database Relationships
- Foreign key cascading rules and tenant isolation triggers.

## 10. API Endpoints
- `/api/v1/*` versioned REST API handlers.

## 11. Request Format
- JSON over HTTP/2 and HTTP/3 via Cloudflare edge.

## 12. Response Format
- Standardized REST JSON payload format.

## 13. Validation Rules
- Boundary input validation using Zod.

## 14. Authentication Requirements
- Supabase Auth JWT header validation.

## 15. RBAC Requirements
- User role attached to JWT app_metadata.

## 16. RLS Requirements
- Mandatory `company_id` check on all tenant queries.

## 17. Error Handling
- Structured error response middleware.

## 18. Edge Cases
- Edge worker cold starts (optimized < 10ms).

## 19. Security Considerations
- Zero trust network architecture, HTTPS enforcement, secrets isolation.

## 20. Testing Strategy
- End-to-end network flow tests and middleware unit tests.

## 21. Acceptance Criteria
- End-to-end request handling verified through Cloudflare Worker pipeline.

## 22. Implementation Steps
1. Setup Cloudflare Worker routing.
2. Build middleware execution chain.
3. Integrate Supabase Client.

## 23. Troubleshooting
- Check `wrangler dev` console logs and network response headers.

## 24. Future Improvements
- Multi-region read replicas for Supabase PostgreSQL.
