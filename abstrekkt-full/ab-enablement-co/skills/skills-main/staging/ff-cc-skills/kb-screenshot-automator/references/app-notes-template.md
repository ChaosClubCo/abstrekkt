# APP NOTES Template

When a specific application has quirks that affect screenshot capture, provide APP NOTES to Claude. Copy this template and fill in the relevant sections.

---

## Template

```
## APP NOTES for [App Name]

### Starting URL
[Full URL, e.g., https://app.kixie.com]

### Login State
[How to verify you're logged in — e.g., "You should see your name in the top-right corner"]

### Navigation Quirks
- [e.g., "Left sidebar collapses at window widths below 1200px — make sure it's expanded"]
- [e.g., "Settings pages have a 3-second loading spinner after clicking Edit"]
- [e.g., "The app uses a single-page architecture — URLs don't change between views"]

### Dropdown/Modal Behavior
- [e.g., "Dropdown menus close if cursor moves outside the menu boundary"]
- [e.g., "Modal dialogs have a fade-in animation — wait 2 seconds before capturing"]
- [e.g., "Some dropdowns require clicking an icon, not the text label"]

### Element Specificity
- [e.g., "There are two 'Save' buttons — use the one at the bottom of the modal, not the top nav"]
- [e.g., "'Agent Settings' is a collapsible section, not a link — click the text to expand"]

### Timing
- [e.g., "After clicking 'Inbound Call Flow', wait 4 seconds for the diagram to render"]
- [e.g., "Recording interface takes 3 seconds to initialize the microphone"]

### Known Issues
- [e.g., "The voicemail preview player sometimes doesn't load — refresh if the play button is grayed out"]
- [e.g., "Chrome may ask for microphone permission — this needs manual handling"]

### Sensitive Data to Redact
- [e.g., "Blur any email addresses visible in the profile section"]
- [e.g., "Redact the phone number shown in the call flow diagram"]
```

---

## Pre-Built APP NOTES

### Kixie (app.kixie.com)

```
## APP NOTES for Kixie

### Starting URL
https://app.kixie.com

### Login State
Dashboard visible with "My Profile" in left sidebar

### Navigation Quirks
- Left sidebar is always visible when logged in
- "Agent Settings" is a collapsible accordion section under My Profile — click to expand, not navigate
- "Inbound Call Flow" is nested inside Agent Settings — must expand Agent Settings first

### Dropdown/Modal Behavior
- The "Edit All" pencil icon opens a settings modal — wait 2 seconds for full load
- The Voicemail Message dropdown has three options (Text-to-Speech, Upload MP3, Record Now)
- Dropdown closes on outside click — capture immediately after opening

### Element Specificity
- "Edit All" pencil icon is in the top-right of the Inbound Call Flow section
- "VM Drop" is a separate subsection under Agent Settings (not inside Inbound Call Flow)
- The "+ Add" button for VM Drop is at the top of the VM Drop management area

### Timing
- Recording interface (Record Now) needs 3 seconds to initialize microphone
- After clicking Save, a green success toast appears briefly — capture before it fades

### Known Issues
- Chrome may prompt for microphone permission when "Record Now" is selected — needs manual handling
- The PowerCall Chrome extension popup can overlay the page — close it before capturing

### Sensitive Data to Redact
- Agent email address in profile section
- Phone numbers in call flow diagrams
- Any caller information in voicemail list
```

---

## How APP NOTES Are Used

1. User pastes APP NOTES into the conversation alongside the uploaded document
2. Claude reads them before starting the capture workflow
3. APP NOTES override default timing, element selection, and navigation behavior
4. APP NOTES are per-app — they can be saved and reused for all KB articles related to that app
5. If Claude encounters a situation not covered by APP NOTES, it falls back to the default behavior defined in `workflows/capture-screenshots.md`

## Building APP NOTES Iteratively

First time using the skill with a new app:
1. Start without APP NOTES
2. Note any issues during capture (wrong clicks, timing problems, missed elements)
3. After the session, ask Claude: "Based on what happened, draft APP NOTES for [App Name]"
4. Save the generated APP NOTES for future use with that app
5. Refine after each session until captures run clean
