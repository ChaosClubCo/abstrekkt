---
name: animation-motion-design
description: Comprehensive motion design guide covering animation principles, Lottie, Framer Motion, GSAP, performance optimization, and accessibility. Provides production-ready patterns for micro-interactions, transitions, choreography, and branded motion languages following 2025 best practices. Use when designing, creating, or reviewing creative deliverables.
---

# Animation & Motion Design Skill

## Overview
Comprehensive guide to animation systems, motion design principles, and performance-optimized implementation using Lottie, Framer Motion, GSAP, and CSS animations. Covers 2025 best practices for meaningful motion that enhances UX without sacrificing performance.

---

## When to Use This Skill
- Designing micro-interactions (button states, loading indicators)
- Building animation systems for design systems
- Creating branded motion languages
- Implementing complex transitions and choreography
- Optimizing animation performance (60fps target)
- Supporting reduced-motion accessibility

---

## Motion Design Principles

### 12 Principles of Animation (Disney, adapted for UI)

#### 1. Timing & Spacing
**The soul of animation.**

**Timing:** Duration (how long)  
**Spacing:** Easing (how fast at different points)

**UI application:**
- Fast interactions: 100-300ms (button press, toggle)
- Medium transitions: 300-500ms (panel slide, fade)
- Slow transitions: 500-800ms (page change, hero animation)

**Easing curves:**
```css
/* Ease-out (deceleration): Elements entering screen */
transition: transform 300ms cubic-bezier(0.0, 0.0, 0.2, 1);

/* Ease-in (acceleration): Elements exiting screen */
transition: transform 200ms cubic-bezier(0.4, 0.0, 1, 1);

/* Ease-in-out (symmetrical): Elements moving on screen */
transition: transform 400ms cubic-bezier(0.4, 0.0, 0.2, 1);

/* Spring (bouncy, organic) */
transition: transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

**Material Design easing tokens:**
- `easing-standard`: `cubic-bezier(0.2, 0.0, 0, 1.0)` (most common)
- `easing-emphasized`: `cubic-bezier(0.0, 0.0, 0.2, 1)` (prominent)
- `easing-decelerate`: `cubic-bezier(0.05, 0.7, 0.1, 1.0)` (entering)
- `easing-accelerate`: `cubic-bezier(0.3, 0.0, 0.8, 0.15)` (exiting)

---

#### 2. Squash & Stretch
**Gives weight and flexibility.**

**UI application:**
- Button press: Squash on click (scale-down), bounce back
- Loading spinners: Stretch during rotation
- Emoji reactions: Squash on appear

**Example (button press):**
```css
.button {
  transition: transform 100ms ease-out;
}

.button:active {
  transform: scale(0.95); /* Squash */
}

.button:not(:active) {
  animation: bounce 200ms ease-out;
}

@keyframes bounce {
  0% { transform: scale(0.95); }
  50% { transform: scale(1.05); } /* Stretch */
  100% { transform: scale(1); }
}
```

---

#### 3. Anticipation
**Prepares user for action.**

**UI application:**
- Card hover: Slight lift before full reveal
- Menu open: Button rotates slightly before menu appears
- Swipe gesture: Card moves slightly before full swipe

**Example (menu anticipation):**
```css
.menu-button:hover {
  transform: rotate(-5deg); /* Anticipation */
  transition: transform 100ms ease-out;
}

.menu-button.open {
  transform: rotate(90deg); /* Action */
  transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

#### 4. Follow-Through & Overlapping Action
**Parts move at different rates.**

**UI application:**
- Modal open: Background fades, then content slides in
- Menu items: Stagger animation (each item delays slightly)
- Page transition: Header exits first, content follows

**Example (staggered list):**
```css
.list-item {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 300ms ease-out forwards;
}

.list-item:nth-child(1) { animation-delay: 0ms; }
.list-item:nth-child(2) { animation-delay: 50ms; }
.list-item:nth-child(3) { animation-delay: 100ms; }
.list-item:nth-child(4) { animation-delay: 150ms; }

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

#### 5. Arc Motion
**Natural movement follows curved paths.**

**UI application:**
- Floating action button (FAB): Expands in arc
- Tooltip: Appears with curved motion
- Drag & drop: Elements follow cursor with slight lag (arc)

**Example (arc motion with Framer Motion):**
```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ x: 0, y: 0 }}
  animate={{ x: 100, y: 50 }}
  transition={{
    type: 'spring',
    stiffness: 100,
    damping: 10,
    // Creates natural arc due to spring physics
  }}
/>
```

---

#### 6. Exaggeration
**Amplify for impact (but don't overdo).**

**UI application:**
- Success animation: Checkmark with burst effect
- Error shake: 3-5 shakes, high amplitude
- Like button: Heart scales 1.5x, then settles at 1.2x

**Example (like button):**
```css
.like-button.active {
  animation: likeAnimation 600ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes likeAnimation {
  0% { transform: scale(1); }
  30% { transform: scale(1.5); } /* Exaggerate */
  100% { transform: scale(1.2); } /* Settle */
}
```

---

#### 7. Secondary Action
**Supporting details enhance main action.**

**UI application:**
- Button click: Main icon scales, background ripple expands
- Toggle switch: Knob slides, background color changes
- Notification: Badge appears, with shadow pulse

**Example (button with ripple):**
```jsx
// Material Design ripple effect
<motion.button
  whileTap={{ scale: 0.95 }} // Main action
  onClick={(e) => {
    // Secondary action: Ripple at click point
    const ripple = document.createElement('span');
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    ripple.className = 'ripple';
    e.currentTarget.appendChild(ripple);
  }}
>
  Click me
</motion.button>
```

---

## Animation Taxonomy

### 1. Micro-Interactions
**Small, functional animations.**

**Types:**
- **Feedback:** Button press, hover state, focus ring
- **State change:** Toggle on/off, checkbox check, radio select
- **Progress:** Loading spinner, skeleton screen, progress bar
- **System status:** Success checkmark, error shake, warning pulse

**Principles:**
- Duration: 100-300ms (fast)
- Triggered by user action
- Clearly communicates state change

---

### 2. Transitions
**Moving between states or screens.**

**Types:**
- **Page transitions:** Fade, slide, scale
- **Modal transitions:** Zoom from trigger, slide up from bottom
- **Navigation transitions:** Swipe between tabs, drill-down hierarchy
- **Content transitions:** Crossfade, morph (shared element)

**Principles:**
- Duration: 300-500ms (medium)
- Maintain spatial relationships (where did it come from?)
- Use shared element transitions when possible

**Shared element transition (Framer Motion):**
```jsx
import { motion } from 'framer-motion';

// Thumbnail view
<motion.img
  layoutId="hero-image"
  src="photo.jpg"
  onClick={() => setExpanded(true)}
/>

// Full-screen view
{expanded && (
  <motion.img
    layoutId="hero-image" // Same ID = shared transition
    src="photo.jpg"
  />
)}
```

---

### 3. Choreography
**Orchestrated sequences of multiple animations.**

**Use cases:**
- Onboarding flows (step 1 → 2 → 3)
- Feature reveals (hero → features → CTA)
- Data loading sequences (skeleton → data → interactions)

**Principles:**
- Tell a story (beginning → middle → end)
- Stagger timing (overlapping, not simultaneous)
- Guide attention (focal point moves logically)

**Example (onboarding sequence with GSAP):**
```javascript
import gsap from 'gsap';

const timeline = gsap.timeline();

timeline
  .from('.step-1', { opacity: 0, y: 50, duration: 0.5 })
  .from('.step-2', { opacity: 0, y: 50, duration: 0.5 }, '-=0.2') // Overlap
  .from('.step-3', { opacity: 0, y: 50, duration: 0.5 }, '-=0.2')
  .from('.cta-button', { scale: 0, duration: 0.3, ease: 'back.out' });
```

---

### 4. Branded Motion
**Signature animations that reinforce brand identity.**

**Elements:**
- Easing curves (e.g., Stripe uses custom spring curves)
- Timing patterns (e.g., Apple's consistent 0.3s duration)
- Motion paths (e.g., Material Design's arc motion)
- Effects (e.g., Airbnb's parallax scrolling)

**Creating a motion language:**
1. Define easing tokens (3-5 curves)
2. Define duration tokens (fast, medium, slow)
3. Define signature effects (e.g., "card lift", "page curl")
4. Document in design system

**Example motion tokens:**
```css
:root {
  /* Durations */
  --duration-instant: 100ms;
  --duration-fast: 200ms;
  --duration-medium: 300ms;
  --duration-slow: 500ms;
  
  /* Easings */
  --ease-out: cubic-bezier(0.0, 0.0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0.0, 1, 1);
  --ease-in-out: cubic-bezier(0.4, 0.0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
}

.button {
  transition: transform var(--duration-fast) var(--ease-out);
}
```

---

## Implementation Techniques

### 1. CSS Animations (Best for Simple)

#### When to Use:
- Hover states, focus rings
- Simple transitions (fade, slide)
- Looping animations (spinners)
- Reduced-motion support (via media query)

#### Pros:
✅ Performant (GPU-accelerated)  
✅ No JavaScript required  
✅ Declarative (easy to read)  
✅ Browser-optimized

#### Cons:
❌ Limited control (no dynamic values)  
❌ No complex sequencing  
❌ Harder to sync with user interactions

**Example (loading spinner):**
```css
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: #0066FF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Respect reduced-motion preference */
@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation: none;
    opacity: 0.5;
  }
}
```

---

### 2. Framer Motion (Best for React)

#### When to Use:
- React applications
- Layout animations (shared elements)
- Gesture-based animations (drag, swipe)
- Declarative, component-based motion

#### Pros:
✅ React-first API  
✅ Automatic layout animations  
✅ Gesture detection built-in  
✅ Server-side rendering support  
✅ Variants for state-based animations


## References
- `references/cons.md` — Cons:
- `references/performance-optimization.md` — Performance Optimization
- `references/references.md` — References
