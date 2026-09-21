---
name: design-system-builder
description: Build cohesive, scalable design systems with design tokens, component libraries, documentation, and governance. Use when creating company-wide design systems, style guides, or component libraries for product teams.
---

# Design System Builder

Create production-ready design systems with tokens, components, docs, and governance.

## Quick Start Decision Tree

**Choose your starting point:**

1. **New design system?** → Foundation Setup (Step 1)
2. **Existing system to document?** → Documentation (Step 5)
3. **Need tokens only?** → Design Tokens (Step 2)
4. **Component library?** → Component API Design (Step 3)
5. **Governance model?** → See references/governance-models.md

## Core Workflow

### Step 1: Foundation Setup

**Define design system scope:**

```markdown
## Design System Charter

### Purpose
- Ensure consistent user experience across [products]
- Accelerate development with reusable components
- Maintain brand identity and accessibility standards

### Scope
- **In scope:** Web (React), Mobile (React Native), Marketing sites
- **Out of scope:** Print materials, video content

### Principles
1. Accessible by default (WCAG 2.2 AA minimum)
2. Mobile-first responsive
3. Performance-optimized (<100KB bundle)
4. Developer-friendly APIs
5. Themeable for white-label use

### Stakeholders
- Design: [name] (lead), [name] (contributor)
- Engineering: [name] (lead), [name] (contributor)  
- Product: [name] (stakeholder)
```

**Choose tech stack:**

| Stack | Pros | Cons | Use When |
|-------|------|------|----------|
| Tailwind + CVA | Fast, utility-first, small bundle | Learning curve, utility soup | Need rapid dev, flexible styling |
| Styled Components | CSS-in-JS, dynamic styles | Runtime cost, larger bundle | Need runtime theming |
| CSS Modules | Scoped, performant, simple | Manual naming, no theming | Need simplicity, SSR performance |
| Vanilla Extract | Zero-runtime, type-safe | Complex setup | Need type safety + performance |

**Recommended:** Tailwind + CVA for new systems (balance of DX and performance)

See: references/tech-stack-comparison.md

### Step 2: Design Tokens

**Token architecture (3 tiers):**

```
Tier 1: Primitive Tokens (raw values)
├── Blue-50: #eff6ff
├── Blue-500: #3b82f6
└── Blue-900: #1e3a8a

Tier 2: Semantic Tokens (contextual meaning)
├── color-primary: {blue-500}
├── color-background: {gray-50}
└── color-text: {gray-900}

Tier 3: Component Tokens (component-specific)
├── button-bg: {color-primary}
├── button-text: white
└── button-padding: {space-4}
```

**Token format (JSON for tooling):**

```json
{
  "color": {
    "primitive": {
      "blue": {
        "50": { "value": "#eff6ff" },
        "500": { "value": "#3b82f6" },
        "900": { "value": "#1e3a8a" }
      }
    },
    "semantic": {
      "primary": { "value": "{color.primitive.blue.500}" },
      "background": { "value": "#ffffff" },
      "text": { "value": "{color.primitive.gray.900}" }
    }
  },
  "spacing": {
    "0": { "value": "0" },
    "1": { "value": "0.25rem" },
    "2": { "value": "0.5rem" },
    "4": { "value": "1rem" }
  },
  "typography": {
    "fontSize": {
      "sm": { "value": "0.875rem" },
      "base": { "value": "1rem" },
      "lg": { "value": "1.125rem" }
    },
    "fontWeight": {
      "normal": { "value": "400" },
      "medium": { "value": "500" },
      "bold": { "value": "700" }
    }
  }
}
```

**Generate platform-specific outputs:**

```bash
# Use Style Dictionary to transform tokens
npm install style-dictionary

# Build outputs (CSS, SCSS, JS, iOS, Android)
npx style-dictionary build

# Output: tokens/css/_variables.css
:root {
  --color-primary: #3b82f6;
  --color-background: #ffffff;
  --spacing-4: 1rem;
}

# Output: tokens/ios/StyleDictionary+Class.swift
public class StyleDictionary {
  public static let colorPrimary = UIColor(red: 0.235, green: 0.510, blue: 0.965, alpha: 1)
}
```

Run: `scripts/build-tokens.js` to generate platform outputs

See: references/token-architecture.md for complete examples

### Step 3: Component API Design

**Design component APIs before building:**

**Button component example:**

```tsx
// 1. Define Props Interface
interface ButtonProps {
  // Content
  children: React.ReactNode;
  
  // Variants (visual styles)
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  
  // States
  disabled?: boolean;
  loading?: boolean;
  
  // Behavior
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  
  // Composition
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  
  // Styling escape hatch
  className?: string;
}

// 2. API Review Checklist
// [ ] All common use cases supported?
// [ ] Prop naming consistent with other components?
// [ ] Composition patterns enabled (slots, render props)?
// [ ] Escape hatches provided (className, style)?
// [ ] TypeScript types exported?
```

**API Design Principles:**

1. **Sensible defaults** - Button defaults to variant="primary", size="md"
2. **Composition over configuration** - Prefer `<Button leftIcon={<Icon />}>` over `iconPosition="left"`
3. **Consistent naming** - Use `variant`, `size`, `disabled` across all components
4. **Escape hatches** - Always provide `className` and `...rest` props
5. **Type safety** - Export TypeScript types for all props

See: references/api-design-patterns.md

### Step 4: Component Library Structure

**Organize by atomic design methodology:**

```
/design-system
├── tokens/
│   ├── colors.json
│   ├── spacing.json
│   ├── typography.json
│   └── build.js (Style Dictionary config)
├── primitives/       (Atoms - basic building blocks)
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   ├── Button.stories.tsx
│   │   └── index.ts
│   ├── Input/
│   ├── Text/
│   └── Icon/
├── components/       (Molecules - simple combinations)
│   ├── Card/
│   ├── FormField/    (Label + Input + Error)
│   ├── SearchInput/  (Input + Icon + Clear button)
│   └── Alert/
├── patterns/         (Organisms - complex UI patterns)
│   ├── Navigation/
│   ├── Modal/
│   ├── DataTable/
│   └── Form/
├── layouts/          (Templates - page layouts)
│   ├── AppShell/
│   ├── Dashboard/
│   └── Marketing/
└── docs/             (Documentation)
    ├── getting-started.md
    ├── principles.md
    └── contributing.md
```

**Component file structure:**

```tsx
// Button/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

// 1. Variants using CVA
const buttonVariants = cva(
  // Base styles (always applied)
  'inline-flex items-center justify-center rounded font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-11 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

// 2. Props interface
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
}

// 3. Component with forwardRef (for ref forwarding)
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, leftIcon, rightIcon, loading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? <Spinner /> : leftIcon}
        {children}
        {rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

### Step 5: Documentation

**Create comprehensive docs:**

**Component documentation template:**

```markdown
# Button

Trigger actions and events with a button component.

## Usage

\`\`\`tsx
import { Button } from '@company/design-system';

function App() {
  return (
    <Button onClick={() => alert('Clicked!')}>
      Click me
    </Button>
  );
}
\`\`\`

## Variants

### Primary (default)
<Button variant="primary">Primary</Button>

### Secondary
<Button variant="secondary">Secondary</Button>

### Ghost
<Button variant="ghost">Ghost</Button>

### Danger
<Button variant="danger">Delete</Button>

## Sizes

<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>

## States

### Disabled
<Button disabled>Disabled</Button>

### Loading
<Button loading>Loading</Button>

## With Icons

<Button leftIcon={<IconPlus />}>Add Item</Button>
<Button rightIcon={<IconArrowRight />}>Next</Button>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'primary' \| 'secondary' \| 'ghost' \| 'danger' | 'primary' | Visual style |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Button size |
| disabled | boolean | false | Disable interaction |
| loading | boolean | false | Show loading spinner |
| leftIcon | ReactNode | - | Icon before text |
| rightIcon | ReactNode | - | Icon after text |
| onClick | () => void | - | Click handler |

## Accessibility

- Keyboard: `Enter` and `Space` trigger the button
- Focus: Visible focus ring (2px outline)
- Screen readers: Uses semantic `<button>` element
- States: `aria-disabled` when disabled, `aria-busy` when loading

## Best Practices

✅ DO:
- Use primary variant for main actions
- Include loading state for async operations
- Provide clear, action-oriented labels ("Save changes" vs "Submit")

❌ DON'T:
- Use more than one primary button per section
- Nest buttons inside buttons
- Use for navigation (use Link instead)
```

**Storybook integration:**

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  tags: ['autodocs'], // Auto-generate docs
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
};

export const WithIcons: Story = {
  args: {
    leftIcon: <IconPlus />,
    children: 'Add Item',
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading',
  },
};
```

Run: `npm run storybook` to view component library

See: references/documentation-templates.md

### Step 6: Governance & Contribution

**Establish contribution workflow:**

```markdown
## Contribution Process

### 1. Proposal
- Create RFC (Request for Comments) in GitHub Discussions
- Describe use case, API design, visual mockups
- Get feedback from design system team

### 2. Design Review
- Present in weekly design system sync
- Review accessibility, API consistency, performance
- Approve or request changes

### 3. Implementation
- Fork repo, create feature branch
- Follow component checklist (below)
- Submit PR with tests, docs, Storybook stories

### 4. Code Review
- 2 approvals required (1 design, 1 engineering)
- Automated checks pass (lint, test, a11y, bundle size)

### 5. Release
- Merged to main, auto-released via semantic versioning
- Announced in #design-system Slack channel
- Added to changelog

## Component Checklist

Before submitting PR:

- [ ] TypeScript types exported
- [ ] Props documented with JSDoc
- [ ] All variants implemented (variants, sizes, states)
- [ ] Accessibility tested (keyboard, screen reader, WCAG 2.2 AA)
- [ ] Unit tests (>80% coverage)
- [ ] Storybook stories (all variants + states)
- [ ] Visual regression tests (Chromatic)
- [ ] Performance tested (<10KB gzipped)
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Dark mode support
- [ ] Backwards compatible (no breaking changes)
```

See: references/governance-models.md for team structures

## Versioning & Release

**Semantic versioning:**
- **Major (1.0.0 → 2.0.0):** Breaking changes (API changes, removed props)
- **Minor (1.0.0 → 1.1.0):** New features (new components, new props)
- **Patch (1.0.0 → 1.0.1):** Bug fixes (no API changes)

**Release automation (semantic-release):**

```json
// package.json
{
  "name": "@company/design-system",
  "version": "1.2.3",
  "scripts": {
    "release": "semantic-release"
  },
  "release": {
    "branches": ["main"],
    "plugins": [
      "@semantic-release/commit-analyzer",
      "@semantic-release/release-notes-generator",
      "@semantic-release/changelog",
      "@semantic-release/npm",
      "@semantic-release/github"
    ]
  }
}
```

**Commit conventions (Conventional Commits):**
```
feat(button): add loading state
fix(input): resolve focus issue on mobile
docs(card): update usage examples
BREAKING CHANGE: remove deprecated `color` prop
```

Run: `npm run release` to auto-publish

## Testing Strategy

**Multi-layer testing:**

```tsx
// 1. Unit tests (Jest + Testing Library)
describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalled();
  });
});

// 2. Accessibility tests (jest-axe)
it('has no a11y violations', async () => {
  const { container } = render(<Button>Click</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

// 3. Visual regression tests (Chromatic)
// Automatically captures screenshots in Storybook stories

// 4. Integration tests (Playwright)
test('form submission flow', async ({ page }) => {
  await page.goto('/form');
  await page.click('button:has-text("Submit")');
  await expect(page.locator('.success-message')).toBeVisible();
});
```

## Bundle Size Optimization

**Keep design system lean:**

```json
// package.json
{
  "sideEffects": false, // Enable tree-shaking
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./button": {
      "import": "./dist/button.js",
      "types": "./dist/button.d.ts"
    }
  }
}
```

**Usage (tree-shakeable imports):**
```tsx
// ✅ DO: Import individual components
import { Button } from '@company/design-system/button';

// ❌ AVOID: Import entire library
import { Button } from '@company/design-system';
```

**Bundle analysis:**
```bash
npm run build -- --analyze
# Generates bundle-analysis.html
```

Target: <100KB gzipped for entire design system

## Quality Gates

Before v1.0 release:

- [ ] 20+ components documented
- [ ] Design tokens implemented (color, spacing, typography)
- [ ] Storybook deployed (public URL)
- [ ] Accessibility audited (WCAG 2.2 AA)
- [ ] 80%+ test coverage
- [ ] Visual regression tests (Chromatic)
- [ ] Bundle size <100KB (gzipped)
- [ ] Documentation site live (getting started, guidelines, components)
- [ ] Contribution guide published
- [ ] Versioning strategy defined
- [ ] 2+ consuming products using the system

## Bundled Resources

- **scripts/build-tokens.js** - Style Dictionary build script
- **scripts/generate-component.js** - Component scaffolding tool
- **scripts/bundle-analysis.js** - Bundle size analyzer
- **references/token-architecture.md** - Complete token system guide
- **references/api-design-patterns.md** - Component API best practices
- **references/governance-models.md** - Team structures and workflows
- **references/tech-stack-comparison.md** - CSS/JS framework comparison
- **references/documentation-templates.md** - Docs and Storybook templates
- **assets/figma-library/** - Figma components synced with code
- **assets/storybook-theme/** - Branded Storybook theme
