/**
 * OpenAI backend (developers.openai.com) using the Responses API. Runs an
 * agent's system prompt + input on an OpenAI model, tier-matched to the agent's
 * declared Claude tier. Model-only path (no MCP tool execution), same contract
 * as ClaudeMessagesBackend.
 *
 * Works against api.openai.com and any OpenAI-compatible endpoint via baseUrl
 * (e.g. Azure OpenAI). Auth + endpoint come from env only.
 */
import OpenAI from "openai";
import type { AgentBackend, BackendInvocation, BackendResult } from "./AgentBackend.js";
import { BackendError, throwIfAborted } from "./AgentBackend.js";
import { resolveModel, type TierMap } from "./modelTiers.js";

export interface OpenAIBackendOptions {
  apiKey: string;
  baseUrl?: string;
  /** Explicit model id; overrides tier mapping when set. */
  explicitModel?: string;
  tierMap: TierMap;
  maxOutputTokens: number;
}

export class OpenAIResponsesBackend implements AgentBackend {
  readonly kind = "openai";
  private readonly client: OpenAI;

  constructor(private readonly opts: OpenAIBackendOptions) {
    this.client = new OpenAI({
      apiKey: opts.apiKey,
      ...(opts.baseUrl ? { baseURL: opts.baseUrl } : {}),
    });
  }

  async run(inv: BackendInvocation): Promise<BackendResult> {
    throwIfAborted(inv.signal);
    const model = resolveModel(inv.def.model, {
      explicitModel: this.opts.explicitModel,
      tierMap: this.opts.tierMap,
    });

    try {
      const stream = await this.client.responses.create(
        {
          model,
          instructions: inv.def.system,
          input: inv.input,
          max_output_tokens: this.opts.maxOutputTokens,
          stream: true,
        },
        { signal: inv.signal },
      );

      let text = "";
      for await (const event of stream) {
        if (event.type === "response.output_text.delta") {
          text += event.delta;
          inv.onDelta?.(event.delta);
        } else if (event.type === "response.failed") {
          const reason = event.response.error?.message ?? "response failed";
          throw new BackendError(`OpenAI response failed: ${reason}`);
        }
      }

      return { text, meta: { backend: this.kind, model } };
    } catch (err) {
      if (inv.signal.aborted) throw new BackendError("OpenAI execution aborted.", err);
      if (err instanceof BackendError) throw err;
      throw new BackendError(
        `OpenAI Responses API call failed for model "${model}": ${(err as Error).message}`,
        err,
      );
    }
  }
}
