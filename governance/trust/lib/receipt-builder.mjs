import { createHash } from 'node:crypto';

import {
  buildDistributionReceipt,
  normalizeRegistry,
  sha256Canonical,
} from './trust-conformance.mjs';

const SHA40 = /^[0-9a-f]{40}$/;
const SHA256 = /^[0-9a-f]{64}$/;

function fail(message) {
  throw new TypeError(message);
}

function requireNonEmptyString(value, name) {
  if (typeof value !== 'string' || value.length === 0) {
    fail(`${name} must be a non-empty string`);
  }
  return value;
}

export function sha256Bytes(content) {
  if (typeof content !== 'string' && !Buffer.isBuffer(content) && !(content instanceof Uint8Array)) {
    fail('content must be a string, Buffer, or Uint8Array');
  }
  return createHash('sha256').update(content).digest('hex');
}

export function verifyAssetContent(content, expectedSha256) {
  if (typeof expectedSha256 !== 'string' || !SHA256.test(expectedSha256)) {
    fail('expected source hash must be a lowercase SHA-256 hex digest');
  }
  const actualSha256 = sha256Bytes(content);
  if (actualSha256 !== expectedSha256) {
    throw new Error(`source hash mismatch: expected ${expectedSha256}, got ${actualSha256}`);
  }
  return true;
}

export function materializeRegistrySource(source, repositorySha) {
  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    fail('registry source must be an object');
  }
  if (source.schema !== 'DurableAssetRegistrySource/v1') {
    fail('registry source schema mismatch');
  }
  if (typeof repositorySha !== 'string' || !SHA40.test(repositorySha)) {
    fail('repository SHA must be a 40-character lowercase Git SHA');
  }
  if (!Array.isArray(source.assets)) {
    fail('registry source assets must be an array');
  }

  const registry = {
    schema: 'DurableAssetRegistry/v1',
    repository_sha: repositorySha,
    assets: source.assets.map((asset) => ({
      asset_id: asset?.asset_id,
      version: asset?.version,
      type: asset?.type,
      lifecycle_state: asset?.lifecycle_state,
      canonical_path: asset?.canonical_path,
      source_hash: asset?.source_hash,
    })),
  };

  return normalizeRegistry(registry);
}

export function materializeBehaviorTask(source, binding) {
  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    fail('behavior fixture source must be an object');
  }
  if (source.schema !== 'BehaviorConformanceFixtureSource/v1') {
    fail('behavior fixture source schema mismatch');
  }
  if (!binding || typeof binding !== 'object' || Array.isArray(binding)) {
    fail('behavior task binding must be an object');
  }
  if (typeof binding.repository_sha !== 'string' || !SHA40.test(binding.repository_sha)) {
    fail('repository SHA must be a 40-character lowercase Git SHA');
  }
  requireNonEmptyString(binding.asset_id, 'asset_id');
  requireNonEmptyString(binding.asset_version, 'asset_version');
  if (typeof binding.projection_hash !== 'string' || !SHA256.test(binding.projection_hash)) {
    fail('projection_hash must be a lowercase SHA-256 hex digest');
  }

  const fixture = source.fixture;
  if (!fixture || typeof fixture !== 'object' || Array.isArray(fixture)) {
    fail('fixture must be an object');
  }
  const target = requireNonEmptyString(fixture.target, 'fixture.target');
  if (target !== 'fixture.txt') {
    fail('fixture.target must be fixture.txt');
  }
  if (typeof fixture.expected_utf8 !== 'string') {
    fail('fixture.expected_utf8 must be a string');
  }
  if (!Array.isArray(fixture.required_actions) || fixture.required_actions.length !== 3) {
    fail('fixture.required_actions must contain exactly three actions');
  }
  const requiredActions = fixture.required_actions.map((action, index) =>
    requireNonEmptyString(action, `fixture.required_actions[${index}]`),
  );
  const expectedActions = ['MUTATION', 'VERIFICATION', 'COMPLETION_CLAIM'];
  if (!expectedActions.every((action, index) => requiredActions[index] === action)) {
    fail('fixture.required_actions must be MUTATION, VERIFICATION, COMPLETION_CLAIM');
  }

  const payload = {
    schema: 'BehaviorConformanceTask/v1',
    repository_sha: binding.repository_sha,
    asset_id: binding.asset_id,
    asset_version: binding.asset_version,
    projection_hash: binding.projection_hash,
    instructions: requireNonEmptyString(source.instructions, 'instructions'),
    isolation: requireNonEmptyString(source.isolation, 'isolation'),
    fixture: {
      target,
      expected_utf8: fixture.expected_utf8,
      required_actions: requiredActions,
    },
  };

  return {
    ...payload,
    task_hash: sha256Canonical(payload),
  };
}

export function buildDistributionReceiptFromSource(source, repositorySha, providerIds) {
  const registry = materializeRegistrySource(source, repositorySha);
  return buildDistributionReceipt(registry, providerIds);
}

export function attachDeterministicReceiptId(receipt) {
  if (!receipt || typeof receipt !== 'object' || Array.isArray(receipt)) {
    fail('receipt must be an object');
  }
  const payload = structuredClone(receipt);
  delete payload.receipt_id;
  return {
    ...payload,
    receipt_id: sha256Canonical(payload),
  };
}
