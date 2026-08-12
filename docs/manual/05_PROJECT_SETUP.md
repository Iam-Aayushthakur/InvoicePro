# InvoicePro Development Manual: 05 Project Setup

## 1. Purpose
Guide developers through local environment installation, prerequisite configuration, and workspace bootstrap scripts.

## 2. Business Requirements
- Reproducible, single-command setup process for onboarding new engineers.

## 3. User Stories
- As a **New Contributor**, I want to clone the repo, run `./scripts/setup.sh`, and have a working local environment.

## 4. User Flow
Clone Repository -> Run Setup Script -> Create `.env` files -> Launch Dev Server.

## 5. UI Requirements
- Local dev server accessibility at `http://localhost:3000` (Frontend) and `http://localhost:8787` (Backend Worker).

## 6. Frontend Files
- `frontend/.env.local`: Local environment variable overrides.
- `scripts/setup.sh`: Unix bootstrap script.
- `scripts/setup.ps1`: Windows PowerShell bootstrap script.

## 7. Backend Files
- `backend/.dev.vars`: Local Cloudflare Worker secret variables.

## 8. Database Tables
- Supabase local CLI database setup via `supabase db dev`.

## 9. Database Relationships
- Migrations executed sequentially from `supabase/migrations/*.sql`.

## 10. API Endpoints
- `GET http://localhost:8787/health`: Local health check endpoint.

## 11. Request Format
- HTTP REST request tools (Postman, Bruno, curl).

## 12. Response Format
- JSON response payload.

## 13. Validation Rules
- Required node version 20+, npm 10+.

## 14. Authentication Requirements
- Supabase local anon and service keys configured in `.env`.

## 15. RBAC Requirements
- Local admin account seeded via `supabase/seed/demo-data.sql`.

## 16. RLS Requirements
- Local Supabase instance enforces RLS policies.

## 17. Error Handling
- Helpful error messages in setup scripts for missing CLI prerequisites.

## 18. Edge Cases
- Windows execution policy restrictions for PowerShell scripts.

## 19. Security Considerations
- `.env` files added to `.gitignore` to prevent secret leaks.

## 20. Testing Strategy
- Run `npm test` or `./scripts/test.sh` after setup.

## 21. Acceptance Criteria
- Both frontend and backend start cleanly without execution errors.

## 22. Implementation Steps
1. Create `.env.example` templates.
2. Write `scripts/setup.sh` and `scripts/setup.ps1`.
3. Test setup process on fresh environment.

## 23. Troubleshooting
- Run `npm cache clean --force` or restart local Docker daemon for Supabase CLI.

## 24. Future Improvements
- Docker Compose dev setup alternative.
