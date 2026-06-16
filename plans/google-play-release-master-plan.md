# DeskBoost Production & Google Play Release Master Plan

Date: 2026-06-12
Repo: `D:\FPT\KY7\EXE101\deskboost`
Mode: planning/docs only; no production code changes.

Context recall: AgentMemory says DeskBoost is a student startup MVP/EXE-Capstone plant-care marketplace using React+Vite FE, .NET 8 API, PostgreSQL, Capacitor Android `vn.deskboost.app`, Gemini/Plant.id/Cloudinary. Anh owns FE/mobile/release; Tuấn owns backend. Repository inspection above is source of truth.

Release objective: public website → public GitHub → Android Internal Testing → Closed/Open Testing → Production rollout.

## Release Scope Freeze
Allowed: security, repo cleanup, build reproducibility, privacy/compliance, minimal release UX, performance without redesign.
Not allowed: payment/order/shipping, native rewrite, new marketplace features, admin redesign, AI feature expansion.

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

## Key Release Decisions

| Decision | Recommended option | Reason | Trade-off | Required before |
|---|---|---|---|---|
| JWT localStorage | Keep for MVP + hardening | Lowest regression for web+Capacitor | XSS residual risk | Gate C |
| Native secure storage | Not required before Internal; target before Production if time | Plugin/migration risk | Less secure | Gate E preferred |
| AI debug | Delete or dev-gate; prefer delete | No prod value | Lose quick debug route | Gate A |
| Swagger | Development-only | Simple/safe | No prod Swagger | Gate A |
| Rate limit | Hybrid IP + userId | Fair + protects quota | More config | Gate C |
| Account deletion | Web request URL + in-app link for Internal; backend deletion later | Fast Play compliance | Manual ops initially | Gate D/E |
| Admin audit | Structured logs + guards for MVP; DB audit later | Fits MVP | Less searchable | Gate E |
| Code splitting | Before Internal if feasible | Large bundle but not security blocker | Route smoke needed | Gate D |
| `allowBackup` | Set false before testers | Protect app data | No Android backup | Gate C |
| `google-services.json` | Not assumed required | Current flow uses SocialLogin + webClientId ID token | Verify plugin docs | Gate C/D |
| CDN fonts/icons | Audit now; localize critical assets before Production if broken | Avoid redesign | Offline aesthetics risk | Gate E |
| Play App Signing | Use Play App Signing + backed-up upload key | Standard recovery | Google manages signing cert | Gate D |
| Public GitHub timing | After Gate B, before/independent of Play Internal | Avoid leaking secrets | Docs upfront | Gate B |
| Acceptable MVP risk | localStorage hardened, no payment/order, no native push, manual deletion request initially | Student MVP/free-tier fit | Must disclose | Gate C/D |

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

## PHASE 0 — Baseline, Backup và Release Freeze

### P0-01 — Baseline branch/tag and release freeze
Task ID: P0-01
Task name: Baseline branch/tag and release freeze
Priority: P1 High
Severity addressed: Release safety
Owner: Release Owner
Dependencies: None
Goal: Create baseline before cleanup/history operations.
Why this matters: Required for safe public/Play release; prevents regressions, leaks, or reviewer rejection.
Current evidence: `git status` clean; main tracks origin/main.
Repository locations to inspect: repo root, git remotes, plans/
Expected files to change: docs only / tag manually
Implementation approach: Create branch `release/google-play-hardening`, tag `deskboost-pre-google-play-cleanup`, freeze scope.
Out of scope: New feature work, redesign, unrelated refactor, hardcoded secrets.
Risks: Regression, accidental credential exposure, scope creep.
Rollback strategy: Revert scoped commit or restore baseline branch/tag; never restore revoked secrets.
Validation commands: `git status --short --branch; git tag --list`
Manual test cases: Follow related flow in browser/APK; verify error/success state; record evidence.
Definition of Done: Validation passes, evidence recorded, no unrelated files changed, release gate condition satisfied.
Artifacts/documents produced: Tracker evidence + related release doc update.
Codex suitability: Yes
Recommended Codex mode: Audit → Plan ngắn → Implement → Validate → Report
Estimated complexity: S
Release Gate: Gate A


### P0-02 — Baseline validation record
Task ID: P0-02
Task name: Baseline validation record
Priority: P1 High
Severity addressed: Release quality
Owner: Release Owner
Dependencies: P0-01
Goal: Record current build/test baseline.
Why this matters: Required for safe public/Play release; prevents regressions, leaks, or reviewer rejection.
Current evidence: FE lint/build/mobile pass; BE build pass; Java 8; debug APK exists.
Repository locations to inspect: FE/package.json, BE/DeskBoost.sln, FE/android
Expected files to change: docs/release/google-play-readiness.md
Implementation approach: Run validation commands; summarize outputs.
Out of scope: New feature work, redesign, unrelated refactor, hardcoded secrets.
Risks: Regression, accidental credential exposure, scope creep.
Rollback strategy: Revert scoped commit or restore baseline branch/tag; never restore revoked secrets.
Validation commands: `cd FE && npm run lint && npm run build && npm run build:mobile; cd ../BE/DeskBoost && dotnet build DeskBoost.sln --nologo; java -version`
Manual test cases: Follow related flow in browser/APK; verify error/success state; record evidence.
Definition of Done: Validation passes, evidence recorded, no unrelated files changed, release gate condition satisfied.
Artifacts/documents produced: Tracker evidence + related release doc update.
Codex suitability: Yes
Recommended Codex mode: Audit → Plan ngắn → Implement → Validate → Report
Estimated complexity: S
Release Gate: Gate A


### P0-03 — Environment/secrets/artifact inventory
Task ID: P0-03
Task name: Environment/secrets/artifact inventory
Priority: P1 High
Severity addressed: Secret/release
Owner: Release Owner
Dependencies: P0-01
Goal: Inventory tracked sensitive/local/build artifacts.
Why this matters: Required for safe public/Play release; prevents regressions, leaks, or reviewer rejection.
Current evidence: Tracked `.agent/mcp.json`, `.playwright-mcp/*`, logs, `.env.mobile`.
Repository locations to inspect: root, FE, BE, FE/android
Expected files to change: plans/release-task-tracker.md
Implementation approach: Classify keep/remove/ignore/history-purge.
Out of scope: New feature work, redesign, unrelated refactor, hardcoded secrets.
Risks: Regression, accidental credential exposure, scope creep.
Rollback strategy: Revert scoped commit or restore baseline branch/tag; never restore revoked secrets.
Validation commands: `git ls-files | grep -Ei "env|mcp|log|apk|aab|jks|keystore|settings.local"`
Manual test cases: Follow related flow in browser/APK; verify error/success state; record evidence.
Definition of Done: Validation passes, evidence recorded, no unrelated files changed, release gate condition satisfied.
Artifacts/documents produced: Tracker evidence + related release doc update.
Codex suitability: Yes
Recommended Codex mode: Audit → Plan ngắn → Implement → Validate → Report
Estimated complexity: S
Release Gate: Gate B
## PHASE 1 — Emergency Secret and Repository Cleanup

### P1-01 — Rotate exposed keys
Task ID: P1-01
Task name: Rotate exposed keys
Priority: P0 Critical
Severity addressed: Secret exposure
Owner: Anh/Release Owner
Dependencies: P0-03
Goal: Rotate/revoke any credential exposed in tracked/history docs.
Why this matters: Required for safe public/Play release; prevents regressions, leaks, or reviewer rejection.
Current evidence: `.agent/mcp.json` contains real-like Google API key; deploy docs have prod-looking DB password example.
Repository locations to inspect: Google Cloud Console, hosting env, docs
Expected files to change: none or docs only
Implementation approach: Manual rotate; document key names only, never values.
Out of scope: New feature work, redesign, unrelated refactor, hardcoded secrets.
Risks: Regression, accidental credential exposure, scope creep.
Rollback strategy: Revert scoped commit or restore baseline branch/tag; never restore revoked secrets.
Validation commands: `Manual console check + app smoke`
Manual test cases: Follow related flow in browser/APK; verify error/success state; record evidence.
Definition of Done: Validation passes, evidence recorded, no unrelated files changed, release gate condition satisfied.
Artifacts/documents produced: Tracker evidence + related release doc update.
Codex suitability: No; manual
Recommended Codex mode: Audit → Plan ngắn → Implement → Validate → Report
Estimated complexity: M
Release Gate: Gate A


### P1-02 — Untrack local/secret/build files
Task ID: P1-02
Task name: Untrack local/secret/build files
Priority: P0 Critical
Severity addressed: Public repo
Owner: Release Owner
Dependencies: P1-01
Goal: Remove sensitive/local files from index and prevent recurrence.
Why this matters: Required for safe public/Play release; prevents regressions, leaks, or reviewer rejection.
Current evidence: `git ls-files` shows mcp/log/settings/env.mobile tracked.
Repository locations to inspect: .gitignore, FE/.gitignore, tracked file list
Expected files to change: .gitignore, env examples, remove/untrack files
Implementation approach: Use `git rm --cached`/`git rm`; add `.env.example`; keep secrets local.
Out of scope: New feature work, redesign, unrelated refactor, hardcoded secrets.
Risks: Regression, accidental credential exposure, scope creep.
Rollback strategy: Revert scoped commit or restore baseline branch/tag; never restore revoked secrets.
Validation commands: `git status; git ls-files | grep -Ei "mcp|env|log|settings.local|apk|aab|jks"`
Manual test cases: Follow related flow in browser/APK; verify error/success state; record evidence.
Definition of Done: Validation passes, evidence recorded, no unrelated files changed, release gate condition satisfied.
Artifacts/documents produced: Tracker evidence + related release doc update.
Codex suitability: Yes
Recommended Codex mode: Audit → Plan ngắn → Implement → Validate → Report
Estimated complexity: M
Release Gate: Gate B


### P1-03 — Git history secret purge plan
Task ID: P1-03
Task name: Git history secret purge plan
Priority: P0 Critical
Severity addressed: Secret history
Owner: Release Owner
Dependencies: P1-02
Goal: Purge secrets from git history if committed/pushed.
Why this matters: Required for safe public/Play release; prevents regressions, leaks, or reviewer rejection.
Current evidence: Tracked secret file implies committed history risk.
Repository locations to inspect: git log --all, remote state
Expected files to change: docs/release/security-remediation-plan.md
Implementation approach: Audit; if pushed, use filter-repo/BFG only after backup+approval.
Out of scope: New feature work, redesign, unrelated refactor, hardcoded secrets.
Risks: Regression, accidental credential exposure, scope creep.
Rollback strategy: Revert scoped commit or restore baseline branch/tag; never restore revoked secrets.
Validation commands: `git log --all --name-only | grep -Ei "mcp|env|secret"; gitleaks/trufflehog`
Manual test cases: Follow related flow in browser/APK; verify error/success state; record evidence.
Definition of Done: Validation passes, evidence recorded, no unrelated files changed, release gate condition satisfied.
Artifacts/documents produced: Tracker evidence + related release doc update.
Codex suitability: Audit first
Recommended Codex mode: Audit → Plan ngắn → Implement → Validate → Report
Estimated complexity: L
Release Gate: Gate B


### P1-04 — Secret scanner and ignore hardening
Task ID: P1-04
Task name: Secret scanner and ignore hardening
Priority: P1 High
Severity addressed: Secret recurrence
Owner: Release Owner
Dependencies: P1-02
Goal: Add ignore rules and scanning checklist.
Why this matters: Required for safe public/Play release; prevents regressions, leaks, or reviewer rejection.
Current evidence: .gitignore lacks `.env.mobile`, `.playwright-mcp`, APK/AAB/keystore ignores.
Repository locations to inspect: .gitignore, docs
Expected files to change: `.gitignore`, docs
Implementation approach: Add ignore patterns; optional gitleaks/trufflehog config.
Out of scope: New feature work, redesign, unrelated refactor, hardcoded secrets.
Risks: Regression, accidental credential exposure, scope creep.
Rollback strategy: Revert scoped commit or restore baseline branch/tag; never restore revoked secrets.
Validation commands: `git check-ignore; git grep secret patterns`
Manual test cases: Follow related flow in browser/APK; verify error/success state; record evidence.
Definition of Done: Validation passes, evidence recorded, no unrelated files changed, release gate condition satisfied.
Artifacts/documents produced: Tracker evidence + related release doc update.
Codex suitability: Yes
Recommended Codex mode: Audit → Plan ngắn → Implement → Validate → Report
Estimated complexity: S
Release Gate: Gate B


### P1-05 — Safe env examples
Task ID: P1-05
Task name: Safe env examples
Priority: P1 High
Severity addressed: Public docs
Owner: Documentation
Dependencies: P1-02
Goal: Provide templates without secrets.
Why this matters: Required for safe public/Play release; prevents regressions, leaks, or reviewer rejection.
Current evidence: FE `.env.mobile` tracked; no robust root env examples.
Repository locations to inspect: FE/.env*, appsettings.json
Expected files to change: FE/.env.example, BE appsettings example/docs
Implementation approach: Create placeholder-only examples and explain public client IDs vs secrets.
Out of scope: New feature work, redesign, unrelated refactor, hardcoded secrets.
Risks: Regression, accidental credential exposure, scope creep.
Rollback strategy: Revert scoped commit or restore baseline branch/tag; never restore revoked secrets.
Validation commands: `grep examples for real-like keys/passwords`
Manual test cases: Follow related flow in browser/APK; verify error/success state; record evidence.
Definition of Done: Validation passes, evidence recorded, no unrelated files changed, release gate condition satisfied.
Artifacts/documents produced: Tracker evidence + related release doc update.
Codex suitability: Yes
Recommended Codex mode: Audit → Plan ngắn → Implement → Validate → Report
Estimated complexity: S
Release Gate: Gate B
## PHASE 2 — Backend Production Security Hardening

### P2-01 — Remove/dev-gate AI debug endpoints
Task ID: P2-01
Task name: Remove/dev-gate AI debug endpoints
Priority: P0 Critical
Severity addressed: Public quota/security
Owner: Tuấn/BE
Dependencies: P1-01
Goal: Ensure `/api/test-gemini`, `/api/test-plantid` unavailable in prod.
Why this matters: Required for safe public/Play release; prevents regressions, leaks, or reviewer rejection.
Current evidence: `AiDebugController.cs` public unauth route.
Repository locations to inspect: AiDebugController.cs, Program.cs
Expected files to change: AiDebugController.cs
Implementation approach: Recommended: delete for MVP; alt: Development-only gate.
Out of scope: New feature work, redesign, unrelated refactor, hardcoded secrets.
Risks: Regression, accidental credential exposure, scope creep.
Rollback strategy: Revert scoped commit or restore baseline branch/tag; never restore revoked secrets.
Validation commands: `dotnet build; grep test routes; prod smoke 404`
Manual test cases: Follow related flow in browser/APK; verify error/success state; record evidence.
Definition of Done: Validation passes, evidence recorded, no unrelated files changed, release gate condition satisfied.
Artifacts/documents produced: Tracker evidence + related release doc update.
Codex suitability: Yes
Recommended Codex mode: Audit → Plan ngắn → Implement → Validate → Report
Estimated complexity: S
Release Gate: Gate A


### P2-02 — Swagger development-only
Task ID: P2-02
Task name: Swagger development-only
Priority: P1 High
Severity addressed: API exposure
Owner: Tuấn/BE
Dependencies: P2-01
Goal: Disable public Swagger in production.
Why this matters: Required for safe public/Play release; prevents regressions, leaks, or reviewer rejection.
Current evidence: Program.cs unconditional `UseSwagger/UseSwaggerUI`.
Repository locations to inspect: Program.cs
Expected files to change: Program.cs
Implementation approach: Wrap Swagger in `if (app.Environment.IsDevelopment())`.
Out of scope: New feature work, redesign, unrelated refactor, hardcoded secrets.
Risks: Regression, accidental credential exposure, scope creep.
Rollback strategy: Revert scoped commit or restore baseline branch/tag; never restore revoked secrets.
Validation commands: `dotnet build; prod /swagger => 404; dev /swagger works`
Manual test cases: Follow related flow in browser/APK; verify error/success state; record evidence.
Definition of Done: Validation passes, evidence recorded, no unrelated files changed, release gate condition satisfied.
Artifacts/documents produced: Tracker evidence + related release doc update.
Codex suitability: Yes
Recommended Codex mode: Audit → Plan ngắn → Implement → Validate → Report
Estimated complexity: S
Release Gate: Gate A


### P2-03 — CORS fail-closed
Task ID: P2-03
Task name: CORS fail-closed
Priority: P1 High
Severity addressed: CORS security
Owner: Tuấn/BE
Dependencies: P2-02
Goal: Remove production `AllowAnyOrigin` fallback.
Why this matters: Required for safe public/Play release; prevents regressions, leaks, or reviewer rejection.
Current evidence: Program.cs falls back to open CORS.
Repository locations to inspect: Program.cs, appsettings, deploy docs
Expected files to change: Program.cs, env docs
Implementation approach: Development may allow open; Production requires explicit origins: local web, prod web, Capacitor.
Out of scope: New feature work, redesign, unrelated refactor, hardcoded secrets.
Risks: Regression, accidental credential exposure, scope creep.
Rollback strategy: Revert scoped commit or restore baseline branch/tag; never restore revoked secrets.
Validation commands: `dotnet build; prod missing origins fails or denies; configured origins pass`
Manual test cases: Follow related flow in browser/APK; verify error/success state; record evidence.
Definition of Done: Validation passes, evidence recorded, no unrelated files changed, release gate condition satisfied.
Artifacts/documents produced: Tracker evidence + related release doc update.
Codex suitability: Yes
Recommended Codex mode: Audit → Plan ngắn → Implement → Validate → Report
Estimated complexity: M
Release Gate: Gate C


### P2-04 — Rate limiting
Task ID: P2-04
Task name: Rate limiting
Priority: P1 High
Severity addressed: Abuse/cost
Owner: Tuấn/BE
Dependencies: P2-03
Goal: Add policies for auth/AI/upload.
Why this matters: Required for safe public/Play release; prevents regressions, leaks, or reviewer rejection.
Current evidence: No RateLimiter found.
Repository locations to inspect: Program.cs, Auth/Ai/Upload controllers
Expected files to change: Program.cs + attributes/policies
Implementation approach: Hybrid: IP for unauth; userId for auth. Suggested login/register/google 5/min/IP; refresh 20/min/IP; AI chat 10/min/user+hour cap; diagnose 3/min/user; upload 10/min/user.
Out of scope: New feature work, redesign, unrelated refactor, hardcoded secrets.
Risks: Regression, accidental credential exposure, scope creep.
Rollback strategy: Revert scoped commit or restore baseline branch/tag; never restore revoked secrets.
Validation commands: `dotnet build; over-limit returns 429 JSON`
Manual test cases: Follow related flow in browser/APK; verify error/success state; record evidence.
Definition of Done: Validation passes, evidence recorded, no unrelated files changed, release gate condition satisfied.
Artifacts/documents produced: Tracker evidence + related release doc update.
Codex suitability: Yes
Recommended Codex mode: Audit → Plan ngắn → Implement → Validate → Report
Estimated complexity: M
Release Gate: Gate C


### P2-05 — Request/upload/AI image hardening
Task ID: P2-05
Task name: Request/upload/AI image hardening
Priority: P1 High
Severity addressed: DoS/upload
Owner: Tuấn/BE
Dependencies: P2-04
Goal: Enforce body size, extension, MIME, magic bytes, timeouts.
Why this matters: Required for safe public/Play release; prevents regressions, leaks, or reviewer rejection.
Current evidence: AI uses `[DisableRequestSizeLimit]`; Upload MIME-only.
Repository locations to inspect: AiController, DiagnosisController, UploadController, PlantId/Gemini services
Expected files to change: BE controllers/helpers
Implementation approach: Limit multipart/image <=5MB; sanitize filenames; verify magic bytes; set HttpClient timeouts.
Out of scope: New feature work, redesign, unrelated refactor, hardcoded secrets.
Risks: Regression, accidental credential exposure, scope creep.
Rollback strategy: Revert scoped commit or restore baseline branch/tag; never restore revoked secrets.
Validation commands: `dotnet build; oversized/fake image => 400/413`
Manual test cases: Follow related flow in browser/APK; verify error/success state; record evidence.
Definition of Done: Validation passes, evidence recorded, no unrelated files changed, release gate condition satisfied.
Artifacts/documents produced: Tracker evidence + related release doc update.
Codex suitability: Yes
Recommended Codex mode: Audit → Plan ngắn → Implement → Validate → Report
Estimated complexity: M
Release Gate: Gate C


### P2-06 — Auth lifecycle FE/BE contract
Task ID: P2-06
Task name: Auth lifecycle FE/BE contract
Priority: P1 High
Severity addressed: Session security
Owner: Shared
Dependencies: P2-04
Goal: Make refresh/logout/revoke behavior end-to-end.
Why this matters: Required for safe public/Play release; prevents regressions, leaks, or reviewer rejection.
Current evidence: BE refresh/logout exists; FE logout clears storage only.
Repository locations to inspect: AuthController, Refresh/Logout handlers, FE authApi/AuthContext/authStorage
Expected files to change: FE auth files; docs
Implementation approach: Store/use refresh deliberately or document no refresh; call `/auth/logout`; clean tokens on 401.
Out of scope: New feature work, redesign, unrelated refactor, hardcoded secrets.
Risks: Regression, accidental credential exposure, scope creep.
Rollback strategy: Revert scoped commit or restore baseline branch/tag; never restore revoked secrets.
Validation commands: `npm lint/build; dotnet build; login-refresh-logout smoke`
Manual test cases: Follow related flow in browser/APK; verify error/success state; record evidence.
Definition of Done: Validation passes, evidence recorded, no unrelated files changed, release gate condition satisfied.
Artifacts/documents produced: Tracker evidence + related release doc update.
Codex suitability: Yes
Recommended Codex mode: Audit → Plan ngắn → Implement → Validate → Report
Estimated complexity: M
Release Gate: Gate C


### P2-07 — Admin safeguards
Task ID: P2-07
Task name: Admin safeguards
Priority: P1 High
Severity addressed: Privilege safety
Owner: Tuấn/BE
Dependencies: P2-06
Goal: Prevent self-delete/last-admin/unsafe role mutations.
Why this matters: Required for safe public/Play release; prevents regressions, leaks, or reviewer rejection.
Current evidence: Admin update/delete exist; no obvious guard/audit.
Repository locations to inspect: AdminController, Admin commands, User config
Expected files to change: Admin command handlers; logs
Implementation approach: Reject self-delete, last-admin delete/demote/disable; log admin actions; DB audit optional later.
Out of scope: New feature work, redesign, unrelated refactor, hardcoded secrets.
Risks: Regression, accidental credential exposure, scope creep.
Rollback strategy: Revert scoped commit or restore baseline branch/tag; never restore revoked secrets.
Validation commands: `dotnet build; manual self/last-admin cases`
Manual test cases: Follow related flow in browser/APK; verify error/success state; record evidence.
Definition of Done: Validation passes, evidence recorded, no unrelated files changed, release gate condition satisfied.
Artifacts/documents produced: Tracker evidence + related release doc update.
Codex suitability: Yes
Recommended Codex mode: Audit → Plan ngắn → Implement → Validate → Report
Estimated complexity: M
Release Gate: Gate E


### P2-08 — Logging/error hygiene
Task ID: P2-08
Task name: Logging/error hygiene
Priority: P2 Medium
Severity addressed: Observability/privacy
Owner: Tuấn/BE
Dependencies: P2-05
Goal: Safe errors + request correlation.
Why this matters: Required for safe public/Play release; prevents regressions, leaks, or reviewer rejection.
Current evidence: Exception middleware exists, no correlation ID found.
Repository locations to inspect: ExceptionHandlingMiddleware, Program.cs
Expected files to change: middleware/log docs
Implementation approach: Add request ID header, avoid token/secret logs, keep public errors safe.
Out of scope: New feature work, redesign, unrelated refactor, hardcoded secrets.
Risks: Regression, accidental credential exposure, scope creep.
Rollback strategy: Revert scoped commit or restore baseline branch/tag; never restore revoked secrets.
Validation commands: `dotnet build; error response safe; header present`
Manual test cases: Follow related flow in browser/APK; verify error/success state; record evidence.
Definition of Done: Validation passes, evidence recorded, no unrelated files changed, release gate condition satisfied.
Artifacts/documents produced: Tracker evidence + related release doc update.
Codex suitability: Yes
Recommended Codex mode: Audit → Plan ngắn → Implement → Validate → Report
Estimated complexity: S
Release Gate: Gate E
## PHASE 3 — Frontend and Mobile Web Security Hardening

### P3-01 — Frontend auth hardening MVP
Task ID: P3-01
Task name: Frontend auth hardening MVP
Priority: P1 High
Severity addressed: XSS/session
Owner: Anh/FE
Dependencies: P2-06
Goal: Harden localStorage path; defer secure storage unless time.
Why this matters: Required for safe public/Play release; prevents regressions, leaks, or reviewer rejection.
Current evidence: JWT localStorage verified.
Repository locations to inspect: FE/services/api.js, FE/utils/authStorage.js, AuthContext
Expected files to change: FE auth files/docs
Implementation approach: Decision: keep localStorage for MVP + logout revoke + CSP/no unsafe HTML/dependency audit; secure storage later.
Out of scope: New feature work, redesign, unrelated refactor, hardcoded secrets.
Risks: Regression, accidental credential exposure, scope creep.
Rollback strategy: Revert scoped commit or restore baseline branch/tag; never restore revoked secrets.
Validation commands: `npm lint/build; login/logout/session expiry smoke`
Manual test cases: Follow related flow in browser/APK; verify error/success state; record evidence.
Definition of Done: Validation passes, evidence recorded, no unrelated files changed, release gate condition satisfied.
Artifacts/documents produced: Tracker evidence + related release doc update.
Codex suitability: Yes
Recommended Codex mode: Audit → Plan ngắn → Implement → Validate → Report
Estimated complexity: M
Release Gate: Gate C


### P3-02 — External URL allowlist/mobile opening
Task ID: P3-02
Task name: External URL allowlist/mobile opening
Priority: P1 High
Severity addressed: Phishing/UX
Owner: Anh/FE
Dependencies: P3-01
Goal: Validate marketplace contact URLs.
Why this matters: Required for safe public/Play release; prevents regressions, leaks, or reviewer rejection.
Current evidence: ContactUrl exists; validation not proven.
Repository locations to inspect: Marketplace pages/services
Expected files to change: FE URL utility/pages
Implementation approach: Allow https/mailto/tel + known Zalo/Facebook; block javascript/unknown; show broken state.
Out of scope: New feature work, redesign, unrelated refactor, hardcoded secrets.
Risks: Regression, accidental credential exposure, scope creep.
Rollback strategy: Revert scoped commit or restore baseline branch/tag; never restore revoked secrets.
Validation commands: `npm lint/build; invalid URL blocked`
Manual test cases: Follow related flow in browser/APK; verify error/success state; record evidence.
Definition of Done: Validation passes, evidence recorded, no unrelated files changed, release gate condition satisfied.
Artifacts/documents produced: Tracker evidence + related release doc update.
Codex suitability: Yes
Recommended Codex mode: Audit → Plan ngắn → Implement → Validate → Report
Estimated complexity: M
Release Gate: Gate C


### P3-03 — Privacy/deletion/AI disclaimer UI links
Task ID: P3-03
Task name: Privacy/deletion/AI disclaimer UI links
Priority: P1 High
Severity addressed: Play compliance
Owner: Anh/FE
Dependencies: P8-01
Goal: Expose policy/deletion/disclaimer in UI.
Why this matters: Required for safe public/Play release; prevents regressions, leaks, or reviewer rejection.
Current evidence: No privacy/deletion link found.
Repository locations to inspect: Home/Login/Register/Profile/AI pages
Expected files to change: FE components/pages
Implementation approach: Add visible privacy policy, deletion request, AI disclaimer.
Out of scope: New feature work, redesign, unrelated refactor, hardcoded secrets.
Risks: Regression, accidental credential exposure, scope creep.
Rollback strategy: Revert scoped commit or restore baseline branch/tag; never restore revoked secrets.
Validation commands: `npm lint/build; links reachable`
Manual test cases: Follow related flow in browser/APK; verify error/success state; record evidence.
Definition of Done: Validation passes, evidence recorded, no unrelated files changed, release gate condition satisfied.
Artifacts/documents produced: Tracker evidence + related release doc update.
Codex suitability: Yes
Recommended Codex mode: Audit → Plan ngắn → Implement → Validate → Report
Estimated complexity: S
Release Gate: Gate D


### P3-04 — Mobile error/session/back UX
Task ID: P3-04
Task name: Mobile error/session/back UX
Priority: P2 Medium
Severity addressed: APK reliability
Owner: Anh/FE
Dependencies: P3-01
Goal: Improve APK error states without redesign.
Why this matters: Required for safe public/Play release; prevents regressions, leaks, or reviewer rejection.
Current evidence: Friendly errors partial; Android back/offline not verified.
Repository locations to inspect: AuthContext, api.js, routes/layouts
Expected files to change: FE UX only
Implementation approach: Session expired, network, quota, upload failure, Android back smoke.
Out of scope: New feature work, redesign, unrelated refactor, hardcoded secrets.
Risks: Regression, accidental credential exposure, scope creep.
Rollback strategy: Revert scoped commit or restore baseline branch/tag; never restore revoked secrets.
Validation commands: `npm lint/build; manual APK tests`
Manual test cases: Follow related flow in browser/APK; verify error/success state; record evidence.
Definition of Done: Validation passes, evidence recorded, no unrelated files changed, release gate condition satisfied.
Artifacts/documents produced: Tracker evidence + related release doc update.
Codex suitability: Yes
Recommended Codex mode: Audit → Plan ngắn → Implement → Validate → Report
Estimated complexity: M
Release Gate: Gate C
## PHASE 4 — Build Performance and Mobile Reliability

### P4-01 — Route-level code splitting
Task ID: P4-01
Task name: Route-level code splitting
Priority: P2 Medium
Severity addressed: Performance
Owner: Anh/FE
Dependencies: P3-01
Goal: Reduce initial bundle.
Why this matters: Required for safe public/Play release; prevents regressions, leaks, or reviewer rejection.
Current evidence: Build main chunk ~762kB.
Repository locations to inspect: AppRouter.tsx, pages/admin, AI pages
Expected files to change: AppRouter lazy imports
Implementation approach: Lazy admin/AI/market/dashboard routes; preserve UI.
Out of scope: New feature work, redesign, unrelated refactor, hardcoded secrets.
Risks: Regression, accidental credential exposure, scope creep.
Rollback strategy: Revert scoped commit or restore baseline branch/tag; never restore revoked secrets.
Validation commands: `npm build; initial chunk target <500kB; route smoke`
Manual test cases: Follow related flow in browser/APK; verify error/success state; record evidence.
Definition of Done: Validation passes, evidence recorded, no unrelated files changed, release gate condition satisfied.
Artifacts/documents produced: Tracker evidence + related release doc update.
Codex suitability: Yes
Recommended Codex mode: Audit → Plan ngắn → Implement → Validate → Report
Estimated complexity: M
Release Gate: Gate D


### P4-02 — CDN/font/icon asset audit
Task ID: P4-02
Task name: CDN/font/icon asset audit
Priority: P2 Medium
Severity addressed: Mobile reliability
Owner: Anh/FE
Dependencies: P4-01
Goal: Reduce critical network asset dependency.
Why this matters: Required for safe public/Play release; prevents regressions, leaks, or reviewer rejection.
Current evidence: Prior docs mention CDN risk; exact runtime needs final check.
Repository locations to inspect: FE/index.html, public, dist
Expected files to change: docs or asset changes
Implementation approach: Audit first; localize critical assets if low risk.
Out of scope: New feature work, redesign, unrelated refactor, hardcoded secrets.
Risks: Regression, accidental credential exposure, scope creep.
Rollback strategy: Revert scoped commit or restore baseline branch/tag; never restore revoked secrets.
Validation commands: `npm build; offline/network-block smoke`
Manual test cases: Follow related flow in browser/APK; verify error/success state; record evidence.
Definition of Done: Validation passes, evidence recorded, no unrelated files changed, release gate condition satisfied.
Artifacts/documents produced: Tracker evidence + related release doc update.
Codex suitability: Yes
Recommended Codex mode: Audit → Plan ngắn → Implement → Validate → Report
Estimated complexity: S
Release Gate: Gate E
## PHASE 5 — Android Build Environment and Reproducible Build

### P5-01 — Android reproducible build
Task ID: P5-01
Task name: Android reproducible build
Priority: P1 High
Severity addressed: Build release
Owner: Anh/FE
Dependencies: P1-02
Goal: Clean clone can build Android.
Why this matters: Required for safe public/Play release; prevents regressions, leaks, or reviewer rejection.
Current evidence: Java 8; Gradle needs 11+; debug APK exists.
Repository locations to inspect: FE/package.json, FE/android/*
Expected files to change: docs/scripts optional
Implementation approach: Recommend JDK17, JAVA_HOME, SDK, Node/npm, cap sync, clean/debug build, Windows errors.
Out of scope: New feature work, redesign, unrelated refactor, hardcoded secrets.
Risks: Regression, accidental credential exposure, scope creep.
Rollback strategy: Revert scoped commit or restore baseline branch/tag; never restore revoked secrets.
Validation commands: `java -version; npm run build:mobile; npx cap sync android; gradlew assembleDebug`
Manual test cases: Follow related flow in browser/APK; verify error/success state; record evidence.
Definition of Done: Validation passes, evidence recorded, no unrelated files changed, release gate condition satisfied.
Artifacts/documents produced: Tracker evidence + related release doc update.
Codex suitability: Yes
Recommended Codex mode: Audit → Plan ngắn → Implement → Validate → Report
Estimated complexity: M
Release Gate: Gate C
## PHASE 6 — Android Release Signing and AAB

### P6-01 — Release signing and AAB
Task ID: P6-01
Task name: Release signing and AAB
Priority: P1 High
Severity addressed: Play release
Owner: Release Owner
Dependencies: P5-01
Goal: Generate release-signed `.aab` safely.
Why this matters: Required for safe public/Play release; prevents regressions, leaks, or reviewer rejection.
Current evidence: No signing config/AAB found.
Repository locations to inspect: FE/android/app/build.gradle, .gitignore
Expected files to change: Gradle signing config/docs; no keystore commit
Implementation approach: Manual keystore; ignored `keystore.properties` or env vars; versionCode/versionName; bundleRelease; backup upload key.
Out of scope: New feature work, redesign, unrelated refactor, hardcoded secrets.
Risks: Regression, accidental credential exposure, scope creep.
Rollback strategy: Revert scoped commit or restore baseline branch/tag; never restore revoked secrets.
Validation commands: `gradlew bundleRelease; verify signed bundle`
Manual test cases: Follow related flow in browser/APK; verify error/success state; record evidence.
Definition of Done: Validation passes, evidence recorded, no unrelated files changed, release gate condition satisfied.
Artifacts/documents produced: Tracker evidence + related release doc update.
Codex suitability: Yes
Recommended Codex mode: Audit → Plan ngắn → Implement → Validate → Report
Estimated complexity: M
Release Gate: Gate D
## PHASE 7 — Google OAuth Android Verification

### P7-01 — Google OAuth Android verification
Task ID: P7-01
Task name: Google OAuth Android verification
Priority: P1 High
Severity addressed: Login/Play
Owner: Shared
Dependencies: P6-01
Goal: Google Login works debug/release/Internal.
Why this matters: Required for safe public/Play release; prevents regressions, leaks, or reviewer rejection.
Current evidence: Google clients exist; SHA not documented; no release cert yet.
Repository locations to inspect: GoogleAuthService, nativeGoogleAuth, capacitor config, Google Cloud
Expected files to change: docs/env; code only if audience mismatch
Implementation approach: Collect debug/upload/Play app signing SHA-1/SHA-256; Android OAuth client package `vn.deskboost.app`; verify webClientId/audience. `google-services.json` not assumed required.
Out of scope: New feature work, redesign, unrelated refactor, hardcoded secrets.
Risks: Regression, accidental credential exposure, scope creep.
Rollback strategy: Revert scoped commit or restore baseline branch/tag; never restore revoked secrets.
Validation commands: `SHA commands; debug/release/internal login matrix`
Manual test cases: Follow related flow in browser/APK; verify error/success state; record evidence.
Definition of Done: Validation passes, evidence recorded, no unrelated files changed, release gate condition satisfied.
Artifacts/documents produced: Tracker evidence + related release doc update.
Codex suitability: Yes
Recommended Codex mode: Audit → Plan ngắn → Implement → Validate → Report
Estimated complexity: M
Release Gate: Gate C/D
## PHASE 8 — Privacy, Data Safety and Account Deletion

### P8-01 — Privacy/data inventory/policy draft
Task ID: P8-01
Task name: Privacy/data inventory/policy draft
Priority: P1 High
Severity addressed: Compliance
Owner: Documentation
Dependencies: P1-02
Goal: Prepare Privacy Policy + Data Safety source.
Why this matters: Required for safe public/Play release; prevents regressions, leaks, or reviewer rejection.
Current evidence: No policy/Data Safety docs found before plan.
Repository locations to inspect: entities/services/third-party integrations
Expected files to change: docs/release/privacy-data-inventory.md; PRIVACY later
Implementation approach: Inventory email/name/phone/avatar/images/AI chat/diagnosis/plants/reminders/feedback/logs; disclose Gemini/Plant.id/Cloudinary/Google.
Out of scope: New feature work, redesign, unrelated refactor, hardcoded secrets.
Risks: Regression, accidental credential exposure, scope creep.
Rollback strategy: Revert scoped commit or restore baseline branch/tag; never restore revoked secrets.
Validation commands: `Review inventory vs app flows`
Manual test cases: Follow related flow in browser/APK; verify error/success state; record evidence.
Definition of Done: Validation passes, evidence recorded, no unrelated files changed, release gate condition satisfied.
Artifacts/documents produced: Tracker evidence + related release doc update.
Codex suitability: Yes
Recommended Codex mode: Audit → Plan ngắn → Implement → Validate → Report
Estimated complexity: M
Release Gate: Gate D


### P8-02 — Account deletion path
Task ID: P8-02
Task name: Account deletion path
Priority: P1 High
Severity addressed: Play compliance
Owner: Shared
Dependencies: P8-01
Goal: Provide user deletion request/flow.
Why this matters: Required for safe public/Play release; prevents regressions, leaks, or reviewer rejection.
Current evidence: No deletion endpoint/UI/policy found.
Repository locations to inspect: UsersController, Profile, docs/site
Expected files to change: FE links/docs; backend later if selected
Implementation approach: MVP: web deletion request URL + in-app link for Internal; stronger deletion/anonymize before Production.
Out of scope: New feature work, redesign, unrelated refactor, hardcoded secrets.
Risks: Regression, accidental credential exposure, scope creep.
Rollback strategy: Revert scoped commit or restore baseline branch/tag; never restore revoked secrets.
Validation commands: `links reachable; deletion request tested`
Manual test cases: Follow related flow in browser/APK; verify error/success state; record evidence.
Definition of Done: Validation passes, evidence recorded, no unrelated files changed, release gate condition satisfied.
Artifacts/documents produced: Tracker evidence + related release doc update.
Codex suitability: Yes
Recommended Codex mode: Audit → Plan ngắn → Implement → Validate → Report
Estimated complexity: M
Release Gate: Gate D/E
## PHASE 9 — Public GitHub and Documentation Readiness

### P9-01 — Public GitHub docs package
Task ID: P9-01
Task name: Public GitHub docs package
Priority: P1 High
Severity addressed: Public repo
Owner: Documentation
Dependencies: P1-05
Goal: Make repo public-readable/safe.
Why this matters: Required for safe public/Play release; prevents regressions, leaks, or reviewer rejection.
Current evidence: No root README/LICENSE; FE README template.
Repository locations to inspect: root docs, FE README, docs
Expected files to change: README.md, LICENSE, SECURITY.md, PRIVACY.md/link, CHANGELOG
Implementation approach: Write overview, architecture, setup, env, DB migrations, FE/BE/Android build, deploy, demo account, limitations, AI disclaimer.
Out of scope: New feature work, redesign, unrelated refactor, hardcoded secrets.
Risks: Regression, accidental credential exposure, scope creep.
Rollback strategy: Revert scoped commit or restore baseline branch/tag; never restore revoked secrets.
Validation commands: `link/grep checks; setup dry-run`
Manual test cases: Follow related flow in browser/APK; verify error/success state; record evidence.
Definition of Done: Validation passes, evidence recorded, no unrelated files changed, release gate condition satisfied.
Artifacts/documents produced: Tracker evidence + related release doc update.
Codex suitability: Yes
Recommended Codex mode: Audit → Plan ngắn → Implement → Validate → Report
Estimated complexity: M
Release Gate: Gate B
## PHASE 10 — Deployment and Production Configuration

### P10-01 — Production deploy config/runbook
Task ID: P10-01
Task name: Production deploy config/runbook
Priority: P1 High
Severity addressed: Prod reliability
Owner: Shared
Dependencies: P2-03,P8-01
Goal: Production web/API/DB config is explicit and secret-safe.
Why this matters: Required for safe public/Play release; prevents regressions, leaks, or reviewer rejection.
Current evidence: Deploy docs exist but include risky examples.
Repository locations to inspect: DEPLOY docs, appsettings, Vite env
Expected files to change: docs/deploy/release docs
Implementation approach: Define FE API URL, BE env, DB migrate/backup, Cloudinary/Gemini/Plant.id, JWT, CORS, HTTPS, health, rollback, Android API URL.
Out of scope: New feature work, redesign, unrelated refactor, hardcoded secrets.
Risks: Regression, accidental credential exposure, scope creep.
Rollback strategy: Revert scoped commit or restore baseline branch/tag; never restore revoked secrets.
Validation commands: `deploy smoke checklist`
Manual test cases: Follow related flow in browser/APK; verify error/success state; record evidence.
Definition of Done: Validation passes, evidence recorded, no unrelated files changed, release gate condition satisfied.
Artifacts/documents produced: Tracker evidence + related release doc update.
Codex suitability: Yes
Recommended Codex mode: Audit → Plan ngắn → Implement → Validate → Report
Estimated complexity: M
Release Gate: Gate C
## PHASE 11 — Testing Strategy

### P11-01 — Release test matrix
Task ID: P11-01
Task name: Release test matrix
Priority: P1 High
Severity addressed: Release quality
Owner: Shared
Dependencies: P2-P10
Goal: Test release build, not only dev.
Why this matters: Required for safe public/Play release; prevents regressions, leaks, or reviewer rejection.
Current evidence: Baseline builds pass; no full release matrix evidence.
Repository locations to inspect: all app surfaces
Expected files to change: tracker/test report
Implementation approach: Run auth/plant/AI/market/reminder/admin/android/security matrix; record evidence.
Out of scope: New feature work, redesign, unrelated refactor, hardcoded secrets.
Risks: Regression, accidental credential exposure, scope creep.
Rollback strategy: Revert scoped commit or restore baseline branch/tag; never restore revoked secrets.
Validation commands: `matrix pass; no P0/P1 unresolved`
Manual test cases: Follow related flow in browser/APK; verify error/success state; record evidence.
Definition of Done: Validation passes, evidence recorded, no unrelated files changed, release gate condition satisfied.
Artifacts/documents produced: Tracker evidence + related release doc update.
Codex suitability: Yes
Recommended Codex mode: Audit → Plan ngắn → Implement → Validate → Report
Estimated complexity: L
Release Gate: Gate D/E
## PHASE 12 — Google Play Store Listing and Submission

### P12-01 — Play Console Internal Testing
Task ID: P12-01
Task name: Play Console Internal Testing
Priority: P1 High
Severity addressed: Google Play
Owner: Release Owner
Dependencies: P6,P7,P8,P11
Goal: Submit signed AAB to Internal Testing.
Why this matters: Required for safe public/Play release; prevents regressions, leaks, or reviewer rejection.
Current evidence: No AAB/listing/policy found.
Repository locations to inspect: Play Console, docs/assets
Expected files to change: store listing docs/assets
Implementation approach: Create app, upload AAB, listing, Data Safety, rating, app access, testers, review pre-launch report.
Out of scope: New feature work, redesign, unrelated refactor, hardcoded secrets.
Risks: Regression, accidental credential exposure, scope creep.
Rollback strategy: Revert scoped commit or restore baseline branch/tag; never restore revoked secrets.
Validation commands: `Play upload validation; install from Internal`
Manual test cases: Follow related flow in browser/APK; verify error/success state; record evidence.
Definition of Done: Validation passes, evidence recorded, no unrelated files changed, release gate condition satisfied.
Artifacts/documents produced: Tracker evidence + related release doc update.
Codex suitability: Manual
Recommended Codex mode: Audit → Plan ngắn → Implement → Validate → Report
Estimated complexity: L
Release Gate: Gate D
## PHASE 13 — Post-release Monitoring

### P13-01 — Post-release monitoring/hotfix
Task ID: P13-01
Task name: Post-release monitoring/hotfix
Priority: P2 Medium
Severity addressed: Ops
Owner: Shared
Dependencies: P12-01
Goal: Detect and recover from release issues.
Why this matters: Required for safe public/Play release; prevents regressions, leaks, or reviewer rejection.
Current evidence: No monitoring/hotfix plan found.
Repository locations to inspect: hosting logs, Play Console, docs
Expected files to change: docs/release/google-play-readiness.md
Implementation approach: Plan crash/ANR review, API errors, AI quota, backups, support, deletion requests, key rotation, dependency cadence.
Out of scope: New feature work, redesign, unrelated refactor, hardcoded secrets.
Risks: Regression, accidental credential exposure, scope creep.
Rollback strategy: Revert scoped commit or restore baseline branch/tag; never restore revoked secrets.
Validation commands: `monitoring checklist reviewed`
Manual test cases: Follow related flow in browser/APK; verify error/success state; record evidence.
Definition of Done: Validation passes, evidence recorded, no unrelated files changed, release gate condition satisfied.
Artifacts/documents produced: Tracker evidence + related release doc update.
Codex suitability: Yes
Recommended Codex mode: Audit → Plan ngắn → Implement → Validate → Report
Estimated complexity: S
Release Gate: Gate E

## Standard Codex Prompt Template

```text
You are Codex working in DeskBoost at D:\FPT\KY7\EXE101\deskboost.
Task: <Task ID + name>.

Requirements:
1. Recall AgentMemory/project notes before editing.
2. Read current repository files listed in the task.
3. Run `git status --short --branch` first.
4. Do not overwrite unrelated user changes.
5. Edit only task scope.
6. No redesign.
7. Do not change API contract outside scope.
8. Do not hardcode secrets.
9. Do not commit credentials, keystores, `.env`, logs, APK/AAB.
10. For large tasks: Audit → Plan ngắn → Implement → Validate → Report.
11. Run validation commands from the task.
12. Report files changed, summary, commands run, test results, remaining risks, manual actions.
13. Update durable project notes/AgentMemory only if long-term decisions changed.
```
