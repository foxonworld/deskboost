# DeskBoost – MVP API Contract

> Frontend: React 19 + Vite. Backend target: ASP.NET Core Web API + PostgreSQL. Goal: practical EXE201 contract for user MVP + AI Chat + lightweight Admin MVP.

---

## 1. API Design Principles

- REST + JSON.
- Base path: `/api/v1`.
- JWT Bearer auth for protected routes.
- Simple roles: `USER`, `ADMIN`.
- Frontend never calls AI provider directly.
- Backend keeps AI keys in backend `.env` only.
- Admin UI shows AI config/status only; no raw key editing.
- AI Chat is plant-care-specific, using a selected saved plant context.
- Marketplace is display + contact only.
- No cart/order/payment/checkout/shipping APIs.
- Care Reminder MVP uses in-app reminders plus Google Calendar / `.ics` export as the preferred external reminder path.
- Browser notifications are not the main reminder strategy because users may close the web app or deny permission.
- Email reminders are optional backend enhancement only if scheduler/email infrastructure is ready.
- Do not add SMS, Zalo bot, Messenger bot, mobile push, or complex web push APIs.
- Keep responses stable and simple.

---

## 2. Environment

Frontend:

```env
VITE_API_URL=http://localhost:8080/api/v1
VITE_USE_MOCK_AUTH=true
VITE_USE_MOCK_AI=true
VITE_USE_MOCK_ADMIN=true
```

- Set `VITE_USE_MOCK_AI=false` only after `/ai/*` and `/admin/ai-config/status` are ready.
- Set `VITE_USE_MOCK_ADMIN=false` only after `/admin/*` endpoints are ready.
- Even when mock flags are `false`, frontend services may fall back to small mock data if backend is unavailable during Phase 2 prep.

Backend:

```env
PORT=8080
DATABASE_URL=postgresql://user:password@localhost:5432/deskboost
JWT_SECRET=change-me
AI_PROVIDER=gemini
GEMINI_API_KEY=server-side-only
FRONTEND_ORIGIN=http://localhost:5173
```

Auth header:

```http
Authorization: Bearer <accessToken>
```

---

## 3. Auth

### Register

`POST /auth/register`

```json
{
  "name": "Nguyen Van A",
  "email": "user@example.com",
  "password": "12345678"
}
```

Response:

```json
{
  "user": {
    "id": "usr_001",
    "name": "Nguyen Van A",
    "email": "user@example.com",
    "role": "USER",
    "avatarUrl": null,
    "phone": null,
    "createdAt": "2026-05-14T10:00:00.000Z"
  },
  "accessToken": "jwt-token-here"
}
```

### Login

`POST /auth/login`

Response shape is same as register.

### Forgot password

`POST /auth/forgot-password`

```json
{
  "email": "user@example.com"
}
```

```json
{
  "message": "If this email exists, reset instructions were sent."
}
```

---

## 4. Endpoint List

### Public/Auth/User

| Method | Endpoint                | Auth | Purpose                |
| ------ | ----------------------- | ---: | ---------------------- |
| POST   | `/auth/register`        |   No | Create account         |
| POST   | `/auth/login`           |   No | Login                  |
| POST   | `/auth/forgot-password` |   No | Request password reset |
| GET    | `/users/me`             |  Yes | Current user profile   |
| PUT    | `/users/me`             |  Yes | Update profile         |

### Marketplace catalog

| Method | Endpoint      | Auth | Purpose                                   |
| ------ | ------------- | ---: | ----------------------------------------- |
| GET    | `/plants`     |   No | Public display-only plant/product catalog |
| GET    | `/plants/:id` |   No | Public plant/product detail               |

### My plants

| Method | Endpoint         | Auth | Purpose                 |
| ------ | ---------------- | ---: | ----------------------- |
| GET    | `/my-plants`     |  Yes | List user's plants      |
| POST   | `/my-plants`     |  Yes | Add user's plant        |
| GET    | `/my-plants/:id` |  Yes | Get user's plant detail |
| PUT    | `/my-plants/:id` |  Yes | Update user's plant     |
| DELETE | `/my-plants/:id` |  Yes | Delete user's plant     |

### Reminders

| Method | Endpoint                  | Auth | Purpose                                             |
| ------ | ------------------------- | ---: | --------------------------------------------------- |
| GET    | `/reminders`              |  Yes | List reminders                                      |
| POST   | `/reminders`              |  Yes | Create reminder                                     |
| PUT    | `/reminders/:id`          |  Yes | Update reminder                                     |
| PUT    | `/reminders/:id/done`     |  Yes | Mark reminder as done                               |
| GET    | `/reminders/:id/calendar` |  Yes | Return Google Calendar event data or `.ics` content |
| DELETE | `/reminders/:id`          |  Yes | Delete reminder                                     |

### AI

| Method | Endpoint          | Auth | Purpose                             |
| ------ | ----------------- | ---: | ----------------------------------- |
| POST   | `/ai/diagnose`    |  Yes | Diagnose plant via backend AI proxy |
| POST   | `/ai/chat`        |  Yes | Plant-specific AI Chat reply        |
| GET    | `/ai/dialogs`     |  Yes | User's basic AI dialog history      |
| GET    | `/ai/dialogs/:id` |  Yes | User's dialog detail                |

### Feedback

| Method | Endpoint    |     Auth | Purpose         |
| ------ | ----------- | -------: | --------------- |
| POST   | `/feedback` | Optional | Submit feedback |

### Lightweight Admin

All admin endpoints require `ADMIN`.

| Method | Endpoint                        | Purpose                                       |
| ------ | ------------------------------- | --------------------------------------------- |
| GET    | `/admin/summary`                | Lightweight counts/status for admin dashboard |
| GET    | `/admin/users`                  | List users                                    |
| GET    | `/admin/users/:id`              | User detail                                   |
| PUT    | `/admin/users/:id/status`       | Update simple user status                     |
| GET    | `/admin/user-plants`            | List user plants                              |
| GET    | `/admin/user-plants/:id`        | User plant detail                             |
| PUT    | `/admin/user-plants/:id/status` | Update plant status                           |
| GET    | `/admin/marketplace-plants`     | List marketplace plants                       |
| POST   | `/admin/marketplace-plants`     | Create marketplace plant                      |
| PUT    | `/admin/marketplace-plants/:id` | Update marketplace plant                      |
| DELETE | `/admin/marketplace-plants/:id` | Delete marketplace plant                      |
| GET    | `/admin/ai-dialogs`             | List AI dialog history                        |
| GET    | `/admin/ai-dialogs/:id`         | AI dialog detail                              |
| GET    | `/admin/ai-config/status`       | AI provider config/status only                |

---

## 5. Core Request Examples

Create my plant:

```json
{
  "name": "Monstera near window",
  "species": "Monstera Deliciosa",
  "location": "Desk corner",
  "imageUrl": "https://example.com/my-plant.jpg",
  "notes": "Likes indirect light."
}
```

AI diagnose:

```json
{
  "plantId": "myplant_001",
  "imageBase64": "data:image/jpeg;base64,...",
  "question": "What is wrong with this plant?"
}
```

AI chat:

```json
{
  "plantId": "myplant_001",
  "message": "How often should I water it this week?",
  "history": [
    { "role": "user", "content": "Leaves are yellow." },
    {
      "role": "assistant",
      "content": "Yellow leaves may come from overwatering."
    }
  ],
  "plantContext": {
    "id": "myplant_001",
    "nickname": "Monstera near window",
    "name": "Swiss Cheese Plant",
    "species": "Monstera Deliciosa",
    "status": "needs-water",
    "light": "indirect",
    "water": "weekly",
    "notes": "Likes indirect light."
  }
}
```

Create reminder:

```json
{
  "plantId": "myplant_001",
  "title": "Water Monstera",
  "careType": "watering",
  "dueAt": "2026-05-16T02:00:00.000Z",
  "repeatRule": "weekly",
  "notes": "Check top 2-3 cm of soil first."
}
```

Mark reminder done:

```json
{
  "doneAt": "2026-05-16T02:10:00.000Z"
}
```

Calendar event data response:

```json
{
  "provider": "google-calendar-compatible",
  "title": "Water Monstera",
  "description": "DeskBoost reminder for Monstera near window. Check top 2-3 cm of soil first.",
  "startsAt": "2026-05-16T02:00:00.000Z",
  "endsAt": "2026-05-16T02:15:00.000Z",
  "timezone": "Asia/Ho_Chi_Minh",
  "icsUrl": "https://api.example.com/api/v1/reminders/rem_001/calendar?format=ics"
}
```

Alternative `.ics` response is allowed when requested with `format=ics` and should use `text/calendar` content type.

Create/update marketplace plant:

```json
{
  "name": "Monstera Deliciosa",
  "description": "Easy indoor plant with large split leaves.",
  "imageUrl": "https://example.com/monstera.jpg",
  "priceText": "150,000 VND",
  "careLevel": "easy",
  "light": "indirect",
  "water": "weekly",
  "contactUrl": "https://zalo.me/your-shop",
  "status": "active"
}
```

---

## 6. Core Response Examples

Catalog list:

```json
{
  "items": [
    {
      "id": "plant_001",
      "name": "Monstera Deliciosa",
      "description": "Easy indoor plant with large split leaves.",
      "imageUrl": "https://example.com/monstera.jpg",
      "priceText": "150,000 VND",
      "careLevel": "easy",
      "contactUrl": "https://zalo.me/your-shop"
    }
  ],
  "pagination": { "page": 1, "limit": 12, "total": 1, "totalPages": 1 }
}
```

My plants list:

```json
{
  "items": [
    {
      "id": "myplant_001",
      "name": "Monstera near window",
      "species": "Monstera Deliciosa",
      "location": "Desk corner",
      "imageUrl": "https://example.com/my-plant.jpg",
      "status": "healthy",
      "notes": "Bought in May.",
      "createdAt": "2026-05-14T10:00:00.000Z",
      "updatedAt": "2026-05-14T10:00:00.000Z"
    }
  ]
}
```

Reminder list:

```json
{
  "items": [
    {
      "id": "rem_001",
      "plantId": "myplant_001",
      "plantName": "Monstera near window",
      "title": "Water Monstera",
      "careType": "watering",
      "dueAt": "2026-05-16T02:00:00.000Z",
      "repeatRule": "weekly",
      "status": "pending",
      "lastDoneAt": null,
      "createdAt": "2026-05-15T08:00:00.000Z",
      "updatedAt": "2026-05-15T08:00:00.000Z"
    }
  ]
}
```

AI chat result:

```json
{
  "dialogId": "dlg_001",
  "plantId": "myplant_001",
  "reply": "Water only when the top 2-3 cm of soil is dry.",
  "disclaimer": "AI advice is for reference only.",
  "createdAt": "2026-05-15T03:42:00.000Z"
}
```

AI dialog list:

```json
{
  "items": [
    {
      "id": "dlg_001",
      "plantId": "myplant_001",
      "plantName": "Monstera near window",
      "title": "Watering guidance",
      "lastMessage": "Water only when the top soil is dry.",
      "createdAt": "2026-05-15T03:42:00.000Z"
    }
  ]
}
```

AI config status:

```json
{
  "provider": "gemini",
  "configured": true,
  "lastCheckedAt": "2026-05-15T03:42:00.000Z"
}
```

Admin summary:

```json
{
  "users": 12,
  "userPlants": 30,
  "marketplacePlants": 8,
  "aiDialogs": 20,
  "aiConfigured": true
}
```

---

## 7. Standard Error Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is invalid.",
    "details": {
      "email": "Must be a valid email address."
    }
  }
}
```

Common status codes: `400`, `401`, `403`, `404`, `409`, `422`, `429`, `500`.

---

## 8. Frontend Service Mapping

| Frontend file                | API endpoints                                                        |
| ---------------------------- | -------------------------------------------------------------------- |
| `FE/services/api.js`         | Base fetch, auth header, error normalize                             |
| `FE/services/authApi.js`     | `/auth/*`                                                            |
| `FE/services/userApi.js`     | `/users/me`                                                          |
| `FE/services/plantApi.js`    | `/plants`, `/my-plants`                                              |
| `FE/services/reminderApi.js` | `/reminders`, `/reminders/:id/done`, `/reminders/:id/calendar`       |
| `FE/services/aiApi.js`       | `/ai/diagnose`, `/ai/chat`, `/ai/dialogs`, `/admin/ai-config/status` |
| `FE/services/feedbackApi.js` | `/feedback`                                                          |
| `FE/services/adminApi.js`    | `/admin/*`                                                           |

Current service functions:

```js
// aiApi.js
diagnosePlant(payload);
sendPlantContextChatMessage({ plantId, message, history, plantContext });
chatWithAI(payload);
getMyAiDialogs(params);
getMyAiDialog(id);
getAiConfigStatus();

// adminApi.js
getAdminSummary();
getAdminUsers(params);
getAdminUser(id);
updateAdminUserStatus(id, payload);
getAdminUserPlants(params);
getAdminUserPlant(id);
updateAdminUserPlantStatus(id, payload);
getAdminMarketplacePlants(params);
createAdminMarketplacePlant(payload);
updateAdminMarketplacePlant(id, payload);
deleteAdminMarketplacePlant(id);
getAdminAiDialogs(params);
getAdminAiDialog(id);
getAdminAiConfigStatus();
```

---

## 9. Backend Endpoints Tuan Needs To Implement

Priority order for Phase 2 backend integration:

1. Reminder MVP: `GET /reminders`, `POST /reminders`, `PUT /reminders/:id`, `PUT /reminders/:id/done`, `GET /reminders/:id/calendar`; support Google Calendar / `.ics`; email reminder optional only if backend has scheduler/email ready.
2. `POST /ai/chat` with selected `plantId` + `plantContext`, returns plant-care-only reply and stores basic dialog.
3. `GET /ai/dialogs` and `GET /ai/dialogs/:id` for current user's basic AI dialog history.
4. `GET /admin/summary` for lightweight counts only.
5. `GET /admin/users`, `GET /admin/users/:id`, `PUT /admin/users/:id/status`.
6. `GET /admin/user-plants`, `GET /admin/user-plants/:id`, `PUT /admin/user-plants/:id/status`.
7. `GET /admin/marketplace-plants`, `POST /admin/marketplace-plants`, `PUT /admin/marketplace-plants/:id`, `DELETE /admin/marketplace-plants/:id`.
8. `GET /admin/ai-dialogs`, `GET /admin/ai-dialogs/:id`.
9. `GET /admin/ai-config/status` returning provider/configured/lastCheckedAt only; no raw key value.
10. Keep `POST /ai/diagnose` aligned with existing contract if image diagnosis remains in MVP.

---

## 10. Out-of-scope APIs

Do not build for MVP:

- Cart APIs
- Checkout APIs
- Payment APIs
- Order APIs
- Shipping APIs
- Refund APIs
- QR/NFC APIs
- Workspace scanner APIs
- Advanced analytics APIs
- Enterprise admin APIs
- Raw API key edit/update APIs
- Realtime websocket APIs
- Social login APIs
- Complex conversation memory APIs
- SMS reminder APIs
- Zalo bot reminder APIs
- Messenger bot reminder APIs
- Mobile push reminder APIs
- Complex web push/service-worker notification APIs
