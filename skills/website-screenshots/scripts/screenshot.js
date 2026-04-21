#!/usr/bin/env node

// Resolve playwright from /tmp/node_modules if not found locally
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  ({ chromium } = require('/tmp/node_modules/playwright'));
}

const args = process.argv.slice(2);
const outputDir = args[0];
const width = parseInt(args[1] || '1440');
const height = parseInt(args[2] || '900');
const waitMs = parseInt(args[3] || '4000');

// Read URLs from stdin (one per line: name|url)
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => { input += chunk; });
process.stdin.on('end', async () => {
  const pages = input.trim().split('\n').filter(Boolean).map(line => {
    const [name, url] = line.split('|');
    return { name: name.trim(), url: url.trim() };
  });

  if (pages.length === 0) {
    console.error('No pages provided. Provide lines of: name|url');
    process.exit(1);
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 });
  const results = { success: [], failed: [] };

  // Common cookie consent button selectors (covers most popular solutions)
  const cookieSelectors = [
    // iubenda
    '[data-iub-action="accept"]',
    '.iubenda-cs-accept-btn',
    // OneTrust
    '#onetrust-accept-btn-handler',
    '#accept-recommended-btn-handler',
    // Cookiebot
    '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
    '#CybotCookiebotDialogBodyButtonAccept',
    // CookieConsent / Osano
    '.cc-accept', '.cc-btn.cc-dismiss',
    // Complianz
    '.cmplz-accept',
    // Quantcast / TCF
    '.qc-cmp2-summary-buttons button[mode="primary"]',
    // Klaro
    '.klaro .cm-btn-accept',
    // Generic patterns (EN)
    'button:has-text("Accept all")',
    'button:has-text("Accept All")',
    'button:has-text("Accept")',
    'button:has-text("Accept cookies")',
    'button:has-text("Allow all")',
    'button:has-text("Allow All")',
    'button:has-text("I agree")',
    'button:has-text("Got it")',
    // Generic patterns (DE)
    'button:has-text("Alle akzeptieren")',
    'button:has-text("Akzeptieren")',
    'button:has-text("Alle Cookies akzeptieren")',
    'button:has-text("Zustimmen")',
    // Generic patterns (CZ)
    'button:has-text("Souhlasím")',
    'button:has-text("Přijmout vše")',
    'button:has-text("Přijmout všechny")',
    'button:has-text("Povolit vše")',
    // Generic ID/class patterns
    '#accept-cookies', '#cookie-accept', '#cookies-accept',
    '[aria-label="Accept cookies"]',
    '[aria-label="Accept all cookies"]',
    '[data-action="accept"]',
    '[data-cy="banner-accept"]',
  ];

  async function dismissCookieBanner(page) {
    // Step 1: Try clicking a dismiss button
    let clicked = false;
    for (const selector of cookieSelectors) {
      try {
        const el = page.locator(selector).first();
        if (await el.isVisible({ timeout: 300 })) {
          await el.click();
          await page.waitForTimeout(800); // wait for dismiss animation
          clicked = true;
          break;
        }
      } catch {}
    }

    // Step 2: CSS fallback (inspired by pageres' "hide" option)
    // Hide any remaining cookie overlays that block the view, regardless of their button text.
    // Also restores body scroll which some banners lock.
    try {
      await page.addStyleTag({ content: `
        /* Cookiebot */ [id*="CybotCookiebot"], #cookiebanner,
        /* OneTrust */ [id*="onetrust-banner-sdk"], #onetrust-consent-sdk,
        /* iubenda */ #iubenda-cs-banner, [id*="iubenda"], [class*="iubenda-cs"],
        /* CookieScript */ #cookie-script-tagmanager, [class*="cookiescript"],
        /* Termly */ #termly-code-snippet-support, [class*="termly-"],
        /* Usercentrics */ #usercentrics-root,
        /* Civic */ .cc-window, .cc-banner, #ccc, #ccc-overlay,
        /* Cookie law info */ #cookie-law-info-bar, #cli-bar,
        /* Generic patterns */
        [class*="cookieconsent"], [class*="cookie-banner"], [class*="cookie-consent"],
        [class*="cookie-notice"], [class*="cookie-disclaimer"], [class*="cookie-modal"],
        [class*="gdpr-banner"], [class*="consent-banner"], [class*="consent-popup"],
        [class*="privacy-banner"], [class*="js-cookie-banner"],
        [data-cookiebanner], #cookies-eu-banner
        { display: none !important; }
        html, body { overflow: auto !important; height: auto !important; }
      ` });
    } catch {}

    return clicked;
  }

  async function scrollToTriggerLazy(page) {
    const height = await page.evaluate(() => document.body.scrollHeight);
    for (let pos = 0; pos < height; pos += 800) {
      await page.evaluate((y) => window.scrollTo(0, y), pos);
      await page.waitForTimeout(150);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);
  }

  for (const p of pages) {
    try {
      await page.goto(p.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(waitMs);

      // Dismiss cookie banner, then scroll to trigger lazy-loaded content
      await dismissCookieBanner(page);
      await scrollToTriggerLazy(page);

      const path = `${outputDir}/${p.name}.png`;
      await page.screenshot({ path, fullPage: true });
      console.log(`OK: ${p.name} -> ${path}`);
      results.success.push(p.name);
    } catch (e) {
      console.log(`FAIL: ${p.name} - ${e.message}`);
      results.failed.push(p.name);
    }
  }

  await browser.close();
  console.log(`\nDone: ${results.success.length} saved, ${results.failed.length} failed`);
  if (results.failed.length > 0) {
    console.log(`Failed: ${results.failed.join(', ')}`);
  }
});
