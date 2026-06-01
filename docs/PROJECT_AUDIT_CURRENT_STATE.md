# DeskBoost - Audit trạng thái hiện tại

Ngày audit: 2026-06-01

Phạm vi audit:

- Frontend: React, Vite, React Router HashRouter, Tailwind.
- Backend: ASP.NET Core, PostgreSQL, JWT.
- Nguồn đọc: route FE, page FE, service FE, controller BE, tài liệu API hiện có.
- Chưa sửa code chức năng trong audit này.
- Chưa chạy smoke test end-to-end với backend/database thật trong lượt audit này. Trạng thái dưới đây chủ yếu dựa trên source thực tế.

## Executive Summary

DeskBoost hiện đã có khung full-stack khá đầy đủ: Auth, Marketplace public, My Plants, Profile, Upload, Reminders, Feedback cơ bản, Admin đọc dữ liệu, AI chat/diagnose và nền QR/Ownership. Tuy nhiên trạng thái tích hợp chưa đồng đều.

Các luồng đã kết nối API thật rõ nhất là Auth login/register/bootstrap, Marketplace list/detail, My Plants CRUD, User Profile, Upload, Reminders CRUD/calendar, Feedback user create/public verified read, và Admin read-only dashboard/users/user-plants/marketplace/AI.

Các vùng còn mock hoặc partial lớn gồm Dashboard user, Home marketplace preview, AI Chat plant context, AI Diagnose, Admin thao tác CRUD/status trên UI, Admin feedback lifecycle, QR Claim, và một số fallback từ `mockData.ts`.

Endpoint `/api/plants` là legacy/dư thừa so với `/api/my-plants`, FE hiện không gọi endpoint này. Route UI `#/plants` vẫn cần giữ vì đó là trang marketplace public và đang gọi `/api/marketplace-plants`.

Các blocker nổi bật: `ForgotPassword` gọi endpoint BE chưa tồn tại, AI diagnose FE/BE lệch contract JSON vs multipart, admin marketplace không có UI create/edit/delete dù BE/service có, admin feedback create/list endpoint chưa có, `CareContext` tạo link sai tới plant profile, và admin marketplace GET đang lọc Active nên admin không thấy hết trạng thái listing.

## Quy ước trạng thái

| Ký hiệu | Ý nghĩa |
| --- | --- |
| ✅ Working | Có route/page/API và source cho thấy luồng chính đã nối đúng. |
| ⚠ Partial | Có một phần hoạt động nhưng còn mock, fallback, thiếu thao tác, hoặc chưa verify end-to-end. |
| ❌ Broken | Source cho thấy đang gọi sai endpoint/contract hoặc route không tồn tại. |
| 🚧 Future | Nền/placeholder có sẵn nhưng chưa phải tính năng hoàn chỉnh. |

---

# PHẦN 1 - ROUTE MAP

Frontend dùng `HashRouter`, vì vậy URL người dùng thường có dạng `#/...`.

## Public

| Route | File page | Mục đích | Trạng thái |
| --- | --- | --- | --- |
| `#/` | `FE/pages/Home.jsx` | Landing/home, giới thiệu DeskBoost, preview marketplace, CTA vào app. | ⚠ Partial - dùng mock `PLANTS` cho preview. |
| `#/plants` | `FE/pages/PlantList.jsx` | Marketplace public, danh sách cây/listing contact-only. | ✅ Working - gọi `/api/marketplace-plants`, có fallback mock. |
| `#/plants/:plantId` | `FE/pages/PlantDetail.jsx` | Chi tiết listing marketplace, contact seller, feedback verified. | ⚠ Partial - gọi API thật, fallback mock; contact URL đang hardcode Zalo/Messenger. |
| `#/login` | `FE/pages/Login.jsx` | Đăng nhập. | ✅ Working - gọi `/api/auth/login`. |
| `#/register` | `FE/pages/Register.jsx` | Đăng ký. | ✅ Working - gọi `/api/auth/register`. |
| `#/forgot-password` | `FE/pages/ForgotPassword.jsx` | Quên mật khẩu. | ❌ Broken - FE gọi `/api/auth/forgot-password`, BE chưa có endpoint. |
| `#/forbidden` | `FE/pages/Forbidden.jsx` | Trang không đủ quyền. | ✅ Working - UI local. |

## User

| Route | File page | Mục đích | Trạng thái |
| --- | --- | --- | --- |
| `#/app/dashboard` | `FE/pages/Dashboard.jsx` | Dashboard người dùng. | ⚠ Partial - UI tĩnh, số liệu/task mock. |
| `#/app/my-plants` | `FE/pages/MyPlants.jsx` | Danh sách cây của user. | ⚠ Partial - gọi `/api/my-plants`, nhưng fallback sang `MY_PLANTS` nếu API lỗi hoặc rỗng. |
| `#/app/my-plants/:id/profile` | `FE/pages/PlantProfile.jsx` | Profile cây user, xem/sửa/xóa/upload ảnh. | ⚠ Partial - gọi API thật, fallback mock; thiếu vài field thật như light/water/nextWatering. |
| `#/app/add-plant` | `FE/pages/AddPlantUser.jsx` | Thêm cây vào My Plants. | ✅ Working - gọi upload và `/api/my-plants`. |
| `#/app/profile` | `FE/pages/UserProfile.jsx` | Profile user, avatar, phone, feedback. | ⚠ Partial - profile/upload/feedback đã nối API; QR claim disabled. |
| `#/app/ai-analysis` | `FE/pages/AIPlantAnalysis.jsx` | Chẩn đoán cây bằng ảnh. | ❌ Broken/Partial - mặc định mock; khi bật API thật có lệch contract với BE. |
| `#/app/ai-chat` | `FE/pages/AIChat.jsx` | Chat AI theo cây. | ⚠ Partial - mặc định mock, chọn cây từ `MY_PLANTS` thay vì API thật. |
| `#/app/settings` | `FE/pages/RemindersSettings.jsx` | Reminder settings + calendar export. | ✅ Working/Partial - CRUD/calendar nối API; phụ thuộc My Plants API. |

## Admin

| Route | File page | Mục đích | Trạng thái |
| --- | --- | --- | --- |
| `#/admin` | `FE/pages/admin/AdminOverview.jsx` | Admin summary. | ✅ Working/Partial - đọc API thật, không mock; chỉ view. |
| `#/admin/overview` | `FE/pages/admin/AdminOverview.jsx` | Alias overview. | ✅ Working/Partial. |
| `#/admin/users` | `FE/pages/admin/AdminUsers.jsx` | Xem danh sách users. | ⚠ Partial - list API thật; chưa có UI update status/detail. |
| `#/admin/plants` | `FE/pages/admin/AdminPlants.jsx` | Xem cây của users. | ⚠ Partial - list API thật; chưa có detail/status UI. |
| `#/admin/marketplace` | `FE/pages/admin/AdminMarketplace.jsx` | Xem marketplace listing và form feedback disabled. | ⚠ Partial - list API thật; chưa có UI CRUD marketplace; feedback admin bị blocked. |
| `#/admin/ai` | `FE/pages/admin/AdminAI.jsx` | Xem AI config/status và dialog history. | ⚠ Partial - đọc API thật; chỉ view. |

---

# PHẦN 2 - PAGE STATUS

| Page | Route | Status | Notes |
| --- | --- | --- | --- |
| Home | `#/` | ⚠ Partial | Dùng `PLANTS` từ `mockData.ts` cho marketplace preview; không gọi API. |
| Marketplace | `#/plants` | ✅ Working | Gọi `getMarketplacePlants()` -> `/api/marketplace-plants`; nếu lỗi/rỗng fallback sang `PRODUCTS`. |
| Marketplace Detail | `#/plants/:plantId` | ⚠ Partial | Gọi `/api/marketplace-plants/{id}` và `/api/feedback/verified`; fallback mock; contact buttons hardcode `deskboost`/`YOUR_ZALO_NUMBER`. |
| Login | `#/login` | ✅ Working | Gọi `/api/auth/login`; lưu token/user qua `AuthContext`. |
| Register | `#/register` | ✅ Working | Gọi `/api/auth/register`. |
| Forgot Password | `#/forgot-password` | ❌ Broken | FE gọi `/api/auth/forgot-password`; BE không có route tương ứng. |
| Forbidden | `#/forbidden` | ✅ Working | UI local. |
| Dashboard | `#/app/dashboard` | ⚠ Partial | Số tổng cây `12`, streak, AI status, tasks đều là UI tĩnh/mock. |
| My Plants | `#/app/my-plants` | ⚠ Partial | Gọi `/api/my-plants`; nếu API lỗi hoặc trả rỗng thì hiển thị `MY_PLANTS`, dễ che lỗi/rỗng thật. |
| Add Plant | `#/app/add-plant` | ✅ Working | Gọi `/api/upload/image` nếu upload file, sau đó `/api/my-plants`. |
| Plant Profile | `#/app/my-plants/:id/profile` | ⚠ Partial | Gọi GET/PUT/DELETE `/api/my-plants/{id}`; fallback mock; UI hiển thị một số field không có trong DTO như `light`, `water`, `nextWatering`. |
| User Profile | `#/app/profile` | ⚠ Partial | Gọi `/api/users/me`, `/api/upload/image`, `/api/feedback`; QR claim CTA disabled. |
| Reminders | `#/app/settings` | ✅ Working/Partial | Gọi reminders API và My Plants API; calendar export có cả backend per-reminder và frontend combined export. |
| AI Chat | `#/app/ai-chat` | ⚠ Partial | Mặc định mock do `VITE_USE_MOCK_AI !== "false"`; cây context lấy từ `MY_PLANTS`, không lấy user plants thật. |
| AI Diagnose | `#/app/ai-analysis` | ❌ Broken/Partial | Mặc định mock; nếu gọi API thật thì FE gửi JSON/base64 trong khi BE cần multipart `Image`. |
| Admin Overview | `#/admin`, `#/admin/overview` | ✅ Working/Partial | Gọi `/api/admin/summary`; không mock fallback; chỉ view. |
| Admin Users | `#/admin/users` | ⚠ Partial | Gọi `/api/admin/users`; service có update status nhưng UI chưa dùng. |
| Admin Plants | `#/admin/plants` | ⚠ Partial | Gọi `/api/admin/user-plants`; service có detail/status nhưng UI chưa dùng. |
| Admin Marketplace | `#/admin/marketplace` | ⚠ Partial | Gọi `/api/admin/marketplace-plants`; BE/service có CRUD nhưng UI chỉ list. Admin feedback create disabled. |
| Admin AI | `#/admin/ai` | ⚠ Partial | Gọi `/api/admin/ai-config/status` và `/api/admin/ai-dialogs`; chỉ view. |

---

# PHẦN 3 - API INVENTORY

Nguồn chính: `BE/DeskBoost/DeskBoost.API/Controllers`.

| Endpoint | Method | Used By FE | Status |
| --- | --- | --- | --- |
| `/api/auth/register` | POST | Login/Register flow | ✅ Connected |
| `/api/auth/login` | POST | Login | ✅ Connected |
| `/api/auth/refresh-token` | POST | Không thấy FE dùng | ❌ Unused |
| `/api/auth/logout` | POST | Không thấy FE dùng; FE logout local-only | ❌ Unused |
| `/api/auth/me` | GET | Auth bootstrap | ✅ Connected |
| `/api/users/me` | GET | UserProfile | ✅ Connected |
| `/api/users/me` | PUT | UserProfile | ✅ Connected |
| `/api/marketplace-plants` | GET | PlantList, AdminMarketplace via admin wrapper query | ✅ Connected |
| `/api/marketplace-plants/{id}` | GET | PlantDetail | ✅ Connected |
| `/api/my-plants` | GET | MyPlants, RemindersSettings | ✅ Connected |
| `/api/my-plants` | POST | AddPlantUser | ✅ Connected |
| `/api/my-plants/{id}` | GET | PlantProfile | ✅ Connected |
| `/api/my-plants/{id}` | PUT | PlantProfile | ✅ Connected |
| `/api/my-plants/{id}` | DELETE | PlantProfile | ✅ Connected |
| `/api/plants` | GET | Không thấy FE dùng | ❌ Unused/legacy |
| `/api/plants` | POST | Không thấy FE dùng | ❌ Unused/legacy |
| `/api/plants/{id}` | GET | Không thấy FE dùng | ❌ Unused/legacy, có rủi ro ownership |
| `/api/plants/{id}` | PUT | Không thấy FE dùng | ❌ Unused/legacy, có rủi ro ownership |
| `/api/plants/{id}` | DELETE | Không thấy FE dùng | ❌ Unused/legacy, có rủi ro ownership |
| `/api/reminders` | GET | RemindersSettings, CareNotificationBell/CareContext | ✅ Connected |
| `/api/reminders` | POST | RemindersSettings | ✅ Connected |
| `/api/reminders/{id}` | PUT | RemindersSettings | ✅ Connected |
| `/api/reminders/{id}/done` | PUT | RemindersSettings, CareNotificationBell | ✅ Connected |
| `/api/reminders/{id}/calendar` | GET | RemindersSettings | ✅ Connected |
| `/api/reminders/{id}/calendar?format=ics` | GET | RemindersSettings | ✅ Connected |
| `/api/reminders/{id}` | DELETE | RemindersSettings | ✅ Connected |
| `/api/upload/image` | POST | AddPlantUser, PlantProfile, UserProfile | ✅ Connected |
| `/api/feedback` | POST | UserProfile feedback form | ✅ Connected |
| `/api/feedback/verified` | GET | PlantDetail | ✅ Connected |
| `/api/feedback/{id}/verify` | PATCH | Không thấy FE dùng | ⚠ Partial - BE có, thiếu admin list/UI |
| `/api/ai/chat` | POST | AIChat nếu mock tắt | ⚠ Partial |
| `/api/ai/diagnose` | POST | AIPlantAnalysis nếu mock tắt | ❌ Contract mismatch |
| `/api/ai/dialogs` | GET | AIChat nếu mock tắt | ⚠ Partial |
| `/api/ai/dialogs/{id}` | GET | Service có, chưa thấy page dùng | ❌ Unused |
| `/api/ai-chat/send` | POST | Không thấy FE dùng | ❌ Unused/legacy |
| `/api/diagnosis` | POST | Không thấy FE dùng | ❌ Unused/legacy |
| `/api/admin/summary` | GET | AdminOverview | ✅ Connected |
| `/api/admin/users` | GET | AdminUsers | ✅ Connected |
| `/api/admin/users/{id}` | GET | Service có, chưa thấy page dùng | ❌ Unused |
| `/api/admin/users/{id}/status` | PUT | Service có, UI chưa dùng | ⚠ Partial |
| `/api/admin/user-plants` | GET | AdminPlants | ✅ Connected |
| `/api/admin/user-plants/{id}` | GET | Service có, UI chưa dùng | ❌ Unused |
| `/api/admin/user-plants/{id}/status` | PUT | Service có, UI chưa dùng | ⚠ Partial |
| `/api/admin/marketplace-plants` | GET | AdminMarketplace | ✅ Connected/Partial |
| `/api/admin/marketplace-plants` | POST | Service có, UI chưa dùng | ⚠ Partial |
| `/api/admin/marketplace-plants/{id}` | PUT | Service có, UI chưa dùng | ⚠ Partial |
| `/api/admin/marketplace-plants/{id}` | DELETE | Service có, UI chưa dùng | ⚠ Partial |
| `/api/admin/ai-dialogs` | GET | AdminAI | ✅ Connected |
| `/api/admin/ai-dialogs/{id}` | GET | Service có, UI chưa dùng | ❌ Unused |
| `/api/admin/ai-config/status` | GET | AdminAI; aiApi fallback status | ✅ Connected |
| `/api/auth/forgot-password` | POST | ForgotPassword FE gọi | ❌ Missing in BE |

---

# PHẦN 4 - FE <-> API MAPPING

## Auth

Used in:

- `FE/context/AuthContext.jsx`
- `FE/pages/Login.jsx`
- `FE/pages/Register.jsx`
- `FE/pages/ForgotPassword.jsx`
- `FE/services/authApi.js`

Mapping:

- `POST /api/auth/login` -> login.
- `POST /api/auth/register` -> register.
- `GET /api/auth/me` -> bootstrap session.
- `POST /api/auth/forgot-password` -> FE gọi nhưng BE chưa có.
- `POST /api/auth/logout` -> BE có nhưng FE logout local-only.
- `POST /api/auth/refresh-token` -> BE có nhưng FE chưa dùng.

Status: ⚠ Partial. Login/register/bootstrap connected; forgot password broken; refresh/logout chưa tích hợp.

## Marketplace

Used in:

- `FE/pages/PlantList.jsx`
- `FE/pages/PlantDetail.jsx`
- `FE/services/plantApi.js`

Mapping:

- `GET /api/marketplace-plants`
- `GET /api/marketplace-plants/{id}`

Status: ✅ Connected. Có fallback mock `PRODUCTS` khi API lỗi/rỗng.

## My Plants

Used in:

- `FE/pages/MyPlants.jsx`
- `FE/pages/AddPlantUser.jsx`
- `FE/pages/PlantProfile.jsx`
- `FE/pages/RemindersSettings.jsx`
- `FE/services/plantApi.js`

Mapping:

- `GET /api/my-plants`
- `POST /api/my-plants`
- `GET /api/my-plants/{id}`
- `PUT /api/my-plants/{id}`
- `DELETE /api/my-plants/{id}`

Status: ✅ Connected/⚠ Partial. CRUD nối đúng API. Vấn đề hiện tại là fallback mock có thể che API lỗi hoặc empty state thật; một số UI field không có trong DTO.

## Profile

Used in:

- `FE/pages/UserProfile.jsx`
- `FE/services/userApi.js`

Mapping:

- `GET /api/users/me`
- `PUT /api/users/me`
- `POST /api/upload/image`
- `POST /api/feedback`

Status: ⚠ Partial. Profile và avatar connected; password/email update chưa hỗ trợ; QR claim disabled.

## Upload

Used in:

- `FE/pages/AddPlantUser.jsx`
- `FE/pages/PlantProfile.jsx`
- `FE/pages/UserProfile.jsx`
- `FE/services/uploadApi.js`

Mapping:

- `POST /api/upload/image` multipart field `file`.

Status: ✅ Connected.

## Reminders

Used in:

- `FE/pages/RemindersSettings.jsx`
- `FE/context/CareContext.jsx`
- `FE/components/CareNotificationBell.jsx`
- `FE/services/reminderApi.js`

Mapping:

- `GET /api/reminders`
- `POST /api/reminders`
- `PUT /api/reminders/{id}`
- `PUT /api/reminders/{id}/done`
- `GET /api/reminders/{id}/calendar`
- `GET /api/reminders/{id}/calendar?format=ics`
- `DELETE /api/reminders/{id}`
- `GET /api/my-plants` for plant options.

Status: ✅ Connected/⚠ Partial. Main CRUD connected. `CareProvider` wraps toàn app nên có thể gọi reminders cả khi user chưa đăng nhập.

## Feedback

Used in:

- `FE/pages/UserProfile.jsx`
- `FE/pages/PlantDetail.jsx`
- `FE/pages/admin/AdminMarketplace.jsx`
- `FE/services/feedbackApi.js`
- `FE/services/adminApi.js`

Mapping:

- `POST /api/feedback` -> user feedback.
- `GET /api/feedback/verified?catalogPlantId=...` -> public verified feedback on PlantDetail.
- `PATCH /api/feedback/{id}/verify` -> BE có nhưng FE chưa dùng.
- `POST /api/admin/feedback`, `GET /api/admin/feedback` -> FE admin đang muốn nhưng BE chưa có.

Status: ⚠ Partial. User submit/public read connected; admin lifecycle blocked.

## Admin

Used in:

- `FE/pages/admin/*`
- `FE/services/adminApi.js`

Mapping:

- Overview: `GET /api/admin/summary`.
- Users: `GET /api/admin/users`.
- User plants: `GET /api/admin/user-plants`.
- Marketplace: `GET /api/admin/marketplace-plants`.
- AI: `GET /api/admin/ai-config/status`, `GET /api/admin/ai-dialogs`.
- Service-only unused: user detail, user status update, user plant detail/status, marketplace create/update/delete, AI dialog detail.

Status: ⚠ Partial. Admin currently mostly read-only UI.

## AI Chat

Used in:

- `FE/pages/AIChat.jsx`
- `FE/services/aiApi.js`

Mapping:

- `POST /api/ai/chat`
- `GET /api/ai/dialogs`
- `GET /api/ai/dialogs/{id}` service-only.

Status: ⚠ Partial. FE mặc định dùng mock fallback trừ khi `VITE_USE_MOCK_AI=false`. Plant context lấy từ `MY_PLANTS`, không lấy `/api/my-plants`.

## AI Diagnose

Used in:

- `FE/pages/AIPlantAnalysis.jsx`
- `FE/services/aiApi.js`

Mapping:

- FE gọi `POST /api/ai/diagnose` qua JSON payload `{ imageBase64, question }`.
- BE `AiController` yêu cầu `multipart/form-data` với field `Image`.

Status: ❌ Broken khi dùng API thật. Hiện bị che bởi mock fallback mặc định.

## Legacy APIs

- `/api/plants`: legacy/dư thừa, FE không dùng.
- `/api/ai-chat/send`: legacy, FE không dùng.
- `/api/diagnosis`: legacy, FE không dùng.

Status: ❌ Unused; cần deprecate/cleanup sau khi xác nhận không có external client.

---

# PHẦN 5 - MOCK DATA AUDIT

| Mock Source | Still Used? | Page | Remove? |
| --- | --- | --- | --- |
| `FE/data/mockData.ts` - `PRODUCTS` | Có | Home, PlantList fallback, PlantDetail fallback | Chưa xóa ngay; chỉ xóa sau khi API + empty state ổn. |
| `FE/data/mockData.ts` - `MY_PLANTS` | Có | MyPlants fallback, PlantProfile fallback, AIChat plant context | Cần giảm dần; AIChat nên chuyển sang `/api/my-plants`. |
| `FE/data/mockData.ts` - `PLANTS` alias | Có | Home | Có thể thay bằng marketplace API hoặc giữ làm fallback preview. |
| `FE/services/aiApi.js` mock dialogs/replies/diagnosis | Có | AIChat, AIPlantAnalysis | Không xóa trước khi AI API contract sửa và verify. |
| `Dashboard.jsx` hardcoded stats/tasks | Có | Dashboard | Nên thay bằng API hoặc data từ reminders/my-plants. |
| `UserProfile.jsx` defaultAvatar external URL | Có | UserProfile | Có thể giữ fallback UI; không phải fake data nghiệp vụ. |
| `PlantList.jsx` fallback to `PRODUCTS` | Có | Marketplace | Nên chuyển sang honest error/empty sau khi API ổn. |
| `PlantDetail.jsx` fallback to first mock product | Có | Marketplace detail | Nên bỏ sau khi API ổn vì có thể hiển thị sai item. |
| `MyPlants.jsx` fallback to `MY_PLANTS` on empty/error | Có | My Plants | Nên bỏ hoặc chỉ fallback trong dev mode. |
| `PlantProfile.jsx` fallback to `MY_PLANTS` | Có | Plant Profile | Nên bỏ hoặc chỉ fallback dev mode. |
| `adminApi.js` `createAdminFeedback` reject placeholder | Có | AdminMarketplace disabled feedback | Giữ đến khi BE có endpoint hoặc xóa UI placeholder. |
| `adminApi.js` `getAdminFeedback` resolve empty placeholder | Có nhưng chưa thấy page dùng | Không cần giữ lâu dài. |
| `localStorage` token/user fallback keys | Có | Auth | Cần giữ trong migration ngắn hạn; cleanup legacy keys sau. |
| `localStorage` theme/language | Có | Theme/i18n | Hợp lệ, không cần xóa. |

---

# PHẦN 6 - FEATURE STATUS

## Auth

- Completed: khoảng 70%.
- FE status: login/register/bootstrap connected; logout local-only; forgot password broken.
- BE status: login/register/me/refresh/logout có; forgot password chưa có.
- Missing pieces: forgot password endpoint, refresh token integration, server logout call từ FE, session expiry UX.

## Marketplace

- Completed: khoảng 75%.
- FE status: list/detail connected; fallback mock; contact-only UX.
- BE status: public marketplace list/detail có; admin CRUD có.
- Missing pieces: admin full listing status visibility, real contact URL behavior, bỏ fallback sai item, marketplace CRUD UI admin.

## My Plants

- Completed: khoảng 80%.
- FE status: list/create/detail/update/delete connected; upload image connected.
- BE status: `/api/my-plants` có ownership-safe filter theo user.
- Missing pieces: bỏ fallback mock, align DTO với UI fields, sửa link reminder/care bell tới profile.

## Profile

- Completed: khoảng 70%.
- FE status: get/update profile, avatar upload, feedback submit connected.
- BE status: users/me GET/PUT có.
- Missing pieces: password/email update, claim entry, refine profile fields.

## Upload

- Completed: khoảng 85%.
- FE status: image validation + multipart upload.
- BE status: `/api/upload/image` có validation + storage.
- Missing pieces: verify Cloudinary/storage runtime, better upload error UX.

## Reminders

- Completed: khoảng 80%.
- FE status: CRUD, mark done, calendar actions connected.
- BE status: reminders CRUD/calendar có.
- Missing pieces: avoid global reminder load on public pages, fix plant profile link path, verify calendar output.

## Feedback

- Completed: khoảng 45%.
- FE status: user feedback create, public verified read; admin form disabled.
- BE status: create, verified list, verify patch có.
- Missing pieces: admin feedback list/create/manual evidence endpoint, UI verify workflow, link feedback to marketplace plant if needed.

## Admin

- Completed: khoảng 55%.
- FE status: real-data read pages; no mock fallback; most actions not exposed.
- BE status: summary/users/user-plants/marketplace/AI endpoints present.
- Missing pieces: status update UI, marketplace create/edit/delete UI, detail views, admin feedback lifecycle.

## AI Chat

- Completed: khoảng 45%.
- FE status: polished UI but default mock; uses mock plants.
- BE status: `/api/ai/chat`, dialogs endpoints present.
- Missing pieces: switch to real my-plants, verify provider config, decide mock env default, dialog detail/history UI.

## AI Diagnose

- Completed: khoảng 30%.
- FE status: upload UI and result UI; default mock.
- BE status: multipart diagnosis endpoint present.
- Missing pieces: fix FE request to multipart, add plant selection/context if needed, end-to-end verify.

## QR / Claim / Ownership

- Completed: khoảng 15%.
- FE status: displays ownership fields if present; claim buttons disabled/future.
- BE status: `Plant` entity has ownership fields; no claim flow endpoints found.
- Missing pieces: create code, validate code, claim code, QR scan/entry UI, admin ownership management.

---

# PHẦN 7 - BUGS & BLOCKERS

| Severity | Area | Description | FE or BE |
| --- | --- | --- | --- |
| HIGH | Forgot Password | FE gọi `/api/auth/forgot-password` nhưng BE không có endpoint. | BE |
| HIGH | AI Diagnose | FE gửi JSON/base64 tới `/api/ai/diagnose`, BE yêu cầu multipart `Image`. | FE/BE contract |
| HIGH | Legacy Plants API | `/api/plants/{id}` không lọc owner theo `UserId`; dù FE không dùng, đây là rủi ro nếu endpoint còn mở cho user có token. | BE |
| HIGH | Admin Marketplace | BE/service có create/edit/delete marketplace nhưng UI admin chỉ xem. | FE |
| HIGH | Admin Marketplace Visibility | `GET /api/admin/marketplace-plants` tái dùng query marketplace public đang lọc `Status == Active`, nên admin không thấy hidden/out-of-stock/inactive. | BE |
| HIGH | Admin Feedback | Không có admin feedback create/list endpoint; UI disabled với `Backend endpoint required`. | BE |
| MEDIUM | Care Navigation | `CareContext` tạo link `/app/my-plants/{id}` trong khi route đúng là `/app/my-plants/{id}/profile`. | FE |
| MEDIUM | Care Provider | `CareProvider` wrap toàn app và có thể gọi `/api/reminders` cả khi chưa login/public route. | FE |
| MEDIUM | MyPlants fallback | `MyPlants` fallback sang mock khi API lỗi hoặc trả empty, có thể che lỗi thật hoặc data rỗng thật. | FE |
| MEDIUM | PlantDetail fallback | Detail fallback sang `PRODUCTS[0]` nếu API lỗi, có nguy cơ hiển thị sai cây. | FE |
| MEDIUM | AI Chat | UI dùng `MY_PLANTS` mock làm plant context, chưa dùng cây thật của user. | FE |
| MEDIUM | Admin Actions | Services update status/detail có nhưng AdminUsers/AdminPlants chưa expose UI thao tác. | FE |
| MEDIUM | Auth Logout | FE logout chỉ clear localStorage, không gọi `/api/auth/logout`. | FE |
| LOW | Docs/API naming | Docs cũ mô tả `/plants` như public catalog, trong source catalog thật là `/marketplace-plants`. | Docs |
| LOW | Hardcoded Contact | PlantDetail contact buttons hardcode Messenger/Zalo thay vì dùng `contactUrl` từ marketplace plant. | FE |

---

# PHẦN 8 - UNUSED / DEAD CODE

## API/service không thấy FE page dùng trực tiếp

| Item | Hiện trạng | Gợi ý cleanup |
| --- | --- | --- |
| `/api/plants` CRUD | FE không gọi; trùng `/api/my-plants`; có rủi ro owner. | Deprecate/xóa hoặc khóa quyền trước. |
| `apiGetPlants`, `apiGetPlantById` aliases | Có trong `plantApi.js`, trỏ marketplace chứ không trỏ `/api/plants`. | Có thể giữ ngắn hạn, cleanup sau. |
| `apiGetMyPlants`, `apiAddMyPlant`, etc. | Backward-compatible aliases. | Cleanup khi chắc chắn không external import. |
| `/api/ai-chat/send` | Legacy controller, FE không dùng. | Deprecate sau khi `/api/ai/chat` ổn. |
| `/api/diagnosis` | Legacy controller, FE không dùng. | Deprecate sau khi `/api/ai/diagnose` ổn. |
| `getMyAiDialog` | Service có, page chưa dùng. | Giữ nếu sắp làm dialog detail; nếu không thì cleanup. |
| `getAiConfigStatus` trong `aiApi.js` | Có, chưa thấy page user dùng. | Có thể xóa hoặc chuyển về admin service only. |
| `getAdminUser`, `updateAdminUserStatus` | Service có, UI chưa dùng. | Không xóa nếu roadmap admin status sắp làm. |
| `getAdminUserPlant`, `updateAdminUserPlantStatus` | Service có, UI chưa dùng. | Không xóa nếu roadmap moderation sắp làm. |
| `create/update/deleteAdminMarketplacePlant` | Service có, UI chưa dùng. | Giữ để làm Admin Marketplace CRUD. |
| `getAdminAiDialog` | Service có, UI chưa dùng. | Giữ nếu làm dialog detail. |
| `getAdminFeedback`, `createAdminFeedback` | Placeholder only, no BE endpoint. | Xóa hoặc thay bằng real endpoint khi BE sẵn sàng. |
| `/api/auth/refresh-token` | BE có, FE không dùng. | Integrate hoặc bỏ khỏi scope MVP. |
| `/api/auth/logout` | BE có, FE không gọi. | Integrate nếu muốn revoke refresh token. |

## Components

Không thấy component lớn nào hoàn toàn dead trong source hiện tại:

- `ChatbotWidget` dùng ở `Home`.
- `FloatingHomeButton`, `ThemeToggle`, `LanguageToggle` dùng ở `App`.
- `CareNotificationBell` dùng trong `Navbar`.
- Shared UI `Button`, `Card`, `Badge`, `UiState` đang được dùng nhiều.

## Routes

- Không thấy route FE không dùng rõ ràng.
- Lưu ý: `#/plants` là route UI marketplace, không liên quan legacy backend `/api/plants`.

---

# PHẦN 9 - FUTURE FEATURES

## QR Claim System

Status: 🚧 Future Only.

Hiện có:

- `Plant` entity có `OwnershipCode`, `OwnershipStatus`, `IsClaimed`.
- FE `PlantProfile`, `PlantDetail`, `UserProfile` có vùng hiển thị/CTA QR ownership.

Missing:

- Endpoint tạo ownership code.
- Endpoint validate code.
- Endpoint claim code.
- UI nhập/scan QR.
- Admin tool quản lý ownership.

## AI Diagnose

Status: ⚠ Partial.

Hiện có:

- FE upload UI và result UI.
- BE `/api/ai/diagnose` multipart endpoint.
- Mock fallback trong `aiApi.js`.

Missing:

- Align contract FE multipart với BE.
- End-to-end verify provider/service.
- Decide default `VITE_USE_MOCK_AI`.

## Admin Feedback Lifecycle

Status: 🚧 Future/Blocked.

Hiện có:

- User feedback create.
- Public verified feedback read.
- BE patch verify endpoint.
- AdminMarketplace có disabled form.

Missing:

- Admin feedback list endpoint.
- Admin manual verified feedback create endpoint.
- Evidence/private note model.
- UI approve/verify/reject.

## Admin CRUD Marketplace

Status: ⚠ Partial.

Hiện có:

- BE CRUD.
- FE service CRUD.
- Admin list UI.

Missing:

- Create form.
- Edit form.
- Delete action.
- Status filter/listing all statuses for admin.

## Real Dashboard Metrics

Status: 🚧 Future.

Missing:

- User dashboard summary API or composition from MyPlants/Reminders/AI.
- Replace hardcoded stats/tasks.

## Password Reset

Status: 🚧 Future/Blocked.

Missing:

- Backend forgot password endpoint.
- Email/token flow or MVP placeholder behavior.

---

# PHẦN 10 - RECOMMENDED ROADMAP

## Priority 1 - Critical bugs/blockers

1. Remove/deprecate or secure `/api/plants` legacy route. At minimum enforce owner filter on detail/update/delete.
2. Fix `ForgotPassword`: either add `/api/auth/forgot-password` BE endpoint or disable/adjust FE page.
3. Fix AI Diagnose contract: FE should send `FormData` with `Image`, or BE should support current JSON/base64 contract.
4. Fix `CareContext` plant profile path from `/app/my-plants/{id}` to `/app/my-plants/{id}/profile`.
5. Prevent `CareProvider` from loading reminders before auth is ready/authenticated.

## Priority 2 - Admin real-data integration

1. Add Admin Marketplace create/edit/delete UI using existing service functions.
2. Fix admin marketplace query to show all statuses, not only Active.
3. Add Admin Users status update UI if status moderation is in MVP.
4. Add Admin User Plants status update/detail UI if plant moderation is in MVP.

## Priority 3 - Feedback lifecycle

1. Decide feedback model: user app feedback vs marketplace verified review.
2. Add admin feedback list/create endpoints or remove disabled admin form.
3. Wire `PATCH /api/feedback/{id}/verify` into an actual admin UI.
4. Ensure verified feedback can be linked to marketplace plant/listing.

## Priority 4 - AI integration

1. Move AI Chat plant selector from `MY_PLANTS` to `/api/my-plants`.
2. Decide mock default behavior for production.
3. Verify `/api/ai/chat` end-to-end.
4. Add dialog detail/history UI only if needed.
5. Verify `/api/ai/diagnose` end-to-end after contract fix.

## Priority 5 - Mock/fallback cleanup

1. Remove or dev-gate fallback mock in MyPlants and PlantProfile.
2. Replace Home marketplace preview with API data or honest static marketing content.
3. Replace Dashboard hardcoded stats/tasks with API-derived data.
4. Remove backward-compatible aliases once no import uses them.

## Priority 6 - QR Claim

1. Define ownership flow and roles.
2. Add claim/validate endpoints.
3. Add UI for claim entry/scan.
4. Add admin ownership review if required.

---

# Top 10 vấn đề cần xử lý tiếp theo

1. `/api/plants` legacy dư thừa và có rủi ro ownership.
2. `ForgotPassword` đang gọi endpoint không tồn tại.
3. AI Diagnose FE/BE lệch contract.
4. `CareContext` link sai plant profile.
5. `CareProvider` gọi reminders ở cấp toàn app, có thể chạy khi chưa auth.
6. Admin Marketplace thiếu UI create/edit/delete.
7. Admin Marketplace API list đang lọc Active, không phù hợp admin.
8. Admin Feedback lifecycle thiếu endpoint list/create.
9. AI Chat vẫn dùng mock plants và mock fallback mặc định.
10. Mock fallback MyPlants/PlantDetail có thể che lỗi hoặc hiển thị sai dữ liệu thật.

# Phân loại nhanh

## FE bug

- `CareContext` link sai profile.
- AI Diagnose gửi sai format so với BE.
- AI Chat dùng `MY_PLANTS` mock.
- Dashboard hardcoded stats/tasks.
- Admin CRUD/status services chưa expose UI.
- Logout không gọi BE.
- Fallback mock che lỗi/rỗng thật.
- PlantDetail contact hardcode thay vì dùng `contactUrl`.

## BE bug / backend blocker

- `/api/plants` legacy thiếu owner filter.
- `/api/auth/forgot-password` chưa tồn tại.
- Admin feedback list/create endpoint chưa tồn tại.
- Admin marketplace list đang lọc Active nếu dùng cho admin.

## Future feature

- QR Claim System.
- Real user dashboard metrics.
- Full admin moderation/detail views.
- AI end-to-end production mode.
- Password reset email/token lifecycle.
