# Frontend-Backend Mapping

This document maps the entire InvoicePro architecture from the Database layer up to the UI components.

## Core & Master Data

### 1. Company / Tenant
- **Database**: `companies`
- **Backend Service**: `CompanyService` (`src/services/company.service.ts`)
- **API Route**: `GET /api/v1/companies`, `POST /api/v1/companies`, `PATCH /api/v1/companies/:id`
- **Frontend Hook**: `useCompany()` (`src/hooks/api/useCompany.ts`)
- **Frontend Page**: `/dashboard/settings/company`
- **UI Components**: `CompanyProfileForm`, `TenantSelector`
- **Permissions**: `companies.read`, `companies.update`

### 2. User & Roles
- **Database**: `users`, `roles`, `permissions`, `role_permissions`, `user_roles`
- **Backend Service**: `UserService`, `RoleService`
- **API Route**: `/api/v1/users`, `/api/v1/roles`
- **Frontend Hook**: `useUsers()`, `useRoles()`
- **Frontend Page**: `/dashboard/settings/employees`
- **UI Components**: `UserTable`, `RoleManager`, `InviteUserModal`
- **Permissions**: `users.read`, `roles.read`

### 3. Customers
- **Database**: `customers`
- **Backend Service**: `CustomerService`
- **API Route**: `/api/v1/customers`
- **Frontend Hook**: `useCustomers()`
- **Frontend Page**: `/dashboard/customers`
- **UI Components**: `CustomerTable`, `CustomerForm`, `CustomerDetailsView`
- **Permissions**: `customers.read`, `customers.write`

### 4. Suppliers
- **Database**: `suppliers`
- **Backend Service**: `SupplierService`
- **API Route**: `/api/v1/suppliers`
- **Frontend Hook**: `useSuppliers()`
- **Frontend Page**: `/dashboard/suppliers`
- **UI Components**: `SupplierTable`, `SupplierForm`
- **Permissions**: `suppliers.read`, `suppliers.write`

### 5. Categories
- **Database**: `categories`
- **Backend Service**: `CategoryService`
- **API Route**: `/api/v1/categories`
- **Frontend Hook**: `useCategories()`
- **Frontend Page**: `/dashboard/categories`
- **UI Components**: `CategoryTree`, `CategoryForm`
- **Permissions**: `categories.read`, `categories.write`

### 6. Products
- **Database**: `products`
- **Backend Service**: `ProductService`
- **API Route**: `/api/v1/products`
- **Frontend Hook**: `useProducts()`
- **Frontend Page**: `/dashboard/products`
- **UI Components**: `ProductTable`, `ProductForm`, `PricingInputs`
- **Permissions**: `products.read`, `products.write`

---

## Transactions & Inventory

### 7. Inventory
- **Database**: `inventory_ledger`
- **Backend Service**: `InventoryService`
- **API Route**: `/api/v1/inventory`
- **Frontend Hook**: `useInventory()`
- **Frontend Page**: `/dashboard/inventory`
- **UI Components**: `StockLevelsTable`, `StockAdjustmentModal`, `InventoryHistory`
- **Permissions**: `inventory.read`, `inventory.write`

### 8. Invoices
- **Database**: `invoices`, `invoice_items`
- **Backend Service**: `InvoiceService`, `GstService`
- **API Route**: `/api/v1/invoices`
- **Frontend Hook**: `useInvoices()`, `useCreateInvoice()`
- **Frontend Page**: `/dashboard/invoices`, `/dashboard/invoices/new`, `/dashboard/invoices/[id]`
- **UI Components**: `InvoiceBuilder`, `CustomerSelect`, `ProductSelect`, `TaxTotalsBox`, `InvoicePreview`
- **Permissions**: `invoices.read`, `invoices.create`, `invoices.update`

### 9. Purchases
- **Database**: `purchases`, `purchase_items`
- **Backend Service**: `PurchaseService`
- **API Route**: `/api/v1/purchases`
- **Frontend Hook**: `usePurchases()`
- **Frontend Page**: `/dashboard/purchases`
- **UI Components**: `PurchaseTable`, `PurchaseForm`
- **Permissions**: `purchases.read`, `purchases.create`

### 10. Quotations
- **Database**: `quotations`, `quotation_items`
- **Backend Service**: `QuotationService`
- **API Route**: `/api/v1/quotations`
- **Frontend Hook**: `useQuotations()`
- **Frontend Page**: `/dashboard/quotations`
- **UI Components**: `QuotationTable`, `QuoteBuilder`
- **Permissions**: `quotations.read`, `quotations.create`

---

## Financials & Platform

### 11. Payments
- **Database**: `payments`
- **Backend Service**: `PaymentService`
- **API Route**: `/api/v1/payments`
- **Frontend Hook**: `usePayments()`
- **Frontend Page**: `/dashboard/payments`
- **UI Components**: `PaymentTable`, `RecordPaymentModal`
- **Permissions**: `payments.read`, `payments.create`

### 12. Dashboard & Analytics
- **Database**: (Aggregates over invoices, purchases, customers)
- **Backend Service**: `DashboardService`
- **API Route**: `/api/v1/dashboard/kpi`
- **Frontend Hook**: `useDashboardKpi()`
- **Frontend Page**: `/dashboard`
- **UI Components**: `KpiCard`, `RevenueChart`, `RecentActivityList`
- **Permissions**: `dashboard.read`

### 13. Reports
- **Database**: (Aggregates over transactions for GST)
- **Backend Service**: `ReportingService`
- **API Route**: `/api/v1/reports/gst`, `/api/v1/reports/sales`
- **Frontend Hook**: `useReports()`
- **Frontend Page**: `/dashboard/reports`
- **UI Components**: `GstReportTable`, `DateRangeFilter`
- **Permissions**: `reports.read`

### 14. Audit Logs
- **Database**: `audit_logs`
- **Backend Service**: `AuditLogService`
- **API Route**: `/api/v1/audit-logs`
- **Frontend Hook**: `useAuditLogs()`
- **Frontend Page**: `/dashboard/settings/audit-logs`
- **UI Components**: `AuditLogTable`, `JsonViewer`
- **Permissions**: `audit_logs.read`

### 15. Subscriptions
- **Database**: `subscriptions`
- **Backend Service**: `SubscriptionService`
- **API Route**: `/api/v1/subscriptions`
- **Frontend Hook**: `useSubscription()`
- **Frontend Page**: `/dashboard/settings/billing`
- **UI Components**: `CurrentPlanCard`, `UpgradeModal`
- **Permissions**: `subscriptions.read`, `subscriptions.manage`
