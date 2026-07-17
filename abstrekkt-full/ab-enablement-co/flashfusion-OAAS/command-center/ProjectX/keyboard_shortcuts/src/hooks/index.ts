import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import type {
  ShortcutsContextValue,
  CommandPaletteContextValue,
  ShortcutGuideContextValue,
  ShortcutOptions,
  Command,
  RegisteredShortcut,
  ShortcutGroup,
  Platform,
} from '../types';

// Detect platform
function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'windows';
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('mac')) return 'mac';
  if (ua.includes('linux')) return 'linux';
  return 'windows';
}

// Parse shortcut key
function parseShortcut(key: string, isMac: boolean): string[] {
  return key
    .toLowerCase()
    .split('+')
    .map((part) => {
      if (part === 'mod') return isMac ? 'meta' : 'ctrl';
      return part.trim();
    });
}

// Check if event matches shortcut
function matchesShortcut(event: KeyboardEvent, parts: string[]): boolean {
  const modifiers = new Set(['ctrl', 'alt', 'shift', 'meta']);
  const requiredModifiers = new Set(parts.filter((p) => modifiers.has(p)));
  const mainKey = parts.find((p) => !modifiers.has(p));

  const hasCtrl = event.ctrlKey;
  const hasAlt = event.altKey;
  const hasShift = event.shiftKey;
  const hasMeta = event.metaKey;

  const modifiersMatch =
    requiredModifiers.has('ctrl') === hasCtrl &&
    requiredModifiers.has('alt') === hasAlt &&
    requiredModifiers.has('shift') === hasShift &&
    requiredModifiers.has('meta') === hasMeta;

  const keyMatch = mainKey === event.key.toLowerCase();

  return modifiersMatch && keyMatch;
}

// Format shortcut for display
function formatShortcutKey(key: string, isMac: boolean): string {
  const symbols: Record<string, string> = isMac
    ? {
        mod: '⌘',
        ctrl: '⌃',
        alt: '⌥',
        shift: '⇧',
        meta: '⌘',
        enter: '↵',
        escape: 'Esc',
        backspace: '⌫',
        delete: '⌦',
        tab: '⇥',
        arrowup: '↑',
        arrowdown: '↓',
        arrowleft: '←',
        arrowright: '→',
        space: '␣',
      }
    : {
        mod: 'Ctrl',
        ctrl: 'Ctrl',
        alt: 'Alt',
        shift: 'Shift',
        meta: 'Win',
        enter: 'Enter',
        escape: 'Esc',
        backspace: 'Backspace',
        delete: 'Delete',
        tab: 'Tab',
        arrowup: '↑',
        arrowdown: '↓',
        arrowleft: '←',
        arrowright: '→',
        space: 'Space',
      };

  return key
    .toLowerCase()
    .split('+')
    .map((part) => symbols[part] || part.toUpperCase())
    .join(isMac ? '' : '+');
}

// Shortcuts context
export const ShortcutsContext = createContext<ShortcutsContextValue | undefined>(undefined);

export function useShortcutsContext(): ShortcutsContextValue {
  const context = useContext(ShortcutsContext);
  if (!context) {
    throw new Error('useShortcutsContext must be used within ShortcutsProvider');
  }
  return context;
}

// Main shortcut hook
export function useShortcut(
  key: string,
  callback: () => void,
  options: ShortcutOptions = {}
) {
  const { register } = useShortcutsContext();

  useEffect(() => {
    if (options.enabled === false) return;
    return register(key, callback, options);
  }, [key, callback, options, register]);
}

// Command palette context
export const CommandPaletteContext = createContext<CommandPaletteContextValue | undefined>(
  undefined
);

export function useCommandPalette(): CommandPaletteContextValue {
  const context = useContext(CommandPaletteContext);
  if (!context) {
    throw new Error('useCommandPalette must be used within ShortcutsProvider');
  }
  return context;
}

// Command palette state hook
export function useCommandPaletteState() {
  const [isOpen, setIsOpen] = useState(false);
  const [commands, setCommands] = useState<Command[]>([]);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setSearch('');
    setSelectedIndex(0);
  }, []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const registerCommand = useCallback((command: Command) => {
    setCommands((prev) => {
      const exists = prev.some((c) => c.id === command.id);
      if (exists) return prev;
      return [...prev, command];
    });
  }, []);

  const unregisterCommand = useCallback((commandId: string) => {
    setCommands((prev) => prev.filter((c) => c.id !== commandId));
  }, []);

  const filteredCommands = useMemo(() => {
    if (!search) return commands;

    const searchLower = search.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.title.toLowerCase().includes(searchLower) ||
        cmd.description?.toLowerCase().includes(searchLower) ||
        cmd.keywords?.some((k) => k.toLowerCase().includes(searchLower))
    );
  }, [commands, search]);

  const executeSelected = useCallback(() => {
    const command = filteredCommands[selectedIndex];
    if (command) {
      command.action();
      close();
    }
  }, [filteredCommands, selectedIndex, close]);

  return {
    isOpen,
    open,
    close,
    toggle,
    registerCommand,
    unregisterCommand,
    commands,
    search,
    setSearch,
    filteredCommands,
    selectedIndex,
    setSelectedIndex,
    executeSelected,
  };
}

// Shortcuts guide context
export const ShortcutGuideContext = createContext<ShortcutGuideContextValue | undefined>(
  undefined
);

export function useShortcutGuide(): ShortcutGuideContextValue {
  const context = useContext(ShortcutGuideContext);
  if (!context) {
    throw new Error('useShortcutGuide must be used within ShortcutsProvider');
  }
  return context;
}

// Shortcuts state hook
export function useShortcutsState(platform: Platform = 'auto') {
  const [shortcuts, setShortcuts] = useState<RegisteredShortcut[]>([]);
  const shortcutsRef = useRef<RegisteredShortcut[]>([]);
  const idCounter = useRef(0);

  const detectedPlatform = platform === 'auto' ? detectPlatform() : platform;
  const isMac = detectedPlatform === 'mac';

  const formatShortcut = useCallback(
    (key: string) => formatShortcutKey(key, isMac),
    [isMac]
  );

  const register = useCallback(
    (key: string, callback: () => void, options: ShortcutOptions = {}) => {
      const id = `shortcut-${idCounter.current++}`;
      const shortcut: RegisteredShortcut = { id, key, callback, options };

      shortcutsRef.current = [...shortcutsRef.current, shortcut];
      setShortcuts(shortcutsRef.current);

      return () => {
        shortcutsRef.current = shortcutsRef.current.filter((s) => s.id !== id);
        setShortcuts(shortcutsRef.current);
      };
    },
    []
  );

  const unregister = useCallback((key: string) => {
    shortcutsRef.current = shortcutsRef.current.filter((s) => s.key !== key);
    setShortcuts(shortcutsRef.current);
  }, []);

  // Global keyboard listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip if in input/textarea
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Still allow certain shortcuts like Escape
        if (event.key !== 'Escape') return;
      }

      for (const shortcut of shortcutsRef.current) {
        if (shortcut.options.enabled === false) continue;

        const parts = parseShortcut(shortcut.key, isMac);
        if (matchesShortcut(event, parts)) {
          if (shortcut.options.preventDefault !== false) {
            event.preventDefault();
          }
          if (shortcut.options.stopPropagation) {
            event.stopPropagation();
          }
          shortcut.callback();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMac]);

  return {
    register,
    unregister,
    shortcuts,
    platform: detectedPlatform,
    isMac,
    formatShortcut,
  };
}
