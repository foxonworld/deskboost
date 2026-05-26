# DeskBoost Frontend Redesign Implementation Roadmap

> Roadmap triển khai redesign frontend an toàn, tăng dần, tối ưu cho React + Vite + Tailwind + GSAP và workflow Roo/Codex. Tài liệu này bám theo [docs/ui-redesign-plan-vi.md](ui-redesign-plan-vi.md), [docs/motion-system-plan-vi.md](motion-system-plan-vi.md), [docs/design-tokens-vi.md](design-tokens-vi.md), [docs/frontend-architecture.md](frontend-architecture.md), [PROJECT_AI_NOTES.md](../PROJECT_AI_NOTES.md).

## Nguyên tắc phạm vi

- Giữ nguyên backend/API contract hiện có.
- Không đổi routing/auth/service architecture nếu chỉ redesign UI.
- Không thêm cart, checkout, payment, order, shipping.
- Không biến AI thành chatbot tổng quát.
- Không khóa AI bằng QR/Claim.
- Không rebuild admin thành enterprise dashboard.
- Không migration Tailwind CDN sang config thật nếu chưa được duyệt riêng.

---

## 1. Current frontend technical state

### 1.1. Kiến trúc FE hiện tại

| Mảng             | Trạng thái hiện tại                                                                                                                       | Ghi chú triển khai redesign                         |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Framework        | React 19 + Vite 6                                                                                                                         | App SPA, phù hợp rollout theo page/component.       |
| Router           | React Router DOM v7 + `HashRouter` tại [`FE/App.tsx`](../FE/App.tsx)                                                                      | Không đổi route path trong redesign.                |
| Entry            | [`FE/index.tsx`](../FE/index.tsx), [`FE/App.tsx`](../FE/App.tsx), [`FE/routes/AppRouter.tsx`](../FE/routes/AppRouter.tsx)                 | App shell đã có auth/care provider.                 |
| Layout           | Public pages + protected user pages + lightweight admin                                                                                   | Redesign theo từng vùng, không rewrite shell trước. |
| State            | [`FE/context/AuthContext.jsx`](../FE/context/AuthContext.jsx), [`FE/context/CareContext.jsx`](../FE/context/CareContext.jsx), local state | Không thêm state manager.                           |
| API layer        | [`FE/services/api.js`](../FE/services/api.js) + feature services                                                                          | Giữ service contract, chỉ đổi presentation.         |
| UI state helpers | [`FE/components/UiState.jsx`](../FE/components/UiState.jsx)                                                                               | Nên mở rộng dần, không thay toàn bộ cùng lúc.       |
| Motion           | `gsap` + `@gsap/react` đã có trong [`FE/package.json`](../FE/package.json)                                                                | GSAP dùng sau foundation/component ổn định.         |

### 1.2. Styling strategy hiện tại

- Tailwind CDN config nằm trong [`FE/index.html`](../FE/index.html).
- Dark mode dùng class `.dark`.
- Font chính: Manrope.
- Token hiện tại còn ít: primary, background, text, surface.
- Nhiều page dùng Tailwind utility trực tiếp.
- Có hardcoded color/radius/shadow trong component, ví dụ [`FE/components/UiState.jsx`](../FE/components/UiState.jsx).
- Chưa có shared component system hoàn chỉnh cho button/card/form/panel/chat.

### 1.3. Rủi ro hiện tại

| Rủi ro                   | Tác động                          | Cách xử lý trong roadmap                                |
| ------------------------ | --------------------------------- | ------------------------------------------------------- |
| Mixed `.jsx` / `.tsx`    | Type coverage không đều           | Không ép migrate TS trong redesign.                     |
| Tailwind utility tự do   | UI drift nhanh                    | Chuẩn hóa token + class recipe trước.                   |
| Hardcoded colors         | Dark mode lệch, khó maintain      | Cleanup theo vùng/page, không search-replace toàn repo. |
| Card/button lặp lại      | Diff lớn nếu sửa từng page        | Extract khi pattern lặp thật.                           |
| Admin lightweight        | Dễ bị overdesign                  | Admin polish cuối, motion tối thiểu.                    |
| GSAP dùng sớm            | Conflict CSS/transform, perf risk | GSAP sau khi layout ổn.                                 |
| Không có test UI tự động | Visual regression khó bắt         | Build/lint/manual smoke sau mỗi phase.                  |

### 1.4. Inconsistencies hiện tại

- Radius trộn: `rounded-xl`, `rounded-2xl`, `rounded-[28px]`, `rounded-full`.
- Shadow trộn: `shadow-sm`, `shadow-md`, custom colored shadow.
- Color trộn: token Tailwind + hex trực tiếp + slate/green semantic chưa rõ.
- Button CTA nhiều kiểu, chưa có hierarchy ổn định.
- Card Home/Marketplace/My Plants/Dashboard khác grammar.
- Loading/empty copy còn generic.
- User-facing copy trộn tiếng Việt/Anh.
- Mobile nav/sticky/floating elements có nguy cơ che CTA/input.

---

## 2. Redesign implementation philosophy

### 2.1. Incremental over rewrite

Redesign theo chuỗi nhỏ:

1. Foundation tokens/classes.
2. Shared UI primitives.
3. Một page chính.
4. Smoke test.
5. Review consistency.
6. Page tiếp theo.

Không rewrite toàn bộ [`FE/pages`](../FE/pages) trong một PR.

### 2.2. Stabilize foundation first

Foundation cần ổn trước khi page polish:

- Color role.
- Spacing scale.
- Radius scale.
- Shadow/elevation.
- Typography hierarchy.
- Focus/dark/reduced-motion baseline.

Nếu chưa ổn foundation, redesign page sẽ tạo visual chaos.

### 2.3. Avoid visual chaos

- Một page chỉ có một primary CTA rõ.
- Một component family chỉ có một grammar.
- Green là signal, không phải wallpaper.
- Badge/chip chỉ dùng cho status/context thật.
- Motion phải có purpose.

### 2.4. Avoid breaking flows

Giữ nguyên:

- Route path trong [`FE/routes/AppRouter.tsx`](../FE/routes/AppRouter.tsx).
- Service function names trong [`FE/services`](../FE/services).
- Auth/role guard behavior.
- Mock fallback behavior.
- Contact-only marketplace copy/scope.

### 2.5. Motion added last

Thứ tự đúng:

1. Layout ổn.
2. Component ổn.
3. Responsive ổn.
4. Dark mode ổn.
5. Accessibility ổn.
6. CSS micro-interaction.
7. GSAP polish.

---

## 3. Foundation tasks

| Task                               | Mục tiêu                                     | Files/folders likely affected                               | Rủi ro                     | Gợi ý rollout                                   |
| ---------------------------------- | -------------------------------------------- | ----------------------------------------------------------- | -------------------------- | ----------------------------------------------- |
| Semantic token cleanup             | Map màu theo role thay vì random green/slate | [`FE/index.html`](../FE/index.html), shared class constants | Config ảnh hưởng toàn app  | Bắt đầu bằng bổ sung token, chưa rename phá vỡ. |
| Spacing normalization              | Dùng scale 4/8/12/16/24/32/48/64/96          | [`FE/components`](../FE/components), từng page              | Dễ tạo diff lớn            | Chuẩn hóa khi chạm component/page.              |
| Radius normalization               | small/medium/large/hero/pill                 | Shared UI + cards                                           | Page cũ nhìn lệch tạm thời | Extract card/button trước.                      |
| Shadow normalization               | subtle/card/elevated/overlay                 | Cards, panels, sticky CTA                                   | Shadow dark mode vô nghĩa  | Dark dùng border/surface nhiều hơn.             |
| Typography cleanup                 | H1/H2/body/label/caption rõ                  | Pages + UI state                                            | Copy đổi quá nhiều         | Ưu tiên heading/CTA/user-facing.                |
| Dark mode consistency              | Surface/border/text đủ phân tầng             | Global token + components                                   | Contrast lỗi               | Test từng route light/dark.                     |
| Remove hardcoded colors            | Giảm hex/random slate/green                  | Component/page đang sửa                                     | Search-replace nguy hiểm   | Thay theo context, không blanket replace.       |
| Remove inconsistent Tailwind usage | Giảm arbitrary radius/shadow/padding         | Component family                                            | Over-abstraction           | Dùng class recipes trước component nếu nhỏ.     |

### Foundation rules

- Không đổi product behavior trong phase foundation.
- Không thêm dependency.
- Không migration Tailwind build config nếu chưa tách task.
- Không sửa mọi file chỉ để “đẹp code”.
- Ưu tiên class constants/shared components có ROI cao.

---

## 4. Shared UI foundation

### 4.1. Recommended extraction order

| Thứ tự | Component/system         | Vì sao trước/sau                                  | Candidate files                                                          |
| ------ | ------------------------ | ------------------------------------------------- | ------------------------------------------------------------------------ |
| 1      | UI state system          | Loading/empty/error dùng rộng, ít phụ thuộc       | [`FE/components/UiState.jsx`](../FE/components/UiState.jsx)              |
| 2      | Button system            | CTA xuất hiện mọi page, ảnh hưởng consistency lớn | [`FE/components`](../FE/components)                                      |
| 3      | Badge/chip system        | Marketplace, AI context, admin status             | [`FE/components`](../FE/components)                                      |
| 4      | Card base system         | Product/plant/insight/feedback/admin reuse        | [`FE/components`](../FE/components)                                      |
| 5      | Form system              | Auth, profile, add plant, admin                   | [`FE/components`](../FE/components), form pages                          |
| 6      | Modal/panel/sheet system | Mobile AI selector/contact panel/future claim     | [`FE/components`](../FE/components)                                      |
| 7      | AI chat message system   | AIChat riêng, cần page context rõ                 | [`FE/pages/AIChat.jsx`](../FE/pages/AIChat.jsx), future shared component |

### 4.2. Dependency relationships

```text
Tokens/classes
→ UI state + Button + Badge/Chip
→ Card + Form
→ Panel/Modal
→ ProductCard / PlantCareCard / InsightCard / FeedbackCard
→ AIMessageBubble / AIContextSelector
→ Page rollout
→ GSAP polish
```

### 4.3. Component scope strategy

| Component       | Extract khi                                    | Không extract khi                        |
| --------------- | ---------------------------------------------- | ---------------------------------------- |
| Button          | Có >= 3 page dùng cùng variant                 | Chỉ 1 page cần style riêng.              |
| Card base       | Card families chia chung padding/radius/border | Card layout khác hoàn toàn.              |
| ProductCard     | Home + Marketplace cùng product grammar        | Marketplace đang thay đổi dữ liệu nhiều. |
| FormControl     | Login/Register/Profile/AddPlant/Admin form lặp | Field behavior đặc biệt chưa rõ.         |
| Panel/Sheet     | Mobile selector/contact/admin detail lặp       | Chỉ dùng một modal đơn giản.             |
| AIMessageBubble | AIChat và future widget cùng cần               | AI flow chưa ổn định.                    |

### 4.4. Migration strategy

1. Tạo primitive nhỏ, không ép page migrate ngay.
2. Migrate page đầu tiên để chứng minh pattern.
3. Review props/style API.
4. Migrate page tiếp theo.
5. Chỉ xóa class cũ khi không còn dùng.
6. Không đổi data shape/API khi migrate UI.

---

## 5. Page-by-page rollout strategy

| Order | Page/khu vực      | Priority   | Risk            | Complexity     | Motion level             |
| ----- | ----------------- | ---------- | --------------- | -------------- | ------------------------ |
| 1     | Home              | Rất cao    | Trung bình      | Trung bình     | CSS trước, GSAP nhẹ sau  |
| 2     | Marketplace       | Rất cao    | Trung bình      | Trung bình-cao | CSS + reveal nhẹ         |
| 3     | Plant Detail      | Rất cao    | Cao             | Cao            | Tối thiểu trước, CTA rõ  |
| 4     | Dashboard         | Cao        | Trung bình      | Trung bình     | CSS-only                 |
| 5     | AI Chat           | Cao        | Cao             | Cao            | GSAP message sau         |
| 6     | AI Plant Analysis | Cao        | Cao             | Trung bình-cao | Upload/result polish sau |
| 7     | Mobile navigation | Cao        | Cao             | Trung bình     | Panel/nav transition nhẹ |
| 8     | Admin pages       | Trung bình | Thấp-trung bình | Trung bình     | Minimal                  |

### 5.1. Home

| Mục                    | Nội dung                                                                                                                                |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Redesign goals         | Chuyển first impression sang premium AI-assisted desk plant care SaaS.                                                                  |
| Priority               | Rất cao.                                                                                                                                |
| Risk                   | Trung bình: public first impression, nhưng ít API risk.                                                                                 |
| Complexity             | Trung bình.                                                                                                                             |
| Suggested phases       | 1) Hero narrative + CTA. 2) Workflow/problem-solution sections. 3) Product/feedback preview. 4) Responsive/dark pass. 5) Motion polish. |
| Suggested motion level | Ban đầu CSS-only hover/fade. Sau ổn layout: GSAP hero stagger ngắn.                                                                     |

### 5.2. Marketplace

| Mục                    | Nội dung                                                                                                                    |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Redesign goals         | Browse nhanh, card premium, contact-only rõ, không Shopee/ecommerce.                                                        |
| Priority               | Rất cao.                                                                                                                    |
| Risk                   | Trung bình: filter/search/card behavior dễ regress.                                                                         |
| Complexity             | Trung bình-cao.                                                                                                             |
| Suggested phases       | 1) Header/contact-only banner. 2) Filter compact. 3) ProductCard grammar. 4) Loading/empty/error states. 5) Mobile density. |
| Suggested motion level | CSS for hover/filter. GSAP/card reveal chỉ sau filter ổn.                                                                   |

### 5.3. Plant Detail

| Mục                    | Nội dung                                                                                                                                                         |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Redesign goals         | Contact-first decision page: care fit, trust, feedback, rõ không thanh toán trong app.                                                                           |
| Priority               | Rất cao.                                                                                                                                                         |
| Risk                   | Cao: nhiều block, CTA, route param, service state.                                                                                                               |
| Complexity             | Cao.                                                                                                                                                             |
| Suggested phases       | 1) Information architecture. 2) Contact panel. 3) Care metrics/cards. 4) Feedback trust section. 5) Mobile sticky CTA. 6) Remove/rename ecommerce-like sections. |
| Suggested motion level | Minimal. Ưu tiên sticky CTA rõ; image/gallery transition sau.                                                                                                    |

### 5.4. Dashboard

| Mục                    | Nội dung                                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Redesign goals         | Care command center gọn, đáng tin, ít template/fake metric.                                                              |
| Priority               | Cao.                                                                                                                     |
| Risk                   | Trung bình: protected route + user/care data.                                                                            |
| Complexity             | Trung bình.                                                                                                              |
| Suggested phases       | 1) Copy/data fallback cleanup. 2) Actionable cards. 3) Care reminders summary. 4) AI insight card. 5) Responsive polish. |
| Suggested motion level | CSS-only; no GSAP mặc định.                                                                                              |

### 5.5. AI Chat

| Mục                    | Nội dung                                                                                                                                                    |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Redesign goals         | Plant-context assistant calm, trustworthy, message state rõ.                                                                                                |
| Priority               | Cao.                                                                                                                                                        |
| Risk                   | Cao: chat state, loading/error, selected plant, mobile input.                                                                                               |
| Complexity             | Cao.                                                                                                                                                        |
| Suggested phases       | 1) Extract message bubble. 2) Context chip/plant selector. 3) Thinking/loading state. 4) Empty prompts. 5) Mobile selector sheet. 6) Message append motion. |
| Suggested motion level | CSS first; GSAP only for message append/thinking after UX stable.                                                                                           |

### 5.6. AI Plant Analysis

| Mục                    | Nội dung                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------ |
| Redesign goals         | Upload/analyzing/result flow tin cậy, không chỉ spinner.                                         |
| Priority               | Cao.                                                                                             |
| Risk                   | Cao: file upload/preview/result states.                                                          |
| Complexity             | Trung bình-cao.                                                                                  |
| Suggested phases       | 1) Upload area. 2) Preview/remove. 3) Analyzing state. 4) Result reveal. 5) Error/fallback copy. |
| Suggested motion level | CSS for drag/focus; GSAP result reveal sau.                                                      |

### 5.7. Mobile navigation

| Mục                    | Nội dung                                                                                                                                                         |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Redesign goals         | Một mobile nav pattern rõ, không che CTA/input.                                                                                                                  |
| Priority               | Cao.                                                                                                                                                             |
| Risk                   | Cao: ảnh hưởng toàn protected app/mobile.                                                                                                                        |
| Complexity             | Trung bình.                                                                                                                                                      |
| Suggested phases       | 1) Audit current Navbar/UserSidebar/FloatingHomeButton/ThemeToggle overlap. 2) Chọn bottom nav hoặc sheet. 3) Safe-area padding. 4) Smoke all app routes mobile. |
| Suggested motion level | Panel open/close 180–240ms; không animate core nav mạnh.                                                                                                         |

### 5.8. Admin pages

| Mục                    | Nội dung                                                                                                                |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Redesign goals         | Lightweight admin: rõ, nhanh, compact, không enterprise dashboard.                                                      |
| Priority               | Trung bình.                                                                                                             |
| Risk                   | Thấp-trung bình: role guard + mock fallback.                                                                            |
| Complexity             | Trung bình.                                                                                                             |
| Suggested phases       | 1) Shared admin header/status. 2) Table/card density. 3) Empty/error/loading. 4) Mobile admin cards. 5) Dark mode pass. |
| Suggested motion level | Minimal: row hover, skeleton fade. No GSAP.                                                                             |

---

## 6. GSAP rollout strategy

### 6.1. Khi nào bắt đầu GSAP

Chỉ bắt đầu GSAP khi:

- Token/component foundation đã ổn.
- Page layout/responsive không còn đổi lớn.
- CSS hover/focus/active đã chuẩn hóa.
- Reduced-motion rule đã xác định.
- Animation owner rõ: CSS hay GSAP.

### 6.2. CSS-only nên giữ

| Khu vực                   | Lý do                         |
| ------------------------- | ----------------------------- |
| Button hover/active/focus | Direct interaction, CSS đủ.   |
| Card image zoom hover     | Đơn giản, không cần timeline. |
| Filter chip active        | State feedback nhỏ.           |
| Skeleton shimmer          | CSS ổn, không cần GSAP.       |
| Form focus/error          | Accessibility priority.       |
| Admin row hover           | Density/stability.            |

### 6.3. Safe first animations

| Animation                           | Owner         | Điều kiện                                  |
| ----------------------------------- | ------------- | ------------------------------------------ |
| Home hero entry                     | GSAP          | Layout finalized, reduced-motion fallback. |
| Feature/card reveal once            | CSS/GSAP nhẹ  | Không replay khi state nhỏ đổi.            |
| Marketplace content fade after load | CSS/GSAP nhẹ  | Không animate mỗi keystroke.               |
| AI message append                   | GSAP          | Message list stable, no replay history.    |
| Mobile panel open/close             | CSS hoặc GSAP | Focus/escape behavior ưu tiên.             |

### 6.4. Risky animation areas

- Chat history replay.
- Marketplace grid lớn khi filter/search live.
- Plant Detail sticky CTA trong parent có transform.
- Mobile nav/sheet che input.
- Upload preview/result thay đổi layout lớn.
- ScrollTrigger/pin sections.
- Infinite glow/pulse around AI.

### 6.5. Performance precautions

- Animate only `transform`/`opacity`.
- Không animate `width`, `height`, `top`, `left`, `margin`, `padding`.
- Dùng `useGSAP` + scoped ref.
- Dùng `contextSafe` cho event animation.
- Không global selector như `.card`, `.button`.
- Không tạo timeline mỗi render.
- Tôn trọng `prefers-reduced-motion`.
- Test mobile scroll list sau khi thêm motion.

---

## 7. Refactor safety rules

- Không massive rewrites.
- Không đổi backend/API contracts.
- Không đổi routing structure.
- Không đổi feature behavior trong PR visual.
- Không đổi auth/admin guard nếu không thuộc task.
- Không đổi service layer trừ khi UI cần state already exposed.
- Không sửa quá nhiều files một lần.
- Mỗi phase nên có diff nhỏ, reviewable.
- Test sau mỗi phase.
- Nếu phải đổi shared component, migrate một consumer trước.
- Nếu page đang có bug ngoài scope, note lại, không sửa kèm redesign trừ khi blocking.

---

## 8. Validation workflow

### 8.1. Build validation

- Chạy `cd FE && npm run build` sau mỗi phase có đổi UI rộng.
- Build pass là minimum gate trước merge.

### 8.2. Lint/type validation

- Chạy `cd FE && npm run lint`.
- Hiện script lint là `tsc --noEmit` trong [`FE/package.json`](../FE/package.json), không phải ESLint.

### 8.3. Responsive testing

Manual smoke viewport:

| Viewport  | Check                                        |
| --------- | -------------------------------------------- |
| 375px     | Mobile narrow, nav/CTA/input không che nhau. |
| 390–430px | Common mobile.                               |
| 768px     | Tablet layout không lỡ cỡ.                   |
| 1024px    | Small desktop/tablet landscape.              |
| 1440px    | Desktop spacing/max-width.                   |

### 8.4. Dark mode testing

- Toggle `.dark` bằng [`FE/components/ThemeToggle.tsx`](../FE/components/ThemeToggle.tsx).
- Check background/surface/elevated/border/text phân tầng.
- Check green accent không neon.
- Check metadata vẫn readable.

### 8.5. Reduced-motion testing

- Bật `prefers-reduced-motion` trong browser/devtools.
- Verify no loop/pulse/large transform.
- State cuối vẫn rõ.
- AI loading vẫn hiểu được bằng text/static indicator.

### 8.6. Animation testing

- Route change không leak animation.
- Dev StrictMode không duplicate timeline.
- Animation không replay vô lý khi typing/filtering.
- Keyboard focus không bị chặn.
- Mobile scroll không lag.

### 8.7. Mobile testing

Smoke các flow:

- Home CTA.
- Marketplace search/filter/card click.
- Plant Detail sticky contact CTA.
- Login/protected redirect.
- Dashboard cards.
- AI Chat input/keyboard.
- AI Plant Analysis upload/preview.
- Admin guard + admin pages nếu account admin/mock có sẵn.

---

## 9. AI-assisted development workflow

### 9.1. Roo mode mapping

| Task type                          | Mode/profile nên dùng        | Output mong muốn                     |
| ---------------------------------- | ---------------------------- | ------------------------------------ |
| Scope/phase planning               | Architect / Architect Lite   | Plan nhỏ, trade-off, no code.        |
| Token/component design before edit | Architect Lite               | Component contract + affected files. |
| UI implementation                  | Code / FE Implementer        | Minimal diff implementation.         |
| Motion implementation              | Code / FE Implementer        | Scoped GSAP/CSS, reduced-motion.     |
| Runtime bug/regression             | Debugger                     | Root cause + focused fix.            |
| Post-change review                 | FE Reviewer / Review profile | Findings by severity.                |
| Large cross-page rollout           | Orchestrator                 | Split subtasks, avoid giant diff.    |

### 9.2. Architect tasks

Use Architect/Architect Lite cho:

- Chọn phase scope.
- Xác định component extraction boundary.
- Quyết định CSS vs GSAP owner.
- Chọn mobile nav pattern.
- Quyết định có đổi Tailwind config hay không.
- Review API/routing risk trước khi đổi UI flow.

### 9.3. Code mode tasks

Use Code/FE Implementer cho:

- Tạo/cập nhật shared components.
- Migrate một page sang component mới.
- Cleanup hardcoded color trong phạm vi nhỏ.
- Implement responsive fix.
- Implement GSAP animation đã được plan.
- Chạy lint/build/manual smoke notes.

### 9.4. Review profile usage

Use FE Reviewer sau:

- Mỗi shared component mới.
- Mỗi page redesign lớn.
- Trước khi merge phase.
- Sau khi thêm GSAP.
- Khi diff đụng navigation/auth/admin protected layout.

### 9.5. Safe commit strategy

- Một commit = một intent.
- Không trộn foundation + page redesign + motion cùng commit.
- Commit message gợi ý:
  - `docs: add frontend redesign implementation roadmap`
  - `feat(ui): add shared button styles`
  - `refactor(ui): normalize product card spacing`
  - `feat(home): redesign hero section`
  - `feat(motion): add home hero gsap timeline`

### 9.6. Suggested branch strategy

| Branch                   | Scope                            |
| ------------------------ | -------------------------------- |
| `redesign/foundation`    | Tokens/classes/UI state/buttons. |
| `redesign/home`          | Home only after foundation.      |
| `redesign/marketplace`   | Marketplace card/filter.         |
| `redesign/plant-detail`  | Detail/contact/mobile CTA.       |
| `redesign/ai-experience` | AI Chat + AI Analysis.           |
| `redesign/motion-polish` | GSAP after page layouts stable.  |
| `redesign/admin-polish`  | Admin consistency pass.          |

---

## 10. Suggested implementation phases

### Phase 1 — Foundation cleanup

| Mục                  | Nội dung                                                                                                                                                                |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Goals                | Chuẩn hóa token/style grammar đủ để page redesign không drift.                                                                                                          |
| Likely files/folders | [`FE/index.html`](../FE/index.html), [`FE/components/UiState.jsx`](../FE/components/UiState.jsx), [`FE/components`](../FE/components), selected pages only when needed. |
| Risks                | Config global ảnh hưởng toàn app; hardcoded cleanup dễ diff lớn; dark mode contrast lỗi.                                                                                |

Validation checklist:

- [ ] `cd FE && npm run lint` pass.
- [ ] `cd FE && npm run build` pass.
- [ ] Light/dark smoke Home + Marketplace + Dashboard.
- [ ] Không đổi route/API/service behavior.
- [ ] Không thêm dependency.

### Phase 2 — Shared components

| Mục                  | Nội dung                                                                                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Goals                | Tạo foundation reusable cho Button, Card, Badge/Chip, Form, Panel, Loading/Empty.                                                                            |
| Likely files/folders | [`FE/components`](../FE/components), [`FE/components/UiState.jsx`](../FE/components/UiState.jsx), maybe new files under [`FE/components`](../FE/components). |
| Risks                | Over-abstraction; props quá phức tạp; migration nửa vời gây inconsistent UI.                                                                                 |

Validation checklist:

- [ ] Mỗi component có consumer thật.
- [ ] Props tối thiểu, dễ hiểu.
- [ ] Focus/disabled/loading states rõ.
- [ ] Dark mode pass cho component.
- [ ] One-page migration smoke pass.

### Phase 3 — Home redesign

| Mục                  | Nội dung                                                                                                                      |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Goals                | First impression premium, AI plant care narrative, contact-only marketplace preview.                                          |
| Likely files/folders | [`FE/pages/Home.jsx`](../FE/pages/Home.jsx), [`FE/components/Navbar.jsx`](../FE/components/Navbar.jsx), shared cards/buttons. |
| Risks                | Hero quá flashy; copy lệch sang ecommerce; mobile section quá dài.                                                            |

Validation checklist:

- [ ] CTA chính rõ trong 3 giây.
- [ ] Không tạo kỳ vọng checkout/payment.
- [ ] 375px/768px/1440px smoke.
- [ ] Dark mode hero/sections pass.
- [ ] Motion chưa thêm hoặc reduced-motion ready nếu có.

### Phase 4 — Marketplace redesign

| Mục                  | Nội dung                                                                                                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Goals                | Product browsing nhanh, contact-only clarity, ProductCard system.                                                                                                                     |
| Likely files/folders | [`FE/pages/PlantList.jsx`](../FE/pages/PlantList.jsx), shared ProductCard/Badge/Button, [`FE/services/plantApi.js`](../FE/services/plantApi.js) only if reading state already exists. |
| Risks                | Filter/search regression; card too dense; repeated contact note noise.                                                                                                                |

Validation checklist:

- [ ] Search/filter/sort behavior unchanged.
- [ ] Loading/empty/error contextual.
- [ ] Product card responsive 1/2/3+ columns.
- [ ] Contact-only banner/copy clear.
- [ ] No cart/checkout UI.

### Phase 5 — Plant detail redesign

| Mục                  | Nội dung                                                                                      |
| -------------------- | --------------------------------------------------------------------------------------------- |
| Goals                | Contact-first detail, care fit, trust feedback, mobile sticky CTA.                            |
| Likely files/folders | [`FE/pages/PlantDetail.jsx`](../FE/pages/PlantDetail.jsx), shared cards/buttons/badges/panel. |
| Risks                | High: route data, CTA, mobile sticky, ecommerce drift.                                        |

Validation checklist:

- [ ] `/plants/:plantId` load/skeleton/error/empty pass.
- [ ] Contact CTA visible desktop/mobile.
- [ ] Sticky CTA không che footer/content/input.
- [ ] Ecommerce-like copy removed/renamed safely.
- [ ] Feedback trust section readable.

### Phase 6 — AI experience redesign

| Mục                  | Nội dung                                                                                                                                                                                                                |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Goals                | AI Chat + AI Plant Analysis có context, trust, loading/result states tốt.                                                                                                                                               |
| Likely files/folders | [`FE/pages/AIChat.jsx`](../FE/pages/AIChat.jsx), [`FE/pages/AIPlantAnalysis.jsx`](../FE/pages/AIPlantAnalysis.jsx), [`FE/services/aiApi.js`](../FE/services/aiApi.js) only if no contract change, shared AI components. |
| Risks                | Chat state regression; upload flow regression; keyboard/mobile input issues.                                                                                                                                            |

Validation checklist:

- [ ] AI Chat selected plant flow unchanged.
- [ ] Message send/loading/error pass.
- [ ] Empty prompt suggestions helpful.
- [ ] Upload/preview/analyzing/result/error pass.
- [ ] Mobile keyboard không che input/send.

### Phase 7 — GSAP motion polish

| Mục                  | Nội dung                                                                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Goals                | Motion premium nhưng subtle: Home hero, selected card reveal, AI message append.                                                                  |
| Likely files/folders | Pages already redesigned, possible motion helper under [`FE/utils`](../FE/utils) or [`FE/components`](../FE/components) only if pattern repeated. |
| Risks                | CSS/GSAP transform conflict; timeline leak; replay; mobile perf.                                                                                  |

Validation checklist:

- [ ] `useGSAP` scoped ref.
- [ ] `prefers-reduced-motion` fallback.
- [ ] No global selectors.
- [ ] No layout property animation.
- [ ] No replay every render.
- [ ] Mobile scroll/input performance OK.

### Phase 8 — Future QR/Claim UI

| Mục                  | Nội dung                                                                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Goals                | Chuẩn bị UI future cho claim by code/QR, claimed badge, plant identity card, không implement backend nếu chưa scope.                                                     |
| Likely files/folders | Future docs first; later maybe [`FE/pages`](../FE/pages), [`FE/components`](../FE/components), [`FE/services`](../FE/services) only after backend/API contract approved. |
| Risks                | Scope creep: scanner, anti-fraud, ownership ecosystem, AI gating.                                                                                                        |

Validation checklist:

- [ ] Chỉ prototype/doc nếu chưa có approval.
- [ ] Không khóa AI với unclaimed plants.
- [ ] My Plants vẫn free-add.
- [ ] Không thêm scanner/NFC/anti-fraud architecture.
- [ ] Claim success state understandable without animation.

---

## 11. Anti-patterns during implementation

| Anti-pattern                                | Vì sao hại                       | Cách tránh                                   |
| ------------------------------------------- | -------------------------------- | -------------------------------------------- |
| Redesigning everything at once              | Diff lớn, khó review, dễ regress | Phase nhỏ theo page/component.               |
| Mixing old/new tokens tùy tiện              | UI giống nhiều sản phẩm ghép lại | Token/component migration có thứ tự.         |
| Inconsistent motion                         | Mất premium, gây rối             | Motion purpose gate + token duration/easing. |
| Overusing GSAP                              | Perf/debug risk                  | CSS trước, GSAP cho sequencing thật.         |
| Giant diff PRs                              | Review kém, rollback khó         | Một branch/commit một intent.                |
| Breaking mobile while polishing desktop     | User flow hỏng                   | Mobile smoke bắt buộc mỗi phase.             |
| Premature abstractions                      | Component khó dùng, props phình  | Extract sau khi pattern lặp thật.            |
| Random hardcoded colors                     | Dark mode/brand drift            | Semantic role.                               |
| Ecommerce drift                             | Lệch MVP contact-only            | Copy/layout contact-first.                   |
| Flashy admin                                | Giảm trust, sai scope            | Admin compact/utilitarian.                   |
| TypeScript migration kèm redesign           | Scope phình                      | Tách migration riêng nếu cần.                |
| Tailwind config migration kèm page redesign | Global risk                      | Tách architectural task, confirm trước.      |

---

## 12. Final implementation checklist

### 12.1. Product scope

- [ ] Marketplace vẫn contact-only.
- [ ] Không có cart/checkout/payment/order/shipping UX.
- [ ] AI vẫn plant-care/contextual, không chatbot tổng quát.
- [ ] AI không bị khóa bởi QR/Claim.
- [ ] My Plants vẫn free-add.
- [ ] Admin vẫn lightweight.
- [ ] Verified feedback giữ tone manual/trust-first.

### 12.2. Architecture safety

- [ ] Route paths trong [`FE/routes/AppRouter.tsx`](../FE/routes/AppRouter.tsx) không bị đổi ngoài scope.
- [ ] Service API contracts trong [`FE/services`](../FE/services) được giữ.
- [ ] Auth/admin guard behavior không regress.
- [ ] Không dependency mới nếu chưa duyệt.
- [ ] Không broad rewrite app shell.
- [ ] Không migration Tailwind config ngoài plan riêng.

### 12.3. Visual consistency

- [ ] Semantic color roles nhất quán.
- [ ] Không còn hardcoded random green/hex trong khu vực redesigned.
- [ ] Spacing theo scale.
- [ ] Radius theo semantic family.
- [ ] Shadow/elevation subtle.
- [ ] Typography readable, ít `font-black`/all-caps.
- [ ] Button/card/form/badge/chip grammar thống nhất.

### 12.4. UX states

- [ ] Loading states theo ngữ cảnh.
- [ ] Empty states có title/description/action phù hợp.
- [ ] Error states rõ, không panic.
- [ ] AI thinking state rõ.
- [ ] Upload analyzing/result states rõ.
- [ ] Contact CTA rõ trên Marketplace/Plant Detail.

### 12.5. Responsive/mobile

- [ ] Home responsive 375px → desktop.
- [ ] Marketplace filter/card không quá dày mobile.
- [ ] Plant Detail sticky CTA không che content.
- [ ] AI Chat mobile input không bị keyboard/nav che.
- [ ] Mobile nav chỉ có một primary pattern.
- [ ] Admin mobile card/table fallback usable.

### 12.6. Accessibility

- [ ] Focus visible cho button/link/input/chip.
- [ ] Touch target chính >= 44px.
- [ ] Status không chỉ truyền bằng màu.
- [ ] Contrast light/dark đủ.
- [ ] Modal/sheet có close/focus behavior hợp lý.
- [ ] Reduced motion fallback đầy đủ.

### 12.7. Motion

- [ ] Motion có purpose rõ.
- [ ] CSS/GSAP ownership không conflict.
- [ ] GSAP dùng scoped ref + `useGSAP`.
- [ ] Không global selector.
- [ ] Không replay animation vô lý.
- [ ] Không animate layout properties.
- [ ] Mobile performance ổn.

### 12.8. Verification

- [ ] `cd FE && npm run lint` pass.
- [ ] `cd FE && npm run build` pass.
- [ ] Manual smoke public routes pass.
- [ ] Manual smoke protected user routes pass.
- [ ] Manual smoke admin routes/guard pass.
- [ ] Light/dark pass.
- [ ] Reduced-motion pass.
- [ ] Notes/trade-offs documented in PR/phase summary.

---

## Kết luận triển khai

Roadmap tối ưu là: foundation nhỏ → shared components có consumer thật → Home → Marketplace → Plant Detail → AI experience → GSAP polish → QR/Claim future. DeskBoost nên thắng bằng consistency, clarity, trust, mobile usability; không bằng rewrite lớn hoặc animation nhiều.
