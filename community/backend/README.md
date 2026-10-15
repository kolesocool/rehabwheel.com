# Rehabwheel Community — future production backend (NOT DEPLOYED)

This folder contains a **development-only** Firestore rules starter, not a
connected or configured Firebase project. It does not enable real accounts,
club activity, multi-user chat, reports, notifications, or social feeds.

The starter intentionally supports **only private owner-controlled** profiles
and activity records; club/event writes, social feeds, messaging, moderation,
and any clinical data are denied. Server-side services will need separately
verified authorization models and moderation before enabling social features.

## Required launch work

1. Connect a Rehabwheel-specific Firebase project with managed configuration
   and credentials (never commit server keys).
2. Enable Authentication, verification, rate limiting, MFA/admin privileges,
   reauthentication for deletion, and Apple/Google login as supported.
3. Build and test the Firestore client for private activities; migrate existing
   local-only data only with explicit user consent.
4. Create private and public profile data projections; never copy health
   histories, diagnoses, wheelchair-user status, or LegMaker telemetry to feed.
5. Implement trusted posting, club roles, follows, blocking, reports and
   human moderation queue with audit trails. Keep them disabled until reviewed.
6. Test all rules in the Firebase emulator with authorized and unauthorized
   clients, malicious payloads, privilege escalation and account deletion.
7. Build GDPR/CCPA-style rights flows appropriate to jurisdiction, data
   retention policies, breach response and privacy disclosures.
8. Deploy after a manual production security review, staging signoff and
   signed iOS/Android end-to-end device tests.

The public website at `rehabwheel.com/community/` remains an interactive
**local-storage preview**, not a live Firebase application.
