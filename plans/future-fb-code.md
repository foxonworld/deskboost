# DeskBoost future plan: verified feedback first, plant code later

> Planning only. Không implement code. Hướng: lean startup MVP, manual-first, customer validation thật, không Shopee clone.

---

## Executive summary

DeskBoost hiện là frontend-first MVP: marketplace chỉ xem + liên hệ Zalo/Facebook, backend chưa hoàn chỉnh, AI Chat/Diagnosis có service boundary + mock fallback, admin nhẹ đã có nền tảng.

Trọng tâm hiện tại không phải xây ownership ecosystem hay premium AI. Trọng tâm EXE201 nên là:

```txt
social/manual purchase → admin ghi nhận feedback thật + private evidence note → public manually verified feedback → mentor thấy customer validation believable
```

Plant ownership code vẫn là hướng tốt, nhưng nên là Future enhancement. Không nên biến My Plants thành claimed-only hoặc khóa AI quá sớm.

Recommendation mới:

1. Phase 1: làm FE-first mock-ready manually verified feedback trước.
2. Phase 2: chỉ nối BE khi endpoints sẵn sàng.
3. Giữ marketplace contact-only.
4. Giữ My Plants usable với cây user tự thêm.
5. AI direction mềm: basic AI vẫn dùng được; enhanced AI cho claimed/verified plants chỉ là future direction, chưa cần quota thật.
6. Plant ownership code là Future, không blocker cho feedback MVP.

Không làm payment/order/shipping/Zalo API/anti-fraud phức tạp.

---

# 1. Current State Analysis

## 1.1 Repo/stack hiện tại

| Area           | Current state                                | Evidence                                                   |
| -------------- | -------------------------------------------- | ---------------------------------------------------------- |
| App            | React 19 + Vite 6 SPA                        | `FE/package.json`                                          |
| Router         | React Router DOM v7 + HashRouter             | `docs/frontend-architecture.md`, `FE/routes/AppRouter.tsx` |
| Source style   | mixed `.jsx` pages + `.tsx` entry/router     | `PROJECT_AI_NOTES.md`                                      |
| Backend        | chưa implement xong                          | `docs/mvp-scope.md`, `plans/backend-plan.md`               |
| Backend target | ASP.NET Core Web API + PostgreSQL            | `docs/api-contract.md`, `plans/backend-plan.md`            |
| Auth           | frontend shell + mock auth, JWT planned      | `PROJECT_AI_NOTES.md`                                      |
| Roles          | simple `USER` / `ADMIN`                      | `docs/api-contract.md`                                     |
| API boundary   | centralized services                         | `FE/services/api.js`, `FE/services/*`                      |
| Tests          | no unit/E2E; `npm run lint` = `tsc --noEmit` | `FE/package.json`, `PROJECT_AI_NOTES.md`                   |

## 1.2 Current architecture

```txt
FE/App.tsx
└── HashRouter
    └── AuthProvider
        └── CareProvider
            └── AppRouter
```

Important files:

| File                         | Role                            | Practical impact                                             |
| ---------------------------- | ------------------------------- | ------------------------------------------------------------ |
| `FE/routes/AppRouter.tsx`    | central route registry          | avoid route churn; add admin feedback route only if needed   |
| `FE/services/api.js`         | base fetch/auth/error           | reuse as-is                                                  |
| `FE/services/plantApi.js`    | catalog + my-plants CRUD        | keep free add; claim-code remains Future                     |
| `FE/services/aiApi.js`       | AI diagnose/chat/dialog helpers | keep basic AI; later personalize for verified/claimed plants |
| `FE/services/feedbackApi.js` | current `POST /feedback` only   | Phase 1: extend verified feedback APIs                       |
| `FE/services/adminApi.js`    | admin endpoints + mocks         | Phase 1: add lightweight feedback admin helpers              |
| `FE/data/mockData.ts`        | fallback catalog/my plants      | add small verified feedback mock later if needed             |
| `FE/components/UiState.jsx`  | loading/empty/error helpers     | reuse                                                        |

## 1.3 Current routes

| Route                | Page                   | Current meaning                            | New impact                                                         |
| -------------------- | ---------------------- | ------------------------------------------ | ------------------------------------------------------------------ |
| `/plants`            | `PlantList.jsx`        | contact-only marketplace list              | keep; optional verified feedback/social proof badge                |
| `/plants/:plantId`   | `PlantDetail.jsx`      | contact-only detail, some commerce-like UI | add verified feedback section; reduce ecommerce wording later      |
| `/app/my-plants`     | `MyPlants.jsx`         | user plant collection                      | keep all plants; do not make claimed-only                          |
| `/app/add-plant`     | `AddPlantUser.jsx`     | free manual add                            | keep; later optionally add “claim code” secondary CTA              |
| `/app/ai-analysis`   | `AIPlantAnalysis.jsx`  | diagnose uploaded image                    | keep usable; later add selected plant/context as enhancement       |
| `/app/ai-chat`       | `AIChat.jsx`           | chat with plant context/mock data          | keep basic AI; improve loading from `getMyPlants()` when practical |
| `/admin/marketplace` | `AdminMarketplace.jsx` | display contact listings                   | can host small feedback panel/link                                 |
| `/admin/plants`      | `AdminPlants.jsx`      | user plants list                           | no Phase 1 change required                                         |
| `/admin/ai`          | `AdminAI.jsx`          | AI status/history                          | no Phase 1 change required                                         |

## 1.4 Flow hiện tại

### Marketplace

Current:

1. User opens public catalog.
2. User views price/contact-only item.
3. User contacts via Facebook/Zalo button.
4. Purchase happens outside app.
5. No in-app purchase record.
6. No verified feedback display.

Strength:

- Đúng lean/contact-only.
- Avoids payment/order complexity.
- Good fit for current backend maturity.

Weakness:

- Mentor cannot easily see customer validation.
- Feedback is not visibly tied to real social/manual purchases.
- Product detail still has some e-commerce-ish combo/review UI.

### My Plants

Current:

1. User clicks Add New Plant.
2. User enters species/nickname/location/image URL.
3. Frontend calls `createMyPlant()` → `POST /my-plants`.
4. If backend unavailable, redirects to collection fallback.

Recommendation:

- Keep this flow for now.
- It supports onboarding and AI wow factor.
- Do not force ownership code before the app has feedback validation working.

### AI Chat

Current:

1. `AIChat.jsx` uses `MY_PLANTS` mock directly.
2. User selects a plant.
3. Sends `plantId`, `message`, `history`, `plantContext` via `sendPlantContextChatMessage()`.
4. Backend fallback mock returns plant-care reply.

Recommendation:

- Keep basic AI available.
- No hard quota/limit system required in current MVP.
- Later: claimed/verified plants can unlock better context/history as a soft future incentive.
- Do not hard-block AI for non-claimed plants in Phase 1.

### AI Diagnose

Current:

1. User uploads image.
2. Sends `imageBase64` + question only.
3. `plantId` optional via API contract but UI does not require selection.

Recommendation:

- Keep basic diagnose available.
- Later: optional plant selector improves context.
- Avoid hard ownership dependency now.

### Feedback

Current:

- `feedbackApi.js` exposes only `submitFeedback(payload)` → `POST /feedback`.
- No clear verified public feedback section in inspected core pages.
- API contract says optional auth feedback, generic.

Phase 1 opportunity:

- Add admin-created/manual verified feedback.
- Store `evidenceNote` privately only.
- Publish public customer quote/card.
- Link feedback to marketplace/social purchase via manual fields, not full order system.
- No screenshot upload/storage flow in Phase 1.

### Admin Dashboard

Current:

- Admin routes exist and are guarded.
- Admin marketplace shows list only.
- Admin plants show user plants list.
- `adminApi.js` has service wrappers and mock fallback.

Recommendation:

- Keep admin workflow very light.
- Phase 1 admin minimum: admin manually creates believable feedback entries.
- Optional: simple admin feedback list.
- Edit/moderation workflow can wait.
- Ownership code management waits.

## 1.5 Pending backend situation

Backend absent/in-progress. Current docs expect:

- Auth/users.
- Public catalog.
- My plants CRUD.
- Reminders.
- AI diagnose/chat/history.
- Feedback submit.
- Lightweight admin.

New priority for mentor validation:

```txt
Phase 1: FE mock-ready verified feedback demo.
Phase 2: BE provides minimal feedback endpoints.
Future: ownership code only after feedback MVP is proven.
```

## 1.6 Strengths

| Strength                                  | Why useful                                          |
| ----------------------------------------- | --------------------------------------------------- |
| Contact-only marketplace already approved | avoids payment/order scope                          |
| Services layer exists                     | low-risk API additions                              |
| Admin shell exists                        | manual feedback can fit without big rebuild         |
| AI Chat already plant-context based       | future personalization path exists                  |
| My Plants concept exists                  | onboarding/care value exists without ownership lock |
| Docs already warn no ecommerce            | direction aligned                                   |

## 1.7 Weaknesses/conflicts, reframed

| Issue                                | File/area                           | Practical recommendation                               |
| ------------------------------------ | ----------------------------------- | ------------------------------------------------------ |
| Feedback generic only                | `feedbackApi.js`, docs              | Phase 1: mock-ready feedback; Phase 2: minimal BE APIs |
| No public validation section         | `PlantDetail.jsx`, maybe `Home.jsx` | show verified feedback cards                           |
| Product detail has ecom vibe         | `PlantDetail.jsx`                   | reduce later; not Phase 1 blocker                      |
| AI Chat uses mock plants directly    | `AIChat.jsx`                        | improve later; not ownership blocker                   |
| Free add plant not purchase-verified | `AddPlantUser.jsx`, `MyPlants.jsx`  | acceptable; keep app usable                            |
| Ownership code not present           | API/docs/admin                      | Future optional enhancement                            |
| Docs stale                           | key docs                            | update small set after implementation                  |

## 1.8 Docs outdated after new direction

| Doc                             | Needed update after implementation                                   |
| ------------------------------- | -------------------------------------------------------------------- |
| `docs/api-contract.md`          | verified feedback endpoints first; ownership code as future/optional |
| `docs/mvp-scope.md`             | feedback validation becomes core MVP; My Plants remains free-add     |
| `docs/frontend-architecture.md` | public feedback/admin feedback flow                                  |
| `docs/project-overview.md`      | marketplace validation story                                         |
| `plans/backend-plan.md`         | feedback endpoints priority                                          |
| `docs/changelog.md`             | implementation milestone                                             |

Lower priority: `PROJECT_AI_NOTES.md` only after durable decision is implemented. `AGENTS.md` not needed.

---

# 2. Product Direction Alignment

## 2.1 Correct MVP thesis

The riskiest EXE201 question is not “Can we verify ownership perfectly?”

It is:

- Did anyone actually buy/contact?
- Did anyone give real feedback?
- Can DeskBoost present a believable post-purchase validation loop?

Therefore current delivery should be split:

```txt
Phase 1 FE-first: mock feedback → public manually verified cards → demo validation now
Phase 2 BE integration: replace mock with minimal feedback APIs
Future: ownership/claimed plant/enhanced AI only after validation
```

## 2.2 Why manual verified feedback first

| Need                            | Why feedback-first fits                    |
| ------------------------------- | ------------------------------------------ |
| Mentor asks customer validation | verified feedback directly answers this    |
| Backend not ready               | small schema/endpoints                     |
| Team is student MVP             | simple admin form/list                     |
| Marketplace contact-only        | manual evidence matches real sales channel |
| Avoid over-scope                | no order/payment needed                    |

## 2.3 Plant code is good but not first

Plant ownership code is useful later for:

- linking purchased plant to My Plants.
- post-purchase care personalization.
- future retention loop.
- future premium/claimed benefits.

But it should not block:

- collecting feedback.
- showing verified feedback.
- demoing customer validation.
- AI onboarding.

## 2.4 AI should be an incentive, not a locked door

Hard-gating AI too early hurts onboarding because AI is the wow feature.

Better MVP stance:

| User/plant type              | AI experience                                                     |
| ---------------------------- | ----------------------------------------------------------------- |
| no claimed plant             | basic AI chat/diagnose, generic care advice                       |
| manually added plant         | basic plant-context AI from user-entered info                     |
| claimed/verified plant later | better context/history/personalization as future enhancement only |

This creates incentive without killing adoption. Do not implement quota tracking/reset/rate-limit logic in current MVP.

## 2.5 Why no payment/order now

Payment/order validates engineering complexity, not customer demand. For now:

- Zalo/Facebook handles sale conversation.
- Admin feedback evidence proves validation enough.
- Manual workflow is expected for early MVP.
- Payment/order can wait until sales volume justifies it.

---

# 3. Scope Control

## 3.1 Phase 1 FE-first mock-ready must do

| Scope                                              | Reason                                   |
| -------------------------------------------------- | ---------------------------------------- |
| Public manually verified feedback cards            | visible social proof now                 |
| Small `VERIFIED_FEEDBACK` mock data                | demo works before backend                |
| `getVerifiedFeedback()` wrapper with mock fallback | easy API switch later                    |
| Admin add feedback UI mock-ready                   | mentor sees manual validation workflow   |
| Private `evidenceNote` field                       | believable proof without uploads/storage |
| Keep My Plants/Add Plant/AI unchanged              | avoids unrelated scope                   |

## 3.2 Phase 1 should NOT do

| Not now                       | Why                                             |
| ----------------------------- | ----------------------------------------------- |
| plant ownership code          | good future step, not feedback blocker          |
| claim-only My Plants          | hurts usability/onboarding                      |
| hard AI gating                | reduces AI wow factor                           |
| AI premium/quotas             | needs tracking/reset/rate-limit complexity      |
| edit/moderation workflow      | too much admin product surface for MVP          |
| screenshot/evidence upload    | creates storage, permission, privacy complexity |
| order/payment/shipping        | ecommerce drift                                 |
| Zalo/Facebook API integration | platform overhead                               |

## 3.3 Phase 2 BE integration only

| Scope                                 | Reason                               |
| ------------------------------------- | ------------------------------------ |
| `POST /admin/feedback`                | admin creates manually verified item |
| `GET /feedback/verified`              | public feedback cards use real data  |
| optional `GET /admin/feedback`        | admin list only if needed            |
| connect FE wrappers to real endpoints | replace mock without UI rewrite      |
| keep mock fallback                    | dev/demo resilience                  |

No Phase 2 scope expansion: no ownership code, claim flow, AI quota, screenshot upload, payment/order/shipping.

## 3.4 Future phase only

| Future                               | Trigger                                        |
| ------------------------------------ | ---------------------------------------------- |
| plant ownership code                 | after verified feedback MVP works              |
| claimed plant badge                  | after code claim exists                        |
| richer AI context for claimed plants | after basic AI usage exists                    |
| order records                        | only after repeated manual sales need tracking |
| payment                              | only after conversion validated                |
| QR code on pot                       | only after manual code flow works              |

## 3.5 Intentionally skipped

- Multi-admin approval.
- Customer identity matching from Zalo/Facebook.
- Screenshot OCR.
- Anti-fraud architecture.
- Analytics dashboard beyond simple counts.
- Long-term AI memory.
- Enterprise audit trail.

---

# 4. Architecture Impact Analysis

## 4.1 Frontend architecture impact

Minimal. Existing FE structure remains:

- pages call services.
- services call centralized API.
- mock fallback allowed.
- admin remains lightweight.
- no new state library.

Phase 1 service surface:

| Service          | Phase 1 additions                                  |
| ---------------- | -------------------------------------------------- |
| `feedbackApi.js` | `getVerifiedFeedback(params)`                      |
| `adminApi.js`    | `createAdminFeedback`; optional `getAdminFeedback` |
| `plantApi.js`    | no Phase 1 change                                  |
| `aiApi.js`       | no Phase 1 change                                  |

## 4.2 Backend architecture impact

Phase 1 has no backend dependency. FE uses mock/fallback so demo can run before BE is complete.

Phase 2 adds one lightweight `Feedback` table/API surface only when backend is ready. If backend has no feedback table yet, create one flexible `Feedback` table with manually verified fields. Avoid separate complex moderation models.

No Phase 1 or Phase 2 `PlantOwnershipCode` table.

## 4.3 AI flow impact

Phase 1: no hard gate.

Near-term improvements only:

- AI Chat should eventually load `getMyPlants()` instead of hardcoded mock.
- AI Diagnose can later accept optional `plantId`.
- Claimed/verified plant personalization is Future.

Soft model:

```txt
Basic AI remains available.
Verified/claimed plant later improves personalization and trust.
```

## 4.4 My Plants impact

Keep current “user can freely add plant”.

Recommended model:

```txt
My Plants = user-managed plants
Claimed/verified plants = optional trusted subset later
```

Do not:

- disable Add Plant.
- hide manual plants.
- make manual plants non-AI immediately.
- require code for core app usage.

## 4.5 Backward compatibility

No migration burden now because backend is not complete.

If Future ownership flow adds plant code later, add optional fields only:

| Field             | Meaning                   |
| ----------------- | ------------------------- |
| `source`          | `manual` / `claimed_code` |
| `isClaimVerified` | boolean                   |
| `ownershipCodeId` | nullable                  |
| `catalogPlantId`  | optional                  |

Manual plants remain normal plants.

---

# 5. Detailed Implementation Roadmap

## Phase overview

| Phase  | Name                          | Priority | Complexity | Depends on        |
| ------ | ----------------------------- | -------- | ---------- | ----------------- |
| 0      | Minimal alignment             | P0       | Low        | none              |
| 1      | FE-first mock-ready feedback  | P0       | Low        | existing FE/admin |
| 2      | BE integration for feedback   | P0       | Low-Med    | backend ready     |
| Future | Ownership/claimed/enhanced AI | P2       | Medium+    | validated MVP     |

## Phase 0: Minimal alignment

| Item         | Detail                                            |
| ------------ | ------------------------------------------------- |
| Goal         | align team that feedback is first MVP priority    |
| Tasks        | update small docs/API notes before implementation |
| FE impact    | none                                              |
| BE impact    | agree feedback fields/endpoints                   |
| Risk         | team overbuilds ownership/order flow              |
| Dependencies | mentor/team approval                              |
| Complexity   | Low                                               |
| Priority     | P0                                                |
| Blockers     | none                                              |

Acceptance:

- Feedback-first direction approved.
- Ownership code marked Future.
- AI hard-gating removed from MVP requirement.
- No payment/order/shipping remains explicit.

## Phase 1: FE-first mock-ready feedback MVP

| Item         | Detail                                                                                 |
| ------------ | -------------------------------------------------------------------------------------- |
| Goal         | demo believable customer validation immediately, even before BE is complete            |
| Tasks        | public feedback cards; small mock data; `getVerifiedFeedback()` fallback; admin add UI |
| FE impact    | `PlantDetail.jsx`; `feedbackApi.js`; mock `VERIFIED_FEEDBACK`; small admin form        |
| BE impact    | none required in Phase 1                                                               |
| Risk         | feedback looks fake if copy/process feels too polished                                 |
| Dependencies | existing FE/admin shell + mock fallback                                                |
| Complexity   | Low                                                                                    |
| Priority     | P0                                                                                     |
| Blockers     | none if mock available                                                                 |

Phase 1 mock/form fields:

| Field             | Required | Note                                                   |
| ----------------- | -------- | ------------------------------------------------------ |
| `customerAlias`   | yes      | e.g. “Customer from HCMC”                              |
| `rating`          | yes      | 1-5                                                    |
| `comment`         | yes      | public quote                                           |
| `catalogPlantId`  | optional | link to product if known                               |
| `purchaseChannel` | yes      | `zalo`, `facebook`, `manual`, `other`                  |
| `evidenceNote`    | yes      | private admin note, e.g. “Customer purchased via Zalo” |
| `createdAt`       | yes      | mock/backend set                                       |

Phase 1 must keep out:

- screenshot upload/storage.
- public evidence display.
- edit workflow.
- moderation queue/status lifecycle.
- ownership code linking.
- customer account matching.

Screenshot/photo evidence can be a future enhancement only after note-only feedback works.

## Phase 2: BE integration for feedback

| Item         | Detail                                                                    |
| ------------ | ------------------------------------------------------------------------- |
| Goal         | replace mock feedback with real API data                                  |
| Tasks        | connect `getVerifiedFeedback()`; connect admin create; keep mock fallback |
| FE impact    | service URL switch only; minimal UI change expected                       |
| BE impact    | `POST /admin/feedback`, `GET /feedback/verified`, optional admin list     |
| Risk         | API response mismatch                                                     |
| Dependencies | backend auth/admin endpoints ready                                        |
| Complexity   | Low-Med                                                                   |
| Priority     | P0 after Phase 1                                                          |
| Blockers     | backend availability                                                      |

MVP UX philosophy:

```txt
Manually verified feedback
[rating] [short quote] [channel: Zalo/Facebook/manual]
Example notes/copy: “Bought via Zalo”, “Verified manually”, “Customer from HCMC”
```

Keep UI simple, believable, slightly raw/manual. Prefer real-customer comment cards over polished testimonial carousel or ecommerce review ecosystem. Do not expose private evidence notes/screenshots publicly.

## Future / Phase 3 — Plant Code, Claim, QR, AI Context

### 1. Goal

Phase 3 goal:

- Turn social/manual purchase into a plant ownership signal inside the app.
- Do not build order/payment.
- Increase post-purchase engagement after Zalo/Facebook/manual sales.
- Create foundation for personalized AI/care later.

### 2. Product Flow

```txt
Admin bán cây qua Zalo/Facebook
→ Admin tạo Plant Code cho sản phẩm/cây đã bán
→ Admin gửi mã hoặc link claim cho khách
→ User đăng nhập
→ User nhập mã / mở claim link
→ Cây được thêm vào My Plants với trạng thái claimed/verified
→ AI có thể dùng context cây đó tốt hơn
```

### 3. Phase 3A — Plant Code Text First

Làm mã text trước, chưa QR.

Admin:

- Chọn `catalogPlantId` optional.
- Nhập `plantNameSnapshot` nếu cần.
- Tạo code ngắn.
- Code status: `active` / `claimed` / `disabled`.
- Gửi code cho khách qua Zalo/Facebook.

User:

- Nhập code trong app.
- Nếu hợp lệ thì tạo `UserPlant` claimed.

### 4. Phase 3B — Claim Plant by Code

User claim flow:

- Login required.
- Nhập mã.
- BE validate code active + unused.
- Create `UserPlant`.
- Mark code claimed.
- Show claimed badge trong My Plants.

Important:

- Manual plants vẫn tồn tại.
- Claimed plants là trusted subset, không thay thế free manual plants.

### 5. Phase 3C — Optional QR Claim Link

QR KHÔNG phải core.

QR chỉ encode:

```txt
/app/claim-plant?code=XXXX
```

Không làm:

- QR scan camera.
- QR inventory.
- NFC.
- Physical label workflow.
- QR security complexity.

MVP QR chỉ là:

- Admin copy/share claim link.
- Có thể generate QR image later nếu thật sự cần.

### 6. Phase 3D — AI Context Enhancement

AI basic vẫn dùng được cho manual plants.

Claimed plants có thể unlock future improvements:

- Richer plant context.
- Care history.
- Purchase/source context.
- Better personalized recommendation.

Không làm:

- Hard lock AI.
- Quota/rate limit thật.
- Billing/premium subscription.
- AI ownership enforcement ngay.

### 7. Scope Control

Explicitly NOT in Phase 3:

- Payment.
- Order lifecycle.
- Shipping.
- Cart.
- Zalo/Facebook API.
- QR scanner.
- NFC.
- AI billing.
- Complex anti-fraud.
- Strict identity verification.

### 8. Implementation Priority

Future priority:

1. Phase 3A: Plant Code text.
2. Phase 3B: Claim by code.
3. Phase 3C: QR claim link optional.
4. Phase 3D: AI context enhancement.

---

# 6. Backend Planning

## 6.1 Phase 2 minimal data model

Prefer extending `Feedback` rather than creating a large ecosystem.

### Feedback

| Field              | Type        | MVP note                              |
| ------------------ | ----------- | ------------------------------------- |
| `id`               | uuid/string | internal                              |
| `customerAlias`    | string      | public alias                          |
| `rating`           | int         | 1-5                                   |
| `comment`          | text        | public                                |
| `catalogPlantId`   | nullable fk | optional product link                 |
| `purchaseChannel`  | enum/string | `zalo`, `facebook`, `manual`, `other` |
| `evidenceNote`     | text        | private admin proof/context           |
| `published`        | bool        | optional; only if BE needs hide/show  |
| `createdByAdminId` | nullable fk | if admin-created                      |
| `createdAt`        | datetime    | backend set                           |
| `updatedAt`        | datetime    | backend set                           |

Skip in Phase 2:

- `userPlantId` dependency.
- ownership code foreign keys.
- moderation queue/status lifecycle.
- screenshot URL/upload/storage subsystem.

## 6.2 Phase 2 endpoints

MVP minimum viable endpoints:

| Method | Endpoint             | Auth  | Purpose                           |
| ------ | -------------------- | ----- | --------------------------------- |
| `POST` | `/admin/feedback`    | ADMIN | create manually verified feedback |
| `GET`  | `/feedback/verified` | No    | list public feedback cards        |

Optional if useful for admin screen:

| Method | Endpoint          | Auth  | Purpose             |
| ------ | ----------------- | ----- | ------------------- |
| `GET`  | `/admin/feedback` | ADMIN | list admin feedback |

De-emphasize for MVP:

- `PUT /admin/feedback/:id` edit workflow.
- `PUT /admin/feedback/:id/status` publish/hide workflow.
- `GET /plants/:id/feedback` plant-specific endpoint.

Admin manually creating believable feedback entries is enough for current validation. Public endpoint must not return `evidenceNote`.

## 6.3 Phase 2+ optional entities

### PlantOwnershipCode

Only after feedback MVP works.

| Field               | Type              | MVP note                        |
| ------------------- | ----------------- | ------------------------------- |
| `id`                | uuid/string       | internal                        |
| `code`              | string unique     | short code                      |
| `catalogPlantId`    | nullable fk       | sold plant if known             |
| `plantNameSnapshot` | string            | optional                        |
| `customerName`      | string nullable   | manual ops                      |
| `adminNote`         | text nullable     | private                         |
| `status`            | enum              | `active`, `claimed`, `disabled` |
| `claimedByUserId`   | fk nullable       | set on claim                    |
| `createdAt`         | datetime          |                                 |
| `claimedAt`         | datetime nullable |                                 |

### UserPlant optional fields

| Field             | Meaning                   |
| ----------------- | ------------------------- |
| `source`          | `manual` / `claimed_code` |
| `isClaimVerified` | boolean                   |
| `ownershipCodeId` | nullable                  |
| `catalogPlantId`  | optional                  |

## 6.4 Phase 2 validation

| Area            | Phase 2 validation                                   |
| --------------- | ---------------------------------------------------- |
| admin feedback  | rating 1-5, comment required, customer name required |
| verified status | implicit: feedback in this flow is manually verified |
| public feedback | only public card fields returned                     |
| evidence        | `evidenceNote` required; private admin note only     |
| privacy         | evidence note not returned in public endpoint        |

Future code validation only later:

- code exists.
- active.
- one-time claim.
- logged-in user.

## 6.5 Postponed APIs

- `/orders/*`.
- `/payments/*`.
- `/shipping/*`.
- `/cart/*`.
- `/zalo/*` webhook/API.
- `/qr/*` generation/scanning.
- advanced analytics.
- AI billing/quota/rate-limit tracking.
- permission matrix.

---

# 7. Frontend Planning

## 7.1 Page/component impact

| File                                  | Current                               | Phase 1 FE-first plan                                               | Priority |
| ------------------------------------- | ------------------------------------- | ------------------------------------------------------------------- | -------- |
| `FE/pages/admin/AdminMarketplace.jsx` | list contact catalog                  | add small mock-ready manual feedback add panel if no new route      | P0       |
| `FE/services/adminApi.js`             | admin wrappers                        | add `createAdminFeedback` mock-ready wrapper                        | P0       |
| `FE/services/feedbackApi.js`          | `submitFeedback` only                 | add `getVerifiedFeedback()` with mock fallback                      | P0       |
| `FE/data/mockData.ts`                 | fallback catalog/my plants            | add tiny believable `VERIFIED_FEEDBACK`                             | P0       |
| `FE/pages/PlantDetail.jsx`            | contact detail + commerce-like review | show simple manually verified feedback cards; reduce ecommerce vibe | P0       |
| `FE/pages/PlantList.jsx`              | contact-only list                     | optional tiny social proof signal if cheap                          | P1       |
| `FE/pages/Home.jsx`                   | landing                               | optional short social proof section                                 | P1       |
| `FE/pages/AddPlantUser.jsx`           | free add form                         | keep unchanged in Phase 1                                           | P2       |
| `FE/pages/MyPlants.jsx`               | user plants                           | keep unchanged in Phase 1                                           | P2       |
| `FE/pages/AIChat.jsx`                 | plant AI chat                         | keep basic AI; later load real my-plants                            | P2       |
| `FE/pages/AIPlantAnalysis.jsx`        | image diagnose                        | keep basic diagnose                                                 | P2       |

## 7.2 Service impact

| File                         | Phase 1 add                                   | Phase 2 change                      |
| ---------------------------- | --------------------------------------------- | ----------------------------------- |
| `FE/services/feedbackApi.js` | `getVerifiedFeedback(params)` + mock fallback | connect to `GET /feedback/verified` |
| `FE/services/adminApi.js`    | `createAdminFeedback` mock-ready              | connect to `POST /admin/feedback`   |
| `FE/services/plantApi.js`    | no change                                     | no feedback-related change          |
| `FE/services/aiApi.js`       | no change                                     | no feedback-related change          |

## 7.3 State impact

No global state.

Use local state:

- admin feedback list/form: `items`, `loading`, `error`, `form`, `isSubmitting`.
- public feedback cards: `items`, `loading`, `error`, fallback mock.

Avoid:

- new context.
- Zustand/Redux/query library.
- complex modal framework.

## 7.4 Route impact

Lean recommendation:

| Option                        | Recommendation                        |
| ----------------------------- | ------------------------------------- |
| add `/admin/feedback`         | good if small route addition accepted |
| embed in `/admin/marketplace` | safest/minimal route churn            |
| add `/app/claim-plant`        | not Phase 1                           |
| repurpose `/app/add-plant`    | not Phase 1                           |

Preferred Phase 1:

```txt
/admin/marketplace → includes or links lightweight mock-ready feedback add panel
/plants/:plantId → shows public manually verified feedback from mock/fallback
```

If route addition is acceptable:

```txt
/admin/feedback → dedicated simple feedback list/form
```

## 7.5 UX copy direction

Use:

- “Manually verified feedback from DeskBoost customers”.
- “Feedback from Zalo/Facebook/manual purchase”.
- “Verified manually by DeskBoost team”.
- “Bought via Zalo”.
- “Customer from HCMC”.
- “Marketplace MVP: contact seller directly”.

Avoid:

- “Verified Purchase”.
- “Order complete”.
- “Payment successful”.
- “Shipping status”.
- “Premium AI locked”.
- “Claim required to use AI”.
- polished ecommerce review ecosystem.
- fake-looking testimonial carousel.

## 7.6 Marketplace/product detail philosophy

Plant detail and marketplace UX should reduce ecommerce feeling:

- reduce Shopee-clone/store/review/combo wording.
- avoid cart/order/payment/shipping implications.
- emphasize plant care, customer stories, AI care support, post-purchase support.
- frame as startup/manual marketplace: contact → real conversation → care support.
- use simple comment cards over marketplace review ecosystem.

---

# 8. Data Migration / Transition Strategy

## 8.1 Current manual add plant handling

Keep as-is.

| Area           | Decision                                |
| -------------- | --------------------------------------- |
| Add Plant      | stays usable                            |
| My Plants      | manual plants stay normal               |
| AI Chat        | basic usage remains                     |
| AI Diagnose    | basic usage remains                     |
| Claimed plants | future verified subset, not replacement |

## 8.2 Compatibility

Because backend is not complete, no migration is needed for Phase 1.

When Phase 2 BE integration happens:

- Replace mock reads/writes with minimal feedback endpoints.
- Keep mock fallback for development/demo.
- Do not rewrite existing plant records.
- Show claimed/verified badge only for plants confirmed through a future claim-code flow.
- Manual plants remain supported.

## 8.3 Mock data transition

Phase 1 mock data should add a tiny `VERIFIED_FEEDBACK` list only.

Avoid adding large ownership mock ecosystem. Ownership remains Future, not Phase 2.

## 8.4 User communication

Phase 1 messaging:

- “Feedback manually verified from social/manual purchases.”
- “DeskBoost marketplace is contact-only for MVP.”
- “AI care remains available while the product evolves.”

Future messaging later:

- “Have a plant code? Claim it to mark your DeskBoost purchase.”
- “Claimed DeskBoost plants may get enhanced care support.”

---

# 9. Documentation Update Plan

Keep documentation updates small and practical. For this planning step, only update `plans/backend-plan.md`; other docs wait until integration is implemented.

| File                            | Update after implementation                              | Priority |
| ------------------------------- | -------------------------------------------------------- | -------- |
| `docs/api-contract.md`          | add verified feedback endpoints/fields                   | P0       |
| `plans/backend-plan.md`         | reprioritize feedback endpoints before ownership code    | P0       |
| `docs/mvp-scope.md`             | feedback-first validation; ownership code optional later | P0       |
| `docs/project-overview.md`      | add manual verified feedback as validation loop          | P1       |
| `docs/frontend-architecture.md` | note admin/public feedback surfaces                      | P1       |
| `docs/changelog.md`             | add milestone entry after implementation                 | P1       |

Lower priority:

| File                  | Decision                                            |
| --------------------- | --------------------------------------------------- |
| `PROJECT_AI_NOTES.md` | update only after feature is implemented and stable |
| `AGENTS.md`           | no update needed                                    |
| Agentmemory           | only store durable decision after implementation    |
| ADR                   | not needed for Phase 1; too heavy                   |

Recommended order:

1. `docs/api-contract.md`.
2. `plans/backend-plan.md`.
3. `docs/mvp-scope.md`.
4. `docs/project-overview.md`.
5. `docs/changelog.md` after implementation.

---

# 10. Agentmemory & AI Workflow Update Strategy

Keep lightweight.

After implementation, optionally remember only:

```txt
Context: DeskBoost MVP validation
Durable fact: DeskBoost validates marketplace demand through manual verified feedback from Zalo/Facebook/manual purchases; marketplace remains contact-only with no payment/order/shipping.
When useful: planning feedback, marketplace, backend, or admin work.
Do not include: customer contacts, screenshots, raw private evidence, secrets.
```

If Future ownership code is actually implemented later, remember then:

```txt
Context: DeskBoost optional ownership model
Durable fact: Plant ownership code marks a plant as claimed/verified but does not replace free manual My Plants usage.
When useful: editing My Plants, AI personalization, or claim-code flow.
Do not include: real codes or customer data.
```

No ADR required for Phase 1.

---

# 11. MVP Implementation Priority

## Phase 1 MUST HAVE — FE-first mock-ready

- Public simple manually verified feedback cards/comments.
- Tiny believable `VERIFIED_FEEDBACK` mock list.
- `getVerifiedFeedback()` wrapper with mock fallback.
- Admin add feedback UI mock-ready.
- Private `evidenceNote` in admin/form data only; not public UI.
- Copy avoids “Verified Purchase” and ecommerce/order language.

## Phase 1 NICE TO HAVE

- Homepage social proof section.
- PlantList tiny social proof signal.
- Slight UI polish while keeping comments believable/raw.

## Phase 2 — BE integration

- `POST /admin/feedback`.
- `GET /feedback/verified`.
- Optional `GET /admin/feedback`.
- Connect FE wrappers to real endpoints.
- Keep mock fallback for development/demo.

## FUTURE

- Screenshot/photo upload.
- Ownership code.
- Claimed plant benefits.
- AI personalization for claimed plants.
- Enhanced AI experience after real usage exists.
- Order/payment/shipping only if validated sales volume requires it.

---

# 12. Risk Analysis

| Risk                          | Severity             | Why                                             | Mitigation                                                         |
| ----------------------------- | -------------------- | ----------------------------------------------- | ------------------------------------------------------------------ |
| Fake validation perception    | High                 | admin-created feedback may look fabricated      | private `evidenceNote`; simple manual labels; real customer quotes |
| Mentor expects customer proof | High                 | generic feedback weak                           | show channel + manually verified customer feedback                 |
| Backend delay                 | High                 | persistence may not be ready                    | mock fallback for demo; implement 2 minimal endpoints first        |
| Over-scope drift              | High                 | ownership/order/payment can expand              | Phase 1 feedback only; ownership Future                            |
| Admin workflow burden         | Medium               | too many fields/workflows slows team            | add-only first; optional list; edit/status later                   |
| Privacy                       | Medium               | screenshots may contain personal data           | no Phase 1 upload/storage; public endpoint excludes evidence note  |
| AI onboarding loss            | Medium if hard-gated | locking AI hurts wow factor                     | soft AI model; no Phase 1 hard gate/quota                          |
| Product confusion             | Medium               | marketplace without payment may look incomplete | copy: contact-only MVP + customer stories + care support           |
| Visual polish time sink       | Low-Med              | feedback carousel/cards can expand              | simple comment cards first                                         |
| Data model churn              | Low-Med              | ownership later may require fields              | add optional fields later only                                     |

---

# 13. Final Recommendation

## 13.1 Do first

1. Implement Phase 1 FE-first mock-ready feedback.
2. Add public manually verified feedback cards on marketplace detail/public surface.
3. Add lightweight mock-ready admin feedback create UI.
4. Keep My Plants, Add Plant, AI Chat, AI Diagnosis unchanged.
5. Wait for BE before Phase 2 integration.

## 13.2 MVP thật sự now

```txt
Phase 1: Browse contact-only marketplace
→ FE/mock manually verified feedback exists
→ public site shows believable feedback cards
→ mentor sees customer validation story now

Phase 2: BE becomes ready
→ connect admin create + public feedback endpoints
→ replace mock with real records without expanding scope
```

This is the smallest practical MVP loop for current maturity.

## 13.3 Postpone

- Plant ownership code.
- Claim-code admin workflow.
- Claimed-only AI.
- AI premium/limits system.
- Payment.
- Cart/checkout.
- Orders/shipping.
- Zalo/Facebook API automation.
- QR/NFC.
- Advanced analytics.
- Complex permission system.
- Automated fraud detection.

## 13.4 Nice-to-have later

| Nice-to-have                        | When                            |
| ----------------------------------- | ------------------------------- |
| feedback photo upload               | after note-only approach works  |
| homepage feedback section           | after plant detail cards work   |
| plant ownership code                | after feedback MVP accepted     |
| claimed/verified badge in My Plants | after code claim exists         |
| enhanced AI for claimed plants      | after ownership code exists     |
| admin dashboard counts              | after feedback endpoints stable |

## 13.5 Dangerous overengineering

Avoid these:

- `Order` aggregate with lifecycle.
- Payment gateway integration.
- Shipping status screens.
- Anti-fraud/identity verification system.
- Role/permission matrix.
- Event sourcing/audit-heavy admin.
- Microservices.
- Zalo bot/Messenger bot.
- QR/NFC before manual code is proven.
- Hard AI lock before onboarding value is validated.

## 13.6 Principal architect verdict

Proceed with feedback-first MVP in two phases: Phase 1 FE-first mock-ready, Phase 2 BE integration only. Manual verified feedback with private notes is the highest-ROI answer to mentor validation concerns. Plant ownership code remains a Future evolution, not Phase 1/2. Keep My Plants open, keep AI useful without real quota complexity, keep admin add-only/lightweight first, reduce ecommerce polish, and prove customer validation before building ownership/premium mechanics.
