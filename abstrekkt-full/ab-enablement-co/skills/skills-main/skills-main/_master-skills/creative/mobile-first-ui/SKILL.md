---
name: mobile-first-ui
description: Comprehensive guide to designing and building mobile-optimized interfaces following iOS and Android platform guidelines, touch interaction patterns, and performance best practices. Use when designing, creating, or reviewing creative deliverables.
---

# Mobile-First UI Skill

## Overview
Comprehensive guide to designing and building mobile-optimized interfaces following iOS and Android platform guidelines, touch interaction patterns, and performance best practices for 2025.

---

## When to Use This Skill
- Designing native mobile apps (iOS, Android)
- Building progressive web apps (PWAs)
- Optimizing web apps for mobile browsers
- Creating responsive designs with mobile priority
- Implementing mobile-specific features (gestures, haptics, biometrics)

---

## Mobile-First Philosophy

### Core Principles

#### 1. Constraints Breed Focus
**Mobile forces you to prioritize.**

**Exercise:** If you can only show 3 things on screen, what are they?
- Primary action (e.g., "Add to cart")
- Core content (e.g., product photo, price)
- Navigation (e.g., back button, menu)

**Result:** Cleaner desktop UI (because you already did the hard work of prioritization)

---

#### 2. Touch-First, Not Mouse-First
**Design for thumbs, not cursors.**

**Differences:**
- **Touch:** Imprecise (finger is 44×44px), no hover state
- **Mouse:** Precise (1×1px), hover for tooltips/previews

**Impact:**
- Larger buttons (44×44px minimum)
- Visible labels (no hover-only text)
- Bottom navigation (thumb-friendly)

---

#### 3. Performance is UX
**Mobile users are on slow networks (3G, LTE with weak signal).**

**Metrics:**
- **LCP (Largest Contentful Paint):** <2.5s
- **FID (First Input Delay):** <100ms
- **CLS (Cumulative Layout Shift):** <0.1

**Techniques:**
- Lazy load images
- Code splitting (load only what's needed)
- Compress assets (WebP, Brotli)

---

## Platform Guidelines

### iOS (Human Interface Guidelines)

#### Key Principles:
1. **Clarity:** Text legible, icons precise, functions obvious
2. **Deference:** Content takes center stage, UI recedes
3. **Depth:** Layers and motion convey hierarchy

**Resources:** [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/)

---

#### Navigation Patterns:

**1. Tab Bar (Bottom Navigation)**
- **Use:** 3-5 top-level sections
- **Placement:** Bottom of screen (thumb zone)
- **Active state:** Icon + label in tint color
- **Example:** Instagram, Twitter, Apple Music

**Design specs:**
- Height: 49pt (iPhone) / 65pt (iPad)
- Icons: 25×25pt (30×30pt active)
- Labels: SF Pro Text, 10pt

---

**2. Navigation Bar (Top Bar)**
- **Use:** Hierarchical navigation (drill-down)
- **Placement:** Top of screen
- **Elements:** Back button, title, actions (right side)
- **Example:** Settings app, Mail

**Design specs:**
- Height: 44pt (standard) / 96pt (large title)
- Title: SF Pro Display, 17pt (regular) / 34pt (large)
- Back button: Chevron + previous screen title

---

**3. Modal Sheets**
- **Use:** Focused task (compose, filter, settings)
- **Gesture:** Swipe down to dismiss
- **Sizes:** Full-screen, large, medium, automatic

**Design specs:**
- Corner radius: 10pt (top corners)
- Handle: 36×5pt, centered, gray
- Padding: 16-20pt

---

#### Typography (San Francisco Font):

**Text styles:**
- **Large Title:** 34pt, bold (navigation bar)
- **Title 1:** 28pt, regular (page headers)
- **Title 2:** 22pt, regular (section headers)
- **Title 3:** 20pt, regular (subsections)
- **Headline:** 17pt, semibold (emphasis)
- **Body:** 17pt, regular (content)
- **Callout:** 16pt, regular (secondary content)
- **Subheadline:** 15pt, regular (captions)
- **Footnote:** 13pt, regular (fine print)
- **Caption 1:** 12pt, regular (image captions)
- **Caption 2:** 11pt, regular (smallest text)

**Dynamic Type:** Respect user's text size preference (Settings → Display & Brightness → Text Size)

---

#### Colors (Dark Mode Support):

**System colors adapt automatically:**
- `systemBackground` → White (light), Black (dark)
- `label` → Black (light), White (dark)
- `systemBlue` → #007AFF (light), #0A84FF (dark)

**Design implication:** Don't hardcode colors. Use semantic tokens.

---

### Android (Material Design 3)

#### Key Principles:
1. **Material:** Surface and shadow convey depth
2. **Bold:** Vibrant colors, large imagery, intentional typography
3. **Motion:** Responsive, natural transitions

**Resources:** [Material Design 3](https://m3.material.io/)

---

#### Navigation Patterns:

**1. Bottom Navigation Bar**
- **Use:** 3-5 top-level destinations
- **Placement:** Bottom of screen
- **Active state:** Icon filled, label shows
- **Example:** Google Photos, YouTube, Gmail

**Design specs:**
- Height: 80dp (landscape: 56dp)
- Icons: 24×24dp
- Labels: Roboto, 12sp

---

**2. Navigation Rail (Tablet/Desktop)**
- **Use:** Same as bottom nav, but for larger screens
- **Placement:** Left edge
- **Layout:** Vertical list of icons

---

**3. Top App Bar**
- **Use:** Screen title, actions, navigation
- **Types:** Center-aligned (M3), Small, Medium, Large
- **Elements:** Nav icon (back), title, actions (right)

**Design specs:**
- Height: 64dp (small) / 112dp (medium) / 152dp (large)
- Title: Roboto, 22sp (small) / 24sp (medium) / 28sp (large)

---

**4. Navigation Drawer (Side Menu)**
- **Use:** More than 5 destinations, or grouped navigation
- **Gesture:** Swipe from left edge
- **Placement:** Overlays content, slides in from left

**Design specs:**
- Width: 256dp (phone) / 360dp (tablet)
- List items: 56dp height
- Icons: 24×24dp

---

#### Typography (Roboto / Google Sans):

**Type scale:**
- **Display Large:** 57sp (hero text)
- **Display Medium:** 45sp
- **Display Small:** 36sp
- **Headline Large:** 32sp (page headers)
- **Headline Medium:** 28sp
- **Headline Small:** 24sp
- **Title Large:** 22sp (prominent titles)
- **Title Medium:** 16sp (medium emphasis)
- **Title Small:** 14sp (low emphasis)
- **Body Large:** 16sp (long-form content)
- **Body Medium:** 14sp (default body)
- **Body Small:** 12sp (dense text)
- **Label Large:** 14sp (buttons)
- **Label Medium:** 12sp (tabs)
- **Label Small:** 11sp (small buttons)

---

#### Elevation (Shadows):

**Material surfaces cast shadows based on elevation.**

**Levels:**
- Level 0: 0dp (flat, no shadow)
- Level 1: 1dp (cards, raised buttons)
- Level 2: 3dp (FAB resting)
- Level 3: 6dp (FAB raised, app bars)
- Level 4: 8dp (navigation drawer)
- Level 5: 12dp (dialogs, pickers)

**Dark mode adjustment:** Lighter surface color at higher elevation (not darker shadows)

---

## Touch Interaction Patterns

### 1. Touch Targets

**WCAG 2.2 Level AA:** 24×24px minimum  
**iOS HIG:** 44×44pt recommended  
**Android Material:** 48×48dp recommended

**Why different?**
- iOS: Points (pt) scale with device DPI
- Android: Density-independent pixels (dp) do the same
- Web: CSS pixels (px) don't scale automatically

**Design rule:** Use 44×44 units (pt/dp/px) for all interactive elements.

---

### 2. Thumb Zones

**Mobile screens have 3 zones:**

1. **Green (easy):** Bottom third, center
2. **Yellow (stretch):** Middle area
3. **Red (hard):** Top corners, far edges

**Implication:**
- Primary actions → Bottom (green zone)
- Secondary actions → Top (red zone)
- Navigation → Bottom (tab bar) or top (back button)

**Examples:**
- Instagram: Post, search, profile at bottom
- Twitter: Tweet button (floating, bottom-right)
- Gmail: Compose button (bottom-right)

---

### 3. Gestures

#### Standard Gestures (Platform-wide):

**iOS:**
- **Swipe right:** Back (navigation)
- **Swipe down:** Dismiss modal
- **Pinch:** Zoom in/out (maps, images)
- **Long press:** Context menu

**Android:**
- **Swipe up:** Home (gesture nav)
- **Swipe from left edge:** Back
- **Pinch:** Zoom in/out
- **Long press:** Context menu

**Custom gestures:**
- **Swipe to delete:** Mail apps (swipe left on list item)
- **Pull to refresh:** Social feeds (swipe down at top)
- **Swipe between tabs:** Photo galleries (horizontal swipe)

**Accessibility note:** Provide button alternatives for gestures (some users can't perform complex gestures).

---

### 4. Haptic Feedback

**Use cases:**
- **Success:** Light tap (payment confirmed)
- **Warning:** Medium tap (low battery)
- **Error:** Strong tap (payment failed)
- **Selection:** Subtle tick (scrolling through picker)

**iOS API:** `UIImpactFeedbackGenerator`, `UINotificationFeedbackGenerator`  
**Android API:** `VibrationEffect`, `HapticFeedbackConstants`  
**Web API:** `navigator.vibrate()` (limited support)

**Best practice:** Use sparingly. Overuse is annoying.

---

## Mobile UI Components

### 1. Buttons

#### Primary Button (High Emphasis)
**iOS:** Filled, rounded corners (10pt), system blue  
**Android:** Filled tonal button, 100dp corner radius (fully rounded)

**Specs:**
- **iOS:** Min height 44pt, padding 16pt horizontal
- **Android:** Min height 48dp, padding 24dp horizontal

**Accessibility:** Must have 44×44 touch target even if visual is smaller.

---

#### Secondary Button (Medium Emphasis)
**iOS:** Outlined, system blue border  
**Android:** Outlined button, 1dp border

---

#### Text Button (Low Emphasis)
**iOS:** No border, system blue text  
**Android:** Text button, no border

---

### 2. Forms

#### Text Input
**iOS:**
- Border radius: 10pt
- Padding: 12pt vertical, 16pt horizontal
- Border: 1pt solid (gray → blue on focus)

**Android:**
- Outlined text field (M3)
- Border radius: 4dp (top)
- Label floats above input on focus

---

#### Keyboard Types

**Critical for mobile:** Use correct input type to trigger appropriate keyboard.

**HTML input types:**
```html
<input type="text">       <!-- Default keyboard -->
<input type="email">      <!-- @ and .com keys -->
<input type="tel">        <!-- Numeric dial pad -->
<input type="number">     <!-- Numbers + symbols -->
<input type="url">        <!-- .com and / keys -->
<input type="search">     <!-- Search button -->
<input type="date">       <!-- Date picker -->
```

**Native APIs:**
- **iOS:** `UIKeyboardType` (`.emailAddress`, `.numberPad`, `.URL`)
- **Android:** `android:inputType` (`textEmailAddress`, `phone`, `number`)

---

#### Error States

**Requirements:**
- Red border or underline
- Error icon (❌ or ⚠️)
- Error message below field
- `aria-invalid="true"` for screen readers

**Example (iOS Mail):**
```
Email address
[invalid-email-example] ❌
Please enter a valid email address.
```

---

### 3. Lists

#### Standard List (iOS)
- Row height: 44pt (standard) / 60pt+ (custom)
- Separator: 0.5pt hairline
- Disclosure indicator: Chevron right (›)

**Interaction:**
- Tap → Navigate
- Swipe left → Delete / Archive
- Swipe right → Mark as read / Flag

---


## References
- `references/card-list-android.md` — Card List (Android)
- `references/mobile-performance-optimization.md` — Mobile Performance Optimization
- `references/references.md` — References
