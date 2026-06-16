# DeskBoost Frontend

React 19 + Vite 6 frontend for DeskBoost. The app supports public marketplace pages, auth, plant-care flows, AI diagnosis/chat, admin screens, and Capacitor Android builds.

See the root `README.md` for full project status, setup, privacy, security, and release blockers.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run lint` | TypeScript no-emit check |
| `npm run build` | Build web bundle |
| `npm run build:mobile` | Build mobile-mode bundle |
| `npm run preview` | Preview built web output |
| `npm run cap:sync` | Sync Capacitor Android project |
| `npm run android:build:debug` | Build debug APK with local Android toolchain |
| `npm run android:bundle:release` | Build release AAB when JDK 21 and local signing config are ready |

## Local setup

```powershell
npm install
copy .env.example .env.local
npm run dev
```

Do not put Gemini, Plant.id, Cloudinary, JWT, database, keystore, or OAuth client secret values in frontend env files. Frontend env values must be public client-side values only.

## Environment

Use `.env.example` as the safe shape for local config.

Common public values:

- `VITE_API_URL`
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_MOBILE_APP`
- `VITE_ROUTER_MODE`

## Build checks

```powershell
npm run lint
npm run build
npm run build:mobile
```

Vite may warn when a chunk is slightly larger than 500 kB. That warning is tracked separately from CP-09 route splitting.

## Android notes

Android package: `vn.deskboost.app`.

Runbooks:

- `../docs/release/android-build-runbook.md`
- `../docs/release/android-release-signing.md`
- `../docs/release/google-oauth-android-verification.md`

Release AAB generation is still blocked until JDK 21 is selected and a human-managed local upload key is configured outside Git.

## Public routes

- `/privacy`
- `/account-deletion`

When `VITE_ROUTER_MODE=hash`, mobile/static-hosted URLs use `/#/privacy` and `/#/account-deletion`.
