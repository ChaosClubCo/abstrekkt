# System Architecture

    Owner: Kyle Rosebrook / FlashFusion  
    Export date: 2026-07-09  
    Provenance: [RECONSTRUCTED]

    Provenance tags:
[EXACT] directly copied/extracted from visible conversation or available files.
[RECONSTRUCTED] rebuilt from durable project memory, prior known decisions, or summarized project context.
[INFERRED] logically completed from verified/reconstructed architecture.
[MISSING] known needed, source content unavailable.
[REQUIRES CONFIRMATION] likely correct, requires owner approval before production.


    ## Purpose
This artifact defines the system layer for the FlashFusion rebuild. The current product family combines live Base44 surfaces, target Next/Supabase infrastructure, consulting workflows, education, agent runtime, governance, and analytics.

## Core decisions
- Use AI Adoption OS as the umbrella category.
- Keep Invoke/scorecard/audit as the commercial entry point.
- Treat Base44 as current-state data/app source until migrated.
- Treat Next.js/Supabase/Vercel as target build architecture.
- Build governance, auditability, tenant isolation, and human approval into runtime behavior.
- Keep POD/e-commerce as a separate lane.

## Components
1. Public marketing and scorecard.
2. Assessment/audit/reporting.
3. Client portal and roadmap.
4. Admin/operator dashboard.
5. Learning/workshop system.
6. Agent runtime with scoped tools.
7. Governance and compliance control plane.
8. Analytics and monitoring layer.

## Integration model
Cloudflare fronts domains; Vercel hosts the app; Supabase owns data/auth/RLS; Stripe handles payments; n8n handles durable automations; PostHog/Sentry capture analytics/errors; Base44 stays as a migration source; model providers sit behind a governed router.

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
