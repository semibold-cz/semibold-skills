# Semibold Skills

Claude Code skills published by [Semibold](https://semibold.cz).

![Claude Skill](https://img.shields.io/badge/Claude-Skill-purple)
![License MIT](https://img.shields.io/badge/License-MIT-green)

A growing collection of Claude Code skills for designers, developers, and everyday productivity workflows. More skills will be added over time.

## Skills

| Skill | Description |
|-------|-------------|
| **audit-links** | Audit and improve internal linking on any Webflow website. Crawls the site, proposes contextual internal links, and implements approved changes via Webflow CMS. |
| **website-screenshots** | Take full-page PNG screenshots of any website using Playwright. Auto-dismisses cookie banners and triggers lazy-loaded content. |

## Installation

### Claude Code marketplace (recommended)

```
/plugin marketplace add semibold-cz/semibold-skills
```

Then enable the plugin in `/plugin`.

### npx skills

Works with Cursor, Claude Code, Codex, Windsurf, Copilot, and [40+ agents](https://github.com/vercel-labs/skills#supported-agents):

```bash
npx skills add https://github.com/semibold-cz/semibold-skills
```

### Clone / copy

Clone this repo and copy the skill folders into the appropriate directory for your agent:

| Agent | Skill Directory | Docs |
|-------|-----------------|------|
| Claude Code | `~/.claude/skills/` | [docs](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/skills) |
| Cursor | `~/.cursor/skills/` | [docs](https://docs.cursor.com/context/rules) |
| OpenCode | `~/.config/opencode/skills/` | [docs](https://opencode.ai/docs/skills/) |
| OpenAI Codex | `~/.codex/skills/` | [docs](https://developers.openai.com/codex/skills/) |

Example for Claude Code:

```bash
git clone https://github.com/semibold-cz/semibold-skills.git /tmp/semibold-skills
cp -r /tmp/semibold-skills/skills/* ~/.claude/skills/
```

## Skill details

### audit-links

Runs a 5-phase internal linking audit on a Webflow site:

1. Crawl sitemap → build a link matrix
2. Load CMS content via Webflow MCP
3. Propose links based on topical clustering, orphan pages, and SEO rules
4. Present proposals for approval
5. Implement approved changes as drafts (never auto-publishes)

**Requirements:** [Claude in Chrome](https://claude.ai/chrome) for crawling, [Webflow MCP](https://developers.webflow.com/data/docs/mcp) for CMS access.

### website-screenshots

Bulk full-page screenshots of any website at 2× Retina quality. Auto-discovers pages from nav/footer links or accepts specific URLs. Dismisses popular cookie-consent banners (iubenda, OneTrust, Cookiebot, Termly, Usercentrics, etc.) and scrolls the page to trigger lazy-loaded content before capturing.

**Requirements:** Node.js + Playwright (`npm install playwright`) or Python + Playwright as a fallback.

## Structure

```
semibold-skills/
├── README.md
├── AGENTS.md             # Guidance for agents editing this repo
├── LICENSE               # MIT
├── .claude-plugin/       # Claude Code plugin + marketplace config
│   ├── plugin.json
│   └── marketplace.json
└── skills/
    ├── llms.txt          # Skill index for agents (names, triggers)
    ├── audit-links/
    │   ├── SKILL.md
    │   └── references/
    │       └── SEO-RULES.md
    └── website-screenshots/
        ├── SKILL.md
        └── scripts/
            └── screenshot.js
```

## Contributing

Pull requests welcome. See [`AGENTS.md`](AGENTS.md) for the conventions to follow when adding or editing skills.

## License

[MIT](LICENSE)
