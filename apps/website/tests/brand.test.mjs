import assert from 'node:assert/strict';
import test from 'node:test';

test('Brand Component - has correct text', () => {
  const brand = {
    name: "NeXify AI",
    tagline: "AUTOMATE IT.",
  };
  assert.equal(brand.name, "NeXify AI");
  assert.equal(brand.tagline, "AUTOMATE IT.");
});

test('Brand Component - has correct link', () => {
  const link = {
    href: "/",
    ariaLabel: "NeXify AI Startseite",
  };
  assert.equal(link.href, "/");
  assert.equal(link.ariaLabel, "NeXify AI Startseite");
});
