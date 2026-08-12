# InvoicePro Database Tables Reference

## Core System Tables
- **companies**: Tenant business master accounts (GSTIN, state code, legal name, currency).
- **users**: User profile entries linked to Supabase Auth (`auth.users`).
- **roles**: System and custom RBAC roles (`OWNER`, `ADMIN`, `ACCOUNTANT`, `CASHIER`, `WAREHOUSE_MANAGER`, `EMPLOYEE`).
- **permissions**: Fine-grained system permissions (`invoices.create`, `reports.read`, etc.).
- **role_permissions**: Junction table mapping permissions to roles.
- **company_members**: Active user memberships within tenant companies.

## Business Master Tables
- **customers**: Tenant client directory, GSTIN, credit limits, and balances.
- **suppliers**: Vendor directory, GSTIN, and payable balances.
- **categories**: Hierarchical product categories (`parent_id`).
- **products**: Product catalog storing SKU, barcode, HSN/SAC codes, prices, and tax rates.

## Inventory & Financial Tables
- **inventory**: Current stock state (quantity, reserved_quantity, available_quantity).
- **inventory_transactions**: Immutable stock movement ledger (OPENING, SALE, PURCHASE, ADJUSTMENT, etc.).
- **sales_invoices**: GST sales invoice headers (subtotal, CGST, SGST, IGST totals, grand_total).
- **sales_invoice_items**: Sales invoice line item details.
- **quotations**: Price quotation headers.
- **quotation_items**: Quotation line items.
- **purchases**: Vendor purchase order headers.
- **purchase_items**: Purchase order line items.
- **payments**: Financial payment transactions (Razorpay, Stripe, Cash, Bank Transfer).

## SaaS & Governance Tables
- **subscription_plans**: Master SaaS subscription plans (FREE, STARTER, PRO, BUSINESS, ENTERPRISE).
- **subscriptions**: Active tenant subscription state.
- **subscription_events**: Subscription lifecycle audit history.
- **usage_records**: Monthly resource usage tracking counters.
- **feature_flags**: System and tenant feature toggles.
- **notifications**: In-app user notifications.
- **audit_logs**: Immutable security change log.
- **backups**: Snapshot metadata records.
