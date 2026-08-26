# AI Grant Application — FlashFusion
### Nat Friedman + Daniel Gross | Batch 4
**Applicant:** Kyle Rosebrook | kyle@flashfusion.ai  
**Company:** FlashFusion | flashfusion.ai  
**Date:** June 2026

---

## Who are you, and what are you building?

I am a service desk L1 technician at a managed IT firm by day, and the founder of FlashFusion by everything else. No CS degree. No institutional affiliation. Self-taught, starting from zero, building in the margins of a day job.

FlashFusion is an enterprise AI agent platform built around a single problem: organizations are deploying AI agents without any infrastructure to prove what those agents are doing. No audit trail. No access controls. No compliance evidence. When the SOC 2 auditor asks, they have nothing.

The platform has three layers: Builder (configure agents with permissions and guardrails), Runtime (execute with full trace logging), and Trust (auto-generate compliance artifacts on demand — SOC 2 CC6, ISO 27001, formatted and auditor-ready).

It is built Claude-native from day one. Every tool call in FlashFusion goes through MCP. Every call is logged with typed inputs, outputs, actor IDs, and decision rationale. The audit trail is not a feature we bolted on. It is the architecture.

---

## What problem are you solving, and why does it matter?

On January 31, 2026, Moltbook — a vibe-coded productivity app — exposed 1.5 million API authentication tokens and 35,000 email addresses within days of launch. Root cause: Supabase database with Row Level Security disabled. The founder's statement: "I didn't write a single line of code."

I had already written the playbook for building that exact product category without that happening.

That is not a lucky coincidence. It is what happens when the person responsible for how a 200-person organization deploys AI thinks about these problems seriously and ahead of the incident. I am not an AppSec title. I apply AppSec methodology because someone had to.

The problem is not that companies are using AI. The problem is that they are deploying AI agents — systems that take real actions in real systems — without any of the governance infrastructure that every other enterprise software category requires. SOC 2 Type 2 audits are now explicitly asking about AI controls. ISO 27001:2022 added AI risk clauses. The SEC and EU AI Act are moving fast.

Every AI platform being built right now is a productivity story. FlashFusion is a compliance story. That is not a niche — it is the constraint that determines whether any of these deployments are legally defensible.

---

## What have you already built?

FlashFusion is live and demonstrable:

- **audit.flashfusion.co** — consulting ops front door, live via Cloudflare CNAME
- **app.flashfusion.co** — Fusion AI platform, Base44, closed beta (app ID: 68dd8e79ca073475565c8e16)
- **Compliance Copilot** — reference agent that parses SOC 2 policy docs, queries audit logs, generates a SOC 2 CC6.1 artifact from a live execution trace in under 6 minutes
- **MCP-native tool architecture** — ToolRouter enforces PermissionSet before every tool call; audit trail captures tool name, structured input, output summary, decision rationale, timestamp
- **244-plugin Claude Code skill library** — built and catalogued across four architectural layers: Spec-driven, Orchestration, Memory, Security

The stack: Claude (Anthropic), MCP, Supabase with RLS-enforced multi-tenant isolation, Cloudflare Workers, Vercel, Base44.

Prior builds that established the foundation: Flash-n-Frame (React 19 / Express 5 / Cloudflare Workers, 529+ unit tests before strategic shelving); INT Institutional Hub v1.0 (shipped and live at Intinc); The Prompt newsletter (three-tier audience architecture for a 200-person organization).

---

## Why are you the right person to build this?

Most AI compliance tools are being built by people who understand compliance but have never deployed an AI agent in a real organizational context. Or by people who understand AI but have never sat across from an auditor.

I have been the person in the room when the IT decision gets made. I have been the person who found and patched Row Level Security violations in production before they became breaches. I have been the person who explained warehouse robotics and API key exposure risk to a non-technical business owner at a bar, without a deck or a title, and watched him understand it.

The diagnostic skill that matters here is not "can you build a compliance tool." It is "can you see the failure mode before it happens." I saw Moltbook before Moltbook happened. I am building the infrastructure that makes that failure mode preventable at scale.

Self-taught is not a limitation. It is the evidence that I built this because I saw a real problem, not because a curriculum told me to.

---

## What would you do with the investment?

**Phase 1 (0–90 days):** Close first 2–3 paying POC engagements ($15K–$25K each). The platform is built. The constraint is sales motion and enterprise credibility. The AI Grant network accelerates both.

**Phase 2 (90–180 days):** Produce a documented case study with Anthropic co-authorship. Begin Anthropic Partner Network formal partnership. Expand the Compliance Copilot to cover ISO 27001:2022 AI clauses and NYDFS cybersecurity requirements.

**Phase 3 (180–365 days):** Platform subscription launch ($48K–$120K/year per account). Build partner referral channel. Target: $222K Year 1 revenue from 4–5 POC deals plus early subscriptions.

The $250K investment covers: first enterprise sales hire (or fractional), legal and LLC formalization (Illinois → Delaware conversion), security audit and penetration testing for enterprise procurement requirements, and operational runway through the first closed revenue cycle.

---

## Why AI Grant specifically?

Because I am exactly the candidate this program was designed for.

Nat Friedman wrote the original AI Grant announcement about sleeping on a smelly red sofa and needing a little funding to pursue a dream. I have been building FlashFusion from a service desk L1 position at a managed IT firm. Not a VC-backed garage startup. Not a Y Combinator batch. The margins of a day job, before custody, after everyone else is done working.

The work is real. The platform is live. The problem is material. I am not asking for permission to start — I am asking for the capital to accelerate what is already moving.

---

## Note on structure

FlashFusion currently operates as a sole proprietorship. I will form a Delaware corporation within 30 days of acceptance. An Illinois attorney consultation on existing employment agreements is already scheduled as a prerequisite — non-compete analysis complete, outside employment policy permits this work.

---

*FlashFusion | kyle@flashfusion.ai | flashfusion.ai | github.com/Krosebrook*  
*Built on Anthropic Claude | MCP-native | Compliance-first from day one*
