# FlashFusion — Complete Works (Brand Kit + Multi-Platform Pack)

## 1) Brand Fonts (Recommended)
### Primary pairing (product + marketing)
- **Headlines:** Poppins (300/400/600/700)
- **Body/UI:** Inter (300/400)
- **Optional monospace:** JetBrains Mono (IDs, code blocks, logs)

### Office-safe fallback stacks (Word/PowerPoint/Power Platform)
When Poppins/Inter aren’t installed, use:
- Headings fallback: `Poppins, Segoe UI Variable, Segoe UI, Aptos, Calibri, Arial, sans-serif`
- Body fallback: `Inter, Segoe UI Variable, Segoe UI, Aptos, Calibri, Arial, sans-serif`

### Alternate “more futuristic” heading options (swap Poppins only)
- **Sora** (geometric, clean)
- **Space Grotesk** (tech editorial)
- **Outfit** (friendly futuristic)

## 2) 8 Image Prompts (Brand Image Assets)
Copy/paste each prompt into your image generator.

```txt
1) Brand Hero Background (Landing Page / App Shell)
Create a dark-first futuristic glassmorphism background for “FlashFusion”.
Deep purple-black base (#0f0618), subtle neon purple glow (#a855f7) and rose glow (#f472b6).
Layered translucent panels, soft bokeh particles, minimal circuit-like lines, high-end premium mood.
No text, no logos, no characters. 16:9, ultra clean, high detail, soft lighting, subtle vignette.

2) Logo Mark Exploration (Abstract “F” / Fusion Bolt)
Design an abstract icon for FlashFusion: a minimal “F” formed by two flowing neon strokes that fuse.
Primary stroke purple (#a855f7) and secondary stroke rose (#f472b6) with a subtle glow.
Flat vector style + optional glass highlight, centered on transparent background.
No text. 1:1, crisp edges, modern tech brand mark, scalable.

3) Wordmark Treatment (for later tracing)
Generate a futuristic wordmark reading “FlashFusion” in a geometric sans aesthetic.
Use a subtle gradient from purple (#a855f7) to rose (#f472b6), on dark background (#0f0618).
No extra symbols. Keep kerning premium. 3:1 aspect ratio, clean, high contrast.

4) Seamless Neon Pattern (App background / section divider)
Create a seamless repeating pattern: tiny workflow nodes, arrows, spark-lines, stars.
Low-contrast ink on deep purple-black (#0f0618) with occasional neon accents (#a855f7, #f472b6).
No text. Must tile seamlessly. 1:1 tile, minimal, not noisy.

5) Icon Set Sheet (12 icons)
Create a 3x4 grid of 12 consistent line icons for a creator workflow platform:
workflow, node, trigger, wand, timeline, folder, upload, spark, analytics, collaboration, settings, shield.
Stroke style: 2px neon gradient (purple to rose), on dark background (#0f0618).
No text. 16:9, consistent style, high clarity.

6) Social Banner (X / LinkedIn)
Create a social banner background for FlashFusion. Dark glass panels, neon accent streaks, light particles.
Leave a clear safe zone on the left for a profile circle and on the center for a short tagline.
No text. 3:1 wide banner, premium, minimal, readable negative space.

7) Product Screenshot Frame / Mock Device
Create a sleek UI frame for showcasing product screenshots. Glass edges, subtle neon corners.
Dark base (#0f0618), purple highlight (#a855f7) and rose accent (#f472b6).
No text. 16:9. Center blank area for dropping screenshots later.

8) “Workflow Fusion” Concept Illustration
Illustrate two streams of nodes (left purple, right rose) converging into a single clean pipeline.
Dark background, glassmorphism panels behind, minimal sci-fi vibe, crisp nodes, subtle glow.
No text. 16:9, clean, brand-consistent, not cartoonish.
```

## 3) Microsoft Designer (Quick Recipe)
- Use prompts #1, #6, #7 as starting points.
- Export PNG for web; export SVG only for vector logo mark drafts (then refine in Figma).
- Keep background assets text-free; add text in Designer to maintain crisp typography.

## 4) Power Apps (Model-driven modern theme) — XML Template
Save as `flashfusion-theme.xml` and upload as a web resource (Data/XML). Then point **Custom theme definition** to it.

```xml
<CustomTheme
  basePaletteColor="#A855F7"
  lockPrimary="true"
  font="'Poppins', 'Segoe UI', sans-serif"
>
  <AppHeaderColors
    background="#0F0618"
    foreground="#F3E8FF"
    backgroundHover="#1A0F2E"
    foregroundHover="#F3E8FF"
    backgroundPressed="#2D1B47"
    foregroundPressed="#F3E8FF"
    backgroundSelected="#1A0F2E"
    foregroundSelected="#F3E8FF"
  />
</CustomTheme>
```

## 5) Power Pages — Custom CSS (Upload via Styling workspace)
Create `flashfusion-brand.css` and upload it. Keep it lightweight (<1MB). Do NOT replace Bootstrap.

```css
/* FlashFusion Power Pages Brand Layer */
:root{
  --ff-primary: #a855f7;
  --ff-secondary: #f472b6;
  --ff-bg: #0f0618;
  --ff-surface: #1a0f2e;
  --ff-text: #f3e8ff;
  --ff-border: rgba(168,85,247,0.18);
}

body{
  background: var(--ff-bg);
  color: var(--ff-text);
  font-family: Inter, Segoe UI, Arial, sans-serif;
}

a{ color: var(--ff-primary); }
a:hover{ color: #c084fc; }

.btn-primary{
  background: var(--ff-primary);
  border-color: var(--ff-primary);
  box-shadow: 0 0 18px rgba(168,85,247,0.25);
}
.btn-primary:hover{
  background: #9333ea;
  border-color: #9333ea;
}

.card, .panel{
  background: rgba(26,15,46,0.82);
  border: 1px solid var(--ff-border);
  backdrop-filter: blur(14px);
  border-radius: 12px;
}

.form-control:focus{
  border-color: var(--ff-primary);
  box-shadow: 0 0 0 0.2rem rgba(168,85,247,0.25);
}
```

## 6) Power Automate — Adaptive Card Template (Teams)
Use as a starting point for “post adaptive card” flows.

```json
{
  "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
  "type": "AdaptiveCard",
  "version": "1.5",
  "body": [
    {
      "type": "Container",
      "style": "emphasis",
      "items": [
        { "type": "TextBlock", "text": "FlashFusion", "weight": "Bolder", "size": "Large", "color": "Light" },
        { "type": "TextBlock", "text": "Approval requested", "spacing": "None", "isSubtle": true, "color": "Light" }
      ]
    },
    {
      "type": "Container",
      "items": [
        { "type": "TextBlock", "text": "Workflow:", "weight": "Bolder" },
        { "type": "TextBlock", "text": "${workflowName}", "wrap": true },
        { "type": "TextBlock", "text": "Requested by:", "weight": "Bolder", "spacing": "Medium" },
        { "type": "TextBlock", "text": "${requester}", "wrap": true }
      ]
    }
  ],
  "actions": [
    { "type": "Action.Submit", "title": "Approve ✅", "data": { "action": "approve" } },
    { "type": "Action.Submit", "title": "Reject ❌", "data": { "action": "reject" } }
  ]
}
```

## 7) Gemini “Super Gems” / AI mini-apps (Instruction Blocks)
Use these as the instruction text when creating Gems/mini-apps.

### 7A) Gem: FlashFusion Brand Guardian
```txt
You are the FlashFusion Brand Guardian.
Non-negotiables:
- Primary: #a855f7, Secondary: #f472b6, Dark BG: #0f0618, Light Text: #f3e8ff
- Fonts: Poppins for headings, Inter for body (fallback to Segoe UI)
- Style: dark-first, glassmorphism, neon accents, premium, minimal
Rules:
- For any content, output: (1) final asset, (2) usage notes, (3) accessibility check.
- Reject any palette drift. If user requests off-brand colors, propose closest on-brand alternative.
- Keep CTAs short and action-oriented.
Deliverables you can produce:
- Landing page sections, product UI copy, ad creatives text, icon labels, workflow naming systems.
```

### 7B) AI mini-app/workflow: “Marketing Asset Pack Generator”
```txt
Build a mini-app that takes: product feature name, audience, channel (X/LinkedIn/email), and generates:
- 3 headline options
- 3 subhead options
- 1 CTA set (primary/secondary)
- 1 short description (<= 280 chars)
Must stay in FlashFusion brand voice and colors.
```

## 8) Custom GPT (ChatGPT) — Builder Instructions
Paste into the GPT “Instructions” field.

```txt
Role: FlashFusion Brand System Copilot.
Mission: generate brand-consistent UI copy, design tokens, marketing assets, and enforce consistency.

Brand constants:
- Primary #a855f7, Secondary #f472b6, Dark BG #0f0618, Light Text #f3e8ff
- Typography: Poppins headings, Inter body
- Aesthetic: dark-first glassmorphism, neon accents, premium minimal

Behavior:
- Always output structured sections: Output, Variations, Implementation Notes, Accessibility.
- Never invent new colors. If asked, propose closest existing token.
- When generating UI, provide Tailwind classes using the token variables.
- When uncertain, ask for the target surface (web/app/email/slide) and output size.

If knowledge files are provided:
- Prefer them over general knowledge. Quote token names and file names.
```

## 9) Vibecode Builders (Loveable / Base44 / Replit) — Prompts
### 9A) Loveable prompt
```txt
Build a FlashFusion dark-first SaaS app shell (Next.js + Tailwind + shadcn/ui).
Use CSS variables for shadcn theme tokens:
primary=#a855f7, secondary=#f472b6, background dark=#0f0618, foreground=#f3e8ff.
Typography: Poppins headings, Inter body.
Include: top nav, sidebar, dashboard cards with glassmorphism, button variants, forms, toast alerts, and a dark/light toggle.
Add a /theme page that renders all tokens, components, and accessibility contrast notes.
```

### 9B) Base44 prompt
```txt
Generate a production-ready React dashboard UI kit for FlashFusion.
Dark-first glass UI, neon accents (purple/rose).
Include components: Button, Card, Input, Select, Toast, Tabs, Badge, Modal, Table.
Export a tokens file and a theme switcher.
Ensure contrast >= 4.5:1 for body text in both themes.
```

### 9C) Replit prompt
```txt
Scaffold a Next.js app with TypeScript, Tailwind, and shadcn/ui.
Create src/index.css shadcn HSL vars for FlashFusion (primary #a855f7, secondary #f472b6, dark bg #0f0618, text #f3e8ff).
Add a token-driven theme system and a CI script that fails if tokens drift.
Include Playwright smoke tests for theme toggle and key components rendering.
```
