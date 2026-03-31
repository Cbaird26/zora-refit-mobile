# Zora Refit Store Release Checklist

## App identity

- App name: `Zora Refit`
- Bundle ID / application ID: `io.cbaird26.zorarefit`
- iOS marketing version: `1.0.0`
- Android version name: `1.0.0`
- Android version code: `1`

## Current app posture

- Portrait-only
- On-device only
- No login
- No cloud sync
- No push notifications
- Native share enabled for exported JSON logs
- Native haptics enabled

## Pre-submission assets still needed outside the repo

- App Store screenshots
- Play Store screenshots
- App icon marketing artwork
- Privacy policy URL
- App description / subtitle / keywords
- Support URL

## iOS build flow

```bash
npm install
npm run mobile:sync
npm run mobile:ios
```

For a release build shell:

```bash
npm run mobile:ios:release
```

Final App Store submission still needs:

- Apple Developer signing team configured in Xcode
- Archive built from Xcode Organizer
- App Store Connect metadata filled in

## Android build flow

```bash
npm install
npm run mobile:sync
npm run mobile:android
```

For release artifacts:

```bash
npm run mobile:android:apk
npm run mobile:android:bundle
```

Final Play Store submission still needs:

- Local Java/JDK installed
- Release keystore configured
- Play Console listing metadata filled in

## Review notes

- iOS export compliance flag is set for non-exempt encryption flow
- Android backup is disabled to match the on-device-only posture
- Any store-facing claims should stay grounded as a software simulation / interface
