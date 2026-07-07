import assert from 'node:assert/strict';
import test from 'node:test';

test('Brand Component - has correct text', () => {
  const brand = {
    name: "NeXify AI",
    tagline: "chat it. Automate it.",
  };
  assert.equal(brand.name, "NeXify AI");
  assert.equal(brand.tagline, "chat it. Automate it.");
});

test('Brand Component - has correct link', () => {
  const link = {
    href: "/",
    ariaLabel: "NeXify AI Startseite",
  };
  assert.equal(link.href, "/");
  assert.equal(link.ariaLabel, "NeXify AI Startseite");
});
