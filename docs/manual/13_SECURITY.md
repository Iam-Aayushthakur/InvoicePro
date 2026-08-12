# InvoicePro Development Manual: 13 Security

## 1. Purpose
Document threat modeling, data protection, secret management, defense-in-depth architecture, and security hardening rules.

## 2. Business Requirements
- Protect business financial data and customer PII against unauthorized access, data leaks, and malicious attacks.
- Maintain compliance with OWASP Top 10 web security guidelines.

## 3. User Stories
- As a **Compliance Officer**, I want encrypted transport, immutable audit logging, and service role key protection.

## 4. User Flow
Incoming Traffic -> Cloudflare WAF -> HTTPS TLS 1.3 -> JWT Verification -> Rate Limiting -> RLS Isolation -> Database Query.

## 5. UI Requirements
- Automatic session timeout, secure HttpOnly cookie storage, CSP headers.

## 6. Frontend Files
- `frontend/src/lib/supabase/middleware.ts`: Secure cookie session update middleware.

## 7. Backend Files
- `backend/src/middleware/rate-limit.middleware.ts`: Rate limiting guard.
- `backend/src/middleware/auth.middleware.ts`: JWT signature validator.
- `backend/src/core/errors/index.ts`: Standardized sanitized errors.

## 8. Database Tables
- `audit_logs`: Immutable security log.

## 9. Database Relationships
- `audit_logs (N) -> (1) companies`, `audit_logs (N) -> (1) users`

## 10. API Endpoints
- `/api/v1/*` secured with rate limiting and TLS.

## 11. Request Format
- HTTPS TLS 1.3 only; plain HTTP rejected via Cloudflare redirect.

## 12. Response Format
- Headers include HSTS, CSP, X-Content-Type-Options, X-Frame-Options.

## 13. Validation Rules
- Zod input sanitization preventing SQL injection and XSS script payloads.

## 14. Authentication Requirements
- Strong password enforcement (min 8 chars, uppercase, lowercase, digit, special char).

## 15. RBAC Requirements
- Role hierarchy enforced on every write operation.

## 16. RLS Requirements
- 100% of tenant tables secured with strict RLS policies.

## 17. Error Handling
- Stack traces stripped in production environments.

## 18. Edge Cases
- Service role key leakage prevention: `SUPABASE_SERVICE_ROLE_KEY` NEVER bundled in frontend client builds.

## 19. Security Considerations
- Regular secret rotation, automated vulnerability scanning in GitHub Actions.

## 20. Testing Strategy
- Security tests (`tests/security/*`), automated vulnerability audits (`npm audit`).

## 21. Acceptance Criteria
- Zero critical or high severity security vulnerabilities.

## 22. Implementation Steps
1. Configure Cloudflare WAF and security headers.
2. Deploy RLS policies on all DB tables.
3. Establish immutable audit logging.

## 23. Troubleshooting
- Review audit log records and Cloudflare security analytics.

## 24. Future Improvements
- Hardware token MFA (WebAuthn/YubiKey) support.
