# Claude Design Upload Instructions — FlashFusion

## Step 1 — Go to Claude Design
1. Open `claude.ai` → **Design** (lower-left organization picker)
2. Confirm you're in the correct organization scope (don't overwrite your INT design system)
3. Create a new design system → name it **"FlashFusion"**
4. On the onboarding screen → "Tell us about your company and attach any design resources you have"

## Step 2 — Paste this company description first

```
FlashFusion is an AI-powered development platform where ideas become production-ready products. The brand is dark-mode native, electric, and kinetic — premium developer tooling with an anti-slop aesthetic. Target users are senior developers, technical founders, and AI engineers who work at night and care about craft. Visual identity: void-black backgrounds, violet brand primary (#8B5CF6), electric cyan accent (#06B6D4), glassmorphism surfaces, WebGL shader hero treatments. Typography: Poppins for display (weights 600-900), Inter for body (weights 400-700), JetBrains Mono for code. Never light mode. Never generic purple gradients on white. See attached brand guide, typography specimen, color tokens, and code reference.
```

## Step 3 — Upload files in this order

Claude Design extracts in order of upload, so front-load the structured specs:

| Order | File | Purpose |
|---|---|---|
| 1 | `flashfusion-brand-guide.md` | **Single highest-signal asset** — full brand system spec |
| 2 | `flashfusion-typography.md` | Typography specimen (redundant reinforcement, boosts extraction confidence) |
| 3 | `flashfusion-colors.md` | Color tokens specimen |
| 4 | `standalone.html` | Code reference — live CSS variables + Google Fonts imports |
| 5 | `FlashFusionHero.jsx` | React reference — component patterns |
| 6 | `README.md` | Implementation notes + accessibility contract |
| 7 | `ff-fluid-background.png` | Visual reference — liquid violet aesthetic |
| 8 | `ff-worlds-collide.png` | Visual reference — hero composition |
| 9 | `agentic-hero.mp4` | Motion reference — hero atmosphere |
| 10 | `liquid-metal-video_yX6NvjdW.mp4` | Motion reference — fluid kinetic |

**Skip uploading:**
- `Futuristic_AI_Agent_System_Visualization.mp4` — generic stock-y aesthetic, will pollute extraction
- `Video_Generation_From_Robot_Images.mp4` — same reason
- `flashfusion-landing.html` / `flashfusion-landing-v2.html` — older revisions; if either differs meaningfully, upload *one* (the newest) and skip the other

## Step 4 — Wait ~30 minutes for extraction

Per the AI Meets Girlboss guide, Claude Design takes ~30 min to build the initial system.

## Step 5 — Validation prompt

When extraction finishes, paste this in the Claude Design chat:

```
Show me the extracted design system. For each category below, list what you captured:

1. TYPOGRAPHY — font families, weights, and roles (display/body/mono)
2. COLOR PALETTE — every token with hex and role
3. SHADOWS & EFFECTS — glow shadows, borders, backdrop-filter values
4. LAYOUT — max-width, spacing scale, border-radius scale
5. COMPONENTS — button, card, input, nav patterns

Then flag anything missing or uncertain.
```

## Step 6 — Acceptance criteria

The extraction passes if ALL of these are true:

- [ ] **Poppins** listed with weights 600, 700, 800, 900
- [ ] **Inter** listed with weights 400, 500, 600, 700
- [ ] **JetBrains Mono** listed (or acknowledged as monospace role)
- [ ] No "default sans" / "system font" placeholders
- [ ] All 10 color tokens from brand guide present (`--ff-void` through `--ff-text-muted`)
- [ ] Dark-mode recognized as the only mode (no light-mode variants generated)
- [ ] Glassmorphism card pattern identified
- [ ] Brand primary identified as `#8B5CF6` violet, not blue or pink

If any fail → click **Remix** in the top-right of the design system view, paste the failed items, and ask Claude to correct them. Do NOT re-upload the full bundle — that can create duplicate token confusion.

## Step 7 — Publish

Once validated:
1. Toggle **Published: ON**
2. Set as **Default** for new projects in the FlashFusion-scoped org
3. Confirm your INT design system is still Draft/Published in its own scope

---

## Common failure modes

| Symptom | Cause | Fix |
|---|---|---|
| Poppins extracted with only weights 400, 700 | Claude picked up Google Fonts defaults | Remix → "Use weights 600, 700, 800, 900 per brand-guide.md" |
| Inter missing entirely | Only the old `standalone.html` got weighted (the original only loaded Poppins) | Re-upload `flashfusion-typography.md` and `flashfusion-brand-guide.md` via Remix |
| Purple extracted as `#A855F7` instead of `#8B5CF6` | Glow token confused with primary | Remix → "Primary brand fill is `#8B5CF6` (`--ff-primary`). `#A855F7` is the glow accent, not primary" |
| Light-mode variants generated | Default behavior override | Remix → "FlashFusion is dark-mode native. Do not generate light-mode variants" |
| Space Grotesk or Montserrat appears | Stock Claude Design default leaking through | Remix → "Never use Space Grotesk. FlashFusion typography is Poppins + Inter only" |
