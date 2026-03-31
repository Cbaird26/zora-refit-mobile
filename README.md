# Zora Refit Mobile

Dedicated iPhone and Android workspace for the `Zora Refit` mobile shell.
This repo is the mobile runtime only. It should not be treated as the artifact or the canonical public web surface.

Live phone-browser preview:

- https://cbaird26.github.io/zora-refit-mobile/

Related public repos:

- Part I public foundation: [`fold-space-engine`](https://github.com/Cbaird26/fold-space-engine)
- Part II artifact/reference: [`fold-space-engine-phase-v`](https://github.com/Cbaird26/fold-space-engine-phase-v)
- Refit web app: [`zora-refit`](https://github.com/Cbaird26/zora-refit)
- Refit analyzer companion: [`refit`](https://github.com/Cbaird26/refit)

This repo is the mobile surface split out from the web compilation repo. It does not modify either source repo:

- Part I source: `~/fold-space-engine`
- Part II source: `~/fold-space-engine-phase-v`
- Refit web repo: `~/zora-refit`

## Top-level tabs

- `Probability Sculptor`
- `Fold-Space Engine`
- `Timeline Selector`
- `Decision`
- `Intent`
- `Navigation`
- `Autopilot`
- `Research`

Default opening tab: `Probability Sculptor`

## Composition model

- The first three tabs preserve the original Part I shell behavior.
- The last five tabs run inside the imported `ZoraASI Bridge` wrapper.
- `ZoraASI Bridge` is shared shell behavior, not a separate tab.
- The imported discovery state uses its own localStorage namespace: `zora-refit-product-state`.
- App shell settings use a separate namespace: `zora-refit-shell-state`.

## Mobile app surface

- Native app name: `Zora Refit`
- Bundle/application id: `io.cbaird26.zorarefit`
- Mobile v1 is portrait-first, safe-mode by default, on-device only, and preserves all eight surfaces
- Mobile shell behavior adds native haptics, onboarding/safety settings, on-device persistence, and native share flows

## Freeze boundary

This repo is the only place where mobile-specific runtime work should happen.

Do not use it as:

- the Part II artifact/reference
- the canonical public web compilation surface
- the desktop runtime

## Local development

```bash
npm install
npm run dev
```

## Test and build

```bash
npm test
npm run build
```

## Mobile development

```bash
npm run mobile:sync
npm run mobile:ios
npm run mobile:android
```

Release-oriented commands:

```bash
npm run mobile:ios:release
npm run mobile:android:apk
npm run mobile:android:bundle
```

Notes:

- `mobile:sync` rebuilds the web app and copies it into the Capacitor shells
- the iOS shell can be opened and built from Xcode in `ios/App/App.xcodeproj`
- the Android shell can be opened from `android/`, but Gradle requires a local Java runtime
- the mobile preview can be published via GitHub Pages for phone browser testing, but App Store / Play Store submission uses the native `ios/` and `android/` shells

## Store readiness

Current store-facing baseline:

- App name: `Zora Refit`
- Bundle/application id: `io.cbaird26.zorarefit`
- Version: `1.0.0`
- Portrait-first
- On-device only

Submission docs:

- [Store release checklist](./docs/store-release-checklist.md)
- [Privacy summary](./docs/privacy-summary.md)

## Docs

Imported Phase V reference docs are kept in [`docs/`](./docs/).
