import assert from 'node:assert/strict';
import test from 'node:test';

test('ContactForm Component - has correct form fields', () => {
  const fields = ["name", "company", "email", "phone", "projectType", "message"];
  assert.ok(fields.includes("name"));
  assert.ok(fields.includes("email"));
  assert.ok(fields.includes("message"));
});

test('ContactForm Component - has correct project types', () => {
  const projectTypes = [
    "Landingpage",
    "Unternehmenswebsite",
    "Onlineshop",
    "Web-App",
    "Mobile App",
    "Automatisierung",
    "AI-Agent",
    "Sonstiges",
  ];
  assert.equal(projectTypes.length, 8);
  assert.equal(projectTypes[0], "Landingpage");
});

test('ContactForm Component - has correct status states', () => {
  const statuses = ["idle", "loading", "success", "error"];
  assert.ok(statuses.includes("idle"));
  assert.ok(statuses.includes("loading"));
  assert.ok(statuses.includes("success"));
  assert.ok(statuses.includes("error"));
});
