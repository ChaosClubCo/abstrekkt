# FlashFusion Naming System (Tokens + Figma + Code)

## Token naming (canonical)
Use **dot notation** and keep names stable.

### Colors
- `color.brand.primary.500`
- `color.brand.secondary.500`
- `color.semantic.success.base`
- `color.semantic.success.bg`
- `color.semantic.success.border`
- `color.semantic.success.text`
- `color.neutral.900`
- `color.surface.dark.bg`
- `color.surface.dark.card`
- `color.surface.dark.glass.bg`
- `color.surface.dark.glass.border`

### Typography
- `type.family.heading`
- `type.family.body`
- `type.size.h1|h2|h3|body|caption`
- `type.weight.300|400|600|700`
- `type.line.tight|normal|relaxed`

### Spacing / Radius / Shadows
- `space.1|2|3|4|6|8` (8px grid; map to px in tokens)
- `radius.sm|md|lg|full`
- `shadow.glow.primary|secondary|glass`

## Figma component naming
Use **Component sets** with `Component/Name` and **properties**.

### Format
`Component/Variant`

Examples:
- `Button/Primary`
- `Button/Secondary`
- `Button/Ghost`
- `Input/Default`
- `Card/Glass`
- `Alert/Success`

### Properties (Figma)
- `theme = light | dark`
- `state = default | hover | pressed | focus | disabled`
- `size = sm | md | lg` (if applicable)
- `icon = none | leading | trailing`

## Code component naming
- React components: `PascalCase` (e.g., `GlassCard`, `PrimaryButton`)
- Variants via `variant` prop with string union types.
- Tailwind tokens only via CSS vars (no hardcoded hex).

## Asset naming
- `flashfusion-logo-mark.svg`
- `flashfusion-wordmark.svg`
- `flashfusion-pattern-tile.svg`
- `flashfusion-social-banner-3x1.png` (generated externally)
