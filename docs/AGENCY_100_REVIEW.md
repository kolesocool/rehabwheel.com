# Rehabwheel 100-point implementation review

12 October 2026. This is a source/behavior review, not a claim of clinical validation or real email delivery.

Implemented: 71; Retained / checked: 11; Partial: 9; External verification / source needed: 9.

| # | Improvement | Status | Evidence or remaining work |
|---|---|---|---|
| 1 | Homepage sequence | Implemented | Reduced the main page to 15 sections and reordered the product journey. |
| 2 | Opening explanation | Implemented | Opening copy states device, seated use and wheelchair attachment. |
| 3 | Short introduction | Implemented | Replaced the hero paragraph with two short sentences. |
| 4 | Primary CTA | Implemented | Hero uses Request a demonstration. |
| 5 | Secondary CTA | Implemented | Hero uses Watch LegMaker in motion. |
| 6 | Attachment photograph | Implemented | Hero uses the seated wheelchair prototype photograph. |
| 7 | Demonstration position | Implemented | Moved existing video players directly below the hero. |
| 8 | Repeated attachment sections | Implemented | Removed overlapping promotional sections. |
| 9 | Institutional promotions | Implemented | Consolidated homepage institutional promotion into one entry. |
| 10 | Device status | Implemented | Short investigational-device status in hero and shared footer. |
| 11 | Mode names | Implemented | Homepage and product controls follow Passive / Assistive / Active concept labels. |
| 12 | Resistance setting | Implemented | Resistance is described and illustrated separately from motion modes. |
| 13 | Deployment CTA | Implemented | Replaced Configure Deployment with Discuss an evaluation. |
| 14 | Concrete engineering information | Implemented | Removed generic homepage promotions and added evidence/target specification columns. |
| 15 | Grammar | Implemented | Corrected A investigational and rewrote the hero copy. |
| 16 | Section purpose | Implemented | Removed overlapping introduction, proof, promise and next-step blocks. |
| 17 | Repeated headings | Implemented | Reduced duplicated product-story headings through section consolidation. |
| 18 | Brand/product naming | Retained / checked | Rehabwheel company and LegMaker product naming retained. |
| 19 | Feature status | Implemented | Product specifications distinguish documented website material and targets. |
| 20 | Superlatives | Implemented | Removed generic serious-engineering promotional block from homepage. |
| 21 | Typography | Implemented | Added shared heading scale and paragraph treatment. |
| 22 | Responsive heading sizes | Implemented | Fluid h2/h3 sizing and mobile hero rules. |
| 23 | Paragraph measure | Implemented | Shared readable text-width limits. |
| 24 | CSS consolidation | Partial | New components use shared tokens; legacy stylesheet still needs a separate full cleanup. |
| 25 | Dark surfaces | Implemented | Explicit text colors for homepage dark sections and CTAs. |
| 26 | Light controls | Implemented | Explicit foreground/background pairs for new controls. |
| 27 | Card padding | Implemented | Consistent new component padding and mobile rules. |
| 28 | Corner radii | Implemented | Shared component-radius token applied to key cards. |
| 29 | Shadows | Implemented | Removed heavy shadows from major promotional and media cards. |
| 30 | Section spacing | Implemented | Shared spacing scale and reduced homepage clutter. |
| 31 | Shared navigation | Implemented | Same header on all content pages, including institutions. |
| 32 | Navigation destinations | Implemented | Four desktop groups and a focused mobile structure. |
| 33 | Dropdown descriptions | Implemented | Shared destination labels and descriptive subtext. |
| 34 | Current page | Implemented | Current path marked with aria-current and visible styling. |
| 35 | Mobile groups | Implemented | Expandable research/resources and company/contact groups. |
| 36 | Menu close on selection | Retained / checked | Existing menu behavior retained and exercised in runtime tests. |
| 37 | Menu focus | Implemented | Escape restores toggle focus; focus trap includes visible summary controls. |
| 38 | Anchor clearance | Implemented | Shared scroll margins for sticky header. |
| 39 | Breadcrumbs | Partial | Existing breadcrumbs retained; complete breadcrumb normalization deferred. |
| 40 | Shared footer | Implemented | One Product/Evaluation/Company footer on every content page. |
| 41 | Photo treatment | Partial | Shared loading/decoding and layout retained; individual image retouching not performed. |
| 42 | Attachment emphasis | Implemented | Selected clear seated prototype image for hero. |
| 43 | Gallery curation | Partial | No photos deleted without reviewing their distinct content. |
| 44 | Photo labels | Partial | Existing captions retained; full image-by-image caption verification pending. |
| 45 | Caption verification | External verification / source needed | Requires visual review of every source photograph. |
| 46 | Photo enlargement | Retained / checked | Existing photo viewer retained. |
| 47 | Gallery keyboard controls | Retained / checked | Existing viewer handlers retained; device/browser verification pending. |
| 48 | Video titles | Implemented | Replaced numbered labels with product demonstration and prototype footage titles. |
| 49 | Video transcripts | External verification / source needed | Accurate source transcripts/captions not available in the repository. |
| 50 | Ready video players | Retained / checked | Existing eager-loaded players retained per user preference. |
| 51 | Attachment visual sequence | Partial | Existing setup explorer retained; verified installation sequence requires device documentation. |
| 52 | Movement visual response | Implemented | Selected mode changes illustration color as well as explanatory text. |
| 53 | Resistance visualization | Implemented | Added a relative resistance slider, separate from modes. |
| 54 | Control explanations | Implemented | Added explanatory text and metric definitions. |
| 55 | Explorer reset | Implemented | Reset restores mode, duration, chart pattern, setup, pathway and resistance. |
| 56 | Chart units | Implemented | Added visible RPM label; time labels retained. |
| 57 | Synthetic data label | Retained / checked | Synthetic demo data remains visible beside the chart. |
| 58 | Metric explanations | Implemented | Added cadence and mean-value definitions. |
| 59 | Explorer next steps | Implemented | Relevant product, technology, photo and research links added. |
| 60 | Reduced motion | Implemented | Shared reduced-motion override for new and existing components. |
| 61 | Product structure | Implemented | Prototype photograph moved earlier; section links and compatibility section added. |
| 62 | Specification status | Implemented | Three-column evidence/target table added. |
| 63 | Review date | Implemented | Specification table identifies the website review date. |
| 64 | Compatibility | Implemented | Added a clear compatibility-review section without universal-fit claims. |
| 65 | Print overview | Implemented | Print action and focused product print stylesheet added. |
| 66 | Document request | Implemented | Direct current-documentation request link added. |
| 67 | Research separation | Retained / checked | Existing research-direction/planning page retained; no results invented. |
| 68 | Patent records | Partial | Existing official references retained; identifiers require independent record verification. |
| 69 | Milestone dates | External verification / source needed | New verified milestone chronology needs authoritative company source material. |
| 70 | Partner relationships | External verification / source needed | Exact relationship wording requires confirmation/source documentation. |
| 71 | Clinician route | Implemented | Shared navigation, clinical pathway and institutional entry retained and simplified. |
| 72 | Procurement route | Implemented | Shared purchasing links and dedicated purchasing inquiry form. |
| 73 | User/caregiver route | Implemented | Plain-language product introduction and compatibility guidance. |
| 74 | Research route | Retained / checked | Research destination retained in shared navigation and contact pathways. |
| 75 | Investor route | Retained / checked | Investor overview linked consistently from shared footer/mobile menu. |
| 76 | Inquiry expectations | Implemented | Three-step explanation of submission, review and response. |
| 77 | Form position | Implemented | Contact form moved ahead of the email-directory section. |
| 78 | Essential fields | Implemented | Organization fields moved into an optional disclosure. |
| 79 | Progressive detail | Implemented | Optional organization details can be expanded when relevant. |
| 80 | Preserve entries | Implemented | Provider failure and offline flows preserve form contents. |
| 81 | Field errors | Retained / checked | Existing field-specific validation retained; runtime validation exercised. |
| 82 | Sending state | Implemented | Busy state and disabled submit button while request is pending. |
| 83 | Receipt gating | Implemented | Success requires HTTP success plus provider success flag; URL parameters are not receipts. |
| 84 | Inbox delivery | External verification / source needed | No real email was sent; inbox receipt and provider activation remain unverified. |
| 85 | Fallback contact | Implemented | Direct email fallback added to every inquiry/subscription form. |
| 86 | Purchasing semantics | Implemented | Success wording says inquiry, not order confirmation; billing address optional at inquiry stage. |
| 87 | Newsletter automation | External verification / source needed | Current flow remains a request to the team, not an automated mailing-list service. |
| 88 | Double opt-in/unsubscribe | External verification / source needed | Requires a configured mailing-list provider and verified subscription lifecycle. |
| 89 | One consent interface | Implemented | Removed duplicate prompt; unified preference governs local analytics and GA4. |
| 90 | Assistant labeling | Implemented | Renamed deterministic helper to Product guide. |
| 91 | GA4 event receipt | External verification / source needed | Consent gating tested locally; production receipt requires GA4 property access. |
| 92 | Demo event classification | Implemented | Accepted inquiries use a distinct demo form_type. |
| 93 | Purchasing event classification | Implemented | Provider acceptance uses purchase_provider_accepted; never a sale event. |
| 94 | Video analytics | Partial | Existing click tracking retained; full embedded playback milestones remain unverified. |
| 95 | Production dashboard | External verification / source needed | Requires GA4 account access; existing browser-local diagnostic panel is not sitewide analytics. |
| 96 | Search descriptions | Implemented | Refined core page descriptions and synchronized WebPage schema descriptions. |
| 97 | Structured data consistency | Implemented | Updated visible-content descriptions; JSON-LD syntax validated. |
| 98 | Links and anchors | Retained / checked | No broken local links or duplicate IDs in the full content-page audit. |
| 99 | Cross-device journey tests | Partial | Runtime, validation, keyboard/menu and mocked delivery tests passed; physical-device tests outstanding. |
| 100 | Release checklist | Implemented | This itemized review plus runtime and structural checks documents the release gate. |

## Verification

- Full shared-script runtime checks on homepage, contact, product, explorer, purchasing, company and institutions.
- Consent default, grant, withdrawal and GA4 disabled state.
- Mode controls, explorer reset, menu Escape/focus handling.
- Mocked provider acceptance, rejection and offline behavior; no real messages sent.
- Local links and anchors, duplicate IDs, asset references and JSON-LD syntax.
- Live visual review follows publication. Physical mobile-device and real account tests remain separate gates.
