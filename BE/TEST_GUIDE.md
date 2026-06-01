# DeskBoost Backend — Hướng Dẫn Test Toàn Bộ Hệ Thống

> Base URL: `http://localhost:5000` (hoặc port được cấu hình trong `launchSettings.json`)  
> Tool đề xuất: **Swagger UI**, **Postman**, hoặc file `.http` của VS Code  
> Mọi endpoint có `[Authorize]` đều cần header: `Authorization: Bearer <access_token>`

---

## Mục Lục

1. [Chuẩn Bị Môi Trường](#1-chuẩn-bị-môi-trường)
2. [Auth — Đăng ký / Đăng nhập](#2-auth)
3. [Users — Hồ sơ người dùng](#3-users)
4. [Upload Ảnh](#4-upload-ảnh)
5. [My Plants — Cây của tôi](#5-my-plants)
6. [Marketplace Items — Sản phẩm cửa hàng (Public)](#6-marketplace-items)
7. [Reminders — Nhắc nhở chăm sóc](#7-reminders)
8. [AI — Chat & Chẩn đoán bệnh](#8-ai)
9. [Feedback — Đánh giá công khai](#9-feedback)
10. [Admin Panel](#10-admin)
11. [Validation — Test lỗi đầu vào](#11-validation)
12. [Authentication & Authorization — Test bảo mật](#12-authentication--authorization)
13. [Thứ Tự Test End-to-End Đề Xuất](#13-thứ-tự-test-end-to-end)

---

## Format lỗi chuẩn

Mọi lỗi đều trả về cùng cấu trúc JSON:

```json
{
  "statusCode": 400,
  "message": "Mô tả lỗi",
  "errors": null
}
```

`errors` là mảng chuỗi, chỉ xuất hiện khi có nhiều lỗi validation.

---

## 1. Chuẩn Bị Môi Trường

### 1.1 Chạy database migration

```bash
cd DeskBoost/DeskBoost.API
dotnet ef database update --project ../DeskBoost.Infrastructure
```

### 1.2 Khởi động server

```bash
dotnet run --project DeskBoost/DeskBoost.API
```

### 1.3 Kiểm tra server đang chạy

```
GET http://localhost:5000/swagger
```

Kết quả mong đợi: Swagger UI hiển thị đầy đủ các endpoint.

---

## 2. Auth

### 2.1 Đăng ký tài khoản thường

**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@test.com",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "fullName": "Nguyen Van A"
}
```

**Kết quả mong đợi:** `201 Created`
```json
{
  "accessToken": "<jwt_token>",
  "refreshToken": "<refresh_token>",
  "user": {
    "id": "<guid>",
    "email": "user@test.com",
    "fullName": "Nguyen Van A",
    "role": "USER"
  }
}
```

> Lưu lại `accessToken` và `refreshToken` để dùng cho các bước tiếp theo.

---

### 2.2 Đăng ký tài khoản admin (để test phần Admin)

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "Admin123!",
  "confirmPassword": "Admin123!",
  "fullName": "Admin DeskBoost"
}
```

> Sau khi đăng ký, vào database đổi `Role = 1` (ADMIN) cho tài khoản này:
> ```sql
> UPDATE "Users" SET "Role" = 1 WHERE "Email" = 'admin@test.com';
> ```
> Rồi login lại để lấy `admin_token`.

---

### 2.3 Đăng nhập

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@test.com",
  "password": "Password123!"
}
```

**Kết quả mong đợi:** `200 OK` — trả về `accessToken` + `refreshToken` mới.

---

### 2.4 Lấy thông tin người dùng hiện tại

```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

**Kết quả mong đợi:** `200 OK`
```json
{
  "id": "<guid>",
  "email": "user@test.com",
  "fullName": "Nguyen Van A",
  "role": "USER"
}
```

---

### 2.5 Refresh token

```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "token": "<refresh_token>"
}
```

**Kết quả mong đợi:** `200 OK` — trả về cặp token mới.

---

### 2.6 Đăng xuất

```http
POST /api/auth/logout
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "refreshToken": "<refresh_token>"
}
```

**Kết quả mong đợi:** `204 No Content`

Sau đó thử dùng lại `refreshToken` vừa logout → phải trả về `401 Unauthorized`.

---

## 3. Users

### 3.1 Lấy hồ sơ cá nhân

```http
GET /api/users/me
Authorization: Bearer <access_token>
```

**Kết quả mong đợi:** `200 OK`
```json
{
  "id": "<guid>",
  "email": "user@test.com",
  "fullName": "Nguyen Van A",
  "role": "USER"
}
```

---

### 3.2 Cập nhật hồ sơ

```http
PUT /api/users/me
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Nguyen Van A Updated",
  "avatarUrl": "https://res.cloudinary.com/...",
  "phone": "0901234567"
}
```

**Kết quả mong đợi:** `200 OK` — trả về thông tin đã cập nhật.

---

### 3.3 Cập nhật hồ sơ với chỉ một trường (partial update)

```http
PUT /api/users/me
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Tên Mới"
}
```

**Kết quả mong đợi:** `200 OK` — chỉ `name` thay đổi, các trường còn lại giữ nguyên.

---

## 4. Upload Ảnh

> Endpoint này dùng để upload ảnh lên Cloudinary và nhận về URL, sau đó dùng URL đó cho `imageUrl` / `avatarUrl` ở các endpoint khác.

### 4.1 Upload ảnh

```http
POST /api/upload/image
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

file: <chọn file ảnh>
```

**Giới hạn:** JPEG / PNG / WebP / GIF, tối đa **5MB**.

**Kết quả mong đợi:** `200 OK`
```json
{
  "url": "https://res.cloudinary.com/<cloud>/image/upload/deskboost/<id>.jpg"
}
```

> Lưu lại `url` để dùng làm `imageUrl` khi tạo/cập nhật cây.

---

## 5. My Plants

> Tất cả endpoint đều cần `Authorization: Bearer <access_token>`

### 5.1 Tạo cây tùy chỉnh (không cần mã claim)

```http
POST /api/my-plants
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Cây Hoa Hồng",
  "species": "Rosa",
  "location": "Sân vườn",
  "imageUrl": "https://res.cloudinary.com/...",
  "notes": "Tưới mỗi ngày"
}
```

> `imageUrl` lấy từ bước **4.1 Upload ảnh**.

**Kết quả mong đợi:** `201 Created`
```json
{
  "id": "<plant_guid>",
  "name": "Cây Hoa Hồng",
  "species": "Rosa",
  "location": "Sân vườn",
  "imageUrl": "https://res.cloudinary.com/...",
  "status": "Active",
  "notes": "Tưới mỗi ngày",
  "createdAt": "..."
}
```

> Lưu lại `plant_guid` để dùng cho các bước tiếp theo.

---

### 5.2 Xem trước thông tin cây trước khi claim

> Dùng mã code do Admin tạo (xem mục **10.6**).

```http
GET /api/my-plants/claim-preview?code=DB-ABCD-1234
Authorization: Bearer <access_token>
```

**Kết quả mong đợi:** `200 OK`
```json
{
  "plantName": "Cây Trầu Bà #001",
  "species": "...",
  "imageUrl": "https://...",
  "marketplaceItem": { "id": "...", "name": "..." }
}
```

**Test lỗi:**
- `code` không tồn tại → `404 Not Found`
- `code` đã được claim → `409 Conflict` hoặc `400 Bad Request`

---

### 5.3 Claim cây bằng mã code (mua hàng)

```http
POST /api/my-plants/claim
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "code": "DB-ABCD-1234",
  "nickname": "Bé Xanh",
  "location": "Góc cửa sổ"
}
```

**Kết quả mong đợi:** `201 Created` — cây được gán vào tài khoản user.

Sau đó `GET /api/my-plants` → cây vừa claim xuất hiện trong danh sách.

---

### 5.4 Lấy danh sách cây

```http
GET /api/my-plants
Authorization: Bearer <access_token>
```

**Kết quả mong đợi:** `200 OK`
```json
{
  "items": [
    { "id": "<plant_guid>", "name": "Cây Hoa Hồng", ... }
  ]
}
```

---

### 5.5 Lấy chi tiết một cây

```http
GET /api/my-plants/<plant_guid>
Authorization: Bearer <access_token>
```

**Kết quả mong đợi:** `200 OK` — chi tiết cây đó.

---

### 5.6 Cập nhật cây

```http
PUT /api/my-plants/<plant_guid>
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Cây Hoa Hồng Đỏ",
  "location": "Ban công",
  "status": "Healthy",
  "notes": "Cần thêm phân bón",
  "wateringCycleDays": 3
}
```

**Kết quả mong đợi:** `200 OK` — dữ liệu đã cập nhật.

---

### 5.7 Xóa cây

```http
DELETE /api/my-plants/<plant_guid>
Authorization: Bearer <access_token>
```

**Kết quả mong đợi:** `204 No Content`

Sau đó `GET /api/my-plants/<plant_guid>` → phải trả về `404 Not Found`.

---

## 6. Marketplace Items

> Không cần đăng nhập để xem.  
> ⚠️ Để có dữ liệu test, cần tạo item qua Admin endpoint trước (xem mục **10.4**).

### 6.1 Lấy danh sách sản phẩm (phân trang)

```http
GET /api/marketplace-items?page=1&limit=12
```

**Kết quả mong đợi:** `200 OK`
```json
{
  "items": [...],
  "pagination": { "page": 1, "limit": 12, "total": 1, "totalPages": 1 }
}
```

---

### 6.2 Lấy chi tiết một sản phẩm

```http
GET /api/marketplace-items/<marketplace_item_guid>
```

**Kết quả mong đợi:** `200 OK`
```json
{
  "id": "<guid>",
  "name": "Cây Trầu Bà",
  "description": "...",
  "category": "Indoor",
  "imageUrl": "https://...",
  "priceText": "150.000đ",
  "contactUrl": "https://shopee.vn/...",
  "careLevel": "Easy",
  "light": "Low",
  "water": "Weekly"
}
```

Trả về `404 Not Found` nếu không tồn tại.

---

## 7. Reminders

> Tất cả endpoint đều cần `Authorization`.  
> `<plant_guid>` lấy từ bước tạo cây ở mục **5.1** hoặc **5.3**.

### 7.1 Tạo reminder

```http
POST /api/reminders
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "plantId": "<plant_guid>",
  "title": "Tưới nước buổi sáng",
  "careType": "watering",
  "dueAt": "2026-06-05T08:00:00Z",
  "repeatRule": "Daily",
  "notes": "Nhớ kiểm tra độ ẩm đất"
}
```

**Kết quả mong đợi:** `201 Created`
```json
{
  "id": "<reminder_guid>",
  "plantId": "<plant_guid>",
  "title": "Tưới nước buổi sáng",
  "careType": "watering",
  "dueAt": "2026-06-05T08:00:00Z",
  "repeatRule": "Daily",
  "status": "Pending"
}
```

---

### 7.2 Lấy danh sách reminder

```http
GET /api/reminders
Authorization: Bearer <access_token>
```

**Kết quả mong đợi:** `200 OK` — `{ "items": [...] }`

---

### 7.3 Cập nhật reminder

```http
PUT /api/reminders/<reminder_guid>
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Tưới nước buổi chiều",
  "dueAt": "2026-06-05T17:00:00Z"
}
```

**Kết quả mong đợi:** `200 OK` — dữ liệu đã cập nhật.

---

### 7.4 Đánh dấu reminder đã hoàn thành

```http
PUT /api/reminders/<reminder_guid>/done
Authorization: Bearer <access_token>
```

**Kết quả mong đợi:** `200 OK` — `status` chuyển thành `"Done"`.

---

### 7.5 Lấy thông tin lịch (calendar)

```http
GET /api/reminders/<reminder_guid>/calendar
Authorization: Bearer <access_token>

GET /api/reminders/<reminder_guid>/calendar?format=ics
Authorization: Bearer <access_token>
```

**Kết quả mong đợi:** JSON với link ICS hoặc file `.ics` để import vào Google Calendar / Outlook.

---

### 7.6 Xóa reminder

```http
DELETE /api/reminders/<reminder_guid>
Authorization: Bearer <access_token>
```

**Kết quả mong đợi:** `204 No Content`

---

## 8. AI

### 8.1 Chat với AI về cây

```http
POST /api/ai/chat
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "message": "Lá cây của tôi bị vàng, phải làm gì?",
  "plantId": "<plant_guid>"
}
```

> `plantId` là optional — nếu truyền, AI sẽ có thêm context về cây.

**Kết quả mong đợi:** `200 OK`
```json
{
  "reply": "Lá vàng có thể do thiếu nước hoặc..."
}
```

---

### 8.2 Chat tiếp tục (có lịch sử)

```http
POST /api/ai/chat
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "message": "Tôi nên tưới bao nhiêu nước?",
  "plantId": "<plant_guid>",
  "history": [
    { "role": "user", "content": "Lá cây của tôi bị vàng, phải làm gì?" },
    { "role": "assistant", "content": "Lá vàng có thể do..." }
  ]
}
```

**Kết quả mong đợi:** `200 OK` — AI trả lời có ngữ cảnh từ lịch sử.

---

### 8.3 Chẩn đoán bệnh cây qua ảnh

```http
POST /api/ai/diagnose
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

image: <file.jpg>          (required)
plantId: <plant_guid>      (optional)
```

**Kết quả mong đợi:** `200 OK`
```json
{
  "success": true,
  "disease": "Leaf Spot",
  "confidence": 0.85,
  "isHealthy": false,
  "cause": "Fungal infection...",
  "treatment": "Apply fungicide...",
  "suggestions": ["Cắt bỏ lá bệnh", "Phun thuốc trừ nấm"]
}
```

---

### 8.4 Lấy danh sách dialog AI

```http
GET /api/ai/dialogs
Authorization: Bearer <access_token>
```

**Kết quả mong đợi:** `200 OK` — `{ "items": [{ "id", "title", "lastMessage", ... }] }`

---

### 8.5 Lấy chi tiết một dialog AI

```http
GET /api/ai/dialogs/<dialog_guid>
Authorization: Bearer <access_token>
```

**Kết quả mong đợi:** `200 OK` — toàn bộ lịch sử tin nhắn trong dialog.

---

## 9. Feedback

> Feedback là **public** — không cần đăng nhập để xem.  
> Admin nhập và kiểm duyệt feedback (xem mục **10.7**).

### 9.1 Xem đánh giá đã xác minh của một sản phẩm

```http
GET /api/feedback/verified?catalogPlantId=<marketplace_item_guid>
```

**Kết quả mong đợi:** `200 OK`
```json
[
  {
    "id": "<guid>",
    "customerAlias": "Chị Lan",
    "rating": 5,
    "comment": "Cây đẹp, giao hàng nhanh",
    "purchaseChannel": "Zalo",
    "publicImageUrls": ["https://..."],
    "createdAt": "2026-05-20T10:00:00Z"
  }
]
```

**Test các trường hợp:**
- Sản phẩm không có feedback → `200 OK: []`
- `catalogPlantId` không hợp lệ → `400 Bad Request`
- Không truyền `catalogPlantId` → `200 OK` (trả về tất cả feedback đã verify)

---

## 10. Admin

> Tất cả endpoint cần token của tài khoản có `Role = "ADMIN"`.

### 10.1 Xem tổng quan hệ thống

```http
GET /api/admin/summary
Authorization: Bearer <admin_token>
```

**Kết quả mong đợi:** `200 OK`
```json
{
  "users": 5,
  "userPlants": 12,
  "marketplaceItems": 8,
  "aiDialogs": 20,
  "aiConfigured": true
}
```

---

### 10.2 Quản lý người dùng

```http
GET /api/admin/users
Authorization: Bearer <admin_token>

GET /api/admin/users/<user_guid>
Authorization: Bearer <admin_token>
```

**Ban user:**
```http
PUT /api/admin/users/<user_guid>/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{ "status": "Banned" }
```

Sau đó thử login bằng tài khoản bị ban → phải bị từ chối.

**Unban user:**
```http
PUT /api/admin/users/<user_guid>/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{ "status": "Active" }
```

---

### 10.3 Quản lý cây của người dùng (User Plants)

```http
GET /api/admin/user-plants
Authorization: Bearer <admin_token>

GET /api/admin/user-plants/<plant_guid>
Authorization: Bearer <admin_token>

PUT /api/admin/user-plants/<plant_guid>/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{ "status": "Inactive" }
```

---

### 10.4 Quản lý Marketplace Items (sản phẩm cửa hàng)

**Tạo sản phẩm:**
```http
POST /api/admin/marketplace-items
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Cây Trầu Bà",
  "description": "Cây phong thủy, dễ trồng trong nhà",
  "category": "Indoor",
  "imageUrl": "https://res.cloudinary.com/...",
  "priceText": "150.000đ",
  "contactUrl": "https://shopee.vn/shop/123",
  "status": "Active",
  "careLevel": "Easy",
  "light": "Low",
  "water": "Weekly",
  "attributesJson": "{}"
}
```

**Kết quả mong đợi:** `201 Created`

**Cập nhật:**
```http
PUT /api/admin/marketplace-items/<marketplace_item_guid>
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Cây Trầu Bà (Updated)",
  "priceText": "120.000đ",
  "status": "Active"
}
```

**Xóa:**
```http
DELETE /api/admin/marketplace-items/<marketplace_item_guid>
Authorization: Bearer <admin_token>
```

**Kết quả mong đợi:** `204 No Content`

**Lấy danh sách (có filter):**
```http
GET /api/admin/marketplace-items?page=1&limit=50&category=Indoor
Authorization: Bearer <admin_token>
```

---

### 10.5 Quản lý Plant Inventory (kho cây vật lý)

> Luồng: Admin nhập cây vào kho → hệ thống tạo claim code → gửi code cho khách mua → khách claim cây.

**Thêm cây vào kho:**
```http
POST /api/admin/plant-inventory
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Cây Trầu Bà #001",
  "marketplaceItemId": "<marketplace_item_guid>",
  "imageUrl": "https://res.cloudinary.com/...",
  "location": "Kệ A-01",
  "wateringCycleDays": 3,
  "notes": "Cây khỏe, mới nhập"
}
```

**Kết quả mong đợi:** `201 Created`
```json
{
  "id": "<inventory_guid>",
  "name": "Cây Trầu Bà #001",
  "claimCode": "DB-ABCD-1234",
  "status": "Unclaimed",
  ...
}
```

**Lấy danh sách kho (filter theo trạng thái):**
```http
GET /api/admin/plant-inventory?status=unclaimed
Authorization: Bearer <admin_token>

GET /api/admin/plant-inventory?status=claimed&marketplaceItemId=<guid>
Authorization: Bearer <admin_token>
```

**Tạo lại mã claim (nếu mã cũ bị lộ/thất lạc):**
```http
POST /api/admin/plant-inventory/<inventory_guid>/regenerate-code
Authorization: Bearer <admin_token>
```

**Kết quả mong đợi:** `200 OK` — `{ "newCode": "DB-EFGH-5678" }`

**Cập nhật thông tin cây:**
```http
PUT /api/admin/plant-inventory/<inventory_guid>
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Cây Trầu Bà #001 (Updated)",
  "location": "Kệ B-02",
  "notes": "Đã bón phân"
}
```

**Xóa cây khỏi kho:**
```http
DELETE /api/admin/plant-inventory/<inventory_guid>
Authorization: Bearer <admin_token>
```

---

### 10.6 Quản lý Plant Claim Codes (mã claim)

**Tạo mã claim cho khách mua:**
```http
POST /api/admin/plant-claim-codes
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "marketplaceItemId": "<marketplace_item_guid>",
  "buyerContact": "0901234567",
  "note": "Khách mua ngày 01/06/2026, Zalo"
}
```

**Kết quả mong đợi:** `201 Created`
```json
{
  "id": "<code_guid>",
  "code": "DB-XXXX-XXXX",
  "status": "Active",
  "buyerContact": "0901234567"
}
```

> Gửi mã `DB-XXXX-XXXX` cho khách. Khách dùng `POST /api/my-plants/claim` để nhận cây.

**Lấy danh sách mã:**
```http
GET /api/admin/plant-claim-codes?marketplaceItemId=<guid>&status=Active
Authorization: Bearer <admin_token>
```

**Hủy mã chưa được dùng:**
```http
PATCH /api/admin/plant-claim-codes/<code_guid>/cancel
Authorization: Bearer <admin_token>
```

**Kết quả mong đợi:** `200 OK`

---

### 10.7 Quản lý Feedback

> Admin nhập feedback từ phản hồi của khách (Zalo, Shopee...) và kiểm duyệt trước khi hiển thị công khai.

**Xem feedback chờ duyệt:**
```http
GET /api/admin/feedback?isVerified=false
Authorization: Bearer <admin_token>
```

**Xem feedback theo sản phẩm:**
```http
GET /api/admin/feedback?catalogPlantId=<marketplace_item_guid>&channel=Zalo
Authorization: Bearer <admin_token>
```

**Nhập feedback thủ công từ khách:**
```http
POST /api/admin/feedback
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "catalogPlantId": "<marketplace_item_guid>",
  "customerAlias": "Chị Lan",
  "rating": 5,
  "comment": "Cây đẹp, giao hàng nhanh, đóng gói cẩn thận",
  "purchaseChannel": "Zalo",
  "publicImageUrls": ["https://..."],
  "evidenceImageUrls": ["https://..."],
  "evidenceNote": "Ảnh chụp từ Zalo",
  "isVerified": false
}
```

**Xác minh feedback (cho phép hiển thị công khai):**
```http
PATCH /api/admin/feedback/<feedback_guid>/verify
Authorization: Bearer <admin_token>
Content-Type: application/json

{ "isVerified": true }
```

**Kết quả mong đợi:** `200 OK`

Sau đó kiểm tra feedback đã xuất hiện trên public endpoint:
```http
GET /api/feedback/verified?catalogPlantId=<marketplace_item_guid>
```

**Bỏ xác minh:**
```http
PATCH /api/admin/feedback/<feedback_guid>/verify
Content-Type: application/json

{ "isVerified": false }
```

**Cập nhật feedback:**
```http
PUT /api/admin/feedback/<feedback_guid>
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "catalogPlantId": "<guid>",
  "customerAlias": "Chị Lan (sửa)",
  "rating": 4,
  "comment": "Nội dung đã chỉnh sửa",
  "purchaseChannel": "Shopee",
  "isVerified": true
}
```

**Xóa feedback:**
```http
DELETE /api/admin/feedback/<feedback_guid>
Authorization: Bearer <admin_token>
```

---

### 10.8 Xem AI Dialogs (Admin)

```http
GET /api/admin/ai-dialogs
Authorization: Bearer <admin_token>

GET /api/admin/ai-dialogs/<dialog_guid>
Authorization: Bearer <admin_token>
```

---

### 10.9 Kiểm tra trạng thái AI Config

```http
GET /api/admin/ai-config/status
Authorization: Bearer <admin_token>
```

---

## 11. Validation — Test Lỗi Đầu Vào

> Mọi lỗi đều trả về format: `{ "statusCode": <code>, "message": "...", "errors": null }`

---

### 11.1 Auth Validation

#### Đăng ký — thiếu email
```http
POST /api/auth/register
Content-Type: application/json

{
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "fullName": "Test User"
}
```
**Kết quả mong đợi:** `400 Bad Request`

#### Đăng ký — thiếu fullName
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "test2@test.com",
  "password": "Password123!",
  "confirmPassword": "Password123!"
}
```
**Kết quả mong đợi:** `400 Bad Request`

#### Đăng ký — confirmPassword không khớp
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "test3@test.com",
  "password": "Password123!",
  "confirmPassword": "WrongPassword!",
  "fullName": "Test User"
}
```
**Kết quả mong đợi:** `400 Bad Request` — `"Mật khẩu xác nhận không khớp."`

#### Đăng ký — email đã tồn tại
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@test.com",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "fullName": "Duplicate User"
}
```
**Kết quả mong đợi:** `409 Conflict`

#### Đăng nhập — sai mật khẩu
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@test.com",
  "password": "WrongPassword!"
}
```
**Kết quả mong đợi:** `401 Unauthorized`

#### Refresh token — token không hợp lệ
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "token": "invalid_refresh_token_here"
}
```
**Kết quả mong đợi:** `401 Unauthorized`

---

### 11.2 Upload Validation

#### Upload — không có file
```http
POST /api/upload/image
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```
**Kết quả mong đợi:** `400 Bad Request`

#### Upload — file không phải ảnh (ví dụ .pdf)
**Kết quả mong đợi:** `400 Bad Request`

#### Upload — file quá lớn (>5MB)
**Kết quả mong đợi:** `400 Bad Request`

---

### 11.3 My Plants Validation

#### Tạo cây — thiếu name
```http
POST /api/my-plants
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "species": "Rosa"
}
```
**Kết quả mong đợi:** `400 Bad Request`

#### Lấy cây — ID không tồn tại
```http
GET /api/my-plants/00000000-0000-0000-0000-000000000000
Authorization: Bearer <access_token>
```
**Kết quả mong đợi:** `404 Not Found`

#### Xóa cây của người dùng khác (cross-user isolation)
Đăng nhập bằng tài khoản thứ 2, thử xóa cây của tài khoản 1:
```http
DELETE /api/my-plants/<plant_guid_of_user1>
Authorization: Bearer <access_token_user2>
```
**Kết quả mong đợi:** `404 Not Found`

#### Claim — mã không tồn tại
```http
POST /api/my-plants/claim
Authorization: Bearer <access_token>
Content-Type: application/json

{ "code": "DB-ZZZZ-9999", "nickname": "Test", "location": "Test" }
```
**Kết quả mong đợi:** `404 Not Found`

---

### 11.4 Reminder Validation

#### Tạo reminder — title rỗng
```http
POST /api/reminders
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "plantId": "<plant_guid>",
  "title": "",
  "careType": "watering",
  "dueAt": "2026-06-05T08:00:00Z"
}
```
**Kết quả mong đợi:** `400 Bad Request`

#### Tạo reminder — plantId không tồn tại
```http
POST /api/reminders
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "plantId": "00000000-0000-0000-0000-000000000000",
  "title": "Test",
  "careType": "watering",
  "dueAt": "2026-06-05T08:00:00Z"
}
```
**Kết quả mong đợi:** `404 Not Found`

---

### 11.5 AI Validation

#### Chat — message rỗng
```http
POST /api/ai/chat
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "message": "",
  "plantId": "<plant_guid>"
}
```
**Kết quả mong đợi:** `400 Bad Request`

#### Chẩn đoán — không có ảnh
```http
POST /api/ai/diagnose
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

plantId: <plant_guid>
```
**Kết quả mong đợi:** `400 Bad Request`

---

### 11.6 Admin Validation

#### Tạo marketplace item — thiếu name
```http
POST /api/admin/marketplace-items
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "description": "Test plant"
}
```
**Kết quả mong đợi:** `400 Bad Request`

#### Cập nhật status user — status rỗng
```http
PUT /api/admin/users/<user_guid>/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{ "status": "" }
```
**Kết quả mong đợi:** `400 Bad Request`

---

## 12. Authentication & Authorization — Test Bảo Mật

### 12.1 Gọi endpoint có [Authorize] không có token

```http
GET /api/my-plants
```

**Kết quả mong đợi:** `401 Unauthorized`

---

### 12.2 Gọi endpoint có [Authorize] với token sai

```http
GET /api/my-plants
Authorization: Bearer invalid.token.here
```

**Kết quả mong đợi:** `401 Unauthorized`

---

### 12.3 Gọi endpoint có [Authorize] với token hết hạn

Đợi token hết hạn (hoặc tạm thời sửa `AccessTokenExpiryMinutes = 1`), rồi gọi bất kỳ endpoint nào có `[Authorize]`.

**Kết quả mong đợi:** `401 Unauthorized`

---

### 12.4 Gọi endpoint Admin với token user thường

```http
GET /api/admin/summary
Authorization: Bearer <access_token_of_normal_user>
```

**Kết quả mong đợi:** `403 Forbidden`

---

### 12.5 Marketplace và Feedback không cần auth (public)

```http
GET /api/marketplace-items
GET /api/feedback/verified?catalogPlantId=<guid>
```

**Kết quả mong đợi:** `200 OK` — dữ liệu hiển thị bình thường, không cần token.

---

## 13. Thứ Tự Test End-to-End Đề Xuất

```
=== PHẦN USER ===
1.  POST /api/auth/register                    → Đăng ký user
2.  POST /api/auth/login                       → Đăng nhập, lấy access_token
3.  GET  /api/auth/me                          → Xác nhận token hoạt động
4.  POST /api/upload/image                     → Upload ảnh, lấy imageUrl
5.  PUT  /api/users/me                         → Cập nhật hồ sơ (avatarUrl từ bước 4)
6.  POST /api/my-plants                        → Tạo cây tùy chỉnh (imageUrl từ bước 4)
7.  GET  /api/my-plants                        → Xem danh sách cây
8.  GET  /api/my-plants/{plant_guid}           → Xem chi tiết cây
9.  PUT  /api/my-plants/{plant_guid}           → Sửa thông tin cây
10. POST /api/reminders                        → Tạo nhắc nhở cho cây
11. GET  /api/reminders                        → Xem danh sách nhắc nhở
12. PUT  /api/reminders/{id}/done              → Đánh dấu hoàn thành
13. GET  /api/reminders/{id}/calendar?format=ics → Xuất lịch ICS
14. POST /api/ai/chat                          → Chat với AI về cây
15. GET  /api/ai/dialogs                       → Xem lịch sử chat
16. POST /api/ai/diagnose                      → Upload ảnh chẩn đoán bệnh
17. POST /api/auth/refresh-token               → Làm mới token
18. POST /api/auth/logout                      → Đăng xuất

=== PHẦN PUBLIC ===
19. GET  /api/marketplace-items                → Xem sản phẩm (không cần auth)
20. GET  /api/marketplace-items/{id}           → Chi tiết sản phẩm
21. GET  /api/feedback/verified?catalogPlantId=<guid> → Xem đánh giá đã duyệt

=== PHẦN ADMIN ===
22. POST /api/auth/login (admin)               → Đăng nhập admin
23. GET  /api/admin/summary                    → Xem tổng quan hệ thống
24. GET  /api/admin/users                      → Xem danh sách users
25. POST /api/upload/image (admin_token)       → Upload ảnh cho sản phẩm
26. POST /api/admin/marketplace-items          → Tạo sản phẩm mới (imageUrl từ bước 25)
27. POST /api/admin/plant-inventory            → Thêm cây vật lý vào kho
28. POST /api/admin/plant-claim-codes          → Tạo mã claim cho khách

=== LUỒNG CLAIM CÂY ===
29. (Dùng lại user_token từ bước 2)
    GET  /api/my-plants/claim-preview?code=DB-XXXX-XXXX  → Xem trước cây
30. POST /api/my-plants/claim                  → Claim cây bằng mã từ bước 28
31. GET  /api/my-plants                        → Xác nhận cây đã xuất hiện

=== LUỒNG FEEDBACK ===
32. POST /api/admin/feedback (admin_token)     → Admin nhập feedback từ khách
33. PATCH /api/admin/feedback/{id}/verify      → Xác minh feedback
34. GET  /api/feedback/verified?catalogPlantId=<guid> → Xác nhận hiển thị công khai

=== TEST BẢO MẬT ===
35. PUT  /api/admin/users/{id}/status (Banned) → Ban tài khoản user test
36. POST /api/auth/login (banned user)         → Xác nhận bị từ chối đăng nhập
37. PUT  /api/admin/users/{id}/status (Active) → Unban
```

---

## Ghi Chú Bổ Sung

| Mục | Chi tiết |
|-----|----------|
| **Upload ảnh** | Upload tại `POST /api/upload/image` trước, dùng URL trả về cho `imageUrl` / `avatarUrl` |
| **AI API Keys** | Nếu không có Gemini API key hợp lệ, `/api/ai/diagnose` và `/api/ai/chat` có thể trả về lỗi 500 |
| **CORS** | Dev đang cấu hình `AllowAnyOrigin` — môi trường production cần giới hạn lại |
| **Access Token TTL** | 15 phút — dùng refresh token để lấy token mới |
| **Refresh Token TTL** | 7 ngày — sau logout bị thu hồi ngay |
| **Phân trang** | Query params: `?page=1&limit=12` (marketplace); mặc định `limit=50` cho admin |
| **Claim code format** | `DB-XXXX-XXXX` (4 chữ cái hoa + 4 chữ số) |
| **Enum status** | `Active`, `Inactive`, `Banned` |
| **Enum careType** | `watering`, `fertilizing`, `repotting`, `other` |
| **Enum repeatRule** | `Daily`, `Weekly`, `Monthly` |
| **Format lỗi** | Mọi lỗi trả về `{ "statusCode": int, "message": string, "errors": string[]? }` |
