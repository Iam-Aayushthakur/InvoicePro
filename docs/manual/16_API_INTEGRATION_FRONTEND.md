# Phase 5: API Integration & Frontend Store

Now that the backend API is 100% complete with 20 RESTful micro-services running on Cloudflare Workers, we must connect our Next.js frontend to these APIs.

## Objective

Create a robust, type-safe API client layer and a state management architecture using **Zustand** and **TanStack React Query**. We will entirely bypass direct Supabase database interactions from the frontend to strictly enforce backend authoritative calculations and business logic.

## Architecture

```text
React Components (UI)
       ↓
Zustand (Global Auth/Tenant UI State)
       ↓
React Query (Caching, Pagination, Mutations)
       ↓
Axios / Fetch API Client (Interceptors, Headers)
       ↓
Cloudflare Worker (REST API)
```

## 1. The API Client (`frontend/src/lib/api-client.ts`)

The central API client must automatically inject:
1. `Authorization: Bearer <jwt>`
2. `x-company-id: <active_tenant_id>`

It must globally intercept `401 Unauthorized` (triggering a logout/redirect) and `403 Forbidden` (showing permission denied).

## 2. API Service Definitions (`frontend/src/api/`)

For every backend service (e.g., Customers, Invoices, Inventory), we will create a corresponding frontend service definition that wraps the API client calls and defines the exact TypeScript response shapes.

**Example:**
- `customer.api.ts` -> `getCustomers()`, `createCustomer()`, etc.
- `invoice.api.ts` -> `getInvoices()`, `createInvoice()`, `updateInvoiceStatus()`.

## 3. Data Fetching Hooks (`frontend/src/hooks/api/`)

We will map the API service definitions to custom React hooks powered by TanStack Query.

- `useCustomers()`: Uses `useQuery` to fetch and cache the customer list.
- `useCreateCustomer()`: Uses `useMutation` to create a customer and automatically invalidate the `['customers']` query cache upon success.

## 4. State Management (`frontend/src/store/`)

**Zustand** will be strictly reserved for UI-specific global state and Authentication state that doesn't belong in a server cache.
- `useAuthStore`: Current user, active company, JWT token.
- `useUIStore`: Sidebar toggles, global loading overlays, theme.

*Note: We will NOT store entity data (like lists of customers) in Zustand. That is TanStack Query's job.*

## Step-by-Step Implementation Plan for Phase 5

1. **Setup API Client**: Implement the core `api-client.ts` with error handling and token injection.
2. **Setup TanStack Query**: Wrap the Next.js application in `QueryClientProvider`.
3. **Build Master Data Hooks**: Implement hooks for Companies, Users, Roles, Customers, Suppliers, Categories, and Products.
4. **Build Transaction Hooks**: Implement hooks for Inventory, Quotes, Purchases, and Invoices.
5. **Build Financial Hooks**: Implement hooks for Payments, Dashboard, and Reports.

We are now ready to begin writing the API Client code.
