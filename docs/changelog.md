# Changelog

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
