# Design Tokens

    Owner: Kyle Rosebrook / FlashFusion  
    Export date: 2026-07-09  
    Provenance: [EXACT/RECONSTRUCTED]

    Provenance tags:
[EXACT] directly copied/extracted from visible conversation or available files.
[RECONSTRUCTED] rebuilt from durable project memory, prior known decisions, or summarized project context.
[INFERRED] logically completed from verified/reconstructed architecture.
[MISSING] known needed, source content unavailable.
[REQUIRES CONFIRMATION] likely correct, requires owner approval before production.


    ## Canonical tokens
--ff-void #0A0A0F; --ff-deep #141328; --ff-indigo #322B75; --ff-primary #8B5CF6; --ff-primary-light #C4B5FD; --ff-glow #A855F7; --ff-electric #06B6D4; --ff-electric-light #67E8F9; --ff-bright #E0E7FF; --ff-text #F8FAFC; --ff-text-muted #94A3B8.

## Typography
Poppins for display/headlines. Inter for body/UI. Do not add a third font without approval. Reduced motion is mandatory.

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
