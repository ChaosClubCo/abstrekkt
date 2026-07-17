/**
 * Hardened environment access for the Vite (browser) app.
 *
 * RULE: anything bundled by Vite that is prefixed `VITE_` is PUBLIC — it ships
 * inside the JavaScript every visitor downloads. Therefore NO secret may ever
 * be `VITE_`-prefixed or read in browser code.
 *
 * Secrets (Anthropic / OpenAI / GitHub / Stripe secret / Supabase service-role)
 * live ONLY on the server and are reached through a backend proxy — never here.
 *
 * This module exposes ONLY browser-safe values and actively throws if anyone
 * tries to read a known-secret name from the client bundle.
 */

// ── Browser-safe (public) configuration only ───────────────────────────────
interface PublicEnv {
  MODE: 'development' | 'production' | 'test';
  APP_NAME: string;
  APP_VERSION: string;
  // Public service endpoints / publishable keys ONLY.
  SUPABASE_URL: string;          // public project URL
  SUPABASE_ANON_KEY: string;     // anon key is designed to be public (RLS enforced)
  API_BASE_URL: string;          // your own backend proxy base
  GA_MEASUREMENT_ID: string;     // publishable analytics id
  STRIPE_PUBLISHABLE_KEY: string;// publishable (pk_) key is public by design
  SENTRY_DSN: string;            // DSN is public by design
}

/**
 * Names that must NEVER appear in browser code. Reading any of these from the
 * client throws immediately so the mistake is caught in development, not in prod.
 */
const FORBIDDEN_IN_BROWSER = [
  'ANTHROPIC_API_KEY', 'VITE_ANTHROPIC_API_KEY',
  'OPENAI_API_KEY', 'VITE_OPENAI_API_KEY',
  'GOOGLE_AI_API_KEY', 'VITE_GOOGLE_AI_API_KEY',
  'HUGGINGFACE_API_KEY', 'VITE_HUGGINGFACE_API_KEY',
  'STABILITY_API_KEY', 'VITE_STABILITY_API_KEY',
  'GITHUB_TOKEN', 'VITE_GITHUB_TOKEN',
  'STRIPE_SECRET_API_KEY', 'STRIPE_WEBHOOK_SECRET',
  'SUPABASE_SERVICE_ROLE_KEY',
] as const;

function read(key: string, fallback = ''): string {
  // import.meta.env is replaced at build time by Vite.
  const v = (import.meta as any)?.env?.[key];
  return (typeof v === 'string' && v.length > 0) ? v : fallback;
}

function getMode(): PublicEnv['MODE'] {
  const m = read('MODE') || read('NODE_ENV') || 'production';
  return (['development', 'production', 'test'] as const).includes(m as any)
    ? (m as PublicEnv['MODE'])
    : 'production';
}

const publicEnv: PublicEnv = {
  MODE: getMode(),
  APP_NAME: read('VITE_APP_NAME', 'FlashFusion'),
  APP_VERSION: read('VITE_APP_VERSION', '1.0.0'),
  SUPABASE_URL: read('VITE_SUPABASE_URL'),
  SUPABASE_ANON_KEY: read('VITE_SUPABASE_ANON_KEY'),
  API_BASE_URL: read('VITE_API_BASE_URL', '/api'),
  GA_MEASUREMENT_ID: read('VITE_GA_MEASUREMENT_ID'),
  STRIPE_PUBLISHABLE_KEY: read('VITE_STRIPE_PUBLISHABLE_KEY'),
  SENTRY_DSN: read('VITE_SENTRY_DSN'),
};

/**
 * Public env, guarded. Any attempt to read a secret name throws.
 */
export const ENV = new Proxy(publicEnv, {
  get(target, prop: string) {
    if (FORBIDDEN_IN_BROWSER.includes(prop as any)) {
      throw new Error(
        `[security] "${prop}" is a server-only secret and must never be read in browser code. ` +
        `Call it through your backend proxy (see ENV.API_BASE_URL) instead.`
      );
    }
    return (target as any)[prop];
  },
});

export const isDevelopment = () => ENV.MODE === 'development';
export const isProduction = () => ENV.MODE === 'production';

/** Fail fast at startup if a required public var is missing in production. */
export function assertPublicEnv(): void {
  if (!isProduction()) return;
  const required: (keyof PublicEnv)[] = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'API_BASE_URL'];
  const missing = required.filter((k) => !publicEnv[k]);
  if (missing.length) {
    throw new Error(`[config] Missing required public env vars: ${missing.join(', ')}`);
  }
}

export type { PublicEnv };
