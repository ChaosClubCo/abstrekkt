# Staff Engineer System Instructions (ZIP_SPEC)

> Reconstructed from source chat
> `Staff engineer system instructions v4.1` (uuid `596a7a69…`, batch-0001).
> The source is Kyle's iteratively-refined Claude **persona / custom-instructions**
> for a Staff Platform/AppSec Engineer (reaching v4.1), plus a companion thread
> that revamps his `memory_user_edits` from stale facts to behavioral rules —
> triggered by a real failure where Claude bled archived-FlashFusion print-on-demand
> assumptions into an unrelated Intinc project. This package consolidates the
> canonical v4.1 prompt and ships the memory revamp, an install guide, and a
> behavioral test suite.

## 1. Executive Summary

A drop-in **AI persona** that turns any Claude surface (web custom instructions,
Project system prompt, Claude Code `CLAUDE.md`, or API `system`) into a
security-first Staff Engineer that teaches analogy-first, scopes work with
explicit prefixes, and refuses to hallucinate. Its distinguishing feature is
**honesty machinery**: a mandatory Gaps & Blindspots protocol, a pre-delivery
Hallucination Audit, and a "default to the Claude Code CLI + write docs a
non-technical operator can follow" bridging rule. The package pairs the prompt
with a **memory-edits revamp** (7 behavioral edits replacing 10 stale factual
ones) that fixes the exact cross-project context-bleed bug that motivated v4.1.

## 2. What it produces

- A **persona** with consistent response grammar (TL;DR → Analogy → Plan → Steps
  → Code → Tests → Docs → Quality Gates → Gaps → Critique → CLAIMS footer) for
  non-trivial work, and a terse correct path for trivial work.
- A **scope protocol**: `[SPIKE] [PROD] [SKEPTIC] [SKELETON] [DIFF]` with a
  conflict rule (default `[PROD]`).
- **Behavioral memory** that prevents context bleed, forbids stack assumptions,
  bans fabricated resources, and forces tiered options before audits.

## 3. Architecture

```
                 staff-engineer-v4.1.md  (the persona)
                          │
   Tier 0 Contract ──▶ Tier 1 Grammar ──▶ Tier 2 Decisions ──▶ Tier 3 Depth ──▶ Tier 4 Ops
   (role, security      (analogy formula,   (prefixes, stack    (OWASP gates,    (memory check,
    floor, bridging)     comms rules)        defaults, tools)    LLM 5-layer)     hallucination audit)
                          │
        ┌─────────────────┼───────────────────────────┐
        ▼                 ▼                           ▼
  docs/INSTALL.md   memory/behavioral-          tests/persona-tests.md
  (4 install         memory-edits.md             (T1–T8 behavior assertions
   surfaces +        (7 behavioral edits          + acceptance criteria)
   rollback)          replacing 10 stale facts)
```

Two honest design constraints carried from source:
1. **Install steps are not persona behavior** — the source had paste-into-settings
   steps inlined in the prompt; this package moves them to `docs/INSTALL.md` so the
   system prompt is pure behavior.
2. **Defaults ≠ assumptions** — the stack list is explicitly labeled as editable
   defaults, because the source's central lesson was "I do not keep a fixed stack."

## 4. Build

No build step — these are paste-ready Markdown artifacts. To "assemble":
1. Copy `system-prompt/staff-engineer-v4.1.md` into your chosen Claude surface
   (see `docs/INSTALL.md`).
2. Apply the 7 edits in `memory/behavioral-memory-edits.md` via `memory_user_edits`
   and remove the stale factual edits listed there.
3. Validate with `tests/persona-tests.md`.

### File tree
```
staff-engineer-system-instructions/
├── README.md
├── system-prompt/
│   ├── staff-engineer-v4.1.md      # canonical persona (paste this)
│   └── CHANGELOG.md                # version history (v4.1 exact; ≤v3 inferred)
├── memory/
│   └── behavioral-memory-edits.md  # 7 behavioral edits + migration/removal list
├── docs/
│   └── INSTALL.md                  # 4 install surfaces + rollback
└── tests/
    └── persona-tests.md            # T1–T8 + acceptance criteria
```

## 5. Output

The runtime output is **Claude's behavior**: scoped, analogy-first, security-gated
responses with explicit honesty footers. The static deliverables are the 6 files
above.

## 6. Implementation Considerations

- **Surface choice matters.** Project-scoped instructions (Option B) beat global
  custom instructions if you work across genuinely different contexts — it
  operationalizes the "no context bleed" rule structurally.
- **Memory vs. prompt overlap.** Some Tier-4 rules (memory checkpoint) assume the
  `memory_user_edits` tool exists on the surface; on API/CLI it may not. The prompt
  degrades gracefully (it just won't call the tool).
- **Length.** The full v4.1 prompt is sizable; on token-billed surfaces (API),
  enable prompt caching.
- **Ownership.** Persona drift is real — treat `CHANGELOG.md` as the source of
  truth and bump the version on every edit.

## 7. Performance / Security Notes

- **Secrets:** the prompt is secrets-free and instructs env-vars-only + "never
  echo secrets." Keep real keys out of any instruction surface.
- **Untrusted input / code execution:** the persona never auto-executes code and
  separates instructions from data (LLM Safety layer 2) — preserve those lines.
- **Cost/perf:** large system prompts increase per-call tokens; cache on API,
  and prefer Project-scoped install to avoid loading it into unrelated chats.
- **Compliance pointers are not compliance:** the SOC2/HIPAA/PCI/GDPR map is a
  checklist of *pointers*; the prompt itself tells Claude to flag "your team must
  verify." Do not treat it as legal assurance.

## 8. Recommended Next Steps

1. Install via Option A or B, run `tests/persona-tests.md`, fix any **Fail**.
2. Apply the behavioral memory edits and delete the stale factual ones.
3. Decide global vs. per-project scope (per-project recommended).
4. On the next persona change, bump `CHANGELOG.md` and re-run the test suite.
5. (Optional) Recover the true v3 text from history to replace the *inferred*
   changelog entries.

## 9. CLAIMS CHECK

**Verified (present in source):**
- The complete v4.1 prompt text (Tiers 0–4, analogy formula, prefix table, OWASP
  checkpoint, LLM 5-layer safety, frameworks, summary, pre-task checklist) — the
  source pastes it verbatim three times.
- The memory-revamp thread: 10 existing factual edits enumerated; rationale for
  switching to behavioral edits; the FlashFusion→Intinc context-bleed incident.
- Install steps (paste-into-Claude-settings) and the two original test prompts.

**Inferred (reconstructed/expanded, not verbatim):**
- The 7 behavioral edits are synthesized from the chat's stated intents
  (no-bleed, confirm-context, no-stack-assumptions, no-fabrication, tiered
  options, stale-flagging) fitted to the ~200-char edit limit.
- CHANGELOG entries for v3 and earlier (source only references `staff-engineer-v3`
  as an existing skill; exact older text not present).
- The persona-test expected-behaviors/acceptance criteria (T3–T8 extend the two
  source tests).

**Unresolved (needs user input):**
- Exact prior-version (v1–v3) prompt text.
- Which Claude surface Kyle ultimately standardized on (the chat ended weighing
  CLI vs. web for tool discovery).
- Final wording Kyle actually committed to memory (the chat proposed; commitment
  not shown).

**Contradictions (flagged):**
- `[PROD] [SPIKE]` appears together in a source test prompt — mutually exclusive
  scopes; resolved by v4.1's "default to [PROD] on conflict" rule.
- Source inlined operational install steps inside the *persona* prompt; separated
  here (prompt = behavior; INSTALL = operation).
- "Stack Defaults" list vs. the chat's "I don't keep a fixed stack" — resolved by
  relabeling the list as editable defaults that must be re-verified per project.

---
*No secrets or private credentials were found in or carried from the source.
Biographical identity already lives in Claude system memory and is intentionally
not re-added as a user edit.*
