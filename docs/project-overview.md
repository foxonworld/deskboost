# DeskBoost – Project Overview

> EXE201 MVP · React 19 + Vite 6 frontend · ASP.NET Core Web API + PostgreSQL backend direction · docs updated for latest scope

---

## Current Status

DeskBoost is a lean EXE201 MVP for desk plant care. Current repo has frontend source only; backend is not implemented yet.

| Area           | Current state                                                      |
| -------------- | ------------------------------------------------------------------ |
| Frontend       | React 19, Vite 6, React Router DOM v7                              |
| Routes         | User MVP routes active; admin/AI Chat routes not implemented yet   |
| Backend        | Not implemented yet                                                |
| Backend target | ASP.NET Core Web API + PostgreSQL                                  |
| Auth           | Frontend auth shell exists; mock auth enabled until backend exists |
| Roles          | Simple `USER` / `ADMIN` only                                       |
| API contract   | Updated in `docs/api-contract.md`                                  |
| Marketplace    | Display price + Zalo/Facebook contact only                         |

---

## Product Summary

DeskBoost helps users manage desk plants:

- Browse a simple plant/product marketplace.
- Register/login.
- Add and manage personal plants.
- Run AI plant diagnosis.
- Use AI Chat for advice based on one selected existing plant.
- Manage care reminders with in-app tracking plus Google Calendar / `.ics` export for reliable external reminders.
- Submit feedback.
- Admins manage core MVP records through a lightweight dashboard.

---

## Approved MVP Scope

User-side:

1. Landing
2. Auth
3. Add Plant
4. My Plants
5. AI Diagnosis
6. AI Chat
7. Reminder: in-app reminders + Google Calendar / `.ics` export; email optional if backend has time
8. Feedback
9. Simple Marketplace

Admin-side lightweight MVP:

1. User Management
2. User Plant Management
3. Plant Status Management
4. Marketplace Plant Management
5. AI Chat/Dialog History
6. AI Config Status page

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
- Raw API key editing in frontend/admin UI
- General-purpose chatbot
- Complex long-term conversation memory
- SMS/Zalo/Messenger reminder bots
- Mobile push notifications
- Complex web push/service-worker reminder system

Marketplace means users view plants/products, see price, then contact via Zalo/Facebook. No transaction workflow.

---

## Current Frontend Architecture

Actual structure today:

```txt
FE/
├── App.tsx
├── index.tsx
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
├── services/
│   ├── api.js
│   ├── authApi.js
│   ├── userApi.js
│   ├── plantApi.js
│   ├── reminderApi.js
│   ├── aiApi.js
│   └── feedbackApi.js
└── data/mockData.ts
```

Current active routes:

```txt
/                -> Home
/plants          -> PlantList
/plants/:plantId -> PlantDetail
/login           -> Login
/register        -> Register
/forgot-password -> ForgotPassword
/app/dashboard              -> Dashboard
/app/my-plants              -> MyPlants
/app/my-plants/:id/profile  -> PlantProfile
/app/add-plant              -> AddPlantUser
/app/profile                -> UserProfile
/app/ai-analysis            -> AIPlantAnalysis
/app/settings               -> RemindersSettings
```

Current navigation has no active admin route and no dedicated AI Chat route yet.

---

## Required Frontend Direction

- Add user AI Chat route/page using existing plants as selectable context.
- Add lightweight admin dashboard routes/pages behind simple `ADMIN` role guard.
- Keep user/admin nav simple.
- Do not restore old large admin dashboard.
- Do not add ecommerce routes.
- Keep frontend AI calls through backend services only.

See `docs/frontend-adjustment-plan.md` for implementation planning.

---

## Backend Direction

Backend target changed to:

- ASP.NET Core Web API
- PostgreSQL
- JWT Bearer auth
- REST JSON API under `/api/v1`
- AI provider calls proxied by backend only
- API keys stored in backend `.env` only

Backend should implement only endpoints documented in `docs/api-contract.md`.

Care Reminder backend direction:

- Implement reminder list/create/update/mark-done.
- Provide `.ics` export or calendar event data for Google Calendar integration.
- Treat email reminders as optional enhancement only if scheduler/email setup is ready.
- Do not build SMS, Zalo bot, Messenger bot, mobile push, or complex web push for MVP.

Browser notification note: not the main reminder channel because users may close the web app or deny browser permissions. Google Calendar / `.ics` is the MVP external reminder path.

---

## Known Limitations

- Backend/database not implemented.
- Mock auth enabled by default.
- Role-aware admin routing not implemented yet.
- AI Chat page not implemented yet.
- Admin pages/services not implemented yet.
- Some UI flows still rely on local fallback data.
