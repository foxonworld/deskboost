# DeskBoost – MVP API Contract

> Frontend: React 19 + Vite. Backend target: NestJS + Prisma + PostgreSQL.  
> Owner FE: frontend lead. Owner BE: Tuan.  
> Goal: simple contract so frontend can replace mock data with real API.

---

## 1. API design principles

- Keep MVP small. Build only APIs required by current frontend routes.
- Use REST + JSON.
- Base path versioned as `/api/v1`.
- Use JWT Bearer auth for protected routes.
- Frontend never calls Gemini/AI provider directly.
- Backend proxies all AI calls and keeps AI keys server-side.
- Products catalog is display-only. No cart/order/payment APIs.
- Standardize response and error shapes early.
- Prefer simple pagination for catalog lists.
- Use ISO 8601 strings for dates.
- Use `camelCase` JSON fields for frontend ease.

---

## 2. Base URL and environment variables

### Frontend env

```env
# FE/.env.local
VITE_API_URL=http://localhost:8080/api/v1
```

Frontend service wrapper should read:

```js
const API_BASE_URL = import.meta.env.VITE_API_URL;
```

### Backend env

```env
# Backend .env
PORT=8080
DATABASE_URL=postgresql://user:password@localhost:5432/deskboost
JWT_SECRET=change-me
GEMINI_API_KEY=server-side-only
FRONTEND_ORIGIN=http://localhost:5173
```

### Auth header

```http
Authorization: Bearer <accessToken>
```

---

## 3. Auth flow

### MVP choice

- Use JWT access token only.
- Store token in frontend `localStorage` for MVP speed.
- No refresh token in MVP.
- On `401`, frontend clears token and redirects to `/login`.

### Register

`POST /auth/register`

Request:

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
    "avatarUrl": null,
    "phone": null,
    "createdAt": "2026-05-14T10:00:00.000Z"
  },
  "accessToken": "jwt-token-here"
}
```

### Login

`POST /auth/login`

Request:

```json
{
  "email": "user@example.com",
  "password": "12345678"
}
```

Response: same as register.

### Forgot password

`POST /auth/forgot-password`

Request:

```json
{
  "email": "user@example.com"
}
```

Response:

```json
{
  "message": "If this email exists, reset instructions were sent."
}
```

MVP note: backend can log reset token or skip real email if email provider is not ready. Do not reveal whether email exists.

---

## 4. Endpoint list

### Auth

| Method | Endpoint                | Auth | Purpose                |
| ------ | ----------------------- | ---: | ---------------------- |
| POST   | `/auth/register`        |   No | Create account         |
| POST   | `/auth/login`           |   No | Login                  |
| POST   | `/auth/forgot-password` |   No | Request password reset |

### User profile

| Method | Endpoint    | Auth | Purpose              |
| ------ | ----------- | ---: | -------------------- |
| GET    | `/users/me` |  Yes | Current user profile |
| PUT    | `/users/me` |  Yes | Update profile       |

### Products catalog / public plants

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

| Method | Endpoint         | Auth | Purpose             |
| ------ | ---------------- | ---: | ------------------- |
| GET    | `/reminders`     |  Yes | List care reminders |
| POST   | `/reminders`     |  Yes | Create reminder     |
| PUT    | `/reminders/:id` |  Yes | Update reminder     |
| DELETE | `/reminders/:id` |  Yes | Delete reminder     |

### AI Diagnosis

| Method | Endpoint       | Auth | Purpose                                     |
| ------ | -------------- | ---: | ------------------------------------------- |
| POST   | `/ai/diagnose` |  Yes | Diagnose plant from image via backend proxy |
| POST   | `/ai/chat`     |  Yes | Chat follow-up via backend proxy            |

### Feedback

| Method | Endpoint    |     Auth | Purpose                      |
| ------ | ----------- | -------: | ---------------------------- |
| POST   | `/feedback` | Optional | Submit user/visitor feedback |

---

## 5. Request body examples

### Update user profile

`PUT /users/me`

```json
{
  "name": "Nguyen Van A",
  "phone": "0909123456",
  "avatarUrl": "https://example.com/avatar.png"
}
```

### Create my plant

`POST /my-plants`

```json
{
  "name": "Monstera near window",
  "species": "Monstera Deliciosa",
  "location": "Desk corner",
  "imageUrl": "https://example.com/my-plant.jpg",
  "notes": "Bought in May. Likes indirect light."
}
```

### Update my plant

`PUT /my-plants/:id`

```json
{
  "name": "Monstera at desk",
  "species": "Monstera Deliciosa",
  "location": "Work desk",
  "imageUrl": "https://example.com/my-plant-new.jpg",
  "notes": "Water every 5 days."
}
```

### Create reminder

`POST /reminders`

```json
{
  "plantId": "myplant_001",
  "type": "watering",
  "title": "Water Monstera",
  "frequency": "weekly",
  "nextRunAt": "2026-05-20T09:00:00.000Z",
  "enabled": true
}
```

Allowed reminder `type` values:

```json
["watering", "fertilizing", "pruning", "repotting", "custom"]
```

Allowed `frequency` values:

```json
["daily", "weekly", "monthly", "custom"]
```

### AI diagnose

`POST /ai/diagnose`

Use either `imageBase64` or `imageUrl`. Frontend MVP can send base64 from file upload.

```json
{
  "plantId": "myplant_001",
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...",
  "question": "What is wrong with this plant?"
}
```

### AI chat

`POST /ai/chat`

```json
{
  "plantId": "myplant_001",
  "message": "How often should I water it this week?",
  "history": [
    {
      "role": "user",
      "content": "My leaves are yellow."
    },
    {
      "role": "assistant",
      "content": "Yellow leaves can come from overwatering or poor drainage."
    }
  ]
}
```

### Submit feedback

`POST /feedback`

```json
{
  "name": "Nguyen Van A",
  "email": "user@example.com",
  "rating": 5,
  "message": "The AI diagnosis flow is easy to use.",
  "source": "ai-diagnosis"
}
```

---

## 6. Response body examples

### Get current user

`GET /users/me`

```json
{
  "id": "usr_001",
  "name": "Nguyen Van A",
  "email": "user@example.com",
  "phone": "0909123456",
  "avatarUrl": null,
  "createdAt": "2026-05-14T10:00:00.000Z",
  "updatedAt": "2026-05-14T10:00:00.000Z"
}
```

### Product catalog list

`GET /plants?page=1&limit=12&search=monstera`

```json
{
  "items": [
    {
      "id": "plant_001",
      "name": "Monstera Deliciosa",
      "description": "Easy indoor plant with large split leaves.",
      "imageUrl": "https://example.com/monstera.jpg",
      "priceText": "Contact for price",
      "careLevel": "easy",
      "light": "indirect",
      "water": "weekly",
      "contactUrl": "https://zalo.me/your-shop"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 1,
    "totalPages": 1
  }
}
```

### Product detail

`GET /plants/:id`

```json
{
  "id": "plant_001",
  "name": "Monstera Deliciosa",
  "description": "Easy indoor plant with large split leaves.",
  "imageUrl": "https://example.com/monstera.jpg",
  "gallery": ["https://example.com/monstera-2.jpg"],
  "priceText": "Contact for price",
  "careLevel": "easy",
  "light": "indirect",
  "water": "weekly",
  "humidity": "medium",
  "temperature": "18-30°C",
  "contactUrl": "https://zalo.me/your-shop"
}
```

### My plants list

`GET /my-plants`

```json
{
  "items": [
    {
      "id": "myplant_001",
      "name": "Monstera near window",
      "species": "Monstera Deliciosa",
      "location": "Desk corner",
      "imageUrl": "https://example.com/my-plant.jpg",
      "notes": "Bought in May.",
      "createdAt": "2026-05-14T10:00:00.000Z",
      "updatedAt": "2026-05-14T10:00:00.000Z"
    }
  ]
}
```

### Reminder list

`GET /reminders`

```json
{
  "items": [
    {
      "id": "rem_001",
      "plantId": "myplant_001",
      "plantName": "Monstera near window",
      "type": "watering",
      "title": "Water Monstera",
      "frequency": "weekly",
      "nextRunAt": "2026-05-20T09:00:00.000Z",
      "enabled": true,
      "createdAt": "2026-05-14T10:00:00.000Z",
      "updatedAt": "2026-05-14T10:00:00.000Z"
    }
  ]
}
```

### AI diagnose result

`POST /ai/diagnose`

```json
{
  "diagnosisId": "diag_001",
  "plantId": "myplant_001",
  "summary": "The plant may be overwatered.",
  "confidence": 0.78,
  "issues": [
    {
      "name": "Overwatering",
      "severity": "medium",
      "description": "Yellowing leaves and soft stems can indicate too much water."
    }
  ],
  "recommendations": [
    "Check soil moisture before watering.",
    "Improve drainage.",
    "Move plant to bright indirect light."
  ],
  "disclaimer": "AI diagnosis is for reference only and may be inaccurate."
}
```

### AI chat result

`POST /ai/chat`

```json
{
  "reply": "Water only when the top 2-3 cm of soil is dry. For this week, skip watering if the soil is still damp.",
  "disclaimer": "AI advice is for reference only."
}
```

### Feedback result

`POST /feedback`

```json
{
  "id": "fb_001",
  "message": "Thanks for your feedback."
}
```

### Delete response

`DELETE /my-plants/:id`

```json
{
  "success": true
}
```

---

## 7. Standard error response format

Backend should return consistent errors:

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

Common status codes:

| Status | Code               | Meaning                                |
| -----: | ------------------ | -------------------------------------- |
|    400 | `BAD_REQUEST`      | Invalid request body/query             |
|    401 | `UNAUTHORIZED`     | Missing/invalid token                  |
|    403 | `FORBIDDEN`        | No access to resource                  |
|    404 | `NOT_FOUND`        | Resource not found                     |
|    409 | `CONFLICT`         | Email already used, duplicate resource |
|    422 | `VALIDATION_ERROR` | Field-level validation failed          |
|    429 | `RATE_LIMITED`     | Too many AI/auth requests              |
|    500 | `INTERNAL_ERROR`   | Unexpected backend error               |

Frontend should read `error.message` for user-facing toast/inline error.

---

## 8. Frontend service file mapping

Current service folder target:

| Frontend file                | API endpoints                                            |
| ---------------------------- | -------------------------------------------------------- |
| `FE/services/api.js`         | Base `fetch`, auth header, JSON parse, error normalize   |
| `FE/services/authApi.js`     | `/auth/register`, `/auth/login`, `/auth/forgot-password` |
| `FE/services/userApi.js`     | `/users/me`                                              |
| `FE/services/plantApi.js`    | `/plants`, `/plants/:id`, `/my-plants`, `/my-plants/:id` |
| `FE/services/reminderApi.js` | `/reminders`, `/reminders/:id`                           |
| `FE/services/aiApi.js`       | `/ai/diagnose`, `/ai/chat`                               |
| `FE/services/feedbackApi.js` | `/feedback`                                              |

Suggested MVP service functions:

```js
// authApi.js
register(payload);
login(payload);
forgotPassword(email);

// userApi.js
getMe();
updateMe(payload);

// plantApi.js
getCatalogPlants(params);
getCatalogPlant(id);
getMyPlants();
createMyPlant(payload);
getMyPlant(id);
updateMyPlant(id, payload);
deleteMyPlant(id);

// reminderApi.js
getReminders();
createReminder(payload);
updateReminder(id, payload);
deleteReminder(id);

// aiApi.js
diagnosePlant(payload);
chatWithAI(payload);

// feedbackApi.js
submitFeedback(payload);
```

---

## 9. Suggested frontend TypeScript interfaces or JS object shapes

These shapes are documentation only. Current pages can stay `.jsx`.

```ts
export type ID = string;

export interface User {
  id: ID;
  name: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface CatalogPlant {
  id: ID;
  name: string;
  description: string;
  imageUrl: string;
  gallery?: string[];
  priceText?: string;
  careLevel?: "easy" | "medium" | "hard";
  light?: string;
  water?: string;
  humidity?: string;
  temperature?: string;
  contactUrl?: string;
}

export interface MyPlant {
  id: ID;
  name: string;
  species?: string;
  location?: string;
  imageUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reminder {
  id: ID;
  plantId: ID;
  plantName?: string;
  type: "watering" | "fertilizing" | "pruning" | "repotting" | "custom";
  title: string;
  frequency: "daily" | "weekly" | "monthly" | "custom";
  nextRunAt: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DiagnosisIssue {
  name: string;
  severity: "low" | "medium" | "high";
  description: string;
}

export interface DiagnosisResult {
  diagnosisId: ID;
  plantId?: ID;
  summary: string;
  confidence?: number;
  issues: DiagnosisIssue[];
  recommendations: string[];
  disclaimer: string;
}

export interface FeedbackPayload {
  name?: string;
  email?: string;
  rating?: number;
  message: string;
  source?: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
}
```

Pagination shape:

```ts
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

---

## 10. Loading/error state requirements

Frontend requirements per API call:

- Show loading state while request is pending.
- Disable submit buttons while pending to prevent duplicate requests.
- Show empty state when list response has `items: []`.
- Show inline validation errors from `error.details` when available.
- Show toast or page-level error from `error.message`.
- On `401`, clear token and redirect to `/login`.
- AI diagnose can take longer. Show clear progress text like `Analyzing plant image...`.
- AI errors should not crash page. Show retry button.
- Delete actions require confirm dialog.
- Public catalog should still work when user is logged out.

Recommended frontend state shape:

```js
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

---

## 11. Notes for backend developer

- Tuan should implement only endpoints listed in this document for MVP.
- Use NestJS modules roughly matching domains: `AuthModule`, `UsersModule`, `PlantsModule`, `MyPlantsModule`, `RemindersModule`, `AiModule`, `FeedbackModule`.
- Use Prisma models simple enough for demo and iteration.
- Keep product catalog seedable from database. No admin UI required.
- `GET /plants` is public and display-only.
- `contactUrl` can be a Zalo/Facebook URL from seed data.
- `POST /ai/diagnose` and `POST /ai/chat` must call Gemini from backend only.
- Add rate limit for auth and AI endpoints if quick to implement.
- Enable CORS for frontend origin.
- Validate all DTOs with `class-validator`.
- Never return password hash.
- For user-owned resources, always filter by authenticated `userId`.
- Keep response fields stable; frontend will map UI to these names.

Suggested Prisma entities:

```txt
User
CatalogPlant
UserPlant
Reminder
DiagnosisLog
Feedback
```

Minimum ownership rules:

```txt
User owns UserPlant
User owns Reminder
Reminder belongs to UserPlant
DiagnosisLog optionally belongs to User and UserPlant
Feedback optionally belongs to User
```

---

## 12. Out-of-scope APIs

Do not build these for MVP:

- Cart APIs
- Checkout APIs
- Payment APIs
- Order APIs
- Shipping APIs
- Inventory management APIs
- Coupon/discount APIs
- Admin dashboard APIs
- Admin user management APIs
- Admin product CRUD APIs
- Push notification APIs
- Realtime websocket APIs
- Review/rating APIs for products
- Wishlist APIs
- Social login APIs
- Refresh token/session rotation APIs
- File upload service APIs beyond simple `imageUrl` or base64 AI input

If a page needs purchase behavior, frontend should link user to Zalo/Facebook via `contactUrl`.
