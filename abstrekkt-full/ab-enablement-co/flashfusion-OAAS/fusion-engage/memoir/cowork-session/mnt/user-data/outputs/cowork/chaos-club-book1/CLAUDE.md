# CLAUDE.md — chaos-club-book1
Last updated: April 11, 2026

---

## PROJECT IDENTITY
Manuscript builder for "Breathe Through the Bullsh*t: Your No-Nonsense Starter Kit for Mental Chaos" by Kyle Rosebrook. Status: manuscript complete. .docx build needed.

## DEFINITION OF DONE
Final .docx delivered to wiki/output/ with: working TOC, Georgia font throughout, US Letter page size, all 18 sections in correct order, no duplicate chapters, proper heading hierarchy, functional bullet/number lists.

---

## HARD CONSTRAINTS
1. Source file Chaos_Club_final_book.docx contains DUPLICATE chapters 1–6. Use FIRST occurrence ONLY. Detect by chapter title — skip any second instance.
2. NEVER reference Kyle's employer in any output
3. NEVER use \n characters — use separate Paragraph elements
4. NEVER use unicode bullet characters — use LevelFormat.BULLET with numbering config
5. Output must be US Letter page size (12240 × 15840 DXA)
6. Georgia font throughout — headings and body
7. Working TableOfContents component required
8. Read CLAUDE.md before touching any files
9. Ask "Are source files uploaded to raw/?" before starting any build

---

## SOURCE MATERIALS
Read before beginning any session:
- CONTEXT.md — build status
- raw/ — look for uploaded source .docx files

Source files (Kyle uploads from D: drive):
- `Chaos_Club_final_book.docx` — primary manuscript (~76K chars)
- `Chaos_Club_final_outline.docx` — structural reference
- `Chaos_Club_Brand_Kit_v1.docx` — brand guidelines, 15 pillars, voice

---

## COMPLETE SECTION LIST (all 18 — in order)

| Section | Status |
|---|---|
| Title / Copyright / Dedication | ✅ Written |
| Introduction | ✅ Written |
| Ch 1: Meditation Myths | ✅ Written |
| Ch 2: The BREATHE System | ✅ Written |
| Ch 3: The Starter Pack | ✅ Written |
| Ch 4: The Science | ✅ Written |
| Ch 5: Dealing with Obstacles | ✅ Written |
| Ch 6: Building Your Toolkit | ✅ Written |
| Ch 7: Response Awareness intro | ✅ Written |
| Ch 8: Why We React | ✅ Written |
| Ch 9: Three Steps | ✅ Written |
| Ch 10: Practicing in Real Life | ✅ Written |
| Ch 11: The Perks | ✅ Written |
| Ch 12: When It Feels Impossible | ✅ Written |
| Conclusion Part 1 | ✅ Written |
| Conclusion Part 2 (Setting Intentions) | ✅ Written |
| Acknowledgments | ✅ Written |
| Resources / Further Reading | ✅ Written |

---

## BUILD SPEC
Tool: `docx` npm package
- Page size: US Letter (12240 × 15840 DXA)
- Font: Georgia throughout
- Headings: built-in style IDs "Heading1", "Heading2" with outlineLevel set
- TOC: TableOfContents component
- Lists: LevelFormat.BULLET with numbering config — NEVER unicode bullets
- Paragraphs: separate Paragraph elements — NEVER \n characters
- Alternative approach: python-docx to read source → docx npm to write output

---

## SESSION PROTOCOL

### Start of every session
1. Read CLAUDE.md (this file)
2. Read CONTEXT.md — check build status
3. Ask: "Are source files uploaded to raw/?"
4. Confirm which sections are needed

### End of every session
1. Update CONTEXT.md with build status
2. Note any extraction issues (duplicates found, formatting anomalies)
3. Drop any output files in wiki/output/

---

## WIKI RULES
- raw/ = source files only (append-only, never edit)
- wiki/output/ = final deliverables
- wiki/log.md = build session log
- log format: `## [YYYY-MM-DD] | [build phase] | [status + issues]`
