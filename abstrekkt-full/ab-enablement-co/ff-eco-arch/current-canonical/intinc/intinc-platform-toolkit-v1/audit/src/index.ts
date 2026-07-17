#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
// @intinc/app-audit-cli — Main Entry Point
// Usage:
//   app-audit scan --dir ./my-app
//   app-audit scan --repo owner/repo --token ghp_xxx
//   app-audit batch --org myorg --token ghp_xxx
//   app-audit export --input results.json --format csv
//   app-audit report --input results.json
// ─────────────────────────────────────────────────────────────

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { table } from 'table';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { scanDirectory, scanGitHubRepo, scanBatch } from './scanner.js';
import type { AppAuditResult, AuditScores, ConversionTarget } from './scoring.js';

const program = new Command();

program
  .name('app-audit')
  .description('Scan and score vibecoded apps for PWA/Electron/Tauri conversion')
  .version('1.0.0');

// ── Scan Command ─────────────────────────────────────────────

program
  .command('scan')
  .description('Scan a single app (local directory or GitHub repo)')
  .option('-d, --dir <path>', 'Local directory to scan')
  .option('-r, --repo <owner/repo>', 'GitHub repository (owner/repo)')
  .option('-t, --token <token>', 'GitHub personal access token', process.env.GITHUB_TOKEN)
  .option('-o, --output <file>', 'Save results to JSON file')
  .action(async (opts) => {
    if (!opts.dir && !opts.repo) {
      console.error(chalk.red('Provide --dir or --repo'));
      process.exit(1);
    }

    const spinner = ora('Scanning...').start();
    let result: AppAuditResult;

    try {
      if (opts.dir) {
        result = scanDirectory(opts.dir);
      } else {
        const [owner, repo] = opts.repo.split('/');
        result = await scanGitHubRepo(owner, repo, opts.token);
      }
      spinner.succeed(`Scanned ${result.name}`);
    } catch (err) {
      spinner.fail(`Scan failed: ${err instanceof Error ? err.message : 'unknown'}`);
      process.exit(1);
    }

    printResult(result);

    if (opts.output) {
      writeFileSync(opts.output, JSON.stringify(result, null, 2));
      console.log(chalk.dim(`\nResults saved to ${opts.output}`));
    }
  });

// ── Batch Command ────────────────────────────────────────────

program
  .command('batch')
  .description('Scan multiple repos from a GitHub org or input file')
  .option('--org <org>', 'GitHub organization to scan all repos')
  .option('--input <file>', 'JSON file with repo list [{owner, repo}]')
  .option('-t, --token <token>', 'GitHub personal access token', process.env.GITHUB_TOKEN)
  .option('-o, --output <file>', 'Save results to JSON file', 'audit-results.json')
  .option('--limit <n>', 'Max repos to scan', '100')
  .action(async (opts) => {
    let repos: Array<{ owner: string; repo: string }> = [];

    if (opts.input) {
      repos = JSON.parse(readFileSync(opts.input, 'utf-8'));
    } else if (opts.org) {
      const spinner = ora(`Fetching repos from ${opts.org}...`).start();
      const { Octokit } = await import('@octokit/rest');
      const octokit = new Octokit({ auth: opts.token });
      const { data } = await octokit.repos.listForOrg({
        org: opts.org, per_page: parseInt(opts.limit), sort: 'updated',
      });
      repos = data.map(r => ({ owner: opts.org, repo: r.name }));
      spinner.succeed(`Found ${repos.length} repos`);
    } else {
      console.error(chalk.red('Provide --org or --input'));
      process.exit(1);
    }

    const spinner = ora('').start();
    const results = await scanBatch(repos, opts.token, (i, total, name) => {
      spinner.text = `Scanning ${i}/${total}: ${name}`;
    });
    spinner.succeed(`Scanned ${results.length} repos`);

    // Summary table
    printBatchSummary(results);

    writeFileSync(opts.output, JSON.stringify(results, null, 2));
    console.log(chalk.dim(`\nFull results saved to ${opts.output}`));
  });

// ── Export Command ───────────────────────────────────────────

program
  .command('export')
  .description('Export audit results to CSV or JSON')
  .requiredOption('-i, --input <file>', 'Input JSON results file')
  .option('-f, --format <fmt>', 'Output format: csv | json', 'csv')
  .option('-o, --output <file>', 'Output file path')
  .action((opts) => {
    const results: AppAuditResult[] = JSON.parse(readFileSync(opts.input, 'utf-8'));
    const isBatch = Array.isArray(results);
    const items = isBatch ? results : [results];

    if (opts.format === 'csv') {
      const csv = toCSV(items);
      const outFile = opts.output || opts.input.replace('.json', '.csv');
      writeFileSync(outFile, csv);
      console.log(chalk.green(`Exported ${items.length} results to ${outFile}`));
    } else {
      const outFile = opts.output || 'audit-export.json';
      writeFileSync(outFile, JSON.stringify(items, null, 2));
      console.log(chalk.green(`Exported ${items.length} results to ${outFile}`));
    }
  });

// ── Report Command ───────────────────────────────────────────

program
  .command('report')
  .description('Generate a markdown report from audit results')
  .requiredOption('-i, --input <file>', 'Input JSON results file')
  .option('-o, --output <file>', 'Output markdown file', 'audit-report.md')
  .action((opts) => {
    const data = JSON.parse(readFileSync(opts.input, 'utf-8'));
    const items: AppAuditResult[] = Array.isArray(data) ? data : [data];
    const md = generateReport(items);
    writeFileSync(opts.output, md);
    console.log(chalk.green(`Report generated: ${opts.output}`));
  });

program.parse();

// ── Display Helpers ──────────────────────────────────────────

function printResult(r: AppAuditResult) {
  console.log('');
  console.log(chalk.bold.cyan(`┌─ ${r.name} ─────────────────────────────────`));
  console.log(chalk.dim(`│ Repo: ${r.repo}`));
  console.log(chalk.dim(`│ Origin: ${r.origin}`));
  console.log(chalk.dim(`│ Stack: ${r.detectedStack.framework} / ${r.detectedStack.language} / ${r.detectedStack.bundler}`));
  console.log(chalk.dim(`│ Files: ${r.detectedStack.fileCount} | Deps: ${r.detectedStack.depCount} | ~${r.detectedStack.locEstimate} LOC`));
  console.log('│');

  // Scores
  console.log(chalk.bold('│ Scores:'));
  printBar('│   PWA Readiness', r.scores.pwaReadiness);
  printBar('│   Electron Ready', r.scores.electronReadiness);
  printBar('│   Tauri Ready', r.scores.tauriReadiness);
  printBar('│   Code Quality', r.scores.codeQuality);
  printBar('│   Security', r.scores.securityPosture);
  printBar('│   Test Coverage', r.scores.testCoverage);
  printBar('│   Production', r.scores.productionReadiness);
  console.log('│');
  printBar('│   ★ OVERALL', r.scores.overall, true);
  console.log('│');

  // Recommendation
  const targetColors: Record<ConversionTarget, (s: string) => string> = {
    pwa: chalk.blue, electron: chalk.magenta, tauri: chalk.yellow,
    'keep-web': chalk.green, discontinue: chalk.red,
  };
  const tc = targetColors[r.recommendation.primary] || chalk.white;
  console.log(chalk.bold(`│ Recommendation: ${tc(r.recommendation.primary.toUpperCase())}`));
  if (r.recommendation.secondary) {
    console.log(chalk.dim(`│   Alt: ${r.recommendation.secondary}`));
  }
  for (const reason of r.recommendation.reasoning) {
    console.log(chalk.dim(`│   ✓ ${reason}`));
  }
  for (const blocker of r.recommendation.blockers) {
    console.log(chalk.red(`│   ✗ ${blocker}`));
  }
  console.log('│');

  // Effort
  console.log(chalk.bold(`│ Effort: ${chalk.yellow(r.effort.tier.toUpperCase())}`));
  console.log(chalk.dim(`│   PWA: ~${r.effort.pwaHours}h | Electron: ~${r.effort.electronHours}h | Tauri: ~${r.effort.tauriHours}h`));
  console.log('│');

  // Risks
  if (r.risks.length > 0) {
    console.log(chalk.bold('│ Risks:'));
    for (const risk of r.risks) {
      const rl = risk.level === 'critical' ? chalk.red : risk.level === 'high' ? chalk.yellow : chalk.dim;
      console.log(`│   ${rl(`[${risk.level.toUpperCase()}]`)} ${risk.description}`);
      console.log(chalk.dim(`│     → ${risk.mitigation}`));
    }
  }

  console.log(chalk.bold.cyan(`└──────────────────────────────────────────────`));
}

function printBar(label: string, score: number, highlight = false) {
  const width = 20;
  const filled = Math.round((score / 100) * width);
  const bar = '█'.repeat(filled) + '░'.repeat(width - filled);
  const color = score >= 70 ? chalk.green : score >= 40 ? chalk.yellow : chalk.red;
  const text = highlight ? chalk.bold(color(`${bar} ${score}/100`)) : color(`${bar} ${score}/100`);
  console.log(`${label.padEnd(22)} ${text}`);
}

function printBatchSummary(results: AppAuditResult[]) {
  console.log('');
  console.log(chalk.bold.cyan('═══ Batch Summary ═══'));

  // Recommendation distribution
  const counts: Record<string, number> = {};
  for (const r of results) {
    counts[r.recommendation.primary] = (counts[r.recommendation.primary] || 0) + 1;
  }
  console.log(chalk.bold('\nRecommendation Distribution:'));
  for (const [target, count] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${target.padEnd(15)} ${chalk.cyan(String(count).padStart(3))} apps`);
  }

  // Top 10 by overall score
  const sorted = [...results].sort((a, b) => b.scores.overall - a.scores.overall);
  const topData = sorted.slice(0, 15).map(r => [
    r.name.slice(0, 25),
    r.origin,
    `${r.scores.overall}`,
    r.recommendation.primary,
    r.effort.tier,
    `${r.effort.pwaHours}h / ${r.effort.electronHours}h`,
  ]);

  console.log(chalk.bold('\nTop 15 by Overall Score:'));
  console.log(table([
    ['App', 'Origin', 'Score', 'Target', 'Effort', 'PWA/Electron Hours'],
    ...topData,
  ]));

  // Aggregate stats
  const avgOverall = Math.round(results.reduce((s, r) => s + r.scores.overall, 0) / results.length);
  const avgPWA = Math.round(results.reduce((s, r) => s + r.scores.pwaReadiness, 0) / results.length);
  const avgElectron = Math.round(results.reduce((s, r) => s + r.scores.electronReadiness, 0) / results.length);
  const totalPWAHours = results.reduce((s, r) => s + r.effort.pwaHours, 0);
  const totalElectronHours = results.reduce((s, r) => s + r.effort.electronHours, 0);

  console.log(chalk.bold('Aggregate:'));
  console.log(`  Avg Overall Score:    ${avgOverall}/100`);
  console.log(`  Avg PWA Readiness:    ${avgPWA}/100`);
  console.log(`  Avg Electron Ready:   ${avgElectron}/100`);
  console.log(`  Total PWA Effort:     ~${totalPWAHours} hours`);
  console.log(`  Total Electron Effort: ~${totalElectronHours} hours`);
}

// ── CSV Export ───────────────────────────────────────────────

function toCSV(items: AppAuditResult[]): string {
  const headers = [
    'Name', 'Repo', 'Origin', 'Framework', 'Language', 'Bundler',
    'Files', 'Deps', 'LOC',
    'PWA Score', 'Electron Score', 'Tauri Score',
    'Quality', 'Security', 'Testing', 'Production', 'Overall',
    'Recommendation', 'Alt Recommendation', 'Effort Tier',
    'PWA Hours', 'Electron Hours', 'Tauri Hours',
    'Has SW', 'Has Manifest', 'Has Tests', 'Has CI', 'TS Strict',
    'Risk Count', 'Top Risk', 'Blockers',
  ];

  const rows = items.map(r => [
    r.name, r.repo, r.origin,
    r.detectedStack.framework, r.detectedStack.language, r.detectedStack.bundler,
    r.detectedStack.fileCount, r.detectedStack.depCount, r.detectedStack.locEstimate,
    r.scores.pwaReadiness, r.scores.electronReadiness, r.scores.tauriReadiness,
    r.scores.codeQuality, r.scores.securityPosture, r.scores.testCoverage,
    r.scores.productionReadiness, r.scores.overall,
    r.recommendation.primary, r.recommendation.secondary || '',
    r.effort.tier, r.effort.pwaHours, r.effort.electronHours, r.effort.tauriHours,
    r.detectedStack.hasServiceWorker, r.detectedStack.hasManifest,
    r.detectedStack.hasTests, r.detectedStack.hasCI, r.detectedStack.hasTsStrict,
    r.risks.length,
    r.risks[0]?.description || '',
    r.recommendation.blockers.join('; '),
  ]);

  return [headers.join(','), ...rows.map(r =>
    r.map(v => typeof v === 'string' && v.includes(',') ? `"${v}"` : String(v)).join(',')
  )].join('\n');
}

// ── Markdown Report ──────────────────────────────────────────

function generateReport(items: AppAuditResult[]): string {
  const sorted = [...items].sort((a, b) => b.scores.overall - a.scores.overall);
  const counts: Record<string, number> = {};
  for (const r of sorted) counts[r.recommendation.primary] = (counts[r.recommendation.primary] || 0) + 1;

  const avgOverall = Math.round(sorted.reduce((s, r) => s + r.scores.overall, 0) / sorted.length);

  let md = `# App Audit Report\n\n`;
  md += `**Generated:** ${new Date().toISOString()}\n`;
  md += `**Apps Scanned:** ${sorted.length}\n`;
  md += `**Average Overall Score:** ${avgOverall}/100\n\n`;

  md += `## Recommendation Summary\n\n`;
  md += `| Target | Count | % |\n|---|---|---|\n`;
  for (const [target, count] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
    md += `| ${target} | ${count} | ${Math.round(count / sorted.length * 100)}% |\n`;
  }

  md += `\n## Effort Summary\n\n`;
  const tierCounts: Record<string, number> = {};
  for (const r of sorted) tierCounts[r.effort.tier] = (tierCounts[r.effort.tier] || 0) + 1;
  md += `| Effort Tier | Count |\n|---|---|\n`;
  for (const [tier, count] of Object.entries(tierCounts).sort((a, b) => b[1] - a[1])) {
    md += `| ${tier} | ${count} |\n`;
  }

  md += `\n## All Apps (sorted by overall score)\n\n`;
  md += `| App | Origin | Overall | PWA | Electron | Tauri | Target | Effort | Hours |\n`;
  md += `|---|---|---|---|---|---|---|---|---|\n`;
  for (const r of sorted) {
    md += `| ${r.name} | ${r.origin} | ${r.scores.overall} | ${r.scores.pwaReadiness} | ${r.scores.electronReadiness} | ${r.scores.tauriReadiness} | **${r.recommendation.primary}** | ${r.effort.tier} | ${r.effort.pwaHours}/${r.effort.electronHours}h |\n`;
  }

  md += `\n## Detailed Results\n\n`;
  for (const r of sorted.slice(0, 20)) { // Top 20 detail
    md += `### ${r.name}\n\n`;
    md += `- **Repo:** ${r.repo}\n`;
    md += `- **Origin:** ${r.origin}\n`;
    md += `- **Stack:** ${r.detectedStack.framework} / ${r.detectedStack.language} / ${r.detectedStack.bundler}\n`;
    md += `- **Overall:** ${r.scores.overall}/100\n`;
    md += `- **Recommendation:** ${r.recommendation.primary}\n`;
    if (r.recommendation.reasoning.length) {
      md += `- **Reasoning:** ${r.recommendation.reasoning.join(', ')}\n`;
    }
    if (r.recommendation.blockers.length) {
      md += `- **Blockers:** ${r.recommendation.blockers.join(', ')}\n`;
    }
    if (r.risks.length) {
      md += `- **Risks:** ${r.risks.map(ri => `[${ri.level}] ${ri.description}`).join(', ')}\n`;
    }
    md += '\n';
  }

  return md;
}
