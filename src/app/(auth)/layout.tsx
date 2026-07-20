import type { ReactNode } from "react";
import { ArrowUpRight, Atom, ChartNoAxesCombined, Sigma } from "lucide-react";

import { Logo } from "@/components/brand/logo";

const proofPoints = [
  { icon: Atom, label: "Concept-first notes" },
  { icon: Sigma, label: "JEE-level practice" },
  { icon: ChartNoAxesCombined, label: "Progress that makes sense" },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main id="main-content" className="min-h-screen bg-obsidian text-paper lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(520px,0.95fr)]">
      <section className="relative hidden min-h-screen overflow-hidden border-r border-steel bg-carbon px-12 py-10 lg:flex lg:flex-col xl:px-16">
        <div className="brand-grid pointer-events-none absolute inset-0 opacity-50" />
        <div className="pointer-events-none absolute -right-36 -top-40 size-[34rem] rounded-full border border-ignition/15" />
        <div className="pointer-events-none absolute -right-16 -top-20 size-[24rem] rounded-full border border-ignition/10" />

        <div className="relative z-10">
          <Logo className="text-paper" />
        </div>

        <div className="relative z-10 my-auto max-w-2xl py-16">
          <p className="mono-kicker text-ignition">Built for the long preparation</p>
          <h1 className="mt-6 max-w-xl font-display text-5xl font-bold leading-[0.98] tracking-[-.02em] text-paper xl:text-[3.5rem]">
            Learn the idea. Test the edge cases. Keep moving.
          </h1>
          <p className="mt-7 max-w-lg text-lg leading-8 text-titanium">
            A focused JEE study system for notes, simulations, deliberate practice, and the small wins that compound.
          </p>

          <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-3">
            {proofPoints.map(({ icon: Icon, label }) => (
              <div key={label} className="border border-steel bg-graphite/80 p-4">
                <Icon aria-hidden="true" className="size-5 text-cyan" strokeWidth={1.8} />
                <p className="mt-3 text-sm font-semibold leading-5 text-paper">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-titanium">
          Orange Nelumbo learning system
          <ArrowUpRight aria-hidden="true" className="size-4 text-ignition" />
        </div>
      </section>

      <section className="relative flex min-h-screen items-center justify-center bg-obsidian px-5 py-10 sm:px-8 lg:px-12">
        <div className="brand-grid pointer-events-none absolute inset-0 opacity-20 lg:hidden" />
        <div className="relative z-10 w-full max-w-[32rem]">
          <div className="mb-10 lg:hidden">
            <Logo className="text-paper" />
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}
