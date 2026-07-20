import Link from "next/link";
import { Menu } from "lucide-react";

import { Logo } from "@/components/brand/logo";

const links = [
  { href: "/#notes", label: "Visual notes" },
  { href: "/#simulations", label: "Simulations" },
  { href: "/#videos", label: "Videos" },
  { href: "/help", label: "Help" },
];

export function MarketingHeader() {
  return (
    <>
      <header className="sticky top-0 z-50 h-[74px] border-b border-[#FF5A1F]/20 bg-[#0E0D10]/92 backdrop-blur-xl">
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-14">
          <Logo href="/" />
          <nav aria-label="Primary navigation" className="hidden items-center gap-8 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                className="flex min-h-11 items-center text-sm font-semibold text-[#C7C5CC] transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF5A1F]"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-3 sm:flex">
            <Link className="button-ghost" href="/login">
              Sign in
            </Link>
            <Link className="button-outline" href="/signup">
              Explore free
            </Link>
          </div>
          <details className="group relative sm:hidden">
            <summary
              aria-label="Open navigation"
              className="grid size-11 cursor-pointer list-none place-items-center border border-[#FF5A1F]/30 text-white marker:hidden"
            >
              <Menu aria-hidden="true" size={21} strokeWidth={1.7} />
            </summary>
            <div className="absolute right-0 top-[54px] w-[min(88vw,320px)] border border-[#FF5A1F]/25 bg-[#161418] p-4 shadow-2xl">
              <nav aria-label="Mobile navigation" className="grid">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    className="border-b border-white/8 px-3 py-4 font-semibold text-[#C7C5CC] hover:text-white"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Link className="button-ghost justify-center" href="/login">
                    Sign in
                  </Link>
                  <Link className="button-outline justify-center" href="/signup">
                    Explore free
                  </Link>
                </div>
              </nav>
            </div>
          </details>
        </div>
      </header>
    </>
  );
}
