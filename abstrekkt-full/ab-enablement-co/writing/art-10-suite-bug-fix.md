# Claude Enablement Suite — Bug Fix & Deployment Guide

> **Bug:** `00-suite-hub.jsx` calls `useState()` inside a `.map()` callback for per-card hover state. This violates React's rules of hooks — hooks must be called in the same order every render, never conditionally or inside loops. Will throw at runtime as soon as the component mounts.
>
> **Fix:** Centralize hover state in a single `useState({})` map keyed by tool ID. Update the JSX to read/write against that map.
>
> **Risk:** Low. Local state change, no API impact, no storage schema impact.

---

## Locating the bug

In the original `00-suite-hub.jsx`, the bug looks like this:

```jsx
{TOOLS.map(tool => {
  const [hovered, setHovered] = useState(false); // ← BUG: hook in .map()
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ borderColor: hovered ? TOKENS.accent : TOKENS.border }}
      ...
    >
      ...
    </div>
  );
})}
```

The `useState` call gets re-instantiated every iteration, breaking React's hook tracking. In dev mode this typically shows up as:

```
Error: Rendered more hooks than during the previous render.
React has detected a change in the order of Hooks called by SuiteHub.
```

In production it can fail silently or produce unpredictable hover behavior.

---

## The fix

Replace the `.map()` block with this pattern:

```jsx
// At the top of the SuiteHub component
const [hoverMap, setHoverMap] = useState({});

const setHover = (id, value) => {
  setHoverMap(prev => ({ ...prev, [id]: value }));
};

// Then in the render
{TOOLS.map(tool => (
  <div
    key={tool.id}
    onMouseEnter={() => setHover(tool.id, true)}
    onMouseLeave={() => setHover(tool.id, false)}
    style={{
      borderColor: hoverMap[tool.id] ? TOKENS.accent : TOKENS.border
    }}
    ...
  >
    ...
  </div>
))}
```

**Why this works:** One hook call (`useState({})`) at the top level of the component. State is keyed by tool ID, so each card's hover is tracked independently without violating hook rules.

**Alternate fix (extract component):** Pull the card into its own component. Each rendered card is its own component instance, so `useState` inside that component is fine. This is the more "React-idiomatic" fix but requires a small refactor.

```jsx
function ToolCard({ tool }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ borderColor: hovered ? TOKENS.accent : TOKENS.border }}
      ...
    >
      ...
    </div>
  );
}

// In SuiteHub:
{TOOLS.map(tool => <ToolCard key={tool.id} tool={tool} />)}
```

Either fix works. The centralized approach is faster to apply; the component extraction is cleaner long-term.

---

## Deployment guide

Once the bug is fixed, the full 8-artifact suite needs a deployment validation pass before going live.

### Pre-deploy checklist

For each of the 8 artifacts:

- [ ] **00-suite-hub.jsx** — bug fixed, hub renders without console errors
- [ ] **01-intake-form.jsx** — saves to `intake-records-v1`, records visible after submit
- [ ] **02-prompt-package-builder.jsx** — loads from `intake-records-v1`, generates 6 prompts via API, saves to `prompt-packages-v1`
- [ ] **03-self-service-guide.jsx** — checkbox state persists to `self-setup-v1`, all 15 steps visible
- [ ] **04-outcome-tracker.jsx** — 6-gate QC checklist works, saves to `outcome-records-v1`
- [ ] **05-accountability-tracker.jsx** — weekly check-in saves to `checkin-records-v1`, per-employee filter works
- [ ] **06-objection-handler.jsx** — preset objections render, custom input works, ⌘↵ shortcut fires
- [ ] **07-program-health-report.jsx** — reads all 4 stores, generates narrative via API, markdown renders cleanly

### Smoke test sequence (do once, end-to-end)

1. **Open suite hub.** Verify all 8 tools listed, all phase filter tabs functional, no console errors.

2. **Run the intake form.** Fill out one fake employee profile. Submit. Verify the record appears in the Records tab.

3. **Open prompt package builder.** Verify the new intake record loads. Click "Generate package." Verify 6 prompts return from the API. Save.

4. **Open self-service guide.** Check off 3 steps. Reload the page. Verify the 3 stay checked.

5. **Open outcome tracker.** Fill out one outcome record with the QC gates. Save. Verify the score calculation is correct.

6. **Open accountability tracker.** Submit one weekly check-in. Verify the confidence bar renders and the record shows in the per-employee view.

7. **Open objection handler.** Click two preset objections, type one custom one. Verify all three return responses from the API.

8. **Open program health report.** Verify it reads from all 4 data stores. Click "Generate report." Verify the narrative returns and renders without breaking the markdown.

9. **Return to suite hub.** Verify the per-tool record counts have updated to reflect the data created in steps 2-8. Click "Notion sync" if Notion is wired up; verify the sync log entry appears.

### What "deployed" means

The 8 artifacts are React JSX files. Deployment options:

**Option A: Claude.ai artifacts** — paste each `.jsx` into a Claude conversation, ask it to render as an artifact. Works for solo use, doesn't share between users.

**Option B: Local Vite/Next dev** — clone the suite, install dependencies, run locally. Works for active development.

**Option C: Production hosting (Vercel/Netlify)** — wrap in a Next.js or Vite app, deploy. Adds auth requirements (`window.storage` is a Claude-specific API; will need replacement with localStorage or a real backend if hosted externally).

**Recommended for first deployment:** Option A. The suite was designed for Claude.ai's artifact environment with the `window.storage` API. Move to Option C only when the workflow is validated.

---

## Post-deploy ops

### What to log after first use

- Which tools got the most usage in the first 7 days
- Any errors surfaced in real use that the smoke test missed
- Any storage size warnings (the 5MB/key limit could become a problem if intake records pile up)

### When to revisit

- If any tool isn't being used at all after 30 days, kill it. Don't maintain dead artifacts.
- If a workflow turns out to need a tool that doesn't exist yet, add it to a v2 backlog rather than retrofitting one of the 8.
- If `window.storage` API changes (Claude.ai is in active development), expect to revisit the storage layer.

---

## Risk notes

**Risk: Storage data is local-only.** Each Claude.ai user has their own `window.storage`. Cross-user data sharing requires the `shared: true` flag (which makes data globally visible) or a real backend. Document this for any user who expects multi-user data flow.

**Risk: API calls cost money.** The prompt package builder, objection handler, and program health report all call the Anthropic API. At low usage this is ~$0.10-$0.50 per session. At high usage it scales linearly. Set monthly budget alerts if deployed to a team.

**Risk: Bug fix introduces regressions.** Test all hover and focus states across all 8 artifacts after the fix lands. The hover bug was isolated to suite-hub but the fix pattern (centralized state) is worth applying anywhere `useState` lives in a `.map()` elsewhere in the codebase.

---

## Acceptance criteria

The suite is deployed and validated when:

- [ ] All 8 artifacts open without console errors
- [ ] The smoke test sequence above runs end-to-end successfully
- [ ] Storage persists across page reloads
- [ ] Hover and focus states behave correctly throughout
- [ ] At least one real user (besides Kyle) has run the intake → prompt package flow successfully

Until those 5 are true, the suite is "built" but not "deployed."
