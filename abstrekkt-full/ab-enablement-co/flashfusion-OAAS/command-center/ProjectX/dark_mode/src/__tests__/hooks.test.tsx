import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import {
  useTheme,
  useThemeState,
  useSystemTheme,
  useReducedMotion,
  ThemeContext,
} from '../hooks';
import type { ThemeContextValue } from '../types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

// Mock matchMedia with event listener support
let mediaQueryListeners: Record<string, ((e: MediaQueryListEvent) => void)[]> = {};

const createMatchMedia = (darkMatches: boolean, reducedMotionMatches = false) => {
  return vi.fn().mockImplementation((query: string) => {
    const matches = query.includes('dark')
      ? darkMatches
      : query.includes('reduced-motion')
        ? reducedMotionMatches
        : false;

    return {
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((event: string, cb: (e: MediaQueryListEvent) => void) => {
        if (!mediaQueryListeners[query]) {
          mediaQueryListeners[query] = [];
        }
        mediaQueryListeners[query].push(cb);
      }),
      removeEventListener: vi.fn((event: string, cb: (e: MediaQueryListEvent) => void) => {
        if (mediaQueryListeners[query]) {
          mediaQueryListeners[query] = mediaQueryListeners[query].filter((l) => l !== cb);
        }
      }),
      dispatchEvent: vi.fn(),
    };
  });
};

// Helper to simulate media query change
const simulateMediaQueryChange = (query: string, matches: boolean) => {
  const listeners = mediaQueryListeners[query] || [];
  listeners.forEach((cb) => {
    cb({ matches, media: query } as MediaQueryListEvent);
  });
};

describe('useTheme', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    mediaQueryListeners = {};
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    Object.defineProperty(window, 'matchMedia', { value: createMatchMedia(false) });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should throw error when used outside ThemeContext', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a ThemeProvider');

    consoleError.mockRestore();
  });

  it('should return context value when used within provider', () => {
    const mockContextValue: ThemeContextValue = {
      theme: 'light',
      setTheme: vi.fn(),
      resolvedTheme: 'light',
      isDark: false,
      isSystem: false,
      toggle: vi.fn(),
      themes: ['light', 'dark', 'system'],
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeContext.Provider value={mockContextValue}>{children}</ThemeContext.Provider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe('light');
    expect(result.current.isDark).toBe(false);
    expect(result.current.isSystem).toBe(false);
  });
});

describe('useThemeState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    mediaQueryListeners = {};
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    Object.defineProperty(window, 'matchMedia', { value: createMatchMedia(false) });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initial state', () => {
    it('should default to system theme', () => {
      const { result } = renderHook(() => useThemeState());

      expect(result.current.theme).toBe('system');
      expect(result.current.isSystem).toBe(true);
    });

    it('should use custom default theme', () => {
      const { result } = renderHook(() => useThemeState('dark'));

      expect(result.current.theme).toBe('dark');
      expect(result.current.resolvedTheme).toBe('dark');
      expect(result.current.isDark).toBe(true);
    });

    it('should read theme from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('dark');

      const { result } = renderHook(() => useThemeState());

      expect(result.current.theme).toBe('dark');
    });

    it('should use default if localStorage has invalid value', () => {
      localStorageMock.getItem.mockReturnValue('invalid');

      const { result } = renderHook(() => useThemeState('light'));

      expect(result.current.theme).toBe('light');
    });

    it('should use custom storageKey', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'my-theme') return 'dark';
        return null;
      });

      const { result } = renderHook(() => useThemeState('light', 'my-theme'));

      expect(localStorageMock.getItem).toHaveBeenCalledWith('my-theme');
      expect(result.current.theme).toBe('dark');
    });
  });

  describe('resolved theme', () => {
    it('should resolve light theme directly', () => {
      const { result } = renderHook(() => useThemeState('light'));

      expect(result.current.resolvedTheme).toBe('light');
      expect(result.current.isDark).toBe(false);
    });

    it('should resolve dark theme directly', () => {
      const { result } = renderHook(() => useThemeState('dark'));

      expect(result.current.resolvedTheme).toBe('dark');
      expect(result.current.isDark).toBe(true);
    });

    it('should resolve system theme to dark when system prefers dark', () => {
      Object.defineProperty(window, 'matchMedia', { value: createMatchMedia(true) });

      const { result } = renderHook(() => useThemeState('system'));

      expect(result.current.theme).toBe('system');
      expect(result.current.resolvedTheme).toBe('dark');
      expect(result.current.isDark).toBe(true);
    });

    it('should resolve system theme to light when system prefers light', () => {
      Object.defineProperty(window, 'matchMedia', { value: createMatchMedia(false) });

      const { result } = renderHook(() => useThemeState('system'));

      expect(result.current.theme).toBe('system');
      expect(result.current.resolvedTheme).toBe('light');
      expect(result.current.isDark).toBe(false);
    });
  });

  describe('setTheme', () => {
    it('should update theme state', () => {
      const { result } = renderHook(() => useThemeState('light'));

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.theme).toBe('dark');
      expect(result.current.resolvedTheme).toBe('dark');
    });

    it('should persist to localStorage', () => {
      const { result } = renderHook(() => useThemeState('light'));

      act(() => {
        result.current.setTheme('dark');
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    it('should use custom storageKey for persistence', () => {
      const { result } = renderHook(() => useThemeState('light', 'custom-key'));

      act(() => {
        result.current.setTheme('dark');
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('custom-key', 'dark');
    });

    it('should set theme to system', () => {
      const { result } = renderHook(() => useThemeState('light'));

      act(() => {
        result.current.setTheme('system');
      });

      expect(result.current.theme).toBe('system');
      expect(result.current.isSystem).toBe(true);
    });
  });

  describe('toggle', () => {
    it('should toggle from light to dark', () => {
      const { result } = renderHook(() => useThemeState('light'));

      act(() => {
        result.current.toggle();
      });

      expect(result.current.theme).toBe('dark');
      expect(result.current.isDark).toBe(true);
    });

    it('should toggle from dark to light', () => {
      const { result } = renderHook(() => useThemeState('dark'));

      act(() => {
        result.current.toggle();
      });

      expect(result.current.theme).toBe('light');
      expect(result.current.isDark).toBe(false);
    });

    it('should toggle system theme based on resolved theme', () => {
      Object.defineProperty(window, 'matchMedia', { value: createMatchMedia(true) }); // dark

      const { result } = renderHook(() => useThemeState('system'));

      expect(result.current.resolvedTheme).toBe('dark');

      act(() => {
        result.current.toggle();
      });

      expect(result.current.theme).toBe('light');
    });
  });

  describe('themes list', () => {
    it('should provide list of available themes', () => {
      const { result } = renderHook(() => useThemeState());

      expect(result.current.themes).toEqual(['light', 'dark', 'system']);
    });
  });

  describe('system theme changes', () => {
    it('should respond to system theme change when using system theme', async () => {
      Object.defineProperty(window, 'matchMedia', { value: createMatchMedia(false) });

      const { result } = renderHook(() => useThemeState('system'));

      expect(result.current.resolvedTheme).toBe('light');

      // Simulate system theme change to dark
      act(() => {
        simulateMediaQueryChange('(prefers-color-scheme: dark)', true);
      });

      await waitFor(() => {
        expect(result.current.resolvedTheme).toBe('dark');
      });
    });

    it('should not respond to system theme change when using explicit theme', () => {
      Object.defineProperty(window, 'matchMedia', { value: createMatchMedia(false) });

      const { result } = renderHook(() => useThemeState('dark'));

      expect(result.current.resolvedTheme).toBe('dark');

      // Simulate system theme change
      act(() => {
        simulateMediaQueryChange('(prefers-color-scheme: dark)', false);
      });

      // Should remain dark since we explicitly set dark
      expect(result.current.resolvedTheme).toBe('dark');
    });
  });
});

describe('useSystemTheme', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mediaQueryListeners = {};
    Object.defineProperty(window, 'matchMedia', { value: createMatchMedia(false) });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return light when system prefers light', () => {
    Object.defineProperty(window, 'matchMedia', { value: createMatchMedia(false) });

    const { result } = renderHook(() => useSystemTheme());

    expect(result.current).toBe('light');
  });

  it('should return dark when system prefers dark', () => {
    Object.defineProperty(window, 'matchMedia', { value: createMatchMedia(true) });

    const { result } = renderHook(() => useSystemTheme());

    expect(result.current).toBe('dark');
  });

  it('should update when system preference changes', async () => {
    Object.defineProperty(window, 'matchMedia', { value: createMatchMedia(false) });

    const { result } = renderHook(() => useSystemTheme());

    expect(result.current).toBe('light');

    act(() => {
      simulateMediaQueryChange('(prefers-color-scheme: dark)', true);
    });

    await waitFor(() => {
      expect(result.current).toBe('dark');
    });
  });
});

describe('useReducedMotion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mediaQueryListeners = {};
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return false when reduced motion is not preferred', () => {
    Object.defineProperty(window, 'matchMedia', { value: createMatchMedia(false, false) });

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(false);
  });

  it('should return true when reduced motion is preferred', () => {
    Object.defineProperty(window, 'matchMedia', { value: createMatchMedia(false, true) });

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(true);
  });

  it('should update when reduced motion preference changes', async () => {
    Object.defineProperty(window, 'matchMedia', { value: createMatchMedia(false, false) });

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(false);

    act(() => {
      simulateMediaQueryChange('(prefers-reduced-motion: reduce)', true);
    });

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });
});

describe('edge cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    mediaQueryListeners = {};
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    Object.defineProperty(window, 'matchMedia', { value: createMatchMedia(false) });
  });

  it('should handle rapid theme changes', () => {
    const { result } = renderHook(() => useThemeState('light'));

    act(() => {
      result.current.setTheme('dark');
      result.current.setTheme('system');
      result.current.setTheme('light');
    });

    expect(result.current.theme).toBe('light');
  });

  it('should handle multiple toggle calls', () => {
    const { result } = renderHook(() => useThemeState('light'));

    act(() => {
      result.current.toggle();
    });
    expect(result.current.isDark).toBe(true);

    act(() => {
      result.current.toggle();
    });
    expect(result.current.isDark).toBe(false);

    act(() => {
      result.current.toggle();
    });
    expect(result.current.isDark).toBe(true);
  });

  it('should handle localStorage read failure gracefully', () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('localStorage access denied');
    });

    // Should not throw, should use default
    const { result } = renderHook(() => useThemeState('light'));

    expect(result.current.theme).toBe('light');
  });
});
