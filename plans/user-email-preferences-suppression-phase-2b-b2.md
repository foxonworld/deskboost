# Phase 2B-B2 - UserEmailPreferences & Reminder Email Suppression

Scope: per-user reminder email suppress/unsuppress. Reminder stays active in app. No admin sending, retry, export, campaign, push, max reminder limit, delete, force complete.

## 1. Current state
- Phase 2A: worker sends watering reminders, writes `EmailDeliveryLog`, uses idempotency.
- Phase 2B-A: Admin Reminder Ops + Email Ops visibility-only.
- Phase 2B-B1: `AdminAuditLogs` + disable/enable reminder governance.
- Gap: admin cannot stop reminder emails for one user while keeping reminders active.

## 2. DB changes

Create `UserEmailPreferences`:
- `Id` uuid pk
- `UserId` uuid unique FK -> `Users.Id`
- `EmailEnabled` bool default true
- `ReminderEmailEnabled` bool default true
- `AdminNotificationEmailEnabled` bool default true
- `SecurityEmailEnabled` bool default true
- `SuppressedReason` max 500, `SuppressedByAdminId`, `SuppressedAt` nullable
- `CreatedAt`, `UpdatedAt`

Index: unique `(UserId)`.

Decisions:
- Missing preference row = all enabled.
- Password reset unchanged. Do not wire B-B2 prefs into forgot password.
- Unsuppress clears current suppression fields; history stays in audit logs.

## 3. Backend APIs

Admin-only. Reuse B-B1 reason validation: trim, required, 10-500 chars.

```http
PUT /api/admin/email-operations/users/{userId}/reminder-email/suppress
PUT /api/admin/email-operations/users/{userId}/reminder-email/unsuppress
```

Body:
```json
{ "reason": "High reminder email volume from this user" }
```

Response:
```json
{
  "userId": "uuid",
  "emailEnabled": true,
  "reminderEmailEnabled": false,
  "adminNotificationEmailEnabled": true,
  "securityEmailEnabled": true,
  "suppressedReason": "High reminder email volume from this user",
  "suppressedByAdminId": "uuid",
  "suppressedAt": "2026-06-18T00:00:00Z",
  "updatedAt": "2026-06-18T00:00:00Z"
}
```

Behavior:
- Missing row -> create defaults then apply change.
- Suppress -> `ReminderEmailEnabled=false` + suppression fields.
- Unsuppress -> `ReminderEmailEnabled=true` + clear suppression fields.
- Idempotent no-op -> no duplicate audit unless real state changes.

## 4. Worker changes

Before sending:
- Load preferences for candidate user ids.
- Missing preference = enabled.
- Skip if `EmailEnabled=false` or `ReminderEmailEnabled=false`.
- Keep reminder active and unchanged.

Skipped log decision: yes.
- `Category=watering_reminder`
- `Status=skipped`
- `ErrorCode=REMINDER_EMAIL_SUPPRESSED`
- `ErrorMessage=Reminder email disabled for user`
- `RelatedEntityType=Reminder`
- `RelatedEntityId=reminder.Id`

Skipped idempotency key:
```text
watering-reminder:{reminderId}:{dueAtUtcRoundedToMinuteTicks}
```

Same key as send occurrence. Prevents future send for same occurrence while suppressed.

Must not update `Reminder.Status`, `DueAt`, `IsSent`, `LastDoneAt`.

## 5. Audit behavior

Reuse B-B1 `AdminAuditLogs`.

Action names:
- `email_preferences.suppress_reminder_email`
- `email_preferences.unsuppress_reminder_email`

Fields:
- `ActorAdminId`: current admin
- `EntityType`: `UserEmailPreferences`
- `EntityId`: preference row id
- `TargetUserId`: affected user
- `Reason`: required
- `BeforeJson`, `AfterJson`: safe preference fields only
- `IpAddress`, `UserAgent`, `CreatedAt`

Never store HTML body, tokens, API keys, password reset token, provider payload.

## 6. FE UX design

Primary placement: Email Ops.
- On rows with `recipientUserId`: show `Suppress reminder email` or `Unsuppress reminder email`.
- If no linked user: disabled action + tooltip `No linked user.`

Secondary visibility: Reminder Ops/User context.
- Badge near user/email: `Reminder email suppressed`.
- Optional shortcut only if user id available. Primary remains Email Ops.

Modal:
- Reuse B-B1 reason modal.
- Suppress title: `Suppress reminder email for user?`
- Unsuppress title: `Allow reminder email for user?`
- Effect: `Reminders stay active in the app. Only reminder emails are stopped.`
- Reason required, 10-500 chars.
- Confirm disabled while invalid/saving.

After success:
- Toast success.
- Update badge immediately.
- Refresh summary/list without resetting filters/page.
- Update all visible rows for same user.

Badges: `Reminder email on` emerald, `Reminder email suppressed` amber, `Global email off` slate if `EmailEnabled=false` later.

## 7. Test checklist

- BE build passes; migration creates table + unique user index.
- Suppress creates row if missing; unsuppress re-enables and clears current suppression fields.
- Invalid reason 400; non-admin 401/403; audit written for real state change.
- Missing preference row sends as before.
- `ReminderEmailEnabled=false` creates skipped log, sends no email, reminder unchanged.
- Same suppressed occurrence does not create duplicate skipped logs.
- Forgot password still works.
- FE action opens modal; success updates badge/keeps filters; failure keeps modal open.

## 8. Rollout plan

1. Deploy migration, no behavior change because missing/default enabled.
2. Deploy APIs + FE actions.
3. Deploy worker preference check.
4. Test internal user: suppress -> skipped/no email; unsuppress -> next occurrence sends.
5. Monitor Email Ops for `skipped` logs.

## 9. Risks & mitigations

- Accidental suppression -> reason modal + reversible unsuppress + audit.
- Hidden state -> badge in Email Ops and Reminder Ops context.
- Password reset blocked -> do not connect B-B2 prefs to forgot password.
- Duplicate skipped logs -> same occurrence idempotency key.
- User confusion -> reminders remain active in app.
- Audit noise -> no audit for idempotent no-op.
- Data leak -> safe fields only.

## 10. Codex implementation prompt

```text
Implement DeskBoost Phase 2B-B2 UserEmailPreferences & Reminder Email Suppression from plans/user-email-preferences-suppression-phase-2b-b2.md.

Scope only: add UserEmailPreferences entity/config/DbSet/migration; add suppress/unsuppress admin APIs; reuse reason validation 10-500 chars; reuse AdminAuditLogs with action names email_preferences.suppress_reminder_email and email_preferences.unsuppress_reminder_email; worker skips when EmailEnabled=false or ReminderEmailEnabled=false, missing row = enabled; suppressed reminder writes EmailDeliveryLog status=skipped, ErrorCode=REMINDER_EMAIL_SUPPRESSED, same occurrence idempotency key; FE adds Email Ops suppress/unsuppress action, reason modal, badges, visible-row update.

Do not implement admin email sending, retry, export, campaign, push, max 30 reminder limit, delete reminder, force complete, or forgot password changes.

Verify: dotnet build, FE lint/build, manual suppress -> skipped log/no email/reminder still active, unsuppress -> future occurrence sends, audit log exists.
```
