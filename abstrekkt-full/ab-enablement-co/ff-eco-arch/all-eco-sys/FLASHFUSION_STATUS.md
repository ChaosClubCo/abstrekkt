# FlashFusion — Stack Status & Context

> Source of truth for what FlashFusion actually is right now. Drop this into Project Knowledge so sessions (Claude, GPT, or anyone auditing assets) don't hallucinate a greenfield Next.js MVP when the production stack already exists elsewhere.

---

## What FlashFusion is

A cinematic AI platform for building, orchestrating, and deploying autonomous agents. Positioning layer: "idea → execution without switching tools." The product spans multiple surfaces — not a single Next.js app.

---

## Actual production stack

| Layer | Platform | Status |
|---|---|---|
| Agent platform | **Base44 (Fusion AI)** — app ID `68dd8e79ca073475565c8e16` | Live, ~101 entities |
| Workflow engine | **n8n** at `krosebrook.app.n8n.cloud` | Live |
| Storefront / marketing | **Wix** | Live — 20 products, 10 collections, persona coupons configured |
| Payments | **Stripe** | Configured |
| Storage | **Cloudflare R2** | Configured |
| Analytics | **PostHog** | Configured |
| Auth / DB | **Supabase** | Configured |
| LLM routing | Claude + Gemini + ChatGPT | Multi-provider, active |
| Landing page hero | WebGL2 shader (Poppins 800/900) in `standalone.html` + `FlashFusionHero.jsx` | Production-grade, ships to React / WordPress / Wix Velo |

---

## Related brands (DO NOT MERGE)

Each has its own design system and production stack. Don't share tokens, design files, or architectural decisions across them.

| Brand | Aesthetic | Stack |
|---|---|---|
| **FlashFusion** | Neon-glass, dark-mode, violet+cyan, Poppins + Inter | Base44 + n8n + Wix |
| **chaosclub.co** | Reading Room at Midnight — dark editorial, warm serif | React 19 + Vite + Firebase + R2 + Gemini + Stripe |
| **kylerosebrook.com** | Monochromatic dark cinematic (`#FFFFFF / #EEEEEE / #BBBBBB / #1E1E1E / #000000`) | Personal portfolio |

---

## What NOT to recommend

These come up repeatedly in external audits. Reject them:

- **"Build a Next.js 14 MVP with /dashboard, /projects, /workspace, /agents"** — Base44 is the agent runtime. Don't duplicate it.
- **"Connect ONE AI provider"** — Claude + Gemini + ChatGPT are already routed.
- **"Add Supabase/Clerk auth"** to the landing page — landing is a marketing surface with no auth surface; auth lives at the Base44/Wix/Stripe layers.
- **"You need a working CLI-like experience first"** — Fusion AI is already that experience. The critique applies to landing-page CTAs, not product existence.
- **Typography claims involving Instrument Serif, Geist, or Geist Mono** — these are not in the FlashFusion system. The real fonts are **Poppins (display, 800/900)** and **Inter (body, 400–700)**.
- **Magenta in the palette** — not present. Accent is violet `#8B5CF6` and cyan `#06B6D4`.

---

## Known real issues (worth fixing)

These are legitimate, not hallucinations:

1. **Landing page CTA dead-ends.** If "Start Building" / "Deploy Agent" buttons on the marketing site don't route into Fusion AI on Base44, that's a real trust break for technical visitors. Audit and wire them to the Base44 app.
2. **"Worlds collide" metaphor is under-used.** Left=ideation / right=execution / center=transformation maps cleanly to the actual Base44 → n8n → output pipeline. Could anchor onboarding.
3. **Shader hero should self-host Poppins** if deployed under strict CSP (currently loads from Google Fonts CDN).
4. **No error-state palette defined.** DESIGN.md uses placeholder values (`#F87171` error, `#FBBF24` warning) that should be validated against the Base44 UI's existing error colors to avoid drift.

---

## Files in this project

| File | Purpose |
|---|---|
| `DESIGN.md` | Brand system for Claude Design (`claude.ai/design`). Upload to project context there. |
| `FLASHFUSION_STATUS.md` | This file. Stack reality. Prevents hallucinated MVP recommendations. |
| `standalone.html` | Production WebGL2 hero — drops into WordPress, Wix, iframe, or Next.js. |
| `FlashFusionHero.jsx` | React component version of the hero. |
| `README.md` | Hero integration docs (React / WordPress / Wix Velo). |

---

## Legacy docs (may be stale)

- `START_HERE.md` and the broader "Next.js 14 + Sanity + Supabase" implementation bundle describe a greenfield studio build that doesn't match the current Base44/Wix/n8n production stack. Treat as reference material or a future migration path, not current architecture. Do not hand to a new contributor as "the plan" without calling that out.
