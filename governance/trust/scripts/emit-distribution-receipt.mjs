import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';

import { canonicalJson } from '../lib/trust-conformance.mjs';
import {
  buildDistributionReceiptFromSource,
  verifyAssetContent,
} from '../lib/receipt-builder.mjs';

const PROVIDERS = ['anthropic', 'openai', 'gemini'];
const REGISTRY_PATH = 'governance/trust/registry/active-assets.json';

function parseArgs(argv) {
  const args = new Map();
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key?.startsWith('--') || value === undefined) {
      throw new TypeError('arguments must be --key value pairs');
    }
    args.set(key.slice(2), value);
  }
  return args;
}

function safeRepositoryPath(root, candidate) {
  if (typeof candidate !== 'string' || candidate.length === 0 || isAbsolute(candidate)) {
    throw new Error(`unsafe canonical path: ${candidate}`);
  }
  const resolvedRoot = resolve(root);
  const resolvedPath = resolve(resolvedRoot, candidate);
  const rel = relative(resolvedRoot, resolvedPath);
  if (rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)) {
    throw new Error(`unsafe canonical path: ${candidate}`);
  }
  return resolvedPath;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const repositorySha = args.get('repository-sha');
  const outputPath = args.get('out');
  if (!repositorySha || !outputPath) {
    throw new TypeError('required arguments: --repository-sha <sha> --out <path>');
  }

  const repositoryRoot = process.cwd();
  const registryFile = safeRepositoryPath(repositoryRoot, REGISTRY_PATH);
  const registrySource = JSON.parse(await readFile(registryFile, 'utf8'));

  for (const asset of registrySource.assets ?? []) {
    const assetPath = safeRepositoryPath(repositoryRoot, asset.canonical_path);
    const content = await readFile(assetPath);
    verifyAssetContent(content, asset.source_hash);
  }

  const receipt = buildDistributionReceiptFromSource(
    registrySource,
    repositorySha,
    PROVIDERS,
  );

  if (!receipt.conformant) {
    throw new Error('distribution conformance failed');
  }

  const resolvedOutput = safeRepositoryPath(repositoryRoot, outputPath);
  await mkdir(dirname(resolvedOutput), { recursive: true });
  await writeFile(resolvedOutput, `${JSON.stringify(receipt, null, 2)}\n`, {
    encoding: 'utf8',
    mode: 0o600,
  });

  process.stdout.write(`${canonicalJson({
    schema: receipt.schema,
    repository_sha: receipt.repository_sha,
    registry_hash: receipt.registry_hash,
    receipt_id: receipt.receipt_id,
    conformant: receipt.conformant,
  })}\n`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`distribution receipt generation failed: ${message}\n`);
  process.exitCode = 1;
});
