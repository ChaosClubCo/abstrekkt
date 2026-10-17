# KR Mentor — Backend Proxy (deploy package)

A tiny secret-keeping proxy so the mentor can reach **Notion, GitHub, Google,
Microsoft, MCP servers, OpenAI** — APIs whose secret keys must never live in
your browser/site. The proxy holds the secrets server-side, checks a shared
token, and forwards the request.

> I can't deploy this for you — it runs under *your* cloud account and the CLI
> login happens on your machine. Pick one path below; each is ~3 commands.

---

## Option A — Cloudflare Workers (recommended, free tier)

```bash
cd proxy-deploy
npm install
npx wrangler login            # opens browser, authorizes YOUR account

# set your secrets (you'll be prompted to paste each value)
npx wrangler secret put PROXY_TOKEN     # invent a long random string — you'll paste this into the mentor
npx wrangler secret put NOTION_TOKEN    # only the upstreams you actually use
npx wrangler secret put GITHUB_TOKEN
# ...GOOGLE_TOKEN, MS_TOKEN, OPENAI_API_KEY, MCP_TOKEN as needed

npx wrangler deploy
```

`deploy` prints your URL, e.g. `https://kr-mentor-proxy.<you>.workers.dev`.

## Option B — Vercel

1. Move `src/index.js` to `api/proxy.js` and adapt the export to a Vercel
   handler (the logic in `handle()` is framework-agnostic).
2. `vercel` → follow prompts.
3. Add the same secrets in **Project → Settings → Environment Variables**.
4. URL: `https://<project>.vercel.app/api/proxy`.

## Option C — Supabase Edge Function

1. `supabase functions new kr-proxy` and paste the `handle()` logic into a
   `Deno.serve(handler)` wrapper.
2. `supabase secrets set PROXY_TOKEN=... NOTION_TOKEN=...`
3. `supabase functions deploy kr-proxy`.

---

## Wire it into the mentor

1. Open any KR page → unlock the mentor → **Settings → Connections**.
2. Paste your deployed URL into **Backend proxy URL** and Save.
3. Store the upstream keys you set as secrets in **Settings → Keys** too (for
   reference); the *real* calls use the server-side copies in the proxy.

## Lock it down (do this before real use)

- In `src/index.js`, change `Access-Control-Allow-Origin: "*"` to your exact
  site origin so only your site can call the proxy.
- Keep `PROXY_TOKEN` long and secret. It's the only thing standing between the
  internet and your injected credentials.
- Rotate any key you ever pasted into a browser vault — treat those as exposed.

## Call shape (reference)

```
POST {proxyUrl}
  authorization: Bearer <PROXY_TOKEN>
  body: { "target": "notion", "method": "POST", "path": "/v1/pages", "body": { ... } }
```
`target: "url"` does an arbitrary passthrough with no secret injection.

`path` contract for named targets: a non-empty `path` must start with `/` and must
resolve on the target's origin, or the proxy answers 400 before any upstream call.
The one exception: an omitted, `null`, or empty `path` means the upstream root.
