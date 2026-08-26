/** Selects and constructs the execution backend from validated config. */
import type { Config } from "../config.js";
import type { AgentBackend } from "./AgentBackend.js";
import { MockBackend } from "./MockBackend.js";
import { ClaudeMessagesBackend } from "./ClaudeMessagesBackend.js";
import { OpenAIResponsesBackend } from "./OpenAIResponsesBackend.js";
import { GoogleGeminiBackend } from "./GoogleGeminiBackend.js";
import { HttpManagedAgentBackend } from "./HttpManagedAgentBackend.js";
import {
  OPENAI_TIER_DEFAULTS,
  GOOGLE_TIER_DEFAULTS,
  mergeTierMap,
} from "./modelTiers.js";

export function buildBackend(cfg: Config): AgentBackend {
  switch (cfg.backend) {
    case "mock":
      return new MockBackend();
    case "claude":
      // config.ts guarantees anthropicApiKey is present for this backend.
      return new ClaudeMessagesBackend({
        apiKey: cfg.anthropicApiKey!,
        maxOutputTokens: cfg.maxOutputTokens,
        modelOverride: cfg.modelOverride,
      });
    case "openai":
      // config.ts guarantees cfg.openai is present for this backend.
      return new OpenAIResponsesBackend({
        apiKey: cfg.openai!.apiKey,
        baseUrl: cfg.openai!.baseUrl,
        explicitModel: cfg.openai!.explicitModel,
        tierMap: mergeTierMap(OPENAI_TIER_DEFAULTS, cfg.openai!.tierOverrides),
        maxOutputTokens: cfg.maxOutputTokens,
      });
    case "google":
      // config.ts guarantees cfg.google is present + valid for this backend.
      return new GoogleGeminiBackend({
        useVertex: cfg.google!.useVertex,
        apiKey: cfg.google!.apiKey,
        project: cfg.google!.project,
        location: cfg.google!.location,
        explicitModel: cfg.google!.explicitModel,
        tierMap: mergeTierMap(GOOGLE_TIER_DEFAULTS, cfg.google!.tierOverrides),
        maxOutputTokens: cfg.maxOutputTokens,
      });
    case "managed":
      return new HttpManagedAgentBackend({
        baseUrl: cfg.managedBaseUrl!,
        token: cfg.managedToken!,
        timeoutMs: cfg.delegationTimeoutMs,
      });
    default: {
      const _exhaustive: never = cfg.backend;
      throw new Error(`Unsupported backend: ${String(_exhaustive)}`);
    }
  }
}
