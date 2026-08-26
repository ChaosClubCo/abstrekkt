/**
 * Cross-provider model routing. Each managed agent declares a Claude model that
 * implies a capability/cost tier (haiku=fast, sonnet=balanced, opus=deep). When
 * an agent runs on a different provider, we preserve that tier rather than
 * flattening every agent onto one model.
 *
 * The default model IDs below are provider-current best-effort values and are
 * fully overridable via env. Verify them against developers.openai.com /
 * console.google.com and set explicit overrides for production.
 */

export type ModelTier = "fast" | "balanced" | "deep";

export type TierMap = Record<ModelTier, string>;

/** Derive the tier implied by a managed agent's declared model id. */
export function modelTier(model: string): ModelTier {
  const m = model.toLowerCase();
  if (m.includes("haiku")) return "fast";
  if (m.includes("opus")) return "deep";
  return "balanced"; // sonnet / default / anything else
}

/**
 * OpenAI (developers.openai.com) tier defaults. gpt-5 is confirmed current;
 * the mini/deep variants are best-effort — override via OPENAI_MODEL_* if the
 * ids differ in your account.
 */
export const OPENAI_TIER_DEFAULTS: TierMap = {
  fast: "gpt-5-mini",
  balanced: "gpt-5",
  deep: "gpt-5",
};

/**
 * Google Gemini (console.google.com / Vertex AI) tier defaults. Override via
 * GOOGLE_MODEL_* to match the exact ids enabled in your project/region.
 */
export const GOOGLE_TIER_DEFAULTS: TierMap = {
  fast: "gemini-2.5-flash",
  balanced: "gemini-2.5-pro",
  deep: "gemini-2.5-pro",
};

/**
 * Resolve the concrete model id for an agent on a given provider.
 * Precedence: explicit single-model override > per-tier map entry.
 */
export function resolveModel(
  agentModel: string,
  opts: { explicitModel?: string; tierMap: TierMap },
): string {
  if (opts.explicitModel) return opts.explicitModel;
  return opts.tierMap[modelTier(agentModel)];
}

/** Merge partial per-tier env overrides onto a default map. */
export function mergeTierMap(base: TierMap, overrides: Partial<TierMap>): TierMap {
  return {
    fast: overrides.fast || base.fast,
    balanced: overrides.balanced || base.balanced,
    deep: overrides.deep || base.deep,
  };
}
