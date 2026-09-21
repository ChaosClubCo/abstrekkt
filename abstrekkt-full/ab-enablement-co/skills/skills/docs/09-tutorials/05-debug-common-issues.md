# Tutorial 05: Debug Common Issues

A troubleshooting reference for the most frequent errors encountered when working
with the Skills Library. Each section shows the exact error message, explains the
cause, and provides the fix.

---

## Issue 1: UnicodeDecodeError on Windows

### Error Message

```
Traceback (most recent call last):
  File "sync-skills.py", line 734, in _discover_skills
    text = skill_path.read_text()
  ...
UnicodeDecodeError: 'charmap' codec can't decode byte 0x9d in position 1247: character maps to <undefined>
```

### Cause

Windows uses cp1252 as the default encoding for Python file I/O. Many SKILL.md
files contain UTF-8 characters (em dashes, curly quotes, accented characters)
that cp1252 cannot decode.

### Fix

Set the `PYTHONIOENCODING` environment variable before running any Python script.

**Bash (Git Bash, WSL, macOS, Linux):**

```bash
export PYTHONIOENCODING=utf-8
```

**Windows CMD:**

```cmd
set PYTHONIOENCODING=utf-8
```

**Windows PowerShell:**

```powershell
$env:PYTHONIOENCODING = "utf-8"
```

This must be set in every new terminal session. To make it permanent on Windows,
add `PYTHONIOENCODING` as a system environment variable through System Properties
> Environment Variables.

### Verification

```bash
$ python -c "import sys; print(sys.stdout.encoding)"
```

Expected output: `utf-8`

---

## Issue 2: Missing Required Field: name

### Error Message

```
[FAIL] technical/my-new-skill (score: 0)
  ERROR: Frontmatter: 'name' field is missing or empty.
```

### Cause

The SKILL.md file is missing YAML frontmatter or the `name` field is not present.
Every SKILL.md must begin with a YAML frontmatter block:

```yaml
---
name: my-new-skill
description: A description with action verbs like create, build, or analyze.
---
```

### Fix

Open the SKILL.md file and add or correct the frontmatter block at the very top
of the file. The `---` delimiters must be on their own lines, and the `name`
field must match the directory slug exactly.

**Correct format:**

```yaml
---
name: my-new-skill
description: Build and deploy custom widgets for dashboard applications. Use when creating reusable UI components or establishing widget design patterns.
---

# My New Skill

## Overview
...
```

**Common mistakes:**

```yaml
# WRONG: Missing opening ---
name: my-new-skill
description: Some description.
---

# WRONG: Extra whitespace before ---
  ---
name: my-new-skill
description: Some description.
---

# WRONG: Name has spaces or capitals
---
name: My New Skill
description: Some description.
---
```

### Verification

```bash
$ python lib/skill_validator.py --skill technical/my-new-skill
```

Expected: `[PASS]` with a score of 70 or higher.

---

## Issue 3: Slug Collision Detected

### Error Message

In `sync-skills.py` output, you may see two skills writing to the same output
path, with the second overwriting the first. The dedup logic applies a
`{category}--{slug}` prefix automatically, but if you see unexpected file counts
this may be the cause.

### Cause

Five skill slugs exist in multiple categories:

| Slug | Categories |
|------|-----------|
| packaging-design | ai-agents, creative |
| podcast-production | ai-agents, creative |
| presentation-design | ai-agents, creative |
| vendor-management | strategy, operations |
| inventory-management | ai-agents, operations |

When `sync-skills.py` discovers skills, it counts directory names across all
categories. If the same directory name appears more than once, it applies the
dedup prefix `{category}--{slug}` to all instances.

### How the Fix Works

In `sync-skills.py`, the dedup logic at line ~741 works as follows:

```python
dir_name_counts = Counter(Path(s['path']).parent.name for s in parsed_skills)
for s in parsed_skills:
    dn = Path(s['path']).parent.name
    if dir_name_counts[dn] > 1:
        s['_dedup_slug'] = f"{s['category']}--{dn}"
```

This means:
- `_master-skills/ai-agents/packaging-design/` outputs as `ai-agents--packaging-design`
- `_master-skills/creative/packaging-design/` outputs as `creative--packaging-design`

### What You Need to Do

Nothing, in most cases. The dedup is automatic. However, if you are creating a
new skill and your chosen slug matches one of the five collision groups listed
above, be aware that the output filenames will include the category prefix.

If you want to avoid the prefix, choose a more specific slug:

```
# Instead of:
_master-skills/technical/packaging-design/

# Use:
_master-skills/technical/npm-packaging-design/
```

### Verification

Run the sync with `--dry-run` to see the output paths:

```bash
$ python sync-skills.py --targets all --dry-run 2>&1 | grep "packaging-design"
```

Expected output shows the prefixed slugs:

```
    -> Gemini/GeminiSkills/gems/ai-agents/ai-agents--packaging-design.gem.json
    -> Gemini/GeminiSkills/gems/creative/creative--packaging-design.gem.json
```

---

## Issue 4: No SKILL.md Found

### Error Message

```
Syncing skill: technical/my-skill
ERROR: Skill not found: _master-skills/technical/my-skill/SKILL.md
```

### Cause

The `--skill` argument expects a `category/slug` reference that maps to
`_master-skills/{category}/{slug}/SKILL.md`. The error means either:

1. The directory does not exist
2. The directory exists but does not contain a file named `SKILL.md`
3. The file is named differently (e.g., `skill.md`, `Skill.md`, `README.md`)

### Fix

Check the directory structure:

```bash
$ ls _master-skills/technical/my-skill/
```

If the directory is empty or the file has the wrong name:

```bash
$ mv _master-skills/technical/my-skill/skill.md \
     _master-skills/technical/my-skill/SKILL.md
```

The filename must be exactly `SKILL.md` (all caps with `.md` extension).

### Verification

```bash
$ ls _master-skills/technical/my-skill/SKILL.md
```

Expected: the file path is printed without error.

---

## Issue 5: Invalid YAML Frontmatter

### Error Message

```
[FAIL] technical/my-skill (score: 0)
  ERROR: Frontmatter: 'name' field is missing or empty.
  ERROR: Frontmatter: 'description' field is missing or empty.
```

This can occur even when the frontmatter appears correct at a glance.

### Cause

The YAML frontmatter parser is strict about the `---` delimiters. Common causes:

1. The opening `---` is not on the very first line of the file (byte-order mark
   or blank line before it)
2. The closing `---` is missing
3. There are tabs instead of spaces in the YAML block
4. The description contains an unescaped colon that breaks YAML parsing

### Fix

**Check for BOM (byte-order mark):**

```bash
$ xxd _master-skills/technical/my-skill/SKILL.md | head -1
```

If the output starts with `efbb bf`, the file has a UTF-8 BOM. Remove it:

```bash
$ sed -i '1s/^\xEF\xBB\xBF//' _master-skills/technical/my-skill/SKILL.md
```

**Check for missing closing delimiter:**

The file must have exactly two `---` lines: one at line 1, one after the last
frontmatter field.

```yaml
---
name: my-skill
description: Build custom integrations. Use when connecting third-party services.
---
```

**Escape colons in descriptions:**

If your description contains a colon followed by a space, wrap it in quotes:

```yaml
---
name: my-skill
description: "Build tools for CI/CD: automated testing, deployment, and monitoring pipelines."
---
```

### Verification

```bash
$ python lib/skill_validator.py --skill technical/my-skill
```

---

## Issue 6: Node.js Errors in convert-to-copilot.js

### Error Message

```
SyntaxError: Unexpected token '?.'
    at wrapSafe (internal/modules/cjs/loader.js:915:16)
```

Or:

```
Error: Cannot find module 'fs/promises'
```

### Cause

The `convert-to-copilot.js` script uses modern JavaScript features (optional
chaining `?.`, `fs/promises`, top-level await) that require Node.js 18 or later.

### Fix

Check your Node.js version:

```bash
$ node --version
```

If the version is below 18, upgrade Node.js:

- **macOS/Linux (nvm):**
  ```bash
  nvm install 18
  nvm use 18
  ```
- **Windows:** Download the installer from https://nodejs.org/

If upgrading is not possible, skip the Copilot target:

```bash
$ python sync-skills.py --targets claude,gemini,codex,cli
```

### Verification

```bash
$ node --version
```

Expected: `v18.x.x` or higher.

```bash
$ node convert-to-copilot.js --help
```

Expected: help text prints without errors.

---

## Issue 7: Empty Platform Output Directories

### Error Message

No error message -- the platform output directories simply contain no files
after running `populate_all.py`.

### Cause

`populate_all.py` operates on the output of `sync-skills.py`. If `sync-skills.py`
has not been run first, the platform output directories (Claude/ClaudeSkills/,
Gemini/GeminiSkills/gems/, etc.) will be empty, and `populate_all.py` will have
nothing to bundle.

### Fix

Run the pipeline in the correct order:

```bash
$ python fix_skills_unified.py --all
$ python sync-skills.py --targets all
$ python populate_all.py --phase all
```

### Verification

Check that the primary output directories have content:

```bash
$ ls Claude/ClaudeSkills/skills/ | head -5
$ ls Gemini/GeminiSkills/gems/ | head -5
$ ls GithubCopilot/CopilotSkills/custom-instructions/ | head -5
$ ls Codex/CodexSkills/ | head -5
```

Each should list category directories or skill files.

---

## Issue 8: Bundle Generation Produces 0 Files

### Error Message

In `populate_all.py` output:

```
  gemini/frontend-starter-15: 0
  codex/frontend-starter-15: 0
  copilot/frontend-starter-15: 0
```

### Cause

The skill slug list in your bundle configuration does not match any discovered
skills. Common reasons:

1. **Typo in slug name.** The slug `frontend-dev` does not match
   `frontend-development`.
2. **Skills not parsed yet.** The `populate_bundles` function receives a list of
   parsed skills. If `_master-skills/` is empty or the skills have not been
   discovered, the list is empty.
3. **Using `name` instead of slug.** The bundle filter matches against the `slug`
   field (directory name), not the frontmatter `name` field. These are usually
   the same, but verify.

### Fix

**Check slug names:**

```bash
$ ls _master-skills/technical/ | grep frontend
```

Expected output lists the exact directory names to use:

```
frontend-design
frontend-dev-guidelines
frontend-development
```

**Verify the slug list in populate_all.py:**

Open `populate_all.py` and confirm each slug in your `FRONTEND_STARTER_SLUGS`
list matches an existing directory name in `_master-skills/`.

**Check skill discovery:**

```bash
$ python sync-skills.py --targets all --dry-run 2>&1 | head -5
```

Expected output shows the total discovered count:

```
Discovered 507 skills in _master-skills
```

If this says 0, the `_master-skills/` directory is empty or not at the expected
path.

### Verification

After fixing the slug names, regenerate:

```bash
$ python populate_all.py --phase bundles
```

The bundle counts should now show 15 (or your expected number).

---

## Issue 9: Permission Denied on Deployment

### Error Message

```
cp: cannot create regular file '/home/user/.claude/commands/SKILL.md': Permission denied
```

Or on Windows:

```
Access is denied.
```

### Cause

The target directory either does not exist, is read-only, or is owned by a
different user.

### Fix

**Create the target directory if it does not exist:**

```bash
$ mkdir -p ~/.claude/commands
```

**Check permissions:**

```bash
$ ls -la ~/.claude/
```

If the directory is owned by root (common after `sudo` operations):

```bash
$ sudo chown -R $(whoami) ~/.claude/
```

**On Windows, check for read-only attributes:**

```cmd
attrib -R "%USERPROFILE%\.claude\commands" /S /D
```

**Alternative: copy to a different location:**

If you cannot fix permissions on the default config directory, copy to a
project-local directory instead:

```bash
$ cp -r Claude/ClaudeSkills-CLI/.claude/commands .claude/commands
```

This works for Claude CLI when you run it from the project directory.

### Verification

```bash
$ cp -r Claude/ClaudeSkills-CLI/.claude/commands ~/.claude/commands
$ ls ~/.claude/commands/ | head -5
```

Expected: skill files are listed without errors.

---

## Quick Reference Table

| Error | Cause | Fix |
|-------|-------|-----|
| `UnicodeDecodeError: 'charmap'` | Windows cp1252 encoding | `export PYTHONIOENCODING=utf-8` |
| `'name' field is missing or empty` | No YAML frontmatter | Add `---` block with `name` and `description` |
| Slug collision / duplicate output | Same slug in 2+ categories | Automatic dedup with `{category}--{slug}` prefix |
| `Skill not found: .../SKILL.md` | Wrong path or filename | Ensure `SKILL.md` (uppercase) exists in slug directory |
| `'name' field missing` despite frontmatter | BOM, missing `---`, or bad YAML | Check first bytes, delimiters, colon escaping |
| `SyntaxError: Unexpected token '?.'` | Node.js < 18 | Upgrade to Node.js 18+ |
| Empty platform output directories | `sync-skills.py` not run first | Run sync before populate |
| Bundle count is 0 | Slug typo or empty skill list | Verify slugs match `_master-skills/` directory names |
| `Permission denied` on deploy | Missing directory or wrong owner | `mkdir -p` and `chown` the target directory |

---

## Getting Further Help

If your issue is not listed here:

1. Run the failing command with `--verbose` or `--dry-run` for more detail.
2. Check the [Scripts Reference](../SCRIPTS_REFERENCE.md) for full argument
   documentation.
3. Run the validator on the problematic skill for a detailed diagnosis:
   ```bash
   $ python lib/skill_validator.py --skill category/slug-name
   ```
4. Search for the error message in the script source code to understand the
   exact condition that triggers it.
