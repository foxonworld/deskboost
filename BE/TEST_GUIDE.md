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
6. [Marketplace Plants — Cây bán hàng (Public)](#6-marketplace-plants)
7. [Reminders — Nhắc nhở chăm sóc](#7-reminders)
8. [AI — Chat & Chẩn đoán bệnh](#8-ai)
9. [Feedback](#9-feedback)
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

> Sau khi đăng ký, vào database đổi `Role = 'ADMIN'` cho tài khoản này, rồi login lại để lấy token admin.

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

### 5.1 Tạo cây mới

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

### 5.2 Lấy danh sách cây

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

### 5.3 Lấy chi tiết một cây

```http
GET /api/my-plants/<plant_guid>
Authorization: Bearer <access_token>
```

**Kết quả mong đợi:** `200 OK` — chi tiết cây đó.

---

### 5.4 Cập nhật cây

```http
PUT /api/my-plants/<plant_guid>
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Cây Hoa Hồng Đỏ",
  "location": "Ban công",
  "status": "Healthy",
  "notes": "Cần thêm phân bón"
}
```

**Kết quả mong đợi:** `200 OK` — dữ liệu đã cập nhật.

---

### 5.5 Xóa cây

```http
DELETE /api/my-plants/<plant_guid>
Authorization: Bearer <access_token>
```

**Kết quả mong đợi:** `204 No Content`

Sau đó `GET /api/my-plants/<plant_guid>` → phải trả về `404 Not Found`.

---

## 6. Marketplace Plants

> Không cần đăng nhập để xem.  
> ⚠️ Để có dữ liệu test, cần tạo cây qua Admin endpoint trước (xem mục 10.4).

### Chuẩn bị dữ liệu (nếu chưa có cây nào)

1. Đổi role trong database:
   ```sql
   UPDATE "Users" SET "Role" = 1 WHERE "Email" = 'admin@test.com';
   ```
2. Login lại bằng `admin@test.com` để lấy `admin_token`
3. Tạo cây marketplace (xem mục **10.4**)
4. Quay lại test các endpoint bên dưới

---

### 6.1 Lấy danh sách cây marketplace (phân trang)

```http
GET /api/marketplace-plants?page=1&limit=10
```

**Kết quả mong đợi:** `200 OK`
```json
{
  "items": [...],
  "pagination": { "page": 1, "limit": 10, "total": 1, "totalPages": 1 }
}
```

---

### 6.2 Lấy chi tiết một cây marketplace

```http
GET /api/marketplace-plants/<marketplace_plant_guid>
```

**Kết quả mong đợi:** `200 OK` hoặc `404 Not Found` nếu không tồn tại.

---

## 7. Reminders

> Tất cả endpoint đều cần `Authorization`.  
> `<plant_guid>` lấy từ bước tạo cây ở mục 5.1.

### 7.1 Tạo reminder

```http
POST /api/reminders
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "plantId": "<plant_guid>",
  "title": "Tưới nước buổi sáng",
  "careType": "watering",
  "dueAt": "2026-06-01T08:00:00Z",
  "repeatRule": "Daily",
  "notes": "Nhớ kiểm tra độ ẩm đất"
}
```

**Kết quả mong đợi:** `200 OK`
```json
{
  "id": "<reminder_guid>",
  "plantId": "<plant_guid>",
  "title": "Tưới nước buổi sáng",
  "careType": "watering",
  "dueAt": "2026-06-01T08:00:00Z",
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
  "dueAt": "2026-06-01T17:00:00Z"
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

**Kết quả mong đợi:** JSON với link ICS hoặc file `.ics` để import vào lịch.

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
  "plantId": "<plant_guid>",
  "message": "Lá cây của tôi bị vàng, phải làm gì?"
}
```

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
  "plantId": "<plant_guid>",
  "message": "Tôi nên tưới bao nhiêu nước?"
}
```

**Kết quả mong đợi:** `200 OK` — AI trả lời có ngữ cảnh từ lịch sử.

---

### 8.3 Chẩn đoán bệnh cây qua ảnh

```http
POST /api/ai/diagnose
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

plantId: <plant_guid>           (optional)
question: "Cây bị bệnh gì?"    (optional)
image: <file.jpg>               (required)
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

### 9.1 Gửi feedback

```http
POST /api/feedback
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "message": "Ứng dụng rất hữu ích, tôi thích tính năng chẩn đoán bệnh cây!",
  "rating": 5
}
```

**Kết quả mong đợi:** `200 OK`

---

### 9.2 Gửi feedback không có rating (optional)

```http
POST /api/feedback
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "message": "Cần thêm tính năng xuất báo cáo chăm sóc cây."
}
```

**Kết quả mong đợi:** `200 OK`

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
  "marketplacePlants": 8,
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

### 10.3 Quản lý cây của người dùng

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

### 10.4 Quản lý Marketplace Plants

**Tạo cây:**
```http
POST /api/admin/marketplace-plants
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Cây Xương Rồng Mini",
  "description": "Dễ trồng, ít tưới nước",
  "imageUrl": "https://res.cloudinary.com/...",
  "priceText": "50.000đ - 100.000đ",
  "careLevel": "easy",
  "light": "Ánh sáng mạnh",
  "water": "1 lần/tuần",
  "contactUrl": "https://shopee.vn/shop/123",
  "status": "active"
}
```

**Kết quả mong đợi:** `200 OK`

**Cập nhật:**
```http
PUT /api/admin/marketplace-plants/<marketplace_plant_guid>
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Cây Xương Rồng Mini (Updated)",
  "priceText": "60.000đ - 120.000đ",
  "status": "active"
}
```

**Xóa:**
```http
DELETE /api/admin/marketplace-plants/<marketplace_plant_guid>
Authorization: Bearer <admin_token>
```

**Kết quả mong đợi:** `204 No Content`

---

### 10.5 Xem AI Dialogs (Admin)

```http
GET /api/admin/ai-dialogs
Authorization: Bearer <admin_token>

GET /api/admin/ai-dialogs/<dialog_guid>
Authorization: Bearer <admin_token>
```

---

### 10.6 Kiểm tra trạng thái AI Config

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
**Kết quả mong đợi:** `400 Bad Request` — `"Họ và tên không được để trống."`

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
**Kết quả mong đợi:** `409 Conflict` — `"Email đã được sử dụng."`

#### Đăng nhập — sai mật khẩu
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@test.com",
  "password": "WrongPassword!"
}
```
**Kết quả mong đợi:** `401 Unauthorized` — `"Email hoặc mật khẩu không đúng."`

#### Đăng nhập — email không tồn tại
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "notexist@test.com",
  "password": "Password123!"
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
**Kết quả mong đợi:** `401 Unauthorized` — `"Refresh token không hợp lệ hoặc đã hết hạn."`

---

### 11.2 Upload Validation

#### Upload — không có file
```http
POST /api/upload/image
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```
**Kết quả mong đợi:** `400 Bad Request` — `"File ảnh không được để trống."`

#### Upload — file không phải ảnh (ví dụ .pdf)
**Kết quả mong đợi:** `400 Bad Request` — `"Chỉ chấp nhận ảnh định dạng JPEG, PNG, WebP hoặc GIF."`

#### Upload — file quá lớn (>5MB)
**Kết quả mong đợi:** `400 Bad Request` — `"Kích thước ảnh không được vượt quá 5MB."`

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

#### Tạo cây — name rỗng hoặc chỉ có khoảng trắng
```http
POST /api/my-plants
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "   ",
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

#### Lấy cây — ID không phải GUID hợp lệ
```http
GET /api/my-plants/not-a-valid-guid
Authorization: Bearer <access_token>
```
**Kết quả mong đợi:** `400 Bad Request`

#### Xóa cây của người dùng khác (cross-user)
Đăng nhập bằng tài khoản thứ 2, thử xóa cây của tài khoản 1:
```http
DELETE /api/my-plants/<plant_guid_of_user1>
Authorization: Bearer <access_token_user2>
```
**Kết quả mong đợi:** `404 Not Found`

---

### 11.4 Reminder Validation

#### Tạo reminder — thiếu title hoặc title rỗng
```http
POST /api/reminders
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "plantId": "<plant_guid>",
  "title": "",
  "careType": "watering",
  "dueAt": "2026-06-01T08:00:00Z"
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
  "dueAt": "2026-06-01T08:00:00Z"
}
```
**Kết quả mong đợi:** `404 Not Found`

---

### 11.5 AI Validation

#### Chat — thiếu hoặc rỗng message
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

question: "Cây bị bệnh gì?"
```
**Kết quả mong đợi:** `400 Bad Request`

---

### 11.6 Feedback Validation

#### Gửi feedback — thiếu hoặc rỗng message
```http
POST /api/feedback
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "rating": 4
}
```
**Kết quả mong đợi:** `400 Bad Request`

---

### 11.7 Admin Validation

#### Tạo marketplace plant — thiếu name
```http
POST /api/admin/marketplace-plants
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

Đợi 15 phút sau khi đăng nhập (hoặc tạm thời sửa `AccessTokenExpiryMinutes = 1`), rồi gọi bất kỳ endpoint nào có `[Authorize]`.

**Kết quả mong đợi:** `401 Unauthorized`

---

### 12.4 Gọi endpoint Admin với token user thường

```http
GET /api/admin/summary
Authorization: Bearer <access_token_of_normal_user>
```

**Kết quả mong đợi:** `403 Forbidden`

---

### 12.5 Marketplace endpoint không cần auth (public)

```http
GET /api/marketplace-plants
```

**Kết quả mong đợi:** `200 OK` — danh sách cây hiển thị bình thường.

---

## 13. Thứ Tự Test End-to-End Đề Xuất

```
1.  POST /api/auth/register             → Đăng ký user (kèm confirmPassword)
2.  POST /api/auth/login                → Đăng nhập, lấy token
3.  GET  /api/auth/me                   → Xác nhận token hoạt động
4.  POST /api/upload/image              → Upload ảnh, lấy URL
5.  PUT  /api/users/me                  → Cập nhật hồ sơ (dùng URL ảnh vừa upload)
6.  POST /api/my-plants                 → Tạo cây (dùng imageUrl từ bước 4)
7.  GET  /api/my-plants                 → Xem danh sách cây
8.  GET  /api/my-plants/{plant_guid}    → Xem chi tiết cây
9.  PUT  /api/my-plants/{plant_guid}    → Sửa thông tin cây
10. POST /api/reminders                 → Tạo nhắc nhở cho cây
11. GET  /api/reminders                 → Xem danh sách nhắc nhở
12. PUT  /api/reminders/{id}/done       → Đánh dấu hoàn thành
13. GET  /api/reminders/{id}/calendar   → Xuất lịch ICS
14. GET  /api/marketplace-plants        → Xem cây marketplace (không cần auth)
15. POST /api/ai/chat                   → Chat với AI về cây
16. GET  /api/ai/dialogs                → Xem lịch sử chat
17. POST /api/ai/diagnose               → Upload ảnh chẩn đoán bệnh
18. POST /api/feedback                  → Gửi feedback
19. POST /api/auth/refresh-token        → Làm mới token
20. POST /api/auth/logout               → Đăng xuất

--- Chuyển sang tài khoản Admin ---
21. POST /api/auth/login (admin)                 → Đăng nhập admin
22. GET  /api/admin/summary                      → Xem tổng quan
23. GET  /api/admin/users                        → Quản lý users
24. POST /api/upload/image (admin_token)         → Upload ảnh marketplace
25. POST /api/admin/marketplace-plants           → Thêm cây vào marketplace
26. GET  /api/admin/ai-config/status             → Kiểm tra AI config
27. PUT  /api/admin/users/{id}/status (Banned)   → Ban user test
28. POST /api/auth/login (banned user)           → Xác nhận bị từ chối
```

---

## Ghi Chú Bổ Sung

| Mục | Chi tiết |
|-----|----------|
| **Upload ảnh** | Upload trước tại `POST /api/upload/image`, lấy URL dùng cho `imageUrl` / `avatarUrl` |
| **AI API Keys** | Nếu không có PlantId/Gemini API key hợp lệ, endpoint `/api/ai/diagnose` và `/api/ai/chat` có thể trả về lỗi 500 |
| **CORS** | Dev đang cấu hình `AllowAnyOrigin` — môi trường production cần giới hạn lại |
| **Access Token TTL** | 15 phút — dùng refresh token để lấy token mới |
| **Refresh Token TTL** | 7 ngày — sau logout bị thu hồi ngay |
| **Phân trang Marketplace** | Query params: `?page=1&limit=10` |
| **Enum values** | `status`: `Active`, `Inactive`, `Banned`; `careType`: `watering`, `fertilizing`, `repotting`, `other`; `repeatRule`: `Daily`, `Weekly`, `Monthly` |
| **Format lỗi** | Mọi lỗi trả về `{ "statusCode": int, "message": string, "errors": string[]? }` |
