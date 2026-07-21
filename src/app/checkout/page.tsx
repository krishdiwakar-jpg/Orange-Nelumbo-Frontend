import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";

import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { CheckoutForm } from "@/components/marketing/checkout-form";
import { plans, platform } from "@/data/platform";

export const metadata: Metadata = {
  title: "Demo checkout",
  description: "A front-end-only checkout simulation for Orange Nelumbo plans.",
  robots: { index: false, follow: false },
};

interface CheckoutPageProps {
  searchParams: Promise<{ plan?: string | string[] }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  const requestedPlan = Array.isArray(params.plan) ? params.plan[0] : params.plan;
  const selectedPlan = plans.find((plan) => plan.id === requestedPlan) ?? plans.find((plan) => plan.id === "complete") ?? plans[0];

  return (
    <div className="min-h-screen bg-[#0E0D10] text-white">
      <MarketingHeader />
      <main id="main-content">
        <section className="hero-grid border-b border-[#FF5A1F]/22">
          <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-14 lg:py-20">
            <Link className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#C7C5CC] hover:text-white" href="/pricing">
              <ArrowLeft aria-hidden="true" size={16} /> Back to pricing
            </Link>
            <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
              <div>
                <p className="kicker">Orange Nelumbo Pay · Demo gateway</p>
                <h1 className="mt-6 max-w-4xl font-display text-[clamp(3rem,6vw,3.5rem)] font-bold leading-none tracking-[-.02em]">
                  Review the plan. <span className="text-gradient">Simulate the flow.</span>
                </h1>
              </div>
              <div className="border-l border-[#FF5A1F]/35 pl-6 sm:pl-8">
                <div className="flex items-center gap-3 text-[#3DE08A]"><LockKeyhole aria-hidden="true" size={20} strokeWidth={1.6} /><span className="font-mono text-xs uppercase tracking-[.12em]">No transmission or storage</span></div>
                <p className="mt-4 leading-7 text-[#C7C5CC]">Use the provided approval or decline test card to preview both payment outcomes. No real transaction is attempted.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-14">
          <p className="kicker">Select a plan</p>
          <nav aria-label="Checkout plan selection" className="mt-4 grid gap-3 sm:grid-cols-3">
            {plans.map((plan) => {
              const active = plan.id === selectedPlan.id;
              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={`border px-5 py-4 transition-colors ${active ? "border-[#FF5A1F] bg-[#FF5A1F]/9 text-white" : "border-[#FF5A1F]/22 bg-[#161418] text-[#C7C5CC] hover:border-[#FF5A1F]/60 hover:text-white"}`}
                  href={`/checkout?plan=${plan.id}`}
                  key={plan.id}
                >
                  <span className="font-display text-lg font-bold">{plan.name}</span>
                  <span className="ml-3 font-mono text-xs text-[#FF8A3D]">INR {plan.price.toLocaleString("en-IN")}</span>
                </Link>
              );
            })}
          </nav>
        </section>

        <section className="mx-auto grid max-w-[1440px] gap-10 px-5 pb-20 sm:px-8 lg:grid-cols-[.72fr_1.28fr] lg:px-14">
          <aside className="h-fit border border-[#FF5A1F]/25 bg-[#161418] p-6 lg:sticky lg:top-28 sm:p-8">
            <p className="kicker">Selected plan</p>
            <h2 className="mt-5 font-display text-4xl font-bold">{selectedPlan.name}</h2>
            <p className="mt-4 leading-7 text-[#C7C5CC]">{selectedPlan.description}</p>
            <ul className="mt-7 space-y-3 border-t border-white/8 pt-6 text-sm leading-6 text-[#C7C5CC]">
              {selectedPlan.features.map((feature) => <li className="border-l border-[#FF5A1F]/50 pl-4" key={feature}>{feature}</li>)}
            </ul>
            <p className="mt-7 text-xs leading-5 text-[#C7C5CC]/70">Annual price is inclusive of all taxes. This preview cannot create a purchase, subscription, or refund entitlement.</p>
          </aside>
          <CheckoutForm plan={selectedPlan} />
        </section>

        <section className="mx-auto max-w-[1440px] space-y-3 border-t border-white/8 px-5 py-10 text-sm leading-6 text-[#C7C5CC]/70 sm:px-8 lg:px-14">
          <p>Projected AIR and other performance figures are illustrative model estimates, not predictions or guarantees of a rank, score, selection, or admission.</p>
          <p>{platform.name} is an independent educational platform and is not affiliated with, endorsed by, or sponsored by the National Testing Agency (NTA), the JEE Apex Board, or the IITs. JEE, JEE Main and JEE Advanced are their respective owners&apos; marks.</p>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
