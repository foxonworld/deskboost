# DeskBoost Privacy Data Inventory

Status: draft for Google Play/Internal Testing readiness. Requires product-owner and legal review before public submission.

Contact placeholder: TODO: replace with official support email before Play submission.

## Data inventory

| Data type | Collected | Shared | Purpose | Required/optional | Encrypted in transit | Deletion support | Retention | Third party processor |
|---|---|---|---|---|---|---|---|---|
| Email address | Yes | Yes, if Google Login is used or provider logs process requests | Account creation, login, support, deletion request matching | Required for account | HTTPS required | Manual deletion request | Account lifetime, then deletion workflow/backups/log retention | Google OAuth, hosting/logging provider |
| Full name/display name | Yes | Yes, if Google Login profile is used | Profile display and account management | Required or derived from OAuth | HTTPS required | Manual deletion request | Account lifetime, then deletion workflow/backups/log retention | Google OAuth, hosting/logging provider |
| Phone number | Optional | No direct sharing identified | User profile/contact convenience | Optional | HTTPS required | Manual deletion request | Account lifetime, then deletion workflow/backups/log retention | Hosting/logging provider |
| Avatar URL/profile image | Optional | Yes, depending on source/upload | Profile display | Optional | HTTPS required | Manual deletion request | Account lifetime, then deletion workflow/backups/log retention | Google OAuth, Cloudinary, hosting/logging provider |
| Google ID/OAuth profile data | Yes, when Google Login is used | Yes | Authentication and account linking | Optional login method | HTTPS required | Manual deletion request for DeskBoost account data; Google account data handled by Google | Account lifetime, then deletion workflow/backups/log retention | Google OAuth |
| Internal auth/session tokens | Yes on client and server refresh-token store | No intentional third-party sharing | Login session, refresh, logout | Required while logged in | HTTPS required for transport | Logout revokes matching refresh token; account deletion request covers server account data | Session lifetime and configured token expiry | Hosting/logging provider may process request metadata |
| Plant profiles/history | Yes | Possibly, when used as AI context | Plant care tracking and personalized advice | Optional feature data | HTTPS required | Manual deletion request | Account lifetime, then deletion workflow/backups/log retention | Gemini if included in AI prompt, hosting/logging provider |
| Plant images | Yes, when user uploads images | Yes | Image storage, plant profile display, AI diagnosis | Optional feature data | HTTPS required | Manual deletion request | Account lifetime or until removed/deletion workflow/backups/log retention | Cloudinary, Plant.id, Gemini, hosting/logging provider |
| Marketplace images/items | Yes, for admin/marketplace content | Yes, public item images may be visible | Marketplace listing display | Optional/admin feature data | HTTPS required | Admin removal or manual deletion request, depending ownership | Until listing removal/deletion workflow/backups/log retention | Cloudinary, hosting/logging provider |
| AI diagnosis images/results | Yes, when diagnosis is used | Yes | Plant diagnosis and care recommendations | Optional feature data | HTTPS required | Manual deletion request | Account lifetime or AI history retention until deletion workflow/backups/log retention | Plant.id, Gemini, Cloudinary, hosting/logging provider |
| AI chat content | Yes, when chat is used | Yes | Plant-care assistant responses, chat history, abuse/rate-limit controls | Optional feature data | HTTPS required | Manual deletion request | Account lifetime or AI history retention until deletion workflow/backups/log retention | Gemini, hosting/logging provider |
| Reminder data | Yes, when reminders are configured | Possible if exported/integrated by user | Care scheduling and notifications | Optional feature data | HTTPS required | Manual deletion request | Account lifetime or until reminder removal/deletion workflow/backups/log retention | Hosting/logging provider; Google Calendar only if a user-initiated export/integration is later enabled |
| Feedback/reviews | Yes, when submitted | Possibly public if displayed as verified feedback | Product feedback and trust/social proof | Optional | HTTPS required | Manual deletion/anonymization request | Until removed, anonymized, or deletion workflow | Hosting/logging provider |
| Admin action logs | Limited/partial | No intentional public sharing | Security, audit, admin abuse prevention | Internal operational data | HTTPS/log transport required | May be retained for security/legal reasons after account deletion | Operational/security retention window TBD | Hosting/logging provider |
| Device/network metadata | Yes via app/API/hosting/provider logs | Yes, processed by providers | Security, fraud prevention, diagnostics, reliability | Automatic | HTTPS/provider controls | Provider policy/manual request where applicable | Provider retention | Hosting/logging provider, Google Play Console |
| Crash/ANR/pre-launch diagnostics | Not directly implemented in app code; may be collected by Google Play tooling | Yes, by Google Play | App quality diagnostics, pre-launch testing, crash/ANR review | Automatic when Play tooling applies | Provider controls | Google/Play policy | Google/Play retention | Google Play Console |

## Third-party processors to disclose

- Google OAuth: login and account identity when the user chooses Google Login.
- Google/Gemini: AI chat and some plant-care AI processing.
- Plant.id: plant image diagnosis processing.
- Cloudinary: uploaded image storage/delivery.
- Hosting/logging provider: API hosting, request logs, operational metadata.
- Google Play Console: pre-launch, crash/ANR, install/device diagnostics where Play tooling applies.

## Current deletion model

- CP-13 implements a public manual deletion request path, not automated deletion.
- Public route: `/account-deletion`.
- Documentation: `docs/ACCOUNT_DELETION.md`.
- Expected processing target for the draft: within 30 days after verification.
- Some security/legal logs, backups, and provider logs may persist for limited retention after deletion.

## Google Play notes

- Do not mark image/AI content as "not shared" because Plant.id, Gemini, Cloudinary, and hosting providers may process it.
- Account data is required for account functionality; plant images, AI chat, reminders, phone, and avatar are optional feature/profile data.
- HTTPS is required for transport. Do not claim additional at-rest encryption unless verified per system/provider.
- Legal completeness is not confirmed. Play Console Data Safety answers must be verified against the final deployed build and provider configuration.
