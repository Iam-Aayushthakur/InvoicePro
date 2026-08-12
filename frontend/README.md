# InvoicePro Frontend

Next.js 14 App Router frontend application with Tailwind CSS, shadcn/ui, Zustand, TanStack Query, and offline-first IndexedDB PWA capabilities.

## Architecture

- `src/app`: Next.js App Router layout and pages (marketing, auth, dashboard, onboarding).
- `src/components`: UI primitives, forms, inputs, modals, tables, charts, cards, layout containers.
- `src/modules`: Feature domain modules (invoices, sales, inventory, customers, etc.).
- `src/lib`: API clients, Supabase wrappers, auth helpers, calculations.
- `src/offline`: IndexedDB, sync queue, conflict resolution, service worker.
- `src/stores`: Client-side state stores (Zustand).
