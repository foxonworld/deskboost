# DeskBoost API — Tài liệu Endpoint

> Cập nhật: 2026-06-01 (rev 2)  
> Base URL: `https://<host>/api`

---

## Mục lục

1. [Auth — Xác thực](#1-auth--xác-thực)
2. [Users — Người dùng](#2-users--người-dùng)
3. [My Plants — Cây của tôi](#3-my-plants--cây-của-tôi)
4. [Reminders — Nhắc nhở](#4-reminders--nhắc-nhở)
5. [Marketplace Items — Sản phẩm cửa hàng](#5-marketplace-items--sản-phẩm-cửa-hàng)
6. [Feedback — Đánh giá](#6-feedback--đánh-giá)
7. [AI — Trí tuệ nhân tạo](#7-ai--trí-tuệ-nhân-tạo)
8. [Upload — Tải ảnh lên](#8-upload--tải-ảnh-lên)
9. [Admin — Quản trị viên](#9-admin--quản-trị-viên)
10. [Legacy Endpoints — Đã ngừng sử dụng](#10-legacy-endpoints--đã-ngừng-sử-dụng)

---

## Ký hiệu

| Ký hiệu | Nghĩa |
|---------|-------|
| 🔓 | Public — không cần đăng nhập |
| 🔑 | Cần JWT (role: User) |
| 🛡️ | Cần JWT (role: ADMIN) |

---

## 1. Auth — Xác thực

**Base route:** `/api/auth`  
**Người dùng:** Tất cả (anonymous + authenticated)

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| POST | `/register` | 🔓 | Đăng ký tài khoản mới |
| POST | `/login` | 🔓 | Đăng nhập, nhận JWT + refresh token |
| POST | `/refresh-token` | 🔓 | Làm mới JWT bằng refresh token |
| POST | `/logout` | 🔑 | Đăng xuất, thu hồi refresh token |
| GET | `/me` | 🔑 | Lấy thông tin tài khoản hiện tại |

### Luồng test

```
1. POST /api/auth/register
   Body: { "email": "user@test.com", "password": "Pass123!", "confirmPassword": "Pass123!", "fullName": "Test User" }
   → 201 Created

2. POST /api/auth/login
   Body: { "email": "user@test.com", "password": "Pass123!" }
   → 200 OK: { "token": "eyJ...", "refreshToken": "xxx" }
   → Lưu token để dùng cho các request tiếp theo

3. GET /api/auth/me
   Header: Authorization: Bearer <token>
   → 200 OK: thông tin user

4. POST /api/auth/refresh-token
   Body: { "token": "<refreshToken>" }
   → 200 OK: { "token": "eyJ...(mới)", "refreshToken": "xxx(mới)" }

5. POST /api/auth/logout
   Header: Authorization: Bearer <token>
   Body: { "refreshToken": "<refreshToken>" }
   → 204 No Content
```

---

## 2. Users — Người dùng

**Base route:** `/api/users`  
**Người dùng:** 🔑 User đã đăng nhập

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| GET | `/me` | 🔑 | Lấy profile người dùng hiện tại |
| PUT | `/me` | 🔑 | Cập nhật profile (tên, avatar, SĐT) |

### Luồng test

```
1. GET /api/users/me
   Header: Authorization: Bearer <token>
   → 200 OK: { id, email, fullName, avatarUrl, phone }

2. PUT /api/users/me
   Header: Authorization: Bearer <token>
   Body: { "name": "Tên Mới", "avatarUrl": "https://...", "phone": "0901234567" }
   → 200 OK: profile đã cập nhật
```

---

## 3. My Plants — Cây của tôi

**Base route:** `/api/my-plants`  
**Người dùng:** 🔑 User đã đăng nhập

> Cây cá nhân của user: có thể tự tạo (custom) hoặc claim từ mã code khi mua hàng.

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| GET | `/` | 🔑 | Lấy danh sách cây cá nhân |
| GET | `/claim-preview?code=DB-XXXX-XXXX` | 🔑 | Xem trước thông tin cây trước khi claim |
| GET | `/{id}` | 🔑 | Lấy chi tiết cây cá nhân |
| POST | `/claim` | 🔑 | Claim cây bằng mã code (khi mua hàng) |
| POST | `/` | 🔑 | Tạo cây tùy chỉnh (không cần mã) |
| PUT | `/{id}` | 🔑 | Cập nhật thông tin cây cá nhân |
| DELETE | `/{id}` | 🔑 | Xóa cây cá nhân |

### Luồng test

**Luồng claim cây (mua hàng)**
```
1. GET /api/my-plants/claim-preview?code=DB-ABCD-1234
   Header: Authorization: Bearer <token>
   → 200 OK: {
       valid: true,
       codeStatus: "unclaimed",
       marketplaceItem: {
         id, name, description, category,
         imageUrl, careLevel, light, water
       }
     }
   → Nếu code không hợp lệ hoặc đã dùng: { valid: false, codeStatus: "claimed"|"cancelled", marketplaceItem: null }

2. POST /api/my-plants/claim
   Body: { "code": "DB-ABCD-1234", "nickname": "Bé Xanh", "location": "Góc cửa sổ" }
   → 201 Created: cây đã được gán cho tài khoản

3. GET /api/my-plants
   → 200 OK: danh sách cây cá nhân (bao gồm cây vừa claim)
```

**Luồng tạo cây tùy chỉnh**
```
1. POST /api/my-plants
   Body: {
     "name": "Cây Xương Rồng Nhỏ",
     "species": "Cactaceae",
     "location": "Bàn làm việc",
     "imageUrl": "https://...",
     "notes": "Ít tưới nước"
   }
   → 201 Created

2. PUT /api/my-plants/{id}
   Body: { "status": "Healthy", "wateringCycleDays": 7 }
   → 200 OK
```

---

## 4. Reminders — Nhắc nhở

**Base route:** `/api/reminders`  
**Người dùng:** 🔑 User đã đăng nhập

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| GET | `/` | 🔑 | Lấy tất cả nhắc nhở của user |
| POST | `/` | 🔑 | Tạo nhắc nhở mới |
| PUT | `/{id}` | 🔑 | Cập nhật nhắc nhở |
| PUT | `/{id}/done` | 🔑 | Đánh dấu hoàn thành |
| GET | `/{id}/calendar` | 🔑 | Lấy lịch (.ics) của nhắc nhở |
| DELETE | `/{id}` | 🔑 | Xóa nhắc nhở |

### Luồng test

```
1. POST /api/reminders
   Header: Authorization: Bearer <token>
   Body: {
     "title": "Tưới cây",
     "plantId": "<my-plant-id>",
     "careType": "Watering",
     "dueAt": "2026-06-05T08:00:00Z",
     "repeatRule": "FREQ=WEEKLY",
     "notes": "Tưới đẫm 200ml"
   }
   → 201 Created: { id, title, dueAt, ... }

2. GET /api/reminders
   → 200 OK: [{ id, title, dueAt, isDone, ... }]

3. PUT /api/reminders/{id}/done
   → 200 OK: nhắc nhở được đánh dấu hoàn thành

4. GET /api/reminders/{id}/calendar?format=ics
   → 200 OK: file .ics để thêm vào Google Calendar / Outlook

5. DELETE /api/reminders/{id}
   → 204 No Content
```

---

## 5. Marketplace Items — Sản phẩm cửa hàng

**Base route:** `/api/marketplace-items`  
**Người dùng:** 🔓 Public (không cần đăng nhập)

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| GET | `/?page=1&limit=12` | 🔓 | Lấy danh sách sản phẩm (phân trang) |
| GET | `/{id}` | 🔓 | Lấy chi tiết sản phẩm |

### Luồng test

```
1. GET /api/marketplace-items?page=1&limit=12
   → 200 OK: { items: [...], total, page, limit }

2. GET /api/marketplace-items/{id}
   → 200 OK: {
       id, name, description, category,
       imageUrl, priceText, contactUrl,
       careLevel, light, water, ...
     }
```

---

## 6. Feedback — Đánh giá

**Base route:** `/api/feedback`  
**Người dùng:** 🔓 Public (không cần đăng nhập)

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| GET | `/verified?marketplaceItemId=<uuid>` | 🔓 | Lấy đánh giá đã xác minh của một sản phẩm |

### Luồng test

```
1. GET /api/feedback/verified?marketplaceItemId=<uuid>
   → 200 OK: [
       {
         id, customerAlias, rating, comment,
         purchaseChannel, publicImageUrls, createdAt
       }
     ]
   Lưu ý: evidenceImageUrls và evidenceNote là trường nội bộ, không trả ở đây.

   Nếu không có feedback:
   → 200 OK: []
```

---

## 7. AI — Trí tuệ nhân tạo

**Base route:** `/api/ai`  
**Người dùng:** 🔑 User đã đăng nhập

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| POST | `/chat` | 🔑 | Chat với AI về cây cối |
| POST | `/diagnose` | 🔑 | Chẩn đoán bệnh cây qua ảnh |
| GET | `/dialogs` | 🔑 | Lấy danh sách lịch sử hội thoại |
| GET | `/dialogs/{id}` | 🔑 | Lấy chi tiết một hội thoại |

### Luồng test

**Chat AI**
```
1. POST /api/ai/chat
   Header: Authorization: Bearer <token>
   Body: {
     "message": "Cây của tôi bị vàng lá, làm sao khắc phục?",
     "plantId": "<my-plant-id>",   // optional
     "history": [],                // optional: lịch sử chat trước
     "plantContext": { ... }       // optional: context cây
   }
   → 200 OK: { "content": "Lá vàng có thể do..." }
```

**Chẩn đoán bệnh cây**
```
2. POST /api/ai/diagnose
   Header: Authorization: Bearer <token>
   Content-Type: multipart/form-data
   Form fields:
     - Image:    <file ảnh cây>          // bắt buộc, chữ hoa chữ I
     - PlantId:  <my-plant-id>           // optional
     - Question: "Lá bị vàng do gì?"    // optional
   → 200 OK: {
       diagnosis: "Bệnh đốm lá",
       severity: "Nhẹ",
       recommendations: ["Cắt bỏ lá bệnh", "Giảm tưới nước"]
     }
```

**Lịch sử hội thoại**
```
3. GET /api/ai/dialogs
   → 200 OK: [{ id, title, createdAt, messageCount }]

4. GET /api/ai/dialogs/{id}
   → 200 OK: { id, messages: [{ role, content, createdAt }] }
```

---

## 8. Upload — Tải ảnh lên

**Base route:** `/api/upload`  
**Người dùng:** 🔑 User đã đăng nhập

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| POST | `/image` | 🔑 | Upload ảnh lên cloud, nhận lại URL |

**Giới hạn:** JPEG, PNG, WebP, GIF — tối đa **5MB**

### Luồng test

```
1. POST /api/upload/image
   Header: Authorization: Bearer <token>
   Content-Type: multipart/form-data
   Form field: file: <image file>
   → 200 OK: { "url": "https://cdn.example.com/images/abc123.jpg" }

   Test lỗi:
   - Gửi file > 5MB       → 400 Bad Request
   - Gửi file .pdf/.docx  → 400 Bad Request
```

---

## 9. Admin — Quản trị viên

**Base route:** `/api/admin`  
**Người dùng:** 🛡️ Chỉ tài khoản có role `ADMIN`

---

### 10.1 Dashboard

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/summary` | Thống kê tổng quan (users, plants, đơn hàng...) |
| GET | `/ai-config/status` | Kiểm tra trạng thái cấu hình AI |

```
GET /api/admin/summary
→ 200 OK: { totalUsers, totalPlants, totalMarketplaceItems, ... }
```

---

### 10.2 Quản lý Users

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/users` | Danh sách tất cả users |
| GET | `/users/{id}` | Chi tiết một user |
| PUT | `/users/{id}/status` | Kích hoạt / khóa tài khoản |

```
1. GET /api/admin/users
   → 200 OK: [{ id, email, fullName, status, createdAt }]

2. GET /api/admin/users/{id}
   → 200 OK: chi tiết user + thống kê

3. PUT /api/admin/users/{id}/status
   Body: { "status": "Inactive" }   // Active | Inactive | Banned
   → 200 OK
```

---

### 10.3 Quản lý User Plants (cây của khách)

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/user-plants` | Danh sách cây của tất cả users |
| GET | `/user-plants/{id}` | Chi tiết cây của một user |
| PUT | `/user-plants/{id}/status` | Cập nhật trạng thái cây |

```
1. GET /api/admin/user-plants
   → 200 OK: [{ id, name, ownerEmail, status, claimedAt }]

2. PUT /api/admin/user-plants/{id}/status
   Body: { "status": "Inactive" }
   → 200 OK
```

---

### 10.4 Quản lý Plant Inventory (kho cây vật lý)

> Chỉ dùng cho `MarketplaceItem` có `category = Plant`.  
> Mỗi bản ghi đại diện cho **một cây vật lý thực tế** trong kho.  
> Backend tự sinh `PlantClaimCode` khi tạo inventory (quan hệ 1-1: một cây → một mã).

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/plant-inventory?status=unclaimed\|claimed&marketplaceItemId=...` | Danh sách cây trong kho |
| GET | `/plant-inventory/{id}` | Chi tiết cây (kèm claimCode) |
| POST | `/plant-inventory` | Thêm cây vào kho, tự sinh claimCode |
| PUT | `/plant-inventory/{id}` | Cập nhật thông tin cây |
| DELETE | `/plant-inventory/{id}` | Xóa cây khỏi kho |
| POST | `/plant-inventory/{id}/regenerate-code` | Tạo lại mã claim (nếu mã cũ bị lộ) |

```
Luồng thêm cây vào kho:

1. POST /api/admin/plant-inventory
   Body: {
     "name": "Cây Trầu Bà #001",
     "marketplaceItemId": "<uuid>",   // phải là category = Plant
     "imageUrl": "https://...",
     "location": "Kệ A-01",
     "wateringCycleDays": 3
   }
   → 201 Created: {
       id, marketplaceItemId, name, speciesName, imageUrl, location,
       wateringCycleDays, notes,
       ownershipCode: "DB-ABCD-1234",   // mã claim
       ownershipStatus: "Unclaimed",
       isClaimed: false, claimedAt: null,
       userId: null, userEmail: null,
       qrClaimUrl: "/claim/DB-ABCD-1234",
       claimCodeId: "<uuid>",           // ID của PlantClaimCode entity
       claimCodeStatus: "unclaimed",
       createdAt, updatedAt
     }
   Lưu ý: claimCode chỉ được tạo khi marketplaceItem.category = "plant".

2. POST /api/admin/plant-inventory/{id}/regenerate-code
   (nếu cần tạo lại mã — mã cũ bị thu hồi, code mới đồng bộ vào PlantClaimCode)
   → 200 OK: full AdminPlantInventoryDto (ownershipCode chứa mã mới)

3. GET /api/admin/plant-inventory?status=unclaimed
   → danh sách cây chưa có chủ (claimCode chưa được dùng)
```

---

### 10.5 Quản lý Marketplace Items (sản phẩm)

> `category` xác định loại sản phẩm. Chỉ `Plant` mới tạo được `PlantInventory` và mã claim.  
> Các category khác (`Pot`, `Soil`, `Fertilizer`, `Accessory`) chỉ bán/contact qua marketplace bình thường.

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/marketplace-items?page=1&limit=50&category=...` | Danh sách sản phẩm |
| GET | `/marketplace-items/{id}` | Chi tiết sản phẩm |
| POST | `/marketplace-items` | Tạo sản phẩm mới |
| PUT | `/marketplace-items/{id}` | Cập nhật sản phẩm |
| DELETE | `/marketplace-items/{id}` | Xóa sản phẩm |

**Category hợp lệ:** `Plant` | `Pot` | `Soil` | `Fertilizer` | `Accessory`

```
1. POST /api/admin/marketplace-items
   Body: {
     "name": "Cây Trầu Bà Lớn",
     "description": "Cây phong thủy, dễ chăm",
     "category": "Plant",            // Plant mới có thể tạo PlantInventory
     "imageUrl": "https://...",
     "priceText": "150.000đ",
     "contactUrl": "https://shopee.vn/...",
     "status": "Active",
     "careLevel": "Easy",
     "light": "Low",
     "water": "Weekly"
   }
   → 201 Created

2. PUT /api/admin/marketplace-items/{id}
   Body: { "priceText": "120.000đ", "status": "Inactive" }
   → 200 OK

3. DELETE /api/admin/marketplace-items/{id}
   → 204 No Content
```

---

### 10.6 Quản lý Plant Claim Codes (mã claim)

> Mã claim được sinh tự động khi tạo `PlantInventory` (xem 10.4).  
> Endpoint này dùng để **tra cứu** và **hủy** mã; không nên dùng để tạo mã độc lập.  
> Nếu cần cập nhật thông tin người mua cho mã đã có, dùng `PUT /plant-claim-codes/{id}`.

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/plant-claim-codes?plantInventoryId=...&status=...` | Danh sách mã claim |
| PUT | `/plant-claim-codes/{id}` | Cập nhật buyerContact / note cho mã |
| PATCH | `/plant-claim-codes/{id}/cancel` | Hủy mã claim chưa được dùng |

**Response của GET (mỗi item):**
```json
{
  "id": "<claim-code-id>",
  "code": "DB-ABCD-1234",
  "marketplaceItemId": "<uuid>",
  "marketplaceItemName": "Cây Trầu Bà",
  "plantId": "<inventory-plant-id>",
  "status": "unclaimed",
  "buyerContact": "0901234567",
  "note": "Khách mua ngày 01/06",
  "claimedByUserId": null,
  "claimedByEmail": null,
  "claimedPlantId": null,
  "claimedAt": null,
  "createdAt": "2026-06-01T..."
}
```

```
Luồng ghi nhận thông tin khách sau khi bán:

1. POST /api/admin/plant-inventory đã trả code khi tạo cây (xem 10.4).

2. PUT /api/admin/plant-claim-codes/{id}
   Body: {
     "buyerContact": "0901234567",
     "note": "Khách mua ngày 01/06"
   }
   → 200 OK: {
       id, code, marketplaceItemId, marketplaceItemName,
       plantId,                        // ID inventory plant
       status, buyerContact, note,
       claimedByUserId, claimedByEmail, claimedPlantId, claimedAt,
       createdAt
     }

3. Gửi mã DB-XXXX-XXXX cho khách
   → Khách dùng: POST /api/my-plants/claim

4. PATCH /api/admin/plant-claim-codes/{id}/cancel
   (nếu cần hủy mã chưa được dùng)
   → 200 OK
```

---

### 10.7 Quản lý Feedback

> Feedback gắn với `marketplaceItemId` (sản phẩm), không phải catalog plant.  
> `publicImageUrls` hiển thị cho khách. `evidenceImageUrls` + `evidenceNote` chỉ admin xem, không trả ở public API.

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/feedback?marketplaceItemId=...&isVerified=true\|false&channel=zalo` | Danh sách feedback |
| POST | `/feedback` | Tạo feedback thủ công (admin nhập từ khách) |
| PUT | `/feedback/{id}` | Cập nhật feedback |
| PATCH | `/feedback/{id}/verify` | Xác minh / bỏ xác minh feedback |
| DELETE | `/feedback/{id}` | Xóa feedback |

```
Luồng kiểm duyệt feedback:

1. GET /api/admin/feedback?isVerified=false
   → danh sách feedback chờ duyệt

2. PATCH /api/admin/feedback/{id}/verify
   Body: { "isVerified": true }
   → 200 OK: feedback được đánh dấu đã xác minh

3. Feedback đã verify hiển thị trên public endpoint:
   GET /api/feedback/verified?marketplaceItemId=<uuid>

Luồng tạo feedback thủ công (admin nhập từ phản hồi Zalo/Shopee):

1. POST /api/admin/feedback
   Body: {
     "marketplaceItemId": "<uuid>",
     "customerAlias": "Chị Lan",
     "rating": 5,
     "comment": "Cây đẹp, giao hàng nhanh",
     "purchaseChannel": "Zalo",
     "publicImageUrls": ["https://..."],          // ảnh hiển thị public
     "evidenceImageUrls": ["https://..."],        // ảnh bằng chứng — chỉ admin xem
     "evidenceNote": "Ảnh chụp feedback Zalo ngày 01/06",  // note nội bộ
     "isVerified": true
   }
   → 201 Created
```

---

### 10.8 Quản lý AI Dialogs

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/ai-dialogs` | Xem tất cả hội thoại AI của users |
| GET | `/ai-dialogs/{id}` | Xem chi tiết hội thoại |

```
1. GET /api/admin/ai-dialogs
   → 200 OK: [{ id, userId, userEmail, messageCount, createdAt }]

2. GET /api/admin/ai-dialogs/{id}
   → 200 OK: { id, messages: [{ role, content, createdAt }] }
```

---

## Luồng nghiệp vụ tổng thể

### Luồng mua hàng + claim cây

**Quan hệ dữ liệu:**
```
MarketplaceItem (category=Plant)
    └── PlantInventory   (1 cây vật lý)
            └── PlantClaimCode   (1 mã claim, sinh tự động)
                        └── MyPlant  (sau khi user claim)
```

**Luồng thực tế:**
```
[Admin]                                          [User / Khách mua]
   |                                                      |
   1. POST /admin/marketplace-items                       |
      (category=Plant, tạo listing)                       |
   2. POST /admin/plant-inventory                         |
      (tạo cây vật lý → backend sinh claimCode)           |
   3. PUT /admin/plant-claim-codes/{id}                   |
      (ghi buyerContact / note sau khi bán)               |
   4. Gửi mã DB-XXXX-XXXX cho khách ───────────────────► |
                                                           5. GET /my-plants/claim-preview?code=DB-XXXX-XXXX
                                                           6. POST /my-plants/claim
                                                           7. Cây xuất hiện trong GET /my-plants
                                                           8. POST /reminders (đặt lịch chăm sóc)
                                                           9. POST /ai/diagnose (chẩn đoán nếu có vấn đề)
```

### Luồng feedback từ khách

```
[Khách gửi feedback qua Zalo]   [Admin]                    [Khách vãng lai]
           |                        |                              |
           └─ Gửi ảnh + đánh giá ─►|                              |
                                    ├─ POST /admin/feedback        |
                                    ├─ PATCH .../verify            |
                                    |                              ├─ GET /feedback/verified
                                    |                              └─ Xem đánh giá đã duyệt
```

### Luồng AI Chat

```
[User]
  1. POST /upload/image          (upload ảnh cây)
  2. POST /ai/diagnose           (gửi ảnh để chẩn đoán bệnh)
  3. POST /ai/chat               (hỏi thêm về cách chăm sóc)
  4. GET  /ai/dialogs            (xem lại lịch sử hội thoại)
```

---

## Lưu ý khi test

| # | Lưu ý |
|---|-------|
| 1 | **JWT token:** Luôn `POST /auth/login` trước, thêm header `Authorization: Bearer <token>` |
| 2 | **Admin token:** Cần tài khoản role `ADMIN` — seed DB hoặc login riêng |
| 3 | **Upload ảnh:** `Content-Type: multipart/form-data`, field name là `file` |
| 4 | **Diagnose ảnh:** `Content-Type: multipart/form-data`, field names: `Image` (bắt buộc), `PlantId`, `Question` (tùy chọn) |
| 5 | **Claim code:** Format `DB-XXXX-XXXX` (4 chữ cái + 4 số) |
| 6 | **Phân trang:** Mặc định `page=1&limit=12` cho marketplace |
| 7 | **Token hết hạn:** Dùng `POST /auth/refresh-token` để lấy token mới |

---

## 10. Legacy Endpoints — Đã ngừng sử dụng

> Các endpoint dưới đây đã bị **comment out** trong source code và không còn hoạt động.  
> Chúng được giữ lại trong codebase để tham khảo, **không được dùng** trong frontend hoặc test.

---

### 10.1 `POST /api/plants` _(và các route liên quan)_

**File:** `PlantsController.cs`  
**Thay thế bởi:** `/api/my-plants`

| Method | Route (cũ) | Thay thế |
|--------|-----------|---------|
| GET | `/api/plants` | `GET /api/my-plants` |
| GET | `/api/plants/{id}` | `GET /api/my-plants/{id}` |
| POST | `/api/plants` | `POST /api/my-plants` |
| PUT | `/api/plants/{id}` | `PUT /api/my-plants/{id}` |
| DELETE | `/api/plants/{id}` | `DELETE /api/my-plants/{id}` |

**Lý do ngừng:**

- Yêu cầu `plantSpeciesId` bắt buộc — phải có bản ghi trong bảng `PlantSpecies` trước, không linh hoạt cho user
- Không tích hợp với luồng claim cây (mã `DB-XXXX-XXXX`)
- `/api/my-plants` đã bao phủ toàn bộ chức năng và bổ sung thêm claim flow, free-text species

---

### 10.2 `POST /api/diagnosis`

**File:** `DiagnosisController.cs`  
**Thay thế bởi:** `POST /api/ai/diagnose`

| Field cũ | Field mới |
|----------|----------|
| `image` (form) | `image` (form) — giống nhau |
| `plantId` (form) | `plantId` (form) — giống nhau |
| Route: `/api/diagnosis` | Route: `/api/ai/diagnose` |

**Lý do ngừng:**

- Tách biệt controller chẩn đoán khỏi AI là không cần thiết — cả hai đều dùng chung `DiagnosePlantCommand`
- `AiController` gom tất cả tính năng AI vào một nơi (`/api/ai/*`) cho nhất quán
- Route `/api/diagnosis` không theo convention của project

---

### 10.3 `POST /api/ai-chat/send`

**File:** `AiChatController.cs`  
**Thay thế bởi:** `POST /api/ai/chat`

| | Endpoint cũ | Endpoint mới |
|--|------------|-------------|
| Route | `POST /api/ai-chat/send` | `POST /api/ai/chat` |
| Request field | `message`, `plantId` (string) | `message`, `plantId` (Guid), `history`, `plantContext` |
| Response field | `{ content }` | `{ content }` — giống nhau |

**Lý do ngừng:**

- `plantId` trong endpoint cũ nhận kiểu `string` rồi parse thủ công — không type-safe
- Endpoint mới nhận thêm `history` (lịch sử hội thoại) và `plantContext` (context cây) để AI trả lời chính xác hơn
- Route `/api/ai-chat/send` không nhất quán với convention `/api/ai/*` của project
