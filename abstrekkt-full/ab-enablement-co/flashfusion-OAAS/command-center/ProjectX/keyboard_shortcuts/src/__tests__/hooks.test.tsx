import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import {
  useShortcutsContext,
  useCommandPalette,
  useShortcutGuide,
  useShortcutsState,
  useCommandPaletteState,
  ShortcutsContext,
  CommandPaletteContext,
  ShortcutGuideContext,
} from '../hooks';
import type { ShortcutsContextValue, CommandPaletteContextValue, ShortcutGuideContextValue } from '../types';

// Mock navigator for platform detection
const setUserAgent = (ua: string) => {
  Object.defineProperty(navigator, 'userAgent', {
    value: ua,
    configurable: true,
  });
};

describe('useShortcutsState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('platform detection', () => {
    it('should detect Windows platform', () => {
      setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');

      const { result } = renderHook(() => useShortcutsState('auto'));

      expect(result.current.platform).toBe('windows');
      expect(result.current.isMac).toBe(false);
    });

    it('should detect Mac platform', () => {
      setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)');

      const { result } = renderHook(() => useShortcutsState('auto'));

      expect(result.current.platform).toBe('mac');
      expect(result.current.isMac).toBe(true);
    });

    it('should detect Linux platform', () => {
      setUserAgent('Mozilla/5.0 (X11; Linux x86_64)');

      const { result } = renderHook(() => useShortcutsState('auto'));

      expect(result.current.platform).toBe('linux');
      expect(result.current.isMac).toBe(false);
    });

    it('should use explicit platform when provided', () => {
      setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');

      const { result } = renderHook(() => useShortcutsState('mac'));

      expect(result.current.platform).toBe('mac');
      expect(result.current.isMac).toBe(true);
    });
  });

  describe('shortcut registration', () => {
    it('should register a shortcut', () => {
      const { result } = renderHook(() => useShortcutsState());

      act(() => {
        result.current.register('ctrl+s', vi.fn(), { description: 'Save' });
      });

      expect(result.current.shortcuts).toHaveLength(1);
      expect(result.current.shortcuts[0].key).toBe('ctrl+s');
    });

    it('should unregister via returned cleanup function', () => {
      const { result } = renderHook(() => useShortcutsState());

      let unregister: () => void;
      act(() => {
        unregister = result.current.register('ctrl+s', vi.fn(), {});
      });

      expect(result.current.shortcuts).toHaveLength(1);

      act(() => {
        unregister();
      });

      expect(result.current.shortcuts).toHaveLength(0);
    });

    it('should unregister by key', () => {
      const { result } = renderHook(() => useShortcutsState());

      act(() => {
        result.current.register('ctrl+s', vi.fn(), {});
        result.current.register('ctrl+o', vi.fn(), {});
      });

      expect(result.current.shortcuts).toHaveLength(2);

      act(() => {
        result.current.unregister('ctrl+s');
      });

      expect(result.current.shortcuts).toHaveLength(1);
      expect(result.current.shortcuts[0].key).toBe('ctrl+o');
    });

    it('should allow multiple shortcuts', () => {
      const { result } = renderHook(() => useShortcutsState());

      act(() => {
        result.current.register('ctrl+s', vi.fn(), { description: 'Save' });
        result.current.register('ctrl+n', vi.fn(), { description: 'New' });
        result.current.register('ctrl+o', vi.fn(), { description: 'Open' });
      });

      expect(result.current.shortcuts).toHaveLength(3);
    });
  });

  describe('shortcut formatting', () => {
    it('should format shortcuts for Windows', () => {
      setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');

      const { result } = renderHook(() => useShortcutsState('windows'));

      expect(result.current.formatShortcut('mod+k')).toBe('Ctrl+K');
      expect(result.current.formatShortcut('ctrl+shift+s')).toBe('Ctrl+Shift+S');
      expect(result.current.formatShortcut('alt+enter')).toBe('Alt+Enter');
      expect(result.current.formatShortcut('escape')).toBe('Esc');
    });

    it('should format shortcuts for Mac', () => {
      setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)');

      const { result } = renderHook(() => useShortcutsState('mac'));

      expect(result.current.formatShortcut('mod+k')).toBe('\u2318K');
      expect(result.current.formatShortcut('ctrl+shift+s')).toBe('\u2303\u21e7S');
      expect(result.current.formatShortcut('alt+enter')).toBe('\u2325\u21b5');
      expect(result.current.formatShortcut('escape')).toBe('Esc');
    });

    it('should format special keys', () => {
      const { result } = renderHook(() => useShortcutsState('windows'));

      expect(result.current.formatShortcut('arrowup')).toBe('\u2191');
      expect(result.current.formatShortcut('arrowdown')).toBe('\u2193');
      expect(result.current.formatShortcut('arrowleft')).toBe('\u2190');
      expect(result.current.formatShortcut('arrowright')).toBe('\u2192');
      expect(result.current.formatShortcut('backspace')).toBe('Backspace');
      expect(result.current.formatShortcut('tab')).toBe('Tab');
      expect(result.current.formatShortcut('space')).toBe('Space');
    });
  });

  describe('keyboard event handling', () => {
    it('should call callback when shortcut is pressed', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => useShortcutsState('windows'));

      act(() => {
        result.current.register('ctrl+s', callback, {});
      });

      // Simulate keydown
      const event = new KeyboardEvent('keydown', {
        key: 's',
        ctrlKey: true,
        bubbles: true,
      });
      window.dispatchEvent(event);

      expect(callback).toHaveBeenCalled();
    });

    it('should not call callback for disabled shortcuts', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => useShortcutsState('windows'));

      act(() => {
        result.current.register('ctrl+s', callback, { enabled: false });
      });

      const event = new KeyboardEvent('keydown', {
        key: 's',
        ctrlKey: true,
        bubbles: true,
      });
      window.dispatchEvent(event);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should prevent default when preventDefault option is true', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => useShortcutsState('windows'));

      act(() => {
        result.current.register('ctrl+s', callback, { preventDefault: true });
      });

      const event = new KeyboardEvent('keydown', {
        key: 's',
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      });

      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      window.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should stop propagation when stopPropagation option is true', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => useShortcutsState('windows'));

      act(() => {
        result.current.register('ctrl+s', callback, { stopPropagation: true });
      });

      const event = new KeyboardEvent('keydown', {
        key: 's',
        ctrlKey: true,
        bubbles: true,
      });

      const stopPropagationSpy = vi.spyOn(event, 'stopPropagation');
      window.dispatchEvent(event);

      expect(stopPropagationSpy).toHaveBeenCalled();
    });
  });
});

describe('useCommandPaletteState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should be closed initially', () => {
      const { result } = renderHook(() => useCommandPaletteState());

      expect(result.current.isOpen).toBe(false);
    });

    it('should have empty commands initially', () => {
      const { result } = renderHook(() => useCommandPaletteState());

      expect(result.current.commands).toEqual([]);
    });

    it('should have empty search initially', () => {
      const { result } = renderHook(() => useCommandPaletteState());

      expect(result.current.search).toBe('');
    });

    it('should have selectedIndex at 0 initially', () => {
      const { result } = renderHook(() => useCommandPaletteState());

      expect(result.current.selectedIndex).toBe(0);
    });
  });

  describe('open/close/toggle', () => {
    it('should open palette', () => {
      const { result } = renderHook(() => useCommandPaletteState());

      act(() => {
        result.current.open();
      });

      expect(result.current.isOpen).toBe(true);
    });

    it('should close palette', () => {
      const { result } = renderHook(() => useCommandPaletteState());

      act(() => {
        result.current.open();
      });

      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.close();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('should toggle palette', () => {
      const { result } = renderHook(() => useCommandPaletteState());

      act(() => {
        result.current.toggle();
      });

      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.toggle();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('should reset search and selectedIndex on close', () => {
      const { result } = renderHook(() => useCommandPaletteState());

      act(() => {
        result.current.open();
        result.current.setSearch('test');
        result.current.setSelectedIndex(5);
      });

      expect(result.current.search).toBe('test');
      expect(result.current.selectedIndex).toBe(5);

      act(() => {
        result.current.close();
      });

      expect(result.current.search).toBe('');
      expect(result.current.selectedIndex).toBe(0);
    });
  });

  describe('command registration', () => {
    it('should register a command', () => {
      const { result } = renderHook(() => useCommandPaletteState());

      act(() => {
        result.current.registerCommand({
          id: 'test',
          title: 'Test Command',
          action: vi.fn(),
        });
      });

      expect(result.current.commands).toHaveLength(1);
      expect(result.current.commands[0].title).toBe('Test Command');
    });

    it('should not register duplicate command IDs', () => {
      const { result } = renderHook(() => useCommandPaletteState());

      act(() => {
        result.current.registerCommand({ id: 'test', title: 'First', action: vi.fn() });
        result.current.registerCommand({ id: 'test', title: 'Second', action: vi.fn() });
      });

      expect(result.current.commands).toHaveLength(1);
      expect(result.current.commands[0].title).toBe('First');
    });

    it('should unregister a command', () => {
      const { result } = renderHook(() => useCommandPaletteState());

      act(() => {
        result.current.registerCommand({ id: 'test1', title: 'First', action: vi.fn() });
        result.current.registerCommand({ id: 'test2', title: 'Second', action: vi.fn() });
      });

      expect(result.current.commands).toHaveLength(2);

      act(() => {
        result.current.unregisterCommand('test1');
      });

      expect(result.current.commands).toHaveLength(1);
      expect(result.current.commands[0].id).toBe('test2');
    });
  });

  describe('filtering', () => {
    it('should return all commands when search is empty', () => {
      const { result } = renderHook(() => useCommandPaletteState());

      act(() => {
        result.current.registerCommand({ id: 'test1', title: 'First', action: vi.fn() });
        result.current.registerCommand({ id: 'test2', title: 'Second', action: vi.fn() });
      });

      expect(result.current.filteredCommands).toHaveLength(2);
    });

    it('should filter by title', () => {
      const { result } = renderHook(() => useCommandPaletteState());

      act(() => {
        result.current.registerCommand({ id: 'test1', title: 'Save File', action: vi.fn() });
        result.current.registerCommand({ id: 'test2', title: 'Open File', action: vi.fn() });
        result.current.registerCommand({ id: 'test3', title: 'Close All', action: vi.fn() });
      });

      act(() => {
        result.current.setSearch('file');
      });

      expect(result.current.filteredCommands).toHaveLength(2);
      expect(result.current.filteredCommands.map((c) => c.title)).toContain('Save File');
      expect(result.current.filteredCommands.map((c) => c.title)).toContain('Open File');
    });

    it('should filter by description', () => {
      const { result } = renderHook(() => useCommandPaletteState());

      act(() => {
        result.current.registerCommand({
          id: 'test1',
          title: 'Command 1',
          description: 'Saves the document',
          action: vi.fn(),
        });
        result.current.registerCommand({
          id: 'test2',
          title: 'Command 2',
          description: 'Opens a document',
          action: vi.fn(),
        });
      });

      act(() => {
        result.current.setSearch('saves');
      });

      expect(result.current.filteredCommands).toHaveLength(1);
      expect(result.current.filteredCommands[0].id).toBe('test1');
    });

    it('should filter by keywords', () => {
      const { result } = renderHook(() => useCommandPaletteState());

      act(() => {
        result.current.registerCommand({
          id: 'test1',
          title: 'Git Commit',
          keywords: ['save', 'version'],
          action: vi.fn(),
        });
        result.current.registerCommand({
          id: 'test2',
          title: 'Git Push',
          keywords: ['upload', 'remote'],
          action: vi.fn(),
        });
      });

      act(() => {
        result.current.setSearch('version');
      });

      expect(result.current.filteredCommands).toHaveLength(1);
      expect(result.current.filteredCommands[0].id).toBe('test1');
    });

    it('should be case insensitive', () => {
      const { result } = renderHook(() => useCommandPaletteState());

      act(() => {
        result.current.registerCommand({ id: 'test1', title: 'SAVE FILE', action: vi.fn() });
      });

      act(() => {
        result.current.setSearch('save');
      });

      expect(result.current.filteredCommands).toHaveLength(1);
    });
  });

  describe('execute selected', () => {
    it('should execute selected command and close palette', () => {
      const action = vi.fn();
      const { result } = renderHook(() => useCommandPaletteState());

      act(() => {
        result.current.registerCommand({ id: 'test', title: 'Test', action });
        result.current.open();
      });

      act(() => {
        result.current.executeSelected();
      });

      expect(action).toHaveBeenCalled();
      expect(result.current.isOpen).toBe(false);
    });

    it('should execute correct command based on selectedIndex', () => {
      const action1 = vi.fn();
      const action2 = vi.fn();
      const { result } = renderHook(() => useCommandPaletteState());

      act(() => {
        result.current.registerCommand({ id: 'test1', title: 'First', action: action1 });
        result.current.registerCommand({ id: 'test2', title: 'Second', action: action2 });
        result.current.open();
        result.current.setSelectedIndex(1);
      });

      act(() => {
        result.current.executeSelected();
      });

      expect(action1).not.toHaveBeenCalled();
      expect(action2).toHaveBeenCalled();
    });

    it('should do nothing if no commands', () => {
      const { result } = renderHook(() => useCommandPaletteState());

      act(() => {
        result.current.open();
      });

      // Should not throw
      act(() => {
        result.current.executeSelected();
      });

      expect(result.current.isOpen).toBe(true); // Still open since nothing was executed
    });
  });
});

describe('context hooks', () => {
  describe('useShortcutsContext', () => {
    it('should throw when used outside provider', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useShortcutsContext());
      }).toThrow('useShortcutsContext must be used within ShortcutsProvider');

      consoleError.mockRestore();
    });

    it('should return context value when used within provider', () => {
      const mockValue: ShortcutsContextValue = {
        register: vi.fn(),
        unregister: vi.fn(),
        shortcuts: [],
        platform: 'windows',
        isMac: false,
        formatShortcut: vi.fn(),
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ShortcutsContext.Provider value={mockValue}>{children}</ShortcutsContext.Provider>
      );

      const { result } = renderHook(() => useShortcutsContext(), { wrapper });

      expect(result.current.platform).toBe('windows');
      expect(result.current.isMac).toBe(false);
    });
  });

  describe('useCommandPalette', () => {
    it('should throw when used outside provider', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useCommandPalette());
      }).toThrow('useCommandPalette must be used within ShortcutsProvider');

      consoleError.mockRestore();
    });

    it('should return context value when used within provider', () => {
      const mockValue: CommandPaletteContextValue = {
        isOpen: true,
        open: vi.fn(),
        close: vi.fn(),
        toggle: vi.fn(),
        registerCommand: vi.fn(),
        unregisterCommand: vi.fn(),
        commands: [],
        search: '',
        setSearch: vi.fn(),
        filteredCommands: [],
        selectedIndex: 0,
        setSelectedIndex: vi.fn(),
        executeSelected: vi.fn(),
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CommandPaletteContext.Provider value={mockValue}>{children}</CommandPaletteContext.Provider>
      );

      const { result } = renderHook(() => useCommandPalette(), { wrapper });

      expect(result.current.isOpen).toBe(true);
    });
  });

  describe('useShortcutGuide', () => {
    it('should throw when used outside provider', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useShortcutGuide());
      }).toThrow('useShortcutGuide must be used within ShortcutsProvider');

      consoleError.mockRestore();
    });

    it('should return context value when used within provider', () => {
      const mockValue: ShortcutGuideContextValue = {
        isOpen: true,
        open: vi.fn(),
        close: vi.fn(),
        shortcuts: [],
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ShortcutGuideContext.Provider value={mockValue}>{children}</ShortcutGuideContext.Provider>
      );

      const { result } = renderHook(() => useShortcutGuide(), { wrapper });

      expect(result.current.isOpen).toBe(true);
    });
  });
});

describe('edge cases', () => {
  it('should handle rapid command registration/unregistration', () => {
    const { result } = renderHook(() => useCommandPaletteState());

    act(() => {
      for (let i = 0; i < 100; i++) {
        result.current.registerCommand({ id: `cmd-${i}`, title: `Command ${i}`, action: vi.fn() });
      }
    });

    expect(result.current.commands).toHaveLength(100);

    act(() => {
      for (let i = 0; i < 50; i++) {
        result.current.unregisterCommand(`cmd-${i}`);
      }
    });

    expect(result.current.commands).toHaveLength(50);
  });

  it('should handle rapid open/close cycles', () => {
    const { result } = renderHook(() => useCommandPaletteState());

    act(() => {
      for (let i = 0; i < 10; i++) {
        result.current.toggle();
      }
    });

    // Should end up closed (even number of toggles)
    expect(result.current.isOpen).toBe(false);
  });

  it('should handle empty search gracefully', () => {
    const { result } = renderHook(() => useCommandPaletteState());

    act(() => {
      result.current.registerCommand({ id: 'test', title: 'Test', action: vi.fn() });
      result.current.setSearch('');
    });

    expect(result.current.filteredCommands).toHaveLength(1);
  });

  it('should handle whitespace-only search', () => {
    const { result } = renderHook(() => useCommandPaletteState());

    act(() => {
      result.current.registerCommand({ id: 'test', title: 'Test', action: vi.fn() });
      result.current.setSearch('   ');
    });

    // Whitespace is not empty, so it should filter
    expect(result.current.filteredCommands).toHaveLength(0);
  });
});
