/**
 * Hardened Claude proxy (Supabase Edge Function / Deno + Hono).
 *
 * Fixes over the original:
 *   1. CORS locked to an explicit allowlist (no `origin: "*"`).
 *   2. Real authentication — caller must present a valid Supabase access token;
 *      the user id is derived from the verified token, NOT a spoofable header.
 *   3. Per-user rate limiting keyed on the *verified* user id.
 *   4. The Anthropic key is read from server env only and never returned.
 */

import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";
import { claudeService } from "./claude_service.ts";

const app = new Hono();
app.use("*", logger(console.log));

// 1) Lock CORS to known origins.
const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
  .split(",").map((s) => s.trim()).filter(Boolean);

app.use("/*", cors({
  origin: (origin) => (ALLOWED_ORIGINS.includes(origin) ? origin : ""),
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["POST", "OPTIONS"],
  maxAge: 600,
}));

// Server-side Supabase client used only to verify tokens.
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,   // server-only secret
);

// 2) Auth middleware — verify the bearer token, attach the real user id.
async function requireAuth(c: any, next: any) {
  const auth = c.req.header("Authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return c.json({ error: "Missing bearer token" }, 401);

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return c.json({ error: "Invalid or expired token" }, 401);

  c.set("userId", data.user.id);   // trusted identity
  await next();
}

app.get("/make-server/health", (c) => c.json({ status: "ok" }));

app.post("/make-server/chat", requireAuth, async (c) => {
  try {
    const userId = c.get("userId") as string;

    // 3) Rate limit on the verified user id (20 req / min).
    const key = `ratelimit:${userId}`;
    const now = Date.now();
    const rl = (await kv.get(key)) ?? { count: 0, resetAt: now + 60_000 };
    if (now > rl.resetAt) { rl.count = 0; rl.resetAt = now + 60_000; }
    if (rl.count >= 20) return c.json({ error: "Rate limit exceeded" }, 429);
    rl.count++;
    await kv.set(key, rl);

    const { prompt, systemPrompt, model, temperature, maxTokens, stream } = await c.req.json();
    if (typeof prompt !== "string" || prompt.length === 0) {
      return c.json({ error: "`prompt` is required" }, 400);
    }
    if (prompt.length > 50_000) {
      return c.json({ error: "`prompt` too large" }, 413);
    }

    if (stream) {
      const body = await claudeService.streamMessage(prompt, systemPrompt, model, temperature, maxTokens);
      return new Response(body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    const response = await claudeService.sendMessage(prompt, systemPrompt, model, temperature, maxTokens);
    return c.json(response);
  } catch (err: any) {
    console.error("Chat error:", err);
    // Never leak internal error detail to the client.
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

Deno.serve(app.fetch);
