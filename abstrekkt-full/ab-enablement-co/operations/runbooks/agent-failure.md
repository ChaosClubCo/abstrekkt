# Agent Failure Runbook

    _Generated: 2026-06-21. Reconstruction confidence is bounded by accessible project memory/context and the current chat session._


1. Stop external actions.
2. Capture prompt, context IDs, model, output, cost, and trace.
3. Mark artifact as rejected or needs evidence.
4. Add eval fixture if regression-worthy.
5. Patch prompt/policy/router.
6. Re-run only with approved context.
