# InvoicePro Development Manual: 07 Frontend Architecture

## 1. Purpose
Define the Next.js 14 App Router architecture, UI component hierarchy, state management stores, route protection, and PWA capabilities.

## 2. Business Requirements
- Performant, accessible, and responsive user interface across desktop, tablet, and mobile devices.
- Seamless authentication handling and permission-gated navigation elements.

## 3. User Stories
- As a **User**, I want smooth transitions, optimistic UI updates, and clear access restriction notices when navigating the platform.

## 4. User Flow
Browser -> Next.js Middleware -> Client Routing -> Zustand Store -> React Component -> API Client.

## 5. UI Requirements
- Dark mode default with Tailwind CSS tokens and shadcn/ui components.

## 6. Frontend Files
- `frontend/src/app/*`: Next.js App Router routes and pages.
- `frontend/src/components/*`: Shared UI component primitives.
- `frontend/src/modules/*`: Feature domain modules.
- `frontend/src/stores/auth.store.ts`: Auth & tenant state.
- `frontend/src/lib/permissions/index.ts`: Client `can()` evaluator.

## 7. Backend Files
- Consumes REST API endpoints from `backend/src/routes/v1/*`.

## 8. Database Tables
- Indirect database access via REST API endpoints.

## 9. Database Relationships
- Entities represented as TypeScript interfaces in `frontend/src/types/*`.

## 10. API Endpoints
- `/api/v1/*` endpoint invocation via `frontend/src/services/*`.

## 11. Request Format
- HTTP REST JSON requests with Bearer JWT tokens.

## 12. Response Format
- Generic `ApiResponse<T>` envelope.

## 13. Validation Rules
- Real-time client form validation via React Hook Form and Zod.

## 14. Authentication Requirements
- Guarded by Next.js Edge `middleware.ts`.

## 15. RBAC Requirements
- UI buttons and routes hidden or disabled based on `can(user, permission)`.

## 16. RLS Requirements
- Enforced on database query execution behind API.

## 17. Error Handling
- Boundary error fallback components (`app/error.tsx`, `app/not-found.tsx`).

## 18. Edge Cases
- Offline status detection via `useOffline()` hook.

## 19. Security Considerations
- Anti-XSS sanitization and Content Security Policy (CSP).

## 20. Testing Strategy
- Component unit tests and Playwright E2E tests (`frontend/tests/`).

## 21. Acceptance Criteria
- UI loads within 300ms; protected routes redirect unauthenticated users to `/login`.

## 22. Implementation Steps
1. Build Zustand stores.
2. Build layout components and navigation drawers.
3. Connect service API clients.

## 23. Troubleshooting
- Inspect React DevTools and Zustand state logs.

## 24. Future Improvements
- Micro-frontend architecture for enterprise module extensions.
