---
name: generate-remotion-videos
description: Create professional broadcast-quality videos using React and Remotion. Generate marketing videos, product demos, tutorials, and social media clips from natural language descriptions. Use when building video content, creating animations, or generating videos programmatically.
version: 1.0.0
license: MIT
compatibility: Claude Code
metadata:
  category: content-generation
  domain: video-production
  complexity: intermediate
---

<objective>
Generate professional videos in 15-45 minutes by combining Remotion (React-based video framework) with Claude Code. Convert natural language video descriptions into production-ready React components that render broadcast-quality MP4s suitable for YouTube, social media, and web distribution without video editing expertise.
</objective>

<quick_start>
**Setup (5 minutes):**
```bash
# 1. Create Remotion project
## Core Workflow


npx create-remotion-app my-video
cd my-video
npm install

# 2. Create context file
echo '# Remotion Context
## Key Points
- Composition: Video container (duration, resolution, fps)
- Sequence: Layer elements over time ranges  
- interpolate(): Animate values between frames
- spring(): Physics-based animations
- 30fps = 30 frames/second, 1 sec = 30 frames' > CLAUDE.md

# 3. Preview
npm run dev  # http://localhost:3000
```

**Generate (2-5 minutes):**

Ask Claude:
```
Create a 30-second marketing video for [product]:
- Hook: [problem/benefit]
- Features: [2-3 key features]
- CTA: [call-to-action]
- Style: [modern/playful/corporate]
- Colors: [primary #hex], [secondary #hex]
```

**Iterate (10-15 minutes):**

Preview in Studio → Ask Claude for refinements → Repeat 2-3 times

**Render (5-10 minutes):**

```bash
npm run build  # Creates out.mp4
```

**Total: 20-45 minutes to broadcast-quality video**
</quick_start>

<success_criteria>
✅ Video renders without errors: `npm run build` succeeds
✅ Professional quality: 48pt+ readable text, smooth animations, good contrast
✅ Correct timing: Each scene visible 1-2 seconds minimum
✅ Proper format: MP4 plays in any video player
✅ Iteration works: Can refine within 5 minutes per cycle
</success_criteria>

<context>

**Remotion fundamentals:**

Remotion treats videos as React components instead of timeline-based editing. You describe videos in code, Claude generates components, you preview in Studio, iterate, then render to MP4.

**Frame-based thinking (critical):**
At 30fps standard:
- 30 frames = 1 second
- 60 frames = 2 seconds
- 300 frames = 10 seconds

This frame system makes animations precise and timing predictable.

**Three implementation approaches:**

1. **Screenshots + Overlays** (fastest 10-15 min): Use product screenshots with animated annotations. Perfect for product demos.

2. **React Components** (medium 20-30 min): Create custom UI components for maximum control over design.

3. **Fully Animated** (slowest 30-45 min): Build everything from scratch with custom animations. Maximum creative freedom.

**Recommendation:** Approach #1 for 80% of use cases — fastest while still professional.

</context>

<workflow>

**Phase 1: Planning** (5 min)
1. Define video type (marketing/demo/tutorial/social)
2. Identify target audience and goal
3. List 2-3 main content points
4. Choose style, tone, brand colors

**Phase 2: Generation** (2-5 min)
1. Gather product information
2. Write Claude prompt (see references/build-marketing-video.md for template)
3. Claude generates complete React component(s)

**Phase 3: Preview** (5-10 min)
1. Run `npm run dev` to open Remotion Studio
2. Watch full preview
3. Check: text readability, timing, animations, colors
4. Note needed changes

**Phase 4: Iteration** (2-3 rounds, 10-15 min)
1. Ask Claude for specific refinements ("Make slower", "Bigger font", etc.)
2. Watch refined version (hot reload)
3. Iterate until satisfied

**Phase 5: Rendering** (5-10 min)
1. Run `npm run build` to export MP4
2. Wait for render
3. Test video in player
4. Upload to platform

</workflow>

<examples>

**Example 1: Marketing video (30 seconds)**

Invoice Pro marketing video for small business owners.

User input:
```
Problem: Manual invoicing wastes 30 minutes per invoice
Solution: AI generates invoices from description in seconds
Features: Auto-generate, payment reminders, analytics
CTA: Start free trial
Colors: Blue #0066FF + white
```

Claude generates:
- Hook animation (text fade-in)
- 3 feature cards (staggered entrance)
- CTA slide (button animation)
- Smooth transitions

Result: Professional 30-second video ready for YouTube/social  
Time: 20 minutes

---

**Example 2: Product demo (60 seconds)**

Zapier workflow demo showing automation in action.

User input: 6 screenshots + 60-second script describing workflow

Claude generates:
- Screenshot sequence with transitions
- Cursor animations showing clicks
- Text annotations highlighting features
- Timing matched to script

Result: Professional 1-minute demo showing product  
Time: 35 minutes

---

**Example 3: Social clip (15 seconds, vertical)**

TikTok clip with bold text and fast cuts.

User input:
```
Duration: 15 seconds
Format: 1080x1920 (vertical)
Style: Bold text animations, fast cuts (2-3 sec per scene)
Music sync markers at key moments
High contrast for mobile
```

Claude generates:
- Full-screen text animations
- Fast scene transitions
- Comments marking music beats
- Vertical format optimized

Result: TikTok-ready 15-second clip  
Time: 12 minutes

</examples>

<anti_patterns>

Hard-coded absolute positioning breaks responsive design. Use flexbox instead.

Animations < 15 frames feel glitchy. Minimum standard fade = 30 frames (1 second).

Text < 48pt unreadable on phones. Always test on actual mobile device.

Static videos bore viewers. Add purposeful motion even if just fade-in.

Animating every element overwhelms. Animate only: entrance, emphasis, CTA.

Creating only YouTube version misses mobile/social platforms. Make 16:9, 1:1, 9:16 variants.

Using CSS animations instead of `interpolate()` causes timing mismatches. Use frame-synced animations only.

Nesting components > 4 levels deep degrades performance. Keep structure flat.

Never testing on actual phone before uploading wastes effort. Mobile first always.

</anti_patterns>

<common_patterns>

**Fade in and hold:**
```javascript
interpolate(frame, [0, 30, 90, 120], [0, 1, 1, 0])
// Fades in (0-30), holds (30-90), fades out (90-120)
```

**Spring entrance:**
```javascript
spring({ frame, from: 0, to: 1, config: Config.BOUNCY, fps })
// Physics-based bouncy motion
```

**Staggered list entrance:**
```javascript
items.map((item, i) => {
  const delay = i * 20;  // 20 frame offset per item
  const opacity = interpolate(frame - delay, [0, 30], [0, 1], 
    { extrapolateLeft: 'clamp' });
  return <div style={{ opacity }}>{item}</div>;
})
```

See references/animation-mastery.md for complete pattern library.

</common_patterns>

<detailed_references>

For step-by-step workflows:
- `references/build-marketing-video.md` — Create 15-60 second promotional videos
- `references/build-product-demo.md` — Generate product feature walkthroughs  
- `references/animation-mastery.md` — Master interpolation and spring physics
- `references/timing-cheatsheet.md` — Frame conversions and composition templates
- `references/anti-patterns.md` — Common mistakes and fixes
- `references/troubleshooting.md` — Diagnose and fix render failures

</detailed_references>

