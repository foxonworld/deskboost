# DeskBoost Account Deletion Request Draft

Status: draft for Google Play/Internal Testing readiness. Requires product-owner and legal review before submission.

Contact: TODO: replace with official support email before Play submission.

## Public request path

DeskBoost provides a public account deletion request page at:

`/account-deletion`

This page must remain accessible without logging in so Google Play Console reviewers and users can reach it.

## Current workflow

DeskBoost currently supports manual account deletion requests. This is not an automated instant deletion flow and CP-13 does not implement a backend deletion cascade.

## How to request deletion

Send a deletion request to the official support contact after it is published. The request should include:

- Account email address.
- Confirmation text such as: "I request deletion of my DeskBoost account."
- Optional context if the account was created with Google Login.

Support contact: TODO: replace with official support email before Play submission.

## Expected processing time

Verified deletion requests should be processed within 30 days.

## Data expected to be deleted or anonymized

- Account profile data such as email, name/display name, phone, avatar URL, and Google-linked account identifiers where stored by DeskBoost.
- Plant profiles, plant care history, notes, and reminders tied to the account.
- Uploaded images owned by the user where deletion is technically available through the storage provider.
- AI diagnosis history, diagnosis images/results, AI chat history, and related plant context tied to the account.
- Private feedback tied directly to the account, or public feedback anonymized where removal is not appropriate.

## Data that may be retained for limited periods

- Security, abuse-prevention, admin, and audit logs.
- Legal or compliance records where retention is required.
- Backups until the normal backup retention window expires.
- Provider-side logs/caches controlled by Google, Cloudinary, Plant.id, Gemini, hosting providers, or Google Play.
- Public/verified feedback if retained in anonymized form.

## Operational notes

- The team must verify the requester controls the account email before deleting data.
- The team should keep an internal deletion record without storing passwords, tokens, or unnecessary personal data.
- The support/contact placeholder must be replaced before Play submission.
- Data Safety and Privacy Policy answers must honestly describe this as manual deletion request support.
