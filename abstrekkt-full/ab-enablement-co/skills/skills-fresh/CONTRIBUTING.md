# Contributing to Skills Library

Thank you for your interest in contributing to the Skills Library. This
document covers the essentials for creating skills, running the pipeline,
and submitting changes. For deeper technical details, see
[docs/DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md).

---

## Getting Started

### Prerequisites

| Dependency | Minimum Version |
|------------|-----------------|
| Python     | 3.10+           |
| Node.js    | 18+ (optional, for JS converters) |
| PyYAML     | 6.0+            |
| Git        | 2.30+           |

### Setup

```bash
git clone <repo-url> Skills
cd Skills
pip install -e ".[dev]"
```

### Verify your environment

```bash
pytest tests/ -v
python sync-skills.py --validate --dry-run
```

> **Windows users:** Set `PYTHONIOENCODING=utf-8` before running any script
> to avoid cp1252 codec errors in terminal output.

---

## Creating a New Skill

### 1. Pick a category

| Category   | Slug         | Description                              |
|------------|--------------|------------------------------------------|
| AI Agents  | `ai-agents`  | Agent roles, orchestration, AI workflows |
| Technical  | `technical`  | Coding, DevOps, architecture, debugging  |
| Strategy   | `strategy`   | Business planning, competitive analysis  |
| Creative   | `creative`   | Design, writing, content production      |
| Operations | `operations` | Process management, logistics, automation|
| Industry   | `industry`   | Sector-specific regulations, compliance  |

### 2. Create the skill directory

```bash
mkdir -p _master-skills/<category>/my-new-skill
```

Directory names must be **lowercase-hyphenated slugs** matching the regex
`^[a-z0-9]+(?:-[a-z0-9]+)*$`.

### 3. Write SKILL.md

Create `_master-skills/<category>/my-new-skill/SKILL.md` with YAML
frontmatter and structured body content.

**Required frontmatter fields:**

```yaml
---
name: my-new-skill
description: >-
  Analyze code for performance bottlenecks. Use when optimizing
  application speed or diagnosing slow queries.
---
```

**Frontmatter rules:**

- `name` -- must match the directory slug exactly.
- `description` -- must follow the pattern:
  `[Verb] [capability]. Use when [trigger].`
  Start with an action verb (Analyze, Generate, Design, Evaluate, etc.).

**Body guidelines:**

- Target **150--500 lines**.
- Use `##` headings to organize sections.
- Include code blocks, tables, and concrete examples where appropriate.
- Refer to `docs/SKILL_FORMAT_SPEC.md` for the full specification.

### 4. Validate

```bash
python sync-skills.py --validate --dry-run
```

New skills must score **>= 80** with **0 blocking errors**.

---

## Development Workflow

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feat/my-new-skill
   ```

2. **Make your changes** (new skills, edits, script improvements).

3. **Run validation:**
   ```bash
   python sync-skills.py --validate --dry-run
   ```

4. **Run tests:**
   ```bash
   pytest tests/ -v
   ```

5. **Run linting:**
   ```bash
   ruff check . && black --check .
   ```

6. **Commit and push**, then open a Pull Request against `main`.

---

## Running the Pipeline

**Validate all skills (dry run -- no files written):**

```bash
python sync-skills.py --targets all --validate --dry-run
```

**Convert master skills to all platform formats:**

```bash
python sync-skills.py --targets all
```

**Populate bundles and variants:**

```bash
python populate_all.py --phase all
```

---

## Code Style

- **Python:** [Black](https://black.readthedocs.io/) formatting with a
  line length of **120**. Lint with [Ruff](https://docs.astral.sh/ruff/).
- **SKILL.md files:** Follow `docs/SKILL_FORMAT_SPEC.md`. Use `##`
  headings, keep frontmatter clean, and avoid Unicode box-drawing
  characters (use ASCII dashes instead for Windows compatibility).
- **Encoding:** All Python file I/O must use `encoding="utf-8"` and
  `errors="replace"`.

---

## Pull Request Process

1. PRs must target `main`.
2. All CI checks must pass (tests + lint).
3. Every new or modified skill must pass validation (score >= 80, 0
   blocking errors).
4. One approval is required before merging.
5. **Squash merge** is preferred to keep history clean.

---

## Reporting Issues

Use GitHub issue templates when available. Please include:

- **Platform:** Windows / macOS / Linux
- **Python version:** output of `python --version`
- **Steps to reproduce:** minimal commands or config to trigger the issue
- **Expected vs. actual behavior**
- **Error output:** full traceback if applicable

---

## Questions?

Open a discussion or issue on GitHub. For pipeline or converter questions,
check [docs/DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md) first -- it
covers the full technical reference.
