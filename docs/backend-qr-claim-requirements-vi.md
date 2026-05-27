# Backend QR / Plant Code / Claim Requirements for Tuấn

> Backend handoff cho future QR / Plant Code / Claim phase. Phạm vi: ASP.NET Core API + persistence + validation contract. Không yêu cầu implement ngay.

## 1. Backend purpose

Backend cần cung cấp một hệ Plant Code/Claim tối thiểu để:

- Admin/seller tạo mã cây và QR token.
- Customer validate code/token công khai trước khi claim.
- Customer đã đăng nhập claim cây vào My Plants.
- AI có metadata đáng tin hơn khi cây đã claim.
- Admin quản lý trạng thái code.

Không xây:

- Payment/order/shipping/cart.
- Ownership enforcement pháp lý.
- Anti-fraud/dispute system.
- Scanner/NFC/native app complexity.
- AI gating/billing/quota.

## 2. Proposed entities/tables

### 2.1. `PlantCode`

Suggested fields:

| Field           | Type direction       | Notes                                                         |
| --------------- | -------------------- | ------------------------------------------------------------- |
| `Id`            | Guid/int             | Primary key.                                                  |
| `PlantCode`     | string               | Short manual code, unique, uppercase, user-enterable.         |
| `QrToken`       | string               | Opaque unique token for QR claim link; not sequential.        |
| `ClaimStatus`   | enum/string          | `ACTIVE`, `CLAIMED`, `EXPIRED`, `DEACTIVATED`.                |
| `PlantId`       | FK nullable/required | Linked catalog/template/plant record depending current model. |
| `SellerId`      | FK nullable          | Seller/admin source if role model supports it.                |
| `AdminId`       | FK                   | Creator/admin id.                                             |
| `ClaimedBy`     | FK nullable          | User id who claimed.                                          |
| `ClaimedAt`     | DateTime nullable    | Set once claim succeeds.                                      |
| `ExpiresAt`     | DateTime nullable    | Optional, keep simple.                                        |
| `DeactivatedAt` | DateTime nullable    | Admin-deactivated timestamp.                                  |
| `DeactivatedBy` | FK nullable          | Admin id.                                                     |
| `MetadataJson`  | json/text            | AI/care context snapshot.                                     |
| `CreatedAt`     | DateTime             | Audit.                                                        |
| `UpdatedAt`     | DateTime             | Audit.                                                        |

### 2.2. `ClaimStatus` enum

Minimum statuses:

- `ACTIVE`: can be validated and claimed.
- `CLAIMED`: claimed once.
- `EXPIRED`: no longer usable due expiry.
- `DEACTIVATED`: admin disabled manually.

Avoid early statuses like pending review, disputed, transferred unless product scope expands.

### 2.3. Claimed plant representation

Two acceptable backend options:

#### Option A — PlantCode links to existing Plant

- On claim, create/copy a user plant in existing `Plants` table.
- Store `ClaimedPlantId` if needed.
- Best if current `Plant` entity is user-owned plant profile.

#### Option B — `UserClaimedPlant` join table

Fields:

- `Id`
- `UserId`
- `PlantCodeId`
- `PlantId`
- `ClaimedAt`
- `Nickname`
- `MetadataSnapshotJson`

Best if catalog plant and user plant need separation.

Recommendation: choose the smallest fit with existing backend Plant model. Do not invent inventory/order model.

## 3. Metadata for AI context

Store as JSON snapshot to avoid needing many tables early.

Suggested keys:

- `speciesName`
- `commonName`
- `careLevel`
- `lightRequirement`
- `wateringBaseline`
- `soilOrPotNote`
- `sellerCareNote`
- `batchCode`
- `sourceNursery`
- `createdForPlantName`
- `initialConditionNote`

Rules:

- Metadata is care/context information, not legal ownership proof.
- Metadata returned to public validate must be safe and non-sensitive.
- Do not expose internal admin notes unless explicitly marked public.

## 4. Endpoint contract draft

Base path: `/api/v1`.

### 4.1. POST create code

`POST /api/v1/admin/plant-codes`

Auth:

- Admin required.

Request:

```json
{
  "plantId": "plant-123",
  "sellerId": "seller-optional",
  "expiresAt": "2026-12-31T00:00:00Z",
  "metadata": {
    "speciesName": "Epipremnum aureum",
    "commonName": "Trầu bà",
    "careLevel": "easy",
    "lightRequirement": "Ánh sáng gián tiếp",
    "wateringBaseline": "1-2 lần/tuần",
    "sellerCareNote": "Để nơi thoáng, tránh nắng gắt"
  }
}
```

Response `201`:

```json
{
  "id": "code-123",
  "plantCode": "DB-8K2P4Q",
  "qrToken": "opaque-token",
  "claimUrl": "https://deskboost.example/#/claim?token=opaque-token",
  "claimStatus": "ACTIVE",
  "plantId": "plant-123",
  "sellerId": "seller-optional",
  "createdAt": "2026-05-27T00:00:00Z",
  "expiresAt": "2026-12-31T00:00:00Z",
  "metadata": {}
}
```

Validation:

- `plantId` must exist if required by domain.
- `expiresAt` optional, must be future if provided.
- Generate `plantCode` server-side.
- Generate `qrToken` server-side using cryptographically strong randomness.
- Do not accept client-provided `claimedBy` or status.

### 4.2. GET validate code/token

`GET /api/v1/plant-codes/validate?code=DB-8K2P4Q`

or

`GET /api/v1/plant-codes/validate?token=opaque-token`

Auth:

- Public allowed.
- If user logged in, backend may include current-user-specific state, but must not require auth.

Response `200` active:

```json
{
  "valid": true,
  "claimStatus": "ACTIVE",
  "claimable": true,
  "plantCodeId": "code-123",
  "plantPreview": {
    "plantId": "plant-123",
    "name": "Trầu bà để bàn",
    "speciesName": "Epipremnum aureum",
    "imageUrl": "https://example.com/plant.jpg"
  },
  "publicMetadata": {
    "careLevel": "easy",
    "lightRequirement": "Ánh sáng gián tiếp",
    "wateringBaseline": "1-2 lần/tuần",
    "sellerCareNote": "Để nơi thoáng, tránh nắng gắt"
  }
}
```

Response `200` invalid/used/expired/deactivated:

```json
{
  "valid": false,
  "claimStatus": "CLAIMED",
  "claimable": false,
  "reason": "ALREADY_CLAIMED"
}
```

Reason codes:

- `NOT_FOUND`
- `ALREADY_CLAIMED`
- `EXPIRED`
- `DEACTIVATED`
- `MALFORMED_CODE`

Security:

- Never expose `claimedBy` user info in public validate.
- Rate-limit later if abuse appears; do not build enterprise anti-fraud now.

### 4.3. POST claim code

`POST /api/v1/plant-codes/claim`

Auth:

- Logged-in user required.

Request:

```json
{
  "code": "DB-8K2P4Q"
}
```

or

```json
{
  "token": "opaque-token"
}
```

Optional user customization:

```json
{
  "token": "opaque-token",
  "nickname": "Trầu bà góc làm việc"
}
```

Response `200` or `201`:

```json
{
  "claimed": true,
  "plantCodeId": "code-123",
  "claimStatus": "CLAIMED",
  "claimedAt": "2026-05-27T00:00:00Z",
  "plant": {
    "id": "user-plant-456",
    "name": "Trầu bà góc làm việc",
    "plantId": "plant-123",
    "claimed": true,
    "claimedMetadata": {
      "speciesName": "Epipremnum aureum",
      "careLevel": "easy",
      "wateringBaseline": "1-2 lần/tuần"
    }
  }
}
```

Failure responses:

- `400 MALFORMED_CODE`
- `404 NOT_FOUND`
- `409 ALREADY_CLAIMED`
- `410 EXPIRED`
- `403 DEACTIVATED` or `409 DEACTIVATED`
- `401 UNAUTHENTICATED`

Idempotency:

- If current user already claimed the same code, return success-like response with existing plant link.
- If another user claimed it, return conflict without revealing who.

Transaction:

- Validate status + set claimed fields + create/link user plant atomically.
- Prevent race condition double-claim via unique constraint/transaction.

### 4.4. GET claimed plants

`GET /api/v1/me/claimed-plants`

Auth:

- Logged-in user required.

Response:

```json
{
  "items": [
    {
      "plantCodeId": "code-123",
      "plantId": "user-plant-456",
      "claimedAt": "2026-05-27T00:00:00Z",
      "claimStatus": "CLAIMED",
      "plant": {
        "name": "Trầu bà góc làm việc",
        "speciesName": "Epipremnum aureum",
        "imageUrl": "https://example.com/plant.jpg"
      },
      "aiContext": {
        "careLevel": "easy",
        "wateringBaseline": "1-2 lần/tuần",
        "sellerCareNote": "Để nơi thoáng, tránh nắng gắt"
      }
    }
  ]
}
```

Note:

- This endpoint is for claimed subset only.
- Existing My Plants endpoint must still include free-add plants.

### 4.5. Admin list codes

`GET /api/v1/admin/plant-codes?status=ACTIVE&page=1&pageSize=20`

Auth:

- Admin required.

Response:

```json
{
  "items": [
    {
      "id": "code-123",
      "plantCode": "DB-8K2P4Q",
      "claimStatus": "ACTIVE",
      "plantId": "plant-123",
      "sellerId": "seller-optional",
      "createdAt": "2026-05-27T00:00:00Z",
      "claimedAt": null,
      "expiresAt": "2026-12-31T00:00:00Z"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 1
}
```

### 4.6. Revoke/deactivate code

`PATCH /api/v1/admin/plant-codes/{id}/deactivate`

Auth:

- Admin required.

Request:

```json
{
  "reason": "Printed tag lost before delivery"
}
```

Rules:

- Only `ACTIVE` codes can be deactivated in first version.
- Do not auto-remove a claimed plant if code already claimed; that becomes dispute/ownership complexity and is out of scope.

Response:

```json
{
  "id": "code-123",
  "claimStatus": "DEACTIVATED",
  "deactivatedAt": "2026-05-27T00:00:00Z"
}
```

## 5. Validation rules

### 5.1. Code format

- Normalize input: trim, uppercase, remove spaces if safe.
- Accept hyphenated display code, e.g. `DB-8K2P4Q`.
- Avoid ambiguous chars if generating manual code: `0/O`, `1/I/L`.
- Minimum entropy enough for non-guessable casual use, but token handles security-sensitive URL.

### 5.2. Token format

- Opaque, high entropy, URL-safe.
- Never sequential.
- Store hashed token if desired; plain token acceptable only if DB threat model is out of MVP, but hashing is safer.

### 5.3. Claim lifecycle

```text
ACTIVE -> CLAIMED
ACTIVE -> EXPIRED
ACTIVE -> DEACTIVATED
```

Do not support:

- Transfer ownership.
- Re-claim by another user.
- Dispute/review queue.
- Refund/order reversal.

### 5.4. Duplicate/race handling

- Unique index on `PlantCode`.
- Unique index on `QrToken` or token hash.
- Claim operation uses transaction.
- Check status inside transaction.
- If already claimed by same user, return idempotent existing result.
- If claimed by different user, return `409` without user info.

## 6. Admin generation flow

1. Admin opens code generation UI.
2. Selects plant/catalog item.
3. Enters optional public care metadata.
4. Calls create endpoint.
5. Backend returns code + QR token + claim URL.
6. Frontend displays QR/link/manual code.
7. Admin prints/copies code.
8. Admin can list active/claimed/deactivated codes later.

Backend must own:

- Code generation.
- Token generation.
- Status lifecycle.
- Auth/role checks.
- Persistence.

Frontend must not generate authoritative codes.

## 7. Public claim lookup

Public validate exists so QR scan can show plant preview before login.

Safe public data:

- Plant name/species/image.
- Public care baseline.
- Seller display name if already public.
- Claimability status/reason.

Unsafe public data:

- Claimed user id/email/name.
- Admin internal notes.
- Raw audit logs.
- Security token internals.

## 8. Security considerations

Minimum:

- Admin-only create/list/deactivate.
- Auth-required claim.
- Public validate returns safe preview only.
- Opaque QR token with high entropy.
- No user info leak on already-claimed code.
- Atomic claim operation.
- Server-side ownership of status changes.
- Audit created/claimed/deactivated timestamps.

Deferred until abuse appears:

- Rate limiting.
- Anti-fraud scoring.
- Claim dispute process.
- Transfer claim.
- Device fingerprinting.
- NFC/scanner native complexity.

Important wording:

- QR token is not proof of legal ownership.
- Claim means “linked this DeskBoost plant code to a user profile”.
- AI context can trust seller-provided metadata more than user free text, but still should handle uncertainty.

## 9. AI integration requirements

Backend AI context payload for selected plant should include claim metadata if available:

```json
{
  "plantId": "user-plant-456",
  "claimed": true,
  "claimSource": "PLANT_CODE",
  "claimedAt": "2026-05-27T00:00:00Z",
  "claimMetadata": {
    "speciesName": "Epipremnum aureum",
    "careLevel": "easy",
    "wateringBaseline": "1-2 lần/tuần",
    "sellerCareNote": "Để nơi thoáng, tránh nắng gắt"
  }
}
```

Rules:

- AI endpoint must still accept unclaimed/free-add plants.
- Do not reject AI requests because plant lacks claim.
- Use claimed metadata as extra context, not as exclusive truth.
- If conflicting user symptoms/photo exist, current user-provided state should influence answer.

## 10. Frontend/backend split

Frontend owns:

- Claim form UI.
- QR/link display UI.
- Badges/identity card.
- Loading/error/empty states.
- Mobile UX.
- Copy explaining optional claim.

Backend owns:

- Code/token creation.
- Persistence.
- Status transitions.
- Auth/role checks.
- Public safe validate.
- Atomic claim.
- AI context availability.

Shared contract:

- Status enum.
- Reason codes.
- Plant preview shape.
- Claimed metadata shape.

## 11. Test/checklist suggestions

Backend unit/integration checks:

- Admin can create code.
- Non-admin cannot create/list/deactivate.
- Public validate active code returns safe preview.
- Public validate invalid code returns `NOT_FOUND` without exception.
- Authenticated user can claim active code.
- Same user claim repeat is idempotent.
- Different user claim returns conflict.
- Deactivated/expired code cannot claim.
- Claimed plants endpoint returns only current user's claimed plants.
- AI context includes metadata for claimed plant and omits safely for unclaimed.

Manual smoke later:

1. Admin creates code.
2. Copy claim URL.
3. Anonymous validates preview.
4. Login/register.
5. Claim succeeds.
6. My Plants shows claimed badge.
7. AI selected plant includes claimed context.
8. Free-add plant still works with AI.

## 12. Phase boundaries

### Phase B backend API only

- Build endpoints/entities/contracts.
- No frontend dependency on scanner/NFC.
- No ecommerce entities.

### Phase C frontend mock/fallback

- UI can consume backend when ready.
- Mock fallback allowed for demo only, labeled clearly.

### Phase D admin QR generation

- Admin UI consumes create/list/deactivate.
- QR rendering can be frontend-generated from claim URL.

### Phase E AI context

- Only enrich prompt/context.
- No gating.

## 13. Open decisions before implementation

- Does existing `Plant` represent catalog plant, user-owned plant, or both?
- Should claim create a new user plant row or link a join table?
- Which auth user id type is final?
- Should QR token be stored hashed from day one?
- Exact frontend claim URL under hash router: `/#/claim?token=...` or `/#/app/claim?token=...`.

None of these block planning. They should be decided before Phase B implementation.
