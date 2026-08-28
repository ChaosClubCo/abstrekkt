import assert from 'node:assert/strict';
import test from 'node:test';

import {
  materializeRegistrySource,
  verifyAssetContent,
} from '../lib/receipt-builder.mjs';

const SOURCE_SHA = 'f'.repeat(40);
const CONTENT = 'policy bytes\n';
const CONTENT_SHA = 'b321d1344ba9d315fbc20fe2731270df82c0a1d7592bfc2127bfc449284c1d9d';

function registrySource(overrides = {}) {
  return {
    schema: 'DurableAssetRegistrySource/v1',
    assets: [{
      asset_id: 'policy.example',
      version: '1.0.0',
      type: 'POLICY',
      lifecycle_state: 'ACTIVE',
      canonical_path: 'policy.md',
      source_hash: CONTENT_SHA,
    }],
    ...overrides,
  };
}

test('materialization injects the exact runtime source SHA without self-reference', () => {
  const registry = materializeRegistrySource(registrySource(), SOURCE_SHA);
  assert.equal(registry.schema, 'DurableAssetRegistry/v1');
  assert.equal(registry.repository_sha, SOURCE_SHA);
  assert.equal(registry.assets.length, 1);
  assert.equal(registry.assets[0].source_hash, CONTENT_SHA);
});

test('asset verification accepts exact bytes', () => {
  assert.equal(verifyAssetContent(CONTENT, CONTENT_SHA), true);
});

test('asset verification fails closed on any byte mismatch', () => {
  assert.throws(() => verifyAssetContent(`${CONTENT}changed`, CONTENT_SHA), /source hash mismatch/);
});

test('materialization rejects malformed runtime revision', () => {
  assert.throws(() => materializeRegistrySource(registrySource(), 'main'), /repository SHA/);
});
