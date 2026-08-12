# InvoicePro Development Manual: 14 API Reference

## 1. Purpose
Complete REST API endpoint reference, request/response format standards, error envelope, pagination, and authentication requirements.

## 2. Business Requirements
- RESTful JSON API served from Cloudflare Workers at `/api/v1/*`.
- Consistent response envelope, error codes, and status conventions.

## 3. User Stories
- As a **Frontend Developer**, I want predictable API responses so that my error handling and data binding logic is reusable across all modules.

## 4. User Flow
Frontend Component → Service Client → `fetch()` → Cloudflare Worker → Auth Middleware → Tenant Middleware → RBAC → Controller → Service → Repository → Supabase → Response.

## 5. UI Requirements
- N/A (Backend API Layer).

## 6. Frontend Files
- `frontend/src/services/*`: API client wrappers calling these endpoints.

## 7. Backend Files
- `backend/src/routes/v1/*`: Route dispatchers.
- `backend/src/controllers/*`: Request/Response handlers.
- `backend/src/services/*`: Business logic.
- `backend/src/repositories/*`: Data access.
- `backend/src/core/validators/*`: Input validation schemas.

## 8. Database Tables
- All 27 core tables.

## 9. Database Relationships
- See `docs/database/RELATIONSHIPS.md`.

## 10. API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Register user + company | Public |
| GET | `/api/v1/auth/me` | Get current session context | JWT |

### Companies
| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/api/v1/companies` | List user's companies | Authenticated |
| GET | `/api/v1/companies/current` | Current tenant company | Authenticated |
| GET | `/api/v1/companies/:id` | Get company by ID | Authenticated |
| PATCH | `/api/v1/companies/:id` | Update company profile | `company.update` |
| DELETE | `/api/v1/companies/:id` | Deactivate company | OWNER only |
| GET | `/api/v1/companies/:id/members` | List company members | `users.read` |

### Users
| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/api/v1/users/me` | Get own profile | Authenticated |
| PATCH | `/api/v1/users/me` | Update own profile | Authenticated |
| GET | `/api/v1/users/members` | List company members (paginated) | `users.read` |
| GET | `/api/v1/users/:id` | Get specific user | `users.read` |
| POST | `/api/v1/users/invite` | Invite new team member | `users.create` |
| PATCH | `/api/v1/users/:id/role` | Update member role | `users.update` |
| DELETE | `/api/v1/users/:id/membership` | Remove member from company | `users.delete` |

### Roles & Permissions
| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/api/v1/roles` | List all roles | Authenticated |
| GET | `/api/v1/roles/permissions` | List all available permissions | Authenticated |
| GET | `/api/v1/roles/:id/permissions` | Get permissions for a role | Authenticated |
| PUT | `/api/v1/roles/:id/permissions` | Update role permissions | `settings.update` |

### Customers
| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/api/v1/customers` | List all customers | `customers.read` |
| POST | `/api/v1/customers` | Create a new customer | `customers.create` |
| GET | `/api/v1/customers/:id` | Get customer by ID | `customers.read` |
| PATCH | `/api/v1/customers/:id` | Update customer | `customers.update` |
| DELETE | `/api/v1/customers/:id` | Deactivate customer | `customers.delete` |

### Suppliers
| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/api/v1/suppliers` | List all suppliers | `suppliers.read` |
| POST | `/api/v1/suppliers` | Create a new supplier | `suppliers.create` |
| GET | `/api/v1/suppliers/:id` | Get supplier by ID | `suppliers.read` |
| PATCH | `/api/v1/suppliers/:id` | Update supplier | `suppliers.update` |
| DELETE | `/api/v1/suppliers/:id` | Deactivate supplier | `suppliers.delete` |

### Categories
| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/api/v1/categories` | List all categories | `products.read` |
| POST | `/api/v1/categories` | Create a new category | `products.create` |
| GET | `/api/v1/categories/:id` | Get category by ID | `products.read` |
| PATCH | `/api/v1/categories/:id` | Update category | `products.update` |
| DELETE | `/api/v1/categories/:id` | Deactivate category | `products.delete` |

### Products
| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/api/v1/products` | List all products | `products.read` |
| POST | `/api/v1/products` | Create a new product | `products.create` |
| GET | `/api/v1/products/:id` | Get product by ID | `products.read` |
| PATCH | `/api/v1/products/:id` | Update product | `products.update` |
| DELETE | `/api/v1/products/:id` | Deactivate product | `products.delete` |

### Inventory
| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/api/v1/inventory` | List inventory across products | `inventory.read` |
| GET | `/api/v1/inventory/:product_id` | Get stock for specific product | `inventory.read` |
| GET | `/api/v1/inventory/:product_id/transactions` | List stock history for product | `inventory.read` |
| POST | `/api/v1/inventory/adjust` | Record manual stock adjustment | `inventory.update` |

### Purchases
| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/api/v1/purchases` | List all purchases | `purchases.read` |
| POST | `/api/v1/purchases` | Create a new purchase order | `purchases.create` |
| GET | `/api/v1/purchases/:id` | Get purchase by ID | `purchases.read` |
| PATCH | `/api/v1/purchases/:id/status` | Update purchase status | `purchases.update` |

### Quotations
| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/api/v1/quotations` | List all quotations | `sales.read` |
| POST | `/api/v1/quotations` | Create a new quotation | `sales.create` |
| GET | `/api/v1/quotations/:id` | Get quotation by ID | `sales.read` |
| PATCH | `/api/v1/quotations/:id/status` | Update quotation status | `sales.update` |

### Invoices
| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/api/v1/invoices` | List all invoices | `sales.read` |
| POST | `/api/v1/invoices` | Create a new sales invoice | `sales.create` |
| GET | `/api/v1/invoices/:id` | Get invoice by ID | `sales.read` |
| PATCH | `/api/v1/invoices/:id/status` | Update invoice status | `sales.update` |

### Payments
| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/api/v1/payments` | List all payments | `sales.read` |
| POST | `/api/v1/payments` | Record a payment | `sales.create` |
| GET | `/api/v1/payments/:id` | Get payment details | `sales.read` |

### Dashboard & Analytics
| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/api/v1/dashboard` | Get high-level KPI stats | `reporting.read` |

### Reports
| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/api/v1/reports?report_type=SALES&start_date=X&end_date=Y` | Generate Sales report | `reporting.read` |
| GET | `/api/v1/reports?report_type=GST&start_date=X&end_date=Y` | Generate GST tax report | `reporting.read` |

### Notifications
| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/api/v1/notifications` | List notifications | Authenticated |
| POST | `/api/v1/notifications` | Create notification | `settings.update` |
| PATCH | `/api/v1/notifications/:id/read` | Mark read | Authenticated |
| POST | `/api/v1/notifications/mark-all-read` | Mark all read | Authenticated |

### Audit Logs
| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/api/v1/audit-logs` | List security audit logs | `settings.read` |

### Backups
| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/api/v1/backups` | List backup history | `settings.read` |
| POST | `/api/v1/backups` | Trigger new backup | `settings.update` |

### Subscriptions & Billing
| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/api/v1/subscriptions` | Get active plan & limits | `settings.read` |

## 11. Request Format
```
Authorization: Bearer <jwt_access_token>
x-company-id: <uuid>  (optional, for multi-company users)
Content-Type: application/json
```

## 12. Response Format

### Success Envelope
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Envelope
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable error message",
    "details": [ "field-level error 1", "field-level error 2" ]
  }
}
```

### Standard HTTP Status Codes
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Validation Error |
| 401 | Unauthorized (invalid/missing JWT) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate resource) |
| 500 | Internal Server Error |

## 13. Validation Rules
- Input validated at controller boundary via `core/validators/*.validator.ts`.
- GSTIN: 15-character regex pattern.
- PAN: 10-character regex pattern.
- State Code: Valid 2-digit Indian GST state code.
- Email: Must contain `@` and be lowercased.

## 14. Authentication Requirements
- Bearer JWT token validated against Supabase Auth on every request.

## 15. RBAC Requirements
- Centralized `can(user, permissionCode)` checks in service layer.

## 16. RLS Requirements
- PostgreSQL RLS is the final query-level security boundary.

## 17. Error Handling
- `AppError` hierarchy: `UnauthorizedError(401)`, `ForbiddenError(403)`, `NotFoundError(404)`, `ValidationError(400)`, `ConflictError(409)`.

## 18. Edge Cases
- Multi-company users: `x-company-id` header selects active tenant. Default is first active company.

## 19. Security Considerations
- Never expose stack traces in production. `AppError` messages are sanitized.

## 20. Testing Strategy
- Test suites in `tests/api/*` verify happy path, validation, auth, RBAC, and tenant isolation.

## 21. Acceptance Criteria
- All endpoints return correct status codes and response envelope format.

## 22. Implementation Steps
1. Define types in `core/types/*.types.ts`.
2. Create validator in `core/validators/*.validator.ts`.
3. Create repository in `repositories/*.repository.ts`.
4. Create service in `services/*.service.ts`.
5. Create controller in `controllers/*/index.ts`.
6. Create routes in `routes/v1/*.routes.ts`.
7. Register routes in `workers/index.ts`.

## 23. Troubleshooting
- Inspect Cloudflare Worker logs via `wrangler tail`.

## 24. Future Improvements
- OpenAPI/Swagger specification auto-generation.
