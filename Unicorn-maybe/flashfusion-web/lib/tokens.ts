/**
 * FlashFusion Design Tokens
 * Extracted directly from flashfusion-v2.html :root CSS variables.
 * These are the canonical design tokens for the FlashFusion brand.
 */

export const colors = {
  /** Deep void black — primary background */
  void: "#03000a",
  /** Neon purple — primary accent, glows */
  neon: "#bf00ff",
  /** Flash magenta — hover/active accent */
  flash: "#e040fb",
  /** Purple-600 — deeper purple for gradients and orbs */
  purple600: "#7b00ff",
  /** Soft white — primary text */
  white: "#f8f0ff",
  /** Ice lavender — secondary text */
  ice: "#e8d5ff",
} as const;

export const glows = {
  sm: "0 0 12px rgba(191,0,255,0.6)",
  md: "0 0 32px rgba(191,0,255,0.5), 0 0 80px rgba(191,0,255,0.2)",
  lg: "0 0 60px rgba(191,0,255,0.7), 0 0 120px rgba(191,0,255,0.3)",
} as const;

export const fonts = {
  /** Headings — bold, caps, tech feel */
  display: "'Syncopate', sans-serif",
  /** Monospace — labels, eyebrows, code */
  mono: "'Space Mono', monospace",
  /** Body text */
  body: "'Syne', sans-serif",
} as const;

export const gradients = {
  /** FUSION word gradient */
  fusion: "linear-gradient(135deg, #bf00ff 0%, #e040fb 55%, #7b00ff 100%)",
  /** Hero divider */
  divider:
    "linear-gradient(90deg, transparent, #bf00ff, #e040fb, transparent)",
} as const;

export type ColorToken = keyof typeof colors;
export type GlowToken = keyof typeof glows;
