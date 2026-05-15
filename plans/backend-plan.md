# Kế hoạch Backend DeskBoost MVP

> Backend roadmap cấp cao. Backend chưa triển khai. Không tạo backend code trong bước này. API source of truth: `docs/api-contract.md`.

---

## 1. Tổng quan

Backend DeskBoost MVP dùng ASP.NET Core Web API + PostgreSQL, phục vụ frontend React 19 + Vite.

Mục tiêu:

- Hỗ trợ user MVP hiện tại.
- Hỗ trợ AI Diagnosis qua backend AI proxy.
- Hỗ trợ AI Chat theo ngữ cảnh cây đã chọn.
- Hỗ trợ lightweight Admin MVP.
- Hỗ trợ marketplace dạng xem thông tin + liên hệ.
- Không xây full ecommerce.
- Không xây enterprise admin.

---

## 2. Stack định hướng

- Framework: ASP.NET Core Web API
- Database: PostgreSQL
- Auth: JWT Bearer access token
- Roles: `USER` / `ADMIN`
- API style: REST + JSON
- Base path: `/api/v1`
- API contract: `docs/api-contract.md`
- AI provider key: backend `.env` only
- Frontend origin: Vite dev server, thường là `http://localhost:5173`

Không dùng NestJS/Prisma cho scope mới.

---

## 3. Module/API area

| Area        | Scope                                                                 |
| ----------- | --------------------------------------------------------------------- |
| Auth        | register, login; forgot password optional/future                      |
| Users       | current profile, admin user list/detail/status                        |
| Marketplace | public contact-only catalog, admin CRUD display records               |
| My Plants   | user-owned plant CRUD                                                 |
| Reminders   | user care reminders, mark-done, Google Calendar / `.ics` export       |
| AI          | diagnosis, plant-specific chat, basic dialog history                  |
| Feedback    | user/visitor feedback                                                 |
| Admin       | lightweight management screens only; no enterprise/finance dashboards |

---

## 4. Data model hướng dẫn

Suggested entities:

```txt
User
CatalogPlant
UserPlant
PlantStatus
Reminder
AiDiagnosisLog
AiDialog
AiDialogMessage
Feedback
```

Minimum relations:

```txt
User owns UserPlant
User owns Reminder
User owns AiDialog
UserPlant may have PlantStatus
CatalogPlant powers contact-only marketplace
AiDialog belongs to User and UserPlant
Feedback optionally belongs to User
```

User fields must support simple role:

```txt
role: USER | ADMIN
status: active | inactive | banned
```

UserPlant/admin status should stay simple and FE-compatible:

```txt
status: healthy | needs-water | issue | archived | active | inactive
```

CatalogPlant/admin marketplace status:

```txt
status: active | inactive
```

---

## 5. Required endpoint groups

Implement only endpoints in `docs/api-contract.md`:

```txt
/auth/register
/auth/login
/auth/forgot-password optional/future
/users/me
/plants
/my-plants
/reminders
/reminders/:id/done
/reminders/:id/calendar
/ai/diagnose
/ai/chat
/ai/dialogs
/feedback
/admin/*
```

Admin routes require `ADMIN`.

Forgot password is not Phase 2 blocker. Implement later if email/reset-token flow is ready.

---

## 6. Care Reminder scope

Care Reminder MVP includes:

- In-app reminder records for user-owned plants.
- List/create/update reminder endpoints.
- Mark reminder as done without deleting the reminder.
- Google Calendar / `.ics` export as the preferred external reminder method.
- Calendar event data containing title, plant name, care type, due date/time, timezone, and notes when available.

Backend endpoint expectations:

```txt
GET /reminders
POST /reminders
PUT /reminders/:id
PUT /reminders/:id/done
GET /reminders/:id/calendar
DELETE /reminders/:id
```

Optional enhancement only:

- Email reminder delivery if scheduler + email provider setup is already available.
- Email reminder is not a Phase 2 blocker.

Important guardrail:

- Browser notifications are not the main channel because users may close the web app or block permission.
- Do not build SMS, Zalo bot, Messenger bot, mobile push, or complex web push/service-worker notifications for MVP.

---

## 7. AI scope

AI Diagnosis:

- Endpoint: `POST /ai/diagnose`.
- Accept image base64 or image URL per contract.
- Use selected plant when `plantId` exists.
- Return stable JSON diagnosis result.
- Save basic diagnosis log if practical.

AI Chat:

- Endpoint: `POST /ai/chat`.
- Must use selected saved plant context: `plantId` + `plantContext`.
- Build prompt from selected plant info only.
- Keep replies plant-care-specific.
- Save basic dialog/message history.
- Do not create general-purpose chatbot.
- Do not implement complex long-term memory.

AI config:

- Store keys server-side only in backend `.env`.
- Admin endpoint returns status only: `provider`, `configured`, `lastCheckedAt`.
- Never return raw key.
- No API key editing UI/API in MVP.

---

## 8. Marketplace scope

Included:

- Public catalog list/detail.
- Price text.
- Zalo/Facebook/contact URL.
- Admin CRUD for display catalog records.

Excluded:

- Cart
- Checkout
- Payment
- Orders
- Shipping
- Refund
- Inventory/reservation transaction flow

---

## 9. Lightweight admin scope

Admin MVP endpoints support:

- Summary counts/status only.
- User list/detail/status.
- User plant list/detail/status.
- Marketplace plant CRUD for display catalog records.
- AI dialog history list/detail.
- AI config status.

Do not add:

- Advanced analytics.
- Enterprise permission matrix.
- Finance/order dashboards.
- Raw API key editor.
- Cart/order/payment/shipping management.

---

## 10. Implementation order based on frontend priority

1. Create ASP.NET Core Web API project structure.
2. Configure PostgreSQL connection, migrations, seed minimal catalog/admin user.
3. Configure CORS for React/Vite frontend origin.
4. Implement auth with JWT + `USER` / `ADMIN` roles: `POST /auth/register`, `POST /auth/login`.
5. Implement `/users/me` profile read/update.
6. Implement public marketplace catalog: `GET /plants`, `GET /plants/:id`.
7. Implement user plants CRUD: `/my-plants`.
8. Implement reminders: `/reminders`, mark-done, and Google Calendar / `.ics` export.
9. Implement highest FE priority AI Chat: `POST /ai/chat` with selected `plantId` + `plantContext`.
10. Implement user AI dialog history: `GET /ai/dialogs`, `GET /ai/dialogs/:id`.
11. Implement lightweight admin summary/users/user-plants endpoints.
12. Implement admin marketplace display CRUD.
13. Implement admin AI dialog endpoints + `GET /admin/ai-config/status`.
14. Implement/verify `POST /ai/diagnose` if image diagnosis remains MVP.
15. Implement feedback: `POST /feedback`.
16. Optional/future: email reminder delivery if backend scheduler/email setup is ready.
17. Optional/future: `POST /auth/forgot-password`.
18. Verify API response/error shapes match `docs/api-contract.md`.
19. Coordinate frontend mock flags: `VITE_USE_MOCK_AI=false`, `VITE_USE_MOCK_ADMIN=false` only after related backend endpoints are stable.

---

## 11. Scope guardrails

- `docs/api-contract.md` is the API source of truth.
- Keep MVP practical for EXE201.
- Keep admin lightweight.
- Keep marketplace contact-only.
- Do not add ecommerce transaction workflows.
- Do not build cart/checkout/payment/orders/shipping APIs.
- Do not expose secrets.
- Keep AI provider keys in backend `.env` only.
- Do not add API key editing UI/API.
- Do not overbuild AI memory.
- Do not add new features outside the current API contract.
- Reminder MVP external channel is Google Calendar / `.ics`, not browser notification dependency.
- Do not add SMS, Zalo bot, Messenger bot, mobile push, or complex web push notification systems.
