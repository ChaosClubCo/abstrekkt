import * as React from "react";
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" };
export function Button({ variant="primary", className="", ...props }: Props) {
  const base = "px-4 py-2 rounded-lg";
  const style = variant === "primary" ? "bg-black text-white" : "bg-transparent border";
  return <button className={`${base} ${style} ${className}`} {...props} />;
}
