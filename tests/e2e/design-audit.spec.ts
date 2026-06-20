import { expect, test } from '@playwright/test';

const viewports = [320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1480, 1920] as const;
const criticalRoutes = ['/', '/leistungen', '/preise', '/prozess', '/ueber-mich', '/kontakt', '/faq', '/plattform', '/wissen', '/impressum', '/datenschutz'] as const;
const redirectChecks = [
  ['/arbeitsweise', /\/prozess$/],
  ['/ueber-pascal', /\/ueber-mich$/],
  ['/projekte', /\/referenzen$/],
  ['/leistungen/unternehmenswebsites', /\/leistungen\/websites$/],
  ['/leistungen/ai-gestuetzte-agenten', /\/leistungen\/ai-agenten$/],
] as const;

test.describe('responsive design contract', () => {
  for (const width of viewports) {
    test(`home has no horizontal overflow or clipped primary UI at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: width < 768 ? 900 : 1100 });
      await page.goto('/', { waitUntil: 'networkidle' });

      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('h1').first()).toBeVisible();
      await expect(page.locator('.operator-wrap')).toBeVisible();

      const metrics = await page.evaluate(() => {
        const selectors = ['body', 'main', '.hero-section', '.hero-copy', '.operator-wrap', '.operator-device', '.operator-live-card', '.operator-action-card', '.proof-strip'];
        const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
        const boxes = selectors.flatMap((selector) => Array.from(document.querySelectorAll<HTMLElement>(selector)).map((el) => {
          const rect = el.getBoundingClientRect();
          return {
            selector,
            left: rect.left,
            right: rect.right,
            width: rect.width,
            height: rect.height,
            visible: rect.width > 0 && rect.height > 0,
          };
        }));
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

test.describe('route and navigation contract', () => {
  for (const route of criticalRoutes) {
    test(`${route} renders visible content`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1000 });
      const response = await page.goto(route, { waitUntil: 'networkidle' });
      expect(response?.status(), `${route} status`).toBeLessThan(400);
      await expect(page.locator('main, article, .legal-document').first()).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
    });
  }

  for (const [source, destination] of redirectChecks) {
    test(`${source} redirects to canonical route`, async ({ page }) => {
      const response = await page.goto(source, { waitUntil: 'networkidle' });
      expect(response?.status(), `${source} status`).toBeLessThan(400);
      await expect(page).toHaveURL(destination);
    });
  }
});
