# FlashFusion UI Image Prompt Library (Context Engineered)

This library is optimized for:
- General image generation tools (for brand assets)
- **Google Stitch** (text-to-UI + code, export to Figma) — use as prompt payloads

## Global Brand Constraints (prepend to any prompt)
- Dark-first, premium glassmorphism
- Background #0f0618, text #f3e8ff
- Accents: primary #a855f7, secondary #f472b6
- Rounded corners 16–24px, subtle glows, restrained particles
- Typography: headings Poppins, body Inter
- WCAG AA contrast (avoid low-contrast body text)

---

## A) UI Backgrounds / Surfaces (Image tools)
1) **Hero background 16:9**
Create a dark futuristic glassmorphism background. Deep purple-black base, layered translucent panels, subtle neon streaks, sparse particles, cinematic lighting. No text.

2) **Section divider pattern (tile 1:1)**
Seamless micro-pattern of workflow nodes and arrows, low contrast on dark base with rare neon accents. No text.

3) **Screenshot frame 16:9**
Glass bezel frame with neon corner accents, empty center area for screenshot placement. No text.

---

## B) Logo / Icon Assets (Image tools)
4) **Abstract “F” mark (1:1 transparent)**
Minimal fused neon strokes forming an F, purple + rose, subtle glow, vector look, crisp edges. No text.

5) **Icon sheet (3x4, 12 icons)**
Line icons: workflow, node, trigger, wand, timeline, folder, upload, spark, analytics, collaboration, settings, shield. Neon gradient stroke. No text.

---

## C) Google Stitch Prompts (UI generation)
Stitch turns text prompts (and optionally reference images) into UI designs and frontend code, with copy-to-Figma/export workflows.

### Stitch Prompt Template (use for any screen)
**App concept:** FlashFusion — AI workflow orchestration for creators  
**Platform:** web app (desktop-first)  
**Style:** dark-first glassmorphism, neon accents purple/rose  
**Typography:** Poppins headings, Inter body  
**Layout:** 12-column responsive grid, generous spacing, crisp hierarchy  
**Components:** shadcn-style buttons/inputs, glass cards, neon focus rings  
**Accessibility:** WCAG AA contrast, visible focus states  

#### 1) Landing page (hero + sections)
Generate a premium landing page for FlashFusion. Include: top nav, hero with headline + CTA, feature cards, workflow illustration section, testimonials, pricing preview, footer. Use dark glass panels, neon accents only for CTAs and highlights.

#### 2) Creator dashboard (overview)
Generate a dashboard showing: project list, recent runs, token usage/cost widget, alerts, quick actions. Left sidebar nav. Main content uses glass cards with subtle borders.

#### 3) Workflow builder screen
Generate a builder UI: node canvas area, left tool palette, right properties inspector. Provide play/run controls, run logs, and a “publish” action. Emphasize clarity, spacing, and subtle glow focus.

#### 4) AI HUD overlay (TESSA-style)
Generate an AI assistant HUD overlay: chat panel, tool status chips, model selector, cost meter, and “actions executed” timeline. Glass surfaces with neon outline focus.

#### 5) Auth screen
Generate a sign-in/sign-up screen with a simple, premium layout. Minimal distractions. Clear error states and password rules. Dark background with subtle glow.

#### 6) Billing/Plans
Generate a pricing + billing management screen with plan cards, current plan badge, usage graph, invoices list, payment method management. Strong contrast for text.

#### 7) Settings (profile + security)
Generate a settings screen with tabs: Profile, Team, API Keys, Security, Notifications. Include key rotation patterns and warning states.

#### 8) Mobile responsive variant
Generate a mobile layout for dashboard + builder (stacked panels, bottom nav). Keep touch targets large and readable.

---

## D) Example prompt packs (copy/paste bundles)
- “Landing + Dashboard + Builder” in one run: paste prompts 1–3 sequentially
- “Ops + Security” pack: prompts 6–7
