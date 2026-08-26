# Screenshot Standards Reference

## Image Quality Requirements

| Attribute | Standard |
|-----------|----------|
| Format | PNG (lossless, supports transparency) |
| Resolution | Capture at native browser resolution (no scaling) |
| Minimum width | 1200px (readable on all screens) |
| Maximum width | 2560px (retina displays) |
| Color depth | 24-bit RGB |
| Compression | Default PNG compression (no lossy) |

## Capture Timing

**Wait before capture:**
- After page navigation: 3 seconds (DOM + async content)
- After clicking a button/link: 2 seconds (transitions, loaders)
- After opening a dropdown/modal: 1.5 seconds (animation complete)
- After typing text: 1 second (debounce, validation messages)
- After scrolling: 1 second (lazy-loaded content)

**Signs the page isn't ready:**
- Loading spinners or skeleton screens visible
- Images not yet loaded (broken image icons)
- Layout shift occurring (elements jumping)
- Toast notifications animating in

If any of these are detected, wait an additional 2 seconds and check again.

## Viewport Standards

**Recommended browser width:** 1280px or 1440px
- This captures most web app layouts without horizontal scrolling
- Sidebars and main content are visible simultaneously
- Matches common laptop screen widths

**Do NOT capture:**
- Browser chrome (address bar, tabs, bookmarks bar) — content area only
- Claude in Chrome side panel — must be hidden during capture
- DevTools — must be closed
- Other extension popups or overlays

## What Makes a Good Step Screenshot

**Must show:**
- The element being interacted with clearly visible and in focus
- Enough surrounding context to orient the user (which page, which section)
- The RESULT of the action (not just the element before clicking)

**For dropdown/select steps, capture TWO states:**
1. The dropdown OPEN showing available options
2. The option SELECTED and dropdown closed

**For navigation steps:**
- Capture the destination page after it fully loads, not the loading state

**For form/input steps:**
- Capture AFTER the text is typed, showing the filled field

## Annotation Guidelines

When Claude in Chrome captures, it should note in the step report what the user would want to highlight. The actual annotation (red boxes, arrows, numbered callouts) happens either:
- In Scribe's built-in editor (if using Scribe post-processing)
- In a separate image editing pass
- NOT during capture (keep screenshots clean)

**Recommended annotation elements (for manual post-processing):**
- Red rectangle (2px, #FF0000) around the click target
- Step number callout in the top-left of the highlight box
- Arrow pointing to small or hard-to-find elements
- Blur/redact for sensitive data (emails, account numbers, names)

## File Size Management

| Screenshot Count | Expected Doc Size | Action |
|-----------------|-------------------|--------|
| 1–10 | 2–10 MB | Normal |
| 11–25 | 10–30 MB | Acceptable |
| 26–50 | 30–60 MB | Consider JPEG for non-critical steps |
| 50+ | 60+ MB | Split into multiple documents |

**If file size exceeds 50MB:**
- Convert non-critical screenshots to JPEG (quality 85)
- Keep critical screenshots (dropdowns, error states, settings pages) as PNG
- Report size to user with option to optimize
