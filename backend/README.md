# InvoicePro Backend API Service

Cloudflare Workers REST API service built with TypeScript, Supabase PostgreSQL RLS, Razorpay/Stripe payment gateways, and background queue workers.

## Directory Layout

- `src/workers/index.ts`: Worker entry point for Cloudflare edge execution.
- `src/routes/v1/`: Versioned REST API endpoints (`/api/v1/*`).
- `src/controllers/`: HTTP Request/Response handling layer.
- `src/services/`: Core multi-tenant business logic.
- `src/repositories/`: Data access layer with Supabase admin client.
- `src/middleware/`: Auth, RLS tenant isolation, rate limiting, and RBAC guards.

## Implemented Services (Phase 4)

We have implemented 20 complete, tenant-isolated REST services following a strict layered architecture (`Types -> Validator -> Repository -> Service -> Controller -> Routes`):

### Core & Master Data
1. **Company Service**: Tenant provisioning and global settings.
2. **User Service**: Identity, invites, and profiles.
3. **Role & Permission Service**: RBAC management.
4. **Customer Service**: Customer directory and balances.
5. **Supplier Service**: Vendor directory and balances.
6. **Category Service**: Hierarchical product taxonomy.
7. **Product Service**: Inventory catalog (SKUs, Taxes, HSN/SAC).

### Transactions & Inventory
8. **Inventory Service**: Stock adjustments and transaction ledger.
9. **Quotation Service**: Sales estimates.
10. **Purchase Service**: Vendor POs and bills.
11. **Sales Service**: Core sales management.
12. **Invoice Service**: GST invoicing and billing.

### Financials & Analytics
13. **Payment Service**: Multi-method incoming/outgoing payment ledger.
14. **Dashboard Service**: Real-time KPI aggregation.
15. **Reporting Service**: Automated GST liability and Sales reports.

### Platform & Admin
16. **Notification Service**: In-app user alerts.
17. **Audit Log Service**: Immutable security change tracking.
18. **Backup Service**: Automated data snapshots.
19. **Subscription Service**: SaaS billing tier tracking.
20. **Usage & Feature Limit Service**: Resource gating.

## Architecture Highlights
- **Authoritative Backend**: The frontend is entirely untrusted. All GST tax calculations (CGST/SGST vs IGST) and invoice totals are recalculated centrally in `src/services/gst.service.ts`.
- **Tenant Isolation (`x-company-id`)**: Every database read/write operation is forcibly scoped to `company_id=eq.${companyId}` acting as a secondary shield to PostgreSQL Row-Level Security.
- **Strict RBAC**: Every controller action invokes `assertPermission` to ensure granular rights (e.g., `invoices.create`, `inventory.update`).
