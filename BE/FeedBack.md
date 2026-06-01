Đúng, nên thêm ảnh bằng chứng cho feedback admin nhập lại. Flow nên là:

```text
Khách mua qua Zalo/Facebook
→ khách gửi feedback + ảnh/chụp màn hình
→ admin upload ảnh bằng chứng
→ admin nhập feedback gắn vào cây marketplace
→ public chỉ thấy review + ảnh public nếu cho phép
→ evidence nội bộ chỉ admin xem
```

**API Đề Xuất**

```http
GET /api/admin/feedback
```

Lấy danh sách feedback cho admin quản lý.

Query optional:

```text
catalogPlantId=uuid
isVerified=true/false
channel=zalo/facebook/manual/other
```

---

```http
POST /api/admin/feedback
```

Admin tạo feedback manual từ Zalo/Facebook.

Body:

```json
{
  "catalogPlantId": "uuid",
  "customerAlias": "Khách từ Zalo",
  "rating": 5,
  "comment": "Cây đẹp, giao nhanh, đóng gói kỹ.",
  "purchaseChannel": "zalo",
  "publicImageUrls": [
    "https://res.cloudinary.com/.../customer-plant.jpg"
  ],
  "evidenceImageUrls": [
    "https://res.cloudinary.com/.../zalo-screenshot.jpg"
  ],
  "evidenceNote": "Khách gửi feedback qua Zalo ngày 14/05.",
  "isVerified": true
}
```

Giải thích:

- `catalogPlantId`: cây marketplace được review.
- `customerAlias`: tên hiển thị public, không dùng tên thật nếu không cần.
- `comment`: nội dung review public.
- `purchaseChannel`: nguồn mua, ví dụ `zalo`, `facebook`, `manual`, `other`.
- `publicImageUrls`: ảnh được phép hiện cho người dùng xem, ví dụ ảnh cây khách chụp.
- `evidenceImageUrls`: ảnh bằng chứng nội bộ, ví dụ screenshot tin nhắn Zalo/Facebook.
- `evidenceNote`: ghi chú nội bộ cho admin.
- `isVerified`: admin nhập từ bằng chứng thật thì có thể tạo verified luôn.

---

```http
PUT /api/admin/feedback/{id}
```

Admin sửa feedback.

Body giống create:

```json
{
  "catalogPlantId": "uuid",
  "customerAlias": "Khách từ Facebook",
  "rating": 4,
  "comment": "Cây ổn, shop tư vấn nhiệt tình.",
  "purchaseChannel": "facebook",
  "publicImageUrls": [
    "https://res.cloudinary.com/.../review-public.jpg"
  ],
  "evidenceImageUrls": [
    "https://res.cloudinary.com/.../messenger-proof.jpg"
  ],
  "evidenceNote": "Feedback từ Messenger.",
  "isVerified": true
}
```

---

```http
PATCH /api/admin/feedback/{id}/verify
```

Verify/unverify.

Body:

```json
{
  "isVerified": true
}
```

---

```http
DELETE /api/admin/feedback/{id}
```

Xóa feedback sai/không còn hợp lệ.

---

**Public API**

```http
GET /api/feedback/verified?catalogPlantId=uuid
```

Public chỉ trả feedback đã verified.

Response nên trả:

```json
{
  "items": [
    {
      "id": "uuid",
      "catalogPlantId": "uuid",
      "customerAlias": "Khách từ Zalo",
      "rating": 5,
      "comment": "Cây đẹp, giao nhanh, đóng gói kỹ.",
      "purchaseChannel": "zalo",
      "publicImageUrls": [
        "https://res.cloudinary.com/.../customer-plant.jpg"
      ],
      "isVerified": true,
      "verifiedAt": "2026-06-01T10:00:00Z",
      "createdAt": "2026-06-01T09:30:00Z"
    }
  ]
}
```

Không trả public:

```json
{
  "evidenceImageUrls": [],
  "evidenceNote": ""
}
```

Hai field này chỉ admin xem.

**Upload Ảnh**

Dùng lại API hiện có:

```http
POST /api/upload/image
```

FE upload ảnh trước, lấy URL, rồi đưa URL vào:

- `publicImageUrls`
- `evidenceImageUrls`

**DB Fields Đề Xuất**

```text
Feedback
- Id
- CatalogPlantId
- UserId nullable
- CustomerAlias
- Message / Comment
- Rating
- PurchaseChannel
- PublicImageUrlsJson
- EvidenceImageUrlsJson
- EvidenceNote
- IsVerified
- VerifiedAt
- CreatedByAdminId nullable
- SourceType: user | admin_manual
- CreatedAt
- UpdatedAt
```

**Kết luận ngắn**

API hiện tại chưa đủ. Cần thêm admin feedback API riêng, hỗ trợ:

- gắn feedback vào cây marketplace
- nhập tên khách
- lưu channel Zalo/Facebook
- lưu ảnh public
- lưu ảnh bằng chứng nội bộ
- verify ngay khi admin tạo
- public API không lộ evidence nội bộ.