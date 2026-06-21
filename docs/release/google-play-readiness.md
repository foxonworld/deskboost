# Google Play Readiness

## Audit Verification Summary

Verified by repo inspection and commands:
- FE lint/build/mobile build pass; main bundle ~762 kB and Vite chunk warning.
- BE `.NET 8` build pass, 0 warnings/errors.
- Java is `1.8.0_421`; current Capacitor Android Gradle config requires JDK 21 for reproducible rebuild.
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


## Android facts
- App/package: `vn.deskboost.app`.
- Capacitor Android present.
- `minSdkVersion=24`, `targetSdkVersion=36`.
- Permission found: `INTERNET`.
- Debug APK exists; no release-signed AAB found.
- Current Java 8 blocks reproducible Android rebuild; use JDK 21 because generated `FE/android/app/capacitor.build.gradle` uses `JavaVersion.VERSION_21`.
- `android:allowBackup=false` applied in CP-11 for external tester safety.

Debug build runbook: [android-build-runbook.md](android-build-runbook.md).
Release signing runbook: [android-release-signing.md](android-release-signing.md).
Google OAuth Android verification: [google-oauth-android-verification.md](google-oauth-android-verification.md).

## CP-10 Android reproducible debug build notes

Status: CP-10: IMPLEMENTED - NEEDS REVIEW. Local debug rebuild is blocked by local JDK 8 until JDK 21 is selected.

Verified local toolchain:
- Node.js `v22.18.0`.
- npm `10.9.3`.
- Capacitor CLI `8.4.0`.
- Java `1.8.0_421`.
- javac `1.8.0_421`.
- `JAVA_HOME=C:\Program Files\Java\jdk-1.8`.
- Gradle wrapper `8.14.3`; launcher/daemon JVM uses Java 8 when run in the current shell.

Android config inventory:
- `applicationId` / namespace: `vn.deskboost.app`.
- `minSdkVersion=24`, `compileSdkVersion=36`, `targetSdkVersion=36`.
- `versionCode=1`, `versionName=1.0`.
- Permission: `android.permission.INTERNET`.
- `android:allowBackup="false"` is applied for external tester safety.
- No release signing/keystore config added in CP-10.
- `google-services.json` is optional/local and remains untracked.

Debug build command path is documented in the runbook. CP-10 does not create release signing, release AAB, keystore, or OAuth SHA changes.

## Track status
| Track | Status | Blockers |
|---|---|---|
| Debug APK | PARTIAL | Existing artifact only; rebuild blocked by Java 8. |
| Release AAB | PENDING | CP-11 signing config/runbook added; local JDK 21 and human-managed upload key required before signed AAB build. |
| Internal Testing | NOT READY | Signed AAB, privacy URL, Data Safety, account deletion, OAuth SHA matrix completion. |
| Production | NOT READY | Internal test + pre-launch + monitoring + no P0/P1. |

## Dependency Graph

```text
P0 Baseline/freeze
  ↓
P1 Secret/repo cleanup
  ↓
P2 Backend critical hardening
  ↓
P3 FE/mobile hardening
  ↓
P5 Android reproducible build → P6 signed AAB → P7 OAuth verification
  ↓                                      ↘
P8 Privacy/Data Safety/Deletion → P11 Release test → P12 Play submission
  ↓                              ↓
P9 Public GitHub docs            P13 Monitoring/hotfix
  ↓
P10 Production deploy config
```

## Release Gates

### Gate A — Safe to continue development
- Secret rotated/revoked.
- Sensitive files no longer active-tracked.
- AI debug endpoints closed.
- Swagger prod policy applied.
- Baseline branch/tag exists.

### Gate B — Safe for public GitHub
- Secret scan active tree + history pass or documented private-history exception.
- Logs/local configs/build artifacts untracked.
- README/LICENSE/env examples/SECURITY/privacy link complete.
- No credential in docs/examples.

### Gate C — Safe for external APK testers
- Production API configured.
- Rate limits + upload/AI body limits live.
- Auth/logout/session UX works.
- Android build reproducible.
- `android:allowBackup` decision applied.
- Google Login verified or email-login fallback documented.
- Privacy link visible.

### Gate D — Safe for Play Internal Testing
- Signed `.aab` uploaded.
- Privacy Policy URL + Data Safety draft done.
- Account deletion path available.
- Store listing basics complete.
- Release smoke pass.
- OAuth SHA matrix verified.

### Gate E — Safe for Production rollout
- Internal/pre-launch report reviewed.
- No unresolved P0/P1 or documented exception.
- Monitoring/rollback/support/deletion handling ready.
- Staged rollout plan ready.

## CP-11 Android release signing notes

Status: CP-11: IMPLEMENTED - NEEDS REVIEW. Gate D remains pending.

Implemented:
- Release signing config reads local ignored `FE/android/keystore.properties` when present.
- Release tasks fail clearly when signing properties are missing instead of silently producing an unsigned release.
- `FE/android/keystore.properties.example` contains placeholders only.
- `android:allowBackup="false"` is applied for external tester safety.
- npm scripts added for release assemble and release bundle tasks.
- No real keystore, passwords, AAB, APK, Play upload, or OAuth SHA change was created.

AAB status:
- Not created in CP-11 on this machine.
- Blocked first by local Java 8 until JDK 21 is selected.
- After JDK 21, release AAB also requires a human-created local upload key and `FE/android/keystore.properties`.

## CP-12 Google OAuth Android verification notes

Status: CP-12: IMPLEMENTED - NEEDS REVIEW. Gate D remains pending.

Implemented:
- Audited web Google login, native Android Google login, backend ID token verification, and Android package identity.
- Confirmed package/application/namespace identity is `vn.deskboost.app`.
- Added Google OAuth Android verification runbook with debug/upload/Play SHA collection commands, Google Cloud Console checklist, backend audience checklist, test matrix, and troubleshooting.
- `google-services.json` is not required for the current ID-token-to-backend login flow; it remains ignored if future Firebase/Push/plugin flows require it.

SHA status:
- Debug keystore exists locally and debug SHA command returns SHA-1/SHA-256; values are not recorded in repo docs.
- Upload key SHA is blocked until the human creates the upload key from CP-11.
- Play App Signing SHA is blocked until a signed AAB is uploaded and Play App Signing is enabled.

Remaining:
- Select JDK 21.
- Create upload key and signed AAB.
- Configure Google Cloud Android OAuth clients with debug/upload/Play SHA fingerprints.
- Complete Play App Signing, privacy/Data Safety, account deletion, and release smoke.

## CP-13 privacy, Data Safety, and account deletion notes

Status: CP-13: IMPLEMENTED - NEEDS REVIEW. Gate D remains pending.

Implemented:
- Root privacy policy draft added at `PRIVACY.md`.
- Public Privacy Policy route added at `/privacy`.
- Public manual account deletion request route added at `/account-deletion`.
- Account deletion documentation added at `docs/ACCOUNT_DELETION.md`.
- Google Play Data Safety draft added at `docs/release/google-play-data-safety-draft.md`.
- Privacy data inventory expanded with data type, sharing, purpose, required/optional, HTTPS, deletion, retention, and processor columns.
- Login/register/profile/AI pages now link to privacy/deletion information or disclose AI/image third-party processing.

Important constraints:
- Account deletion is currently a manual deletion request workflow, not automated deletion.
- Support/contact is still a TODO placeholder and must be replaced before Play submission.
- Legal review and Play Console final Data Safety entry are still required.

Remaining for Gate D:
- Replace placeholder support/contact.
- Legal/product owner review of privacy policy and deletion copy.
- Final Data Safety entry in Play Console.
- Operational owner/process for deletion requests.
- Signed AAB/JDK/upload key work remains pending from CP-11.

## CP-14 public repository documentation notes

Status: CP-14: IMPLEMENTED - NEEDS REVIEW. Gate B remains pending manual security actions.

Implemented:
- Root public README added with MVP status, setup, validation, release blockers, privacy, and known limitations.
- MIT `LICENSE`, `SECURITY.md`, and `CHANGELOG.md` added.
- `FE/README.md` replaced with DeskBoost-specific frontend setup/build/mobile notes.
- `docs/README.md` updated with a public documentation index.
- Release tracker updated for public GitHub documentation readiness.

Important constraints:
- Public GitHub readiness is not claimed.
- No production URL, demo credentials, support email, or secret values were added.
- No production code, backend behavior, Android signing, OAuth, or router mode was changed.

Remaining for Gate B:
- Rotate/revoke exposed keys.
- Complete Git history secret scan and decide whether purge/rewrite is required.
- Validate a fresh clone using example configuration only.
- Replace official support/security contact placeholders.

## CP-15 production deployment runbook notes

Status: CP-15: IMPLEMENTED - NEEDS REVIEW. Gate C and Gate D remain pending.

Implemented:
- Added `docs/release/production-deployment-runbook.md`.
- Documented Render-like/backend + static frontend + managed PostgreSQL topology with placeholders only.
- Documented FE web, mobile, and BE production env checklist.
- Documented CORS fail-fast expectations and Swagger production behavior.
- Documented database migration, backup, rollback, domain mapping, Android API base URL, free-tier caveats, and release smoke checklist.
- Linked/flagged older deployment docs so the CP-15 runbook is the source of truth.

Important constraints:
- No deploy, cloud resource, production URL, health endpoint, code change, Android signing, or OAuth change was made.
- Production readiness is not claimed.

Remaining:
- Manual secret rotation/history scan/fresh clone validation.
- Official support/security contact.
- Real deploy provider/environment setup.
- Production release smoke.
- JDK 21/upload key/signed AAB.
- Play Console listing/Data Safety final entry.

## CP-16A deployed public/unauth smoke notes

Status: CP-16A: IMPLEMENTED - NEEDS REVIEW. Gate C public/unauth smoke passed — ready for CP-16B.

Smoke timestamp:
- 2026-06-21 16:22:25 +07:00.

URLs tested:
- Web: `https://www.deskboost.io.vn`.
- API: `https://deskboost.onrender.com/api`.
- API origin: `https://deskboost.onrender.com`.

Public frontend route results:
- `/` -> 200.
- `/privacy` -> 200.
- `/account-deletion` -> 200.
- `/login` -> 200.
- `/register` -> 200.

Backend unauth/security results:
- `GET /api/auth/me` without auth -> 401, expected safe unauth response.
- `OPTIONS /api/auth/me` from `https://www.deskboost.io.vn` -> 204 with `Access-Control-Allow-Origin: https://www.deskboost.io.vn` and `Access-Control-Allow-Methods: GET`.
- `/swagger` -> 404, expected. Old blocker fixed.
- `/swagger/index.html` -> 404, expected. Old blocker fixed.
- `/api/test-gemini` -> 404, expected. Old blocker fixed.
- `/api/test-plantid` -> 404, expected. Old blocker fixed.

Pending by scope:
- Auth/register/session smoke: pending for CP-16B because no test credentials were provided.
- Supabase indirect verification: pending until auth/register smoke succeeds.
- Google Login: login page/docs checked only; real web/native Google login remains manual/pending.
- Upload/AI/admin smoke: pending for CP-16B because credentials/quota/admin approval were not provided.

Remaining:
- Manual key rotation/history scan/fresh clone validation.
- Official support/security contact.
- JDK 21/upload key/signed AAB.
- OAuth Android SHA with real debug/upload/Play certs.
- Play Console Data Safety/listing.
