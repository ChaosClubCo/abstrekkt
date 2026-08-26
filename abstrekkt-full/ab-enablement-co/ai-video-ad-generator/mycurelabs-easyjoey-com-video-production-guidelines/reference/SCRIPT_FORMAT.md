# Script Format

**Version:** 1.0.0
**Domain:** Video
**Last Updated:** 2025-11-03

---

## Overview

This document defines the two-column audio-visual (AV) script format standard for MYCURE video
production, including templates, notation conventions, and best practices.

---

## Why Two-Column AV Format?

### Professional Standard

**Industry-standard format used by:**

- Documentary filmmakers
- Corporate video production
- Television production
- Professional YouTubers

### Benefits

**1. Clear separation of visual and audio**

- Director knows what to shoot (VISUAL column)
- Narrator knows what to read (AUDIO column)
- Editor knows how to synchronize

**2. Parallel development**

- Visual team can work on footage/graphics
- Audio team can record voiceover
- Both teams work simultaneously, faster production

**3. Precise timing**

- Easy to calculate duration (word count ÷ 2.5 = seconds)
- Identify scenes that are too long/short
- Balance pacing before production

**4. Stakeholder review**

- Non-technical reviewers can understand
- Easy to provide feedback ("Scene 3, audio line 2...")
- Visual review without seeing video

---

## Template Structure

### Complete Script Template

```markdown
---
title: "[Video Title]"
domain: Video
video_type: Demo | Tutorial | Explainer | Testimonial | Social Media
duration_estimate: "[MM:SS]"
target_audience: "[Description]"
key_message: "[One-sentence takeaway]"
status: draft | in-progress | complete
version: 1.0.0
created: 2025-11-03
last_updated: 2025-11-03
confidentiality: private
---

# [Video Title]

## Video Overview

**Type:** [Demo | Tutorial | Explainer | Testimonial | Social Media]
**Duration:** [MM:SS]
**Target Audience:** [Philippine clinic administrators, healthcare professionals, etc.]
**Key Message:** [What viewer should remember]
**CTA:** [What viewer should do after watching]

---

## Scene 1: [Scene Title]

| VISUAL | AUDIO |
|--------|-------|
| [SCENE 1: Description of what's on screen] | [VOICEOVER] Narrator script... |
| [B-ROLL: Supplementary footage description] | [VOICEOVER] Continuation of narration... |
| [GRAPHIC: "Text overlay" or animation] | [MUSIC: Background music cue] |

**Timing:** [X] seconds
**Purpose:** [What this scene accomplishes]
**Transition:** [Fade/Cut/Dissolve to next scene]

---

## Scene 2: [Scene Title]

[Continue pattern for all scenes...]

---

## Production Notes

**Assets Needed:**

- Screen recordings: [List specific screens]
- B-roll footage: [List required shots]
- Graphics: [List text overlays, animations]
- Music: [Style, mood, licensing]

**Technical Requirements:**

- Resolution: 1920x1080px (Full HD)
- Frame rate: 30fps or 60fps
- Audio: 48kHz, stereo
- Format: MP4 (H.264 codec)

**Review Checklist:**

- [ ] Script approved by stakeholders
- [ ] Timing validated (not too long/short)
- [ ] All assets identified and available
- [ ] CTA clear and actionable
- [ ] Brand voice consistent
```

---

## Visual Column Notation

### Scene Descriptions

**Format:** `[SCENE X: Description]`

**Description should include:**

- What's visible on screen
- Key UI elements highlighted
- Camera angle (if applicable)
- Visual focus (what viewer should notice)

**Examples:**

```markdown
| VISUAL |
|--------|
| [SCENE 1: MYCURE dashboard, all 6 modules visible, clean interface] |
| [SCENE 3: Registration module, empty patient form with "Name" field focused] |
| [SCENE 7: Inventory screen showing real-time stock levels across 3 locations] |
```

### B-Roll Footage

**Format:** `[B-ROLL: Action or subject]`

**B-roll = supplementary footage that supports voiceover**

**Examples:**

```markdown
| VISUAL |
|--------|
| [B-ROLL: Hands typing patient name "Maria Santos" into form] |
| [B-ROLL: Clinic receptionist smiling at patient] |
| [B-ROLL: Cursor clicking "Save" button] |
| [B-ROLL: Close-up of inventory shelf with medicine bottles] |
```

**When to use b-roll:**

- Demonstrate user actions (typing, clicking, scrolling)
- Show real-world context (clinic, staff, patients)
- Illustrate abstract concepts (efficiency = fast-paced activity)
- Add visual variety (break up static screen recordings)

### Graphics & Overlays

**Format:** `[GRAPHIC: "Text content" or description]`

**Graphics include:**

- Text overlays
- Arrows or highlights
- Animated elements
- Lower thirds (name, title)

**Examples:**

```markdown
| VISUAL |
|--------|
| [GRAPHIC: "70% time savings" appears on screen] |
| [GRAPHIC: Arrow pointing to "Auto-fill" button] |
| [GRAPHIC: Checkmark animation appears] |
| [GRAPHIC: Lower third - "Dr. Maria Santos, General Practitioner"] |
```

### Transitions

**Format:** `[CUT TO: Description]` or `[DISSOLVE TO: Description]`

**Transition types:**

- **CUT** - Immediate switch (most common)
- **FADE** - Fade to black, then fade in (scene change, time passage)
- **DISSOLVE** - Blend scenes (softer transition)
- **WIPE** - One scene pushes another off screen (stylistic)

**Examples:**

```markdown
| VISUAL |
|--------|
| [CUT TO: Appointment module dashboard] |
| [FADE TO: Black, then fade in on Inventory screen] |
| [DISSOLVE TO: Billing module with invoice visible] |
```

---

## Audio Column Notation

### Voiceover

**Format:** `[VOICEOVER] Script text`

**Voiceover = narrator speaking over visuals (most common)**

**Writing guidelines:**

- Write conversationally (how people talk, not formal writing)
- Use contractions ("you're" not "you are")
- Short sentences (10-15 words max)
- Active voice ("MYCURE automates" not "Automation is provided")

**Examples:**

```markdown
| AUDIO |
|-------|
| [VOICEOVER] MYCURE's Registration module makes patient intake fast and easy. |
| [VOICEOVER] Just start typing a patient's name, and MYCURE does the rest. |
| [VOICEOVER] Auto-fill, real-time validation, and complete medical history. All in 5 minutes. |
```

### Narration

**Format:** `[NARRATION] Script text`

**Narration = on-camera person speaking (less common)**

**Used for:**

- Testimonials (user on camera)
- Tutorials with on-screen instructor
- Behind-the-scenes content

**Example:**

```markdown
| AUDIO |
|-------|
| [NARRATION] Hi, I'm Dr. Santos, and I've been using MYCURE for 6 months. |
| [NARRATION] Let me show you my favorite feature: automated appointment reminders. |
```

### Dialogue

**Format:** `[SPEAKER NAME] Script text`

**Dialogue = conversation between people**

**Example:**

```markdown
| AUDIO |
|-------|
| [RECEPTIONIST] Good morning! Let me check you in. |
| [PATIENT] Thank you. My appointment is at 9 AM. |
| [RECEPTIONIST] Found it. Just a moment while I update your information. |
```

### Music

**Format:** `[MUSIC: Description]`

**Music cues:**

- **[MUSIC: Upbeat background music begins]** - Start music
- **[MUSIC: Music fades out]** - End music
- **[MUSIC: Music swells]** - Increase volume for emphasis

**Example:**

```markdown
| AUDIO |
|-------|
| [MUSIC: Upbeat, tech-inspired background music begins] |
| [VOICEOVER] Welcome to MYCURE... |
| [MUSIC: Music continues at 30% volume underneath voiceover] |
```

### Sound Effects

**Format:** `[SFX: Description]`

**Common sound effects:**

- Click sounds for button presses
- Notification chimes
- Whoosh for animations
- Ambient clinic sounds

**Example:**

```markdown
| AUDIO |
|-------|
| [SFX: Mouse click] |
| [VOICEOVER] Click the Registration module... |
| [SFX: Success chime] |
| [VOICEOVER] And you're ready to start! |
```

---

## Complete Scene Examples

### Example 1: Demo Video Scene

```markdown
## Scene 3: Auto-Fill Feature Demo

| VISUAL | AUDIO |
|--------|-------|
| [SCENE 3: Registration module, empty patient form] | [VOICEOVER] Patient registration used to take 15 minutes. |
| [B-ROLL: Receptionist looking at clock, frustrated] | [VOICEOVER] But with MYCURE, it takes just 5 minutes. |
| [B-ROLL: Hands typing "Maria San" in Name field] | [VOICEOVER] Start typing a patient's name... |
| [GRAPHIC: Auto-fill dropdown appears with 3 suggestions] | [SFX: Notification chime] |
| [B-ROLL: Cursor clicking "Maria Santos" from dropdown] | [VOICEOVER] ...and MYCURE finds matching records. |
| [B-ROLL: Form auto-fills with patient data in 2 seconds] | [SFX: Success chime] |
| [GRAPHIC: "70% time savings" appears on screen] | [VOICEOVER] That's 70% less data entry. |

**Timing:** 35 seconds
**Purpose:** Demonstrate auto-fill feature and time savings benefit
**Transition:** Cut to Scene 4 (Real-time validation)
```

### Example 2: Tutorial Video Scene

```markdown
## Scene 5: Step 3 - Validate Patient Information

| VISUAL | AUDIO |
|--------|-------|
| [SCENE 5: Patient form, all fields filled, Review button visible] | [VOICEOVER] Step 3: Validate patient information. |
| [GRAPHIC: Arrow pointing to "Review" button] | [VOICEOVER] Click the Review button to check for errors. |
| [B-ROLL: Cursor clicking "Review" button] | [SFX: Click] |
| [B-ROLL: Validation running, progress indicator] | [VOICEOVER] MYCURE validates all fields in real-time. |
| [GRAPHIC: Red highlight around "Contact Number" field] | [SFX: Alert beep] |
| [GRAPHIC: Error message "Invalid format. Use 09XX-XXX-XXXX"] | [VOICEOVER] If there's an issue, MYCURE tells you exactly what to fix. |
| [B-ROLL: Correcting phone number format] | [VOICEOVER] Fix the error and click Review again. |
| [GRAPHIC: Green checkmark, "All fields valid"] | [SFX: Success chime] |

**Timing:** 40 seconds
**Purpose:** Teach validation step, show error handling
**Transition:** Fade to Scene 6 (Save and confirm)
```

### Example 3: Explainer Video Scene

```markdown
## Scene 2: The Problem with Manual Records

| VISUAL | AUDIO |
|--------|-------|
| [SCENE 2: Animation of overflowing filing cabinets] | [VOICEOVER] Philippine clinics still rely on paper records. |
| [GRAPHIC: "73% of clinics use paper" stat appears] | [VOICEOVER] 73% of them, in fact. |
| [B-ROLL: Nurse searching through stacked folders] | [VOICEOVER] Finding patient history takes 10 minutes. |
| [B-ROLL: Receptionist buried in paperwork] | [VOICEOVER] Filing takes another 5 minutes. |
| [GRAPHIC: Clock ticking, time wasted] | [VOICEOVER] That's 15 minutes per patient just on records. |
| [GRAPHIC: "10 hours per week wasted" calculation] | [VOICEOVER] For a busy clinic, that's 10 hours per week. |

**Timing:** 30 seconds
**Purpose:** Establish problem scope with statistics and visuals
**Transition:** Dissolve to Scene 3 (Introduce MYCURE solution)
```

### Example 4: Testimonial Video Scene

```markdown
## Scene 4: Results After MYCURE

| VISUAL | AUDIO |
|--------|-------|
| [SCENE 4: Dr. Santos on camera, clinic in background] | [NARRATION] After switching to MYCURE, everything changed. |
| [B-ROLL: Dr. Santos using MYCURE on tablet] | [NARRATION] Patient registration dropped from 15 to 5 minutes. |
| [B-ROLL: Receptionist smiling, no paper stacks] | [NARRATION] My staff is happier. Less stress, no lost records. |
| [B-ROLL: Dr. Santos with patient, spending time talking] | [NARRATION] And I have more time with patients. |
| [GRAPHIC: "10 hours saved per week" stat overlay] | [NARRATION] We save 10 hours per week on admin tasks. |
| [SCENE 4: Dr. Santos on camera, smiling] | [NARRATION] MYCURE gave me back time to practice medicine. |

**Timing:** 35 seconds
**Purpose:** Show real results from actual user
**Transition:** Cut to Scene 5 (Dr. Santos recommends MYCURE)
```

---

## Timing & Pacing Guidelines

### Calculate Duration

**Average speaking pace:** 150 words per minute (2.5 words per second)

**Formula:**

```
Word count in AUDIO column ÷ 2.5 = Duration in seconds

Example Scene:
Audio: 85 words
85 ÷ 2.5 = 34 seconds
```

**Add buffer:**

- +5-10 seconds for visual actions (clicking, typing, loading)
- +2-3 seconds for scene transitions
- +3-5 seconds for graphics to display

**Example:**

```
Audio: 34 seconds
Visual actions: +8 seconds
Graphics: +4 seconds
Total scene: 46 seconds
```

### Scene Length Guidelines

**Optimal scene durations:**

- **Short scenes:** 10-20 seconds (transitions, single ideas)
- **Medium scenes:** 20-40 seconds (demos, explanations)
- **Long scenes:** 40-60 seconds (complex tutorials, testimonials)

**Avoid:**

- **Too short** (<10s) - Feels rushed, hard to process
- **Too long** (>60s) - Viewer attention wanes, loses focus

### Video Length Guidelines

**By video type:**

- **Social media:** 15-60 seconds (hook in first 3 seconds)
- **Explainer:** 60-180 seconds (1-3 minutes)
- **Demo:** 120-300 seconds (2-5 minutes)
- **Tutorial:** 180-480 seconds (3-8 minutes)
- **Testimonial:** 60-120 seconds (1-2 minutes)

---

## Script Review Checklist

### Before Production

**Content:**

- [ ] Key message clear and consistent throughout
- [ ] CTA stated at end (what viewer should do)
- [ ] Brand voice matches MYCURE standards
- [ ] No jargon (or explained if necessary)
- [ ] Healthcare compliance (suggestive language for outcomes)

**Structure:**

- [ ] Scene titles descriptive and specific
- [ ] Each scene has single focus (one message)
- [ ] Logical flow from scene to scene
- [ ] Transitions noted between scenes
- [ ] Timing estimated for each scene

**Visual column:**

- [ ] All visuals clearly described
- [ ] B-roll needs identified
- [ ] Graphics specified
- [ ] Visuals support audio (don't just duplicate)

**Audio column:**

- [ ] Conversational, natural language
- [ ] Short sentences (10-15 words)
- [ ] Active voice
- [ ] Proper pacing (not too fast/slow)
- [ ] Music cues noted

**Technical:**

- [ ] Total duration within target range
- [ ] All assets identified (screen recordings, b-roll, graphics)
- [ ] Production notes complete
- [ ] Stakeholder approval

---

## Common Mistakes

### Mistake 1: Visual Duplicates Audio

**❌ Wrong:**

```markdown
| VISUAL | AUDIO |
|--------|-------|
| [GRAPHIC: "MYCURE automates patient registration"] | [VOICEOVER] MYCURE automates patient registration. |
```

(Viewer reads same text narrator says - redundant)

**✅ Correct:**

```markdown
| VISUAL | AUDIO |
|--------|-------|
| [B-ROLL: Patient form auto-filling in 3 seconds] | [VOICEOVER] MYCURE automates patient registration. |
```

(Visual SHOWS automation, audio EXPLAINS benefit)

### Mistake 2: Too Much Text in Audio

**❌ Wrong:**

```markdown
| AUDIO |
|-------|
| [VOICEOVER] MYCURE's Registration module provides comprehensive patient intake functionality with automated data entry, real-time validation, cross-module synchronization, complete medical history tracking, and FHSIS-compliant record keeping for Philippine Department of Health reporting requirements. |
```

(Single 42-word sentence - impossible to speak naturally)

**✅ Correct:**

```markdown
| AUDIO |
|-------|
| [VOICEOVER] MYCURE's Registration module makes patient intake fast and easy. |
| [VOICEOVER] Auto-fill, real-time validation, and complete medical history. |
| [VOICEOVER] All in 5 minutes. |
```

(Three short sentences - conversational, easy to follow)

### Mistake 3: Missing Visual Descriptions

**❌ Wrong:**

```markdown
| VISUAL | AUDIO |
|--------|-------|
| [SCENE 3: Registration screen] | [VOICEOVER] Now let's register a new patient. |
```

(Too vague - what's on the screen? What should editor show?)

**✅ Correct:**

```markdown
| VISUAL | AUDIO |
|--------|-------|
| [SCENE 3: Registration module, empty patient form with "Name" field focused and cursor blinking] | [VOICEOVER] Now let's register a new patient. |
```

(Specific - editor knows exactly what to show)

### Mistake 4: Unclear Timing

**❌ Wrong:**

```markdown
## Scene 5: Demo

[No timing estimate]
```

(Can't calculate total video duration, hard to balance pacing)

**✅ Correct:**

```markdown
## Scene 5: Auto-Fill Demo

**Timing:** 35 seconds
```

(Clear timing helps with planning and review)

---

## Questions?

**Script Format:** Creative Director
**Notation Standards:** Video Producer
**Timing Calculations:** Post-Production Lead

---
