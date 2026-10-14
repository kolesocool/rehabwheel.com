# RW Dating — mobile preview

Standalone wheelchair-first dating/community prototype under the Rehabwheel brand. It does **not** share patient records, accounts or data with Rehabwheel Portal.

## Preview
Open `index.html` locally in a browser. Posts and likes are temporary demo-only state; no real profiles, messages, moderation, or backend are connected.

## Mobile wrapper preparation
Requires Node.js, Android Studio for Android and macOS/Xcode for iOS.

```sh
npm install
npx cap add android
npx cap add ios
npm run mobile:sync
npm run mobile:android # Android Studio: build/install debug APK
npm run mobile:ios     # Xcode: sign/build on macOS
```

These commands are **instructions, not evidence that native builds have succeeded**. Native project generation, signing, physical-device tests and release artifacts remain pending.

## Production gates
- Replace demo data with isolated Firebase project and secure authorization rules
- 18+ age gate, reporting/blocking, human moderation and abuse handling
- Consent-based matching and private messaging
- Privacy policy, terms, deletion/export, accessibility and app-store disclosures
- Signed Android/iOS builds and real-device QA
- Keep Dancenlove and 10Strikers entirely separate
