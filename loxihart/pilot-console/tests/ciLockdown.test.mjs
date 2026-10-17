import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

test('CI workflows no longer probe the public Control API or accept PR-body Netlify credentials', () => {
  const ci = readFileSync(join(ROOT, '../../.github/workflows/pilot-console-ci.yml'), 'utf8');
  const probe = readFileSync(join(ROOT, '../../.github/workflows/pilot-console-live-probe.yml'), 'utf8');
  const release = readFileSync(join(ROOT, '../../.github/workflows/pilot-console-live-release.yml'), 'utf8');
  assert.equal(ci.includes('NETLIFY_PROXY_PATH'), false);
  assert.equal(ci.includes('deploy-netlify'), false);
  assert.equal(probe.includes('loxihart-pilot-console.netlify.app'), false);
  assert.equal(release.includes('loxihart-pilot-console.netlify.app'), false);
  assert.equal(probe.includes('/api/loxihart'), false);
  assert.equal(release.includes('/api/loxihart'), false);
});
