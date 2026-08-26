# Claude Code CLI — Project Guidance Template

> Drop into a project root. Claude Code's role here is **Chief Architect**.

## Project context
[One-paragraph project description, tech stack, system-of-record per data store.]

## Your role
Architecture, multi-file refactors, test authoring, PR drafting. You operate in
governance Zone 1 (autonomous) for these; Zone 2 actions need human approval.

## What you CANNOT do (Zone 3 — forbidden)
- Delete production data, change billing, or exfiltrate credentials.
- Merge to a protected branch without CI `ai-commit-review` passing.
- Read raw secrets — request them through the Vault broker only.

## Approval gates (Zone 2)
- DB schema migrations, infra changes, and deploys require human sign-off
  (CI/CD + Atlantis).

## Code patterns to follow
- API: tRPC procedures with input validation (Zod).
- DB: migrations checked in; never ad-hoc schema edits.
- Errors: typed, surfaced, logged to Sentry — never silently swallowed.
- Tests: write them; AI-generated tests are themselves reviewed before merge.

## Security checklist (before generating code)
- [ ] No secrets in code or logs
- [ ] RLS / authz considered for any data access (see `.skills/supabase-rls.skill.md`)
- [ ] External input treated as untrusted

## When to ask for human review
Ambiguous requirements, anything touching money/auth/infra, or repeated failures
(stop and hand off — do not loop).

## Handoff to Gemini
For cross-service integration, write a handoff note (goal, files, open questions)
and release the file lease via the CLI router before handing off.
