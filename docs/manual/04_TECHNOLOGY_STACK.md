# InvoicePro Development Manual: 04 Technology Stack

## 1. Purpose
Specify all languages, frameworks, libraries, runtime environments, and infrastructure services used in InvoicePro.

## 2. Business Requirements
- Utilize modern, production-tested open source technologies.
- Maintain a single language ecosystem (TypeScript) across frontend, backend, and edge functions.

## 3. User Stories
- As an **Engineer**, I want type-safety from database to frontend components using TypeScript and Zod.

## 4. User Flow
TypeScript source files -> Vite/Next.js/wrangler compiler -> Cloudflare Workers / Browser runtime.

## 5. UI Requirements
- Tailwind CSS for styling, Lucide icons, shadcn/ui components, Recharts for data visualization.

## 6. Frontend Files
- `frontend/package.json`: Frontend dependency manifest.
- `frontend/tsconfig.json`: Frontend TypeScript compiler configuration.

## 7. Backend Files
- `backend/package.json`: Backend dependency manifest.
- `backend/tsconfig.json`: Backend TypeScript compiler configuration.
- `backend/wrangler.toml`: Cloudflare Workers configuration.

## 8. Database Tables
- Supabase PostgreSQL 15+ database instance.

## 9. Database Relationships
- Foreign keys, UUID extension (`uuid-ossp` or `pgcrypto`).

## 10. API Endpoints
- Cloudflare Workers fetch API handler.

## 11. Request Format
- Application/json HTTP headers.

## 12. Response Format
- JSON API format.

## 13. Validation Rules
- Zod 3.x schema validation.

## 14. Authentication Requirements
- Supabase Auth `@supabase/supabase-js` and `@supabase/ssr`.

## 15. RBAC Requirements
- TypeScript enum roles: `OWNER`, `ADMIN`, `ACCOUNTANT`, `CASHIER`, `WAREHOUSE_MANAGER`, `EMPLOYEE`.

## 16. RLS Requirements
- PostgreSQL RLS policy scripts.

## 17. Error Handling
- Custom `AppError` TypeScript class hierarchy.

## 18. Edge Cases
- Compatibility with V8 isolates in Cloudflare Workers.

## 19. Security Considerations
- Automated dependency vulnerability scanning in CI/CD.

## 20. Testing Strategy
- Vitest for unit testing, Playwright for E2E testing.

## 21. Acceptance Criteria
- Zero TypeScript compilation errors in strict mode across frontend and backend.

## 22. Implementation Steps
1. Configure `package.json` files.
2. Setup strict `tsconfig.json` rules.
3. Verify module resolution.

## 23. Troubleshooting
- Clear build caches (`.next/`, `.wrangler/`, `dist/`).

## 24. Future Improvements
- Upgrade dependencies in lockstep with official releases.
