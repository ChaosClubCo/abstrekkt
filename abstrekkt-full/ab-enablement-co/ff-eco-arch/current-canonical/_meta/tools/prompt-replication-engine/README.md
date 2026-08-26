# Prompt-Replication Engine / Smart Content Assistant (ZIP_SPEC)

> Reconstructed from source chat
> `Prompt-Replication-Engine-implementation` (uuid `0af04939…`).
> Notable: the source's seed prompt — *"review entire conversations and extract
> all project deliverables and outputs"* — is a direct **conceptual ancestor of
> this Chat Extraction Kit**. Extracting it is the kit applied to its own origin.

## 1. Executive Summary

A meta-system that ingests a conversation and produces three things: **stated
deliverables**, **expert-level missing deliverables**, and **follow-up questions**
a domain expert would ask before starting. The source session then asked to turn
that idea into a real, local pipeline: audit an architecture, generate the actual
files (via Filesystem / Desktop Commander), extend it with 5 modules, extract
reusable components for INT Inc skill packs, and — critically — emit a
**system-level prompt for Claude Code CLI** to run the whole thing autonomously.

## 2. Extracted Systems Inventory

| Component | Type | Purpose |
|---|---|---|
| Deliverable extractor | prompt/engine | Stated + missing + follow-up extraction |
| Architecture audit pass | workflow | Inconsistencies, edge cases, rollback, retries, rate limiting, error logging |
| File generator | tool integration | Write real files via Filesystem/Desktop Commander |
| 5 extension modules | feature set | FlashFusion patterns, n8n workflow integrations, + 3 more |
| Reusable-component extractor | extraction | Harvest for INT Inc + skill packs |
| Drive/MCP harvester | integration | Search C:/D:, use active connectors/MCPs/skills |
| Claude Code CLI system prompt | prompt | Run the pipeline autonomously (ask #5) |

## 3. Gap & Risk Audit

- **Gaps:** the source defined the 5 asks and reached Phase 1 (Architecture Review
  & Design) but stalled in long "nudge/go" loops; the 5 extension modules and the
  drive-harvest were not completed.
- **Blindspots:** "search C: and D: drives" assumes those drives are mounted and
  trusted — in some environments D: is absent (as in the current session); the
  harvester must degrade gracefully.
- **Bottlenecks:** generating real files via Desktop Commander mid-chat is exactly
  the kind of long job that interrupts a web session — this is *why* a Claude Code
  CLI system prompt was requested (run it where file I/O is native).
- **Unknown-unknowns:** what "reusable" means for INT is undefined; module #4/#5
  ("etc.") were never specified.
- **Contradictions:** none.

## 4. Upgraded Architecture

```
Conversation ─► Extractor (stated / missing / follow-up)
                   │
                   ▼
             Architecture Audit (edge cases, rollback, retries, rate limit, logging)
                   │
                   ▼
             File Generator (Filesystem / Desktop Commander)  ◄─ runs best in Claude Code CLI
                   │
        ┌──────────┼───────────┐
        ▼          ▼           ▼
   5 Extension  Reusable-    Drive/MCP
   Modules      component    Harvester (degrades if a drive is absent)
                Extractor → INT skill packs
```

This is essentially the blueprint the Chat Extraction Kit later implemented as a
slash command + subagent + MCP tools. The kit's `extract_conversation` /
`audit_gaps` / `build_artifacts` / `package_zip_spec` map onto the extractor and
audit stages here.

## 5. Production Deliverables (file tree)

```
prompt-replication-engine/
├── README.md                                  (this file)
├── prompts/
│   ├── deliverable-extractor.txt              stated / missing / follow-up format
│   └── claude-code-cli-system-prompt.md       ← sample included (ask #5)
├── audit/
│   └── architecture-audit-checklist.md        edge cases, rollback, retries, rate limiting, logging
├── modules/                                   5 extensions (flashfusion-patterns, n8n-integrations, +3)
├── extraction/
│   └── int-skill-pack-mapping.md              reusable components → INT
└── harvest/
    └── drive-mcp-harvester.md                 C:/D: + connectors, graceful degradation
```

Signature artifact materialized: `prompts/claude-code-cli-system-prompt.md` —
the autonomous runner the source explicitly asked for.

## 6. Validation Checklist

- [ ] Extractor returns all three sections (stated / missing / follow-up)
- [ ] Audit pass covers edge cases, rollback, retries, rate limiting, error logging
- [ ] File generation runs in Claude Code CLI (native file I/O), not a web chat
- [ ] Drive/MCP harvester degrades gracefully when a drive (e.g. D:) is absent
- [ ] 5 extension modules each specified before build (no "etc." placeholders)
- [ ] Claims check completed (below)

## 7. Security Review

- The drive harvester reads arbitrary C:/D: content — treat everything found as
  untrusted, never auto-execute, and scan for secrets before including in output.
- Desktop Commander file writes must be scoped to an explicit output directory.

## 8. Recommended Next Steps

1. Run this pipeline from **Claude Code CLI** (this kit) rather than a web session.
2. Specify the 5 extension modules concretely before generating them.
3. Define the INT "reusable component" criteria so extraction is deterministic.

## 9. CLAIMS CHECK

- **Verified:** the deliverable-extraction seed prompt and its 3-section output
  format; the 5 explicit asks (audit, implement-via-Desktop-Commander, extend +5,
  extract for INT, emit a Claude Code CLI system prompt); reaching Phase 1.
- **Inferred:** the graceful-degradation requirement for the drive harvester is
  added by this kit (informed by D: being unmounted in the current environment).
- **Unresolved:** the identity of extension modules #4 and #5; the concrete
  definition of "reusable for INT."
- **Contradictions:** none.
