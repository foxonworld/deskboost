# Android Release Signing

Status: CP-11 signing workflow. Do not store real signing credentials in Git.

## Prerequisites

- JDK 21 selected in `JAVA_HOME` and `PATH`.
- Android Studio installed with Android SDK Platform 36.
- Debug build runbook completed: [android-build-runbook.md](android-build-runbook.md).
- Play Console access for Play App Signing enrollment.

## Manual Upload Key Generation

Run this manually. Codex must not create the production keystore unless explicitly instructed.

```powershell
keytool -genkeypair -v `
  -keystore deskboost-upload-key.jks `
  -alias deskboost-upload `
  -keyalg RSA `
  -keysize 2048 `
  -validity 10000
```

Use strong unique passwords. Do not paste passwords into chat, docs, commits, logs, or scripts.

## Local File Layout

Recommended local-only path:

```text
FE/android/release/deskboost-upload-key.jks
FE/android/keystore.properties
```

Create local properties from the placeholder:

```powershell
cd D:\FPT\KY7\EXE101\deskboost\FE\android
Copy-Item keystore.properties.example keystore.properties
```

Then edit `keystore.properties` locally:

```properties
storeFile=release/deskboost-upload-key.jks
storePassword=YOUR_UPLOAD_KEYSTORE_PASSWORD
keyAlias=deskboost-upload
keyPassword=YOUR_UPLOAD_KEY_PASSWORD
```

Never commit the keystore, `keystore.properties`, APK, AAB, or APKS files.

## Backup Strategy

- Store an encrypted offline backup of the upload key.
- Store passwords in a password manager.
- Keep at least two trusted backup locations.
- Record key alias, creation date, package name, and Play Console app.
- Restrict access to release owners only.

## Play App Signing

- Enroll the app in Play App Signing before production distribution.
- Treat the local key as the upload key.
- If the upload key is lost, request an upload key reset in Play Console.
- CP-12 handles Google OAuth SHA verification after signing certificates exist.

## Build Release AAB

```powershell
cd D:\FPT\KY7\EXE101\deskboost\FE
npm run build:mobile
npx cap sync android
cd android
.\gradlew.bat bundleRelease
```

Equivalent npm shortcut:

```powershell
cd D:\FPT\KY7\EXE101\deskboost\FE
npm run android:bundle:release
```

Expected output:

```text
FE/android/app/build/outputs/bundle/release/app-release.aab
```

Suggested artifact name for handoff, outside Git:

```text
DeskBoost-v1.0-code1-release.aab
```

## Verification

```powershell
cd D:\FPT\KY7\EXE101\deskboost\FE\android
.\gradlew.bat :app:signingReport
keytool -list -v -keystore <upload-key.jks> -alias deskboost-upload
```

Do not paste certificate private material, passwords, or keystore contents into docs or chat. Certificate SHA fingerprints are public enough for OAuth setup, but CP-12 owns the OAuth verification matrix.

## Expected Failure Without Local Key

Release tasks fail intentionally when `FE/android/keystore.properties` is missing or incomplete:

```text
Release signing requires FE/android/keystore.properties. See docs/release/android-release-signing.md.
```

Debug builds and Capacitor sync should not require a release keystore.

## Out Of Scope For CP-11

- Uploading to Google Play.
- Changing Google OAuth clients or SHA configuration.
- Creating or committing real signing credentials.
- Creating a release AAB without a human-managed local key.
