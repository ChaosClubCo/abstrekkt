# DECISIONS REGISTER

| ID | Decision | Date | Rationale | Impact | Evidence |
|---|---|---:|---|---|---|
| D-0001 | Adopt consulting-led productization as the primary revenue path | 2026-06-21 | Revenue priority requires artifacts that generate action quickly. | Business, product, and operations focus on paid audits/workshops before speculative SaaS expansion. | [INFERRED] |
| D-0002 | Use Next.js + TypeScript + Tailwind + shadcn/ui for deployable dashboards | 2026-06-21 | Existing direction includes Next.js 15/Tailwind v4/shadcn for consulting dashboards. | Standardizes delivery and reduces cognitive load. | [VERIFIED] |
| D-0003 | Preserve Angular commerce lineage but do not make it the next revenue-critical path | 2026-06-21 | Angular SaaS commerce product exists historically, but consulting delivery is faster to monetize. | Angular artifacts move to archive/migration guidance. | [INFERRED] |
| D-0004 | Supabase Postgres + RLS + pgvector is canonical data/memory foundation | 2026-06-21 | Roadmap favors Supabase, RLS, metadata memory, structured logs, and vector retrieval. | All schemas and API contracts target Supabase first. | [VERIFIED] |
| D-0005 | Remove Notion from canonical architecture | 2026-06-21 | User explicitly removed Notion because it is experimental and may expire. | Docs treat Notion as optional/archive only. | [VERIFIED] |
| D-0006 | Retain practice IP in every engagement | 2026-06-21 | Hard rule from project files and user protocol. | Contracts, proposals, workshops, and case studies must include IP boundary language. | [VERIFIED] |
| D-0007 | Enforce $4,500 minimum for paid audits | 2026-06-21 | Hard pricing floor. | Pricing and GTM artifacts prevent low-value custom work. | [VERIFIED] |
| D-0008 | Use credential-safe language until CCA-F is verified | 2026-06-21 | CCA-F pending July 20, 2026. | Marketing copy says preparing for Anthropic certification before that date. | [VERIFIED] |
| D-0009 | Use metadata-first source reconstruction | 2026-06-21 | Storage is fragmented and a 2TB work-loss event occurred. | Raw files stay in storage; indexed provenance and summaries power recovery. | [VERIFIED] |
| D-0010 | Base44 remains a generator/source-adjacent tool, not canonical production authority | 2026-06-21 | Base44 repo binding and org movement issues create deployment risk. | Mirror Base44 outputs into controlled repos and deploy through canonical pipelines. | [VERIFIED] |
| D-0011 | AI agents must log every meaningful action | 2026-06-21 | Roadmap requires telemetry, audit logs, fallback, memory, and context persistence. | agent_logs, artifacts, evaluations, and human review queues are mandatory. | [VERIFIED] |
| D-0012 | Schedules are judged by action production | 2026-06-21 | User instructed to remove schedules that do not produce action twice per month. | Operations includes a weekly action-yield review. | [VERIFIED] |
