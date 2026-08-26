import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ff: {
          background: '#0F0618',
          surface: '#1A0A2E',
          border: '#2D1B4E',
          primary: '#A855F7',
          secondary: '#F472B6',
          tertiary: '#22D3EE',
          text: '#F8F8F8',
          muted: '#94A3B8',
          danger: '#EF4444',
          warning: '#F59E0B',
          success: '#10B981',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
    },
  },
};

export default config;
