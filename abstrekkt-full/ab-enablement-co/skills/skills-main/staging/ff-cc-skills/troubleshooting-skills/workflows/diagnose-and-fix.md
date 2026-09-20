# Diagnose and Fix Workflow

## Purpose
Step-by-step procedure for diagnosing and fixing a broken skill pack. Works with .zip, .skill files, or unpacked directories.

---

## Step 1: Run Automated Diagnosis

```bash
python scripts/diagnose.py skill-name.zip
# or
python scripts/diagnose.py skill-name.skill
# or
python scripts/diagnose.py /path/to/skill-directory/
```

The script checks: valid archive, single top-level folder, SKILL.md location, YAML frontmatter validity, name format, description length, angle brackets, and phantom references.

**If diagnosis reports "No issues"** — the skill pack is structurally valid. The problem is likely elsewhere (Claude session, upload UI, or the skill content itself).

**If diagnosis reports issues** — continue to Step 2.

---

## Step 2: Attempt Auto-Fix

```bash
python scripts/auto-fix.py broken-skill.zip
```

The auto-fix script handles:
- Files at root level (wraps in folder)
- Extra nesting (flattens to correct level)
- .DS_Store and __MACOSX removal
- Folder name alignment with YAML name field

**Output:** Creates `{name}-fixed.skill` in the current directory.

---

## Step 3: Verify the Fix

```bash
python scripts/diagnose.py skill-name-fixed.skill
```

If the fix passes diagnosis, try uploading. If it still fails, the issue requires manual intervention — see Step 4.

---

## Step 4: Manual Fix (if auto-fix fails)

Read `references/fix-catalog.md` for the specific issue category:

| Diagnosis Output | Fix Catalog Section |
|-----------------|---------------------|
| "Not a valid zip file" | Corrupted Zip Files |
| "SKILL.md not found" or "Multiple top-level folders" | Structure Problems |
| "Missing YAML frontmatter" or "Invalid YAML" | YAML Frontmatter Errors |
| "Name is not kebab-case" | Name Format Issues |

For platform-specific issues (path length, reserved filenames), read `references/platform-fixes.md`.

---

## Step 5: Prevention

After fixing, share the relevant prevention tip with the user:

- **Always use Python or the packaging script** to create zips — avoid OS-native zip tools
- **Keep paths short** — `C:\skills\` or `~/skills/`, not nested deep in Documents
- **No special characters** in filenames — lowercase letters, digits, hyphens only
- **Validate before uploading** — run `scripts/diagnose.py` on every skill pack before attempting upload
- **Folder name must match the `name:` field** in YAML frontmatter
