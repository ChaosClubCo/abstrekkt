# Claude Skills Collection

## Overview
This collection contains 5 professionally crafted Claude skills in proper `.skills` format, ready to upload to Claude.ai, Claude Code, or via the API.

## What's Included

### 📋 Ruleset Skills (2)

1. **staff-engineer-optimized.zip**
   - 6-step workflow for secure, production-ready systems
   - Security-first approach with AppSec focus
   - Self-critique and quality gates
   - Use for: Multi-file applications, infrastructure, architecture

2. **staff-engineer-v2.zip**
   - Enhanced version with scope boundaries
   - Fuzzy "continue" matching
   - Self-correction protocol
   - Semantic versioning
   - Use for: Complex implementations requiring precise scope management

### 🛠️ Utility Skills (3)

3. **skill-pack-creator.zip**
   - Interactive skill creation wizard
   - Generates proper YAML frontmatter
   - Creates valid folder structure
   - Use for: Building new custom skills

4. **skill-validator.zip**
   - Validates skill pack structure
   - Checks YAML frontmatter
   - Security scanning
   - Use for: Verifying skills before upload

5. **skill-troubleshooter.zip**
   - Diagnoses and fixes skill issues
   - Platform-specific guides (Windows, Mac, Linux)
   - Corruption recovery
   - Use for: Fixing upload failures and errors

## Installation

### Option 1: Upload to Claude.ai

1. Open Claude.ai
2. Go to **Settings** > **Capabilities** > **Skills**
3. Click **"Upload skill"**
4. Select one of the `.zip` files from this collection
5. The skill will be available immediately

### Option 2: Use in Claude Code

```bash
# Copy skills to Claude Code directory
cp *.zip ~/.claude/skills/

# Or install via Claude Code
/skills add /path/to/skill-name.zip
```

### Option 3: Via API

```python
import anthropic

client = anthropic.Anthropic(api_key="your-api-key")

# Upload a skill
with open("staff-engineer-optimized.zip", "rb") as f:
    skill = client.skills.create(
        skill_file=f
    )
```

## Quick Start

### For Staff Engineers
1. Upload **staff-engineer-v2.zip** (recommended) or **staff-engineer-optimized.zip**
2. Ask Claude: "Build a Next.js + Supabase todo app"
3. Claude will follow the 6-step workflow automatically

### For Skill Creators
1. Upload **skill-pack-creator.zip**
2. Ask Claude: "Create a skill for applying my company's brand guidelines"
3. Claude will guide you through the creation process

### For Troubleshooting
1. Upload **skill-troubleshooter.zip**
2. Ask Claude: "My skill won't upload, getting error X"
3. Claude will diagnose and fix the issue

## Skill Details

### staff-engineer-optimized

**Triggers:** Multi-file implementation requests, architecture tasks, infrastructure projects

**Workflow:**
1. Clarify requirements
2. Stack selection (with pros/cons table)
3. File/module plan
4. Implementation (security-first)
5. Documentation pack
6. Self-critique & quality gates

**Key Features:**
- Security guardrails (input validation, secrets management, RLS)
- Tool use priority (recent_chats → web_search → bash_tool)
- Mandatory progress reporting
- Gaps/blindspots analysis

### staff-engineer-v2

**Everything from optimized, plus:**
- Scope boundaries (IN SCOPE vs OUT OF SCOPE)
- Fuzzy "continue" matching (`continue|resume|pick up where|keep going`)
- Violation recovery protocol
- Timeout handling for clarifications
- Threshold-based progress reports (3+ files or 100+ lines)

**Use this when:** You need precise scope control and automatic error correction

### skill-pack-creator

**Triggers:** "Create a skill", "Make a skill pack", "Convert this to a skill"

**Features:**
- Generates valid YAML frontmatter
- Creates proper folder structure
- Packages as zip automatically
- Validates structure
- Includes best practices and templates

### skill-validator

**Triggers:** "Validate my skill", "Check if this skill is correct", "Why won't my skill upload?"

**Checks:**
- Zip structure (single top-level folder)
- YAML frontmatter validity
- Required fields (name, description)
- Security issues
- Best practice compliance

**Output:** Detailed validation report with pass/fail/warnings

### skill-troubleshooter

**Triggers:** "My skill won't upload", "Getting error: path too long", "Zip file is corrupted"

**Fixes:**
- Corrupted zip files
- Structure problems (files at root, wrong hierarchy)
- YAML frontmatter errors
- Name format issues
- Windows-specific issues (path length, reserved names)

**Includes:** Platform-specific guides and auto-fix scripts

## File Format

All skills follow Anthropic's official format:

```
skill-name/
└── SKILL.md
```

**SKILL.md structure:**
```markdown
---
name: skill-name
description: Complete description including when to use
---

# Skill Content

[Instructions, examples, guidelines]
```

## Compatibility

✅ **Works with:**
- Claude.ai (Pro, Max, Team, Enterprise)
- Claude Code
- Claude API (with code execution beta)

✅ **Platforms:**
- Windows
- macOS
- Linux

## Validation

All skills in this collection have been validated:
- ✅ Proper zip structure (single top-level folder)
- ✅ Valid YAML frontmatter
- ✅ Required fields present
- ✅ No sensitive data
- ✅ Clean filenames
- ✅ Tested extraction

## Usage Tips

### Combining Skills

You can upload multiple skills simultaneously. They work together:

1. **staff-engineer-v2** + **skill-pack-creator**
   - Build apps with staff engineer workflow
   - Create skills for common patterns

2. **skill-validator** + **skill-troubleshooter**
   - Validate new skills
   - Fix any issues found

3. **All 5 skills**
   - Full toolkit for development and skill management

### Triggering Skills

Skills activate automatically when relevant. To explicitly invoke:

```
"Use the staff-engineer-v2 skill to build a REST API"
"Use the skill-validator to check my skill pack"
"Use the troubleshooter to fix this zip error"
```

### Disabling Skills

In Claude.ai:
1. Settings > Capabilities > Skills
2. Toggle off any skill you don't want active

## Troubleshooting Collection

### Issue: Can't extract zip

**Cause:** Your extraction tool doesn't recognize the format

**Fix:** Try different extraction tool:
- Windows: Built-in, 7-Zip, WinRAR
- Mac: Built-in, The Unarchiver
- Linux: `unzip`, `7z`

### Issue: Skill doesn't appear after upload

**Cause:** May need to refresh or wait a moment

**Fix:**
1. Refresh Claude.ai page
2. Check Settings > Capabilities > Skills
3. Verify skill toggle is ON

### Issue: Multiple skills conflict

**Cause:** Skills with similar triggers may both activate

**Fix:**
1. Disable less-needed skill
2. Be more specific in your request
3. Explicitly name the skill you want

## Version Information

- **Collection Version:** 1.0.0
- **Created:** 2025-10-26
- **Skills Included:** 5
- **Total Size:** ~50KB (compressed)
- **Format:** Claude Skills (.zip with SKILL.md)

## Resources

- [Anthropic Skills Documentation](https://docs.claude.com/en/docs/agents-and-tools/agent-skills)
- [Skills GitHub Repository](https://github.com/anthropics/skills)
- [Skills Cookbook](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/cookbook)
- [Engineering Blog Post](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)

## License

These skills are provided for use with Claude. The ruleset skills are based on custom engineering workflows. The utility skills follow Anthropic's official skill format specification.

## Support

For issues with:
- **Skills not working:** Use skill-troubleshooter.zip
- **Upload failures:** Use skill-validator.zip
- **Creating new skills:** Use skill-pack-creator.zip
- **Collection structure:** See this README

## What's Next

After uploading these skills, try:

1. **Build something:** Use staff-engineer skills to create a production app
2. **Create a skill:** Use skill-pack-creator to make a custom skill
3. **Share learnings:** Document your workflow as a new skill
4. **Iterate:** Improve skills based on actual usage

## Quick Reference

| Skill | Purpose | When to Use |
|-------|---------|-------------|
| staff-engineer-optimized | Production-ready development | Building apps, infrastructure |
| staff-engineer-v2 | Enhanced development workflow | Complex projects needing scope control |
| skill-pack-creator | Create new skills | Teaching Claude new capabilities |
| skill-validator | Validate skill packs | Before uploading skills |
| skill-troubleshooter | Fix skill issues | Upload failures, errors |

---

**Ready to start?** Upload your first skill and ask Claude to use it!
