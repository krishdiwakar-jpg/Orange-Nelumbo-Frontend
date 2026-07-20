import Link from "next/link";

import { Logo } from "@/components/brand/logo";

const columns = [
  {
    title: "Platform",
    links: [
      ["Adaptive engine", "/#engine"],
      ["Study flow", "/#study-flow"],
      ["Mock tests", "/login?returnTo=%2Fmocks"],
      ["Rank map", "/login?returnTo=%2Frank-map"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["Learning questions", "/help#learning"],
      ["Practice questions", "/help#practice"],
      ["Help centre", "/help"],
      ["Contact", "/contact"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/about"],
      ["Pricing", "/pricing"],
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
    ],
  },
] as const;

export function MarketingFooter() {
  return (
    <footer className="border-t border-[#FF5A1F]/22 bg-[#0E0D10]">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.3fr_2fr] lg:px-14 lg:py-20">
        <div>
          <Logo href="/" />
          <p className="mt-6 max-w-sm text-[15px] leading-7 text-[#C7C5CC]">
            Adaptive JEE preparation that reads performance in real time and engineers the shortest path to mastery.
          </p>
          <Link className="button-primary mt-7 inline-flex" href="/signup">
            Start free <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title}>
              <p className="kicker mb-5">{column.title}</p>
              <ul className="space-y-3">
                {column.links.map(([label, href]) => (
                  <li key={label}>
                    <Link className="text-sm text-[#C7C5CC] hover:text-white" href={href}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/8">
        <p className="mx-auto max-w-[1440px] px-5 py-5 text-xs leading-5 text-[#C7C5CC] sm:px-8 lg:px-14">
          Orange Nelumbo is an independent educational platform and is not affiliated with, endorsed by, or sponsored by the National Testing Agency (NTA), the JEE Apex Board, or the IITs. JEE, JEE Main and JEE Advanced are their respective owners&apos; marks.
        </p>
      </div>
      <div className="border-t border-white/8">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-5 py-5 font-mono text-[11px] uppercase tracking-[.14em] text-[#C7C5CC]/70 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-14">
          <span>© 2026 Orange Nelumbo</span>
          <span>In pursuit of mastery.</span>
        </div>
      </div>
    </footer>
  );
}
