# DeskBoost – MVP Scope

> Source of truth: current codebase + finalized API contract. Keep scope lean for EXE201.

---

## Current Status

- Frontend exists and was cleaned to MVP scope.
- Backend is not implemented yet.
- API contract is finalized in `docs/api-contract.md`.
- Backend target remains NestJS + Prisma + PostgreSQL.
- Backend implementation will be handled later by Tuan.
- Deprecated commerce/admin pages, routes, navigation, and mock data are removed from active MVP flow.
- `mockData.ts` is now MVP fallback only, not primary architecture.

---

## Current MVP Scope

| Feature            | Current frontend state                                                                           | Backend state          |
| ------------------ | ------------------------------------------------------------------------------------------------ | ---------------------- |
| Landing            | `Home.jsx` exists                                                                                | Not needed             |
| Auth               | `Login.jsx`, `Register.jsx`, `ForgotPassword.jsx`, `AuthContext.jsx`, `ProtectedRoute.jsx` exist | Planned                |
| Add Plant          | `AddPlantUser.jsx` exists                                                                        | Planned                |
| My Plants          | `MyPlants.jsx`, `PlantProfile.jsx` exist                                                         | Planned                |
| AI Diagnosis       | `AIPlantAnalysis.jsx` exists                                                                     | Planned backend proxy  |
| Reminder           | `RemindersSettings.jsx`, `CareContext.jsx`, `CareNotificationBell.jsx` exist                     | Planned                |
| Feedback           | `feedbackApi.js` exists                                                                          | Planned                |
| Simple Marketplace | `PlantList.jsx`, `PlantDetail.jsx` exist                                                         | Planned public catalog |

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

Protected by `ProtectedRoute`:

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

## Current Active Navigation

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

No cart/checkout/order/payment/shipping/admin navigation is active.

---

## Out of Scope

Do not implement or reintroduce for MVP:

- Payment
- Cart
- Checkout
- Orders
- Shipping
- Admin dashboard
- QR/NFC
- Workspace scanner
- Advanced analytics
- AI chat

Clarification: simple marketplace means catalog display + contact-oriented purchase path only. It does not include commerce transaction flows.

---

## Current Technical Decisions

- Use React 19 + Vite 6.
- Use React Router DOM v7.
- Use `HashRouter` in `App.tsx`.
- Keep `/app/*` protected by `ProtectedRoute`.
- Keep frontend auth state in `AuthContext.jsx`.
- Store MVP access token + user in `localStorage` through `authStorage.js`.
- Keep `VITE_USE_MOCK_AUTH` defaulting to mock auth until backend exists.
- Use centralized API client `FE/services/api.js`.
- Use service layer files matching `docs/api-contract.md`:
  - `authApi.js`
  - `userApi.js`
  - `plantApi.js`
  - `reminderApi.js`
  - `aiApi.js`
  - `feedbackApi.js`
- Keep backend base URL as `/api/v1` via `VITE_API_URL`.
- Backend will proxy AI provider calls; frontend must not store AI provider secrets.
- Keep fallback data minimal and MVP-only.

---

## Backend MVP Scope

Backend not implemented yet.

Planned backend stack:

- NestJS
- Prisma
- PostgreSQL
- JWT Bearer auth
- REST + JSON
- Base path `/api/v1`

Backend should implement only the finalized contract:

```txt
POST   /auth/register
POST   /auth/login
POST   /auth/forgot-password

GET    /users/me
PUT    /users/me

GET    /plants
GET    /plants/:id

GET    /my-plants
POST   /my-plants
GET    /my-plants/:id
PUT    /my-plants/:id
DELETE /my-plants/:id

GET    /reminders
POST   /reminders
PUT    /reminders/:id
DELETE /reminders/:id

POST   /ai/diagnose
POST   /ai/chat

POST   /feedback
```

Do not add cart/order/payment/admin APIs for MVP.

---

## Next Priorities

1. Keep docs synchronized before code changes.
2. Tuan implements backend from `docs/api-contract.md`.
3. Verify backend auth returns `{ user, accessToken }`.
4. Switch frontend auth from mock to real via `VITE_USE_MOCK_AUTH=false`.
5. Connect current pages to existing service layer incrementally.
6. Replace fallback data only after matching backend endpoints exist.
7. Preserve current MVP route/navigation boundaries.

---

## Known Limitations

- No backend or database exists yet.
- Mock auth remains active by default.
- Some pages still need final API wiring.
- `mockData.ts` is still present for MVP fallback.
- Reminder behavior is still frontend/local-state oriented until backend exists.
- AI diagnosis requires backend proxy before real provider integration.
- `ChatbotWidget.jsx` exists in components, but AI chat must not be expanded as an MVP feature.
