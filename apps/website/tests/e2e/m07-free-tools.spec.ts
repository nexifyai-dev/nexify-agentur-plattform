// FILE: apps/website/tests/e2e/m07-free-tools.spec.ts
// NIR: 08.08.2026 12:20
// UPDATED: 08.08.2026 12:20
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: E2E für M-07 Free-Tools — Berechnungen, CTAs, Schema, Randfälle (0-Eingaben)
// WHY: Nachweis, dass die Rechner im Browser korrekt rechnen und CTAs funktionieren
// BEST-PRACTICE: bekannte Ergebnis-Testfälle; aria-live-Regionen als Assertion-Ziele
// PITFALL: V-GTM-07: keine Fake-URLs — nur reale Routen
// DEPENDS: pnpm build (Standalone), playwright.config.ts
// DOCS-REF: docs/operations/QUALITY-GATES.md
// SESSION: t_dfa9459e — M-07 Free-Tools
import { test, expect } from "@playwright/test";

test.describe("M-07 Free-Tools", () => {
  test("KI-ROI-Rechner rechnet bekannten Fall korrekt und CTAs funktionieren", async ({ page }) => {
    await page.goto("/ki-roi-rechner");
    await expect(page.getByTestId("ki-roi-rechner-page")).toBeVisible();

    await page.getByTestId("roi-employees").fill("10");
    await page.getByTestId("roi-hours").fill("5");
    await page.getByTestId("roi-rate").fill("60");

    // 10 × 5 × 60 × 46 Wochen = 138.000 €/Jahr; 60 % → 82.800 €
    await expect(page.getByTestId("roi-savings-60")).toContainText("82.800,00");
    await expect(page.getByTestId("roi-savings-20")).toContainText("27.600,00");

    const pricingHref = await page.getByTestId("roi-cta-pricing").getAttribute("href");
    expect(pricingHref).toContain("/preise?utm_source=ki-roi-rechner");
    const auditHref = await page.getByTestId("roi-cta-audit").getAttribute("href");
    expect(auditHref).toContain("/audit?utm_source=ki-roi-rechner");

    // JSON-LD WebApplication vorhanden
    const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(jsonLd.join(" ")).toContain("WebApplication");
  });

  test("KI-ROI-Rechner: 0-Eingaben → Hinweis statt Fehler", async ({ page }) => {
    await page.goto("/ki-roi-rechner");
    await page.getByTestId("roi-employees").fill("0");
    await page.getByTestId("roi-hours").fill("0");
    await page.getByTestId("roi-rate").fill("0");
    await expect(page.getByTestId("roi-empty")).toBeVisible();
  });

  test("Chatbot-Kosten-Rechner: NeXify einfach = 1.347 €, CTA zu ki-begleiter", async ({ page }) => {
    await page.goto("/chatbot-kosten-rechner");
    await expect(page.getByTestId("chatbot-kosten-rechner-page")).toBeVisible();

    await page.getByTestId("chatbot-requests").fill("1000");
    await page.getByTestId("chatbot-complexity-einfach").click();

    await expect(page.getByTestId("chatbot-nexify")).toContainText("1.347,00");
    await expect(page.getByTestId("chatbot-nexify")).toContainText("3 Arbeitstage");

    const cta = await page.getByTestId("chatbot-cta-begleiter").getAttribute("href");
    expect(cta).toContain("/leistungen/ki-begleiter?utm_source=chatbot-kosten-rechner");
  });

  test("Chatbot-Kosten-Rechner: 0-Anfragen → Hinweis", async ({ page }) => {
    await page.goto("/chatbot-kosten-rechner");
    await page.getByTestId("chatbot-requests").fill("0");
    await expect(page.getByTestId("chatbot-empty")).toBeVisible();
  });

  test("Interner Link: /wissen und /checkliste verlinken beide Tools", async ({ page }) => {
    await page.goto("/wissen");
    await expect(page.getByTestId("knowledge-tool-roi")).toBeVisible();
    await expect(page.getByTestId("knowledge-tool-chatbot")).toBeVisible();

    await page.goto("/checkliste");
    await expect(page.getByTestId("checkliste-tool-roi")).toBeVisible();
    await expect(page.getByTestId("checkliste-tool-chatbot")).toBeVisible();
  });
});
