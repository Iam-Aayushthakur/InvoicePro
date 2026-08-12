# InvoicePro Row Level Security (RLS) Policies Reference

## Security Architecture

Multi-tenancy isolation in InvoicePro is enforced directly at the database engine level using PostgreSQL Row Level Security (RLS) policies.

### Helper Security Functions

1. **`is_company_member(target_company_id UUID)`**:
   Evaluates if `auth.uid()` belongs to an active user membership in `target_company_id`.

2. **`has_company_role(target_company_id UUID, required_role VARCHAR)`**:
   Evaluates if `auth.uid()` has `required_role` (e.g. `OWNER`, `ADMIN`) in `target_company_id`.

3. **`has_company_permission(target_company_id UUID, required_permission VARCHAR)`**:
   Evaluates if `auth.uid()` holds the specified permission code in `target_company_id`.

---

## Policy Summary Matrix

| Table | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `companies` | `is_company_member(id)` | Authenticated | `has_company_role(id, 'OWNER/ADMIN')` | Denied |
| `users` | Own Profile / Colleague | Authenticated | Own Profile | Denied |
| `company_members` | `is_company_member(company_id)` | `has_company_role('OWNER/ADMIN')` | `has_company_role('OWNER/ADMIN')` | `has_company_role('OWNER/ADMIN')` |
| `customers` | `is_company_member(company_id)` | `is_company_member(company_id)` | `is_company_member(company_id)` | `has_company_role('OWNER/ADMIN')` |
| `suppliers` | `is_company_member(company_id)` | `is_company_member(company_id)` | `is_company_member(company_id)` | `has_company_role('OWNER/ADMIN')` |
| `products` | `is_company_member(company_id)` | `is_company_member(company_id)` | `is_company_member(company_id)` | `has_company_role('OWNER/ADMIN')` |
| `inventory` | `is_company_member(company_id)` | `is_company_member(company_id)` | `is_company_member(company_id)` | Denied |
| `sales_invoices` | `is_company_member(company_id)` | `is_company_member(company_id)` | `is_company_member(company_id)` | `has_company_role('OWNER/ADMIN')` |
| `payments` | `is_company_member(company_id)` | `is_company_member(company_id)` | `has_company_role('OWNER/ADMIN')` | Denied |
| `audit_logs` | `has_company_role('OWNER/ADMIN')` | System Triggers Only | Denied | Denied |
| `backups` | `has_company_role('OWNER')` | Service Role Only | Denied | Denied |
