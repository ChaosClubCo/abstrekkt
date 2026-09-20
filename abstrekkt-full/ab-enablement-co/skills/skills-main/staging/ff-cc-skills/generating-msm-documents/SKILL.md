---
name: generating-msm-documents
description: Generate professionally formatted .docx documents following MSM (Multimedia Sales & Marketing) brand standards. Use when creating deployment guides, SOPs, runbooks, onboarding docs, checklists, or any MSM-branded documentation. Triggers on requests mentioning MSM, MSM documents, MSM template, deployment guides, client documentation, or MSM-branded deliverables.
metadata:
  version: "1.1.0"
---

<essential_principles>

## MSM Document Generator

Produces production-ready .docx documents branded for MSM (Multimedia Sales & Marketing) using their established design system. Documents are built with docx-js (JavaScript) and validated before delivery.

### Brand Identity (Always Applied)

- **Logo**: `assets/msm-logo.png` — anchored top-left header, wrapped square-right
- **Color scheme**: "INT Colors" theme — dk2 `#00405F` (teal), accent orange `#E27305`, accent1 `#5391AA` (links/footer)
- **Typography**: Roboto Condensed Medium (headings), Rubik/Rubik Medium (callouts, footer), Arial (body CS fallback)
- **Footer**: 2-column table — left: address/phone/web, right: copyright + dynamic year + page number

### Core Components

Every MSM document is assembled from these reusable building blocks:

| Component | Purpose | Reference |
|-----------|---------|-----------|
| Callout Boxes | INFO, WARNING, BEST PRACTICE, CONTACT alerts | `references/component-patterns.md` |
| Step Tables | 4-col instructional tables with header row | `references/component-patterns.md` |
| FAQ Blocks | Bold Q: / indented A: question-answer pairs | `references/component-patterns.md` |
| Checklists | Categorized checkbox items for ticketing | `references/component-patterns.md` |
| Shot Lists | Photo documentation tables | `references/component-patterns.md` |
| Plain Text Blocks | Copy/paste-ready snippets for FreshService | `references/component-patterns.md` |

### Quality Gates (Every Document)

1. **Brand compliance**: Logo, colors, fonts, footer all match spec
2. **Component fidelity**: Callout boxes use correct fill/text color pairs
3. **Structural integrity**: `python scripts/office/validate.py` passes
4. **No placeholders**: Every `[PLACEHOLDER]` resolved or flagged to user
5. **Accessibility**: Alt text on all images, high-contrast text, no color-only cues

### Critical docx-js Rules

- Always read `/mnt/skills/public/docx/SKILL.md` before generating any document
- US Letter page size (12240 x 15840 DXA), 1-inch margins
- Never use `\n` — use separate Paragraph elements
- Never use unicode bullets — use `LevelFormat.BULLET`
- Tables need dual widths: `columnWidths` on table AND `width` on each cell
- Use `ShadingType.CLEAR` never `SOLID` for table shading
- Use `WidthType.DXA` never `PERCENTAGE`
- Set `outlineLevel` on heading styles for TOC support

### Related Articles Rule (REQUIRED — no exceptions)

- NEVER include a "Related Articles" section unless the user explicitly provides a list of confirmed published article titles from the live KB system (FreshService)
- Do NOT generate, infer, suggest, or fabricate article references — unpublished article IDs are not real links and create broken references
- If a user asks for related articles without providing confirmed published titles, respond: "Related Articles requires confirmed published article titles from FreshService. Please provide them or skip this section."
- This rule applies to both PDF and .docx outputs

</essential_principles>

<intake>
What would you like to create?

1. **New document** — Create an MSM-branded document from scratch
2. **Edit existing document** — Modify an uploaded MSM document
3. **Checklist / snippet** — Generate a standalone checklist or FreshService-ready snippet
4. **Quick reference** — View the MSM brand spec or component library

**Wait for response before proceeding.**
</intake>

<routing>
| Response | Action | Workflow |
|----------|--------|----------|
| 1, "new", "create", "document", "guide", "SOP" | Read brand spec, then create | `workflows/create-document.md` |
| 2, "edit", "modify", "update", "existing" | Read brand spec, then edit | `workflows/edit-document.md` |
| 3, "checklist", "snippet", "FreshService", "ticket" | Generate checklist output | `workflows/create-checklist.md` |
| 4, "reference", "brand", "spec", "colors" | Display reference info | `references/brand-spec.md` |

**Before any workflow**: Always read `references/brand-spec.md` first, then the relevant workflow file.

**If the user provides a topic without selecting a mode**: Default to option 1 (create new document) and proceed with the topic.

**If the user uploads a .docx file**: Default to option 2 (edit existing) unless they explicitly request a new document.
</routing>

<clarification_protocol>
Before generating any document, confirm these if not already clear from context:

1. **Document title** — What is the document called?
2. **Audience** — Who reads this? (end-users, technicians, managers)
3. **Sections needed** — What content areas to cover?
4. **Contact person** — Who is the support contact referenced in the doc?
5. **Deliverable count** — Single doc or multi-deliverable (guide + checklist + shot list)?

Max 5 clarifying questions. Use safe defaults and label assumptions explicitly.
</clarification_protocol>

<reference_index>
## References

All in `references/`:

| File | Contents |
|------|----------|
| `brand-spec.md` | Complete MSM color palette, typography, spacing, footer, header |
| `component-patterns.md` | docx-js code for every reusable component (callouts, tables, FAQs, etc.) |
| `document-architecture.md` | Document structure patterns, section ordering, multi-deliverable layout |

## Workflows

All in `workflows/`:

| File | Purpose |
|------|---------|
| `create-document.md` | Full workflow for creating new MSM documents from scratch |
| `edit-document.md` | Workflow for editing existing MSM .docx files |
| `create-checklist.md` | Generate standalone checklists and FreshService snippets |

## Assets

| File | Purpose |
|------|---------|
| `assets/msm-logo.png` | MSM logo file for header insertion |
</reference_index>

<success_criteria>
A completed MSM document:
- Passes `python scripts/office/validate.py` without errors
- Uses correct MSM logo in header (not INT, not placeholder)
- Has 2-column footer with address + copyright/page number
- Uses exact hex colors for all callout types
- Uses Roboto Condensed Medium for headings (with fallback to Arial if unavailable)
- Contains no `[PLACEHOLDER]` or `TODO` markers
- All images have descriptive alt text
- All step tables have the 4-column format with dark header row
- Contains no Related Articles section unless user provides confirmed FreshService article titles
</success_criteria>


---

## CLAIMS
<!-- [SOURCED] or [GENERATED] labels for assertions in this skill. None yet — footer added by audit fix pass. -->

## COUNTEREXAMPLE
<!-- Known cases where this skill should NOT activate or may produce wrong output -->

## CONTRADICTIONS
<!-- ! Conflicts with other skills or system prompts -->
