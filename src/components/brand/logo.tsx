import Image from "next/image";
import Link from "next/link";

import lotusMark from "../../../assets/lotus.png";

export interface LogoProps {
  compact?: boolean;
  className?: string;
  href?: string;
}

function LogoLockup({ compact = false }: Pick<LogoProps, "compact">) {
  return (
    <span
      aria-label={compact ? "Orange Nelumbo" : undefined}
      className={`brand-logo${compact ? " brand-logo--compact" : ""}`}
      role={compact ? "img" : undefined}
    >
      <span aria-hidden="true" className="brand-logo__mark">
        <Image
          alt=""
          className="brand-logo__image"
          height={185}
          priority
          src={lotusMark}
          width={210}
        />
      </span>
      {!compact ? <span className="brand-logo__wordmark">Orange Nelumbo</span> : null}
    </span>
  );
}

export function Logo({ compact = false, className = "", href }: LogoProps) {
  const content = <LogoLockup compact={compact} />;
  const classes = ["brand-logo-link", className].filter(Boolean).join(" ");

  if (href) {
    return (
      <Link aria-label="Orange Nelumbo home" className={classes} href={href}>
        {content}
      </Link>
    );
  }

  return <span className={classes}>{content}</span>;
}
