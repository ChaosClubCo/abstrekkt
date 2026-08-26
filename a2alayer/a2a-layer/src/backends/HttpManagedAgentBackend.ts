/**
 * HTTP backend that routes execution to a platform.claude.com managed-agents
 * run endpoint, where the agent's MCP tools actually live.
 *
 * INTEGRATION SEAM: the exact managed-agents run contract is workspace-specific.
 * This client POSTs to `${baseUrl}/{slug}/runs` with a bearer token and reads a
 * defensive set of common response shapes (output_text | text | content[].text |
 * message.content[].text). Confirm the request/response mapping against your
 * workspace and adjust `extractText` / the request body if it differs. It makes
 * a real network call — there are no stubbed paths.
 */
import type { AgentBackend, BackendInvocation, BackendResult } from "./AgentBackend.js";
import { BackendError, throwIfAborted } from "./AgentBackend.js";

export interface ManagedBackendOptions {
  baseUrl: string;
  token: string;
  /** Per-attempt timeout in ms. */
  timeoutMs?: number;
  /** Retry attempts for transient (429/5xx/network) failures. */
  maxRetries?: number;
}

interface ManagedResponseShape {
  output_text?: unknown;
  text?: unknown;
  content?: unknown;
  message?: { content?: unknown };
}

function extractText(body: unknown): string | undefined {
  if (typeof body !== "object" || body === null) return undefined;
  const r = body as ManagedResponseShape;
  if (typeof r.output_text === "string") return r.output_text;
  if (typeof r.text === "string") return r.text;
  const fromBlocks = (blocks: unknown): string | undefined => {
    if (!Array.isArray(blocks)) return undefined;
    const parts = blocks
      .map((b) =>
        b && typeof b === "object" && typeof (b as { text?: unknown }).text === "string"
          ? (b as { text: string }).text
          : "",
      )
      .filter(Boolean);
    return parts.length ? parts.join("") : undefined;
  };
  return fromBlocks(r.content) ?? fromBlocks(r.message?.content);
}

export class HttpManagedAgentBackend implements AgentBackend {
  readonly kind = "managed";
  private readonly timeoutMs: number;
  private readonly maxRetries: number;

  constructor(private readonly opts: ManagedBackendOptions) {
    this.timeoutMs = opts.timeoutMs ?? 120_000;
    this.maxRetries = opts.maxRetries ?? 2;
  }

  async run(inv: BackendInvocation): Promise<BackendResult> {
    throwIfAborted(inv.signal);
    const url = `${this.opts.baseUrl.replace(/\/+$/, "")}/${inv.def.slug}/runs`;
    const payload = {
      input: inv.input,
      context_id: inv.contextId,
      task_id: inv.taskId,
      lane: inv.def.lane,
    };

    let lastErr: unknown;
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      throwIfAborted(inv.signal);
      // Per-attempt timeout, linked to the caller's abort signal.
      const timeout = new AbortController();
      const timer = setTimeout(() => timeout.abort(), this.timeoutMs);
      const onOuterAbort = () => timeout.abort();
      inv.signal.addEventListener("abort", onOuterAbort, { once: true });

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            authorization: `Bearer ${this.opts.token}`,
            "content-type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify(payload),
          signal: timeout.signal,
        });

        if (res.status === 429 || res.status >= 500) {
          lastErr = new BackendError(
            `Managed run transient failure: HTTP ${res.status}`,
          );
          if (attempt < this.maxRetries) {
            await sleep(backoffMs(attempt));
            continue;
          }
          throw lastErr;
        }
        if (!res.ok) {
          const detail = await safeText(res);
          throw new BackendError(
            `Managed run failed: HTTP ${res.status} ${detail}`,
          );
        }

        const json: unknown = await res.json();
        const text = extractText(json);
        if (text === undefined) {
          throw new BackendError(
            "Managed run returned an unrecognized response shape; adjust extractText().",
          );
        }
        inv.onDelta?.(text);
        return { text, meta: { backend: this.kind, url, attempt } };
      } catch (err) {
        if (inv.signal.aborted) throw new BackendError("Managed execution aborted.", err);
        lastErr = err;
        if (err instanceof BackendError && !/transient/.test(err.message)) throw err;
        if (attempt >= this.maxRetries) break;
        await sleep(backoffMs(attempt));
      } finally {
        clearTimeout(timer);
        inv.signal.removeEventListener("abort", onOuterAbort);
      }
    }
    throw new BackendError(
      `Managed run exhausted retries: ${(lastErr as Error)?.message ?? "unknown"}`,
      lastErr,
    );
  }
}

function backoffMs(attempt: number): number {
  return Math.min(2000 * 2 ** attempt, 8000);
}
function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
async function safeText(res: Response): Promise<string> {
  try {
    return (await res.text()).slice(0, 300);
  } catch {
    return "";
  }
}
