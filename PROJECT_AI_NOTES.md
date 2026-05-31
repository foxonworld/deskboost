# Project AI Notes

Project-specific working notes for Roo-first AI assistance.

Keep concise. Store stable conventions only.

## Project Summary

- Purpose: DeskBoost EXE201 startup MVP for desk plant care, contact-only marketplace, manually verified customer feedback, AI diagnosis/chat, reminders, and lightweight admin.
- Primary stack: React 19 + Vite 6 + TypeScript config with mixed `.tsx` / `.jsx` source.
- App type: Frontend-first SPA; backend not implemented yet.
- Product direction: feedback-first validation, not ecommerce infrastructure, not ownership ecosystem, not Shopee clone.
- Main entry points: `FE/index.tsx`, `FE/App.tsx`, `FE/routes/AppRouter.tsx`.

## Key Folders

- `FE/`: active frontend app root.
- `FE/pages/`: route pages, including user MVP pages and lightweight admin pages.
- `FE/components/`: shared layout/UI components.
- `FE/context/`: app-level React context providers for auth and care tasks.
- `FE/routes/`: router and route guards.
- `FE/services/`: service/API boundary with mock fallbacks while backend is absent.
- `FE/utils/`: small utility helpers, including auth storage.
- `docs/`: architecture, scope, API contract, and planning source documents.
- `plans/`: planning/audit notes.

## Commands

- Install: `cd FE && npm install`
- Dev: `cd FE && npm run dev`
- Lint/typecheck: `cd FE && npm run lint`
- Typecheck: `cd FE && npm run lint`
- Unit tests: none configured.
- E2E/smoke: none configured; use manual route smoke.
- Build: `cd FE && npm run build`

## Local Conventions

- Component style: React function components; mixed JS/TS; pages commonly `.jsx`, entry/router/theme pieces `.tsx`.
- Routing: React Router DOM v7 with `HashRouter`; route definitions centralized in `FE/routes/AppRouter.tsx`.
- Route guards: use `ProtectedRoute` for `/app/*`; use `AdminRoute` for `/admin/*`; admin role is simple `ADMIN`.
- State/data patterns: global auth via `AuthContext`; care notification/tasks via `CareContext`; otherwise local component state.
- API pattern: keep fetch details in `FE/services/api.js`; feature services wrap endpoint calls and may expose mock fallback until backend exists.
- Backend target: ASP.NET Core Web API + PostgreSQL, REST/JSON, JWT bearer auth, base path `/api/v1`.
- Auth storage: token/user in `localStorage`; keep refresh-token/session complexity out of MVP unless backend requires it.
- Styling approach: Tailwind CDN configured in `FE/index.html`; use Manrope, Material Symbols, green primary `#4CAF50`, dark mode via `.dark` class.
- UI states: prefer `FE/components/UiState.jsx` helpers (`Spinner`, `StateNotice`, `LoadingState`, `EmptyState`) when fitting nearby code.
- Error/loading/empty-state pattern: service-backed pages usually show loading, warning/error notice, empty state, and mock-fallback note where relevant.
- Accessibility expectations: semantic labels/roles where already patterned; preserve keyboard/focus behavior for forms/navigation.
- Naming/import conventions: relative imports inside `FE`; `@/*` alias exists but current source mostly uses relative paths.

## Edit Guardrails

- Prefer minimal diffs.
- Reuse existing components/utilities.
- Preserve current architecture.
- Avoid dependency additions without approval.
- Avoid broad rewrites during feature work or debugging.

Project-specific guardrails:

- Do not rebuild old enterprise admin dashboard; keep admin lightweight.
- Do not add cart, checkout, payment, orders, shipping, refunds, or enterprise commerce flows.
- Do not add QR scanner, NFC, anti-fraud architecture, Zalo/Facebook API integration, AI billing/subscription, or enterprise governance/process.
- Do not expose or edit raw AI/API keys in frontend/admin UI.
- Keep AI Chat plant-context only, not a general-purpose chatbot.
- Keep AI usable without claimed plants; no hard AI gating, quota, real rate-limit, or billing system in current MVP.
- Keep marketplace display/contact-only unless scope changes; purchases happen through Zalo/Facebook/manual conversation.
- Keep My Plants free-add; claimed plants are a future verified subset only.
- Keep role model simple: `USER` / `ADMIN`.
- Confirm before changing Vite/Tailwind/router/auth architecture or adding dependencies.

## Verification Notes

Smallest useful checks for most changes:

1. `cd FE && npm run lint`
2. `cd FE && npm run build`
3. Manual smoke affected route in Vite dev server; include auth/admin logged-out and role-guard path when relevant.

If checks are skipped, record reason and residual risk.

## Durable Decisions

Use ADRs for larger decisions. Keep short notes here for small stable conventions.

- Frontend remains the active MVP implementation; backend is planned but absent.
- Current validation loop: user views plant -> contacts seller via Zalo/Facebook -> manual/social purchase happens -> admin records manually verified feedback -> public verified feedback cards appear -> mentor sees believable customer validation.
- Phase 1: FE-first manually verified feedback MVP with public feedback cards, mock verified feedback, lightweight admin add-feedback UI, `feedbackApi` mock fallback, manually verified wording, private `evidenceNote` only.
- Phase 1 intentionally excludes screenshot upload, `evidenceUrl`, moderation workflow, ownership code, AI gating, payment/order/shipping.
- Phase 2: backend integration only for feedback endpoints: `POST /admin/feedback`, `GET /feedback/verified`, optional `GET /admin/feedback`; no scope expansion.
- Future/Phase 3 only: Plant Code / Claim / QR / AI Context, including admin plant codes, user claim by code, optional QR claim link, claimed plant badge, enhanced AI context for claimed plants.
- Feedback-first MVP: customer validation is priority; ownership ecosystem and ecommerce infrastructure are postponed.
- Manual-first philosophy: manual/social purchase and admin manual feedback verification are acceptable for MVP maturity.
- Marketplace philosophy: contact-only marketplace; emphasize care support + customer stories; avoid cart/payment/shipping UX and Shopee/ecommerce feel.
- AI philosophy: AI remains usable without claimed plants; claimed plants may improve AI context later, but no hard gating, quota, billing, or real rate-limit system now.
- My Plants philosophy: users can freely add plants; do not convert My Plants into claimed-only system.
- Implementation status: Phase 1 FE implemented/planned and validated; Phase 2 BE waits for backend readiness; Future/Phase 3 is planning only with no FE/BE implementation yet.
- Backend-owned concerns: auth/role checks, persistence, AI provider calls, API keys.
- Reminder MVP external path is Google Calendar / `.ics`; browser notifications are secondary only.

## Memory Hygiene

Safe to remember:

- stable architecture/conventions
- repeated bug patterns
- durable decisions

Do not remember:

- secrets
- raw logs
- large diffs
- temporary failures
<<<<<<< Updated upstream
=======

- Backend API smoke test docs/scripts added for DeskBoost local API. Files: `docs/api-smoke-test.md`, `BE/DeskBoost/DeskBoost.API/scripts/api-smoke-test.ps1`.
- Backend smoke run on 2026-05-31 against `http://localhost:5272` passed 20/20 automated checks: Swagger JSON, auth register/me, users/me, marketplace list/detail, my-plants CRUD, reminders CRUD, `GET /api/reminders/{id}/calendar`, `GET /api/reminders/{id}/calendar?format=ics`, feedback create, expected admin `403` with normal user token, and cleanup deletes.
- Backend smoke calendar finding: reminders calendar endpoint returns JSON successfully and `format=ics` returns calendar content containing `BEGIN:VCALENDAR`; it does not perform a live Google Calendar API integration test.
- Backend smoke constraints: no backend business logic changed; no secrets or `appsettings.Development.json` committed/touched by the smoke artifacts.

- Frontend API migration Phase 1 connected Auth, Marketplace, and MyPlants to the real backend service layer. Files changed: `FE/services/api.js`, `FE/services/authApi.js`, `FE/context/AuthContext.jsx`, `FE/services/plantApi.js`, `FE/pages/PlantList.jsx`, `FE/pages/PlantDetail.jsx`, `FE/pages/AddPlantUser.jsx`, `docs/frontend-api-migration.md`, `PROJECT_AI_NOTES.md`.
- Phase 1 API decisions: `VITE_API_URL` is the primary FE API base URL; source fallback is same-origin `/api`; no localhost URL is hardcoded in FE source.
- Phase 1 DTO decisions: `normalizeUser` maps backend `fullName` to UI `name`; `normalizeMarketplacePlant` maps `imageUrl` to `image`, preserves `priceText`, and adapts backend status to existing UI status labels; `normalizeMyPlant` maps backend `name` to UI `nickname` while preserving `name`.
- Phase 1 boundaries: Auth has no mock fallback; Marketplace/MyPlants keep temporary fallback datasets only after explicit request failure; Reminders, AI Chat, AI Diagnose, Upload, Feedback, and Admin were intentionally not migrated.

- UI Polish Sprint A — AI Experience Polish completed. Files changed: `FE/index.html`, `FE/pages/AIPlantAnalysis.jsx`, `FE/pages/AIChat.jsx`, `PROJECT_AI_NOTES.md`.
- Sprint A AI decisions: AI Laser Scan quét 1 lần duy nhất trong mỗi lần chẩn đoán, ẩn hoàn toàn khi reducedMotion là true; Drag Zone CSS chuyển đổi nét đứt xám nhạt (`border-dashed border-slate-300 dark:border-slate-700 bg-transparent`) sang nét liền xanh lá (`border-solid border-primary bg-primary/5 scale-[1.01]`) mượt mà; Chat typing effect chỉ chạy 1 lần trên tin nhắn AI mới nhận thông qua component `TypedText` và state `typingMessageId` (gõ cực nhanh 15ms/3 ký tự, không replay lịch sử cũ); GSAP bubble reveal cuộn tin nhắn xuống dưới và nảy nhẹ bong bóng chat mới (`scale: 0.96 -> 1`, trượt `8px -> 0px` ease `back.out(1.5)` trong `0.3s`); Context switch thực hiện fade + slide nhẹ (trượt 6px) khi thay đổi bối cảnh cây thông qua `chatHeaderRef`.
- Sprint A motion constraints preserved: không có chuyển động lặp vô hạn, không có timeline GSAP phức tạp, hỗ trợ hoàn hảo `prefers-reduced-motion` tắt hết chuyển động về trạng thái tĩnh, giữ nguyên routes/API/auth/backend.
- Sprint A validation: `cd FE && npm run lint` đạt kết quả sạch lỗi; `cd FE && npm run build` biên dịch thành công 100% không có lỗi.

- UI Polish Sprint B — Marketplace & Detail Polish completed. Files changed: `FE/pages/PlantList.jsx`, `FE/pages/PlantDetail.jsx`, `PROJECT_AI_NOTES.md`.
- Sprint B Marketplace decisions: Thêm component `SkeletonCard` mô phỏng chính xác cấu trúc hình học của Product Card thật (tỷ lệ 4:3, tiêu đề, giá, badge và 2 nút) nhấp nháy sang trọng (`animate-pulse`) thay thế cho Spinner loading cũ; tinh chỉnh Card hover tương tác (scale tối đa `1.02` cho ảnh sản phẩm để giữ độ tinh tế chuyên nghiệp, kết hợp nhấc nhẹ card `hover:-translate-y-1 hover:shadow-md dark:hover:border-primary/20` với transition mượt mà 300ms, không dùng bóng đổ dày marketing giá rẻ).
- Sprint B Plant Detail decisions: Thay thế text feedback loading bằng 2 khối verified feedback skeleton nhấp nháy mô phỏng đầy đủ avatar, tiêu đề, stars, comment và tags; bổ sung class `animate-cta-pulse-once` cho nút Zalo, Messenger, nút liên hệ chính và Bottom di động CTA để co giãn nhẹ và đổ bóng mờ đúng 1 lần duy nhất khi component mount.
- Sprint B motion constraints preserved: không có chuyển động lặp vô hạn, không có timeline GSAP phức tạp, hỗ trợ reduced-motion tắt hiệu ứng trượt/scale/pulse về trạng thái tĩnh, giữ nguyên routes/API/auth/backend.
- Sprint B validation: `cd FE && npm run lint` đạt kết quả sạch lỗi; `cd FE && npm run build` biên dịch thành công 100% không có lỗi.

- UI Polish Sprint C — Landing Page Polish & Future Vision completed. Files changed: `FE/pages/Home.jsx`, `FE/i18n/locales.ts`, `PROJECT_AI_NOTES.md`.
- Sprint C Hero decisions: Hero Section heading nâng cấp typography leading-[1.12] và dải màu gradient chữ sang trọng (`bg-gradient-to-br from-text-main via-text-main to-primary bg-clip-text text-transparent dark:from-white dark:via-white dark:to-green-400`); không sử dụng video, showcase thiết bị, hay mockups SaaS marketing phô trương.
- Sprint C Trust Section decisions: Tái cấu trúc grid tính năng niềm tin chính của DeskBoost phản ánh chính xác sản phẩm: `AI Diagnosis` (icon `psychology`), `Plant Profiles` (icon `folder_shared`), `Smart Reminders` (icon `notifications_active`), và `Verified Marketplace` (icon `storefront`); đồng bộ hóa dịch văn bản đa ngôn ngữ vi/en trong locales.
- Sprint C Future Vision decisions: Thêm section lộ trình phát triển định hướng dài hạn ("Future Vision Section") phía trên footer trong Home.jsx, hiển thị các giai đoạn Phase 01–05: `QR Plant Identity`, `Claim Ownership`, `AI Context Memory`, `Weather Integration`, `IoT Monitoring` dưới dạng đường timeline vertical kẻ mảnh với các badge icon tinh tế, tạo độ thuyết phục cao cho EXE201 mà không thay đổi MVP scope.
- Sprint C Social Proof decisions: Thêm section chỉ số ảnh hưởng ("Social Proof Section") với các số liệu demo thống kê hợp lý: `1,250+ AI Diagnoses`, `500+ Managed Plants`, `98.6% Care Reminders Completed`, và `200+ Verified Feedback` dưới dạng 4 card compact tinh tế trước footer.
- Sprint C validation: `cd FE && npm run lint` đạt kết quả sạch lỗi; `cd FE && npm run build` biên dịch thành công 100% không có lỗi.



>>>>>>> Stashed changes
