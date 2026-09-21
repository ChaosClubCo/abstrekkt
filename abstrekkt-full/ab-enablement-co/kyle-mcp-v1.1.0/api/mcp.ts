/**
 * kyle-mcp — Streamable HTTP MCP endpoint (stateless).
 * POST /mcp  (rewritten from /api/mcp via vercel.json)
 *
 * Auth: Authorization: Bearer <API_TOKEN>  — timing-safe compare, fail-closed.
 * Protocol: JSON-RPC 2.0. Supports initialize, notifications/initialized,
 * ping, tools/list, tools/call. No sessions, no SSE — every request stands alone.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { TOOLS, TOOL_MAP } from "../lib/tools.js";

const PROTOCOL_VERSION = "2025-06-18";
const SERVER_INFO = { name: "kyle-mcp", version: "1.1.0" };
const MAX_BODY_BYTES = 256 * 1024; // 256KB request cap

// ── Auth ────────────────────────────────────────────────────────────────
function sha256(input: string): Buffer {
  return createHash("sha256").update(input, "utf8").digest();
}

function checkBearer(req: VercelRequest): { ok: true } | { ok: false; status: number; message: string } {
  const expected = process.env.API_TOKEN;
  if (!expected || expected.trim() === "") {
    // Fail closed: server refuses all traffic until configured.
    console.error(JSON.stringify({ level: "error", scope: "auth", msg: "API_TOKEN env var not set" }));
    return { ok: false, status: 503, message: "Server not configured (API_TOKEN missing)" };
  }
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return { ok: false, status: 401, message: "Missing Authorization: Bearer token" };
  }
  const provided = header.slice("Bearer ".length).trim();
  // Hash both sides to fixed length so timingSafeEqual never throws on length mismatch.
  const match = timingSafeEqual(sha256(provided), sha256(expected));
  return match ? { ok: true } : { ok: false, status: 401, message: "Invalid token" };
}

// ── CORS (preflight must run BEFORE auth — browsers omit auth on OPTIONS) ─
function corsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Mcp-Session-Id, MCP-Protocol-Version",
    "Access-Control-Max-Age": "86400",
  };
}

// ── JSON-RPC helpers ─────────────────────────────────────────────────────
type JsonRpcId = string | number | null;

const rpcMessageSchema = z.object({
  jsonrpc: z.literal("2.0"),
  id: z.union([z.string(), z.number(), z.null()]).optional(),
  method: z.string(),
  params: z.unknown().optional(),
});

function rpcResult(id: JsonRpcId, result: unknown) {
  return { jsonrpc: "2.0" as const, id, result };
}
function rpcError(id: JsonRpcId, code: number, message: string) {
  return { jsonrpc: "2.0" as const, id, error: { code, message } };
}

// ── Method dispatch ──────────────────────────────────────────────────────
async function handleMessage(msg: z.infer<typeof rpcMessageSchema>): Promise<object | null> {
  const id: JsonRpcId = msg.id === undefined ? null : msg.id;
  const isNotification = msg.id === undefined;

  switch (msg.method) {
    case "initialize": {
      return rpcResult(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: SERVER_INFO,
      });
    }
    case "notifications/initialized":
    case "notifications/cancelled": {
      return null; // notifications get no response body
    }
    case "ping": {
      return rpcResult(id, {});
    }
    case "tools/list": {
      return rpcResult(id, {
        tools: TOOLS.map((t) => ({
          name: t.name,
          description: t.description,
          inputSchema: t.inputSchema,
        })),
      });
    }
    case "tools/call": {
      const params = z
        .object({ name: z.string(), arguments: z.unknown().optional() })
        .safeParse(msg.params);
      if (!params.success) {
        return rpcError(id, -32602, "Invalid params: expected { name, arguments }");
      }
      const tool = TOOL_MAP.get(params.data.name);
      if (!tool) {
        return rpcError(id, -32602, `Unknown tool: ${params.data.name}`);
      }
      const started = Date.now();
      const result = await tool.execute(params.data.arguments ?? {});
      console.log(
        JSON.stringify({
          level: "info",
          scope: "tool",
          tool: params.data.name,
          ms: Date.now() - started,
          isError: Boolean(result.isError),
        })
      );
      return rpcResult(id, result);
    }
    default: {
      if (isNotification) return null; // ignore unknown notifications per spec
      return rpcError(id, -32601, `Method not found: ${msg.method}`);
    }
  }
}

// ── Handler ──────────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const cors = corsHeaders();
  for (const [k, v] of Object.entries(cors)) res.setHeader(k, v);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method === "GET") {
    // Stateless server: no SSE stream offered.
    res.setHeader("Allow", "POST, OPTIONS");
    res.status(405).json({ error: "Use POST with JSON-RPC 2.0. This server is stateless (no SSE)." });
    return;
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const auth = checkBearer(req);
  if (!auth.ok) {
    res.status(auth.status).json(rpcError(null, -32000, auth.message));
    return;
  }

  // Body size guard (Vercel parses JSON bodies; re-check serialized size).
  const rawSize = Buffer.byteLength(JSON.stringify(req.body ?? ""), "utf8");
  if (rawSize > MAX_BODY_BYTES) {
    res.status(413).json(rpcError(null, -32000, "Request body too large"));
    return;
  }

  const body = req.body;
  const messages: unknown[] = Array.isArray(body) ? body : [body];
  if (messages.length === 0 || messages.length > 20) {
    res.status(400).json(rpcError(null, -32600, "Invalid batch size"));
    return;
  }

  const responses: object[] = [];
  for (const raw of messages) {
    const parsed = rpcMessageSchema.safeParse(raw);
    if (!parsed.success) {
      responses.push(rpcError(null, -32600, "Invalid JSON-RPC message"));
      continue;
    }
    try {
      const out = await handleMessage(parsed.data);
      if (out !== null) responses.push(out);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "internal error";
      console.error(JSON.stringify({ level: "error", scope: "rpc", method: parsed.data.method, msg }));
      responses.push(rpcError(parsed.data.id ?? null, -32603, "Internal error"));
    }
  }

  if (responses.length === 0) {
    res.status(202).end(); // all notifications
    return;
  }
  res.status(200).json(Array.isArray(body) ? responses : responses[0]);
}
