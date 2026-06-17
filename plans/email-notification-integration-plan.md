# DeskBoost Email Notification Integration Plan

> Scope: plan only. Không code trước khi duyệt. Repo audit thực hiện trên workspace hiện tại `D:\FPT\KY7\EXE101\deskboost`.

**Goal:** tích hợp email notification chuẩn cho 3 flow: forgot/reset password, watering reminder, admin email notification.

**Architecture:** tái dùng email provider hiện có/được cấu hình qua env. FE chỉ xử lý UX/token query; BE sở hữu token, lịch gửi, idempotency, audit log. MVP ưu tiên cron/background worker đơn giản, fail-safe, không bulk lớn.

**Tech stack:** React 19 + Vite 6 + React Router; .NET 8 Web API + MediatR + EF Core + PostgreSQL; Brevo API qua env.

---

## 1. Current state summary

### 1.1 Kết quả audit nhanh

| Câu hỏi | Trạng thái repo hiện tại | Evidence |
|---|---|---|
| FE routing có `/forgot-password` chưa? | Có | `FE/routes/AppRouter.tsx:54` |
| FE forgot page đã 2 mode chưa? | Có 2 step thủ công, nhưng chưa chuẩn token query | `FE/pages/ForgotPassword.jsx` dùng `step`, `resetToken` state, input `Token Reset (Dev)` luôn hiện |
| FE auth API service ở đâu? | `FE/services/authApi.js` | `forgotPassword(email)` → `POST /auth/forgot-password`; `resetPassword(token,newPassword)` → `POST /auth/reset-password` |
| Toast/message system? | Chưa thấy lib toast toàn cục; dùng inline `StateNotice` | `FE/components/UiState.jsx`; nhiều page dùng `StateNotice` |
| Notification app ở đâu? | In-app notification đã có | `FE/context/CareContext.jsx`, `FE/components/CareNotificationBell.jsx`, `FE/services/notificationApi.js` |
| Plant reminder/lịch tưới lưu module nào? | `Reminder` entity + `/api/reminders`; FE `RemindersSettings` | `BE/.../Entities/Reminder.cs`, `FE/services/reminderApi.js` |
| Backend có cron/background worker reminder chưa? | Chưa thấy | search `BackgroundService/IHostedService/Hangfire/Quartz/Cron` = 0 |
| Backend có admin notification endpoint chưa? | Có in-app notification, chưa email | `POST /api/admin/notifications` trong `AdminController.cs:617` |
| User có email/emailVerified/preferences chưa? | Có `Email`; chưa có `EmailVerified`/notification prefs | `User.cs` chỉ có email, password/google/profile/reset fields |
| Có notification/email log chưa? | Có `Notifications`, `NotificationReads`; chưa có email log | `Notification.cs`, `NotificationRead.cs`; không có `EmailLog` |
| Có chống gửi trùng reminder chưa? | Chỉ có `Reminder.IsSent`; thiếu `LastSentAt`/log/idempotency | `Reminder.cs:16` |

### 1.2 Discrepancy cần xác minh trước code

User context nói BE đã có Brevo API + env `Email__Provider=BrevoApi`, `Email__ExposeResetTokenInResponse=false`. Nhưng workspace hiện tại search không thấy `Brevo`, `IEmail`, `EmailOptions`, email sender service; `ForgotPasswordCommand.cs` vẫn có TODO gửi email và trả token.

**Kết luận:** có thể repo local đang stale so với backend deployed/branch khác. Trước code BE, Codex/Roo phải sync đúng branch hoặc confirm source of truth. FE Phase 1 vẫn làm được theo API contract mới vì không cần BE đổi contract.

### 1.3 Rủi ro security hiện tại

- `FE/pages/ForgotPassword.jsx` hiện nhận token từ response nếu `res.token` và hiển thị input `Token Reset (Dev)` → không phù hợp production.
- Reset page chưa đọc `?token=` từ URL.
- Sau reset dùng `navigate('/login')` sau timeout, chưa `replace: true`.
- Reset token có thể lưu trong component state; ok tạm, nhưng không được log/localStorage.
- BE workspace hiện tại có khả năng trả `resetToken`; nếu deployed đã tắt thì OK, nhưng repo cần đồng bộ.

---

## 2. Target architecture

### 2.1 Components

```text
FE ForgotPassword page
  ├─ mode=request: POST /api/auth/forgot-password
  └─ mode=reset: token from URL query only → POST /api/auth/reset-password

BE Auth
  ├─ generate opaque reset token
  ├─ store hashed token or token value + expiry (prefer hash if refactor allowed)
  ├─ email reset link via IEmailSender/Brevo
  └─ generic response, no token expose in prod

BE Reminder Email Worker
  ├─ scans due active pending reminders
  ├─ joins User + Plant
  ├─ checks preferences/unsubscribe/verified email if available
  ├─ sends via IEmailSender
  └─ writes EmailDeliveryLog/ReminderEmailLog idempotently

BE Admin Notification Email
  ├─ existing in-app Notification remains source for app bell
  ├─ optional sendEmail flag/channel=email
  ├─ admin guard + validation + rate limit
  └─ audit EmailDeliveryLog/AdminNotificationEmailBatch
```

### 2.2 Principles

- FE never exposes reset token except URL query already received.
- BE owns all secrets. No API key in FE/repo/logs.
- Email send best-effort for reminder/admin. Forgot-password request returns generic success even if email fails, but logs sanitized error server-side.
- Backward compatible: keep existing `/auth/forgot-password`, `/auth/reset-password`, `/admin/notifications`, `/notifications` contracts.
- MVP no large bulk email. Use capped batch sizes until queue exists.

---

## 3. Functional scope

### Phase 1 — Forgot password FE hardening

In scope:
- `/forgot-password` reads `token` query.
- No token query → email request form.
- Has token query → reset form only: `newPassword`, `confirmPassword`.
- Submit `POST /auth/reset-password` body `{ token, newPassword }`.
- Success: clear token state, navigate `/login` with `{ replace: true }`, show success notice via login route state or global notice if added.
- Invalid/expired: show `Link đặt lại mật khẩu đã hết hạn hoặc không hợp lệ` + button gửi lại email.
- Hide/remove `Token Reset (Dev)` in production.

Out of scope:
- BE token algorithm changes.
- New toast dependency unless approved.

### Phase 2 — Watering reminder email

In scope:
- Audit reminder rows as source: manual reminders from `/api/reminders`.
- Send due `CareType=Watering`, `Status=Pending`, `IsActive=true`, `DueAt <= now`.
- Use repeat logic after done only; email send must not mark reminder done.
- Add idempotency: `EmailDeliveryLog` unique key or `Reminder.LastEmailSentAt` + daily window.
- Preference: if no preference exists, default opt-in for MVP only if privacy copy updated; safer default: user setting opt-in.

Out of scope:
- Weather/IoT smart scheduling.
- Calendar provider sync.
- Queue infra unless already available.

### Phase 3 — Admin email notification

In scope:
- Existing admin notification remains in-app.
- Add optional email channel to admin notification send.
- Target one user or small group/all with hard cap.
- Admin role guard, validate title/body, rate limit, audit log.
- For bulk all-users: MVP cap or async batch; no synchronous huge sends.

Out of scope:
- Marketing automation, templates editor, unsubscribe center beyond basic preference.

---

## 4. Frontend tasks

### FE-01 Audit exact route + API usage

Files:
- Read: `FE/routes/AppRouter.tsx`
- Read/modify: `FE/pages/ForgotPassword.jsx`
- Read: `FE/services/authApi.js`

Acceptance:
- `/forgot-password` route remains public.
- Auth API service remains centralized.

### FE-02 Convert ForgotPassword to URL-token mode

Modify `FE/pages/ForgotPassword.jsx`:
- Import `useSearchParams` from `react-router-dom` or parse `window.location.search` once.
- Derive:
  ```js
  const token = new URLSearchParams(window.location.search).get('token') || '';
  const isResetMode = Boolean(token);
  ```
- Remove response token handling:
  ```js
  if (res && res.token) setResetToken(res.token);
  ```
- Remove production-visible token input.
- Use token from URL when calling `resetPassword(token, newPassword)`.
- Validate password length `>= 6` client-side to match BE.

Acceptance:
- No token in localStorage/sessionStorage.
- No `console.log(token)`.
- No dev token input in prod UI.

### FE-03 Reset success UX

Modify `FE/pages/ForgotPassword.jsx`:
- On success:
  ```js
  setNewPassword('');
  setConfirmPassword('');
  navigate('/login', {
    replace: true,
    state: { notice: 'Đổi mật khẩu thành công, vui lòng đăng nhập lại.' },
  });
  ```
- If `Login.jsx` does not display `location.state.notice`, either:
  1. add minimal `StateNotice tone="success"` in login page, or
  2. show success notice briefly before redirect.

Preferred: option 1 if surgical.

### FE-04 Invalid/expired token handling

Modify `FE/pages/ForgotPassword.jsx`:
- On reset error with status 400/404/410 or message from BE, show fixed safe UX:
  `Link đặt lại mật khẩu đã hết hạn hoặc không hợp lệ`.
- Render button: `Gửi lại email đặt mật khẩu` → switch to request mode and clear password fields.
- Do not echo backend token/error details.

### FE-05 i18n copy

Modify `FE/i18n/locales.ts` only if page uses `t()` for new copy.

Keys suggested:
- `forgot.resetTitle`
- `forgot.resetDescription`
- `forgot.newPasswordLabel`
- `forgot.confirmPasswordLabel`
- `forgot.error.passwordLength`
- `forgot.error.passwordMismatch`
- `forgot.error.invalidToken`
- `forgot.resendLink`
- `forgot.resetSuccess`

### FE-06 Verification

Commands:
```bash
cd FE && npm run lint
cd FE && npm run build
```

Manual smoke:
- `/forgot-password` no query → email form.
- `/forgot-password?token=abc` → reset form no token input.
- password mismatch → inline error.
- password 5 chars → inline error.
- invalid token API error → safe invalid/expired message + resend button.
- success → `/login`, history replaced if feasible.

---

## 5. Backend tasks cần kiểm tra/thêm

### BE-00 Sync source of truth

Before BE coding:
- Confirm branch/deploy source contains Brevo email infrastructure.
- Search must find something equivalent:
  - `IEmailSender` / `EmailOptions` / `BrevoEmailSender`
  - DI registration
  - env binding for `Email__*`, `Brevo__*`
- If absent in current repo, implement minimal provider wrapper; if present elsewhere, port carefully.

### BE-01 Email service contract

Expected interface:
```csharp
public interface IEmailSender
{
    Task<EmailSendResult> SendAsync(EmailMessage message, CancellationToken ct);
}
```

`EmailMessage` minimum:
- `ToEmail`, `ToName?`
- `Subject`
- `HtmlBody`
- `TextBody?`
- `Category`/`Metadata?`

Requirements:
- Brevo API key from `Brevo__ApiKey` only.
- Do not log key/body secrets/tokens.
- Log provider message id/status sanitized.

### BE-02 Forgot password backend confirmation

Check/ensure:
- `POST /api/auth/forgot-password` returns generic success for existing/non-existing email.
- `ExposeResetTokenInResponse=false` in prod.
- Reset link uses:
  - `Email__AppBaseUrl=https://www.deskboost.io.vn`
  - `Email__ResetPasswordPath=/forgot-password`
  - `?token=<opaque>`
- Reset token expiry reasonable: 15–60 min.
- Reset token single-use: clear token + expiry after success.
- Rate limit `PasswordRecovery` active.

If current repo still returns token: fix BE before production/public repo.

### BE-03 Reminder email worker

Create only after schema decided.

Option MVP recommended: .NET `BackgroundService`:
- Interval: every 5–15 min.
- Batch size: 50 max.
- Query due reminders:
  - `IsActive == true`
  - `Status == Pending`
  - `CareType == Watering`
  - `DueAt <= now + lookaheadWindow` (e.g. 10 min)
- Join user by `Reminder.UserId`.
- Skip invalid/no email/inactive users/preferences disabled.
- Send email template: plant name, due time, link to `/app/settings` or plant profile.
- Write log before/after send with idempotency key.

Do **not** mark reminder done after email.

### BE-04 Admin email notification

Extend existing in-app flow, do not replace it.

Suggested request extension, backward compatible:
```json
{
  "title": "...",
  "body": "...",
  "type": "announcement",
  "targetType": "specific",
  "targetUserIds": ["..."],
  "channels": ["in_app", "email"]
}
```

If not adding `channels`, add `sendEmail: true`.

Requirements:
- `[Authorize(Roles = "ADMIN")]` already exists on `AdminController`.
- Validate `title` length <= 120/256, `body` <= 500/2000.
- Validate target user IDs exist + active.
- Rate limit admin notification send.
- Synchronous send only for <= 20 recipients. Above cap: reject with clear message or enqueue if queue added.
- Audit per recipient status.

---

## 6. Database/migration proposal

### 6.1 Minimum viable schema

#### Add user notification preferences

Option A: add columns to `Users` for MVP:
```text
Users.EmailRemindersEnabled bool default false or true after policy decision
Users.AdminEmailsEnabled bool default true
Users.EmailVerified bool default false   // only if email verification exists/planned
```

Option B preferred if extensible but still small:
```text
UserNotificationPreferences
- Id uuid pk
- UserId uuid unique fk Users
- EmailRemindersEnabled bool default false
- AdminEmailsEnabled bool default true
- InAppNotificationsEnabled bool default true
- CreatedAt, UpdatedAt
```

Recommendation: Option B if adding Phase 2+3 together. Option A if deadline tight.

#### Add email delivery log

```text
EmailDeliveryLogs
- Id uuid pk
- Category text                 // password_reset | watering_reminder | admin_notification
- RecipientUserId uuid null
- RecipientEmail text           // consider normalized; avoid storing body secrets
- Subject text
- Provider text                 // BrevoApi
- ProviderMessageId text null
- Status text                   // pending | sent | failed | skipped
- ErrorCode text null
- ErrorMessage text null        // sanitized/truncated
- IdempotencyKey text unique
- RelatedEntityType text null   // Reminder | Notification | Auth
- RelatedEntityId uuid null
- SentAt timestamp null
- CreatedAt, UpdatedAt
```

#### Reminder idempotency

Preferred: rely on `EmailDeliveryLogs.IdempotencyKey`.

Example keys:
- Password reset: `password_reset:{userId}:{tokenHashPrefix}`
- Watering reminder: `watering:{reminderId}:{yyyyMMddHHmm}` or `watering:{reminderId}:{DueAt:O}`
- Admin notification: `admin_notification:{notificationId}:{userId}`

Optional add to `Reminders`:
```text
LastEmailSentAt timestamp null
EmailSendCount int default 0
```

`Reminder.IsSent` currently exists but insufficient for recurring reminders because one boolean blocks future cycles.

### 6.2 Migration order

1. Add `EmailDeliveryLog` entity/config/DbSet/migration.
2. Add notification preference table or columns.
3. Optionally migrate `Reminder.IsSent` to `LastEmailSentAt`; keep old field for compatibility until cleaned later.

---

## 7. Security requirements

### Reset password

- Do not expose reset token in API response in prod.
- Do not log reset token, reset URL, Brevo key, Authorization header.
- Generic forgot response for existing/non-existing email.
- Rate limit forgot/reset endpoints.
- Token TTL 15–60 min.
- Token single-use.
- Prefer storing hashed reset token if BE refactor allowed.
- Password min length matches BE: >= 6 now; stronger policy can be later.

### Reminder/admin email

- Admin endpoints require `ADMIN` role.
- Rate limit admin sends.
- Cap recipient count before queue exists.
- Sanitize/escape HTML template values.
- No arbitrary HTML from admin unless sanitized; for MVP use plain text body rendered escaped.
- Audit all sends with sanitized errors.
- Respect user preferences/unsubscribe policy.
- No secrets in repo/env docs.

---

## 8. UX requirements

### Forgot password

- Request mode copy: generic success regardless email existence.
- Reset mode copy: no token field, only password fields.
- Invalid token copy: `Link đặt lại mật khẩu đã hết hạn hoặc không hợp lệ` + resend.
- Success copy: `Đổi mật khẩu thành công, vui lòng đăng nhập lại.`
- Loading states disable submit.
- Accessible labels + `StateNotice` roles.

### Reminder email

Email content:
- Subject: `DeskBoost nhắc tưới cây: {PlantName}`
- Body: plant name, due time, reminder title, CTA to app.
- Mention user can disable email reminders.

FE preference:
- Add toggle in `FE/pages/RemindersSettings.jsx` or profile if backend preference exists.
- Keep current calendar export UI.

### Admin email

Admin UI:
- Keep existing `/admin/notifications`.
- Add channel checkbox `Gửi email` only after BE supports it.
- Show estimated recipient count if target all.
- Show warning when bulk disabled/capped.
- Show history status: in-app created, email sent/failed/skipped.

---

## 9. Test checklist

### FE Phase 1

- `cd FE && npm run lint`
- `cd FE && npm run build`
- Manual URL tests listed in FE-06.
- Verify production build has no `Token Reset (Dev)` text.
  ```bash
  cd FE && npm run build
  grep -R "Token Reset" dist || true
  ```

### BE forgot password

- Unit/integration tests:
  - forgot unknown email returns generic success.
  - forgot known email sends email, response `resetToken == null` when expose false.
  - reset invalid token returns safe failure.
  - reset expired token fails.
  - reset valid token updates password + clears token.
- Build:
  ```bash
  cd BE/DeskBoost && dotnet build DeskBoost.sln --nologo
  ```

### Reminder email

- Worker query selects due watering pending reminders only.
- Skips inactive reminders/users/preferences disabled.
- Sends once per idempotency key even if worker runs twice.
- Recurring reminder can send future cycles; `IsSent` boolean must not permanently block.
- Provider failure logs failed status, worker continues.

### Admin email

- Non-admin cannot call endpoint.
- Empty title/body rejected.
- Invalid user IDs rejected or skipped with audit according to chosen behavior.
- Recipient cap enforced.
- In-app notification still created when email channel fails if best-effort selected.
- Email log per recipient.

---

## 10. Rollout plan theo phase

### Phase 1: FE forgot password

Owner: Anh/FE.

Steps:
1. Update `ForgotPassword.jsx` URL-token mode.
2. Add login success notice if needed.
3. Add i18n keys if needed.
4. Run lint/build.
5. Deploy FE.
6. Smoke with real reset email link from prod/staging.

Gate:
- No prod token field.
- Reset link from email works end-to-end.

### Phase 1.5: BE email source sync check

Owner: Tuấn/BE.

Steps:
1. Verify deployed backend code has Brevo sender.
2. If current repo stale, merge/commit Brevo infrastructure back.
3. Confirm Render env names exactly match code options binding.
4. Confirm no `resetToken` response in production.

Gate:
- `POST /api/auth/forgot-password` returns `resetToken:null` in prod.
- Email arrives with `https://www.deskboost.io.vn/forgot-password?token=...`.

### Phase 2: Watering reminder email MVP

Owner: BE first, FE preference after.

Steps:
1. Decide preference default.
2. Add schema: `EmailDeliveryLogs` + preference table/columns.
3. Add reminder email query service.
4. Add `BackgroundService` with batch cap.
5. Add idempotency unique index.
6. Add FE toggle only after API exists.
7. Test with seeded due reminder.
8. Deploy with worker enabled via env flag.

Gate:
- Same due reminder not emailed twice across repeated worker ticks.
- User can disable emails if preference implemented.

### Phase 3: Admin email notification

Owner: BE + FE.

Steps:
1. Extend request with `channels` or `sendEmail`.
2. Add target resolution + cap.
3. Send email per recipient via sender.
4. Log delivery status.
5. Extend `/admin/notifications` history DTO with email summary.
6. Add FE checkbox/status display.
7. Test admin/non-admin/rate-limit/cap.

Gate:
- Admin can send one-user email safely.
- Bulk all-users either capped or queued; no unbounded sync loop.

---

## 11. Risks & mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Repo BE stale vs deployed Brevo code | Codex edits wrong base | Phase 1.5 source sync before BE work |
| `Reminder.IsSent` boolean blocks recurring cycles | Missing future reminders | Use delivery log idempotency by reminder+dueAt, not only boolean |
| Bulk admin email blocks API/request timeout | Failed sends, provider throttling | Hard cap sync sends; queue later |
| Email provider failure | Password reset UX confusion | Generic response; server logs sanitized; monitor provider status |
| Token in URL leaked via logs/referrer | Account risk | HTTPS only, no console logs, short TTL, single-use; consider `Referrer-Policy` |
| User dislikes emails | Compliance/UX risk | Preference toggle + privacy copy |
| HTML injection from admin body | XSS/phishing-ish email content | Escape body; no raw HTML editor MVP |
| Duplicate worker instances on Render | Duplicate emails | DB unique idempotency key, not in-memory flags |

---

## 12. Open questions cần xác nhận trước khi code

1. Backend source of truth: Brevo email infra nằm ở branch/file nào? Workspace hiện tại chưa thấy.
2. Forgot reset success notice: muốn inline trước redirect hay notice ở login page?
3. Email reminder default: opt-in by default hay chỉ gửi khi user bật toggle?
4. User `EmailVerified`: hiện chưa có email verify. Có cần block reminder/admin email nếu chưa verified không?
5. Reminder send time: gửi đúng `DueAt`, hay trước `DueAt` 10/30/60 phút?
6. Reminder scope: chỉ `CareType=Watering` Phase 2 hay cả fertilizing/check_leaves sau này?
7. Admin target all-users: cho phép sync tối đa bao nhiêu? Gợi ý MVP: 20 hoặc 50.
8. Email template language: theo current UI language không lưu ở user; dùng tiếng Việt mặc định hay add `PreferredLanguage`?
9. Compliance: có cần unsubscribe link public trước khi bật admin emails không?
10. Deploy: worker chạy trong same API process trên Render hay dùng separate worker service?

---

## Codex/Roo handoff queue

### Prompt 1 — FE forgot password only

```text
Bạn là Codex implementer cho DeskBoost. Chỉ làm Phase 1 FE forgot password.

Đọc plans/email-notification-integration-plan.md sections 1, 4, 7, 8, 9.

Yêu cầu:
- Modify only FE forgot/reset password UX and minimal login notice/i18n if needed.
- /forgot-password no token => request email form.
- /forgot-password?token=... => reset form with newPassword + confirmPassword only.
- Call resetPassword(token, newPassword).
- Remove/hide Token Reset (Dev) in production; ideally remove input entirely.
- Do not log/store token.
- Password >= 6, confirm match.
- Invalid/expired error => fixed Vietnamese message + resend button.
- Success => navigate('/login', { replace: true }) and show “Đổi mật khẩu thành công, vui lòng đăng nhập lại.”.
- Do not change backend contract.

Verify:
cd FE && npm run lint
cd FE && npm run build
grep -R "Token Reset" dist || true

Report changed files + exact command results.
```

### Prompt 2 — BE source sync + reminder email design

```text
Audit backend email infrastructure in current branch. Search for Brevo/IEmailSender/EmailOptions/ForgotPasswordCommand. Compare with plans/email-notification-integration-plan.md Phase 1.5 and Phase 2. Do not implement yet. Return: existing files, missing pieces, migration proposal final, worker approach, exact risks.
```

### Prompt 3 — Admin email notification design

```text
Audit existing in-app admin notification flow. Use plans/email-notification-integration-plan.md Phase 3. Do not implement yet. Return minimal backward-compatible API contract extension, DB logging needs, recipient cap, FE changes, tests.
```
