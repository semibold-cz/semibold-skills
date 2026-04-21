# SEO Rules for Internal Linking

## Core Principles

Internal links distribute PageRank, establish topical relevance, and help users navigate. Every link should serve both SEO and UX purposes.

---

## 1. Topical Clustering

Identify topic clusters from the crawled site structure. Group pages by shared topics — typically a pillar page (service/product) surrounded by supporting content (blog posts, case studies, glossary terms).

### How to Discover Clusters

1. Group CMS items by tags/categories
2. Match blog posts to service/product pages by keyword overlap in titles and H1s
3. Group portfolio items by the service they demonstrate

### Linking Priorities Within Clusters

1. Supporting content → Pillar page (highest priority — drives conversions)
2. Supporting content → Supporting content (same cluster — builds topical authority)
3. Pillar page → Portfolio/case study (social proof)
4. Portfolio → Pillar page (back-link to service)
5. Glossary/reference → Blog or Pillar page (educational path)
6. Blog → Glossary term (for definitions)

### Cross-Cluster Linking

Allow cross-cluster links only when content genuinely overlaps. Avoid forced connections.

---

## 2. Link Equity Distribution

### Page Hierarchy (by SEO value)

```
Homepage
  └── Pillar pages (services, products — highest priority as link targets)
        └── Blog posts / articles (medium priority)
              └── Portfolio / case studies (medium-low)
                    └── Glossary / reference pages (lowest priority)
```

### Distribution Rules

- Pillar pages should have the most incoming internal links (target: 10+ each)
- Blog posts should link to at least 1 pillar page and 1 other blog post
- Portfolio items should link back to the relevant pillar page
- Glossary terms should link to the most relevant blog post or pillar page
- Homepage links are managed via navigation — do not modify via this tool

---

## 3. Anchor Text Rules

### Do

- Use natural phrases that exist in the content
- Vary anchor text — at least 3 different anchors for the same target across the site
- Include the target page's primary keyword naturally
- Keep anchors 2-5 words long
- Match the language of the source page

### Don't

- Generic anchors: "click here", "read more", "learn more", "here", or equivalents in any language
- Same anchor text more than twice for the same target
- URL as anchor text
- Exact `<title>` tag as anchor (over-optimized)
- Anchor text inside headings

### Anchor Text Patterns by Target Type

| Target Type     | Good Anchor Pattern                            |
|----------------|-----------------------------------------------|
| Pillar/service  | Natural phrase containing the service keyword |
| Blog post       | Descriptive phrase about the topic            |
| Portfolio       | "project for [client]", "our work on [topic]" |
| Glossary        | The term itself                               |

---

## 4. Placement Rules

### Where to Place Links

- In body paragraphs (`<p>` tags only)
- Middle or second half of the article preferred
- Within a sentence where the anchor text flows naturally
- Maximum 1 new link per paragraph

### Where NOT to Place Links

- Headings (`<h1>` through `<h6>`) — never
- First 2 sentences of any article — never
- Bullet lists (`<ul>`, `<ol>`) — avoid due to Webflow API bug
- Image captions or alt text
- Blockquotes
- Last sentence of the article (CTA area)

---

## 5. Density Rules

### Per Page

- Maximum **3-5 new links** per page in a single audit
- Total internal links per page should not exceed 15-20
- Space new links at least 2 paragraphs apart

### Per Audit Run

- Maximum **30 total changes** per audit
- Highest-impact changes first (orphan pages, pillar pages)
- Leave room for organic linking

---

## 6. Language Rules

For multilingual sites:
- Each language version links only within itself
- Never cross-link between languages in body content
- Audit each language independently
- Detect language from URL prefix (e.g., `/en/`, `/de/`, `/fr/`)

For single-language sites: skip this rule.

---

## 7. Orphan Page Recovery

### Definition

Orphan page = a page with **2 or fewer** incoming internal links (excluding navigation).

### Recovery Strategy

1. Identify all orphan pages from the Link Matrix
2. For each, find the 3 most topically relevant pages that could link to it
3. Prioritize these as the first proposals in the audit
4. Target: zero orphan pages after each audit

---

## 8. Freshness Rules

- New content (last 3 months) should be linked from older, established pages
- Year-specific articles should link to evergreen pillar pages
- Old articles (2+ years) should link to the most current version of the topic

---

## 9. Quality Checklist

Before finalizing each proposal, verify:

- [ ] Target page exists and returns 200
- [ ] Anchor text reads naturally in context
- [ ] No duplicate target on the same source page
- [ ] Anchor text differs from other anchors pointing to the same target
- [ ] Source and target are in the same language (if multilingual)
- [ ] Link is not in heading, first 2 sentences, or bullet list
- [ ] Total links on page won't exceed 20 after insertion
