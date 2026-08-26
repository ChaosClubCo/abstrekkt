export type Theme = 'light' | 'dark' | 'system';

export type ResolvedTheme = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  card?: string;
  cardForeground?: string;
  popover?: string;
  popoverForeground?: string;
}

export interface ThemeConfig {
  defaultTheme: Theme;
  storageKey: string;
  attribute: 'class' | 'data-theme';
  enableTransitions: boolean;
  transitionDuration: number;
  disableTransitionOnChange: boolean;
  themes: {
    light: ThemeColors;
    dark: ThemeColors;
  };
}

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: ResolvedTheme;
  isDark: boolean;
  isSystem: boolean;
  toggle: () => void;
  themes: Theme[];
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: 'class' | 'data-theme';
  enableTransitions?: boolean;
  transitionDuration?: number;
  disableTransitionOnChange?: boolean;
  themes?: {
    light?: Partial<ThemeColors>;
    dark?: Partial<ThemeColors>;
  };
}

export interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export interface ThemeSwitcherProps {
  className?: string;
  showLabel?: boolean;
  align?: 'start' | 'center' | 'end';
}
