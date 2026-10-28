# LegMaker Labs — publishing real participant stories

Public stories live in `/assets/labs-stories.json`. They are rendered on the Labs hub and on each matching Lab page using `/assets/labs-stories.js`. The website is static GitHub Pages: this is an editorial publishing workflow, **not** an authenticated admin dashboard or a private medical record system.

## Publishing checklist

1. Conduct a supervised demonstration only after compatibility, safety, facility access, and schedule are confirmed. Participation is voluntary.
2. Obtain **separate written consent** for photography/filming, and **separate specific permission for public publication** of the chosen photo, video, name/alias, and quote. Keep the consent records privately, **outside this public repository**.
3. Confirm the subject's review and approval of the final caption and media; do not imply clinical benefits or athlete performance improvements without adequate evidence.
4. Host approved videos through a controlled public video link, and approved images on a permitted HTTPS URL or under the site assets. Never commit medical records, contact information, consent forms, or private participant files to this repository.
5. Add an entry to the `stories` array in `assets/labs-stories.json` via a reviewed pull request. Set `published: true` and `consent_verified: true` **only after actual verification**. Preview and merge the PR.
6. If consent is withdrawn, remove the entry and associated assets promptly, and check external video hosts and caches for copies.

## Story object example (fictional schema only; do not publish as a real story)

```json
{
  "lab": "soccer",
  "title": "Participant-approved story title",
  "date": "YYYY-MM-DD",
  "summary": "A brief factual description approved by the participant.",
  "image_url": "https://your-approved-image-host.example/photo.jpg",
  "image_alt": "Accurate descriptive alternative text",
  "video_url": "https://your-approved-video-host.example/video",
  "consent_verified": false,
  "published": false
}
```

Valid lab slugs: soccer, military, basketball, hockey, mma, home, hospital.

## Booking

The booking page `/athlete-demo/` currently accepts **requests** via FormSubmit, not real-time reservations. It asks for a 30-minute preferred slot within 9 AM–9 PM Pacific, at least 24 hours in advance. Staff must manually check the calendar, venue access, and eligibility, then send an explicit confirmation. For guaranteed slot locking, reminders, and conflict detection, integrate a provider with a real availability API and account credentials. Do not claim a request is confirmed before that integration is live.

## Safety and privacy

LegMaker is an investigational prototype. Avoid patient-level health information, diagnoses, outcomes, or treatment claims in public JSON. Do not present a marketing demonstration as an approved clinical trial. All content must comply with applicable privacy, consent, and research requirements.

## Local story editor

Open `/legmaker-labs/story-editor/` to compose and download a publication-ready JSON object locally. The page does **not** store data, upload photos or video, log in to GitHub, or publish directly. It intentionally requires explicit consent verification before generating a public story. Add the object to `assets/labs-stories.json` through a reviewed pull request. Media URLs must already be approved and publicly accessible over HTTPS.

## Scheduling provider connection

Connect a booking provider such as Calendly and create a 30-minute event type with America/Los_Angeles timezone, daily 9 AM–9 PM availability, and 24-hour minimum notice. Verify Humanmade room availability and add necessary screening questions. After the owner supplies the verified public booking URL, replace the email-request form CTA or embed the scheduling widget. Do not link to an unconfigured or guessed calendar URL.
