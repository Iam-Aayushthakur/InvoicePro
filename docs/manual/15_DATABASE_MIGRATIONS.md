# InvoicePro Development Manual: 15 Database Migrations

## 1. Purpose
Define database migration standards, version control rules, execution ordering, rollback procedures, and local development workflows.

## 2. Business Requirements
- Zero-downtime database schema updates and backwards-compatible migration scripts.

## 3. User Stories
- As a **DevOps Engineer**, I want sequential, deterministic migration scripts so that staging and production databases stay 100% synchronized.

## 4. User Flow
Create Migration SQL -> Local Test via Supabase CLI -> PR Review -> CI Pipeline Run -> Production Deployment.

## 5. UI Requirements
- N/A (Backend Infrastructure).

## 6. Frontend Files
- `frontend/src/types/*`: Updated interface definitions reflecting DB changes.

## 7. Backend Files
- `backend/src/database/supabase/types.ts`: Auto-generated TypeScript database types.

## 8. Database Tables
- All 27 core database tables versioned under `supabase/migrations/*.sql`.

## 9. Database Relationships
- Dependency order enforced via migration file prefixes (`001` to `028`).

## 10. API Endpoints
- N/A (Database Layer).

## 11. Request Format
- SQL DDL statements (`CREATE TABLE`, `ALTER TABLE`, `CREATE INDEX`, `CREATE POLICY`).

## 12. Response Format
- Command execution completion status.

## 13. Validation Rules
- Migration files must be strictly idempotent (`IF NOT EXISTS`, `OR REPLACE`).

## 14. Authentication Requirements
- Migration execution requires DB admin / service role credentials.

## 15. RBAC Requirements
- N/A.

## 16. RLS Requirements
- RLS enabled in migration `028_rls_policies.sql`.

## 17. Error Handling
- Transactional migration rollback on syntax or constraint failures.

## 18. Edge Cases
- Adding NOT NULL columns to existing populated tables requires default values or multi-step backfills.

## 19. Security Considerations
- Database backup snapshot taken before applying production migrations.

## 20. Testing Strategy
- Automated migration dry run testing in GitHub Actions workflow (`.github/workflows/database.yml`).

## 21. Acceptance Criteria
- `supabase db reset` executes cleanly from `001` through `028` without errors.

## 22. Implementation Steps
1. Write SQL migration file under `supabase/migrations/XXX_name.sql`.
2. Run `npx supabase db reset` locally to test full sequence.
3. Update `backend/src/database/supabase/types.ts`.

## 23. Troubleshooting
- Run `npx supabase db lint` to detect syntax issues.

## 24. Future Improvements
- Automated zero-downtime column migration helpers.
