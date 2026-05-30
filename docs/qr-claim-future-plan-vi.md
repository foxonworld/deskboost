# DeskBoost QR / Plant Code / Claim Future Plan

> Tài liệu định hướng future phase cho QR / Plant Code / Claim. Phạm vi: product + frontend + AI integration planning. Không implement code trong phase này.

## 1. Product purpose

### 1.1. Vì sao QR/Claim tồn tại

QR/Claim giúp DeskBoost gắn một cây bán qua marketplace contact-only với một hồ sơ cây có ngữ cảnh đáng tin hơn trong My Plants.

Mục tiêu chính:

- Tạo khoảnh khắc “đưa cây thật vào DeskBoost” sau khi khách đã nhận cây.
- Giúp AI có thêm ngữ cảnh: giống cây, lô/batch, seller, ngày mua/nhận, care baseline.
- Tăng trust cho customer validation mà không biến app thành hệ thống sở hữu.
- Cho admin/seller một cách tạo mã nhẹ để gắn QR lên tag/chậu/hướng dẫn chăm sóc.

### 1.2. Vấn đề giải quyết

- User mua/liên hệ thủ công dễ quên thông tin chăm sóc ban đầu.
- AI chat hiện dựa nhiều vào dữ liệu user nhập tay; claimed plant có thể cung cấp context chuẩn hơn.
- Seller/admin cần cách liên kết cây thật với plant profile mà không xây checkout/order system.
- Mentor/user cần thấy DeskBoost có hướng mở rộng sau MVP nhưng vẫn kiểm soát scope.

### 1.3. QR/Claim KHÔNG được trở thành

- Không phải ownership enforcement.
- Không phải proof of purchase/security proof.
- Không phải anti-fraud enterprise system.
- Không phải scanner/NFC platform.
- Không phải payment/order/shipping flow.
- Không phải điều kiện bắt buộc để dùng AI hoặc care features.
- Không biến My Plants thành claimed-only.

## 2. User flows

### 2.1. Admin/seller tạo plant code

1. Admin/seller chọn plant catalog item hoặc plant batch.
2. Nhập metadata tối thiểu: species, seller note, care baseline, optional batch/source.
3. Backend tạo `plantCode` + `qrToken`.
4. Admin thấy QR/link + trạng thái code.
5. Admin in QR hoặc gắn code vào tag/chậu/phiếu hướng dẫn.

### 2.2. QR generated cho plant

- QR encode claim URL, ví dụ `/claim?token=...`.
- Fallback manual code hiển thị dưới QR.
- QR chỉ là deep link tiện lợi; không là chứng minh bảo mật.

### 2.3. Customer scan/enter code

1. Customer scan QR hoặc mở page nhập code.
2. UI gọi validate code.
3. Nếu hợp lệ: hiển thị preview cây + seller/care context.
4. Nếu chưa login: prompt login/register, sau đó quay lại claim.
5. Nếu invalid/expired/deactivated/used: hiển thị state rõ và không chặn user add plant thủ công.

### 2.4. Customer claim plant into My Plants

1. User xác nhận “Thêm vào My Plants”.
2. Backend gắn code với user.
3. App tạo hoặc liên kết plant profile trong My Plants.
4. UI hiển thị success + claimed badge + plant identity card.

### 2.5. Claimed plant gets richer AI context

- AI Chat/Diagnosis nhận thêm context nếu plant được claim.
- Context có thể gồm source/seller, species verified-ish, care baseline, claim date, QR metadata.
- AI copy phải nói “có thêm ngữ cảnh từ mã cây”, không nói “xác minh sở hữu tuyệt đối”.

### 2.6. Unclaimed plants still work normally

- User vẫn free-add plants trong My Plants.
- AI vẫn trả lời với context user nhập tay.
- Care reminders, diagnosis, chat không bị khóa.
- Claim chỉ nâng chất lượng context/trust, không tạo phân cấp user.

## 3. Scope boundaries

Out of scope:

- Payment/order/shipping/cart/checkout.
- Hard ownership enforcement.
- Anti-fraud scoring, duplicate abuse workflows, dispute resolution.
- NFC/scanner native app/enterprise device integration.
- AI gating, quota, billing, subscription.
- Mandatory QR for care/reminder/AI usage.
- Complex seller portal or inventory ERP.

In scope future-safe minimum:

- Plant code generation.
- QR/link display.
- Public validate/preview.
- Authenticated claim.
- Claimed badge + identity card.
- AI context enrichment.
- Admin list/revoke/deactivate.

## 4. Frontend requirements

### 4.1. Pages/routes needed

Future routes, after backend contract approval:

- Public/user claim page: `/claim` or `/app/claim` depending auth strategy.
- My Plants claimed detail section: reuse existing My Plants/Plant Detail area.
- Admin code management page under lightweight admin.

Do not add routes in docs-only Phase A.

### 4.2. Components needed

- `ClaimByCodeForm`: manual code input, validate, loading/error states.
- `ClaimPreviewCard`: plant preview before confirm.
- `QrDisplayCard`: QR image/link/code for admin.
- `ClaimedBadge`: small trust/context badge.
- `PlantIdentityCard`: claimed plant context summary.
- `ClaimStatusNotice`: invalid/used/expired/deactivated states.
- Optional `ClaimSuccessPanel`: success reveal after claim.

Component rules:

- Use existing Button/Card/Badge patterns when implemented.
- Badge text must be explicit: “Đã claim bằng mã cây” or “Có ngữ cảnh mã cây”.
- Avoid wording like “Chính chủ tuyệt đối”.

### 4.3. Claim by code UI

Must include:

- Input label: “Nhập mã cây”.
- Helper text: “Mã cây giúp DeskBoost thêm ngữ cảnh chăm sóc, không bắt buộc để dùng AI.”
- Validate button with loading state.
- Error states with recovery action: retry, add plant manually, contact seller.
- Login/register redirect if unauthenticated.

### 4.4. QR display UI

Admin QR display:

- QR preview.
- Copy claim link.
- Copy manual code.
- Code status chip: Active / Claimed / Deactivated / Expired.
- Plant/seller metadata summary.
- Print/download can be future optional; not required first implementation.

### 4.5. Claimed badge

- Used on My Plants card, Plant Detail, AI context selector.
- Text should convey context enhancement, not ownership enforcement.
- Example: “Mã cây đã claim”, “Ngữ cảnh từ seller”.

### 4.6. Claimed plant identity card

Show:

- Plant name/species.
- Seller/source.
- Claim date.
- Care baseline.
- Code status.
- AI context note.

Tone:

- Trust-oriented, calm.
- No legal/security ownership promise.

### 4.7. Error/invalid/used code states

States:

- Invalid: code/token not found.
- Expired: code no longer usable.
- Deactivated: admin disabled code.
- Already claimed by current user: link to plant.
- Already claimed by another user: show neutral message, contact seller/admin; do not expose user info.
- Network/server error: retry; allow manual add fallback.

### 4.8. Mobile UX

- Claim page must be single-column, thumb-friendly.
- Input/button height >= 44px.
- QR scan entry should not require in-app camera scanner initially; browser opens link.
- Sticky confirm CTA only if preview content is long.
- Success state must be understandable without animation.
- Avoid bottom nav/input overlap.

## 5. Data model proposal

Core fields:

| Field                  | Purpose                                                                |
| ---------------------- | ---------------------------------------------------------------------- |
| `plantCode`            | Human-enterable short code, unique, normalized uppercase.              |
| `qrToken`              | Opaque URL token, longer than manual code, not guessable.              |
| `claimStatus`          | `ACTIVE`, `CLAIMED`, `EXPIRED`, `DEACTIVATED`.                         |
| `claimedBy`            | User id if claimed.                                                    |
| `claimedAt`            | Timestamp claim completed.                                             |
| `plantId`              | Linked plant catalog/profile/template id.                              |
| `sellerId` / `adminId` | Creator/source owner.                                                  |
| `metadata`             | AI/context payload: species, care baseline, seller note, batch/source. |

Suggested metadata:

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

## 6. API contract draft

See backend-specific detail in `docs/backend-qr-claim-requirements-vi.md`.

Frontend expected endpoints:

- `POST /api/v1/admin/plant-codes`
- `GET /api/v1/plant-codes/validate?code=...`
- `GET /api/v1/plant-codes/validate?token=...`
- `POST /api/v1/plant-codes/claim`
- `GET /api/v1/me/claimed-plants`
- `GET /api/v1/admin/plant-codes`
- `PATCH /api/v1/admin/plant-codes/{id}/deactivate`

## 7. AI integration

### 7.1. How claimed plant improves AI context

When selected plant is claimed, frontend/backend may include:

- Claimed plant identity.
- Seller/admin-provided care baseline.
- Claim date/plant age approximation.
- Known species/category.
- Known environment recommendation.
- Seller note about initial condition.

AI prompt behavior:

- Prefer claimed metadata over generic catalog assumptions.
- Still ask user for live symptoms/photos/environment.
- Explain uncertainty clearly.

### 7.2. Extra context AI can use

- “Cây này được thêm qua mã cây DeskBoost.”
- “Seller note: tưới 2 lần/tuần trong môi trường văn phòng sáng gián tiếp.”
- “ClaimedAt: 2026-xx-xx” to estimate ownership duration.
- “CareBaseline” for comparing current symptoms.

### 7.3. Fallback when unclaimed

- Use user-entered plant profile.
- Use chat message/photo context.
- Offer optional copy: “Bạn có thể thêm mã cây sau nếu có, nhưng không bắt buộc.”
- No locked feature, no degraded punishment wording.

## 8. Motion / GSAP opportunities

Use only after static UX is stable.

Recommended moments:

- Scan/code validating: short status fade, not fake scanner loop.
- Success reveal: check/badge + identity card reveal under 600–800ms total.
- Claimed badge: one-time shimmer/pop, no infinite glow.
- Plant identity card unfold: opacity + translateY, no height thrash.
- Error state: calm fade/slide once, no shake spam.

Reduced-motion fallback:

- Show final state instantly.
- No transform/stagger.
- Success/error text remains visible.

GSAP constraints:

- Scoped `useGSAP` refs.
- `data-motion` selectors.
- Transform/opacity only.
- No global selectors.
- No ScrollTrigger needed.

## 9. Implementation phases

### Phase A — Docs/contracts only

Deliverables:

- Product plan.
- Backend requirements.
- Draft API contract.
- Notes in `PROJECT_AI_NOTES.md`.

No code.

### Phase B — Backend API

- Entities/tables.
- Admin generation endpoints.
- Public validate endpoint.
- Authenticated claim endpoint.
- Claimed plants endpoint.
- Basic revoke/deactivate.

### Phase C — Frontend claim UI mock/fallback

- Claim by code page/component.
- Mock service fallback while backend stabilizes.
- Invalid/used/error states.
- My Plants display-ready shape.

### Phase D — Admin QR generation

- Admin list/create/deactivate code UI.
- QR/link/code display.
- Lightweight admin only.

### Phase E — AI context enhancement

- Include claimed metadata in AI context payload.
- UI indicates “AI đang dùng ngữ cảnh mã cây”.
- Fallback for unclaimed unchanged.

### Phase F — Motion polish

- Validate/success/card reveal.
- Reduced-motion pass.
- Mobile smoke.

## 10. Risks

| Risk                         | Mitigation                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------ |
| Scope creep                  | Keep scanner/NFC/fraud/payment out. Ship code + link first.                    |
| Ecommerce drift              | Do not add order/payment/shipping semantics. Marketplace remains contact-only. |
| AI gating mistake            | AI must work for free-add/unclaimed plants.                                    |
| QR treated as security proof | Copy/API docs state QR is convenience/context, not ownership proof.            |
| Backend complexity           | Start with simple lifecycle: active → claimed/deactivated/expired.             |
| User confusion               | Explain claim is optional and improves context.                                |
| Privacy leak                 | Public validate returns safe plant preview only, no claimed user info.         |
| Duplicate claim conflict     | Neutral used-code state + support path; no dispute workflow in MVP.            |

## 11. Deliverables for this planning phase

- `docs/qr-claim-future-plan-vi.md`
- `docs/backend-qr-claim-requirements-vi.md`
- `PROJECT_AI_NOTES.md` update
- AgentMemory durable direction if MCP available

## 12. Success criteria

- Future-safe enough for frontend/backend split.
- Clear enough for Tuấn to build backend later.
- Does not expand into ecommerce, ownership enforcement, scanner/NFC, anti-fraud, or AI gating.
- Preserves My Plants free-add and AI availability for unclaimed plants.
