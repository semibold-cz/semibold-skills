---
name: audit-links
description: Audit and improve internal linking on any Webflow website. Crawl the site, analyze link structure, propose contextual internal links, and implement approved changes via Webflow CMS. Use when (1) running an internal linking audit on a Webflow site, (2) checking for orphan pages with few/no inbound links, (3) improving topical clustering between pages, (4) after publishing new content that needs linking from existing pages. Requires Claude in Chrome and Webflow MCP.
---

# Internal Linking Audit

## Phase 0 — Configuration

Ask the user for:
1. **Site URL** (e.g., `https://www.example.com`) — required
2. **Webflow site ID** — if not provided, list sites via Webflow MCP and let user pick
3. **Languages** — is the site multilingual? If yes, ask for language prefixes (e.g., `/en/`, `/de/`). Default: single language.
4. **Page types to prioritize** — which pages are most valuable? (e.g., service pages, product pages). Default: auto-detect from site structure.

## Phase 1 — Crawl Site

Build a complete Link Matrix.

1. Fetch `{SITE_URL}/sitemap.xml` using Claude in Chrome
2. Parse all `<loc>` URLs from the sitemap
3. For each URL, extract: URL, `<title>`, `<h1>`, all internal `<a href>` with anchor text
4. If multilingual: detect language per page from URL prefix
5. Build the Link Matrix:
   - Per page: outgoing links (target URL + anchor), incoming link count
   - Flag **orphan pages** (0-2 incoming links)
   - Flag pages with zero outgoing links
6. Auto-detect page types from URL patterns (e.g., `/blog/`, `/services/`, `/portfolio/`)

Crawl in batches of 5-10 pages with 500ms delay between batches.

## Phase 2 — Load CMS Content

Map every CMS item to its URL and extract rich text for editing.

1. List all Webflow CMS collections via Webflow MCP
2. Present collections to user — confirm which ones to include in the audit
3. For each selected collection, fetch: `_id`, `slug`, `name`, rich text body, tags, `published` status
4. Build CMS Map: `item_id ↔ URL ↔ title ↔ rich_text ↔ tags`
5. Cross-reference with Link Matrix from Phase 1

Only work with published items. Skip drafts unless explicitly requested.

## Phase 3 — Analyze & Propose Links

Generate a ranked list of internal linking opportunities.

Read `references/SEO-RULES.md` for the complete ruleset on topical clustering, anchor text, placement, and density. Key constraints:

- Max 3-5 new links per page
- Only `<p>` tags, never headings or first 2 sentences
- If multilingual: each language links only within itself
- Prioritize orphan pages and high-value pages as targets

**Output — Proposal Table:**

```
| #  | Source (CMS Item)       | Context in Text                    | Anchor Text      | Target URL        | Reason                           |
|----|------------------------|------------------------------------|------------------|-------------------|----------------------------------|
| 1  | Blog: Topic A          | "...tools like {anchor}..."        | our dev service  | /services/dev     | Orphan service page, topic match |
```

Sort by impact: orphan pages first, then high-value pages, then cross-links.

## Phase 4 — User Confirmation

Present the Proposal Table with summary stats (total proposals, pages affected, orphan fixes).

User options:
- **Approve all**
- **Select by numbers** — e.g., "Approve 1, 3, 5"
- **Edit anchor text** — e.g., "Change #2 anchor to 'web development'"
- **Reject all**

Wait for explicit confirmation before Phase 5.

## Phase 5 — Implement Changes

Insert approved links into Webflow CMS rich text.

For each approved proposal:
1. Fetch current rich text via Webflow MCP
2. Locate the exact text passage
3. Wrap anchor text in `<a href="TARGET_URL">`
4. Update the CMS item

**Safety rules:**
- **Never modify `<ul>`, `<ol>`, `<li>`** — Webflow API bug corrupts bullet lists
- Only edit within `<p>` tags
- **Never auto-publish** — draft only, ask before publish
- 1-second delay between API calls
- Max 10 edits per batch, then pause and report

**Report format:**
```
Updated: Blog: Topic A → link to /services/dev
Updated: Blog: Topic B → link to /services/design
Skipped: Blog: Topic C → anchor text not found

Draft changes saved. Publish now? (yes/no)
```

## Error Handling

- Crawl failure for a URL → skip, log, continue
- Webflow rate limit → wait 30s, retry once
- Content changed since Phase 2 → skip, warn user
- Anchor text not found → skip, report in summary

## References

- **`references/SEO-RULES.md`** — Read during Phase 3. Complete rules for topical clustering, anchor text, placement, density, language handling, orphan recovery.
