# Source Inventory

Sampled inventory of the highest-authority docs in the 225-doc KB, plus the categories present. This is a **sampled, not exhaustive** inventory (see VALIDATION_REPORT). Docs are grouped by category with ID, status, authority, and disposition.

Status legend: CONFIRMED_CURRENT · PARTIALLY_COMPLETE · DRAFT · SUPERSEDED · CONTRADICTORY · MISSING · REQUIRES_VALIDATION
Authority: GOVERNING · HIGH · MEDIUM · LOW

## Governance / instructions

| ID | Doc | Status | Authority | Disposition |
|---|---|---|---|---|
| G1 | Abstrekkt — Project Instructions (2026-07-07) | CONFIRMED_CURRENT | GOVERNING | Keep as top authority |
| G2 | AGENTS.md / CLAUDE.md / CONTEXT.md / MEMORY.md | PARTIALLY_COMPLETE | HIGH | Keep; stack + working rules |

## Business / consulting (FlashFusion)

| ID | Doc | Status | Authority | Disposition |
|---|---|---|---|---|
| B1 | the-flashfusion-arc.jsx | CONFIRMED_CURRENT | HIGH | Keep; pricing + roadmap source. Resolve Ryan $ conflict. |
| B2 | RYAN_IRONHORSE_PROJECT_KNOWLEDGE.md | CONFIRMED_CURRENT | HIGH | Keep; active engagement |
| B3 | UNION_VP_PROJECT_INSTRUCTIONS_AND_KNOWLEDGE.md | CONFIRMED_CURRENT | HIGH | Keep; act on overdue outreach |
| B4 | CLC_PROJECT_INSTRUCTIONS.md | DRAFT (setup only) | MEDIUM | Keep; nothing sent yet |
| B5 | WorkstreamMapper.jsx | PARTIALLY_COMPLETE | MEDIUM | Keep; workstream + blocker map |
| B6 | teaching-curriculum-arc.jsx | DRAFT | MEDIUM | Keep; 3-tier training product design |
| B7 | blog-posts-agentic-ai.md / ff-agentic-os-article.html | DRAFT | LOW | Keep; positioning content |

## Legal / entity / risk

| ID | Doc | Status | Authority | Disposition |
|---|---|---|---|---|
| L1 | llc-formation-kit-v2.html | SUPERSEDED (partial) | MEDIUM | Keep procedure; **retire two-entity/Chaos-Club framing** |
| L2 | Illinois LLC Pre-Filled Forms Portfolio | REQUIRES_VALIDATION | MEDIUM | Forms only; blank signature block |
| L3 | E&O / insurance docs | MISSING | — | Does not exist; must be created |

## Software / product

| ID | Doc | Status | Authority | Disposition |
|---|---|---|---|---|
| S1 | AGENTS.md (stack + hard rules) | CONFIRMED_CURRENT | HIGH | Keep |
| S2 | Fusion AI (Base44 app, ~101 entities) | PARTIALLY_COMPLETE | MEDIUM | 11 n8n workflows blocked |
| S3 | claude-code-plugins-plus (244 plugins) | BUILT / DRAFT dist | MEDIUM | Distribution undecided |
| S4 | chaosclub.co peer-support app | PARTIALLY_COMPLETE | LOW | Firebase; migration is design-spike only |
| S5 | Ample, FissionPrompt | UNKNOWN | LOW | Named only; little detail sampled |

## Content / media / memoir

| ID | Doc | Status | Authority | Disposition |
|---|---|---|---|---|
| C1 | Load-Bearing newsletter (lb-essay-*.html) | DRAFT | MEDIUM | No public URL; platform undecided |
| C2 | Tax the Damage memoir (sudowrite_*, memoir-*.docx, *.txt arcs) | ACTIVE DRAFT | HIGH (own register) | Out of scope here by design |
| C3 | Grant/partner apps (01/02/03-*.md) | DRAFT | LOW | Anthropic Partner Network gated on LLC+cert |

## Categories present (per mega-prompt taxonomy)

Instructions ✓ · Business reqs ✓ · Technical reqs ✓ (AGENTS.md) · Architecture ✓ · Data models ✓ (Base44 entities) · APIs/integrations ✓ · Source code ✓ (.jsx artifacts) · Config ✓ · Security controls ~partial (RLS rules noted; no threat model) · Deployment ~partial · Testing/QA ✗ (little evidence) · Designs/visual ✓ (tokens) · Prompts/AI workflows ✓ · Research ✓ · Decisions ✓ (MEMORY.md) · Risks ~partial · Open questions ✓ (instructions "Open decisions") · Deprecated material ✓ (ChaosClub, llc kit) · **Missing expected artifacts:** E&O policy, signed MSA, filed Articles, test suite, threat model, Load-Bearing live URL.
