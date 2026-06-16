# DeskBoost Google Play Data Safety Draft

Draft - verify in Play Console and legal review before submission.

Contact placeholder: TODO: replace with official support email before Play submission.

## Scope

This draft summarizes expected Google Play Data Safety answers for DeskBoost based on repository inspection and `docs/release/privacy-data-inventory.md`. It is not a final legal answer.

## Personal info

Data expected to be collected:

- Name/display name.
- Email address.
- Phone number if the user adds it to profile.
- User IDs/account identifiers, including Google-linked identifiers when Google Login is used.

Purpose:

- App functionality.
- Account management.
- Security and fraud prevention.
- Support and account deletion request handling.

Required vs optional:

- Email/name/account identifiers are required for account functionality.
- Phone number is optional profile data.

## Photos and videos

Data expected to be collected:

- Plant images uploaded by users.
- Avatar/profile images if uploaded.
- Marketplace/listing images where applicable.
- Diagnosis images uploaded to AI diagnosis.

Purpose:

- App functionality.
- Image storage and display.
- AI diagnosis/chat context.

Sharing:

- Images may be processed by Cloudinary, Plant.id, Gemini/Google, and hosting/logging providers.

## App activity and user-generated content

Data expected to be collected:

- AI chat messages and AI assistant responses.
- AI diagnosis questions/results.
- Plant profiles/history, care notes, and reminder data.
- Feedback/reviews if submitted.

Purpose:

- App functionality.
- Personalized plant-care support.
- AI diagnosis/chat.
- User support and service quality.

Sharing:

- AI content and plant context may be processed by Gemini/Google, Plant.id for diagnosis flows, and hosting/logging providers.

## Diagnostics

Data expected or possible through providers:

- Crash/ANR metadata.
- Device/network/request metadata.
- Hosting logs.
- Google Play pre-launch report metadata.

Purpose:

- App diagnostics.
- Reliability.
- Security and fraud prevention.

## Data shared with third parties

- Google OAuth: account login and identity.
- Google/Gemini: AI chat and plant-care AI processing.
- Plant.id: plant image diagnosis.
- Cloudinary: uploaded image storage and delivery.
- Hosting/logging provider: API hosting, request logs, operational metadata.
- Google Play Console: distribution, crash/ANR/pre-launch diagnostics where applicable.

## Purposes to consider in Play Console

- App functionality.
- Account management.
- AI diagnosis/chat.
- Image storage and delivery.
- Security, fraud prevention, and abuse prevention.
- Analytics/diagnostics only where provider tooling or final deployed config confirms collection.

## Security and deletion

- Encryption in transit: HTTPS is required for production traffic.
- Deletion: DeskBoost provides a public manual deletion request path at `/account-deletion`.
- Current status: deletion is manual request support, not instant automated deletion.
- Required vs optional: account data is required; images, AI content, reminders, avatar, phone, feedback, and plant history are optional feature/profile data.

## Submission checklist

- Replace support/contact placeholder before Play submission.
- Verify final production API/domain and HTTPS configuration.
- Verify actual provider list and retention before final Play Console entry.
- Verify crash/ANR/analytics collection from Play Console and app dependencies.
- Confirm account deletion operational owner and SLA.
- Complete legal/product owner review.
