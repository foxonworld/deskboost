# Project AI Notes

Project-specific working notes for Roo-first AI assistance.

Keep concise. Store stable conventions only.

## Project Summary

- Purpose: DeskBoost MVP for desk plant marketplace, user plant care, AI diagnosis/chat, reminders, and lightweight admin.
- Primary stack: React 19 + Vite 6 + TypeScript config with mixed `.tsx` / `.jsx` source.
- App type: Frontend-first SPA; backend not implemented yet.
- Main entry points: `FE/index.tsx`, `FE/App.tsx`, `FE/routes/AppRouter.tsx`.

## Key Folders

- `FE/`: active frontend app root.
- `FE/pages/`: route pages, including user MVP pages and lightweight admin pages.
- `FE/components/`: shared layout/UI components.
- `FE/context/`: app-level React context providers for auth and care tasks.
- `FE/routes/`: router and route guards.
- `FE/services/`: service/API boundary with mock fallbacks while backend is absent.
- `FE/utils/`: small utility helpers, including auth storage.
- `docs/`: architecture, scope, API contract, and planning source documents.
- `plans/`: planning/audit notes.

## Commands

- Install: `cd FE && npm install`
- Dev: `cd FE && npm run dev`
- Lint/typecheck: `cd FE && npm run lint`
- Typecheck: `cd FE && npm run lint`
- Unit tests: none configured.
- E2E/smoke: none configured; use manual route smoke.
- Build: `cd FE && npm run build`

## Local Conventions

- Component style: React function components; mixed JS/TS; pages commonly `.jsx`, entry/router/theme pieces `.tsx`.
- Routing: React Router DOM v7 with `HashRouter`; route definitions centralized in `FE/routes/AppRouter.tsx`.
- Route guards: use `ProtectedRoute` for `/app/*`; use `AdminRoute` for `/admin/*`; admin role is simple `ADMIN`.
- State/data patterns: global auth via `AuthContext`; care notification/tasks via `CareContext`; otherwise local component state.
- API pattern: keep fetch details in `FE/services/api.js`; feature services wrap endpoint calls and may expose mock fallback until backend exists.
- Backend target: ASP.NET Core Web API + PostgreSQL, REST/JSON, JWT bearer auth, base path `/api/v1`.
- Auth storage: token/user in `localStorage`; keep refresh-token/session complexity out of MVP unless backend requires it.
- Styling approach: Tailwind CDN configured in `FE/index.html`; use Manrope, Material Symbols, green primary `#4CAF50`, dark mode via `.dark` class.
- UI states: prefer `FE/components/UiState.jsx` helpers (`Spinner`, `StateNotice`, `LoadingState`, `EmptyState`) when fitting nearby code.
- Error/loading/empty-state pattern: service-backed pages usually show loading, warning/error notice, empty state, and mock-fallback note where relevant.
- Accessibility expectations: semantic labels/roles where already patterned; preserve keyboard/focus behavior for forms/navigation.
- Naming/import conventions: relative imports inside `FE`; `@/*` alias exists but current source mostly uses relative paths.

## Edit Guardrails

- Prefer minimal diffs.
- Reuse existing components/utilities.
- Preserve current architecture.
- Avoid dependency additions without approval.
- Avoid broad rewrites during feature work or debugging.

Project-specific guardrails:

- Do not rebuild old enterprise admin dashboard; keep admin lightweight.
- Do not add cart, checkout, payment, orders, shipping, refunds, or enterprise commerce flows.
- Do not expose or edit raw AI/API keys in frontend/admin UI.
- Keep AI Chat plant-context only, not a general-purpose chatbot.
- Keep marketplace display/contact-only unless scope changes.
- Keep role model simple: `USER` / `ADMIN`.
- Confirm before changing Vite/Tailwind/router/auth architecture or adding dependencies.

## Verification Notes

Smallest useful checks for most changes:

1. `cd FE && npm run lint`
2. `cd FE && npm run build`
3. Manual smoke affected route in Vite dev server; include auth/admin logged-out and role-guard path when relevant.

If checks are skipped, record reason and residual risk.

## Durable Decisions

Use ADRs for larger decisions. Keep short notes here for small stable conventions.

- Frontend remains the active MVP implementation; backend is planned but absent.
- Backend-owned concerns: auth/role checks, persistence, AI provider calls, API keys.
- Reminder MVP external path is Google Calendar / `.ics`; browser notifications are secondary only.

## Memory Hygiene

Safe to remember:

- stable architecture/conventions
- repeated bug patterns
- durable decisions

Do not remember:

- secrets
- raw logs
- large diffs
- temporary failures
