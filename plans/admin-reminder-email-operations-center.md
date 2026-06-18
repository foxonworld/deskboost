# DeskBoost Phase 2B - Admin Reminder & Email Operations Center

> Scope: audit, product architecture, UX architecture, backend/frontend plan. No code implementation in this phase.

**Design read:** SaaS admin operations dashboard for founder/admin users, trust-first B2B ops language, dense data IA, high clarity, low decoration.

**Goal:** give DeskBoost admin control over user reminders, reminder emails, email failures, quota risk, and abuse behavior without opening DB or Render logs.

**Operating principle:** build this before Phase 3 Admin Email Notification so email governance, audit logs, quotas, retry rules, and abuse controls are not retrofitted later.

---

## 0. Executive decision

Recommendation: create a new Admin area group named **Operations** with two first-class pages:

```text
Admin
├── Overview
├── Users
├── Plants
├── Inventory
├── Marketplace
├── Feedback
├── AI
├── Notifications
└── Operations
    ├── Reminder Operations
    └── Email Operations
```

Why:
- `Notifications` remains content/comms creation.
- `Reminder Operations` is operational control over scheduled user care tasks.
- `Email Operations` is delivery, quota, failures, and governance.
- Phase 3 Admin Email Notification can plug into `Email Operations` instead of inventing its own logs, quotas, and abuse handling.

---

## 1. Current source audit

### 1.1 Reminder backend

Evidence:
- `BE/DeskBoost/DeskBoost.Domain/Entities/Reminder.cs`
- `BE/DeskBoost/DeskBoost.Domain/Enums/CareType.cs`
- `BE/DeskBoost/DeskBoost.Domain/Enums/RepeatRule.cs`
- `BE/DeskBoost/DeskBoost.Domain/Enums/ReminderStatus.cs`
- `BE/DeskBoost/DeskBoost.API/Controllers/RemindersController.cs`
- `BE/DeskBoost/DeskBoost.Application/Features/Reminders/*`

Current `Reminder`:
```text
PlantId
UserId
Title
CareType
DueAt
RepeatRule
Status
LastDoneAt
Notes
IsSent
IsActive
Plant navigation
```

Care types:
- Watering
- Fertilizing
- Repotting
- Other

Reminder APIs are user scoped:
- `GET /api/reminders`
- `POST /api/reminders`
- `PUT /api/reminders/{id}`
- `PUT /api/reminders/{id}/done`
- `DELETE /api/reminders/{id}`
- `GET /api/reminders/{id}/calendar`

Current repeat behavior:
- `MarkReminderDoneCommand` advances `DueAt` for recurring reminders.
- Worker does not complete or advance reminders.

Gap:
- No admin reminder list API.
- No admin reminder dashboard API.
- No admin disable/enable reminder API.
- No reminder mutation audit log.
- No per-user reminder limit.
- No abuse score.

### 1.2 Reminder frontend

Evidence:
- `FE/services/reminderApi.js`
- `FE/pages/RemindersSettings.jsx`
- `FE/context/CareContext.jsx`
- `FE/components/CareNotificationBell.jsx`

Current FE:
- User can create, edit, delete, mark done.
- Bell shows due/upcoming reminders by calling `/api/reminders`.
- Email reminder copy was future-facing.

Gap:
- Admin cannot view all reminders.
- Admin cannot inspect user reminder volume.
- Admin cannot disable a problematic reminder.
- Admin cannot see email delivery status per reminder.

### 1.3 Email backend

Evidence:
- `IEmailService` has generic `SendEmailAsync` plus password reset wrapper.
- `BrevoEmailService` and `SmtpEmailService` implement backward-compatible send.
- `EmailDeliveryLog` exists.
- `WateringReminderEmailWorker` exists.
- `EmailDeliveryLogConfiguration` has unique `IdempotencyKey`.

Current `EmailDeliveryLog`:
```text
Category
RecipientUserId
RecipientEmail
Subject
Provider
Status
IdempotencyKey
RelatedEntityType
RelatedEntityId
SentAt
ErrorCode
ErrorMessage
CreatedAt
UpdatedAt
```

Current worker behavior:
- no-op when `ReminderEmail:Enabled=false`
- no-op when `Email:Enabled=false`
- scoped `AppDbContext`
- sends only active pending watering reminders due within lookback
- inserts pending log before send
- unique idempotency prevents duplicate send
- updates `sent` or `failed`
- does not mutate `Reminder.Status`, `DueAt`, `IsSent`, or `LastDoneAt`

Gap:
- No admin email logs API.
- No quota model.
- No retry workflow.
- No stale pending handling.
- No email suppression list.
- No per-user email throttle.
- No operational health summary.

### 1.4 User backend

Evidence:
- `BE/DeskBoost/DeskBoost.Domain/Entities/User.cs`
- `UserRole`: `USER`, `ADMIN`
- `UserStatus`: `Active`, `Inactive`, `Banned`

Current `User`:
```text
Email
PasswordHash
GoogleId
FullName
Role
Status
IsActive
AvatarUrl
Phone
PasswordResetToken
PasswordResetTokenExpiresAt
RefreshTokens
```

Gap:
- No `EmailEnabled`.
- No reminder email opt-out.
- No admin notification email opt-out.
- No email bounce/suppression state.
- No abuse/risk indicators.

### 1.5 Admin FE and API

Evidence:
- `FE/components/AdminLayout.jsx`
- `FE/routes/AppRouter.tsx`
- `FE/services/adminApi.js`
- `BE/DeskBoost/DeskBoost.API/Controllers/AdminController.cs`

Current Admin pages:
- Overview
- Users
- Plants
- Inventory
- Marketplace
- Feedback
- AI
- Notifications

Current Admin APIs include:
- users CRUD/status
- user-plants
- plant-inventory
- marketplace-items
- claim codes
- feedback
- plant species
- ai dialogs/config
- notifications CRUD

Gap:
- No admin reminder endpoints.
- No email operations endpoints.
- No ops audit endpoints.
- No admin rate/limit controls.

---

## 2. Product strategy: what admin must control at 1000 users

At 1000 users, the admin needs answerable questions:

1. Who is generating the most reminder email load?
2. Are reminder emails healthy today?
3. How much Brevo quota is consumed or at risk?
4. Which reminders are overdue, spammy, or misconfigured?
5. Which users should be throttled, contacted, or disabled?
6. Which emails failed and why?
7. Can an admin act without DB access?

Therefore Phase 2B must provide:
- visibility
- safe action
- audit trail
- abuse guardrails
- quota awareness
- Phase 3 email readiness

---

## 3. Admin Operations Information Architecture

### 3.1 Recommended nav

```text
Admin
├── Overview
├── Users
├── Plant Ops
│   ├── User Plants
│   └── Inventory
├── Marketplace
├── Feedback
├── AI
├── Communications
│   ├── In-App Notifications
│   └── Email Operations
└── Reminder Operations
```

Short-term route-friendly version:

```text
/admin/overview
/admin/users
/admin/plants
/admin/plant-inventory
/admin/marketplace
/admin/feedback
/admin/ai
/admin/notifications
/admin/reminder-operations
/admin/email-operations
```

Reason:
- easiest to implement in current `AdminLayout.jsx`
- no nested route refactor required
- future grouping can be visual only in sidebar

### 3.2 Sidebar labels

Use plain operations labels:
- `Reminder Ops`
- `Email Ops`

Avoid poetic labels. Admins need recognition, not brand copy.

### 3.3 Priority order in nav

Recommended admin order:

```text
Overview
Users
Plants
Inventory
Marketplace
Reminder Ops
Email Ops
Notifications
Feedback
AI
```

Why move Reminder/Email before Notifications:
- operational risk is higher than content management
- email failures affect trust immediately
- admin notifications Phase 3 depends on email ops readiness

---

## 4. Reminder Operations Center

### 4.1 Jobs to be done

Admin needs to:
- monitor reminder volume
- detect overdue/reminder spam
- find user causing email load
- disable or delete problematic reminders
- inspect reminder email history
- understand system load today

### 4.2 Dashboard cards

Top cards:

```text
Total Reminders
Active Reminders
Due Today
Overdue
Disabled
Watering
Fertilizing
Other Care
```

Operational cards:

```text
Emails Triggered Today
Users Above Limit
Critical Abuse Users
Pending Email Load Next 24h
```

Definitions:
- Total Reminders: all reminders, active and inactive.
- Active Reminders: `IsActive=true` and user active.
- Due Today: `DueAt` between start/end of current UTC day or configured ops timezone.
- Overdue: `DueAt < now` and `Status=Pending` and `IsActive=true`.
- Disabled: `IsActive=false`.
- Pending Email Load Next 24h: active pending watering reminders due in next 24h.

### 4.3 Reminder table

Columns:

```text
Risk
User
Email
Plant
Reminder
Care Type
Due Date
Repeat Rule
Status
Active
Email Sent
Last Email
Created
Actions
```

Recommended additions:
- `Risk`: Normal, Warning, High, Critical based on user active reminder count and email volume.
- `Email Sent`: sent count for this reminder occurrence or total delivery count.
- `Last Email`: latest `EmailDeliveryLog.SentAt` or status if failed/pending.
- `Created`: helps detect bulk spam creation.

Row visual rules:
- Overdue rows get subtle amber left border.
- Failed-email rows get rose status pill.
- Critical abuse rows appear at top when `risk=critical` filter is active.
- No modal needed for every row; use drawer for details.

### 4.4 Filters

Primary filter bar:

```text
Search user/email/plant/reminder
Care type: All / Watering / Fertilizing / Repotting / Other
Status: All / Pending / Done
Active: All / Active / Disabled
Due: All / Today / Overdue / Next 7 days / Custom range
Email status: Any / Sent / Failed / Pending / Never sent
Risk: Any / Warning / High / Critical
```

Filter UX:
- First row: search + primary segmented filters.
- Advanced filters in collapsible panel.
- Active filter chips below bar with one-click remove.
- Save filter presets later: `Overdue watering`, `Failed email`, `Critical users`.

### 4.5 Reminder detail drawer

Open from table row.

Sections:

```text
Header
- Reminder title
- Plant
- User
- Risk badge

Schedule
- Care type
- DueAt
- RepeatRule
- Status
- Active
- LastDoneAt

Email delivery
- last 5 EmailDeliveryLogs for RelatedEntityType=Reminder, RelatedEntityId=reminder.Id
- status, sentAt, errorCode, errorMessage

Admin actions
- Disable reminder
- Enable reminder
- Delete reminder
- Force complete
- View user profile
- View plant profile

Audit history
- admin action log entries
```

### 4.6 Admin actions

#### Disable Reminder

Use case:
- obvious spam
- bad schedule
- user complaint
- quota protection

Pros:
- reversible
- does not delete evidence
- safest default action

Cons:
- user may be confused if not notified

Recommendation:
- Primary admin action.
- Require reason field.
- Add audit log.
- Optional future user notification.

#### Enable Reminder

Use case:
- false positive
- support resolution

Pros:
- restores service

Cons:
- can restart email load

Recommendation:
- Allow only if user active and under limit or admin confirms warning.

#### Delete Reminder

Use case:
- malicious content
- cleanup test data

Pros:
- removes clutter

Cons:
- destructive, loses context

Recommendation:
- Soft delete preferred via `IsActive=false` plus `DeletedAt` later.
- Hard delete only if current architecture already uses delete and admin confirms.

#### Force Complete

Use case:
- support asks to clear overdue item

Pros:
- uses existing business semantics

Cons:
- for recurring reminder it advances `DueAt`, can be surprising

Recommendation:
- Allowed but dangerous.
- Label as `Mark done as admin`.
- Confirm copy must say it may advance recurring schedule.
- Audit required.

#### View History

Use case:
- support and abuse investigation

Recommendation:
- Always available.
- Includes reminder changes + email delivery logs + admin actions.

### 4.7 Reminder table empty/loading/error states

Loading:
- skeleton rows matching table density, not spinner-only.

Empty:
- `No reminders match these filters.`
- show clear filters button.

Error:
- inline banner with retry.
- do not hide existing loaded data if refetch fails.

---

## 5. Email Operations Center

### 5.1 Jobs to be done

Admin needs to:
- see if email system is healthy
- monitor quota burn
- identify failed categories
- inspect delivery errors
- stop high-risk email generation
- prepare for admin bulk sends in Phase 3

### 5.2 Dashboard cards

Top cards:

```text
Emails Sent Today
Failed Today
Pending
Skipped
Success Rate
Estimated Daily Quota Usage
```

Additional cards:

```text
Reminder Emails Today
Password Reset Emails Today
Top Error Code
Top Sender Category
Suppressed Users
```

Definitions:
- Sent Today: `Status=sent` and `SentAt` today.
- Failed Today: `Status=failed` and `CreatedAt` today.
- Pending: `Status=pending` and `CreatedAt` within pending window.
- Skipped: explicit skipped logs once implemented.
- Success Rate: `sent / (sent + failed)` for selected date range.
- Estimated Daily Quota Usage: local estimate from configured `EmailQuota:DailyLimit` and count sent today.

### 5.3 Email logs table

Columns:

```text
Status
Recipient
User
Category
Subject
Related Entity
Provider
Sent At
Created At
Error
Actions
```

Recommended additions:
- `Age`: pending age, useful for stuck logs.
- `Idempotency Key`: hidden by default, visible in drawer.
- `Related Entity`: Reminder, Auth, Notification.
- `Provider`: BrevoApi/Smtp.

### 5.4 Filters

```text
Search recipient/subject/error
Category: All / password_reset / watering_reminder / admin_notification
Status: All / sent / failed / pending / skipped
Date: Today / 7 days / 30 days / custom
Provider: All / BrevoApi / Smtp
User: email or user id
Related entity: Reminder / Notification / Auth
```

Fast presets:
- Failed today
- Stuck pending
- Reminder emails
- Password reset emails
- High volume users

### 5.5 Email detail drawer

Sections:

```text
Delivery summary
- status
- category
- subject
- recipient
- provider
- sentAt

Related context
- user
- reminder or notification link
- idempotency key

Failure detail
- errorCode
- sanitized errorMessage
- retry eligibility

Admin actions
- retry
- suppress user email
- open user
- export row
```

### 5.6 Admin actions

#### Retry Email

Use case:
- failed transient provider/network issue

Pros:
- resolves transient failures

Cons:
- can duplicate if provider sent but response failed

Recommendation:
- Allow retry only for `failed`, not `sent`.
- Create new `EmailDeliveryLog` attempt with `ParentLogId` later, or `AttemptNumber` if schema expands.
- Do not reuse same idempotency key unless intentionally retrying same logical email with `retry:{oldLogId}:{attempt}`.
- Add confirmation.

#### Resend Email

Use case:
- user asks to resend a successful email

Pros:
- support-friendly

Cons:
- can become spam

Recommendation:
- Not MVP.
- For Phase 3, allow for password reset? No, reset password should always generate a fresh token via auth flow.
- For reminder emails, prefer not to resend sent reminders.

#### Disable Email for User

Use case:
- abuse or bounce complaints

Pros:
- protects quota and sender reputation

Cons:
- user may miss important transactional emails

Recommendation:
- Use granular suppression:
  - reminder email disabled
  - admin notification email disabled
  - all non-auth email disabled
- Do not disable password reset email unless user is banned or email invalid.

#### Export Logs

Use case:
- debugging, support, investor/ops review

Pros:
- useful for operations

Cons:
- PII exposure risk

Recommendation:
- Allow CSV export for selected filtered range.
- Admin-only.
- Limit max rows.
- Mask recipient email optionally in UI, full in export only if explicitly confirmed.

### 5.7 Quota model

Brevo quota may not be available via local API now. Use local estimate first.

Add config:
```text
EmailQuota:DailyLimit=300
EmailQuota:WarningPercent=70
EmailQuota:CriticalPercent=90
```

Computed:
```text
sentToday / DailyLimit
```

Visual states:
- 0-69 percent: Normal
- 70-89 percent: Warning
- 90+ percent: Critical

When critical:
- show banner on Email Operations
- show banner on Reminder Operations
- optionally disable worker by env/manual setting in future

---

## 6. User Email Governance

### 6.1 Options

#### Option A: add booleans directly to `Users`

```text
User.EmailEnabled
User.EmailReminderEnabled
User.EmailAdminNotificationEnabled
```

Pros:
- simple
- fast
- easy query in worker

Cons:
- grows poorly with more channels/categories
- mixes operational preferences into user identity
- no history/reason/source

#### Option B: `UserEmailPreferences` table

```text
UserEmailPreferences
- Id
- UserId unique
- EmailEnabled
- ReminderEmailEnabled
- AdminNotificationEmailEnabled
- PasswordResetEmailEnabled
- SuppressedReason
- SuppressedByAdminId
- SuppressedAt
- CreatedAt
- UpdatedAt
```

Pros:
- clean separation
- supports admin suppression metadata
- easier Phase 3 extension
- auditable

Cons:
- more code
- requires join in worker

#### Option C: generalized `NotificationPreferences`

```text
UserNotificationPreferences
- UserId
- Channel: email / in_app / push
- Category: reminder / admin_notification / security
- Enabled
```

Pros:
- scalable
- best long-term model

Cons:
- overkill for current MVP
- more complex FE/API

### 6.2 Recommendation

Use **Option B** for Phase 2B.

Reason:
- DeskBoost is entering email operations territory.
- Phase 3 admin email needs suppression and consent separation.
- A single `Users.EmailEnabled` will be too blunt.

Recommended model:

```text
UserEmailPreferences
- Id uuid pk
- UserId uuid unique fk Users
- EmailEnabled bool default true
- ReminderEmailEnabled bool default true
- AdminNotificationEmailEnabled bool default true
- SecurityEmailEnabled bool default true
- MarketingEmailEnabled bool default false
- SuppressedReason text null
- SuppressedByAdminId uuid null
- SuppressedAt timestamptz null
- CreatedAt
- UpdatedAt
```

Rules:
- Password reset uses `SecurityEmailEnabled`, but should only be disabled for banned/suppressed-invalid email users.
- Reminder worker requires `EmailEnabled && ReminderEmailEnabled`.
- Phase 3 admin emails require `EmailEnabled && AdminNotificationEmailEnabled`.
- Future marketing requires explicit opt-in.

---

## 7. Abuse prevention

### 7.1 Abuse dimensions

Track per user:
- active reminders count
- reminders created in last 24h
- watering reminders due next 24h
- reminder emails sent today
- reminder email failures today
- repeated failed recipients
- overdue reminder count

### 7.2 Thresholds

Recommended thresholds for student MVP growing to 1000 users:

```text
Active reminders per user:
0-19: Normal
20-49: Warning
50-99: High
100+: Critical
```

```text
Reminder creations per 24h:
0-9: Normal
10-24: Warning
25-49: High
50+: Critical
```

```text
Reminder emails per user per day:
0-9: Normal
10-19: Warning
20-39: High
40+: Critical
```

Why:
- A normal plant-care user likely has 1-10 reminders.
- 20 active reminders is already power-user territory.
- 50 active reminders can materially affect quota.
- 100 active reminders is abuse or broken UX.

### 7.3 Hard user limits

MVP limit recommendation:

```text
Max active reminders per user: 30
Soft warning at: 20
Admin review at: 50
Critical lock at: 100 existing legacy data only
```

Behavior:
- User UI should block creation at 30 active reminders with helpful copy.
- Admin can override only later if needed.
- Worker should cap emails per user per day at 20 before Phase 3 bulk email exists.

### 7.4 Worker throttles

Add Phase 2B controls:

```text
ReminderEmail:MaxEmailsPerUserPerDay=20
ReminderEmail:MaxEmailsPerTickPerUser=5
ReminderEmail:MaxGlobalEmailsPerTick=25
```

If exceeded:
- write `EmailDeliveryLog` status `skipped`
- `ErrorCode=USER_DAILY_LIMIT_EXCEEDED` or `USER_TICK_LIMIT_EXCEEDED`
- show in Email Operations

### 7.5 Abuse actions

Admin actions on user:
- disable reminder emails
- disable all non-security emails
- deactivate user reminders in bulk with reason
- ban user only if broader abuse confirmed

Avoid:
- silent hard delete
- auto-ban from reminder count alone

---

## 8. Admin Email Phase 3 preparation

Phase 2B must design Email Ops so Phase 3 Admin Email Notification can plug in.

### 8.1 Future send modes

Admin notification send targets:

```text
Send to one user
Send to selected users
Send to all active users
```

### 8.2 Architecture rule

Admin email notification must use same pipeline concepts:
- `EmailDeliveryLog`
- user preferences
- suppression checks
- quota checks
- recipient cap
- audit logs
- no unbounded sync loops

### 8.3 Future entities

Add later, not required for Phase 2B-A:

```text
EmailCampaigns
- Id
- CreatedByAdminId
- Category = admin_notification
- Subject
- Body
- TargetType
- Status: draft / queued / sending / completed / failed / cancelled
- RecipientCount
- SentCount
- FailedCount
- CreatedAt
- StartedAt
- CompletedAt
```

```text
EmailCampaignRecipients
- Id
- CampaignId
- UserId
- EmailDeliveryLogId
- Status
```

For Phase 2B, design `EmailDeliveryLog.Category=admin_notification` compatibility now.

### 8.4 Recipient caps

Before queue exists:
- one user: sync allowed
- selected users: max 20 sync
- all active users: disabled or requires queued implementation

After queue/campaign exists:
- all active users can be queued with batch size 25/tick.

---

## 9. UI/UX design

### 9.1 Design system direction

Admin dashboard is dense operational UI. Taste skill explicitly says dashboard/data-table UI should prefer real admin design patterns, not marketing-page visuals.

Recommended visual language:
- existing DeskBoost green accent
- light/dark support via current Tailwind style
- compact cards, clear tables, sticky filters
- semantic colors: emerald success, amber warning, rose critical, slate neutral
- no ornamental gradients
- no AI-purple
- no large hero blocks

Density:
- desktop density: high enough for ops
- mobile density: stacked cards + table cards

### 9.2 Reminder Operations layout

Desktop wireframe:

```text
┌─────────────────────────────────────────────────────────────────────┐
│ Reminder Operations                         [Refresh] [Export]      │
│ Monitor schedules, overdue work, and email risk.                    │
├────────────┬────────────┬────────────┬────────────┬────────────┬────┤
│ Total      │ Active     │ Due Today  │ Overdue    │ Email Load │Risk│
│ 1,248      │ 1,019      │ 182        │ 37         │ 216/300    │ 8  │
├─────────────────────────────────────────────────────────────────────┤
│ Search...     Care Type [All] Status [Pending] Due [Today] Risk [ ] │
│ chips: Overdue x  Watering x                                      │
├─────────────────────────────────────────────────────────────────────┤
│ Risk │ User │ Email │ Plant │ Reminder │ Type │ Due │ Repeat │ Email│
│ High │ An   │ ...   │ Monst.│ Water    │ Wat. │ ... │ Weekly │ Fail │
│ ...                                                                 │
└─────────────────────────────────────────────────────────────────────┘

Right drawer when row clicked:
┌──────────────────────────────┐
│ Reminder detail              │
│ Schedule                     │
│ Email delivery history       │
│ Admin actions                │
│ Audit history                │
└──────────────────────────────┘
```

Mobile:
- cards become 2-column metric grid
- filters collapse into bottom sheet
- table becomes reminder cards
- row actions in kebab menu

### 9.3 Email Operations layout

Desktop wireframe:

```text
┌─────────────────────────────────────────────────────────────────────┐
│ Email Operations                              [Refresh] [Export CSV]│
│ Delivery health, quota risk, and failure triage.                    │
├────────────┬────────────┬────────────┬────────────┬────────────┬────┤
│ Sent Today │ Failed     │ Pending    │ Skipped    │ Success %  │Quota│
│ 186        │ 7          │ 2          │ 4          │ 96.4%      │62%  │
├─────────────────────────────────────────────────────────────────────┤
│ [Failed today] [Stuck pending] [Reminder emails] [High volume users]│
├─────────────────────────────────────────────────────────────────────┤
│ Search recipient/subject/error  Category [All] Status [All] Date... │
├─────────────────────────────────────────────────────────────────────┤
│ Status │ Recipient │ Category │ Subject │ Provider │ Sent │ Error  │
│ Failed │ a@b.com   │ reminder │ Desk... │ Brevo    │ -    │ 429... │
└─────────────────────────────────────────────────────────────────────┘
```

### 9.4 Table design rules

- Use sticky table header on desktop.
- Keep row height 56-64px.
- Status pills are text + color, not icon-only.
- Risk indicators use words: Normal, Warning, High, Critical.
- Do not hide critical info behind hover-only UI.
- Provide bulk selection only after bulk actions exist.

### 9.5 Actions UX

Danger levels:
- Low: view detail, copy ID, open user
- Medium: retry failed email, enable reminder
- High: disable reminder, suppress user emails
- Critical: delete reminder, bulk disable reminders

High/critical actions require:
- confirmation modal
- reason text
- audit log

### 9.6 Charts

MVP charts should be simple:
- small 7-day bar trend for sent/failed emails
- no complex chart library unless already present
- if no chart dependency, use CSS bars in cards

---

## 10. Backend plan

### 10.1 New read APIs

Create admin operations endpoints under existing admin auth:

```http
GET /api/admin/reminder-operations/summary
GET /api/admin/reminder-operations/reminders
GET /api/admin/reminder-operations/users/risk
GET /api/admin/reminder-operations/reminders/{id}
GET /api/admin/reminder-operations/reminders/{id}/history
```

Email endpoints:

```http
GET /api/admin/email-operations/summary
GET /api/admin/email-operations/logs
GET /api/admin/email-operations/logs/{id}
GET /api/admin/email-operations/users/risk
```

### 10.2 Query parameters

Reminder list:
```text
search
careType
status
isActive
dueFrom
dueTo
dueBucket=today|overdue|next7days
emailStatus
riskLevel
userId
page
limit
sort
```

Email logs:
```text
search
category
status
dateFrom
dateTo
provider
userId
relatedEntityType
relatedEntityId
page
limit
sort
```

### 10.3 Mutating APIs

Reminder actions:

```http
PUT /api/admin/reminder-operations/reminders/{id}/disable
PUT /api/admin/reminder-operations/reminders/{id}/enable
PUT /api/admin/reminder-operations/reminders/{id}/complete
DELETE /api/admin/reminder-operations/reminders/{id}
```

Body:
```json
{
  "reason": "Spam-like reminder volume reported by Email Ops"
}
```

Email actions:

```http
POST /api/admin/email-operations/logs/{id}/retry
POST /api/admin/email-operations/users/{userId}/suppress
POST /api/admin/email-operations/users/{userId}/unsuppress
GET /api/admin/email-operations/logs/export
```

MVP note:
- Retry can be deferred to Phase 2B-C.
- Suppress can be included with governance table.

### 10.4 DTOs

Reminder summary:
```json
{
  "total": 1248,
  "active": 1019,
  "dueToday": 182,
  "overdue": 37,
  "disabled": 29,
  "watering": 890,
  "fertilizing": 210,
  "other": 148,
  "pendingEmailLoadNext24h": 216,
  "criticalUsers": 3
}
```

Reminder row:
```json
{
  "id": "uuid",
  "userId": "uuid",
  "userName": "Anh Nguyen",
  "userEmail": "anh@example.com",
  "plantId": "uuid",
  "plantName": "Monstera desk",
  "title": "Water morning",
  "careType": "watering",
  "dueAt": "2026-06-18T08:00:00Z",
  "repeatRule": "weekly",
  "status": "pending",
  "isActive": true,
  "lastDoneAt": null,
  "lastEmailStatus": "sent",
  "lastEmailSentAt": "2026-06-18T08:03:00Z",
  "emailSendCount": 4,
  "riskLevel": "warning"
}
```

Email summary:
```json
{
  "sentToday": 186,
  "failedToday": 7,
  "pending": 2,
  "skippedToday": 4,
  "successRate": 96.4,
  "dailyQuotaLimit": 300,
  "dailyQuotaUsed": 186,
  "dailyQuotaPercent": 62,
  "topErrorCode": "ExternalServiceException"
}
```

Email log row:
```json
{
  "id": "uuid",
  "recipientUserId": "uuid",
  "recipientEmail": "a@example.com",
  "category": "watering_reminder",
  "subject": "DeskBoost nhac tuoi cay: Monstera",
  "status": "failed",
  "provider": "BrevoApi",
  "sentAt": null,
  "createdAt": "2026-06-18T08:00:00Z",
  "errorCode": "ExternalServiceException",
  "errorMessage": "Khong the gui email...",
  "relatedEntityType": "Reminder",
  "relatedEntityId": "uuid"
}
```

### 10.5 Database changes

Phase 2B recommended tables:

#### `UserEmailPreferences`

```text
Id
UserId unique
EmailEnabled default true
ReminderEmailEnabled default true
AdminNotificationEmailEnabled default true
SecurityEmailEnabled default true
MarketingEmailEnabled default false
SuppressedReason null
SuppressedByAdminId null
SuppressedAt null
CreatedAt
UpdatedAt
```

#### `AdminAuditLogs`

```text
Id
ActorAdminId
Action
EntityType
EntityId
TargetUserId null
Reason null
BeforeJson null
AfterJson null
CreatedAt
```

Actions:
- `reminder.disable`
- `reminder.enable`
- `reminder.complete`
- `email.retry`
- `email.suppress_user`
- `email.unsuppress_user`

#### Optional later: `EmailCampaigns`

Keep for Phase 3.

### 10.6 Permissions

Current admin role is `[Authorize(Roles="ADMIN")]`.

MVP:
- all operations pages admin-only.

Future:
- split roles:
  - `ADMIN`
  - `OPS_ADMIN`
  - `SUPPORT`

Restriction suggestion:
- Support can view and disable reminder.
- Only Admin can delete, suppress all email, export logs.

---

## 11. Frontend plan

### 11.1 New pages

Create:
```text
FE/pages/admin/AdminReminderOperations.jsx
FE/pages/admin/AdminEmailOperations.jsx
```

Modify:
```text
FE/routes/AppRouter.tsx
FE/components/AdminLayout.jsx
FE/i18n/locales.ts
FE/services/adminOperationsApi.js
```

Optional shared components:
```text
FE/components/admin/OpsMetricCard.jsx
FE/components/admin/OpsFilterBar.jsx
FE/components/admin/OpsStatusPill.jsx
FE/components/admin/OpsDrawer.jsx
FE/components/admin/OpsTable.jsx
FE/components/admin/ConfirmReasonModal.jsx
```

### 11.2 API service shape

`adminOperationsApi.js`:
```text
getReminderOpsSummary(params)
getAdminReminders(params)
getAdminReminder(id)
disableAdminReminder(id, reason)
enableAdminReminder(id, reason)
completeAdminReminder(id, reason)

getEmailOpsSummary(params)
getEmailLogs(params)
getEmailLog(id)
retryEmailLog(id, reason)
suppressUserEmail(userId, payload)
unsuppressUserEmail(userId, reason)
```

### 11.3 Page components

Reminder page:
- Header
- Risk banner if critical users > 0
- Metric cards
- Filter bar
- Table
- Detail drawer
- Confirm reason modal

Email page:
- Header
- Quota banner
- Metric cards
- Preset chips
- Filter bar
- Logs table
- Detail drawer
- Export action

### 11.4 Responsive behavior

Desktop >= 1024:
- sidebar + full table
- drawer slides from right
- filters horizontal

Tablet:
- table with horizontal scroll
- filters 2-row layout

Mobile:
- cards list instead of table
- filters in sheet
- actions menu per card

---

## 12. Implementation roadmap

### Phase 2B-A: Visibility only

Goal: admin can see reminder and email ops.

Backend:
- `GET /api/admin/reminder-operations/summary`
- `GET /api/admin/reminder-operations/reminders`
- `GET /api/admin/email-operations/summary`
- `GET /api/admin/email-operations/logs`

Frontend:
- add nav items
- add two pages
- add metric cards, filters, tables
- no mutating actions except open user/reminder details

Verification:
- admin-only routes work
- summary numbers match DB spot checks
- pagination works
- no email sends triggered by page load

### Phase 2B-B: Safe controls and governance

Goal: admin can contain risk.

Backend:
- `UserEmailPreferences`
- `AdminAuditLogs`
- disable/enable reminder endpoints
- suppress/unsuppress reminder email endpoints
- worker respects preference
- user reminder creation limit enforcement

Frontend:
- disable/enable reminder action
- suppress/unsuppress user email action
- reason modal
- audit drawer section
- risk badges

Verification:
- actions audited
- disabled reminder no longer appears in worker query
- suppressed user no longer receives reminder email

### Phase 2B-C: Email operations hardening

Goal: operational maturity before Phase 3.

Backend:
- skipped logs for rate/limit conditions
- stale pending detection
- optional retry failed email
- export logs
- quota config and summary
- per-user email caps

Frontend:
- quota banner
- retry action for failed logs only
- export CSV
- stuck pending preset
- high-volume users view

Verification:
- failed retry creates separate log or attempt record
- quota warning appears at 70 percent
- critical appears at 90 percent
- export respects filters and row cap

---

## 13. Codex implementation prompts

### Prompt 1 - Phase 2B-A visibility only

```text
Implement DeskBoost Phase 2B-A visibility only from plans/admin-reminder-email-operations-center.md.

Scope:
- Backend read-only admin APIs for Reminder Operations summary/list and Email Operations summary/logs.
- Frontend admin nav + two pages with metric cards, filters, tables.
- No mutating actions. No retry. No suppress. No email sending from admin pages.

Backend files likely:
- BE/DeskBoost/DeskBoost.API/Controllers/AdminOperationsController.cs or add carefully to AdminController if project prefers.
- BE/DeskBoost/DeskBoost.Application/Features/Admin/Queries/*
- BE/DeskBoost/DeskBoost.Application/Common/Models/*

Frontend files likely:
- FE/routes/AppRouter.tsx
- FE/components/AdminLayout.jsx
- FE/pages/admin/AdminReminderOperations.jsx
- FE/pages/admin/AdminEmailOperations.jsx
- FE/services/adminOperationsApi.js
- FE/i18n/locales.ts

Requirements:
- Admin only.
- Pagination + filters.
- No secrets/log HTML exposed.
- Email log error message sanitized only.
- Tables responsive and match existing AdminLayout visual style.

Verify:
- cd BE/DeskBoost && dotnet build DeskBoost.sln --nologo
- cd FE && npm run lint
- cd FE && npm run build
```

### Prompt 2 - Phase 2B-B controls

```text
Implement Phase 2B-B safe controls from plans/admin-reminder-email-operations-center.md.

Scope:
- UserEmailPreferences table.
- AdminAuditLogs table.
- Disable/enable reminder endpoints with reason.
- Suppress/unsuppress reminder emails for user.
- Worker respects ReminderEmailEnabled and EmailEnabled.
- FE actions with reason modal.

Do not implement retry or admin bulk email.

Verify build/lint and report audit log behavior.
```

### Prompt 3 - Phase 2B-C hardening

```text
Implement Phase 2B-C email operations hardening from plans/admin-reminder-email-operations-center.md.

Scope:
- skipped logs for rate/limit conditions.
- stale pending detection in Email Ops summary.
- quota config and warning/critical summary.
- optional retry failed email only with separate attempt semantics.
- CSV export with filters and row cap.

Do not implement Phase 3 admin email campaigns.
```

---

## 14. Non-goals

- No Phase 3 admin email sending yet.
- No marketing campaign builder.
- No full RBAC rewrite.
- No queue system unless needed after 1000+ users.
- No redesign of all Admin pages.
- No destructive bulk actions in first release.

---

## 15. Final recommendation

Build **visibility first**, then **safe controls**, then **retry/quota hardening**.

Do not ship Phase 3 Admin Email Notification until:
- Email Operations can show sent/failed/pending by category.
- Admin can suppress a high-risk user.
- Reminder Operations can identify top reminder abusers.
- Per-user reminder/email thresholds exist.
- Admin actions are audited.

This is the minimum SaaS operations layer needed for 1000 users without DB or Render log access.
