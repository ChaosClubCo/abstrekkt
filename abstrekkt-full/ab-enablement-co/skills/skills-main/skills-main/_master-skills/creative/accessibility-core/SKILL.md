---
name: accessibility-core
description: Comprehensive guide to building inclusive, WCAG 2.2 Level AA compliant interfaces. Covers semantic HTML, ARIA, keyboard navigation, screen reader compatibility, and automated testing strategies for 2025. Use when designing, creating, or reviewing creative deliverables.
---

# Accessibility Core Skill

## Overview
Comprehensive guide to building inclusive, WCAG 2.2 Level AA compliant interfaces. Covers semantic HTML, ARIA, keyboard navigation, screen reader compatibility, and automated testing strategies for 2025.

---

## When to Use This Skill
- Auditing existing products for accessibility compliance
- Designing new features with accessibility-first approach
- Preparing for legal compliance (ADA, Section 508, EAA)
- Training teams on inclusive design practices
- Implementing accessibility testing pipelines

---

## Core Principles (POUR Framework)

### 1. Perceivable
**Users must be able to perceive content.**

- Text alternatives for images, icons, videos
- Captions and transcripts for audio/video
- Sufficient color contrast (4.5:1 for text)
- Content adaptable (responsive, screen readers)

### 2. Operable
**Users must be able to operate the interface.**

- Keyboard accessible (no mouse required)
- Enough time to complete tasks (no strict timeouts)
- No content that causes seizures (flashing <3 times/sec)
- Navigable (skip links, landmarks, focus indicators)

### 3. Understandable
**Users must be able to understand content and operation.**

- Readable text (plain language, clear instructions)
- Predictable behavior (consistent navigation)
- Input assistance (error messages, labels, help)

### 4. Robust
**Content must work with assistive technologies.**

- Valid HTML (no broken tags)
- Compatible with screen readers, keyboard nav tools
- Future-proof (follows web standards)

---

## WCAG 2.2 Level AA Requirements

### Success Criteria Summary

#### Level A (Must Have)
- Text alternatives (alt text)
- Captions for audio
- Keyboard accessible
- No keyboard traps
- Timing adjustable
- Pause, stop, hide for moving content
- Page titled
- Focus order logical
- Link purpose clear
- Multiple ways to find pages

#### Level AA (Should Have)
- **Color contrast:** 4.5:1 for normal text, 3:1 for large text
- **Resize text:** Up to 200% without loss of function
- **Reflow:** Content fits 320px width (no horizontal scroll)
- **Focus visible:** Clear keyboard focus indicator
- **Target size:** Min 44×44px touch targets (WCAG 2.2 new)
- **Consistent navigation:** Same order across pages
- **Error identification:** Clear error messages
- **Labels or instructions:** All inputs labeled

**Note:** Level AAA (Nice to Have) includes sign language, extended audio descriptions, and higher contrast (7:1). Not required for most products.

---

## Semantic HTML Foundation

### Use Native Elements (Not Divs)

#### ❌ Anti-Pattern (Div Soup)
```html
<div class="button" onclick="doThing()">Click me</div>
<div class="checkbox" onclick="toggle()">
  <div class="checkmark"></div>
</div>
```

**Problems:**
- No keyboard support
- Screen readers don't announce role
- No built-in states (disabled, checked)

#### ✅ Best Practice (Semantic HTML)
```html
<button type="button" onclick="doThing()">Click me</button>
<input type="checkbox" id="agree">
<label for="agree">I agree to terms</label>
```

**Benefits:**
- Free keyboard navigation (Tab, Enter, Space)
- Screen reader announces role automatically
- Browser handles states (focus, disabled, checked)

---

### Semantic Element Cheat Sheet

| Purpose | Element | Notes |
|---------|---------|-------|
| Primary heading | `<h1>` | One per page |
| Subheadings | `<h2>` to `<h6>` | Logical hierarchy, no skipping |
| Paragraph | `<p>` | Not `<div>` or `<span>` |
| List | `<ul>`, `<ol>`, `<li>` | Unordered or ordered |
| Navigation | `<nav>` | Main site navigation |
| Main content | `<main>` | Primary page content |
| Sidebar | `<aside>` | Tangential content |
| Section | `<section>` | Thematic grouping |
| Article | `<article>` | Standalone content |
| Footer | `<footer>` | Page or section footer |
| Button | `<button>` | Triggers action |
| Link | `<a href="...">` | Navigates to URL |
| Input | `<input type="...">` | Form fields |
| Dropdown | `<select>` | Native dropdown |

**Claude action:** When generating HTML, always use semantic elements first. Only use `<div>` and `<span>` for styling containers with no semantic meaning.

---

## ARIA (Accessible Rich Internet Applications)

### When to Use ARIA

**Rule #1:** Prefer native HTML over ARIA.  
**Rule #2:** If native HTML doesn't exist, use ARIA.  
**Rule #3:** Don't break native semantics with ARIA.

**Example:**
- ❌ `<div role="button">` → Use `<button>` instead
- ✅ `<div role="tabpanel">` → No native tabpanel element

---

### ARIA Roles

#### Landmark Roles (Page Structure)
```html
<header role="banner">Site header</header>
<nav role="navigation">Main menu</nav>
<main role="main">Page content</main>
<aside role="complementary">Sidebar</aside>
<footer role="contentinfo">Site footer</footer>
```

**Note:** Modern HTML5 elements have implicit roles, so `<nav>` doesn't need `role="navigation"`. Add roles for older browser support.

---

#### Widget Roles (Interactive Components)
```html
<!-- Tabs -->
<div role="tablist">
  <button role="tab" aria-selected="true" aria-controls="panel1">Tab 1</button>
  <button role="tab" aria-selected="false" aria-controls="panel2">Tab 2</button>
</div>
<div role="tabpanel" id="panel1">Content 1</div>
<div role="tabpanel" id="panel2" hidden>Content 2</div>

<!-- Alert -->
<div role="alert">Your session will expire in 5 minutes.</div>

<!-- Dialog (Modal) -->
<div role="dialog" aria-labelledby="dialog-title" aria-modal="true">
  <h2 id="dialog-title">Confirm Delete</h2>
  <p>Are you sure?</p>
  <button>Cancel</button>
  <button>Delete</button>
</div>
```

---

### ARIA States & Properties

#### Common Attributes

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `aria-label` | Accessible name (overrides visible text) | `<button aria-label="Close dialog">×</button>` |
| `aria-labelledby` | References element for label | `<div aria-labelledby="title">` |
| `aria-describedby` | Additional description | `<input aria-describedby="help-text">` |
| `aria-hidden` | Hides from screen readers | `<div aria-hidden="true">` (decorative) |
| `aria-live` | Announces dynamic changes | `<div aria-live="polite">` |
| `aria-expanded` | Collapsible state | `<button aria-expanded="false">` |
| `aria-pressed` | Toggle button state | `<button aria-pressed="true">` |
| `aria-checked` | Checkbox/radio state | `<div role="checkbox" aria-checked="true">` |
| `aria-disabled` | Disabled state | `<button aria-disabled="true">` |
| `aria-current` | Current item in set | `<a aria-current="page">` |

---

### Live Regions (Dynamic Content)

**Use case:** Screen readers need to announce changes that happen without page reload.

```html
<!-- Politeness levels -->
<div aria-live="polite">Status: Saved</div>
<!-- Waits for user to pause -->

<div aria-live="assertive">Error: Payment failed</div>
<!-- Interrupts immediately -->

<div aria-live="off">This won't announce</div>
<!-- Default, no announcements -->
```

**Best practices:**
- Use `polite` for status messages (form saved, items added)
- Use `assertive` for critical errors (payment failed, session expired)
- Pre-render live region in HTML (don't inject dynamically)
- Keep announcements short (1-2 sentences)

---

## Keyboard Navigation

### Required Keyboard Shortcuts

| Action | Key | Notes |
|--------|-----|-------|
| Navigate forward | `Tab` | Move to next focusable element |
| Navigate backward | `Shift + Tab` | Move to previous element |
| Activate button/link | `Enter` or `Space` | Trigger primary action |
| Close dialog/menu | `Escape` | Exit overlay |
| Toggle checkbox | `Space` | Check/uncheck |
| Select radio button | `Arrow keys` | Move between options in group |
| Navigate dropdown | `Arrow keys` | Move through options |
| Select dropdown option | `Enter` | Choose current option |

**Claude action:** When building interactive components, always test keyboard navigation first.

---

### Focus Management

#### Focus Indicators (Visible)
**WCAG 2.2 requirement:** 2px outline, contrasting color.

```css
/* ❌ Anti-Pattern */
*:focus {
  outline: none; /* Removes indicator */
}

/* ✅ Best Practice */
button:focus-visible {
  outline: 2px solid #0066FF;
  outline-offset: 2px;
}
```

**Focus-visible vs focus:**
- `:focus` - Triggers on both mouse and keyboard
- `:focus-visible` - Only triggers on keyboard (modern browsers)

**Use `:focus-visible` to avoid ugly outlines on mouse clicks while preserving keyboard accessibility.**

---

#### Focus Trapping (Modals)

When a modal opens, focus must:
1. Move to first focusable element inside modal
2. Stay inside modal (no tabbing to background)
3. Return to trigger element when closed

**Implementation (vanilla JS):**
```javascript
const modal = document.querySelector('[role="dialog"]');
const focusableElements = modal.querySelectorAll(
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
);
const firstElement = focusableElements[0];
const lastElement = focusableElements[focusableElements.length - 1];

// Trap focus
modal.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  }
  
  if (e.key === 'Escape') {
    closeModal();
  }
});

// Focus first element
firstElement.focus();
```

**Libraries that handle this:**
- React: `react-focus-lock`, `@radix-ui/react-dialog`
- Vue: `vue-focus-lock`
- Plain JS: `focus-trap`

---

### Skip Links

**Problem:** Keyboard users have to tab through entire navigation on every page.

**Solution:** Skip link at top of page.

```html
<!-- Add as first element in <body> -->
<a href="#main" class="skip-link">Skip to main content</a>

<nav>...</nav>

<main id="main">
  <h1>Page Title</h1>
  ...
</main>
```

**Styling (visible on focus):**
```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

---

## Color & Contrast

### WCAG 2.2 Level AA Requirements

| Content Type | Contrast Ratio | Notes |
|--------------|----------------|-------|
| Normal text (<24px) | 4.5:1 | Body copy, labels |
| Large text (≥24px or ≥19px bold) | 3:1 | Headings, callouts |
| UI components (borders, icons) | 3:1 | Buttons, inputs, focus rings |
| Graphical objects (charts, icons) | 3:1 | Data visualization |

**Testing tools:**
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Coolors Contrast Checker](https://coolors.co/contrast-checker)
- Browser DevTools (Chrome, Firefox)

---

### Color Alone (Insufficient)

**Anti-pattern:** Using only color to convey meaning.

❌ **Bad example:**
```
Success: Green text
Error: Red text
```

✅ **Good example:**
```
Success: Green text + ✓ checkmark icon
Error: Red text + ✗ error icon + "Error:" prefix
```

**Why?** Color-blind users (8% of men, 0.5% of women) may not distinguish red/green.

---


## References
- `references/high-contrast-mode-windows.md` — High Contrast Mode (Windows)
- `references/references.md` — References
- `references/touch-targets-mobile.md` — Touch Targets (Mobile)
