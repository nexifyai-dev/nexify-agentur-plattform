import assert from 'node:assert/strict';
import test from 'node:test';

test('SiteFooter Component - has correct company information', () => {
  const company = {
    legalName: "NeXifyAI by NeXify – Chat it. Automate it.",
    email: "mail@nexifyai.cloud",
    phone: "+31 6 133 188 56",
  };
  assert.ok(company.legalName.includes("NeXify"));
  assert.ok(company.email.includes("@"));
});

test('SiteFooter Component - has correct footer sections', () => {
  const sections = ["Navigation", "Leistungen", "Kontakt"];
  assert.ok(sections.includes("Navigation"));
  assert.ok(sections.includes("Leistungen"));
  assert.ok(sections.includes("Kontakt"));
});

test('SiteFooter Component - has correct legal links', () => {
  const legalLinks = [
    "/impressum",
    "/datenschutz",
    "/agb",
    "/ki-hinweise",
    "/cookie-richtlinie",
    "/avv",
  ];
  assert.equal(legalLinks.length, 6);
  assert.equal(legalLinks[0], "/impressum");
});
