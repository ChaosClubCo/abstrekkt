# FlashFusion Figma Component Library Spec + Naming System
_Last updated: 2026-01-12_

## Goals
- One source of truth for UI primitives and product components.
- 1:1 mapping between **Figma components** and **code components** (shadcn/ui + Tailwind + tokens).
- Deterministic naming so AI tools (Stitch, Copilot, GPTs) can generate/modify without drift.

## Token Sources
- Code canonical tokens: `src/design-tokens.json`
- CSS variables: `src/index.css` (generated via tokens)
- Tailwind palette: `tailwind.config.*` (imports tokens)

## Naming Conventions (Strict)
### 1) Pages
- `00 — Brand`
- `01 — Foundations`
- `02 — Components`
- `03 — Patterns`
- `04 — Templates`
- `99 — Archive`

### 2) Frames
`[Platform]/[Surface]/[State]/[Variant]`
Examples:
- `Web/AppShell/Default/Dark`
- `Mobile/Screen/Default/Dark`
- `Web/Modal/Default/Glass`

### 3) Components (Figma Component Set Names)
`FF/{Category}/{Component}`
Categories: `Primitives`, `Inputs`, `Navigation`, `Feedback`, `Surfaces`, `Data`, `Brand`

Examples:
- `FF/Primitives/Button`
- `FF/Inputs/TextField`
- `FF/Navigation/Sidebar`
- `FF/Surfaces/Card`
- `FF/Feedback/Toast`

### 4) Variants (Properties)
Use **properties**, not name suffixes.
- `tone`: `primary | secondary | neutral | danger | success | warning | info`
- `style`: `solid | outline | ghost | glass`
- `state`: `default | hover | active | disabled | loading`
- `size`: `xs | sm | md | lg | xl`
- `density`: `comfortable | compact`
- `icon`: `none | leading | trailing | only`

### 5) Layers
- Use semantic naming: `label`, `icon`, `container`, `bg`, `border`, `shadow`, `content`
- No raw color names (no “purple text”). Use semantic: `text/primary`, `bg/surface`, etc.

## Foundations (What to Build)
### Color Styles (as variables)
Create styles from tokens using semantic groups:
- `color/brand/primary`
- `color/brand/secondary`
- `color/text/default`
- `color/text/muted`
- `color/surface/bg`
- `color/surface/card`
- `color/border/default`
- `color/feedback/success|warning|error|info`
- `color/fx/glow-primary|glow-secondary`

### Text Styles
- `text/h1` Poppins 32/700
- `text/h2` Poppins 24/600
- `text/h3` Poppins 18/600
- `text/body-lg` Inter 16/400
- `text/body` Inter 14/400
- `text/caption` Inter 12/300

### Spacing & Radius
- 8px grid, spacing tokens: 4/8/16/24/32
- radius: 4/8/12/9999

## Component Inventory (MVP)
### Primitives
- Button (variants above)
- IconButton
- Badge
- Separator
- Skeleton
- Tooltip

### Inputs
- TextField
- TextArea
- Select
- Switch
- Checkbox
- Radio
- Slider

### Navigation
- Sidebar (collapsed/expanded)
- Tabs
- Breadcrumb
- Pagination
- Topbar

### Surfaces
- Card (solid/glass)
- Modal (solid/glass)
- Sheet/Drawer
- Popover
- Table container

### Feedback
- Toast
- Alert
- EmptyState
- Progress (linear/circular)

## Code Mapping (Required)
Each Figma component must include a `dev-note` text layer with:
- `component_path`: e.g. `components/ui/button.tsx`
- `tokens_used`: e.g. `--primary --foreground --glass-bg`
- `states`: list
- `a11y`: focus ring + contrast expectations

## Acceptance Criteria
- Any component can be found in <10 seconds via search.
- Variants are properties, not renamed duplicates.
- Components use semantic styles, not raw fills.
- Exportable to Stitch/Figma without losing structure.
