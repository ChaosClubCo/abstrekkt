# Project Snapshot — Claude Enterprise Taxonomy Generator

> Machine-readable index for Claude Code. The rich, hand-authored guidance lives in the
> root `CLAUDE.md` (version lineage, data model, rebrand rules) — read that first for depth.
> This file is a complementary at-a-glance summary; keep the two in sync.
>
> Verified against `intinc-role-taxonomy-v3.1-FINAL.html` (canonical). The conceptual specs/guide
> use the name `roleDatabase`; the v3.1 tool implements it as `ROLES_DATA` and exports JSON + Markdown
> only (no YAML, no `generateProfile()`).

## Human Summary

A **deliverable/artifact repository** — not a software project — that produces a **Claude
Enterprise Role Taxonomy System**: maps every org role → ESCO/ISCO code → an auto-generated Claude
config profile (comm style, response depth, output formats, security posture, feature flags,
integrations), exportable as JSON/Markdown.

- **Stack:** No build system. Self-contained zero-dependency HTML generators (inline
  HTML/CSS/JS) + Markdown specs. Genericized with `{{DOUBLE_BRACE}}` placeholders.
- **Where to start:** Open `intinc-role-taxonomy-v3.1-FINAL.html` in a browser (canonical, 1770
  lines). Data lives in `const ROLES_DATA`; UI logic in the `app` module + global `selectRole()`.
- **Gotchas:** No npm/git/tests — "tests" = the manual QA checklist in
  `INTINC_TEST_VALIDATION_GUIDE_v3.1.md`. Edit the **canonical** versioned file, never a snapshot.
  `BRAND_CONFIG.md` is the source of truth for placeholders. **Docs lag the code:** the guide/spec
  still say `roleDatabase`/`generateProfile()`/YAML — the v3.1 tool uses `ROLES_DATA`, an `app`
  module, and JSON/MD only.

## AI Context

```yaml
project:
  name: claude-enterprise-taxonomy-generator
  purpose: Generate role-based Claude config profiles (role → ESCO/ISCO → comm style, security, features) exportable as JSON/Markdown
  owner: Kyle Rosebrook <kylerosebrook@gmail.com>
  lane: FlashFusion   # under FlashFusion-Enterprise; originally "INT Inc" (Intinc), now genericized
stack:
  language: HTML/CSS/JS (inline, zero-dependency) + Markdown
  framework: none — self-contained browser tools, no runtime
  buildTool: none (no build/CI/package manager/git)
  packageManager: none
structure:
  entryPoint: intinc-role-taxonomy-v3.1-FINAL.html   # canonical generator (1770 lines)
  dataModel: const ROLES_DATA          # line 899; was `roleDatabase` in v3.0 and earlier
  coreApi:
    - selectRole(roleId)               # global, line 1674
    - app.getRole(id) / app.getAllRoles()
    - app.exportRoleJSON() / app.exportRoleMarkdown() / app.exportAllRoles()
    # note: no generateProfile(); no YAML export in the canonical tool
  keyFolders:
    - .                  # flat repo — HTML generators + MD deliverables side by side
    - _rebrand_backup/   # pristine pre-genericization backups
  configFiles:
    - BRAND_CONFIG.md      # source of truth: {{PLACEHOLDER}} → original INT Inc value
    - CLAUDE.md            # root repo guidance (now reconciled with v3.1 data-model/API/export reality)
    - rebrand.ps1 / rebrand-pass2.ps1   # genericization transforms
    - .claude/settings.local.json
canonicalFiles:
  generator: intinc-role-taxonomy-v3.1-FINAL.html
  taxonomySpec: INT_INC_CLAUDE_TAXONOMY_v4.2_COMPREHENSIVE_FINAL.md
  promptBaseline: INT_INC_ENTERPRISE_CLAUDE_PROFILE_BUILDER_v1.0.md
  architectureRef: CLAUDE_ROLE_TAXONOMY_GUIDE.md   # describes conceptual `roleDatabase` schema
dependencies:
  external: [Claude Enterprise, ESCO/ISCO occupational codes, MCP servers (referenced in profiles)]
  critical: [a web browser to run/preview the HTML tools]
constraints:
  - Edit the canonical vN.M file; preserve older versions as snapshots, never overwrite
  - In v3.1 the data object is ROLES_DATA (not roleDatabase); keep schema consistent across HTML + MD
  - Exports are JSON + Markdown only in v3.1 — YAML is spec intent, not implemented in the tool
  - Use existing {{PLACEHOLDER}} vocabulary; add new ones to BRAND_CONFIG.md, never hardcode client values
  - Filenames stay INT_INC_*/intinc-* (contents-only rebrand) — don't rename without fixing cross-refs
  - "Tests" are manual: click each role, validate profile + each export format
links:
  docs: CLAUDE_ROLE_TAXONOMY_GUIDE.md
  setup: INTINC_TEST_VALIDATION_GUIDE_v3.1.md
```
