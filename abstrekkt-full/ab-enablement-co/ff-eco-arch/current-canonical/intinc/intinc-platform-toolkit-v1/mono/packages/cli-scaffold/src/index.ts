#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
// @intinc/cli-scaffold — Interactive project scaffolder
// Usage:
//   intinc-scaffold                          # Interactive mode
//   intinc-scaffold --template pwa-react     # Quick mode
//   intinc-scaffold --list                   # List templates
// ─────────────────────────────────────────────────────────────

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { TEMPLATES, ADDONS, VISTADEL_PHASES, type ScaffoldOptions } from '@intinc/shared';
import { scaffoldProject } from './generator.js';

const program = new Command();

program
  .name('intinc-scaffold')
  .description('Scaffold production PWA, Electron, and Tauri apps from INT templates')
  .version('1.0.0');

// ── List Templates ───────────────────────────────────────────

program
  .command('list')
  .description('List all available templates and addons')
  .action(() => {
    console.log('');
    console.log(chalk.bold.cyan('╔══ Available Templates ══════════════════════════╗'));
    console.log('');

    const categories = ['pwa', 'electron', 'tauri', 'server'] as const;
    for (const cat of categories) {
      const items = Object.values(TEMPLATES).filter(t => t.category === cat);
      if (items.length === 0) continue;
      console.log(chalk.bold(`  ${cat.toUpperCase()}`));
      for (const t of items) {
        console.log(`    ${chalk.cyan(t.id.padEnd(22))} ${chalk.dim(t.description)}`);
        console.log(`    ${''.padEnd(22)} ${chalk.dim(`Features: ${t.features.join(', ')}`)}`);
        console.log(`    ${''.padEnd(22)} ${chalk.dim(`Setup: ~${t.estimatedSetupMinutes} min`)}`);
        console.log('');
      }
    }

    console.log(chalk.bold.magenta('╠══ Feature Add-ons ═════════════════════════════╣'));
    console.log('');
    for (const a of Object.values(ADDONS)) {
      console.log(`    ${chalk.magenta(a.id.padEnd(22))} ${chalk.dim(a.description)}`);
      console.log(`    ${''.padEnd(22)} ${chalk.dim(`Works with: ${a.compatibleTemplates.join(', ')}`)}`);
      console.log('');
    }

    console.log(chalk.bold.yellow('╠══ VISTADEL Phase Gates ════════════════════════╣'));
    console.log('');
    for (const p of VISTADEL_PHASES) {
      console.log(`    ${chalk.yellow(p.fullName.padEnd(22))} ${chalk.dim(p.description)}`);
      console.log(`    ${''.padEnd(22)} ${chalk.dim(`Gate: ${p.gateMetric} ≥ ${p.gateThreshold}`)}`);
    }
    console.log('');
    console.log(chalk.bold.cyan('╚════════════════════════════════════════════════╝'));
  });

// ── Scaffold Command (Default) ───────────────────────────────

program
  .command('create', { isDefault: true })
  .description('Create a new project from a template')
  .option('-t, --template <id>', 'Template ID (skip selection prompt)')
  .option('-n, --name <name>', 'Project name')
  .option('-o, --output <dir>', 'Output directory', '.')
  .option('--addons <ids>', 'Comma-separated addon IDs', '')
  .option('--pm <manager>', 'Package manager: pnpm | npm | yarn | bun', 'pnpm')
  .option('--no-git', 'Skip git init')
  .option('--no-install', 'Skip dependency installation')
  .option('--yes', 'Skip prompts, use defaults')
  .action(async (opts) => {
    console.log('');
    console.log(chalk.bold.cyan('  ╔══════════════════════════════════════════╗'));
    console.log(chalk.bold.cyan('  ║   INT Platform Toolkit — Scaffolder      ║'));
    console.log(chalk.bold.cyan('  ╚══════════════════════════════════════════╝'));
    console.log('');

    let options: ScaffoldOptions;

    if (opts.yes && opts.template && opts.name) {
      // Non-interactive mode
      options = {
        projectName: opts.name,
        template: opts.template,
        addons: opts.addons ? opts.addons.split(',') : [],
        packageManager: opts.pm,
        gitInit: opts.git !== false,
        installDeps: opts.install !== false,
        outputDir: opts.output,
      };
    } else {
      // Interactive mode
      options = await runInteractivePrompts(opts);
    }

    // Validate template
    if (!TEMPLATES[options.template]) {
      console.error(chalk.red(`Unknown template: ${options.template}`));
      console.error(chalk.dim(`Run 'intinc-scaffold list' to see available templates`));
      process.exit(1);
    }

    // Validate addons
    for (const addon of options.addons) {
      if (!ADDONS[addon]) {
        console.error(chalk.red(`Unknown addon: ${addon}`));
        process.exit(1);
      }
      if (!ADDONS[addon].compatibleTemplates.includes(options.template)) {
        console.error(chalk.red(`Addon '${addon}' is not compatible with template '${options.template}'`));
        process.exit(1);
      }
    }

    // Execute scaffolding
    const spinner = ora('Scaffolding project...').start();
    try {
      const result = await scaffoldProject(options);
      spinner.succeed(chalk.green(`Project created: ${result.projectDir}`));

      // Print summary
      printSummary(options, result);
    } catch (err) {
      spinner.fail(chalk.red(`Scaffold failed: ${err instanceof Error ? err.message : 'unknown'}`));
      process.exit(1);
    }
  });

program.parse();

// ── Interactive Prompts ──────────────────────────────────────

async function runInteractivePrompts(opts: Record<string, unknown>): Promise<ScaffoldOptions> {
  const templateChoices = Object.values(TEMPLATES).map(t => ({
    name: `${t.name} ${chalk.dim(`— ${t.description}`)}`,
    value: t.id,
    short: t.id,
  }));

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: 'Which template?',
      choices: [
        new inquirer.Separator(chalk.bold(' PWA')),
        ...templateChoices.filter(c => TEMPLATES[c.value].category === 'pwa'),
        new inquirer.Separator(chalk.bold(' ELECTRON')),
        ...templateChoices.filter(c => TEMPLATES[c.value].category === 'electron'),
        new inquirer.Separator(chalk.bold(' TAURI')),
        ...templateChoices.filter(c => TEMPLATES[c.value].category === 'tauri'),
        new inquirer.Separator(chalk.bold(' SERVER')),
        ...templateChoices.filter(c => TEMPLATES[c.value].category === 'server'),
      ],
      default: opts.template || undefined,
      pageSize: 12,
    },
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: opts.name || 'my-app',
      validate: (input: string) => {
        if (!input || input.trim().length === 0) return 'Name is required';
        if (/[^a-z0-9-_]/.test(input)) return 'Use lowercase letters, numbers, hyphens, underscores';
        return true;
      },
    },
    {
      type: 'checkbox',
      name: 'addons',
      message: 'Add integrations:',
      choices: (prev: Record<string, string>) => {
        const template = prev.template;
        return Object.values(ADDONS)
          .filter(a => a.compatibleTemplates.includes(template))
          .map(a => ({
            name: `${a.name} ${chalk.dim(`— ${a.description}`)}`,
            value: a.id,
            short: a.id,
          }));
      },
    },
    {
      type: 'list',
      name: 'packageManager',
      message: 'Package manager:',
      choices: [
        { name: 'pnpm (recommended)', value: 'pnpm' },
        { name: 'npm', value: 'npm' },
        { name: 'yarn', value: 'yarn' },
        { name: 'bun', value: 'bun' },
      ],
      default: 'pnpm',
    },
    {
      type: 'confirm',
      name: 'gitInit',
      message: 'Initialize git repository?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'installDeps',
      message: 'Install dependencies now?',
      default: true,
    },
  ]);

  // Addon-specific prompts
  const addonAnswers: Record<string, string> = {};
  if (answers.addons.includes('supabase')) {
    const supabase = await inquirer.prompt([
      { type: 'input', name: 'supabaseUrl', message: 'Supabase URL (or leave blank):', default: '' },
      { type: 'input', name: 'supabaseAnonKey', message: 'Supabase anon key (or leave blank):', default: '' },
    ]);
    Object.assign(addonAnswers, supabase);
  }
  if (answers.addons.includes('stripe')) {
    const stripe = await inquirer.prompt([
      { type: 'input', name: 'stripePublicKey', message: 'Stripe publishable key (or leave blank):', default: '' },
    ]);
    Object.assign(addonAnswers, stripe);
  }
  if (answers.addons.includes('sentry')) {
    const sentry = await inquirer.prompt([
      { type: 'input', name: 'sentryDsn', message: 'Sentry DSN (or leave blank):', default: '' },
    ]);
    Object.assign(addonAnswers, sentry);
  }

  return {
    ...answers,
    outputDir: (opts.output as string) || '.',
    ...addonAnswers,
  };
}

// ── Post-Scaffold Summary ────────────────────────────────────

interface ScaffoldResult {
  projectDir: string;
  filesCreated: number;
  template: string;
  addons: string[];
}

function printSummary(opts: ScaffoldOptions, result: ScaffoldResult) {
  const tmpl = TEMPLATES[opts.template];
  console.log('');
  console.log(chalk.bold.cyan('┌─ Project Summary ─────────────────────────────'));
  console.log(`│ ${chalk.bold('Name:')}      ${opts.projectName}`);
  console.log(`│ ${chalk.bold('Template:')}  ${tmpl.name}`);
  console.log(`│ ${chalk.bold('Location:')}  ${result.projectDir}`);
  console.log(`│ ${chalk.bold('Files:')}     ${result.filesCreated} created`);
  if (opts.addons.length > 0) {
    console.log(`│ ${chalk.bold('Addons:')}    ${opts.addons.map(a => ADDONS[a]?.name || a).join(', ')}`);
  }
  console.log('│');
  console.log(chalk.bold('│ Next Steps:'));
  console.log(`│   ${chalk.cyan('1.')} cd ${opts.projectName}`);
  if (!opts.installDeps) {
    console.log(`│   ${chalk.cyan('2.')} ${opts.packageManager} install`);
  }
  if (tmpl.requiredEnv.length > 0) {
    console.log(`│   ${chalk.cyan(opts.installDeps ? '2.' : '3.')} cp .env.example .env.local  ${chalk.dim('# fill in secrets')}`);
  }
  console.log(`│   ${chalk.cyan(opts.installDeps ? '3.' : '4.')} ${opts.packageManager} run dev`);
  console.log('│');

  // VISTADEL mapping
  console.log(chalk.bold('│ VISTADEL Phase Mapping:'));
  const phase = tmpl.category === 'server' ? 'D' : 'S';
  const currentPhase = VISTADEL_PHASES.find(p => p.id === phase);
  if (currentPhase) {
    console.log(`│   You're at ${chalk.yellow(currentPhase.fullName)}: ${currentPhase.description}`);
    console.log(`│   Gate: ${chalk.dim(`${currentPhase.gateMetric} ≥ ${currentPhase.gateThreshold}`)}`);
    console.log(`│   Next: Run ${chalk.cyan('intinc-audit scan --dir .')} to check readiness`);
  }
  console.log(chalk.bold.cyan('└──────────────────────────────────────────────'));
}
