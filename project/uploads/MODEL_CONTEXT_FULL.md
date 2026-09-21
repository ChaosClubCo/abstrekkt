# Model Context Package — Abstrekkt (FULL)

> Paste this into another AI (Claude / ChatGPT / Gemini) to continue Abstrekkt work without rediscovery. Self-contained. As of 2026-07-11.

## 1. Identity
Abstrekkt (abstrekkt.com, domain purchased 2026-06-06) — solo-founder holding org, Kyle Rosebrook, Grayslake IL. Absorbs and **permanently retires** ChaosClubCo / Chaos Collective (never use those names in external copy). FlashFusion (flashfusion.co) is the revenue engine under it.

## 2. Objective
Stand up a solo AI-enablement consultancy to first revenue under a clean brand, without incurring personal legal/IP liability. Current booked revenue: **$0.**

## 3. Current state (2026-07-11)
- Brand LOCKED, offer defined, stack built, pipeline mapped.
- **Blocked from earning** by: LLC filing unconfirmed, E&O insurance not started, employment-IP review not done. Two active *free* engagements (Art, Ryan). Union VP outreach overdue.
- Certification exam 2026-07-20 (may not claim credential before pass).

## 4. Structure
- **Abstrekkt** — parent.
- **FlashFusion** — B2B AI enablement. Audit ($4,500 floor) → sprint → retainer → vCAIO; training per-cohort/seat. Champion model: train one domain expert per vertical, document workflows, exit dependency.
- **Software:** Fusion AI (Base44, ~101 entities, app.flashfusion.co), FF Consulting CRM (client.flashfusion.co), claude-code-plugins-plus (244 plugins, distribution undecided), chaosclub.co (peer-support, Firebase), Ample, FissionPrompt. kidcreator/StoryWeaver = personal gift, never market.
- **Content:** Load-Bearing newsletter (no public URL yet). Memoir *Tax the Damage* (separate register, out of scope here).

## 5. Architecture
TypeScript/React 19 + Vite · Supabase (Postgres/Auth/RLS) · Cloudflare (Workers/Pages/R2/CDN/DNS) · n8n orchestration · Base44 apps · Stripe · PostHog · Sentry · Resend · HubSpot · Notion. Model: Anthropic API (claude-sonnet-4-6 default; opus max tier); Gemini on chaosclub.co; OpenAI TBC. Outlier: chaosclub.co on Firebase.

## 6. Key requirements & hard rules
- $4,500 audit floor is structural; **one** documented pricing exception max (Ryan) — no growth without a written boundary doc.
- No paid contract before Milestone 0 (LLC + EIN + bank + IP clearance + E&O + MSA).
- Solo founder; no partners unless offer heavily in Kyle's favor.
- Absolute lane separation from the day job (an unnamed managed IT firm — never named externally; "a managed IT firm" is the ceiling).
- No credential claim before 2026-07-20 pass; never any degree-based claim.
- Never inflate tools: ~30 hands-on; "240+" = catalogued MCP configs, never "mastered."
- Software: never commit secrets; secrets server-side/env only; never disable RLS; migrations immutable; writes idempotent; no placeholders — surface gaps.

## 7. Source-of-truth rules
Governing doc = "Abstrekkt — Project Instructions" (2026-07-07). It outranks all older artifacts. Newest file ≠ authoritative; use SOURCE_OF_TRUTH.md. Older artifacts (llc-formation-kit-v2.html) supplement procedure but are superseded on the two-entity/ChaosClub framing.

## 8. Decisions already locked
Abstrekkt brand + retirement of ChaosClub; "Reading Room at Midnight" palette (ink #1C1917, brass #C8A86A; Fraunces/Crimson Pro/JetBrains Mono); FlashFusion separate void-dark system; $4,500 floor; solo model; lane separation; E&O-before-paid; RLS/secret rules.

## 9. Constraints / open external dependencies (Kyle-only, cannot be automated)
IL SOS filing search, LLC filing, EIN, bank account, attorney review, E&O binding. This package cannot close these.

## 10. Completed work (this package)
Consolidated inventory, source-of-truth map, business+product requirements, architecture, dependency map, roadmap, pre-revenue-blocker plan, production-readiness review, 5 risk registers + contradiction/decision/open-loop logs, this context package.

## 11. Remaining work (priority order)
1. Employment-IP attorney review (B-4). 2. LLC filing confirmation (B-1) → EIN → bank. 3. E&O quotes → bind (B-5). 4. Send Union VP outreach. 5. Ryan boundary doc (+ resolve free-vs-$3,000). 6. Sit exam 2026-07-20. 7. First paid audit at $4,500. Then: cap decision, CLC contact, then product/content tracks.

## 12. Known risks
CRITICAL: signing before entity/E&O/IP clear; employer IP claim. HIGH: floor collapse on first client; Union opportunity decay; client-agent harm without HITL; secret/RLS. See RISK_REGISTER.md.

## 13. Contradictions (do not silently resolve)
- **! Ryan exception: free (instructions) vs $3,000 (flashfusion-arc).** Treat as free pending the boundary doc.
- **! ChaosClub Co. LLC** in the LLC kit — obsolete; ignore.
- **! chaosclub.co** live domain vs retired brand — open question.
- Certification naming drift (CCA / CCA-F / Anthropic Academy) — reconcile at pass.

## 14. Terminology
Champion model; audit/sprint/retainer/vCAIO ladder; the floor ($4,500); Milestone 0 ("safe to earn"); lane separation; "Reading Room at Midnight"; Load-Bearing; Fusion AI; the boundary doc.

## 15. File map
See README.md. Core: 00-executive (summary/status/DoD/path), 04-implementation/PRE_REVENUE_BLOCKERS.md (the gate), 07-decisions-and-risks (all registers), 09-handoff (this + continuation prompt).

## 16. Instructions for the next model
Read in source-of-truth order (README → SOURCE_OF_TRUTH → registers). Preserve locked decisions unless new evidence warrants change. Continue from "remaining work." Validate before modifying. Record new decisions/assumptions. Update open-loop + risk registers. No placeholders. Keep [SOURCED]/[GENERATED]/! provenance tags.

## 17. Prohibited assumptions
Do NOT assume the LLC is filed, E&O is bound, the IP review is done, or the certification is passed. Do NOT invent clients, revenue, dates, approvals, or metrics. Do NOT resurface ChaosClub names. Do NOT claim the certification. Do NOT treat "240+" tools as mastered. Do NOT name the day-job employer.

## 18. Definition of done (near-term)
Milestone 0 (safe to earn) closed → first paid audit at $4,500, no exception, delivered, case study captured.
