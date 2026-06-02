# Plant Inventory — Test Guide

File `.http` đi kèm: `plant-inventory-flow.http` (dùng với VS Code REST Client)

---

## Yêu cầu trước khi test

- Server đang chạy: `dotnet run` trong `DeskBoost.API`
- DB đã migrate (có bảng `Plants`, `PlantClaimCodes`, `MarketplaceItems`)
- Có ít nhất 1 `MarketplaceItem` với `category = plant` trong DB
- Có account admin và user đã tạo sẵn

---

## Luồng tổng quan

```
Admin login
  → Tạo PlantInventory (POST /api/admin/plant-inventory)
    → BE: INSERT Plant → INSERT PlantClaimCode → UPDATE Plant.ClaimCodeId (1 transaction)
    → Response: ownershipCode, claimCodeId, claimCodeStatus = "unclaimed"
  → Gửi code cho khách hàng

User login
  → Xem preview cây (GET /api/my-plants/claim-preview?code=DB-XXXX-XXXX)
  → Confirm claim (POST /api/my-plants/claim)
    → PlantInventory: isClaimed = true
    → PlantClaimCode: status = "claimed"
    → MyPlants của user có cây đó

Admin kiểm tra
  → GET /api/admin/plant-inventory?status=claimed
  → GET /api/admin/user-plants
```

---

## Bước 1 — Admin login

**Request:**
```
POST /api/auth/login
{
  "email": "admin@deskboost.com",
  "password": "Admin@123"
}
```

**Expect:** `200 OK`
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "...",
  "user": { "role": "ADMIN" }
}
```

**Action:** Copy `accessToken` → dán vào biến `@adminToken` trong file `.http`

---

## Bước 2 — Lấy MarketplaceItem có category = plant

**Request:**
```
GET /api/admin/marketplace-items?category=plant
Authorization: Bearer {adminToken}
```

**Expect:** `200 OK`, có ít nhất 1 item với `"category": "plant"`
```json
{
  "items": [
    {
      "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "name": "Tim Tròn",
      "category": "plant",
      "careLevel": "1",
      "light": "2",
      "water": "1/2"
    }
  ]
}
```

**Action:** Copy `id` → dán vào `@marketplaceItemId`

> Nếu chưa có item nào: vào `POST /api/admin/marketplace-items` tạo item với `"category": "plant"` trước.

---

## Bước 3 — [Validation] Kiểm tra các lỗi đầu vào

### 3a. Tạo plant thiếu `name`

```
POST /api/admin/plant-inventory
{
  "marketplaceItemId": "{marketplaceItemId}",
  "name": ""
}
```

**Expect:** `400 Bad Request`
```json
{ "message": "Tên cây không được để trống." }
```

### 3b. Tạo plant với `marketplaceItemId` không tồn tại

```
POST /api/admin/plant-inventory
{
  "marketplaceItemId": "00000000-0000-0000-0000-000000000001",
  "name": "Cây Test"
}
```

**Expect:** `400 Bad Request`
```json
{ "message": "Không tìm thấy sản phẩm marketplace." }
```

### 3c. Tạo plant với item có `category != plant` (vd: pot, soil)

```
POST /api/admin/plant-inventory
{
  "marketplaceItemId": "{id_cua_item_khong_phai_plant}",
  "name": "Cây Test"
}
```

**Expect:** `400 Bad Request`
```json
{ "message": "Sản phẩm này không phải loại cây (category phải là plant)." }
```

---

## Bước 4 — [Happy Path] Tạo PlantInventory với đầy đủ care fields

**Request:**
```
POST /api/admin/plant-inventory
Authorization: Bearer {adminToken}
{
  "marketplaceItemId": "{marketplaceItemId}",
  "name": "Tim Tròn #001",
  "speciesName": "Tim Tròn",
  "imageUrl": "https://example.com/timtron.jpg",
  "location": "HCM",
  "careLevel": "1",
  "light": "2",
  "water": "1/2",
  "wateringCycleDays": 2,
  "notes": "Cây test"
}
```

**Expect:** `201 Created`
```json
{
  "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "name": "Tim Tròn #001",
  "ownershipCode": "DB-ABCD-1234",
  "claimCodeId": "yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy",
  "claimCodeStatus": "unclaimed",
  "careLevel": "1",
  "light": "2",
  "water": "1/2",
  "wateringCycleDays": 2,
  "isClaimed": false,
  "ownershpStatus": "Unclaimed"
}
```

**Kiểm tra:**
- `claimCodeId` phải **khác null**
- `claimCodeStatus` phải là `"unclaimed"`
- `ownershipCode` phải đúng dạng `DB-XXXX-XXXX`
- `careLevel`, `light`, `water` phải đúng như đã gửi

**Action:** Copy `ownershipCode` → dán vào `@claimCode`

---

## Bước 5 — [Happy Path] Tạo PlantInventory không gửi care fields (fallback từ MarketplaceItem)

**Request:**
```
POST /api/admin/plant-inventory
Authorization: Bearer {adminToken}
{
  "marketplaceItemId": "{marketplaceItemId}",
  "name": "Tim Tròn #002",
  "speciesName": "Tim Tròn",
  "location": "HN",
  "wateringCycleDays": 3
}
```

**Expect:** `201 Created`, care fields lấy từ `MarketplaceItem`
```json
{
  "careLevel": "1",
  "light": "2",
  "water": "1/2"
}
```

**Kiểm tra:** `careLevel/light/water` phải khớp với giá trị đang lưu trong `MarketplaceItem` đó.

---

## Bước 6 — Kiểm tra transaction (không tạo cây mồ côi)

Đây là kiểm tra đảm bảo nếu bước nào trong transaction fail thì rollback toàn bộ.

**Cách test thủ công:** Tạm thời break DB connection sau khi `INSERT Plant` nhưng trước `INSERT PlantClaimCode` (khó test tự động). Thay vào đó, kiểm tra bằng cách đếm số bản ghi:

```sql
-- Sau mỗi POST, số bản ghi phải luôn bằng nhau:
SELECT COUNT(*) FROM "Plants" WHERE "OwnershipCode" IS NOT NULL;
SELECT COUNT(*) FROM "PlantClaimCodes";
```

Hai con số phải luôn bằng nhau. Nếu `Plants > PlantClaimCodes` → có cây mồ côi.

---

## Bước 7 — Admin xem danh sách inventory

```
GET /api/admin/plant-inventory?status=unclaimed
Authorization: Bearer {adminToken}
```

**Expect:** `200 OK`, có 2 cây vừa tạo, cả 2 đều:
- `isClaimed: false`
- `claimCodeId != null`
- `claimCodeStatus: "unclaimed"`

---

## Bước 8 — [Happy Path] Update plant (có thể sửa care fields)

```
PUT /api/admin/plant-inventory/{plantId}
Authorization: Bearer {adminToken}
{
  "name": "Tim Tròn #001 Updated",
  "careLevel": "2",
  "light": "3",
  "water": "1"
}
```

**Expect:** `200 OK`, các field được cập nhật

---

## Bước 9 — User login

```
POST /api/auth/login
{
  "email": "user@deskboost.com",
  "password": "User@123"
}
```

**Expect:** `200 OK`, có `accessToken`

**Action:** Copy `accessToken` → dán vào `@userToken`

---

## Bước 10 — [Validation] Claim preview với code sai

```
GET /api/my-plants/claim-preview?code=DB-FAKE-CODE
Authorization: Bearer {userToken}
```

**Expect:** Code không tồn tại, response `valid: false` hoặc `404`

---

## Bước 11 — Claim preview với code đúng

```
GET /api/my-plants/claim-preview?code={claimCode}
Authorization: Bearer {userToken}
```

**Expect:** `200 OK`
```json
{
  "valid": true,
  "codeStatus": "unclaimed",
  "marketplaceItem": {
    "id": "...",
    "name": "Tim Tròn",
    "category": "plant",
    "careLevel": "1",
    "light": "2",
    "water": "1/2"
  }
}
```

---

## Bước 12 — [Happy Path] User claim cây

```
POST /api/my-plants/claim
Authorization: Bearer {userToken}
{
  "code": "{claimCode}",
  "nickname": "Bé Tim",
  "location": "Bàn làm việc"
}
```

**Expect:** `200 OK`, trả `MyPlantDto`
```json
{
  "id": "...",
  "name": "Tim Tròn #001",
  "nickname": "Bé Tim",
  "ownershipCode": "DB-ABCD-1234",
  "ownershipStatus": "Claimed",
  "isClaimed": true,
  "claimedAt": "2026-06-02T..."
}
```

---

## Bước 13 — [Validation] Claim lại code đã dùng

```
POST /api/my-plants/claim
Authorization: Bearer {userToken}
{
  "code": "{claimCode}"
}
```

**Expect:** `400` hoặc `409`, không thể claim lại code đã dùng.

---

## Bước 14 — User xem My Plants

```
GET /api/my-plants
Authorization: Bearer {userToken}
```

**Expect:** `200 OK`, có cây vừa claim với `isClaimed: true`

---

## Bước 15 — Admin kiểm tra inventory sau khi claim

```
GET /api/admin/plant-inventory?status=claimed
Authorization: Bearer {adminToken}
```

**Expect:** Cây #001 xuất hiện với:
- `isClaimed: true`
- `userId != null`
- `userEmail` đúng với user vừa claim
- `claimCodeStatus: "claimed"`

---

## Bước 16 — Admin xem tất cả User Plants

```
GET /api/admin/user-plants
Authorization: Bearer {adminToken}
```

**Expect:** Cây của user vừa claim xuất hiện trong danh sách.

---

## Checklist kết quả

| # | Mô tả | Pass/Fail |
|---|---|---|
| 1 | POST thiếu `name` → 400 | |
| 2 | POST `marketplaceItemId` không tồn tại → 400 | |
| 3 | POST `category != plant` → 400 | |
| 4 | POST hợp lệ → 201, `claimCodeId != null`, `claimCodeStatus = "unclaimed"` | |
| 5 | POST không gửi care fields → fallback từ MarketplaceItem | |
| 6 | Đếm `Plants` = `PlantClaimCodes` (không có cây mồ côi) | |
| 7 | GET inventory → 2 cây, đều `isClaimed = false` | |
| 8 | PUT plant → cập nhật được `careLevel/light/water` | |
| 9 | GET claim-preview code sai → invalid | |
| 10 | GET claim-preview code đúng → `valid: true, codeStatus: "unclaimed"` | |
| 11 | POST claim → 200, cây thuộc về user | |
| 12 | POST claim lại code cũ → lỗi | |
| 13 | GET my-plants → cây xuất hiện với `isClaimed: true` | |
| 14 | GET admin/plant-inventory?status=claimed → cây chuyển trạng thái | |
| 15 | GET admin/user-plants → thấy cây và owner | |
