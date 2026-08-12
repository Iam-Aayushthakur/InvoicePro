# InvoicePro Development Manual: 11 Authentication

## 1. Purpose
Define the complete authentication life cycle, Supabase Auth JWT identity verification, session management, password reset flows, and multi-factor authentication (MFA) design.

## 2. Business Requirements
- Secure authentication flow supporting user registration, email verification, login, logout, password recovery, and active session refreshes.
- Strict session validation protecting tenant resources against unauthenticated access.

## 3. User Stories
- As a **User**, I want to log in securely with email/password or SSO and remain authenticated across page reloads.
- As a **Security Officer**, I want JWT signatures verified on every API call and invalid/expired tokens rejected instantly.

## 4. User Flow
User Inputs Credentials -> Supabase Auth API -> JWT Access Token Issued -> Stored in HttpOnly Cookie / Authorization Header -> Worker Validates JWT -> Session Active.

## 5. UI Requirements
- Clean, responsive login and registration forms with client-side input validation and error alerts.

## 6. Frontend Files
- `frontend/src/middleware.ts`: Route guard middleware for protected paths.
- `frontend/src/stores/auth.store.ts`: Zustand authentication state store.
- `frontend/src/app/(auth)/*`: Auth page routes (Login, Register, Forgot Password, Reset Password, Verify Email, MFA).

## 7. Backend Files
- `backend/src/middleware/auth.middleware.ts`: JWT signature verification middleware.
- `backend/src/controllers/auth/index.ts`: Auth registration and identity API controller.
- `backend/src/routes/v1/auth.routes.ts`: REST endpoint routes (`/api/v1/auth/*`).

## 8. Database Tables
- `auth.users` (Supabase Auth identities), `public.users` (Application profiles), `public.company_members`.

## 9. Database Relationships
- `auth.users (1) -> (1) public.users (1) -> (N) company_members`.

## 10. API Endpoints
- `POST /api/v1/auth/register`: Register user & tenant company.
- `GET /api/v1/auth/me`: Get current authenticated user context.

## 11. Request Format
- HTTP Bearer token header: `Authorization: Bearer <jwt_access_token>`.

## 12. Response Format
- JSON payload containing user identity, active company ID, role, and permission array.

## 13. Validation Rules
- Email format validation, password length >= 8 characters.

## 14. Authentication Requirements
- Supabase Auth JWKS public key verification on Worker edge.

## 15. RBAC Requirements
- Role and permissions attached to authenticated session context.

## 16. RLS Requirements
- `auth.uid()` evaluated in PostgreSQL RLS helper functions (`is_company_member`).

## 17. Error Handling
- 401 Unauthorized returned for missing, invalid, or expired JWT tokens.

## 18. Edge Cases
- Token expiration during active session -> Silent refresh attempt or redirect to `/login?redirect=...`.

## 19. Security Considerations
- `SUPABASE_SERVICE_ROLE_KEY` strictly hidden from browser bundle.

## 20. Testing Strategy
- Unit and integration tests in `tests/auth/auth.test.ts`.

## 21. Acceptance Criteria
- 100% of protected routes block unauthenticated access.

## 22. Implementation Steps
1. Configure Supabase Auth client & server wrappers.
2. Implement Worker `auth.middleware.ts`.
3. Create Next.js `middleware.ts` route protection.

## 23. Troubleshooting
- Inspect JWT token expiration (`exp` claim) and Supabase Auth logs.

## 24. Future Improvements
- Passkey / WebAuthn passwordless authentication integration.
