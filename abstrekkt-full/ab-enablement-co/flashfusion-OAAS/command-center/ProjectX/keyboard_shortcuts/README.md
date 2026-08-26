# Keyboard Shortcuts Module

Comprehensive keyboard shortcut system for power user accessibility.

## Features

- **Global Shortcuts**: App-wide keyboard commands
- **Scoped Shortcuts**: Context-aware shortcuts
- **Command Palette**: Searchable command menu (⌘K / Ctrl+K)
- **Shortcut Guide**: Visual shortcut reference (?)
- **Customization**: User-configurable bindings
- **Conflict Detection**: Warn on duplicate shortcuts
- **OS Awareness**: Mac/Windows modifier handling
- **Vim Mode**: Optional vim-style navigation
- **Accessibility**: Screen reader announcements

## Installation

```bash
npm install @projectx/keyboard-shortcuts
```

## Usage

```typescript
import {
  ShortcutsProvider,
  useShortcut,
  useCommandPalette,
  CommandPalette,
  ShortcutsGuide,
} from '@projectx/keyboard-shortcuts';

// Wrap your app
function App() {
  return (
    <ShortcutsProvider>
      <CommandPalette />
      <YourApp />
    </ShortcutsProvider>
  );
}

// Register shortcuts
function Dashboard() {
  useShortcut('mod+n', () => createNewItem(), {
    description: 'Create new item',
    scope: 'dashboard',
  });

  useShortcut('mod+s', () => saveChanges(), {
    description: 'Save changes',
    preventDefault: true,
  });

  return <div>...</div>;
}

// Command palette integration
function CommandPaletteSetup() {
  const { registerCommand } = useCommandPalette();

  useEffect(() => {
    registerCommand({
      id: 'goto-settings',
      title: 'Go to Settings',
      shortcut: 'mod+,',
      action: () => navigate('/settings'),
      group: 'Navigation',
    });
  }, []);
}
```

## Shortcut Syntax

```typescript
// Modifiers
'mod+k'           // ⌘K on Mac, Ctrl+K on Windows
'ctrl+k'          // Always Ctrl+K
'alt+k'           // Alt+K
'shift+k'         // Shift+K
'mod+shift+k'     // ⌘⇧K on Mac, Ctrl+Shift+K on Windows

// Special keys
'escape'          // Escape
'enter'           // Enter
'space'           // Space
'backspace'       // Backspace
'delete'          // Delete
'tab'             // Tab
'arrowup'         // Arrow keys
'arrowdown'
'arrowleft'
'arrowright'

// Function keys
'f1' through 'f12'

// Sequences (vim-style)
'g g'             // Press g twice
'g i'             // Press g then i
```

## Configuration

```typescript
const shortcutsConfig: ShortcutsConfig = {
  // Command palette trigger
  commandPaletteKey: 'mod+k',

  // Shortcuts guide trigger
  guideKey: '?',

  // Enable vim mode
  vimMode: false,

  // OS detection
  platform: 'auto', // 'auto' | 'mac' | 'windows' | 'linux'

  // Custom shortcuts
  shortcuts: [
    { key: 'mod+n', action: 'new', description: 'New item' },
    { key: 'mod+s', action: 'save', description: 'Save' },
    { key: 'mod+/', action: 'search', description: 'Search' },
  ],

  // Shortcut groups
  groups: [
    { id: 'general', label: 'General' },
    { id: 'navigation', label: 'Navigation' },
    { id: 'editing', label: 'Editing' },
  ],
};
```

## Default Shortcuts

| Shortcut | Action | Description |
|----------|--------|-------------|
| `⌘K` / `Ctrl+K` | Command Palette | Open command menu |
| `?` | Shortcuts Guide | Show all shortcuts |
| `Escape` | Close | Close modals/menus |
| `⌘/` / `Ctrl+/` | Search | Global search |
| `⌘N` / `Ctrl+N` | New | Create new item |
| `⌘S` / `Ctrl+S` | Save | Save changes |

## Components

### CommandPalette
Full-featured command palette with fuzzy search.

### ShortcutsGuide
Modal showing all available shortcuts.

### ShortcutHint
Inline shortcut hint display.

## API Reference

### useShortcut(key, callback, options)
```typescript
useShortcut('mod+s', handleSave, {
  description: 'Save document',
  scope: 'editor',
  preventDefault: true,
  enabled: isEditing,
});
```

### useCommandPalette()
```typescript
const {
  isOpen,
  open,
  close,
  toggle,
  registerCommand,
  unregisterCommand,
  commands,
} = useCommandPalette();
```

### useShortcutGuide()
```typescript
const {
  isOpen,
  open,
  close,
  shortcuts,
} = useShortcutGuide();
```

## Accessibility

- All shortcuts have text descriptions
- Screen reader announcements for actions
- Focus management for command palette
- Keyboard-only navigation support
