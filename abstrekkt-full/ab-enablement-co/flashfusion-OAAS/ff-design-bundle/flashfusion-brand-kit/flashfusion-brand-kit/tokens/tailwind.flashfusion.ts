// FlashFusion Tailwind tokens (merge into tailwind.config.ts)
export const flashFusionTheme = {
  extend: {
    colors: {
      flash: {
        purple: "#A855F7",
        pink: "#F472B6",
        void: "#0F0618",
        carbon: "#120A1F",
        white: "#F8F7FF",
      },
      accent: {
        blue: "#38BDF8",
        mint: "#2DD4BF",
        amber: "#FBBF24",
        red: "#FB7185",
      },
      ff: {
        "slate-200": "#E5E7EB",
        "slate-400": "#9CA3AF",
        "slate-700": "#374151",
      },
    },
    backgroundImage: {
      "ff-hero": "linear-gradient(135deg, #A855F7 0%, #F472B6 50%, #7C3AED 100%)",
      "ff-ambient": "radial-gradient(circle at 30% 20%, rgba(168,85,247,0.35), transparent 60%)",
      "ff-surface": "linear-gradient(180deg, #0F0618 0%, #120A1F 100%)",
    },
    transitionTimingFunction: {
      "ff": "cubic-bezier(0.16, 1, 0.3, 1)",
    },
    transitionDuration: {
      "ff": "180ms",
    },
    boxShadow: {
      "ff-glow": "0 0 0 1px rgba(168,85,247,0.25), 0 10px 30px rgba(168,85,247,0.15)",
    },
    borderRadius: {
      "ff": "16px",
    },
  },
} as const;
