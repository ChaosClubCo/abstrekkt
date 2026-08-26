# Readers, Utilities & Specialized Surfaces

Focused single-purpose UIs, e-ink/reader devices, file storage, billing, and the
adaptive desktop concept. Performance discipline matters most here.

> Assumes Brand Header + Enforcement Block + Prompt 0 pasted above.

---

## P07 — "Ultra User" Personal Desktop (adaptive layout + transparency)
*Audit: context-switching screen — error state not strictly required.*

**COMPACT:**
```
Design a personalized desktop environment UI that adapts layout based on task
context. Widgets: calendar, tasks, notes, focus timer, recent docs, "now playing",
analytics, quick launch.
Requirements:
- Layout modes: Focus (minimal), Work (dense), Review (analytics-heavy).
- Context-detection indicators (e.g., "Coding", "Meeting", "Planning") + manual override.
- Personalization controls: rearrange widgets, pin sets, automation rules.
Output: interaction notes for switching modes + accessibility considerations.
```

**MAX-DEPTH:** SYSTEM ROLE — designing an AI-adaptive desktop with strict transparency +
user control (not creepy). REQUIREMENTS: widget system (pin, resize, reorder, lock);
"Why am I seeing this?" explanations for adaptations; per-signal privacy toggles (what
signals are used); mode switcher (Focus/Build/Admin/Creative); activity + suggestions feed
with dismiss/learn. OUTPUT: widget taxonomy (12+ widgets with states); adaptation rules
engine (human-readable + pseudo-config); UI to audit/troubleshoot personalization; mock
user-timeline events powering adaptations.

---

## P08 — Simple Document Viewer (.txt, clean + fast)
*Audit [FIX-3.1]: added "no search results" state.*

**COMPACT:**
```
Create a lightweight document viewer UI that accepts a .txt file and renders it
cleanly. Features: upload/drag-drop, recent files, search-in-doc, font-size slider,
line-wrap toggle, dark/light.
Formatting: headings inferred by patterns, monospace blocks, highlight search terms.
States: empty, loading, parse error, unsupported file type, no-search-results.
Output: desktop + mobile; ensure readable line length.
```

**MAX-DEPTH:** SYSTEM ROLE — lightweight, production-grade viewer with performance
discipline. FEATURES: upload (drag/drop) + recent files + clear state; reader controls
(font size, line height, wrap, theme, search-in-doc); highlight matches + jump between
results; copy selected + optional export-to-PDF toggle; **handle 5-20MB text without
freezing (virtualized rendering)**. OUTPUT: component list + state model; 3 mock file
examples; error cases (encoding, huge file, unsupported); A11Y + keyboard shortcuts
(search, next match).

---

## P09 — Kindle Comic Reader (e-ink, minimal overlay)
*Audit [FIX-3.2]: added "end of book" state. e-ink exempts heavy animation/states.*

**COMPACT:**
```
Design a Kindle-style comic reader UI for single-page view.
Requirements:
- Tap zones for navigation; tap to toggle overlay.
- Overlay: page slider, thumbnails grid, brightness toggle, reading progress, library return.
- Accessibility: large tap targets, optional page-turn buttons, reduced motion.
- States: reading, menu open, library, settings, end-of-book.
Output: specify 2 interaction flows (open book -> read -> jump to page -> resume).
```

**MAX-DEPTH:** SYSTEM ROLE — designing for e-ink, low-refresh, high-contrast devices.
REQUIREMENTS: single-page view; tap zones next/prev; minimal overlay (brightness/contrast,
page slider, library); subtle page-cache/preload indicator; no heavy animation, reduced-refresh
strategy. OUTPUT: screen states (reading, menu open, library, settings, end-of-book);
navigation model + tap map; accessibility + readability guidance.

---

## P15 — Design System Tokens Viewer
*Audit [FIX-1.2]: token export is via Figma Tokens plugin / style-dictionary, not automatic CSS/JSON.*

```
Design a UI to browse and edit design system tokens. Sections: colors, typography,
spacing, shadows, motion.
Requirements:
- Token list + live preview.
- Compare before/after changes.
- Version history + rollback.
Output: export as a Figma file with clear token structure. Developers extract to
CSS/JSON using the Figma Tokens plugin or style-dictionary CLI (this UI does not
generate raw CSS/JSON itself). See ../tokens/ for the canonical token files.
```

---

## P18 — File Storage & Permissions UI
*Audit [FIX-5.1]: added delete-file confirmation. Share-with-permissions present ✓.*

```
Design a cloud file storage interface. Features: folder tree, file grid/list
toggle, share modal with permission levels, activity history.
Requirements:
- Drag-and-drop uploads; conflict-resolution state.
- Role-based sharing controls.
- Delete-file requires a confirmation dialog.
Output: include permission-logic notes; 1440 + responsive.
```

---

## P25 — Payment / Subscription Management
*Audit: full state coverage ✓. Security-sensitive.*

```
Design billing UI. Screens: plan chooser, invoices, payment methods, usage meters,
cancellation flow.
Requirements:
- Safe cancellation UX; retention-offer modal.
- Re-auth required for card changes.
- States: loading, empty, error, success, disabled, permission-gated.
Output: desktop-first; clear usage-meter visualizations.
```
