# Workflow: Create New MSM Document

<required_reading>
Before starting, read these files in order:
1. `/mnt/skills/public/docx/SKILL.md` — docx-js rules and critical constraints
2. `references/brand-spec.md` — MSM colors, fonts, spacing, header/footer
3. `references/component-patterns.md` — docx-js code for every component
4. `references/document-architecture.md` — section ordering and tone guidelines
</required_reading>

<process>

## Step 1: Gather Requirements

Confirm with the user (skip if already clear from context):

1. **Document type**: End-User Guide / Technician Checklist / Shot List / Multi-Deliverable
2. **Document title**: e.g., "New Computer Setup"
3. **Audience**: End-users (non-technical) / Technicians / Managers
4. **Sections needed**: List of topics to cover
5. **Support contact**: Name, email, phone, ticket portal
6. **Multi-deliverable?**: Does this need checklist/shot list appendices?

Use safe defaults if not specified:
- Default type: End-User Guide
- Default audience: Non-technical end-users
- Default contact: "[Contact Name]" (flagged as placeholder)

## Step 2: Plan Document Structure

Based on the document type, select the appropriate section pattern from `references/document-architecture.md`.

Create an outline listing:
- Every H1 section with its number
- Key components per section (callout type, step table, FAQ count, etc.)
- Images needed (placeholder descriptions if not provided)
- Deliverable boundaries (if multi-deliverable)

Present the outline to the user for approval before proceeding.

## Step 3: Generate Content

Write all document content following tone guidelines:
- **End-user docs**: Warm, patient, jargon-free, definitions inline
- **Tech docs**: Professional, concise, checklist-oriented
- **All docs**: Active voice, direct instructions, "you" addressing

For each section, select appropriate components:
- Step-by-step procedures → Step Table (4-column)
- Important alerts → Callout Box (INFO/WARNING/BEST PRACTICE/CONTACT)
- Common questions → FAQ Block
- Verification items → Checklist
- Photo documentation → Shot List Table

## Step 4: Build the Document

1. **Install docx**: `npm install -g docx`
2. **Copy logo**: Copy `assets/msm-logo.png` to working directory
3. **Write generator script**: Use the component patterns from `references/component-patterns.md`
4. **Assemble sections**: Follow the planned outline in order

### Script structure:
```
create-msm-doc.js
├── Import docx + fs
├── Load MSM logo buffer
├── Define helper functions (calloutBox, stepTable, faqBlock, etc.)
├── Define styles (headings, body, numbering)
├── Build content array (all sections in order)
├── Create Document with header, footer, content
├── Pack to buffer and write file
```

### Critical checks during assembly:
- [ ] Logo file loaded and embedded in header
- [ ] Footer has 2-column layout with address and copyright
- [ ] All heading styles use correct fonts and colors
- [ ] All callout boxes use correct fill/text color pairs
- [ ] Step tables have dark header row (#1F4E79)
- [ ] Bullet lists use numbering config (not unicode)
- [ ] Page size is US Letter (12240 x 15840)
- [ ] Margins are 1 inch (1440 DXA)

## Step 5: Validate

```bash
node create-msm-doc.js
python scripts/office/validate.py output.docx
```

If validation fails:
1. Read the error message
2. Unpack: `python scripts/office/unpack.py output.docx unpacked/`
3. Fix the XML issue
4. Repack: `python scripts/office/pack.py unpacked/ output.docx`

## Step 6: Visual Review

Convert to images for quick visual check:
```bash
python scripts/office/soffice.py --headless --convert-to pdf output.docx
pdftoppm -jpeg -r 150 output.pdf page
```

Verify:
- [ ] MSM logo appears in header on every page
- [ ] Footer address and page numbers visible
- [ ] Heading colors match spec (H1 dark teal, H2 orange)
- [ ] Callout boxes render with correct background colors
- [ ] Step tables have dark blue headers with white text
- [ ] No broken images or missing content
- [ ] Page breaks occur at deliverable boundaries

## Step 7: Deliver

1. Copy final document to `/mnt/user-data/outputs/`
2. Present to user with brief summary
3. Flag any placeholders that need user input (e.g., "[Contact Name]", "[ext. XXXX]")

</process>

<success_criteria>
- Document passes `validate.py` without errors
- MSM logo renders in header
- Footer contains address, phone, website, copyright, page numbers
- All callout boxes use exact hex colors from brand spec
- All step tables have 4-column format with #1F4E79 header
- Heading hierarchy: H1 (dark teal 24pt) → H2 (orange 20pt) → H3 (dark teal 14pt bold)
- No placeholder text remains (or all placeholders explicitly flagged to user)
- Tone matches audience (friendly for end-users, professional for techs)
</success_criteria>
