# InvoicePro Development Manual: 00 Project Overview

## 1. Purpose
The purpose of InvoicePro is to provide an enterprise-grade, multi-tenant Business Management and GST Invoicing SaaS platform tailored for SMEs, retailers, wholesalers, and service businesses. It streamlines invoicing, inventory tracking, customer/supplier management, GST reporting, and subscription lifecycle management.

## 2. Business Requirements
- Multi-tenancy isolation where each business operates in a strictly isolated environment.
- GST compliance (CGST, SGST, IGST calculations, HSN/SAC code mapping, and GSTR reporting).
- Offline-first capabilities for key operations (invoicing, inventory lookup, customer creation).
- Role-based Access Control (RBAC) supporting Owner, Admin, Accountant, Cashier, Warehouse Manager, and Employee roles.
- Scalable SaaS tiering (Free, Starter, Pro, Business, Enterprise) with automated usage tracking and payment gateway integration (Razorpay & Stripe).

## 3. User Stories
- As a **Business Owner**, I want to monitor sales metrics, employee activity, and subscription billing status so that I can run my business efficiently.
- As a **Cashier**, I want to generate GST-compliant invoices quickly (online or offline) and print them on thermal or A4 printers.
- As an **Accountant**, I want to generate GSTR-1 and GSTR-3B tax reports and track outstanding customer balances.
- As a **Warehouse Manager**, I want transaction-based stock updates and low-stock alerts to prevent stockouts.

## 4. User Flow
1. User visits landing page -> Registers account & company -> Selects subscription plan / trial.
2. User enters dashboard -> Manages master data (Products, Customers, Suppliers, Taxes).
3. User creates sales invoices or purchase orders -> System updates inventory transaction logs and customer balances.
4. User generates reports or exports GST filings.

## 5. UI Requirements
- Modern, high-contrast dark theme utilizing Next.js, Tailwind CSS, and shadcn/ui.
- Responsive desktop and tablet layouts with sidebar navigation and quick action drawers.
- Instant feedback with optimistic UI updates and toast notifications.

## 6. Frontend Files
- Entry Layout: `frontend/src/app/layout.tsx`
- Dashboard Root: `frontend/src/app/dashboard/page.tsx`
- Module Route Handlers: `frontend/src/app/dashboard/*`

## 7. Backend Files
- Worker Entry: `backend/src/workers/index.ts`
- API Router: `backend/src/routes/v1/*`
- Services & Repositories: `backend/src/services/*`, `backend/src/repositories/*`

## 8. Database Tables
- Core System Tables: `companies`, `users`, `company_members`, `roles`, `permissions`, `subscriptions`.
- Business Entities: `customers`, `suppliers`, `categories`, `products`, `inventory_transactions`, `sales_invoices`, `sales_invoice_items`.

## 9. Database Relationships
- `companies (1) -> (N) users` via `company_members`
- `companies (1) -> (N) customers, suppliers, products, invoices`
- `sales_invoices (1) -> (N) sales_invoice_items`

## 10. API Endpoints
- Base API URL: `/api/v1/`
- Standard REST Endpoints for Auth, Companies, Customers, Products, Invoices, Payments, Reports, Subscriptions.

## 11. Request Format
- Standard JSON payloads with Bearer JWT header: `Authorization: Bearer <token>`.

## 12. Response Format
```json
{
  "success": true,
  "data": {},
  "error": null
}
```

## 13. Validation Rules
- Strict schema validation enforced at API boundary via Zod schemas (`backend/src/schemas/*`).

## 14. Authentication Requirements
- Supabase Auth JWT validation on all `/api/v1/*` routes (except public auth & webhooks).

## 15. RBAC Requirements
- Role hierarchy: `OWNER > ADMIN > ACCOUNTANT > CASHIER / WAREHOUSE_MANAGER > EMPLOYEE`.

## 16. RLS Requirements
- Every PostgreSQL tenant table enforces `company_id = (SELECT auth.jwt() -> 'app_metadata' ->> 'company_id')`.

## 17. Error Handling
- Centralized error response formatter (`backend/src/core/responses/index.ts`) returning HTTP status 400, 401, 403, 404, 429, 500.

## 18. Edge Cases
- Network drops during invoice creation -> Queued in IndexedDB offline queue for auto-sync.
- Concurrent inventory deduction -> Handled via database transaction locks and stock adjustment logs.

## 19. Security Considerations
- Zero trust on `company_id` from client payloads.
- Cloudflare WAF, Rate limiting, CSP, HSTS, and strict `SUPABASE_SERVICE_ROLE_KEY` backend isolation.

## 20. Testing Strategy
- Unit tests (`vitest`), Integration tests (`supertest`), E2E tests (`playwright`), RLS policy verification tests.

## 21. Acceptance Criteria
- 100% tenant data isolation across API and DB levels.
- Invoice generation response time under 100ms on Cloudflare Workers.
- Zero mock logic in production builds.

## 22. Implementation Steps
1. Phase 0: System Architecture & Manual.
2. Phase 1: Skeleton & Environment Setup.
3. Phase 2: Database Schema & RLS Migrations.
4. Phase 3: Auth & Tenant Resolution Middleware.
5. Phase 4: Core Business Modules & APIs.
6. Phase 5: SaaS Billing & Gateway Webhooks.
7. Phase 6: Offline Sync Engine & PWA.
8. Phase 7: End-to-End Testing & Cloudflare Deployment.

## 23. Troubleshooting
- Inspect Cloudflare Worker logs via `wrangler tail`.
- Check Supabase audit logs and RLS policy execution traces.

## 24. Future Improvements
- Automated e-way bill and e-invoicing integration with GSTN API portal.
