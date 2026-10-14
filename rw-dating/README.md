# Rehabwheel — social community

One Rehabwheel app: social feed, friendships, opt-in dating, events, messaging, groups and profiles. Dating is a feature, not a separate app. The existing HTML is only a prototype and its interactive demo content is not a production backend.

Keep social accounts/data separate from clinical LegMaker patient records. Use consent-based opt-in dating, 18+ age gating for dating, privacy controls, block/report/moderation, and accessibility.

## Mobile
Install dependencies with npm install. Create www and copy index.html to www/index.html, then run npx cap add android / npx cap sync android (or iOS on macOS). CI is configured to attempt a debug Android APK; a successful build must be independently verified.
