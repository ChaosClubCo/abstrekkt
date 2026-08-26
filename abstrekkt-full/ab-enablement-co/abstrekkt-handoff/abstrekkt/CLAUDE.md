# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A **Claude Design handoff bundle** (exported from claude.ai/design), not a code project. Kyle
mocked up the Abstrekkt / FlashFusion / Kyle-Rosebrook properties as HTML/CSS/JS prototypes and
exported them so a coding agent can implement them for real. There is no root package manager,
no build, no test, and **no git repo** anywhere in this tree.

Content is ~460 HTML prototypes, ~270 markdown docs, plus vendored React/TS sub-projects and
~450 images/video. Two files carry the entry-point instructions:

- `README.md` — the handoff note. Names `project/Repository Operations Hub.html` as the design
  Kyle had open at export; says to read it in full and follow its imports before implementing.
- `project/CANON.md` — **the artifact registry. Read this before touching anything.**

## CANON.md is the source of truth — not the filenames

`project/CANON.md` declares, per lane, which file is canonical, which is STALE, and which is
unregistered/REVIEW. Its rules are binding:

- **Check CANON.md before creating any artifact.** If a canonical file already does the job,
  patch it — never create a sibling.
- **Never create `_v2`, `_bak`, `_new`, `_final`.** To version: rename the current canonical to
  `[name]_archive_[YYYY-MM].[ext]`, update the CANON table, build the new one suffix-free — all
  in one sitting (the registry points at ghosts otherwise).
- **Anything not in the CANON table doesn't exist officially.** Built something? Register it.
- **Butler rule:** repeated references across files are not confirmation. Check ground truth,
  not sibling-artifact consistency.

Lanes: Memoir · Abstrekkt Studio Marketing · Kyle Rosebrook Personal · FlashFusion Business &
Product · Press & Pitch · Content & Publishing · Load-Bearing · Midnight Academy · Abstrekkt
Operations & Handoff. `project/canon-sync-ops.md` is the companion runbook for a registry
reconciliation pass and records the open decisions (D10 — Load-Bearing publish status).

## ⚠️ Two design systems — never mix them in one file

`project/CLAUDE.md` is the design-system spec and defines **Brutalist Archive** (carbon
`#131315`/`#0A0A0C`, amber `#ffbf00`/`#ffe2ab`, EB Garamond / Literata / JetBrains Mono). But
CANON.md's Jul 13 2026 ruling establishes a second, coexisting register — read both before any
visual work:

- **Existing corpus (all ~182 pre-Jul-13 files) stays Brutalist Archive.** No silent restyle.
  This is the identity readers, journalists, and pitches already saw.
- **`project/_ds/abstrekkt-design-system-00b28ec4-…` ("Reading Room at Midnight" — ink `#0d0c0a`,
  brass `#C8A86A`, Fraunces / Crimson Pro) is reserved for net-new Studio-lane builds** that
  explicitly load the bundle. `Abstrekkt Studio Landing.html` is the only one today.
- **A page either loads `_ds/` and uses its components, or defines Brutalist Archive tokens
  inline. Never both.**
- **Internal operator tools are exempt** from brand-token binding (`book_command_center.html`,
  Operator Console, FlashFusion Console, Audit pages carry their own palettes — by ruling, not
  by drift). They're workbenches, not brand surfaces.
- `project/abstrekkt-tokens.css` and `colors_and_type.css` exist but are **not** loaded by the
  Studio-lane pages — don't assume a CSS file is live because it's present.

This conflict is still flagged for a founder ruling. Don't resolve it unilaterally.

## Structure (`project/`, verified 2026-07-16)

```
CANON.md CLAUDE.md canon-sync-ops.md todo.md   registry, design system, runbook, backlog
brand.md design.md the-evidence-board.md       voice/brand refs; memoir source ledger
*.html  (~190 at root)                         the prototypes — Essay -*, Audit -*, Deep Dive -*,
                                               Abstrekkt *, Kyle Rosebrook *, Load-Bearing *,
                                               FlashFusion *, Midnight Academy *
*.jsx   (author hub, dispatch, content-engine, voice-audit, memoir-explorer, …)
abstrekkt/     shared components: nav-toggle.js, protections.js, search-app.jsx, search-data.js
_ds/           the Reading Room design-system bundle (see above)
assets/        fonts, video, images, clinical-source/ (SENSITIVE — see below)
audit/ remediation/  vendored FlashFusion website/dashboard/enterprise source under review
chapter-reader/ corridor/ operator-console/ screens/ tools/ iconhub/ kr/ loadbearing/
midnight-academy/ export/ uploads/ stitch_memory_corridor_studio/
deploy/kyle-abstrekkt-com/   GENERATED production package — never edit (see below)
proxy-deploy/  Cloudflare Worker (kr-mentor-proxy)
```

There is no `03_*`-style numbering here; folders are lane- and function-named.

## Buildable exceptions (almost nothing is)

The prototypes are opened directly — no build. The few real toolchains each own their setup;
`cd` in and use that folder's tooling. Never run a bundle-wide build.

```bash
cd project/proxy-deploy            # Cloudflare Worker
npm install && npm run dev         # wrangler dev  |  npm run deploy

cd project/remediation/clean/dashboard   # Vite + React 18 + TS
npm install && npm run dev         # npm run build = tsc -b && vite build

cd project/remediation/clean/website     # pnpm + turbo monorepo (pnpm@8, node >=18)
pnpm install && pnpm dev           # build | test | lint | type-check
```

`audit/src/website/` is the same monorepo as `remediation/clean/website/` at an earlier state —
they are audit snapshots, not two products. Treat both as **vendored source under review**, not
as this bundle's code to refactor.

## `deploy/` is generated — never edit it

`project/deploy/kyle-abstrekkt-com/` is a production copy of three root canonicals
(`kyle-abstrekkt-index.html`, `playbook.html`, `press-kit.html`) with in-project design tooling
stripped (Tweaks panel, React/Babel CDN, image-slot → static frame) and links made root-relative.
**Edit the root canonicals and regenerate.** `deploy/README.md` carries Kyle's upload/DNS steps.

## Sensitive material — handle carefully

- `project/abstrekkt/protections.js` is the canonical protections manifest: sealed memoir
  entries carry only an evidentiary stub, and `sealCorpus()` scrubs forbidden identifying
  tokens by construction. Its own header is honest that this is editorial rigor, **not** a
  security boundary. Route any new tool that touches memoir corpus through it rather than
  writing inline regexes.
- Identities under an `absent` policy (e.g. Kinsley) must never become a node, a result, or a
  bio detail.
- `project/assets/clinical-source/` holds **real clinical documents** (SPECT renders, Amen
  Clinics eval, cognitive assessments). Clinical claims are sourced to `the-evidence-board.md`
  + these files only. Never echo, commit, or send externally.
- Several claims are **deliberately unresolved pending Kyle** (the "homeless" vs living-with-
  parents discrepancy, "11 attempts at associates", Ryan $ amount, cert name). Do not resolve
  a flagged contradiction on Kyle's behalf — the Operations lane is business/legal fact, not
  design content.

## Inherited rules (from the parent workspace)

This tree sits inside `D:\02_Homebase\02_abstrekkt\…` and is gitignored by the Homebase index
repo. Its CLAUDE.md chain applies — most load-bearing here:

- **Lane is PERSONAL.** Abstrekkt / FlashFusion only. Never bleed in INTINC or freelance-client
  context; never name the managed IT firm or its clients.
- **Retired brands** — `ChaosClubCo` / `Chaos Collective` must never appear in new external copy.
  They survive only in historical/archive files.
- **No batch deletes, no `rm -rf`** — per-file confirmation only.
- Content integrity: no inflated tool counts, no unsourced public claims; audit pricing floor is
  **$4,500**.
- `Invelo` / Intinc: Kyle's *authorship* of that brand+site is his to credit; the underlying
  business facts (20-year heritage, testimonials, case-study metrics) stay Intinc's.

## Working conventions

- **Prefer direct `Read`/`Glob`/`Grep` over subagents** — content is static markdown/HTML, so
  indexing isn't the bottleneck. Scope globs to a subfolder; a whole-tree ripgrep can time out.
- **Don't render prototypes in a browser or screenshot them unless asked.** Dimensions, colors,
  and layout rules are spelled out in the source; a screenshot adds nothing.
- **Recreate designs pixel-perfectly in whatever tech fits the target codebase.** Match the
  visual output; don't copy a prototype's internal structure unless it happens to fit.
- **Binary files** (`.mp4`, `.mp3`, `.pdf`, `.png`, `.woff2`) must be extracted/transcribed
  before reading as text.
- Ask before implementing if scope is ambiguous — clarifying is cheaper than building the wrong
  thing.
