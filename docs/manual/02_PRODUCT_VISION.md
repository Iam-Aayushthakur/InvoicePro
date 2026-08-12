# InvoicePro Development Manual: 02 Product Vision

## 1. Purpose
Define the high-level product strategy, market positioning, target demographics, and core values of InvoicePro.

## 2. Business Requirements
- Deliver a fast, reliable, offline-first billing experience for SMEs.
- Provide clear financial insights and simplified GST compliance.
- Offer frictionless onboarding and scalable subscription tiers.

## 3. User Stories
- As a **Retail Merchant**, I want a lighting-fast cashier interface to minimize checkout queues.
- As a **Wholesaler**, I want bulk inventory adjustments and credit balance tracking.

## 4. User Flow
Registration -> Onboarding Wizard -> Instant Invoicing -> Analytics & Growth.

## 5. UI Requirements
- Premium UI aesthetics, fluid micro-interactions, dark mode default.

## 6. Frontend Files
- `frontend/src/app/(marketing)/*`: Public product pages.
- `frontend/src/app/onboarding/*`: Step-by-step company setup wizard.

## 7. Backend Files
- `backend/src/routes/v1/dashboard.routes.ts`: Executive summary metrics.

## 8. Database Tables
- `companies`, `subscriptions`, `subscription_plans`.

## 9. Database Relationships
- `companies (1) -> (1) subscriptions -> (1) subscription_plans`

## 10. API Endpoints
- `GET /api/v1/dashboard`: Aggregate business KPI overview.

## 11. Request Format
- Header: `Authorization: Bearer <token>`

## 12. Response Format
- JSON payload containing revenue, sales count, stock alerts, and outstanding balance summary.

## 13. Validation Rules
- Valid session and active subscription status.

## 14. Authentication Requirements
- Authenticated user session.

## 15. RBAC Requirements
- Role-based widget visibility.

## 16. RLS Requirements
- Tenant data scoping across all analytics queries.

## 17. Error Handling
- Graceful fallbacks for missing metric data.

## 18. Edge Cases
- New business with zero historical transactions displays empty state guides.

## 19. Security Considerations
- Privacy of business financial metrics.

## 20. Testing Strategy
- Visual snapshot tests and dashboard metric aggregations.

## 21. Acceptance Criteria
- Dashboard renders key KPIs within 200ms.

## 22. Implementation Steps
1. Design marketing landing pages.
2. Build onboarding flow.
3. Wire dashboard analytics API.

## 23. Troubleshooting
- Verify user onboarding status flags in DB.

## 24. Future Improvements
- AI-driven cashflow forecasting and inventory restocking predictions.
