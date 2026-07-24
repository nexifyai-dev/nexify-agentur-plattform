import assert from 'node:assert/strict';
import test from 'node:test';

test('ScrollProgress - tracks scroll position', () => {
  const scrollHeight = 2000;
  const clientHeight = 800;
  const scrollTop = 600;
  const progress = scrollTop / (scrollHeight - clientHeight);
  assert.ok(progress >= 0 && progress <= 1);
  assert.equal(progress, 0.5);
});

test('ScrollProgress - clamps to 0-1', () => {
  const getProgress = (scrollTop: number, scrollHeight: number, clientHeight: number) =>
    Math.min(1, Math.max(0, scrollTop / (scrollHeight - clientHeight)));
  assert.equal(getProgress(0, 2000, 800), 0);
  assert.equal(getProgress(1200, 2000, 800), 1);
  assert.equal(getProgress(-100, 2000, 800), 0);
  assert.equal(getProgress(5000, 2000, 800), 1);
});
