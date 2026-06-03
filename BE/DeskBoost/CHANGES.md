# DeskBoost Backend — Tổng hợp thay đổi

> Ngày thực hiện: 2026-06-03  
> Branch: dev

---

## Phần 1 — AI Quota + Diagnosis→Chat

### Mục tiêu
- Giới hạn số lần dùng AI chat/diagnosis theo ngày (reset theo timezone VN UTC+7)
- User chưa có cây claim: Chat 5 câu/ngày, Diagnosis 2 lần/ngày
- User có cây claim từ DeskBoost (qua claim code): Chat 30 câu/ngày, Diagnosis 5 lần/ngày
- Sau khi diagnosis xong, FE có thể gửi `diagnosisResultId` vào chat để AI hiểu ngữ cảnh
- Enforce quota ở BE, trả 429 khi hết lượt

---

### Files mới tạo

| File | Mô tả |
|---|---|
| `DeskBoost.Domain/Enums/AiFeature.cs` | Static constants: `"chat"` / `"diagnosis"` |
| `DeskBoost.Domain/Entities/AiUsage.cs` | Entity ghi lại mỗi lần dùng AI (UserId, Feature, PlantId, DiagnosisResultId, UsedAt) |
| `DeskBoost.Domain/Exceptions/AiQuotaExceededException.cs` | Exception mang thông tin quota để build 429 response |
| `DeskBoost.Application/Common/Models/AiQuotaDto.cs` | `AiQuotaFeatureInfo` (limit/used/remaining/resetAt) + `AiQuotaDto` |
| `DeskBoost.Application/Common/Interfaces/IAiQuotaService.cs` | Interface: `GetQuotaAsync`, `EnforceQuotaAsync`, `RecordUsageAsync` |
| `DeskBoost.Infrastructure/Services/AiQuotaService.cs` | Implementation: tính VN day range, check `hasVerifiedPlant` qua `ClaimCodeId` |
| `DeskBoost.Application/Features/AiQuota/Queries/GetAiQuotaQuery.cs` | Query + Handler cho `GET /api/ai/quota` |
| `DeskBoost.Infrastructure/Persistence/Configurations/AiUsageConfiguration.cs` | EF config với composite index `(UserId, Feature, UsedAt)` |

### Files đã sửa

| File | Thay đổi |
|---|---|
| `DeskBoost.Domain/Entities/DiagnosisResult.cs` | Thêm `UserId` để validate ownership khi chat từ diagnosis |
| `DeskBoost.Application/Common/Models/DiagnosisResultDto.cs` | Thêm `DiagnosisId` (trả về sau khi lưu entity) |
| `DeskBoost.Infrastructure/Persistence/Configurations/DiagnosisResultConfiguration.cs` | Thêm index cho `UserId` |
| `DeskBoost.Application/Common/Interfaces/IAppDbContext.cs` | Thêm `DbSet<AiUsage> AiUsages` |
| `DeskBoost.Infrastructure/Persistence/AppDbContext.cs` | Thêm `DbSet<AiUsage> AiUsages` |
| `DeskBoost.Application/Features/AiDialogs/Commands/SendAiChatCommand.cs` | Thêm `DiagnosisResultId` |
| `DeskBoost.Application/Features/AiDialogs/Commands/SendAiChatCommandHandler.cs` | Enforce quota → validate diagnosis ownership → inject diagnosis context vào system prompt → record usage |
| `DeskBoost.Application/Features/AiDiagnosis/Commands/DiagnosePlantCommandHandler.cs` | Enforce quota → set UserId trên entity → record usage → trả `DiagnosisId` |
| `DeskBoost.API/Contracts/Requests/AiRequests.cs` | Thêm `DiagnosisResultId` vào `AiChatRequest` |
| `DeskBoost.API/Controllers/AiController.cs` | Thêm `GET /api/ai/quota`, catch `AiQuotaExceededException` → 429, forward `DiagnosisResultId` |
| `DeskBoost.Infrastructure/DependencyInjection.cs` | Register `IAiQuotaService → AiQuotaService` |

### Migration
```
20260603115639_AddAiUsageAndQuota
```
- Tạo bảng `AiUsages` với FK đến Users/Plants/DiagnosisResults
- Thêm cột `UserId` vào bảng `DiagnosisResults`
- Index `IX_AiUsages_UserId_Feature_UsedAt`

---

### API mới / thay đổi

#### `GET /api/ai/quota` _(mới)_
```json
{
  "hasVerifiedPlant": false,
  "chat": { "limit": 5, "used": 2, "remaining": 3, "resetAt": "2026-06-04T00:00:00+07:00" },
  "diagnosis": { "limit": 2, "used": 0, "remaining": 2, "resetAt": "2026-06-04T00:00:00+07:00" }
}
```

#### `POST /api/ai/chat` _(cập nhật)_
- Nhận thêm `diagnosisResultId` (optional)
- Trả `429` khi hết quota:
```json
{
  "message": "Bạn nên chăm sóc 1 cây của DeskBoost để sử dụng đầy đủ AI.",
  "feature": "chat",
  "limit": 5,
  "used": 5,
  "remaining": 0,
  "hasVerifiedPlant": false
}
```

#### `POST /api/ai/diagnose` _(cập nhật)_
- Trả thêm `diagnosisId` trong response
- Trả `429` khi hết quota (cùng format trên)

---

### Logic quan trọng

**hasVerifiedPlant** = user có ít nhất 1 plant với `ClaimCodeId IS NOT NULL`  
→ Chỉ tính cây được claim qua mã DeskBoost, **không tính** cây tự thêm thủ công

**Quota reset timezone VN**:
```
VN now = UTC + 7h
Start of VN day (UTC) = nowVn.Date - 7h
resetAt = tomorrowMidnightVn với offset +07:00
```

**Luồng Diagnosis → Chat**:
1. FE gọi `POST /api/ai/diagnose` → nhận `diagnosisId`
2. FE gọi `POST /api/ai/chat` với `diagnosisResultId = diagnosisId`
3. BE load kết quả diagnosis → inject vào system prompt → AI tư vấn trong ngữ cảnh diagnosis

---

## Phần 2 — Notification (Admin → User)

### Mục tiêu
- Admin gửi thông báo cho tất cả user hoặc user cụ thể
- User lấy danh sách thông báo kèm trạng thái đã đọc chưa
- Không cần realtime/SignalR, REST polling là đủ

---

### Files mới tạo

| File | Mô tả |
|---|---|
| `DeskBoost.Domain/Entities/Notification.cs` | Entity: Title, Body, Type, TargetType, TargetUserIdsJson, CreatedByAdminId, IsActive |
| `DeskBoost.Domain/Entities/NotificationRead.cs` | Track ai đã đọc: NotificationId, UserId, ReadAt |
| `DeskBoost.Infrastructure/Persistence/Configurations/NotificationConfiguration.cs` | EF config + index IsActive, CreatedAt |
| `DeskBoost.Infrastructure/Persistence/Configurations/NotificationReadConfiguration.cs` | EF config, unique index `(NotificationId, UserId)` |
| `DeskBoost.Application/Common/Models/NotificationDto.cs` | `NotificationItemDto` (user), `AdminNotificationDto` (admin) |
| `DeskBoost.API/Contracts/Requests/NotificationRequests.cs` | `CreateNotificationRequest` |
| `DeskBoost.Application/Features/Notifications/Commands/CreateNotificationCommand.cs` | Tạo notification + serialize TargetUserIds thành JSON |
| `DeskBoost.Application/Features/Notifications/Commands/DeleteNotificationCommand.cs` | Soft delete: `IsActive = false` |
| `DeskBoost.Application/Features/Notifications/Commands/MarkNotificationReadCommand.cs` | Đánh dấu 1 notification đã đọc (idempotent) |
| `DeskBoost.Application/Features/Notifications/Commands/MarkAllNotificationsReadCommand.cs` | Đánh dấu tất cả notifications visible với user là đã đọc |
| `DeskBoost.Application/Features/Notifications/Queries/GetAdminNotificationsQuery.cs` | Admin lấy toàn bộ danh sách (kể cả inactive) |
| `DeskBoost.Application/Features/Notifications/Queries/GetUserNotificationsQuery.cs` | User lấy notifications của mình + `isRead` |
| `DeskBoost.API/Controllers/NotificationsController.cs` | 3 user endpoints |

### Files đã sửa

| File | Thay đổi |
|---|---|
| `DeskBoost.Application/Common/Interfaces/IAppDbContext.cs` | Thêm `DbSet<Notification>` và `DbSet<NotificationRead>` |
| `DeskBoost.Infrastructure/Persistence/AppDbContext.cs` | Thêm `DbSet<Notification>` và `DbSet<NotificationRead>` |
| `DeskBoost.API/Controllers/AdminController.cs` | Thêm 3 admin endpoints: GET, POST, DELETE `/api/admin/notifications` |

### Migration
```
20260603120225_AddNotifications
```
- Tạo bảng `Notifications`
- Tạo bảng `NotificationReads` với unique constraint `(NotificationId, UserId)`

---

### API mới

#### Admin `[Authorize(Roles="ADMIN")]`

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/api/admin/notifications` | Lấy danh sách tất cả notifications |
| `POST` | `/api/admin/notifications` | Tạo notification mới |
| `DELETE` | `/api/admin/notifications/{id}` | Soft delete (IsActive = false) |

**Request body** `POST /api/admin/notifications`:
```json
{
  "title": "Khuyến mãi tháng 6",
  "body": "Nội dung thông báo",
  "type": "promo",
  "targetType": "all",
  "targetUserIds": null
}
```
- `type`: `promo` | `care_tip` | `announcement`
- `targetType`: `all` | `specific`
- `targetUserIds`: bắt buộc khi `targetType = specific`

#### User `[Authorize]`

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/api/notifications` | Lấy notifications của user kèm `isRead` |
| `PATCH` | `/api/notifications/{id}/read` | Đánh dấu đã đọc 1 cái |
| `PATCH` | `/api/notifications/read-all` | Đánh dấu tất cả đã đọc |

**Response** `GET /api/notifications`:
```json
{
  "items": [
    {
      "id": "...",
      "title": "Khuyến mãi tháng 6",
      "body": "...",
      "type": "promo",
      "createdAt": "2026-06-03T10:00:00Z",
      "isRead": false
    }
  ]
}
```

---

### Logic quan trọng

**TargetUserIds** lưu dưới dạng JSON string trong DB, deserialize khi query:
- `targetType = "all"` → visible với mọi user
- `targetType = "specific"` → chỉ visible với user có ID trong `TargetUserIdsJson`

**isRead** tính bằng cách join với bảng `NotificationReads` — không tính trong DB, tính in-memory sau khi load

**MarkRead idempotent**: gọi nhiều lần không tạo duplicate record

---

## Tổng số files thay đổi

| Loại | Số lượng |
|---|---|
| Files mới tạo | 20 |
| Files đã sửa | 13 |
| Migrations mới | 2 |
