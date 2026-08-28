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
