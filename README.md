# DeskBoost

DeskBoost is an EXE-Capstone student startup MVP for desk plant discovery, plant-care tracking, and AI-assisted plant support.

## Current status

- MVP / EXE-Capstone / student startup project.
- Public website and public repository preparation are in progress.
- Android and Google Play preparation are in progress.
- Not production ready, not Google Play ready, and not public GitHub ready until the blockers below are resolved.

Main blockers before public release:

- Manual key rotation/revocation is still pending.
- Git history secret scan and purge decision are still pending.
- Fresh clone validation is still pending.
- JDK 21, upload key, signed AAB, and Play Console submission are still pending.
- Official support/security contact is still pending.

## Features

- Email/password register and login.
- Google Login via backend ID-token verification.
- Contact-only marketplace for browsing plants and contacting sellers outside the app.
- My Plants with plant profiles, notes, and care history.
- AI plant diagnosis from uploaded images.
- AI plant-care chat with plant context.
- Care reminders and calendar-oriented workflows.
- Admin dashboard for users, plant inventory, marketplace items, feedback, AI usage, and notifications.
- Ownership/claim-code workflows are part of the roadmap and release hardening notes.

## Tech stack

| Area | Stack |
|---|---|
| Frontend | React 19, Vite 6, React Router 7, TypeScript/JavaScript |
| Backend | ASP.NET Core / .NET 8 Web API |
| Database | PostgreSQL, Entity Framework Core |
| Mobile | Capacitor Android, package `vn.deskboost.app` |
| Auth | JWT, refresh tokens, Google Login |
| AI | Gemini-compatible AI, Plant.id |
| Storage | Cloudinary |

## Architecture overview

```text
deskboost/
  FE/                         React/Vite app, routes, services, context, Capacitor Android
  BE/DeskBoost/               .NET solution
    DeskBoost.API/            Controllers, auth, CORS, rate limiting, Swagger policy
    DeskBoost.Application/    Commands, queries, DTOs, use cases
    DeskBoost.Domain/         Entities, enums, domain rules
    DeskBoost.Infrastructure/ EF Core, identity, AI/storage integrations
  docs/                       Architecture, API, privacy, release docs
  plans/                      Release tracker and planning notes
```

The frontend calls the backend API. The backend owns auth, database persistence, AI provider calls, image storage, and administrative workflows. Frontend code must not contain provider secrets.

## Local setup

Prerequisites:

- Node.js and npm.
- .NET 8 SDK.
- PostgreSQL.
- JDK 21 for Android builds.
- Android Studio / Android SDK 36 for Android work.

Frontend:

```powershell
cd FE
npm install
copy .env.example .env.local
npm run dev
```

Backend:

```powershell
cd BE\DeskBoost
dotnet restore
dotnet build DeskBoost.sln --nologo
```

Use `BE/DeskBoost/DeskBoost.API/appsettings.example.json` as the safe configuration shape. Configure real database, JWT, AI, and storage values through local secrets or environment variables. Do not commit real secrets.

Database migration guidance lives with the backend docs and EF Core migration files under `BE/DeskBoost/DeskBoost.Infrastructure/Migrations`.

## Build and validation

Frontend:

```powershell
cd FE
npm run lint
npm run build
npm run build:mobile
```

Backend:

```powershell
cd BE\DeskBoost
dotnet build DeskBoost.sln --nologo
```

Android release build/signing requires JDK 21 and a local upload key. See `docs/release/android-build-runbook.md` and `docs/release/android-release-signing.md`.

## Security and release status

Release hardening docs:

- `docs/release/security-remediation-plan.md`
- `docs/release/google-play-readiness.md`
- `plans/release-task-tracker.md`

Known release/security blockers:

- Key rotation/revocation and Git history scan are pending manual work.
- Some local/secret/log artifacts are still present in the current working tree/index until reviewed and cleaned by the release owner.
- JDK 21 selection, upload key creation, and signed AAB generation are pending.
- Play Console listing, Data Safety final entry, and release smoke are pending.
- Official support/security contact must be confirmed before public release.

## Privacy and account deletion

- Privacy draft: `PRIVACY.md`
- Account deletion request draft: `docs/ACCOUNT_DELETION.md`
- Data Safety draft: `docs/release/google-play-data-safety-draft.md`
- Privacy data inventory: `docs/release/privacy-data-inventory.md`

Current deletion support is a manual deletion request workflow. It is not instant automated deletion.

## Known limitations

- No in-app cart, payment, order, shipping, or refund flow in the MVP.
- AI diagnosis and chat are informational plant-care assistance only and may be incomplete or wrong.
- Token storage uses browser localStorage by MVP decision; secure/native storage is deferred.
- Rate limiting is currently app-instance scoped and still needs production deployment validation.
- Android signing and Play release tasks remain pending.

## Demo guidance

Do not commit or publish real credentials.

```text
Demo accounts: create locally or request from project owner.
```

## License

License: MIT. Update copyright owner before public release if needed.

See `LICENSE`.
