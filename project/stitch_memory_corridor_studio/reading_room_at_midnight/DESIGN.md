---
name: Reading Room at Midnight
colors:
  surface: '#16130f'
  surface-dim: '#16130f'
  surface-bright: '#3c3933'
  surface-container-lowest: '#100e0a'
  surface-container-low: '#1e1b17'
  surface-container: '#221f1b'
  surface-container-high: '#2d2925'
  surface-container-highest: '#38342f'
  on-surface: '#e9e1da'
  on-surface-variant: '#d0c5b5'
  inverse-surface: '#e9e1da'
  inverse-on-surface: '#33302b'
  outline: '#998f81'
  outline-variant: '#4d463a'
  surface-tint: '#e4c282'
  primary: '#e5c383'
  on-primary: '#402d00'
  primary-container: '#c8a86a'
  on-primary-container: '#533d08'
  inverse-primary: '#745b25'
  secondary: '#ffb3b1'
  on-secondary: '#571d1e'
  secondary-container: '#763535'
  on-secondary-container: '#faa19e'
  tertiary: '#b8c6f3'
  on-tertiary: '#212f53'
  tertiary-container: '#9dabd6'
  on-tertiary-container: '#313f64'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdea2'
  primary-fixed-dim: '#e4c282'
  on-primary-fixed: '#261900'
  on-primary-fixed-variant: '#5a430e'
  secondary-fixed: '#ffdad8'
  secondary-fixed-dim: '#ffb3b1'
  on-secondary-fixed: '#3b080b'
  on-secondary-fixed-variant: '#733333'
  tertiary-fixed: '#dae2ff'
  tertiary-fixed-dim: '#b7c5f2'
  on-tertiary-fixed: '#0a1a3d'
  on-tertiary-fixed-variant: '#38466b'
  background: '#16130f'
  on-background: '#e9e1da'
  surface-variant: '#38342f'
  ink: '#0d0c0a'
  ink-deep: '#080705'
  bg-surface: '#1a1a1d'
  bg-elevated: '#232328'
  bg-nested: '#2c2c33'
  parchment-fg: '#e8e0cc'
  dim-fg: '#94907e'
  mute-fg: '#5e5b50'
  brass-soft: '#d9bd87'
  brass-deep: '#8B7548'
  gate: '#e6cd9a'
  border-default: '#2e2e35'
  border-bright: '#3d3d44'
  hairline: '#252520'
typography:
  display-xl:
    fontFamily: ebGaramond
    fontSize: 80px
    fontWeight: '500'
    lineHeight: '0.96'
    letterSpacing: -0.02em
  display-lg:
    fontFamily: ebGaramond
    fontSize: 52px
    fontWeight: '400'
    lineHeight: '1.05'
    letterSpacing: -0.015em
  headline-h2:
    fontFamily: ebGaramond
    fontSize: 1.4rem
    fontWeight: '500'
    lineHeight: '1.25'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: literata
    fontSize: 1.2rem
    fontWeight: '400'
    lineHeight: '1.75'
  body-md:
    fontFamily: literata
    fontSize: 15px
    fontWeight: '400'
    lineHeight: '1.65'
  body-sm:
    fontFamily: literata
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
  kicker:
    fontFamily: jetbrainsMono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.24em
  label:
    fontFamily: jetbrainsMono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: 0.08em
  caption:
    fontFamily: jetbrainsMono
    fontSize: 9px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: 0.22em
  display-xl-mobile:
    fontFamily: ebGaramond
    fontSize: 48px
    fontWeight: '500'
    lineHeight: '1.0'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  4xl: 96px
  content-width: 640px
  layout-width: 1080px
---

name: Abstrekkt
tagline: "Reading Room at Midnight"
version: "1.0.0"
last-updated: "2026-06-10"

colors:
  Backgrounds:
    ink: "#0d0c0a" # deepest background — body, full-bleed sections
    ink-deep: "#080705" # below-ink depth — used sparingly
    bg: "#1a1a1d" # primary surface
    bg-2: "#232328" # elevated surface — cards, panels
    bg-3: "#2c2c33" # double-elevated — nested cards, inputs
  Foreground:
    fg: "#e8e0cc" # primary text — warm parchment, not pure white
    fg-dim: "#94907e" # secondary text — captions, metadata
    fg-mute: "#5e5b50" # tertiary — timestamps, disabled states
  Borders:
    border: "#2e2e35" # default border
    border-bright: "#3d3d44" # hover/focus border
  Accent:
    brass: "#C8A86A" # primary accent — kickers, links, active states, highlights
    brass-soft: "#d9bd87" # softer brass — hover states, subtle emphasis
    brass-deep: "#8B7548" # deep brass — decorative, secondary labels
    brass-bg: "rgba(200,168,106,0.07)" # tinted surface — selected states, callouts
    gate: "#e6cd9a" # lightest brass — milestone markers
  Semantic:
    oxblood: "#7a3838" # destructive, error, warning — used once per screen max
    rule: "#252520" # horizontal rules, hairlines

typography:
  serif: "Fraunces, Georgia, serif"
  body: "Crimson Pro, Georgia, serif"
  mono: "JetBrains Mono, monospace"
  import: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Crimson+Pro:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@400;500&display=swap"
  
  scale:
    display-xl:
      fontFamily: serif
      fontSize: "clamp(48px, 6.4vw, 80px)"
      fontWeight: 500
      lineHeight: 0.96
      letterSpacing: "-0.02em"
      fontVariation: "'opsz' 144, 'SOFT' 50"
    display-lg:
      fontFamily: serif
      fontSize: "clamp(34px, 4.6vw, 52px)"
      fontWeight: 400
      lineHeight: 1.05
      letterSpacing: "-0.015em"
    h2:
      fontFamily: serif
      fontSize: "1.4rem"
      fontWeight: 500
      lineHeight: 1.25
      letterSpacing: "-0.01em"
    body-lg:
      fontFamily: body
      fontSize: "1.2rem"
      lineHeight: 1.75
    body-md:
      fontFamily: body
      fontSize: "15px"
      lineHeight: 1.65
    body-sm:
      fontFamily: body
      fontSize: "14px"
      lineHeight: 1.6
    kicker:
      fontFamily: mono
      fontSize: "10px"
      fontWeight: 500
      textTransform: uppercase
      letterSpacing: "0.24em"
      color: brass
    label:
      fontFamily: mono
      fontSize: "11px"
      letterSpacing: "0.08em"
    caption:
      fontFamily: mono
      fontSize: "9px"
      letterSpacing: "0.22em"
      textTransform: uppercase
      color: fg-dim

spacing:
  base: "8px"
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  "2xl": "48px"
  "3xl": "64px"
  "4xl": "96px"
  content-max: "640px"
  layout-max: "1080px"

rounded:
  none: "0"
  sm: "4px"
  md: "8px"

elevation:
  default: "1px solid var(--border)"
  raised: "1px solid var(--border-bright)"

effects:
  ambient: "radial-gradient(ellipse 70% 40% at 50% -10%, rgba(200,168,106,0.06), transparent 60%)"
  grain: "url(noise-svg)"
