# DeskBoost Phase 2 — Watering Reminder Email MVP Plan

> Scope: audit + design only. Không implement code trong bước này.

**Goal:** gửi email nhắc tưới cây cho reminder đến hạn, an toàn, không gửi trùng, không đánh dấu reminder done.

**Architecture:** `BackgroundService` scan reminder due → kiểm tra user/email/preference → tạo DB idempotency key → gửi qua email service/Brevo → ghi `EmailDeliveryLogs` status. MVP chỉ `CareType=Watering`, batch nhỏ, không queue lớn.

**Tech stack:** .NET 8 Web API + EF Core/PostgreSQL + MediatR + Brevo API; React/Vite FE chỉ thêm toggle preference nếu BE có endpoint.

---

## 1. Current state

### 1.1 Reminder entity

Evidence:
- `BE/DeskBoost/DeskBoost.Domain/Entities/Reminder.cs`
- `BE/DeskBoost/DeskBoost.Domain/Enums/CareType.cs`
- `BE/DeskBoost/DeskBoost.Domain/Enums/RepeatRule.cs`
- `BE/DeskBoost/DeskBoost.Domain/Enums/ReminderStatus.cs`

Current fields:
```csharp
PlantId
UserId
Title
CareType = Watering
DueAt
RepeatRule?
Status = Pending
LastDoneAt?
Notes?
IsSent = false
IsActive = true
Plant nav
```

Care types:
- `Watering`
- `Fertilizing`
- `Repotting`
- `Other`

FE uses `check_leaves`, but BE `ToCareType()` likely maps unknown to existing enum or `Other`; Codex must verify converter before relying on check-leaves. Phase 2 only uses `Watering`.

Status:
- `Pending`
- `Done`

Repeat:
- `Daily`, `Every2Days`, `Every3Days`, `Weekly`, `Biweekly`, `Monthly`

### 1.2 Reminder API

Evidence:
- `BE/DeskBoost/DeskBoost.API/Controllers/RemindersController.cs`
- `BE/DeskBoost/DeskBoost.Application/Features/Reminders/*`
- `FE/services/reminderApi.js`
- `FE/pages/RemindersSettings.jsx`

Endpoints:
- `GET /api/reminders?plantId=` → current user reminders, active only.
- `POST /api/reminders` → create reminder for current user's plant.
- `PUT /api/reminders/{id}` → update reminder.
- `PUT /api/reminders/{id}/done` → mark done.
- `DELETE /api/reminders/{id}` → delete.
- `GET /api/reminders/{id}/calendar?format=ics` → calendar/ICS.

Current repeat behavior:
- `MarkReminderDoneCommand` advances `DueAt` to next occurrence if `RepeatRule.HasValue`, keeps `Status=Pending`.
- Non-recurring → `Status=Done`.
- `GetRemindersQueryHandler` also repairs recurring reminders that are `Done`.
- Email send must **not** call mark-done and must **not** advance `DueAt`.

FE reminder settings:
- Uses real API.
- Creates/updates `plantId`, `title`, `careType`, `dueAt`, `repeatRule`, `notes`.
- Has calendar export UI.
- Has copy key `reminders.emailFuture`: email reminder currently marked future enhancement.
- No email preference UI yet.

### 1.3 Email infrastructure

Evidence:
- `BE/DeskBoost/DeskBoost.Application/Common/Interfaces/IEmailService.cs`
- `BE/DeskBoost/DeskBoost.Application/Common/Interfaces/IEmailConfiguration.cs`
- `BE/DeskBoost/DeskBoost.Infrastructure/ExternalServices/Email/BrevoEmailService.cs`
- `BE/DeskBoost/DeskBoost.Infrastructure/ExternalServices/Email/SmtpEmailService.cs`
- `BE/DeskBoost/DeskBoost.Infrastructure/ExternalServices/Email/EmailConfigurationService.cs`
- `BE/DeskBoost/DeskBoost.Infrastructure/DependencyInjection.cs`
- `BE/DeskBoost/DeskBoost.Application/Features/Auth/Commands/ForgotPasswordCommand.cs`

Current email interface:
```csharp
Task SendPasswordResetEmailAsync(string toEmail, string fullName, string resetToken, CancellationToken ct);
```

Current providers:
- `BrevoEmailService : IEmailService`
- `SmtpEmailService : IEmailService`

DI:
- `Email:Provider == BrevoApi` → `AddHttpClient<IEmailService, BrevoEmailService>`
- otherwise SMTP.

Forgot password:
- `ForgotPasswordCommandHandler` creates token, saves user, calls `_emailService.SendPasswordResetEmailAsync(...)`.
- `EmailConfigurationService` has `IsEnabled`, `ExposeResetTokenInResponse`.

Gap: email service is password-reset-specific. Phase 2 needs either:
1. add `SendWateringReminderEmailAsync(...)`, or
2. add generic `SendEmailAsync(...)`.

MVP recommendation: add **generic** `SendEmailAsync(EmailMessage message, ct)` while keeping existing password reset method as wrapper/backward compatibility.

### 1.4 Background job

Search result:
- No `BackgroundService`, `IHostedService`, `AddHostedService`, `Hangfire`, `Quartz`, `Cron`, `PeriodicTimer`, `Timer` found.

Conclusion:
- Use .NET `BackgroundService` MVP.
- Register with `services.AddHostedService<WateringReminderEmailWorker>()`.
- Must use scoped `IServiceScopeFactory`, not inject `DbContext` directly into singleton worker.

### 1.5 Notification system

Evidence:
- `BE/.../Entities/Notification.cs`
- `BE/.../Entities/NotificationRead.cs`
- `BE/.../Controllers/NotificationsController.cs`
- `BE/.../Features/Notifications/*`
- `FE/services/notificationApi.js`
- `FE/context/CareContext.jsx`
- `FE/components/CareNotificationBell.jsx`

Current system:
- In-app notifications exist mainly for admin announcements.
- `CareContext` also surfaces reminders as bell tasks by calling `/api/reminders`.
- `Notification` entity has `Title`, `Body`, `Type`, `TargetType`, `TargetUserIdsJson`, `CreatedByAdminId`, `IsActive`.

Recommendation:
- Phase 2 **do not create extra in-app Notification rows** for watering reminders. FE already shows due reminders via `CareNotificationBell` from `/api/reminders`.
- Email only is enough. Reusing `Notification` would duplicate UI/semantics and require read-state handling.

### 1.6 Database

Current:
- `IAppDbContext` has `Users`, `Reminders`, `Notifications`, `NotificationReads`, etc.
- No `EmailDeliveryLogs` / `EmailLog`.
- No `UserNotificationPreferences`.
- `User` has `Email`, no `EmailVerified`, no preferences.
- `Reminder.IsSent` exists from initial migration.

Conclusion:
- `Reminder.IsSent` alone is **not enough** for recurring reminders.
- Need DB-backed idempotency via email delivery log unique key.

---

## 2. Gap analysis

| Area | Current | Gap | MVP action |
|---|---|---|---|
| Email send | Password-reset-only `IEmailService` | No generic email/reminder method | Add generic send or reminder method |
| Worker | None | No scheduler | Add `.NET BackgroundService` |
| Idempotency | `Reminder.IsSent` bool | Fails recurring/multi-instance | Add `EmailDeliveryLogs.IdempotencyKey` unique |
| Email log | None | No audit/retry visibility | Add `EmailDeliveryLog` entity/table |
| User preference | None | No opt-out | Add minimal `EmailWateringRemindersEnabled` on `Users` or preference table |
| FE | Reminder settings only | No email toggle | Add toggle only if preference API added |
| In-app | Reminders already shown by bell | Extra Notification row would duplicate | Do not reuse Notification for Phase 2 |
| Rate/bulk | N/A | Worker could send too many | Batch size + interval config |
| Config | Email enabled exists | Worker enable/config absent | Add `ReminderEmail:*` config |

---

## 3. Target architecture

```text
Watering reminder due
  ↓
WateringReminderEmailWorker : BackgroundService
  ↓ every N minutes, batch limited
Query Reminders
  where IsActive
    and Status == Pending
    and CareType == Watering
    and DueAt <= nowUtc
  include Plant
  join User
  ↓
Skip if user inactive/email empty/preference disabled/email disabled
  ↓
Build idempotency key: watering-reminder:{reminderId}:{dueAtUtcTicks or yyyyMMddHHmm}
  ↓
Insert EmailDeliveryLog(Pending, idempotencyKey) with unique index
  ↓ if unique violation: skip duplicate
Send via IEmailService/Brevo
  ↓
Update EmailDeliveryLog Sent/Failed/Skipped
```

Important:
- Email send does **not** update `Reminder.Status`.
- Email send does **not** call `MarkReminderDoneCommand`.
- `Reminder.DueAt` advances only when user marks done.
- Multiple API instances safe because unique DB key gates duplicate sends.

---

## 4. MVP scope

### In scope

- Send email only for `CareType.Watering`.
- Due reminders only: `DueAt <= DateTime.UtcNow`.
- User active + has email.
- Email provider uses existing Brevo config.
- DB log per send attempt.
- DB idempotency unique key.
- Configurable worker enable/interval/batch.
- Minimal user opt-out preference.

### Out of scope

- Fertilizing/check leaves email.
- Queue infrastructure.
- Large bulk emails.
- Push notifications.
- Weather/IoT smart schedule.
- Retry dashboard.
- Admin email Phase 3.
- Email verification system unless already planned.

---

## 5. Backend implementation plan

### BE-01 Add email delivery log entity

Create:
- `BE/DeskBoost/DeskBoost.Domain/Entities/EmailDeliveryLog.cs`
- `BE/DeskBoost/DeskBoost.Infrastructure/Persistence/Configurations/EmailDeliveryLogConfiguration.cs`

Modify:
- `BE/DeskBoost/DeskBoost.Application/Common/Interfaces/IAppDbContext.cs`
- `BE/DeskBoost/DeskBoost.Infrastructure/Persistence/AppDbContext.cs`

Fields:
```csharp
public class EmailDeliveryLog : BaseEntity
{
    public string Category { get; set; } = string.Empty; // watering_reminder
    public Guid? RecipientUserId { get; set; }
    public string RecipientEmail { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Provider { get; set; } = string.Empty; // BrevoApi/Smtp
    public string Status { get; set; } = string.Empty; // pending/sent/failed/skipped
    public string IdempotencyKey { get; set; } = string.Empty;
    public string? RelatedEntityType { get; set; } // Reminder
    public Guid? RelatedEntityId { get; set; }
    public DateTime? SentAt { get; set; }
    public string? ErrorCode { get; set; }
    public string? ErrorMessage { get; set; } // sanitized/truncated
}
```

Indexes:
- unique `IdempotencyKey`
- `Category, Status, CreatedAt`
- `RelatedEntityType, RelatedEntityId`

### BE-02 Add minimal preference

MVP recommendation: add columns to `Users` instead of new table.

Modify:
- `BE/DeskBoost/DeskBoost.Domain/Entities/User.cs`
- user config/snapshot via migration

Add:
```csharp
public bool EmailWateringRemindersEnabled { get; set; } = true;
```

Why column not table:
- MVP only one preference.
- Less API/EF complexity.
- Can migrate to `UserNotificationPreferences` later if channels grow.

Optional later:
- `EmailAdminNotificationsEnabled`
- `PreferredLanguage`
- `EmailVerified`

### BE-03 Extend email service safely

Modify:
- `BE/DeskBoost/DeskBoost.Application/Common/Interfaces/IEmailService.cs`
- `BE/DeskBoost/DeskBoost.Infrastructure/ExternalServices/Email/BrevoEmailService.cs`
- `BE/DeskBoost/DeskBoost.Infrastructure/ExternalServices/Email/SmtpEmailService.cs`

Add generic method:
```csharp
Task SendEmailAsync(EmailMessage message, CancellationToken ct);
```

Create model:
- `BE/DeskBoost/DeskBoost.Application/Common/Models/EmailMessage.cs`

Shape:
```csharp
public record EmailMessage(
    string ToEmail,
    string? ToName,
    string Subject,
    string HtmlContent,
    string TextContent);
```

Keep `SendPasswordResetEmailAsync` intact, implemented by calling `SendEmailAsync` internally.

Security:
- Do not log full HTML body.
- Do not log Brevo API key.
- Brevo failure log may include provider body only if sanitized/truncated; current code logs full body. Codex should truncate to e.g. 500 chars.

### BE-04 Add reminder email template builder

Create:
- `BE/DeskBoost/DeskBoost.Application/Common/Interfaces/IEmailTemplateRenderer.cs` OR simple internal static builder if no need for DI.
- MVP preferred: `BE/DeskBoost/DeskBoost.Application/Features/Reminders/Emails/WateringReminderEmailTemplate.cs`

Inputs:
- user full name/email
- plant name
- reminder title
- due date/time
- app URL `Email:AppBaseUrl`

Output:
- subject/html/text.

Escape all dynamic values with `WebUtility.HtmlEncode`.

### BE-05 Add worker service

Create:
- `BE/DeskBoost/DeskBoost.Infrastructure/BackgroundJobs/WateringReminderEmailWorker.cs`

Register:
- `BE/DeskBoost/DeskBoost.Infrastructure/DependencyInjection.cs`

Use:
```csharp
services.AddHostedService<WateringReminderEmailWorker>();
```

Worker dependencies:
- `IServiceScopeFactory`
- `IConfiguration`
- `ILogger<WateringReminderEmailWorker>`

Scoped dependencies per tick:
- `AppDbContext` or `IAppDbContext`
- `IEmailService`
- `IEmailConfiguration`

Config:
```json
"ReminderEmail": {
  "Enabled": false,
  "IntervalMinutes": 10,
  "BatchSize": 25,
  "DueLookbackHours": 24
}
```

Production env:
```env
ReminderEmail__Enabled=true
ReminderEmail__IntervalMinutes=10
ReminderEmail__BatchSize=25
ReminderEmail__DueLookbackHours=24
```

Query:
```csharp
var now = DateTime.UtcNow;
var from = now.AddHours(-dueLookbackHours);
var candidates = await db.Reminders
  .Include(r => r.Plant)
  .Where(r => r.IsActive)
  .Where(r => r.Status == ReminderStatus.Pending)
  .Where(r => r.CareType == CareType.Watering)
  .Where(r => r.DueAt <= now && r.DueAt >= from)
  .OrderBy(r => r.DueAt)
  .Take(batchSize)
  .ToListAsync(ct);
```

Then load users by `UserId` dictionary. Skip if:
- user missing
- `!user.IsActive`
- `user.Status != Active`
- email empty
- `!user.EmailWateringRemindersEnabled`
- global `Email:Enabled=false`

### BE-06 Optional admin/diagnostic endpoint — not MVP

Do **not** add public/admin resend endpoint in Phase 2 MVP unless needed for QA. Use seed data + logs for testing.

---

## 6. Frontend implementation plan nếu cần

### FE MVP recommendation

Add only a small preference toggle after BE exposes preference field.

Files likely:
- `FE/services/userApi.js`
- `FE/pages/RemindersSettings.jsx`
- `FE/i18n/locales.ts`

Existing UI currently says:
- `reminders.emailFuture`: “Nhắc qua email: chỉ là nâng cấp backend tương lai.”

Update to:
- Show email reminder status/toggle near reminder settings header.
- If API not ready, hide toggle and only update copy after BE deploy.

### Minimal FE contract

Preferred reuse current profile endpoint:
- `GET /api/users/me` returns `emailWateringRemindersEnabled`.
- `PUT /api/users/me` accepts `emailWateringRemindersEnabled`.

If modifying profile endpoint is risky, create small endpoint:
- `GET /api/users/me/notification-preferences`
- `PUT /api/users/me/notification-preferences`

MVP preference UI:
- Toggle label: `Nhắc tưới cây qua email`
- Help text: `DeskBoost sẽ gửi email khi lịch tưới đến hạn. Bạn vẫn cần tự đánh dấu hoàn tất sau khi tưới.`
- Error state with `StateNotice`.

If deadline tight:
- Phase 2A BE-only with default enabled.
- Phase 2B FE opt-out toggle before broad rollout.

But recommended gate before production: toggle exists.

---

## 7. Database/migration proposal

### Migration 1 — Email delivery logs + user preference

Add entity/table:
```text
EmailDeliveryLogs
- Id uuid pk
- Category varchar(80) not null
- RecipientUserId uuid null
- RecipientEmail varchar(320) not null
- Subject varchar(256) not null
- Provider varchar(80) not null
- Status varchar(40) not null
- IdempotencyKey varchar(300) not null unique
- RelatedEntityType varchar(80) null
- RelatedEntityId uuid null
- SentAt timestamptz null
- ErrorCode varchar(120) null
- ErrorMessage varchar(1000) null
- CreatedAt timestamptz not null
- UpdatedAt timestamptz null
```

Add to `Users`:
```text
EmailWateringRemindersEnabled boolean not null default true
```

Why default true:
- App already has reminder feature; email is a direct reminder channel.
- Must be paired with visible opt-out toggle + privacy/update copy before broad rollout.

Safer alternative:
- default false and ask users to opt-in. Better compliance, lower adoption. Decide before migration.

### Do not rely on `Reminder.IsSent`

Keep column for compatibility, but do not use as primary idempotency.

Reason:
- One bool cannot represent recurring cycles.
- If set true after first due email, future repeated `DueAt` would be blocked.
- If reset to false on mark-done, concurrent workers still risk duplicates.

---

## 8. Duplicate prevention / idempotency design

### Key format

Use due occurrence key:
```text
watering-reminder:{reminderId}:{dueAtUtcRoundToMinuteTicks}
```

Example:
```text
watering-reminder:7e0b...:638858304000000000
```

Do not include user email in key. Email changes should not resend same occurrence.

### Flow

1. Worker computes key.
2. Worker attempts to insert `EmailDeliveryLog` with:
   - `Status=pending`
   - `IdempotencyKey=key`
3. `SaveChangesAsync` succeeds → this instance owns send.
4. Unique violation → another instance already claimed/sent; skip.
5. Send email.
6. Update same log:
   - sent: `Status=sent`, `SentAt=now`
   - failed: `Status=failed`, sanitized error
   - skipped: `Status=skipped`, reason in error code/message

### Multi-instance safety

DB unique index is the lock. No in-memory lock is sufficient on Render/multiple instances.

### Retry policy

MVP: no automatic retry for same occurrence after `failed`. Reason: avoid duplicate risk + complexity.

Optional later:
- `AttemptCount`, `NextAttemptAt`, retry max 3.

---

## 9. User preference design

### MVP field

`User.EmailWateringRemindersEnabled` default decided before migration.

Recommended production behavior:
- Default `true` only if privacy/copy says reminders may be emailed.
- User can turn off in `/app/settings`.
- Worker respects field before sending.

### API option A — reuse profile

Modify `GET /api/users/me` response to include:
```json
{
  "emailWateringRemindersEnabled": true
}
```

Allow `PUT /api/users/me` to update field.

Pros: fewer endpoints.
Cons: profile update may be broader/riskier.

### API option B — dedicated endpoint

Create:
```http
GET /api/users/me/notification-preferences
PUT /api/users/me/notification-preferences
```

Payload:
```json
{
  "emailWateringRemindersEnabled": true
}
```

Pros: clean, low risk.
Cons: one new mini endpoint/service.

Recommendation: Option B for surgical Phase 2.

---

## 10. Email template proposal

Subject:
```text
DeskBoost nhắc tưới cây: {PlantName}
```

Text body:
```text
Xin chào {FullName},

Đến lịch tưới cây cho {PlantName}.
Lịch: {DueAtLocal}
Nhắc nhở: {ReminderTitle}

Mở DeskBoost để xem và đánh dấu hoàn tất sau khi tưới:
{AppBaseUrl}/app/settings

Nếu không muốn nhận email này, bạn có thể tắt “Nhắc tưới cây qua email” trong cài đặt reminder.
```

HTML body:
- Simple table/div inline CSS like password reset email.
- Escape `FullName`, `PlantName`, `ReminderTitle`, URL.
- No raw user HTML.

Timezone:
- MVP: format `DueAt` as UTC or server local? Better: include neutral wording until user timezone exists:
  - `Thời gian lịch: {DueAt:dd/MM/yyyy HH:mm} (UTC)`
- Future: store user timezone/preferred locale.

CTA URL:
```text
{Email:AppBaseUrl}/app/settings
```

No token/secret in URL.

---

## 11. Worker / scheduler design

### Class

`WateringReminderEmailWorker : BackgroundService`

### Loop

Use `PeriodicTimer`:
```text
on start: wait small initial delay 30s
while not cancelled:
  run tick with try/catch
  wait interval
```

### Tick behavior

- If `ReminderEmail:Enabled != true`, no-op.
- If `Email:Enabled != true`, no-op.
- Load due reminder candidates batch.
- For each candidate:
  - build idempotency key
  - insert pending log
  - skip if duplicate
  - send
  - update log
- Catch per-reminder exceptions so one bad email does not stop batch.
- Catch outer exceptions so worker does not crash host.

### Batch limits

Defaults:
- `IntervalMinutes=10`
- `BatchSize=25`
- `DueLookbackHours=24`

Reason:
- Avoid sending very old backlog after deployment.
- Avoid provider/API burst.
- MVP friendly.

### Query index proposal

Add index to reminders config:
```text
(IsActive, Status, CareType, DueAt)
```

Keep existing `UserId` index.

---

## 12. Test checklist

### Backend build

```bash
cd BE/DeskBoost && dotnet build DeskBoost.sln --nologo
```

### Migration

```bash
cd BE/DeskBoost && dotnet ef migrations add AddWateringReminderEmailLogs --project DeskBoost.Infrastructure --startup-project DeskBoost.API
cd BE/DeskBoost && dotnet ef database update --project DeskBoost.Infrastructure --startup-project DeskBoost.API
```

Use project’s existing EF command pattern if different.

### Unit/integration tests to add if test project exists

Worker logic:
- Sends email for due active pending watering reminder.
- Does not send for future reminder.
- Does not send for non-watering reminder.
- Does not send for `Status=Done`.
- Does not send for inactive reminder.
- Does not send if user inactive/missing/email empty/preference false.
- Does not mark reminder done.
- Does not change `DueAt`.
- Duplicate idempotency key prevents second send.
- Two simulated ticks send only once.
- Brevo failure writes `failed` log and continues next reminder.

Email service:
- Brevo request uses configured sender/API key header.
- Reminder email body escapes dynamic text.
- No API key in logs.

Preference API if added:
- Auth required.
- GET returns current bool.
- PUT updates only current user preference.

### Manual smoke staging/prod

1. Set env:
   - `ReminderEmail__Enabled=true`
   - small interval only in staging.
2. Create a watering reminder due now for test account.
3. Wait one worker interval.
4. Verify email arrives.
5. Verify DB has one `EmailDeliveryLog` with `sent`.
6. Wait another interval.
7. Verify no second email/log duplicate for same `idempotencyKey`.
8. Mark reminder done.
9. For recurring reminder, verify next `DueAt` advances; future due occurrence can generate a different idempotency key later.

---

## 13. Rollout plan

### Phase 2A — BE foundation

1. Add `EmailDeliveryLog` + migration.
2. Add user preference field/endpoint.
3. Extend email service with generic send.
4. Add email template.
5. Add worker with env disabled by default.
6. Build + migration check.

Gate:
- `dotnet build` passes.
- Worker disabled by default; no surprise emails.

### Phase 2B — FE preference

1. Add preference API client.
2. Add toggle in `RemindersSettings`.
3. Update `reminders.emailFuture` copy.
4. Run FE lint/build.

Gate:
- User can opt out/in.

### Phase 2C — Staging enable

1. Enable worker on staging only.
2. Test one account, one due reminder.
3. Confirm no duplicate after multiple ticks.
4. Confirm failure logging by temporary invalid email if safe.

### Phase 2D — Production limited rollout

1. Enable production with conservative config:
   - interval 10m
   - batch 25
   - lookback 24h
2. Monitor Brevo dashboard + app logs.
3. If duplicate/failure spike → disable `ReminderEmail__Enabled=false`.

---

## 14. Risks & mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Duplicate emails from multiple instances | User spam | Unique DB `IdempotencyKey`; insert-before-send |
| Recurring reminder blocked by `IsSent` | Future emails missing | Do not use `IsSent` as main gate |
| Old backlog sends many emails | Spam | `DueLookbackHours`, `BatchSize`, disabled by default |
| Brevo outage | Missed reminder | Log failed; no business flow failure |
| Worker crashes host | API instability | catch per tick + per reminder |
| User cannot opt out | UX/privacy issue | Add preference toggle before prod broad rollout |
| Wrong timezone | Confusing email time | Label UTC/MVP; future user timezone |
| Email service too password-specific | Messy implementation | Add generic method, keep reset wrapper |
| Full provider body logged | Secrets/noise risk | Truncate/sanitize Brevo error body |

---

## 15. Codex implementation prompt cho Phase 2

```text
Bạn là Codex implementer cho DeskBoost. Implement Phase 2 Watering Reminder Email MVP theo plans/plant-reminder-email-plan.md. Không làm Admin email Phase 3. Không redesign UI.

Bối cảnh đã verify:
- Brevo password reset email đang hoạt động.
- IEmailService hiện chỉ có SendPasswordResetEmailAsync.
- Reminder entity có CareType, DueAt, RepeatRule, Status, IsSent, IsActive.
- Không có BackgroundService hiện tại.
- Không có EmailDeliveryLogs/user email preference hiện tại.

Yêu cầu BE:
1. Add EmailDeliveryLog entity + EF configuration + DbSet + migration.
2. Add minimal user preference EmailWateringRemindersEnabled (default true unless project owner changes before migration).
3. Extend IEmailService with generic SendEmailAsync(EmailMessage, ct); keep password reset method working.
4. Implement watering reminder email template. Escape dynamic values. No token/secret logs.
5. Add WateringReminderEmailWorker as .NET BackgroundService, disabled by default via ReminderEmail:Enabled.
6. Worker sends only due active pending CareType.Watering reminders, respects user active/email/preference, batch limited.
7. Idempotency: insert EmailDeliveryLog pending with unique key watering-reminder:{reminderId}:{dueAtUtcRoundedToMinuteTicks}; unique violation => skip. Do not rely on Reminder.IsSent.
8. After send update log sent/failed/skipped. Do not mark reminder done. Do not change DueAt.
9. Add config keys to appsettings.example.json only with placeholders/defaults, no secrets.
10. Add preference API if needed: GET/PUT /api/users/me/notification-preferences.

Yêu cầu FE nếu preference API được thêm:
1. Add small service functions.
2. Add toggle in FE/pages/RemindersSettings.jsx near email reminder copy.
3. Update i18n keys. No UI redesign.

Verify:
- cd BE/DeskBoost && dotnet build DeskBoost.sln --nologo
- cd FE && npm run lint
- cd FE && npm run build
- Explain migration name and changed files.
- Report how duplicate prevention works.

Constraints:
- Không gửi email thật trong tests nếu không có explicit env.
- Không hardcode Brevo key/from address.
- Không log API key/token/secret.
- Không bulk email lớn.
```
