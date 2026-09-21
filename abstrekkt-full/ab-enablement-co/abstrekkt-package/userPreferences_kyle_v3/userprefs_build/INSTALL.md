# userPreferences Install — v3

## What's here
- `userPreferences.md` — XML-structured system preferences for Claude.ai

## How to install
1. Open `userPreferences.md`
2. Select all (Ctrl+A) and copy
3. Go to claude.ai → Settings (bottom-left avatar) → Profile
4. Find the Preferences text field
5. Select all existing content, delete, paste
6. Save

Takes effect on the next new conversation. Current conversations won't pick it up.

## What changed vs. v2 (XML zip)
v2 had the three-layer persona and structured anti-slop lexicon but was missing
three sections that were live in your authoritative project-knowledge version:

- `<rigor>` — verification discipline, no invented precision, flag edge-of-knowledge
- `<file_operations>` — str_replace-only editing rules (hard constraint, was
  previously undocumented in the XML build)
- `<execution_bias>` — actionable > frameworks (nested under decision_defaults)
- `<general_anti_patterns>` — generic scaffolding / buzzword density / silent
  assumptions / TODO-in-finished-work (nested under anti_slop_lexicon, sits
  alongside the more granular text/design/code bans)
- `<code_output>` — smoke test requirement, file tree first on multi-file builds
  (nested under deliverable_format)
- `<default_role>` — "always act as a production release engineer" restored as
  an explicit top-line default

Identity rules also tightened to match your exact authoritative wording
(tool count framing, L1 SME framing, Kinsley exclusion).

Nothing from v2's persona/narrative-mode/lexicon work was dropped.

## Full section list (v3)
- operating_principals (three-layer persona incl. default_role)
- communication + identity_rules
- response_structure
- rigor
- anti_slop_lexicon (general / text / narrative / design / code bans)
- skill_audit_mode
- veteran_moves
- decision_defaults (incl. execution_bias)
- scope_gate
- deliverable_format (incl. code_output, internal_review gate)
- file_operations
- security_rules
- clarifier_protocol
- system_references
