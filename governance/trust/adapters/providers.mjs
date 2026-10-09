import {
  ADAPTER_VERSION,
  projectActiveRegistry,
  sha256Canonical,
} from '../lib/trust-conformance.mjs';

export const SUPPORTED_PROVIDERS = Object.freeze(['anthropic', 'openai', 'gemini']);

function assertSupportedProvider(providerId) {
  if (!SUPPORTED_PROVIDERS.includes(providerId)) {
    throw new TypeError(`unsupported provider: ${providerId}`);
  }
}

export function resolveActiveAssetsForProvider(providerId, registry) {
  assertSupportedProvider(providerId);
  const projection = projectActiveRegistry(registry);
  const projectionHash = sha256Canonical(projection);

  return {
    provider_id: providerId,
    adapter_version: ADAPTER_VERSION,
    repository_sha: projection.repository_sha,
    projection_hash: projectionHash,
    active_assets: projection.assets.map((asset) => ({
      asset_id: asset.asset_id,
      version: asset.version,
      canonical_path: asset.canonical_path,
      source_hash: asset.source_hash,
    })),
  };
}

export function resolveAllProviderProjections(registry) {
  return SUPPORTED_PROVIDERS.map((providerId) =>
    resolveActiveAssetsForProvider(providerId, registry),
  );
}
