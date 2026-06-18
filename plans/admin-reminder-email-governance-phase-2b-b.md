# Phase 2B-B - Reminder & Email Governance

Scope: governance/control only. No admin email sending, retry, export, campaign, push, marketing.

## 1. Current state summary
- Phase 2A: `WateringReminderEmailWorker` sends watering emails, writes `EmailDeliveryLog`, uses idempotency.
- Phase 2B-A: Admin Reminder Ops + Email Ops visibility-only done.
- Admin can see reminders, email logs, quota estimate, risk, stats.
- Gaps: no user email preferences, no disable/enable reminder, no reminder-email suppression, no durable audit log, no active reminder limit, worker ignores preferences.

## 2. Recommended DB changes

Decision: use `UserEmailPreferences` table. Do not add booleans to `User`.
Why: cleaner identity model, scalable for Phase 3 admin email/security/marketing, stores suppression reason/admin/time, missing row can default enabled.

`UserEmailPreferences`:
- `Id`, `UserId` unique FK
- `EmailEnabled` bool default true
- `ReminderEmailEnabled` bool default true
- `AdminNotificationEmailEnabled` bool default true
- `SecurityEmailEnabled` bool default true
- `SuppressedReason`, `SuppressedByAdminId`, `SuppressedAt`
- `CreatedAt`, `UpdatedAt`
Rules: worker requires `EmailEnabled && ReminderEmailEnabled`; missing row = enabled; password reset unchanged in B-B.

`AdminAuditLogs`:
- `Id`, `ActorAdminId`, `Action`, `EntityType`, `EntityId`, `TargetUserId`
- `Reason` required max 500
- `BeforeJson`, `AfterJson` safe fields only
- `IpAddress`, `UserAgent`, `CreatedAt`
Actions: `reminder.disable`, `reminder.enable`, `email_preferences.suppress_reminder_email`, `email_preferences.unsuppress_reminder_email`.
Indexes: `(EntityType,EntityId,CreatedAt)`, `(ActorAdminId,CreatedAt)`, `(TargetUserId,CreatedAt)`, `(Action,CreatedAt)`.

## 3. Admin APIs

All admin-only under `/api/admin` or existing `AdminOperationsController`.

Reminder governance:
- `PUT /api/admin/reminder-operations/reminders/{id}/disable`
- `PUT /api/admin/reminder-operations/reminders/{id}/enable`

Email governance:
- `PUT /api/admin/email-operations/users/{userId}/reminder-email/suppress`
- `PUT /api/admin/email-operations/users/{userId}/reminder-email/unsuppress`

Body for all mutations:
```json
{ "reason": "User created duplicate reminder spam" }
```

Validation:
- reason required, trim, 10-500 chars.
- target must exist.
- action idempotent where possible.
- no bulk endpoint.
- response returns updated row or compact status DTO.

Optional B-B2 audit read: `GET /api/admin/audit-logs?entityType=Reminder&entityId=...`

## 4. FE changes

Likely files:
- `FE/pages/admin/AdminReminderOperations.jsx`
- `FE/pages/admin/AdminEmailOperations.jsx`
- `FE/services/adminOperationsApi.js`
- `FE/components/admin/ReasonModal.jsx`

Reminder Ops:
- Row action Disable when active, Enable when disabled.
- Refresh summary/list after success.
- Show disabled badge.

Email Ops:
- User action Suppress/Unsuppress reminder email.
- Show suppressed badge when API returns preference state.

Do not add retry/resend/export/bulk/campaign UI.

## 5. UX rules

Decision: confirmation modal + required reason for every governance mutation.

Reason modal:
- exact action name
- target user/email/reminder title
- clear effect summary
- textarea label `Reason for audit log`
- confirm disabled until reason valid

Action severity:
- Disable reminder: warning, reversible.
- Enable reminder: neutral confirm.
- Suppress reminder email: warning, reversible.
- Unsuppress reminder email: neutral confirm.

Delete Reminder: no in B-B. Use disable.
Force Complete: no in B-B. It changes care workflow and recurring `DueAt`.
Reason required: yes, for all four actions.

## 6. Abuse thresholds

Active reminders/user:
- 0-19 Normal
- 20-29 Warning
- 30-49 Block new creation for normal users
- 50-99 High, admin review
- 100+ Critical

MVP hard limit: max active reminders/user = 30.
Creation rate/24h: 0-9 Normal, 10-24 Warning, 25-49 High, 50+ Critical.
Reminder emails/user/day: 0-9 Normal, 10-19 Warning, 20-39 High, 40+ Critical.
B-B must enforce the 30 active reminder limit on normal user reminder creation.

## 7. Worker changes

Worker must:
- load preferences for candidate users.
- treat missing preference as enabled.
- skip email if `EmailEnabled=false` or `ReminderEmailEnabled=false`.
- keep reminder active and unchanged when suppressed.

Recommended for visibility: write `EmailDeliveryLog` status `skipped`, `ErrorCode=REMINDER_EMAIL_SUPPRESSED`, same reminder relation + occurrence idempotency.
Must not update `Reminder.Status`, advance `DueAt`, set `IsSent`, or auto-complete reminder.

## 8. Safety risks

1. Wrong reminder disabled -> confirm + reason + reversible enable.
2. Hidden suppression -> badge in Email Ops + audit log.
3. Missing audit -> write audit in same transaction as mutation.
4. Accidental mass action -> no bulk actions.
5. Worker ignores preference -> manual/test suppressed user case.
6. Missing preference blocks email -> default enabled.
7. Legit power user blocked -> limit 30 with clear UX copy.
8. Delete/force-complete corrupts workflow -> exclude.
9. Audit leaks secrets/body -> safe fields only, no HTML/token.
10. Double click/race -> idempotent mutation + disabled buttons while saving.

## 9. Implementation order

B-B1: Reminder governance + audit.
- Add `AdminAuditLogs`.
- Add disable/enable reminder APIs.
- Add FE `ReasonModal` + Reminder Ops actions.
- Verify audit per mutation.

B-B2: Email preference governance.
- Add `UserEmailPreferences`.
- Add suppress/unsuppress reminder email APIs.
- Add Email Ops actions/badges.
- Worker respects preferences.

B-B3: Abuse limits.
- Enforce max 30 active reminders/user.
- Add friendly API error.
- Optional skipped logs for suppressed reminders.

## 10. Codex prompt

```text
Implement DeskBoost Phase 2B-B Governance from plans/admin-reminder-email-governance-phase-2b-b.md.

Scope only:
1. Add AdminAuditLogs + UserEmailPreferences entities/config/DbSet/migrations.
2. Add admin APIs: disable/enable reminder, suppress/unsuppress reminder email.
3. Require reason 10-500 chars for every mutation.
4. Audit every mutation with actor, action, entity, target user, reason, before/after safe fields.
5. Worker skips users with EmailEnabled=false or ReminderEmailEnabled=false; missing preference = enabled.
6. Enforce max 30 active reminders/user on normal user reminder creation.
7. FE: ReasonModal + row actions in Admin Reminder Ops and Email Ops.

Do not implement delete reminder, force complete, retry email, export logs, admin email sending, campaign, push, marketing, bulk actions.

Verify: dotnet build DeskBoost.sln --nologo, npm run lint, npm run build. Manual: disable stops worker via IsActive=false; suppress keeps reminder active but no email; every mutation creates AdminAuditLog.
```

## UX Appendix for Phase 2B-B

### Reminder Ops actions
- Row menu shows only valid next action: active -> `Disable reminder`, disabled -> `Enable reminder`.
- Disable copy: `This keeps the reminder record but stops future reminder email processing.`
- Enable copy: `This allows the reminder to appear in normal reminder processing again.`
- After success, refresh summary + current page; keep filters/page stable.
- Disable buttons while saving; prevent double submit.

### Email Ops suppression actions
- Suppress action appears on email log rows with `recipientUserId`.
- Suppress copy: `Reminder emails for this user will stop. The reminders remain active in-app.`
- Unsuppress copy: `Reminder emails can be sent again if global email and worker settings are enabled.`
- Never place suppression next to retry/resend because those are out of scope.
- If user id missing, show disabled action with tooltip: `No linked user.`

### Reason modal
- One reusable modal for all governance actions.
- Layout: title, target summary card, effect text, reason textarea, cancel, confirm.
- Target card fields: user/email, reminder title or preference type, current state.
- Textarea helper: `10-500 characters. Stored in admin audit logs.`
- Inline validation: empty, too short, too long.
- Confirm label mirrors action: `Disable reminder`, `Suppress email`, etc.

### Confirmation behavior
- No immediate destructive action.
- Escape/backdrop closes only when not saving.
- On success: toast + close modal.
- On failure: keep modal open, show error above actions.
- If target already changed, show stale-state error and offer refresh.

### Badges
- Reminder active: `Active` emerald, `Disabled` slate/amber.
- Email preference: `Reminder email on` emerald, `Suppressed` amber.
- Risk: Normal slate, Warning amber, High orange, Critical rose.
- Audit-required actions should show small `Audited` hint in modal, not every row.

### Empty, error, loading states
- Loading: skeleton metric cards + skeleton rows, not blank table.
- Empty filter result: `No records match these filters.` + `Clear filters`.
- Empty true state: `No reminders found` or `No email logs yet`.
- Error: inline banner with `Retry`; preserve stale data if already loaded.
- Mutation loading: row-level spinner plus disabled action menu.

### Mobile behavior
- Table rows become stacked cards.
- Primary action goes in card footer; secondary actions in kebab menu.
- Reason modal becomes bottom sheet with sticky confirm/cancel footer.
- Filters remain collapsed by default; active filter chips visible.
- Long emails/subjects truncate with tap-to-view in detail drawer.
- Avoid horizontal action clusters; one full-width confirm button per modal.
