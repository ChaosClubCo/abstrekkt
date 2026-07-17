# Automation

How the scripts and workflows fit together, and the safety model.

## The loop

```
evaluate-project.mjs ──▶ ranking row + missing gates + remediation prompts
        │                            │
        │ (Expo?) ──▶ replit-readiness-check.mjs ──▶ readiness % + per-gap prompts
        │                            │
        ▼                            ▼
project-eval-comment.yml posts/updates ONE PR comment on "/evaluate"
        │
        ▼  (you paste a remediation prompt into Copilot/Claude — see ../prompts)
   fix applied ──▶ re-run "/evaluate" ──▶ composite improves
```

Across many repos, `multi-repo-ranking.yml` runs `evaluate-project.mjs` in each
and prints one sorted table (see `../rubric/aggregation-and-ranking.md`).

## Install (per repo)

Copy into the target repo:

```
.github/scripts/evaluate-project.mjs
.github/scripts/replit-readiness-check.mjs   # only if mobile/Expo
.github/workflows/project-eval-comment.yml
```

For cross-repo ranking, put `multi-repo-ranking.yml` in a control repo.

For auto-fix (Option B), also add `claude-auto-fix.yml` plus the two helper
scripts referenced by it — `claude-fix-generator.mjs` and `apply-fix.mjs` — and
set the `ANTHROPIC_API_KEY` repo secret. Those two helpers are described in
`../prompts/remediation-prompts.md` (sections "Option B files") and were defined
in the source chat; they are deliberately NOT shipped pre-wired here so that the
read-only evaluation path has zero credentials and zero write scope by default.

## Run locally (no network, no credentials)

```bash
node automation/scripts/evaluate-project.mjs        # prints a ranking row + detail
node automation/scripts/replit-readiness-check.mjs  # prints readiness report
```

Both scripts only read files. They never execute project build scripts.

## Safety model (summary; full text in ../SECURITY.md)

- **Read-only evaluation.** Eval + readiness scripts and their workflows use
  `contents: read` (+ `pull-requests: write` to post the comment). No pushes.
- **Auto-fix is the only writer.** `claude-auto-fix.yml` needs `contents: write`
  and the `ANTHROPIC_API_KEY` secret. It opens a **draft PR** for review and must
  not auto-merge.
- **Zero-review (Option C)** exists in the source but is fenced: low-risk changes
  only (env files, docs, config), gated behind lint + typecheck + tests with
  auto-revert + issue-on-failure. The user wanted no review; the kit honors that
  only behind the test gate, and documents the disagreement.

## Auto-fix risk ladder

| Option | Mechanism | Cost | Safety | Use for |
|--------|-----------|------|--------|---------|
| A Manual | paste prompt into Copilot/Claude, review, commit | $0 | High | anything, esp. domain logic |
| B Semi-auto | Claude → draft PR → you review/merge | ~$0.15–0.30/fix | High | production code |
| C Full-auto | commit on tests-pass, auto-revert on fail | ~$0.15–0.30/fix | Low | `.env.example`, docs, config only |
