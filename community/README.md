# Rehabwheel Community — mobile-first product preview

## Status
- **Implemented**: A responsive, accessible, interactive front-end with Home, Explore, Clubs, Progress and You.
- **Demo state**: Manual activity logging, goal setting, reactions, club selection, example events, sample follows, and hiding cards use browser-local data only.
- **Unimplemented**: Firebase accounts, server-backed feeds, messaging, push, clinical telemetry, real community friendships, moderation delivery, payment integrations, native binaries, store submission.
- **Not a clinical system**: No LegMaker sessions, sensitive health records or location data are connected. Do not paste patient information into this preview.
- **Routes**: `/community/` (primary preview); `/rehabwheel-community-preview.html` (earlier standalone preview).
- **Photos**: References only existing product photographs under `/assets/photos/`.
- **Brand**: Uses `/rehabwheel_logo.jpg`.

## Product structure (Strava-inspired, not a clone)
1. **Home** — activity feed, reactions, manual private activity.
2. **Explore** — discover community and people; no real member profiles in prototype.
3. **Clubs** — member communities, accessibility-oriented events.
4. **Progress** — personal goals, session minutes; no speed-based rankings or clinical claims.
5. **You** — profile, privacy, personal data controls.

**Separate data boundaries**:
- Community social profiles, posts and events belong to a social service.
- Social features focus on adaptive sports, interest-based clubs, activities and supportive friendship. This release has no dating or romantic matching.
- LegMaker clinician/patient telemetry stays in a regulated-care application boundary. Never autopost metrics.
- Location is opt-in and off by default. Avoid real-time whereabouts in the feed.
- Block/report functionality needs server-side enforcement, human moderation and abuse escalation.

## Production architecture — required before a real multi-user launch

| Layer | Acceptance gate |
| --- | --- |
| Identity | Firebase Auth with email verification, reauthentication and account deletion |
| Social profiles | Server-side field validation; rate limits; private account state |
| Activity logs | Visibility defaults to Only me; owner-controlled updates and deletion |
| Access control | Firestore rules tested for private, follower and club-only reads |
| Connections | Follow requests, block lists, safety filters, no unsolicited direct messages |
| Messaging | Real-time messages with report/block/mute and recipient controls |
| Clubs & events | Membership approval, owner/admin roles, safe event attendance and privacy |
| Moderation | Human triage queue, evidence handling, escalation, sanctions, appeals |
| Privacy | Data export, in-app and web account deletion, retention schedules |
| Performance | Measured p95 API latency and cold-start time on real devices |
| Analytics | Consent-respecting funnels; operational monitoring; crash reporting |
| Accessibility | Screen reader labels, large targets, dynamic type, contrast and reduced motion |
| Native | iOS/Android builds, signing, deep links, push permissions, actual device QA |
| Monetization | Subscription products and restore validated only where applicable |
| Distribution | TestFlight and Google Play tracks, age rating, data safety, privacy policy |

## Launch-readiness workstream

- **D1**: Locate/import all 3 application repositories and secure developer credentials. Confirm Firebase/RevenueCat environments without pasting secrets into source code.
- **D2**: Implement real auth, user/deletion and private data models.
- **D3**: Connect the community feed, clubs, friend permissions and moderation endpoints.
- **D4**: Complete app-specific core flows: Dancenlove's separate product flows, 10Strikers games/teams, Rehabwheel sports community/progress.
- **D5**: End-to-end security, privacy, paywall and accessibility checks. Repair launch blockers.
- **D6**: Sign six native builds and verify on iOS/Android physical devices.
- **D7**: Submit eligible builds; offer controlled beta distribution where store review/testing rules make public release impossible.

**No-go conditions**: broken sign-in, failing account deletion, unsafe sharing, unmoderated user-generated content, payment failures, crashes on key flows, missing store entitlements, unapproved signing or inaccessible release source. Public store approval cannot be guaranteed in seven days.

## Copy safety
Avoid claims of clinical benefits, measured outcomes, FDA clearance, or real member activity unless substantiated. Demo members and events must remain clearly labeled. All public UI assets must be licensed or owned and consented for intended use.

## Technical handoff
Source: `community/index.html`, manifest: `community/manifest.webmanifest`.
To deploy into the real iOS/Android Rehabwheel application, port the interaction patterns into the connected mobile repository. Do **not** deploy the local-only browser data logic as real multiuser storage. 
