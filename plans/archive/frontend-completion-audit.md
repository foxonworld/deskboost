# DeskBoost MVP – Frontend Completion Audit

> Historical/reference only. Active planning source of truth: [`../README.md`](../README.md).

Status: audit only. No implementation. No backend contract changes. MVP-first.

## Source reviewed

- AgentMemory context for DeskBoost MVP direction, auth, admin, AI, marketplace, responsive fixes.
- `FE/routes/AppRouter.tsx`
- `FE/pages/Dashboard.jsx`
- `FE/pages/MyPlants.jsx`
- `FE/pages/AddPlantUser.jsx`
- `FE/pages/PlantProfile.jsx`
- `FE/pages/AIChat.jsx`
- `FE/pages/AIPlantAnalysis.jsx`
- `FE/pages/PlantList.jsx`
- `FE/pages/Login.jsx`
- `FE/pages/Register.jsx`
- `FE/pages/ForgotPassword.jsx`
- `FE/pages/admin/AdminOverview.jsx`
- `FE/pages/admin/AdminUsers.jsx`
- `FE/pages/admin/AdminPlants.jsx`
- `FE/pages/admin/AdminMarketplace.jsx`
- `FE/pages/admin/AdminAI.jsx`
- `FE/services/api.js`
- `FE/services/authApi.js`
- `FE/services/plantApi.js`
- `FE/services/aiApi.js`
- `FE/services/adminApi.js`
- `FE/components/UserSidebar.jsx`
- `FE/components/AdminLayout.jsx`
- `docs/api-contract.md`
- `docs/frontend-architecture.md`
- `docs/archive/changelog.md`

## Executive summary

Frontend is mostly MVP-shaped and backend-ready at service-contract level for auth, AI Chat, admin, and marketplace guardrails. Biggest incompleteness is not missing features, but inconsistent readiness across pages: some pages are service-driven with loading/error/empty states, while core user plant pages and AI Diagnosis remain mock-only/static. Docs also lag current implementation in frontend architecture.

Primary goal before BE integration: make existing user surfaces consume service layer consistently or clearly label mock-only behavior, normalize validation/states, and update handoff docs. Do not add cart/checkout/payment/orders/shipping. Do not add enterprise admin. Do not broaden AI beyond plant context.

## Prioritized checklist

### Must fix before BE integration

- [ ] Connect user plant pages to `plantApi` service patterns or explicitly isolate mock fallback.
  - Current: `MyPlants`, `PlantProfile`, `AddPlantUser`, `AIChat` read `MY_PLANTS` directly.
  - Risk: BE integration only touches services, but visible user pages remain stale/mock-only.
  - Files: `FE/pages/MyPlants.jsx`, `FE/pages/PlantProfile.jsx`, `FE/pages/AddPlantUser.jsx`, `FE/pages/AIChat.jsx`, `FE/services/plantApi.js`, `FE/data/mockData.ts`.

- [ ] Align AI Diagnosis page with `aiApi.diagnosePlant` or label it as mock-only MVP scan.
  - Current: AI Diagnosis uses local `setTimeout` and hardcoded responses, not `FE/services/aiApi.js`.
  - Risk: `/ai/diagnose` contract exists, but page will not validate BE endpoint.
  - Files: `FE/pages/AIPlantAnalysis.jsx`, `FE/services/aiApi.js`, `docs/api-contract.md`.

- [ ] Add consistent loading/error/empty states to user plant CRUD-ish screens.
  - Current: admin + AI Chat have states; `MyPlants`, `PlantProfile`, `AddPlantUser` mostly static.
  - Risk: backend failures look like frozen/static UI.
  - Files: `FE/pages/MyPlants.jsx`, `FE/pages/PlantProfile.jsx`, `FE/pages/AddPlantUser.jsx`.

- [ ] Add client validation to Add Plant form without expanding fields beyond contract.
  - Current: form inputs are uncontrolled and submit just navigates.
  - Contract fields: `name`, `species`, `location`, `imageUrl`, `notes`.
  - Risk: BE integration receives incomplete payloads or no payload.
  - Files: `FE/pages/AddPlantUser.jsx`, `FE/services/plantApi.js`, `docs/api-contract.md`.

- [ ] Fix docs drift in frontend architecture.
  - Current docs say AI Chat dedicated route/admin dashboard not implemented, but they are implemented.
  - Risk: BE handoff confusion.
  - Files: `docs/frontend-architecture.md`, `docs/archive/changelog.md`, `docs/api-contract.md`.

- [ ] Decide mock fallback visibility standard.
  - Current: AI/admin show fallback note; public marketplace/user plant pages do not.
  - Risk: demo/BE testing cannot tell backend vs mock.
  - Files: `FE/services/aiApi.js`, `FE/services/adminApi.js`, `FE/pages/AIChat.jsx`, admin pages, user plant pages.

- [ ] Harden `api.js` response parsing for non-JSON/empty invalid response.
  - Current: `JSON.parse(text)` can throw raw syntax error on HTML/error pages.
  - Risk: confusing integration failures when ASP.NET returns HTML dev error or empty body.
  - Files: `FE/services/api.js`.

### Should fix before demo

- [ ] Normalize UI copy language and tone.
  - Current: mixed English/Vietnamese and playful sci-fi labels: `Adopt New Comrade`, `Initialize Growth`, `Jungle`, `Bio Scan`.
  - Risk: demo feels less product-complete.
  - Files: `FE/pages/Dashboard.jsx`, `FE/pages/MyPlants.jsx`, `FE/pages/AddPlantUser.jsx`, `FE/pages/PlantProfile.jsx`, `FE/pages/AIPlantAnalysis.jsx`, `FE/pages/AIChat.jsx`.

- [ ] Make dashboard data less hardcoded or clearly demo-derived.
  - Current: `Good morning, Sarah`, total plants `12`, care tasks static.
  - Risk: logged-in user sees unrelated values.
  - Files: `FE/pages/Dashboard.jsx`, `FE/context/AuthContext.jsx`, `FE/data/mockData.ts`.

- [ ] Improve Marketplace backend readiness.
  - Current: `PlantList` uses `PRODUCTS` directly and static pagination buttons.
  - Risk: `/plants` endpoint integration not exercised.
  - Files: `FE/pages/PlantList.jsx`, `FE/pages/PlantDetail.jsx`, `FE/services/plantApi.js`.

- [ ] Validate Forgot Password via service or label optional mock.
  - Current: page local-only; `authApi.forgotPassword` exists.
  - Risk: auth contract not fully tested.
  - Files: `FE/pages/ForgotPassword.jsx`, `FE/services/authApi.js`, `docs/api-contract.md`.

- [ ] Add no-record/search empty states across user pages.
  - Current: `PlantList` has search empty; `MyPlants` always shows Add card but no explicit no-search-results message.
  - Risk: confusing search/filter result.
  - Files: `FE/pages/MyPlants.jsx`, `FE/pages/PlantList.jsx`.

- [ ] Add basic image/file validation to AI Diagnosis upload.
  - Current: accepts image/\* but no size/type error state.
  - Risk: bad uploads before BE integration.
  - Files: `FE/pages/AIPlantAnalysis.jsx`.

- [ ] Make admin status actions explicit as view-only or add minimal status update only if already in contract.
  - Current: services include status update functions, pages only display lists.
  - Risk: admin MVP feels passive; BE implementer may wonder if actions required.
  - Files: `FE/pages/admin/AdminUsers.jsx`, `FE/pages/admin/AdminPlants.jsx`, `FE/services/adminApi.js`, `docs/api-contract.md`.

- [ ] Review mobile spacing after recent drawer fix on all major pages.
  - Current: some pages use `p-8`, large min widths, hardcoded heights.
  - Risk: small screens still overflow/squeeze.
  - Files: `FE/pages/MyPlants.jsx`, `FE/pages/AddPlantUser.jsx`, `FE/pages/AIPlantAnalysis.jsx`, `FE/pages/Dashboard.jsx`, `FE/components/UserSidebar.jsx`, `FE/components/AdminLayout.jsx`.

### Optional polish

- [ ] Extract shared state components: fallback notice, loading block, error alert, empty card.
  - Risk if skipped: duplicated copy/classes, inconsistent UX.
  - Files: `FE/components/` new lightweight components if desired.

- [ ] Add small skeletons instead of text-only loading on admin/user pages.
  - Risk if skipped: acceptable MVP, less polished.
  - Files: admin pages, user plant pages.

- [ ] Add selected-plant route handoff from PlantProfile to AI Chat.
  - Keep within existing AI Chat plant-context scope only.
  - Risk if skipped: extra clicks, not BE-blocking.
  - Files: `FE/pages/PlantProfile.jsx`, `FE/pages/AIChat.jsx`.

- [ ] Clarify marketplace contact URL rendering and external-link safety.
  - Risk if skipped: unclear seller contact in demo.
  - Files: `FE/pages/PlantList.jsx`, `FE/pages/PlantDetail.jsx`, `FE/pages/admin/AdminMarketplace.jsx`.

## Audit categories

### 1. UI/UX consistency issues

- Mixed language/style across user pages.
- Admin pages look consistent and MVP-labeled.
- AI Chat has newest polish; AI Diagnosis uses older richer mock style.
- Dashboard values hardcoded to Sarah/static counts.

### 2. Missing loading states

- Present: AI Chat history/send, admin overview/users/plants/marketplace/AI.
- Missing/weak: Dashboard, MyPlants, PlantProfile, AddPlantUser, PlantList, ForgotPassword, AI Diagnosis backend path.

### 3. Missing error states

- Present: AI Chat, admin pages.
- Missing/weak: MyPlants, PlantProfile, AddPlantUser, PlantList, ForgotPassword, Dashboard.
- `api.js` non-JSON parsing can surface unclear error.

### 4. Missing empty states

- Present: AI Chat no plants/no chat, admin pages, PlantList search empty.
- Weak: MyPlants no backend empty/search empty; PlantProfile not found falls back to first plant, hiding 404.

### 5. Form validation gaps

- Login/Register: basic but OK MVP.
- ForgotPassword: browser required only, no service/loading/error.
- AddPlantUser: uncontrolled, no validation, no API submit.
- AI Diagnosis: no file size/type validation beyond accept attr.
- AI Chat: good input disabled/send state.

### 6. Responsive/mobile risks

- Recent nav drawer fixes reduce biggest risk.
- Remaining: `MyPlants` search min width, `p-8` pages on mobile, AI Diagnosis fixed 520px chat height and 380px upload, large cards.

### 7. Mock/API integration readiness gaps

- Strong: `api.js`, `authApi.js`, `aiApi.js`, `adminApi.js` map contract.
- Gap: user plant/public marketplace pages bypass `plantApi`.
- Gap: AI Diagnosis bypasses `diagnosePlant`.
- Gap: ForgotPassword bypasses `authApi.forgotPassword`.
- Gap: mock fallback behavior is not uniform or centrally documented for all services.

### 8. Admin MVP gaps

- Admin routes/pages exist and stay lightweight.
- Good guardrails: no analytics-heavy dashboard, no key editing, no ecommerce flow.
- Gap: status update functions exist in service but UI does not indicate if updates are intentionally deferred.
- Gap: no detail views used though contract includes detail endpoints; acceptable if documented as Phase 2 optional.

### 9. AI Chat/AI Diagnosis gaps

- AI Chat: plant-context only, selected plant required, service-driven, loading/error/fallback states.
- AI Chat gap: uses `MY_PLANTS` directly rather than `getMyPlants`.
- AI Diagnosis: mock-only local logic, not service-driven despite contract endpoint.
- Scope warning: do not merge AI Diagnosis chat into general chatbot; keep plant-care scope.

### 10. Marketplace contact-only gaps

- Public `PlantList` communicates contact-only and no cart/payment.
- Admin marketplace also says contact-only.
- Gap: public marketplace bypasses service and static pagination.
- Gap: contact action/detail behavior needs audit in `PlantDetail` before demo.

### 11. Code cleanup opportunities

- Remove stale comments/doc text after architecture update.
- Reduce direct imports from `mockData` in pages targeted for BE integration.
- Extract repeated admin loading/error/fallback UI later if duplication grows.
- Normalize old aliases only if still needed; otherwise leave for MVP stability.

### 12. Docs/handoff gaps for backend integration

- `docs/api-contract.md` is mostly current and useful.
- `docs/frontend-architecture.md` is stale: says AI Chat/admin planned/not implemented.
- `docs/archive/changelog.md` current and shows guardrails.
- Need a short BE handoff note: which FE pages are service-driven vs mock-only after fixes.

## Recommended next implementation phase

Phase: Frontend backend-readiness stabilization.

Sequence:

1. Update docs drift first or alongside implementation notes.
2. Make user plant pages service-ready with same fallback/loading/error pattern as admin.
3. Wire Add Plant to `createMyPlant` with MVP validation only.
4. Wire AI Diagnosis to `diagnosePlant` or clearly mark as mock-only until BE chooses `/ai/diagnose` priority.
5. Wire ForgotPassword to `authApi.forgotPassword` with loading/error/success.
6. Make Marketplace list/detail service-ready while preserving contact-only behavior.
7. Polish copy/responsive risks without layout redesign.
8. Run build/lint after code phase.

## Files likely involved

Core routes/layout:

- `FE/routes/AppRouter.tsx`
- `FE/components/UserSidebar.jsx`
- `FE/components/AdminLayout.jsx`
- `FE/components/Navbar.jsx`

User pages:

- `FE/pages/Dashboard.jsx`
- `FE/pages/MyPlants.jsx`
- `FE/pages/AddPlantUser.jsx`
- `FE/pages/PlantProfile.jsx`
- `FE/pages/UserProfile.jsx`
- `FE/pages/RemindersSettings.jsx`

AI:

- `FE/pages/AIChat.jsx`
- `FE/pages/AIPlantAnalysis.jsx`
- `FE/services/aiApi.js`

Auth:

- `FE/pages/Login.jsx`
- `FE/pages/Register.jsx`
- `FE/pages/ForgotPassword.jsx`
- `FE/context/AuthContext.jsx`
- `FE/services/authApi.js`

Marketplace:

- `FE/pages/PlantList.jsx`
- `FE/pages/PlantDetail.jsx`
- `FE/services/plantApi.js`

Admin:

- `FE/pages/admin/AdminOverview.jsx`
- `FE/pages/admin/AdminUsers.jsx`
- `FE/pages/admin/AdminPlants.jsx`
- `FE/pages/admin/AdminMarketplace.jsx`
- `FE/pages/admin/AdminAI.jsx`
- `FE/services/adminApi.js`

Docs:

- `docs/api-contract.md`
- `docs/frontend-architecture.md`
- `docs/archive/changelog.md`
- `plans/backend-plan.md`
- `docs/backend-api-checklist-for-tuan.md`

## Risks if skipped

- Backend says endpoints ready, but FE still shows static mock data.
- Demo user sees hardcoded Sarah/12 plants unrelated to login state.
- AI Diagnosis endpoint remains untested through UI.
- Add Plant appears functional but saves nothing.
- Docs mislead backend developer about routes/pages status.
- Mock fallback masks real backend errors without obvious indicators.
- Mobile drawer fixed, but page-level overflow may still reduce polish.

## Scope creep warnings

Do not add:

- Cart
- Checkout
- Payment
- Orders
- Shipping
- Refunds
- Enterprise admin
- Charts-heavy analytics dashboard
- Admin permissions matrix
- Raw AI API key edit/update UI
- General-purpose chatbot
- Complex conversation memory
- Social login
- Refresh-token/session redesign unless backend already requires it
- Realtime/websocket features

Keep:

- Admin lightweight.
- AI Chat selected-plant context only.
- AI Diagnosis plant health only.
- Marketplace display + contact only.
- Backend contract unchanged.
- MVP-first handoff clarity over new feature breadth.
