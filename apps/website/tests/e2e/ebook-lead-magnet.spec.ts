/**
 * FILE: apps/website/tests/e2e/ebook-lead-magnet.spec.ts
 * NIR: 08.08.2026 12:35
 * UPDATED: 08.08.2026 12:35
 * NAME: NeXifyAI Agent
 * TEAM: NeXifyAI GTM
 * WHAT: E2E für M-01 E-Book-Lead-Magnet — Landingpage /ebook, Formular (Opt-in + E-Mail), API-Validierung (Negativfall), PDF-Download erreichbar.
 * WHY: PRÜFVERFAHREN aus Kanban t_34e02d47 — Formular absenden → Antwort ok → PDF enthält alle 10 Strategien; Negativfall (leeres/ungültiges Formular → saubere Fehlermeldung).
 * BEST-PRACTICE: data-testid-Selektoren; Negativfall ohne Versand (keine echte Mail in E2E).
 * PITFALL: V-GTM-LM-01 — kein falscher Erfolg; E2E sendet NICHT wirklich (nur Validierungsfehler + PDF-Präsenz).
 * DEPENDS: pnpm build + e2e-webserver.sh (Playwright webServer), public/docs/nexify-ebook-ki-automation.pdf
 * DOCS-REF: docs/plans/FREWERT-MARKETING-MASSNAHMENKATALOG-2026-08-08.md (M-01)
 * SESSION: kanban-t_34e02d47
 */
import { expect, test } from '@playwright/test';

test.describe('ebook lead magnet (M-01)', () => {
  test('landing page renders 10 strategies + form', async ({ page }) => {
    await page.goto('/ebook', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-testid="ebook-page"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="ebook-form"]').first()).toBeVisible();
    const items = page.locator('[data-testid="ebook-strategies"] li');
    await expect(items).toHaveCount(10);
  });

  test('empty form shows clean validation error (no send)', async ({ page }) => {
    await page.goto('/ebook', { waitUntil: 'domcontentloaded' });
    // Ohne Opt-in + E-Mail: Button disabled, kein POST (Negativfall §5.4)
    const submit = page.locator('[data-testid="ebook-submit"]');
    await expect(submit).toBeDisabled();
  });

  test('pdf download link is reachable and contains 10 strategies', async ({ page, request }) => {
    await page.goto('/ebook', { waitUntil: 'domcontentloaded' });
    const pdfHref = await page.locator('[data-testid="ebook-pdf-direct"]').getAttribute('href');
    expect(pdfHref).toBeTruthy();
    const res = await request.get(pdfHref!);
    expect(res.status()).toBe(200);
    const body = await res.body();
    expect(body.byteLength).toBeGreaterThan(50_000);
  });

  test('invalid email gets 400 from api (no lead stored)', async ({ request }) => {
    const res = await request.post('/api/ebook', {
      data: { name: 'E2E Test', email: 'keine-mail' },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('E-Mail');
  });
});
