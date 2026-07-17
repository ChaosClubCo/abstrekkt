import React from "react";

type Size = "sm" | "md" | "lg";

export type PoweredByFlashFusionProps = {
  size?: Size;
  className?: string;
  /**
   * Use when the badge is clickable (e.g., link to flashfusion.co).
   * Ensure the URL is trusted and not user-provided to avoid open-redirect issues.
   */
  href?: string;
  /** For accessibility; defaults to "Powered by FlashFusion". */
  ariaLabel?: string;
};

const SIZE: Record<Size, { container: string; icon: number; text: string; subtext: string; radius: string; pad: string }> = {
  sm: { container: "h-10", icon: 18, text: "text-sm", subtext: "text-[11px]", radius: "rounded-xl", pad: "px-3" },
  md: { container: "h-12", icon: 22, text: "text-base", subtext: "text-xs", radius: "rounded-2xl", pad: "px-4" },
  lg: { container: "h-14", icon: 26, text: "text-lg", subtext: "text-sm", radius: "rounded-2xl", pad: "px-5" },
};

function Mark({ size }: { size: Size }) {
  const px = SIZE[size].icon;
  return (
    <svg
      width={px * 2}
      height={px * 2}
      viewBox="0 0 120 120"
      aria-hidden="true"
      focusable="false"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="ffHero" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="50%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="52" fill="url(#ffHero)" />
      <path d="M60 24 L78 60 L60 96 L42 60 Z" fill="#0F0618" opacity="0.85" />
    </svg>
  );
}

/**
 * PoweredByFlashFusion
 * - Dark-mode friendly badge for embeds and partner pages.
 * - No heavy SVG filters; glow is done via layered CSS gradients and shadows for performance.
 */
export function PoweredByFlashFusion({
  size = "md",
  className,
  href,
  ariaLabel = "Powered by FlashFusion",
}: PoweredByFlashFusionProps) {
  const s = SIZE[size];

  const core =
    "inline-flex items-center gap-3 border border-[rgba(168,85,247,0.40)] bg-[#0F0618] " +
    "shadow-[0_0_0_1px_rgba(168,85,247,0.18),0_10px_30px_rgba(168,85,247,0.12)] " +
    "relative overflow-hidden select-none";

  const glow =
    "before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.35),transparent_60%)] before:opacity-100";

  const body = (
    <span
      className={[
        core,
        glow,
        s.container,
        s.radius,
        s.pad,
        className ?? "",
      ].join(" ")}
      aria-label={ariaLabel}
    >
      <span className="relative z-10 flex items-center gap-3">
        <Mark size={size} />
        <span className="leading-none">
          <span className={["block text-[#9CA3AF] font-normal", s.subtext].join(" ")}>powered by</span>
          <span
            className={[
              "block font-semibold tracking-tight bg-clip-text text-transparent",
              "bg-[linear-gradient(135deg,#A855F7_0%,#F472B6_50%,#7C3AED_100%)]",
              s.text,
            ].join(" ")}
          >
            FlashFusion
          </span>
        </span>
      </span>
    </span>
  );

  if (!href) return body;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex"
      aria-label={ariaLabel}
    >
      {body}
    </a>
  );
}
