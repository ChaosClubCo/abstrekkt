# Visual Lane SOP

## Goal

Turn 12 NotebookLM PNG exports into structured visual knowledge assets.

## Inputs

- `unnamed.png` through `unnamed (11).png`

## Rename protocol

After inspection, rename each file using this pattern:

```text
visual_<sequence>_<dominant-theme>.png
```

Examples:

```text
visual_001_agentic_stack_layers.png
visual_002_mcp_security_boundary_map.png
visual_003_cowork_os_workflow_loop.png
```

## Extraction template

For each PNG, create:

```text
04_visual_extractions/<visual_name>_summary.md
04_visual_extractions/<visual_name>_entities.json
04_visual_extractions/<visual_name>_relationships.json
04_visual_extractions/<visual_name>_qa.md
```

## Required analysis sections

- Visual description
- Extracted visible text
- Primary entities
- Relationships/arrows/flows
- Implied architecture
- Security boundaries
- Memory/storage elements
- Agent/tool/MCP references
- Unknowns and low-confidence regions
- Recommended graph nodes
- Recommended graph edges

## QA rule

Do not infer text that is not visible. If a label is too small to read, mark it as unreadable and link to the image region description.
