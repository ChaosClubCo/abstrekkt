# Capture Screenshots Workflow

## Purpose
Navigate a live browser application via Claude in Chrome and capture annotated screenshots for each step in a Scribe-formatted KB article.

---

## Pre-Capture Checklist

Before starting captures, validate ALL of the following:

1. **Chrome connector is active** — verify by confirming browser interaction is available
2. **User is logged into the target app** — ask: "Are you logged into [app name] in Chrome right now?"
3. **Starting URL is confirmed** — either extracted from the document or provided by the user
4. **Total step count confirmed** — "I found {N} steps needing screenshots across {S} sections. Ready to begin?"
5. **APP NOTES reviewed** — if user provided app-specific notes, acknowledge them before starting

---

## Step Extraction

Parse the uploaded document and build an internal step list. For each numbered step, extract:

- **Step number** (and section, if multi-section)
- **Action verb**: navigate, click, select, type, scroll, expand, open, toggle, drag, hover
- **Target element**: the UI element described (button text, menu label, field name, link text)
- **Expected context**: what page or panel should be visible at this point
- **Post-action state**: what should change after the action (a panel expands, a dropdown opens, a new page loads)
- **Screenshot filename**: following the naming convention from SKILL.md

### Action Verb Mapping

| Verb in Document | Browser Action |
|-----------------|----------------|
| Navigate to / Go to / Open | Navigate to URL or click navigation link |
| Click / Press / Select (a button/link) | Click the element |
| Type / Enter / Input | Click the field, then type the text |
| Select (from dropdown) | Click dropdown to open, then click option |
| Scroll down / Scroll to | Scroll until target element is in view |
| Expand / Open (a panel/section) | Click the expand/toggle control |
| Check / Uncheck | Click the checkbox |
| Hover over | Move cursor to element (for tooltips/menus) |

---

## Capture Execution

### For Each Step:

```
1. READ the step description from the document
2. IDENTIFY the action and target element
3. NAVIGATE or SCROLL to bring the target element into view
4. WAIT 2 seconds for UI to fully render (animations, loaders, dynamic content)
5. IF the step involves opening a dropdown or modal:
   a. Click to open it
   b. WAIT 1 second for animation
   c. SCREENSHOT with the dropdown/modal OPEN (this is the important state)
   d. If the step also says to select an option, select it
   e. SCREENSHOT the result state too (two screenshots for this step)
6. ELSE:
   a. PERFORM the action
   b. WAIT 2 seconds
   c. SCREENSHOT the resulting state
7. SAVE screenshot with correct filename
8. REPORT: "✓ Step {N}: {description} — captured as {filename}"
```

### Stop Conditions (MANDATORY)

IMMEDIATELY stop and ask the user before proceeding if:

- **Destructive action detected**: Step says to click Save, Submit, Delete, Confirm, Apply, Send, Remove, Disable, Enable, or any button that changes persistent state
  - Say: "Step {N} asks me to click '{button}'. This would change settings in the live app. Should I click it, or just screenshot the state before clicking?"
- **Authentication required**: A login page, MFA prompt, or session expiration appears
  - Say: "I'm seeing a login screen. Please log in, then tell me to continue."
- **Hardware interaction**: Step requires microphone recording, file upload from local disk, camera, or any hardware device
  - Say: "Step {N} requires {hardware action}. I can't do this from the browser agent. Please complete this step manually, then tell me to continue from step {N+1}."
- **Element not found**: After scrolling the full page and waiting 5 seconds, the target element is not visible
  - Say: "I can't find '{element description}' on the current page. The page shows: {brief description of what's visible}. Should I try a different approach, or skip this step?"
- **Unexpected page**: The current page doesn't match what the step expects (wrong URL, different UI state)
  - Say: "Step {N} expects me to be on {expected page/state}, but I'm seeing {actual state}. Should I navigate there first?"

### Multi-Section Handling

When the document has multiple H1 sections with independent step numbering:

1. Complete all steps in Section 1
2. Report: "✓ Section '{section name}' complete — {N} screenshots captured"
3. Check if Section 2 requires a different starting URL or navigation reset
4. Continue with Section 2, using the section-prefixed filename convention

---

## Quality Checks During Capture

After every 5 screenshots (or at section boundaries), pause and report:

```
Progress: {completed}/{total} screenshots captured
Current section: {section name}
Any issues: {list any skipped steps or retries}
```

If running in auto-run mode, only pause for this report if there were issues.

---

## Post-Capture Summary

After all steps are captured, provide a full summary:

```
## Screenshot Capture Complete

Total screenshots: {N}
Sections covered: {list}
Skipped steps: {list with reasons, or "None"}
Screenshots needing manual capture: {list, or "None"}

Screenshots saved as:
- {filename_1} (Step 1: {description})
- {filename_2} (Step 2: {description})
- ...

Ready to assemble the final document? Say "assemble" to proceed.
```

---

## Retry Protocol

If a screenshot is bad (user says "redo step {N}" or Claude detects an issue):

1. Navigate back to the state BEFORE the step
2. Re-execute the step
3. Re-capture with the same filename (overwrites previous)
4. Confirm: "✓ Step {N} re-captured"

If the user wants to manually capture a specific step:
1. User uploads the screenshot
2. Claude renames it to match the naming convention
3. Continues with remaining automated captures
