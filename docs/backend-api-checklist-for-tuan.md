# Checklist API Backend cho Tuan

> Checklist triển khai backend DeskBoost MVP. Backend dùng ASP.NET Core Web API + PostgreSQL. Frontend là React 19 + Vite. API source of truth: `docs/api-contract.md`.

---

## 1. Backend stack

- [ ] ASP.NET Core Web API.
- [ ] PostgreSQL.
- [ ] REST + JSON.
- [ ] Base path: `/api/v1`.
- [ ] JWT Bearer auth cho route cần đăng nhập.
- [ ] Role đơn giản: `USER`, `ADMIN`.
- [ ] CORS cho frontend Vite: `http://localhost:5173`.
- [ ] AI provider key chỉ nằm trong backend `.env`.

Backend `.env` dự kiến:

```env
PORT=8080
DATABASE_URL=postgresql://user:password@localhost:5432/deskboost
JWT_SECRET=change-me
AI_PROVIDER=gemini
GEMINI_API_KEY=server-side-only
FRONTEND_ORIGIN=http://localhost:5173
```

---

## 2. Thứ tự ưu tiên triển khai

- [ ] Tạo project ASP.NET Core Web API.
- [ ] Kết nối PostgreSQL + migration.
- [ ] Seed admin user tối thiểu + catalog mẫu nếu cần.
- [ ] Auth: register/login + JWT.
- [ ] `/users/me`.
- [ ] Public marketplace catalog: `/plants`.
- [ ] User plant CRUD: `/my-plants`.
- [ ] Reminder CRUD: `/reminders`.
- [ ] AI Chat ưu tiên cao: `POST /ai/chat` dùng cây đã chọn.
- [ ] AI dialog history: `GET /ai/dialogs`, `GET /ai/dialogs/:id`.
- [ ] Lightweight Admin: summary/users/user-plants.
- [ ] Admin marketplace display CRUD.
- [ ] Admin AI dialogs + AI config status.
- [ ] AI Diagnosis: `POST /ai/diagnose`.
- [ ] Feedback: `POST /feedback`.
- [ ] Optional/future: forgot password.

---

## 3. Auth và role assumptions

- [ ] Login/register trả về `{ user, accessToken }`.
- [ ] `user.role` chỉ dùng `USER` hoặc `ADMIN`.
- [ ] Protected user APIs cần JWT.
- [ ] Admin APIs cần JWT + role `ADMIN`.
- [ ] Không cần refresh token cho MVP.
- [ ] Không cần OAuth/social login.
- [ ] Forgot password là optional/future, không chặn Phase 2.

Ví dụ auth header:

```http
Authorization: Bearer <accessToken>
```

User shape FE cần:

```json
{
  "id": "usr_001",
  "name": "Nguyen Van A",
  "email": "user@example.com",
  "role": "USER",
  "avatarUrl": null,
  "phone": null,
  "createdAt": "2026-05-14T10:00:00.000Z"
}
```

---

## 4. Required endpoints theo module

### Auth/User

- [ ] `POST /auth/register`
- [ ] `POST /auth/login`
- [ ] `POST /auth/forgot-password` optional/future
- [ ] `GET /users/me`
- [ ] `PUT /users/me`

### Marketplace catalog contact-only

- [ ] `GET /plants`
- [ ] `GET /plants/:id`

### My Plants

- [ ] `GET /my-plants`
- [ ] `POST /my-plants`
- [ ] `GET /my-plants/:id`
- [ ] `PUT /my-plants/:id`
- [ ] `DELETE /my-plants/:id`

### Reminders

- [ ] `GET /reminders`
- [ ] `POST /reminders`
- [ ] `PUT /reminders/:id`
- [ ] `DELETE /reminders/:id`

### AI

- [ ] `POST /ai/diagnose`
- [ ] `POST /ai/chat`
- [ ] `GET /ai/dialogs`
- [ ] `GET /ai/dialogs/:id`

### Feedback

- [ ] `POST /feedback`

### Lightweight Admin

- [ ] `GET /admin/summary`
- [ ] `GET /admin/users`
- [ ] `GET /admin/users/:id`
- [ ] `PUT /admin/users/:id/status`
- [ ] `GET /admin/user-plants`
- [ ] `GET /admin/user-plants/:id`
- [ ] `PUT /admin/user-plants/:id/status`
- [ ] `GET /admin/marketplace-plants`
- [ ] `POST /admin/marketplace-plants`
- [ ] `PUT /admin/marketplace-plants/:id`
- [ ] `DELETE /admin/marketplace-plants/:id`
- [ ] `GET /admin/ai-dialogs`
- [ ] `GET /admin/ai-dialogs/:id`
- [ ] `GET /admin/ai-config/status`

---

## 5. Request/response examples quan trọng

### Register/Login response

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

### Create my plant request

```json
{
  "name": "Monstera near window",
  "species": "Monstera Deliciosa",
  "location": "Desk corner",
  "imageUrl": "https://example.com/my-plant.jpg",
  "notes": "Likes indirect light."
}
```

### My plants response

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

### AI Diagnose request

```json
{
  "plantId": "myplant_001",
  "imageBase64": "data:image/jpeg;base64,...",
  "question": "What is wrong with this plant?"
}
```

### AI Chat request

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

### AI Chat response

```json
{
  "dialogId": "dlg_001",
  "plantId": "myplant_001",
  "reply": "Water only when the top 2-3 cm of soil is dry.",
  "disclaimer": "AI advice is for reference only.",
  "createdAt": "2026-05-15T03:42:00.000Z"
}
```

### AI dialog list response

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

### Marketplace plant create/update request

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

### Catalog list response

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

### Admin summary response

```json
{
  "users": 12,
  "userPlants": 30,
  "marketplacePlants": 8,
  "aiDialogs": 20,
  "aiConfigured": true
}
```

### AI config status response

```json
{
  "provider": "gemini",
  "configured": true,
  "lastCheckedAt": "2026-05-15T03:42:00.000Z"
}
```

### Standard error response

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

---

## 6. Status fields FE đang kỳ vọng

- [ ] User status cho admin: `active`, `inactive`, `banned`.
- [ ] User plant status: `healthy`, `needs-water`, `issue`, `active`, `inactive`, `archived`.
- [ ] Marketplace plant status: `active`, `inactive`.
- [ ] AI config: `configured: true | false`.
- [ ] Role: `USER`, `ADMIN`.
- [ ] Nên giữ lowercase cho status, uppercase cho role.

---

## 7. AI Diagnosis requirements

- [ ] Frontend không gọi AI provider trực tiếp.
- [ ] Backend nhận request từ `/ai/diagnose`.
- [ ] Backend tự gọi provider bằng key trong `.env`.
- [ ] Nếu có `plantId`, validate cây thuộc user hiện tại.
- [ ] Có thể lưu `AiDiagnosisLog` cơ bản.
- [ ] Response ổn định, không trả raw provider payload nếu payload phức tạp.
- [ ] Có disclaimer AI chỉ để tham khảo.

---

## 8. AI Chat requirements

- [ ] `POST /ai/chat` phải dùng cây người dùng đã chọn.
- [ ] Request có `plantId` và `plantContext`.
- [ ] Validate `plantId` thuộc user hiện tại.
- [ ] Prompt chỉ xoay quanh chăm sóc cây.
- [ ] Không biến thành chatbot tổng quát.
- [ ] Lưu basic dialog/message history.
- [ ] `GET /ai/dialogs` trả list dialog của user hiện tại.
- [ ] `GET /ai/dialogs/:id` chỉ trả dialog thuộc user hiện tại.
- [ ] Không cần complex long-term memory.

---

## 9. Admin MVP requirements

- [ ] Admin nhẹ, đủ màn hình hiện tại.
- [ ] `GET /admin/summary` trả counts/status đơn giản.
- [ ] Users: list/detail/update status.
- [ ] User plants: list/detail/update status.
- [ ] Marketplace plants: CRUD record hiển thị.
- [ ] AI dialogs: list/detail để xem lịch sử cơ bản.
- [ ] AI config: status only.
- [ ] Không có raw API key trong response.
- [ ] Không có màn sửa API key.
- [ ] Không làm analytics phức tạp.
- [ ] Không làm enterprise permission matrix.

---

## 10. Marketplace requirements

- [ ] Marketplace chỉ là catalog hiển thị.
- [ ] Plant/product có `name`, `description`, `imageUrl`, `priceText`, `careLevel`, `contactUrl`.
- [ ] Public xem list/detail.
- [ ] Admin CRUD catalog record.
- [ ] Contact qua Zalo/Facebook/contact URL.
- [ ] Không có cart.
- [ ] Không có checkout.
- [ ] Không có payment.
- [ ] Không có orders.
- [ ] Không có shipping.

---

## 11. Out-of-scope APIs/features

Không build cho MVP:

- Cart APIs.
- Checkout APIs.
- Payment APIs.
- Order APIs.
- Shipping APIs.
- Refund APIs.
- API key edit/update APIs.
- API key editing UI.
- Enterprise admin dashboard.
- Advanced analytics.
- Finance/order dashboards.
- Social login.
- Refresh token/session cookie flow.
- Realtime websocket chat.
- Complex AI memory.
- General-purpose chatbot.
- QR/NFC/workspace scanner APIs.

---

## 12. Notes về frontend mock flags

Frontend hiện có mock-first behavior vì backend chưa triển khai.

```env
VITE_USE_MOCK_AI=true
VITE_USE_MOCK_ADMIN=true
```

- [ ] Chỉ set `VITE_USE_MOCK_AI=false` sau khi các endpoint sau ổn định:
  - `POST /ai/chat`
  - `GET /ai/dialogs`
  - `GET /ai/dialogs/:id`
  - `POST /ai/diagnose` nếu giữ trong MVP
  - `GET /admin/ai-config/status`
- [ ] Chỉ set `VITE_USE_MOCK_ADMIN=false` sau khi `/admin/*` endpoints ổn định.
- [ ] Nếu backend tạm unavailable, FE service vẫn có thể fallback mock nhỏ trong Phase 2 prep.
- [ ] Không đưa AI API key vào frontend `.env`.
- [ ] Không thêm UI sửa API key.
