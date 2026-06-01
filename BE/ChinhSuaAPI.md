# Kế hoạch chỉnh sửa API cho flow MyPlants bằng QR/code

Tài liệu này mô tả ý tưởng sản phẩm và các thay đổi API đề xuất cho DeskBoost, để BE tham khảo khi phát triển flow người dùng nhận cây bằng QR/code sau khi mua cây từ admin.

Mục tiêu chính:

- Admin tạo cây bán trên marketplace.
- Admin tạo cây vật lý có QR/code ownership.
- User scan QR hoặc nhập code để claim cây.
- Sau khi claim, cây xuất hiện trong My Plants của user.
- User có thể đặt tên riêng, sửa vị trí, ghi chú, ảnh, reminder, AI chat, AI diagnosis.

---

## 1. Ý tưởng tổng quan

Hiện tại đang dễ bị nhầm giữa:

- `MarketplacePlant`
- `Plant`
- `MyPlants`
- legacy `/api/plants`

Hướng nên phát triển là tách rõ 3 lớp:

```text
MarketplacePlant
= bài đăng / listing cây đang bán ngoài marketplace

Plant Inventory / Physical Plant
= cây vật lý thật, có QR/code riêng, admin tạo

MyPlant
= cây vật lý sau khi user claim vào tài khoản
```

Flow sản phẩm:

```text
Admin tạo listing marketplace
        |
        v
Admin tạo cây vật lý từ listing đó
        |
        v
Backend sinh ownershipCode / QR
        |
        v
Khách mua cây
        |
        v
User scan QR hoặc nhập code
        |
        v
Backend claim cây cho user
        |
        v
Cây xuất hiện trong My Plants
        |
        v
User đặt nickname, location, notes, reminders, AI chat, diagnosis
```

Nói ngắn gọn:

```text
Marketplace = nơi bán
Plant Inventory = cây thật có mã QR
MyPlants = cây đã thuộc về user
```

---

## 2. Trạng thái hiện tại

### API hiện có liên quan

Admin hiện có:

```http
GET    /api/admin/summary
GET    /api/admin/users
GET    /api/admin/users/{id}
PUT    /api/admin/users/{id}/status

GET    /api/admin/user-plants
GET    /api/admin/user-plants/{id}
PUT    /api/admin/user-plants/{id}/status

GET    /api/admin/marketplace-plants
POST   /api/admin/marketplace-plants
PUT    /api/admin/marketplace-plants/{id}
DELETE /api/admin/marketplace-plants/{id}

GET    /api/admin/ai-dialogs
GET    /api/admin/ai-dialogs/{id}
GET    /api/admin/ai-config/status
```

User hiện có:

```http
GET    /api/my-plants
POST   /api/my-plants
GET    /api/my-plants/{id}
PUT    /api/my-plants/{id}
DELETE /api/my-plants/{id}
```

Marketplace public hiện có:

```http
GET /api/marketplace-plants
GET /api/marketplace-plants/{id}
```

Legacy hiện có:

```http
GET    /api/plants
POST   /api/plants
GET    /api/plants/{id}
PUT    /api/plants/{id}
DELETE /api/plants/{id}
```

`/api/plants` hiện không được FE dùng và nên coi là legacy/dư thừa.

---

## 3. Vấn đề cần giải quyết

### 3.1. MyPlants hiện giống user tự tạo cây

Hiện tại user có thể tạo cây trực tiếp bằng:

```http
POST /api/my-plants
```

Điều này phù hợp MVP/dev, nhưng không đúng với flow sản phẩm mới:

```text
Admin bán cây -> admin tạo QR/code -> user claim cây
```

### 3.2. Plant hiện bắt buộc có UserId

Hiện entity `Plant` đang có:

```csharp
public Guid UserId { get; set; }
```

Nếu admin tạo cây trước khi user claim, cây chưa có chủ. Vì vậy `UserId` nên nullable:

```csharp
public Guid? UserId { get; set; }
```

### 3.3. Admin user-plants và admin inventory nên tách nhau

Hiện admin có:

```http
GET /api/admin/user-plants
```

API này nên giữ để xem cây đã thuộc về user.

Nhưng cần thêm nhóm API mới để quản lý cây vật lý chưa claim hoặc đã claim:

```text
Admin Plant Inventory
= kho cây thật có QR/code
```

### 3.4. `/api/plants` dễ gây nhầm và có rủi ro

`/api/plants` đang trùng vai trò với `/api/my-plants`.

Khuyến nghị:

- Deprecate hoặc xóa `/api/plants`.
- Nếu chưa xóa ngay, phải check ownership ở detail/update/delete.

---

## 4. Domain model đề xuất

### 4.1. MarketplacePlant

Dùng cho bài đăng bán hàng.

```text
MarketplacePlant
- Id
- Name
- Description
- ImageUrl
- PriceText
- CareLevel
- Light
- Water
- ContactUrl
- Status
```

Vai trò:

```text
Hiển thị ngoài marketplace.
Không đại diện cho cây vật lý cụ thể.
Không phải cây của user.
```

### 4.2. Plant

Dùng cho cây vật lý thật, có thể chưa claim hoặc đã claim.

Đề xuất field:

```text
Plant
- Id
- UserId?                  nullable, null nếu chưa claim
- MarketplacePlantId?      liên kết listing nguồn nếu có
- PlantSpeciesId?
- Name                     tên gốc/admin đặt
- SpeciesName?
- ImageUrl
- Location?
- WateringCycleDays
- LastCondition
- Status
- Notes?
- OwnershipCode
- OwnershipStatus          Unclaimed / Claimed / Revoked
- IsClaimed
- ClaimedAt?
- CreatedAt
- UpdatedAt
```

Ý nghĩa:

```text
UserId == null
=> cây đang nằm trong kho/admin inventory, chưa thuộc user

UserId != null
=> cây đã được claim, xuất hiện trong MyPlants của user
```

### 4.3. MyPlant DTO

`MyPlantDto` nên trả đủ thông tin để FE hiển thị profile cây, QR ownership, reminders, AI context.

Đề xuất:

```text
MyPlantDto
- id
- name
- nickname?                nếu muốn tách tên user đặt riêng
- species
- plantSpeciesId?
- location
- imageUrl
- status
- lastCondition
- wateringCycleDays
- notes
- ownershipCode
- ownershipStatus
- isClaimed
- claimedAt
- createdAt
- updatedAt
```

Nếu chưa muốn thêm `nickname` riêng, có thể dùng `Name` là tên user chỉnh sửa sau claim.

---

## 5. API cần thêm

## 5.1. Admin Plant Inventory

Nên dùng tên rõ nghĩa:

```http
/api/admin/plant-inventory
```

Tên này tránh nhầm với:

- `/api/admin/user-plants`
- `/api/admin/marketplace-plants`
- legacy `/api/plants`

### GET /api/admin/plant-inventory

Mục đích:

Admin xem toàn bộ cây vật lý đã tạo QR/code.

Query gợi ý:

```http
GET /api/admin/plant-inventory?status=unclaimed
GET /api/admin/plant-inventory?status=claimed
GET /api/admin/plant-inventory?marketplacePlantId=...
```

Response:

```json
{
  "items": [
    {
      "id": "plant-id",
      "marketplacePlantId": "listing-id",
      "name": "Monstera Deliciosa",
      "imageUrl": "...",
      "ownershipCode": "DB-7F92-KLAQ",
      "ownershipStatus": "unclaimed",
      "isClaimed": false,
      "claimedAt": null,
      "userId": null,
      "userEmail": null,
      "createdAt": "2026-06-01T00:00:00Z"
    }
  ]
}
```

### POST /api/admin/plant-inventory

Mục đích:

Admin tạo cây vật lý và sinh ownership code.

Body:

```json
{
  "marketplacePlantId": "uuid optional",
  "plantSpeciesId": "uuid optional",
  "name": "Monstera Deliciosa",
  "speciesName": "Monstera",
  "imageUrl": "...",
  "wateringCycleDays": 3,
  "notes": "Batch 06/2026"
}
```

Response:

```json
{
  "id": "plant-id",
  "name": "Monstera Deliciosa",
  "ownershipCode": "DB-7F92-KLAQ",
  "ownershipStatus": "unclaimed",
  "isClaimed": false,
  "qrClaimUrl": "https://deskboost.../#/claim/DB-7F92-KLAQ"
}
```

Backend cần:

- Sinh `OwnershipCode` unique.
- Set `UserId = null`.
- Set `OwnershipStatus = Unclaimed`.
- Set `IsClaimed = false`.

### GET /api/admin/plant-inventory/{id}

Mục đích:

Admin xem chi tiết cây vật lý, kể cả claim status.

### PUT /api/admin/plant-inventory/{id}

Mục đích:

Admin sửa thông tin cây vật lý trước hoặc sau khi claim.

Lưu ý:

- Nếu cây đã claim, nên hạn chế sửa các field có thể làm user bị bất ngờ.
- Có thể cho sửa field admin-only như source listing, notes nội bộ.

### DELETE /api/admin/plant-inventory/{id}

Mục đích:

Admin xóa cây vật lý.

Rule đề xuất:

```text
Nếu cây chưa claim:
- cho delete

Nếu cây đã claim:
- không hard delete
- trả 409 hoặc chuyển status Revoked/Archived
```

### POST /api/admin/plant-inventory/{id}/regenerate-code

Mục đích:

Sinh lại ownership code nếu mã cũ bị lộ hoặc in sai.

Rule đề xuất:

```text
Chỉ cho regenerate nếu cây chưa claim.
Nếu đã claim -> 409 Conflict.
```

---

## 5.2. User claim API

### GET /api/my-plants/claim-preview?code=...

Mục đích:

Trước khi claim, FE hiển thị cho user biết mã này thuộc cây nào.

Ví dụ:

```http
GET /api/my-plants/claim-preview?code=DB-7F92-KLAQ
```

Response:

```json
{
  "plantId": "plant-id",
  "name": "Monstera Deliciosa",
  "species": "Monstera",
  "imageUrl": "...",
  "ownershipStatus": "unclaimed",
  "isClaimed": false
}
```

Nếu code không tồn tại:

```http
404 Not Found
```

Nếu code đã claim:

```json
{
  "plantId": "plant-id",
  "name": "Monstera Deliciosa",
  "imageUrl": "...",
  "ownershipStatus": "claimed",
  "isClaimed": true
}
```

### POST /api/my-plants/claim

Mục đích:

User claim cây vào tài khoản.

Body:

```json
{
  "ownershipCode": "DB-7F92-KLAQ",
  "nickname": "Cây Monstera bàn làm việc",
  "location": "Bàn làm việc"
}
```

`nickname` và `location` có thể optional.

Backend xử lý:

```text
1. Lấy current user từ JWT.
2. Tìm Plant theo ownershipCode.
3. Nếu không tồn tại -> 404.
4. Nếu đã claim -> 409.
5. Nếu hợp lệ:
   - Plant.UserId = currentUserId
   - Plant.IsClaimed = true
   - Plant.OwnershipStatus = Claimed
   - Plant.ClaimedAt = now
   - Nếu có nickname thì update Name hoặc Nickname
   - Nếu có location thì update Location
6. Trả về MyPlantDto.
```

Response:

```json
{
  "id": "plant-id",
  "name": "Cây Monstera bàn làm việc",
  "species": "Monstera",
  "location": "Bàn làm việc",
  "imageUrl": "...",
  "status": "healthy",
  "lastCondition": "healthy",
  "wateringCycleDays": 3,
  "ownershipCode": "DB-7F92-KLAQ",
  "ownershipStatus": "claimed",
  "isClaimed": true,
  "claimedAt": "2026-06-01T00:00:00Z"
}
```

---

## 6. API cần chỉnh sửa

## 6.1. GET /api/my-plants

Hiện tại:

```text
Trả cây theo UserId.
DTO còn đơn giản.
```

Nên chỉnh:

```text
Chỉ trả cây UserId == currentUserId.
Trả thêm ownership/care fields.
Không trả cây UserId == null.
```

## 6.2. GET /api/my-plants/{id}

Nên đảm bảo:

```text
Plant.Id == id
Plant.UserId == currentUserId
```

Response nên có đầy đủ:

```text
ownershipCode
ownershipStatus
isClaimed
claimedAt
wateringCycleDays
lastCondition
plantSpeciesId
speciesName
```

## 6.3. PUT /api/my-plants/{id}

Mục đích:

User cá nhân hóa cây sau claim.

User được sửa:

```text
name hoặc nickname
location
imageUrl cá nhân nếu cho phép
status cá nhân nếu cần
notes
wateringCycleDays nếu muốn cho user tự chỉnh
```

User không nên sửa:

```text
ownershipCode
ownershipStatus
isClaimed
claimedAt
UserId
```

## 6.4. GET /api/admin/user-plants

Hiện tại admin đã xem được cây user qua API này.

Nên giữ, nhưng định nghĩa lại rõ:

```text
API này chỉ list cây đã claim / đã có owner.
Điều kiện: UserId != null
```

Nên trả thêm:

```text
ownershipCode
ownershipStatus
isClaimed
claimedAt
userEmail
```

## 6.5. GET /api/admin/marketplace-plants

Hiện đang dùng chung query với public marketplace và có thể chỉ trả `Active`.

Admin nên xem được tất cả status:

```text
Active
Hidden
OutOfStock
Archived
```

Public marketplace vẫn chỉ nên thấy cây public/active.

Khuyến nghị:

```text
Tách query public và query admin.
```

---

## 7. API nên bỏ hoặc deprecate

## 7.1. /api/plants

Nên deprecate hoặc xóa:

```http
GET    /api/plants
POST   /api/plants
GET    /api/plants/{id}
PUT    /api/plants/{id}
DELETE /api/plants/{id}
```

Lý do:

- Trùng với `/api/my-plants`.
- FE hiện không dùng.
- Dễ gây nhầm với route FE `#/plants`.
- Có rủi ro ownership nếu detail/update/delete không check `UserId`.

Nếu chưa xóa ngay:

```text
Phải thêm owner check cho GET/PUT/DELETE /api/plants/{id}.
```

## 7.2. Legacy AI endpoints

Có thể giữ tạm:

```http
POST /api/ai-chat/send
POST /api/Diagnosis
```

Nhưng về lâu dài nên dùng:

```http
POST /api/ai/chat
POST /api/ai/diagnose
```

---

## 8. Ảnh hưởng tới các tính năng liên quan

## 8.1. Reminders

Hiện reminders dùng:

```text
Reminder.PlantId
Reminder.UserId
```

Và create reminder đã check:

```text
Plant.Id == PlantId
Plant.UserId == currentUserId
```

Vì vậy flow claim không phá reminders nếu giữ rule:

```text
Chỉ cây đã claim mới tạo reminder được.
```

Cần đảm bảo:

```text
Plant.UserId nullable nhưng Reminder chỉ tạo khi UserId == currentUserId.
Không tạo reminder cho cây UserId == null.
```

## 8.2. AI Chat / Dialog

Hiện `AiDialog` có:

```text
UserId
PlantId?
```

Flow claim không phá AI Chat.

Nhưng nên bổ sung validate:

```text
Nếu request.PlantId có giá trị:
  Plant.UserId phải == currentUserId
Nếu không đúng:
  trả 404 hoặc 403
```

Lý do:

- Tránh user chat với cây không thuộc mình.
- Tránh lộ context cây của người khác.

## 8.3. AI Diagnosis

Hiện `DiagnosisResult` có:

```text
PlantId?
```

Flow claim không phá diagnosis.

Nhưng cần validate:

```text
Nếu PlantId != null:
  Plant.UserId phải == currentUserId
```

Ngoài ra đang có vấn đề contract:

```text
BE /api/ai/diagnose cần multipart/form-data.
FE hiện gửi imageBase64 JSON trong aiApi.js.
```

Cần sửa FE hoặc BE để thống nhất.

## 8.4. Feedback

Feedback hiện có:

```text
CatalogPlantId -> PlantSpecies
```

Feedback gần như không bị ảnh hưởng bởi MyPlants claim flow.

Tuy nhiên nếu muốn feedback/review gắn với marketplace listing thì nên cân nhắc đổi hoặc thêm:

```text
MarketplacePlantId?
```

Hiện admin feedback lifecycle còn thiếu:

```http
GET  /api/admin/feedback
POST /api/admin/feedback
```

Nhưng đây là vấn đề riêng, không bắt buộc cho claim flow.

## 8.5. Admin user-plants

Không bị phá, nhưng cần định nghĩa rõ:

```text
/api/admin/user-plants
= cây đã thuộc về user

/api/admin/plant-inventory
= tất cả cây vật lý admin đã tạo QR/code
```

Nếu `Plant.UserId` chuyển nullable, query admin user-plants cần lọc:

```text
UserId != null
```

## 8.6. Marketplace

Marketplace không bị ảnh hưởng nhiều.

Marketplace vẫn là:

```text
Public listing để khách xem và liên hệ mua.
```

Plant inventory có thể liên kết với marketplace listing qua:

```text
MarketplacePlantId
```

Ví dụ:

```text
Listing: Monstera size M
Inventory:
- Monstera #001, code DB-A
- Monstera #002, code DB-B
- Monstera #003, code DB-C
```

## 8.7. Upload

Không bị ảnh hưởng.

Upload vẫn dùng:

```http
POST /api/upload/image
```

Dùng cho:

- ảnh marketplace
- ảnh cây inventory
- ảnh cây user cá nhân hóa
- avatar user

---

## 9. Flow chi tiết cho FE sau khi BE sẵn sàng

## 9.1. Admin tạo cây QR

```text
Admin vào Admin Marketplace hoặc Admin Inventory
        |
        v
Chọn listing marketplace hoặc nhập thông tin cây
        |
        v
Bấm "Tạo cây QR"
        |
        v
FE gọi POST /api/admin/plant-inventory
        |
        v
BE trả ownershipCode + qrClaimUrl
        |
        v
FE hiển thị QR để admin in/dán/gửi khách
```

## 9.2. User claim bằng QR/code

```text
User mua cây
        |
        v
Scan QR hoặc nhập code
        |
        v
FE gọi GET /api/my-plants/claim-preview?code=...
        |
        v
FE hiển thị cây để xác nhận
        |
        v
User bấm "Claim cây này"
        |
        v
FE gọi POST /api/my-plants/claim
        |
        v
BE gắn cây vào user
        |
        v
FE điều hướng tới /app/my-plants/{id}/profile
```

## 9.3. User chăm cây sau claim

```text
MyPlants
  |
  +-- PlantProfile
  |     +-- sửa nickname/location/notes
  |     +-- xem ownership status
  |
  +-- Reminders
  |     +-- tạo lịch tưới/bón phân/check lá
  |
  +-- AI Chat
  |     +-- hỏi theo context cây thật
  |
  +-- AI Diagnose
        +-- chẩn đoán ảnh cho cây thật
```

---

## 10. Thứ tự triển khai đề xuất

## Phase 1 - Backend foundation

1. Đổi `Plant.UserId` thành nullable.
2. Thêm field:
   ```text
   MarketplacePlantId?
   ClaimedAt?
   ```
3. Đảm bảo `OwnershipCode` unique.
4. Migration database.
5. Update query hiện tại để không lỗi khi `UserId == null`.

## Phase 2 - Admin inventory API

1. Thêm:
   ```http
   GET /api/admin/plant-inventory
   POST /api/admin/plant-inventory
   GET /api/admin/plant-inventory/{id}
   PUT /api/admin/plant-inventory/{id}
   DELETE /api/admin/plant-inventory/{id}
   POST /api/admin/plant-inventory/{id}/regenerate-code
   ```
2. Admin inventory list trả cả claimed/unclaimed.
3. Admin user-plants tiếp tục chỉ trả cây đã có user.

## Phase 3 - User claim API

1. Thêm:
   ```http
   GET /api/my-plants/claim-preview?code=...
   POST /api/my-plants/claim
   ```
2. Validate code.
3. Chặn claim lại cây đã claim.
4. Trả về `MyPlantDto`.

## Phase 4 - Update MyPlants DTO

1. Bổ sung ownership/care fields vào:
   ```http
   GET /api/my-plants
   GET /api/my-plants/{id}
   ```
2. Giới hạn `PUT /api/my-plants/{id}` chỉ sửa field user được phép sửa.

## Phase 5 - Security validation cho related features

1. Reminder:
   ```text
   chỉ tạo/sửa/xóa với Plant.UserId == currentUserId
   ```
2. AI Chat:
   ```text
   nếu có PlantId thì validate ownership
   ```
3. AI Diagnosis:
   ```text
   nếu có PlantId thì validate ownership
   ```
4. Admin:
   ```text
   các API admin yêu cầu role ADMIN
   ```

## Phase 6 - Deprecate legacy

1. Xóa hoặc deprecate `/api/plants`.
2. Nếu chưa xóa ngay, thêm ownership check.
3. Cập nhật Swagger/docs để tránh nhầm `plants` với `marketplace-plants`.

---

## 11. Checklist gửi BE

### Must have

- [ ] `Plant.UserId` nullable.
- [ ] `Plant.MarketplacePlantId?`.
- [ ] `Plant.ClaimedAt?`.
- [ ] Unique `OwnershipCode`.
- [ ] `GET /api/admin/plant-inventory`.
- [ ] `POST /api/admin/plant-inventory`.
- [ ] `GET /api/my-plants/claim-preview?code=...`.
- [ ] `POST /api/my-plants/claim`.
- [ ] `MyPlantDto` trả ownership/care fields.
- [ ] Reminder validate cây thuộc user.
- [ ] AI Chat validate cây thuộc user.
- [ ] AI Diagnosis validate cây thuộc user.
- [ ] Admin user-plants chỉ list cây đã có user.
- [ ] Deprecate hoặc secure `/api/plants`.

### Should have

- [ ] Admin regenerate ownership code.
- [ ] Admin inventory filter theo claimed/unclaimed.
- [ ] Admin inventory link tới marketplace listing.
- [ ] Admin marketplace query trả tất cả status cho admin.
- [ ] QR claim URL trong response.

### Later

- [ ] Admin feedback create/list endpoint.
- [ ] Full QR scan UI.
- [ ] Claim history/audit log.
- [ ] Transfer ownership giữa users.
- [ ] Revoke ownership.

---

## 12. Tóm tắt ngắn để trao đổi

Đề xuất:

```text
Không để MyPlants là nơi user tự tạo cây làm flow chính.

Flow chính nên là:
Admin tạo cây vật lý có ownershipCode/QR.
User scan QR hoặc nhập code để claim cây.
Sau claim, cây mới xuất hiện trong MyPlants.
User chỉ cá nhân hóa cây sau khi đã claim.
```

Cần BE làm:

```text
1. Tách rõ marketplace listing, plant inventory, my plants.
2. Thêm admin plant inventory API.
3. Thêm user claim-preview và claim API.
4. Mở rộng MyPlantDto.
5. Validate ownership cho reminders, AI chat, AI diagnosis.
6. Deprecate /api/plants.
```

Ảnh hưởng:

```text
Marketplace: ít ảnh hưởng.
MyPlants: ảnh hưởng chính.
Admin user-plants: chỉ cần lọc cây đã có user.
Reminders: giữ được, cần validate ownership.
AI Chat/Dialog: giữ được, cần validate ownership.
AI Diagnosis: giữ được, cần validate ownership và sửa contract multipart/base64.
Feedback: gần như không ảnh hưởng claim flow.
Upload: không ảnh hưởng.
```
