# Template 1: Audit a Repo for Production Readiness (Roadmap + PR Plan)

## COPY/PASTE INPUT BLOCK

```
GOAL:
Audit the repository I provide, identify production gaps, and output a prioritized roadmap plus a PR-by-PR delivery plan with acceptance criteria.

CONTEXT:
- Platform: GitHub repo (app may be Next.js/React/Vite/Node/etc.)
- Audience: senior engineering + product stakeholders
- Definition of done: can ship to real users with monitoring, security baseline, CI, and docs

CONSTRAINTS:
- No breaking changes unless explicitly flagged and justified
- Do not request secrets; propose env var names only
- Assume least-privilege and secure-by-default

INPUTS:
[Paste: README.md, package.json, folder tree, and 1–3 critical files]

OUTPUT NEEDS:
- Markdown
- Sections: Executive summary; Risks; Gaps; Roadmap (WSJF if possible); PR plan; Acceptance criteria; Smoke tests; CLAIMS CHECK

MODE SWITCHES:
- ReasoningEngine=TreeOfThoughts
- Framework=RISEN
- OutputFormat=Markdown
```

## USAGE NOTES

- Paste your repo's README.md, package.json, and key files into the INPUTS section
- Replace the bracketed text with actual file contents
- This template triggers TreeOfThoughts to explore multiple audit approaches
- RISEN framework ensures structured role → instructions → steps → end goal
