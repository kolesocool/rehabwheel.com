# LegMaker Performance Labs — private preview

**Sports:** MMA and Basketball. **Host:** Rehabwheel corporate GitHub Pages.
**Status:** UI and Firebase authentication / Firestore authorization integration committed; **not activated** until a Firebase project, invited users, and deployed security rules are provisioned. The labs are *not public, live athlete services*.

## Routes

- MMA: `https://rehabwheel.com/performance-labs/?lab=mma`
- Basketball: `https://rehabwheel.com/performance-labs/?lab=basketball`

These share a single editorial dashboard with sport-specific research tracks, a login form, private session tables, and honest empty states. **Do not add to the public sitemap or site navigation** before internal approval. GitHub Pages serves HTML/CSS/JS to visitors; the URL and source are NOT password-protected. Only Firestore records can be protected by this implementation. For a fully private page (even its markup) put the hub behind an identity-aware proxy / access gateway or migrate it to an authenticated server-hosted application; restrict route access at the edge, not just with JavaScript.

## Security model

- Firebase Authentication **email + password**, with email verification required.
- A verified account must also have a **server-provisioned, active lab invitation** with role `admin`, `coach` or `analyst`.
- Lab-specific membership lives at `performanceLabs/{lab}/members/{uid}`, where `lab` is `mma` or `basketball`. This is never writable by browsers.
- Sessions live at `performanceLabs/{lab}/sessions/{sessionId}` and are read-only through the client. Creation, correction, deletion and member grants require trusted Admin SDK backends.
- Firestore rules are added to `community/backend/firestore.rules`. Those rules exist in Git only; they are **not automatically deployed**.
- The interface shows the latest **up to 50 authorized sessions**, not an all-time aggregate. All stat cards are derived from those loaded records and display dashes if absent.
- The interface never stores athlete data in Web Storage or sends it to marketing analytics.
- No public signup, shared password, test login, client-side admin setting, or demo performance stats.

**Data minimization:** Do not use these collections for protected health information, diagnoses, patient records, clinical assessments, raw biometric streams, or regulated patient data. Institutional privacy, vendor review, and clinical/IRB approvals are separate requirements. The investigational LegMaker device has no proven MMA or Basketball performance benefit implied by this prototype.

## Activating access (administrator checklist)

1. Create or designate a properly secured Firebase project; enable Email/Password authentication, appropriate abuse/rate protection, authorized domains, and preferably MFA for staff. Control account provisioning (do not enable public invitations).
2. Copy `firebase-config.example.js` to `firebase-config.js` and replace placeholders with the **public Firebase web app configuration**. This is client configuration, **never** a service-account key. Confirm the app uses your intended Firebase project before deployment.
3. Review and deploy `community/backend/firestore.rules` to the **same project**. The file also contains the Community starter rules; if your production Firestore rules differ, reconcile them carefully before deployment. Never replace production rules blindly.
4. Create staff accounts from a trusted admin workflow and verify their email addresses. Find each account's Firebase Auth UID and write an invitation through the Firebase Admin SDK/console, e.g. `performanceLabs/mma/members/USER_UID` → `{ "role": "coach", "active": true }`. Do **not** provide write permissions for this to the browser.
5. After security review, use an admin-only backend to create non-clinical session records; recommended fields: `performedAt` (Firestore timestamp), `sessionLabel` (string), `durationMin` (integer), `rpe` (number 0–10, labeled manual), `rounds` (integer). Keep records free from identifying medical data.
6. Confirm an uninvited verified user, an unverified user, and an MMA-only member cannot access Basketball data. Confirm no browser can create or modify an invitation or session.
7. For **entire-site password protection** use an edge access gateway or private hosting before distributing these addresses. HTTP security headers, rate limits and logs must be configured at the actual hosting edge; GitHub Pages does not support application-specific server headers.

## Verification

- Static UX/security: `node performance-labs/verify.mjs`
- Firestore emulator regression suite: from `community/backend`, run the existing GitHub Actions workflow or `npx firebase emulators:exec --config firebase.json --only firestore --project demo-rehabwheel-community "node rules.test.mjs"` with its test dependencies installed.
- Authenticated end-to-end QA still requires a real staging Firebase project and verified invited accounts.
- The two GitHub Actions workflows validate static UI and Firestore rules; neither provisions a live Firebase service.

## Design principles

A premium, high-contrast agency-inspired brand direction without claiming affiliation with BBDO: oversized editorial typography, kinetic arena graphics, sport-colored highlights, clear forms and strong mobile usability. Keyboard support, noindex status, reduced-motion support, and real prototype photography are included. No fabricated athlete results, verified testing, performance claims, or public services.
