# Abstrekkt — UX System Architecture
## Patterns, State Machines, Layout Rules
### Version 1.0.0

---

## Layout System

### Grid
- Base unit: 8px
- Layout max-width: 1080px
- Content max-width: 640px (reading measure — non-negotiable)
- Columns: not a fixed grid system. Layout is content-width-constrained, not column-based.
- Breakpoints: sm 480px / md 768px / lg 1080px / xl 1280px

### Spacing Inheritance
Sections use `mb-2xl` (48px) between major content blocks.
Elements within a section use `gap-lg` (24px) or `gap-md` (16px).
Component internals use `gap-sm` (8px).
No arbitrary values. 8-point grid only.

### Reading Measure Constraint
Prose content must be constrained to `max-w-content` (640px).
This includes: article body, form descriptions, modal copy, onboarding text.
Tables, component galleries, and navigation are exempt.

---

## Navigation System

### Global Nav (Navbar)
- Sticky top-0. Never scroll-triggered.
- Background: `ink` with `border-b border-border`
- Active state: `text-brass`. No background fill on active item.
- Desktop: horizontal link list. Mobile: full-height overlay panel.
- Mobile trigger: hamburger — `aria-expanded`, `aria-controls`
- Focus trap: NOT required for navbar. Required for mobile overlay.

### Sidebar
- Desktop: sticky, fixed-width 240px, full viewport height
- Mobile: overlay drawer, closes on outside click or ESC
- Active state: `text-brass + bg-bg-3 + border-l-2 border-brass`
- Hover state: `hover:bg-bg-3 hover:border-border-bright`

### Breadcrumbs (not yet implemented — spec only)
```
font-mono text-label tracking-label text-fg-mute uppercase
Separator: / (fg-mute)
Current page: text-fg (no link)
```

---

## Form System

### Validation State Machine
```
States: pristine → touched → valid | invalid

pristine:  No border change. No message.
touched:   Input has been focused and blurred.
valid:     border-border (no change, no green — valid is default)
invalid:   border-oxblood + oxblood-text error message below input

Trigger:   Validate on blur (default). Submit re-validates all fields.
```

### Input Stack Structure
```
[Label — mono, uppercase, fg-mute]
[Input field — bg-3, border]
[Error message — mono, oxblood-text, role=alert]
OR
[Hint — mono, fg-mute, no role]
```

Error and hint never appear simultaneously. Error takes priority.

### Required Field Convention
- Required indicator: `*` in brass color, after label text
- Screen reader: `required` attribute on input — do not rely on `*` alone
- Never use placeholder text as the primary label

### Form Submission State
During submission: disable all form fields and submit button.
Button enters loading state (`aria-busy="true"`).
On success: toast + redirect or inline success state.
On failure: re-enable fields, show inline errors where available, toast for server errors.

---

## Feedback System

### Toast Hierarchy
```
Level 1 (role=status):   default, success — polite announcement
Level 2 (role=alert):    warning, error — assertive, interrupts

Max stack: 5 toasts
Default duration: 4000ms
Persist duration: 0 (user must dismiss)
Position: top-right (default), configurable per layout context
```

### Inline Validation
Error messages: mono, caption size, oxblood-text color, uppercase, margin-top: 8px
They are not tooltips. They are not popovers. They render in document flow below the field.

### Empty States
Three types:
1. **No data (expected):** First-run, nothing created yet.
   → Kicker + declarative statement + single CTA
2. **No results (filtered):** Search/filter returned nothing.
   → Statement + suggestion to modify filter
3. **Error state (load failed):** Data couldn't be fetched.
   → Statement + retry action

Empty states never say "It looks like..." or use emojis.

### Loading States
Skeleton rows in Table (5 rows, animated pulse via `animate-pulse`)
Spinner in Button (replaces content, preserves button dimensions)
`Loading...` copy in page-level loading states
`aria-busy="true"` on containers that are loading

---

## Modal System

### Use Cases
Modals are for: confirmation of destructive actions, quick-edit overlays, alert dialogs.
Modals are NOT for: navigation, multi-step flows, feature discovery.

### Modal Size
Single size: `max-w-[560px]`. No size variants.
On mobile (< 480px): full-width with horizontal padding maintained.

### Focus Management
On open: focus moves to first focusable element inside dialog.
On close: focus returns to the trigger element.
While open: Tab cycles within dialog only (focus trap active).

### Dismiss Behavior
Default: ESC + overlay click closes.
Destructive confirmation: overlay click disabled (`dismissOnOverlay=false`).

---

## Data Display System

### Table
Sorting: client-side by default. Pass `onSort` prop to delegate to server.
Row hover: `bg-bg-3` background — subtle depth step, no border change.
Sortable column headers: keyboard-activatable, `aria-sort` attribute.
Skeleton loading: 5 rows with animated placeholder columns.
Empty state: centered cell spanning all columns.

### Badge
Purpose: categorical label, status indicator.
NOT for: counts, notifications, progress.
Size: always small — `text-[10px]`, pill shape (`rounded-sm: 4px`).

---

## Motion System

### Rules
1. No entrance animations. Elements do not animate in on page load.
2. No scroll-triggered animations. No intersection observer for decorative motion.
3. Transitions are state-response only: hover, focus, active, open/close.
4. Maximum duration for interactive transitions: 200ms (`--duration-moderate`).
5. Modal is the only element using the slow token (300ms enter only).
6. All transitions must degrade cleanly under `prefers-reduced-motion`.

### Transition Map
```
hover border change:    150ms standard
hover text color:       80ms  fast
button fill on hover:   150ms standard
modal enter:            300ms decelerate
modal exit:             150ms accelerate
toast enter:            150ms standard
toast exit:             150ms standard
dropdown open:          150ms decelerate
dropdown close:         150ms accelerate
```

---

## Typography Hierarchy Rules

One thing reads first. Two things read second. Everything else recedes.

### Page-level hierarchy
1. `display-xl` — page title (ONE per page)
2. `display-lg` — primary section headers
3. `h2` — sub-sections
4. `h3` — subsections within h2
5. `h4` — fourth level — rare, use sparingly
6. `body-lg` — long-form article body
7. `body-md` — default UI prose
8. `body-sm` — card text, secondary descriptions
9. `kicker` — categorical labels ABOVE headings (brass, mono, uppercase)
10. `label` — UI metadata, form labels
11. `caption` — footnotes, timestamps

### Color in type hierarchy
- Headings: `fg` (parchment)
- Body: `fg` default, `fg-dim` for secondary
- Captions/metadata: `fg-dim` or `fg-mute` (now AA-compliant)
- Kickers: always `brass`
- Error copy: `oxblood-text`
- Links: `brass` → `brass-soft` on hover

---

## Ornamental System

Ornaments replace abstract dividers. They reinforce the print register without illustration.

```
♦ or ◆   — Diamond:    bullet points, mid-rule separators, kicker accent marks
✦         — Star:       one per section maximum. Structural accent.
→ ——◆—— ← — Divider:    editorial section separator. Never use --- in editorial layouts.
§         — Section:    footnotes, annotation markers
```

All ornaments are Unicode text. No SVG, no icon library, no img tags.

---

*System derived from: ABSTREKKT_DESIGN.md v1.0.0, compiler audit 2026-06-11*
