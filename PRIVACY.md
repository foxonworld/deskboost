# DeskBoost Privacy Policy Draft

Status: draft. This policy must be reviewed by the product owner and legal reviewer before Google Play submission.

Contact: TODO: replace with official support email before Play submission.

## Overview

DeskBoost helps users manage plants, upload plant images, receive plant-care reminders, and use AI-assisted plant diagnosis/chat features. This document describes the data DeskBoost currently expects to collect and process for the MVP release.

## Data we collect

- Account data: email address, full name/display name, Google Login profile data when used, internal session/refresh-token records, and optional phone number.
- Profile data: avatar URL or uploaded profile image.
- Plant data: plant profiles, care history, notes, reminders, and user-provided plant context.
- Images: plant images, avatar images, marketplace images, and images uploaded for AI diagnosis.
- AI content: diagnosis questions, AI diagnosis results, AI chat messages, and related plant context used to generate responses.
- Feedback: user feedback/reviews if submitted.
- Operational metadata: request logs, device/network metadata, admin action metadata, and Google Play crash/ANR/pre-launch diagnostics where provider tooling applies.
- Website analytics: the DeskBoost website may use Google Analytics 4 (GA4) to measure visits, page views, marketplace interactions, product views, Zalo/Facebook contact clicks, and browser/device technical information processed by GA4.

## Why we collect data

- Create and manage user accounts.
- Keep users signed in and protect accounts.
- Display profile, plant, reminder, and marketplace features.
- Store and deliver uploaded images.
- Provide AI diagnosis and plant-care chat features.
- Improve reliability, investigate abuse, and maintain app security.
- Process manual account deletion requests.
- Measure website effectiveness, analyse the marketplace conversion funnel, improve the product, and identify where visitors leave the website flow.

## Third-party processors

DeskBoost may send or store data with these providers when relevant features are used:

- Google OAuth for Google Login.
- Google/Gemini for AI chat and plant-care AI processing.
- Plant.id for plant image diagnosis processing.
- Cloudinary for image storage and delivery.
- Hosting/logging providers for API hosting, request logs, and operational reliability.
- Google Play Console for app distribution, pre-launch reports, crash/ANR diagnostics, and related platform metadata.
- Google Analytics 4 for website analytics. DeskBoost does not intentionally send email addresses, names, phone numbers, chat content, tokens, form content, or other direct user-entered content to GA4.

## AI and image disclosure

Images, plant context, diagnosis questions, and chat messages may be processed by Plant.id, Google/Gemini, Cloudinary, and hosting/logging providers. AI responses are informational plant-care assistance only and may be incomplete or incorrect. Do not rely on DeskBoost for medical, safety-critical, or emergency advice.

## Google Login disclosure

If you choose Google Login, DeskBoost receives account identity information such as your email address, name/display name, and Google account identifier needed to authenticate and link your DeskBoost account. Google processes Google account data under Google's own terms and privacy policies.

## Cloudinary image storage disclosure

Uploaded images may be stored and delivered through Cloudinary. Image URLs may remain available until the image or related account/listing is removed, subject to backups, caches, and provider retention.

## Retention

Account and feature data is retained while the account is active or while needed to provide the requested features. After a verified manual deletion request, DeskBoost will delete or anonymize eligible account data. Some records may remain for limited periods in backups, provider systems, security logs, legal records, or fraud-prevention logs.

## Account deletion

DeskBoost currently supports a manual account deletion request workflow. The public request path is:

`/account-deletion`

Users should provide the account email address and confirm that they want deletion. DeskBoost should process verified requests within 30 days after verification. This is not an automated instant deletion flow.

## Children

DeskBoost is intended for general plant-care use and is not directed to children under 13. If a parent or guardian believes a child provided personal data, they should contact DeskBoost using the official support contact once published.

## User rights and contact

Users may request access, correction, deletion, or review of their account data through the official support contact.

Contact: TODO: replace with official support email before Play submission.

## Review status

This document is a product and engineering draft. It is not a final legal opinion and must be checked against the deployed app, provider configuration, Play Console answers, and applicable law before publication.
