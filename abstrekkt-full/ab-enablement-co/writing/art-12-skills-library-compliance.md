# Skills Library — Compliance Resolver

> 50 skills built. 4 known compliance gaps gating Intinc deploy. This document is the runbook to close all 4 gaps in a single mechanical pass and validate against current Anthropic spec. Estimated effort: 3-4 hours including validation.

---

## The 4 known gaps

| # | Gap | What's broken | Why it matters |
|---|-----|---------------|----------------|
| 1 | Missing "Use when..." triggers | Skill descriptions don't include explicit trigger phrases | Skill won't activate reliably; Claude can't tell when to invoke it |
| 2 | Version not nested under metadata | Top-level `version:` instead of `metadata.version:` | Spec violation; will fail validation in skill packaging tooling |
| 3 | Hooks present on claude.ai skills | Some skills include `hooks:` blocks for code-execution behaviors that aren't supported in claude.ai context | Will silently fail at runtime; user sees no error but skill doesn't behave correctly |
| 4 | `allowed-tools` not least-privilege | Skills declare broad tool access (e.g., all bash) when they only need a subset | Security debt; some clients will reject deploys that grant unnecessary tool access |

---

## The mechanical fix (recommended approach)

Don't fix 50 files by hand. Write a transformer, run it, validate, commit.

### Step 1 — Audit current state

Run an inventory script that, for each `SKILL.md`, reports:

- Does the description start with "Use when..." or "Triggers when..."? Y/N
- Is `version:` at the top level or nested under `metadata:`?
- Does the file contain a `hooks:` block?
- What's listed in `allowed-tools:`?

```bash
#!/bin/bash
# audit-skills.sh — pre-fix inventory
cd /path/to/skills-library
for skill in */SKILL.md; do
  skill_dir=$(dirname "$skill")
  has_use_when=$(grep -E "^description:.*[Uu]se when" "$skill" | wc -l)
  version_top=$(grep -E "^version:" "$skill" | wc -l)
  has_hooks=$(grep -E "^hooks:" "$skill" | wc -l)
  allowed_tools=$(grep -E "^allowed-tools:" "$skill" | sed 's/allowed-tools:[[:space:]]*//')
  echo "$skill_dir|use_when=$has_use_when|version_top=$version_top|hooks=$has_hooks|tools=$allowed_tools"
done > skills-audit-pre-fix.txt
```

Output goes to `skills-audit-pre-fix.txt`. Review that file before running the transformer.

### Step 2 — Transform

The transformer applies all 4 fixes in a single pass.

```python
#!/usr/bin/env python3
# transform-skills.py — applies the 4 compliance fixes
import re, yaml, sys, os
from pathlib import Path

SKILLS_DIR = Path("./skills-library")  # adjust as needed

# Whitelist of tools each skill type actually needs
DEFAULT_TOOL_MINIMA = {
    "writing": ["create_file", "view"],
    "data": ["bash_tool", "view"],
    "design": ["view"],
    "automation": ["bash_tool"],
    # fall-through default — minimal
    "_default": ["view"]
}

def fix_skill(path: Path) -> dict:
    """Apply all 4 fixes to a single SKILL.md. Returns a report."""
    text = path.read_text()
    report = {"path": str(path), "fixes_applied": []}

    # Split frontmatter and body
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.DOTALL)
    if not m:
        report["error"] = "no frontmatter"
        return report

    fm_raw, body = m.group(1), m.group(2)
    try:
        fm = yaml.safe_load(fm_raw) or {}
    except Exception as e:
        report["error"] = f"yaml parse failed: {e}"
        return report

    # FIX 1: Add "Use when..." trigger to description if missing
    desc = fm.get("description", "")
    if "use when" not in desc.lower() and "triggers when" not in desc.lower():
        # Append a trigger if we can infer one from the skill name
        skill_name = path.parent.name
        verb = skill_name.split("-")[0] if "-" in skill_name else skill_name
        new_trigger = f" Use when the user needs to {verb} the relevant subject matter."
        fm["description"] = desc.rstrip(".") + "." + new_trigger
        report["fixes_applied"].append("added Use-when trigger")

    # FIX 2: Move version under metadata
    if "version" in fm and not isinstance(fm.get("metadata"), dict):
        version = fm.pop("version")
        fm["metadata"] = {"version": version}
        report["fixes_applied"].append("moved version to metadata")
    elif "version" in fm and isinstance(fm.get("metadata"), dict):
        fm["metadata"]["version"] = fm.pop("version")
        report["fixes_applied"].append("merged version into existing metadata")

    # FIX 3: Strip hooks block (claude.ai skills don't support it)
    if "hooks" in fm:
        del fm["hooks"]
        report["fixes_applied"].append("removed hooks block")

    # FIX 4: Tighten allowed-tools to least-privilege
    if "allowed-tools" in fm:
        current_tools = fm["allowed-tools"]
        skill_category = path.parent.name.split("-")[0] if "-" in path.parent.name else "_default"
        minimal_tools = DEFAULT_TOOL_MINIMA.get(skill_category, DEFAULT_TOOL_MINIMA["_default"])
        # Keep the intersection of declared and minimal — never expand
        if isinstance(current_tools, list):
            tightened = [t for t in current_tools if t in minimal_tools or t in current_tools[:len(minimal_tools)]]
            if tightened != current_tools:
                fm["allowed-tools"] = tightened
                report["fixes_applied"].append(f"tightened allowed-tools: {len(current_tools)} -> {len(tightened)}")

    # Write back
    new_fm = yaml.safe_dump(fm, sort_keys=False, default_flow_style=False).strip()
    new_text = f"---\n{new_fm}\n---\n{body}"
    path.write_text(new_text)
    return report

def main():
    reports = []
    for skill_md in SKILLS_DIR.rglob("SKILL.md"):
        reports.append(fix_skill(skill_md))

    fixed = sum(1 for r in reports if r.get("fixes_applied"))
    errors = sum(1 for r in reports if r.get("error"))
    print(f"Processed: {len(reports)} skills")
    print(f"Fixed: {fixed}")
    print(f"Errors: {errors}")
    print()
    for r in reports:
        if r.get("error"):
            print(f"ERROR {r['path']}: {r['error']}")
        elif r.get("fixes_applied"):
            print(f"FIXED {r['path']}: {', '.join(r['fixes_applied'])}")

if __name__ == "__main__":
    main()
```

**Notes on the transformer:**
- It's deliberately conservative. It only *removes* tool permissions, never adds.
- The "Use when..." trigger inference is a fallback — if a skill needs a more specific trigger, it should be hand-edited after the script runs.
- The allowed-tools tightening uses a category-based whitelist that may not match every skill's needs. Review the output report carefully.

### Step 3 — Re-audit

Run the audit script again on the post-fix state. Output to `skills-audit-post-fix.txt`. Diff against `skills-audit-pre-fix.txt`.

```bash
diff skills-audit-pre-fix.txt skills-audit-post-fix.txt > fix-diff.txt
```

Spot-check 5 random skills manually before committing. If any look wrong, the transformer needs adjustment, not the skills.

### Step 4 — Validate against spec

Run the official Anthropic skill validator (or whichever validation tooling is in use) against the full directory.

```bash
# whichever validator is current — placeholder
skill-validator --strict ./skills-library
```

Expected: zero validation errors. If errors remain, they're either edge cases the transformer missed (hand-fix) or they were always there and the transformer didn't introduce them.

### Step 5 — Commit

One commit per fix, not one giant commit. Reviewers can revert a single fix if needed without losing the others.

```
git checkout -b fix/skills-compliance-gaps

git add */SKILL.md
git commit -m "fix(skills): add Use-when triggers to descriptions"

# Repeat the audit to isolate the next class of changes, commit separately
```

---

## Validation checklist (pre-deploy)

After all fixes land, before deploying to Intinc:

- [ ] All 50 skills have "Use when..." or equivalent trigger phrase in description
- [ ] All 50 skills have `version` nested under `metadata`
- [ ] No skill includes a `hooks:` block
- [ ] Every skill's `allowed-tools:` is the minimum needed for the skill to function
- [ ] All 50 skills pass the official validator
- [ ] At least 5 skills have been hand-tested in claude.ai to verify they trigger and execute correctly
- [ ] The audit-pre-fix and audit-post-fix files are saved as a deployment artifact

---

## Manual review queue (after the transformer runs)

Some fixes the transformer can't safely automate. These need eyes:

**Skills where the inferred "Use when..." trigger is generic.** The transformer's fallback is "Use when the user needs to [verb] the relevant subject matter." That works but is weak. For high-traffic skills, write better triggers manually.

**Skills with custom metadata fields beyond `version`.** If a skill has fields the transformer doesn't recognize, they'll be preserved but order may change. Verify the YAML still parses.

**Skills with allowed-tools the whitelist doesn't cover.** The category whitelist is conservative. If a skill genuinely needs broader access (e.g., a skill that does file conversion may need both `bash_tool` and `view` and `create_file`), the transformer's tightening will be too aggressive. Audit the diff.

---

## Risk patterns

**Risk: Transformer breaks a skill that was working.** Mitigation: run on a branch, review the diff, keep the pre-fix state as a tag for fast rollback.

**Risk: Spec changes after the fix lands.** Mitigation: re-run validation against current spec quarterly. The 4 gaps documented here are correct as of May 2026; they may not be the only gaps in 6 months.

**Risk: Compliance is fixed but skills still don't work in production.** This means there's a 5th gap not yet diagnosed. Run a smoke test on 10 random skills after deploy to surface it.

---

## When to deploy

Once all 4 gaps close and validation passes:

1. Run the smoke test on 10 random skills in claude.ai
2. Deploy to Intinc internal environment
3. Watch for first 7 days — error rate, usage frequency, user feedback
4. After 7 days clean, expand to broader internal user pool

Not before. The 4-gap fix unblocks the *deploy*. It doesn't make the skills good. Quality is a separate audit, not a compliance audit.

---

**CLAIMS / COUNTEREXAMPLES / CONTRADICTIONS**
- [SOURCED] The 4 gaps come from project memory (Skills Library context).
- [GENERATED] Estimated 3-4 hour effort is reasoned from typical transformer-runtime patterns, not measured.
- ! [GENERATED] The DEFAULT_TOOL_MINIMA whitelist is illustrative — real categories should be aligned with the actual skill taxonomy in the library.

**GAPS / BLINDSPOTS / UNKNOWN-UNKNOWNS**
- Unknown whether the official validator's current ruleset matches the 4 gaps documented here, or has additional checks.
- Unknown whether any skills depend on `hooks:` for behavior that the deploy environment expects (Cowork vs. claude.ai differs).
- Unknown if the version-nesting fix breaks any external tooling that reads top-level `version:`.
- Doesn't address skill *content* quality — only structural/spec compliance.
