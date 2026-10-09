import assert from 'node:assert/strict';
import test from 'node:test';

import {
  SUPPORTED_PROVIDERS,
  resolveActiveAssetsForProvider,
  resolveAllProviderProjections,
} from '../adapters/providers.mjs';

const REGISTRY = {
  schema: 'DurableAssetRegistry/v1',
  repository_sha: 'f'.repeat(40),
  assets: [
    {
      asset_id: 'policy.active',
      version: '1.0.0',
      type: 'POLICY',
      lifecycle_state: 'ACTIVE',
      canonical_path: 'active.md',
      source_hash: 'a'.repeat(64),
    },
    {
      asset_id: 'policy.candidate',
      version: '1.0.0',
      type: 'POLICY',
      lifecycle_state: 'CANDIDATE',
      canonical_path: 'candidate.md',
      source_hash: 'b'.repeat(64),
    },
  ],
};

test('each supported provider resolves ACTIVE assets only', () => {
  for (const providerId of SUPPORTED_PROVIDERS) {
    const resolved = resolveActiveAssetsForProvider(providerId, REGISTRY);
    assert.deepEqual(resolved.active_assets.map((asset) => asset.asset_id), ['policy.active']);
  }
});

test('all supported providers resolve one identical projection hash', () => {
  const results = resolveAllProviderProjections(REGISTRY);
  assert.equal(results.length, 3);
  assert.equal(new Set(results.map((item) => item.projection_hash)).size, 1);
  assert.deepEqual(results.map((item) => item.provider_id), ['anthropic', 'openai', 'gemini']);
});

test('unknown provider fails closed', () => {
  assert.throws(
    () => resolveActiveAssetsForProvider('mystery-provider', REGISTRY),
    /unsupported provider/,
  );
});
