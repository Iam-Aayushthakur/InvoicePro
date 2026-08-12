# InvoicePro Development Manual: 09 Database Architecture

## 1. Purpose
Detailed technical specification of the PostgreSQL database engine, schema design, table structures, column definitions, constraints, indices, and performance parameters.

## 2. Business Requirements
- Support 27 core database tables covering business master data, GST invoices, inventory transactions, and SaaS subscriptions.
- Enforce strict UUID primary keys and foreign key constraints across all relational entities.

## 3. User Stories
- As a **Database Administrator**, I want a normalized schema design with proper indexes so that query performance remains under 50ms at multi-million record scales.

## 4. User Flow
Migration Execution -> Table Initialization -> Indexing -> Foreign Keys -> RLS Policy Enforcement.

## 5. UI Requirements
- High-concurrency throughput to support real-time POS checkout and reporting dashboards.

## 6. Frontend Files
- `frontend/src/types/*`: Frontend TypeScript mirrors of database entities.

## 7. Backend Files
- `backend/src/database/supabase/types.ts`: Auto-generated database types.
- `backend/src/repositories/*`: Data access repository layer.

## 8. Database Tables
1. `companies` (Tenant master)
2. `users` (App user profiles)
3. `roles` (RBAC roles)
4. `permissions` (Granular permission keys)
5. `role_permissions` (Mapping table)
6. `company_members` (Tenant memberships)
7. `customers` (Client directory)
8. `suppliers` (Vendor directory)
9. `categories` (Hierarchical categories)
10. `products` (Catalog & tax rates)
11. `inventory` (Stock state)
12. `inventory_transactions` (Stock movement ledger)
13. `sales_invoices` (GST Sales invoice headers)
14. `sales_invoice_items` (Invoice line items)
15. `quotations` (Price quote headers)
16. `quotation_items` (Quotation line items)
17. `purchases` (Purchase order headers)
18. `purchase_items` (Purchase order line items)
19. `payments` (Payment transaction ledger)
20. `subscription_plans` (SaaS plans)
21. `subscriptions` (Tenant subscriptions)
22. `subscription_events` (Subscription audit history)
23. `usage_records` (Resource usage limits)
24. `feature_flags` (System/tenant feature toggles)
25. `notifications` (User alerts)
26. `audit_logs` (Security change log)
27. `backups` (Snapshot metadata)

## 9. Database Relationships
- `companies 1 -> N company_members N <- 1 users`
- `companies 1 -> N customers, suppliers, categories, products, sales_invoices, purchases, payments`
- `sales_invoices 1 -> N sales_invoice_items`
- `products 1 -> 1 inventory 1 -> N inventory_transactions`

## 10. API Endpoints
- Internal database access via Supabase Client & PostgreSQL connection pool.

## 11. Request Format
- Parameterized SQL queries and Supabase RPC calls.

## 12. Response Format
- PostgreSQL query result sets mapped to TypeScript row types.

## 13. Validation Rules
- `NOT NULL` constraints on mandatory columns.
- `CHECK` constraints on GSTIN lengths, positive amounts, and positive stock quantities.

## 14. Authentication Requirements
- Connected to Supabase Auth `auth.users` via `users.auth_user_id`.

## 15. RBAC Requirements
- Role hierarchy: `OWNER`, `ADMIN`, `ACCOUNTANT`, `CASHIER`, `WAREHOUSE_MANAGER`, `EMPLOYEE`.

## 16. RLS Requirements
- All tenant tables enforce `is_company_member(company_id)`.

## 17. Error Handling
- Foreign key violation (23503), Unique violation (23505), Check violation (23514) caught by repository layer.

## 18. Edge Cases
- Soft deletes for customers/products to preserve historical invoice lineage.

## 19. Security Considerations
- Zero direct public SQL access; all queries guarded by RLS policies.

## 20. Testing Strategy
- SQL migration dry runs and RLS integration test suites (`tests/database/rls.test.ts`).

## 21. Acceptance Criteria
- 27 tables created with proper PKs, FKs, indices, and RLS enabled.

## 22. Implementation Steps
1. Execute extensions migration (`001_extensions.sql`).
2. Run entity migrations (`002` through `026`).
3. Deploy RLS helpers and policies (`027`, `028`).

## 23. Troubleshooting
- Inspect pg_stat_activity and query explain plans via Supabase Dashboard.

## 24. Future Improvements
- Automated partition tables for high-volume `audit_logs` and `inventory_transactions`.
