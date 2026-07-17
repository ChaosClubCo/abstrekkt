# kyle-mcp (v1.1.0)

Remote MCP server — Streamable HTTP, stateless, Bearer-auth. Exposes 7 tools:
v0 (create/get generation), Hostinger (domains, DNS, VPS), Resend (send/get email).

Rebuilt 2026-07-07 from the June 2026 kyle-mcp-server build (original was never deployed).
OAuth consent flow from v1.0 was dropped — v1.1 is Bearer-only, which is what
Base44 MCP Connections and Claude Desktop custom headers both need.

## Endpoint
POST https://<deployment>/mcp
Header: Authorization: Bearer <API_TOKEN>

## Env vars (Vercel → Settings → Environment Variables)
- API_TOKEN (required — server returns 503 until set; generate with
  `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- V0_API_KEY, HOSTINGER_API_TOKEN, RESEND_API_KEY (per-tool; unset key → clear tool error, no crash)

## Base44 MCP Connections form
- Name: kyle-mcp
- URL: https://<deployment>/mcp
- Authentication: Not required
- Custom Header: Authorization = Bearer <API_TOKEN>

## Smoke test (deployed)
curl -sX POST https://<deployment>/mcp \
  -H "Authorization: Bearer $API_TOKEN" -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
Expect: JSON with 7 tools. Without the header: 401. Before API_TOKEN is set: 503.

## Local dev
npm i && npm run typecheck && API_TOKEN=test npx tsx scripts/smoke.mjs  # 9/9

## Notes
- Hostinger API paths (developers.hostinger.com/api/{domains,dns,vps}/v1/...) are from
  their public docs — verify against your account tier before relying on them.
- v0 Platform API base: https://api.v0.dev/v1 — verify /chats shape against current docs.
