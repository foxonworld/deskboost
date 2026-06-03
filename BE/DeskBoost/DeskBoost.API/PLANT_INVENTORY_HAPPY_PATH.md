# Plant Inventory — Happy Path Test

Base URL: `http://localhost:5272` (hoặc port đang chạy)

---

## Bước 1 — Admin login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@deskboost.com",
  "password": "Admin@123"
}
```

✅ `200 OK` → copy `accessToken`, dùng cho tất cả bước Admin bên dưới.

---

## Bước 2 — Lấy MarketplaceItem (category = plant)

```http
GET /api/admin/marketplace-items
Authorization: Bearer {adminToken}
```

✅ `200 OK` → tìm 1 item có `"category": "plant"`, copy `id` của nó.

> Nếu chưa có, tạo nhanh:
> ```http
> POST /api/admin/marketplace-items
> Authorization: Bearer {adminToken}
> Content-Type: application/json
>
> {
>   "name": "Tim Tròn",
>   "category": "plant",
>   "careLevel": "1",
>   "light": "2",
>   "water": "1/2",
>   "status": "active"
> }
> ```

---

## Bước 3 — Admin tạo PlantInventory

```http
POST /api/admin/plant-inventory
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "marketplaceItemId": "{id-lấy-ở-bước-2}",
  "name": "Tim Tròn #001",
  "speciesName": "Tim Tròn",
  "location": "HCM",
  "careLevel": "1",
  "light": "2",
  "water": "1/2",
  "wateringCycleDays": 2,
  "notes": "Test cây"
}
```

✅ `201 Created`
```json
{
  "id": "...",
  "name": "Tim Tròn #001",
  "ownershipCode": "DB-XXXX-XXXX",
  "claimCodeId": "uuid-khác-null",
  "claimCodeStatus": "unclaimed",
  "careLevel": "1",
  "light": "2",
  "water": "1/2",
  "isClaimed": false
}
```

→ Copy `ownershipCode` (dạng `DB-XXXX-XXXX`).

---

## Bước 4 — User login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@deskboost.com",
  "password": "User@123"
}
```

✅ `200 OK` → copy `accessToken`, dùng cho tất cả bước User bên dưới.

---

## Bước 5 — User xem preview cây trước khi claim

```http
GET /api/my-plants/claim-preview?code={ownershipCode}
Authorization: Bearer {userToken}
```

✅ `200 OK`
```json
{
  "valid": true,
  "codeStatus": "unclaimed",
  "marketplaceItem": {
    "name": "Tim Tròn",
    "careLevel": "1",
    "light": "2",
    "water": "1/2"
  }
}
```

---

## Bước 6 — User claim cây

```http
POST /api/my-plants/claim
Authorization: Bearer {userToken}
Content-Type: application/json

{
  "code": "{ownershipCode}",
  "nickname": "Bé Tim",
  "location": "Bàn làm việc"
}
```

✅ `200 OK`
```json
{
  "name": "Tim Tròn #001",
  "nickname": "Bé Tim",
  "ownershipCode": "DB-XXXX-XXXX",
  "ownershipStatus": "Claimed",
  "isClaimed": true,
  "claimedAt": "2026-..."
}
```

---

## Bước 7 — Kiểm tra My Plants của user

```http
GET /api/my-plants
Authorization: Bearer {userToken}
```

✅ `200 OK` → cây `Tim Tròn #001` xuất hiện với `isClaimed: true`.

---

## Bước 8 — Admin kiểm tra inventory đã claimed

```http
GET /api/admin/plant-inventory?status=claimed
Authorization: Bearer {adminToken}
```

✅ `200 OK` → cây xuất hiện với:
- `isClaimed: true`
- `userId` và `userEmail` của user vừa claim
- `claimCodeStatus: "claimed"`

---

## Bước 9 — Admin xem User Plants

```http
GET /api/admin/user-plants
Authorization: Bearer {adminToken}
```

✅ `200 OK` → thấy cây `Tim Tròn #001` với thông tin owner.

---

## Checklist nhanh

| # | Kiểm tra | ✅/❌ |
|---|---|---|
| 3 | Response có `claimCodeId != null` | |
| 3 | Response có `claimCodeStatus = "unclaimed"` | |
| 3 | Response có `ownershipCode` dạng `DB-XXXX-XXXX` | |
| 5 | Preview trả `valid: true` | |
| 6 | Claim thành công, `isClaimed: true` | |
| 7 | My Plants có cây | |
| 8 | Admin thấy cây đã claimed với userId | |
| 9 | Admin thấy owner trong User Plants | |
