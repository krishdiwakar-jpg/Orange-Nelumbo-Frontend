import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingLabel?: ReactNode;
}

export function Button({
  children,
  className = "",
  disabled,
  fullWidth = false,
  isLoading = false,
  loadingLabel = "Working…",
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const classes = [
    "ui-button",
    `ui-button--${variant}`,
    `ui-button--${size}`,
    fullWidth ? "ui-button--full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      aria-busy={isLoading || undefined}
      className={classes}
      disabled={disabled || isLoading}
      type={type}
      {...props}
    >
      {isLoading ? <span aria-hidden="true" className="ui-button__spinner" /> : null}
      {isLoading ? loadingLabel : children}
    </button>
  );
}
