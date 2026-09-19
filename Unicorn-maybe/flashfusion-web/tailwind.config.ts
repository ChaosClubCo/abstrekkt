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
        ink: "#101216",
        surface: "#16181d",
        "surface-2": "#1c1f25",
        paper: "#f2efe7",
        "paper-dim": "#a9a599",
        "paper-faint": "#6b675c",
        ember: "#cf5a32",
        "ember-bright": "#de7449",
        "ember-dim": "rgba(207, 90, 50, 0.14)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "'JetBrains Mono'", "monospace"],
        body: ["var(--font-body)", "Georgia", "serif"],
        syncopate: ["var(--font-syncopate)", fonts.display],
        spaceMono: ["var(--font-space-mono)", fonts.mono],
        syne: ["var(--font-syne)", fonts.body],
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
