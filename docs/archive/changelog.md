# Changelog

## [Verified Feedback Phase 1 FE Mock] – 2026-05-22

### Added – manually verified feedback

- Added tiny `VERIFIED_FEEDBACK` fallback data in `FE/data/mockData.ts`.
- Added `getVerifiedFeedback()` in `FE/services/feedbackApi.js` with mock fallback for public feedback cards.
- Added `createAdminFeedback()` and admin feedback fallback helpers in `FE/services/adminApi.js`.
- Added simple “Manually verified feedback” cards on `FE/pages/PlantDetail.jsx` without exposing private `evidenceNote`.
- Added lightweight add-feedback form inside `FE/pages/admin/AdminMarketplace.jsx` with private evidence note kept in admin form data only.

### Guardrails

- No plant ownership code, claim plant flow, AI gating/quota, screenshot upload, `evidenceUrl`, edit/delete/moderation workflow, Zalo/Facebook API, backend implementation, or payment/order/shipping flow added.
- My Plants, Add Plant, AI Chat, and AI Diagnosis unchanged.

### Validation

- `npm run build && npm run lint` was requested but not executed because the command was denied in the terminal approval flow.

## [Care Reminder Calendar Export UX] – 2026-05-15

### Added – global calendar actions

- Added top-level “Add all to Google Calendar” and “Download all .ics” actions on `FE/pages/RemindersSettings.jsx`.
- Global export uses enabled, incomplete reminders only; disabled and completed reminders are skipped.
- Combined `.ics` export creates one calendar file containing all exportable reminder events.

### Changed – shared export helpers

- Updated `FE/services/reminderApi.js` with shared combined export helpers that reuse existing event generation logic.
- Kept per-reminder “Add to Calendar” and “Download .ics” actions.
- Calendar copy stays one-time add/export only; no OAuth, real calendar sync, backend dependency, or API contract change added.

## [Care Reminder Frontend MVP Flow] – 2026-05-15

### Added – reminder service/UI

- Completed frontend Care Reminder MVP flow with service-level mock fallback in `FE/services/reminderApi.js`.
- Added reminder CRUD helpers, mark-done helper, calendar endpoint fallback, Google Calendar URL generation, and frontend `.ics` generation.
- Updated `FE/pages/RemindersSettings.jsx` with loading/error/empty states, today/upcoming/completed grouping, mark done, enabled/disabled toggle, delete action, and MVP reminder form.
- Reminder form supports plant, reminder type, frequency, reminder time, and enabled/disabled state.

### Calendar export behavior

- Added one-time “Add to Google Calendar” CTA using a generated Google Calendar URL when backend is unavailable.
- Added “Download .ics” CTA generated on the frontend when backend calendar export is unavailable.
- Copy clarifies calendar behavior is add/export only, not automatic Google Calendar sync and no OAuth requirement.

### Guardrails

- No real email sending, browser push notification, SMS, Zalo/Messenger bot, complex scheduler, API contract change, backend code, dependency, or page redesign added.
- Email reminder remains copy-only as future backend enhancement.

### Remaining backend requirements

- Implement reminder endpoints for list, create, update, delete, mark done, and calendar event/export data when backend is ready.
- Email reminders require backend scheduler plus email provider before UI can present them as active.

## [Care Reminder MVP Scope Finalization] – 2026-05-15

### Changed – reminder scope/API docs

- Finalized Care Reminder MVP as in-app reminders plus Google Calendar / `.ics` export.
- Updated `docs/archive/mvp-scope.md`, `docs/project-overview.md`, `docs/frontend-architecture.md`, `docs/api-contract.md`, `plans/backend-plan.md`, and `docs/backend-api-checklist-for-tuan.md`.
- Added reminder endpoint expectations: list, create, update, mark done, calendar export/event data.
- Marked email reminder as optional backend enhancement if scheduler/email infrastructure is ready.
- Clarified browser notifications are not the main strategy because users may close the web app or deny permissions.

### Guardrails

- No SMS, Zalo bot, Messenger bot, mobile push, complex web push, realtime notification system, backend code, or frontend code added.
- MVP remains scope-first and calendar/export oriented.

## [Green Palette Consistency Pass] – 2026-05-15

### Changed – softer MVP greens

- Replaced harsh/neon primary green with calmer `#4CAF50` and hover `#43A047` in Tailwind runtime config.
- Normalized green UI accents across navbar, buttons, active nav states, sidebar/admin shell, hero/contact accents, AI chat/analysis, badges, cards, borders, rings, shadows, and reminder states.
- Softened green backgrounds/borders toward `#F0FDF4`, `#E8F5E9`, `#A5D6A7`, and readable text green `#2E7D32` where appropriate.
- Preserved layout, spacing, product structure, black/dark typography, and lightweight admin scope.

### Validation

- `npm run build` passed.
- `npm run lint` (`tsc --noEmit`) passed.

### Guardrails

- No redesign, dependencies, backend/API changes, or ecommerce/cart/checkout/payment/order/shipping work added.

## [Shared UI Consistency Pass] – 2026-05-15

### Added – reusable UI states

- Added `FE/components/UiState.jsx` with lightweight `LoadingState`, `EmptyState`, `StateNotice`, `Spinner`, and shared form/button class helpers.

### Changed – consistency cleanup

- Normalized loading/empty/error copy across auth, Add Plant, AI Diagnosis, AI Chat, My Plants, and Marketplace screens.
- Standardized auth form input heights, disabled states, validation notice styling, and loading button behavior.
- Improved Add Plant and My Plants mobile spacing at small widths without redesigning layouts.
- Improved AI Diagnosis upload focus visibility, remove-image button label, disabled submit state, and image validation copy.
- Reused shared notice/state components for low-risk duplicated loading/empty/error wrappers.

### Validation

- `npm run build` passed.

### Guardrails

- No new features, backend code, API contract changes, dependencies, ecommerce/cart/checkout/payment/order/shipping, charts, analytics, or large design system added.

## [Mobile Dashboard Drawer Layout Fix] – 2026-05-15

### Fixed – Mobile dashboard layout

- Changed `FE/components/UserSidebar.jsx` mobile navigation from an in-flow block into a fixed overlay drawer trigger so dashboard content keeps full mobile width.
- Changed `FE/components/AdminLayout.jsx` mobile admin navigation into the same fixed overlay pattern so admin content is not squeezed.
- Cleaned `FE/components/Navbar.jsx` mobile menu profile label to avoid duplicate/confusing user/User Dashboard wording.
- Overlay menus close on backdrop, close button, or nav link click.

### Guardrails

- Desktop sidebars remain unchanged.
- No route, API, backend, dependency, ecommerce/cart/checkout/payment/order/shipping changes.

## [Responsive Dashboard Navigation Fix] – 2026-05-15

### Changed – Mobile/tablet navigation

- Added visible mobile user dashboard navigation in `FE/components/UserSidebar.jsx` with labeled menu access for Dashboard, My Plants, Add Plant, AI Diagnosis, AI Chat, Reminder, Feedback, and Marketplace.
- Added visible mobile admin dashboard navigation in `FE/components/AdminLayout.jsx` for Admin Overview, Users, Plants, Marketplace, and AI.
- Improved `FE/components/Navbar.jsx` so ADMIN users get a clear Admin Dashboard entry on desktop and inside the mobile menu.
- Mobile menus close after selecting a navigation link and use accessible labels without adding dependencies or routes.

### Guardrails

- Desktop navigation remains unchanged in structure.
- No backend code, API contract changes, new dependencies, ecommerce/cart/checkout/payment/order/shipping flow, or major redesign added.

## [Frontend Product Polish Pass] – 2026-05-15

### Changed – MVP UX polish

- Improved `FE/pages/AIChat.jsx` chat readability, selected plant context display, empty/loading states, and mobile spacing while keeping AI answers scoped to selected plant context.
- Improved lightweight admin states in `FE/pages/admin/AdminUsers.jsx`, `FE/pages/admin/AdminPlants.jsx`, `FE/pages/admin/AdminMarketplace.jsx`, and `FE/pages/admin/AdminAI.jsx` with clearer fallback/error/empty/loading copy and intentional cards/tables.
- Clarified marketplace contact-only product cards in `FE/pages/PlantList.jsx` with price/contact CTA language and no cart/checkout/payment flow.
- Improved auth/navigation consistency in `FE/pages/Login.jsx`, `FE/pages/Register.jsx`, and `FE/components/Navbar.jsx` with stronger active states and dark-mode card polish.

### Guardrails

- No backend code, API contract changes, new dependencies, full CRUD, charts/analytics, API key editing UI, cart, checkout, payment, orders, or shipping added.

## [Backend Planning Docs Update] – 2026-05-15

### Changed – Backend roadmap

- Updated `plans/backend-plan.md` as the high-level backend roadmap aligned with `docs/api-contract.md`.
- Reconfirmed backend stack: ASP.NET Core Web API + PostgreSQL.
- Marked forgot password as optional/future.
- Reordered backend implementation around frontend priority: AI Chat + Admin integration before lower-priority/future items.
- Reconfirmed guardrails: AI key stays in backend `.env`, admin remains lightweight, marketplace remains contact-only, no cart/checkout/payment/orders/shipping.

### Added – Backend checklist for Tuan

- Added `docs/backend-api-checklist-for-tuan.md` in Vietnamese.
- Included backend stack, implementation priority, auth/role assumptions, endpoints grouped by module, request/response examples, FE status fields, AI Diagnosis, AI Chat, Admin MVP, Marketplace, out-of-scope items, and frontend mock flag notes for `VITE_USE_MOCK_AI` / `VITE_USE_MOCK_ADMIN`.

### Guardrails

- No backend code added.
- No new product features added.
- No API key editing UI/API added.

## [Phase 2 Backend Integration Prep] – 2026-05-15

### Changed – API contract

- Updated `docs/api-contract.md` with frontend mock flags: `VITE_USE_MOCK_AI` and `VITE_USE_MOCK_ADMIN`.
- Finalized plant-context AI chat request shape with `plantId`, `message`, `history`, and `plantContext`.
- Added AI dialog list response example and backend endpoint priority list for Tuan.
- Reconfirmed guardrails: backend keeps AI keys in `.env`; admin sees status/config only; marketplace remains contact-only.

### Added – Frontend services

- Added `FE/services/adminApi.js` with `getAdminSummary`, `getAdminUsers`, `getAdminUser`, `updateAdminUserStatus`, `getAdminUserPlants`, `getAdminUserPlant`, `updateAdminUserPlantStatus`, `getAdminMarketplacePlants`, `createAdminMarketplacePlant`, `updateAdminMarketplacePlant`, `deleteAdminMarketplacePlant`, `getAdminAiDialogs`, `getAdminAiDialog`, and `getAdminAiConfigStatus`.
- Extended `FE/services/aiApi.js` with `sendPlantContextChatMessage`, `getMyAiDialogs`, `getMyAiDialog`, and `getAiConfigStatus`.
- Added small colocated mock fallback data in AI/admin services. Defaults: `VITE_USE_MOCK_AI !== "false"`, `VITE_USE_MOCK_ADMIN !== "false"`.

### Changed – Service-driven UI

- Updated `FE/pages/AIChat.jsx` to send selected plant context via service functions and show loading/error/empty/fallback states.
- Updated `FE/pages/admin/AdminOverview.jsx`, `FE/pages/admin/AdminUsers.jsx`, `FE/pages/admin/AdminPlants.jsx`, `FE/pages/admin/AdminMarketplace.jsx`, and `FE/pages/admin/AdminAI.jsx` to load via `adminApi` with stable mock fallback.

### Backend endpoints Tuan needs

- `POST /ai/chat`, `GET /ai/dialogs`, `GET /ai/dialogs/:id`.
- `GET /admin/summary`.
- `GET /admin/users`, `GET /admin/users/:id`, `PUT /admin/users/:id/status`.
- `GET /admin/user-plants`, `GET /admin/user-plants/:id`, `PUT /admin/user-plants/:id/status`.
- `GET /admin/marketplace-plants`, `POST /admin/marketplace-plants`, `PUT /admin/marketplace-plants/:id`, `DELETE /admin/marketplace-plants/:id`.
- `GET /admin/ai-dialogs`, `GET /admin/ai-dialogs/:id`, `GET /admin/ai-config/status`.

### Guardrails

- No backend code, real backend connection requirement, cart, checkout, payment, orders, shipping, charts, enterprise admin dashboard, API key editing UI, or general chatbot memory system added.

## [Frontend Phase 1 UX Polish] – 2026-05-15

### Changed – AI Chat UX

- Clarified selected-plant context messaging on `/app/ai-chat`.
- Improved plant picker selected state, no-plants empty state, placeholder readability, send disabled/loading state, and mobile layout.
- Kept AI Chat as plant-care-only mock fallback; no backend integration or general-purpose chatbot added.

### Changed – Admin shell UX

- Improved `AdminLayout` navigation clarity with section hints and responsive mobile navigation.
- Added simple Admin MVP status cards only; no charts, analytics, or enterprise dashboard widgets.
- Polished skeleton admin pages so placeholders look intentional and state Phase 2 boundaries.

### Changed – Role/navigation UX

- Kept Navbar admin link ADMIN-only.
- Improved Forbidden page copy/actions so non-admin users understand the flow back to user app.

### Guardrails

- No cart, checkout, payment, orders, shipping, refund, API key editing UI, backend integration, or major redesign added.

## [Frontend Phase 1 MVP Structure] – 2026-05-15

### Added – AI Chat/Admin shell

- Added `/app/ai-chat` protected route with plant selection, placeholder chat panel, basic input, and mock fallback only.
- Added lightweight `/admin/*` route structure: overview, users, plants, marketplace, AI.
- Added `AdminRoute` role guard using existing auth context and `USER` / `ADMIN` roles.
- Added simple Forbidden page for non-admin access.
- Added minimal AdminLayout navigation only: Overview, Users, Plants, Marketplace, AI.

### Guardrails

- No real backend integration, full AI Chat logic, full Admin logic, charts, analytics, API key UI, or ecommerce flow added.
- Marketplace remains price + Zalo/Facebook contact only; cart/checkout/payment/orders/shipping/refund remain out of scope.

## [EXE201 Scope Update Docs] – 2026-05-15

### Changed – MVP scope

- Updated planning docs to include AI Chat in MVP.
- Updated planning docs to include lightweight Admin Dashboard in MVP.
- Changed backend direction from NestJS/Prisma to ASP.NET Core Web API + PostgreSQL.
- Kept marketplace simple: view plants/products, see price, contact via Zalo/Facebook.
- Kept cart, checkout, payment, orders, shipping, refund out of scope.

### Added – Planning/API direction

- Added lightweight admin scope: users, user plants, plant status, marketplace plants, AI dialog history, AI config status.
- Added AI Chat scope: select existing plant, chat using plant context, save basic dialog history.
- Added simple `USER` / `ADMIN` role expectation.
- Added admin API contract endpoints under `/admin/*`.
- Added AI dialog history endpoints.
- Added `docs/archive/frontend-adjustment-plan.md`.

### Guardrails

- Do not rebuild old large admin dashboard.
- Do not expose raw AI API keys in frontend/admin UI.
- Do not build general-purpose chatbot or complex conversation memory.
- Do not implement frontend/backend code as part of this documentation update.

## [Frontend Auth UX Stabilization] – 2026-05-15

### Changed – MVP auth UX polish

- Improved `FE/pages/Login.jsx` and `FE/pages/Register.jsx` with client-side friendly validation, accessible error alerts, disabled fields/buttons during loading, and consistent loading indicators.
- Stabilized post-auth redirect behavior so protected route intents restore after login/register while auth pages redirect authenticated users back to `/app/dashboard` safely.
- Improved `FE/context/AuthContext.jsx` session restore UX with `isBootstrapping`, incomplete-session cleanup, and friendlier auth/network error messages.
- Improved `FE/routes/ProtectedRoute.jsx` with a branded session-restoring state before redirecting unauthenticated users.
- Improved `FE/components/Navbar.jsx` auth rendering with a session skeleton, responsive truncation, logout loading indicator, and stable logout redirect.
- Improved `FE/components/UserSidebar.jsx` logout/profile rendering with stable logout redirect, loading indicator, and persisted user email display.

### Notes

- No backend implementation, refresh token, OAuth, role system, new feature, or major UI redesign added.

## [Frontend Auth Shell] – 2026-05-14

### Added – MVP auth flow

- Added `FE/context/AuthContext.jsx` with `user`, `token`, `isAuthenticated`, `isLoading`, and `error` auth state.
- Added `FE/hooks/useAuth.js` as the frontend auth hook.
- Added `FE/utils/authStorage.js` for JWT access token + minimal user profile persistence in `localStorage`.
- Added `FE/routes/ProtectedRoute.jsx` to redirect unauthenticated users to `/login` while preserving intended route.

### Changed – Auth UX/navigation

- Wrapped the app with `AuthProvider` in `FE/App.tsx`.
- Protected `/app/*` pages in `FE/routes/AppRouter.tsx`: dashboard, my plants, add plant, plant profile, AI analysis, reminders/settings, user profile.
- Updated `FE/pages/Login.jsx` and `FE/pages/Register.jsx` to use auth context, mock-ready auth responses, loading/disabled submit states, friendly errors, and post-auth redirect.
- Updated `FE/components/Navbar.jsx` and `FE/components/UserSidebar.jsx` to reflect auth state and clear auth on logout.
- Updated `FE/services/authApi.js` to keep `/auth/login` and `/auth/register` contract alignment while defaulting to temporary mock auth until backend exists.

### Validation

- `npm run build` passed.
- `npm run lint` passed.

### Backend integration TODO

- Set `VITE_USE_MOCK_AUTH=false` after backend auth endpoints exist.
- Verify real backend response matches `docs/api-contract.md`: `{ user, accessToken }` for login/register.
- Keep MVP auth as access-token-only; no refresh token/cookie session/social auth.

## [MVP Architecture Cleanup] – 2026-05-14

### Removed – Out-of-scope MVP surfaces

- Commerce/cart/checkout/payment/order references removed from active frontend code.
- Admin route/navigation/import references removed from active frontend code.
- Deprecated mock commerce/admin data removed from `FE/data/mockData.ts`.

### Changed – Routing/navigation

- `FE/routes/AppRouter.tsx` kept lean MVP routes only: landing, auth, catalog, plant detail, dashboard, my plants, add plant, plant profile, user profile, AI analysis, reminders.
- `FE/components/Navbar.jsx` no longer branches admin UX.
- `FE/pages/Home.jsx` CTA now routes to `/app/settings`; marketplace CTA is contact-oriented, not cart-oriented.
- `FE/pages/Login.jsx` no longer exposes admin demo login.

### Added – Service architecture aligned with API contract

- `FE/services/api.js` centralized API client with `VITE_API_URL`, auth header, normalized errors, `401` auth cleanup.
- `FE/services/authApi.js` for register/login/forgot-password.
- `FE/services/userApi.js` for current-user profile.
- `FE/services/plantApi.js` for catalog + my-plants CRUD.
- `FE/services/reminderApi.js` for reminders CRUD.
- `FE/services/aiApi.js` for backend-proxied AI diagnose/chat.
- `FE/services/feedbackApi.js` for visitor/user feedback.

### Changed – Mock data debt

- `FE/data/mockData.ts` reduced to MVP fallback catalog + my-plants data only.
- Removed mock orders, admin users, admin financials, admin all-plants view, cart/order types/config.
- Backend-not-ready behavior remains UI-stable via fallback data while services define API boundaries.

### Notes

- Backend still not implemented; no backend behavior was added.
- UI redesign intentionally avoided.
- Simple marketplace remains display/contact-only per `docs/api-contract.md`.
