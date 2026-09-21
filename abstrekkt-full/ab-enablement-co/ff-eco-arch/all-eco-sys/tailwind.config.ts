import type { Config } from 'tailwindcss'

/**
 * Abstrekkt Design System — Tailwind Token Bridge
 * version: 1.1.0
 *
 * USAGE:
 *   All values reference CSS custom properties defined in tokens.css.
 *   Never use raw hex values in Tailwind classes — always use semantic names.
 *
 * CRITICAL:
 *   Ensure tokens.css is imported in your global stylesheet before this runs.
 *   Google Fonts must be loaded in <head> separately.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],

  // No dark mode toggle — this system starts from ink. Not a dark-mode inversion.
  darkMode: false,

  theme: {
    // ─── SCREENS — override Tailwind defaults ───────────────────────────────
    screens: {
      sm:  '480px',   // small mobile
      md:  '768px',   // tablet
      lg:  '1080px',  // layout-max threshold
      xl:  '1280px',  // wide desktop
    },

    // ─── COLORS — all values via CSS vars ───────────────────────────────────
    colors: {
      transparent: 'transparent',
      current: 'currentColor',

      // Raw palette
      ink: {
        DEFAULT: 'var(--ink)',
        deep:    'var(--ink-deep)',
      },
      bg: {
        DEFAULT: 'var(--bg)',
        2:       'var(--bg-2)',
        3:       'var(--bg-3)',
      },
      fg: {
        DEFAULT: 'var(--fg)',
        dim:     'var(--fg-dim)',
        mute:    'var(--fg-mute)',
      },
      brass: {
        DEFAULT: 'var(--brass)',
        soft:    'var(--brass-soft)',
        deep:    'var(--brass-deep)',
        bg:      'var(--brass-bg)',
        gate:    'var(--gate)',
      },
      border: {
        DEFAULT: 'var(--border)',
        bright:  'var(--border-bright)',
      },
      rule:         'var(--rule)',
      oxblood:      'var(--oxblood)',
      'oxblood-text':'var(--oxblood-text)',

      // Semantic aliases
      background: {
        base:     'var(--color-bg-base)',
        elevated: 'var(--color-bg-elevated)',
        card:     'var(--color-bg-card)',
        input:    'var(--color-bg-input)',
      },
      text: {
        primary:   'var(--color-text-primary)',
        secondary: 'var(--color-text-secondary)',
        tertiary:  'var(--color-text-tertiary)',
        accent:    'var(--color-text-accent)',
        error:     'var(--color-text-error)',
        disabled:  'var(--color-text-disabled)',
      },
      accent: {
        DEFAULT: 'var(--color-accent)',
        hover:   'var(--color-accent-hover)',
        muted:   'var(--color-accent-muted)',
      },
    },

    // ─── SPACING — 8-point grid ──────────────────────────────────────────────
    spacing: {
      '0':   '0px',
      px:    '1px',
      xs:    'var(--space-xs)',    // 4px
      sm:    'var(--space-sm)',    // 8px
      md:    'var(--space-md)',    // 16px
      lg:    'var(--space-lg)',    // 24px
      xl:    'var(--space-xl)',    // 32px
      '2xl': 'var(--space-2xl)',  // 48px
      '3xl': 'var(--space-3xl)',  // 64px
      '4xl': 'var(--space-4xl)',  // 96px
      // Numeric aliases for padding/margin utilities
      '1': '4px',
      '2': '8px',
      '3': '12px',
      '4': '16px',
      '5': '20px',
      '6': '24px',
      '8': '32px',
      '10': '40px',
      '12': '48px',
      '16': '64px',
      '24': '96px',
    },

    // ─── TYPOGRAPHY ──────────────────────────────────────────────────────────
    fontFamily: {
      serif: ['Fraunces', 'Georgia', 'serif'],
      body:  ['Crimson Pro', 'Georgia', 'serif'],
      mono:  ['JetBrains Mono', 'monospace'],
      sans:  ['Crimson Pro', 'Georgia', 'serif'], // remap "sans" to body serif
    },

    fontWeight: {
      regular:  '400',
      medium:   '500',
      semibold: '600',
    },

    fontSize: {
      'display-xl': ['var(--text-display-xl-size)', {
        lineHeight: '0.96',
        letterSpacing: '-0.02em',
        fontWeight: '500',
      }],
      'display-lg': ['var(--text-display-lg-size)', {
        lineHeight: '1.05',
        letterSpacing: '-0.015em',
      }],
      'h2': ['var(--text-h2-size)', {
        lineHeight: '1.25',
        letterSpacing: '-0.01em',
        fontWeight: '500',
      }],
      'h3': ['var(--text-h3-size)', {
        lineHeight: '1.35',
        letterSpacing: '-0.005em',
        fontWeight: '500',
      }],
      'h4': ['var(--text-h4-size)', {
        lineHeight: '1.4',
      }],
      'body-lg': ['var(--text-body-lg-size)', { lineHeight: '1.75' }],
      'body-md': ['var(--text-body-md-size)', { lineHeight: '1.65' }],
      'body-sm': ['var(--text-body-sm-size)', { lineHeight: '1.6'  }],
      'kicker':  ['var(--text-kicker-size)',  {
        lineHeight: '1',
        letterSpacing: '0.24em',
        fontWeight: '500',
      }],
      'label':   ['var(--text-label-size)',   { lineHeight: '1.4', letterSpacing: '0.08em' }],
      'caption': ['var(--text-caption-size)', { lineHeight: '1.2', letterSpacing: '0.22em' }],
    },

    lineHeight: {
      none:    '1',
      tight:   '1.05',
      display: '0.96',
      heading: '1.25',
      base:    '1.65',
      relaxed: '1.75',
    },

    letterSpacing: {
      tight:   '-0.02em',
      snug:    '-0.015em',
      heading: '-0.01em',
      normal:  '0',
      label:   '0.08em',
      caption: '0.22em',
      kicker:  '0.24em',
    },

    // ─── BORDER RADIUS — square-first ────────────────────────────────────────
    borderRadius: {
      none: 'var(--radius-none)',   // default
      sm:   'var(--radius-sm)',     // pills only
      md:   'var(--radius-md)',     // reserved
      full: '9999px',
    },

    // ─── BOX SHADOW — elevation is borders, not shadows ──────────────────────
    boxShadow: {
      none: 'none',
      // Only for focus rings — not decorative elevation
      focus: '0 0 0 var(--focus-ring-width) var(--focus-ring-color)',
    },

    // ─── CONTAINER ────────────────────────────────────────────────────────────
    maxWidth: {
      content: 'var(--content-max)',   // 640px — reading measure
      layout:  'var(--layout-max)',    // 1080px
      full:    '100%',
    },

    // ─── TRANSITION ──────────────────────────────────────────────────────────
    transitionDuration: {
      instant:  'var(--duration-instant)',
      fast:     'var(--duration-fast)',
      base:     'var(--duration-base)',
      moderate: 'var(--duration-moderate)',
      slow:     'var(--duration-slow)',
    },

    transitionTimingFunction: {
      standard:   'var(--ease-standard)',
      decelerate: 'var(--ease-decelerate)',
      accelerate: 'var(--ease-accelerate)',
      sharp:      'var(--ease-sharp)',
    },

    extend: {
      // Additional utilities not in base theme
      borderColor: {
        DEFAULT: 'var(--color-border-default)',
      },
      ringColor: {
        DEFAULT: 'var(--focus-ring-color)',
        brass:   'var(--brass)',
      },
      ringWidth: {
        DEFAULT: '2px',
      },
      ringOffsetWidth: {
        DEFAULT: '3px',
      },
      ringOffsetColor: {
        DEFAULT: 'var(--ink)',
        card:    'var(--bg-2)',
      },
      opacity: {
        'grain': '0.35',
      },
    },
  },

  plugins: [
    // ─── Custom plugin: Abstrekkt utilities ─────────────────────────────────
    function({ addUtilities }: { addUtilities: (utils: Record<string, Record<string, string>>) => void }) {
      addUtilities({
        '.abstrekkt-kicker': {
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-kicker-size)',
          fontWeight: '500',
          textTransform: 'uppercase',
          letterSpacing: 'var(--text-kicker-ls)',
          color: 'var(--brass)',
          display: 'block',
          marginBottom: '14px',
        },
        '.abstrekkt-card': {
          background: 'var(--color-bg-card)',
          border: 'var(--elevation-default)',
          borderRadius: 'var(--radius-none)',
          padding: 'var(--card-padding)',
          transition: 'border-color var(--transition-base)',
        },
        '.abstrekkt-callout': {
          borderLeft: '2px solid var(--brass-deep)',
          background: 'var(--bg-3)',
          padding: '12px 16px',
          fontStyle: 'italic',
          color: 'var(--color-text-secondary)',
        },
        '.abstrekkt-focus': {
          outline: 'var(--focus-ring)',
          outlineOffset: 'var(--focus-ring-offset)',
        },
        '.abstrekkt-ambient': {
          background: 'radial-gradient(ellipse 70% 40% at 50% -10%, rgba(200,168,106,0.06), transparent 60%), var(--ink)',
        },
      })
    },
  ],
}

export default config
