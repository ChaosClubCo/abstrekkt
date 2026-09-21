# Security Remediation — FlashFusion Figma Make exports

_Scope: API-key sanitisation and production-readiness for the security-critical
findings in the three audited files. Architectural cleanup (broken imports,
duplicate trees, doc bloat, branding) is tracked separately in the audit dossier._

---

## 0. Secret scan result

A literal-value scan of all recovered source found **no real, live secrets
committed** — every match is a placeholder (`sk-ant-...`, `eyJ...`),
a host secret reference (`@supabase_service_role_key`), or a test fixture.

**However**, the *patterns* in the code would leak real keys the moment they are
filled in. That is what this package fixes.

> ⚠️ If you ever pasted real keys into the Figma Make chat, or set them in any
> deployed build, **rotate them now** (Anthropic, OpenAI, GitHub, Stripe,
> Supabase service-role). Treat them as exposed.

---

## 1. The one rule that prevents 90% of leaks

> `NEXT_PUBLIC_*` and `VITE_*` variables are compiled **into the browser bundle**.
> They are public. **Never** give a secret one of those prefixes.

Secrets (LLM keys, GitHub token, Stripe secret, Supabase **service-role**) live
only on the server and are reached through a backend proxy.

---

## 2. What changed, file by file

### File 03 — Website
| Issue | Fix | Drop-in |
|---|---|---|
| `lib/env.ts` exposed Anthropic/OpenAI/GitHub/Stripe-secret/service-role keys to the browser | Rewrote to expose **public values only** + a Proxy that **throws** if any secret name is read client-side | `remediation/website/lib/env.ts` |
| `.env` templates promoted `VITE_ANTHROPIC_API_KEY` etc. | New template splits **public vs server-only**; no secret is prefixed | `remediation/website/.env.example` |
| CSP allowed `unsafe-inline` + `unsafe-eval` | Per-request **nonce** + `strict-dynamic`; added HSTS, Permissions-Policy | `remediation/website/apps/site/middleware.ts` |
| `submitLead` already correct | _no change_ — keep it as the reference pattern | — |

### File 02 — Enterprise Profile Builder
| Issue | Fix | Drop-in |
|---|---|---|
| In-browser Anthropic SDK with `process.env.ANTHROPIC_API_KEY` | Replaced with a **proxy client** holding no key, calling your backend with a bearer token | `remediation/enterprise/src/lib/api/claude-client.ts` |
| Proxy had `origin:"*"` + spoofable `x-user-id` | **CORS allowlist** + **real token auth**; user id derived from the verified token; rate-limit keyed on it | `remediation/enterprise/supabase/functions/server/index.tsx` |
| `prompt-injection-defense.ts` returns a mock & is bypassed | _Out of scope here_ — either wire it to the proxy or delete it (see dossier). Do **not** rely on it as-is. | — |

### Both
- `.gitignore` that blocks every `.env*` except the examples → `remediation/.gitignore`
- `.env.example` files you can commit safely.

---

## 3. Apply it (checklist)

1. **Rotate** all credentials that may have been used in any build/chat.
2. Copy the drop-in files over their originals (paths mirror each repo).
3. Add `.gitignore`; delete any committed `.env` from git history
   (`git rm --cached .env`; consider `git filter-repo` if it was ever pushed).
4. Move every secret into your host's encrypted env UI
   (Vercel / Netlify / Render / Supabase) — never a committed file.
5. Set `ALLOWED_ORIGINS` on the Supabase function to your real domains.
6. Point all client LLM calls at the proxy (`askClaude` / `streamClaude`).
7. Keep the gitleaks CI workflow (File 03 already has one) and run it on every PR.
8. Verify in DevTools → Sources that no `sk-`, `ghp_`, or service-role string
   appears in the shipped bundle.

---

## 4. Still open (not security, but needed for "production")

These are in the audit dossier, not fixed here:
- File 01: ghost router importing 7 non-existent pages; `cursor:none`; forced boot.
- File 02: duplicate `/features` vs `/src/features`; 3 copies of types.
- File 03: abandoned Vite `src/core` app; off-domain audio-marketplace components.
- All: ~100 markdown phase-logs; three unrelated brand systems.
