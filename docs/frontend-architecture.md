# DeskBoost – Frontend Architecture

> Current frontend source of truth · React 19 + Vite 6 · updated for AI Chat + lightweight Admin MVP readiness

---

## Current Status

- Frontend is implemented with React 19 + Vite 6.
- Routing uses React Router DOM v7 with `HashRouter`.
- User MVP routes exist.
- AI Diagnosis exists and uses the AI service boundary with mock fallback.
- AI Chat route/page exists and uses plant-context service helpers.
- Lightweight Admin dashboard/routes exist and use admin service helpers with mock fallback.
- Backend is not implemented yet.
- Backend direction is ASP.NET Core Web API + PostgreSQL.

---

## Current App Shell

`App.tsx` wraps:

```txt
HashRouter
└── AuthProvider
    └── CareProvider
        └── AppRouter
```

Global helpers:

- `FloatingHomeButton`
- `ThemeToggle`

---

## Current Routes

Public:

```txt
/                -> Home
/plants          -> PlantList
/plants/:plantId -> PlantDetail
/login           -> Login
/register        -> Register
/forgot-password -> ForgotPassword
```

Protected user:

```txt
/app/dashboard              -> Dashboard
/app/my-plants              -> MyPlants
/app/my-plants/:id/profile  -> PlantProfile
/app/add-plant              -> AddPlantUser
/app/profile                -> UserProfile
/app/ai-analysis            -> AIPlantAnalysis
/app/settings               -> RemindersSettings
```

---

## Implemented Route Additions

User:

```txt
/app/ai-chat -> AIChat
```

Admin:

```txt
/admin             -> AdminOverview
/admin/users       -> AdminUsers
/admin/plants      -> AdminPlants
/admin/marketplace -> AdminMarketplace
/admin/ai          -> AdminAI
```

Admin routes are guarded by authentication + `ADMIN` role. Role logic stays simple for MVP.

---

## Current Navigation

`Navbar.jsx`:

- `/`
- `/plants`
- `/login` when logged out
- `/app/profile` when logged in
- logout when logged in
- care notification bell when logged in

`UserSidebar.jsx`:

- `/app/dashboard`
- `/app/my-plants`
- `/app/ai-analysis`
- `/app/profile`
- `/app/settings`

Current nav readiness:

- `/app/ai-chat` is in user dashboard navigation.
- Admin entry is visible only for `ADMIN` users.
- Lightweight admin sidebar/layout is implemented.
- Ecommerce nav remains out of scope.

---

## Auth Architecture

Current files:

- `FE/context/AuthContext.jsx`
- `FE/hooks/useAuth.js`
- `FE/routes/ProtectedRoute.jsx`
- `FE/utils/authStorage.js`
- `FE/services/authApi.js`

Current behavior:

- Token + user stored in `localStorage`.
- Mock auth enabled by default.
- Protected route redirects unauthenticated users.

Needed:

- User object should include simple `role: "USER" | "ADMIN"` after backend integration.
- Add `AdminRoute` or extend guard for `ADMIN` routes.
- Keep no refresh-token/session-complexity for MVP unless backend already requires it.

---

## Services Layer

Current services:

| File             | Current responsibility                       |
| ---------------- | -------------------------------------------- |
| `api.js`         | Base fetch, auth header, JSON/error handling |
| `authApi.js`     | register/login/forgot password               |
| `userApi.js`     | current user profile                         |
| `plantApi.js`    | public catalog + my-plants CRUD              |
| `reminderApi.js` | reminder CRUD                                |
| `aiApi.js`       | AI diagnose/chat helpers                     |
| `feedbackApi.js` | feedback submission                          |

Readiness notes:

| File          | Current readiness                                               |
| ------------- | --------------------------------------------------------------- |
| `api.js`      | Hardened JSON/non-JSON/error response parsing                  |
| `aiApi.js`    | Diagnose, plant-context chat, dialog helpers with mock fallback |
| `adminApi.js` | Lightweight admin endpoints grouped by MVP admin pages          |
| `authApi.js`  | Login/register/forgot-password mock-ready service boundary      |

---

## AI Chat Frontend Plan

MVP page behavior:

1. Load user's existing plants via `getMyPlants()`.
2. Show plant selector.
3. Require one selected plant.
4. Send `{ plantId, message, history? }` through backend `/ai/chat`.
5. Display assistant reply and disclaimer.
6. Show basic local/session history; persist through backend when endpoint exists.
7. Keep context plant-specific, not general chatbot.

Reusable UI candidates:

- Plant selector card/list.
- Chat message list.
- Chat input box.
- Empty state when user has no plants.

---

## Admin MVP Frontend Plan

Admin UI principles:

- Lightweight table/list screens.
- Simple detail/edit forms only where needed.
- No charts-heavy dashboard.
- No enterprise permissions matrix.
- No API key editor.

Admin pages:

- `AdminDashboard`: quick links + simple counts if API provides them.
- `AdminUsers`: basic user list/status/role display.
- `AdminUserPlants`: user plant records.
- `AdminPlantStatus`: simple status management.
- `AdminMarketplacePlants`: marketplace plant CRUD for display catalog.
- `AdminAiDialogs`: basic AI dialog history table/detail.
- `AdminAiConfigStatus`: provider configured/status info only.

---

## Data/API Constraints

- Frontend must not call AI provider directly.
- Frontend must not store AI API keys.
- Admin must only show AI config/status.
- Marketplace remains contact-oriented through Zalo/Facebook URLs.
- No cart/checkout/order/payment/shipping code.

---

## Implementation Boundary

This document is planning/documentation only. No frontend refactor or backend code should be generated from this update alone.
