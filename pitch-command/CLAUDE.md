# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this directory is

`pitch-console/` is a **flat collection of self-contained browser artifacts** — pitch, grant,
memoir, publishing, and "command center" tools Kyle uses in the abstrekkt / FlashFusion lane. It
is **not a buildable application**: there is no `package.json`, bundler, linter, or test suite
anywhere in the tree, and no root entry point. Treat it as a working library of independent
single-file apps and drafts.

This is a **leaf folder inside the `D:\02_Homebase` git repo** (`git rev-parse --show-toplevel`
→ `D:\02_Homebase`), not its own repo. Homebase-wide rules apply: allow-list `.gitignore`, never
stage `**/.env`, "Homebase = thinking/planning; build-and-ship code lives elsewhere." The KAR
parent adds: KAR is a destination for working artifacts, not a place to build and ship.

## The two artifact types (how to run them)

- **Standalone `*.html`** — open directly in a browser. Vanilla JS + CSS, Google Fonts, occasional
  `unpkg` CDN script, `localStorage` for persistence. No server or build step. To preview a change,
  just open the file.
- **Single-file `*.jsx`** — React components with bare `import { useState, useEffect, ... } from
  "react"`. There is **no local bundler**; these are authored to be pasted into a React host (a
  Claude artifact, Base44, or an external bundler). They will not run from disk as-is. Edit them as
  source, don't try to `npm run` them.

## Shared AI architecture

Nearly every interactive tool calls the Anthropic API **directly from the browser**:

- Endpoint `https://api.anthropic.com/v1/messages`, headers `x-api-key: <settings.apiKey>` and
  `anthropic-version: 2023-06-01`.
- The API key is **user-supplied at runtime** (settings field) and kept in `localStorage` — there
  is no bundled secret and no server proxy. Do not hardcode a key when editing these files.
- Default model is the alias `claude-sonnet-4-6`; some files pin `claude-sonnet-4-20250514`. When
  updating models, match the alias already used in that file.

## Layout & conventions

- Root holds the current top-level tools (`pitch_console.html`, `dispatch-v2.jsx`, `memoir_engine.html`,
  `content-engine.jsx`, `publishing_command_center.html`, `voice-audit.jsx`, `book_command_center.html`,
  the numbered `01–04-*.md` grant/application drafts, etc.).
- `pitch-command/` — the largest variant set (pitch/publishing/essay/memoir/blog generations plus
  `flashfusion-client-suite/`). Expect near-duplicate, differently-versioned copies of root files here.
- `the-vault/` — memoir + pitch-kanban material and `kyle-context-files/` (context packs with their
  own `INSTALL.md`).
- `portfolio/` — portfolio components and Base44 "Live Sync" JSON exports.
- **Versioning:** generations coexist as `-v2`/`-v3` (or `_v2`) suffixes; the **highest suffix is the
  newest**. Confirm which copy is canonical before editing — the same tool exists in multiple folders.

## Sensitive content

`kyle_docs_readable.txt` and `the-vault/kyle-context-files/` contain personal memoir / PII / project
context; `intinc`-tagged material is meant to be NDA-filtered. Never commit, echo, or send this
content externally — the Homebase allow-list keeps it out of git by default; keep it that way.
