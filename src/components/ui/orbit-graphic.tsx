import type { HTMLAttributes } from "react";

export interface OrbitGraphicProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  size?: number;
  intensity?: "subtle" | "normal";
  ariaHidden?: boolean;
  label?: string;
}

export function OrbitGraphic({
  ariaHidden = true,
  className = "",
  intensity = "normal",
  label = "Orbital telemetry graphic",
  size = 320,
  style,
  ...props
}: OrbitGraphicProps) {
  const classes = [
    "orbit-graphic",
    intensity === "subtle" ? "orbit-graphic--subtle" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      aria-hidden={ariaHidden || undefined}
      aria-label={ariaHidden ? undefined : label}
      className={classes}
      role={ariaHidden ? undefined : "img"}
      style={{ width: size, ...style }}
      {...props}
    >
      <span className="orbit-graphic__node" />
    </div>
  );
}
