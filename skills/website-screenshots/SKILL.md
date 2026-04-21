---
name: website-screenshots
description: Take full-page screenshots of all pages on a website using Playwright. Use when the user wants to "screenshot a website", "capture all pages", "take screenshots of my site", "screenshot website pages", or mentions taking full-page screenshots of web pages. Triggers on requests involving bulk website screenshotting.
---

# Website Screenshots

Take full-page PNG screenshots of website pages using Playwright.

Script: `~/.claude/skills/website-screenshots/scripts/screenshot.js`

## Workflow

### 1. Gather info from user

Ask these questions (skip any already answered):

1. **URL** — What is the website URL?
2. **Pages** — Which pages to capture?
   - "all" — auto-discover from nav + footer links
   - Specific URLs provided by user
3. **Output folder** — Where to save? Default: `~/Desktop/{site-name}-screenshots/`

### 2. Discover pages (if "all")

Use WebFetch to load the homepage and extract all unique internal links from navigation and footer. Generate a clean `name` for each URL (e.g., `/about-us` → `about-us`, `/` → `homepage`).

### 3. Ensure Playwright is available

**Option A — Node.js** (preferred, uses the bundled script):
```bash
cd /tmp && npm ls playwright 2>/dev/null || npm install playwright
```

**Option B — Python** (fallback when node/npm is not installed):
```bash
python3 -c "import playwright" 2>/dev/null || pip3 install playwright
/usr/local/bin/playwright install chromium 2>/dev/null || \
  $(python3 -m site --user-base)/bin/playwright install chromium
```

### 4. Take screenshots

**Node.js path:**
```bash
mkdir -p <output-dir>
printf "homepage|https://example.com/\nabout|https://example.com/about" | node ~/.claude/skills/website-screenshots/scripts/screenshot.js <output-dir> [width] [height] [wait-ms]
```

Arguments: `output-dir` (required), `width` (default 1440), `height` (default 900), `wait-ms` (default 4000)

Input via stdin — one line per page: `name|url`

**Python path** (when node is unavailable):
```bash
python3 - <<'EOF'
import asyncio
from playwright.async_api import async_playwright

PAGES = [("homepage", "https://example.com/")]  # fill in your pages
OUTPUT_DIR = "/path/to/output"
WIDTH, HEIGHT, WAIT_MS = 1440, 900, 4000

async def screenshot():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": WIDTH, "height": HEIGHT}, device_scale_factor=2)
        for name, url in PAGES:
            await page.goto(url, wait_until="domcontentloaded", timeout=30000)
            await page.wait_for_timeout(WAIT_MS)
            # Try to click cookie dismiss buttons
            for sel in ['button:has-text("Accept")', 'button:has-text("Souhlasím")',
                        'button:has-text("Přijmout")', 'button:has-text("I agree")',
                        '[id*="cookie"] button', '#onetrust-accept-btn-handler']:
                try:
                    btn = page.locator(sel).first
                    if await btn.is_visible(timeout=300):
                        await btn.click()
                        await page.wait_for_timeout(800)
                        break
                except: pass
            # CSS fallback: hide remaining banners
            await page.add_style_tag(content="""
                [class*="cookie-banner"],[class*="cookieconsent"],[id*="CybotCookiebot"],
                [id*="onetrust-banner-sdk"],.cc-window { display: none !important; }
                html,body { overflow: auto !important; }
            """)
            await page.screenshot(path=f"{OUTPUT_DIR}/{name}.png", full_page=True)
            print(f"OK: {name}")
        await browser.close()

asyncio.run(screenshot())
EOF
```

Cookie banners are dismissed automatically using two strategies:
1. **Click**: tries common dismiss buttons (iubenda, OneTrust, Cookiebot, CookieConsent, Complianz, Klaro + generic EN/DE/CZ text patterns)
2. **CSS fallback**: hides remaining cookie overlay elements by class/ID patterns — language-agnostic, inspired by [pageres' `hide` option](https://github.com/sindresorhus/pageres)

### 5. Handle failures

If a page fails (timeout), retry with longer timeout:

```bash
cd /tmp && node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('PAGE_URL', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(6000);
  await page.screenshot({ path: 'OUTPUT_PATH', fullPage: true });
  await browser.close();
})();
"
```

### 6. Report results

List all saved files with `ls -la <output-dir>` and confirm count to user.
