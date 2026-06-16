# Security Remediation Plan

## Audit Verification Summary

Verified by repo inspection and commands:
- FE lint/build/mobile build pass; main bundle ~762 kB and Vite chunk warning.
- BE `.NET 8` build pass, 0 warnings/errors.
- Java is `1.8.0_421`; Android Gradle rebuild requires newer Java.
- Debug APK exists at `FE/android/app/build/outputs/apk/debug/app-debug.apk` (~8.2 MB).
- Tracked sensitive/local files: `.agent/mcp.json`, `.playwright-mcp/*`, `BE/DeskBoost/.claude/settings.local.json`, `FE/.env.mobile`, `be-*.log`.
- `AiDebugController` public `/api/test-gemini`, `/api/test-plantid`.
- Swagger unconditional in `Program.cs`.
- CORS fallback `AllowAnyOrigin()` in `Program.cs`.
- JWT stored in `localStorage` in FE auth/api files.
- No rate limiting found.
- AI diagnose uses `[DisableRequestSizeLimit]`; upload MIME-only.
- FE logout clears storage only; backend logout/refresh handlers exist.
- No release signing/AAB found.
- No privacy policy/account deletion/Data Safety docs found before this plan.
- No root `README.md` or `LICENSE`; `FE/README.md` is AI Studio template.

Partially verified / needs task audit:
- CDN/font/icon runtime dependency risk.
- Admin self-delete/last-admin/audit guard absence.
- External contact URL validation.

New findings:
- `DEPLOY_CHI_TIET.md` contains prod-looking DB password example; treat as secret until proven fake.
- `FE/vite.config.ts` can define `GEMINI_API_KEY` into client bundle if a real key is supplied; ensure no client-side secret env.
- Android `android:allowBackup="false"` applied in CP-11 for external tester safety.


## Remediation order
1. Rotate/revoke exposed keys.
2. Remove/untrack sensitive local files and logs.
3. Purge git history if pushed.
4. Remove/gate AI debug endpoints.
5. Swagger development-only.
6. CORS fail-closed.
7. Rate limiting.
8. Upload/AI size + magic-byte validation.
9. Complete logout/refresh lifecycle.
10. Admin safeguards.

## Secret rules
Public OK: Google OAuth client IDs, package name, app name.
Never public: API keys, client secrets, JWT secrets, DB passwords, keystore, keystore passwords, tokens, Cloudinary secret, Gemini/Plant.id keys.

## CP-01 active-tree cleanup record

Status: active tree prepared for history scan; not Gate B passed.

Files removed from Git tracking/index:
- `.agent/mcp.json` via `git rm --cached`; local copy preserved.
- `BE/DeskBoost/.claude/settings.local.json` via `git rm --cached`; local copy preserved.
- `FE/.env.mobile` via `git rm --cached`; local copy preserved.

Generated logs/tool output removed:
- `.playwright-mcp/console-2026-06-01T08-24-01-660Z.log`
- `.playwright-mcp/page-2026-06-01T08-24-04-048Z.yml`
- `be-login-debug.err.log`
- `be-login-debug.log`
- `be-runtime.err.log`
- `be-runtime.log`

Ignore hardening added:
- Local agent/tool state, `.env*` except examples, logs, frontend/.NET/Android builds, Android signing files, `google-services.json`, IDE-local state.
- FE ignore rules aligned for env files, Android build outputs, signing files, and Google service local config.

Safe examples created:
- `FE/.env.example`
- `BE/DeskBoost/DeskBoost.API/appsettings.example.json`

Docs redacted:
- `DEPLOY_CHI_TIET.md` no longer includes the production-looking DB password example.
- `HUONG_DAN_DEPLOY.md` uses generic DB placeholders and redacts token display in smoke-test output.

Manual actions still required:
- Rotate/revoke the exposed Google API key.
- Verify whether the DB password example was ever real; rotate if yes or uncertain.
- Run a Git history secret scan.
- Rewrite/purge history only after explicit approval if pushed history contains secrets.
- Fresh-clone validation before public GitHub.

Maximum status after CP-01: READY FOR HISTORY SCAN.

## CP-02 AI debug route removal record

Status: CP-02: IMPLEMENTED â€” NEEDS REVIEW. Gate A remains pending.

Implementation:
- Deleted `BE/DeskBoost/DeskBoost.API/Controllers/AiDebugController.cs` from production source.
- Removed public unauthenticated debug routes `/api/test-gemini` and `/api/test-plantid`.
- Did not modify real AI user/admin controllers, Gemini services, Plant.id services, DI registrations, appsettings keys, or frontend code.

Validation evidence to keep with the task:
- Source grep should return no production backend route for `AiDebugController`, `test-gemini`, or `test-plantid`.
- Backend build should pass with 0 errors.
- Runtime smoke test is optional; skip if local startup would require unsafe config.

Remaining work:
- Swagger production policy.
- Fail-closed CORS.
- Rate limiting.
- Request/upload limits.
- Manual secret rotation and history scan from CP-01.

## CP-03 Swagger and CORS hardening record

Status: CP-03: IMPLEMENTED â€” NEEDS REVIEW. Gate A remains pending.

Implementation:
- Swagger middleware is registered only inside `if (app.Environment.IsDevelopment())`.
- CORS origins are resolved before policy registration.
- `Cors:AllowedOrigins` supports JSON array configuration and comma-separated scalar environment-variable configuration such as `Cors__AllowedOrigins=https://one.example,https://two.example`.
- Origins are trimmed, empty entries removed, duplicates removed case-insensitively, and wildcard/path/query/fragment origins rejected.
- Non-development environments throw a safe startup configuration exception when no CORS origins are configured.
- Development with no configured origins may still use permissive CORS.

Validation evidence to keep with the task:
- Grep confirms `AddCors`, `UseCors`, auth middleware, and `MapControllers` are still present.
- Review of `Program.cs` confirms Swagger is development-only.
- Backend build should pass with 0 errors.

Remaining work:
- Rate limiting.
- Request/upload limits.
- Manual secret rotation and history scan from CP-01.

## Verification commands
```bash
git ls-files | grep -Ei 'mcp|env|log|settings.local|apk|aab|jks|keystore|google-services' || true
git grep -n -I -E 'AIza|client_secret|Password=|ApiKey|Jwt:Key|ConnectionStrings' -- . ':!FE/node_modules' ':!FE/dist' ':!**/bin' ':!**/obj'
```

## CP-04 ASP.NET Core rate limiting record

Status: CP-04: IMPLEMENTED â€” NEEDS REVIEW. Gate C remains pending.

Implementation:
- Registered built-in ASP.NET Core rate limiting in `BE/DeskBoost/DeskBoost.API/Program.cs`.
- Added named fixed-window policies: `AuthLogin` (10/min/IP), `AuthStrict` (5/5min/IP), `AuthRefresh` (30/min/IP), `PasswordRecovery` (3/15min/IP), `AiChatUser` (10/min/user-or-IP), `AiDiagnoseUser` (3/min/user-or-IP), and `UploadUser` (10/min/user-or-IP).
- Applied endpoint-specific `[EnableRateLimiting]` to auth login, Google login, register, refresh token, forgot password, AI chat, AI diagnose, and image upload.
- Kept existing AI quota logic intact; rate limiting does not replace daily AI quota enforcement.
- JWT audit confirmed access tokens emit `ClaimTypes.NameIdentifier` with `user.Id`; user-partitioned policies use that claim first and fall back to `sub`, `userId`, `UserId`, then IP.
- No safe forwarded-header/proxy trust config was found; auth IP policies use `HttpContext.Connection.RemoteIpAddress` and fall back to `ip:unknown` when unavailable.
- Rejections return generic JSON `{ statusCode, code, message }` with `429` and optional standard `Retry-After` header. No policy name, user ID, IP, token, or partition key is exposed.
- Middleware order is CORS, authentication, rate limiter, authorization, controllers. Swagger remains Development-only and CORS remains fail-closed for non-development.

Endpoint inventory summary:
- `POST /api/auth/register` -> `AuthStrict`, anonymous.
- `POST /api/auth/login` -> `AuthLogin`, anonymous.
- `POST /api/auth/google` -> `AuthLogin`, anonymous.
- `POST /api/auth/refresh-token` -> `AuthRefresh`, anonymous.
- `POST /api/auth/forgot-password` -> `PasswordRecovery`, anonymous.
- `POST /api/ai/chat` -> `AiChatUser`, authenticated.
- `POST /api/ai/diagnose` -> `AiDiagnoseUser`, authenticated.
- `POST /api/upload/image` -> `UploadUser`, authenticated.
- Legacy `AiChatController` and `DiagnosisController` are fully commented out and not reachable.

Validation evidence to keep with the task:
- `git grep` confirms `AddRateLimiter`, exactly one `UseRateLimiter`, and all named policy attributes in backend source.
- Debug route grep returned no `AiDebugController`, `test-gemini`, or `test-plantid` matches in backend source.
- `dotnet build DeskBoost.sln --nologo` succeeded with 0 errors. Latest sandbox run reported NU1900 vulnerability-feed warnings because NuGet network access was unavailable.
- Runtime smoke test was skipped because local API startup/request flow may depend on real local DB/config; source validation and build are mandatory evidence for this checkpoint.

Remaining work:
- Production client-IP resolution behind Render/reverse proxy must be validated in deployment before marking rate limiting fully production-validated.
- Request/upload body size validation and image magic-byte validation remain CP-05.
- Refresh/logout lifecycle hardening remains pending.
- Admin safety guards remain pending.
- Manual key rotation and Git history scan from CP-01 remain pending.
## CP-05 request/upload image hardening record

Status: CP-05: IMPLEMENTED - NEEDS REVIEW. Gate C remains pending.

Implementation:
- Added `BE/DeskBoost/DeskBoost.API/Validation/ImageFileValidator.cs` for API-level image validation.
- Enforced 5 MB max image size for both `POST /api/upload/image` and `POST /api/ai/diagnose`.
- Allowed formats are JPEG (`.jpg`, `.jpeg`), PNG (`.png`), and WebP (`.webp`) only.
- Removed GIF support for the MVP because no repository evidence showed it is required and animated GIFs add avoidable processing risk.
- Validation now checks presence, non-empty length, max size, extension allowlist, MIME allowlist, magic bytes, and extension/MIME/magic-byte agreement.
- Filename handling now uses `Path.GetFileName`; missing/unsafe names are replaced with a generated `deskboost-image-{guid}.{ext}` filename before Cloudinary upload.
- `UploadController` validates before opening the upload stream and passes the sanitized filename to `UploadImageAsync` while preserving response shape `{ url }`.
- `AiController` validates `request.Image` before opening the stream and before existing Plant.id/Gemini diagnosis flow.
- Active `[DisableRequestSizeLimit]` on `POST /api/ai/diagnose` was replaced with `[RequestSizeLimit]` and `[RequestFormLimits(MultipartBodyLengthLimit = ...)]`.
- CP-04 rate limiting attributes and middleware order were preserved.

Endpoint inventory summary:
- Active `POST /api/upload/image`: protected by `UploadUser`, request/form limited to 5 MB, validator applied, safe filename passed to Cloudinary.
- Active `POST /api/ai/diagnose`: protected by `AiDiagnoseUser`, request/form limited to 5 MB, validator applied before third-party AI calls.
- `DiagnosisController.cs` remains a fully commented legacy block; its stale `[DisableRequestSizeLimit]` is not active compiled code.

Validation evidence to keep with the task:
- Source grep confirms `ImageFileValidator`, endpoint `RequestSizeLimit`, endpoint `RequestFormLimits`, and validator calls in upload and diagnose controllers.
- Source grep still finds `DisableRequestSizeLimit` only in commented legacy/docs examples, not active image endpoints.
- `dotnet build DeskBoost.sln --nologo` succeeded with 0 errors. NU1900 vulnerability-feed warnings may appear when NuGet network access is unavailable.
- `git diff --check` passed for CP-05 touched files.
- Runtime smoke test was skipped because local API startup/request flow may depend on real DB/provider configuration and valid auth; source validation and build are mandatory evidence for this checkpoint.

Remaining work:
- No antivirus/malware scanning is implemented.
- Cloudinary, Plant.id, and Gemini image/AI processing still need privacy disclosure.
- Reverse proxy/deployment body-size limits still need deployment validation.
- CP-06 auth lifecycle is implemented and needs review.
- Admin safeguards remain pending.
- Android build/signing remains pending.
- Manual key rotation and Git history scan from CP-01 remain pending.

## CP-06 auth lifecycle hardening record

Status: CP-06: IMPLEMENTED - NEEDS REVIEW. Gate C remains pending.

Implementation:
- Register, login, and Google login already issued a JWT access token, generated a refresh token, persisted it in `RefreshTokens`, and returned `{ accessToken, refreshToken, user }`; this behavior was verified and preserved.
- `POST /api/auth/refresh-token` keeps the existing route and now accepts both legacy `{ token }` and FE-aligned `{ refreshToken }` request bodies.
- Refresh token handling rejects missing, unknown, revoked, expired, and inactive-user sessions, then revokes the old token and issues a new access token + refresh token pair.
- `POST /api/auth/logout` remains authenticated and now passes the current JWT user ID into the logout command.
- Logout revocation now matches both refresh token value and current user ID, preventing a user from revoking another user's refresh token. Missing/already-revoked/non-matching tokens remain safe/idempotent from the API response perspective.
- FE auth storage now persists access token, refresh token, and user. Access token key remains `accessToken`; refresh token key is `deskboost.refreshToken`; legacy `token`, `refreshToken`, `role`, and `isLoggedIn` keys are cleared on logout/failure.
- FE API client attempts one refresh for non-auth `401` responses and retries once for safe non-FormData requests. FormData requests refresh the session when possible but return a retry-required error instead of replaying the upload body.
- FE logout best-effort calls backend logout when a refresh token exists, then always clears local auth state even if revoke/network fails.
- Refresh failure clears local auth so protected routes fall back to logged-out behavior.

Validation evidence to keep with the task:
- Backend build should pass with 0 errors. NU1900 vulnerability-feed warnings may appear when NuGet network access is unavailable.
- FE lint and build should pass. Existing Vite chunk-size warning is acceptable if unchanged.
- Source grep should confirm user-scoped logout, FE refresh-token storage, refresh/retry path, and CP-04/CP-05 preservation.
- Runtime login/refresh/logout smoke still needs a real local or deployed DB/config/auth provider context.

Remaining work:
- Tokens remain in localStorage by MVP decision; secure/native storage is deferred.
- Refresh tokens are still stored raw in DB; hash-at-rest is deferred.
- Complex refresh-token reuse detection/session-family invalidation is deferred.
- Production deployed session behavior still needs login-refresh-logout smoke testing.
- Admin safeguards remain pending.
- Android build/signing remains pending.
- Privacy/account deletion work remains pending.
- Manual key rotation and Git history scan from CP-01 remain pending.

## CP-07 admin safety guard record

Status: CP-07: IMPLEMENTED - NEEDS REVIEW. Gate E remains pending.

Implementation:
- Admin user mutation endpoints now resolve the current admin user ID from JWT claims and refuse to proceed when it cannot be resolved.
- `UpdateAdminUserStatusCommand`, `UpdateAdminUserCommand`, and `DeleteAdminUserCommand` now receive the current admin user ID without changing public route shapes or request bodies.
- Active admin is defined by repository model truth: `Role == ADMIN`, `Status == Active`, and `IsActive == true`.
- Self-delete is blocked.
- Self-disable/deactivation is blocked for status changes away from `Active`.
- Self-demote from `ADMIN` is blocked for role changes.
- Last active admin delete, deactivate, or demote is blocked by checking for another active admin before the mutation.
- Delete remains the existing soft-delete behavior: `Status = Inactive`, `IsActive = false`.
- Minimal structured logs were added in `AdminController` after successful user mutations. Logged fields are action name, actor admin ID, target user ID, and mutation type. Emails, phones, request bodies, passwords, and tokens are not logged.

Validation evidence to keep with the task:
- Backend build should pass with 0 errors. NU1900 vulnerability-feed warnings may appear when NuGet network access is unavailable.
- Source grep should confirm `CurrentAdminUserId`, `ForbiddenException`, guard messages, and `LogInformation` in admin user mutation paths.
- Preservation grep should confirm CP-04 rate limiting, CP-05 image validation, and CP-06 refresh/logout lifecycle remain present.

Remaining work:
- Runtime self/last-admin mutation smoke tests still need a real local or deployed admin DB context.
- Broader DB audit table is deferred.
- Broader destructive admin actions outside user account mutations were not expanded in CP-07.
- Manual secret rotation and Git history scan from CP-01 remain pending.
- Android build/signing remains pending.
- Privacy/account deletion work remains pending.

## CP-08 frontend auth and XSS hardening record

Status: CP-08: IMPLEMENTED - NEEDS REVIEW. Gate C and Gate E remain pending.

Implementation:
- Removed `dangerouslySetInnerHTML` from `FE/components/AppDownloadButton.jsx`.
- iOS install instructions now render translated text through React nodes with static `<strong>` segments instead of writing HTML into the DOM.
- External links that open a new tab now use `rel="noopener noreferrer"`.
- Auth storage cleanup was reviewed and preserved: `accessToken`, `deskboost.refreshToken`, `authUser`, legacy `token`, legacy `refreshToken`, `role`, and `isLoggedIn` are cleared.
- Auth bootstrap already clears corrupt `authUser` JSON.
- Refresh failure and terminal 401 paths clear local auth; logout still best-effort calls backend revoke and always clears local auth.
- FormData retry safety from CP-06 is preserved: session may refresh, but upload/FormData requests are not replayed automatically and return `AUTH_RETRY_REQUIRED`.
- Safe redirect audit found only React Router internal path redirects from `location.state.from.pathname`; no query/user-input external redirect was found.

CSP deployment recommendation:
- Production should set CSP headers at the hosting or reverse-proxy layer, tuned to deployed API and OAuth domains.
- Suggested starting point to tune, not hardcode in FE: `default-src 'self'; img-src 'self' data: https:; connect-src 'self' <api-domain> https://accounts.google.com https://www.googleapis.com; script-src 'self' https://accounts.google.com;`.

Validation evidence to keep with the task:
- FE lint and build should pass. Existing Vite chunk-size warning is acceptable until CP-09.
- Unsafe HTML grep should return no active `dangerouslySetInnerHTML`, `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `eval(`, or `new Function` matches in FE source.
- Auth preservation grep should confirm `deskboost.refreshToken`, `AUTH_RETRY_REQUIRED`, `clearStoredAuth`, `saveAuth`, refresh, and logout paths remain present.

Remaining work:
- Tokens remain in localStorage by MVP decision; secure/native storage is deferred.
- CSP must be finalized and deployed in hosting config.
- CP-09 route-level code splitting remains pending.
- Runtime login/refresh/logout and UI smoke still need a real local or deployed backend.
- Manual secret rotation and Git history scan from CP-01 remain pending.
- Android build/signing remains pending.
- Privacy/account deletion work remains pending.

## CP-09 route-level code splitting record

Status: CP-09: IMPLEMENTED - NEEDS REVIEW. Gate D is improved; release smoke remains pending.

Implementation:
- `FE/routes/AppRouter.tsx` now uses React `lazy` and `Suspense` for route-level splitting.
- Kept Home, Login, Register, ForgotPassword, Forbidden, ProtectedRoute, and AdminRoute eager for simpler first-load/auth behavior.
- Lazy-loaded public plant routes: PlantList and PlantDetail.
- Lazy-loaded authenticated app routes: Dashboard, MyPlants, PlantProfile, AddPlantUser, UserProfile, RemindersSettings.
- Lazy-loaded AI routes: AIPlantAnalysis and AIChat.
- Lazy-loaded all admin pages: AdminOverview, AdminUsers, AdminPlants, AdminPlantInventory, AdminMarketplace, AdminFeedback, AdminAI, and AdminNotifications.
- Route paths, route guards, router mode, auth behavior, and admin guard behavior were preserved.

Build size evidence:
- Baseline web build before CP-09: `assets/index-1r5hVNOM.js` 763.94 kB, gzip 207.43 kB; Vite chunk warning present.
- After CP-09 web build: `assets/index-DoomNEZ3.js` 510.09 kB, gzip 157.40 kB; Vite chunk warning still present.
- After CP-09 mobile build: `assets/index-_BaGK2dH.js` 508.02 kB, gzip 156.84 kB; Vite chunk warning still present.

Validation evidence to keep with the task:
- FE lint should pass.
- FE web build and mobile build should pass.
- Source grep should confirm `lazy`, `Suspense`, and `RouteFallback` in `AppRouter.tsx`.
- Preservation grep should confirm CP-06 auth lifecycle, CP-07 admin guards, CP-05 image validation, CP-04 rate limiting, and no active CP-08 unsafe HTML regression.

Remaining work:
- Main chunk remains slightly above 500 kB; future optimization should inspect shared dependencies, vendor/manual chunks, and Home/shared imports.
- Manual route smoke still needs a real app session/admin user.
- Real-device APK route-load smoke remains pending.
- Android build/signing remains pending.
- Privacy/account deletion work remains pending.
- Manual secret rotation and Git history scan from CP-01 remain pending.

## CP-10 Android JDK/build reproducibility record

Status: CP-10: IMPLEMENTED - NEEDS REVIEW. Android debug build reproducibility is blocked by local JDK until JDK 21 is selected.

Implementation:
- Added `docs/release/android-build-runbook.md` with clean-clone debug build steps, required tools, JDK requirement, expected APK path, npm shortcuts, and common Windows errors.
- Linked the runbook from `docs/release/google-play-readiness.md`.
- Added `npm run android:clean` as a Windows-friendly debug build helper; no release signing, keystore, or AAB script was added.
- Documented that JDK 21 is required because generated `FE/android/app/capacitor.build.gradle` uses `JavaVersion.VERSION_21`.
- Did not edit generated Capacitor Gradle compatibility, application ID, signing config, OAuth config, or release settings.

Verified local environment:
- Node.js `v22.18.0`.
- npm `10.9.3`.
- Capacitor CLI `8.4.0`.
- Java `1.8.0_421`.
- javac `1.8.0_421`.
- `JAVA_HOME=C:\Program Files\Java\jdk-1.8`.
- Gradle wrapper `8.14.3`; current launcher/daemon JVM is Java 8.

Android config inventory:
- Package/application ID and namespace: `vn.deskboost.app`.
- `minSdkVersion=24`, `compileSdkVersion=36`, `targetSdkVersion=36`.
- `versionCode=1`, `versionName=1.0`.
- Permission: `android.permission.INTERNET`.
- `android:allowBackup="false"` is applied for external tester safety.
- No release signing config or keystore was added.

Validation evidence to keep with the task:
- FE lint and `npm run build:mobile` should pass.
- `npx cap sync android` should run after the mobile build.
- `.\gradlew.bat --version` currently shows Java 8 in this shell; `assembleDebug` requires switching to JDK 21.
- Preservation grep should confirm CP-04 through CP-09 remain present.

Remaining work:
- Select/install JDK 21, update `JAVA_HOME` and `PATH`, stop Gradle daemons, then rerun `.\gradlew.bat assembleDebug`.
- CP-11 release signing/AAB remains pending.
- CP-12 Google OAuth SHA verification remains pending.
- Verify `android:allowBackup=false` remains set before external testers.
- Privacy/account deletion work remains pending.
- Manual secret rotation and Git history scan from CP-01 remain pending.

## CP-11 Android release signing and AAB workflow record

Status: CP-11: IMPLEMENTED - NEEDS REVIEW. Gate D remains pending.

Implementation:
- Added safe release signing config in `FE/android/app/build.gradle`.
- Signing config reads local ignored `FE/android/keystore.properties` only when present and complete.
- Release Gradle tasks fail clearly when signing config is missing; debug tasks are not intended to require a release key.
- Added `FE/android/keystore.properties.example` with placeholders only.
- Updated Android ignore rules for keystores, `keystore.properties`, release directory, and `google-services.json`.
- Added npm scripts: `android:build:release` and `android:bundle:release`.
- Applied `android:allowBackup="false"` in the Android manifest because app data may include WebView/localStorage session data.
- Added `docs/release/android-release-signing.md` and linked it from Google Play readiness docs.
- No real keystore, passwords, signing credentials, APK, AAB, APKS, Google Play upload, or OAuth SHA change was created.

Validation status:
- Local Java/Javac remain `1.8.0_421`; Gradle wrapper runs with Java 8.
- FE lint, mobile build, and Capacitor sync should pass before Gradle release validation.
- Gradle assemble/bundle validation is blocked by local JDK until JDK 21 is selected.
- Release AAB also requires a human-created upload key and local `FE/android/keystore.properties`.

Remaining work:
- Select/install JDK 21 and rerun debug/release Gradle tasks.
- Human creates and backs up upload key outside Git.
- Build and verify signed AAB.
- CP-12 Google OAuth SHA verification remains pending.
- Play App Signing enrollment remains pending.
- Privacy/Data Safety/account deletion work remains pending.
- Manual secret rotation and Git history scan from CP-01 remain pending.

## CP-12 Google OAuth Android verification record

Status: CP-12: IMPLEMENTED - NEEDS REVIEW. Gate D remains pending.

Implementation:
- Audited web Google login through `@react-oauth/google` and `VITE_GOOGLE_CLIENT_ID`.
- Audited native Android Google login through `@capgo/capacitor-social-login`; it initializes with the web client ID, extracts `response.result.idToken`, and sends the ID token to the backend.
- Audited backend Google ID token verification; configured audiences are `Google:ClientId`, optional `Google:AndroidClientId`, and optional `Google:LegacyClientId`.
- Confirmed package identity: Capacitor `appId`, Android namespace, and Android `applicationId` are all `vn.deskboost.app`.
- Added `docs/release/google-oauth-android-verification.md` with SHA collection commands, Google Cloud Console checklist, backend/FE env checklist, test matrix, and troubleshooting.
- Documented that `google-services.json` is not required for the current ID-token-to-backend flow; it should only be added for future Firebase/Push/plugin flows that explicitly require it, and must stay ignored.

SHA status:
- Debug keystore exists locally and the debug SHA command returns SHA-1/SHA-256. Fingerprint values are not recorded in repo docs.
- Upload key SHA is blocked until a human creates the CP-11 upload key.
- Play App Signing SHA is blocked until signed AAB upload and Play App Signing enrollment.

Remaining work:
- Select/install JDK 21 and build signed AAB.
- Configure Google Cloud Console Android OAuth clients with debug, upload, and Play signing SHA fingerprints.
- Run web/debug/release/Play Internal Google login smoke tests.
- Complete Play App Signing enrollment.
- Privacy/Data Safety/account deletion work remains pending.
- Manual secret rotation and Git history scan from CP-01 remain pending.

## CP-13 privacy, Data Safety, and deletion record

Status: CP-13: IMPLEMENTED - NEEDS REVIEW. Gate D remains pending.

Implementation:
- Added `PRIVACY.md`, `docs/ACCOUNT_DELETION.md`, and `docs/release/google-play-data-safety-draft.md`.
- Expanded `docs/release/privacy-data-inventory.md` for Google Play Data Safety mapping.
- Added public FE routes `/privacy` and `/account-deletion`.
- Added minimal privacy/deletion links and AI/image third-party processing disclaimers in FE auth/profile/AI surfaces.
- Kept deletion wording as manual request support; no automated backend deletion cascade is claimed or implemented.

Remaining work:
- Replace placeholder support/contact before Play submission.
- Legal/product owner review.
- Final Play Console Data Safety entry.
- Assign deletion request operational ownership and retention policy.
- Signed AAB/JDK/upload key and secret rotation/history scan remain pending.

## CP-14 public repository documentation record

Status: CP-14: IMPLEMENTED - NEEDS REVIEW. Gate B remains pending manual security actions.

Implementation:
- Added root `README.md`, `LICENSE`, `SECURITY.md`, and `CHANGELOG.md`.
- Replaced stale `FE/README.md` AI Studio template with DeskBoost frontend setup/build/mobile documentation.
- Added a public docs index to `docs/README.md`.
- Documented that the project is MVP/pre-production and not public GitHub/Play/production ready.
- Kept official support/security contacts as TODO placeholders rather than inventing email addresses.

Remaining work:
- Rotate/revoke exposed keys.
- Run Git history secret scan and decide on purge/rewrite if needed.
- Validate a fresh clone using only example config.
- Replace official support/security contact placeholders.
- Continue signed AAB/JDK/Play release tasks separately.

## CP-15 production deployment runbook record

Status: CP-15: IMPLEMENTED - NEEDS REVIEW. Gate C remains pending real deployment and smoke validation.

Implementation:
- Added `docs/release/production-deployment-runbook.md`.
- Documented production environment variables with placeholders only.
- Documented CORS explicit-origin requirements and Swagger development-only expectation.
- Documented database migration command, backup-before-migration policy, rollback caveats, free-tier caveats, domain mapping, Android API URL behavior, and release smoke checklist.
- Flagged older deployment guides to cross-check against the CP-15 runbook.

Remaining work:
- Rotate/revoke exposed keys and complete Git history scan before public release.
- Configure real hosting/provider env vars outside Git.
- Run production deployment and release smoke.
- Confirm official support/security contact.
- Complete signed AAB/JDK/Play Console work.

## CP-16A deployed public/unauth smoke record

Status: CP-16A: IMPLEMENTED - NEEDS REVIEW. Gate C remains blocked until deployed backend security behavior matches CP-02/CP-03 source expectations.

Smoke timestamp:
- 2026-06-16 14:37:08 +07:00.

URLs tested:
- `https://www.deskboost.io.vn`.
- `https://deskboost.onrender.com/api`.
- `https://deskboost.onrender.com`.

Passed deployed checks:
- Public frontend routes `/`, `/privacy`, `/account-deletion`, `/login`, and `/register` returned 200.
- `GET /api/auth/me` without credentials returned 401, not 500.
- CORS preflight for `GET /api/auth/me` from `https://www.deskboost.io.vn` returned 204 with `Access-Control-Allow-Origin: https://www.deskboost.io.vn`.

Blockers found:
- `/swagger` returned 200 in deployed production smoke; expected 404/401/403/unavailable.
- `/swagger/index.html` returned 200 in deployed production smoke; expected 404/401/403/unavailable.
- `/api/test-gemini` returned 200 in deployed production smoke; expected 404/unavailable.
- `/api/test-plantid` returned 200 in deployed production smoke; expected 404/unavailable.

Pending by safety scope:
- Auth/admin/AI/upload smoke was not run because credentials and explicit quota/admin approval were not provided for CP-16A.
- Supabase remains pending indirect verification until auth/register smoke is approved and succeeds.
- Google Login remains manual/pending beyond public login page reachability and CP-12 doc alignment.

Next required action:
- Verify Render deploy revision/environment and redeploy the hardened backend if needed, then rerun CP-16A before CP-16B credentials-based smoke.
