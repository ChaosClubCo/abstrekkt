---
name: troubleshooting-skills
description: Diagnose and fix Claude skill pack issues including corrupted zips, path errors, upload failures, and structure problems. Provides step-by-step fixes for Windows path length limits, special characters, wrong folder hierarchies, and YAML errors. Use when user encounters skill upload errors, file access problems, skill not triggering, SKILL.md not found, invalid frontmatter, or any mention of broken skill packs. Even if someone says "my skill won't upload" or "getting an error with my skill zip" — use this skill.
allowed-tools: "Bash, Read, Write, Glob"
metadata:
  version: "1.0.0"
---

<essential_principles>

### 1. Diagnose Before Fixing

Always identify the root cause before applying a fix. Ask: what error message, at what step (creation/upload/usage), and what platform (Windows/Mac/Linux).

### 2. Fix the Structure, Not the Symptoms

Most skill pack problems come from three things: wrong zip structure, bad YAML frontmatter, or platform-specific path issues. Fix the underlying structure and the symptoms resolve.

### 3. Validate After Every Fix

Never declare success without verifying. Extract the fixed zip, check SKILL.md is at the right level, validate YAML, and test upload if possible.

</essential_principles>

<triage>

### Step 1: Identify the Error

| Error Message / Symptom | Category | Go To |
|--------------------------|----------|-------|
| "Path too long" / "Location unavailable" | Windows paths | `references/platform-fixes.md` |
| "SKILL.md not found" / "Multiple top-level items" | Zip structure | `references/fix-catalog.md` → Structure |
| "Invalid frontmatter" / "Missing required field" | YAML | `references/fix-catalog.md` → YAML |
| "File unavailable" / corrupted filename / wrong extension | Corrupted zip | `references/fix-catalog.md` → Corrupted |
| Skill uploads but doesn't trigger | Name/description | `references/fix-catalog.md` → Name Format |
| Need to diagnose programmatically | Scripts | Run `scripts/diagnose.py`, then `scripts/auto-fix.py` |
| Full walkthrough | Workflow | `workflows/diagnose-and-fix.md` |

### Step 2: Ask Clarifying Questions (if needed)

1. What error message do you see? (exact text)
2. At what step does it fail? (creation, upload, or usage)
3. What platform? (Windows, Mac, Linux)
4. Can you extract the zip file locally?

### Step 3: Apply Fix → Validate → Prevent

After applying any fix from the references:
1. Extract the fixed zip to verify structure
2. Check YAML frontmatter syntax
3. Test upload
4. Share the relevant prevention tip so it doesn't happen again

</triage>

<quick_reference>

**Correct skill pack structure:**
```
my-skill.zip
└── my-skill/          ← Single top-level folder
    ├── SKILL.md       ← Required, with YAML frontmatter
    ├── workflows/     ← Optional
    ├── references/    ← Optional
    └── scripts/       ← Optional
```

**Correct YAML frontmatter:**
```yaml
---
name: my-skill-name
description: What it does and when to use it (max 1024 chars)
---
```

**Naming rules:**
- Lowercase letters, digits, and hyphens only (`[a-z0-9-]`)
- No spaces, underscores, or special characters
- Max 64 characters
- Folder name must match the `name:` field
- No angle brackets in description

**Allowed frontmatter fields:** name, description, license, allowed-tools, metadata, compatibility

</quick_reference>

<reference_index>

| Workflow | Purpose | When to Read |
|----------|---------|--------------|
| `workflows/diagnose-and-fix.md` | Step-by-step: diagnose → auto-fix → verify → manual fix → prevent | Any skill pack issue |

| Reference | Purpose | When to Read |
|-----------|---------|--------------|
| `references/fix-catalog.md` | Detailed fixes for corrupted zips, structure problems, YAML errors, name format issues | Applying a specific manual fix |
| `references/platform-fixes.md` | Windows, macOS, and Linux specific issues and solutions | Platform-specific errors |

| Script | Purpose | When to Run |
|--------|---------|-------------|
| `scripts/diagnose.py` | Automated diagnosis of skill packs (zip, .skill, or directory) | First step for any skill pack issue |
| `scripts/auto-fix.py` | Automatically fix structure problems (wrong nesting, junk files, name mismatch) | After diagnosis identifies fixable issues |

</reference_index>

<quality_gates>

A skill pack fix is complete when:

- [ ] `scripts/diagnose.py` reports zero issues on the fixed pack
- [ ] Zip/skill file has a single top-level folder matching the name field
- [ ] SKILL.md has valid YAML frontmatter with name and description
- [ ] No phantom references (every mentioned file exists)
- [ ] Upload succeeds in Claude.ai or Claude Desktop
- [ ] Skill triggers correctly on a test prompt

**CI integration note:** Run `scripts/diagnose.py` in your environment as a validation gate before publishing skills. Configure the script path via environment variables if integrating into automated pipelines (`SKILL_VALIDATE_PATH`).

</quality_gates>


---

## CLAIMS
<!-- [SOURCED] or [GENERATED] labels for assertions in this skill. None yet — footer added by audit fix pass. -->

## COUNTEREXAMPLE
<!-- Known cases where this skill should NOT activate or may produce wrong output -->

## CONTRADICTIONS
<!-- ! Conflicts with other skills or system prompts -->
