# Decisions Register

    Owner: Kyle Rosebrook / FlashFusion  
    Export date: 2026-07-09  
    Provenance: [RECONSTRUCTED]

    Provenance tags:
[EXACT] directly copied/extracted from visible conversation or available files.
[RECONSTRUCTED] rebuilt from durable project memory, prior known decisions, or summarized project context.
[INFERRED] logically completed from verified/reconstructed architecture.
[MISSING] known needed, source content unavailable.
[REQUIRES CONFIRMATION] likely correct, requires owner approval before production.


    ## ADR index
| ADR | Decision | Current direction | Confidence |
|---|---|---|---|
| ADR-001 | Category | FlashFusion AI Adoption OS, not generic chatbot/LMS | High |
| ADR-002 | Commercial vehicle | Invoke funnel funds/proves platform | High |
| ADR-003 | Stack | Base44 current; Next/Supabase/Vercel target | High |
| ADR-004 | Governance | Runtime middleware, not static docs | High |
| ADR-005 | Brand | Neon-glass FlashFusion UI; separate Abstrekkt/POD lanes | High |
| ADR-006 | Payments | Stripe target; mailto/placeholders deprecated | Medium |
| ADR-007 | Automation | n8n durable workflows; Make/Zapier lightweight | Medium |
| ADR-008 | Agents | Provider-agnostic, logged, scoped, eval-gated, HITL | High |
| ADR-009 | Analytics | PostHog/Sentry/Vercel Analytics plus audit logs | Medium |
| ADR-010 | Pricing | Preserve $1,500 audit/$4,500 retainer where sourced; archive older $297 | Medium |
| ADR-011 | Claims | No fake client outcomes/metrics/credentials/testimonials | High |
| ADR-012 | Security | Tenant isolation, RLS, append-only audit logs | High |
| ADR-013 | Education | SparkAcademy can become learning layer after curriculum exists | Medium |
| ADR-014 | POD | Product lane, not umbrella identity | Medium |
| ADR-015 | Release | Production-grade or nothing | High |
| ADR-016 | Archive | Preserve old directions under /archive/decisions | High |
| ADR-017 | Documentation | Provenance and confidence required | High |
| ADR-018 | Migration | Strangler migration beats big-bang replacement | High |

## Conflict list and resolutions
1. Engineering-team platform vs AI Adoption OS: AI Adoption OS wins; engineering is a persona/segment.
2. Base44 vs Next/Supabase: Base44 is current state; Next/Supabase is target rebuild state.
3. $297 older audit vs $1,500 audit: $1,500 direction wins where sourced; older pricing archived and requires confirmation.
4. Neon-glass vs generic SaaS: neon-glass wins.
5. POD/e-commerce vs AI Adoption OS: POD remains a lane, not the whole brand.
6. Need case studies vs no fake outcomes: proof capture only after verified delivery.

## Migration notes
Start by exporting live Base44 schemas, then map entities into Supabase staging. Build assessment-to-audit first, then client portal, payment, workflows, learning, and agent runtime.

    ## Implementation Considerations
    Preserve Base44 as current-state source until verified exports exist. Use Next.js/Supabase/Vercel as target state unless a later ADR overrides it. Keep FlashFusion, Abstrekkt, POD, personal-brand, and employer-adjacent lanes separated.

    ## Performance/Security Notes
    Security baseline:
1. Deny by default and enforce server-side role checks.
2. Every client-owned table uses tenant_id and Supabase RLS.
3. Audit logs are append-only; no ordinary update/delete path.
4. Treat uploaded files, workflow payloads, retrieved context, and client text as untrusted data.
5. Agents cannot self-escalate permissions and cannot perform external side effects without approval.
6. Secrets live only in managed secret stores; never in prompts, docs, or repo files.
7. Client-facing AI outputs require evidence, assumptions, confidence, and human approval where risk is material.


    ## Recommended Next Steps
    1. Review the decision register.
    2. Confirm live Base44/Supabase/Stripe/n8n state.
    3. Apply schema/RLS in staging only.
    4. Build scorecard-to-audit funnel before expanding secondary lanes.

    ## CLAIMS CHECK
    Claims check:
- No fake client outcomes, revenue, testimonials, credentials, or case-study metrics are included.
- Exact source facts are preserved only where available; generated implementation content is tagged inferred/reconstructed.
- Counterexample: live Base44/Supabase/Stripe/n8n state may differ. Validate live systems before deploying.

## V2 Update — Website Intelligence and Production AI Methodology

Provenance: [RECONSTRUCTED/EXACT]

This rebuild adds the uploaded FlashFusionReport.txt and Autonoma AI Platform.txt as exact source materials, then folds their implications into the export. The key update is that FlashFusion now has a formal website intelligence crawler/audit methodology and a formal AI Product Envisionment + Vibe Engineering delivery lifecycle. This affects product, UX, agent, testing, security, CI/CD, operations, and GTM artifacts.

Added files include:
- `/source-materials/FlashFusionReport.raw.md`
- `/source-materials/Autonoma-AI-Platform.raw.md`
- `/intelligence/full-spectrum-website-crawler.md`
- `/intelligence/flashfusionstudio-figma-site-audit.md`
- `/intelligence/site-reconstruction-roadmap.md`
- `/methodology/ai-product-envisionment-vibe-engineering.md`
- `/methodology/production-ai-delivery-lifecycle.md`
- `/methodology/toolchain-benchmarking.md`
- `/devops/ai-ci-cd-playbook.md`
- `/testing/ai-smoke-test-checklist.md`
- `/testing/prompt-eval-harness.md`
- `/security/agent-tool-allowlist.md`
- `/security/postgres-rls-template.md`
- `/operations/rollback-protocol.md`
- `/operations/prompt-versioning-strategy.md`
- `/validation/update-delta-audit.md`
