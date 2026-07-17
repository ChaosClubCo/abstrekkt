# Workflow: Edit Existing MSM Document

<required_reading>
Before starting, read these files in order:
1. `/mnt/skills/public/docx/SKILL.md` — Editing Existing Documents section (unpack → edit XML → pack)
2. `references/brand-spec.md` — MSM colors, fonts, spacing for consistency
3. `references/component-patterns.md` — Component specs to maintain during edits
</required_reading>

<process>

## Step 1: Receive and Analyze

1. Confirm the uploaded file is in `/mnt/user-data/uploads/`
2. Extract content for analysis:
   ```bash
   pandoc document.docx -o content.md
   ```
3. Identify what the user wants to change

## Step 2: Determine Edit Strategy

| Edit Type | Approach |
|-----------|----------|
| Text changes (wording, typos, updates) | Unpack → edit XML → repack |
| Add new sections | Unpack → insert XML → repack |
| Restructure / reorder | Unpack → move XML blocks → repack |
| Replace images | Unpack → swap media files → update rels → repack |
| Full rewrite | Generate new document (use `create-document.md` workflow) |

## Step 3: Unpack

```bash
python scripts/office/unpack.py document.docx unpacked/
```

## Step 4: Edit

- Use the `str_replace` tool directly on XML files — do NOT write Python scripts
- Preserve all `<w:rPr>` formatting when modifying runs
- Use smart quotes for new content: `&#x2019;` for apostrophes, `&#x201C;`/`&#x201D;` for quotes
- When adding tracked changes, use "Claude" as author

### Brand compliance checks during edits:
- New headings must use correct style IDs (Heading1, Heading2, Heading3, Heading4)
- New callout boxes must use exact fill/color pairs from brand spec
- New step tables must use #1F4E79 header background
- Footer must not be modified unless explicitly requested

## Step 5: Repack and Validate

```bash
python scripts/office/pack.py unpacked/ output.docx --original document.docx
python scripts/office/validate.py output.docx
```

## Step 6: Deliver

1. Copy to `/mnt/user-data/outputs/`
2. Summarize changes made
3. Flag any potential issues

</process>

<success_criteria>
- Edited document passes validation
- All existing MSM branding preserved (logo, footer, colors)
- New content follows brand spec exactly
- No formatting corruption from edits
- Smart quotes used for all new apostrophes and quotation marks
</success_criteria>
