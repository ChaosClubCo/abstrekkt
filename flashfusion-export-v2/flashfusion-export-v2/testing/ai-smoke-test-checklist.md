# AI Smoke Test Checklist

    Owner: Kyle Rosebrook / FlashFusion  
    Export date: 2026-07-11  
    Provenance: [RECONSTRUCTED]

    Provenance tags:
[EXACT] directly copied/extracted from visible conversation or available files.
[RECONSTRUCTED] rebuilt from durable project memory, prior known decisions, or summarized project context.
[INFERRED] logically completed from verified/reconstructed architecture.
[MISSING] known needed, source content unavailable.
[REQUIRES CONFIRMATION] likely correct, requires owner approval before production.


    ## Smoke test checklist
Run after every deployment affecting AI, scorecard, crawler, report generation, dashboards, or agent workspace.

## Checks
1. Public site loads without fatal console errors.
2. Primary CTA routes to a real destination.
3. Scorecard can start and submit with test data.
4. Report preview renders from sample input.
5. Auth-protected workspace rejects anonymous user.
6. Authenticated test user can open workspace/project.
7. Agent run stores prompt/model/eval/audit records.
8. Cross-tenant read attempt fails.
9. Stripe webhook test event is verified and idempotent.
10. n8n webhook test does not duplicate side effects.
11. AI output follows expected JSON/Markdown schema.
12. Error/fallback state is user-friendly.

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
