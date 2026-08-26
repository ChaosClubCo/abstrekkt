# FlashFusion Figma Component Library Spec (v1)

**Brand anchors**
- Primary: #a855f7
- Secondary: #f472b6
- Dark background: #0f0618
- Light text: #f3e8ff
- Typography: Headings Poppins, Body Inter

## 1) File structure (Figma)
Create a dedicated Figma file: **FlashFusion • Component Library** with these pages:

1. **00 — Cover & Rules**
   - Brand anchors + accessibility rules
   - Token usage rules
   - Links to code tokens (`src/design-tokens.json`)

2. **01 — Foundations**
   - Color tokens (all semantic + neutrals)
   - Typography styles
   - Effects (glass, glow)
   - Spacing + radius

3. **02 — Components (Core)**
   - Buttons, Inputs, Select, Textarea
   - Badges, Chips, Tags
   - Cards, Panels (glass / solid)
   - Alerts, Toasts, Dialogs

4. **03 — Components (Navigation)**
   - Sidebar, TopNav, Tabs, Breadcrumbs
   - Pagination, Stepper

5. **04 — Patterns**
   - Empty states
   - Loading (skeleton, spinners)
   - Forms & validation states
   - Tables & data grids

6. **05 — Screens (Reference Only)**
   - Landing
   - Dashboard
   - Builder / AI HUD
   - Billing / Settings

## 2) Token mapping (Figma ↔ code)
Treat **code tokens as canonical**. In Figma, tokens are mirrored for design-time only.

### Color tokens (recommended groups)
- `color.brand.primary.*` (50–900)
- `color.brand.secondary.*` (50–900)
- `color.semantic.success|warning|error|info.*` (base + subtle/bg + border + text)
- `color.neutral.*` (50–950)
- `color.surface.bg|card|panel|glass.*` (light + dark)

### Typography tokens
- `type.family.heading` = Poppins
- `type.family.body` = Inter
- `type.size.h1/h2/h3/body/caption`
- `type.weight.light/regular/semibold/bold`

### Effects tokens
- `effect.glass.blur` (px)
- `effect.glass.bg` (rgba)
- `effect.glow.primary/secondary` (shadow)

## 3) Component coverage + requirements
All components must ship with:
- Light + dark variants (if used in product)
- States: default, hover, active/pressed, focus, disabled
- Error/validation states where relevant
- Accessibility notes (contrast + focus visibility)

## 4) Library publishing conventions
- Publish components from page **02–04** only
- Mark page **05** as reference (not published) to avoid noisy libraries

## 5) “No drift” rule
If token values change in code, update Figma tokens and re-publish the library the same day.
