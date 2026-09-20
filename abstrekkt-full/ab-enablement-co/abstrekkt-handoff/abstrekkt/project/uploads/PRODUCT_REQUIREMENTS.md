# Product Requirements — Software line

**TL;DR:** The software line (Fusion AI on Base44, claude-code-plugins-plus, chaosclub.co, Ample, FissionPrompt) is real but secondary to consulting revenue. Requirements here are captured for continuity; none is on the current critical path.

## Fusion AI (app.flashfusion.co)

- **What:** Base44 agent platform. ~101 entities accumulated over multiple build phases. n8n automation layer. [SOURCED — WorkstreamMapper.jsx, AGENTS.md]
- **Base44 app IDs:** Fusion AI `68dd8e79ca073475565c8e16`; FF Consulting `6a02ac1bad2b4e37732ef382`. [SOURCED — WorkstreamMapper.jsx]
- **Blocked:** 11 n8n workflows blocked on (a) Base44 Bearer credentials, (b) SCH-02 lane field, (c) 4 orphan WIR-01 duplicates. [SOURCED — WorkstreamMapper.jsx]
- **Debt:** unknown count of dead/orphaned entities inflating schema + slowing agent context loads. Requirement: cross-reference 101 entities against active n8n references + API surface; flag zero-reference entities; archive after confirmation. **Do not delete before confirmation.** [SOURCED — WorkstreamMapper.jsx]
- **Requirement (hard rules from AGENTS.md):** never commit secrets/.env; never disable Supabase RLS; never modify applied migrations without instruction; all writes idempotent; no placeholder content — surface the gap.

## FF Consulting ops (client.flashfusion.co)

- **What:** Base44 consulting ops CRM + HubSpot. Live consulting ops surface. [SOURCED — WorkstreamMapper.jsx]
- **Open requirement:** CFO-facing ROI cost model (team size + task distribution → monthly AI cost at low/med/high tiers + payback). Closes the CFO objection; host at client.flashfusion.co/roi or embed in proposal. [SOURCED — WorkstreamMapper.jsx]

## claude-code-plugins-plus

- **What:** 244 plugins, built. [SOURCED — instructions]
- **Requirement:** choose ONE distribution path (marketplace / blog / direct / Anthropic) — currently undecided and blocking any go-to-market. [SOURCED — instructions]
- **Rule:** never present the plugin/MCP catalogue count as "mastered tools." [SOURCED — instructions]

## chaosclub.co (peer-support platform)

- **What:** peer-support app (explicitly NOT lyrics/audio/music). React 19 + Vite + TypeScript + Firebase + Cloudflare R2 + Stripe + PostHog. Firestore: 10 collections, R2 signed-URL premium audio gating, Stripe webhook idempotency, soft-delete. No strict mode, no Zod, PostHog untaxonomied. [SOURCED — WorkstreamMapper.jsx]
- **Open requirement:** Firebase→Supabase migration is a **design spike only** — map auth providers, Firestore collections, security rules; estimate effort; produce a go/no-go doc. Do not migrate before costing. [SOURCED — WorkstreamMapper.jsx]
- **! Naming open question:** relationship of the `chaosclub.co` domain to the retired ChaosClubCo brand is unresolved (see SUPERSEDED_MATERIAL.md).

## Ample, FissionPrompt

- Named in the instructions as products; little detail sampled this session. Status UNKNOWN. Requirement: document scope/status before treating as portfolio. [SOURCED — instructions] [GENERATED — gap]

## kidcreator / StoryWeaver

- **Personal gift project for Kyle's daughter.** Hosted in the org but **NOT commercial portfolio — never market it.** Hard rule. [SOURCED — instructions]

## Cross-cutting product rules

- HITL (human-in-the-loop) checkpoints required for consequential/irreversible agent actions in any client-facing agent (approval queue pattern). [GENERATED — inferred from designing-hitl-workflows skill + client-trust rule]
- Provider posture: Anthropic API (claude-sonnet-4-6 default; opus for max tier) primary; Gemini on chaosclub.co; OpenAI status TBC. No unified cost view or provider-abstraction layer yet. [SOURCED — WorkstreamMapper.jsx]
