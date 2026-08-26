/**
 * Google backend (console.google.com) using the unified @google/genai SDK.
 * Supports two auth modes selected by env:
 *   - Gemini API:  GOOGLE_API_KEY (developer key from Google AI Studio)
 *   - Vertex AI:   GOOGLE_GENAI_USE_VERTEXAI=true + GOOGLE_CLOUD_PROJECT +
 *                  GOOGLE_CLOUD_LOCATION (Application Default Credentials)
 *
 * Model-only path (no MCP tool execution), same contract as the other backends.
 * Tier-matched to the agent's declared Claude tier.
 */
import { GoogleGenAI } from "@google/genai";
import type { AgentBackend, BackendInvocation, BackendResult } from "./AgentBackend.js";
import { BackendError, throwIfAborted } from "./AgentBackend.js";
import { resolveModel, type TierMap } from "./modelTiers.js";

export interface GoogleBackendOptions {
  useVertex: boolean;
  apiKey?: string;
  project?: string;
  location?: string;
  explicitModel?: string;
  tierMap: TierMap;
  maxOutputTokens: number;
}

export class GoogleGeminiBackend implements AgentBackend {
  readonly kind = "google";
  private readonly client: GoogleGenAI;

  constructor(private readonly opts: GoogleBackendOptions) {
    this.client = opts.useVertex
      ? new GoogleGenAI({
          vertexai: true,
          project: opts.project,
          location: opts.location,
        })
      : new GoogleGenAI({ apiKey: opts.apiKey });
  }

  async run(inv: BackendInvocation): Promise<BackendResult> {
    throwIfAborted(inv.signal);
    const model = resolveModel(inv.def.model, {
      explicitModel: this.opts.explicitModel,
      tierMap: this.opts.tierMap,
    });

    try {
      const stream = await this.client.models.generateContentStream({
        model,
        contents: inv.input,
        config: {
          systemInstruction: inv.def.system,
          maxOutputTokens: this.opts.maxOutputTokens,
          abortSignal: inv.signal,
        },
      });

      let text = "";
      for await (const chunk of stream) {
        const delta = chunk.text;
        if (delta) {
          text += delta;
          inv.onDelta?.(delta);
        }
      }

      return {
        text,
        meta: { backend: this.kind, model, mode: this.opts.useVertex ? "vertex" : "gemini-api" },
      };
    } catch (err) {
      if (inv.signal.aborted) throw new BackendError("Google execution aborted.", err);
      throw new BackendError(
        `Google GenAI call failed for model "${model}": ${(err as Error).message}`,
        err,
      );
    }
  }
}
