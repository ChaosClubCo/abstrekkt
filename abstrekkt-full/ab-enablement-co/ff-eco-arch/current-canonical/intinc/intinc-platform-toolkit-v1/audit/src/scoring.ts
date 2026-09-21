// ─────────────────────────────────────────────────────────────
// @intinc/app-audit-cli — Types & Scoring Engine
// Scans repos/directories, scores PWA/Electron/Tauri readiness
// ─────────────────────────────────────────────────────────────

import { z } from 'zod';

// ── Schemas ──────────────────────────────────────────────────

export const PlatformOriginSchema = z.enum([
  'base44', 'lovable', 'bolt', 'v0', 'replit',
  'cursor', 'windsurf', 'manual', 'unknown'
]);

export const ConversionTargetSchema = z.enum([
  'pwa', 'electron', 'tauri', 'keep-web', 'discontinue'
]);

export const RiskLevelSchema = z.enum(['low', 'medium', 'high', 'critical']);

export type PlatformOrigin = z.infer<typeof PlatformOriginSchema>;
export type ConversionTarget = z.infer<typeof ConversionTargetSchema>;
export type RiskLevel = z.infer<typeof RiskLevelSchema>;

// ── App Audit Result ─────────────────────────────────────────

export interface AppAuditResult {
  name: string;
  repo: string;
  origin: PlatformOrigin;
  detectedStack: StackProfile;
  scores: AuditScores;
  recommendation: ConversionRecommendation;
  risks: RiskItem[];
  effort: EffortEstimate;
  timestamp: string;
}

export interface StackProfile {
  framework: string;           // react, vue, svelte, vanilla, next, nuxt
  language: string;            // typescript, javascript
  bundler: string;             // vite, webpack, esbuild, turbopack, none
  styling: string;             // tailwind, css-modules, styled-components, sass
  stateManagement: string;     // zustand, redux, jotai, context, none
  backend: string;             // supabase, firebase, express, none
  auth: string;                // supabase-auth, clerk, auth0, custom, none
  payments: string;            // stripe, none
  hasServiceWorker: boolean;
  hasManifest: boolean;
  hasElectronConfig: boolean;
  hasTauriConfig: boolean;
  hasTests: boolean;
  hasCI: boolean;
  hasTsStrict: boolean;
  fileCount: number;
  depCount: number;
  locEstimate: number;
}

export interface AuditScores {
  pwaReadiness: number;        // 0-100
  electronReadiness: number;   // 0-100
  tauriReadiness: number;      // 0-100
  codeQuality: number;         // 0-100
  securityPosture: number;     // 0-100
  testCoverage: number;        // 0-100
  productionReadiness: number; // 0-100
  overall: number;             // 0-100 weighted composite
}

export interface ConversionRecommendation {
  primary: ConversionTarget;
  secondary: ConversionTarget | null;
  reasoning: string[];
  blockers: string[];
}

export interface RiskItem {
  category: string;
  level: RiskLevel;
  description: string;
  mitigation: string;
}

export interface EffortEstimate {
  pwaHours: number;
  electronHours: number;
  tauriHours: number;
  tier: 'trivial' | 'light' | 'moderate' | 'heavy' | 'rebuild';
}

// ── File Scanner ─────────────────────────────────────────────

export interface FileSignal {
  path: string;
  weight: number;
  category: 'pwa' | 'electron' | 'tauri' | 'quality' | 'security' | 'testing';
  detail: string;
}

// Signal patterns: file existence → score contribution
export const FILE_SIGNALS: Record<string, Omit<FileSignal, 'path'>> = {
  // PWA signals
  'manifest.json':          { weight: 15, category: 'pwa', detail: 'Web app manifest found' },
  'manifest.webmanifest':   { weight: 15, category: 'pwa', detail: 'Web app manifest found' },
  'sw.js':                  { weight: 20, category: 'pwa', detail: 'Service worker found' },
  'sw.ts':                  { weight: 20, category: 'pwa', detail: 'Service worker (TS)' },
  'service-worker.js':      { weight: 20, category: 'pwa', detail: 'Service worker found' },
  'service-worker.ts':      { weight: 20, category: 'pwa', detail: 'Service worker (TS)' },
  'workbox-config.js':      { weight: 10, category: 'pwa', detail: 'Workbox config found' },
  'vite-plugin-pwa':        { weight: 10, category: 'pwa', detail: 'Vite PWA plugin detected' },

  // Electron signals
  'electron.js':            { weight: 20, category: 'electron', detail: 'Electron main process' },
  'electron/main.ts':       { weight: 20, category: 'electron', detail: 'Electron main (TS)' },
  'electron-builder.yml':   { weight: 15, category: 'electron', detail: 'Electron builder config' },
  'preload.js':             { weight: 10, category: 'electron', detail: 'Preload script found' },
  'preload.ts':             { weight: 10, category: 'electron', detail: 'Preload script (TS)' },

  // Tauri signals
  'tauri.conf.json':        { weight: 25, category: 'tauri', detail: 'Tauri config found' },
  'src-tauri/':             { weight: 20, category: 'tauri', detail: 'Tauri source directory' },

  // Quality signals
  'tsconfig.json':          { weight: 8, category: 'quality', detail: 'TypeScript configured' },
  '.eslintrc':              { weight: 5, category: 'quality', detail: 'ESLint configured' },
  'eslint.config':          { weight: 5, category: 'quality', detail: 'ESLint flat config' },
  '.prettierrc':            { weight: 3, category: 'quality', detail: 'Prettier configured' },
  'biome.json':             { weight: 5, category: 'quality', detail: 'Biome configured' },

  // Security signals
  '.env.example':           { weight: 5, category: 'security', detail: 'Env template exists' },
  'helmet':                 { weight: 5, category: 'security', detail: 'Helmet dependency' },
  'csp':                    { weight: 5, category: 'security', detail: 'CSP configuration' },

  // Testing signals
  'vitest.config':          { weight: 10, category: 'testing', detail: 'Vitest configured' },
  'jest.config':            { weight: 10, category: 'testing', detail: 'Jest configured' },
  'playwright.config':      { weight: 10, category: 'testing', detail: 'Playwright E2E' },
  'cypress.config':         { weight: 8, category: 'testing', detail: 'Cypress E2E' },
  '__tests__/':             { weight: 5, category: 'testing', detail: 'Test directory found' },
  'test/':                  { weight: 5, category: 'testing', detail: 'Test directory found' },
  'spec/':                  { weight: 5, category: 'testing', detail: 'Test directory found' },
};

// Package.json dependency → stack detection
export const DEP_SIGNALS: Record<string, { field: keyof StackProfile; value: string }> = {
  'react':                  { field: 'framework', value: 'react' },
  'react-dom':              { field: 'framework', value: 'react' },
  'next':                   { field: 'framework', value: 'next' },
  'vue':                    { field: 'framework', value: 'vue' },
  'nuxt':                   { field: 'framework', value: 'nuxt' },
  'svelte':                 { field: 'framework', value: 'svelte' },
  '@sveltejs/kit':          { field: 'framework', value: 'sveltekit' },
  'vite':                   { field: 'bundler', value: 'vite' },
  'webpack':                { field: 'bundler', value: 'webpack' },
  'esbuild':                { field: 'bundler', value: 'esbuild' },
  'tailwindcss':            { field: 'styling', value: 'tailwind' },
  'styled-components':      { field: 'styling', value: 'styled-components' },
  'sass':                   { field: 'styling', value: 'sass' },
  'zustand':                { field: 'stateManagement', value: 'zustand' },
  'redux':                  { field: 'stateManagement', value: 'redux' },
  '@reduxjs/toolkit':       { field: 'stateManagement', value: 'redux-toolkit' },
  'jotai':                  { field: 'stateManagement', value: 'jotai' },
  '@supabase/supabase-js':  { field: 'backend', value: 'supabase' },
  'firebase':               { field: 'backend', value: 'firebase' },
  'express':                { field: 'backend', value: 'express' },
  '@supabase/auth-helpers-nextjs': { field: 'auth', value: 'supabase-auth' },
  '@clerk/nextjs':          { field: 'auth', value: 'clerk' },
  'auth0':                  { field: 'auth', value: 'auth0' },
  'stripe':                 { field: 'payments', value: 'stripe' },
  '@stripe/stripe-js':      { field: 'payments', value: 'stripe' },
  'electron':               { field: 'framework', value: 'electron' },
};

// Origin detection from package.json or file markers
export const ORIGIN_MARKERS: Record<string, PlatformOrigin> = {
  'base44':       'base44',
  '@base44':      'base44',
  'lovable':      'lovable',
  '@lovable':     'lovable',
  'bolt':         'bolt',
  'bolt.new':     'bolt',
  '@v0':          'v0',
  'v0.dev':       'v0',
  'replit':       'replit',
  '@replit':      'replit',
};

// ── Scoring Engine ───────────────────────────────────────────

export function computeScores(
  stack: StackProfile,
  signals: FileSignal[]
): AuditScores {
  const signalScore = (cat: string) =>
    Math.min(100, signals.filter(s => s.category === cat).reduce((s, f) => s + f.weight, 0));

  // PWA readiness: SW + manifest + offline capability + HTTPS-friendly stack
  let pwa = 0;
  if (stack.hasServiceWorker) pwa += 30;
  if (stack.hasManifest) pwa += 20;
  pwa += signalScore('pwa') * 0.3;
  if (['react', 'next', 'vue', 'nuxt', 'svelte', 'sveltekit'].includes(stack.framework)) pwa += 10;
  if (stack.bundler === 'vite') pwa += 5;
  if (stack.backend === 'supabase') pwa += 5; // good offline patterns
  pwa = Math.min(100, Math.round(pwa));

  // Electron readiness: existing electron config + node-compatible stack
  let electron = 0;
  if (stack.hasElectronConfig) electron += 40;
  electron += signalScore('electron') * 0.3;
  if (['react', 'next', 'vue', 'svelte'].includes(stack.framework)) electron += 15;
  if (stack.language === 'typescript') electron += 10;
  if (stack.bundler === 'vite') electron += 10;
  if (stack.backend === 'supabase') electron += 5;
  if (stack.payments === 'stripe') electron += 5;
  electron = Math.min(100, Math.round(electron));

  // Tauri readiness: existing tauri config + compatible frontend
  let tauri = 0;
  if (stack.hasTauriConfig) tauri += 50;
  tauri += signalScore('tauri') * 0.3;
  if (['react', 'next', 'vue', 'svelte', 'sveltekit'].includes(stack.framework)) tauri += 15;
  if (stack.bundler === 'vite') tauri += 15;
  if (stack.language === 'typescript') tauri += 10;
  // Tauri penalty for heavy node deps
  if (stack.depCount > 50) tauri -= 10;
  tauri = Math.max(0, Math.min(100, Math.round(tauri)));

  // Code quality
  let quality = 0;
  if (stack.language === 'typescript') quality += 25;
  if (stack.hasTsStrict) quality += 15;
  quality += signalScore('quality') * 0.4;
  if (stack.fileCount > 10 && stack.fileCount < 500) quality += 10;
  if (stack.depCount < 30) quality += 10;
  quality = Math.min(100, Math.round(quality));

  // Security posture
  let security = 0;
  security += signalScore('security') * 0.5;
  if (stack.auth !== 'none') security += 20;
  if (stack.language === 'typescript') security += 15;
  if (stack.hasTsStrict) security += 10;
  if (stack.backend === 'supabase') security += 10; // RLS available
  security = Math.min(100, Math.round(security));

  // Test coverage
  let testing = 0;
  if (stack.hasTests) testing += 20;
  testing += signalScore('testing') * 0.6;
  if (stack.hasCI) testing += 15;
  testing = Math.min(100, Math.round(testing));

  // Production readiness (composite)
  const production = Math.round(
    quality * 0.25 + security * 0.25 + testing * 0.2 +
    Math.max(pwa, electron, tauri) * 0.15 + (stack.hasCI ? 15 : 0)
  );

  // Overall weighted
  const overall = Math.round(
    pwa * 0.15 + electron * 0.15 + tauri * 0.10 +
    quality * 0.20 + security * 0.15 + testing * 0.10 +
    production * 0.15
  );

  return { pwaReadiness: pwa, electronReadiness: electron, tauriReadiness: tauri,
    codeQuality: quality, securityPosture: security, testCoverage: testing,
    productionReadiness: production, overall };
}

// ── Recommendation Engine ────────────────────────────────────

export function recommend(
  stack: StackProfile,
  scores: AuditScores
): ConversionRecommendation {
  const reasoning: string[] = [];
  const blockers: string[] = [];

  // Determine primary target
  type ScoredTarget = { target: ConversionTarget; score: number };
  const candidates: ScoredTarget[] = [
    { target: 'pwa', score: scores.pwaReadiness },
    { target: 'electron', score: scores.electronReadiness },
    { target: 'tauri', score: scores.tauriReadiness },
  ];

  // Check for discontinue signals
  if (scores.overall < 15 && stack.fileCount < 5) {
    return {
      primary: 'discontinue',
      secondary: null,
      reasoning: ['App appears to be a skeleton or abandoned project', `Only ${stack.fileCount} files detected`, `Overall score: ${scores.overall}/100`],
      blockers: ['Insufficient codebase to warrant conversion effort'],
    };
  }

  // Check for keep-web (already good enough)
  if (scores.pwaReadiness > 80 && stack.hasServiceWorker && stack.hasManifest) {
    reasoning.push('Already PWA-ready — service worker and manifest present');
    return {
      primary: 'keep-web',
      secondary: 'electron',
      reasoning,
      blockers,
    };
  }

  // Sort candidates
  candidates.sort((a, b) => b.score - a.score);
  const primary = candidates[0];
  const secondary = candidates[1];

  // Build reasoning
  reasoning.push(`Highest readiness: ${primary.target} at ${primary.score}/100`);

  if (stack.framework === 'react' || stack.framework === 'next') {
    reasoning.push('React-based stack — compatible with all conversion targets');
  }

  if (primary.target === 'electron' && stack.payments === 'stripe') {
    reasoning.push('Stripe integration benefits from desktop (no browser limitations)');
  }

  if (primary.target === 'pwa' && stack.backend === 'supabase') {
    reasoning.push('Supabase real-time + offline patterns suit PWA architecture');
  }

  if (primary.target === 'tauri' && stack.depCount > 40) {
    blockers.push(`High dependency count (${stack.depCount}) — Tauri prefers minimal node deps`);
  }

  // Quality blockers
  if (scores.codeQuality < 30) {
    blockers.push('Code quality too low for safe conversion — refactor first');
  }
  if (scores.securityPosture < 20) {
    blockers.push('Security posture critical — address auth/CSP before conversion');
  }
  if (!stack.hasTests && scores.testCoverage < 10) {
    blockers.push('No tests detected — add baseline tests before migration');
  }

  return {
    primary: primary.target,
    secondary: secondary.score > 30 ? secondary.target : null,
    reasoning,
    blockers,
  };
}

// ── Effort Estimation ────────────────────────────────────────

export function estimateEffort(
  stack: StackProfile,
  scores: AuditScores
): EffortEstimate {
  const base = Math.max(4, Math.round(stack.locEstimate / 500));

  // PWA hours: depends on existing SW/manifest
  let pwaHours = base;
  if (stack.hasServiceWorker) pwaHours *= 0.4;
  if (stack.hasManifest) pwaHours *= 0.6;
  if (scores.pwaReadiness > 60) pwaHours *= 0.5;
  pwaHours = Math.max(4, Math.round(pwaHours));

  // Electron hours: always more than PWA
  let electronHours = base * 1.5;
  if (stack.hasElectronConfig) electronHours *= 0.3;
  if (scores.electronReadiness > 60) electronHours *= 0.5;
  if (stack.framework === 'react' || stack.framework === 'next') electronHours *= 0.8;
  electronHours = Math.max(8, Math.round(electronHours));

  // Tauri hours: similar to electron but Rust learning curve
  let tauriHours = base * 1.8;
  if (stack.hasTauriConfig) tauriHours *= 0.2;
  if (scores.tauriReadiness > 60) tauriHours *= 0.5;
  tauriHours = Math.max(12, Math.round(tauriHours));

  const minHours = Math.min(pwaHours, electronHours, tauriHours);
  const tier = minHours <= 8 ? 'trivial'
    : minHours <= 24 ? 'light'
    : minHours <= 60 ? 'moderate'
    : minHours <= 120 ? 'heavy'
    : 'rebuild';

  return { pwaHours, electronHours, tauriHours, tier };
}
