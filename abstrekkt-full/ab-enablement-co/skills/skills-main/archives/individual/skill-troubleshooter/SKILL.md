---
name: skill-troubleshooter
description: Diagnose and fix Claude skill pack issues including corrupted zips, path errors, upload failures, and structure problems. Provides step-by-step fixes for Windows path length limits, special characters, wrong folder hierarchies, and YAML errors. Use when user encounters skill upload errors or file access problems.
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

## Integration

Works with:
- **skill-validator**: Hand off validated fails for detailed diagnosis
- **skill-pack-creator**: Fix issues in newly created skills

## Detailed Reference

For additional patterns and detailed guidance, see [reference/troubleshooting-patterns.md](reference/troubleshooting-patterns.md):

- Common Issues Taxonomy
- Diagnostic Scripts
- Prevention Guide
- Platform-Specific Guides
- Examples

