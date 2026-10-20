# Rehabwheel Military Programs Hub — Restricted-Access Handoff

**Status:** Private portal UI and authorization policy are coded. **Authentication is intentionally disabled until a dedicated Firebase project, verified accounts, rules, audit logging, and production configuration are provisioned.** Do not describe this as a launched military portal before these steps are complete.

## What is public vs private

- `/military/` is a **publicly retrievable static sign-in shell** because Rehabwheel.com is hosted on GitHub Pages. Its code and CSS can be viewed by anyone; therefore there are **no secrets, internal proposal details, personnel lists, grant budgets or restricted files** in that page or the repository.
- Real program records, work items and document bytes belong exclusively in a **separate authenticated Firebase project** under `militaryHub/<module>/entries` and Firebase Storage `military/<uploader>/<random-id>`.
- The UI checks that a user has signed in, verified their email, and received an administrator-controlled `rehabwheelMilitary: true` custom claim plus a `militaryRole` of `viewer`, `editor` or `admin`. **Firebase Firestore/Storage Rules must also enforce those claims.** Frontend hiding by itself is not security.
- Dashboard roles: `viewer` can read authorized records, `editor` can create/update work items and upload approved file types, `admin` may also delete underlying records/files via separate admin operations. No role management is permitted through the public client.
- No links were added to public homepage navigation, and the route is `noindex` and absent from the sitemap. Search engine exclusion is **not** access control.
- The login page clearly states that this is a Rehabwheel corporate workspace, **not an official U.S. Army or DoD platform**.

## Provisioning required — do not skip

1. Create a **dedicated** Firebase/GCP project for the Military Hub; **do not merge these rules into the Rehabwheel Community or clinical projects**.
2. Enable Firebase Authentication email/password, email verification, authorized domain `rehabwheel.com`, and recommended MFA. Configure password-reset flow, login abuse protections, staff offboarding, and active audit/revocation procedures.
3. Enable Firestore and Cloud Storage with correct billing, least-privilege IAM, regional/data processing settings, logging and backups. Follow the organization's data classification, retention and legal review before enabling uploads.
4. Deploy `military/backend/firestore.rules` and `military/backend/storage.rules` **to the dedicated project**. Run the emulator tests first; never use rules allowing all reads/writes. Provision the Firebase project via an authorized administrator; no connection or credentials are assumed to exist.
5. Create a staff account in Firebase Authentication using the provider's password setup/reset process, **not a password committed to GitHub**. Verify the email, then, from a secure admin workstation only, run `GOOGLE_CLOUD_PROJECT=<military-project> GOOGLE_APPLICATION_CREDENTIALS=<protected-file> npm --prefix military/backend run provision -- user@example.com viewer` (or `editor` / `admin`). Do not expose Admin SDK credentials to a browser.
6. Populate `military/firebase-config.js` with the **public Firebase web SDK configuration** once the correct security rules are deployed, staff accounts are tested, and domain/bucket CORS for direct authenticated `getBlob()` reads is configured. `apiKey` in Firebase web config is a public identifier, **not** a password, API authorization rule or server secret.
7. Verify wrong-password handling, unverified and non-member denial, read-only viewers, privilege escalation attempts, upload type/size rules, sign-out and inactivity timeout, denied cross-app access and direct REST read denial. Confirm authorized read/write/delete logs and private file download behavior in staging.
8. Have a production security reviewer verify Firestore/Storage policy, the staff access list, data classification and backup/recovery. Only then enable production auth.

## Operating policy

- **DO NOT upload or store classified information, controlled unclassified information (CUI), export-controlled technical data, ITAR-controlled information, protected health information, or partner-restricted government documents.** Additional controls and explicit approvals are required for such information.
- Do not imply confirmed U.S. Army, DOD, Air Force or other government participation or approval.
- Firebase Auth credentials use in-memory persistence in this implementation: a new page session requires another sign-in. The UI logs out after 15 minutes of inactivity; administrators must revoke compromised users server-side.
- Firebase Storage direct `getBlob()` is used rather than token-bearing downloadable URLs. Configure bucket CORS carefully and test downloads. Browser-generated download objects are transient.
- Never include real grant budgets, nonpublic Army contracts, research collaboration details or restricted files in GitHub Pages HTML, JavaScript, CSS, README, PR descriptions or CI fixtures.

## Full-page privacy limitation

If the **login page itself** (not merely its data) must be inaccessible before authentication, serve the entire Military Hub from an identity-aware reverse proxy (such as a managed access gateway) or private authenticated server instead of GitHub Pages. A client-side password check, `noindex`, robots rules, obfuscated JavaScript or a hidden URL **does not** make static content private.

## Source

- UI: `military/index.html`, `military/hub.css`, `military/hub.js`.
- Public Firebase configuration placeholder: `military/firebase-config.js` (ships as `null`).
- Security rules: `military/backend/firestore.rules`, `military/backend/storage.rules`.
- Admin-only provisioning script: `military/backend/provision-user.mjs`.
- Run source/locked-mode QA: `node military/scripts/verify.mjs`; browser smoke QA: `node military/scripts/smoke.mjs`.
- Run dedicated Firebase rules emulator test: `cd military/backend && npm ci && npm run test:rules` once lockfile/dependencies are installed.
