# Changelog

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
- Added `docs/frontend-adjustment-plan.md`.

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
