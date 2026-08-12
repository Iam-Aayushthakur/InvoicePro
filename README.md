# InvoicePro - Multi-Tenant Business Management & GST Invoicing SaaS

An enterprise-grade, multi-tenant Business Management + GST Invoicing SaaS platform built for high concurrency, offline-first reliability, and seamless compliance.

## Technology Stack

- **Frontend**: Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui, Zustand, TanStack Query, React Hook Form, Zod, Recharts, PWA / Offline-First.
- **Backend**: Cloudflare Workers, TypeScript, REST API v1, Supabase Edge Functions.
- **Database**: PostgreSQL (Supabase), Row-Level Security (RLS) for tenant isolation, UUID PKs, FK constraints.
- **Authentication**: Supabase Auth, JWT, RBAC, MFA-ready.
- **Payments**: Razorpay & Stripe integration with webhooks and subscription lifecycle management.
- **Infrastructure**: Cloudflare Pages, Cloudflare Workers, Cloudflare DNS & CDN, GitHub Actions CI/CD.

## Workspace Directory Structure

```
InvoicePro/
├── frontend/         # Next.js App Router frontend application
├── backend/          # Cloudflare Workers API backend service
├── supabase/         # Database migrations, seed data, and Edge Functions
├── infrastructure/   # Cloudflare routing, monitoring, & CI/CD deployment configs
├── docs/             # Comprehensive system, API, database, and security docs
├── scripts/          # Automation scripts (setup, build, migrate, seed, etc.)
├── tests/            # E2E, security, API, and database test suites
├── .github/          # GitHub CI/CD workflows and issue templates
└── src/              # Standalone legacy/reference modules (preserved)
```

## Getting Started

1. Copy `.env.example` to `.env` in `frontend/` and `backend/`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run setup scripts:
   ```bash
   ./scripts/setup.sh
   ```
4. Start development servers:
   ```bash
   ./scripts/dev.sh
   ```
