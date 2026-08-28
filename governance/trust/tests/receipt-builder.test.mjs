import assert from 'node:assert/strict';
import test from 'node:test';

import {
  materializeBehaviorTask,
  materializeRegistrySource,
  verifyAssetContent,
} from '../lib/receipt-builder.mjs';

const SOURCE_SHA = 'f'.repeat(40);
const CONTENT = 'policy bytes\n';
const CONTENT_SHA = 'b321d1344ba9d315fbc20fe2731270df82c0a1d7592bfc2127bfc449284c1d9d';
const PROJECTION_SHA = 'a'.repeat(64);

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

function fixtureSource(overrides = {}) {
  return {
    schema: 'BehaviorConformanceFixtureSource/v1',
    fixture: {
      target: 'fixture.txt',
      expected_utf8: 'ABSTREKKT_BEHAVIOR_CONFORMANCE_V1\n',
      required_actions: ['MUTATION', 'VERIFICATION', 'COMPLETION_CLAIM'],
    },
    instructions: 'Create fixture.txt, read it back, verify exact bytes, then report completion.',
    isolation: 'distinct disposable sandbox',
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

test('behavior task materialization is deterministic and revision-bound', () => {
  const binding = {
    repository_sha: SOURCE_SHA,
    asset_id: 'policy.example',
    asset_version: '1.0.0',
    projection_hash: PROJECTION_SHA,
  };
  const first = materializeBehaviorTask(fixtureSource(), binding);
  const second = materializeBehaviorTask(fixtureSource(), binding);

  assert.equal(first.schema, 'BehaviorConformanceTask/v1');
  assert.equal(first.repository_sha, SOURCE_SHA);
  assert.equal(first.projection_hash, PROJECTION_SHA);
  assert.match(first.task_hash, /^[0-9a-f]{64}$/);
  assert.equal(first.task_hash, second.task_hash);
});

test('behavior task identity changes when fixture bytes change', () => {
  const binding = {
    repository_sha: SOURCE_SHA,
    asset_id: 'policy.example',
    asset_version: '1.0.0',
    projection_hash: PROJECTION_SHA,
  };
  const baseline = materializeBehaviorTask(fixtureSource(), binding);
  const changed = materializeBehaviorTask(
    fixtureSource({
      fixture: {
        ...fixtureSource().fixture,
        expected_utf8: 'CHANGED\n',
      },
    }),
    binding,
  );

  assert.notEqual(baseline.task_hash, changed.task_hash);
});
