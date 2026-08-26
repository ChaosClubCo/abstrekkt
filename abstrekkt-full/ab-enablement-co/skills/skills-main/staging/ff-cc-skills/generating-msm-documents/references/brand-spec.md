# MSM Brand Specification Reference

## Company Information

- **Full name**: MSM — Multimedia Sales & Marketing
- **Address**: 175 Olde Half Day Rd, Ste #240, Lincolnshire, IL 60069
- **Phone**: 847.215.4900
- **Website**: www.msminc.com
- **Logo file**: `assets/msm-logo.png` (1063599 x 457200 EMU = ~1.17" x 0.5")

---

## Color Palette

### Theme Colors (scheme name: "INT Colors")

| Role | Hex | Usage |
|------|-----|-------|
| dk1 | `#000000` | Black (body text default) |
| lt1 | `#FFFFFF` | White (backgrounds, reversed text) |
| dk2 | `#00405F` | Dark teal — H1, H3, H4 headings |
| lt2 | `#E2690E` | Orange (theme alternate) |
| accent1 | `#5391AA` | Teal blue — hyperlinks, footer text |
| accent2 | `#043754` | Dark navy |
| accent3 | `#E2690E` | Orange (same as lt2) |
| accent4 | `#838D93` | Gray |
| accent5 | `#286B83` | Medium teal |
| accent6 | `#DC8955` | Warm orange |
| hlink | `#5391AA` | Hyperlink color |
| folHlink | `#286B83` | Followed hyperlink |

### Callout Box Colors

| Type | Background Fill | Text Color | Emoji Prefix |
|------|----------------|------------|--------------|
| INFO | `#D6EAF8` | `#1A5276` | ℹ️ |
| WARNING | `#FFF3CD` | `#856404` | ⚠️ |
| BEST PRACTICE | `#D5F5E3` | `#1E8449` | ✅ |
| CONTACT | `#D6EAF8` | `#1A5276` | ☎️ |

### Step Table Colors

| Element | Background | Text Color |
|---------|-----------|------------|
| Header row | `#1F4E79` | `#FFFFFF` |
| Odd data rows | `#EBF5FB` | default |
| Even data rows | `#FFFFFF` | default |
| Alternating accent | `#F2F3F4` | default |

---

## Typography

### Font Stack

| Context | Primary Font | Fallback | Weight |
|---------|-------------|----------|--------|
| Headings (H1-H4) | Roboto Condensed Medium | Arial | Medium (500) |
| Callout box titles | Rubik Medium | Arial | Medium |
| Callout box body | Rubik | Arial | Regular |
| Body text | Theme minorHAnsi (Rubik) | Arial | Regular |
| Footer | Rubik | Arial | Regular |
| Code/plaintext | Consolas | Courier New | Regular |

### Heading Styles

| Level | Font | Size (pt) | Color | Weight | Spacing Before | Spacing After | outlineLevel |
|-------|------|-----------|-------|--------|----------------|---------------|-------------|
| H1 | Roboto Condensed Medium | 24pt (48 half-pt) | `#00405F` | Medium | 120 twips | 240 twips | 0 |
| H2 | Roboto Condensed Medium | 20pt (40 half-pt) | `#E27305` | Medium | 240 twips | 120 twips | 1 |
| H3 | Roboto Condensed Medium | 14pt (28 half-pt) | `#00405F` | Bold | 240 twips | 120 twips | 2 |
| H4 | Roboto Condensed Medium | 12pt (24 half-pt) | `#00405F` | Medium | 240 twips | 120 twips | 3 |

### Body Text (Normal style)

- Font: Theme minorHAnsi (Rubik), CS fallback: Arial
- Size: 11pt (22 half-pt)
- Line spacing: 320 twips exact
- Space after: 240 twips
- Color: default (black)

---

## Page Layout

- **Paper size**: US Letter — 12240 x 15840 DXA
- **Margins**: 1 inch all sides (1440 DXA each)
- **Content width**: 9360 DXA (12240 - 2×1440)
- **Orientation**: Portrait (default)

---

## Header

- **Style**: `ProjectName` (custom paragraph style)
- **Logo placement**: Anchored to left margin
  - `positionH`: leftMargin, offset 400050 EMU
  - `positionV`: topMargin, offset 387985 EMU
  - Size: 1063599 x 457200 EMU (~1.17" × 0.5")
  - Wrap: square, wrapText="right"
  - Locked: yes, behindDoc: yes
- **Text**: Right-aligned, color `#333333`, 10pt (20 half-pt)

---

## Footer

- **Structure**: 2-column borderless table (5395 + 5395 DXA)
- **Font**: Rubik, 8pt (16 half-pt), color `#5391AA` (accent1)
- **Left column** (left-aligned):
  ```
  175 Olde Half Day Rd, Ste #240  |  Lincolnshire, IL 60069  847.215.4900  |  www.msminc.com
  ```
- **Right column** (right-aligned):
  ```
  Copyright © [DYNAMIC YEAR]  MSM Inc.  All rights reserved.    Page X of Y
  ```
- Year uses field code: `DATE \@ "yyyy" \* MERGEFORMAT`
- Page number uses field codes: `PAGE` and `NUMPAGES`

---

## Custom Styles Found in Template

| Style ID | Style Name | Based On | Purpose |
|----------|-----------|----------|---------|
| `ProjectName` | Project Name | (root) | Header text, right-aligned, #333333, 10pt |
| `DocumentName` | Document Name | (root) | Bold, right-aligned, #333333, 10pt |
| `CompanyName` | Company Name | DocumentName | Same + spacing after 240 |
| `InformationBox` | Information Box | Normal | Callout container: border #688798, fill #F5FBFF |
| `WarningBox` | Warning Box | InformationBox | Warning variant: border #E26A0E, fill #FFEBDE |

**Note**: The actual callout boxes in the document body are implemented as single-cell tables with inline formatting (not using InformationBox/WarningBox styles). The skill should replicate the table-based approach for maximum fidelity.

---

## List Numbering

### Bullet Lists
- Level 0: indent left 720, hanging 360, format BULLET
- Character: standard bullet (•)

### Numbered Lists
- Level 0: indent left 720, hanging 360, format DECIMAL
- Pattern: `%1.`

---

## Image Handling

- All images include `wp:docPr` with descriptive `name` attribute
- Alt text provided via `descr` attribute on `wp:docPr`
- Caption pattern: Italic paragraph immediately following image
- Standard image width: 6.04" (5800000 EMU) for full-width, 4.58" for medium, 3.54" for small
