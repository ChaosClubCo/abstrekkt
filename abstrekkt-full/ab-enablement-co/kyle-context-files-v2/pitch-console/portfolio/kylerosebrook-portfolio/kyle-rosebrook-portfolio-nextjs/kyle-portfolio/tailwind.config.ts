import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Syne", "sans-serif"],
        mono: ["Space Mono", "monospace"],
        body: ["DM Sans", "sans-serif"],
      },
      colors: {
        void: "#040a12",
        surface: "#081422",
        surface2: "#0d1e33",
        cyan: {
          DEFAULT: "#00c8f0",
          dim: "#0093b8",
          glow: "rgba(0,200,240,0.15)",
        },
        slate: {
          text: "#dff2fb",
          muted: "#5a8ea8",
          dim: "#8bb8cc",
        },
      },
      animation: {
        "orb-float": "orbFloat 12s ease-in-out infinite",
        "scroll-pulse": "scrollPulse 2s 1.5s infinite",
        "fade-up": "fadeUp 0.8s forwards",
      },
      keyframes: {
        orbFloat: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(20px,-30px) scale(1.04)" },
          "66%": { transform: "translate(-15px,20px) scale(0.97)" },
        },
        scrollPulse: {
          "0%,100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
        fadeUp: {
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
