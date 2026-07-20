import type { HTMLAttributes, ReactNode } from "react";

export interface SectionHeaderProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  kicker?: string;
  title: ReactNode;
  description?: ReactNode;
  level?: 1 | 2 | 3;
  align?: "left" | "center";
  action?: ReactNode;
}

export function SectionHeader({
  action,
  align = "left",
  className = "",
  description,
  kicker,
  level = 2,
  title,
  ...props
}: SectionHeaderProps) {
  const Heading = `h${level}` as "h1" | "h2" | "h3";
  const classes = ["ui-section-header", `ui-section-header--${align}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={classes} {...props}>
      <div className="ui-section-header__copy">
        {kicker ? <p className="mono-kicker">{kicker}</p> : null}
        <Heading className="ui-section-header__title">{title}</Heading>
        {description ? <div className="ui-section-header__description">{description}</div> : null}
      </div>
      {action ? <div className="ui-section-header__action">{action}</div> : null}
    </header>
  );
}
