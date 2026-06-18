# Phase 2B-B3 - Reminder Abuse Protection

Scope: protect reminder/email capacity from reminder spam. No admin email, retry, export, campaign, delete, force complete, worker send changes.

## 1. Current state
- Phase 2A: worker sends watering reminder emails with `EmailDeliveryLog` idempotency.
- Phase 2B-A: Admin Reminder Ops + Email Ops visibility-only.
- Phase 2B-B1: admin disable/enable reminder with audit.
- Phase 2B-B2: admin suppress/unsuppress reminder email per user.
- Gap: normal users can still create too many active reminders and overload worker/email quota.

## 2. Decisions

Max active reminders/user:
- MVP hard limit: 30 active reminders per normal user.
- Existing users above 30 are grandfathered, but cannot create more until below 30.

Risk thresholds:
- Normal: 0-19 active reminders
- Warning: 20-29
- High: 30-49
- Critical: 50+

Why:
- Normal plant-care usage is usually 1-10 reminders.
- 20 is power-user territory.
- 30 is generous for small SaaS and protects Brevo quota.
- 50+ is likely test data, abuse, or broken UX.

## 3. Active reminder limit

Definition:
```text
Active reminder = Reminder.UserId == current user
  and IsActive == true
  and Status == Pending
```

Create behavior:
- On `POST /api/reminders`, count active pending reminders for current user.
- If count >= 30, reject creation.
- Use authenticated user id, not request body.

Update behavior:
- Editing existing active reminder at/above 30 is allowed.
- If update reactivates a non-active reminder into active pending, apply same limit.

Cleanup behavior:
- Delete, disable, and mark done must remain allowed.
- Do not auto-disable old reminders.

## 4. Abuse thresholds and risk levels

Admin risk formula:
```text
normal: activeReminderCount < 20
warning: 20 <= activeReminderCount < 30
high: 30 <= activeReminderCount < 50
critical: activeReminderCount >= 50
```

Optional display-only signals: reminders created last 24h, due reminders next 24h, reminder emails sent/skipped today, suppression status. Do not block on these in B3.

## 5. Admin visibility

Reminder Ops should show:
- `activeReminderCountForUser`
- `riskLevel`
- Risk filter
- Summary counts: Warning users, High users, Critical users

Email Ops should only show context:
- user risk badge near recipient when available.
- no new email action in B3.

Controls already exist:
- B1: disable suspicious reminder.
- B2: suppress reminder email for user.

## 6. API behavior

Limit response:
```http
409 Conflict
```

Body:
```json
{
  "code": "ACTIVE_REMINDER_LIMIT_REACHED",
  "message": "Bạn đã đạt giới hạn 30 nhắc nhở đang hoạt động. Hãy hoàn tất, xoá hoặc tắt bớt nhắc nhở trước khi tạo mới.",
  "limit": 30,
  "currentActiveReminders": 30
}
```

Admin Reminder Ops row addition:
```json
{
  "activeReminderCountForUser": 31,
  "riskLevel": "high"
}
```

No new mutating admin API required.

## 7. UX behavior

User app: friendly error, not abuse wording. Copy: `Bạn đã có 30 nhắc nhở đang hoạt động. Hãy hoàn tất hoặc xoá bớt trước khi tạo mới.` CTA: `Manage reminders`.

Admin Reminder Ops: badges Normal slate, Warning amber, High orange, Critical rose; High/Critical filter/sort; drawer explains `31 active reminders`; suggest inspect, disable duplicates, or suppress email if needed.

Mobile: risk badge in card header, active count under user/email, no bulk toolbar.

## 8. Validation strategy

Backend:
- Centralize count logic in reminder create/update path.
- Count only active pending reminders.
- Prefer re-check before save to reduce race risk.
- Race allowing 31 once is acceptable MVP, but avoid obvious double-submit issues.

Manual/test: 29 active create succeeds; 30 active create returns 409; edit existing active at 30 succeeds; done/delete lowers count; inactive/done do not count; reactivating inactive at 30 blocked; Admin risk fields match thresholds; worker unchanged.

## 9. Rollout strategy

1. Add server-side limit/error response.
2. Add FE blocked message + Manage reminders CTA.
3. Add Admin Reminder Ops active count/risk fields if missing.
4. Deploy, monitor 1 day, review High/Critical users, use B1/B2 controls for real abuse.

No DB migration; skip blocked-attempt logs for MVP.

## 10. Risks & mitigations

- Legit heavy user blocked -> limit 30 is generous; cleanup actions remain allowed.
- Existing users disrupted -> grandfather existing reminders, block only new creates.
- Race creates 31 -> re-check before save; acceptable MVP residual risk.
- Confusing UX -> clear Vietnamese copy + Manage reminders CTA.
- Admin overreacts -> only reversible audited controls from B1/B2.
- Worker regression -> B3 does not modify worker email flow.
- Test data appears critical -> admin can filter and clean manually.

## 11. Codex implementation prompt

```text
Implement DeskBoost Phase 2B-B3 Reminder Abuse Protection from plans/reminder-abuse-protection-phase-2b-b3.md.

Scope only:
1. Enforce max 30 active pending reminders per normal user on create.
2. If limit reached, return 409 with code ACTIVE_REMINDER_LIMIT_REACHED, limit, currentActiveReminders, and Vietnamese message.
3. Allow editing existing reminders, delete, mark done, and cleanup actions.
4. If update would reactivate a reminder into active pending, apply same limit.
5. Add/verify Admin Reminder Ops row fields activeReminderCountForUser and riskLevel using thresholds normal <20, warning 20-29, high 30-49, critical 50+.
6. Add FE user-facing blocked message and Manage reminders CTA.
7. Add risk badge/filter in Admin Reminder Ops if missing.

Do not implement admin email sending, retry, export, campaign, delete reminder, force complete, new worker behavior, or bulk actions.

Verify: BE build, FE lint/build, manual 29->30 allowed, 30->31 blocked, edit existing allowed, done/delete lowers count, Admin risk badges correct.
```
