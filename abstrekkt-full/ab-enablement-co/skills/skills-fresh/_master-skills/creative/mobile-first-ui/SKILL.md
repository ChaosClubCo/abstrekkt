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

#### Card List (Android)
- Cards in vertical list
- Elevation: 1dp
- Corner radius: 12dp
- Padding: 16dp
- Gap between cards: 8dp

---

### 4. Navigation

#### Bottom Tab Bar (iOS)

**Design specs:**
- 5 tabs maximum (4 ideal, 5th is "More")
- Icon + label (both always visible)
- Active state: Filled icon, system blue
- Inactive state: Outline icon, gray

**Example:**
```
[Home icon]  [Search icon]  [+]  [Likes icon]  [Profile icon]
   Home         Explore     Post     Activity      Profile
```

---

#### Bottom Navigation Bar (Android)

**Design specs:**
- 3-5 destinations
- Active state: Filled icon, label, primary color
- Inactive state: Outline icon, no label (compact), gray

**Behavior:**
- Icons animate on switch (scale + color)
- Ripple effect on tap

---

### 5. Modals & Dialogs

#### Alert Dialog (iOS)

**Structure:**
- Title (17pt, semibold)
- Message (13pt, regular)
- Buttons: 1-2 actions (Cancel + Confirm)

**Button placement:**
- 2 buttons: Cancel (left), Confirm (right)
- 1 button: Centered (OK, Dismiss)

**Example:**
```
┌─────────────────────┐
│  Delete Item?       │
│                     │
│  This action cannot │
│  be undone.         │
│                     │
│  [Cancel] [Delete]  │
└─────────────────────┘
```

---

#### Dialog (Android)

**Types:**
- **Basic:** Title, text, buttons
- **Full-screen:** Entire screen, close button top-right
- **Bottom sheet:** Slides up from bottom

**Button placement:**
- Right-aligned: Cancel (left), Confirm (right)
- Confirm button is filled (high emphasis)

---

### 6. Loading States

#### Spinners
**iOS:** `UIActivityIndicatorView` (circular spinner)  
**Android:** `CircularProgressIndicator` (M3)

**Placement:**
- Center of screen (full-page load)
- Inside button (inline action)
- Bottom of list (infinite scroll)

---

#### Skeleton Screens

**Better UX than spinners:** Show content shape while loading.

**Example (Twitter feed):**
```
┌──────────────────┐
│ ●●●●  ████       │ ← Avatar + name placeholder
│       ████       │
│ ██████████████   │ ← Tweet text placeholder
│ ██████████       │
└──────────────────┘
```

**Benefits:**
- Perceived performance (feels faster)
- No jarring blank → content shift

---

#### Pull-to-Refresh

**Behavior:**
1. User pulls down at top of list
2. Spinner appears above first item
3. Release to trigger refresh
4. Spinner animates while loading
5. New content slides in

**iOS API:** `UIRefreshControl`  
**Android API:** `SwipeRefreshLayout`  
**Web:** Custom JS (no native API)

---

## Mobile Performance Optimization

### 1. Image Optimization

#### File Formats:
- **WebP:** 25-35% smaller than JPEG (95% browser support)
- **AVIF:** 50% smaller than JPEG (80% support, use with fallback)

#### Compression:
- JPEG: 80-85% quality (visually lossless)
- PNG: Use TinyPNG, ImageOptim
- SVG: Minify with SVGO

#### Responsive Images:
```html
<img 
  src="image-800w.webp" 
  srcset="
    image-400w.webp 400w,
    image-800w.webp 800w,
    image-1200w.webp 1200w
  "
  sizes="(max-width: 640px) 100vw, 50vw"
  alt="Product photo"
  loading="lazy"
>
```

**Lazy loading:** `loading="lazy"` defers offscreen images.

---

### 2. Code Splitting (JavaScript)

**Problem:** Sending entire app bundle upfront (slow on mobile).

**Solution:** Load only what's needed, defer the rest.

**Techniques:**

**Route-based splitting (React):**
```javascript
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./Home'));
const About = lazy(() => import('./About'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  );
}
```

**Result:** `/about` code only loads when user navigates there.

---

### 3. Caching Strategies

#### Service Worker (PWAs)
**Cache-first strategy:** Serve from cache, update in background.

```javascript
// service-worker.js
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

**Benefits:**
- Offline support
- Instant load on repeat visits

---

#### HTTP Caching
**Headers:**
```
Cache-Control: public, max-age=31536000, immutable
```

**Use for:** Static assets (CSS, JS, images with hashed filenames)

---

### 4. Reduce Network Requests

**Techniques:**
- **Inline critical CSS:** First paint styles in `<head>`
- **Defer non-critical JS:** `<script defer>` or `<script async>`
- **Combine icons into sprite sheet:** One SVG with multiple symbols
- **Use icon fonts:** Single request for all icons (if not using SVG)

---

## Mobile-Specific Features

### 1. Biometric Authentication

**Face ID (iOS) / Face Unlock (Android):**
- Use for login, payment confirmation
- Fallback: Passcode / PIN

**Touch ID (iOS) / Fingerprint (Android):**
- Same use cases as Face ID

**Web API:** `navigator.credentials.get()` (WebAuthn)

**UX:**
- Don't require every time (remember login for 30 days)
- Provide "Skip" option
- Explain why biometric is needed (security)

---

### 2. Push Notifications

**Use cases:**
- Transactional: "Your order shipped"
- Engagement: "New message from [Friend]"
- Re-engagement: "You haven't opened the app in 7 days"

**Best practices:**
- Request permission at relevant moment (not on launch)
- Explain value: "Get notified when someone likes your post"
- Allow granular control (Settings → Notifications → Categories)

**Frequency limits:**
- Transactional: No limit (user-triggered)
- Marketing: Max 1-2 per week (unsubscribe rate increases)

---

### 3. Offline Mode

**Approaches:**

**1. Offline-first (PWA):**
- Cache all content locally
- Sync changes when online
- Show cached version instantly

**2. Offline indicator:**
- Gray banner: "You're offline. Some features unavailable."
- Queue actions (e.g., "Like" saves locally, syncs when online)

**Examples:**
- Google Docs (offline editing)
- Twitter (read cached timeline)
- Spotify (downloaded playlists)

---

### 4. Camera & Media

**Use cases:**
- Profile photo upload
- Document scanning
- QR code scanning
- Video recording

**HTML input (simplest):**
```html
<input type="file" accept="image/*" capture="camera">
```

**Native APIs:**
- **iOS:** `UIImagePickerController`, `AVFoundation`
- **Android:** `Camera2 API`, `CameraX`

**Permissions:** Request camera access with clear reason ("Take a profile photo").

---

## Testing Mobile UIs

### 1. Device Testing

**Essential devices:**
- **Small phone:** iPhone SE (4.7"), Android <6" (320px width)
- **Standard phone:** iPhone 14 Pro (6.1"), Pixel 7 (6.3")
- **Large phone:** iPhone 14 Pro Max (6.7"), Samsung S23 Ultra (6.8")
- **Tablet:** iPad (10.2"), iPad Pro (12.9"), Android tablet

**Why multiple sizes?** Text overflow, button clipping, layout breaking.

---

### 2. Emulators & Simulators

**iOS Simulator (Xcode):**
- Free, Mac only
- Accurate for layout, less so for performance

**Android Emulator (Android Studio):**
- Free, all platforms
- Slower than real device

**Browser DevTools:**
- Chrome: Device mode (Cmd+Shift+M)
- Firefox: Responsive design mode
- **Limitation:** Doesn't test native features (camera, notifications)

---

### 3. Real User Conditions

**Test with:**
- **Slow network:** Chrome DevTools → Network throttling (3G)
- **Interruptions:** Incoming call while using app
- **Low battery mode:** iOS reduces animations, Android dims screen
- **Dark mode:** Test both light and dark themes
- **Large text:** Accessibility → Text size (iOS/Android settings)

---

### 4. Automated Testing

**Tools:**
- **Appium:** Cross-platform mobile test automation
- **Detox (React Native):** E2E testing
- **Espresso (Android):** Native UI testing
- **XCUITest (iOS):** Native UI testing

**Example (Detox):**
```javascript
describe('Login flow', () => {
  it('should login successfully', async () => {
    await element(by.id('email-input')).typeText('user@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();
    await expect(element(by.id('home-screen'))).toBeVisible();
  });
});
```

---

## Mobile Design Checklist

### UX:
- [ ] Primary actions in thumb zone (bottom 1/3 of screen)
- [ ] Touch targets ≥44×44pt/dp/px
- [ ] Gestures have button alternatives (accessibility)
- [ ] Loading states visible (spinners, skeletons)
- [ ] Offline mode or clear offline indicator
- [ ] Haptic feedback for key interactions

### Performance:
- [ ] Images optimized (WebP, lazy loading)
- [ ] Code split by route (lazy load)
- [ ] LCP <2.5s, FID <100ms, CLS <0.1
- [ ] Service worker caching (PWA)
- [ ] Network requests <50 (initial load)

### Platform:
- [ ] Follows iOS HIG or Material Design guidelines
- [ ] Dark mode support (semantic colors)
- [ ] Dynamic Type / font scaling (accessibility)
- [ ] Correct keyboard types (email, tel, number)
- [ ] Biometric authentication option

### Testing:
- [ ] Tested on physical devices (iPhone, Android)
- [ ] Tested portrait AND landscape
- [ ] Tested with large text size (accessibility)
- [ ] Tested with slow network (3G throttling)
- [ ] Tested with interruptions (incoming call)

---

## Common Pitfalls

### ❌ Anti-Patterns:
1. **Desktop UI on mobile** (tiny buttons, hover-only interactions)
2. **No offline support** (blank screen when network fails)
3. **Fixed headers blocking content** (keyboard pushes content up)
4. **Modal on modal** (confusing navigation stack)
5. **Auto-playing video** (data usage, battery drain)
6. **Ignoring platform conventions** (iOS gestures on Android)

### ✅ Best Practices:
1. **Thumb-friendly layout** (bottom navigation, large buttons)
2. **Progressive enhancement** (core features work offline)
3. **Clear visual hierarchy** (most important thing is obvious)
4. **Fast initial load** (<2s LCP)
5. **Native look and feel** (follow platform guidelines)
6. **Accessibility baked in** (VoiceOver, TalkBack support)

---

## Claude Workflow Integration

### When User Requests Mobile UI Design/Development:

1. **Clarify platform:**
   - Native app (iOS, Android, React Native)?
   - Web app (PWA, responsive site)?
   - Hybrid (Electron, Capacitor)?

2. **Recommend patterns:**
   - Navigation: Bottom tab bar vs navigation drawer
   - Actions: Floating action button vs bottom sheet
   - Forms: Native inputs vs custom components

3. **Generate code:**
   - Platform-specific (Swift, Kotlin, React Native)
   - Responsive CSS (if web)
   - Accessibility markup (ARIA, semantic HTML)

4. **Performance guidance:**
   - Image optimization strategy
   - Code splitting plan
   - Caching configuration

---

## Gaps & Blindspots

### Known Limitations:
- **Foldable devices:** Galaxy Fold, Surface Duo (different interaction models)
- **Wearables:** Apple Watch, Wear OS (tiny screens, glanceable UI)
- **In-car displays:** CarPlay, Android Auto (driving safety constraints)
- **5G adoption:** Not universal, still optimize for 4G/LTE
- **Browser differences:** Safari vs Chrome on mobile (WebKit vs Blink)

### Unknown Unknowns:
- **Emerging form factors:** AR glasses, rollable screens
- **AI assistants:** Siri, Google Assistant (voice-first UI)
- **Gestural evolution:** New interaction patterns (eye tracking, mid-air gestures)
- **Regulation impact:** App store policies, privacy laws (GDPR, CCPA)

---

**Next Steps After Using This Skill:**
1. Choose platform → iOS, Android, or web?
2. Study guidelines → HIG or Material Design
3. Design thumb-friendly layout → Bottom navigation, large buttons
4. Implement performance optimization → Image compression, code splitting
5. Test on real devices → iPhone, Android, tablets
6. Measure Core Web Vitals → LCP, FID, CLS
