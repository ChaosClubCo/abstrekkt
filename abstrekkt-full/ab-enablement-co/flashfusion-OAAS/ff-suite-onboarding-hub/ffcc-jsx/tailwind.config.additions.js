// ─────────────────────────────────────────────────────────────────────────────
// tailwind.config.js — ADD the following inside theme.extend
// Merge with existing content; do not replace existing keys.
// ─────────────────────────────────────────────────────────────────────────────

// 1. fontFamily — ADD alongside existing entries:
fontFamily: {
  sans:       ['var(--font-sans)',    'sans-serif'],
  mono:       ['var(--font-mono)',    'monospace'],
  display:    ['var(--font-sans)',    'sans-serif'],
  'mono-dm':  ['var(--font-mono-dm)','monospace'],  // ← ADD THIS
},

// 2. colors — ADD inside colors: { ... } alongside existing entries:
colors: {
  // ... existing entries unchanged ...

  // BTA brand
  lime:       'var(--color-lime)',
  'bta-blue': 'var(--color-bta-blue)',
  'bta-bg':   'var(--color-bta-bg)',
  'bta-bg2':  'var(--color-bta-bg2)',
  'bta-bg3':  'var(--color-bta-bg3)',
  'bta-muted':'var(--color-bta-muted)',
},

// 3. keyframes — ADD alongside existing accordion entries:
keyframes: {
  // ... existing accordion keyframes unchanged ...

  'bta-ticker':  { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
  'bta-pulse':   { '0%, 100%': { borderColor: 'rgba(168,255,62,0.10)' }, '50%': { borderColor: 'rgba(168,255,62,0.35)' } },
  'bta-shimmer': { '0%, 100%': { opacity: '0.4' }, '50%': { opacity: '0.8' } },
  'bta-fadeup':  { to: { opacity: '1', transform: 'translateY(0)' } },
},

// 4. animation — ADD alongside existing entries:
animation: {
  // ... existing accordion animations unchanged ...

  'bta-ticker':  'bta-ticker 30s linear infinite',
  'bta-pulse':   'bta-pulse 3s ease infinite',
  'bta-shimmer': 'bta-shimmer 1.5s ease infinite',
  'bta-fadeup':  'bta-fadeup 0.7s ease forwards',
},

// 5. transitionDuration — ADD to support custom 600ms reveal delay:
transitionDuration: {
  600: '600ms',
},


// ─────────────────────────────────────────────────────────────────────────────
// safelist — ADD to existing safelist array:
// ─────────────────────────────────────────────────────────────────────────────
safelist: [
  // ... existing safelist entries unchanged ...

  // BTA
  'bg-lime', 'text-lime', 'border-lime',
  'text-bta-muted', 'bg-bta-bg', 'bg-bta-bg2', 'bg-bta-bg3',
  'text-bta-blue', 'border-bta-blue',
  'animate-bta-ticker', 'animate-bta-pulse', 'animate-bta-shimmer', 'animate-bta-fadeup',
  'font-mono-dm',
  'duration-600',
],
