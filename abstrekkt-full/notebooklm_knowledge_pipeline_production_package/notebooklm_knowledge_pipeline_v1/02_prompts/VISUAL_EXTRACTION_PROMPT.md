# Visual Extraction Prompt

```text
You are analyzing a NotebookLM-exported visual artifact.

SCOPE_MODE: FULL

Extract the visual's knowledge content without inventing hidden text.

Required sections:
- Visual summary.
- Visible text extraction.
- Layout and hierarchy.
- Nodes/entities.
- Edges/relationships.
- Flow direction.
- Security boundaries.
- Memory/data stores.
- Agent/tool/MCP elements.
- Low-confidence regions.
- Concept graph candidates.
- FlashFusion relevance.
- QA and claims check.

Rules:
- If text is too small, mark it unreadable.
- Distinguish diagram structure from interpretation.
- Preserve original filename and proposed renamed filename.
```
