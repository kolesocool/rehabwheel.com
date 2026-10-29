# Rehabwheel Android release candidate

This is the **public Rehabwheel/LegMaker information app**, not the experimental Sports Community Preview. The bundled HTML pages work without live server loading; linked external services may require internet. Keep investigational-device wording and do not bundle user/patient records.

## Build locally

Requires Node 22, Java 21, and an Android SDK:

```bash
cd android-release
node prepare.mjs
npm install --no-audit --no-fund @capacitor/core@7 @capacitor/android@7 @capacitor/cli@7
npx cap add android
npx cap sync android
cd android
./gradlew assembleDebug bundleRelease
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk` and an **unsigned** release Android App Bundle in `android/app/build/outputs/bundle/release/`.

## Publication gates

1. Verify the application ID `com.rehabwheel.legmaker` is available/owned in your Google Play Console; do not change after first Play publication.
2. Configure a secure upload key **outside the repository**; produce and sign a release AAB, and enroll in Play App Signing.
3. Add a high-quality adaptive Android launcher icon and release screenshots, feature graphic, contact details, and privacy policy.
4. Complete Play Console app-content declarations: Data safety, ads, target audience, content rating, and any relevant health/medical declarations.
5. Test on physical Android devices, accessibility navigation, offline routing, forms, external links, back navigation and regulatory language.
6. Upload signed AAB to internal testing, resolve Play pre-launch reports, then request production access / submit for review as required.

Google Play approval/public availability is **not automatic**. This repository and workflow do not possess Play Console credentials and cannot submit to the store.
