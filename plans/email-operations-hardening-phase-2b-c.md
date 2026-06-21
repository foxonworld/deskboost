# Phase 2B-C - Email Operations Hardening

Scope: harden Email Ops before Phase 3 Admin Email Notification. No admin email sending, campaign, marketing, push, large queue system.

## 1. Current state
- Phase 1: forgot password email works via existing email service.
- Phase 2A: watering reminder worker writes `EmailDeliveryLog` with `pending/sent/failed/skipped` style flow and idempotency.
- Phase 2B-A: Admin Email Ops can view logs, status, quota estimate, failures.
- Phase 2B-B2: reminder email suppression can create skipped logs.
- Remaining gaps: quota thresholds are config-light, pending can get stuck, failure triage is passive, export/retry policy not formalized.

## 2. Decisions

Retry in Phase 2B-C:
- Implement optional manual retry only for `watering_reminder` failed logs.
- Do not retry `password_reset` logs. Old reset token may be expired or unsafe.
- Do not retry `skipped` logs. Suppression/limits are intentional.
- Do not add automatic retry yet.

Retry log behavior:
- Create a new `EmailDeliveryLog` attempt, do not update old failed log into sent.
- Link via new nullable `ParentLogId` if feasible. If avoiding migration, encode relation in `IdempotencyKey` and audit log. Recommendation: add `ParentLogId`.

Export logs:
- Implement CSV export optional but useful for ops.
- Row cap: 1000 rows max.
- Export uses current filters.
- Admin-only.

Quota daily limit:
- Use config, not hardcode 300.
- Default example can be 300.

Stale pending:
- Pending older than 15 minutes = stale.

Quota thresholds:
- Warning: 70 percent.
- Critical: 90 percent.

## 3. Backend changes

Email Ops summary: `sentToday`, `failedToday`, `pending`, `stalePending`, `skippedToday`, `successRate`, `dailyQuotaLimit`, `dailyQuotaUsed`, `dailyQuotaPercent`, `quotaLevel`.

Email log row: `isStalePending`, `canRetry`, `parentLogId` if added, optional `attemptNumber`.

New endpoints:
```http
POST /api/admin/email-operations/logs/{id}/retry
GET /api/admin/email-operations/logs/export
```

Retry body:
```json
{ "reason": "Transient provider failure reviewed by admin" }
```

Retry validation: admin-only; reason 10-500; source log `failed`; category `watering_reminder`; related reminder exists/active/pending/watering; user active; preferences allow; global email/reminder email enabled.

## 4. FE changes

Email Ops dashboard: quota banner warning/critical, `Stale pending` card, `Skipped today` card, quick filters Failed today/Stale pending/Skipped/Watering reminders.

Email logs table: badges `Stale pending`, `Retry eligible`, `Skipped`; failed drawer shows sanitized error + eligibility; retry only if `canRetry=true`; export disabled when no rows.

No Phase 3 send UI.

## 5. Config

Add non-secret keys:
```json
"EmailOperations": {
  "DailyQuotaLimit": 300,
  "QuotaWarningPercent": 70,
  "QuotaCriticalPercent": 90,
  "StalePendingMinutes": 15,
  "ExportMaxRows": 1000,
  "RetryEnabled": true
}
```

Rules:
- If quota limit missing or <=0, show quota as unknown, not 0 percent.
- Config goes in `appsettings.example.json` with safe defaults only.

## 6. Retry design

Manual retry flow: admin opens failed `watering_reminder`, enters reason, backend revalidates, creates new `EmailDeliveryLog` pending with `ParentLogId`, sends, new log becomes sent/failed, old log remains failed, audit `email.retry` stores old/new ids.

Retry idempotency key:
```text
retry:{oldLogId}:{attemptNumber}
```

Do not reuse original idempotency key. Original occurrence key must remain historical.

Retry limits:
- Max 2 manual retries per original failed log.
- No retry if a child retry already succeeded.

## 7. Export design

Endpoint respects filters: category, status, dateFrom/dateTo, userId, search, relatedEntityType.

CSV columns:
- id, createdAt, sentAt, status, category, recipientEmail, subject, provider, errorCode, errorMessage, relatedEntityType, relatedEntityId

Safety: cap 1000 rows, sanitize newlines, no HTML/API keys/tokens, audit `email_logs.export` with filters and row count.

## 8. Risk mitigation

- Retrying password reset token is unsafe -> disallow password_reset retry.
- Duplicate email risk -> retry only manual, failed only, max 2, new log.
- Provider sent but response failed -> admin must confirm reason; residual risk noted in UI.
- Export PII risk -> admin-only, row cap, audit, no secrets/body.
- Stale pending false alarm -> informational only, no auto resend.
- Quota wrong -> config-based, display as estimate.
- Skipped misunderstood as failure -> separate skipped status copy: intentional non-send.

## 9. Rollout

1. Add config + summary fields for quota/stale pending.
2. Add FE banners/cards/filters for quota/stale/skipped.
3. Add export if wanted now.
4. Add manual retry last behind `EmailOperations:RetryEnabled`.
5. Test staging with one failed watering log.
6. Keep Phase 3 blocked until quota/stale/skipped/failure UX verified.

## 10. Codex prompt

```text
Implement DeskBoost Phase 2B-C Email Operations Hardening from plans/email-operations-hardening-phase-2b-c.md.

Scope only:
1. Add EmailOperations config: DailyQuotaLimit, QuotaWarningPercent, QuotaCriticalPercent, StalePendingMinutes, ExportMaxRows, RetryEnabled.
2. Extend Email Ops summary with stalePending, skippedToday, quota fields, quotaLevel.
3. Extend Email Ops rows with isStalePending and canRetry.
4. FE: quota banner, stale pending card/filter, skipped visibility, failure detail drawer copy.
5. Optional export endpoint GET /api/admin/email-operations/logs/export with current filters, max 1000 rows, audit email_logs.export.
6. Optional retry endpoint POST /api/admin/email-operations/logs/{id}/retry, only failed watering_reminder, reason 10-500, max 2 retries, create new EmailDeliveryLog with ParentLogId and retry idempotency key.

Do not retry password_reset, skipped, sent, suppressed, or non-watering categories. Do not implement admin sending, campaign, marketing, push, queue system, or automatic retry.

Verify: BE build, FE lint/build, stale pending >15m shown, quota warning at 70%, critical at 90%, skipped visible, export capped, retry creates new log and audit, old failed log remains unchanged.
```
