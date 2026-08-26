# Phase 2 — Prompt Chains (per role)

Single prompts answer a question; **chains** carry a multi-step job from start to
finish, passing each step's output into the next. One representative chain per
role. `{{…}}` are fill-ins; `→` passes output forward.

## Operator chain — "ship a small change safely"
1. **Clarify** → restate the task + 1–3 questions if ambiguous.
2. **Plan** → shortest correct path + the common failure to watch.
3. **Execute** → produce the change with inputs validated.
4. **Verify** → "Cause → Fix → Retry" check; confirm the next action.
> Output of each step is the input to the next; stop and ask if step 1 is ambiguous.

## Manager chain — "decide and communicate"
1. **Frame** → the decision + the trade-off (cost/speed/risk).
2. **Evidence** → ≤5 decision-ready bullets; flag the unverifiable.
3. **Recommend** → one action + "what would change my mind."
4. **Brief** → rewrite the recommendation as a 3-line message to the team.

## Owner chain — "pick a strategic path"
1. **Outcome** → tie the question to a measurable result.
2. **Options** → A/B/C with leverage + downside each.
3. **Assumptions** → list load-bearing assumptions; mark the one that breaks the plan.
4. **Commit** → chosen path + the leading indicator to watch in week 1.

## Admin chain — "make a high-blast-radius change"
1. **Implication** → security/compliance impact first.
2. **Least privilege** → minimal-scope config; call out anything widening access.
3. **Apply** → exact setting/command, secrets as placeholders.
4. **Rollback** → the undo step + how you'd know it's needed.

## Cross-cutting "mentor" wrapper (optional around any chain)
Wrap any chain so the assistant also: teaches the *why* of each step, suggests a
shortcut you didn't ask for, explains errors plainly, and flags when you're taking
the hard road — biasing to viable workarounds. (See `../prompts/themes.md` §3.)

## Authoring your own chains
- Keep each step single-purpose; name its output explicitly.
- Put a **checkpoint** after any ambiguous or irreversible step.
- End every chain with a verification or rollback step — never on "done".
