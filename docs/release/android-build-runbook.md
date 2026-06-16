# Android Debug Build Runbook

Status: CP-10 documented debug build path. Release signing and AAB are out of scope for this runbook.

## Required Tools

- Node.js: `v22.18.0` verified locally.
- npm: `10.9.3` verified locally.
- Capacitor CLI: `8.4.0` verified locally via `npx cap --version`.
- Android Studio installed with Android SDK Platform 36.
- Android SDK Build Tools compatible with `compileSdkVersion = 36`.
- JDK 21.
- `JAVA_HOME` must point to a JDK 21 install, not a JRE.
- `PATH` should include `%JAVA_HOME%\bin` before older Java installs.

JDK 21 is required for the current generated Android project because `FE/android/app/capacitor.build.gradle` sets both source and target compatibility to `JavaVersion.VERSION_21`. Do not downgrade generated Capacitor Gradle compatibility to make Java 8 work. If the team intentionally chooses another JDK later, regenerate or configure the Android project deliberately and revalidate.

## Current Android Project Facts

- Capacitor app ID: `vn.deskboost.app`.
- Android namespace: `vn.deskboost.app`.
- Android application ID: `vn.deskboost.app`.
- `minSdkVersion`: 24.
- `compileSdkVersion`: 36.
- `targetSdkVersion`: 36.
- `versionCode`: 1.
- `versionName`: `1.0`.
- Permission: `android.permission.INTERNET`.
- `android:allowBackup="false"` is applied for external tester safety.
- No release signing or keystore configuration is added by CP-10.
- `google-services.json` is optional for the current debug path and is not tracked.

## Clean Clone Debug Build

From PowerShell:

```powershell
cd D:\FPT\KY7\EXE101\deskboost\FE
npm install
npm run build:mobile
npx cap sync android
cd android
.\gradlew.bat clean
.\gradlew.bat assembleDebug
```

Expected APK path:

```text
FE/android/app/build/outputs/apk/debug/app-debug.apk
```

## Existing npm Shortcuts

```powershell
cd D:\FPT\KY7\EXE101\deskboost\FE
npm run build:mobile
npm run cap:sync
npm run android:clean
npm run android:build:debug
```

These scripts do not set `JAVA_HOME`; the caller must provide a compatible JDK 21 environment.

## Verify Java and Gradle

```powershell
java -version
javac -version
$env:JAVA_HOME
cd D:\FPT\KY7\EXE101\deskboost\FE\android
.\gradlew.bat --stop
.\gradlew.bat --version
```

Expected: Gradle daemon and launcher use JDK 21.

## Common Windows Errors

- Java 8 or unsupported class version: install/select JDK 21, update `JAVA_HOME`, update `PATH`, then stop Gradle daemons.
- `JAVA_HOME` points to a JRE or old JDK: point it to the JDK 21 directory.
- Gradle daemon keeps using old Java: run `cd FE\android; .\gradlew.bat --stop`, then re-check `java -version`, `javac -version`, and `.\gradlew.bat --version`.
- Android SDK Platform 36 missing: install it from Android Studio SDK Manager.
- Build Tools missing/incompatible: install current Android SDK Build Tools from SDK Manager.
- Long path or antivirus lock: move workspace to a shorter path or exclude Gradle/Android build directories from aggressive scanning.

## Out Of Scope For CP-10

- Release keystore creation.
- Release signing config.
- AAB generation.
- Google OAuth client or SHA changes.
- Changing package/application ID.
- Changing generated Capacitor Java compatibility.
