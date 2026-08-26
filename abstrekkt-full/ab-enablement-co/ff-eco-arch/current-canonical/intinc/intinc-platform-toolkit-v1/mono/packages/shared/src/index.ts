// ─────────────────────────────────────────────────────────────
// @intinc/shared — Types, constants, templates metadata
// ─────────────────────────────────────────────────────────────

// ── Template Registry ────────────────────────────────────────

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: 'pwa' | 'electron' | 'tauri' | 'server';
  framework: string;
  features: string[];
  requiredEnv: string[];
  estimatedSetupMinutes: number;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
}

export const TEMPLATES: Record<string, TemplateConfig> = {
  'pwa-react': {
    id: 'pwa-react',
    name: 'PWA — React + TypeScript',
    description: 'Production PWA with service worker, push notifications, offline queue, and install prompt',
    category: 'pwa',
    framework: 'react',
    features: ['service-worker', 'push-notifications', 'offline-queue', 'install-prompt', 'cache-strategies', 'background-sync'],
    requiredEnv: ['VITE_VAPID_PUBLIC_KEY', 'VITE_API_URL'],
    estimatedSetupMinutes: 5,
    dependencies: {
      'react': '^18.3.0', 'react-dom': '^18.3.0', 'workbox-precaching': '^7.1.0',
      'workbox-routing': '^7.1.0', 'workbox-strategies': '^7.1.0',
      'workbox-cacheable-response': '^7.1.0', 'workbox-expiration': '^7.1.0',
      'workbox-background-sync': '^7.1.0', 'idb-keyval': '^6.2.0',
    },
    devDependencies: {
      'typescript': '^5.6.0', 'vite': '^5.4.0', '@vitejs/plugin-react': '^4.3.0',
      'vite-plugin-pwa': '^0.20.0', 'vitest': '^2.1.0', '@playwright/test': '^1.48.0',
    },
    scripts: {
      'dev': 'vite', 'build': 'tsc && vite build', 'preview': 'vite preview',
      'test': 'vitest', 'test:e2e': 'playwright test', 'typecheck': 'tsc --noEmit',
    },
  },
  'pwa-vanilla': {
    id: 'pwa-vanilla',
    name: 'PWA — Vanilla TypeScript',
    description: 'Zero-dependency PWA modules: SW manager, cache manager, push client, offline queue',
    category: 'pwa',
    framework: 'vanilla',
    features: ['service-worker', 'push-notifications', 'offline-queue', 'cache-manager', 'install-prompt'],
    requiredEnv: ['VAPID_PUBLIC_KEY', 'API_URL'],
    estimatedSetupMinutes: 3,
    dependencies: {},
    devDependencies: { 'typescript': '^5.6.0', 'vite': '^5.4.0', 'vitest': '^2.1.0' },
    scripts: { 'dev': 'vite', 'build': 'tsc && vite build', 'test': 'vitest', 'typecheck': 'tsc --noEmit' },
  },
  'electron-react': {
    id: 'electron-react',
    name: 'Electron — React + TypeScript',
    description: 'Security-hardened Electron app with IPC bridge, auto-updater, and multi-platform build',
    category: 'electron',
    framework: 'react',
    features: ['ipc-bridge', 'auto-update', 'security-hardened', 'multi-platform', 'code-signing', 'context-isolation'],
    requiredEnv: ['APPLE_ID', 'APPLE_APP_SPECIFIC_PASSWORD', 'CSC_LINK', 'CSC_KEY_PASSWORD'],
    estimatedSetupMinutes: 10,
    dependencies: {
      'react': '^18.3.0', 'react-dom': '^18.3.0', 'electron-updater': '^6.3.0',
    },
    devDependencies: {
      'typescript': '^5.6.0', 'electron': '^32.0.0', 'electron-builder': '^25.0.0',
      'vite': '^5.4.0', '@vitejs/plugin-react': '^4.3.0', 'vitest': '^2.1.0',
    },
    scripts: {
      'dev': 'vite', 'dev:electron': 'electron .', 'build': 'tsc && vite build',
      'build:electron': 'electron-builder', 'test': 'vitest', 'typecheck': 'tsc --noEmit',
    },
  },
  'electron-vanilla': {
    id: 'electron-vanilla',
    name: 'Electron — Vanilla TypeScript',
    description: 'Minimal Electron shell with secure IPC and auto-update — framework agnostic',
    category: 'electron',
    framework: 'vanilla',
    features: ['ipc-bridge', 'auto-update', 'security-hardened', 'context-isolation'],
    requiredEnv: [],
    estimatedSetupMinutes: 5,
    dependencies: { 'electron-updater': '^6.3.0' },
    devDependencies: {
      'typescript': '^5.6.0', 'electron': '^32.0.0', 'electron-builder': '^25.0.0', 'vite': '^5.4.0',
    },
    scripts: {
      'dev': 'vite', 'dev:electron': 'electron .', 'build': 'vite build',
      'build:electron': 'electron-builder', 'typecheck': 'tsc --noEmit',
    },
  },
  'tauri-react': {
    id: 'tauri-react',
    name: 'Tauri — React + TypeScript',
    description: 'Lightweight native desktop app via Tauri 2.0 with React frontend and Rust backend',
    category: 'tauri',
    framework: 'react',
    features: ['native-apis', 'auto-update', 'small-binary', 'system-tray', 'multi-window'],
    requiredEnv: [],
    estimatedSetupMinutes: 15,
    dependencies: {
      'react': '^18.3.0', 'react-dom': '^18.3.0', '@tauri-apps/api': '^2.0.0',
      '@tauri-apps/plugin-shell': '^2.0.0', '@tauri-apps/plugin-fs': '^2.0.0',
      '@tauri-apps/plugin-dialog': '^2.0.0',
    },
    devDependencies: {
      'typescript': '^5.6.0', 'vite': '^5.4.0', '@vitejs/plugin-react': '^4.3.0',
      '@tauri-apps/cli': '^2.0.0', 'vitest': '^2.1.0',
    },
    scripts: {
      'dev': 'vite', 'dev:tauri': 'tauri dev', 'build': 'tsc && vite build',
      'build:tauri': 'tauri build', 'test': 'vitest', 'typecheck': 'tsc --noEmit',
    },
  },
  'push-server': {
    id: 'push-server',
    name: 'Push Notification Server',
    description: 'VAPID push server with Express, SQLite subscriptions, and broadcast endpoint',
    category: 'server',
    framework: 'express',
    features: ['vapid-push', 'subscription-management', 'broadcast', 'stale-pruning', 'rate-limiting'],
    requiredEnv: ['VAPID_PUBLIC_KEY', 'VAPID_PRIVATE_KEY', 'VAPID_EMAIL'],
    estimatedSetupMinutes: 3,
    dependencies: {
      'express': '^4.21.0', 'web-push': '^3.6.0', 'better-sqlite3': '^11.0.0',
      'helmet': '^8.0.0', 'cors': '^2.8.0', 'zod': '^3.23.0', 'pino': '^9.0.0',
      'pino-pretty': '^11.0.0',
    },
    devDependencies: {
      'typescript': '^5.6.0', '@types/express': '^5.0.0', '@types/web-push': '^3.6.0',
      '@types/better-sqlite3': '^7.6.0', '@types/cors': '^2.8.0',
      'vitest': '^2.1.0', 'tsx': '^4.19.0',
    },
    scripts: {
      'dev': 'tsx watch src/server.ts', 'build': 'tsc', 'start': 'node dist/server.js',
      'test': 'vitest', 'typecheck': 'tsc --noEmit',
    },
  },
};

// ── Feature Add-ons ──────────────────────────────────────────

export interface FeatureAddon {
  id: string;
  name: string;
  description: string;
  compatibleTemplates: string[];
  dependencies: Record<string, string>;
  files: string[]; // relative paths to copy from addon directory
}

export const ADDONS: Record<string, FeatureAddon> = {
  'supabase': {
    id: 'supabase',
    name: 'Supabase Integration',
    description: 'Auth, database, RLS policies, real-time subscriptions, and edge functions',
    compatibleTemplates: ['pwa-react', 'electron-react', 'tauri-react'],
    dependencies: {
      '@supabase/supabase-js': '^2.45.0',
      '@supabase/auth-helpers-react': '^0.5.0',
    },
    files: ['src/lib/supabase.ts', 'src/hooks/useAuth.ts', 'src/hooks/useRealtime.ts',
      'supabase/migrations/001_init.sql', 'supabase/config.toml'],
  },
  'stripe': {
    id: 'stripe',
    name: 'Stripe Payments',
    description: 'Checkout, subscriptions, customer portal, and webhook handling',
    compatibleTemplates: ['pwa-react', 'electron-react', 'tauri-react'],
    dependencies: {
      '@stripe/stripe-js': '^4.5.0',
      '@stripe/react-stripe-js': '^2.8.0',
    },
    files: ['src/lib/stripe.ts', 'src/components/CheckoutButton.tsx',
      'src/components/PricingTable.tsx', 'api/webhooks/stripe.ts'],
  },
  'sentry': {
    id: 'sentry',
    name: 'Sentry Error Tracking',
    description: 'Error monitoring, performance tracing, and session replay',
    compatibleTemplates: ['pwa-react', 'electron-react', 'tauri-react', 'push-server'],
    dependencies: { '@sentry/react': '^8.30.0' },
    files: ['src/lib/sentry.ts', 'src/components/ErrorBoundary.tsx'],
  },
  'posthog': {
    id: 'posthog',
    name: 'PostHog Analytics',
    description: 'Product analytics, feature flags, session recording',
    compatibleTemplates: ['pwa-react', 'electron-react', 'tauri-react'],
    dependencies: { 'posthog-js': '^1.160.0' },
    files: ['src/lib/posthog.ts', 'src/hooks/useFeatureFlag.ts'],
  },
};

// ── VISTADEL Phase Definitions ───────────────────────────────

export interface VistadelPhase {
  id: string;
  name: string;
  fullName: string;
  gateMetric: string;
  gateThreshold: number;
  description: string;
  deliverables: string[];
}

export const VISTADEL_PHASES: VistadelPhase[] = [
  { id: 'V', name: 'Vision', fullName: 'V: Vision', gateMetric: 'overall', gateThreshold: 30,
    description: 'Validate the problem before building', deliverables: ['Problem statement', 'User personas', 'Competitive analysis', 'Go/no-go decision'] },
  { id: 'I', name: 'Integration', fullName: 'I: Integration', gateMetric: 'securityPosture', gateThreshold: 40,
    description: 'Map data flows, APIs, and compliance requirements', deliverables: ['Data flow diagram', 'API contract', 'Compliance checklist', 'Auth architecture'] },
  { id: 'S', name: 'Stack', fullName: 'S: Stack', gateMetric: 'codeQuality', gateThreshold: 50,
    description: 'Choose tools strategically — framework, bundler, hosting', deliverables: ['Stack decision document', 'ADRs', 'Dependency audit', 'Dev environment setup'] },
  { id: 'T', name: 'Testing', fullName: 'T: Testing', gateMetric: 'testCoverage', gateThreshold: 40,
    description: 'Prevent breakage, build confidence', deliverables: ['Test strategy', 'Unit test suite', 'E2E test suite', 'CI pipeline'] },
  { id: 'A', name: 'AI Implementation', fullName: 'A: AI Implementation', gateMetric: 'productionReadiness', gateThreshold: 50,
    description: 'Use Claude to accelerate development with safety guardrails', deliverables: ['AI integration spec', 'Prompt templates', 'Cost projections', 'Monitoring setup'] },
  { id: 'D', name: 'Deployment', fullName: 'D: Deployment', gateMetric: 'pwaReadiness', gateThreshold: 60,
    description: 'Ship reliably, monitor health', deliverables: ['Deploy pipeline', 'Environment configs', 'Health checks', 'Rollback procedures'] },
  { id: 'E', name: 'Evolution', fullName: 'E: Evolution', gateMetric: 'overall', gateThreshold: 60,
    description: 'Prioritize improvements based on data', deliverables: ['Feedback loop', 'Performance baselines', 'Feature prioritization', 'Tech debt backlog'] },
  { id: 'L', name: 'Launch', fullName: 'L: Launch', gateMetric: 'overall', gateThreshold: 70,
    description: 'Release, learn, iterate', deliverables: ['Launch checklist', 'Monitoring dashboard', 'Incident runbook', 'Post-launch review'] },
];

// ── Scaffold Options ─────────────────────────────────────────

export interface ScaffoldOptions {
  projectName: string;
  template: string;
  addons: string[];
  packageManager: 'pnpm' | 'npm' | 'yarn' | 'bun';
  gitInit: boolean;
  installDeps: boolean;
  outputDir: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  stripePublicKey?: string;
  sentryDsn?: string;
  vapidPublicKey?: string;
  vapidPrivateKey?: string;
}
