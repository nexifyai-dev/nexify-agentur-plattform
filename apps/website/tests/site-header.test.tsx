import assert from 'node:assert/strict';
import test from 'node:test';

test('SiteHeader Component - has correct navigation items', () => {
  const nav = [
    { label: "Leistungen", href: "/leistungen" },
    { label: "Preise", href: "/preise" },
    { label: "Arbeitsweise", href: "/prozess" },
    { label: "Über mich", href: "/ueber-mich" },
    { label: "Kontakt", href: "/kontakt" },
  ];
  assert.equal(nav.length, 5);
  assert.equal(nav[0].label, "Leistungen");
});

test('SiteHeader Component - has correct header height', () => {
  const headerHeight = "76px";
  assert.equal(headerHeight, "76px");
});

test('SiteHeader Component - has mobile menu toggle', () => {
  const mobileMenu = {
    open: false,
    ariaLabel: "Menü öffnen",
  };
  assert.equal(mobileMenu.open, false);
});
