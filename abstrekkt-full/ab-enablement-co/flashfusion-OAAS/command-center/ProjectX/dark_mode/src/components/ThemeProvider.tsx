import { useEffect, useMemo } from 'react';
import { ThemeContext, useThemeState, defaultLightColors, defaultDarkColors, useReducedMotion } from '../hooks';
import type { ThemeProviderProps, ThemeColors } from '../types';

const TRANSITION_STYLES = `
  *,
  *::before,
  *::after {
    transition: background-color 0.2s ease-in-out,
                border-color 0.2s ease-in-out,
                color 0.2s ease-in-out !important;
  }
`;

function colorsToCSS(colors: ThemeColors): string {
  return Object.entries(colors)
    .map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `--${cssKey}: ${value};`;
    })
    .join('\n    ');
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
  attribute = 'data-theme',
  enableTransitions = true,
  transitionDuration = 200,
  disableTransitionOnChange = false,
  themes,
}: ThemeProviderProps) {
  const themeState = useThemeState(defaultTheme, storageKey);
  const reducedMotion = useReducedMotion();

  const lightColors = useMemo(
    () => ({ ...defaultLightColors, ...themes?.light }),
    [themes?.light]
  );

  const darkColors = useMemo(
    () => ({ ...defaultDarkColors, ...themes?.dark }),
    [themes?.dark]
  );

  // Apply theme attribute to document
  useEffect(() => {
    const root = document.documentElement;

    if (attribute === 'class') {
      root.classList.remove('light', 'dark');
      root.classList.add(themeState.resolvedTheme);
    } else {
      root.setAttribute(attribute, themeState.resolvedTheme);
    }
  }, [themeState.resolvedTheme, attribute]);

  // Apply CSS variables
  useEffect(() => {
    const styleId = 'dark-mode-theme-vars';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    const lightCSS = colorsToCSS(lightColors as ThemeColors);
    const darkCSS = colorsToCSS(darkColors as ThemeColors);

    styleEl.textContent = `
  :root {
    ${lightCSS}
  }

  [data-theme="dark"],
  .dark {
    ${darkCSS}
  }
`;

    return () => {
      styleEl.remove();
    };
  }, [lightColors, darkColors]);

  // Apply transitions
  useEffect(() => {
    if (!enableTransitions || reducedMotion) return;

    const styleId = 'dark-mode-transitions';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = TRANSITION_STYLES.replace('0.2s', `${transitionDuration}ms`);

    return () => {
      if (disableTransitionOnChange) {
        styleEl.remove();
      }
    };
  }, [enableTransitions, transitionDuration, reducedMotion, disableTransitionOnChange]);

  const contextValue = useMemo(() => themeState, [themeState]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}
