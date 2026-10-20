# Legacy Rehabwheel Storefront: SEO Migration and Cleanup

**Status:** Action plan only; old pages and search-result snippets have not been confirmed removed. Updated October 20, 2026.

## Why this matters

Search engines have previously surfaced legacy `rehabwheel.com/products/...` pages advertising sold-out performance packs alongside the current corporate LegMaker website. The intended canonical presence is the investigational LegMaker information on `https://rehabwheel.com/` and `/legmaker.html`, not stale store listings. The exact HTTP behavior of every legacy URL and indexing state must be checked using Search Console and live HTTP inspection before acting.

## Verification and correction workflow

1. Add or verify the `rehabwheel.com` Domain property in Google Search Console.
2. Search **Pages** and **URL inspection** for historical `/products/`, `/collections/`, `/pages/team`, and other legacy Shopify URLs.
3. Record whether each old URL currently returns a **200**, **301/308**, **404**, or **410** and whether Google has indexed it.
4. Where there is a genuinely matching successor, implement a **server-side permanent redirect** to an appropriate current page. Examples to assess: legacy LegMaker product → `/legmaker.html`; old team → `/company.html`.
5. Where content has no successor, serve 404/410 instead of soft-404 text or a universal homepage redirect.
6. Remove obsolete products/content from any remaining Shopify publication channel and prevent two production hosts from serving different content at the same hostname.
7. Keep the XML sitemap limited to valid, indexable canonical URLs. Do not add obsolete catalog URLs.
8. Request reindexing for important updated destination URLs; use Search Console temporary Removals only when justified, recognizing that this does **not** replace permanent redirects/deletions.
9. Inspect Google snippets after recrawling and verify they no longer promise unapproved product availability, clinical effectiveness or misleading pricing.
10. Preserve verified referring links, but do not publish fabricated endorsements, review ratings, clinician outcomes or availability statuses.

## Proof required before closing SEO migration

- An HTTP status log for all legacy paths.
- Search Console URL inspection and indexing status before and after.
- Redirect mappings and their owning hosting platform.
- Date of re-crawl and affected search queries.
- No obsolete storefront URLs in the current sitemap.

**Important:** GitHub Pages cannot by itself serve arbitrary server-side 301 rules for historic routes. Depending on the current DNS/front-end provider, redirects require a routing layer such as a CDN or a server with redirect support. Never report a search-result cleanup as complete merely because GitHub files were modified.

**Confidentiality:** Do not publish prospective research collaborators, unapproved testing plans, sensitive patient information, or claims of regulatory clearance.
