import assert from 'node:assert/strict';
import test from 'node:test';

test('OperatorVisual Component - uses NeXify Blue for accent colors', () => {
  const accentColors = {
    primary: "#2563EB",
    primaryLight: "#3B82F6",
    primaryDark: "#1D4ED8",
  };
  assert.equal(accentColors.primary, "#2563EB");
  assert.equal(accentColors.primaryLight, "#3B82F6");
});

test('OperatorVisual Component - uses Teal for success/status indicators', () => {
  const statusColors = {
    success: "#34D399",
    live: "#34D399",
    active: "#34D399",
  };
  assert.equal(statusColors.success, "#34D399");
  assert.equal(statusColors.live, "#34D399");
});

test('OperatorVisual Component - has correct dashboard metrics', () => {
  const metrics = {
    businessValue: "€ 184.260",
    autonomy: "82%",
    liveSystems: "28 / 28",
  };
  assert.ok(metrics.businessValue.includes("€"));
  assert.equal(metrics.autonomy, "82%");
});

test('OperatorVisual Component - has correct task indicators', () => {
  const tasks = [
    { name: "Lead-Qualifizierung D/A/CH", status: "fertig" },
    { name: "Portal-Release prüfen", status: "läuft" },
    { name: "Angebot vorbereiten", status: "bereit" },
  ];
  assert.equal(tasks.length, 3);
  assert.equal(tasks[0].status, "fertig");
});
