# Tutorial 02: Run the Full Pipeline

Run the complete Skills Library pipeline from quality fixes through platform
conversion and bundle generation. This tutorial covers every script in execution
order with exact commands and expected output.

---

## Prerequisites

| Requirement | Minimum Version | Check Command |
|-------------|----------------|---------------|
| Python | 3.10+ | `python --version` |
| Node.js | 18+ | `node --version` |
| PyYAML | any | `python -c "import yaml; print(yaml.__version__)"` |

Install Python dependencies if needed:

```bash
$ pip install pyyaml
```

On Windows, set the encoding variable. This must be done in every new terminal
session:

```bash
$ export PYTHONIOENCODING=utf-8
```

On Windows CMD (not Bash), use `set` instead:

```cmd
set PYTHONIOENCODING=utf-8
```

---

## Pipeline Overview

The pipeline runs in this order:

```
fix_skills_unified.py    (3-pass quality fixes)
        |
        v
sync-skills.py           (convert to 5 platform targets)
        |
        v
populate_all.py          (bundles, variants, cleanup)
```

Each step reads from `_master-skills/` and writes to platform output directories.

---

## Step 1: Quality Fixes (fix_skills_unified.py)

This script consolidates three repair passes into a single run:

- **Pass 1:** Frontmatter repair -- adds missing `name`/`description` fields,
  injects trigger verbs, appends "Use when" phrases.
- **Pass 2:** Structure fixes -- promotes `#` headings to `##`, adds
  Core Workflow / Instructions section headings.
- **Pass 3:** Slug normalization -- converts names with spaces or capitals to
  lowercase-hyphenated slugs, trims descriptions over 500 characters.

### Run all three passes

```bash
$ python fix_skills_unified.py --all
```

Expected output:

```
=== Pass 1: Frontmatter Repair ===
Scanning _master-skills/ ...
  Found 507 skills across 6 categories
  Fixed: 0  Skipped: 507  Errors: 0

=== Pass 2: Structure Fixes ===
  Fixed: 0  Skipped: 507  Errors: 0

=== Pass 3: Slug Normalization ===
  Fixed: 0  Skipped: 507  Errors: 0

Done. 507 skills processed, 0 total fixes applied.
```

If the library is already in good shape, all skills will show as "Skipped"
(no changes needed). A freshly added skill with formatting issues will show
as "Fixed" with a description of what changed.

### Run a single pass

```bash
$ python fix_skills_unified.py --all --pass 1    # frontmatter only
$ python fix_skills_unified.py --all --pass 2    # structure only
$ python fix_skills_unified.py --all --pass 3    # slugs only
```

### Dry run (preview changes without writing)

```bash
$ python fix_skills_unified.py --all --dry-run --verbose
```

### Target a single category or skill

```bash
$ python fix_skills_unified.py --category technical
$ python fix_skills_unified.py --skill technical/code-doc-generator
```

---

## Step 2: Platform Conversion (sync-skills.py)

This script reads all master skills and converts them to platform-specific
formats.

### Convert all skills to all platforms

```bash
$ python sync-skills.py --targets all
```

Expected output:

```
Discovered 507 skills in _master-skills
  [1/507] ai-agents/adaptive-content-personalization
  [2/507] ai-agents/agent-communication-protocol
  ...
  [507/507] technical/websocket-implementation

Summary:
  claude:  507 skills, 507 files
  gemini:  507 skills, 507 files
  copilot: 507 skills, 1014 files
  codex:   507 skills, 2028 files
  cli:     507 skills, 2028 files

Total: 507 skills synced to 5 targets (5584 files written)
```

File counts per target:
- **claude:** 507 files (1 SKILL.md per skill)
- **gemini:** 507 files (1 `.gem.json` per skill)
- **copilot:** 1014 files (1 custom-instruction `.md` + 1 agent-skill `SKILL.md`)
- **codex:** 2028 files (4 files per skill: `.response.json`, `.gpt-builder.json`,
  `.agent-builder.json`, `.system-prompt.txt`)
- **cli:** 2028 files (1 file per skill across 4 platform CLIs)

### Convert to specific platforms only

```bash
$ python sync-skills.py --targets gemini,codex
$ python sync-skills.py --targets claude --validate
$ python sync-skills.py --targets all --stats
```

### Convert a single category

```bash
$ python sync-skills.py --category ai-agents --targets all
```

### Dry run

```bash
$ python sync-skills.py --targets all --dry-run
```

This prints the output paths without writing files.

---

## Step 3: Bundle Generation and Variants (populate_all.py)

This script handles four phases:

1. **Quality** -- Runs frontmatter and validation fixes
2. **Bundles** -- Generates 18 curated bundles across Gemini, Codex, and Copilot
3. **Variants** -- Populates thin variant directories (Copilot Frontier, Gemini
   Agents, Claude Desktop, Claude Web)
4. **Cleanup** -- Removes deprecated files and junk skills

### Run all phases

```bash
$ python populate_all.py --phase all
```

Expected output:

```
=== Phase 3: Quality Fixes ===
  507 skills scanned, 0 fixes applied

=== Phase 1: Bundle Population ===
  gemini/by-category/ai-agents: 232
  gemini/by-category/technical: 127
  gemini/by-category/strategy: 59
  gemini/by-category/creative: 40
  gemini/by-category/operations: 25
  gemini/by-category/industry: 25
  gemini/gems-full: 508
  gemini/studio-essential-30: 30
  gemini/studio-creative-15: 15
  gemini/vertex-enterprise: 53
  gemini/agent-chains-20: 20
  gemini/idx-workspace: 20
  codex/by-category/ai-agents: 232
  codex/by-category/technical: 127
  ...
  copilot/by-category/ai-agents: 232
  ...
  copilot/workspace-essential-30: 30
  copilot/agent-skills-50: 50
  copilot/coding-agent-20: 20

  33 bundle directories populated

=== Phase 2: Variant Population ===
  Copilot Frontier: 508 skills
  Gemini Agents: 508 skills
  Claude Desktop: 508 skills
  Claude Web: 508 skills

=== Cleanup ===
  Removed 0 deprecated files

Done.
```

### Run individual phases

```bash
$ python populate_all.py --phase bundles
$ python populate_all.py --phase variants
$ python populate_all.py --phase quality
$ python populate_all.py --phase cleanup
```

### Dry run

```bash
$ python populate_all.py --phase all --dry-run
```

---

## Step 4: Verify Output Counts

After the full pipeline, verify the file counts in each platform directory.

```bash
$ find Claude/ClaudeSkills/skills -name "SKILL.md" | wc -l
```

Expected: `508` (507 master skills + governance index)

```bash
$ find Gemini/GeminiSkills/gems -name "*.gem.json" | wc -l
```

Expected: `525` (507 + extras and index files)

```bash
$ find GithubCopilot/CopilotSkills/agent-skills -name "SKILL.md" | wc -l
```

Expected: `512`

```bash
$ find GithubCopilot/CopilotSkills/custom-instructions -name "*.md" | wc -l
```

Expected: `519`

```bash
$ find Codex/CodexSkills -name "*.json" | wc -l
```

Expected: `3054` (multiple JSON files per skill)

```bash
$ find Claude/ClaudeSkills-CLI/skills -name "SKILL.md" | wc -l
```

Expected: `503`

These counts may vary slightly due to extras, indexes, and filter differences
across platform converters.

---

## Step 5: Verify Bundles

Check a few bundle directories:

```bash
$ find Gemini/GeminiSkills/bundles/gems-full -name "*.gem.json" | wc -l
```

Expected: `508`

```bash
$ find Gemini/GeminiSkills/bundles/studio-essential-30 -name "*.gem.json" | wc -l
```

Expected: `30`

```bash
$ find Codex/CodexSkills/bundles/responses-api-full -name "*.json" | wc -l
```

Expected: `508`

```bash
$ find GithubCopilot/CopilotSkills/bundles/agent-skills-50 -name "*.md" | wc -l
```

Expected: `50`

---

## Troubleshooting

### UnicodeDecodeError on Windows

```
UnicodeDecodeError: 'charmap' codec can't decode byte 0x9d
```

Fix: Set the encoding environment variable before running any script.

```bash
export PYTHONIOENCODING=utf-8
```

### ModuleNotFoundError: No module named 'yaml'

```bash
pip install pyyaml
```

### ModuleNotFoundError: No module named 'lib.config'

You must run scripts from the repository root directory, not from a subdirectory.

```bash
$ cd /path/to/Skills
$ python sync-skills.py --targets all
```

### Node.js errors during Copilot conversion

If `convert-to-copilot.js` fails, check your Node.js version:

```bash
$ node --version
```

Version 18 or later is required. If you only need non-Copilot outputs, skip it:

```bash
$ python sync-skills.py --targets claude,gemini,codex,cli
```

### Pipeline runs but produces 0 files

Check that `_master-skills/` contains skill directories:

```bash
$ ls _master-skills/
```

Expected: `ai-agents  creative  industry  operations  strategy  technical`

If the directory is empty, the master skills have not been checked out or
downloaded.

---

## What You Learned

1. The three-stage pipeline: quality fixes, platform conversion, bundle generation.
2. The exact commands for each stage with expected output.
3. How to run individual phases or target specific categories.
4. How to verify output file counts per platform.

## Next Steps

- [Tutorial 03: Customize a Skill](./03-customize-a-skill.md) -- Modify an existing
  skill for your use case
- [Tutorial 04: Create a Bundle](./04-create-a-bundle.md) -- Package a curated set
  of skills
- [Tutorial 05: Debug Common Issues](./05-debug-common-issues.md) -- Troubleshooting
  reference
