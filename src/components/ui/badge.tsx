import type { HTMLAttributes } from "react";

export type BadgeTone = "neutral" | "brand" | "cyan" | "success" | "warning" | "danger";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ className = "", tone = "neutral", ...props }: BadgeProps) {
  const classes = ["ui-badge", `ui-badge--${tone}`, className].filter(Boolean).join(" ");
  return <span className={classes} {...props} />;
}
