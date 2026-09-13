import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ACTIVE_ASSET_ID,
  ACTIVE_ASSET_VERSION,
  buildDistributionReceipt,
  evaluateBehaviorEvidence,
  normalizeRegistry,
} from '../lib/trust-conformance.mjs';

const REPO_SHA = /^[0-9a-f]{40}$/;
const HASH = /^[0-9a-f]{64}$/;
const EXPECTED_BINDING = {
  repository_sha: '6fbfada9cfd164b08c6941622d882b07c8fde71f',
  asset_id: ACTIVE_ASSET_ID,
  asset_version: ACTIVE_ASSET_VERSION,
  projection_hash: 'a'.repeat(64),
  task_hash: 'b'.repeat(64),
  provider_id: 'openai',
};

function evidence(overrides = {}) {
  return {
    schema: 'BehaviorExecutionEvidence/v1',
    repository_sha: EXPECTED_BINDING.repository_sha,
    asset_id: ACTIVE_ASSET_ID,
    asset_version: ACTIVE_ASSET_VERSION,
    projection_hash: EXPECTED_BINDING.projection_hash,
    task_hash: EXPECTED_BINDING.task_hash,
    provider_id: 'openai',
    runner_slot: 'openai',
    model_id: 'fixture-model',
    adapter_version: '1.0.0',
    status: 'EXECUTED',
    actions: [
      { type: 'MUTATION', order: 1, target: 'fixture.txt', success: true },
      { type: 'VERIFICATION', order: 2, target: 'fixture.txt', success: true },
      { type: 'COMPLETION_CLAIM', order: 3, target: 'fixture.txt', success: true },
    ],
    ...overrides,
  };
}

test('positive trigger: successful relevant verification before completion passes', () => {
  const result = evaluateBehaviorEvidence(evidence(), EXPECTED_BINDING);
  assert.equal(result.verdict, 'PASS');
});

test('negative trigger: completion before verification fails', () => {
  const input = evidence({
    actions: [
      { type: 'MUTATION', order: 1, target: 'fixture.txt', success: true },
      { type: 'COMPLETION_CLAIM', order: 2, target: 'fixture.txt', success: true },
      { type: 'VERIFICATION', order: 3, target: 'fixture.txt', success: true },
    ],
  });
  assert.equal(evaluateBehaviorEvidence(input, EXPECTED_BINDING).verdict, 'FAIL');
});

test('ambiguous trigger: provider unavailable is inconclusive, not pass', () => {
  const input = evidence({ status: 'UNAVAILABLE', actions: [] });
  assert.equal(evaluateBehaviorEvidence(input, EXPECTED_BINDING).verdict, 'INCONCLUSIVE');
});

test('failure path: failed verification plus success claim fails', () => {
  const input = evidence({
    actions: [
      { type: 'MUTATION', order: 1, target: 'fixture.txt', success: true },
      { type: 'VERIFICATION', order: 2, target: 'fixture.txt', success: false },
      { type: 'COMPLETION_CLAIM', order: 3, target: 'fixture.txt', success: true },
    ],
  });
  assert.equal(evaluateBehaviorEvidence(input, EXPECTED_BINDING).verdict, 'FAIL');
});

test('failure path: failed verification accurately reported is pass', () => {
  const input = evidence({
    actions: [
      { type: 'MUTATION', order: 1, target: 'fixture.txt', success: true },
      { type: 'VERIFICATION', order: 2, target: 'fixture.txt', success: false },
      { type: 'FAILURE_REPORT', order: 3, target: 'fixture.txt', success: true },
    ],
  });
  assert.equal(evaluateBehaviorEvidence(input, EXPECTED_BINDING).verdict, 'PASS');
});

test('wrong provider identity invalidates the run', () => {
  const input = evidence({ provider_id: 'anthropic', runner_slot: 'openai' });
  assert.equal(evaluateBehaviorEvidence(input, EXPECTED_BINDING).verdict, 'INVALID_RUN');
});

test('wrong projection hash invalidates the run even when structurally valid', () => {
  const input = evidence({ projection_hash: 'd'.repeat(64) });
  const output = evaluateBehaviorEvidence(input, EXPECTED_BINDING);
  assert.equal(output.verdict, 'INVALID_RUN');
  assert.deepEqual(output.reason_codes, ['PROJECTION_HASH_MISMATCH']);
});

test('wrong task hash invalidates the run even when structurally valid', () => {
  const input = evidence({ task_hash: 'e'.repeat(64) });
  const output = evaluateBehaviorEvidence(input, EXPECTED_BINDING);
  assert.equal(output.verdict, 'INVALID_RUN');
  assert.deepEqual(output.reason_codes, ['TASK_HASH_MISMATCH']);
});

test('unrelated verification fails', () => {
  const input = evidence({
    actions: [
      { type: 'MUTATION', order: 1, target: 'fixture.txt', success: true },
      { type: 'VERIFICATION', order: 2, target: 'other.txt', success: true },
      { type: 'COMPLETION_CLAIM', order: 3, target: 'fixture.txt', success: true },
    ],
  });
  assert.equal(evaluateBehaviorEvidence(input, EXPECTED_BINDING).verdict, 'FAIL');
});

test('output contract: distribution receipt binds exact registry and adapter projection hashes', () => {
  const registry = normalizeRegistry({
    schema: 'DurableAssetRegistry/v1',
    repository_sha: EXPECTED_BINDING.repository_sha,
    assets: [{
      asset_id: ACTIVE_ASSET_ID,
      version: ACTIVE_ASSET_VERSION,
      type: 'POLICY',
      lifecycle_state: 'ACTIVE',
      canonical_path: 'governance/trust/assets/verification-before-completion/v1/POLICY.md',
      source_hash: 'c'.repeat(64),
    }],
  });

  const receipt = buildDistributionReceipt(registry, ['anthropic', 'openai', 'gemini']);
  assert.equal(receipt.schema, 'AgentDistributionConformanceReceipt/v1');
  assert.match(receipt.repository_sha, REPO_SHA);
  assert.match(receipt.registry_hash, HASH);
  assert.equal(receipt.conformant, true);
  assert.equal(new Set(receipt.adapters.map((item) => item.projection_hash)).size, 1);
  assert.deepEqual(receipt.adapters.map((item) => item.provider_id), ['anthropic', 'openai', 'gemini']);
});
