# DeskBoost – MVP Scope

> Source of truth: current codebase + latest EXE201 scope change. Keep practical; avoid overengineering.

---

## Current Status

- Frontend exists and is user-MVP oriented.
- Backend is not implemented yet.
- Backend direction is now ASP.NET Core Web API + PostgreSQL.
- AI Chat is now in MVP.
- Lightweight Admin Dashboard is now in MVP.
- Old enterprise admin and full ecommerce remain out of scope.

---

## User-side MVP Scope

| Feature            | Current frontend state                                                                           | Required change                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| Landing            | `Home.jsx` exists                                                                                | Keep                                                            |
| Auth               | `Login.jsx`, `Register.jsx`, `ForgotPassword.jsx`, `AuthContext.jsx`, `ProtectedRoute.jsx` exist | Add simple role handling when backend supports `USER` / `ADMIN` |
| Add Plant          | `AddPlantUser.jsx` exists                                                                        | Keep; connect to API when backend exists                        |
| My Plants          | `MyPlants.jsx`, `PlantProfile.jsx` exist                                                         | Keep; feeds AI Chat plant selector                              |
| AI Diagnosis       | `AIPlantAnalysis.jsx`, `aiApi.js` exist                                                          | Keep; share plant context concept with AI Chat                  |
| AI Chat            | Service helper exists in `aiApi.js`; no page/route yet                                           | Add MVP page/route                                              |
| Reminder           | `RemindersSettings.jsx`, `CareContext.jsx`, `CareNotificationBell.jsx` exist                     | Keep                                                            |
| Feedback           | `feedbackApi.js` exists                                                                          | Add/verify UI if needed                                         |
| Simple Marketplace | `PlantList.jsx`, `PlantDetail.jsx` exist                                                         | Keep display/price/contact only                                 |

---

## Admin-side MVP Scope

Admin dashboard must stay lightweight.

| Feature                      | MVP intent                                                                            |
| ---------------------------- | ------------------------------------------------------------------------------------- |
| User Management              | List users, view basic profile/status, simple role/status actions if backend supports |
| User Plant Management        | View/manage user-submitted plants                                                     |
| Plant Status Management      | Maintain simple plant health/status values                                            |
| Marketplace Plant Management | CRUD simple display catalog records with price/contact fields                         |
| AI Chat/Dialog History       | View basic AI dialog history for support/debug                                        |
| AI Config Status page        | Show configured/not configured provider status only; no raw key editing               |

Constraints:

- Do not rebuild old large admin dashboard.
- Do not add enterprise features.
- Do not expose API keys.
- Do not add advanced analytics.
- Role model stays `USER` / `ADMIN`.

---

## Current Active Routes

Public:

```txt
/                -> Home
/plants          -> PlantList
/plants/:plantId -> PlantDetail
/login           -> Login
/register        -> Register
/forgot-password -> ForgotPassword
```

Protected user routes:

```txt
/app/dashboard              -> Dashboard
/app/my-plants              -> MyPlants
/app/my-plants/:id/profile  -> PlantProfile
/app/add-plant              -> AddPlantUser
/app/profile                -> UserProfile
/app/ai-analysis            -> AIPlantAnalysis
/app/settings               -> RemindersSettings
```

Needed new routes:

```txt
/app/ai-chat                -> AIChat
/admin                      -> AdminDashboard
/admin/users                -> AdminUsers
/admin/user-plants          -> AdminUserPlants
/admin/plant-status         -> AdminPlantStatus
/admin/marketplace-plants   -> AdminMarketplacePlants
/admin/ai-dialogs           -> AdminAiDialogs
/admin/ai-config            -> AdminAiConfigStatus
```

---

## Marketplace Scope

Included:

- Public plant/product list.
- Public plant/product detail.
- Price text.
- Zalo/Facebook contact URL.

Excluded:

- Cart
- Checkout
- Payment
- Orders
- Shipping
- Refund
- Inventory enterprise workflow

---

## AI Chat MVP Scope

Included:

- User opens AI Chat.
- System shows user's existing plants.
- User selects one plant.
- User sends question about that plant.
- Backend responds using selected plant info.
- Basic AI dialog history is saved.
- AI Chat can share context with AI Diagnosis.

Excluded:

- General-purpose chatbot.
- Complex long-term memory.
- Multi-agent workflows.
- Direct frontend provider calls.

---

## Backend MVP Scope

Planned stack:

- ASP.NET Core Web API
- PostgreSQL
- JWT Bearer auth
- REST + JSON
- Base path `/api/v1`

Backend owns:

- Auth and role checks.
- Data persistence.
- AI provider calls.
- AI provider API keys in backend `.env`.

---

## Explicitly Out of Scope

- Payment
- Cart
- Checkout
- Orders
- Shipping
- Refund
- QR/NFC
- Workspace scanner
- Advanced analytics
- Enterprise admin dashboard
- Raw API key editing
- General-purpose chatbot
