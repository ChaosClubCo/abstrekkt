# Plan: AI Onboarding Flow

## Context

FlashFusion has a full app shell (`/app/*`) but drops new users directly into the Dashboard with no orientation. The goal is a first-run onboarding experience that:
- Matches the existing cyberpunk/neon aesthetic (--ff-* tokens, Space Mono font, neon glows)
- Guides users through personalization, connecting a service, picking a workflow template, and configuring their AI model
- Stores completion in `localStorage` so it only runs once
- Ends with the Dashboard fully populated with their choices

---

## Approach: Full-screen Overlay in Root.tsx

A `<OnboardingOverlay>` component mounts inside `Root.tsx` and checks `localStorage.getItem('ff_onboarded')` on mount. If absent, it renders on top of the app (z-index 60, above NavBar at 50) as a full-screen dark overlay. On completion it writes the flag and unmounts — no route change needed, no router dependencies.

**Why overlay vs. route:**
- Avoids a `/app/onboarding` redirect that breaks deep links
- Lets the Dashboard render underneath (visible through a subtle blur), giving a sense of "the app is right there"
- Simpler state — single boolean in Root state

---

## 5-Step Flow

| Step | Title | Content |
|------|-------|---------|
| 1 | **Welcome** | Name input + use-case selector (4 options: AI Workflows, Code Automation, Data Pipelines, Team Docs) |
| 2 | **Connect** | Grid of 6 integration cards (GitHub, Notion, Slack, Linear, Stripe, Claude). User picks ≥1 to "connect" (optimistic UI) |
| 3 | **First Workflow** | 4 animated template cards: GitHub→Slack, Form→Notion, Stripe→Email, AI Doc Generator. User picks one |
| 4 | **AI Model** | Default model selector (Claude Haiku, Sonnet 4.6 ★recommended, Opus) + token budget slider (50K–10M) |
| 5 | **Launch** | Summary card of choices + "Launch FlashFusion →" button with neon pulse; calls `onComplete()` |

---

## Visual Design

Reuse existing patterns:
- **Background**: `--ff-void` (#03000a) with existing `.ff-noise` class for texture, same as landing page
- **Progress bar**: top-edge line that fills left-to-right across steps (like BootScreen's `ff-boot-fill`)
- **Step transitions**: `ff-fade-up` keyframe (opacity 0→1, translateY +30→0) on each new step
- **Card hover**: same neon border + `--ff-glow-sm` box-shadow pattern used throughout ff/ components
- **Typography**: Syncopate for step headings, Space Mono for labels/hints, Syne for body
- **Accent elements**: `--ff-neon` (#bf00ff) for active states, progress, and the final CTA
- **Step counter**: top-right corner HUD-style tag (reuse `.ff-hud-tag` class from flashfusion.css)

---

## Files to Create / Modify

### New file
**`src/app/components/OnboardingOverlay.tsx`**
- Self-contained component (~350 lines)
- Props: `onComplete: () => void`
- State: `step` (1–5), per-step form values (name, useCase, integrations[], template, model, budget)
- Each step rendered as a `<StepPanel>` sub-component with `ff-fade-up` CSS animation on mount
- Uses `key={step}` on the panel div to re-trigger the animation on step change
- No external deps beyond lucide-react icons and existing CSS vars

### Modified files

**`src/app/components/Root.tsx`**
- Add `const [onboarded, setOnboarded] = useState(() => !!localStorage.getItem('ff_onboarded'))`
- Import and render `<OnboardingOverlay onComplete={() => { localStorage.setItem('ff_onboarded', '1'); setOnboarded(true); }} />` when `!onboarded`

**`src/app/components/NavBar.tsx`** — no changes needed (z-index 50 will be covered by overlay at 60)

---

## Step Component Sketch

```tsx
// Each step wrapped in:
<div key={step} style={{ animation: "ff-fade-up 0.45s ease both" }}>
  ...step content...
</div>

// Progress indicator (top edge):
<div style={{ position: "absolute", top: 0, left: 0, height: 2,
  width: `${(step / 5) * 100}%`,
  background: "linear-gradient(90deg, #7b00ff, #bf00ff, #e040fb)",
  transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: "var(--ff-glow-sm)" }} />

// Step counter (top-right):
<div className="ff-hud-tag" style={{ top: "1.5rem", right: "2rem" }}>
  <span>STEP {step} / 5</span>
</div>
```

---

## localStorage Key

`ff_onboarded` — set to `"1"` on completion. Can be cleared in Settings > Profile to re-trigger (future sprint).

---

## Verification

1. Open app at `/app` in a fresh browser session (no localStorage)
2. Onboarding overlay should appear immediately over the (blurred) Dashboard
3. Complete all 5 steps — verify transitions animate, choices are tracked
4. On step 5 "Launch", verify overlay unmounts and Dashboard is fully visible
5. Hard-refresh — verify overlay does NOT appear again (localStorage flag persists)
6. Open DevTools → Application → localStorage → delete `ff_onboarded` → refresh → overlay reappears
