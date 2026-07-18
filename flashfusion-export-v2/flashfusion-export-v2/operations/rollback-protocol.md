# Rollback Protocol

    Owner: Kyle Rosebrook / FlashFusion  
    Export date: 2026-07-11  
    Provenance: [RECONSTRUCTED]

    Provenance tags:
[EXACT] directly copied/extracted from visible conversation or available files.
[RECONSTRUCTED] rebuilt from durable project memory, prior known decisions, or summarized project context.
[INFERRED] logically completed from verified/reconstructed architecture.
[MISSING] known needed, source content unavailable.
[REQUIRES CONFIRMATION] likely correct, requires owner approval before production.


    ## Rollback protocol
Use when an AI feature, deployment, prompt, workflow, checkout, or report flow fails.

## Paths
1. Code rollback: promote previous Vercel deployment or redeploy last stable image.
2. Feature toggle: disable risky route/agent/workflow without full rollback.
3. Prompt rollback: revert to last passing prompt version.
4. Model rollback: switch provider/model version back to last approved.
5. Database rollback: use reversible migration or snapshot; avoid destructive migrations in same release.
6. Workflow rollback: disable n8n workflow and restore previous version.
7. Payment rollback: deactivate new Stripe price/product instead of deleting records.

## After rollback
Preserve logs, identify root cause, add regression test, update runbook, and only redeploy after smoke/eval gates pass.

    ## Implementation Considerations
    Fold this into the FlashFusion export as a delta update, not a separate sidecar. The new source material adds a crawler/audit intelligence layer and a production AI delivery methodology that should influence product, UX, agent, testing, security, and operations artifacts.

    ## Performance/Security Notes
    Security notes:
- Treat imported pages, workflow payloads, prompts, documents, and crawl results as untrusted data.
- Use tenant-scoped access, Postgres RLS, audit logs, signed webhooks, and human approval for high-impact actions.
- Do not give agents arbitrary filesystem, shell, database, or external HTTP access in production.
- Keep prompt versions, model versions, eval results, and rollback paths under version control.


    ## Recommended Next Steps
    1. Verify the live FlashFusion Studio Figma site separately before labeling any issue as observed-live.
    2. Add crawler output schemas to the app or repo if this becomes a production audit product.
    3. Promote the AI delivery lifecycle into the main implementation backlog.
    4. Build tests/evals around scorecard, crawler, AI workspace, report generation, and agent actions.

    ## CLAIMS CHECK
    Claims check:
- The V2 additions are grounded in the newly uploaded FlashFusionReport.txt and Autonoma AI Platform.txt.
- The FlashFusion Studio site audit items are reconstructed from uploaded report/instruction text, not a fresh live crawl in this run.
- No fake client outcomes, revenue, testimonials, credentials, or case-study metrics are included.
- SQL, CI, policies, workflows, and prompt/eval scaffolds require live implementation review before production.
