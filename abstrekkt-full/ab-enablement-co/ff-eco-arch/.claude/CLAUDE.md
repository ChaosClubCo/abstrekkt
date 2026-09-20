# ff-eco-arch — AI Context Snapshot

> Generated 2026-06-17 by `/goal`. AI-facing index for the freelance FlashFusion
> eco-architecture project. Authoritative status lives in `PROJECT_STATE.md`;
> the canonical lane-organized drop has its own governing `current-canonical/CLAUDE.md`.

## Human Summary

`ff-eco-arch` is Kyle Rosebrook's freelance **FlashFusion ecosystem architecture** project —
the planning/deliverable hub for the FlashFusion B2B AI-enablement business (AI Setup Audits,
Enablement Sprints, SparkAcademy, Fusion AI) plus adjacent INT Inc. consulting artifacts.

It is a **docs + deliverables hub, not a single buildable app.** The root holds the authoritative
architecture and state docs (`FLASHFUSION_ECOSYSTEM_ARCHITECTURE.md`, `PROJECT_STATE.md`) and
SparkAcademy launch assets (`sparkacademy-*`, `n8n-workflow-specs.md`, `mcp-portfolio-inventory.md`,
`ff-ecosystem-command-center.html`). Two large subtrees carry the working material:
`current-canonical/` (a lane-organized "canonical" drop with its own `CLAUDE.md` and a strict
6-lane operating model) and `all-eco-sys/` (an older mixed staging dump of HTML toolkits, prompt
systems, agent specs, `.txt` exports, and media). Real buildable units are isolated and nested —
e.g. `current-canonical/flashfusion/16-agent-system/` (production multi-agent MCP platform) and
`all-eco-sys/HTML/extraction-engine/` (Docker + observability stack) — each with its own config.

The single most important rule is **lane separation**: work belongs to exactly one of six lanes
that must never bleed into each other. Confirm the lane before acting.

## AI Context

```yaml
project:
  name: ff-eco-arch
  purpose: >-
    Freelance FlashFusion ecosystem architecture + deliverables hub — planning, state,
    and assets for the FlashFusion AI-enablement business (Audits, Enablement Sprints,
    SparkAcademy, Fusion AI) plus INT Inc. consulting artifacts. Docs hub, not one app.
  owner: Kyle Rosebrook <kylerosebrook@gmail.com>
  lane: FlashFusion (freelance); also Intinc / ChaosClubCo / Memoir / Kinsley / Personal Brand
  visibility: private
scope:
  type: docs-and-deliverables-hub
  authoritative_status: PROJECT_STATE.md (updated through 2026-06-02)
stack:
  language: n/a at root (Markdown + HTML + .txt + media)
  platform: Base44 + Supabase + n8n + Anthropic API (claude-sonnet-4) + Resend + Stripe + Cloudflare + Vercel
  nested_buildable:
    - current-canonical/flashfusion/16-agent-system/  # production multi-agent MCP platform (own CLAUDE.md)
    - all-eco-sys/HTML/extraction-engine/             # Docker Compose + Prometheus/Grafana/Loki/Tempo
    - all-eco-sys/HTML/studio-web-app/                # web app package
structure:
  entryPoint: FLASHFUSION_ECOSYSTEM_ARCHITECTURE.md
  keyFiles:
    - PROJECT_STATE.md                 # authoritative project status; verify public claims against it
    - mcp-portfolio-inventory.md
    - n8n-workflow-specs.md
    - ff-ecosystem-command-center.html
    - sparkacademy-*.md / .html         # catalog, pricing, launch copy, recommendation engine
  keyFolders:
    - current-canonical/               # lane-organized canonical drop — GOVERNED BY ITS OWN CLAUDE.md
    - all-eco-sys/                      # older mixed staging dump (HTML, prompts, agents, exports, media)
nested_authority:
  - current-canonical/CLAUDE.md                              # lane system + authority order; overrides root inside that tree
  - current-canonical/flashfusion/16-agent-system/agents-project/CLAUDE.md  # Tessa routing + approval gates
  - current-canonical/memoir/cowork-session/CLAUDE.md        # memoir lane (highly sensitive)
constraints:
  - LANE SEPARATION is the prime rule — 6 lanes (Intinc, FlashFusion, ChaosClubCo, Memoir, Kinsley,
    Personal Brand) must not bleed context, assets, or voice into each other. Confirm lane first.
  - NEVER name Kyle's employer in any output; INT has no knowledge of FlashFusion/ChaosClubCo.
  - Secrets are placeholders only ({SECRET_NAME}); never embed real keys, never in client-side React.
  - Content integrity: verify public claims against PROJECT_STATE.md; $4,500 price floor; no title inflation.
  - Operational blockers (as of state doc): Supabase bill overdue (avoid Supabase-dependent features);
    Vercel GitHub App connection broken (manual reconnect needed).
  - Not a single repo: no root build/test/lint. Start from nested CLAUDE.md/INDEX.md, not a tree scan.
links:
  architecture: ./FLASHFUSION_ECOSYSTEM_ARCHITECTURE.md
  state: ./PROJECT_STATE.md
  canonicalDrop: ./current-canonical/CLAUDE.md
  stagingDump: ./all-eco-sys/HTML/INDEX.md
  commandCenter: ./ff-ecosystem-command-center.html
```
