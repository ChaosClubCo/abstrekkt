import type { Config } from "tailwindcss";
import { colors, glows, fonts } from "./lib/tokens";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: colors.void,
        neon: colors.neon,
        flash: colors.flash,
        "purple-600": colors.purple600,
        ice: colors.ice,
        // Override default white with soft-white for brand consistency
        white: colors.white,
      },
      fontFamily: {
        display: ["var(--font-syncopate)", fonts.display],
        mono: ["var(--font-space-mono)", fonts.mono],
        body: ["var(--font-syne)", fonts.body],
      },
      boxShadow: {
        "glow-sm": glows.sm,
        "glow-md": glows.md,
        "glow-lg": glows.lg,
      },
      backgroundImage: {
        "gradient-fusion":
          "linear-gradient(135deg, #bf00ff 0%, #e040fb 55%, #7b00ff 100%)",
        "gradient-divider":
          "linear-gradient(90deg, transparent, #bf00ff, #e040fb, transparent)",
      },
      letterSpacing: {
        mono: "0.2em",
        eyebrow: "0.34em",
      },
    },
  },
  plugins: [],
};

export default config;
