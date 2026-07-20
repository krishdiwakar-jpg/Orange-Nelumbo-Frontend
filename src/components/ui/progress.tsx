import type { ReactNode } from "react";

export type ProgressTone = "brand" | "cyan" | "success" | "warning" | "danger";
export type ProgressSize = "sm" | "md";

export interface ProgressProps {
  value: number;
  max?: number;
  label?: ReactNode;
  showValue?: boolean;
  tone?: ProgressTone;
  size?: ProgressSize;
  className?: string;
  "aria-label"?: string;
}

export function Progress({
  value,
  max = 100,
  label,
  showValue = false,
  tone = "brand",
  size = "sm",
  className = "",
  "aria-label": ariaLabel,
}: ProgressProps) {
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
  const safeValue = Number.isFinite(value) ? Math.min(Math.max(value, 0), safeMax) : 0;
  const percent = (safeValue / safeMax) * 100;
  const classes = ["ui-progress", `ui-progress--${tone}`, `ui-progress--${size}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {label || showValue ? (
        <div className="ui-progress__header">
          {label ? <span className="ui-progress__label">{label}</span> : <span />}
          {showValue ? <span className="ui-progress__value">{Math.round(percent)}%</span> : null}
        </div>
      ) : null}
      <div
        aria-label={ariaLabel ?? (typeof label === "string" ? label : "Progress")}
        aria-valuemax={safeMax}
        aria-valuemin={0}
        aria-valuenow={safeValue}
        className="ui-progress__track"
        role="progressbar"
      >
        <div className="ui-progress__fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
