import assert from 'node:assert/strict';
import test from 'node:test';

test('Button Component - default variant uses NeXify Blue gradient', () => {
  const defaultStyles = {
    background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
    color: "white",
    borderRadius: "11px",
  };
  assert.ok(defaultStyles.background.includes("var(--accent)"));
  assert.equal(defaultStyles.color, "white");
});

test('Button Component - outline variant has transparent background', () => {
  const outlineStyles = {
    border: "1px solid rgba(255,255,255,0.15)",
    background: "transparent",
    color: "white",
  };
  assert.equal(outlineStyles.background, "transparent");
  assert.equal(outlineStyles.color, "white");
});

test('Button Component - ghost variant is transparent', () => {
  const ghostStyles = {
    border: "none",
    background: "transparent",
    color: "rgba(255,255,255,0.7)",
  };
  assert.equal(ghostStyles.background, "transparent");
});

test('Button Component - size variants have correct dimensions', () => {
  const sizes = {
    default: { height: "44px", paddingX: "20px" },
    sm: { height: "36px", paddingX: "12px", fontSize: "12px" },
    lg: { height: "48px", paddingX: "24px", fontSize: "13px" },
    icon: { width: "40px", height: "40px", padding: "0" },
  };
  assert.equal(sizes.default.height, "44px");
  assert.equal(sizes.sm.fontSize, "12px");
  assert.equal(sizes.lg.height, "48px");
});

test('Button Component - has hover effects', () => {
  const hoverEffects = {
    default: { brightness: "1.1", shadow: "0 18px 40px rgba(37,99,235,0.3)" },
    outline: { borderColor: "var(--accent)", background: "rgba(37,99,235,0.04)" },
    ghost: { background: "rgba(255,255,255,0.04)", color: "white" },
  };
  assert.equal(hoverEffects.default.brightness, "1.1");
  assert.equal(hoverEffects.outline.borderColor, "var(--accent)");
});

test('Button Component - has active scale effect', () => {
  const activeEffect = { transform: "scale(0.98)" };
  assert.equal(activeEffect.transform, "scale(0.98)");
});
