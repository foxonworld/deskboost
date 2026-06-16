# Google OAuth Android Verification

Status: CP-12 verification checklist. Do not invent SHA fingerprints or commit OAuth secrets.

## Current Flow Summary

- Web login uses `@react-oauth/google` and `VITE_GOOGLE_CLIENT_ID` through `GoogleOAuthProvider`.
- Web `GoogleLogin` returns `credential`, which is sent to `loginWithGoogle` and then `POST /api/auth/google` as `idToken`.
- Native Android login uses `@capgo/capacitor-social-login` from `FE/utils/nativeGoogleAuth.js`.
- Native Android initializes SocialLogin with `google.webClientId` from `VITE_GOOGLE_CLIENT_ID`, requests Google login, extracts `response.result.idToken`, and sends that ID token to the same backend Google endpoint.
- Backend verifies ID tokens in `GoogleAuthService` with configured audiences: `Google:ClientId`, optional `Google:AndroidClientId`, and optional `Google:LegacyClientId`.
- Google login response follows the CP-06 auth lifecycle: `accessToken`, `refreshToken`, and `user`.

## Package Identity

- Capacitor `appId`: `vn.deskboost.app`.
- Android namespace: `vn.deskboost.app`.
- Android `applicationId`: `vn.deskboost.app`.

These must match every Android OAuth client package name in Google Cloud Console.

## google-services.json Decision

`google-services.json` is not required for the current ID-token-to-backend Google login flow. The current app uses `capacitor.config.ts`, `VITE_GOOGLE_CLIENT_ID`, and `@capgo/capacitor-social-login`, then sends the ID token to the backend.

Only add `google-services.json` if a future Firebase, Push Notifications, or plugin-specific flow explicitly requires it. If used, it must stay ignored and must not be committed.

## Debug SHA Collection

Run on the machine that builds the debug APK:

```powershell
keytool -list -v `
  -alias androiddebugkey `
  -keystore "$env:USERPROFILE\.android\debug.keystore" `
  -storepass android `
  -keypass android
```

Collect:

- SHA-1
- SHA-256

CP-12 local check: debug keystore exists and the command returned SHA-1/SHA-256. Values are not recorded in repo docs.

## Upload/Release Key SHA Collection

After the human creates the upload key from the CP-11 release signing runbook:

```powershell
keytool -list -v `
  -keystore FE\android\release\deskboost-upload-key.jks `
  -alias deskboost-upload
```

Collect:

- SHA-1
- SHA-256

CP-12 local check: upload key is not present yet, so upload/release SHA collection is blocked.

## Play App Signing SHA Collection

After the first AAB upload and Play App Signing enrollment:

```text
Play Console -> Setup -> App integrity -> App signing key certificate
```

Collect:

- SHA-1
- SHA-256

CP-12 status: blocked until a signed AAB is uploaded and Play App Signing is enabled.

## Google Cloud Console Checklist

Create or verify Android OAuth clients for package `vn.deskboost.app`:

- Debug Android OAuth client: package `vn.deskboost.app` + debug SHA-1/SHA-256.
- Upload/release Android OAuth client: package `vn.deskboost.app` + upload key SHA-1/SHA-256.
- Play-distributed Android OAuth client: package `vn.deskboost.app` + Play App Signing SHA-1/SHA-256, if Play uses a different signing certificate.

Create or verify Web OAuth client:

- Used by `VITE_GOOGLE_CLIENT_ID` for web Google Identity Services.
- Used by backend `Google__ClientId` as the primary expected audience.
- No client secret is required for backend ID token verification.

Backend environment checklist:

```text
Google__ClientId=<web-client-id>
Google__AndroidClientId=<android-client-id-if-id-token-aud-is-android-client>
Google__LegacyClientId=<optional-old-client-id>
```

If native SocialLogin returns an ID token whose `aud` is the web client ID, `Google__ClientId` covers it. If it returns an Android-client audience, configure `Google__AndroidClientId` accordingly.

Frontend environment checklist:

```text
VITE_GOOGLE_CLIENT_ID=<web-client-id>
VITE_MOBILE_APP=true for Capacitor/mobile builds
```

## Test Matrix

| Build | Signing cert | OAuth client needed | Expected |
| --- | --- | --- | --- |
| Web local/prod | N/A | Web client | Login success |
| Debug APK | Debug keystore | Android client for package + debug SHA, plus backend audience for returned ID token | Login success |
| Local release AAB/APK | Upload key | Android client for package + upload key SHA, plus backend audience for returned ID token | Login success |
| Play Internal | Play app signing key | Android client for package + Play signing SHA, plus backend audience for returned ID token | Login success |

## Manual Smoke Cases

1. Web login returns backend auth response with `accessToken`, `refreshToken`, and `user`.
2. Debug APK Google login returns ID token and backend accepts it.
3. Local signed release build Google login returns ID token and backend accepts it.
4. Play Internal build Google login works after Play signing SHA is configured.
5. Logout and refresh lifecycle still works after Google login.

## Troubleshooting

- `DEVELOPER_ERROR`: Android OAuth client package/SHA/client mismatch.
- Backend `401` or invalid Google token: ID token audience is not configured in `Google__ClientId`, `Google__AndroidClientId`, or `Google__LegacyClientId`.
- Cancelled login: user cancelled, no Google account, or device account issue.
- No ID token returned: wrong SocialLogin configuration or client ID mismatch.
- Web works but APK fails: Android OAuth SHA/package mismatch or native login configuration issue.
- Local release works but Play Internal fails: Play App Signing SHA is not configured in Google Cloud Console.
- `google-services.json` missing: expected for this repo unless a future Firebase/Push/plugin flow requires it.

## CP-12 Blockers

- JDK 21 still needed to build debug/release artifacts locally.
- Upload key SHA blocked until human creates upload key.
- Play App Signing SHA blocked until signed AAB upload and Play setup.
- Google Cloud Console changes must be performed manually by a project owner.
