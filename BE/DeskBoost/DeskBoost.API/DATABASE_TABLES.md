# DeskBoost — Giải thích các bảng trong Database

> Mọi bảng đều có 3 cột chung từ `BaseEntity`:
> - `Id` (uuid) — khóa chính, tự sinh
> - `CreatedAt` (timestamp) — thời điểm tạo
> - `UpdatedAt` (timestamp, nullable) — thời điểm cập nhật cuối

---

## Sơ đồ quan hệ tổng quát

```
Users ──────────────────────────────────────┐
  │                                         │
  ├─── RefreshTokens                        │
  │                                         ▼
  └─── Plants (UserId nullable) ◄─── PlantClaimCodes
         │                              │
         │                         MarketplaceItems ◄── Feedbacks
         ├─── Reminders
         ├─── DiagnosisResults
         ├─── ChatHistories (cũ)
         ├─── AiDialogs ──── AiMessages
         └─── PlantSpecies (lookup)
```

---

## 1. `Users` — Tài khoản người dùng

Lưu tất cả tài khoản: cả admin lẫn user thường.

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `Email` | string | Email đăng nhập, duy nhất |
| `PasswordHash` | string | Mật khẩu đã hash (bcrypt) |
| `FullName` | string | Họ tên hiển thị |
| `Role` | enum | `USER` hoặc `ADMIN` |
| `Status` | enum | `Active` / `Inactive` |
| `IsActive` | bool | Tài khoản có được dùng không |
| `AvatarUrl` | string? | Link ảnh đại diện |
| `Phone` | string? | Số điện thoại |

---

## 2. `RefreshTokens` — Token làm mới phiên đăng nhập

Mỗi lần login tạo 1 refresh token. Dùng để cấp lại access token mới khi hết hạn.

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `UserId` | uuid | FK → Users |
| `Token` | string | Chuỗi token ngẫu nhiên |
| `ExpiresAt` | datetime | Hết hạn sau bao lâu (mặc định 7 ngày) |
| `IsRevoked` | bool | Token đã bị thu hồi chưa (logout) |
| `RevokedAt` | datetime? | Thời điểm thu hồi |

---

## 3. `MarketplaceItems` — Sản phẩm đang bán

Danh mục sản phẩm mà shop bán — cây, đất, phân bón, chậu...
**Không phải cây vật lý**, chỉ là loại sản phẩm.

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `Name` | string | Tên sản phẩm, ví dụ "Tim Tròn - Size M" |
| `Description` | string? | Mô tả chi tiết |
| `Category` | enum | `Plant` / `Fertilizer` / `Pot` / `Soil` / `Accessory` / `Other` |
| `ImageUrl` | string? | Ảnh đại diện sản phẩm |
| `PriceText` | string? | Giá hiển thị, ví dụ "120.000đ" |
| `ContactUrl` | string? | Link liên hệ mua (Zalo, Facebook...) |
| `Status` | enum | `Active` / `Inactive` — ẩn/hiện trên marketplace |
| `CareLevel` | string? | Mức độ chăm sóc: "1"=dễ, "2"=trung bình, "3"=khó |
| `Light` | string? | Nhu cầu ánh sáng: "1"=ít, "2"=vừa, "3"=nhiều |
| `Water` | string? | Lượng nước tưới: "1/2", "1", "2"... |
| `AttributesJson` | string? | Thuộc tính mở rộng dạng JSON (dự phòng) |

---

## 4. `Plants` — Cây vật lý (Plant Inventory + MyPlants)

**Bảng trung tâm.** Một bản ghi = một cây thật đang tồn tại.
- `UserId = null` → cây đang trong kho (inventory, chưa có chủ)
- `UserId != null` → cây đã có chủ (MyPlant của user đó)

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `UserId` | uuid? | FK → Users. null = chưa có chủ |
| `MarketplaceItemId` | uuid? | FK → MarketplaceItems. Cây thuộc loại sản phẩm nào |
| `ClaimCodeId` | uuid? | FK → PlantClaimCodes. Mã claim gắn với cây này |
| `PlantSpeciesId` | uuid? | FK → PlantSpecies. Loài khoa học (dùng cho AI chat) |
| `Name` | string | Tên cây, ví dụ "Tim Tròn #001" |
| `Nickname` | string? | Tên thân mật user đặt sau khi claim, ví dụ "Bé Tim" |
| `SpeciesName` | string? | Tên loài (text tự do, không cần đúng khoa học) |
| `ImageUrl` | string? | Ảnh cây |
| `Location` | string? | Vị trí cây đặt, ví dụ "Bàn làm việc" |
| `CareLevel` | string? | Mức chăm sóc (lấy từ MarketplaceItem nếu không ghi đè) |
| `Light` | string? | Nhu cầu ánh sáng |
| `Water` | string? | Lượng nước |
| `WateringCycleDays` | int | Tưới mỗi bao nhiêu ngày (mặc định 3) |
| `LastCondition` | enum | Tình trạng lần chẩn đoán gần nhất: `Healthy` / `Warning` / `Critical` |
| `Status` | enum | `Healthy` / `NeedsWater` / `Issue` / `Active` / `Inactive` / `Archived` |
| `Notes` | string? | Ghi chú nội bộ |
| `OwnershipCode` | string? | Mã sở hữu dạng "DB-XXXX-XXXX" |
| `OwnershipStatus` | enum | `Unclaimed` / `Pending` / `Claimed` |
| `IsClaimed` | bool | Cây đã được claim chưa |
| `ClaimedAt` | datetime? | Thời điểm claim |

---

## 5. `PlantClaimCodes` — Mã để khách claim cây

Mỗi cây trong kho có 1 claim code. Admin gửi code cho khách, khách dùng để nhận cây.

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `Code` | string | Mã dạng "DB-ABCD-1234", duy nhất |
| `MarketplaceItemId` | uuid | FK → MarketplaceItems. Mã này thuộc loại sản phẩm nào |
| `PlantId` | uuid? | FK → Plants. Cây vật lý gắn với mã này |
| `Status` | enum | `Unclaimed` / `Claimed` / `Cancelled` / `Expired` |
| `BuyerContact` | string? | Thông tin liên hệ người mua (admin ghi thêm) |
| `Note` | string? | Ghi chú nội bộ |
| `ClaimedByUserId` | uuid? | FK → Users. Ai đã claim |
| `ClaimedPlantId` | uuid? | FK → Plants. Cây nào đã được claim bởi mã này |
| `ClaimedAt` | datetime? | Thời điểm claim thành công |

---

## 6. `PlantSpecies` — Danh mục loài cây (khoa học)

Bảng tra cứu thông tin khoa học về các loài cây. Dùng chủ yếu để AI chat biết đặc điểm loài.

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `Name` | string | Tên khoa học, ví dụ "Monstera deliciosa" |
| `VietnameseName` | string | Tên tiếng Việt, ví dụ "Cây lá lỗ" |
| `Description` | string? | Mô tả chung về loài |
| `CareInstructions` | string? | Hướng dẫn chăm sóc chi tiết (AI đọc để tư vấn) |
| `CommonDiseases` | string? | Bệnh thường gặp dạng JSON (AI đọc khi chẩn đoán) |
| `ImageUrl` | string? | Ảnh minh hoạ |
| `IsActive` | bool | Có đang dùng không |

---

## 7. `Reminders` — Nhắc nhở chăm sóc cây

Lịch nhắc tưới nước, bón phân... cho từng cây của user.

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `PlantId` | uuid | FK → Plants |
| `UserId` | uuid | FK → Users |
| `Title` | string | Tiêu đề nhắc, ví dụ "Tưới nước bé Tim" |
| `CareType` | enum | `Watering` / `Fertilizing` / `Repotting` / `Other` |
| `DueAt` | datetime | Thời điểm cần làm |
| `RepeatRule` | enum? | `Daily` / `Weekly` / `Monthly`. null = không lặp |
| `Status` | enum | `Pending` / `Done` |
| `LastDoneAt` | datetime? | Lần cuối đã làm |
| `Notes` | string? | Ghi chú thêm |
| `IsSent` | bool | Đã gửi push notification chưa |
| `IsActive` | bool | Reminder còn hiệu lực không |

---

## 8. `DiagnosisResults` — Kết quả chẩn đoán bệnh cây

Lưu lại lịch sử mỗi lần AI chẩn đoán sức khoẻ cây qua ảnh.

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `PlantId` | uuid? | FK → Plants. null = chẩn đoán không gắn cây cụ thể |
| `ImageUrl` | string | URL ảnh đã upload để chẩn đoán |
| `Condition` | string | Kết quả tổng: `"Healthy"` / `"Warning"` / `"Critical"` |
| `DiseasesJson` | string | Danh sách bệnh phát hiện, dạng JSON array |
| `CausesJson` | string | Nguyên nhân, dạng JSON array |
| `TreatmentsJson` | string | Cách xử lý, dạng JSON array |
| `Confidence` | double | Độ tin cậy 0.0–1.0 (dưới ngưỡng 0.2 thì bỏ qua) |

---

## 9. `AiDialogs` + `AiMessages` — Lịch sử chat AI

`AiDialog` là một cuộc hội thoại. `AiMessage` là từng tin nhắn trong cuộc đó.

### AiDialogs
| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `UserId` | uuid | FK → Users |
| `PlantId` | uuid? | FK → Plants. null = chat chung, không gắn cây |
| `Title` | string | Tiêu đề cuộc trò chuyện |
| `LastMessage` | string | Nội dung tin nhắn cuối (dùng hiển thị preview) |

### AiMessages
| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `DialogId` | uuid | FK → AiDialogs |
| `Role` | enum | `User` / `Assistant` |
| `Content` | string | Nội dung tin nhắn |

---

## 10. `ChatHistories` — Chat cũ (deprecated)

Bảng lưu lịch sử chat theo kiểu cũ, mỗi dòng 1 tin nhắn không có grouping dialog.
Đã được thay bởi `AiDialogs` + `AiMessages`. **Không dùng thêm.**

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `PlantId` | uuid | FK → Plants |
| `UserId` | uuid | FK → Users |
| `Role` | string | `"user"` hoặc `"assistant"` |
| `Content` | string | Nội dung tin nhắn |

---

## 11. `Feedbacks` — Đánh giá sản phẩm

Review của khách hàng cho MarketplaceItem. Admin có thể tự tạo feedback (nhập tay từ mạng xã hội) hoặc user tự gửi.

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `MarketplaceItemId` | uuid? | FK → MarketplaceItems. null = feedback chung không gắn sản phẩm |
| `CustomerAlias` | string? | Tên ẩn danh người review, ví dụ "Chị Lan - HCM" |
| `Rating` | int? | Số sao 1–5 |
| `Comment` | string? | Nội dung đánh giá |
| `PurchaseChannel` | string? | Mua ở đâu: "Shopee", "Trực tiếp"... |
| `PublicImageUrlsJson` | string? | Ảnh hiển thị công khai, dạng JSON array URL |
| `EvidenceImageUrlsJson` | string? | Ảnh bằng chứng nội bộ admin giữ, dạng JSON array URL |
| `EvidenceNote` | string? | Ghi chú nội bộ admin về feedback này |
| `IsVerified` | bool | Admin đã xác minh đây là review thật chưa |
| `VerifiedAt` | datetime? | Thời điểm xác minh |
| `SourceType` | string | `"user"` = user tự gửi, `"admin"` = admin nhập tay |
| `CreatedByAdminId` | uuid? | FK → Users (Admin). Ai nhập nếu là admin-created |

---

## Tóm tắt quan hệ theo luồng claim

```
[Admin tạo MarketplaceItem "Tim Tròn" - category=plant]
        ↓
[Admin Generate Code]
        ↓
  Plants (UserId=null)  ←→  PlantClaimCodes (Status=Unclaimed)
        ↓
[Admin gửi code DB-XXXX-XXXX cho khách]
        ↓
[User nhập code → GET claim-preview]
        ↓
[User confirm → POST claim]
        ↓
  Plants (UserId=userId, IsClaimed=true)
  PlantClaimCodes (Status=Claimed, ClaimedByUserId=userId)
        ↓
  Reminders (lịch tưới nước...)
  AiDialogs (chat về cây...)
  DiagnosisResults (chụp ảnh chẩn đoán...)
```
