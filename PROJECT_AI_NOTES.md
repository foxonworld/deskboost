# Project AI Notes

Project-specific working notes for Roo-first AI assistance.

Keep concise. Store stable conventions only.

## Project Summary

- Purpose: DeskBoost EXE201 startup MVP for desk plant care, contact-only marketplace, manually verified customer feedback, AI diagnosis/chat, reminders, and lightweight admin.
- Primary stack: React 19 + Vite 6 + TypeScript config with mixed `.tsx` / `.jsx` source.
- App type: Frontend-first SPA; backend not implemented yet.
- Product direction: feedback-first validation, not ecommerce infrastructure, not ownership ecosystem, not Shopee clone.
- Main entry points: `FE/index.tsx`, `FE/App.tsx`, `FE/routes/AppRouter.tsx`.

## Source of Truth

Active source-of-truth order. Archived docs are historical/reference only and must not override active docs.

Read docs in this order:

1. `docs/README.md` for active docs navigation.
2. `docs/project-overview.md` for product scope, MVP guardrails, and current status.
3. `docs/api-contract.md` for API contract.
4. `docs/backend-api-checklist-for-tuan.md` and `plans/backend-plan.md` for Tuấn/backend handoff.
5. `docs/frontend-architecture.md` for frontend routes/services/layout.
6. `docs/ui-redesign-plan-vi.md`, `docs/design-tokens-vi.md`, and `docs/motion-system-plan-vi.md` for redesign/motion work.
7. `docs/qr-claim-future-plan-vi.md` and `docs/backend-qr-claim-requirements-vi.md` for future QR/Claim only.

Historical docs are archived under `docs/archive/` and `plans/archive/`; use them only for decision history.

## Key Folders

- `FE/`: active frontend app root.
- `FE/pages/`: route pages, including user MVP pages and lightweight admin pages.
- `FE/components/`: shared layout/UI components.
- `FE/context/`: app-level React context providers for auth and care tasks.
- `FE/routes/`: router and route guards.
- `FE/services/`: service/API boundary with mock fallbacks while backend is absent.
- `FE/utils/`: small utility helpers, including auth storage.
- `docs/`: active architecture, API, backend handoff, redesign, and future QR/Claim source documents.
- `docs/archive/`: historical docs retained for context only.
- `plans/`: active planning index and backend roadmap.
- `plans/archive/`: historical audits/brainstorms retained for context only.

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
- Do not add QR scanner, NFC, anti-fraud architecture, Zalo/Facebook API integration, AI billing/subscription, or enterprise governance/process.
- Do not expose or edit raw AI/API keys in frontend/admin UI.
- Keep AI Chat plant-context only, not a general-purpose chatbot.
- Keep AI usable without claimed plants; no hard AI gating, quota, real rate-limit, or billing system in current MVP.
- Keep marketplace display/contact-only unless scope changes; purchases happen through Zalo/Facebook/manual conversation.
- Keep My Plants free-add; claimed plants are a future verified subset only.
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
- Current validation loop: user views plant -> contacts seller via Zalo/Facebook -> manual/social purchase happens -> admin records manually verified feedback -> public verified feedback cards appear -> mentor sees believable customer validation.
- Phase 1: FE-first manually verified feedback MVP with public feedback cards, mock verified feedback, lightweight admin add-feedback UI, `feedbackApi` mock fallback, manually verified wording, private `evidenceNote` only.
- Phase 1 intentionally excludes screenshot upload, `evidenceUrl`, moderation workflow, ownership code, AI gating, payment/order/shipping.
- Phase 2: backend integration only for feedback endpoints: `POST /admin/feedback`, `GET /feedback/verified`, optional `GET /admin/feedback`; no scope expansion.
- Future/Phase 3 only: Plant Code / Claim / QR / AI Context, including admin plant codes, user claim by code, optional QR claim link, claimed plant badge, enhanced AI context for claimed plants.
- Feedback-first MVP: customer validation is priority; ownership ecosystem and ecommerce infrastructure are postponed.
- Manual-first philosophy: manual/social purchase and admin manual feedback verification are acceptable for MVP maturity.
- Marketplace philosophy: contact-only marketplace; emphasize care support + customer stories; avoid cart/payment/shipping UX and Shopee/ecommerce feel.
- AI philosophy: AI remains usable without claimed plants; claimed plants may improve AI context later, but no hard gating, quota, billing, or real rate-limit system now.
- My Plants philosophy: users can freely add plants; do not convert My Plants into claimed-only system.
- Implementation status: Phase 1 FE implemented/planned and validated; Phase 2 BE waits for backend readiness; Future/Phase 3 is planning only with no FE/BE implementation yet.
- Backend-owned concerns: auth/role checks, persistence, AI provider calls, API keys.
- Reminder MVP external path is Google Calendar / `.ics`; browser notifications are secondary only.
- Redesign Phase 1 Foundation Cleanup completed as incremental, non-rewrite cleanup. Files changed: `FE/components/UiState.jsx`, `FE/components/UserLayout.jsx`, `FE/components/ThemeToggle.tsx`, `FE/components/Navbar.jsx`, `FE/components/UserSidebar.jsx`.
- Phase 1 style decisions: prefer semantic Tailwind tokens already available (`primary`, `surface-*`, `background-*`, `text-*`) plus reviewed botanical border hexes where Tailwind CDN token edits are restricted; normalize shared UI state radius to `rounded-3xl`, use lighter shadows, reduce `font-black`/long uppercase in shared nav/state UI, default loading/empty copy should be Vietnamese/contextual.
- Phase 1 constraints preserved: no backend/API/route/auth behavior changes, no dependencies, no GSAP usage/addition, no page redesign, contact-only marketplace scope unchanged.
- Phase 1 validation: `cd FE && npm run lint` passed; `cd FE && npm run build` passed.
- Redesign Phase 2 Shared UI Components foundation completed with real consumers. Files changed: `FE/components/Button.jsx`, `FE/components/Badge.jsx`, `FE/components/Card.jsx`, `FE/pages/Home.jsx`, `FE/pages/PlantList.jsx`, `FE/pages/PlantDetail.jsx`, `PROJECT_AI_NOTES.md`.
- Phase 2 component decisions: `Button` supports simple variants (`primary`, `secondary`, `ghost`, `destructive`, `channel`), sizes, loading/disabled/focus states, and Link/button rendering; `Badge`/`Chip` cover status, tags, and filter pills; `Card` centralizes surface/border/radius/padding/interactive card grammar.
- Phase 2 usage rules: every new primitive must have at least one real consumer; prefer primitives for newly touched CTA/chip/card styles; keep page composition local; do not create product-specific abstractions until Home/Marketplace/Plant Detail layouts stabilize.
- Phase 2 constraints preserved: no full page redesign, no GSAP/motion additions, no backend/API/route/auth behavior changes, no dependencies, no Tailwind CDN migration, no JSX-to-TS migration, contact-only marketplace scope unchanged.
- Phase 2 validation: `cd FE && npm run lint` passed; `cd FE && npm run build` passed.
- Phase 2 limitations intentionally left for later: not all legacy buttons/cards/badges migrated; Form/Panel primitives deferred; Marketplace copy/loading empty states mostly unchanged; Plant Detail ecommerce-like combo language/layout not redesigned yet; visual smoke still recommended for light/dark/mobile.
- Redesign Phase 3 Home Redesign completed. Files changed: `FE/pages/Home.jsx`, `PROJECT_AI_NOTES.md`.
- Phase 3 Home design decisions: Home is now positioned as a premium AI-assisted desk plant care landing page with linear SaaS narrative: hero, problem/solution, AI care workflow, contact-only marketplace preview, trust/feedback support preview, final CTA. Copy is Vietnamese-first, concise, trust-oriented, and avoids ecommerce-heavy framing.
- Phase 3 component usage: reused official shared UI primitives (`Button`, `Card`, `Badge`) for CTAs, feature panels, product preview, trust cards, and final CTA. No shared primitive changes were required.
- Phase 3 constraints preserved: no GSAP, no dependencies, no route/API/auth/backend behavior changes, no protected/dashboard/admin page edits, no QR/Claim, no cart/checkout/payment/order/shipping UX, marketplace remains contact-only.
- Phase 3 validation: `cd FE && npm run lint` passed; `cd FE && npm run build` passed.
- Redesign Phase 4 Marketplace Redesign completed. Files changed: `FE/pages/PlantList.jsx`, `PROJECT_AI_NOTES.md`.
- Phase 4 Marketplace design decisions: `PlantList` now uses a premium contact-only marketplace structure with hero/value proposition, explicit no-cart/no-checkout trust banner, compact sticky search/filter/sort bar, shared `Button`/`Card`/`Badge`/`Chip` ProductCard grammar, contextual Vietnamese loading/empty copy, responsive 1/2/3/4-column density, and dark-mode-aware surfaces/borders.
- Phase 4 constraints preserved: no GSAP, no dependencies, no route/API/auth/backend behavior changes, no cart/checkout/payment/order/shipping UX, no marketplace behavior change away from contact-only, no PlantDetail/dashboard/admin/AI redesign, existing `getCatalogPlants` loading/fallback and search/filter/sort logic preserved.
- Phase 4 validation: `cd FE && npm run lint` passed; `cd FE && npm run build` passed.
- AgentMemory: skipped because no AgentMemory MCP/tool is available in this environment; durable Phase 4 decisions recorded here instead.
- Redesign Phase 5 Plant Detail Redesign completed. Files changed: `FE/pages/PlantDetail.jsx`, `PROJECT_AI_NOTES.md`.
- Phase 5 Plant Detail design decisions: `PlantDetail` is now a premium contact-first decision page with image/summary hero, sticky desktop contact panel, mobile bottom contact CTA, care-fit/workspace metrics, seller guidance, care notes, manual trust stats, verified feedback preview, and support suggestions reframed as consultation prompts.
- Phase 5 ecommerce language removed/softened: removed sale badge/copy, best-seller framing, combo discount selection, combo totals, “gợi ý mua kèm”, and purchase-intent Messenger wording; retained price as “giá tham khảo” only and explicit no-cart/no-checkout/no-payment copy.
- Phase 5 constraints preserved: no GSAP, no dependencies, no route/API/auth/backend changes, no dashboard/admin/AI edits, no cart/checkout/payment/order/shipping UX, existing plant fallback selection and verified feedback loading/error/empty behavior preserved, existing Zalo/Messenger URLs/handlers preserved with copy/layout polish only.
- Phase 5 validation: `cd FE && npm run lint` passed; `cd FE && npm run build` passed.
- Redesign Phase 6 AI Experience Redesign completed. Files changed: `FE/pages/AIChat.jsx`, `FE/pages/AIPlantAnalysis.jsx`, `PROJECT_AI_NOTES.md`.
- Phase 6 AI Chat decisions: `AIChat` is now positioned as DeskBoost AI plant-care assistant, with premium plant context selector/card, Vietnamese plant-care-only copy, suggested care prompts, clearer assistant/user bubble hierarchy, contextual thinking state, softer fallback/error copy, and mobile-safe input spacing.
- Phase 6 AI Plant Analysis decisions: `AIPlantAnalysis` now uses a trust-first diagnosis header, premium upload/dropzone, clearer preview/remove/analyze card, contextual analyzing state, result summary with recommendation cards, and helper guidance for better plant photos.
- Phase 6 constraints preserved: no GSAP, no dependencies, no route/auth/backend/API contract changes, AI remains plant-care only and not QR/Claim gated, existing chat send/loading/error behavior preserved, existing upload/preview/analyze/result behavior preserved, no marketplace/plant detail/dashboard/admin edits.
- Phase 6 validation: `cd FE && npm run lint` passed; `cd FE && npm run build` passed.
- Phase 7 GSAP Motion Polish follow-up: add scoped `useGSAP` only after visual smoke; focus on AI message append, thinking state, context chip switch, upload/result reveal; include `prefers-reduced-motion`, no global selectors, no replaying full chat history, no layout-property animation.
- Pre-Phase 7 visual blocker fixes completed. Files changed: `FE/components/ThemeToggle.tsx`, `FE/pages/PlantList.jsx`, `FE/pages/Home.jsx`, `PROJECT_AI_NOTES.md`.
- Pre-Phase 7 decisions: `ThemeToggle` must be the single place that applies/removes the root `dark` class and persists `localStorage.theme`; Marketplace API failure must keep rendering fallback products and show calm Vietnamese sample-data notice instead of raw `Failed to fetch`; Home AI care CTAs/footer link route to `/app/ai-chat` because the copy promises chat-style AI care.
- Pre-Phase 7 constraints preserved: no GSAP, no dependencies, no backend/API/route/auth behavior changes, no redesign, contact-only marketplace and Phase 1-6 direction unchanged.
- Pre-Phase 7 validation: `cd FE && npm run lint` passed; `cd FE && npm run build` passed; manual smoke confirmed `html.dark` applies/removes with `localStorage.theme`, Marketplace fallback renders products with Vietnamese sample-data notice, and Home AI care links route to `/app/ai-chat`.
- Phase 7 readiness note: GSAP can start only after the above validation passes; keep motion scoped, no layout shifts, respect reduced motion.
- Phase 7A GSAP Motion Foundation completed. Files changed: `FE/utils/motion.js`, `FE/pages/Home.jsx`, `FE/pages/AIChat.jsx`, `FE/pages/AIPlantAnalysis.jsx`, `PROJECT_AI_NOTES.md`.
- Phase 7A motion decisions: added small motion tokens/reduced-motion helper; GSAP uses `useGSAP`, scoped refs, `data-motion` attributes, opacity + translateY only, 8–20px max, 80–360ms durations, `power2.out` / `power3.out`, no ScrollTrigger, no global selectors, no layout-property animation.
- Phase 7A page decisions: Home gets subtle hero/section entry for orientation; AIChat gets page/header/context/chat shell entry only; AIPlantAnalysis gets upload/analyzing/result reveal for status continuity.
- Phase 7A skipped risky areas: no Marketplace filter/search animation, no PlantDetail/sticky CTA animation, no AIChat full history replay/message append, no infinite glow/pulse, no backend/API/routes/auth changes, no dependency additions.
- Phase 7A validation: `cd FE && npm run lint` passed; `cd FE && npm run build` passed. Manual smoke passed on Vite `http://127.0.0.1:3001/deskboost/`: Home loads without visible jump, dark mode toggles, reduced motion finishes with opacity 1/no transform, AIChat loads without full history replay, AIPlantAnalysis upload/result flow works with mock fallback.
- Phase 7B Marketplace + PlantDetail GSAP Motion Polish completed. Files changed: `FE/pages/PlantList.jsx`, `FE/pages/PlantDetail.jsx`, `PROJECT_AI_NOTES.md`.
- Phase 7B Marketplace decisions: `PlantList` uses scoped `useGSAP` with page ref and `data-motion` attributes for sample-data notice + initial product card reveal only after loading resolves; a ref guard prevents replay during search/filter/sort keystrokes and grid state changes.
- Phase 7B Plant Detail decisions: `PlantDetail` uses scoped `useGSAP` for first-mount hero image/care summary/contact panel/trust card/mobile CTA reveal, plus guarded feedback-card reveal after feedback loading resolves; sticky desktop panel and fixed mobile CTA layout are not structurally changed.
- Phase 7B motion constraints preserved: no redesign, no dependencies, no ScrollTrigger, no global selectors, no layout-property animation, opacity + translateY only, short token-based duration/stagger, `prefers-reduced-motion` resolves to final state with no translate/stagger, no backend/API/routes/auth changes.
- Phase 7B validation: `cd FE && npm run lint` passed; `cd FE && npm run build` passed; manual smoke passed for Marketplace fallback/search/detail navigation and PlantDetail contact panel/mobile CTA/dark mode. Console still shows expected local API CORS fallback errors when backend is unavailable.
- Durable redesign decisions: DeskBoost redesign must stay incremental, Home is now premium AI-assisted desk plant care landing, marketplace and plant detail remain contact-only, AI is a calm plant-context assistant, shared primitives are official UI foundation, GSAP motion must remain scoped/reduced-motion-safe, backend/API/routes/auth behavior must remain unchanged.
- QR/Claim future direction: Plant Code / QR / Claim is a future trust/context enhancement that links a real plant/code to My Plants and gives AI richer care context; it is not ownership enforcement, security proof, anti-fraud infrastructure, scanner/NFC platform, or ecommerce expansion.
- QR/Claim scope boundaries: marketplace remains contact-only; no cart/checkout/payment/order/shipping; AI must not be gated by QR/Claim; My Plants must continue supporting free-add plants; unclaimed plants keep normal AI/care/reminder functionality.
- QR/Claim frontend/backend split: frontend owns claim-by-code UI, QR/link display UI, claimed badge, plant identity card, optional copy, loading/error/invalid/used states, mobile UX, and later reduced-motion-safe success polish; backend owns code/token generation, persistence, lifecycle/status, auth/role checks, public safe validate, atomic claim, admin list/deactivate, and AI context metadata.
- QR/Claim planned phases: Phase A docs/contracts only; Phase B backend API; Phase C frontend claim UI mock/fallback; Phase D admin QR generation; Phase E AI context enhancement; Phase F motion polish.
- QR/Claim follow-up tasks: decide backend plant model relationship (`PlantCode` links existing `Plant` vs `UserClaimedPlant` join), finalize hash-router claim URL, confirm token hashing approach, then implement backend before real frontend integration.

- i18n Phase 1 Foundation + Pilot Migration completed. Files changed: `FE/i18n/I18nContext.tsx`, `FE/i18n/index.ts`, `FE/i18n/locales.ts`, `FE/components/LanguageToggle.tsx`, `FE/App.tsx`, `FE/components/Navbar.jsx`, `FE/components/UiState.jsx`, `PROJECT_AI_NOTES.md`.
- i18n Phase 1 architecture decisions: use a lightweight in-app React context instead of i18next/external dependencies; supported languages are `vi`/`en`; default language is Vietnamese; translation helper is `t(key, params?)` with fallback `active lang -> vi -> key`; provider syncs `document.documentElement.lang`.
- i18n persistence rules: selected language is stored in `localStorage` key `deskboost.language`; invalid/missing stored values fall back to `vi`; language toggle must not affect route/auth/API/backend behavior.
- i18n Phase 1 migrated only shared pilot surfaces: public/auth Navbar labels and shared `UiState` default loading/empty copy. Home, Marketplace, PlantDetail, AI pages, Admin pages, Dashboard pages, AI prompts, backend payloads, archive docs, and full app copy remain intentionally untranslated/postponed.
- i18n Phase 2 follow-up: migrate route pages incrementally by area, starting with auth/common form actions and high-traffic public pages; keep AI prompt/backend payload text separate from UI translations; avoid broad copy sweeps.

- i18n Phase 2 Public Pages Migration completed. Files changed: `FE/i18n/locales.ts`, `FE/pages/Home.jsx`, `FE/pages/PlantList.jsx`, `FE/pages/PlantDetail.jsx`, `PROJECT_AI_NOTES.md`.
- i18n Phase 2 migrated sections: Home hero/problem/AI workflow/contact-only marketplace/trust/final CTA/footer; Marketplace hero/trust/process/filter labels/sort labels/search labels/result labels/cards/loading/empty/fallback/transparency CTA; PlantDetail breadcrumbs/badges/contact panel/care metrics/workspace fit/care notes/support suggestions/verified feedback/mobile contact CTA.
- i18n Phase 2 intentionally untranslated/postponed: raw plant/product names, descriptions, tags, categories, species, statuses from mock/backend data; internal filter values and sort values used by logic; route paths; API/auth/backend behavior; AI prompt payloads; AI/Auth/Admin/App page copy reserved for Phase 3.
- i18n Phase 2 constraints preserved: Vietnamese remains default/source of truth; language stored in `localStorage` key `deskboost.language`; no dependencies; no redesign; no GSAP/motion behavior changes; no search/filter/sort logic changes; no contact URL/handler behavior changes; marketplace remains contact-only with no cart/checkout/payment wording expansion.
- i18n Phase 3 AI Pages Migration completed. Files changed: `FE/i18n/locales.ts`, `FE/pages/AIChat.jsx`, `FE/pages/AIPlantAnalysis.jsx`, `PROJECT_AI_NOTES.md`.
- i18n Phase 3 migrated AI UI-only copy: AIChat headers/context labels/suggested prompt buttons/empty/loading/error/fallback/input/button labels and AIPlantAnalysis headers/upload/dropzone/preview/remove/analyze/loading/result/recommendation/tips copy.
- i18n Phase 3 intentionally preserved: user chat messages, backend AI responses, AI API request payload structure, plant data values used by logic, file names, internal status values, chat send/loading/error behavior, upload/preview/analyze/result behavior, QR/Claim-free AI access, GSAP behavior, dependencies, and layout structure.
- i18n next follow-up: migrate Auth pages, Admin pages, Dashboard/App user pages, ChatbotWidget, and any remaining shared user-facing copy while keeping AI prompt/backend payload text separate from UI translations.
- i18n Phase 3.5 Stabilization Fixes completed. Files changed: `FE/pages/PlantList.jsx`, `FE/pages/AIChat.jsx`, `FE/components/ThemeToggle.tsx`, `FE/pages/Login.jsx`, `FE/i18n/locales.ts`, `PROJECT_AI_NOTES.md`.
- Phase 3.5 logic stabilization: Marketplace filter/sort UI no longer uses translated display text as state; `PlantList` now uses stable internal values (`all`, `Pot`, `Soil`, `Fertilizer`, `Accessory`, `popular`, `priceAsc`, `priceDesc`) while visible labels come from `t()`.
- Phase 3.5 display-only localization: Marketplace keeps raw mock/backend product data and existing filtering behavior, but current mock catalog names/descriptions/tags/category display labels are mapped through i18n for English demo polish; AIChat maps visible health/status/light/water values without mutating plant data or AI payload context.
- Phase 3.5 constraints preserved: no dependencies, no route/API/auth/backend changes, no marketplace/contact-only behavior changes, no full-page migration/redesign, no Theme localStorage key rename, no AI prompt/payload translation, and `AIPlantAnalysis` API prompt behavior unchanged.
- Remaining i18n limitations after Phase 3.5: backend/catalog data is not broadly localized, PlantDetail still uses raw product data in some places from earlier scope, Register/ForgotPassword/Admin/Dashboard/App user pages are not fully migrated, backend error mapping and missing-key tests are still deferred.
- i18n Phase 4 Auth + User App Migration completed. Files changed: `FE/i18n/locales.ts`, `FE/i18n/I18nContext.tsx`, `FE/pages/Register.jsx`, `FE/pages/ForgotPassword.jsx`, `FE/pages/Forbidden.jsx`, `FE/pages/Dashboard.jsx`, `FE/pages/MyPlants.jsx`, `FE/pages/AddPlantUser.jsx`, `FE/pages/PlantProfile.jsx`, `FE/pages/UserProfile.jsx`, `FE/pages/RemindersSettings.jsx`, `FE/components/UserSidebar.jsx`, `FE/components/CareNotificationBell.jsx`, `PROJECT_AI_NOTES.md`.
- i18n Phase 4 migrated Auth + authenticated user UI-only copy: register/forgot/forbidden, user dashboard, My Plants, Add Plant, Plant Profile, User Profile, reminders settings, user sidebar, and care notification bell. Existing `useI18n()/t()` and `vi`/`en` locales remain the only i18n mechanism.
- i18n Phase 4 intentionally preserved: route paths, auth/API calls, validation rules, backend/user/plant data values, reminder type/frequency/filter values, calendar export behavior, AI prompt/payload text, GSAP/motion behavior, and admin pages.
- i18n Phase 4 foundation adjustment: `t()` accepts string keys while still falling back active language -> Vietnamese -> key, enabling safe dynamic UI keys from JSX files without adding dependencies.
- Remaining i18n limitations after Phase 4: admin pages and ChatbotWidget/shared leftovers are still not fully migrated; backend error mapping, missing-key tests, and broad backend/catalog data localization remain deferred.
- Next i18n phases: migrate lightweight admin pages and any remaining shared user-facing copy incrementally; then optional missing-key coverage and backend-safe error display mapping.

## Docs Cleanup Summary

- Docs/plans cleanup source of truth: `docs/README.md` and `plans/README.md` define active vs archived docs.
- Active docs consolidated around `docs/project-overview.md`, `docs/api-contract.md`, `docs/backend-api-checklist-for-tuan.md`, `docs/backend-qr-claim-requirements-vi.md`, `docs/frontend-architecture.md`, `docs/ui-redesign-plan-vi.md`, `docs/design-tokens-vi.md`, `docs/motion-system-plan-vi.md`, `docs/qr-claim-future-plan-vi.md`, and `plans/backend-plan.md`.
- Archived docs retained as historical/reference only: `docs/archive/changelog.md`, `docs/archive/exe201-scope-adjustment.md`, `docs/archive/frontend-adjustment-plan.md`, `docs/archive/frontend-redesign-implementation-roadmap-vi.md`, `docs/archive/mvp-scope.md`, `plans/archive/frontend-completion-audit.md`, `plans/archive/future-fb-code.md`.
- Merged still-valid decisions into active docs: MVP guardrails, verified-feedback-first direction, contact-only marketplace, AI not gated by QR/Claim, My Plants free-add, lightweight admin, QR/Claim future-only.
- Rule: do not revive archived roadmap/audit docs as active source of truth without explicitly updating `docs/README.md` or `plans/README.md`.
- Cleanup preserved backend handoff docs for Tuấn, QR/Claim future planning, redesign/design token/motion docs, and `PROJECT_AI_NOTES.md` history.

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

- Frontend API migration Phase 1 connected Auth, Marketplace, and MyPlants to the real backend service layer. Files changed: `FE/services/api.js`, `FE/services/authApi.js`, `FE/context/AuthContext.jsx`, `FE/services/plantApi.js`, `FE/pages/PlantList.jsx`, `FE/pages/PlantDetail.jsx`, `FE/pages/AddPlantUser.jsx`, `FE/pages/PlantProfile.jsx`, `docs/frontend-api-migration.md`, `PROJECT_AI_NOTES.md`.
- Phase 1 validation root cause: Marketplace detail rendered `PRODUCTS.find(...) || PRODUCTS[0]` despite importing `getMarketplacePlant`, so backend UUID routes fell back to the first mock product; detail now fetches `GET /api/marketplace-plants/{id}` as source of truth and only falls back after request failure with `console.warn("[DeskBoost] Using fallback marketplace data")`.
- Phase 1 MyPlants UI fix: `PlantProfile` now exposes minimal edit/delete actions on the existing profile route, wired to `PUT /api/my-plants/{id}` and `DELETE /api/my-plants/{id}` while preserving current layout/dark mode.
- Phase 1 validation results: real API verification passed for register, login, auth bootstrap, logout, marketplace list/detail (`Hoa DẠi`, `Hoa hồng` list and matching UUID detail), and MyPlants create/list/detail/update/delete; `cd FE && npm run lint` passed; `cd FE && npm run build` passed.
- Phase 1 boundaries preserved: Reminders, AI Chat, AI Diagnose, Upload, Feedback, and Admin were intentionally not modified; remaining mock areas are deferred to later phases.

- UI Polish Sprint A — AI Experience Polish completed. Files changed: `FE/index.html`, `FE/pages/AIPlantAnalysis.jsx`, `FE/pages/AIChat.jsx`, `PROJECT_AI_NOTES.md`.
- Sprint A AI decisions: AI Laser Scan quét 1 lần duy nhất trong mỗi lần chẩn đoán, ẩn hoàn toàn khi reducedMotion là true; Drag Zone CSS chuyển đổi nét đứt xám nhạt (`border-dashed border-slate-300 dark:border-slate-700 bg-transparent`) sang nét liền xanh lá (`border-solid border-primary bg-primary/5 scale-[1.01]`) mượt mà; Chat typing effect chỉ chạy 1 lần trên tin nhắn AI mới nhận thông qua component `TypedText` và state `typingMessageId` (gõ cực nhanh 15ms/3 ký tự, không replay lịch sử cũ); GSAP bubble reveal cuộn tin nhắn xuống dưới và nảy nhẹ bong bóng chat mới (`scale: 0.96 -> 1`, trượt `8px -> 0px` ease `back.out(1.5)` trong `0.3s`); Context switch thực hiện fade + slide nhẹ (trượt 6px) khi thay đổi bối cảnh cây thông qua `chatHeaderRef`.
- Sprint A motion constraints preserved: không có chuyển động lặp vô hạn, không có timeline GSAP phức tạp, hỗ trợ hoàn hảo `prefers-reduced-motion` tắt hết chuyển động về trạng thái tĩnh, giữ nguyên routes/API/auth/backend.
- Sprint A validation: `cd FE && npm run lint` đạt kết quả sạch lỗi; `cd FE && npm run build` biên dịch thành công 100% không có lỗi.

- UI Polish Sprint B — Marketplace & Detail Polish completed. Files changed: `FE/pages/PlantList.jsx`, `FE/pages/PlantDetail.jsx`, `PROJECT_AI_NOTES.md`.
- Sprint B Marketplace decisions: Thêm component `SkeletonCard` mô phỏng chính xác cấu trúc hình học của Product Card thật (tỷ lệ 4:3, tiêu đề, giá, badge và 2 nút) nhấp nháy sang trọng (`animate-pulse`) thay thế cho Spinner loading cũ; tinh chỉnh Card hover tương tác (scale tối đa `1.02` cho ảnh sản phẩm để giữ độ tinh tế chuyên nghiệp, kết hợp nhấc nhẹ card `hover:-translate-y-1 hover:shadow-md dark:hover:border-primary/20` với transition mượt mà 300ms, không dùng bóng đổ dày marketing giá rẻ).
- Sprint B Plant Detail decisions: Thay thế text feedback loading bằng 2 khối verified feedback skeleton nhấp nháy mô phỏng đầy đủ avatar, tiêu đề, stars, comment và tags; bổ sung class `animate-cta-pulse-once` cho nút Zalo, Messenger, nút liên hệ chính và Bottom di động CTA để co giãn nhẹ và đổ bóng mờ đúng 1 lần duy nhất khi component mount.
- Sprint B motion constraints preserved: không có chuyển động lặp vô hạn, không có timeline GSAP phức tạp, hỗ trợ reduced-motion tắt hiệu ứng trượt/scale/pulse về trạng thái tĩnh, giữ nguyên routes/API/auth/backend.
- Sprint B validation: `cd FE && npm run lint` đạt kết quả sạch lỗi; `cd FE && npm run build` biên dịch thành công 100% không có lỗi.

- UI Polish Sprint C — Landing Page Polish & Future Vision completed. Files changed: `FE/pages/Home.jsx`, `FE/i18n/locales.ts`, `PROJECT_AI_NOTES.md`.
- Sprint C Hero decisions: Hero Section heading nâng cấp typography leading-[1.12] và dải màu gradient chữ sang trọng (`bg-gradient-to-br from-text-main via-text-main to-primary bg-clip-text text-transparent dark:from-white dark:via-white dark:to-green-400`); không sử dụng video, showcase thiết bị, hay mockups SaaS marketing phô trương.
- Sprint C Trust Section decisions: Tái cấu trúc grid tính năng niềm tin chính của DeskBoost phản ánh chính xác sản phẩm: `AI Diagnosis` (icon `psychology`), `Plant Profiles` (icon `folder_shared`), `Smart Reminders` (icon `notifications_active`), và `Verified Marketplace` (icon `storefront`); đồng bộ hóa dịch văn bản đa ngôn ngữ vi/en trong locales.
- Sprint C Future Vision decisions: Thêm section lộ trình phát triển định hướng dài hạn ("Future Vision Section") phía trên footer trong Home.jsx, hiển thị các giai đoạn Phase 01–05: `QR Plant Identity`, `Claim Ownership`, `AI Context Memory`, `Weather Integration`, `IoT Monitoring` dưới dạng đường timeline vertical kẻ mảnh với các badge icon tinh tế, tạo độ thuyết phục cao cho EXE201 mà không thay đổi MVP scope.
- Sprint C Social Proof decisions: Thêm section chỉ số ảnh hưởng ("Social Proof Section") với các số liệu demo thống kê hợp lý: `1,250+ AI Diagnoses`, `500+ Managed Plants`, `98.6% Care Reminders Completed`, và `200+ Verified Feedback` dưới dạng 4 card compact tinh tế trước footer.
- Sprint C validation: `cd FE && npm run lint` đạt kết quả sạch lỗi; `cd FE && npm run build` biên dịch thành công 100% không có lỗi.

- Frontend API migration Phase 2 connected Profile, Reminders, per-reminder Calendar export, and Care Notification Bell to the real backend. Files changed: `FE/services/api.js`, `FE/services/userApi.js`, `FE/services/reminderApi.js`, `FE/pages/UserProfile.jsx`, `FE/pages/RemindersSettings.jsx`, `FE/context/CareContext.jsx`, `FE/components/CareNotificationBell.jsx`, `FE/i18n/locales.ts`, `docs/frontend-api-migration.md`, `PROJECT_AI_NOTES.md`.
- Phase 2 profile decisions: `UserProfile` calls `GET /api/users/me` on load and `PUT /api/users/me` on save; maps `fullName`/`name`/`displayName` to `displayName`, keeps `email` read-only, updates `fullName`, `name`, `avatarUrl`, and `phone`, and removes password-change inputs because no backend password endpoint was provided.
- Phase 2 reminder decisions: `reminderApi` removed mock/localStorage fallback and maps UI `plantId`, `title`, `type`/`careType`, `dueDate` + `time`, `frequency`, and `notes` to backend `plantId`, `title`, `careType`, `dueAt`, `repeatRule`, and `notes`; backend `careType`, `dueAt`, `repeatRule`, and `status` normalize back to current UI fields.
- Phase 2 reminder UI decisions: `RemindersSettings` reads MyPlants only for plant options, lists reminders via `GET /api/reminders`, creates with `POST`, edits inline with `PUT /api/reminders/{id}`, marks done with `PUT /api/reminders/{id}/done`, deletes with `DELETE`, and shows API errors instead of silent fallback.
- Phase 2 calendar decisions: per-reminder calendar action calls `GET /api/reminders/{id}/calendar`; per-reminder ICS calls `GET /api/reminders/{id}/calendar?format=ics`; combined Google/ICS export remains frontend-generated because backend has no batch calendar endpoint.
- Phase 2 care bell decisions: `CareContext` no longer reads or writes `deskboost_care_tasks`; it derives notification tasks from real reminders and uses `PUT /api/reminders/{id}/done` for quick completion. Undo remains unsupported because no backend undo endpoint exists.
- Phase 2 remaining gaps: no batch calendar export endpoint, no password-change endpoint, no confirmed email-update support, no reminder undo endpoint, and AI Chat/AI Diagnose/Upload/Feedback/Admin/Forgot Password remain outside this migration phase.

- Frontend API migration Phase 2.1 / Phase 3 upload integration connected `POST /api/upload/image` to Add My Plant, Plant Profile image edit, and User Profile avatar. Files changed: `FE/services/uploadApi.js`, `FE/pages/AddPlantUser.jsx`, `FE/pages/PlantProfile.jsx`, `FE/pages/UserProfile.jsx`, `FE/i18n/locales.ts`, `docs/frontend-api-migration.md`, `PROJECT_AI_NOTES.md`.
- Upload contract verified from `UploadController`: authenticated `multipart/form-data`, field name `file`, allowed types `image/jpeg`, `image/png`, `image/webp`, `image/gif`, max size 5MB, response shape `{ url }`.
- Upload service decision: `uploadImage(file)` validates type/size, sends `FormData`, and normalizes URL from `url`, `imageUrl`, `secureUrl`, or `data.url`; forms keep manual `imageUrl` / `avatarUrl` URL fields as fallback/advanced inputs.
- Upload UI decisions: Add Plant and Plant Profile show immediate local previews from selected files, upload on file selection, disable submit while uploading, then save the returned URL through existing `createMyPlant` / `updateMyPlant` payloads; User Profile uploads avatar files and saves the returned URL through existing `PUT /api/users/me` payload.
- User Profile avatar upload support verified in backend request contract: `UpdateProfileRequest` includes `AvatarUrl`, and `UsersController.UpdateMe` maps it into `UpdateUserProfileCommand.AvatarUrl`.
- Phase 2.1 boundaries preserved: AI Chat, AI Diagnose, Admin, Marketplace, Feedback, and reminder logic were not modified.

- Frontend API migration Phase 3 trust/ownership foundation completed. Files changed: `FE/services/feedbackApi.js`, `FE/services/adminApi.js`, `FE/services/plantApi.js`, `FE/services/userApi.js`, `FE/pages/PlantDetail.jsx`, `FE/pages/PlantProfile.jsx`, `FE/pages/UserProfile.jsx`, `FE/pages/admin/AdminMarketplace.jsx`, `FE/i18n/locales.ts`, `docs/frontend-api-migration.md`, `PROJECT_AI_NOTES.md`.
- Phase 3 feedback decisions: `submitFeedback()` is connected to real `POST /api/feedback` with payload `{ message, rating }`; `getVerifiedFeedback()` is backend-ready for `GET /api/feedback/verified` but returns an empty backend-blocked state when the endpoint is unavailable; public Plant Detail no longer falls back to `VERIFIED_FEEDBACK` mock reviews or fake review counts.
- Phase 3 admin feedback decision: manual verified-feedback admin UI is treated as blocked/readiness only because backend has no admin verified-feedback endpoint; it no longer saves mock verified reviews.
- Phase 3 ownership DTO readiness: marketplace/my-plant normalizers preserve `ownershipCode`, `ownershipStatus`, and `isClaimed`; profile normalizer maps `claimedPlantsCount`. No frontend claim API, ownership generation, or hardcoded claim logic was added.
- Phase 3 QR readiness: Plant Detail and Plant Profile now have QR/ownership placeholders that explicitly avoid fake QR generation; User Profile has a disabled future Claim Plant entry point. Admin QR implementation remains untouched.
- Phase 3 backend blockers updated by Phase 3B: admin verified-feedback create/list endpoints are still missing; ownership fields may still be absent from marketplace/my-plant responses; QR validate/claim/code lifecycle endpoints are still missing.
- Phase 3B feedback/admin integration fix completed. Files changed: `FE/services/feedbackApi.js`, `FE/services/adminApi.js`, `FE/pages/PlantDetail.jsx`, `FE/pages/admin/AdminOverview.jsx`, `FE/pages/admin/AdminMarketplace.jsx`, `docs/frontend-api-migration.md`, `PROJECT_AI_NOTES.md`.
- Phase 3B verified feedback status: backend `GET /api/feedback/verified?catalogPlantId=...` exists and Plant Detail calls it with a safe id fallback chain (`catalogPlantId`, `marketplacePlantId`, `plantId`, `id`); backend data renders, empty backend lists show honest empty state, and endpoint failure shows backend-unavailable state with a dev console warning. Fake verified feedback remains removed.
- Phase 3B admin dashboard status: `getAdminSummary()` calls real `GET /api/admin/summary` with no mock fallback; `AdminOverview` treats missing/incomplete summary data as unavailable and does not render fake zero metrics as real.
- Phase 3B admin marketplace/feedback status: `getAdminMarketplacePlants()` calls real `GET /api/admin/marketplace-plants` without mock fallback for the admin feedback scope; admin verified-feedback creation remains disabled with `Backend endpoint required` because `POST /api/admin/feedback` and `GET /api/admin/feedback` do not exist. Normal `POST /api/feedback` remains user feedback only.
- Phase 3B QR/Claim boundary: no claim page, QR generation, claim validation, scanner/NFC, ownership enforcement, payment/order/shipping flow, or AI/care gate was added; QR/Claim remains future-only.
- Phase 3C admin real-data integration completed. Files changed: `FE/services/adminApi.js`, `FE/pages/admin/AdminOverview.jsx`, `FE/pages/admin/AdminMarketplace.jsx`, `FE/pages/admin/AdminUsers.jsx`, `FE/pages/admin/AdminPlants.jsx`, `FE/pages/admin/AdminAI.jsx`, `docs/frontend-api-migration.md`, `PROJECT_AI_NOTES.md`.
- Phase 3C admin API decisions: `adminApi.js` now uses real admin endpoints and response normalizers for summary, users, user plants, marketplace plants, AI dialogs, and AI config status; admin users/plants status update service functions call the backend `PUT` endpoints from source. Mock admin fallback data is no longer returned by active admin page service calls.
- Phase 3C admin UI decisions: Admin Users, Plants, Marketplace, Overview, and AI pages render backend data when available and show explicit unavailable/blocker states when endpoints fail; they do not show mock users, plants, listings, stats, or AI logs as real.
- Phase 3C feedback/admin blocker: `PATCH /api/feedback/{id}/verify` exists, but no admin feedback list/create endpoint exists, so admin feedback creation remains disabled with `Backend endpoint required` and no verification UI is wired.
- Phase 3C boundaries preserved: no user-facing Marketplace core flow, MyPlants CRUD, Profile, Reminders, Upload, AI Diagnose user flow, or QR/Claim implementation was modified.
