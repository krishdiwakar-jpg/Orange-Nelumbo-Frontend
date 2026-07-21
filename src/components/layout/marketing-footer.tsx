import Link from "next/link";

import { Logo } from "@/components/brand/logo";

const columns = [
  { title: "Learn", links: [["Courses", "/courses"], ["Simulations Lab", "/simulation-lab"], ["Free simulations", "/free-simulations"], ["Sample notes", "/sample-notes"], ["Pricing", "/#pricing"]] },
  { title: "Support", links: [["FAQs", "/#faqs"], ["Educator login", "/login?role=educator&returnTo=%2Fdashboard"], ["Contact", "/contact"]] },
  { title: "Legal", links: [["Privacy", "/privacy"], ["Terms", "/terms"]] },
] as const;

export function MarketingFooter() {
  return (
    <footer className="border-t border-[#FF5A1F]/22 bg-[#0E0D10]">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.3fr_2fr] lg:px-14 lg:py-16">
        <div>
          <Logo href="/" />
          <p className="mt-6 max-w-sm text-[15px] leading-7 text-[#C7C5CC]">Visual JEE notes and interactive simulations that make difficult ideas easier to see and understand.</p>
          <Link className="button-primary mt-7 inline-flex" href="/signup">Explore free <span aria-hidden="true">→</span></Link>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-5 text-sm font-semibold text-white">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map(([label, href]) => <li key={label}><Link className="text-sm text-[#C7C5CC] hover:text-white" href={href}>{label}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/8">
        <p className="mx-auto max-w-[1440px] px-5 py-5 text-xs leading-5 text-[#C7C5CC] sm:px-8 lg:px-14">Orange Nelumbo is an independent educational platform and is not affiliated with, endorsed by, or sponsored by the National Testing Agency (NTA), the JEE Apex Board, or the IITs. JEE, JEE Main and JEE Advanced are their respective owners&apos; marks.</p>
      </div>
      <div className="border-t border-white/8">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-5 py-5 text-xs text-[#C7C5CC]/65 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-14"><span>© 2026 Orange Nelumbo</span><span>See the idea. Understand the concept.</span></div>
      </div>
    </footer>
  );
}
