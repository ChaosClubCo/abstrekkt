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

#### Cons:
❌ React-only  
❌ Bundle size (~30KB)  
❌ Learning curve

**Example (drag gesture):**
```jsx
import { motion } from 'framer-motion';

<motion.div
  drag
  dragConstraints={{ left: 0, right: 300, top: 0, bottom: 300 }}
  dragElastic={0.1}
  whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Drag me!
</motion.div>
```

**Example (variants for complex states):**
```jsx
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, 
    x: -100,
    transition: { duration: 0.3 }
  }
};

<motion.div
  variants={cardVariants}
  initial="hidden"
  animate="visible"
  exit="exit"
>
  Content
</motion.div>
```

---

### 3. GSAP (GreenSock) (Best for Complex)

#### When to Use:
- Complex timelines (choreography)
- SVG animations (morphing, line drawing)
- Scroll-triggered animations
- Cross-browser consistency
- Framework-agnostic

#### Pros:
✅ Most powerful (timelines, scroll triggers)  
✅ SVG support (morph, draw)  
✅ Plugins (ScrollTrigger, DrawSVG, MorphSVG)  
✅ Framework-agnostic  
✅ Excellent performance

#### Cons:
❌ Imperative API (verbose)  
❌ Commercial license for some plugins  
❌ Steeper learning curve

**Example (timeline sequence):**
```javascript
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Complex timeline
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.section',
    start: 'top center',
    end: 'bottom center',
    scrub: 1, // Ties animation to scroll position
  }
});

tl.from('.title', { opacity: 0, y: 100, duration: 1 })
  .from('.subtitle', { opacity: 0, y: 50, duration: 0.8 }, '-=0.5')
  .from('.cards', { opacity: 0, scale: 0.8, stagger: 0.2, duration: 1 }, '-=0.3');
```

**Example (SVG line drawing):**
```javascript
// Animate SVG path (signature effect)
gsap.from('.svg-path', {
  drawSVG: 0, // Requires DrawSVG plugin
  duration: 2,
  ease: 'power2.inOut'
});
```

---

### 4. Lottie (Best for Illustrations)

#### When to Use:
- Complex illustrations (exported from After Effects)
- Branded animations (designed by motion designers)
- Loading screens, empty states, success confirmations
- Cross-platform (web, iOS, Android)

#### Pros:
✅ Designer-friendly (After Effects workflow)  
✅ Vector-based (scales perfectly)  
✅ Small file size (JSON)  
✅ Cross-platform (web, mobile)  
✅ Interactive (can control playback)

#### Cons:
❌ Requires After Effects export (Bodymovin plugin)  
❌ Complex animations can be large (>100KB)  
❌ Some After Effects features unsupported

**Example (Lottie player):**
```jsx
import Lottie from 'lottie-react';
import loadingAnimation from './loading.json';

function LoadingScreen() {
  return (
    <Lottie
      animationData={loadingAnimation}
      loop={true}
      autoplay={true}
      style={{ width: 200, height: 200 }}
    />
  );
}
```

**Example (interactive control):**
```jsx
import { useRef } from 'react';
import Lottie from 'lottie-react';
import successAnimation from './success.json';

function SuccessMessage() {
  const lottieRef = useRef();
  
  const handleComplete = () => {
    lottieRef.current.goToAndStop(60, true); // Stop at frame 60
  };
  
  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={successAnimation}
      loop={false}
      autoplay={true}
      onComplete={handleComplete}
    />
  );
}
```

**Optimizing Lottie files:**
- Simplify paths in After Effects
- Remove unused layers
- Reduce frame rate (24fps → 12fps for simple animations)
- Compress JSON (use lottie-optimize tool)

---

### 5. Web Animations API (Best for Low-Level Control)

#### When to Use:
- Custom animation engines
- Synchronizing animations with media (audio, video)
- Performance-critical animations
- Framework-agnostic

#### Pros:
✅ Native browser API (no library)  
✅ Programmatic control (play, pause, reverse)  
✅ Synchronizes with browser rendering  
✅ Composable (can combine animations)

#### Cons:
❌ Verbose API  
❌ Browser support (95%+ but polyfill needed for older browsers)  
❌ No timeline abstraction

**Example (Web Animations API):**
```javascript
const element = document.querySelector('.box');

const animation = element.animate(
  [
    { transform: 'translateY(0px)', opacity: 1 },
    { transform: 'translateY(100px)', opacity: 0 }
  ],
  {
    duration: 500,
    easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    fill: 'forwards'
  }
);

// Programmatic control
animation.pause();
animation.play();
animation.reverse();
```

---

## Performance Optimization

### 1. GPU Acceleration

**Use transform and opacity (composited properties):**
```css
/* ✅ GPU-accelerated (fast) */
.element {
  transform: translateX(100px);
  opacity: 0.5;
}

/* ❌ CPU-bound (slow, causes reflow) */
.element {
  left: 100px;
  width: 200px;
}
```

**Why?**
- `transform` and `opacity` trigger composite-only (no layout, paint)
- `left`, `top`, `width`, `height` trigger layout + paint (expensive)

**Force GPU layer (use sparingly):**
```css
.element {
  will-change: transform; /* Hints to browser: this will animate */
}
```

**Cleanup after animation:**
```javascript
element.addEventListener('animationend', () => {
  element.style.willChange = 'auto'; // Release GPU memory
});
```

---

### 2. Reduce Complexity

**Limit concurrent animations:**
- Max 3-5 elements animating simultaneously (UI feels less chaotic)
- Stagger animations (don't start all at once)

**Simplify paths:**
- SVG animations: Reduce path points (use Illustrator's "Simplify" tool)
- Use simpler easing curves (linear, ease-out better than custom cubic-bezier)

**Debounce scroll animations:**
```javascript
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      // Update animation based on scroll position
      updateScrollAnimation();
      ticking = false;
    });
    ticking = true;
  }
});
```

---

### 3. Reduce Motion Support

**CRITICAL: Respect user preference.**

**CSS media query:**
```css
/* Normal animations */
.element {
  transition: transform 300ms ease-out;
}

/* Disable for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  .element {
    transition: none;
  }
  
  /* Or provide simpler alternative */
  .element {
    transition: opacity 200ms ease-out; /* Fade only */
  }
}
```

**JavaScript detection:**
```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Disable animations or use simpler alternatives
  lottiePlayer.setSpeed(0); // Stop Lottie animation
  gsap.globalTimeline.timeScale(0); // Pause all GSAP animations
}
```

**Framer Motion (automatic):**
```jsx
import { motion, useReducedMotion } from 'framer-motion';

function Component() {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
    >
      Content
    </motion.div>
  );
}
```

---

### 4. Performance Monitoring

**Measure frame rate (60fps target):**
```javascript
const stats = new Stats();
document.body.appendChild(stats.dom);

function animate() {
  stats.begin();
  
  // Your animation code
  
  stats.end();
  requestAnimationFrame(animate);
}

animate();
```

**Chrome DevTools Performance tab:**
1. Open DevTools → Performance
2. Start recording
3. Trigger animation
4. Stop recording
5. Look for:
   - Jank (dropped frames, red bars)
   - Long tasks (>50ms)
   - Layout thrashing (purple bars)

**Lighthouse audit:**
- Run Lighthouse → Performance
- Check "Avoid large layout shifts" (CLS)
- Check "Minimize main thread work"

---

## Common Animation Patterns

### 1. Loading States

#### Spinner
```css
.spinner {
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: #0066FF;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

#### Skeleton Screen
```jsx
import { motion } from 'framer-motion';

function SkeletonCard() {
  return (
    <div className="skeleton">
      <motion.div
        className="skeleton-line"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
```

#### Progress Bar
```jsx
<motion.div
  className="progress-bar"
  initial={{ width: '0%' }}
  animate={{ width: `${progress}%` }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
/>
```

---

### 2. Notifications & Toasts

**Slide in from top:**
```jsx
import { motion, AnimatePresence } from 'framer-motion';

<AnimatePresence>
  {showToast && (
    <motion.div
      className="toast"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      Success! Your changes were saved.
    </motion.div>
  )}
</AnimatePresence>
```

**Auto-dismiss:**
```javascript
const [showToast, setShowToast] = useState(false);

const triggerToast = () => {
  setShowToast(true);
  setTimeout(() => setShowToast(false), 3000); // Dismiss after 3s
};
```

---

### 3. Modal Transitions

**Zoom from trigger:**
```jsx
<motion.div
  className="modal"
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 0, opacity: 0 }}
  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
>
  Modal content
</motion.div>
```

**Slide up from bottom:**
```jsx
<motion.div
  className="modal"
  initial={{ y: '100%' }}
  animate={{ y: 0 }}
  exit={{ y: '100%' }}
  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
>
  Modal content
</motion.div>
```

---

### 4. List Animations

**Staggered fade-in:**
```jsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map(item => (
    <motion.li key={item.id} variants={item}>
      {item.text}
    </motion.li>
  ))}
</motion.ul>
```

**Reorder animation:**
```jsx
import { Reorder } from 'framer-motion';

<Reorder.Group values={items} onReorder={setItems}>
  {items.map(item => (
    <Reorder.Item key={item} value={item}>
      {item}
    </Reorder.Item>
  ))}
</Reorder.Group>
```

---

### 5. Scroll Animations

**Fade in on scroll (GSAP):**
```javascript
gsap.from('.card', {
  scrollTrigger: {
    trigger: '.card',
    start: 'top 80%', // When top of card is 80% down viewport
    toggleActions: 'play none none reverse'
  },
  opacity: 0,
  y: 50,
  duration: 0.8
});
```

**Parallax scrolling:**
```javascript
gsap.to('.background', {
  scrollTrigger: {
    trigger: '.section',
    scrub: true
  },
  y: -100 // Background moves slower than content
});
```

---

## Animation Checklist

### Design Phase:
- [ ] Define motion language (easing, durations)
- [ ] Prototype key animations in After Effects/Figma
- [ ] Test animation on target devices (performance)
- [ ] Create Lottie files for complex illustrations
- [ ] Document animation specs (timing, easing, triggers)

### Development Phase:
- [ ] Use GPU-accelerated properties (transform, opacity)
- [ ] Implement reduced-motion support (media query)
- [ ] Optimize Lottie file sizes (<100KB)
- [ ] Test at 60fps (Chrome DevTools Performance)
- [ ] Add loading states (skeletons, spinners)

### QA Phase:
- [ ] Test with reduced-motion enabled
- [ ] Test on low-end devices (throttle CPU in DevTools)
- [ ] Verify no layout shift (CLS < 0.1)
- [ ] Check animation smoothness (no jank)
- [ ] Test with screen readers (animations don't block content)

---

## Common Pitfalls

### ❌ Anti-Patterns:
1. **Animating width/height** (causes layout thrashing)
2. **No reduced-motion support** (accessibility failure)
3. **Overly long animations** (>1s feels slow)
4. **Animating on scroll without debounce** (janky)
5. **Too many concurrent animations** (chaotic UX)
6. **Using JavaScript when CSS is sufficient** (performance)
7. **Forgetting to remove will-change** (GPU memory leak)

### ✅ Best Practices:
1. **Use transform and opacity** (GPU-accelerated)
2. **Respect prefers-reduced-motion** (accessibility)
3. **Keep animations under 500ms** (feels snappy)
4. **Debounce scroll listeners** (requestAnimationFrame)
5. **Stagger multiple animations** (visual hierarchy)
6. **Prefer CSS for simple animations** (performance)
7. **Clean up will-change after animation** (memory)

---

## Tools & Resources

### Design Tools:
- **After Effects** (complex animations, Lottie export)
- **Figma** (simple prototypes, Smart Animate)
- **Principle** (interactive prototypes, mobile focus)
- **ProtoPie** (advanced interactions, conditional logic)

### Development Libraries:
- **Framer Motion** (React, declarative)
- **GSAP** (complex timelines, SVG)
- **Lottie** (After Effects exports)
- **Anime.js** (lightweight alternative to GSAP)
- **Motion One** (lightweight, framework-agnostic)

### Performance Tools:
- **Chrome DevTools Performance** (frame rate, jank)
- **Lighthouse** (CLS, performance score)
- **Stats.js** (FPS counter)
- **WebPageTest** (real-world performance)

### Learning Resources:
- [Material Design Motion](https://m3.material.io/styles/motion/overview)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [GSAP Docs](https://greensock.com/docs/)
- [UI Animation Principles (Issara Willenskomer)](https://uxdesign.cc/the-ultimate-guide-to-proper-use-of-animation-in-ux-10bd98614fa9)

---

## Gaps & Blindspots

### Known Limitations:
- **Physics-based animations:** Complex spring systems (matter.js, cannon.js) not covered
- **WebGL animations:** Three.js, Babylon.js for 3D (separate skillset)
- **Game engines:** Unity, Unreal for interactive experiences
- **Video integration:** Synchronized video + animation (complex)
- **Audio-reactive animations:** Waveform visualizations (Web Audio API)

### Unknown Unknowns:
- **AI-generated animations:** Quality, controllability
- **Future CSS features:** View Transitions API maturity
- **Performance on new devices:** Foldables, AR glasses
- **Emerging interaction patterns:** Spatial computing (Vision Pro)

---

**Next Steps After Using This Skill:**
1. Define motion language → Easing, durations, signature effects
2. Choose implementation stack → CSS, Framer Motion, GSAP, or Lottie
3. Build animation library → Reusable components (buttons, modals, toasts)
4. Test performance → 60fps on target devices, reduced-motion support
5. Document patterns → Motion design system in Figma/Storybook
