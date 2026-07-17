# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

A **deliverable/artifact repository** (not a conventional software project) that produces a
**Claude Enterprise Role Taxonomy System**: a framework for generating role-based Claude
configuration profiles for every role, department, and career level in an organization.

Each role maps to → an ESCO/ISCO occupational code → an auto-populated Claude config
(communication style, response depth, output formats, security/compliance posture,
feature flags, and recommended integrations/MCP servers). The canonical v3.1 tool exports JSON and
Markdown; JSON/Markdown/YAML is the broader spec-level intent (YAML is not implemented in the tool).

There is **no build system, package manager, test suite, CI, or git** here. The repo is a flat
collection of two artifact types:

- **Self-contained HTML generators** — interactive tools, zero dependencies, open directly in a browser.
- **Markdown deliverables** — taxonomy specs, deployment guides, research citations, system-prompt
  baselines, a red-team playbook, and an audit plan.

## Working with the files (there are no commands)

- **Run/preview a tool:** open the relevant `*.html` in a browser. On Windows:
  `Start-Process .\intinc-role-taxonomy-v3.1-FINAL.html` (or just double-click). No server needed.
- **"Tests" = manual validation:** the QA checklist lives in `INTINC_TEST_VALIDATION_GUIDE_v3.1.md`.
  Validate by clicking each role and confirming the generated profile + each export format (JSON + Markdown
  in the canonical v3.1 tool — it does **not** emit YAML; YAML is spec-level intent only).
- **Editing a tool:** everything (HTML, CSS, JS) is inline in a single file. In the canonical
  `intinc-role-taxonomy-v3.1-FINAL.html` the data object is `const ROLES_DATA` (renamed from
  `roleDatabase` in v3.0-and-earlier); selection is the global `selectRole(roleId)` and the rest of the
  behavior lives on an `app` module (`app.getRole`, `app.getAllRoles`, `app.exportRoleJSON`,
  `app.exportRoleMarkdown`, `app.exportAllRoles`). There is **no** `generateProfile()` — profiles are
  rendered from per-tab template strings. To add a role, add a `ROLES_DATA['id'] = {...}` entry; the
  `role-option` list is generated from `ROLES_DATA`, so no separate element is needed in v3.1. See
  "Adding a Custom Role" in `CLAUDE_ROLE_TAXONOMY_GUIDE.md` (which still uses the older `roleDatabase` name).

## Version lineage — edit the canonical file, not a historical snapshot

Versions are encoded in filenames and **older versions are kept as snapshots**, not deleted. Before
editing, confirm you are on the latest unless asked otherwise:

- **Interactive HTML generator (canonical):** `intinc-role-taxonomy-v3.1-FINAL.html`
  - History: `...-system.html` → `...-system-v2.1.html` → `...-v2.2-FINAL.html` → `...-v3.0-PRODUCTION.html` → `...-v3.1-FINAL.html`
  - `claude-enterprise-profile-generator.html` and `claude-role-taxonomy-system.html` are earlier,
    generically-named variants of the same generator.
- **Taxonomy / deployment spec (canonical):** `INT_INC_CLAUDE_TAXONOMY_v4.2_COMPREHENSIVE_FINAL.md`
  - History: `...v4.0...` → `...v4.1...` → `...v4.2...`. The v4.1 line also has a research-grounded
    edition and a separate `..._RESEARCH_CITATIONS_INDEX.md`.
- **System-prompt baseline & feature docs:** `INT_INC_ENTERPRISE_CLAUDE_PROFILE_BUILDER_v1.0.md`
  (universal baseline prompt + per-role profiles; the text a deployment actually ships to users).
- **Conceptual/extensibility guide:** `CLAUDE_ROLE_TAXONOMY_GUIDE.md` (the architecture reference for
  the role schema, career-level hierarchy, and how to extend; uses the conceptual `roleDatabase` name —
  the canonical v3.1 HTML implements this as `ROLES_DATA`).
- **Security artifacts:** `INT_INC_CLAUDE_RED_TEAM_PLAYBOOK_v1.0.md`,
  `AUDITING_FRAMEWORKS_UNKNOWN_UNKNOWNS_INT_AUDIT_PLAN.md`.
- **Decision history:** `CLARIFIERS.md`, `CLARIFIERS_1_3_RESOLVED.md`,
  `CLARIFIERS_5_GROUND_v3.1_IN_BEST_PRACTICES.md` capture the open questions and the choices that
  shaped v3.1/v4.x — read these before reversing a design decision.

When creating a new version, **follow the established pattern**: copy to a new `vN.M`-named file and
preserve the prior one as a snapshot rather than overwriting in place.

## The shared data model (`roleDatabase` — v3.1 HTML implements it as `ROLES_DATA`)

`roleDatabase` is the conceptual schema name used across the MD specs and the guide. The **canonical
v3.1 generator implements the same schema as `const ROLES_DATA`** (renamed from `roleDatabase` between
v3.0 and v3.1); v3.0-and-earlier HTML snapshots still use `roleDatabase`. Every generator and spec is
built around this one role schema. Keep these consistent across HTML and MD when changing a role:

- **Classification:** `family`, `level` (IC 1-7 / Mgmt 1-3 / Exec 4-5), `esco` (ESCO/ISCO code), `title`, `summary`
- **Behavior:** `commStyle` (`analytical` | `practical` | `conversational` | `analytical-practical`),
  `depth` (`brief` | `moderate` | `comprehensive`), `analogies` (bool), `formats[]` (code/tests/docs/analysis/…)
- **Security:** `authMethod` (SAML 2.0 SSO | API Key), `dataRetention` (Standard | Enterprise ZDR),
  `compliance[]` (SOC 2 / HIPAA / PCI-DSS / GDPR / SOX), `codeEgress` (none | restricted | all)
- **Capabilities:** `features{}` boolean flags (artifacts, webSearch, codeExecution, fileCreation, memory, research, skills), `integrations[]`
- **Justification:** `useCases`, `rationale`

Security posture is driven by data classification (Public → Internal → Confidential → Restricted);
ZDR + air-gapped code execution are reserved for AppSec/Finance/Exec and PII/PHI/PCI roles. The
classification → config matrix is the authority — see `CLAUDE_ROLE_TAXONOMY_GUIDE.md` and the v4.2 spec.

## Branding: active deliverables are templated

The folder is named `...-needs-rebranding` because the artifacts were originally branded for a
specific client, **"INT Inc."** The **9 active deliverables are now genericized** into
`{{DOUBLE_BRACE}}` placeholders (e.g. `{{COMPANY_NAME}}`, `{{HQ_CITY}}`, `{{EMPLOYEE_COUNT}}`,
`{{CEO_NAME}}`). **`BRAND_CONFIG.md` is the source of truth** mapping every placeholder to its
original value; the transformation scripts are `rebrand.ps1` + `rebrand-pass2.ps1`, with pristine
backups in `_rebrand_backup/`.

When working in the active files:
- **Do not reintroduce client-specific values** — use the existing `{{PLACEHOLDER}}` vocabulary
  (add new placeholders to `BRAND_CONFIG.md` if you need one that doesn't exist).
- **Filenames are intentionally still `INT_INC_*` / `intinc-*` / `INTINC_*`** (contents-only
  rebrand). Cross-file references point at these names — don't rename without fixing references.

Still client-branded **by design** (out of rebrand scope): the version snapshots
(`*v2.x*`/`*v3.0*`/`*v4.0*`/`*v4.1*`) and the `CLARIFIERS*` decision history, which preserve the
original INT Inc engagement as a frozen record.
