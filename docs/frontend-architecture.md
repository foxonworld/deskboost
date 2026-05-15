# DeskBoost – Frontend Architecture

> Current frontend source of truth · React 19 + Vite 6 · updated for AI Chat + lightweight Admin MVP planning

---

## Current Status

- Frontend is implemented with React 19 + Vite 6.
- Routing uses React Router DOM v7 with `HashRouter`.
- User MVP routes exist.
- AI Diagnosis exists.
- AI Chat service helper exists, but no dedicated page/route yet.
- Admin dashboard is not currently implemented.
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

## Planned Route Additions

User:

```txt
/app/ai-chat -> AIChat
```

Admin:

```txt
/admin                    -> AdminDashboard
/admin/users              -> AdminUsers
/admin/user-plants        -> AdminUserPlants
/admin/plant-status       -> AdminPlantStatus
/admin/marketplace-plants -> AdminMarketplacePlants
/admin/ai-dialogs         -> AdminAiDialogs
/admin/ai-config          -> AdminAiConfigStatus
```

Admin routes must be guarded by authentication + `ADMIN` role. Keep role logic simple.

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

Needed nav changes:

- Add `/app/ai-chat` to user sidebar.
- Add admin entry only for `ADMIN` users.
- Add lightweight admin sidebar/layout only if needed.
- Do not add ecommerce nav.

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

Needed services:

| File          | New/updated responsibility                                     |
| ------------- | -------------------------------------------------------------- |
| `aiApi.js`    | Add dialog history helpers if contract uses separate endpoints |
| `adminApi.js` | Lightweight admin endpoints grouped by MVP admin pages         |
| `authApi.js`  | Ensure returned user includes `role`                           |

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
