/**
 * Anthropic Messages API backend. Runs the agent's declared model + system
 * prompt directly. This is the model-only path: it does NOT execute the agent's
 * MCP tools (those live in the managed-agent runtime — use the managed backend
 * for tool-backed execution). The Agent Card still advertises the agent's tools
 * as routing metadata.
 */
import Anthropic from "@anthropic-ai/sdk";
import type { AgentBackend, BackendInvocation, BackendResult } from "./AgentBackend.js";
import { BackendError, throwIfAborted } from "./AgentBackend.js";

export interface ClaudeBackendOptions {
  apiKey: string;
  maxOutputTokens: number;
  /** Override the per-agent model (e.g. to pin a known-good model in testing). */
  modelOverride?: string;
}

export class ClaudeMessagesBackend implements AgentBackend {
  readonly kind = "claude";
  private readonly client: Anthropic;

  constructor(private readonly opts: ClaudeBackendOptions) {
    this.client = new Anthropic({ apiKey: opts.apiKey });
  }

  async run(inv: BackendInvocation): Promise<BackendResult> {
    throwIfAborted(inv.signal);
    const model = this.opts.modelOverride ?? inv.def.model;

    try {
      const stream = this.client.messages.stream(
        {
          model,
          max_tokens: this.opts.maxOutputTokens,
          system: inv.def.system,
          messages: [{ role: "user", content: inv.input }],
        },
        { signal: inv.signal },
      );

      if (inv.onDelta) {
        stream.on("text", (delta) => inv.onDelta?.(delta));
      }

      const final = await stream.finalMessage();
      const text = final.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("");

      return {
        text,
        meta: {
          backend: this.kind,
          model,
          stopReason: final.stop_reason,
          usage: final.usage,
        },
      };
    } catch (err) {
      if (inv.signal.aborted) {
        throw new BackendError("Claude execution aborted.", err);
      }
      throw new BackendError(
        `Claude Messages API call failed for model "${model}": ${(err as Error).message}`,
        err,
      );
    }
  }
}
