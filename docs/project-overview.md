# DeskBoost – Project Overview

> EXE201 MVP · React 19 + Vite 6 · Frontend cleanup completed · Backend not implemented yet

---

## Current Status

DeskBoost is a small MVP for desk plant care. The current codebase is frontend-only.

| Area             | Current state                                                                       |
| ---------------- | ----------------------------------------------------------------------------------- |
| Frontend         | Implemented with React 19, Vite 6, React Router DOM v7                              |
| Frontend cleanup | Completed; deprecated commerce/admin surfaces removed from active routes/navigation |
| Backend          | Not implemented yet                                                                 |
| API contract     | Finalized in `docs/api-contract.md`                                                 |
| Backend target   | NestJS + Prisma + PostgreSQL, to be implemented later by Tuan                       |
| Auth             | Frontend auth shell exists; mock auth enabled by default until backend exists       |
| Data             | `mockData.ts` reduced to MVP fallback catalog + my-plants data only                 |
| Marketplace      | Simple display/contact model only; no cart/order/payment                            |

---

## Product Summary

DeskBoost helps users manage desk plants:

- Browse a simple plant/product catalog.
- Register/login to access protected app pages.
- Add and manage personal plants.
- View plant profiles.
- Run AI plant diagnosis through the planned backend proxy.
- Manage care reminders/settings.
- Submit feedback.

---

## Current MVP Scope

In scope:

1. Landing
2. Auth
3. Add Plant
4. My Plants
5. AI Diagnosis
6. Reminder
7. Feedback
8. Simple Marketplace

Out of scope:

- Payment
- Cart
- Checkout
- Orders
- Shipping
- Admin dashboard
- QR/NFC
- Workspace scanner
- Advanced analytics
- AI chat as a product feature

Note: `FE/services/aiApi.js` still exposes a backend `/ai/chat` helper for API-contract compatibility, but AI chat is not an MVP product surface to expand.

---

## Current Frontend Architecture

Actual structure:

```txt
FE/
├── App.tsx
├── index.tsx
├── package.json
├── routes/
│   ├── AppRouter.tsx
│   └── ProtectedRoute.jsx
├── pages/
│   ├── Home.jsx
│   ├── PlantList.jsx
│   ├── PlantDetail.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── ForgotPassword.jsx
│   ├── Dashboard.jsx
│   ├── MyPlants.jsx
│   ├── PlantProfile.jsx
│   ├── AddPlantUser.jsx
│   ├── UserProfile.jsx
│   ├── AIPlantAnalysis.jsx
│   └── RemindersSettings.jsx
├── components/
│   ├── Navbar.jsx
│   ├── UserLayout.jsx
│   ├── UserSidebar.jsx
│   ├── CareNotificationBell.jsx
│   ├── ChatbotWidget.jsx
│   ├── FloatingHomeButton.jsx
│   └── ThemeToggle.tsx
├── context/
│   ├── AuthContext.jsx
│   └── CareContext.jsx
├── hooks/
│   └── useAuth.js
├── services/
│   ├── api.js
│   ├── authApi.js
│   ├── userApi.js
│   ├── plantApi.js
│   ├── reminderApi.js
│   ├── aiApi.js
│   └── feedbackApi.js
├── utils/
│   └── authStorage.js
└── data/
    └── mockData.ts
```

---

## Current Routes

Public routes:

```txt
/                -> Home
/plants          -> PlantList
/plants/:plantId -> PlantDetail
/login           -> Login
/register        -> Register
/forgot-password -> ForgotPassword
```

Protected routes:

```txt
/app/dashboard              -> Dashboard
/app/my-plants              -> MyPlants
/app/my-plants/:id/profile  -> PlantProfile
/app/add-plant              -> AddPlantUser
/app/profile                -> UserProfile
/app/ai-analysis            -> AIPlantAnalysis
/app/settings               -> RemindersSettings
```

Fallback:

```txt
* -> /
```

---

## Current Navigation

Active public navigation in `Navbar.jsx`:

- `/` Trang chủ
- `/plants` Cây cảnh
- `/login` when unauthenticated
- `/app/profile` and logout when authenticated
- care notification bell only when authenticated

Active app sidebar navigation in `UserSidebar.jsx`:

- `/app/dashboard`
- `/app/my-plants`
- `/app/ai-analysis`
- `/app/profile`
- `/app/settings`

No active cart, checkout, order, payment, shipping, or admin navigation exists.

---

## Current Technical Decisions

- React 19 + Vite 6 frontend.
- React Router DOM v7 with `HashRouter`.
- `/app/*` pages protected by `ProtectedRoute`.
- Auth state centralized in `AuthContext.jsx`.
- Access token and user profile persisted in `localStorage` through `authStorage.js`.
- Central API client in `FE/services/api.js`.
- Service modules mirror the finalized API contract.
- Backend base URL defaults to `http://localhost:8080/api/v1`.
- Auth service uses mock auth unless `VITE_USE_MOCK_AUTH=false`.
- Backend will own AI provider calls and secrets.
- Marketplace remains display/contact-only.

---

## Backend Status

Backend is not implemented in the current repository.

Planned backend:

- NestJS
- Prisma
- PostgreSQL
- JWT Bearer auth
- REST JSON API under `/api/v1`
- Gemini/AI provider called from backend only
- Owner: Tuan

The backend should implement only endpoints documented in `docs/api-contract.md`.

---

## Next Priorities

1. Keep documentation aligned with actual code before implementation work.
2. Backend implementation by Tuan using `docs/api-contract.md`.
3. Set `VITE_USE_MOCK_AUTH=false` after backend auth works.
4. Connect pages to existing service modules where not already connected.
5. Replace MVP fallback data only after API endpoints are available.
6. Preserve lean MVP scope; do not reintroduce commerce/admin systems.

---

## Known Limitations

- No backend/database yet.
- Mock auth is enabled by default.
- Some UI flows still rely on local fallback data until APIs exist.
- `CareContext.jsx` remains frontend/local-state based.
- `ChatbotWidget.jsx` exists as a component file, but AI chat is out of MVP product scope.
- No payment/cart/order/shipping/admin behavior should be added for MVP.
