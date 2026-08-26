/**
 * Central, validated configuration. All values come from the environment.
 * No secret is ever hardcoded; missing required secrets fail fast at boot.
 */
import { z } from "zod";

const RawEnv = z.object({
  A2A_PUBLIC_BASE_URL: z.string().url().default("http://localhost:8787"),
  PORT: z.coerce.number().int().positive().default(8787),
  A2A_GATEWAY_TOKEN: z.string().optional(),
  A2A_BACKEND: z
    .enum(["mock", "claude", "openai", "google", "managed"])
    .default("mock"),
  ANTHROPIC_API_KEY: z.string().optional(),
  A2A_MODEL_OVERRIDE: z.string().optional(),
  A2A_MAX_OUTPUT_TOKENS: z.coerce.number().int().positive().default(4096),

  // OpenAI (developers.openai.com)
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_BASE_URL: z.string().url().optional(),
  OPENAI_MODEL: z.string().optional(),
  OPENAI_MODEL_FAST: z.string().optional(),
  OPENAI_MODEL_BALANCED: z.string().optional(),
  OPENAI_MODEL_DEEP: z.string().optional(),

  // Google Gemini / Vertex AI (console.google.com)
  GOOGLE_GENAI_USE_VERTEXAI: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
  GOOGLE_API_KEY: z.string().optional(),
  GOOGLE_CLOUD_PROJECT: z.string().optional(),
  GOOGLE_CLOUD_LOCATION: z.string().optional(),
  GOOGLE_MODEL: z.string().optional(),
  GOOGLE_MODEL_FAST: z.string().optional(),
  GOOGLE_MODEL_BALANCED: z.string().optional(),
  GOOGLE_MODEL_DEEP: z.string().optional(),

  MANAGED_AGENTS_BASE_URL: z.string().url().optional(),
  MANAGED_AGENTS_TOKEN: z.string().optional(),
  A2A_MAX_DELEGATION_DEPTH: z.coerce.number().int().positive().default(3),
  A2A_DELEGATION_TIMEOUT_MS: z.coerce.number().int().positive().default(120_000),
  A2A_CROSS_LANE_ALLOWLIST: z.string().default(""),
  A2A_AGENTS_SOURCE: z.string().default("./data/kyle-40-agents.md"),
});

export interface OpenAIConfig {
  apiKey: string;
  baseUrl?: string;
  explicitModel?: string;
  tierOverrides: { fast?: string; balanced?: string; deep?: string };
}

export interface GoogleConfig {
  useVertex: boolean;
  apiKey?: string;
  project?: string;
  location?: string;
  explicitModel?: string;
  tierOverrides: { fast?: string; balanced?: string; deep?: string };
}

export interface Config {
  publicBaseUrl: string;
  port: number;
  gatewayToken?: string;
  backend: "mock" | "claude" | "openai" | "google" | "managed";
  anthropicApiKey?: string;
  /** Force every claude-backend call onto this model id, ignoring the agent's. */
  modelOverride?: string;
  maxOutputTokens: number;
  openai?: OpenAIConfig;
  google?: GoogleConfig;
  managedBaseUrl?: string;
  managedToken?: string;
  maxDelegationDepth: number;
  delegationTimeoutMs: number;
  /** Set of "FROM>TO" lane pairs explicitly permitted to cross. */
  crossLaneAllowlist: Set<string>;
  agentsSource: string;
}

/**
 * Parse + validate the environment into a typed Config.
 * Throws with an actionable message when a selected backend lacks its secret.
 */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const parsed = RawEnv.safeParse(env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid A2A layer configuration:\n${issues}`);
  }
  const e = parsed.data;

  const cfg: Config = {
    publicBaseUrl: e.A2A_PUBLIC_BASE_URL.replace(/\/+$/, ""),
    port: e.PORT,
    gatewayToken: e.A2A_GATEWAY_TOKEN || undefined,
    backend: e.A2A_BACKEND,
    anthropicApiKey: e.ANTHROPIC_API_KEY || undefined,
    modelOverride: e.A2A_MODEL_OVERRIDE || undefined,
    maxOutputTokens: e.A2A_MAX_OUTPUT_TOKENS,
    openai: e.OPENAI_API_KEY
      ? {
          apiKey: e.OPENAI_API_KEY,
          baseUrl: e.OPENAI_BASE_URL,
          explicitModel: e.OPENAI_MODEL,
          tierOverrides: {
            fast: e.OPENAI_MODEL_FAST,
            balanced: e.OPENAI_MODEL_BALANCED,
            deep: e.OPENAI_MODEL_DEEP,
          },
        }
      : undefined,
    google:
      e.GOOGLE_API_KEY || e.GOOGLE_GENAI_USE_VERTEXAI
        ? {
            useVertex: e.GOOGLE_GENAI_USE_VERTEXAI,
            apiKey: e.GOOGLE_API_KEY,
            project: e.GOOGLE_CLOUD_PROJECT,
            location: e.GOOGLE_CLOUD_LOCATION,
            explicitModel: e.GOOGLE_MODEL,
            tierOverrides: {
              fast: e.GOOGLE_MODEL_FAST,
              balanced: e.GOOGLE_MODEL_BALANCED,
              deep: e.GOOGLE_MODEL_DEEP,
            },
          }
        : undefined,
    managedBaseUrl: e.MANAGED_AGENTS_BASE_URL,
    managedToken: e.MANAGED_AGENTS_TOKEN || undefined,
    maxDelegationDepth: e.A2A_MAX_DELEGATION_DEPTH,
    delegationTimeoutMs: e.A2A_DELEGATION_TIMEOUT_MS,
    crossLaneAllowlist: new Set(
      e.A2A_CROSS_LANE_ALLOWLIST.split(",")
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean),
    ),
    agentsSource: e.A2A_AGENTS_SOURCE,
  };

  if (cfg.backend === "claude" && !cfg.anthropicApiKey) {
    throw new Error("A2A_BACKEND=claude requires ANTHROPIC_API_KEY to be set.");
  }
  if (cfg.backend === "openai" && !cfg.openai) {
    throw new Error("A2A_BACKEND=openai requires OPENAI_API_KEY to be set.");
  }
  if (cfg.backend === "google") {
    if (!cfg.google) {
      throw new Error(
        "A2A_BACKEND=google requires GOOGLE_API_KEY (Gemini API) or GOOGLE_GENAI_USE_VERTEXAI=true.",
      );
    }
    if (cfg.google.useVertex && (!cfg.google.project || !cfg.google.location)) {
      throw new Error(
        "Vertex mode requires GOOGLE_CLOUD_PROJECT and GOOGLE_CLOUD_LOCATION (with ADC configured).",
      );
    }
    if (!cfg.google.useVertex && !cfg.google.apiKey) {
      throw new Error("Gemini API mode requires GOOGLE_API_KEY.");
    }
  }
  if (cfg.backend === "managed" && (!cfg.managedBaseUrl || !cfg.managedToken)) {
    throw new Error(
      "A2A_BACKEND=managed requires MANAGED_AGENTS_BASE_URL and MANAGED_AGENTS_TOKEN.",
    );
  }
  return cfg;
}
