import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
  children: ReactNode;
};

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: "primary" | "ghost";
  children: ReactNode;
};

/**
 * FlashFusion clipped-corner CTA button.
 * Primary variant: solid neon bg on void text, cyberpunk cut corners.
 * Ghost variant: outline only.
 */
export function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps | ButtonLinkProps) {
  const base =
    "btn-clipped font-mono text-xs tracking-mono uppercase font-bold px-8 py-3 transition-all duration-200 cursor-pointer";

  const styles = {
    primary:
      "bg-neon text-void shadow-glow-sm hover:bg-flash hover:shadow-glow-md",
    ghost:
      "bg-transparent text-ice border border-neon/40 hover:border-neon hover:text-white",
  };

  const classes = `${base} ${styles[variant]} ${className}`;

  if ("href" in props) {
    return (
      <Link className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
