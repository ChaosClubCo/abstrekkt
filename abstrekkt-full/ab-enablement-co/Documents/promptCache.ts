/**
 * Prompt caching helpers for the Anthropic Messages API (TypeScript SDK).
 *
 * Mirrors prompt_cache.py:
 *   1. cachedSystemCall()   -> EXPLICIT breakpoint on a static system prefix
 *                              reused across requests with a varying user turn.
 *   2. CachedConversation   -> AUTOMATIC caching for a growing multi-turn chat.
 *
 * Requires: npm i @anthropic-ai/sdk
 * Env:      ANTHROPIC_API_KEY (never hard-code the key)
 */
import Anthropic from "@anthropic-ai/sdk";
import type {
  Message,
  MessageParam,
  TextBlockParam,
  Tool,
  Usage,
} from "@anthropic-ai/sdk/resources/messages";

type CacheControl = { type: "ephemeral"; ttl?: "1h" };

// 5m = default, free refresh on hit. 1h = 2x write cost; only for 5min–1h gaps.
export const CACHE_5M: CacheControl = { type: "ephemeral" };
export const CACHE_1H: CacheControl = { type: "ephemeral", ttl: "1h" };

// claude-opus-4-8 minimum cacheable prefix. Below this, caching is a silent
// no-op (both cache_* usage fields return 0). Verify for your model.
export const MIN_CACHEABLE_TOKENS = 1024;

export interface UsageBreakdown {
  read: number;
  write: number;
  fresh: number;
  totalInput: number;
}

function client(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Route the key through env vars or a secret " +
        "manager — never embed it in source or a client bundle.",
    );
  }
  return new Anthropic();
}

/**
 * Return a copy of `blocks` with cache_control on the LAST block only.
 * Callers must pass blocks whose content is byte-identical across requests.
 */
export function markLast<T extends { cache_control?: CacheControl }>(
  blocks: T[],
  ttl: CacheControl = CACHE_5M,
): T[] {
  if (blocks.length === 0) throw new Error("Cannot cache an empty block list.");
  return blocks.map((b, i) =>
    i === blocks.length - 1 ? { ...b, cache_control: ttl } : { ...b },
  );
}

/** Emit a HIT/WRITE/MISS line and return the token breakdown. */
export function logUsage(usage: Usage, label = "-"): UsageBreakdown {
  const read = usage.cache_read_input_tokens ?? 0;
  const write = usage.cache_creation_input_tokens ?? 0;
  const fresh = usage.input_tokens ?? 0;
  const totalInput = read + write + fresh;

  const state = read
    ? "HIT"
    : write
      ? "WRITE"
      : "MISS (uncached — check min-token floor / breakpoint placement)";

  console.info(
    `cache[${label}] ${state} | read=${read} write=${write} fresh=${fresh} ` +
      `total_in=${totalInput} out=${usage.output_tokens ?? 0}`,
  );
  return { read, write, fresh, totalInput };
}

const RETRYABLE = new Set([408, 409, 429, 500, 502, 503, 529]);

async function createWithRetry(
  c: Anthropic,
  params: Anthropic.Messages.MessageCreateParamsNonStreaming,
  maxRetries = 3,
): Promise<Message> {
  let attempt = 0;
  for (;;) {
    try {
      return await c.messages.create(params);
    } catch (err) {
      const status = (err as Anthropic.APIError)?.status;
      const retryable = status === undefined || RETRYABLE.has(status);
      if (!retryable || attempt >= maxRetries) {
        console.error(`Giving up (status=${status ?? "network"}):`, err);
        throw err;
      }
      attempt += 1;
      const backoff = 2 ** attempt * 1000;
      console.warn(`Transient error (status=${status ?? "network"}); retry ${attempt} in ${backoff}ms`);
      await new Promise((r) => setTimeout(r, backoff));
    }
  }
}

// --- Pattern 1: explicit breakpoint on a static system prefix ----------------
export interface CachedSystemCallArgs {
  systemBlocks: TextBlockParam[];
  userMessage: string;
  tools?: Tool[];
  model?: string;
  maxTokens?: number;
  ttl?: CacheControl;
  label?: string;
}

export async function cachedSystemCall(
  args: CachedSystemCallArgs,
): Promise<{ message: Message; usage: UsageBreakdown }> {
  const {
    systemBlocks,
    userMessage,
    tools,
    model = "claude-opus-4-8",
    maxTokens = 1024,
    ttl = CACHE_5M,
    label = "system-call",
  } = args;

  const c = client();
  const params: Anthropic.Messages.MessageCreateParamsNonStreaming = {
    model,
    max_tokens: maxTokens,
    system: markLast(systemBlocks, ttl),
    messages: [{ role: "user", content: userMessage }],
  };
  if (tools && tools.length > 0) params.tools = markLast(tools, ttl);

  const message = await createWithRetry(c, params);
  return { message, usage: logUsage(message.usage, label) };
}

// --- Pattern 2: automatic caching for a growing conversation -----------------
export class CachedConversation {
  private readonly c = client();
  private readonly messages: MessageParam[] = [];

  constructor(
    private readonly opts: {
      system: string | TextBlockParam[];
      model?: string;
      maxTokens?: number;
      ttl?: CacheControl;
    },
  ) {}

  async send(userMessage: string): Promise<{ message: Message; usage: UsageBreakdown }> {
    if (!userMessage.trim()) throw new Error("userMessage must be non-empty.");
    this.messages.push({ role: "user", content: userMessage });

    const message = await createWithRetry(this.c, {
      model: this.opts.model ?? "claude-opus-4-8",
      max_tokens: this.opts.maxTokens ?? 1024,
      // Automatic caching: breakpoint auto-advances to the last cacheable block.
      cache_control: this.opts.ttl ?? CACHE_5M,
      system: this.opts.system,
      messages: this.messages,
    } as Anthropic.Messages.MessageCreateParamsNonStreaming);

    this.messages.push({ role: "assistant", content: message.content });
    return { message, usage: logUsage(message.usage, `turn-${this.messages.length / 2}`) };
  }
}

// --- Smoke test: `npx tsx promptCache.ts` -> call 1 WRITE, call 2 HIT --------
async function smokeTest(): Promise<void> {
  const bigContext = "You are a senior release engineer. " + "Context line. ".repeat(500);
  const system: TextBlockParam[] = [{ type: "text", text: bigContext }];

  console.log("--- call 1 (expect WRITE) ---");
  const { usage: u1 } = await cachedSystemCall({ systemBlocks: system, userMessage: "Name one deploy risk." });
  console.log("--- call 2 (expect HIT) ---");
  const { usage: u2 } = await cachedSystemCall({ systemBlocks: system, userMessage: "Name a different one." });

  if (!(u1.write > 0 || u1.read > 0)) throw new Error("Call 1 did not cache — check token floor.");
  if (!(u2.read > 0)) throw new Error("Call 2 was not a cache hit — breakpoint or timing issue.");
  console.log(`\nPASS: write=${u1.write} then read=${u2.read} (0.1x cost on the hit).`);
}

// Run only when executed directly (tsx/ts-node), not when imported.
if (import.meta.url === `file://${process.argv[1]}`) {
  smokeTest().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
