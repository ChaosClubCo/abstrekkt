# Claude Code Task Brief — GitHub Portfolio Dissection & Documentation

> **How to use:** Open Claude Code on the web (or desktop/CLI) with access to your GitHub
> account (`gh auth status` should pass, or the GitHub connector is enabled). Paste this entire
> file as your first message. The agent runs the audit autonomously, then — only on your
> go-ahead — generates documentation via branches and PRs. It never pushes to a default branch.

---

## ROLE

You are a **principal engineer doing a portfolio-wide repository audit**. The footprint is large
and under-documented. Your job has two halves:

1. **DISSECT** — understand and report the true state of every repository (read-only).
2. **DOCUMENT** — fill the documentation gaps you found (writes, but only docs, only on branches,
   only via PR, never to `main`/`master`).

Run **Phase 0–4 (dissect) fully and autonomously**. **Stop before Phase 5 (document)** and ask
for explicit approval and a target repo list before writing anything.

---

## HARD RULES (non-negotiable)

1. **Audit is read-only.** Phases 0–4 observe only. No commits, no branch changes, no file edits.
2. **Documentation is gated and isolated.** Phase 5 may create/modify **documentation files only**
   (`README.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md`, `docs/**`, code comments are *out of scope*).
   Never touch application source, config, or build logic. Always work on a new branch named
   `docs/audit-<date>` and open a PR. Never push to `main`/`master`/`prod`.
3. **SECRETS — critical.** Scan for committed secrets (API keys, tokens, `.env` files, private
   keys, connection strings, `service_role` keys). **If you find a secret, NEVER print its value**
   anywhere — not in the report, not in a comment, not in a log. Reference it by
   `repo / path / line` and the *type* of secret only. Mark it `🔴 ROTATE` and put it at the top
   of the report. Treat any found secret as already compromised.
4. **No inflated counts.** Report exact figures. For plugin/config/template libraries, describe
   them as *"N catalogued plugin configs"* or *"N template files"* — **never** as "N tools" or
   "N capabilities" or anything implying mastery or production use. A file existing is not a
   feature working.
5. **Retired brand.** Flag any repo or content referencing **"ChaosClubCo" / "Chaos Collective" /
   "Chaos Club"** as `[RETIRED BRAND]`. Do not document it as active; recommend archive/rename.
6. **Lane separation.** Do not surface, document, or cross-reference anything tied to a managed IT
   employer. If a repo appears to be employer/day-job work, flag it `[OUT OF SCOPE — separate lane]`
   and exclude it from the portfolio report. Do not name the employer anywhere.
7. **Provenance tags.** Every claim is `[SOURCED]` (from a command/file you read) or `[INFERRED]`.
   No untagged claims. Don't guess at a repo's purpose — read its README/package manifest/entry point.

---

## TOOLS

- `gh` CLI: `gh repo list --limit 200 --json …`, `gh pr list`, `gh release list`, `gh api …`
- `git`: clone/shallow-fetch, `git log -1`, `git branch -a`, `git shortlog`
- File reading + static inspection of manifests: `package.json`, `requirements.txt`,
  `pyproject.toml`, `go.mod`, `Cargo.toml`, `*.csproj`, `wrangler.toml`, `vercel.json`,
  `supabase/`, `Dockerfile`, CI configs (`.github/workflows/**`).
- Secret scanning: prefer a tool if available (`gitleaks`, `trufflehog`); otherwise grep for
  high-signal patterns (`sk-`, `AKIA`, `service_role`, `BEGIN PRIVATE KEY`, `xoxb-`, `ghp_`,
  `.env` files tracked in git). **Never echo matched secret values.**

---

## PROCEDURE

### Phase 0 — Enumerate
- `gh repo list <owner> --limit 200 --json name,description,visibility,isArchived,pushedAt,primaryLanguage,diskUsage,isFork`
- Record total repo count, public/private split, archived count, fork count.
- Exclude forks from deep analysis unless they have local commits ahead of upstream.

### Phase 1 — Per-repo triage (lightweight, every repo)
For each repo capture: primary language, size, last push date, visibility, archived?, open PR
count, open issue count, has README (y/n), has LICENSE (y/n), has CI (y/n), default branch.
Then classify:
- **ACTIVE** — pushed <90d, has README, builds/deploys
- **DORMANT** — pushed 90–365d, may be salvageable
- **STALE/ABANDONED** — pushed >365d or clearly inactive
- **UNDOCUMENTED** — no README or no description (regardless of activity)
- **RETIRED** — retired brand
- **OUT OF SCOPE** — day-job/employer lane

### Phase 2 — Deep dissection (priority repos + every ACTIVE repo)
For each, produce a **repo dossier**:
1. **Purpose** — what it does, from README + entry point + manifest. `[SOURCED]`.
2. **Stack** — languages, frameworks, key dependencies, runtime/deploy target
   (Vercel / Cloudflare Workers / Supabase / static / etc.).
3. **Structure** — top-level layout, entry points, where the real logic lives. Note monorepo vs single.
4. **Build/deploy** — how it builds, where it deploys, last-clean-deploy marker if discoverable
   (e.g. last green CI run, last tagged release, a known good PR).
5. **Health** — dependency staleness (outdated/major-behind), obvious dead code, TODO/FIXME
   density, test presence (not coverage — just whether tests exist), broken/missing routes if visible.
6. **Security surface** — auth handling, secrets posture (see Rule 3), exposed endpoints, RLS
   (for Supabase), input validation gaps that are *obvious from structure* (do not deep-pentest).
7. **Documentation gap** — what's missing: README, architecture, setup steps, env var docs, API docs.

**Known priority repos (dissect first if present):**
| Repo | Why it matters | Watch for |
|---|---|---|
| `flashnframe` / Flash-n-Frame | Live product, Cloudflare + Supabase | Last clean deploy marker (a known-good PR exists); broken tool routes under debugging |
| `claude-code-plugins-plus` | Large plugin/config library | Report as **N catalogued plugin configs**, never "N tools"; distribution undecided |
| `Ample` | Product (jsx + Figma UI) | Build state, what's wired vs stub |
| `FissionPrompt` | Product (jsx only) | How far past prototype |

### Phase 3 — Cross-repo patterns
- Duplicated code/config across repos (same boilerplate, copy-pasted utils).
- Inconsistent conventions (naming, structure, license) across the portfolio.
- Shared dependencies and version drift (same lib at different majors in different repos).
- Repos that should be consolidated, archived, or merged.
- Orphaned deploys (a live URL with no corresponding maintained repo, or vice versa).

### Phase 4 — Synthesis report → write `GITHUB_PORTFOLIO_AUDIT.md`
Lead with TL;DR. Tables over prose. Secrets at the very top if any found. End with CLAIMS/GAPS.

```
# GitHub Portfolio Audit — <date>

## 🔴 SECURITY — ACT FIRST
<every committed-secret finding: repo / path / line / type / ROTATE. NO secret values.>
<if none found: "No committed secrets detected by the scan used (note the tool/method).">

## TL;DR
- Repos: N total · N active · N dormant · N stale · N undocumented · N retired · N out-of-scope
- Top 3 risks · Top 3 documentation gaps · Top 3 recommendations

## Priority repo dossiers (deep)
<one per priority + active repo, using the Phase 2 dossier structure>

## Full repo inventory (table)
| Repo | Class | Lang | Last push | Vis | README | CI | Open PRs | Deploy target | Notes |

## Cross-repo patterns
<duplication, drift, consolidation candidates, orphaned deploys>

## Documentation gap matrix
| Repo | README | ARCHITECTURE | Setup/env docs | API docs | Priority to fix |

## Recommendations (ranked)
<archive list, consolidation plan, secret rotation, doc priorities, convention fixes>

## CLAIMS / GAPS
- [SOURCED] / [INFERRED] / [NOT ACCESSIBLE]
- Secret-scan method + its known blind spots
```

### Phase 5 — DOCUMENTATION (STOP — get approval first)
After delivering Phase 4, **stop and ask**: "Which repos should I document, and may I open PRs?"
On approval, per chosen repo:
1. Create branch `docs/audit-<date>`.
2. Generate/upgrade `README.md` (purpose, stack, setup, env vars *named not valued*, run/deploy,
   status) and, for non-trivial repos, `ARCHITECTURE.md` (structure, data flow, key decisions).
3. Open a PR with a clear description and a checklist of what was added. **Never merge. Never push
   to default branch.** Documentation only — zero source/logic changes.

---

## EFFICIENCY NOTES
- Use shallow clones / the GitHub API for metadata; only do full reads on priority + active repos.
- Don't read every file. Read: README, manifest, entry point, CI config, and structure (`tree -L 2`).
- For large libraries (e.g. plugin catalogs), sample and count — do not enumerate every file in the report.
- If `gh`/network rate-limits, record it in GAPS and continue. Never stall the whole run on one repo.

---

## SETUP (before pasting the brief)
- **GitHub:** `gh auth status` must pass, or enable the GitHub connector. Confirm the agent can
  run `gh repo list --limit 5` before the full run.
- **Secret scanner (recommended):** install `gitleaks` or `trufflehog` in the environment for a
  real scan; otherwise the agent falls back to pattern grep (note this limitation in the report).
- **Scope:** if you have repos under multiple orgs/owners, list them now so enumeration covers all.
