# InvoicePro Database Relationships Reference

## Primary Keys & Foreign Key Cascading Rules

1. **Company Memberships**:
   - `company_members.company_id` -> `companies.id` (`ON DELETE CASCADE`)
   - `company_members.user_id` -> `users.id` (`ON DELETE CASCADE`)
   - `company_members.role_id` -> `roles.id` (`ON DELETE RESTRICT`)

2. **Master Entities**:
   - `customers.company_id` -> `companies.id` (`ON DELETE CASCADE`)
   - `suppliers.company_id` -> `companies.id` (`ON DELETE CASCADE`)
   - `categories.company_id` -> `companies.id` (`ON DELETE CASCADE`)
   - `categories.parent_id` -> `categories.id` (`ON DELETE SET NULL`)
   - `products.company_id` -> `companies.id` (`ON DELETE CASCADE`)
   - `products.category_id` -> `categories.id` (`ON DELETE SET NULL`)

3. **Stock & Transactions**:
   - `inventory.company_id` -> `companies.id` (`ON DELETE CASCADE`)
   - `inventory.product_id` -> `products.id` (`ON DELETE CASCADE`)
   - `inventory_transactions.company_id` -> `companies.id` (`ON DELETE CASCADE`)
   - `inventory_transactions.product_id` -> `products.id` (`ON DELETE CASCADE`)

4. **Invoicing & Sales**:
   - `sales_invoices.company_id` -> `companies.id` (`ON DELETE CASCADE`)
   - `sales_invoices.customer_id` -> `customers.id` (`ON DELETE RESTRICT`)
   - `sales_invoice_items.invoice_id` -> `sales_invoices.id` (`ON DELETE CASCADE`)
   - `sales_invoice_items.product_id` -> `products.id` (`ON DELETE RESTRICT`)

5. **Purchases & Payments**:
   - `purchases.company_id` -> `companies.id` (`ON DELETE CASCADE`)
   - `purchases.supplier_id` -> `suppliers.id` (`ON DELETE RESTRICT`)
   - `purchase_items.purchase_id` -> `purchases.id` (`ON DELETE CASCADE`)
   - `purchase_items.product_id` -> `products.id` (`ON DELETE RESTRICT`)
   - `payments.company_id` -> `companies.id` (`ON DELETE CASCADE`)
   - `payments.invoice_id` -> `sales_invoices.id` (`ON DELETE SET NULL`)
   - `payments.purchase_id` -> `purchases.id` (`ON DELETE SET NULL`)
