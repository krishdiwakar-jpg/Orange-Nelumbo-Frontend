import type { HTMLAttributes } from "react";

export type CardVariant = "default" | "priority" | "subtle";
export type CardElement = "div" | "article" | "section";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: CardElement;
  variant?: CardVariant;
  interactive?: boolean;
}

export function Card({
  as: Component = "div",
  className = "",
  interactive = false,
  variant = "default",
  ...props
}: CardProps) {
  const classes = [
    "ui-card",
    `ui-card--${variant}`,
    interactive ? "ui-card--interactive" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <Component className={classes} {...props} />;
}
