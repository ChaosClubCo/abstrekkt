# Cheat Sheet

One-page command reference for common Skills Library operations. All commands assume you are in the project root directory (`D:\02_Development\Skills`).

**Windows prerequisite** -- set this before running any Python script:

```bash
export PYTHONIOENCODING=utf-8
```

---

## Full Pipeline

Run everything end-to-end:

```bash
python fix_skills.py
python fix_skills_structure.py
python fix_skills_pass3.py
python sync-skills.py --targets all --validate
python populate_all.py --phase all
```

---

## Quality Fixes (3-Pass)

```bash
# Pass 1: frontmatter fixes (name, description, trigger verbs)
python fix_skills.py

# Pass 2: heading and section structure fixes
python fix_skills_structure.py

# Pass 3: slug names, description trimming, junk removal
python fix_skills_pass3.py

# All three passes in sequence
python fix_skills.py && python fix_skills_structure.py && python fix_skills_pass3.py
```

---

## Validation

```bash
# Validate a single skill
python -m lib.skill_validator --skill technical/api-development

# Validate an entire category
python -m lib.skill_validator --category ai-agents

# Validate all skills
python -m lib.skill_validator --all

# Show only skills scoring below 70
python -m lib.skill_validator --all --min-score 70
```

---

## Metadata Enrichment

```bash
# Enrich a single skill (prints computed metadata)
python -m lib.metadata_enricher --skill technical/api-development

# Enrich all skills
python -m lib.metadata_enricher --all

# Export enriched metadata to a JSON file
python -m lib.metadata_enricher --export enriched_metadata.json
```

---

## Conversion (sync-skills.py)

```bash
# Sync all skills to all platforms
python sync-skills.py --targets all

# Sync to specific platforms
python sync-skills.py --targets gemini
python sync-skills.py --targets codex
python sync-skills.py --targets copilot
python sync-skills.py --targets claude
python sync-skills.py --targets cli

# Sync multiple platforms
python sync-skills.py --targets gemini,codex

# Sync with validation
python sync-skills.py --targets all --validate

# Sync a single skill
python sync-skills.py --skill technical/api-development --targets all

# Sync a single category
python sync-skills.py --category ai-agents --targets gemini

# Dry run (no files written)
python sync-skills.py --category ai-agents --targets gemini --dry-run

# Show statistics after sync
python sync-skills.py --targets all --stats
```

---

## Standalone Converters

```bash
# Gemini Gem JSON
python convert_to_gems.py

# GitHub Copilot (3 formats: custom-instructions, agent-skills, chat-participants)
node convert-to-copilot.js

# OpenAI Codex (Responses API, GPT Builder, Agent Builder, system-prompt TXT)
python convert_to_codex_responses.py

# CLI variants for all 4 platforms
python convert_to_cli_skills.py
```

---

## Bundle Population (populate_all.py)

```bash
# All phases (quality, bundles, variants, cleanup)
python populate_all.py --phase all

# Individual phases
python populate_all.py --phase quality
python populate_all.py --phase bundles
python populate_all.py --phase variants
python populate_all.py --phase cleanup

# Dry run
python populate_all.py --dry-run --phase all
```

---

## Verification Commands

```bash
# Master skill count
find _master-skills -name "SKILL.md" | wc -l
# Expected: 508

# Claude main output
find Claude/ClaudeSkills/skills -name "SKILL.md" | wc -l
# Expected: 508

# Gemini gems
find Gemini/GeminiSkills/gems -name "*.json" | wc -l
# Expected: 525

# Codex total files
find Codex/CodexSkills -name "*.json" -o -name "*.txt" | wc -l
# Expected: ~3054

# Copilot agent-skills
find GithubCopilot/CopilotSkills/agent-skills -name "SKILL.md" | wc -l
# Expected: 512

# Copilot custom-instructions
find GithubCopilot/CopilotSkills/custom-instructions -name "*.md" | wc -l
# Expected: 519

# CLI variants
find Claude/ClaudeSkills-CLI/skills -name "SKILL.md" | wc -l       # 503-507
find Gemini/GeminiSkills-CLI/skills -name "SKILL.md" | wc -l       # 507
find Codex/CodexSkills-CLI/skills -name "AGENTS.md" | wc -l        # 508
find GithubCopilot/CopilotSkills-CLI/skills -name "SKILL.md" | wc -l  # 507

# Bundle counts (Gemini)
find Gemini/GeminiSkills/bundles/gems-full -name "*.json" | wc -l          # 508
find Gemini/GeminiSkills/bundles/studio-essential-30 -name "*.json" | wc -l # 30
find Gemini/GeminiSkills/bundles/vertex-enterprise -name "*.json" | wc -l  # 53

# Bundle counts (Codex)
find Codex/CodexSkills/bundles/responses-api-full -name "*.json" | wc -l   # 508
find Codex/CodexSkills/bundles/gpt-builder-50 -name "*.json" | wc -l       # 50

# Bundle counts (Copilot)
find GithubCopilot/CopilotSkills/bundles/by-category -name "*.md" | wc -l  # 508
find GithubCopilot/CopilotSkills/bundles/workspace-by-stack -name "*.md" | wc -l  # 79
```

---

## Searching Skills

```bash
# Find a skill by name
find _master-skills -maxdepth 2 -type d -name "*api*"

# Search skill content
grep -r "GraphQL" _master-skills --include="SKILL.md" -l

# List all skills in a category
ls _master-skills/ai-agents/

# Count skills per category
for cat in ai-agents technical strategy creative operations industry; do
  echo "$cat: $(ls _master-skills/$cat | wc -l)"
done
```

---

## Slug Collision Check

```bash
# Find duplicate directory names across categories
find _master-skills -maxdepth 2 -mindepth 2 -type d -printf "%f\n" | sort | uniq -d
```

Known collision groups (5): `packaging-design`, `podcast-production`, `presentation-design`, `vendor-management`, `inventory-management`.

---

## Troubleshooting

```bash
# Check for encoding issues (Windows)
python -c "import sys; print(sys.stdout.encoding)"
# Should print: utf-8

# Check Python version
python --version  # 3.10+

# Check Node version
node --version    # 18+

# Check for missing yaml dependency
python -c "import yaml; print('OK')"
# If ImportError: pip install pyyaml

# Find stale outputs (skills that exist in outputs but not in master)
diff <(find _master-skills -maxdepth 2 -mindepth 2 -type d -printf "%f\n" | sort) \
     <(find Claude/ClaudeSkills/skills -maxdepth 2 -mindepth 2 -type d -printf "%f\n" | sort)
```

---

## Related Documents

- [Pipeline Operations](../06-admin-guide/pipeline-operations.md) -- detailed walkthrough
- [Config Reference](config-reference.md) -- all configuration constants
- [Model Mappings](model-mappings.md) -- current model names
