# Dark Mode Module

Complete UI theming system with dark mode support for SaaS applications.

## Features

- **Theme Toggle**: Light/Dark/System theme switching
- **System Detection**: Auto-detect OS theme preference
- **Persistence**: Remember user preference
- **CSS Variables**: Runtime theme switching without reload
- **Tailwind Integration**: Works with Tailwind CSS dark mode
- **Custom Themes**: Create and apply custom color schemes
- **Smooth Transitions**: Animated theme transitions
- **SSR Support**: Server-side rendering compatible

## Installation

```bash
npm install @projectx/dark-mode
```

## Usage

```typescript
import {
  ThemeProvider,
  useTheme,
  ThemeToggle,
  ThemeSwitcher,
} from '@projectx/dark-mode';

// Wrap your app
function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <YourApp />
    </ThemeProvider>
  );
}

// Use in components
function Header() {
  const { theme, setTheme, isDark } = useTheme();

  return (
    <header className={isDark ? 'bg-gray-900' : 'bg-white'}>
      <ThemeToggle />
    </header>
  );
}
```

## Configuration

```typescript
const themeConfig: ThemeConfig = {
  defaultTheme: 'system', // 'light' | 'dark' | 'system'
  storageKey: 'app-theme',
  attribute: 'data-theme', // or 'class'
  enableTransitions: true,
  transitionDuration: 200,
  themes: {
    light: {
      background: '#FFFFFF',
      foreground: '#111827',
      primary: '#3B82F6',
      // ... more colors
    },
    dark: {
      background: '#111827',
      foreground: '#F9FAFB',
      primary: '#60A5FA',
      // ... more colors
    },
  },
};
```

## Tailwind Integration

```javascript
// tailwind.config.js
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  // ...
};
```

```tsx
// In your components
<div className="bg-white dark:bg-gray-900">
  <p className="text-gray-900 dark:text-gray-100">
    Hello World
  </p>
</div>
```

## CSS Variables

The module sets CSS variables on the root element:

```css
:root {
  --background: 255 255 255;
  --foreground: 17 24 39;
  --primary: 59 130 246;
  /* ... more variables */
}

[data-theme="dark"] {
  --background: 17 24 39;
  --foreground: 249 250 251;
  --primary: 96 165 250;
}
```

Use in your CSS:
```css
.my-component {
  background-color: rgb(var(--background));
  color: rgb(var(--foreground));
}
```

## Components

### ThemeToggle
Simple toggle button for light/dark switching.

### ThemeSwitcher
Dropdown menu with light/dark/system options.

### ThemePreview
Preview theme colors before applying.

## API Reference

### useTheme()
```typescript
const {
  theme,      // Current theme: 'light' | 'dark' | 'system'
  setTheme,   // Set theme
  isDark,     // Boolean: is dark mode active
  isSystem,   // Boolean: using system preference
  toggle,     // Toggle between light/dark
} = useTheme();
```

### ThemeProvider Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| defaultTheme | Theme | 'system' | Initial theme |
| storageKey | string | 'theme' | localStorage key |
| attribute | string | 'data-theme' | HTML attribute |
| enableTransitions | boolean | true | Enable transitions |
| themes | ThemeColors | default | Custom theme colors |

## Accessibility

- Respects `prefers-reduced-motion`
- Supports keyboard navigation
- ARIA labels for toggle buttons
- High contrast mode support
