# Fix Catalog

## Table of Contents
- Corrupted Zip Files
- Structure Problems
- YAML Frontmatter Errors
- Name Format Issues

---

## Corrupted Zip Files

**Symptoms:** "File is unavailable", "Cannot open zip", weird filename with nested parentheses or wrong extension.

**Fix 1: Recreate Zip from Extracted Contents**
```bash
# Extract existing (if possible)
unzip old-skill.zip -d temp/
# or use 7z for badly corrupted files
7z x corrupted-file.j98

# Recreate with clean name
cd temp/
zip -r ../skill-name.zip skill-name/
```

**Fix 2: Remove Special Characters from Filename**
```
Bad:  my-skill (v2.1.0).zip
Good: my-skill-v2.zip

Bad:  skill #1 [draft].zip
Good: skill-1-draft.zip
```

**Fix 3: Fix Wrong Extension**
```bash
# If file was saved with wrong extension
mv skill-name.j98 skill-name.zip
# Or
mv skill-name.zip.zip skill-name.zip
```

---

## Structure Problems

**Symptoms:** "SKILL.md not found", "Multiple top-level items", "Invalid skill format"

**Fix 1: Files at Root Level (No Parent Folder)**
```
Current (wrong):
my-skill.zip
├── SKILL.md
└── README.md

Fixed:
my-skill.zip
└── my-skill/
    ├── SKILL.md
    └── README.md
```

```bash
# Fix
unzip my-skill.zip -d temp/
mkdir my-skill
mv temp/* my-skill/
zip -r my-skill.zip my-skill/
```

**Fix 2: Extra Nesting (Folder Inside Folder)**
```
Current (wrong):
my-skill.zip
└── outer/
    └── my-skill/
        └── SKILL.md

Fixed:
my-skill.zip
└── my-skill/
    └── SKILL.md
```

```bash
# Fix
unzip my-skill.zip -d temp/
# Find the folder containing SKILL.md
find temp/ -name "SKILL.md" -exec dirname {} \;
# Move that folder to top level and re-zip
mv temp/outer/my-skill ./
zip -r my-skill.zip my-skill/
```

**Fix 3: Multiple Top-Level Items**
```
Current (wrong):
my-skill.zip
├── SKILL.md
├── workflows/
└── references/

Fixed:
my-skill.zip
└── my-skill/
    ├── SKILL.md
    ├── workflows/
    └── references/
```

```bash
mkdir my-skill
mv SKILL.md workflows/ references/ my-skill/
zip -r my-skill.zip my-skill/
```

---

## YAML Frontmatter Errors

**Symptoms:** "Invalid frontmatter", "Missing required field", skill uploads but doesn't trigger.

**Fix 1: Missing Delimiters**
```yaml
Wrong:
name: my-skill
description: What it does

Correct:
---
name: my-skill
description: What it does
---
```
The `---` delimiters on their own lines are required.

**Fix 2: Wrong Field Names**
```yaml
Wrong:
---
skillname: my-skill
desc: What it does
---

Correct:
---
name: my-skill
description: What it does
---
```
Only these fields are allowed: name, description, license, allowed-tools, metadata, compatibility.

**Fix 3: Multi-line Description**
```yaml
Wrong (breaks YAML parsing):
---
name: my-skill
description: This is a long description
that spans multiple lines without proper syntax
---

Correct (single line):
---
name: my-skill
description: This is a long description that stays on one line
---

Correct (YAML folded scalar):
---
name: my-skill
description: >
  This is a long description
  that spans multiple lines
  using YAML folded scalar syntax
---
```

**Fix 4: Description Too Long**
Maximum 1024 characters. If longer, trim to the most important trigger keywords and use cases.

**Fix 5: Angle Brackets in Description**
```yaml
Wrong:
---
description: Use <this> for building things
---

Correct:
---
description: Use this for building things
---
```
Angle brackets are not allowed in the description field.

---

## Name Format Issues

**Symptoms:** Skill uploads but doesn't appear, name looks wrong in UI, conflicts with existing skills.

**Rules:**
- Lowercase letters, digits, and hyphens only
- No spaces, underscores, uppercase, or special characters
- Cannot start or end with a hyphen
- No consecutive hyphens
- Max 64 characters
- Folder name in zip must match the `name:` field

```yaml
Wrong:
name: My Skill Name      # spaces and uppercase
name: my_skill_name       # underscores
name: MySkillName         # camelCase
name: my-skill-name!      # special character
name: -my-skill           # starts with hyphen

Correct:
name: my-skill-name
```

**Folder must match:**
```
my-skill-name.zip
└── my-skill-name/        ← Must match name: field
    └── SKILL.md
```
