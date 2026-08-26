# Abstrekkt — Accessibility System
## WCAG 2.1 AA Compliance Reference
### Version 1.0.0

---

## Contrast Audit (Measured, Not Estimated)

| Pair | Ratio | WCAG | Status |
|------|-------|------|--------|
| `fg #e8e0cc` on `ink #0d0c0a` | 14.86:1 | AAA | ✓ |
| `fg #e8e0cc` on `bg-2 #232328` | 11.89:1 | AAA | ✓ |
| `fg-dim #94907e` on `ink #0d0c0a` | 6.10:1 | AA | ✓ |
| `fg-dim #94907e` on `bg-2 #232328` | 4.88:1 | AA | ✓ |
| `fg-mute #90897a` on `ink #0d0c0a` | 5.63:1 | AA | ✓ FIXED |
| `fg-mute #90897a` on `bg-2 #232328` | 4.50:1 | AA | ✓ FIXED |
| `brass #C8A86A` on `ink #0d0c0a` | 8.63:1 | AAA | ✓ |
| `brass #C8A86A` on `bg-2 #232328` | 6.90:1 | AA | ✓ |
| `brass #C8A86A` on `bg-3 #2c2c33` | 6.11:1 | AA | ✓ |
| `oxblood-text #d47272` on `bg-2 #232328` | 4.80:1 | AA | ✓ |
| `gate #e6cd9a` on `ink #0d0c0a` | 12.63:1 | AAA | ✓ |
| `brass-soft #d9bd87` on `bg-2 #232328` | 8.63:1 | AAA | ✓ |

**CRITICAL:** `oxblood #7a3838` fails ALL text contrast thresholds.
It is a decoration/border/background token ONLY. Never use as text color.
Original `fg-mute #5e5b50` (2.88:1, FAIL) corrected to `#90897a`.

---

## Focus Ring System

```css
:focus-visible {
  outline: 2px solid var(--brass);   /* #C8A86A — 8.63:1 on ink */
  outline-offset: 3px;
}
```

Focus ring color: brass. Passes AA on all system backgrounds.
Focus ring is visible on keyboard navigation ONLY (`:focus-visible`, not `:focus`).
Never suppress focus rings with `outline: none` without providing an equivalent.

---

## Keyboard Navigation Map

| Component | Keys | Behavior |
|-----------|------|----------|
| Button | `Enter`, `Space` | Activates |
| Navbar | `Tab` | Moves through nav items |
| Tabs | `ArrowLeft`, `ArrowRight` | Cycles tabs; `Home`/`End` to jump |
| Dropdown | `ArrowUp`, `ArrowDown` | Navigates items; `ESC` closes |
| Modal | `Tab`/`Shift+Tab` | Cycles focus within; `ESC` closes |
| Toast | Auto-dismisses | Dismiss button keyboard-reachable |
| Select | Native browser keyboard | Full native support |
| Table (sortable) | `Enter`, `Space` on header | Toggles sort |
| Tooltip | `Tab` to trigger | Shows immediately on focus (no delay) |
| Sidebar (mobile) | `ESC` | Closes overlay |

---

## ARIA Role Map

| Component | Primary role | Supporting attributes |
|-----------|-------------|----------------------|
| Navbar | `navigation` via `<nav>` | `aria-label="Primary navigation"` |
| Sidebar | `navigation` via `<nav>` | `aria-label="Sidebar navigation"` |
| Tabs list | `tablist` | — |
| Tab button | `tab` | `aria-selected`, `aria-controls`, `id` |
| Tab panel | `tabpanel` | `aria-labelledby` |
| Modal | `dialog` | `aria-modal="true"`, `aria-labelledby`, `aria-describedby` |
| Toast | `status` (default/success) | — |
| Toast (error/warning) | `alert` | — |
| Toast container | `aria-live="polite"` | `aria-atomic="false"` |
| Dropdown | `menu` | `aria-haspopup="menu"`, `aria-expanded` |
| Dropdown item | `menuitem` | — |
| Tooltip | `tooltip` | trigger gets `aria-describedby` |
| Table sort header | `columnheader` | `aria-sort="ascending|descending|none"` |
| Input error | `alert` via `role="alert"` | `aria-invalid`, `aria-describedby` |
| Badge | none (inline) | Semantic context from parent |

---

## Screen Reader Behavior

**Toasts:** Container has `aria-live="polite"`. Error and warning toasts use
`role="alert"` (assertive). Default and success use `role="status"` (polite).
`aria-atomic="false"` ensures individual messages are announced, not the whole stack.

**Modals:** Focus moves to first focusable element on open. Background is not
`aria-hidden` in this implementation — add `aria-hidden="true"` to `#app-root` when
modal is open for full SR isolation if required by project.

**Tables:** Sortable column headers are keyboard-activatable buttons within `<th>`.
`aria-sort` updates on each sort state change. Caption is screen-reader-only via `.sr-only`.

**Icons:** All decorative icons have `aria-hidden="true"`. All functional icons
(icon-only buttons) require `aria-label` on the button.

**Loading states:** Use `aria-busy="true"` on the container being loaded.
Skeleton rows in Table do not carry semantic meaning — no ARIA needed.

---

## Reduced Motion

All transitions wrapped in:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

This is in `tokens.css` and applies globally.
No component implements scroll-triggered or entrance animations — motion is
state-transition only, which means reduced-motion collapses cleanly to instant.

---

## Color Independence Rule

No information is conveyed by color alone.

- Error states: border-color change + `role="alert"` + text error message
- Success states: copy confirms the action ("Draft saved.")
- Active states: color + underline/border indicator (structural, not color-only)
- Sort direction: arrow icon direction + `aria-sort` attribute

---

## Touch Target Minimum

Minimum interactive touch target: 44×44px (WCAG 2.5.5 — AAA target, strongly recommended).

| Component | Target size |
|-----------|-------------|
| Button sm | 44px height minimum (py-1.5 + 11px font = ~36px — enforce min-height: 44px in mobile) |
| Button md | ~44px height achieved |
| Button lg | Exceeds 44px |
| Close button (Modal, Toast) | 44×44px tap area via padding |
| Nav items (mobile) | py-1 = 30px — enforce min-height: 44px on mobile |
| Table sort headers | Min 44px height in production |

**Action required:** Add `min-h-[44px] min-w-[44px]` to icon-only buttons in mobile contexts.

---

## Validation Checklist (Pre-Deploy)

- [ ] All interactive elements reachable by Tab
- [ ] Focus ring visible on all focusable elements in all states
- [ ] Error messages linked via `aria-describedby` and announce via `role="alert"`
- [ ] Modal focus trap active; `ESC` closes
- [ ] Dropdown closes on `ESC` and outside click
- [ ] Tabs respond to `ArrowLeft`/`ArrowRight`
- [ ] Sorted table headers have correct `aria-sort` value
- [ ] All icon-only buttons have `aria-label`
- [ ] No information conveyed by color alone
- [ ] All contrast pairs pass AA minimum (see table above)
- [ ] `prefers-reduced-motion` respected globally
- [ ] Touch targets ≥ 44×44px on mobile
