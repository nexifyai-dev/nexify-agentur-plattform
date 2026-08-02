/**
 * FILE: apps/website/tests/e2e/critical-path.spec.ts
 * NIR: 02.08.2026 09:15
 * UPDATED: 02.08.2026 09:20
 * NAME: NeXifyAI Agent
 * TEAM: NeXifyAI Quality
 * WHAT: One critical L3 path — health API + home hero + kontakt.
 * WHY: Wire Playwright into CI without the full multi-viewport design-audit cost.
 * BEST-PRACTICE: Keep under 60s; depend on playwright.config webServer.
 * PITFALL: Public site uses unprefixed routes (middleware); do not require /de in URL.
 * DEPENDS: apps/website build; Playwright chromium
 * DOCS-REF: docs/operations/QUALITY-GATES.md
 * SESSION: quality-gates-absolute-7dd5
 */
import { expect, test } from '@playwright/test';

test.describe('critical path', () => {
  test('api health returns ok', async ({ request }) => {
    const res = await request.get('/api/health');
    expect(res.status(), 'health status').toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ status: 'ok' });
  });

  test('home renders brand hero', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('main').first()).toBeVisible();
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('kontakt page is reachable', async ({ page }) => {
    await page.goto('/kontakt', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('main, form').first()).toBeVisible();
    await expect(page.locator('footer').first()).toBeVisible();
  });
});
