// ─────────────────────────────────────────────────────────────
// Scanner — reads local dirs or GitHub repos, extracts signals
// ─────────────────────────────────────────────────────────────

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, basename, extname } from 'node:path';
import type {
  StackProfile, FileSignal, PlatformOrigin, AppAuditResult,
} from './scoring.js';
import {
  FILE_SIGNALS, DEP_SIGNALS, ORIGIN_MARKERS,
  computeScores, recommend, estimateEffort,
} from './scoring.js';

// ── Local Directory Scanner ──────────────────────────────────

export function scanDirectory(dir: string): AppAuditResult {
  const name = basename(dir);
  const files = walkDir(dir, 3); // max depth 3
  const signals = detectFileSignals(files, dir);
  const pkg = readPackageJson(dir);
  const stack = buildStackProfile(files, pkg, dir);
  const scores = computeScores(stack, signals);
  const rec = recommend(stack, scores);
  const effort = estimateEffort(stack, scores);
  const risks = computeRisks(stack, scores);

  return {
    name,
    repo: dir,
    origin: detectOrigin(pkg, files),
    detectedStack: stack,
    scores,
    recommendation: rec,
    risks,
    effort,
    timestamp: new Date().toISOString(),
  };
}

// ── File Walking ─────────────────────────────────────────────

function walkDir(dir: string, maxDepth: number, depth = 0): string[] {
  if (depth > maxDepth) return [];
  const results: string[] = [];
  const SKIP = new Set([
    'node_modules', '.git', '.next', '.nuxt', 'dist', 'build',
    '.svelte-kit', '.vercel', '.output', 'coverage', '.turbo',
  ]);

  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (SKIP.has(entry.name)) continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(full + '/');
        results.push(...walkDir(full, maxDepth, depth + 1));
      } else {
        results.push(full);
      }
    }
  } catch { /* permission denied, etc */ }
  return results;
}

// ── Signal Detection ─────────────────────────────────────────

function detectFileSignals(files: string[], root: string): FileSignal[] {
  const signals: FileSignal[] = [];
  const seen = new Set<string>();

  for (const file of files) {
    const rel = file.replace(root, '').replace(/^\//, '');
    const base = basename(file).replace(extname(file), '');

    for (const [pattern, signal] of Object.entries(FILE_SIGNALS)) {
      if (seen.has(pattern)) continue;
      if (rel.includes(pattern) || base.includes(pattern.replace(/\.[^.]+$/, ''))) {
        signals.push({ ...signal, path: rel });
        seen.add(pattern);
      }
    }
  }

  return signals;
}

// ── Package.json Parsing ─────────────────────────────────────

interface PkgJson {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  [key: string]: unknown;
}

function readPackageJson(dir: string): PkgJson | null {
  const path = join(dir, 'package.json');
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch {
    return null;
  }
}

// ── Stack Profile Builder ────────────────────────────────────

function buildStackProfile(
  files: string[], pkg: PkgJson | null, root: string
): StackProfile {
  const profile: StackProfile = {
    framework: 'unknown', language: 'javascript', bundler: 'none',
    styling: 'css', stateManagement: 'none', backend: 'none',
    auth: 'none', payments: 'none',
    hasServiceWorker: false, hasManifest: false,
    hasElectronConfig: false, hasTauriConfig: false,
    hasTests: false, hasCI: false, hasTsStrict: false,
    fileCount: files.filter(f => !f.endsWith('/')).length,
    depCount: 0, locEstimate: 0,
  };

  // Detect from package.json dependencies
  if (pkg) {
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
    profile.depCount = Object.keys(allDeps).length;

    for (const [dep, mapping] of Object.entries(DEP_SIGNALS)) {
      if (allDeps[dep]) {
        (profile as Record<string, unknown>)[mapping.field] = mapping.value;
      }
    }

    // TypeScript detection
    if (allDeps['typescript']) profile.language = 'typescript';

    // Electron config
    if (allDeps['electron'] || allDeps['electron-builder']) {
      profile.hasElectronConfig = true;
    }
  }

  // File-based detection
  for (const file of files) {
    const rel = file.replace(root, '');
    if (rel.includes('sw.') || rel.includes('service-worker.')) profile.hasServiceWorker = true;
    if (rel.includes('manifest.json') || rel.includes('manifest.webmanifest')) profile.hasManifest = true;
    if (rel.includes('tauri.conf')) profile.hasTauriConfig = true;
    if (rel.includes('electron-builder') || rel.includes('electron/main')) profile.hasElectronConfig = true;
    if (rel.includes('test') || rel.includes('spec') || rel.includes('__tests__')) profile.hasTests = true;
    if (rel.includes('.github/workflows') || rel.includes('.gitlab-ci')) profile.hasCI = true;
  }

  // tsconfig strict check
  const tsconfigPath = join(root, 'tsconfig.json');
  if (existsSync(tsconfigPath)) {
    try {
      const ts = readFileSync(tsconfigPath, 'utf-8');
      if (ts.includes('"strict": true') || ts.includes('"strict":true')) {
        profile.hasTsStrict = true;
      }
    } catch { /* */ }
  }

  // LOC estimate (rough)
  profile.locEstimate = estimateLOC(files);

  return profile;
}

function estimateLOC(files: string[]): number {
  const CODE_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.vue', '.svelte', '.css', '.scss']);
  let loc = 0;
  for (const file of files) {
    if (file.endsWith('/')) continue;
    if (!CODE_EXTS.has(extname(file))) continue;
    try {
      const content = readFileSync(file, 'utf-8');
      loc += content.split('\n').length;
    } catch {
      loc += 50; // estimate if unreadable
    }
  }
  return loc;
}

// ── Origin Detection ─────────────────────────────────────────

function detectOrigin(pkg: PkgJson | null, files: string[]): PlatformOrigin {
  if (!pkg) return 'unknown';

  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
  const allText = JSON.stringify(pkg).toLowerCase();

  for (const [marker, origin] of Object.entries(ORIGIN_MARKERS)) {
    if (allDeps[marker] || allText.includes(marker.toLowerCase())) {
      return origin;
    }
  }

  // Check for README markers
  for (const file of files) {
    if (basename(file).toLowerCase() === 'readme.md') {
      try {
        const content = readFileSync(file, 'utf-8').toLowerCase();
        for (const [marker, origin] of Object.entries(ORIGIN_MARKERS)) {
          if (content.includes(marker.toLowerCase())) return origin;
        }
      } catch { /* */ }
    }
  }

  return 'unknown';
}

// ── Risk Computation ─────────────────────────────────────────

function computeRisks(
  stack: StackProfile,
  scores: import('./scoring.js').AuditScores
): import('./scoring.js').RiskItem[] {
  const risks: import('./scoring.js').RiskItem[] = [];

  if (scores.securityPosture < 30) {
    risks.push({
      category: 'security',
      level: 'critical',
      description: 'Security posture below minimum threshold',
      mitigation: 'Add authentication, CSP headers, input validation before conversion',
    });
  }

  if (!stack.hasTests) {
    risks.push({
      category: 'testing',
      level: 'high',
      description: 'No test infrastructure detected',
      mitigation: 'Add unit tests for critical paths before migration',
    });
  }

  if (stack.language === 'javascript' && !stack.hasTsStrict) {
    risks.push({
      category: 'quality',
      level: 'medium',
      description: 'No TypeScript or strict mode — type safety missing',
      mitigation: 'Migrate to TypeScript strict mode during conversion',
    });
  }

  if (stack.depCount > 60) {
    risks.push({
      category: 'maintenance',
      level: 'medium',
      description: `High dependency count (${stack.depCount}) increases supply chain risk`,
      mitigation: 'Audit and prune dependencies, replace with lighter alternatives',
    });
  }

  if (stack.fileCount < 5) {
    risks.push({
      category: 'completeness',
      level: 'high',
      description: 'Very few files — app may be incomplete or abandoned',
      mitigation: 'Verify app is worth converting before investing effort',
    });
  }

  if (stack.locEstimate > 50000) {
    risks.push({
      category: 'complexity',
      level: 'high',
      description: `Large codebase (~${Math.round(stack.locEstimate / 1000)}K LOC) — conversion is high effort`,
      mitigation: 'Phase the conversion: core first, then features incrementally',
    });
  }

  return risks;
}

// ── GitHub Scanner (via Octokit) ─────────────────────────────

export async function scanGitHubRepo(
  owner: string, repo: string, token?: string
): Promise<AppAuditResult> {
  // Dynamic import to avoid requiring @octokit/rest for local scans
  const { Octokit } = await import('@octokit/rest');
  const octokit = new Octokit({ auth: token });

  // Get repo tree
  const { data: tree } = await octokit.git.getTree({
    owner, repo, tree_sha: 'HEAD', recursive: 'true',
  });

  const files = tree.tree
    .filter(t => t.type === 'blob' || t.type === 'tree')
    .map(t => t.path ?? '');

  // Get package.json content
  let pkg: PkgJson | null = null;
  try {
    const { data } = await octokit.repos.getContent({
      owner, repo, path: 'package.json',
    });
    if ('content' in data && data.content) {
      pkg = JSON.parse(Buffer.from(data.content, 'base64').toString());
    }
  } catch { /* no package.json */ }

  // Build signals from file paths
  const signals: FileSignal[] = [];
  const seen = new Set<string>();
  for (const file of files) {
    for (const [pattern, signal] of Object.entries(FILE_SIGNALS)) {
      if (seen.has(pattern)) continue;
      if (file.includes(pattern)) {
        signals.push({ ...signal, path: file });
        seen.add(pattern);
      }
    }
  }

  // Build approximate stack profile
  const stack = buildRemoteStackProfile(files, pkg);
  const scores = computeScores(stack, signals);
  const rec = recommend(stack, scores);
  const effort = estimateEffort(stack, scores);
  const risks = computeRisks(stack, scores);

  return {
    name: repo,
    repo: `${owner}/${repo}`,
    origin: detectOrigin(pkg, []),
    detectedStack: stack,
    scores,
    recommendation: rec,
    risks,
    effort,
    timestamp: new Date().toISOString(),
  };
}

function buildRemoteStackProfile(
  files: string[], pkg: PkgJson | null
): StackProfile {
  const profile: StackProfile = {
    framework: 'unknown', language: 'javascript', bundler: 'none',
    styling: 'css', stateManagement: 'none', backend: 'none',
    auth: 'none', payments: 'none',
    hasServiceWorker: false, hasManifest: false,
    hasElectronConfig: false, hasTauriConfig: false,
    hasTests: false, hasCI: false, hasTsStrict: false,
    fileCount: files.length,
    depCount: 0, locEstimate: files.length * 50, // rough estimate
  };

  if (pkg) {
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
    profile.depCount = Object.keys(allDeps).length;
    for (const [dep, mapping] of Object.entries(DEP_SIGNALS)) {
      if (allDeps[dep]) {
        (profile as Record<string, unknown>)[mapping.field] = mapping.value;
      }
    }
    if (allDeps['typescript']) profile.language = 'typescript';
    if (allDeps['electron'] || allDeps['electron-builder']) profile.hasElectronConfig = true;
  }

  for (const f of files) {
    if (f.includes('sw.') || f.includes('service-worker')) profile.hasServiceWorker = true;
    if (f.includes('manifest.json') || f.includes('manifest.webmanifest')) profile.hasManifest = true;
    if (f.includes('tauri.conf')) profile.hasTauriConfig = true;
    if (f.includes('electron-builder') || f.includes('electron/main')) profile.hasElectronConfig = true;
    if (f.includes('test') || f.includes('spec') || f.includes('__tests__')) profile.hasTests = true;
    if (f.includes('.github/workflows') || f.includes('.gitlab-ci')) profile.hasCI = true;
    if (f.endsWith('.ts') || f.endsWith('.tsx')) profile.language = 'typescript';
  }

  return profile;
}

// ── Batch Scanner ────────────────────────────────────────────

export async function scanBatch(
  repos: Array<{ owner: string; repo: string }>,
  token?: string,
  onProgress?: (i: number, total: number, name: string) => void
): Promise<AppAuditResult[]> {
  const results: AppAuditResult[] = [];
  for (let i = 0; i < repos.length; i++) {
    const { owner, repo } = repos[i];
    onProgress?.(i + 1, repos.length, `${owner}/${repo}`);
    try {
      const result = await scanGitHubRepo(owner, repo, token);
      results.push(result);
    } catch (err) {
      results.push({
        name: repo,
        repo: `${owner}/${repo}`,
        origin: 'unknown',
        detectedStack: {
          framework: 'unknown', language: 'unknown', bundler: 'none',
          styling: 'unknown', stateManagement: 'none', backend: 'none',
          auth: 'none', payments: 'none',
          hasServiceWorker: false, hasManifest: false,
          hasElectronConfig: false, hasTauriConfig: false,
          hasTests: false, hasCI: false, hasTsStrict: false,
          fileCount: 0, depCount: 0, locEstimate: 0,
        },
        scores: {
          pwaReadiness: 0, electronReadiness: 0, tauriReadiness: 0,
          codeQuality: 0, securityPosture: 0, testCoverage: 0,
          productionReadiness: 0, overall: 0,
        },
        recommendation: {
          primary: 'discontinue',
          secondary: null,
          reasoning: [`Scan failed: ${err instanceof Error ? err.message : 'unknown error'}`],
          blockers: ['Unable to scan repository'],
        },
        risks: [{ category: 'access', level: 'critical',
          description: 'Could not access repository',
          mitigation: 'Check permissions and repo visibility' }],
        effort: { pwaHours: 0, electronHours: 0, tauriHours: 0, tier: 'rebuild' },
        timestamp: new Date().toISOString(),
      });
    }
    // Rate limit respect
    if (i < repos.length - 1) {
      await new Promise(r => setTimeout(r, 500));
    }
  }
  return results;
}
