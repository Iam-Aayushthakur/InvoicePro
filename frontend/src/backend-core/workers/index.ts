import { handleAuthRoutes } from '../routes/v1/auth.routes.js';
import { handleCompanyRoutes } from '../routes/v1/company.routes.js';
import { handleUserRoutes } from '../routes/v1/user.routes.js';
import { handleRoleRoutes } from '../routes/v1/role.routes.js';
import { handleCustomerRoutes } from '../routes/v1/customer.routes.js';
import { handleSupplierRoutes } from '../routes/v1/supplier.routes.js';
import { handleCategoryRoutes } from '../routes/v1/category.routes.js';
import { handleProductRoutes } from '../routes/v1/product.routes.js';
import { handleInventoryRoutes } from '../routes/v1/inventory.routes.js';
import { handlePurchaseRoutes } from '../routes/v1/purchase.routes.js';
import { handleQuotationRoutes } from '../routes/v1/quotation.routes.js';
import { handleInvoiceRoutes } from '../routes/v1/invoice.routes.js';
import { handlePaymentRoutes } from '../routes/v1/payment.routes.js';
import { handleDashboardRoutes } from '../routes/v1/dashboard.routes.js';
import { handleReportingRoutes } from '../routes/v1/reporting.routes.js';
import { handleNotificationRoutes } from '../routes/v1/notification.routes.js';
import { handleAuditRoutes } from '../routes/v1/audit.routes.js';
import { handleBackupRoutes } from '../routes/v1/backup.routes.js';
import { handleSubscriptionRoutes } from '../routes/v1/subscription.routes.js';
import { AppError } from '../core/errors/index.js';
import { errorResponse } from '../core/responses/index.js';

export interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    try {
      const url = new URL(request.url);
      const path = url.pathname;

      // Health check
      if (path === '/health') {
        return new Response(JSON.stringify({ status: 'ok', service: 'InvoicePro API Worker', timestamp: new Date().toISOString() }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // --- API v1 Route Dispatcher ---

      // Auth routes: /api/v1/auth/*
      if (path.startsWith('/api/v1/auth/')) {
        const pathSegments = path.replace('/api/v1/auth/', '').split('/').filter(Boolean);
        return await handleAuthRoutes(request, pathSegments, env);
      }

      // Company routes: /api/v1/companies/*
      if (path.startsWith('/api/v1/companies')) {
        const pathSegments = path.replace('/api/v1/companies', '').split('/').filter(Boolean);
        return await handleCompanyRoutes(request, pathSegments, env);
      }

      // User routes: /api/v1/users/*
      if (path.startsWith('/api/v1/users')) {
        const pathSegments = path.replace('/api/v1/users', '').split('/').filter(Boolean);
        return await handleUserRoutes(request, pathSegments, env);
      }

      // Role routes: /api/v1/roles/*
      if (path.startsWith('/api/v1/roles')) {
        const pathSegments = path.replace('/api/v1/roles', '').split('/').filter(Boolean);
        return await handleRoleRoutes(request, pathSegments, env);
      }

      // Master Data routes
      if (path.startsWith('/api/v1/customers')) {
        const pathSegments = path.replace('/api/v1/customers', '').split('/').filter(Boolean);
        return await handleCustomerRoutes(request, pathSegments, env);
      }
      if (path.startsWith('/api/v1/suppliers')) {
        const pathSegments = path.replace('/api/v1/suppliers', '').split('/').filter(Boolean);
        return await handleSupplierRoutes(request, pathSegments, env);
      }
      if (path.startsWith('/api/v1/categories')) {
        const pathSegments = path.replace('/api/v1/categories', '').split('/').filter(Boolean);
        return await handleCategoryRoutes(request, pathSegments, env);
      }
      if (path.startsWith('/api/v1/products')) {
        const pathSegments = path.replace('/api/v1/products', '').split('/').filter(Boolean);
        return await handleProductRoutes(request, pathSegments, env);
      }

      // Core Transactions & Inventory
      if (path.startsWith('/api/v1/inventory')) {
        const pathSegments = path.replace('/api/v1/inventory', '').split('/').filter(Boolean);
        return await handleInventoryRoutes(request, pathSegments, env);
      }
      if (path.startsWith('/api/v1/purchases')) {
        const pathSegments = path.replace('/api/v1/purchases', '').split('/').filter(Boolean);
        return await handlePurchaseRoutes(request, pathSegments, env);
      }
      if (path.startsWith('/api/v1/quotations')) {
        const pathSegments = path.replace('/api/v1/quotations', '').split('/').filter(Boolean);
        return await handleQuotationRoutes(request, pathSegments, env);
      }
      if (path.startsWith('/api/v1/invoices')) {
        const pathSegments = path.replace('/api/v1/invoices', '').split('/').filter(Boolean);
        return await handleInvoiceRoutes(request, pathSegments, env);
      }

      // Financials & Analytics
      if (path.startsWith('/api/v1/payments')) {
        const pathSegments = path.replace('/api/v1/payments', '').split('/').filter(Boolean);
        return await handlePaymentRoutes(request, pathSegments, env);
      }
      if (path.startsWith('/api/v1/dashboard')) {
        const pathSegments = path.replace('/api/v1/dashboard', '').split('/').filter(Boolean);
        return await handleDashboardRoutes(request, pathSegments, env);
      }
      if (path.startsWith('/api/v1/reports')) {
        const pathSegments = path.replace('/api/v1/reports', '').split('/').filter(Boolean);
        return await handleReportingRoutes(request, pathSegments, env);
      }

      // Platform & Admin
      if (path.startsWith('/api/v1/notifications')) {
        const pathSegments = path.replace('/api/v1/notifications', '').split('/').filter(Boolean);
        return await handleNotificationRoutes(request, pathSegments, env);
      }
      if (path.startsWith('/api/v1/audit-logs')) {
        const pathSegments = path.replace('/api/v1/audit-logs', '').split('/').filter(Boolean);
        return await handleAuditRoutes(request, pathSegments, env);
      }
      if (path.startsWith('/api/v1/backups')) {
        const pathSegments = path.replace('/api/v1/backups', '').split('/').filter(Boolean);
        return await handleBackupRoutes(request, pathSegments, env);
      }
      if (path.startsWith('/api/v1/subscriptions')) {
        const pathSegments = path.replace('/api/v1/subscriptions', '').split('/').filter(Boolean);
        return await handleSubscriptionRoutes(request, pathSegments, env);
      }

      // 404 fallback
      return errorResponse('API Route Not Found', 404, 'NOT_FOUND');
    } catch (err) {
      if (err instanceof AppError) {
        return errorResponse(err.message, err.statusCode, err.code);
      }
      console.error('[Global Worker Error]:', err);
      const message = err instanceof Error ? err.message : 'Internal Server Error';
      return errorResponse(message, 500, 'SERVER_ERROR');
    }
  },
};
