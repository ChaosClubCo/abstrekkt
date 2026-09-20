/* ============================================================
   KR MENTOR — secret-keeping backend proxy
   Deploy this ONCE, paste its URL into the mentor:
   Settings → Connections → "Backend proxy URL".

   WHY: Notion, GitHub, Google, Microsoft, MCP servers, etc.
   authenticate with SECRET keys or OAuth. Those secrets must
   never live in the browser/site. This tiny proxy holds them
   server-side, checks a shared token, and forwards requests.

   ── Deploy options ──────────────────────────────────────────
   CLOUDFLARE WORKERS (recommended, free):
     1. npm i -g wrangler && wrangler login
     2. wrangler init kr-proxy  (paste this as src/index.js)
     3. Set secrets:
          wrangler secret put PROXY_TOKEN
          wrangler secret put NOTION_TOKEN
          wrangler secret put GITHUB_TOKEN
          ...one per upstream you use
     4. wrangler deploy  →  https://kr-proxy.<you>.workers.dev

   VERCEL (Edge Function): export default handler from
     api/proxy.js, read secrets from process.env, same logic.

   SUPABASE EDGE FUNCTION: deno serve(handler), read secrets
     from Deno.env.get(...), same logic.

   ── How the mentor calls it ─────────────────────────────────
   POST {proxyUrl}/call
     headers: { authorization: "Bearer <PROXY_TOKEN>" }
     body: {
       target: "notion" | "github" | "google" | "mcp" | "url",
       method: "GET" | "POST" | ...,
       path: "/v1/pages",          // appended to the target base
       url: "https://...",         // used when target == "url"
       headers: { ... },           // extra request headers
       body: { ... }               // forwarded as JSON
     }
   The proxy injects the right Authorization header from its
   server-side secret so the key is never exposed to the client.
   ============================================================ */

const CORS = {
  "Access-Control-Allow-Origin": "*",            // tighten to your site origin in prod
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, content-type",
};

// Map a logical target → { base URL, header that carries the secret }
function upstream(target, env) {
  switch (target) {
    case "notion":
      return { base: "https://api.notion.com", inject: { "Authorization": "Bearer " + env.NOTION_TOKEN, "Notion-Version": "2022-06-28" } };
    case "github":
      return { base: "https://api.github.com", inject: { "Authorization": "Bearer " + env.GITHUB_TOKEN, "Accept": "application/vnd.github+json" } };
    case "google":
      return { base: "https://www.googleapis.com", inject: { "Authorization": "Bearer " + env.GOOGLE_TOKEN } };
    case "microsoft":
      return { base: "https://graph.microsoft.com", inject: { "Authorization": "Bearer " + env.MS_TOKEN } };
    case "openai":
      return { base: "https://api.openai.com", inject: { "Authorization": "Bearer " + env.OPENAI_API_KEY } };
    case "mcp":
      return { base: env.MCP_URL, inject: { "Authorization": "Bearer " + env.MCP_TOKEN } };
    default:
      return null; // target "url" = arbitrary passthrough (no secret injected)
  }
}

async function handle(request, env) {
  if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
  if (request.method !== "POST") return json({ error: "POST only" }, 405);

  // shared-token gate
  const auth = request.headers.get("authorization") || "";
  if (!env.PROXY_TOKEN || auth !== "Bearer " + env.PROXY_TOKEN) return json({ error: "unauthorized" }, 401);

  let req;
  try { req = await request.json(); } catch { return json({ error: "bad json" }, 400); }

  let targetUrl, headers = { "Content-Type": "application/json", ...(req.headers || {}) };
  if (req.target === "url") {
    if (!req.url) return json({ error: "url required" }, 400);
    targetUrl = req.url;
  } else {
    const u = upstream(req.target, env);
    if (!u || !u.base) return json({ error: "unknown target: " + req.target }, 400);
    targetUrl = u.base + (req.path || "");
    headers = { ...headers, ...u.inject };
  }

  const init = { method: req.method || "GET", headers };
  if (req.body != null && init.method !== "GET") init.body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);

  const upstreamRes = await fetch(targetUrl, init);
  const text = await upstreamRes.text();
  return new Response(text, {
    status: upstreamRes.status,
    headers: { ...CORS, "Content-Type": upstreamRes.headers.get("content-type") || "application/json" },
  });
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), { status: status || 200, headers: { ...CORS, "Content-Type": "application/json" } });
}

// Cloudflare Workers entrypoint
export default { fetch: handle };

// Vercel/Node note: export a handler that adapts (req,res) to the above,
// or copy the body of handle() into your framework's function signature.
