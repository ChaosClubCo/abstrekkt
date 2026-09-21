# MSM Document Architecture Reference

## Document Types

### Type 1: End-User Guide (Primary)
Full instructional document for non-technical users. Multi-section, heavily illustrated.

**Section order**:
1. Title / Subtitle
2. Welcome paragraph (friendly, approachable tone)
3. Time estimate callout (INFO box)
4. Prerequisites / "Before You Start" (checklist of required items)
5. Setup / Physical steps (with images, step tables)
6. Login / Account steps (step tables + MFA explanation)
7. Network / Connectivity (Wi-Fi vs Ethernet, speed test)
8. Application setup (Outlook, Teams, etc.)
9. Phone / Communications setup
10. Security basics (safe habits, plain language)
11. Help & Support (contact info callout)
12. Quick Start (condensed 5-step version)
13. FAQ (top 20-30 questions)
14. Troubleshooting flowcharts
15. Accessibility notes

### Type 2: Technician Checklist
Structured verification checklist for field techs. Categories with checkbox items.

**Section order**:
1. Title
2. Instructions paragraph
3. Hardware Confirmation (checkboxes)
4. Network and Connectivity (checkboxes)
5. Account and Security (checkboxes)
6. Software and Applications (checkboxes)
7. User Handoff (checkboxes)
8. Documentation (checkboxes)
9. Escalation Triggers (WARNING box)
10. Plain Text Version (FreshService copy/paste block)

### Type 3: Photo Shot List
Documentation photography guide for deployment kits.

**Section order**:
1. Title
2. Naming convention
3. Shot list table (20 rows typical)
4. Annotation instructions
5. Best practice callout

### Type 4: Multi-Deliverable Document
Combines 2-3 of the above into a single .docx with page-break separators.

**Pattern**:
```
[DELIVERABLE A: End-User Guide]
  — full guide content —
[PAGE BREAK + DELIVERABLE B LABEL]
[DELIVERABLE B: Photo Shot List]
  — shot list content —
[PAGE BREAK + DELIVERABLE C LABEL]
[DELIVERABLE C: FreshService Checklist]
  — checklist content —
```

---

## Tone & Voice Guidelines

### End-User Documents
- **Audience**: Non-technical employees, possibly first corporate computer
- **Tone**: Warm, patient, zero jargon (or jargon explained inline)
- **Pattern**: Tell them what to do → Tell them what they should see → Tell them what to do if it goes wrong
- **Reassurance phrases**: "No technical experience required", "Take it one step at a time", "There are no silly questions"
- **Definitions inline**: "MFA (Multi-Factor Authentication) is a second layer of security. Think of it like a deadbolt on top of your regular door lock."
- **Contact escalation**: Always route to a named person (e.g., "Contact Kyle")

### Technician Documents
- **Audience**: IT field technicians, MSPs
- **Tone**: Professional, concise, checklist-oriented
- **Pattern**: Category → Items → Escalation triggers
- **No hand-holding**: Assume technical competence

---

## Section Patterns

### Welcome Block
```
[H1] Document Title
[H2] Subtitle
[Normal] Welcome paragraph (2-3 sentences, friendly)
[INFO Callout] Time estimate + quick start reference
```

### Prerequisites Block
```
[H1] X. Before You Start
[Normal] Intro sentence
[H2] What Should Be in the Box
[Bullet list] Required items with descriptions
[H3] If You Received These (Role-Dependent)
[Bullet list] Optional items
[WARNING Callout] Missing items escalation
```

### Instructional Block
```
[H1] X. Section Title
[Normal] Intro paragraph (what this section covers)
[INFO Callout] Key definition (if needed)
[Image] Visual reference with alt text + caption
[Step Table] 4-column: # | Action | Expected | Fix
[Image] Summary visual (if helpful)
[BEST PRACTICE Callout] Pro tip
```

### FAQ Block
```
[H1] X. Top N FAQ
[Normal] Intro sentence + contact fallback
[Bold Q:] Question text
[Indented A:] Answer text (2-4 sentences max)
— repeat for each FAQ —
```

### Troubleshooting Block
```
[H1] X. Troubleshooting Flowcharts
[Normal] Intro sentence
[H2] Problem Description
[Image] Flowchart diagram with alt text + caption
— repeat per problem —
```

### Support Block
```
[H1] X. Help and Support
[Normal] Intro sentence
[CONTACT Callout] Name, email, phone, ticket URL, expected response time
[H2] What to Include When Asking for Help
[Bullet list] Required info items
[Image] Asset tag example photo
```

---

## Numbering Convention

### Section Numbers
- Main sections use H1 with sequential numbering: "1. Before You Start", "2. Unbox and Place Items"
- Sub-sections use H2 (no number prefix)
- Sub-sub-sections use H3 (no number prefix)

### Step Numbers
- Step tables use bold numbers in first column: **1**, **2**, **3**
- Standalone numbered instructions use numbered list format: 1., 2., 3.
- FAQ questions are not numbered

---

## Image Placement Rules

1. **Before step tables**: Show the hardware/interface the steps reference
2. **After step tables**: Show completed state or summary visual
3. **In troubleshooting**: One flowchart per problem
4. **Alt text required**: Every image gets descriptive alt text for screen readers
5. **Caption required**: Italic text below every image summarizing what it shows
6. **Standard widths**: Full-width (6.04"), medium (4.58"), small (3.54")

---

## Accessibility Requirements

Applied to every MSM document:
- All text in clear, readable font at comfortable size (11pt minimum body)
- High contrast throughout (dark text on light backgrounds)
- No information conveyed by color alone — icons and labels accompany color cues
- All images include descriptive alt text
- Callout boxes use emoji + bold label (not just color)
- Final section: Accessibility notes with magnification/settings instructions
