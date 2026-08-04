import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const llms = join(root, 'public/llms.txt');
const wellKnown = join(root, 'public/.well-known/llms.txt');
const indexNow = join(root, 'public/a56f374489e943c9a2b9066f5d1fca66.txt');

test('llms.txt exists with title and key links', () => {
  assert.ok(existsSync(llms));
  const body = readFileSync(llms, 'utf8');
  assert.ok(body.startsWith('# NeXify AI'));
  assert.match(body, /https:\/\/www\.nexifyai\.cloud\/leistungen/);
  assert.match(body, /https:\/\/www\.nexifyai\.cloud\/preise/);
  assert.match(body, /https:\/\/www\.nexifyai\.cloud\/kontakt/);
});

test('.well-known/llms.txt points to canonical', () => {
  assert.ok(existsSync(wellKnown));
  const body = readFileSync(wellKnown, 'utf8');
  assert.match(body, /llms\.txt/);
});

test('IndexNow key file present', () => {
  assert.ok(existsSync(indexNow));
  assert.equal(readFileSync(indexNow, 'utf8').trim(), 'a56f374489e943c9a2b9066f5d1fca66');
});
