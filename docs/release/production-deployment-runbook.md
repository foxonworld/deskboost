# DeskBoost Production Deployment Runbook

## 1. Status

Status: pre-production deployment checklist.

CP-15 does not deploy DeskBoost, create cloud resources, rotate keys, or prove production readiness. Public release remains blocked by manual secret rotation/history scan/fresh-clone validation, official support/security contacts, JDK 21/upload key/signed AAB, Play Console final Data Safety/listing, and release smoke testing.

This document is a runbook for a future deployment, not evidence that deployment has been completed.

## 2. Deployment topology

Recommended MVP/free-tier topology:

```text
User browser / Android app
  -> FE static host or CDN: https://<web-domain>
  -> BE ASP.NET Core API host/container: https://<api-host>
  -> Managed PostgreSQL
  -> Cloudinary image storage
  -> Gemini and Plant.id AI providers
```

Do not hardcode final production URLs in repo docs or source. Use platform environment variables and placeholders until the release owner confirms the actual domains.

Android builds read `VITE_API_URL` at build time. Rebuild the APK/AAB when the production API URL changes unless runtime configuration is added later.

## 3. Required production env

Use hosting-provider secret managers or environment variables. Never commit production `.env`, connection strings, provider keys, JWT secrets, keystores, or OAuth client secrets.

Backend env:

```text
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=<postgres-connection-string>
Jwt__Key=<strong-random-secret>
Jwt__Issuer=<issuer>
Jwt__Audience=<audience>
Cors__AllowedOrigins=https://<web-domain>
Google__ClientId=<web-client-id>
Google__AndroidClientId=<android-client-id>
Google__LegacyClientId=<optional-legacy-client-id>
Cloudinary__CloudName=<cloudinary-cloud-name>
Cloudinary__ApiKey=<cloudinary-api-key>
Cloudinary__ApiSecret=<cloudinary-api-secret>
Gemini__ApiKey=<gemini-api-key>
PlantId__ApiKey=<plantid-api-key>
```

Frontend web env:

```text
VITE_API_URL=https://<api-host>/api
VITE_GOOGLE_CLIENT_ID=<web-client-id>
VITE_ROUTER_MODE=browser
```

Mobile build env:

```text
VITE_API_URL=https://<api-host>/api
VITE_GOOGLE_CLIENT_ID=<web-client-id>
VITE_ROUTER_MODE=hash
VITE_MOBILE_APP=true
```

## 4. CORS

Production requires explicit `Cors__AllowedOrigins`. Include the exact frontend origin, for example `https://<web-domain>`.

Rules:

- No wildcard origins.
- No path, query, or fragment in origins.
- Multiple origins can be configured as platform-supported arrays or comma-separated scalar values if the host maps them to `Cors:AllowedOrigins`.
- Include Capacitor/mobile origins only if runtime requests require them, for example `capacitor://localhost` and `http://localhost`.
- Missing CORS config in non-development should fail fast because of CP-03.

After deploy, run a CORS preflight from the frontend origin before release smoke is marked complete.

## 5. Swagger

Swagger is development-only after CP-03. `/swagger` should be unavailable in production. If `/swagger` is reachable in production, treat that as a release blocker.

## 6. Database migration

Manual migration command:

```powershell
cd BE\DeskBoost
dotnet ef database update --project DeskBoost.Infrastructure --startup-project DeskBoost.API
```

Migration policy:

- Back up PostgreSQL before every production migration.
- Decide whether migrations are run manually, during a controlled release job, or by a platform task. Do not run automatic production migrations without team approval.
- Record the migration name/hash, operator, timestamp, and backup reference outside the repo.
- DB rollback usually requires restoring from backup. Not all EF migrations are trivially reversible.

## 7. Build commands

Backend:

```powershell
cd BE\DeskBoost
dotnet restore
dotnet build DeskBoost.sln --configuration Release --nologo
dotnet publish DeskBoost.API/DeskBoost.API.csproj -c Release -o publish
```

Frontend web:

```powershell
cd FE
npm install
npm run lint
npm run build
```

Mobile:

```powershell
cd FE
npm run build:mobile
npx cap sync android
```

Android Gradle release tasks still require JDK 21 and local signing config from `docs/release/android-release-signing.md`.

## 8. Smoke checks

No `/health` endpoint is currently documented for CP-15. Do not claim health checks exist until a real endpoint is implemented.

Use available checks:

- FE loads at `https://<web-domain>`.
- `/privacy` and `/account-deletion` load on the public web domain. If hash mode is used for static/mobile, verify `/#/privacy` and `/#/account-deletion`.
- BE API base URL is reachable at `https://<api-host>/api` through a known existing API route.
- `GET /api/auth/me` without auth returns the expected unauthorized response, not a server error.
- `/swagger` is unavailable in production.
- CORS preflight succeeds from the exact frontend origin.
- Register/login smoke with a test account created for the environment.
- Google Login smoke with web and Android OAuth clients configured.
- Upload validation smoke: allowed JPEG/PNG/WebP accepted; invalid type/oversized image rejected safely.
- AI quota/error-safe smoke if Gemini and Plant.id keys are enabled.
- Admin login/guard smoke, including no self/last-admin destructive regression.

Do not use real customer data or production secrets in smoke logs.

## 9. Free-tier caveats

- Cold starts may affect the first API request after inactivity.
- Managed PostgreSQL free tiers may have connection limits, storage limits, and sleep policies.
- Gemini/Plant.id quotas can fail or throttle AI flows.
- Current rate limiting is app-instance scoped; multi-instance or reverse-proxy behavior needs deployment validation.
- Logs retention may be short on free tiers.
- No distributed cache is assumed by default.
- Reverse-proxy client IP behavior must be validated before rate limiting is considered production-validated.

## 10. Backups

- Configure PostgreSQL manual or scheduled backups before production traffic.
- Take a backup before each migration.
- Define Cloudinary asset export/backup policy if uploaded assets become business-critical.
- Keep Android upload keystore encrypted and offline, outside Git.
- Keep a secure environment-variable snapshot outside the repo for rollback/recovery.

## 11. Rollback

- FE rollback: restore the previous static deployment.
- BE rollback: redeploy the previous image/release artifact.
- DB rollback: restore a verified backup if a migration breaks production.
- Migrations may not be reversible with a simple down migration.
- Keep previous environment-variable snapshots securely outside the repo.
- Never store rollback secrets in Git.

## 12. Domain mapping

- FE domain points to the static host/CDN.
- API domain points to the backend host/container.
- HTTPS is required for both FE and API.
- `Cors__AllowedOrigins` must exactly match the FE origin.
- Privacy and account deletion public URLs must be tested after DNS/domain mapping.
- OAuth redirect/origin settings must match the final domains in Google Cloud Console.

## 13. Android API base URL

- Mobile builds must use the production API URL at build time through `VITE_API_URL=https://<api-host>/api`.
- Rebuild APK/AAB if the API URL changes unless runtime config is implemented later.
- `VITE_ROUTER_MODE=hash` and `VITE_MOBILE_APP=true` are the mobile build defaults.
- Google OAuth Android client SHA must match debug, upload, and Play signing certificates per `docs/release/google-oauth-android-verification.md`.

## 14. Release smoke checklist

- FE web smoke passes.
- BE API smoke passes.
- Android APK/AAB smoke passes.
- Google Login web/mobile smoke passes.
- AI diagnosis/chat and image upload smoke pass or are explicitly disabled with safe UX.
- Admin smoke passes.
- Privacy/deletion routes are public.
- Play Console Privacy Policy URL, account deletion URL, and Data Safety answers match the deployed behavior.
- Rollback path and backup restore owner are confirmed.
