---
name: skill-packager
description: Helps configure and build skill packager processes. Package Claude skills into production-ready zip files with proper structure validation, YAML verification, and 2025 Anthropic standards compliance. Use when creating distributable skill packages for Claude.ai, Claude Desktop, or skill marketplaces.
---

<objective>
Package Claude skills into properly structured, validated zip files following 2025 Anthropic standards. Validates YAML frontmatter, checks file structure, ensures naming conventions, and creates distribution-ready packages.
</objective>

<quick_start>
**Basic usage:**
```bash
# Package a skill directory
./scripts/package_skill.py /path/to/skill-name

# Output: skill-name.zip ready for distribution
```

**What gets validated:**
- YAML frontmatter (name, description)
- Directory structure (SKILL.md required)
- File naming conventions
- Skill size (<10MB recommended)
- No sensitive data in package
</quick_start>

<essential_principles>
**1. Single Top-Level Folder**
Zip must contain one folder matching skill name:
```
skill-name.zip
└── skill-name/
    ├── SKILL.md (required)
    ├── workflows/
    ├── references/
    ├── templates/
    └── scripts/
```

**2. YAML Frontmatter Rules (2025)**
```yaml
---
name: skill-name          # lowercase-with-hyphens, max 64 chars
description: ...          # what AND when to use it, max 1024 chars
version: 1.0.0           # optional but recommended
---
```

**3. Progressive Disclosure**
- SKILL.md under 500 lines
- Split large content into references/
- Only include necessary files

**4. Security**
- No API keys or secrets
- No sensitive data
- Validate all included files
- Maximum 10MB recommended size
</essential_principles>

<process>
## Core Workflow

## Step 1: Locate Skill Directory

Ask user for path if not provided:
"What is the path to the skill directory you want to package?"

Validate path exists and contains SKILL.md:
```bash
if [ ! -f "$SKILL_PATH/SKILL.md" ]; then
    echo "❌ Error: SKILL.md not found"
    exit 1
fi
```

## Step 2: Extract and Validate Metadata

Read YAML frontmatter from SKILL.md:
```python
import yaml
import re

def extract_frontmatter(skill_md_path):
    with open(skill_md_path, 'r') as f:
        content = f.read()
    
    # Extract YAML between --- delimiters
    match = re.match(r'^---\s*\n(.*?)\n---\s*\n', content, re.DOTALL)
    if not match:
        raise ValueError("No YAML frontmatter found")
    
    metadata = yaml.safe_load(match.group(1))
    return metadata
```

**Validate required fields:**
- `name`: Must match directory name, lowercase-with-hyphens, max 64 chars
- `description`: Must include what AND when, max 1024 chars

**Check optional fields:**
- `version`: Semantic versioning (1.0.0) recommended
- `allowed-tools`: Valid tool names if specified

## Step 3: Validate File Structure

**Required:**
- SKILL.md at root

**Optional but common:**
- workflows/ (multi-step procedures)
- references/ (domain knowledge)
- templates/ (output structures)
- scripts/ (executable code)

**Check for issues:**
```python
def validate_structure(skill_path):
    issues = []
    
    # Check SKILL.md size
    skill_md = os.path.join(skill_path, 'SKILL.md')
    lines = len(open(skill_md).readlines())
    if lines > 500:
        issues.append(f"⚠️  SKILL.md has {lines} lines (recommend <500)")
    
    # Check for sensitive data patterns
    for root, dirs, files in os.walk(skill_path):
        for file in files:
            filepath = os.path.join(root, file)
            content = open(filepath, 'r', errors='ignore').read()
            
            if re.search(r'(sk-ant-|api[_-]?key|secret|password|token).*["\'].*["\']', content, re.I):
                issues.append(f"⚠️  Possible secret in {file}")
    
    return issues
```

## Step 4: Calculate Package Size

```python
def get_directory_size(path):
    total = 0
    for root, dirs, files in os.walk(path):
        for file in files:
            total += os.path.getsize(os.path.join(root, file))
    return total

size_mb = get_directory_size(skill_path) / (1024 * 1024)
if size_mb > 10:
    print(f"⚠️  Large package: {size_mb:.1f}MB (recommend <10MB)")
```

## Step 5: Create Zip Package

Use Python zipfile for cross-platform compatibility:

```python
import zipfile
from pathlib import Path

def create_skill_package(skill_path, output_path):
    skill_name = os.path.basename(skill_path)
    zip_name = f"{skill_name}.zip"
    
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(skill_path):
            # Skip hidden files and __pycache__
            dirs[:] = [d for d in dirs if not d.startswith('.') and d != '__pycache__']
            files = [f for f in files if not f.startswith('.')]
            
            for file in files:
                file_path = os.path.join(root, file)
                # Archive path includes skill name as top-level folder
                arcname = os.path.join(
                    skill_name,
                    os.path.relpath(file_path, skill_path)
                )
                zipf.write(file_path, arcname)
    
    return zip_name
```

## Step 6: Verification

Test the created zip:
```python
def verify_package(zip_path):
    with zipfile.ZipFile(zip_path, 'r') as zipf:
        files = zipf.namelist()
        
        # Check single top-level folder
        top_levels = set(f.split('/')[0] for f in files)
        if len(top_levels) != 1:
            return False, "Multiple top-level folders"
        
        # Check SKILL.md exists
        skill_md = f"{list(top_levels)[0]}/SKILL.md"
        if skill_md not in files:
            return False, "SKILL.md not found"
        
        return True, "✓ Package valid"
```

## Step 7: Generate Report

```markdown
# Skill Package Report

**Skill:** {skill_name}
**Version:** {version}
**Size:** {size_mb:.2f} MB
**Files:** {file_count}

## Structure
{tree_output}

## Validation
- ✓ YAML frontmatter valid
- ✓ Name matches directory
- ✓ Description includes what AND when
- ✓ No secrets detected
- ✓ Single top-level folder
- ✓ SKILL.md present

## Installation
**Claude.ai / Desktop:**
1. Go to Settings → Skills
2. Click "Upload Skill"
3. Select {skill_name}.zip

**Claude Code:**
```bash
# Personal installation
cp -r {skill_name} ~/.claude/skills/

# Project installation
cp -r {skill_name} .claude/skills/
```

**Package location:** {output_path}
```
</process>

<validation_checklist>
Before finalizing package:
- [ ] YAML frontmatter has name and description
- [ ] Name is lowercase-with-hyphens, matches directory
- [ ] Description explains what AND when to use (third person)
- [ ] SKILL.md under 500 lines
- [ ] No markdown headings (#) in SKILL.md body - uses XML tags
- [ ] No API keys, secrets, or sensitive data
- [ ] Package size under 10MB (or user accepts larger size)
- [ ] Single top-level folder in zip
- [ ] Zip can be extracted and re-validated
</validation_checklist>

<output_format>
Package creates:
```
output/
└── {skill-name}.zip
    └── {skill-name}/
        ├── SKILL.md
        └── [other files...]
```

Plus validation report showing:
- Metadata summary
- File structure tree
- Validation results
- Installation instructions
- Package location
</output_format>

<error_handling>
**Common errors and fixes:**

**Error: "No YAML frontmatter found"**
- Cause: SKILL.md missing --- delimiters
- Fix: Add proper YAML frontmatter at top of file

**Error: "Name doesn't match directory"**
- Cause: name field differs from folder name
- Fix: Rename folder or update YAML name field

**Error: "Multiple top-level folders"**
- Cause: Zip contains files at root or multiple folders
- Fix: Ensure single folder at top level

**Error: "Possible secret detected"**
- Cause: Pattern matching API key format
- Fix: Remove secrets, use environment variables

**Error: "Package too large"**
- Cause: Large binary files or datasets
- Fix: Move data to external storage, reference by URL
</error_handling>

<advanced_options>
**Custom validation rules:**
```python
# Add to validation
custom_rules = {
    'max_line_length': 120,
    'require_version': True,
    'check_spelling': False
}
```

**Batch packaging:**
```bash
# Package multiple skills
for skill in skills/*/; do
    ./scripts/package_skill.py "$skill"
done
```

**CI/CD integration:**
```yaml
# .github/workflows/package-skills.yml
- name: Package Skills
  run: |
    python scripts/package_skill.py my-skill/
    gh release upload v1.0.0 my-skill.zip
```
</advanced_options>

<success_criteria>
Packaging is complete when:
- [ ] Zip file created with correct name
- [ ] Single top-level folder matches skill name
- [ ] YAML frontmatter validated
- [ ] No secrets or sensitive data included
- [ ] Package size acceptable
- [ ] Validation report generated
- [ ] Installation instructions provided
- [ ] Zip can be uploaded to Claude.ai/Desktop
- [ ] User has copy at specified output location
</success_criteria>

<related_skills>
- **skill-creator**: Create new skills from scratch
- **skill-validator**: Validate existing skill structure
- **skill-publisher**: Publish to marketplaces (GitHub, npm)
</related_skills>
