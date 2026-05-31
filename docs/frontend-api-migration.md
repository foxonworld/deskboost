# DeskBoost Frontend API Migration

## Phase 1 - Auth, Marketplace, MyPlants

Status: implemented for the existing React/Vite frontend. Scope intentionally excludes Reminders, AI, Upload, Feedback, and Admin.

## Files Changed

- `FE/services/api.js`
- `FE/services/authApi.js`
- `FE/context/AuthContext.jsx`
- `FE/services/plantApi.js`
- `FE/pages/PlantList.jsx`
- `FE/pages/PlantDetail.jsx`
- `FE/pages/AddPlantUser.jsx`
- `FE/pages/PlantProfile.jsx`
- `docs/frontend-api-migration.md`
- `PROJECT_AI_NOTES.md`

## Endpoint Mappings

| Frontend area | Backend endpoint |
| --- | --- |
| Login | `POST /api/auth/login` |
| Register | `POST /api/auth/register` |
| Auth bootstrap | `GET /api/auth/me` |
| Marketplace list | `GET /api/marketplace-plants` |
| Marketplace detail | `GET /api/marketplace-plants/{id}` |
| MyPlants list | `GET /api/my-plants` |
| MyPlant create | `POST /api/my-plants` |
| MyPlant detail | `GET /api/my-plants/{id}` |
| MyPlant update | `PUT /api/my-plants/{id}` |
| MyPlant delete | `DELETE /api/my-plants/{id}` |

`VITE_API_URL` is the primary API base URL. If it is missing, the app falls back to same-origin `/api`. Local verification should provide `VITE_API_URL=http://localhost:5272/api` through the shell or environment, not source code.

## DTO Mappings

### `normalizeUser`

- Preserves backend user fields.
- Maps backend `fullName` to UI `name`.
- Falls back to email prefix when no display name is present.

### `normalizeMarketplacePlant`

- Maps `imageUrl` to `image`.
- Preserves `priceText` for display.
- Parses `priceText` into numeric `price` only as a compatibility fallback for existing UI helpers.
- Maps backend lowercase status such as `active` to existing UI status `Active`.
- Provides safe `category`, `tags`, and `difficulty` compatibility fields expected by current marketplace/detail UI.

### `normalizeMyPlant`

- Maps backend `name` to UI `nickname`.
- Preserves `name` for compatibility.
- Maps `imageUrl` to `image`.
- Passes through `species`, `location`, `status`, and `notes`.
- Create/update payload maps UI `nickname` or `name` to backend `name` and omits unsupported `smartReminders`.

## Phase 1 Validation Fixes

Root causes found:

- Marketplace detail imported `getMarketplacePlant` but still rendered `PRODUCTS.find(...) || PRODUCTS[0]`; UUID marketplace ids never matched the old mock ids, so detail fell back to `Cay Trau Ba La Xe`.
- Marketplace fallback was silent; request failures or empty responses could show mock products without a console signal.
- MyPlants CRUD existed in the service layer, but the user-facing profile page exposed no edit/delete controls.

Fixes applied:

- `PlantDetail` now fetches `GET /api/marketplace-plants/{id}` and treats the backend response as source of truth.
- `PlantDetail` only uses `PRODUCTS` after a request failure, and `PlantList`/`PlantDetail` emit `console.warn("[DeskBoost] Using fallback marketplace data")` when fallback is triggered.
- `PlantProfile` now exposes minimal edit/delete actions on the existing profile route and calls `PUT /api/my-plants/{id}` and `DELETE /api/my-plants/{id}`.

Validation results:

- Real API verification passed for register, login, auth bootstrap, marketplace list/detail, and MyPlants create/list/detail/update/delete.
- Marketplace real API returned backend items `Hoa DẠi` and `Hoa hồng`; detail verification for the first UUID returned the matching backend item instead of the mock Monstera fallback.
- `npm run lint` passed.
- `npm run build` passed.

## Remaining Mock Areas

- Reminders still use the existing reminder DTO/local fallback and are deferred to Phase 2.
- AI Chat still uses mock plant context and AI fallback.
- AI Diagnose still needs multipart `image` request migration.
- Upload is not wired into plant/profile forms yet.
- Feedback verified-read and admin feedback endpoints are still missing.
- Admin services still contain mock fallback.
- Forgot password has no verified backend endpoint.

## Phase 2 - Profile, Reminders, Calendar Export

Status: implemented in frontend service/UI code. Scope intentionally excludes AI Chat, AI Diagnose, Upload, Feedback, Admin, Marketplace, Auth, and MyPlants behavior except reading `GET /api/my-plants` for reminder plant options.

## Phase 2 Files Changed

- `FE/services/api.js`
- `FE/services/userApi.js`
- `FE/services/reminderApi.js`
- `FE/pages/UserProfile.jsx`
- `FE/pages/RemindersSettings.jsx`
- `FE/context/CareContext.jsx`
- `FE/components/CareNotificationBell.jsx`
- `FE/i18n/locales.ts`
- `docs/frontend-api-migration.md`
- `PROJECT_AI_NOTES.md`

## Phase 2 Endpoint Mappings

| Frontend area | Backend endpoint |
| --- | --- |
| Profile load | `GET /api/users/me` |
| Profile update | `PUT /api/users/me` |
| Reminder list | `GET /api/reminders` |
| Reminder create | `POST /api/reminders` |
| Reminder update | `PUT /api/reminders/{id}` |
| Reminder mark done | `PUT /api/reminders/{id}/done` |
| Reminder delete | `DELETE /api/reminders/{id}` |
| Reminder calendar JSON/link | `GET /api/reminders/{id}/calendar` |
| Reminder ICS export | `GET /api/reminders/{id}/calendar?format=ics` |
| Reminder plant options | `GET /api/my-plants` |

## Phase 2 DTO Mappings

### `normalizeUserProfile`

- Maps backend `fullName`, `name`, or `displayName` to UI `displayName`.
- Maps `avatarUrl` or `avatar` to UI `avatarUrl`.
- Preserves `phone` and `email`.
- Displays `email` as read-only because the provided backend contract does not confirm editable email support.
- Password-change UI is informational only because no password endpoint is available.

### `toUserProfilePayload`

- Sends `fullName`, `name`, `avatarUrl`, and `phone`.
- Omits `email` and password fields.

### `normalizeReminder`

- Maps backend `id`, `plantId`, `plantName`, `title`, `careType`, `dueAt`, `repeatRule`, `notes`, and `status`.
- Maps backend `careType` to current UI `type`.
- Splits `dueAt` into UI `dueDate` and `time`.
- Maps `repeatRule` to UI `frequency`.
- Treats `status` values `done`, `completed`, and `complete` as completed UI state.

### `toReminderPayload`

- Sends `plantId`.
- Sends `title`, defaulting to the care type label if empty.
- Maps UI `type` or `careType` to backend `careType`.
- Combines UI `dueDate` and `time` into backend `dueAt`.
- Maps UI `frequency` to backend `repeatRule`.
- Sends `notes`.

## Phase 2 Calendar Notes

- Per-reminder Google calendar action calls `GET /api/reminders/{id}/calendar`; if the backend JSON does not include a direct URL, the frontend builds the Google Calendar URL from the already-loaded reminder after the backend call succeeds.
- Per-reminder ICS download calls `GET /api/reminders/{id}/calendar?format=ics` and downloads the returned text.
- Combined Google/ICS export remains client-side because no batch calendar endpoint was provided. It is marked with source `frontend-generated-combined-export`.

## Phase 2 Remaining Mock or LocalStorage Areas

- `deskboost_reminders_mvp` reminder fallback was removed.
- `deskboost_care_tasks` notification-bell localStorage was removed; the bell now derives from real reminders.
- Combined calendar export is still frontend-generated, not mock data.
- AI Chat, AI Diagnose, Upload, Feedback, Admin, and Forgot Password remain outside Phase 2.

## Phase 2 Known Backend Gaps

- No batch calendar export endpoint for all reminders.
- No password-change endpoint for profile security UI.
- No confirmed email-update support on `PUT /api/users/me`.
- No undo endpoint for completed reminders, so the notification bell cannot undo a completed reminder.

## Phase 2.1 / Phase 3 - Upload Image Integration

Status: implemented for Add My Plant, Plant Profile edit image, and User Profile avatar. Scope intentionally excludes AI Chat, AI Diagnose, Admin, Marketplace, Feedback, and reminder logic.

## Phase 2.1 Files Changed

- `FE/services/uploadApi.js`
- `FE/pages/AddPlantUser.jsx`
- `FE/pages/PlantProfile.jsx`
- `FE/pages/UserProfile.jsx`
- `FE/i18n/locales.ts`
- `docs/frontend-api-migration.md`
- `PROJECT_AI_NOTES.md`

## Phase 2.1 Upload Contract

| Frontend area | Backend endpoint | Notes |
| --- | --- | --- |
| Image upload | `POST /api/upload/image` | Authenticated `multipart/form-data` with field `file` |
| Add My Plant | `POST /api/my-plants` | Uses uploaded URL as `imageUrl` |
| Plant Profile image edit | `PUT /api/my-plants/{id}` | Uses uploaded URL as `imageUrl` |
| User Profile avatar | `PUT /api/users/me` | Uses uploaded URL as `avatarUrl` |

Backend upload response verified from `BE/DeskBoost/DeskBoost.API/Controllers/UploadController.cs`:

```json
{
  "url": "https://res.cloudinary.com/<cloud>/image/upload/deskboost/<id>.jpg"
}
```

`uploadImage(file)` also accepts fallback response shapes `imageUrl`, `secureUrl`, and `data.url`, then returns the normalized URL string.

## Phase 2.1 DTO Mappings

- Upload sends `FormData` with `file`.
- Upload validates `image/jpeg`, `image/png`, `image/webp`, and `image/gif`.
- Upload validates file size `<= 5MB`.
- Add My Plant keeps `imageUrl` support as an advanced URL fallback and submits the existing `createMyPlant` payload with `imageUrl`.
- Plant Profile edit keeps `imageUrl` support as an advanced URL fallback and submits the existing `updateMyPlant` payload with `imageUrl`.
- User Profile keeps `avatarUrl` URL support and submits the existing `updateMe` payload with `avatarUrl`.
- `PUT /api/users/me` support for `avatarUrl` is confirmed by `UpdateProfileRequest.AvatarUrl`.

## Phase 2.1 Manual Verification Checklist

- Select image file in Add Plant: local preview appears before backend upload finishes.
- `POST /api/upload/image` is called with multipart field `file`.
- Returned URL is written to `imageUrl` before `POST /api/my-plants`.
- Created plant displays uploaded image through existing MyPlants image mapping.
- Plant Profile edit mode can upload and save a new `imageUrl` through `PUT /api/my-plants/{id}`.
- User Profile can upload and save `avatarUrl` through `PUT /api/users/me`; if backend rejects `avatarUrl`, treat that as a backend contract blocker rather than forcing a frontend workaround.

## Phase 3 - Feedback, Ownership, and QR Readiness

Status: frontend trust/ownership foundation implemented. Fake verified-feedback fallbacks were removed from runtime UI.

## Phase 3 Endpoint Mappings

| Frontend area | Backend endpoint | Status |
| --- | --- | --- |
| User feedback create | `POST /api/feedback` | Connected via `submitFeedback()` |
| Plant Detail verified feedback read | `GET /api/feedback/verified?catalogPlantId={id}` | Frontend-ready, backend blocker: endpoint not implemented |
| Admin verified feedback create/read | `POST /api/admin/feedback`, `GET /api/admin/feedback` | Blocked; frontend no longer saves mock verified reviews |

## Phase 3 DTO Mappings

- `normalizeFeedback()` maps `id`, `customerAlias`/`userName`, `rating`, `comment`/`message`, `catalogPlantId`/`marketplacePlantId`/`plantId`, `purchaseChannel`, verification fields, and `createdAt`.
- `toFeedbackPayload()` sends only `message` and `rating` to match `CreateFeedbackRequest`.
- `normalizeMarketplacePlant()` and `normalizeMyPlant()` now preserve `ownershipCode`, `ownershipStatus`, and `isClaimed` when backend data includes them.
- `normalizeUserProfile()` now maps `claimedPlantsCount` from camelCase, PascalCase, or snake_case response shapes.

## Phase 3 Ownership Architecture

- Plant ownership is DTO-only readiness: no claim endpoint is called, no ownership code is generated client-side, and no hardcoded claim logic exists.
- Plant Detail includes a QR readiness section showing ownership DTO values when available and an explicit no-fake-QR placeholder otherwise.
- Plant Profile includes an Ownership section for owned plant records with code/status/claimed placeholders.
- User Profile includes a disabled future Claim Plant entry point and displays `claimedPlantsCount` when the backend provides it.

## Phase 3 Feedback Trust Status

- Public Plant Detail reads verified feedback only from the backend-ready service path.
- If the verified-feedback read endpoint is missing or unavailable, Plant Detail shows a backend-blocked empty state.
- Mock `VERIFIED_FEEDBACK` is no longer used by `feedbackApi.js` or `adminApi.js`.
- Admin manual verified-feedback UI is held as backend readiness only and does not save mock reviews.
- User feedback creation is connected to real `POST /api/feedback`, but created feedback is not displayed as verified.

## Phase 3 QR Readiness

- QR UI placeholders exist on Plant Detail and Plant Profile.
- No QR image/string generation exists in frontend.
- No admin QR implementation was added.
- Real QR/claim requires backend validate/claim/code lifecycle endpoints.

## Phase 3 Backend Blockers

- Missing verified feedback read endpoint, e.g. `GET /api/feedback/verified`.
- Missing admin verified-feedback management endpoint and verification lifecycle.
- Missing ownership/claim DTO fields in current backend plant/profile responses.
- Missing QR/claim endpoints for validate, claim, status, and code lifecycle.

