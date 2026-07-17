/**
 * kyle-mcp — tool registry.
 * Each tool: JSON Schema (for tools/list), zod validator (runtime), executor.
 * Upstream credentials come from env vars only. A missing env var produces a
 * structured MCP tool error, never a crash.
 */
import { z } from "zod";

// ── Types ────────────────────────────────────────────────────────────────
export interface ToolResultContent {
  type: "text";
  text: string;
}
export interface ToolResult {
  content: ToolResultContent[];
  isError?: boolean;
}
export interface ToolDef {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  validator: z.ZodTypeAny;
  execute: (args: unknown) => Promise<ToolResult>;
}

// ── Helpers ──────────────────────────────────────────────────────────────
function ok(data: unknown): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}
function err(message: string): ToolResult {
  return { content: [{ type: "text", text: message }], isError: true };
}
function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v || v.trim() === "") {
    throw new EnvMissingError(name);
  }
  return v;
}
class EnvMissingError extends Error {
  constructor(public envVar: string) {
    super(`Server is not configured: env var ${envVar} is missing. Set it in Vercel → Project → Settings → Environment Variables and redeploy.`);
  }
}

const UPSTREAM_TIMEOUT_MS = 25_000;

async function upstream(
  url: string,
  init: RequestInit,
  label: string
): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    const text = await res.text();
    let body: unknown = text;
    try {
      body = JSON.parse(text);
    } catch {
      /* keep raw text */
    }
    if (!res.ok) {
      // Do not leak full upstream bodies for 5xx; keep 4xx detail (usually actionable).
      const detail =
        res.status >= 500
          ? `upstream ${res.status}`
          : `upstream ${res.status}: ${typeof body === "string" ? body.slice(0, 500) : JSON.stringify(body).slice(0, 500)}`;
      throw new Error(`${label} failed — ${detail}`);
    }
    return body;
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      throw new Error(`${label} timed out after ${UPSTREAM_TIMEOUT_MS / 1000}s`);
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

function wrapExecute(
  fn: (args: unknown) => Promise<ToolResult>
): (args: unknown) => Promise<ToolResult> {
  return async (args) => {
    try {
      return await fn(args);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "unknown error";
      console.error(JSON.stringify({ level: "error", scope: "tool", msg }));
      return err(msg);
    }
  };
}

// ── v0 (Vercel v0 Platform API) ─────────────────────────────────────────
const V0_BASE = "https://api.v0.dev/v1";

const v0CreateSchema = z.object({
  prompt: z.string().min(1).max(20_000),
  system: z.string().max(10_000).optional(),
});

const v0GetChatSchema = z.object({
  chatId: z.string().min(1).max(200),
});

// ── Hostinger public API ─────────────────────────────────────────────────
const HOSTINGER_BASE = "https://developers.hostinger.com/api";

const hostingerDnsSchema = z.object({
  domain: z
    .string()
    .min(3)
    .max(253)
    .regex(/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/i, "invalid domain"),
});

const emptySchema = z.object({}).strict();

// ── Resend ───────────────────────────────────────────────────────────────
const RESEND_BASE = "https://api.resend.com";

const resendSendSchema = z.object({
  from: z.string().email().or(z.string().regex(/^.+<.+@.+>$/, "use email or 'Name <email>' format")),
  to: z.array(z.string().email()).min(1).max(50),
  subject: z.string().min(1).max(500),
  html: z.string().max(200_000).optional(),
  text: z.string().max(200_000).optional(),
}).refine((v) => v.html || v.text, { message: "provide html or text" });

const resendGetSchema = z.object({
  emailId: z.string().min(1).max(200),
});

// ── Registry ─────────────────────────────────────────────────────────────
export const TOOLS: ToolDef[] = [
  {
    name: "v0_create_generation",
    description:
      "Create a new v0 generation (UI/component from a prompt) via the v0 Platform API. Returns the chat id and generation metadata. Requires V0_API_KEY.",
    inputSchema: {
      type: "object",
      properties: {
        prompt: { type: "string", description: "What to build" },
        system: { type: "string", description: "Optional system context" },
      },
      required: ["prompt"],
    },
    validator: v0CreateSchema,
    execute: wrapExecute(async (raw) => {
      const args = v0CreateSchema.parse(raw);
      const key = requireEnv("V0_API_KEY");
      const body: Record<string, unknown> = { message: args.prompt };
      if (args.system) body.system = args.system;
      const data = await upstream(
        `${V0_BASE}/chats`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
        "v0 create"
      );
      return ok(data);
    }),
  },
  {
    name: "v0_get_chat",
    description:
      "Fetch a v0 chat by id — status, messages, and generated files. Requires V0_API_KEY.",
    inputSchema: {
      type: "object",
      properties: { chatId: { type: "string", description: "v0 chat id" } },
      required: ["chatId"],
    },
    validator: v0GetChatSchema,
    execute: wrapExecute(async (raw) => {
      const args = v0GetChatSchema.parse(raw);
      const key = requireEnv("V0_API_KEY");
      const data = await upstream(
        `${V0_BASE}/chats/${encodeURIComponent(args.chatId)}`,
        { headers: { Authorization: `Bearer ${key}` } },
        "v0 get chat"
      );
      return ok(data);
    }),
  },
  {
    name: "hostinger_list_domains",
    description:
      "List domains in the Hostinger account portfolio. Requires HOSTINGER_API_TOKEN.",
    inputSchema: { type: "object", properties: {} },
    validator: emptySchema,
    execute: wrapExecute(async () => {
      const key = requireEnv("HOSTINGER_API_TOKEN");
      const data = await upstream(
        `${HOSTINGER_BASE}/domains/v1/portfolio`,
        { headers: { Authorization: `Bearer ${key}` } },
        "hostinger list domains"
      );
      return ok(data);
    }),
  },
  {
    name: "hostinger_get_dns_records",
    description:
      "Get DNS zone records for a domain managed at Hostinger. Requires HOSTINGER_API_TOKEN.",
    inputSchema: {
      type: "object",
      properties: { domain: { type: "string", description: "e.g. flashfusion.co" } },
      required: ["domain"],
    },
    validator: hostingerDnsSchema,
    execute: wrapExecute(async (raw) => {
      const args = hostingerDnsSchema.parse(raw);
      const key = requireEnv("HOSTINGER_API_TOKEN");
      const data = await upstream(
        `${HOSTINGER_BASE}/dns/v1/zones/${encodeURIComponent(args.domain)}`,
        { headers: { Authorization: `Bearer ${key}` } },
        "hostinger get dns"
      );
      return ok(data);
    }),
  },
  {
    name: "hostinger_list_vps",
    description:
      "List VPS virtual machines in the Hostinger account. Requires HOSTINGER_API_TOKEN.",
    inputSchema: { type: "object", properties: {} },
    validator: emptySchema,
    execute: wrapExecute(async () => {
      const key = requireEnv("HOSTINGER_API_TOKEN");
      const data = await upstream(
        `${HOSTINGER_BASE}/vps/v1/virtual-machines`,
        { headers: { Authorization: `Bearer ${key}` } },
        "hostinger list vps"
      );
      return ok(data);
    }),
  },
  {
    name: "resend_send_email",
    description:
      "Send a transactional email via Resend. 'from' must be on a verified Resend domain. Requires RESEND_API_KEY.",
    inputSchema: {
      type: "object",
      properties: {
        from: { type: "string", description: "sender, e.g. 'Kyle <noreply@flashfusion.co>'" },
        to: { type: "array", items: { type: "string" }, description: "recipient emails" },
        subject: { type: "string" },
        html: { type: "string", description: "HTML body (or use text)" },
        text: { type: "string", description: "Plain-text body (or use html)" },
      },
      required: ["from", "to", "subject"],
    },
    validator: resendSendSchema,
    execute: wrapExecute(async (raw) => {
      const args = resendSendSchema.parse(raw);
      const key = requireEnv("RESEND_API_KEY");
      const data = await upstream(
        `${RESEND_BASE}/emails`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify(args),
        },
        "resend send"
      );
      return ok(data);
    }),
  },
  {
    name: "resend_get_email",
    description:
      "Fetch a sent email's status/details from Resend by email id. Requires RESEND_API_KEY.",
    inputSchema: {
      type: "object",
      properties: { emailId: { type: "string" } },
      required: ["emailId"],
    },
    validator: resendGetSchema,
    execute: wrapExecute(async (raw) => {
      const args = resendGetSchema.parse(raw);
      const key = requireEnv("RESEND_API_KEY");
      const data = await upstream(
        `${RESEND_BASE}/emails/${encodeURIComponent(args.emailId)}`,
        { headers: { Authorization: `Bearer ${key}` } },
        "resend get"
      );
      return ok(data);
    }),
  },
];

export const TOOL_MAP: Map<string, ToolDef> = new Map(TOOLS.map((t) => [t.name, t]));
