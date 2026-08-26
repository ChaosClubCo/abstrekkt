---
name: remotion-skill-intinc
description: AI-powered video generation with Remotion, Sora 2 clips, Gemini metadata, and Lambda rendering for 5-30 minute compositions. Includes AppSec guardrails, cost tracking, and audit trails for enterprise teams. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Remotion Skill for Enterprise Video Generation

## Overview

This skill teaches Claude Code how to build **professional video compositions** using Remotion—a React-based framework for programmatic video generation. It covers five key domains:

1. **Fundamentals**: Composition structure, animations, asset imports
2. **Long-form patterns**: 20-30 minute videos via chunked Lambda rendering
3. **AI integrations**: Sora 2 video clips, Gemini metadata/SFX generation
4. **Performance & cost**: Lambda memory optimization, per-team quotas
5. **Enterprise safety**: Audit trails, rate limiting, cost attribution, error handling

**Best for**: Building video generation pipelines, interactive video composers, embedding video tools in apps, automated B2B video creation (demo videos, employee engagement content, marketing clips).

---

## When to Use This Skill

✓ Building or editing Remotion compositions (`.tsx` files)  
✓ Rendering videos with `remotion render` or Remotion Lambda  
✓ Integrating Sora 2 clips into video projects  
✓ Analyzing video metadata with Gemini API  
✓ Configuring Lambda for parallel rendering (20-30 min videos)  
✓ Implementing rate limits, cost tracking, audit logging  
✓ Debugging render failures and optimizing performance  

✗ Do NOT use this skill for: Video editing (Adobe, DaVinci), video hosting (YouTube, Vimeo), real-time streaming

---

## Core Concepts

### 1. Compositions: The Blueprint

A **composition** is a Remotion video project—a React component that describes what to render, how long it runs, and at what resolution.

```typescript
// Minimal composition
import { Composition } from 'remotion';

export const MyVideo: React.FC = () => (
  <div style={{ 
    width: '100%', 
    height: '100%', 
    background: 'linear-gradient(90deg, #1a1a2e 0%, #16213e 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 48,
    color: 'white'
  }}>
    Hello Video
  </div>
);

export const Root = () => (
  <Composition
    id="MyVideo"
    component={MyVideo}
    durationInFrames={150}  // 5 seconds at 30fps
    fps={30}
    width={1920}
    height={1080}
  />
);
```

**Key properties:**
- `durationInFrames`: Total frames (duration = frames ÷ fps)
- `fps`: 24, 25, 30, or 60 (standard for video)
- `width` / `height`: Resolution (1920x1080 for 1080p, 1280x720 for 720p)
- `defaultProps` (optional): Dynamic inputs (props schema)

### 2. Animations: Frame-Driven Motion

Remotion animations **must be driven by `useCurrentFrame()`**—CSS animations cause flickering during rendering. Use `interpolate()` and `spring()` to create smooth, predictable motion.

```typescript
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const FadeInScale: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Fade in from frame 0 to frame 30 (1 second at 30fps)
  const opacity = interpolate(frame, [0, 30], [0, 1], { 
    extrapolateRight: 'clamp' 
  });
  
  // Scale: spring animation with bounce
  const scale = spring({
    frame,
    fps,
    from: 0.5,
    to: 1,
    config: { damping: 10, mass: 1, overshootClamping: false },
    delay: 15  // Start after 0.5 seconds
  });
  
  return (
    <div style={{
      opacity,
      transform: `scale(${scale})`,
      fontSize: 48,
      textAlign: 'center'
    }}>
      Animated Text
    </div>
  );
};
```

**Three core interpolation patterns:**
- **Linear**: Constant speed (e.g., slide across screen)
- **Spring**: Natural, bouncy motion (e.g., scale-in effect)
- **Custom curve**: Easing functions (ease-in, ease-out)

### 3. Assets: Importing Media

Import images, videos, audio, and fonts. For **long-form video**, use `<OffthreadVideo>` instead of `<Html5Video>` for memory efficiency and frame accuracy.

```typescript
import { Img, OffthreadVideo, Audio } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';

const { fontFamily } = loadFont();

export const VideoWithAssets: React.FC<{ clips: string[] }> = ({ clips }) => (
  <div style={{ fontFamily, width: '100%', height: '100%' }}>
    {/* Background image */}
    <Img src="background.png" style={{ position: 'absolute', width: '100%', height: '100%' }} />
    
    {/* Video clip (from Sora 2 or local) */}
    {clips.map((clipUrl, i) => (
      <OffthreadVideo
        key={i}
        src={clipUrl}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        pauseWhenBuffering
      />
    ))}
    
    {/* Audio track */}
    <Audio src="background-music.mp3" startFrom={0} />
  </div>
);
```

### 4. Long-Form Pattern: Chunked Rendering (20-30 Minutes)

For videos longer than 5 minutes, **chunk rendering with Remotion Lambda**. The Lambda invokes multiple workers in parallel, each rendering ~4-6 seconds, then stitches the final MP4.

```typescript
// Configuration for 30-minute video
import { renderMediaOnLambda } from '@remotion/lambda';

const renderLongVideo = async (compositionId: string, clips: string[]) => {
  const result = await renderMediaOnLambda({
    serveUrl: process.env.REMOTION_SERVE_URL!,
    composition: compositionId,
    codec: 'h264',
    framesPerLambda: 150,      // ~5 sec per chunk at 30fps
    memorySizeInMb: 3009,      // 3 vCPUs for Lambda
    diskSizeInMb: 10240,       // 10GB for final concatenation
    audioCodec: 'mp3',         // Faster than AAC
    inputProps: { clips },
    maxRetries: 3
  });
  
  return result.outputUrl;  // S3 URL to final MP4
};
```

**Key parameters for long-form:**
- `framesPerLambda`: 120-180 (lower = more parallelism, higher = less cost)
- `memorySizeInMb`: 1769 (min, for small clips), 3009 (recommended)
- `diskSizeInMb`: 10240 (10GB, supports ~2 hour Full HD)

### 5. Sora 2 Integration: Asset Pipeline

Import video clips generated by Sora 2 API. Upload to S3, then reference in compositions.

```typescript
import { OffthreadVideo, Sequence } from 'remotion';

export const SoraVideoSequence: React.FC<{ 
  clips: Array<{ s3Url: string; durationInFrames: number }> 
}> = ({ clips }) => (
  <Sequence durationInFrames={clips.reduce((sum, c) => sum + c.durationInFrames, 0)}>
    {clips.map((clip, i) => (
      <Sequence key={i} durationInFrames={clip.durationInFrames}>
        <OffthreadVideo src={clip.s3Url} />
      </Sequence>
    ))}
  </Sequence>
);
```

### 6. Gemini Integration: Metadata & SFX Generation

Use Gemini API to analyze Sora clips and generate metadata (scene descriptions, SFX recommendations, captions).

```typescript
import { useCurrentFrame, interpolate } from 'remotion';

// Example: SFX metadata from Gemini
interface ClipMetadata {
  timestamps: Array<{ time: number; event: string; sfx?: string }>;
  captionText?: string;
  mood: 'upbeat' | 'calm' | 'dramatic';
}

export const VideoWithSFX: React.FC<{ metadata: ClipMetadata }> = ({ metadata }) => {
  const frame = useCurrentFrame();
  
  // Render captions at the right time
  const currentCaption = metadata.timestamps.find(
    ts => frame >= ts.time && frame < ts.time + 30
  );
  
  return (
    <div>
      {currentCaption?.captionText && (
        <div style={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: 24,
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '10px 20px'
        }}>
          {currentCaption.captionText}
        </div>
      )}
    </div>
  );
};
```

---

## Enterprise Safety Guardrails

### Rate Limiting & Cost Attribution

**Why**: Prevent runaway API costs. Sora 2 and Gemini APIs can cost $0.30-0.50/second and $0.30/1K tokens respectively.

```typescript
// Example: Rate limit check before rendering
const canRender = await checkRateLimit({
  userId: 'eng-kyle-123',
  teamId: 'intinc-platform',
  service: 'remotion-lambda',
  maxRendersPerDay: 5,
  maxCostPerMonth: 5000
});

if (!canRender.allowed) {
  throw new Error(
    `Rate limit exceeded: ${canRender.reason}. ` +
    `Current cost: $${canRender.currentCost}/${canRender.monthlyBudget}`
  );
}
```

**See rules/security.md** for complete Redis-based rate limiter implementation.

### Audit Logging

Log all render jobs, API calls, and cost attribution.

```typescript
// Log render initiation
await logAuditTrail({
  action: 'render_started',
  userId: 'eng-kyle-123',
  teamId: 'intinc-platform',
  compositionId: 'q4-summary-video',
  estimatedDurationSeconds: 1800,
  estimatedCost: '$150',
  timestamp: new Date().toISOString()
});
```

---

## Error Handling Pattern: Cause → Fix → Retry

**All errors follow this pattern:**

```
Cause:    What went wrong? (specific, measurable)
Fix:      How do we recover? (actionable step)
Retry:    Can user retry? Will exponential backoff work?
```

**Example: Lambda timeout**

```
Cause: Remotion Lambda render exceeded 15-minute timeout
       (likely due to slow S3 downloads or oversized assets)

Fix:   1. Reduce framesPerLambda from 180 to 120 (more parallel chunks)
       2. Enable CloudFront for S3 clip distribution (~3x faster)
       3. Optimize video codec (use H.264 instead of VP9)
       4. Retry with: renderMediaOnLambda({ ..., maxRetries: 3 })

Retry: Yes, exponential backoff: 1s → 2s → 4s → 8s (capped at 60s)
       Success rate: ~95% after 2nd retry
```

---

## Rules Reference

This skill includes 18 domain-specific rules (see `rules/` directory):

### Fundamentals
- `rules/compositions.md` — Structure, props, default values, dynamic metadata
- `rules/animations.md` — useCurrentFrame, interpolate, spring, timing
- `rules/assets.md` — Images, videos, fonts, Sora 2 asset pipeline
- `rules/audio.md` — Audio import, trimming, syncing, volume control

### Long-Form & Performance
- `rules/long-form.md` — 20-30 minute video patterns, chunking strategies
- `rules/lambda-rendering.md` — Lambda config, memory/disk sizing, cost estimation
- `rules/performance.md` — Memory optimization, asset caching, rendering bottlenecks
- `rules/error-handling.md` — Cause → Fix → Retry patterns, debugging

### Integrations
- `rules/sora-2-integration.md` — Sora API, asset import, clip duration validation
- `rules/gemini-metadata.md` — Video analysis, SFX generation, caption embedding
- `rules/security.md` — Rate limiting, cost attribution, audit logging, RLS

### Design & Content
- `rules/transitions.md` — Scene transitions, timing, TransitionSeries
- `rules/charts-data.md` — Data visualization, bar charts, pie charts
- `rules/text-typography.md` — Text measurement, fitting, overflow handling
- `rules/accessibility.md` — WCAG 2.1, captions, color contrast

### Advanced
- `rules/3d-webgl.md` — Three.js integration, WebGL, useCurrentFrame requirements
- `rules/testing.md` — Jest patterns, composition testing, mocking Lambda
- `rules/troubleshooting.md` — Common errors, solutions, debug checklist

---

## Quick Start

### 1. Install in a Remotion project

```bash
bun create video my-video
cd my-video

# Add this skill
npx skills add remotion-dev/remotion-skill-intinc
# or: bunx skills add remotion-dev/remotion-skill-intinc

# Restart Claude Code to load the skill
```

### 2. In Claude Code, describe what you want

```
/render Create a 2-minute intro video with:
- Dark gradient background (#1a1a2e → #16213e)
- Text animation: "Welcome to Intinc" fades in, scales up
- 30fps, 1920x1080
- Use Sora clip "office-montage" as background
```

Claude will now:
- ✓ Generate composition TSX
- ✓ Reference this skill for patterns
- ✓ Use `useCurrentFrame()` for animations (no CSS animation shortcuts)
- ✓ Import assets correctly (OffthreadVideo for long-form)
- ✓ Warn if render might exceed rate limits

### 3. Run locally

```bash
npm run dev          # Open Remotion Studio at localhost:3000
npm run build        # Build to MP4 locally (ffmpeg required)
npm test             # Run Jest tests
```

### 4. Render at scale (Lambda)

```bash
# Use Claude MCP to trigger Lambda render
claude -p "Render q4-summary with Lambda, S3 export, cost tracking"

# Or direct API
curl -X POST https://your-mcp-gateway/render \
  -H "Authorization: Bearer $CLAUDE_MCP_TOKEN" \
  -d '{"compositionId":"q4-summary","outputS3":"s3://videos/q4-summary.mp4"}'
```

---

## Skill Activation

This skill activates when you:
- Use keywords: `"remotion"`, `"video composition"`, `"render"`, `"sora clip"`, `"gemini metadata"`
- Edit files: `*.remotion.ts`, `composition.tsx`, `remotion.config.ts`
- Use slash commands: `/render`, `/compose`, `/video`

---

## Gaps & Unknowns

**What this skill does NOT cover:**
- ✗ Real-time streaming (use FFmpeg + Node.js server)
- ✗ Video hosting (use YouTube, Vimeo, Cloudflare Stream)
- ✗ Interactive editing UI (out of scope; see Phase 2 for interactive composer)
- ✗ Sora 3 (not yet in public API; will update when released)
- ✗ Multi-GPU rendering (Remotion Lambda on AWS; custom infrastructure needed)

**Assumptions (verify with your team):**
- You have AWS account + S3 buckets (for asset storage)
- You have OpenAI API key (Sora 2) and Google API key (Gemini)
- You're rendering videos 5-30 min long (not 1-2 hours)
- Team size: 50-200 engineers (rate limiting configured for this scale)

**What's missing in Remotion itself:**
- No native Sora 2 integration (you write the asset pipeline)
- No built-in rate limiting (implement with Redis or custom middleware)
- Lambda rendering only; no Docker/local parallelization
- Audio sync can be tricky with OffthreadVideo (test early, test often)

---

## Next Steps

1. **Install and test** (Phase 1 complete)
2. **Build wrapper skill** (Phase 2): Templates, components, reusable patterns
3. **MCP server** (Phase 3): Render orchestration, CLI, cost tracking dashboard
4. **Interactive composer** (Phase 4): Next.js UI for video building
5. **Intinc governance** (Phase 5): Rate limits, audit logging, team quotas

---

## Support & Feedback

- **Bug report**: Describe error + composition code
- **Feature request**: Use `/skills feedback` (Claude Code)
- **Performance question**: Check `rules/performance.md` and `rules/troubleshooting.md`

---

## License & Attribution

Built on [Remotion](https://remotion.dev/) (MIT License). Extended with enterprise patterns for Intinc Platform Engineering.

Version: 1.0.0  
Updated: January 2026
