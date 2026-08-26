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

### High Contrast Mode (Windows)

**Problem:** Users with low vision enable high contrast mode, which strips background colors.

**Solution:** Use borders, not just background colors.

```css
/* ❌ Invisible in high contrast */
.button {
  background: #0066FF;
  color: white;
  border: none;
}

/* ✅ Visible in high contrast */
.button {
  background: #0066FF;
  color: white;
  border: 2px solid transparent; /* Creates outline in high contrast */
}
```

---

## Screen Reader Compatibility

### Alt Text (Images)

#### Decision tree:
1. **Decorative image?** → `alt=""` (empty, not omitted)
2. **Informative image?** → Describe content
3. **Functional image (button/link)?** → Describe action
4. **Complex image (chart)?** → Short alt + long description

**Examples:**
```html
<!-- Decorative (purely visual) -->
<img src="divider.png" alt="">

<!-- Informative (photo of person) -->
<img src="jane.jpg" alt="Jane Smith, CEO">

<!-- Functional (icon button) -->
<button>
  <img src="trash.svg" alt="Delete item">
</button>

<!-- Complex (data chart) -->
<img src="sales-chart.png" alt="Sales chart showing 20% increase in Q3" 
     aria-describedby="chart-desc">
<div id="chart-desc">
  Detailed description: Sales increased from $1M in Q2 to $1.2M in Q3...
</div>
```

**Alt text rules:**
- Keep under 150 characters
- Don't start with "Image of..." (redundant)
- Don't include file extension
- If image is also a link, describe destination

---

### Form Labels

**Every input must have a label.**

#### ❌ Anti-Pattern (Placeholder as Label)
```html
<input type="email" placeholder="Enter your email">
```

**Problems:**
- Placeholder disappears on focus
- Screen readers may not announce it
- Low contrast (often gray)

#### ✅ Best Practice (Visible Label)
```html
<label for="email">Email address</label>
<input type="email" id="email" placeholder="name@example.com">
```

---

#### Hidden Labels (If Visual Label Doesn't Make Sense)
```html
<!-- Visually hidden label -->
<label for="search" class="sr-only">Search</label>
<input type="search" id="search" placeholder="Search...">

<!-- Or use aria-label -->
<input type="search" aria-label="Search" placeholder="Search...">
```

**Screen reader only CSS:**
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

### Error Messages

**Requirements:**
1. Identify which field has error
2. Explain what's wrong
3. Suggest how to fix

**Example:**
```html
<label for="password">Password</label>
<input 
  type="password" 
  id="password" 
  aria-invalid="true" 
  aria-describedby="password-error"
>
<div id="password-error" role="alert">
  Password must be at least 8 characters and include one number.
</div>
```

**Announcement:** Screen reader says "Password, invalid, edit text. Password must be at least 8 characters and include one number."

---

### Tables

**Data tables must have headers.**

```html
<table>
  <caption>Q3 Sales by Region</caption>
  <thead>
    <tr>
      <th scope="col">Region</th>
      <th scope="col">Sales</th>
      <th scope="col">Growth</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">North America</th>
      <td>$1.2M</td>
      <td>+15%</td>
    </tr>
  </tbody>
</table>
```

**Key attributes:**
- `<caption>` - Table title (like alt text)
- `scope="col"` - Header applies to column
- `scope="row"` - Header applies to row

**Complex tables:** Use `headers` attribute to link cells to multiple headers.

---

## Touch Targets (Mobile)

### WCAG 2.2 Level AA Requirement
**Minimum size:** 24×24 CSS pixels (44×44px recommended for better UX)

**Why?** Users with motor impairments, tremors, or large fingers need bigger targets.

**Examples:**
- Buttons: Min 44×44px
- Links in paragraphs: Increase padding to 44×44px
- Icons: 24×24px minimum, 44×44px preferred
- Checkboxes/radios: 24×24px touch area (even if visual is smaller)

**Implementation:**
```css
/* Visual size */
button {
  padding: 8px 16px;
  font-size: 14px;
}

/* Touch target size (larger) */
button::before {
  content: '';
  position: absolute;
  top: -10px;
  right: -10px;
  bottom: -10px;
  left: -10px;
}
```

---

## Accessible Components (Patterns)

### Modal Dialog

**Requirements:**
- Focus trap (see earlier section)
- Close on `Escape` key
- Return focus to trigger element
- Disable background scroll
- `aria-modal="true"`
- `aria-labelledby` references title

**HTML structure:**
```html
<button id="open-modal">Open Dialog</button>

<div role="dialog" aria-modal="true" aria-labelledby="dialog-title" hidden>
  <h2 id="dialog-title">Confirm Action</h2>
  <p>Are you sure you want to delete this item?</p>
  <button id="confirm">Delete</button>
  <button id="cancel">Cancel</button>
</div>
```

---

### Dropdown Menu

**Requirements:**
- `aria-haspopup="true"` on trigger
- `aria-expanded` toggles true/false
- Arrow keys navigate options
- `Escape` closes menu
- `Enter` selects option

**HTML:**
```html
<button aria-haspopup="true" aria-expanded="false" aria-controls="menu">
  Options
</button>

<ul id="menu" role="menu" hidden>
  <li role="menuitem"><button>Edit</button></li>
  <li role="menuitem"><button>Delete</button></li>
</ul>
```

---

### Accordion

**Requirements:**
- `aria-expanded` on trigger button
- `aria-controls` links to panel
- `Enter` or `Space` toggles
- `id` on panel for linkage

**HTML:**
```html
<div>
  <h3>
    <button aria-expanded="false" aria-controls="panel1">
      Section 1
    </button>
  </h3>
  <div id="panel1" hidden>
    Content for section 1
  </div>
</div>
```

---

## Testing Strategies

### Manual Testing (Essential)

#### Keyboard-Only Testing
1. Unplug mouse or don't use trackpad
2. Navigate entire site with `Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`, `Arrow keys`
3. Check that all interactive elements are reachable
4. Verify focus indicators are visible

**Time required:** 15-30 minutes per major flow

---

#### Screen Reader Testing

**Tools:**
- **macOS:** VoiceOver (built-in, `Cmd+F5`)
- **Windows:** NVDA (free), JAWS (paid)
- **iOS:** VoiceOver (Settings → Accessibility)
- **Android:** TalkBack (Settings → Accessibility)

**Test checklist:**
- [ ] Page title announced correctly
- [ ] Headings in logical order
- [ ] Form labels announced
- [ ] Button roles announced ("button")
- [ ] Link destinations clear
- [ ] Images have alt text
- [ ] Error messages announced

**Time required:** 30-60 minutes per major flow (if familiar with screen reader)

---

### Automated Testing (Baseline)

#### Browser Extensions
1. **axe DevTools** (Chrome, Firefox) - Best overall
2. **WAVE** (WebAIM) - Visual overlay of issues
3. **Lighthouse** (Chrome DevTools) - Built-in audit

**Usage:**
1. Install extension
2. Navigate to page
3. Run scan
4. Review and fix issues

**Catches:**
- Missing alt text
- Color contrast failures
- Missing form labels
- Invalid ARIA usage
- Heading order issues

**Doesn't catch:**
- Keyboard navigation problems
- Focus order issues
- Unclear alt text (only checks if it exists)
- Logical errors in ARIA

**Coverage:** ~30% of WCAG issues (per Deque research)

---

#### CI/CD Integration

**Tools:**
- **axe-core** (JavaScript library)
- **pa11y** (Command-line tool)
- **Lighthouse CI** (Google)

**Example (axe-core + Jest):**
```javascript
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

test('Button component is accessible', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

**Run on every PR:** Block merge if critical issues found.

---

### Assistive Technology Testing (Advanced)

#### User Testing with Disabled Users
**Best practice:** Hire users with disabilities to test your product.

**Platforms:**
- **Access Works** (user research)
- **Fable** (accessibility testing service)
- **UserTesting** (has accessibility panel)

**Why?** Real users catch issues automated tools and engineers miss (confusing navigation, unclear instructions, etc.).

---

## Accessibility Statement (Legal)

**Required for EU (EAA), US (Section 508), CA (AODA).**

**Template:**
```
Accessibility Statement for [Product Name]

We are committed to ensuring digital accessibility for people with disabilities. 
We are continually improving the user experience for everyone and applying the 
relevant accessibility standards.

Conformance Status:
[Product Name] is partially conformant with WCAG 2.2 Level AA. "Partially conformant" 
means that some parts of the content do not fully conform to the accessibility standard.

Known Issues:
- Video player lacks keyboard shortcuts (planned fix: Q1 2025)
- PDF downloads are not tagged (workaround: contact support for accessible format)

Feedback:
We welcome your feedback on the accessibility of [Product Name]. Please contact us at:
- Email: accessibility@example.com
- Phone: +1-555-0100

This statement was last updated on October 25, 2025.
```

---

## Common Pitfalls

### ❌ Anti-Patterns:
1. **Removing focus outlines** (`outline: none` without replacement)
2. **Using placeholders as labels** (disappears on focus)
3. **Color-only status indicators** (red/green without icons)
4. **Div buttons** (`<div onclick>` instead of `<button>`)
5. **Inaccessible custom components** (reinventing select, checkbox, etc.)
6. **Auto-playing media** (videos, carousels with no pause)
7. **Low contrast text** (gray on white)
8. **Tiny touch targets** (<44px on mobile)

### ✅ Best Practices:
1. **Use native HTML first** (button, select, input)
2. **Test with keyboard only** (no mouse)
3. **Test with screen reader** (VoiceOver, NVDA)
4. **Run automated scans** (axe DevTools) on every page
5. **Write descriptive alt text** (not "image" or "photo")
6. **Provide visible focus indicators** (2px outline)
7. **Label all form inputs** (visible label + `for` attribute)
8. **Use ARIA only when necessary** (prefer semantic HTML)

---

## Claude Workflow Integration

### When User Requests Accessibility Work:

1. **Audit request:**
   - What's the scope? (entire site, one feature, component library)
   - What's the target compliance? (WCAG 2.2 AA, Section 508)
   - What's the timeline? (urgent legal requirement, best practice)

2. **Generate action plan:**
   - Automated scan results (if provided)
   - Manual testing checklist
   - Prioritized issue list (critical → minor)

3. **Provide fixes:**
   - HTML refactoring (semantic elements)
   - ARIA additions (roles, states)
   - CSS improvements (contrast, focus rings)
   - JavaScript enhancements (keyboard nav, focus management)

4. **Testing guidance:**
   - Keyboard testing steps
   - Screen reader testing script
   - Automated testing setup (axe-core integration)

---

## Gaps & Blindspots

### Known Limitations:
- **Cognitive accessibility:** WCAG covers some (plain language, consistent nav), but not all cognitive disabilities
- **Neurodivergence:** ADHD, autism, dyslexia need separate considerations (animation preferences, reading modes)
- **Situational disabilities:** Temporary (broken arm, bright sunlight) not fully addressed
- **Emerging tech:** VR/AR accessibility standards immature (WebXR Device API)
- **AI-generated content:** Alt text quality, bias in synthetic voices

### Unknown Unknowns:
- **Future assistive tech:** Brain-computer interfaces, eye-tracking
- **Legal landscape:** New regulations (EU EAA enforcement in 2025)
- **Automated remediation:** AI tools that "fix" accessibility (often wrong)
- **Accessibility overlays:** Third-party widgets (often cause more harm than good)

---

**Next Steps After Using This Skill:**
1. Run automated scan (axe DevTools) → Identify low-hanging fruit
2. Test keyboard navigation → Fix focus management
3. Audit color contrast → Update design tokens
4. Add ARIA where needed → Don't over-ARIA
5. Test with screen reader → Validate announcements
6. Write accessibility statement → Legal compliance
