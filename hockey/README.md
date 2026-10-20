# LegMaker Hockey Performance Lab — private beta

**Route:** `https://rehabwheel.com/hockey/` (after merging and GitHub Pages deployment)  
**Owner:** Rehabwheel Inc.  
**State:** Interface and authentication client implemented. **Not yet activated**: Firebase project settings, approved email/password accounts, custom claims, hosting perimeter and end-to-end tests.  
**Scope:** A proposed hockey/off-ice performance research workspace for the **investigational** LegMaker technology. No on-ice performance outcomes are established.

## What is implemented

- BBDO-inspired original editorial visual system (not BBDO branding): oversize typography, ice-rink graphics, contrasting lime accent, responsive navigation, keyboard focus, reduced motion support and a mobile layout.
- Sign-in screen uses real Firebase **email + password authentication** when properly configured.
- Checks both `emailVerified` and the **server-issued** Firebase custom claim `hockeyLabAccess === true`. Unauthorized accounts are signed out. No public registration, guest mode or hardcoded site password.
- Auth persistence is **in memory only**; a reload requires signing in again.
- Authenticated workspace tabs: overview, local-only protocol draft, disconnected telemetry, research questions, access & privacy.
- Session planning math only (target cadence × duration); no invented performance results, no device controls, no storage of names or patient records.
- `noindex`; not linked from main navigation or sitemap.

## CRITICAL: GitHub Pages cannot keep page files secret

The static site `/hockey/index.html`, `lab.css`, `lab.js` and images can be fetched without Firebase authentication because GitHub Pages is public. Firebase authorization protects the **app's UI state**, not the raw HTML. **Do not add private research, athlete, procurement, design IP or other confidential assets to this directory.**

For **genuine login-only URL access** before sensitive use, first deploy an authenticated perimeter:

1. Put `rehabwheel.com` behind an identity-aware reverse proxy or move `/hockey/` to authenticated hosting.
2. Set a path-specific deny-by-default policy on `rehabwheel.com/hockey/*` (and all files in that path). Require assigned team identity at the gateway. Verify anonymous `GET /hockey/`, `GET /hockey/lab.js` and nested assets return an access challenge or `403`.
3. Use **Firebase Auth** email/password **inside** the gateway for the actual application session, with verified email + custom lab claim, or implement an equivalent server-side identity system.
4. Enforce the claim (or equivalent server-verified role) on **every backend read, write, export and telemetry endpoint**; never trust front-end checks.
5. Keep client bundle free of passwords, secrets, service account files and PHI. Apply MFA where available and monitor failed sign-ins.

A hidden link, `robots.txt`, `noindex`, shared JavaScript password or browser `localStorage` are **not access controls**.

## Firebase activation steps

1. Create or designate a dedicated, reviewed Firebase project. Enable **Authentication → Email/Password**. Set up authorized domains; include `rehabwheel.com`.
2. Register a Web App. Replace `window.REHABWHEEL_HOCKEY_AUTH = null` in `auth-config.js` with the public Firebase Web config object:
   ```js
   window.REHABWHEEL_HOCKEY_AUTH = {
     apiKey: 'PUBLIC_WEB_API_KEY',
     authDomain: 'YOUR_PROJECT.firebaseapp.com',
     projectId: 'YOUR_PROJECT',
     appId: 'PUBLIC_APP_ID'
   };
   ```
   Firebase Web configuration is not an admin secret, but **never** commit service-account JSON, passwords, access tokens or Admin SDK credentials.
3. Through Firebase Admin SDK **on a trusted server/administrator workstation**, invite only approved research team members and set a custom claim `hockeyLabAccess: true`; verify member email addresses. Example trusted Admin SDK operation (do **not** run in the browser):
   ```js
   await admin.auth().setCustomUserClaims(uid, { hockeyLabAccess: true });
   ```
   When updating existing claims, preserve unrelated claims required by other apps; only a privileged administrator may set this role.
4. Implement/publish backend rules in a **separate project or merge reviewed rules** into the existing project's file, e.g. `firestore.rules.snippet`. The snippet is **not deployed**. Do not overwrite community Firestore security rules.
5. Set budget/abuse alerts, Firebase Auth rate controls, password reset email handling and a documented process to revoke user claims or disable users.
6. Complete perimeter checks above and QA: valid approved account; valid unapproved account; unverified account; invalid password; reset; logout; refresh; inaccessible storage and APIs to unauthorized clients; iPhone/Android browsers and keyboard/screen-reader checks.

## Application boundaries

**No actual lab operations are available yet**: live streaming, protocol saving, research data export, athlete profile management, team invitations and device pairing have not been connected. Content that looks like a dashboard is a development preview. Protocol drafting runs only in the browser's live memory, with no server endpoint or storage.

The hockey concept should not be marketed as a validated performance-enhancement, treatment, or return-to-play product. Hockey-specific studies, safety verification, regulatory review and sport-science validation must occur before those claims.

## Technical files

- `index.html`: accessible authentication entrance and authorized workspace.
- `lab.css`: fully responsive brand/UX system.
- `lab.js`: Firebase email/password, verified-email and custom-claim gating; workspace UI; no telemetry.
- `auth-config.js`: deny-by-default Firebase configuration placeholder.
- `firestore.rules.snippet`: protected future lab collection example; not deployed.
- `scripts/verify.mjs`: dependency-free source consistency checks.
- `.github/workflows/hockey-lab-qa.yml`: CI checks for all changes in this directory.
