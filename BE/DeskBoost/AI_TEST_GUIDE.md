# Hướng dẫn Test Luồng AI — DeskBoost

## Mục lục
1. [Chuẩn bị](#1-chuẩn-bị)
2. [Lấy JWT Token](#2-lấy-jwt-token)
3. [Luồng Chẩn đoán bệnh cây (Diagnose)](#3-luồng-chẩn-đoán-bệnh-cây)
4. [Luồng Chat AI](#4-luồng-chat-ai)
5. [Luồng Xem lịch sử hội thoại (Dialogs)](#5-luồng-xem-lịch-sử-hội-thoại)
6. [Admin — Giám sát AI](#6-admin--giám-sát-ai)
7. [Lỗi thường gặp & cách xử lý](#7-lỗi-thường-gặp--cách-xử-lý)

---

## 1. Chuẩn bị

### 1.1 Cấu hình API keys (bắt buộc)

Mở `DeskBoost.API/appsettings.Development.json` và điền key còn hiệu lực:

```json
{
  "PlantId": {
    "ApiKey": "<PLANT_ID_API_KEY>",
    "BaseUrl": "https://api.plant.id/v3"
  },
  "Gemini": {
    "ApiKey": "<GEMINI_API_KEY>",
    "Model": "gemini-2.5-flash",
    "BaseUrl": "https://generativelanguage.googleapis.com/v1beta"
  },
  "Diagnosis": {
    "ConfidenceThreshold": 0.20
  }
}
```

> **Lưu ý:** `ConfidenceThreshold: 0.20` nghĩa là ảnh cần độ chính xác nhận dạng ≥ 20% mới trả kết quả đầy đủ.

### 1.2 Chạy server

```powershell
cd DeskBoost.API
dotnet run
# Server chạy tại: https://localhost:7072
```

### 1.3 Swagger UI

Mở trình duyệt: `https://localhost:7072/swagger`

### 1.4 Ảnh test

Chuẩn bị ít nhất 1 ảnh cây (JPEG/PNG):
- Ảnh cây bệnh — lá vàng, đốm nâu, v.v.
- Ảnh cây khỏe mạnh (để kiểm tra nhánh `IsHealthy = true`)
- Ảnh mờ/tối (để kiểm tra nhánh `Confidence < Threshold`)

---

## 2. Lấy JWT Token

Tất cả các endpoint AI đều yêu cầu `Authorization: Bearer <token>`.

### Đăng ký tài khoản (nếu chưa có)

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test@123",
  "fullName": "Test User"
}
```

### Đăng nhập lấy token

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test@123"
}
```

**Response:**
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "..."
}
```

Lưu `accessToken` để dùng cho các bước tiếp theo.

**Trong Swagger:** Nhấn nút **Authorize** (khóa) ở góc trên → nhập `Bearer eyJ...`

---

## 3. Luồng Chẩn đoán bệnh cây

### Sơ đồ luồng

```
POST /api/ai/diagnose (multipart/form-data)
    │
    ├─ Validate: Image bắt buộc
    ├─ Validate: PlantId thuộc user (nếu truyền)
    │
    ├─► Plant.id API → nhận diện bệnh từ ảnh
    │       ↓
    │   Confidence >= 0.20?
    │   ├─ KHÔNG → trả { Success: false, Message: "Ảnh chưa đủ rõ..." }
    │   └─ CÓ  → tiếp tục
    │
    ├─► Gemini API → lấy Cause / Severity / Treatment / Prevention
    │
    ├─ Lưu DiagnosisResult vào DB
    └─ Trả DiagnosisResultDto
```

### 3.1 Test cơ bản — có ảnh, không PlantId

**Request (Swagger hoặc curl):**
```
POST /api/ai/diagnose
Content-Type: multipart/form-data
Authorization: Bearer <token>

Image: <file ảnh cây>
```

**Kết quả mong đợi (cây bệnh):**
```json
{
  "success": true,
  "disease": "Powdery Mildew",
  "confidence": 0.87,
  "isHealthy": false,
  "severity": "medium",
  "cause": "Nấm Podosphaera xanthii phát triển trong điều kiện độ ẩm cao",
  "treatment": "Phun dung dịch baking soda 1% hoặc thuốc diệt nấm gốc lưu huỳnh",
  "prevention": "Đảm bảo thông thoáng, tránh tưới lên lá",
  "suggestions": [
    { "name": "Powdery Mildew", "probability": 0.87 },
    { "name": "Downy Mildew", "probability": 0.08 }
  ]
}
```

**Kết quả mong đợi (cây khỏe):**
```json
{
  "success": true,
  "isHealthy": true,
  "disease": "Healthy",
  "confidence": 0.95,
  "severity": "low",
  "treatment": "Cây đang khỏe mạnh, tiếp tục chăm sóc theo lịch thông thường",
  ...
}
```

### 3.2 Test có PlantId

Cần `PlantId` thuộc về user đang đăng nhập.

```
POST /api/ai/diagnose
Content-Type: multipart/form-data

PlantId: <uuid của cây>
Image: <file ảnh>
```

**Kết quả:** Tương tự 3.1, và kết quả được lưu DB gắn với cây đó.

**Test case lỗi — PlantId của người khác:**
```
→ 400 Bad Request: { "message": "..." }
```

### 3.3 Test ảnh chất lượng thấp

Upload ảnh mờ, tối, hoặc không phải ảnh cây:

```
→ 200 OK:
{
  "success": false,
  "confidence": 0.05,
  "message": "Ảnh chưa đủ rõ, vui lòng chụp gần và đủ sáng hơn",
  "suggestions": [...]
}
```

### 3.4 Test thiếu ảnh

```
POST /api/ai/diagnose (không có field Image)
→ 400 Bad Request: { "message": "Vui lòng cung cấp ảnh để chẩn đoán." }
```

### 3.5 Checklist kiểm tra

| Case | Input | Expected |
|------|-------|----------|
| Cây bệnh rõ | Ảnh sắc nét, cây bệnh | `success: true`, có `disease`, `treatment` |
| Cây khỏe | Ảnh cây khỏe | `isHealthy: true`, `severity: low` |
| Ảnh mờ | Ảnh chất lượng kém | `success: false`, có `message` |
| Không có ảnh | Không gửi Image | `400` |
| PlantId hợp lệ | UUID cây của user | `success: true`, lưu DB |
| PlantId không hợp lệ | UUID cây của người khác | `400` |

---

## 4. Luồng Chat AI

### Sơ đồ luồng

```
POST /api/ai/chat (application/json)
    │
    ├─ Validate: PlantId thuộc user (nếu truyền)
    ├─ Tìm/Tạo AiDialog cho (UserId, PlantId)
    ├─ Load 20 tin nhắn gần nhất từ DB (hoặc dùng history từ client)
    ├─ Build system prompt (có/không PlantContext)
    ├─► Gemini Chat API
    ├─ Lưu AiMessage User + Assistant vào DB
    └─ Trả AiChatResponseDto
```

### 4.1 Chat cơ bản — không PlantContext

```http
POST /api/ai/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Cây của tôi bị vàng lá, nguyên nhân là gì?"
}
```

**Kết quả mong đợi:**
```json
{
  "dialogId": "uuid-...",
  "plantId": null,
  "reply": "Lá vàng có thể do nhiều nguyên nhân: thiếu dinh dưỡng (đặc biệt N, Fe), tưới quá nhiều hoặc quá ít, ánh sáng không phù hợp...",
  "disclaimer": "AI advice is for reference only.",
  "createdAt": "2026-06-02T04:00:00Z"
}
```

### 4.2 Chat với PlantContext — AI được cung cấp thông tin cây

```http
POST /api/ai/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Cây của tôi bị vàng lá",
  "plantId": "uuid-cây",
  "plantContext": {
    "id": "uuid-cây",
    "nickname": "Cây cau mini",
    "name": "Cau mini",
    "species": "Dypsis lutescens",
    "status": "Cần chú ý",
    "light": "Ánh sáng gián tiếp",
    "water": "2 lần/tuần",
    "notes": "Đặt trong phòng điều hòa"
  }
}
```

**Kết quả mong đợi:** AI trả lời cụ thể cho loài Dypsis lutescens, điều kiện trong nhà, v.v.

### 4.3 Chat có lịch sử (multi-turn)

```http
POST /api/ai/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Vậy tôi nên tưới bao nhiêu?",
  "history": [
    { "role": "user", "content": "Cây cau bị vàng lá" },
    { "role": "assistant", "content": "Có thể do tưới quá nhiều hoặc thiếu ánh sáng..." }
  ]
}
```

> Sau lần chat đầu tiên, server lưu history vào DB — các lần sau không cần truyền `history` nữa, server tự load.

### 4.4 Test từ chối chủ đề không liên quan

```http
{
  "message": "Viết code Python giúp tôi"
}
```

**Kết quả mong đợi:** AI từ chối, hướng dẫn về chủ đề cây trồng.

### 4.5 Test từ chối chẩn đoán bệnh qua chat

```http
{
  "message": "Cây tôi bị bệnh X, tôi tự điều trị bằng hóa chất Y được không?",
  "plantContext": { ... }
}
```

**Kết quả mong đợi:** AI không tự chẩn đoán, khuyên dùng tính năng chụp ảnh chẩn đoán, không đề xuất hóa chất nguy hiểm.

### 4.6 Checklist kiểm tra

| Case | Input | Expected |
|------|-------|----------|
| Chat đơn giản | Message + không context | AI trả lời chung về cây |
| Chat với context | Message + PlantContext | AI trả lời theo loài, điều kiện cụ thể |
| Multi-turn | Có history | AI nhớ ngữ cảnh cuộc hội thoại |
| Off-topic | Câu hỏi không liên quan cây | AI từ chối, hướng về chủ đề cây |
| Hóa chất nguy hiểm | Hỏi về thuốc mạnh | AI không đề xuất, khuyên tư vấn chuyên gia |
| PlantId sai | UUID không thuộc user | `400` |

---

## 5. Luồng Xem lịch sử hội thoại

### 5.1 Lấy danh sách tất cả dialog

```http
GET /api/ai/dialogs
Authorization: Bearer <token>
```

**Kết quả mong đợi:**
```json
{
  "items": [
    {
      "id": "uuid-dialog",
      "plantId": "uuid-cây",
      "plantName": "Cau mini",
      "title": "Cây của tôi bị vàng lá",
      "lastMessage": "Hãy kiểm tra độ ẩm đất...",
      "createdAt": "2026-06-02T04:00:00Z"
    }
  ]
}
```

**Lưu ý:** Danh sách sắp xếp theo thời gian cập nhật mới nhất.

### 5.2 Xem chi tiết một dialog

```http
GET /api/ai/dialogs/{dialogId}
Authorization: Bearer <token>
```

**Kết quả mong đợi:**
```json
{
  "id": "uuid-dialog",
  "plantId": "uuid-cây",
  "plantName": "Cau mini",
  "title": "Cây của tôi bị vàng lá",
  "messages": [
    { "id": "uuid", "role": "user", "content": "Cây của tôi bị vàng lá", "createdAt": "..." },
    { "id": "uuid", "role": "assistant", "content": "Có thể do...", "createdAt": "..." }
  ],
  "createdAt": "2026-06-02T04:00:00Z"
}
```

### 5.3 Test truy cập dialog của người khác

```http
GET /api/ai/dialogs/<uuid-của-user-khác>
→ 404 Not Found
```

---

## 6. Admin — Giám sát AI

> Cần tài khoản có role **Admin**.

### 6.1 Kiểm tra trạng thái cấu hình AI

```http
GET /api/admin/ai/config
Authorization: Bearer <admin-token>
```

**Kết quả mong đợi (đã cấu hình đúng):**
```json
{
  "provider": "gemini",
  "configured": true,
  "lastCheckedAt": "2026-06-02T04:00:00Z"
}
```

**Kết quả khi thiếu key:**
```json
{
  "provider": "gemini",
  "configured": false,
  ...
}
```

### 6.2 Xem toàn bộ dialog người dùng

```http
GET /api/admin/ai/dialogs
Authorization: Bearer <admin-token>
```

---

## 7. Lỗi thường gặp & cách xử lý

### 7.1 `500 — Gemini API error 403: API key was reported as leaked`

**Nguyên nhân:** Key Gemini bị lộ lên git, Google đã thu hồi.

**Xử lý:**
1. Tạo key mới tại Google AI Studio
2. Cập nhật `appsettings.Development.json`:
   ```json
   "Gemini": { "ApiKey": "<KEY_MỚI>" }
   ```
3. Restart server

### 7.2 `500 — PlantId API error 401`

**Nguyên nhân:** PlantId API key không hợp lệ hoặc hết quota.

**Xử lý:**
1. Kiểm tra key tại `appsettings.Development.json` → `PlantId.ApiKey`
2. Vào trang plant.id kiểm tra quota tài khoản

### 7.3 `400 — Vui lòng cung cấp ảnh để chẩn đoán`

**Nguyên nhân:** Không gửi field `Image` trong form-data, hoặc Swagger đánh dấu "Send empty value".

**Xử lý:** Bỏ tích "Send empty value" trên field Image trong Swagger, chọn file thực.

### 7.4 `200 — { "success": false, "message": "Ảnh chưa đủ rõ..." }`

**Nguyên nhân:** Plant.id nhận dạng với confidence < 20%.

**Xử lý:** Chụp ảnh rõ hơn, đủ sáng, cận cảnh lá/bộ phận bệnh.

### 7.5 Chat không nhớ ngữ cảnh

**Nguyên nhân:** Truyền sai `dialogId` hoặc chat với `PlantId` khác nhau mỗi lần.

**Xử lý:** Sau lần đầu chat, lưu `dialogId` trả về và dùng cùng `plantId` cho các tin tiếp theo.

### 7.6 `401 Unauthorized`

**Nguyên nhân:** JWT token hết hạn (mặc định 15 phút).

**Xử lý:** Dùng `refreshToken` để lấy `accessToken` mới:
```http
POST /api/auth/refresh
{ "refreshToken": "..." }
```

---

## Tóm tắt các endpoint AI

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| `POST` | `/api/ai/diagnose` | User | Chẩn đoán bệnh cây từ ảnh |
| `POST` | `/api/ai/chat` | User | Gửi tin nhắn chat AI |
| `GET` | `/api/ai/dialogs` | User | Danh sách hội thoại |
| `GET` | `/api/ai/dialogs/{id}` | User | Chi tiết một hội thoại |
| `GET` | `/api/admin/ai/config` | Admin | Trạng thái cấu hình AI |
| `GET` | `/api/admin/ai/dialogs` | Admin | Tất cả hội thoại (admin view) |
