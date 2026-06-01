# Kế hoạch chỉnh sửa API cho MarketplaceItem và Plant Claim Code

Tài liệu này mô tả lại đúng ý tưởng hiện tại của DeskBoost để gửi BE tham khảo.

Mục tiêu chính:

- Marketplace không chỉ bán cây, mà còn bán chậu, đất trồng, phân bón, phụ kiện.
- Các item trên marketplace là catalog/listing, không phải từng cây vật lý duy nhất.
- Ownership/claim code chỉ áp dụng cho item loại cây (`category = plant`).
- Mỗi lần bán một cây từ cùng một listing, admin tạo một mã code riêng.
- User nhập code để thêm cây đã mua vào My Plants.
- Sau khi claim, admin xem được cây đó trong Admin User Plants và theo dõi thông tin user cập nhật.

Không làm:

- Không tạo code cho phân bón, chậu, đất, phụ kiện.
- Không coi MarketplaceItem là cây vật lý duy nhất.
- Không dùng mock code hoặc QR giả.

---

## 1. Ý tưởng đúng của hệ thống

Marketplace hiện tại nên được hiểu là nơi hiển thị **loại sản phẩm / catalog item**.

Ví dụ:

```text
Marketplace item: Cây Tim Tròn
```

Điều này không có nghĩa là chỉ có một cây Tim Tròn duy nhất. Đây là một loại cây có thể bán nhiều lần.

Ví dụ flow bán hàng:

```text
Admin có listing "Cây Tim Tròn"
        |
        v
Khách A mua Cây Tim Tròn
        |
        v
Admin tạo CODE-A cho khách A
        |
        v
Khách A nhập CODE-A
        |
        v
App tạo MyPlant riêng cho khách A
```

Khách B cũng mua cùng loại cây:

```text
Cùng listing "Cây Tim Tròn"
        |
        v
Admin tạo CODE-B cho khách B
        |
        v
Khách B nhập CODE-B
        |
        v
App tạo MyPlant riêng cho khách B
```

Bảng minh họa:

| MarketplaceItem | Category | Code | User | MyPlant |
| --- | --- | --- | --- | --- |
| Cây Tim Tròn | plant | CODE-A | Khách A | Cây Tim Tròn của Khách A |
| Cây Tim Tròn | plant | CODE-B | Khách B | Cây Tim Tròn của Khách B |
| Cây Tim Tròn | plant | CODE-C | Chưa claim | Chưa có MyPlant |
| Chậu gốm | pot | Không áp dụng | Không áp dụng | Không áp dụng |
| Phân bón | fertilizer | Không áp dụng | Không áp dụng | Không áp dụng |

Câu mô tả ngắn:

```text
MarketplaceItem là sản phẩm/catalog bán hàng.
PlantClaimCode là mã riêng cho từng cây vật lý đã bán.
MyPlant là cây cá nhân của user sau khi claim code.
```

---

## 2. Domain model đề xuất

## 2.1. MarketplaceItem

Thay vì `MarketplacePlant`, nên đổi sang `MarketplaceItem` vì marketplace bán nhiều loại sản phẩm.

```text
MarketplaceItem
- Id
- Name
- Description
- Category
- ImageUrl
- PriceText
- ContactUrl
- Status
- CareLevel nullable
- Light nullable
- Water nullable
- AttributesJson nullable
- CreatedAt
- UpdatedAt
```

Category đề xuất:

```text
plant
pot
soil
fertilizer
accessory
other
```

Ý nghĩa:

```text
Category = plant
=> item là cây, có thể tạo claim code sau khi bán.

Category != plant
=> item là chậu/đất/phân bón/phụ kiện, không tạo claim code.
```

Ví dụ cây:

```json
{
  "name": "Cây Tim Tròn",
  "description": "Cây để bàn dễ chăm.",
  "category": "plant",
  "imageUrl": "https://...",
  "priceText": "180.000 VND",
  "contactUrl": "https://zalo.me/...",
  "status": "active",
  "careLevel": "2",
  "light": "3",
  "water": "1/3",
  "attributesJson": null
}
```

Ví dụ chậu:

```json
{
  "name": "Chậu gốm mini",
  "description": "Chậu gốm trắng cho cây để bàn.",
  "category": "pot",
  "imageUrl": "https://...",
  "priceText": "120.000 VND",
  "contactUrl": "https://zalo.me/...",
  "status": "active",
  "careLevel": null,
  "light": null,
  "water": null,
  "attributesJson": {
    "material": "ceramic",
    "size": "small",
    "color": "white"
  }
}
```

Ví dụ phân bón:

```json
{
  "name": "Phân bón hữu cơ 500g",
  "description": "Phù hợp cây để bàn và cây trong nhà.",
  "category": "fertilizer",
  "imageUrl": "https://...",
  "priceText": "80.000 VND",
  "contactUrl": "https://zalo.me/...",
  "status": "active",
  "careLevel": null,
  "light": null,
  "water": null,
  "attributesJson": {
    "type": "organic",
    "weight": "500g",
    "usage": "monthly"
  }
}
```

---

## 2.2. PlantClaimCode

Model này chỉ dành cho item loại cây.

```text
PlantClaimCode
- Id
- Code
- MarketplaceItemId
- Status
- BuyerContact nullable
- Note nullable
- ClaimedByUserId nullable
- ClaimedPlantId nullable
- ClaimedAt nullable
- CreatedAt
- UpdatedAt
```

Status đề xuất:

```text
unclaimed
claimed
cancelled
expired
```

Rule:

```text
Một MarketplaceItem category = plant có thể sinh nhiều PlantClaimCode.
Mỗi PlantClaimCode chỉ claim được một lần.
PlantClaimCode không áp dụng cho item category khác plant.
```

Ví dụ:

```text
MarketplaceItem: Cây Tim Tròn
  - CODE-A: unclaimed
  - CODE-B: claimed bởi user A
  - CODE-C: claimed bởi user B
```

---

## 2.3. MyPlant

`MyPlant` là cây đã thuộc về user sau khi user nhập code.

Đề xuất field:

```text
MyPlant / Plant
- Id
- UserId
- MarketplaceItemId nullable
- ClaimCodeId nullable
- Name
- Nickname nullable
- Species nullable
- ImageUrl nullable
- Location nullable
- Status
- CareLevel nullable
- Light nullable
- Water nullable
- Notes nullable
- CreatedAt
- UpdatedAt
```

Khi user claim code, BE tạo MyPlant bằng cách copy thông tin từ `MarketplaceItem` category `plant`.

User có thể chỉnh:

```text
Nickname
Location
Status
Notes
ImageUrl cá nhân nếu cho phép
```

User không được chỉnh:

```text
ClaimCodeId
MarketplaceItemId
UserId
Claim status
```

---

## 3. API MarketplaceItem đề xuất

## 3.1. Public marketplace

```http
GET /api/marketplace-items
GET /api/marketplace-items/{id}
```

Query optional:

```http
GET /api/marketplace-items?category=plant
GET /api/marketplace-items?category=pot
GET /api/marketplace-items?status=active
```

Public chỉ nên thấy item public/active.

Response list:

```json
{
  "items": [
    {
      "id": "uuid",
      "name": "Cây Tim Tròn",
      "description": "Cây để bàn dễ chăm.",
      "category": "plant",
      "imageUrl": "https://...",
      "priceText": "180.000 VND",
      "contactUrl": "https://zalo.me/...",
      "status": "active",
      "careLevel": "2",
      "light": "3",
      "water": "1/3",
      "attributesJson": null,
      "createdAt": "2026-06-01T10:00:00Z",
      "updatedAt": "2026-06-01T10:00:00Z"
    }
  ]
}
```

## 3.2. Admin marketplace

```http
GET    /api/admin/marketplace-items
POST   /api/admin/marketplace-items
GET    /api/admin/marketplace-items/{id}
PUT    /api/admin/marketplace-items/{id}
DELETE /api/admin/marketplace-items/{id}
```

Admin nên xem được tất cả status:

```text
active
inactive
draft
archived
```

Body create/update:

```json
{
  "name": "Cây Tim Tròn",
  "description": "Cây để bàn dễ chăm.",
  "category": "plant",
  "imageUrl": "https://...",
  "priceText": "180.000 VND",
  "contactUrl": "https://zalo.me/...",
  "status": "active",
  "careLevel": "2",
  "light": "3",
  "water": "1/3",
  "attributesJson": null
}
```

Rule validate:

```text
Nếu category = plant:
  careLevel/light/water có thể có giá trị.

Nếu category != plant:
  careLevel/light/water nên null hoặc bị bỏ qua.
  attributesJson dùng để lưu thông tin riêng của chậu/đất/phân bón/phụ kiện.
```

---

## 4. API Plant Claim Code đề xuất

## 4.1. Admin tạo code sau khi bán cây

```http
POST /api/admin/plant-claim-codes
```

Body:

```json
{
  "marketplaceItemId": "uuid",
  "buyerContact": "Zalo 09xxxx",
  "note": "Khách mua Cây Tim Tròn ngày 01/06"
}
```

BE xử lý:

```text
1. Tìm MarketplaceItem theo marketplaceItemId.
2. Nếu không tồn tại -> 404.
3. Nếu category != plant -> 400.
4. Sinh code unique.
5. Status = unclaimed.
6. Trả code để admin gửi cho khách.
```

Response:

```json
{
  "id": "uuid",
  "code": "DB-TIMTRON-A8K2",
  "marketplaceItemId": "uuid",
  "marketplaceItemName": "Cây Tim Tròn",
  "status": "unclaimed",
  "buyerContact": "Zalo 09xxxx",
  "note": "Khách mua Cây Tim Tròn ngày 01/06",
  "createdAt": "2026-06-01T10:00:00Z"
}
```

Nếu admin tạo code cho chậu/phân bón:

```http
400 Bad Request
```

```json
{
  "message": "Only plant marketplace items can generate ownership codes."
}
```

---

## 4.2. Admin xem danh sách code

```http
GET /api/admin/plant-claim-codes
```

Query optional:

```http
GET /api/admin/plant-claim-codes?marketplaceItemId=uuid
GET /api/admin/plant-claim-codes?status=unclaimed
GET /api/admin/plant-claim-codes?status=claimed
```

Response:

```json
{
  "items": [
    {
      "id": "uuid",
      "code": "DB-TIMTRON-A8K2",
      "marketplaceItemId": "uuid",
      "marketplaceItemName": "Cây Tim Tròn",
      "status": "unclaimed",
      "buyerContact": "Zalo 09xxxx",
      "note": "Khách mua ngày 01/06",
      "claimedByUserId": null,
      "claimedByEmail": null,
      "claimedPlantId": null,
      "claimedAt": null,
      "createdAt": "2026-06-01T10:00:00Z"
    }
  ]
}
```

---

## 4.3. Admin hủy code

```http
PATCH /api/admin/plant-claim-codes/{id}/cancel
```

Rule:

```text
Chỉ hủy code nếu status = unclaimed.
Nếu đã claimed -> 409 Conflict.
```

Response:

```json
{
  "id": "uuid",
  "code": "DB-TIMTRON-A8K2",
  "status": "cancelled"
}
```

---

## 5. API User claim cây bằng code

## 5.1. Xem trước code

```http
GET /api/my-plants/claim-preview?code=DB-TIMTRON-A8K2
```

Mục đích:

Trước khi claim, user thấy code này thuộc cây nào.

Response hợp lệ:

```json
{
  "valid": true,
  "codeStatus": "unclaimed",
  "marketplaceItem": {
    "id": "uuid",
    "name": "Cây Tim Tròn",
    "description": "Cây để bàn dễ chăm.",
    "category": "plant",
    "imageUrl": "https://...",
    "careLevel": "2",
    "light": "3",
    "water": "1/3"
  }
}
```

Nếu code không tồn tại:

```http
404 Not Found
```

Nếu code đã claim:

```http
409 Conflict
```

```json
{
  "valid": false,
  "codeStatus": "claimed",
  "message": "This code has already been claimed."
}
```

---

## 5.2. User claim code

```http
POST /api/my-plants/claim
```

Body:

```json
{
  "code": "DB-TIMTRON-A8K2",
  "nickname": "Tim tròn bàn làm việc",
  "location": "Bàn làm việc"
}
```

BE xử lý:

```text
1. Lấy current user từ JWT.
2. Tìm PlantClaimCode theo code.
3. Nếu không tồn tại -> 404.
4. Nếu status != unclaimed -> 409.
5. Lấy MarketplaceItem của code.
6. Nếu MarketplaceItem.Category != plant -> 400.
7. Tạo MyPlant cho current user từ MarketplaceItem.
8. Set PlantClaimCode.Status = claimed.
9. Set ClaimedByUserId, ClaimedPlantId, ClaimedAt.
10. Trả về MyPlantDto.
```

Response:

```json
{
  "id": "my-plant-id",
  "marketplaceItemId": "uuid",
  "claimCodeId": "uuid",
  "name": "Cây Tim Tròn",
  "nickname": "Tim tròn bàn làm việc",
  "species": null,
  "imageUrl": "https://...",
  "location": "Bàn làm việc",
  "status": "healthy",
  "careLevel": "2",
  "light": "3",
  "water": "1/3",
  "notes": null,
  "createdAt": "2026-06-01T10:00:00Z",
  "updatedAt": "2026-06-01T10:00:00Z"
}
```

---

## 6. MyPlants sau khi claim

Các API hiện có nên tiếp tục dùng:

```http
GET    /api/my-plants
GET    /api/my-plants/{id}
PUT    /api/my-plants/{id}
DELETE /api/my-plants/{id}
```

Ý nghĩa:

```text
/api/my-plants chỉ trả cây đã thuộc current user.
Không trả marketplace catalog item.
Không trả claim code chưa claim.
```

User được sửa:

```text
nickname
location
status
notes
imageUrl cá nhân nếu cho phép
```

User không được sửa:

```text
marketplaceItemId
claimCodeId
userId
claimedAt
```

DTO nên có:

```json
{
  "id": "my-plant-id",
  "marketplaceItemId": "uuid",
  "claimCodeId": "uuid",
  "name": "Cây Tim Tròn",
  "nickname": "Tim tròn bàn làm việc",
  "species": null,
  "imageUrl": "https://...",
  "location": "Bàn làm việc",
  "status": "healthy",
  "careLevel": "2",
  "light": "3",
  "water": "1/3",
  "notes": "Lá hơi vàng",
  "createdAt": "2026-06-01T10:00:00Z",
  "updatedAt": "2026-06-02T10:00:00Z"
}
```

---

## 7. Admin User Plants

Admin vẫn dùng:

```http
GET /api/admin/user-plants
GET /api/admin/user-plants/{id}
PUT /api/admin/user-plants/{id}/status
```

Ý nghĩa:

```text
Admin User Plants = các cây đã được user claim hoặc user đang sở hữu.
```

Response nên có thêm nguồn claim:

```json
{
  "id": "my-plant-id",
  "userId": "uuid",
  "userEmail": "user@example.com",
  "marketplaceItemId": "uuid",
  "marketplaceItemName": "Cây Tim Tròn",
  "claimCodeId": "uuid",
  "claimCode": "DB-TIMTRON-A8K2",
  "name": "Cây Tim Tròn",
  "nickname": "Tim tròn bàn làm việc",
  "species": null,
  "location": "Bàn làm việc",
  "status": "needs-water",
  "careLevel": "2",
  "light": "3",
  "water": "1/3",
  "notes": "User cập nhật lá hơi vàng",
  "createdAt": "2026-06-01T10:00:00Z",
  "updatedAt": "2026-06-02T10:00:00Z"
}
```

Nhờ vậy admin có thể:

```text
Xem cây nào thuộc user nào.
Biết cây đó được claim từ listing nào.
Biết code nào đã dùng.
Theo dõi status/location/notes user cập nhật.
Hỗ trợ hậu mãi sau bán.
```

---

## 8. Feedback marketplace có ảnh bằng chứng

Feedback hiện tại chưa đủ cho ý tưởng admin nhập feedback từ Zalo/Facebook.

API nên thêm:

```http
GET    /api/admin/feedback
POST   /api/admin/feedback
PUT    /api/admin/feedback/{id}
PATCH  /api/admin/feedback/{id}/verify
DELETE /api/admin/feedback/{id}
```

Body create/update:

```json
{
  "marketplaceItemId": "uuid",
  "customerAlias": "Khách từ Zalo",
  "rating": 5,
  "comment": "Cây đẹp, giao nhanh.",
  "purchaseChannel": "zalo",
  "publicImageUrls": [
    "https://res.cloudinary.com/.../customer-plant.jpg"
  ],
  "evidenceImageUrls": [
    "https://res.cloudinary.com/.../zalo-screenshot.jpg"
  ],
  "evidenceNote": "Khách gửi feedback qua Zalo ngày 01/06.",
  "isVerified": true
}
```

Public API:

```http
GET /api/feedback/verified?marketplaceItemId=uuid
```

Public response không trả evidence nội bộ:

```json
{
  "items": [
    {
      "id": "uuid",
      "marketplaceItemId": "uuid",
      "customerAlias": "Khách từ Zalo",
      "rating": 5,
      "comment": "Cây đẹp, giao nhanh.",
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

```text
evidenceImageUrls
evidenceNote
```

---

## 9. Ảnh hưởng tới các tính năng liên quan

## 9.1. Reminders

Reminders nên chỉ cho tạo với cây thuộc current user:

```text
MyPlant.UserId == currentUserId
```

Không tạo reminder cho marketplace item hoặc claim code chưa claim.

## 9.2. AI Chat

Nếu request có `plantId`, BE cần validate:

```text
MyPlant.UserId == currentUserId
```

Không cho user chat với cây của người khác.

## 9.3. AI Diagnose

Nếu request có `plantId`, BE cần validate:

```text
MyPlant.UserId == currentUserId
```

Ảnh diagnose vẫn gửi multipart:

```text
Image: File
PlantId: optional
Question: optional
```

## 9.4. Upload

Upload dùng lại:

```http
POST /api/upload/image
```

Dùng cho:

```text
ảnh marketplace item
ảnh avatar user
ảnh MyPlant cá nhân hóa
ảnh public feedback
ảnh evidence feedback
```

## 9.5. Legacy /api/plants

Nên deprecate hoặc xóa:

```http
GET    /api/plants
POST   /api/plants
GET    /api/plants/{id}
PUT    /api/plants/{id}
DELETE /api/plants/{id}
```

Lý do:

```text
Dễ nhầm với /api/my-plants.
FE hiện không cần dùng.
Marketplace đã đi theo MarketplaceItem.
```

---

## 10. Flow FE sau khi BE sẵn sàng

## 10.1. Admin tạo marketplace item

```text
Admin vào Admin Marketplace
        |
        v
Tạo MarketplaceItem
        |
        v
Chọn category: plant / pot / soil / fertilizer / accessory
        |
        v
Nếu category = plant thì nhập careLevel/light/water
Nếu category khác plant thì nhập attributes
```

## 10.2. Admin tạo code sau khi bán cây

```text
Khách mua Cây Tim Tròn qua Zalo/Facebook
        |
        v
Admin mở item Cây Tim Tròn
        |
        v
Bấm "Generate claim code after sale"
        |
        v
FE gọi POST /api/admin/plant-claim-codes
        |
        v
BE trả code riêng cho lần bán đó
        |
        v
Admin gửi code cho khách
```

## 10.3. User thêm cây bằng code

```text
User vào Add Plant
        |
        v
Chọn Add by code
        |
        v
Nhập code
        |
        v
FE gọi GET /api/my-plants/claim-preview?code=...
        |
        v
User xác nhận cây đúng
        |
        v
FE gọi POST /api/my-plants/claim
        |
        v
Cây xuất hiện trong My Plants
```

## 10.4. Admin theo dõi cây user

```text
User cập nhật nickname/location/status/notes
        |
        v
Admin vào Admin User Plants
        |
        v
Admin thấy cây đã claim, owner, code nguồn, trạng thái user cập nhật
```

---

## 11. Checklist gửi BE

### MarketplaceItem

- [ ] Tạo entity/model `MarketplaceItem`.
- [ ] Category hỗ trợ `plant`, `pot`, `soil`, `fertilizer`, `accessory`, `other`.
- [ ] Public API:
  - [ ] `GET /api/marketplace-items`
  - [ ] `GET /api/marketplace-items/{id}`
- [ ] Admin API:
  - [ ] `GET /api/admin/marketplace-items`
  - [ ] `POST /api/admin/marketplace-items`
  - [ ] `GET /api/admin/marketplace-items/{id}`
  - [ ] `PUT /api/admin/marketplace-items/{id}`
  - [ ] `DELETE /api/admin/marketplace-items/{id}`
- [ ] Admin thấy được tất cả status.
- [ ] Public chỉ thấy item active/public.

### Plant claim code

- [ ] Tạo entity/model `PlantClaimCode`.
- [ ] Code unique.
- [ ] Chỉ tạo code cho `MarketplaceItem.Category == plant`.
- [ ] Admin API:
  - [ ] `GET /api/admin/plant-claim-codes`
  - [ ] `POST /api/admin/plant-claim-codes`
  - [ ] `PATCH /api/admin/plant-claim-codes/{id}/cancel`
- [ ] User API:
  - [ ] `GET /api/my-plants/claim-preview?code=...`
  - [ ] `POST /api/my-plants/claim`
- [ ] Chặn claim code đã dùng.
- [ ] Chặn claim code cancelled/expired.

### MyPlants

- [ ] Claim code tạo MyPlant cho current user.
- [ ] `GET /api/my-plants` chỉ trả cây của current user.
- [ ] `GET /api/my-plants/{id}` check owner.
- [ ] `PUT /api/my-plants/{id}` chỉ cho sửa field user được phép.
- [ ] DTO trả `marketplaceItemId`, `claimCodeId`, care fields.

### Admin User Plants

- [ ] `GET /api/admin/user-plants` trả cây đã thuộc user.
- [ ] Response có owner, marketplace item nguồn, claim code nguồn.
- [ ] Detail có đủ location/status/notes user cập nhật.

### Feedback

- [ ] Thêm `POST /api/admin/feedback`.
- [ ] Feedback gắn `marketplaceItemId`.
- [ ] Hỗ trợ `publicImageUrls`.
- [ ] Hỗ trợ `evidenceImageUrls`.
- [ ] Evidence chỉ admin xem.
- [ ] Public verified feedback không trả evidence nội bộ.

### Security

- [ ] Reminder validate MyPlant thuộc current user.
- [ ] AI Chat validate MyPlant thuộc current user.
- [ ] AI Diagnose validate MyPlant thuộc current user.
- [ ] Admin APIs yêu cầu role ADMIN.
- [ ] Deprecate hoặc secure `/api/plants`.

---

## 12. Tóm tắt ngắn để trao đổi

```text
MarketplaceItem là catalog sản phẩm bán hàng, không phải từng cây vật lý.
MarketplaceItem có thể là cây, chậu, đất, phân bón, phụ kiện.
Chỉ item category = plant mới được tạo PlantClaimCode.
Mỗi lần bán một cây từ cùng listing thì admin tạo một PlantClaimCode riêng.
User nhập code để claim, sau đó BE tạo MyPlant riêng cho user.
Admin xem các MyPlant đã claim trong Admin User Plants để hỗ trợ và theo dõi trạng thái user cập nhật.
```

Ví dụ:

```text
Listing: Cây Tim Tròn
  - Khách A mua -> CODE-A -> MyPlant của khách A
  - Khách B mua -> CODE-B -> MyPlant của khách B
  - Khách C mua -> CODE-C -> MyPlant của khách C

Listing: Chậu gốm
  - Không tạo claim code
  - Chỉ bán/contact như marketplace item bình thường
```
