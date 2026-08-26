# INT Reference Guide Template Specification

Extracted from `INT-ReferenceGuideTemplate-2026.docx`. This is the authoritative
formatting reference for generating Reference Guide documents.

## Document Properties

| Property | Value |
|----------|-------|
| Page Size | US Letter (7772400 x 10058400 EMU = 8.5" x 11") |
| Orientation | Portrait |
| Sections | 1 |
| Original Author | Gwen Eberts |

## Cover Page

The cover page is the first page of every Reference Guide.

### Required Fields

| Field | Template Marker | Example |
|-------|----------------|---------|
| Title | `Title` | "API Integration Reference Guide" |
| Department & Date | `Created by INT [INT Department] Team; Month YYYY` | "Created by INT Engineering Team; February 2026" |
| Intro Paragraph | `[Insert paragraph on what is covered...]` | 2-3 sentences describing scope |
| Icon Legend | Static text (always include) | "Included in this document are important warnings (⚠ icon), information callouts (ⓘ icon) and recommended best practices (✓ icon)." |
| Important Links | `[Insert Important Links Here]` | Bulleted list of URLs |
| Contact Block | `Contact Us! You can reach the INT [INT Department] Support Team by emailing [Support Mailer].` | Fill department name and email |

## Heading Styles

### Unnumbered Headings

| Style | Level | Usage |
|-------|-------|-------|
| Heading 1 | H1 | Primary document sections |
| Heading 2a | H2 | Standard subsections |
| Heading 2b | H2 | Alternative subsection style |
| Heading 3–8 | H3–H8 | Progressively deeper nesting |

### Numbered Headings

Use when section ordering matters (procedures, sequential content).

| Style | Format | Example |
|-------|--------|---------|
| Numbered Heading 1 | `1.` | `1. Getting Started` |
| Numbered Heading 2 | `1.1.` | `1.1. Prerequisites` |
| Numbered Heading 3 | `1.1.1.` | `1.1.1. System Requirements` |
| Numbered Heading 4–6 | `1.1.1.1.` etc. | Deep nesting (use sparingly) |

## Text Styles

| Style | Usage | Font Details |
|-------|-------|-------------|
| Body Text | Standard paragraph content | Regular weight, standard size |
| Legal Text | Disclaimers, compliance language, fine print | Smaller size, may be italic |
| List Paragraph | Bullet and numbered list items | Indented with list markers |
| Note Box | Best practice callout content | Used inside green callout boxes |

## Callout Boxes

Callout boxes are implemented as **single-cell tables with colored shading**.
Each box type has a distinct icon prefix and background color.

### Warning Box (⚠)

```
Purpose: Draw caution/warning to critical information
Icon: ⚠ (prepend to first line of text)
Background: Amber/Yellow
  - Recommended fill color: #FFF3CD (light amber)
  - Border: #FFEEBA or subtle gold
Text color: Dark (#856404 or black)
Usage: Breaking changes, data loss risks, security warnings, gotchas
```

### Information Box (ⓘ)

```
Purpose: Highlight important information or context
Icon: ⓘ (prepend to first line of text)
Background: Light Blue
  - Recommended fill color: #D1ECF1 (light cyan)
  - Border: #BEE5EB or subtle blue
Text color: Dark (#0C5460 or black)
Usage: Key context, important notes, FYI items, prerequisites
```

### Best Practice Box (✓)

```
Purpose: Recommend a best practice or preferred approach
Icon: ✓ or ✅ (prepend to first line of text)
Background: Light Green
  - Recommended fill color: #D4EDDA (light green)
  - Border: #C3E6CB or subtle green
Text color: Dark (#155724 or black)
Usage: Recommended configurations, preferred patterns, tips
Style note: Uses "Note Box" paragraph style in original template
```

### Implementation Pattern (docx-js)

```javascript
// Callout box = single-row, single-cell table with colored shading
function createCalloutBox(type, text) {
  const configs = {
    warning:  { icon: "⚠", fill: "FFF3CD", textColor: "856404" },
    info:     { icon: "ⓘ", fill: "D1ECF1", textColor: "0C5460" },
    practice: { icon: "✓", fill: "D4EDDA", textColor: "155724" }
  };
  const cfg = configs[type];
  const border = { style: BorderStyle.NONE, size: 0 };
  const borders = { top: border, bottom: border, left: border, right: border };

  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders,
            shading: { fill: cfg.fill, type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 200, right: 200 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${cfg.icon} ${text}`,
                    color: cfg.textColor,
                    size: 22 // 11pt
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
}
```

## Tables

### Default Table Style

- Header row: Colored background (use a muted brand color, e.g., `#D5E8F0`)
- Header text: Bold
- Body rows: Alternating white / light gray (`#F8F8F8`)
- Borders: Light gray (`#CCCCCC`), single, thin
- Cell padding: 80 DXA top/bottom, 120 DXA left/right

### Alternative Table Style

- Two-level header: Merged top row for category, individual column headers below
- Same coloring and border rules as default

### Table Endnotes

When tables reference external data or need clarification:
- Add a paragraph immediately after the table
- Use smaller text (Legal Text style)
- Format: "Note: [explanation]" or numbered footnotes

## Lists

### Numbered Lists

- Format: `1.`, `1.A.`, then deeper nesting
- Use docx-js numbering config (never unicode)
- Indent: 720 DXA per level, 360 DXA hanging

### Unordered Lists

- Standard bullet character via LevelFormat.BULLET
- Same indentation as numbered lists
- Use for non-sequential items only

## Images

When including images in the document:
- Center-align all images
- Apply a subtle outer shadow (matches INT template guidelines)
- Ensure images have appropriate alt text

## Appendices

- Place after all main content sections
- Use Heading 1 for "Appendices" section header
- Use Heading 2 for individual appendices: "Appendix A: [Title]", "Appendix B: [Title]"
- Content follows standard body text formatting

## Table of Contents

The template includes a TOC on page 2. When generating:
- Include a Table of Contents after the cover page
- Reference all Heading 1 and Heading 2 entries
- Page numbers right-aligned with dot leader
- Update TOC fields on document open (use `updateFields: true` in docx-js section properties)

## Document Structure (Ordered)

1. Cover Page (title, department, date, intro, icon legend, links, contact)
2. Table of Contents
3. Main Content Sections (using appropriate heading hierarchy)
4. Appendices (if applicable)
5. Signature Block (if applicable — used for formal documents requiring sign-off)
