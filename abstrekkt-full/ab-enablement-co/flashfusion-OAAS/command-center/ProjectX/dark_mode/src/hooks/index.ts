import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Theme, ResolvedTheme, ThemeContextValue } from '../types';

// Default theme colors
export const defaultLightColors = {
  background: '255 255 255',
  foreground: '17 24 39',
  primary: '59 130 246',
  primaryForeground: '255 255 255',
  secondary: '243 244 246',
  secondaryForeground: '17 24 39',
  muted: '243 244 246',
  mutedForeground: '107 114 128',
  accent: '243 244 246',
  accentForeground: '17 24 39',
  destructive: '239 68 68',
  destructiveForeground: '255 255 255',
  border: '229 231 235',
  input: '229 231 235',
  ring: '59 130 246',
};

export const defaultDarkColors = {
  background: '17 24 39',
  foreground: '249 250 251',
  primary: '96 165 250',
  primaryForeground: '17 24 39',
  secondary: '31 41 55',
  secondaryForeground: '249 250 251',
  muted: '31 41 55',
  mutedForeground: '156 163 175',
  accent: '31 41 55',
  accentForeground: '249 250 251',
  destructive: '248 113 113',
  destructiveForeground: '17 24 39',
  border: '55 65 81',
  input: '55 65 81',
  ring: '96 165 250',
};

// Context
export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Hook
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}

// Internal hook for theme management
export function useThemeState(
  defaultTheme: Theme = 'system',
  storageKey: string = 'theme'
) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme;

    const stored = localStorage.getItem(storageKey);
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      return stored as Theme;
    }
    return defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    if (typeof window === 'undefined') return 'light';

    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return theme;
  });

  // Listen to system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setResolvedTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Update resolved theme when theme changes
  useEffect(() => {
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setResolvedTheme(isDark ? 'dark' : 'light');
    } else {
      setResolvedTheme(theme);
    }
  }, [theme]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      localStorage.setItem(storageKey, newTheme);
    },
    [storageKey]
  );

  const toggle = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  return {
    theme,
    setTheme,
    resolvedTheme,
    isDark: resolvedTheme === 'dark',
    isSystem: theme === 'system',
    toggle,
    themes: ['light', 'dark', 'system'] as Theme[],
  };
}

// Hook for system theme detection
export function useSystemTheme(): ResolvedTheme {
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return systemTheme;
}

// Hook for reduced motion preference
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return reducedMotion;
}
