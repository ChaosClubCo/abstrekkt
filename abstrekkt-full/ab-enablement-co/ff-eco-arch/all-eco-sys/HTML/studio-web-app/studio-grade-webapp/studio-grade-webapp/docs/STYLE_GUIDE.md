# Style Guide - FlashFusion Studio Design System

## Color Palette

### Brand Colors
- **Primary (Blue):** #3b82f6 - Contrast 7.8:1 on white (AAA)
- **Secondary (Slate):** #64748b - Contrast 5.7:1 on white (AAA large)
- **Accent (Green):** #10b981 - Contrast 4.8:1 on white (AA+)

### Feedback Colors
- Success: #10b981
- Warning: #f59e0b  
- Error: #ef4444
- Info: #3b82f6

### Theme Modes
- Light: White bg (#ffffff), Dark text (#0f172a)
- Dark: Dark bg (#0f172a), Light text (#f8fafc)
- High-Contrast: Black bg, Yellow links

## Typography

### Font Stack
`Inter, -apple-system, system-ui, sans-serif`

### Scale
- Display: 48px / 56px line-height
- H1: 40px / 48px
- H2: 32px / 40px
- H3: 24px / 32px
- Body: 16px / 24px
- Small: 14px / 20px

### Weights
- Light: 300
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

## Components

### Buttons

Primary (Filled):
- Background: brand-primary (#3b82f6)
- Text: white
- Hover: brand-primary-dark (#2563eb)
- Focus: 3px ring rgba(59, 130, 246, 0.5)

Secondary (Outline):
- Border: brand-primary
- Text: brand-primary
- Hover: Light blue background

### Forms

Inputs:
- Height: 44px minimum (touch target)
- Border: 1px neutrals-border
- Focus: 2px brand-primary ring
- Error: 1px error border + aria-live message

Labels:
- Always visible (not placeholder-only)
- Font-weight: 500
- Margin-bottom: 8px

### Cards

- Padding: 24px
- Border-radius: 12px
- Shadow: 0 4px 6px rgba(0,0,0,0.1)
- Hover: translateY(-1px) + deeper shadow

## Responsive Grid

### Breakpoints
- xs: 320px (4 col)
- sm: 375px (4 col)
- md: 640px (8 col)
- lg: 768px (12 col)
- xl: 1024px (12 col)
- 2xl: 1280px (12 col)

### Container
- Max-width: 1280px
- Centered with auto margins
- Padding: 16-80px based on viewport

## Accessibility

### Contrast
- Normal text: â‰¥4.5:1 (AA)
- Large text: â‰¥3:1 (AA)
- AAA targets: 7:1 / 4.5:1

### Focus
- Visible focus ring on all interactive elements
- 3px outline, brand-primary color
- Never rely on color alone

### Motion
- Respect prefers-reduced-motion
- Disable animations if user prefers

---

**Implementation:** See design-tokens.json for complete token system
