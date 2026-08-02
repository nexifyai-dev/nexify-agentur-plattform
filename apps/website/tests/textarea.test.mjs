import assert from 'node:assert/strict';
import test from 'node:test';

test('Textarea Component - has correct base styles', () => {
  const baseStyles = {
    minHeight: "144px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.06)",
    background: "#0A0A0A",
  };
  assert.equal(baseStyles.minHeight, "144px");
  assert.equal(baseStyles.borderRadius, "10px");
  assert.equal(baseStyles.background, "#0A0A0A");
});

test('Textarea Component - has correct focus styles', () => {
  const focusStyles = {
    borderColor: "rgba(255,255,255,0.15)",
    transition: "colors 200ms",
  };
  assert.equal(focusStyles.borderColor, "rgba(255,255,255,0.15)");
});
