#!/usr/bin/env node

import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

const ROOT = process.cwd();
const bindingPath = resolve(ROOT, 'docs/gitbook/registry/gitbook-binding.json');
const projectsPath = resolve(ROOT, 'docs/gitbook/registry/project-bindings.json');

function fail(message) {
  console.error(`GITBOOK_DRIFT_FAIL: ${message}`);
  process.exitCode = 1;
}

function assert(condition, message) {
  if (!condition) fail(message);
}

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

async function walkFiles(dir) {
  const entries = await readdir(dir);
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry);
    const info = await stat(full);
    if (info.isDirectory()) files.push(...await walkFiles(full));
    else files.push(full);
  }
  return files;
}

function parseSummary(markdown) {
  const links = [];
  const re = /^\s*-\s+\[[^\]]+\]\(([^)]+\.md)\)\s*$/gm;
  let match;
  while ((match = re.exec(markdown)) !== null) links.push(match[1]);
  return links;
}

function flattenGitBookPages(pages, parent = null, out = []) {
  for (const page of pages ?? []) {
    out.push({
      title: page.title,
      path: page.path,
      parent,
    });
    flattenGitBookPages(page.pages ?? [], page.path, out);
  }
  return out;
}

async function gitBookFetch(path, token, baseUrl) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`${path} returned HTTP ${response.status}`);
  }
  return response.json();
}

async function verifyLocal(binding, projects) {
  assert(binding.schema === 'GitBookBindingRegistry/v1', 'unexpected GitBook binding schema');
  assert(binding.repository?.full_name === 'Krosebrook/abstrekkt', 'GitBook source repository drifted');
  assert(binding.repository?.branch === 'main', 'GitBook source branch drifted');
  assert(binding.repository?.project_directory === 'docs/gitbook/public', 'GitBook project directory must remain docs/gitbook/public');
  assert(binding.gitbook?.site_id === 'site_oM8h8', 'GitBook site binding drifted');
  assert(binding.gitbook?.public_space_id === 'nnx5tT9d8Zeb2BT5q27F', 'public GitBook space binding drifted');
  assert(binding.gitbook?.internal_space_id === 'Ie4wgxSjRb4Vg3K0aZb1', 'internal GitBook space binding drifted');
  assert(binding.gitbook?.public_space_id !== binding.gitbook?.internal_space_id, 'public and internal GitBook spaces must remain separate');

  if (binding.sync?.state !== 'VERIFIED_BIDIRECTIONAL') {
    assert(binding.sync?.bidirectional_enabled === false, 'bidirectional editing cannot be enabled before VERIFIED_BIDIRECTIONAL');
  }
  if (binding.sync?.state !== 'PUBLICATION_READY') {
    assert(binding.sync?.publication_enabled === false, 'publication cannot be enabled before PUBLICATION_READY');
  }

  const publicRoot = resolve(ROOT, binding.repository.project_directory);
  const expectedSources = new Set(binding.expected_pages.map((page) => page.source));
  assert(expectedSources.has('README.md'), 'README.md must be the canonical GitBook root page');

  for (const page of binding.expected_pages) {
    const sourcePath = resolve(publicRoot, page.source);
    const source = await readFile(sourcePath, 'utf8').catch(() => null);
    assert(source !== null, `missing expected public page source: ${page.source}`);
    if (source !== null) {
      assert(source.trim().startsWith(`# ${page.title}`), `${page.source} H1 must match registry title "${page.title}"`);
      const secretPatterns = [
        /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
        /\bsk-[A-Za-z0-9_-]{20,}\b/,
        /\bgh[pousr]_[A-Za-z0-9]{20,}\b/,
        /\b(?:password|secret|token)\s*[:=]\s*[^\s`]+/i,
      ];
      for (const pattern of secretPatterns) {
        assert(!pattern.test(source), `possible credential material in public source: ${page.source}`);
      }
    }
  }

  const allPublicFiles = await walkFiles(publicRoot);
  const markdownSources = allPublicFiles
    .filter((path) => path.endsWith('.md'))
    .map((path) => relative(publicRoot, path).replaceAll('\\', '/'));
  const allowedMarkdown = new Set([...expectedSources, 'SUMMARY.md']);
  for (const source of markdownSources) {
    assert(allowedMarkdown.has(source), `unregistered Markdown page in public GitBook subtree: ${source}`);
  }

  const summary = await readFile(resolve(publicRoot, 'SUMMARY.md'), 'utf8');
  const summaryLinks = parseSummary(summary);
  const expectedSummary = binding.expected_pages.map((page) => page.source);
  assert(JSON.stringify(summaryLinks) === JSON.stringify(expectedSummary), `SUMMARY.md order differs from registry: expected ${expectedSummary.join(', ')}, got ${summaryLinks.join(', ')}`);

  assert(projects.schema === 'ProjectRepositoryRegistry/v1', 'unexpected project repository registry schema');
  const executionArchitect = projects.systems.find((item) => item.system === 'Execution Architect');
  assert(executionArchitect?.repository === 'Krosebrook/abstrekkt', 'Execution Architect canonical repository is unresolved or drifted');
  assert(executionArchitect?.path === 'governance/execution-architect/', 'Execution Architect canonical path drifted');
  assert(executionArchitect?.authority === 'CANONICAL', 'Execution Architect must remain explicitly canonical');

  const requiredChaosBindings = new Map([
    ['AgenticAI', 'ChaosClubCo/AgenticAI'],
    ['Flash-n-Frame', 'ChaosClubCo/flashnframe-app'],
    ['Infinite Heroes Bedtime Chronicles v5', 'ChaosClubCo/Infinite-Heros-Bedtime-Chronicles-v5'],
    ['DreamLinesColorscape', 'ChaosClubCo/DreamLinesColorscape'],
  ]);
  for (const [system, repository] of requiredChaosBindings) {
    const item = projects.systems.find((candidate) => candidate.system === system);
    assert(item?.repository === repository, `${system} repository binding drifted`);
  }
}

async function verifyLive(binding) {
  const token = process.env.GITBOOK_TOKEN;
  const liveRequired = process.env.GITBOOK_LIVE_REQUIRED === 'true';
  const baseUrl = (process.env.GITBOOK_API_BASE_URL ?? 'https://api.gitbook.com/v1').replace(/\/$/, '');

  if (!token) {
    if (liveRequired) fail('GITBOOK_LIVE_REQUIRED=true but GITBOOK_TOKEN is unavailable');
    console.log('GITBOOK_LIVE_SKIP: GITBOOK_TOKEN is not configured; repository-only invariants passed.');
    return;
  }

  const pagesResponse = await gitBookFetch(`/spaces/${binding.gitbook.public_space_id}/content/pages`, token, baseUrl);
  const remotePages = flattenGitBookPages(pagesResponse.pages ?? pagesResponse.items ?? []);
  const expected = binding.expected_pages.map((page) => ({
    title: page.title,
    path: page.gitbook_path,
    parent: page.parent,
  }));

  for (const page of expected) {
    const remote = remotePages.find((candidate) => candidate.path === page.path);
    assert(Boolean(remote), `GitBook is missing expected path: ${page.path}`);
    if (remote) {
      assert(remote.title === page.title, `GitBook title drift at ${page.path}: expected "${page.title}", got "${remote.title}"`);
      assert(remote.parent === page.parent, `GitBook hierarchy drift at ${page.path}`);
    }
  }

  const extra = remotePages.filter((page) => !expected.some((candidate) => candidate.path === page.path));
  assert(extra.length === 0, `GitBook has unexpected public pages: ${extra.map((page) => page.path).join(', ')}`);

  if (binding.sync.state !== 'BLOCKED_AUTHORIZATION') {
    await gitBookFetch(`/spaces/${binding.gitbook.public_space_id}/git/info`, token, baseUrl);
  }

  console.log(`GITBOOK_LIVE_PASS: verified ${expected.length} public pages.`);
}

try {
  const [binding, projects] = await Promise.all([readJson(bindingPath), readJson(projectsPath)]);
  await verifyLocal(binding, projects);
  await verifyLive(binding);
  if (!process.exitCode) console.log('GITBOOK_DRIFT_PASS');
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
