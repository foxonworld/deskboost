# Luồng Feedback Admin — DeskBoost

## Tổng quan

Admin tạo feedback thủ công và gắn vào marketplace item. Ảnh được upload lên Cloudinary trước, sau đó URL được đính kèm vào feedback. Feedback cần được verify trước khi hiển thị công khai.

---

## Kiến trúc

```
[Admin]
  │
  ├─► POST /api/upload/image          → Cloudinary → trả về URL
  │
  ├─► POST /api/admin/feedback        → Tạo feedback (gắn URL ảnh)
  ├─► GET  /api/admin/feedback        → Xem danh sách (có filter)
  ├─► PUT  /api/admin/feedback/{id}   → Cập nhật feedback
  ├─► PATCH /api/admin/feedback/{id}/verify → Duyệt / bỏ duyệt
  └─► DELETE /api/admin/feedback/{id} → Xóa feedback

[Public / User]
  └─► GET /api/feedback/verified      → Chỉ xem feedback đã verified
```

---

## Chi tiết từng bước

### Bước 1 — Upload ảnh

**Endpoint:** `POST /api/upload/image`  
**Auth:** Bắt buộc (Bearer token)  
**Content-Type:** `multipart/form-data`

| Field | Type | Mô tả |
|-------|------|-------|
| file | IFormFile | File ảnh cần upload |

**Giới hạn:**
- Định dạng: JPEG, PNG, WebP, GIF
- Kích thước tối đa: 5MB

**Response 200:**
```json
{
  "url": "https://res.cloudinary.com/deskboost/image/upload/..."
}
```

> Lưu lại URL này để dùng ở bước 2. Mỗi ảnh cần upload riêng một lần.

---

### Bước 2 — Tạo feedback

**Endpoint:** `POST /api/admin/feedback`  
**Auth:** Bắt buộc (Admin)

**Request body:**
```json
{
  "marketplaceItemId": "uuid-của-sản-phẩm",
  "customerAlias": "Nguyễn Văn A",
  "rating": 5,
  "comment": "Cây đẹp, đúng như mô tả, giao hàng nhanh",
  "purchaseChannel": "zalo",
  "publicImageUrls": [
    "https://res.cloudinary.com/..."
  ],
  "evidenceImageUrls": [
    "https://res.cloudinary.com/..."
  ],
  "evidenceNote": "Ảnh bill mua hàng qua Zalo ngày 01/06/2026",
  "isVerified": false
}
```

| Field | Bắt buộc | Mô tả |
|-------|----------|-------|
| marketplaceItemId | Không | UUID của marketplace item cần gắn feedback |
| customerAlias | Không | Tên hiển thị của khách hàng |
| rating | Không | Điểm đánh giá (1–5) |
| comment | Không | Nội dung nhận xét |
| purchaseChannel | Không | Kênh mua hàng (zalo, shopee, facebook...) |
| publicImageUrls | Không | Danh sách URL ảnh hiển thị công khai |
| evidenceImageUrls | Không | Danh sách URL ảnh bằng chứng (chỉ admin thấy) |
| evidenceNote | Không | Ghi chú về bằng chứng |
| isVerified | Không | Mặc định `false` — cần verify riêng |

**Response 201:**
```json
{
  "id": "uuid",
  "marketplaceItemId": "uuid",
  "customerAlias": "Nguyễn Văn A",
  "rating": 5,
  "comment": "Cây đẹp...",
  "purchaseChannel": "zalo",
  "publicImageUrls": ["https://res.cloudinary.com/..."],
  "evidenceImageUrls": ["https://res.cloudinary.com/..."],
  "evidenceNote": "Ảnh bill...",
  "isVerified": false,
  "verifiedAt": null,
  "sourceType": "admin_manual",
  "createdByAdminId": "uuid-của-admin",
  "createdAt": "2026-06-02T...",
  "updatedAt": null
}
```

---

### Bước 3 — Xem danh sách feedback

**Endpoint:** `GET /api/admin/feedback`  
**Auth:** Bắt buộc (Admin)

**Query params (tất cả optional):**

| Param | Mô tả | Ví dụ |
|-------|-------|-------|
| marketplaceItemId | Lọc theo sản phẩm | `?marketplaceItemId=uuid` |
| isVerified | Lọc theo trạng thái duyệt | `?isVerified=false` |
| channel | Lọc theo kênh mua | `?channel=zalo` |

**Response 200:**
```json
{
  "items": [
    {
      "id": "uuid",
      "marketplaceItemId": "uuid",
      "customerAlias": "Nguyễn Văn A",
      "rating": 5,
      "isVerified": false,
      ...
    }
  ]
}
```

---

### Bước 4 — Cập nhật feedback

**Endpoint:** `PUT /api/admin/feedback/{id}`  
**Auth:** Bắt buộc (Admin)

Request body giống POST. Các field nào truyền vào thì mới được cập nhật.

> ⚠️ **Lưu ý ảnh:** `publicImageUrls` và `evidenceImageUrls` khi truyền vào sẽ **thay thế toàn bộ** danh sách cũ. Muốn giữ ảnh cũ thì phải truyền lại đầy đủ URL cũ + URL mới.

**Response 200:** Trả về object feedback đã cập nhật.

**Response 404:** Không tìm thấy feedback.

---

### Bước 5 — Duyệt / bỏ duyệt feedback

**Endpoint:** `PATCH /api/admin/feedback/{id}/verify`  
**Auth:** Bắt buộc (Admin)

**Request body:**
```json
{
  "isVerified": true
}
```

Sau khi `isVerified = true`, feedback sẽ xuất hiện ở `GET /api/feedback/verified` (public).

**Response 200:** Trả về object feedback với `verifiedAt` được set.

---

### Bước 6 — Xóa feedback

**Endpoint:** `DELETE /api/admin/feedback/{id}`  
**Auth:** Bắt buộc (Admin)

**Response 204:** Xóa thành công.  
**Response 404:** Không tìm thấy.

---

## Public endpoint (User xem)

**Endpoint:** `GET /api/feedback/verified`  
**Auth:** Không cần

**Query params:**

| Param | Mô tả |
|-------|-------|
| marketplaceItemId | Lọc feedback theo sản phẩm |

Chỉ trả về feedback có `isVerified = true`. Response **không bao gồm** `evidenceImageUrls` và `evidenceNote`.

---

## Phân biệt 2 loại DTO

| Field | AdminFeedbackDto | FeedbackDto (public) |
|-------|-----------------|---------------------|
| publicImageUrls | ✅ | ✅ |
| evidenceImageUrls | ✅ | ❌ |
| evidenceNote | ✅ | ❌ |
| sourceType | ✅ | ❌ |
| createdByAdminId | ✅ | ❌ |
| verifiedAt | ✅ | ✅ |
| updatedAt | ✅ | ❌ |

---

## Lưu trữ ảnh

- Ảnh được upload lên **Cloudinary** qua `POST /api/upload/image`
- URL Cloudinary được lưu dưới dạng **JSON array** trong DB:
  - Cột `PublicImageUrlsJson` — ảnh public
  - Cột `EvidenceImageUrlsJson` — ảnh bằng chứng
- Khi đọc ra, JSON được deserialize thành `List<string>`

---

## Trường hợp lỗi thường gặp

| Tình huống | HTTP Code | Xử lý |
|------------|-----------|-------|
| Feedback không tồn tại (PUT/PATCH/DELETE) | 404 | Kiểm tra lại ID |
| File ảnh sai định dạng | 400 | Chỉ dùng JPEG/PNG/WebP/GIF |
| File ảnh > 5MB | 400 | Nén ảnh trước khi upload |
| Chưa đăng nhập | 401 | Thêm Bearer token |
| marketplaceItemId không tồn tại | 500/FK error | Kiểm tra UUID có trong DB |
