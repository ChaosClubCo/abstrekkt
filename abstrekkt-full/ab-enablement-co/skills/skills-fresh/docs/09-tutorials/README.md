# Tutorials

Hands-on guides for working with the Skills Library. Each tutorial walks through a
complete task from start to finish with exact commands and expected output.

---

## Tutorial Index

| # | Title | Difficulty | Time Estimate |
|---|-------|-----------|---------------|
| 01 | [Create Your First Skill](./01-create-your-first-skill.md) | Beginner | 30 minutes |
| 02 | [Run the Full Pipeline](./02-run-the-full-pipeline.md) | Beginner | 20 minutes |
| 03 | [Customize a Skill](./03-customize-a-skill.md) | Intermediate | 25 minutes |
| 04 | [Create a Bundle](./04-create-a-bundle.md) | Intermediate | 35 minutes |
| 05 | [Debug Common Issues](./05-debug-common-issues.md) | All Levels | Reference |

---

## Prerequisites

All tutorials assume you have cloned or downloaded the Skills Library to a local
directory and can run commands from the repository root. Specific prerequisites
(Python version, Node.js version, etc.) are listed at the top of each tutorial.

## Difficulty Levels

- **Beginner** -- No prior experience with the Skills Library required. Familiarity
  with a terminal and basic file editing is sufficient.
- **Intermediate** -- Assumes you have completed Tutorial 01 or 02 and understand
  the SKILL.md format and pipeline basics.
- **All Levels** -- Reference material useful at any stage. Consult as needed when
  you encounter errors.

## Conventions Used

- All commands are shown for a Bash-compatible shell. On Windows, use Git Bash,
  WSL, or set `PYTHONIOENCODING=utf-8` before running Python scripts.
- File paths use forward slashes (`/`) for readability. Windows backslashes work
  equally well.
- Expected output is shown in fenced code blocks marked `Expected output:`.
- Lines beginning with `$` are commands you type. Lines without `$` are output.

## Related Documentation

- [Quickstart](../01-getting-started/quickstart.md) -- 5-minute setup for any platform
- [Scripts Reference](../SCRIPTS_REFERENCE.md) -- Full argument reference for every script
- [Skill Format Spec](../SKILL_FORMAT_SPEC.md) -- SKILL.md file format specification
- [Architecture](../ARCHITECTURE.md) -- System design and data flow
- [Development Guide](../DEVELOPMENT_GUIDE.md) -- Contributing and local development
