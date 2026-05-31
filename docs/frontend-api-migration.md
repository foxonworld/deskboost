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

