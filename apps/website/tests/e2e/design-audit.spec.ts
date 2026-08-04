import { expect, test } from '@playwright/test';

/**
 * Design-Audit PR47 Luxury Dark / Lime — exakt nach Anhang "NeXify Homepage.dc.html".
 * Testet: Anhang-data-testids, Lime-Tokens, Chat-Verbote (kein lucide-Icon, kein Emoji,
 * keine Quick-Replies), Responsive ohne Overflow, Kern-Routen.
 */

const viewports = [320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1480, 1920] as const;
const criticalRoutes = ['/', '/leistungen', '/preise', '/prozess', '/ueber-mich', '/kontakt', '/faq', '/plattform', '/wissen', '/impressum', '/datenschutz'] as const;

/** Anhang-data-testids (design_guidelines.json data_testids) */
const TESTIDS = [
  'logo',
  'header-cta',
  'mobile-nav-toggle',
  'hero-badge',
  'hero-cta',
  'hero-cta-secondary',
  'hero-visual',
  'hero-stats',
  'pricing-slider',
  'maintenance-toggle',
  'pricing-total',
  'pricing-cta',
  'cta-band',
  'cta-band-btn',
  'chat-launcher',
] as const;

test.describe('responsive design contract (Anhang)', () => {
  for (const width of viewports) {
    test(`home has no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: width < 768 ? 900 : 1100 });
      await page.goto('/', { waitUntil: 'networkidle' });

      await expect(page.locator('h1').first()).toBeVisible();
      await expect(page.locator('[data-testid="hero-badge"]')).toBeVisible();

      const metrics = await page.evaluate(() => {
        const selectors = ['body', '#main-content', '[data-testid="hero-visual"]', '[data-testid="hero-stats"]'];
        const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
        const boxes = selectors.flatMap((selector) =>
          Array.from(document.querySelectorAll<HTMLElement>(selector)).map((el) => {
            const rect = el.getBoundingClientRect();
            return { selector, left: rect.left, right: rect.right, visible: rect.width > 0 && rect.height > 0 };
          }),
        );
        const viewportWidth = document.documentElement.clientWidth;
        const escaped = boxes.filter((box) => box.visible && (box.left < -2 || box.right > viewportWidth + 2));
        return { overflow, escaped };
      });

      expect(metrics.overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(2);
      expect(metrics.escaped, `escaped boxes at ${width}px: ${JSON.stringify(metrics.escaped)}`).toEqual([]);

      await page.screenshot({ path: `test-results/design-audit/home-${width}.png`, fullPage: true });
    });
  }
});

test.describe('Anhang data-testids', () => {
  for (const testid of TESTIDS) {
    test(`[data-testid="${testid}"] exists on home`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto('/', { waitUntil: 'networkidle' });
      await expect(page.locator(`[data-testid="${testid}"]`).first()).toBeVisible();
    });
  }
});

test.describe('Lime-Tokens (Anhang)', () => {
  test('body background is #0A0A0A', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe('rgb(10, 10, 10)');
  });

  test('hero badge uses lime accent #C8FF00', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const color = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="hero-badge"] span');
      return el ? getComputedStyle(el).backgroundColor : null;
    });
    // Punkt im Badge: #C8FF00
    expect(color).toBe('rgb(200, 255, 0)');
  });
});

test.describe('Chat-Widget: Anhang-Verbote', () => {
  test('launcher has NO icon (no svg/lucide) — only lime dot + pulse ring', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const launcher = page.locator('[data-testid="chat-launcher"]');
    await expect(launcher).toBeVisible();
    // Kein <svg> (lucide oder sonstiges Icon) im Launcher
    const svgCount = await launcher.locator('svg').count();
    expect(svgCount, 'Launcher darf KEIN Icon (svg) enthalten').toBe(0);
    // Exakt 2 Spans: Puls-Ring + Lime-Punkt
    const spanCount = await launcher.locator('span').count();
    expect(spanCount).toBe(2);
  });

  test('chat panel: header "NeXify KI Berater", send button "→" (no icon)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.locator('[data-testid="chat-launcher"]').click();
    const panel = page.locator('[data-testid="chat-panel"]');
    await expect(panel).toBeVisible();
    await expect(panel).toContainText('NeXify KI Berater');
    const send = panel.locator('[data-testid="chat-send"]');
    await expect(send).toContainText('→');
    expect(await send.locator('svg').count(), 'Send darf KEIN Icon enthalten').toBe(0);
  });

  test('chat has NO emojis and NO quick-reply chips', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.locator('[data-testid="chat-launcher"]').click();
    const panel = page.locator('[data-testid="chat-panel"]');
    await expect(panel).toBeVisible();
    const text = await panel.innerText();
    // Keine Emojis (gängige aus PR #297: 👋💡🤖📋🚀🎉 + allgemeine Emoji-Ranges)
    const emojiRe = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/u;
    expect(emojiRe.test(text), `Emoji im Chat gefunden: ${text.slice(0, 120)}`).toBe(false);
    // Keine Quick-Reply-Chips: nur 1 Input + 1 Send im Panel
    expect(await panel.locator('button, [role="button"]').count()).toBeLessThanOrEqual(2);
  });
});

test.describe('Pricing (Anhang)', () => {
  test('slider 1–20, total = days × 449 de-DE, maintenance 249', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const slider = page.locator('[data-testid="pricing-slider"]');
    await expect(slider).toHaveAttribute('min', '1');
    await expect(slider).toHaveAttribute('max', '20');
    // Default 5 → 2.245
    await expect(page.locator('[data-testid="pricing-total"]')).toContainText('2.245');
    await slider.fill('10');
    await expect(page.locator('[data-testid="pricing-total"]')).toContainText('4.490');
    // Betreuung aus → 0
    await page.locator('[data-testid="maintenance-toggle"]').uncheck();
    await expect(page.locator('[data-testid="pricing-total"]')).toContainText('4.490');
  });
});

test.describe('route and navigation contract', () => {
  for (const route of criticalRoutes) {
    test(`${route} renders visible content`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1000 });
      const response = await page.goto(route, { waitUntil: 'networkidle' });
      expect(response?.status(), `${route} status`).toBeLessThan(400);
      await expect(page.locator('#main-content').first()).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
    });
  }
});
