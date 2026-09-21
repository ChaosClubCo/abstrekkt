# Tutorial 01: Create Your First Skill

Create a new skill from scratch, validate it, convert it to all platforms, and
deploy it to your AI assistant. By the end you will have a working
"Code Documentation Generator" skill available in Claude, Gemini, Copilot, and
Codex.

---

## Prerequisites

- Python 3.10 or later
- Node.js 18 or later (for Copilot conversion)
- A text editor
- Terminal access at the repository root

On Windows, set the encoding environment variable before any Python commands:

```bash
export PYTHONIOENCODING=utf-8
```

---

## Step 1: Choose a Category and Slug

Every skill lives under one of six categories:

| Category | Description | Skill count |
|----------|-------------|-------------|
| ai-agents | AI-powered automation and agent workflows | 232 |
| technical | Software engineering, DevOps, architecture | 127 |
| strategy | Business strategy, planning, analysis | 59 |
| creative | Design, writing, content creation | 40 |
| operations | Process management, logistics, compliance | 25 |
| industry | Domain-specific industry knowledge | 25 |

A "Code Documentation Generator" is a technical skill. The slug must be
lowercase alphanumeric with hyphens only. We will use `code-doc-generator`.

Verify the slug does not already exist:

```bash
$ ls _master-skills/technical/code-doc-generator/
```

Expected output:

```
ls: cannot access '_master-skills/technical/code-doc-generator/': No such file or directory
```

Good -- the directory does not exist yet.

---

## Step 2: Create the Directory

```bash
$ mkdir -p _master-skills/technical/code-doc-generator
```

---

## Step 3: Write the SKILL.md File

Create `_master-skills/technical/code-doc-generator/SKILL.md` with the following
content. This is the complete file -- copy it exactly.

```markdown
---
name: code-doc-generator
description: Generate comprehensive code documentation from source files including API references, inline comments, README files, and architectural decision records. Use when onboarding new team members, preparing open-source releases, or maintaining living documentation for evolving codebases.
---

# Code Documentation Generator

## Overview

Transform source code into clear, maintainable documentation that serves both
current developers and future maintainers. This skill covers automated doc
generation, manual documentation best practices, and hybrid approaches that
combine both.

## When to Use This Skill

- Onboarding new team members who need to understand a codebase
- Preparing a project for open-source release
- Auditing existing documentation for completeness
- Setting up automated doc generation in CI/CD pipelines
- Creating API reference documentation from code annotations
- Writing architectural decision records (ADRs)
- Generating README files for new repositories

## Core Processes

### 1. Documentation Audit

Assess the current state of documentation before generating new content.

**Audit Checklist:**
- README exists and is current
- API endpoints or public functions are documented
- Setup and installation instructions are accurate
- Architecture diagrams reflect the current system
- Code comments explain "why", not just "what"

**Audit Command Example:**
```bash
# Count documented vs undocumented public functions
grep -r "def " src/ | wc -l          # total functions
grep -r '"""' src/ | wc -l           # docstrings found
```

### 2. Automated Generation

Use tooling to extract documentation from code annotations.

**Python (Sphinx):**
```bash
pip install sphinx sphinx-autodoc-typehints
sphinx-quickstart docs/
sphinx-apidoc -o docs/source/ src/
cd docs && make html
```

**TypeScript (TypeDoc):**
```bash
npm install --save-dev typedoc
npx typedoc --entryPointStrategy expand ./src --out docs/
```

**Go (godoc):**
```bash
godoc -http=:6060
# Browse to http://localhost:6060/pkg/your/package/
```

### 3. Manual Documentation Standards

Not everything can be auto-generated. These sections require human authoring.

**README Template:**
```markdown
# Project Name

One-line description of what this project does.

## Quick Start

Step-by-step instructions to get running in under 5 minutes.

## Architecture

High-level overview with a diagram (Mermaid, PlantUML, or image).

## API Reference

Link to auto-generated docs or inline reference.

## Contributing

How to submit changes, run tests, and follow code style.

## License

License type and link to LICENSE file.
```

**ADR Template (Architectural Decision Record):**
```markdown
# ADR-NNN: Title

## Status
Accepted | Deprecated | Superseded by ADR-XXX

## Context
What is the issue that we are seeing that motivates this decision?

## Decision
What is the change that we are proposing and/or doing?

## Consequences
What becomes easier or harder as a result of this decision?
```

### 4. CI/CD Integration

Automate documentation generation on every merge to main.

**GitHub Actions Example:**
```yaml
name: Generate Docs
on:
  push:
    branches: [main]

jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install sphinx sphinx-autodoc-typehints
      - run: cd docs && make html
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: docs/_build/html
```

### 5. Documentation Quality Checks

Validate documentation completeness programmatically.

```python
import ast
import sys
from pathlib import Path

def check_docstrings(source_dir: str) -> dict:
    """Check all Python files for missing docstrings."""
    results = {"total": 0, "documented": 0, "missing": []}

    for py_file in Path(source_dir).rglob("*.py"):
        tree = ast.parse(py_file.read_text())
        for node in ast.walk(tree):
            if isinstance(node, (ast.FunctionDef, ast.ClassDef)):
                results["total"] += 1
                if ast.get_docstring(node):
                    results["documented"] += 1
                else:
                    results["missing"].append(
                        f"{py_file}:{node.lineno} {node.name}"
                    )

    return results

if __name__ == "__main__":
    stats = check_docstrings(sys.argv[1])
    pct = (stats["documented"] / stats["total"] * 100) if stats["total"] else 0
    print(f"Coverage: {stats['documented']}/{stats['total']} ({pct:.1f}%)")
    for m in stats["missing"][:20]:
        print(f"  MISSING: {m}")
```

## Tools & Templates

- **Sphinx** -- Python documentation generator with reStructuredText and Markdown support
- **TypeDoc** -- TypeScript/JavaScript API documentation from TSDoc comments
- **godoc** -- Go standard library documentation server
- **Doxygen** -- Multi-language documentation (C, C++, Java, Python, etc.)
- **MkDocs** -- Markdown-based static site generator for project documentation
- **Mermaid** -- Diagram-as-code for architecture and flow diagrams
- **vale** -- Prose linter for enforcing style guides in documentation

## Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Docstring coverage | > 80% | AST analysis script above |
| README freshness | Updated within 30 days of major changes | Git log comparison |
| API doc completeness | 100% of public endpoints | Automated endpoint scan |
| Build success rate | 100% of doc builds pass CI | CI pipeline metrics |
| Time to onboard | < 1 day for new developer setup | Team survey |

## Common Pitfalls

- **Stale documentation** -- Docs that are not updated with code changes become
  misleading. Tie doc generation to CI so it stays current.
- **Over-documenting trivial code** -- `x = x + 1  # increment x` adds noise.
  Focus docstrings on public APIs and complex logic.
- **No single entry point** -- Without a clear README or index page, new developers
  cannot find where to start. Always maintain a top-level README.
- **Ignoring non-code docs** -- Architecture decisions, runbooks, and onboarding
  guides are as important as API references.
- **Copy-pasting without context** -- Auto-generated docs need human review to
  ensure they make sense to the reader.

## Integration Points

- **code-review-checklist** -- Include documentation review as a PR checklist item
- **ci-cd-pipeline-design** -- Add doc generation as a CI stage
- **api-design-principles** -- Ensure API docs match API design standards
- **onboarding-program-design** -- Use generated docs as onboarding material
- **technical-writing** -- Apply technical writing principles to manual sections
```

Save this file as `_master-skills/technical/code-doc-generator/SKILL.md`.

---

## Step 4: Validate the Skill

Run the validator to check that the skill meets quality standards:

```bash
$ python lib/skill_validator.py --skill technical/code-doc-generator
```

Expected output:

```
[PASS] technical/code-doc-generator (score: 95)
```

A passing score means the frontmatter is correct, the body has sufficient
structure, and the description contains action verbs.

If you see errors, check the following:
- The `name` field must be lowercase-hyphenated (e.g., `code-doc-generator`)
- The `description` must be between 20 and 500 characters
- The `description` must contain at least one action verb (generate, create, build, etc.)
- The body must have at least 50 lines and contain `##` headings

---

## Step 5: Convert to All Platforms

Run the sync pipeline to generate platform-specific outputs:

```bash
$ python sync-skills.py --skill technical/code-doc-generator --targets all
```

Expected output:

```
Syncing skill: technical/code-doc-generator
  [1/1] technical/code-doc-generator
    -> Claude/ClaudeSkills/skills/technical/code-doc-generator/SKILL.md
    -> Gemini/GeminiSkills/gems/technical/code-doc-generator.gem.json
    -> GithubCopilot/CopilotSkills/custom-instructions/technical/code-doc-generator.md
    -> GithubCopilot/CopilotSkills/agent-skills/technical/code-doc-generator/SKILL.md
    -> Codex/CodexSkills/code-doc-generator.response.json
    -> Codex/CodexSkills/code-doc-generator.gpt-builder.json
    -> Codex/CodexSkills/code-doc-generator.agent-builder.json
    -> Codex/CodexSkills/code-doc-generator.system-prompt.txt

Summary:
  claude:  1 skills, 1 files
  gemini:  1 skills, 1 files
  copilot: 1 skills, 2 files
  codex:   1 skills, 4 files
  cli:     1 skills, 4 files
```

The converter created outputs for all five targets (claude, gemini, copilot,
codex, cli).

---

## Step 6: Verify the Outputs

Check that the files were created in each platform directory.

**Claude:**

```bash
$ ls Claude/ClaudeSkills/skills/technical/code-doc-generator/
```

Expected output:

```
SKILL.md
```

**Gemini:**

```bash
$ ls Gemini/GeminiSkills/gems/technical/code-doc-generator.gem.json
```

Expected output:

```
Gemini/GeminiSkills/gems/technical/code-doc-generator.gem.json
```

**Copilot:**

```bash
$ ls GithubCopilot/CopilotSkills/custom-instructions/technical/code-doc-generator.md
$ ls GithubCopilot/CopilotSkills/agent-skills/technical/code-doc-generator/SKILL.md
```

**Codex:**

```bash
$ ls Codex/CodexSkills/code-doc-generator.*
```

Expected output:

```
Codex/CodexSkills/code-doc-generator.agent-builder.json
Codex/CodexSkills/code-doc-generator.gpt-builder.json
Codex/CodexSkills/code-doc-generator.response.json
Codex/CodexSkills/code-doc-generator.system-prompt.txt
```

**CLI variants:**

```bash
$ ls Claude/ClaudeSkills-CLI/skills/code-doc-generator/SKILL.md
$ ls Gemini/GeminiSkills-CLI/skills/code-doc-generator/SKILL.md
$ ls GithubCopilot/CopilotSkills-CLI/skills/code-doc-generator/SKILL.md
$ ls Codex/CodexSkills-CLI/skills/code-doc-generator/AGENTS.md
```

---

## Step 7: Deploy to Your AI Assistant

Copy the CLI variant for your platform to the appropriate configuration
directory.

**Claude CLI:**

```bash
$ cp -r Claude/ClaudeSkills-CLI/.claude/commands ~/.claude/commands
```

**Gemini CLI:**

```bash
$ cp -r Gemini/GeminiSkills-CLI/.gemini ~/.gemini
```

**GitHub Copilot CLI:**

```bash
$ cp -r GithubCopilot/CopilotSkills-CLI/.github .github
```

**Codex CLI:**

```bash
$ cp -r Codex/CodexSkills-CLI/.codex ~/.codex
```

After copying, open your AI assistant and test the new skill by asking it to
generate documentation for a source file.

---

## Step 8: Clean Up (Optional)

If you want to remove the skill and start over:

```bash
$ rm -rf _master-skills/technical/code-doc-generator
$ python sync-skills.py --targets all
```

The next full sync will not include the deleted skill, and its platform outputs
will be overwritten on the next `populate_all.py` run.

---

## What You Learned

1. The SKILL.md format: YAML frontmatter (`name` + `description`) followed by
   markdown sections (Overview, When to Use, Core Processes, Tools & Templates,
   Metrics, Common Pitfalls, Integration Points).
2. How to validate a skill with `lib/skill_validator.py`.
3. How to convert a single skill to all platforms with `sync-skills.py --skill`.
4. How to deploy CLI variants to your local configuration.

## Next Steps

- [Tutorial 02: Run the Full Pipeline](./02-run-the-full-pipeline.md) -- Process
  all 507 skills at once
- [Tutorial 03: Customize a Skill](./03-customize-a-skill.md) -- Fork and modify
  an existing skill
- [Tutorial 04: Create a Bundle](./04-create-a-bundle.md) -- Package a curated
  set of skills for a specific role
