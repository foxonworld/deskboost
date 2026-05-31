# DeskBoost API Smoke Test Nhanh

Nguon tham chieu: Swagger runtime tai `http://localhost:5272/swagger/v1/swagger.json`, controllers trong `BE/DeskBoost/DeskBoost.API/Controllers`, request contracts trong `BE/DeskBoost/DeskBoost.API/Contracts/Requests`.

## Gia dinh va pham vi

- `BASE_URL` mac dinh: `http://localhost:5272`.
- Tat ca endpoint protected dung header `Authorization: Bearer <accessToken>`.
- Khong hardcode secret that. Dung user test moi, hoac truyen `SMOKE_EMAIL` / `SMOKE_PASSWORD`.
- Admin endpoint can token co role `ADMIN`; neu khong co `ADMIN_ACCESS_TOKEN` thi chi kiem tra expected `401/403`.
- AI diagnose va upload can multipart file that; smoke test tu dong chi nen chay khi co file anh mau.
- Endpoint diagnosis legacy trong Swagger hien la `POST /api/Diagnosis` theo route `api/[controller]`; ASP.NET thuong case-insensitive, nhung FE nen uu tien endpoint moi `POST /api/ai/diagnose`.

## Thu tu test de xuat

1. Health/Swagger
   - `GET /swagger/v1/swagger.json`
   - Expected: `200`, co `paths`.

2. Auth flow
   - Dang ky user smoke moi bang `POST /api/auth/register`, hoac login bang `POST /api/auth/login`.
   - Luu `accessToken` va `refreshToken`.
   - Goi `GET /api/auth/me`.
   - Expected: `201` register hoac `200` login/me; response auth co `accessToken`, `refreshToken`, `user`.

3. Marketplace public
   - `GET /api/marketplace-plants?page=1&limit=12`.
   - Neu co item, test tiep `GET /api/marketplace-plants/{id}`.
   - Expected: `200`, response dang `{ items, pagination }`.

4. User profile
   - `GET /api/users/me`.
   - Optional: `PUT /api/users/me`.
   - Expected: `200`.

5. My Plants CRUD
   - `GET /api/my-plants`.
   - `POST /api/my-plants`.
   - `GET /api/my-plants/{id}`.
   - `PUT /api/my-plants/{id}`.
   - Expected: `200/201`, response plant co `id`, `name`, `status`.

6. Reminders CRUD va calendar
   - Tao reminder bang plant id vua tao: `POST /api/reminders`.
   - `GET /api/reminders`.
   - `PUT /api/reminders/{id}`.
   - `PUT /api/reminders/{id}/done`.
   - `GET /api/reminders/{id}/calendar`.
   - `GET /api/reminders/{id}/calendar?format=ics`.
   - Expected: JSON calendar `200` co `provider`, `title`, `startsAt`, `endsAt`, `icsUrl`; ICS `200` content-type `text/calendar`, body co `BEGIN:VCALENDAR`.
   - Day la endpoint dac biet can FE smoke vi backend chua biet test Google Calendar. Hien endpoint tao ICS noi bo, khong goi Google Calendar API truc tiep.

7. Feedback
   - `POST /api/feedback`.
   - Expected: `201`, response co `id` va `message`.

8. Upload
   - `POST /api/upload/image` multipart field `file`.
   - Expected: `200`, response `{ url }`.
   - Loi thuong gap: file rong, content-type khong nam trong `image/jpeg`, `image/png`, `image/webp`, `image/gif`, file qua 5MB, Cloudinary/storage config loi.

9. AI chat/diagnose
   - `POST /api/ai/chat`.
   - `GET /api/ai/dialogs`.
   - Neu co dialog id: `GET /api/ai/dialogs/{id}`.
   - `POST /api/ai-chat/send` la legacy.
   - `POST /api/ai/diagnose` multipart field `image`, optional `plantId`.
   - Expected chat: `200`, response co `dialogId`, `reply`, `disclaimer`.
   - Loi thuong gap: AI provider/API key chua config, message rong `400`, plant id khong thuoc user `404`.

10. Admin
    - Dung token ADMIN: `GET /api/admin/summary`, `GET /api/admin/users`, `GET /api/admin/user-plants`, `GET /api/admin/marketplace-plants`, `GET /api/admin/ai-config/status`.
    - Expected voi admin token: `200`.
    - Expected voi user token thuong: `403` hoac `401`.

## Request body mau

### Auth

```json
{
  "email": "deskboost.smoke@example.test",
  "password": "SmokeTest!2026",
  "confirmPassword": "SmokeTest!2026",
  "fullName": "DeskBoost Smoke Tester"
}
```

```json
{
  "email": "deskboost.smoke@example.test",
  "password": "SmokeTest!2026"
}
```

### Users

```json
{
  "name": "DeskBoost Smoke Tester",
  "avatarUrl": null,
  "phone": "0900000000"
}
```

### Plants

`POST /api/plants` dung model cu hon va co `plantSpeciesId`:

```json
{
  "plantSpeciesId": "00000000-0000-0000-0000-000000000000",
  "name": "Smoke Desk Plant",
  "imageUrl": null,
  "location": "Desk",
  "wateringCycleDays": 3,
  "notes": "Created by API smoke test"
}
```

`POST /api/my-plants` la luong de smoke test CRUD nhanh:

```json
{
  "name": "Smoke Pothos",
  "species": "Epipremnum aureum",
  "location": "Desk",
  "imageUrl": null,
  "notes": "Created by API smoke test"
}
```

```json
{
  "name": "Smoke Pothos Updated",
  "species": "Epipremnum aureum",
  "location": "Window",
  "imageUrl": null,
  "status": "healthy",
  "notes": "Updated by API smoke test"
}
```

### Reminder

```json
{
  "plantId": "<myPlantId>",
  "title": "Water smoke plant",
  "careType": "watering",
  "dueAt": "2026-06-01T09:00:00Z",
  "repeatRule": "weekly",
  "notes": "Created by API smoke test"
}
```

```json
{
  "title": "Water smoke plant updated",
  "careType": "watering",
  "dueAt": "2026-06-02T09:00:00Z",
  "repeatRule": "weekly",
  "notes": "Updated by API smoke test"
}
```

### Feedback

```json
{
  "message": "Smoke test feedback",
  "rating": 5
}
```

### AI Chat

```json
{
  "plantId": null,
  "message": "Give me one quick watering tip for a desk pothos.",
  "history": [],
  "plantContext": {
    "id": null,
    "nickname": "Smoke Pothos",
    "name": "Pothos",
    "species": "Epipremnum aureum",
    "status": "healthy",
    "light": "indirect",
    "water": "weekly",
    "notes": "Smoke test context"
  }
}
```

### Admin Marketplace Upsert

```json
{
  "name": "Smoke Marketplace Plant",
  "description": "Created by admin smoke test",
  "imageUrl": null,
  "priceText": "Contact",
  "careLevel": "easy",
  "light": "Indirect",
  "water": "Weekly",
  "contactUrl": null,
  "status": "active"
}
```

## Loi thuong gap

- `401`: thieu bearer token, token het han, token khong dung issuer/audience.
- `403`: token hop le nhung role khong du, thuong gap voi `/api/admin/*`.
- `400`: request body thieu field bat buoc nhu `email`, `password`, `fullName`, `name`, `title`, `message`.
- `404`: id khong ton tai hoac resource khong thuoc user dang login.
- `500`: DB/storage/AI provider config loi, migration/data seed thieu, hoac third-party service unreachable.
- Calendar ICS: neu `format=ics`, response la file `text/calendar`, khong phai JSON. FE can xu ly blob/download.

## Lenh chay script tu dong

PowerShell tu mac dinh `BASE_URL=http://localhost:5272`:

```powershell
.\BE\DeskBoost\DeskBoost.API\scripts\api-smoke-test.ps1
```

Dung user test co san:

```powershell
$env:BASE_URL = "http://localhost:5272"
$env:SMOKE_EMAIL = "deskboost.smoke@example.test"
$env:SMOKE_PASSWORD = "SmokeTest!2026"
.\BE\DeskBoost\DeskBoost.API\scripts\api-smoke-test.ps1
```

Test admin endpoint voi token rieng:

```powershell
$env:ADMIN_ACCESS_TOKEN = "<admin-access-token>"
.\BE\DeskBoost\DeskBoost.API\scripts\api-smoke-test.ps1
```

