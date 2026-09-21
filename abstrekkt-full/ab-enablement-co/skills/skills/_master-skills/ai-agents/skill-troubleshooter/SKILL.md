---
name: skill-troubleshooter
description: Helps configure and build skill troubleshooter processes. Diagnose and fix Claude skill pack issues including corrupted zips, path errors, upload failures, and structure problems. Provides step-by-step fixes for Windows path length limits, special characters, wrong folder hierarchies, and YAML errors. Use when user encounters skill upload errors or file access problems.
---

# Skill Troubleshooter

## Overview
This skill diagnoses and fixes common problems with Claude skill packs, from corrupted zip files to upload failures.

## When to Use
Trigger this skill when users report:
- "My skill won't upload"
- "Getting error: path too long"
- "Zip file is corrupted"
- "Claude can't find my SKILL.md"
- "Error: skill-name.zip is unavailable"

## Common Issues Taxonomy

### Category 1: Corrupted Zip Files

**Symptoms:**
- "File is unavailable"
- "Cannot open zip"
- Weird filename with nested parentheses: `(98_files (17).zip.j98`

**Root Causes:**
- Download corruption
- Special characters in filename
- Wrong file extension
- Windows path length limit exceeded

**Diagnostic Steps:**
1. Check filename for special characters
2. Verify .zip extension (not .j98, .zip.zip, etc.)
3. Try extracting zip locally
4. Check path length

**Fixes:**

**Fix 1: Recreate Zip**
```bash
# Extract existing (if possible)
unzip old-skill.zip -d temp/

# Recreate with clean name
cd temp/
zip -r ../skill-name.zip skill-name/
```

**Fix 2: Shorten Path (Windows)**
```
Problem: C:\Users\name\Documents\Projects\Work\Skills\my-long-skill-name\v2\...
Solution: Move to C:\skills\my-skill\
```

**Fix 3: Remove Special Characters**
```
Bad:  my-skill (v2.1.0).zip
Good: my-skill-v2.zip

Bad:  skill #1 [draft].zip
Good: skill-1-draft.zip
```

### Category 2: Structure Problems

**Symptoms:**
- "SKILL.md not found"
- "Multiple top-level items"
- "Invalid skill format"

**Root Causes:**
- Files zipped instead of folder
- SKILL.md at wrong level
- Multiple folders at root

**Diagnostic Steps:**
1. Extract zip and count top-level items
2. Locate SKILL.md
3. Check folder hierarchy

**Fixes:**

**Fix 1: Files at Root Level**
```
Current structure:
my-skill.zip
├── SKILL.md      ← Wrong (no folder)
└── README.md

Fixed structure:
my-skill.zip
└── my-skill/     ← Add folder
    ├── SKILL.md
    └── README.md
```

**Steps to fix:**
```bash
# Extract
unzip my-skill.zip -d temp/

# Create proper structure
mkdir fixed-skill
mv temp/* fixed-skill/

# Re-zip
zip -r my-skill-fixed.zip fixed-skill/
```

**Fix 2: Wrong Hierarchy**
```
Current:
my-skill.zip
└── outer/
    └── my-skill/
        └── SKILL.md

Fixed:
my-skill.zip
└── my-skill/
    └── SKILL.md
```

### Category 3: YAML Frontmatter Errors

**Symptoms:**
- "Invalid frontmatter"
- "Missing required field"
- Skill uploads but doesn't trigger

**Root Causes:**
- Missing `---` delimiters
- Typo in field names
- Invalid YAML syntax

**Diagnostic Steps:**
1. Open SKILL.md in text editor
2. Check first 3 lines for `---`
3. Verify `name:` and `description:` fields
4. Validate YAML syntax

**Fixes:**

**Fix 1: Missing Delimiters**
```markdown
Wrong:
name: my-skill
description: What it does

Correct:
---
name: my-skill
description: What it does
---
```

**Fix 2: Field Typos**
```yaml
Wrong:
---
skillname: my-skill    # Wrong field name
desc: What it does     # Wrong field name
---

Correct:
---
name: my-skill
description: What it does
---
```

**Fix 3: Multi-line Description**
```yaml
Wrong:
---
name: my-skill
description: This is a long description
that spans multiple lines
---

Correct:
---
name: my-skill
description: This is a long description that spans multiple lines
---

Or:
---
name: my-skill
description: >
  This is a long description
  that spans multiple lines
  using YAML multi-line syntax
---
```

### Category 4: Name Format Issues

**Symptoms:**
- Skill uploads but doesn't appear
- Name looks wrong in Claude UI
- Conflicts with existing skills

**Root Causes:**
- Spaces in name
- Uppercase letters
- Special characters

**Diagnostic Steps:**
1. Check YAML `name:` field
2. Verify lowercase with hyphens only
3. Check folder name matches

**Fixes:**

```yaml
Wrong:
name: My Skill Name
name: my_skill_name
name: MySkillName
name: my-skill-name!

Correct:
name: my-skill-name
```

**Folder name should match:**
```
my-skill-name.zip
└── my-skill-name/
    └── SKILL.md (name: my-skill-name)
```

### Category 5: Windows-Specific Issues

**Symptoms:**
- "Path too long" error
- "Location is not available"
- Special characters cause problems

**Root Causes:**
- Windows 260-character path limit
- Reserved filenames (CON, PRN, AUX, etc.)
- Unicode characters in path

**Diagnostic Steps:**
1. Check total path length
2. Look for reserved names
3. Check for non-ASCII characters

**Fixes:**

**Fix 1: Enable Long Paths (Windows 10+)**
```powershell
# Run as Administrator
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" `
-Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```

**Fix 2: Shorten Path**
```
Before: C:\Users\username\Documents\My Projects\Work\Skills\my-skill-name-v2-final\
After:  C:\skills\my-skill\

Saves: ~70 characters
```

**Fix 3: Avoid Reserved Names**
```
Bad:  CON.md, PRN.md, AUX.md
Good: console.md, printer.md, auxiliary.md
```

## Troubleshooting Workflow

### Step 1: Identify Symptoms

Ask user:
1. What error message do you see?
2. At what step does it fail? (creation, upload, usage)
3. What platform? (Windows, Mac, Linux)
4. Can you extract the zip file?

### Step 2: Diagnose Root Cause

Based on symptoms:
- Corrupted zip → Category 1
- "SKILL.md not found" → Category 2
- "Invalid frontmatter" → Category 3
- Name issues → Category 4
- Path problems → Category 5

### Step 3: Apply Fix

Provide:
1. Specific fix for the issue
2. Command/script to execute
3. Validation step
4. Prevention tip

### Step 4: Validate Fix

After applying fix:
1. Extract zip to verify structure
2. Check YAML frontmatter
3. Test upload (if possible)
4. Confirm skill triggers correctly

## Diagnostic Scripts

### Quick Diagnostic (Python)

```python
#!/usr/bin/env python3
import zipfile
import sys
from pathlib import Path

def diagnose_skill_pack(zip_path):
    """Quick diagnostic of skill pack issues"""
    
    issues = []
    
    # Check 1: File exists and is valid zip
    if not Path(zip_path).exists():
        return ["File not found"]
    
    if not zipfile.is_zipfile(zip_path):
        return ["Not a valid zip file - may be corrupted"]
    
    # Check 2: Structure
    with zipfile.ZipFile(zip_path, 'r') as zipf:
        names = zipf.namelist()
        top_level = set(n.split('/')[0] for n in names if n)
        
        if len(top_level) == 0:
            issues.append("Zip is empty")
        elif len(top_level) > 1:
            issues.append(f"Multiple top-level items: {top_level}")
        
        # Check 3: SKILL.md location
        folder = list(top_level)[0] if len(top_level) == 1 else None
        if folder:
            skill_md = f"{folder}/SKILL.md"
            if skill_md not in names:
                issues.append(f"SKILL.md not found at {skill_md}")
                
                # Find where it actually is
                skill_locations = [n for n in names if 'SKILL.md' in n]
                if skill_locations:
                    issues.append(f"Found SKILL.md at: {skill_locations[0]}")
    
    return issues if issues else ["No issues detected"]

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python diagnose.py skill.zip")
        sys.exit(1)
    
    print("Diagnosing", sys.argv[1])
    for issue in diagnose_skill_pack(sys.argv[1]):
        print(f"❌ {issue}")
```

### Auto-Fix Script (Python)

```python
#!/usr/bin/env python3
import zipfile
import shutil
from pathlib import Path

def auto_fix_skill_pack(zip_path):
    """Attempt to automatically fix common issues"""
    
    print(f"Attempting to fix {zip_path}...")
    
    # Extract to temp directory
    temp_dir = Path("temp_skill_fix")
    temp_dir.mkdir(exist_ok=True)
    
    with zipfile.ZipFile(zip_path, 'r') as zipf:
        zipf.extractall(temp_dir)
    
    # Find SKILL.md
    skill_md_paths = list(temp_dir.rglob("SKILL.md"))
    
    if not skill_md_paths:
        print("❌ SKILL.md not found - cannot fix")
        return False
    
    skill_md = skill_md_paths[0]
    skill_dir = skill_md.parent
    
    # Create new zip with correct structure
    new_zip_path = Path(f"{zip_path.stem}-fixed.zip")
    
    with zipfile.ZipFile(new_zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file in skill_dir.rglob("*"):
            if file.is_file():
                arcname = skill_dir.name / file.relative_to(skill_dir)
                zipf.write(file, arcname)
    
    # Cleanup
    shutil.rmtree(temp_dir)
    
    print(f"✅ Fixed zip created: {new_zip_path}")
    return True
```

## Prevention Guide

### Best Practices to Avoid Issues

1. **Use Provided Tools**
   - Use `create_skill_zip.py` script
   - Don't manually zip files

2. **Keep Paths Short**
   - Store skills in C:\skills\ (Windows)
   - Use short, descriptive names

3. **Validate Before Upload**
   - Run validation script
   - Extract and inspect locally

4. **Follow Naming Conventions**
   - Lowercase with hyphens
   - No special characters
   - Avoid reserved names

5. **Test YAML Syntax**
   - Use YAML validator
   - Check for required fields
   - Verify delimiters

## Platform-Specific Guides

### Windows

**Common Issues:**
- Path length limits
- Backslash confusion
- Reserved filenames

**Solutions:**
```powershell
# Enable long paths
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1

# Use PowerShell for zipping
Compress-Archive -Path .\my-skill\ -DestinationPath my-skill.zip

# Validate
Expand-Archive -Path my-skill.zip -DestinationPath test\
```

### macOS

**Common Issues:**
- .DS_Store files
- Resource forks
- Hidden files

**Solutions:**
```bash
# Remove .DS_Store before zipping
find my-skill/ -name '.DS_Store' -delete

# Create clean zip
zip -r -X my-skill.zip my-skill/

# Validate
unzip -l my-skill.zip
```

### Linux

**Common Issues:**
- Permissions
- Hidden files
- Symbolic links

**Solutions:**
```bash
# Create zip without hidden files
zip -r my-skill.zip my-skill/ -x "*/.*"

# Fix permissions
chmod 644 my-skill/SKILL.md

# Validate
unzip -t my-skill.zip
```

## Quick Reference

### Error → Solution Lookup

| Error Message | Category | Quick Fix |
|---------------|----------|-----------|
| "Path too long" | Win-specific | Shorten path or enable long paths |
| "SKILL.md not found" | Structure | Move SKILL.md to top-level folder |
| "Multiple top-level items" | Structure | Create single parent folder |
| "Invalid frontmatter" | YAML | Add `---` delimiters |
| "File unavailable" | Corrupted | Recreate zip with clean filename |
| "Missing required field" | YAML | Add `name:` and `description:` |

## Guidelines

- Always start with quick diagnostic
- Provide specific, tested fixes
- Offer both manual and automated solutions
- Explain why issue occurred (education)
- Validate fix before declaring success
- Document platform-specific gotchas
- Create auto-fix scripts when possible

## Examples

### Example 1: Corrupted Zip

**User:** "I get error: C:\...\..\(98_files (17).zip.j98 is unavailable"

**Diagnosis:**
- Corrupted filename
- Wrong extension (.j98)
- Nested parentheses

**Fix:**
```bash
# Extract if possible
7z x corrupted.j98

# Rename folder to clean name
mv "(98_files (17)" my-skill

# Create new zip
zip -r my-skill.zip my-skill/
```

### Example 2: Structure Problem

**User:** "Upload fails: SKILL.md not found"

**Diagnosis:**
- Files at root level

**Fix:**
```bash
# Current structure:
unzip bad-skill.zip
# Shows: SKILL.md, README.md (at root)

# Fix:
mkdir my-skill
mv SKILL.md README.md my-skill/
zip -r my-skill-fixed.zip my-skill/
```

## Integration

Works with:
- **skill-validator**: Hand off validated fails for detailed diagnosis
- **skill-pack-creator**: Fix issues in newly created skills
