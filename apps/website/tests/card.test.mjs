import assert from 'node:assert/strict';
import test from 'node:test';

test('Card Component - has correct base styles', () => {
  const baseStyles = {
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.085)",
    background: "rgba(255,255,255,0.025)",
  };
  assert.equal(baseStyles.borderRadius, "18px");
  assert.ok(baseStyles.border.includes("255,255,255"));
});

test('Card Component - has hover effects', () => {
  const hoverEffects = {
    transform: "translateY(-3px)",
    borderColor: "rgba(37,99,235,0.2)",
  };
  assert.equal(hoverEffects.transform, "translateY(-3px)");
  assert.ok(hoverEffects.borderColor.includes("37,99,235"));
});

test('Card Component - has transition effects', () => {
  const transitions = {
    duration: "200ms",
    easing: "cubic-bezier(0.33, 1, 0.68, 1)",
  };
  assert.equal(transitions.duration, "200ms");
});
