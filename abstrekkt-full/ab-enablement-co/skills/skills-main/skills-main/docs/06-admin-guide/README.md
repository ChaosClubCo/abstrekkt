# Admin Guide

This section is for maintainers and administrators who operate the Skills Library pipeline. It covers the day-to-day tasks of managing skills, running conversions, maintaining quality, and keeping platform configurations current.

## Who This Is For

- **Pipeline operators** who run the conversion and deployment scripts
- **Skill authors** who add, update, or retire skills in `_master-skills/`
- **Platform maintainers** who update model mappings and configuration when APIs change

## What This Guide Covers

| Document | Purpose |
|----------|---------|
| [Pipeline Operations](pipeline-operations.md) | Running the full pipeline phase-by-phase with exact commands |
| [Skill Management](skill-management.md) | Adding, updating, removing, and retiring skills |
| [Model Updates](model-updates.md) | Updating model names when platform APIs change |
| [Quality Control](quality-control.md) | Validation, enrichment, and the 3-pass fix pipeline |
| [Bundle Management](bundle-management.md) | Creating and modifying skill bundles |

## Prerequisites

Before performing any admin tasks, ensure you have:

1. Python 3.10+ installed
2. Node.js 18+ installed (for `convert-to-copilot.js`)
3. Access to the Skills Library repository at the project root
4. The `PYTHONIOENCODING=utf-8` environment variable set (Windows only)

## Quick Reference

Run the full pipeline end-to-end:

```bash
export PYTHONIOENCODING=utf-8  # Windows only
python fix_skills.py
python fix_skills_structure.py
python fix_skills_pass3.py
python sync-skills.py
python populate_all.py
```

For a compact command reference, see the [Cheat Sheet](../07-reference/cheat-sheet.md).

## Related Sections

- [Reference](../07-reference/README.md) -- glossary, config reference, model mappings
- [Getting Started](../01-getting-started/) -- initial setup and orientation
- [Platform Guides](../02-platform-guides/) -- platform-specific deployment details
