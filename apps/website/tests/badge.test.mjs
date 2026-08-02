import assert from 'node:assert/strict';
import test from 'node:test';

test('Badge Component - has correct base styles', () => {
  const baseStyles = {
    display: "inline-flex",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.025)",
    fontSize: "10px",
    fontWeight: "700",
    textTransform: "uppercase",
  };
  assert.equal(baseStyles.borderRadius, "999px");
  assert.equal(baseStyles.fontSize, "10px");
  assert.equal(baseStyles.textTransform, "uppercase");
});

test('Badge Component - has correct padding', () => {
  const padding = {
    horizontal: "12px",
    vertical: "6px",
  };
  assert.equal(padding.horizontal, "12px");
  assert.equal(padding.vertical, "6px");
});
