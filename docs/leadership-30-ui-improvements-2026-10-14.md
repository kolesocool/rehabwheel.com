# Rehabwheel Our People — 30 implemented website refinements

**Date:** October 14, 2026  
**Scope:** `company.html` leadership/advisor gallery and `index.html` team preview.  
**Design direction:** Original real portraits, editorial hierarchy and restrained corporate design inspired by the supplied Sterling Bay reference.  
**Content rule:** Existing names, role titles, professional biographies and LinkedIn links retained.

## Editorial presentation (01–08)

1. **Brand-first hero heading:** updated to “The people behind Rehabwheel.”
2. **Clear and accurate introduction:** describes the actual technical, operational, research and clinical disciplines.
3. **Verified group counts:** six leadership profiles and two clinical/medical advisor profiles.
4. **Stronger section hierarchy:** leadership/advisory numbers and editorial headings.
5. **Refined hero spacing:** more balanced whitespace and typography at desktop widths.
6. **Legible supporting copy:** improved section ledes and headline wrapping.
7. **Consistent photography frames:** unobtrusive borders, warm neutral background and restrained hover treatment.
8. **Individual portrait crops:** focal positioning for existing original pictures, including a non-cropped transparent portrait for Stan.

## Profile usability (09–17)

9. **Click the portrait:** all eight portraits open their existing professional biographies.
10. **Accessible photo buttons:** unique labels and ARIA dialog relationships.
11. **Accessible biography buttons:** consistent dialog semantics across all eight cards.
12. **Return focus:** keyboard focus returns to the opener after closing.
13. **Native Escape behavior:** Escape closes supported biography dialogs.
14. **Backdrop dismissal:** clicking outside the biography panel closes it.
15. **Prevent background scroll:** page stays stable while a biography is open.
16. **Direct profile links:** homepage links to a specific person can automatically open that biography.
17. **Graceful no-JavaScript fallback:** professional biographies are readable inline if scripts are unavailable.

## Responsive design and inclusive access (18–24)

18. **Responsive portrait grid:** desktop, tablet and mobile columns adapt to screen width.
19. **Responsive modal:** biography image and text stack legibly on small screens.
20. **Narrow-screen headline sizing:** hero, cards and biographies avoid clipped text.
21. **Visible keyboard focus:** explicit outlines for portraits, biographies, links and controls.
22. **Improved color contrast:** stronger text and role contrast, including high-contrast mode.
23. **Reduced-motion support:** minimizes image and button transitions for users requesting it.
24. **Print-friendly profile styling:** avoids awkward photo breaks and hides interactive controls when printing.

## Homepage, discovery and performance (25–30)

25. **Homepage team description:** added a concise, human-facing introduction to the people section.
26. **All-eight-profiles action:** clear navigation from the homepage to the complete people gallery.
27. **Visible individual profile links:** each homepage card now says “Read profile.”
28. **Original image fidelity:** kept every uploaded source image path and added load priority for the first two profiles without recompression.
29. **Search metadata and Person JSON-LD:** updated leadership page title/descriptions and added eight structured person profiles from published site content.
30. **Asset refresh and QA:** incremented CSS/JS asset versions, validated eight portrait references on both pages, checked markup counts, JavaScript syntax, stylesheet brace balance and GitHub Pages deployment.

## Files changed

- `company.html`
- `index.html`
- `assets/people-editorial.css`
- `assets/people-editorial.js`

## Verification boundaries

These checks confirm repository code, referenced source files and successful GitHub Pages publication. They **do not constitute a full multi-device visual or assistive-technology usability test**. Source image quality is not magically increased: Jag's current source is 200 × 200 pixels; Nikita and Kristin are 400 × 400 pixels. Higher-resolution originals would further improve their large-screen portraits. No AI-generated faces have been substituted.
