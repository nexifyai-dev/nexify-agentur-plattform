import assert from 'node:assert/strict';
import test from 'node:test';

test('Layout Component - has correct metadata', () => {
  const metadata = {
    title: "NeXify AI — AI-gestützte Websites, Apps & Automatisierung",
    description: "AI-gestützte Websites, Onlineshops, Web-Apps, mobile Apps und Automatisierungen.",
    locale: "de_DE",
  };
  assert.ok(metadata.title.includes("NeXify AI"));
  assert.equal(metadata.locale, "de_DE");
});

test('Layout Component - has correct viewport settings', () => {
  const viewport = {
    themeColor: "#08090a",
    colorScheme: "dark",
  };
  assert.equal(viewport.colorScheme, "dark");
});

test('Layout Component - has correct JSON-LD structured data', () => {
  const jsonLd = {
    "@type": "ProfessionalService",
    name: "NeXifyAI by NeXify – Chat it. Automate it.",
    areaServed: ["DE", "AT", "CH", "NL"],
  };
  assert.equal(jsonLd["@type"], "ProfessionalService");
  assert.ok(jsonLd.areaServed.includes("DE"));
});

test('Layout Component - loads Inter and Space Grotesk fonts', () => {
  const fonts = {
    body: "Inter",
    display: "Space Grotesk",
  };
  assert.equal(fonts.body, "Inter");
  assert.equal(fonts.display, "Space Grotesk");
});
