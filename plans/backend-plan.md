# Kế hoạch Backend DeskBoost MVP

> Cập nhật theo scope EXE201 mới. Backend chưa triển khai. Không tạo backend code trong bước này.

---

## 1. Tổng quan

Backend DeskBoost MVP dùng ASP.NET Core Web API + PostgreSQL, bám sát `docs/api-contract.md`.

Mục tiêu:

- Hỗ trợ user MVP hiện tại.
- Hỗ trợ AI Diagnosis + AI Chat theo ngữ cảnh cây.
- Hỗ trợ lightweight Admin Dashboard.
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
- AI provider key: backend `.env` only

Không dùng NestJS/Prisma cho scope mới.

---

## 3. Module/API area

| Area      | Scope                                                |
| --------- | ---------------------------------------------------- |
| Auth      | register, login, forgot password                     |
| Users     | current profile, admin user list/detail/status       |
| Plants    | public marketplace catalog, user plants              |
| Reminders | user care reminders                                  |
| AI        | diagnosis, plant-specific chat, basic dialog history |
| Feedback  | user/visitor feedback                                |
| Admin     | lightweight management screens only                  |

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
CatalogPlant powers simple marketplace
AiDialog belongs to User and optionally UserPlant
Feedback optionally belongs to User
```

User fields must support simple role:

```txt
role: USER | ADMIN
```

---

## 5. Required endpoint groups

Implement only endpoints in `docs/api-contract.md`:

```txt
/auth/*
/users/me
/plants
/my-plants
/reminders
/ai/diagnose
/ai/chat
/ai/dialogs
/feedback
/admin/*
```

Admin routes require `ADMIN`.

---

## 6. AI scope

AI Diagnosis:

- Accept image base64 or image URL.
- Use selected plant when `plantId` exists.
- Save basic diagnosis log if practical.

AI Chat:

- Require selected existing plant.
- Build prompt from that plant's info.
- Save basic dialog/message history.
- Do not create general-purpose chatbot.
- Do not implement complex long-term memory.

AI config:

- Store keys server-side only.
- Admin endpoint returns status only: provider/configured/last checked.
- Never return raw key.

---

## 7. Marketplace scope

Included:

- Public catalog list/detail.
- Price text.
- Zalo/Facebook contact URL.
- Admin CRUD for display catalog records.

Excluded:

- Cart
- Checkout
- Payment
- Orders
- Shipping
- Refund

---

## 8. Lightweight admin scope

Admin MVP endpoints support:

- User management.
- User plant management.
- Plant status management.
- Marketplace plant management.
- AI dialog history.
- AI config status.

Do not add:

- Advanced analytics.
- Enterprise permission matrix.
- Finance/order dashboards.
- Raw API key editor.

---

## 9. Implementation order

1. Create ASP.NET Core Web API project structure.
2. Configure PostgreSQL connection and migrations.
3. Implement auth with JWT + `USER` / `ADMIN` roles.
4. Implement user profile endpoints.
5. Implement public marketplace catalog endpoints.
6. Implement user plants endpoints.
7. Implement reminders endpoints.
8. Implement AI diagnosis endpoint through backend provider proxy.
9. Implement AI chat endpoint with plant context.
10. Implement basic AI dialog history endpoints.
11. Implement feedback endpoint.
12. Implement lightweight admin endpoints.
13. Verify API response/error shapes match `docs/api-contract.md`.
14. Enable CORS for frontend origin.

---

## 10. Scope guardrails

- `docs/api-contract.md` is the API source of truth.
- Keep MVP practical for EXE201.
- Do not add ecommerce transaction workflows.
- Do not expose secrets.
- Do not overbuild admin.
- Do not overbuild AI memory.
