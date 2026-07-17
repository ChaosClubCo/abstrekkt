---
name: animation-production
description: Master animation production with After Effects workflows, Lottie implementation, CSS animations, and motion design for digital platforms. Use when designing, creating, or reviewing creative deliverables.
---

# Animation Production Skill

## Instructions


> Master animation production with After Effects workflows, Lottie implementation, CSS animations, and motion design for digital platforms.

## Skill Overview

This skill provides expertise in creating animations for digital products and marketing content. It covers motion design principles, tool-specific workflows, and performance-optimized implementation.

## Core Capabilities

### After Effects Production
- Motion graphics
- Compositing
- Character animation
- Template systems
- Rendering pipelines
- Plugin ecosystem

### Lottie Animations
- Bodymovin export
- JSON optimization
- Interactive animations
- Performance tuning
- Platform implementation
- Animation libraries

### CSS Animations
- Keyframe animations
- Transitions
- Performance optimization
- Accessibility considerations
- Progressive enhancement
- Animation libraries

## Motion Design Principles

### Animation Fundamentals
```yaml
animation_principles:
  timing:
    description: "Duration and rhythm of motion"
    guidelines:
      fast: "100-200ms for micro-interactions"
      standard: "200-300ms for UI transitions"
      slow: "300-500ms for emphasis"
      very_slow: "500ms+ for dramatic effect"

  easing:
    description: "Acceleration and deceleration"
    common_curves:
      ease_out: "Starts fast, ends slow (entering)"
      ease_in: "Starts slow, ends fast (exiting)"
      ease_in_out: "Slow start and end (emphasis)"
      linear: "Constant speed (mechanical)"
    custom: "cubic-bezier for brand-specific motion"

  choreography:
    description: "Coordinating multiple elements"
    techniques:
      stagger: "Elements animate in sequence"
      cascade: "Parent to child timing"
      overlap: "Animations slightly overlap"

  continuity:
    description: "Maintaining spatial awareness"
    guidelines:
      - "Elements enter from where they came"
      - "Consistent direction of motion"
      - "Maintain object permanence"
```

### Motion Language
```yaml
motion_vocabulary:
  micro_interactions:
    purpose: "Feedback and affordance"
    examples:
      - Button hover states
      - Toggle switches
      - Loading indicators
      - Form validation
    duration: "100-200ms"

  transitions:
    purpose: "Navigate between states"
    examples:
      - Page transitions
      - Modal open/close
      - Accordion expand
      - Menu reveal
    duration: "200-400ms"

  attention:
    purpose: "Guide focus"
    examples:
      - Notification badges
      - Pulsing elements
      - Bouncing icons
    duration: "1-3 seconds loop"

  storytelling:
    purpose: "Communicate narrative"
    examples:
      - Hero animations
      - Explainer graphics
      - Data visualization
      - Brand moments
    duration: "Variable"
```

## After Effects Workflow

### Project Organization
```yaml
ae_project_structure:
  folder_structure:
    /Project
    ├── /01_Assets
    │   ├── /Images
    │   ├── /Vectors
    │   ├── /Audio
    │   └── /Footage
    ├── /02_Comps
    │   ├── /Precomps
    │   ├── /Main
    │   └── /Exports
    ├── /03_Renders
    │   ├── /WIP
    │   └── /Final
    └── /04_Project_Files
        └── project.aep

  naming_conventions:
    comps: "[Project]_[Type]_[Version]"
    precomps: "PRE_[Description]"
    nulls: "ctrl_[purpose]"
    layers: "Descriptive names, no Layer 1"

  organization_tips:
    - Use composition markers
    - Color code layers
    - Label essential properties
    - Create adjustment layer controllers
```

### Motion Graphics Workflow
```yaml
ae_workflow:
  phase_1_setup:
    activities:
      - Create project structure
      - Import and organize assets
      - Set up compositions
      - Define timing framework

  phase_2_animation:
    activities:
      - Keyframe primary motion
      - Refine timing and easing
      - Add secondary motion
      - Apply effects

  phase_3_refinement:
    activities:
      - Review and adjust
      - Add polish elements
      - Optimize performance
      - Prepare for export

  phase_4_export:
    activities:
      - Render for delivery format
      - Export for Lottie if applicable
      - Create required versions
      - Quality check
```

### Essential Techniques
```yaml
ae_techniques:
  expressions:
    wiggle: "wiggle(frequency, amount)"
    loop: "loopOut('cycle')"
    time_remap: "time * speed"
    random: "random(min, max)"

  effects:
    blur_motion: "Directional Blur + Motion Tile"
    glow: "Inner/Outer Glow or Optical Flares"
    shadows: "Drop Shadow or 3D lighting"
    particles: "CC Particle World or Trapcode"

  optimization:
    precompose: "Group complex elements"
    proxies: "Lower res for preview"
    cache: "Enable disk cache"
    gpu: "Use GPU-accelerated effects"
```

## Lottie Implementation

### Export from After Effects
```yaml
lottie_workflow:
  supported_features:
    shapes:
      - Rectangles, ellipses, paths
      - Fill and stroke
      - Gradients (linear/radial)
      - Trim paths
      - Merge paths

    transforms:
      - Position, scale, rotation
      - Anchor point
      - Opacity
      - Parenting

    effects:
      - Masks (limited)
      - Mattes (limited)
      - Time remapping

  unsupported:
    - Effects (blur, glow, etc.)
    - Expressions (most)
    - 3D layers
    - Video/audio
    - Text (must convert to shapes)

  export_process:
    1: "Install Bodymovin plugin"
    2: "Select composition"
    3: "Configure export settings"
    4: "Render to JSON"
    5: "Optimize output"
```

### Lottie Optimization
```yaml
lottie_optimization:
  file_size:
    target: "<50KB for web icons"
    techniques:
      - Remove unused keyframes
      - Simplify paths
      - Reduce decimal precision
      - Remove hidden layers
      - Merge similar shapes

  performance:
    techniques:
      - Use simple shapes over paths
      - Limit number of layers
      - Avoid complex masks
      - Reduce keyframe density
      - Use solid colors over gradients

  tools:
    lottie_editor:
      url: "https://edit.lottiefiles.com"
      features:
        - Visual editing
        - Color changes
        - Timing adjustment

    lottie_optimizer:
      url: "https://lottiefiles.com/optimize"
      features:
        - Automatic optimization
        - Size reduction
        - Preview
```

### Web Implementation
```javascript
// Using lottie-web
import lottie from 'lottie-web';

const animation = lottie.loadAnimation({
  container: document.getElementById('animation'),
  renderer: 'svg', // 'canvas' or 'html'
  loop: true,
  autoplay: true,
  path: '/animations/loading.json'
});

// Control methods
animation.play();
animation.pause();
animation.stop();
animation.setSpeed(1.5);
animation.goToAndStop(frame, true);
animation.goToAndPlay(frame, true);

// Events
animation.addEventListener('complete', () => {
  console.log('Animation complete');
});

animation.addEventListener('loopComplete', () => {
  console.log('Loop complete');
});
```

```html
<!-- Using dotlottie-player web component -->
<script src="https://unpkg.com/@dotlottie/player-component/dist/dotlottie-player.js"></script>

<dotlottie-player
  src="/animations/hero.lottie"
  background="transparent"
  speed="1"
  style="width: 300px; height: 300px;"
  loop
  autoplay>
</dotlottie-player>
```

## CSS Animations

### Keyframe Animations
```css
/* Define animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Apply animation */
.element {
  animation: fadeIn 0.3s ease-out forwards;
}

/* Multiple properties */
@keyframes slideIn {
  0% {
    opacity: 0;
    transform: translateX(-100%);
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Animation shorthand */
.element {
  animation: slideIn 0.4s ease-out 0.1s 1 forwards;
  /* name | duration | easing | delay | iterations | fill-mode */
}
```

### Transitions
```css
/* Basic transition */
.button {
  background-color: #0066CC;
  transition: background-color 0.2s ease-out;
}

.button:hover {
  background-color: #0052A3;
}

/* Multiple properties */
.card {
  transition:
    transform 0.3s ease-out,
    box-shadow 0.3s ease-out;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

/* Staggered children */
.list-item {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeIn 0.3s ease-out forwards;
}

.list-item:nth-child(1) { animation-delay: 0ms; }
.list-item:nth-child(2) { animation-delay: 50ms; }
.list-item:nth-child(3) { animation-delay: 100ms; }
.list-item:nth-child(4) { animation-delay: 150ms; }
```

### Performance Optimization
```yaml
css_performance:
  prefer:
    - transform (translate, scale, rotate)
    - opacity
    reason: "GPU-accelerated, no layout/paint"

  avoid:
    - width, height
    - top, left, bottom, right
    - margin, padding
    - font-size
    reason: "Trigger layout recalculation"

  techniques:
    will_change:
      usage: "will-change: transform, opacity;"
      caution: "Remove after animation"

    contain:
      usage: "contain: layout;"
      purpose: "Limit repaint scope"

    gpu_layer:
      usage: "transform: translateZ(0);"
      purpose: "Force GPU layer (use sparingly)"
```

### Reduced Motion
```css
/* Respect user preference */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Alternative: essential motion only */
@media (prefers-reduced-motion: reduce) {
  .decorative-animation {
    animation: none;
  }

  .essential-feedback {
    /* Keep but simplify */
    animation-duration: 0.1s;
  }
}
```

## Animation Libraries

### Popular Libraries
```yaml
animation_libraries:
  gsap:
    description: "Professional animation library"
    strengths:
      - Powerful timeline control
      - ScrollTrigger plugin
      - Excellent performance
      - Cross-browser support
    best_for: "Complex web animations"

  framer_motion:
    description: "React animation library"
    strengths:
      - React-native API
      - Gesture support
      - Layout animations
      - Easy to use
    best_for: "React applications"

  animejs:
    description: "Lightweight animation"
    strengths:
      - Small bundle size
      - Simple API
      - SVG support
      - Timeline support
    best_for: "Simpler animations"

  lottie_web:
    description: "After Effects playback"
    strengths:
      - Designer-friendly workflow
      - Complex animations
      - Multiple renderers
    best_for: "After Effects animations"
```

## Integration Points

### Related Skills
- `video-editing` - Motion graphics in video
- `web-production` - Implementation
- `accessibility-design` - Motion accessibility
- `brand-compliance` - Brand motion language

### Delivery Formats
```yaml
export_formats:
  web:
    - Lottie JSON/dotLottie
    - MP4 (background video)
    - WebM (transparency)
    - CSS animations

  social:
    - MP4 (video)
    - GIF (limited use)
    - Platform-specific

  app:
    - Lottie (iOS/Android)
    - Platform-native
```

## Success Metrics

### Animation KPIs
```yaml
metrics:
  performance:
    - Frame rate (60fps target)
    - File size
    - Load time impact

  quality:
    - Brand alignment
    - User feedback
    - Stakeholder approval

  efficiency:
    - Production time
    - Reusability
    - Template adoption
```

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-15 | Motion Team | Initial skill creation |

---

*Use this skill to create engaging, performant animations that enhance user experience across digital platforms.*
