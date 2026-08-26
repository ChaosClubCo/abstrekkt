import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#3b82f6",
          "primary-dark": "#2563eb",
          "primary-light": "#60a5fa",
          secondary: "#64748b",
          accent: "#10b981",
        },
        feedback: {
          success: "#10b981",
          warning: "#f59e0b",
          error: "#ef4444",
          info: "#3b82f6",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Consolas", "monospace"],
      },
      fontSize: {
        display: ["3rem", { lineHeight: "3.5rem" }],
        h1: ["2.5rem", { lineHeight: "3rem" }],
        h2: ["2rem", { lineHeight: "2.5rem" }],
        h3: ["1.5rem", { lineHeight: "2rem" }],
        h4: ["1.25rem", { lineHeight: "1.75rem" }],
      },
      boxShadow: {
        focus: "0 0 0 3px rgba(59, 130, 246, 0.5)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};

export default config;
