# Assemble Document Workflow

## Purpose
Replace all "Screenshot Placeholder" markers in a Scribe-formatted document with real screenshots, producing a final .docx with embedded images.

---

## Input Requirements

**Required:**
- Scribe-formatted document (.docx or .pdf) with "Screenshot Placeholder" markers
- Screenshots — either captured via `capture-screenshots` workflow or uploaded by user

**Screenshot matching:**
Screenshots are matched to placeholders by step number and section. The naming convention from capture determines the mapping:
- `step_01.png` → first placeholder in the document
- `voicemail_setup_step_01.png` → first placeholder in the "Voicemail Setup" section

If screenshots don't follow the naming convention (user uploaded manually), match by:
1. Filename number if present (e.g., `screenshot_3.png` → step 3)
2. Upload order if no numbers (first uploaded → first placeholder)
3. Ask user to confirm mapping if ambiguous

---

## Assembly Process

### Step 1: Parse Source Document

Extract the document structure:
- Identify all "Screenshot Placeholder" locations (line/paragraph position)
- Map each placeholder to its step number and section
- Preserve all non-placeholder content exactly (text, tables, callout boxes, formatting)
- Count placeholders vs. available screenshots — report any mismatch

**Mismatch handling:**
```
Found {P} placeholders but {S} screenshots.

Missing screenshots for steps: {list}
Extra screenshots not matched: {list}

Options:
A) Proceed — insert what we have, leave remaining placeholders as-is
B) Wait — I'll capture/provide the missing screenshots first
```

### Step 2: Determine Image Sizing

**Default sizing rules:**
- Full-width screenshots: image width = page content width (typically 6.5 inches for US Letter with 1-inch margins)
- Aspect ratio preserved — height scales proportionally
- If screenshot is very tall (height > 1.5x width), consider scaling to 80% width for better page flow

**User override:**
If user specifies "half width", "thumbnail", or other sizing, apply accordingly.

### Step 3: Build Output Document

Use the docx skill (docx-js via Node.js) to create the output:

**If input was .docx:**
1. Unpack the original .docx
2. For each placeholder paragraph in the XML:
   a. Add the screenshot image to `word/media/`
   b. Add the image relationship to `word/_rels/document.xml.rels`
   c. Replace the placeholder paragraph with an image paragraph
3. Repack the .docx

**If input was .pdf (or building from scratch):**
1. Create a new .docx using docx-js
2. Rebuild the full document structure (headings, steps, callout boxes, tables)
3. Insert images at each placeholder position
4. Apply INT/MSM branding if the source document was branded

### Step 4: Image Insertion Pattern

For each screenshot insertion:

```javascript
// Image sizing (EMUs: 914400 = 1 inch)
const maxWidthInches = 6.5;
const maxWidthEMU = maxWidthInches * 914400;

// Read image dimensions to calculate proportional height
// Scale width to maxWidthEMU, height proportionally
const aspectRatio = imageHeight / imageWidth;
const displayWidth = maxWidthEMU;
const displayHeight = Math.round(displayWidth * aspectRatio);
```

Each image paragraph should:
- Be center-aligned
- Have 120 DXA (approximately 0.08 inch) spacing before and after
- Have a thin border (1pt, light gray #CCCCCC) to frame the screenshot
- NOT have a caption (the step description above serves as the caption)

### Step 5: Validate Output

After assembly:
1. Verify all placeholders were replaced (search output for remaining "Screenshot Placeholder" text)
2. Verify image count matches expected count
3. Verify document opens without errors (run validation if available)
4. Check file size is reasonable (warn if >25MB — large screenshots add up)

### Step 6: Save and Present

Save outputs:
```
/mnt/user-data/outputs/{document-name}_with_screenshots.docx   ← Final assembled document
/mnt/user-data/outputs/screenshots/                             ← Individual screenshot PNGs (for reuse)
```

Present the final document to the user.

**Summary report:**
```
## Document Assembly Complete

Source: {input filename}
Output: {output filename}
Screenshots inserted: {N} of {P} placeholders
File size: {size}

{Any remaining placeholders listed, if applicable}
```

---

## Edge Cases

### Placeholder Text Variants
The skill recognizes these placeholder patterns (case-insensitive):
- "Screenshot Placeholder"
- "[SCREENSHOT]"
- "[IMAGE HERE]"
- "[Screenshot Placeholder]"
- "Insert screenshot here"
- "{screenshot}"

### Multi-Pass Assembly
If the user captures screenshots in batches (e.g., Section 1 today, Section 2 tomorrow):
- First pass: insert Section 1 screenshots, leave Section 2 placeholders
- Second pass: user uploads the same doc + Section 2 screenshots
- Skill detects remaining placeholders and inserts only the new screenshots

### Preserving Existing Images
If the document already contains some real images (not placeholders), preserve them. Only replace paragraphs that contain recognized placeholder text.

### Screenshot Annotation
If the user requests annotated screenshots (red boxes around click targets, numbered callouts):
- This is best handled during capture (Claude in Chrome can describe what to highlight)
- For post-capture annotation, suggest the user use Scribe's built-in annotation tools or a separate image editor
- The skill does NOT modify screenshot images — it inserts them as-is
