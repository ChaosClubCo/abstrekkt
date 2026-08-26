---
name: ui-component-library
description: Reusable UI component patterns for React, Vue, and vanilla JavaScript. Includes advanced components beyond basic libraries (shadcn/ui, MUI), complex interactions, and production-ready code patterns. Use when building custom component libraries or implementing sophisticated UI components.
---

# UI Component Library

Build production-ready UI components with accessibility, performance, and maintainability.

## Quick Start Decision Tree

**Choose your path based on need:**

1. **Need data-heavy component?** → See references/data-components.md (tables, grids, charts)
2. **Need complex interaction?** → See references/interactive-components.md (drag-drop, modals, tooltips)
3. **Need form components?** → See references/form-components.md (autocomplete, file upload, rich text)
4. **Need layout components?** → See references/layout-components.md (split panes, masonry, virtualized lists)
5. **Starting from scratch?** → Use Component Checklist (Step 1)

## Core Workflow

### Step 1: Component Design Checklist

Before building any component, verify:

**Functionality:**
- [ ] States defined (default, hover, focus, active, disabled, loading, error)
- [ ] Props API designed (required/optional, types, defaults)
- [ ] Events defined (callbacks, custom events)
- [ ] Edge cases handled (empty, loading, error states)

**Accessibility:**
- [ ] Keyboard navigation (arrow keys, tab, enter, esc)
- [ ] ARIA attributes (role, aria-label, aria-describedby)
- [ ] Focus management (trap focus in modals, restore on close)
- [ ] Screen reader announcements (live regions for dynamic content)

**Performance:**
- [ ] Virtualization (for large lists/grids)
- [ ] Lazy loading (defer off-screen content)
- [ ] Memoization (prevent unnecessary re-renders)
- [ ] Event delegation (reduce listeners)

**Styling:**
- [ ] CSS-in-JS or CSS Modules (scoped styles)
- [ ] Theme tokens (colors, spacing, typography)
- [ ] Responsive (mobile-first breakpoints)
- [ ] Dark mode support (CSS variables or theme context)

### Step 2: Component Anatomy (React Example)

```tsx
// MyComponent.tsx
import { useState, useRef, useEffect } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// 1. Variants using CVA (Tailwind-friendly)
const componentVariants = cva(
  'base-styles', // base classes
  {
    variants: {
      size: {
        sm: 'text-sm px-2 py-1',
        md: 'text-base px-4 py-2',
        lg: 'text-lg px-6 py-3',
      },
      variant: {
        primary: 'bg-blue-600 text-white',
        secondary: 'bg-gray-200 text-gray-900',
        ghost: 'bg-transparent hover:bg-gray-100',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'primary',
    },
  }
);

// 2. Props interface with TypeScript
interface MyComponentProps extends VariantProps<typeof componentVariants> {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  // Add more props
}

// 3. Component with accessibility
export function MyComponent({
  label,
  onClick,
  disabled = false,
  loading = false,
  size,
  variant,
  ...props
}: MyComponentProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isPressed, setIsPressed] = useState(false);

  // 4. Keyboard handlers
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <button
      ref={buttonRef}
      className={componentVariants({ size, variant })}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled || loading}
      aria-label={label}
      aria-pressed={isPressed}
      aria-busy={loading}
      {...props}
    >
      {loading ? <Spinner /> : label}
    </button>
  );
}
```

### Step 3: Advanced Patterns

**Pattern A: Compound Components** (Flexible composition)

```tsx
// Tab.tsx - Compound component pattern
const TabsContext = createContext<TabsState | null>(null);

function Tabs({ defaultValue, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div role="tablist">{children}</div>
    </TabsContext.Provider>
  );
}

Tabs.List = function TabsList({ children }: TabsListProps) {
  return <div className="flex border-b">{children}</div>;
};

Tabs.Trigger = function TabsTrigger({ value, children }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useContext(TabsContext)!;
  
  return (
    <button
      role="tab"
      aria-selected={activeTab === value}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
};

Tabs.Content = function TabsContent({ value, children }: TabsContentProps) {
  const { activeTab } = useContext(TabsContext)!;
  
  if (activeTab !== value) return null;
  
  return <div role="tabpanel">{children}</div>;
};

// Usage:
<Tabs defaultValue="tab1">
  <Tabs.List>
    <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab1">Content 1</Tabs.Content>
  <Tabs.Content value="tab2">Content 2</Tabs.Content>
</Tabs>
```

**Pattern B: Headless Components** (Behavior without styling)

```tsx
// useDropdown.ts - Headless hook
export function useDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLElement>(null);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !contentRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return {
    isOpen,
    setIsOpen,
    triggerRef,
    contentRef,
    triggerProps: {
      onClick: () => setIsOpen(!isOpen),
      'aria-expanded': isOpen,
      'aria-haspopup': true,
    },
    contentProps: {
      hidden: !isOpen,
    },
  };
}
```

**Pattern C: Render Props** (Flexible rendering)

```tsx
// DataFetcher.tsx - Render prop pattern
interface DataFetcherProps<T> {
  url: string;
  children: (data: {
    data: T | null;
    loading: boolean;
    error: Error | null;
  }) => React.ReactNode;
}

function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return children({ data, loading, error });
}

// Usage:
<DataFetcher<User> url="/api/user">
  {({ data, loading, error }) => {
    if (loading) return <Spinner />;
    if (error) return <ErrorMessage error={error} />;
    return <UserProfile user={data} />;
  }}
</DataFetcher>
```

### Step 4: Complex Components Library

See references for implementation details:

**Data Display:**
- **Virtualized Table** - Handle 10k+ rows (references/data-components.md#virtualized-table)
- **Infinite Scroll Grid** - Instagram-style grid (references/data-components.md#infinite-grid)
- **Data Visualization** - D3 + React integration (references/data-components.md#charts)

**Interactive:**
- **Drag & Drop** - React DnD patterns (references/interactive-components.md#drag-drop)
- **File Upload** - Drag-drop, progress, preview (references/interactive-components.md#file-upload)
- **Rich Text Editor** - Tiptap/Slate integration (references/interactive-components.md#rich-text)
- **Command Palette** - ⌘K interface (references/interactive-components.md#command-palette)

**Forms:**
- **Autocomplete** - Debounced search, keyboard nav (references/form-components.md#autocomplete)
- **Multi-Select** - Tags, checkboxes, search (references/form-components.md#multi-select)
- **Date Picker** - Range selection, presets (references/form-components.md#date-picker)
- **Color Picker** - Hex, RGB, HSL inputs (references/form-components.md#color-picker)

**Layout:**
- **Split Panes** - Resizable dividers (references/layout-components.md#split-panes)
- **Masonry Grid** - Pinterest-style layout (references/layout-components.md#masonry)
- **Carousel** - Accessible, touch-friendly (references/layout-components.md#carousel)

## Component Testing

**Test every component for:**

```tsx
// MyComponent.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { MyComponent } from './MyComponent';

expect.extend(toHaveNoViolations);

describe('MyComponent', () => {
  // 1. Rendering
  it('renders with default props', () => {
    render(<MyComponent label="Click me" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  // 2. Interactions
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<MyComponent label="Click me" onClick={handleClick} />);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // 3. Keyboard
  it('responds to Enter key', () => {
    const handleClick = jest.fn();
    render(<MyComponent label="Click me" onClick={handleClick} />);
    fireEvent.keyDown(screen.getByText('Click me'), { key: 'Enter' });
    expect(handleClick).toHaveBeenCalled();
  });

  // 4. Accessibility
  it('has no accessibility violations', async () => {
    const { container } = render(<MyComponent label="Click me" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // 5. States
  it('disables when loading', () => {
    render(<MyComponent label="Click me" loading />);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

Run: `npm test` or `npm run test:coverage`

## Performance Optimization

**Prevent unnecessary re-renders:**

```tsx
// 1. Memoize components
const MyComponent = memo(({ data }: Props) => {
  return <div>{data}</div>;
});

// 2. Memoize expensive calculations
const MyComponent = ({ items }: Props) => {
  const sortedItems = useMemo(
    () => items.sort((a, b) => a.name.localeCompare(b.name)),
    [items]
  );
  return <div>{sortedItems.map(...)}</div>;
};

// 3. Memoize callbacks
const MyComponent = ({ onSave }: Props) => {
  const handleSave = useCallback(() => {
    onSave();
  }, [onSave]);
  
  return <button onClick={handleSave}>Save</button>;
};

// 4. Virtualize long lists
import { FixedSizeList } from 'react-window';

const MyList = ({ items }: Props) => (
  <FixedSizeList
    height={600}
    itemCount={items.length}
    itemSize={50}
    width="100%"
  >
    {({ index, style }) => (
      <div style={style}>{items[index].name}</div>
    )}
  </FixedSizeList>
);
```

## Styling Best Practices

**Option A: Tailwind + CVA** (Recommended)

```tsx
import { cva } from 'class-variance-authority';

const button = cva('rounded font-medium transition-colors', {
  variants: {
    intent: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    },
    size: {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2 text-base',
    },
  },
});

<button className={button({ intent: 'primary', size: 'md' })}>Click</button>
```

**Option B: CSS Modules**

```tsx
// Button.module.css
.button {
  border-radius: 0.375rem;
  font-weight: 500;
}

.button--primary {
  background: #2563eb;
  color: white;
}

// Button.tsx
import styles from './Button.module.css';

<button className={`${styles.button} ${styles['button--primary']}`}>
  Click
</button>
```

**Option C: Styled Components**

```tsx
import styled from 'styled-components';

const Button = styled.button<{ variant: 'primary' | 'secondary' }>`
  border-radius: 0.375rem;
  font-weight: 500;
  background: ${(props) => (props.variant === 'primary' ? '#2563eb' : '#e5e7eb')};
  color: ${(props) => (props.variant === 'primary' ? 'white' : '#111827')};
`;

<Button variant="primary">Click</Button>
```

## Documentation Template

```tsx
/**
 * MyComponent - Brief description
 * 
 * @example
 * ```tsx
 * <MyComponent
 *   label="Click me"
 *   onClick={() => console.log('clicked')}
 *   size="md"
 * />
 * ```
 * 
 * @param {string} label - Button text
 * @param {Function} onClick - Click handler
 * @param {'sm' | 'md' | 'lg'} size - Button size
 * @param {boolean} disabled - Disable interaction
 * @param {boolean} loading - Show loading state
 * 
 * @accessibility
 * - Keyboard: Enter/Space triggers onClick
 * - Screen reader: aria-label announces button purpose
 * - Focus: Visible focus indicator (3px outline)
 */
```

## Quality Gates

Before releasing component:

- [ ] TypeScript types exported
- [ ] Accessibility tested (keyboard, screen reader)
- [ ] Unit tests pass (>80% coverage)
- [ ] Visual regression tests (Chromatic/Percy)
- [ ] Performance tested (React DevTools Profiler)
- [ ] Documentation complete (props, examples, a11y notes)
- [ ] Storybook story created (all variants)
- [ ] Dark mode works (if applicable)
- [ ] Mobile responsive (tested 320px-1920px)
- [ ] No console errors/warnings

## Bundled Resources

- **scripts/generate-component.js** - Scaffold new component with tests
- **scripts/test-a11y.js** - Automated accessibility testing
- **references/data-components.md** - Tables, grids, charts (40+ patterns)
- **references/interactive-components.md** - Modals, tooltips, drag-drop (30+ patterns)
- **references/form-components.md** - Inputs, selects, pickers (25+ patterns)
- **references/layout-components.md** - Grids, split panes, masonry (20+ patterns)
- **assets/component-templates/** - Boilerplate code for common components
- **assets/storybook-config/** - Storybook setup files
