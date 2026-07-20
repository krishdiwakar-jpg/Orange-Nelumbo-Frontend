import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, ShieldCheck, Sparkles, X } from "lucide-react";

import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";
import { plans, platform } from "@/data/platform";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Transparent annual plans for Orange Nelumbo Notes, Practice, and the Complete JEE preparation loop.",
};

const formatPrice = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0E0D10] text-white">
      <MarketingHeader />
      <main id="main-content">
        <section className="hero-grid border-b border-[#FF5A1F]/22">
          <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-14 lg:py-28">
            <p className="kicker">01 - Pricing and offers</p>
            <h1 className="mt-7 max-w-5xl font-display text-[clamp(3rem,6vw,3.5rem)] font-bold leading-none tracking-[-.02em]">
              Clear plans. <span className="text-gradient">No pressure tactics.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#C7C5CC]">
              Choose structured learning, focused practice, or the complete loop. Every displayed price is annual, inclusive of all taxes, and part of this front-end demonstration.
            </p>
          </div>
        </section>

        <section className="section-shell">
          <SectionHeader
            description="The free diagnostic needs no card. Paid checkout is a demonstration and does not process a transaction."
            kicker="02 - Annual access"
            title="Choose the engine you need."
          />
          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                className={`relative flex flex-col border p-7 sm:p-8 ${plan.highlighted ? "border-[#FF5A1F] bg-[#1E1B20] shadow-[0_0_70px_rgba(255,90,31,.10)]" : "border-[#FF5A1F]/22 bg-[#161418]"}`}
                key={plan.id}
              >
                {plan.highlighted ? <Badge className="absolute right-0 top-0 bg-[#FF5A1F]" style={{ border: 0, color: "#0E0D10" }} tone="brand">Recommended</Badge> : null}
                <p className="kicker">{plan.eyebrow}</p>
                <h2 className="mt-5 font-display text-3xl font-bold">{plan.name}</h2>
                <p className="mt-7 font-display text-5xl font-bold tracking-[-.02em]">
                  {formatPrice.format(plan.price)}
                  <span className="ml-2 font-sans text-sm font-medium tracking-normal text-[#C7C5CC]/80">/ {plan.billingPeriod}</span>
                </p>
                <p className="mt-5 min-h-20 leading-7 text-[#C7C5CC]">{plan.description}</p>
                <ul className="mt-8 flex-1 space-y-4 border-t border-white/8 pt-7">
                  {plan.features.map((feature) => (
                    <li className="flex gap-3 text-sm leading-6 text-[#C7C5CC]" key={feature}>
                      <Check aria-hidden="true" className="mt-1 shrink-0 text-[#3DE08A]" size={15} strokeWidth={1.8} />
                      {feature}
                    </li>
                  ))}
                  {plan.exclusions.map((feature) => (
                    <li className="flex gap-3 text-sm leading-6 text-[#C7C5CC]/70" key={feature}>
                      <X aria-hidden="true" className="mt-1 shrink-0" size={15} strokeWidth={1.8} />
                      {feature}
                    </li>
                  ))}
                </ul>
                {plan.savings ? <p className="mt-7 border-l-2 border-[#3DE08A] pl-4 text-sm text-[#3DE08A]">{plan.savings}</p> : null}
                <Link className={plan.highlighted ? "button-primary mt-8 justify-center" : "button-outline mt-8 justify-center"} href={`/checkout?plan=${plan.id}`}>
                  Choose {plan.name} <ArrowRight aria-hidden="true" size={17} />
                </Link>
              </article>
            ))}
          </div>
          <p className="mt-6 text-center text-sm leading-6 text-[#C7C5CC]/70">Final price is inclusive of all taxes. Demo checkout only - no payment information is collected or processed.</p>
        </section>

        <section className="section-shell border-y border-white/8 bg-[#161418]">
          <SectionHeader kicker="03 - The rules" title="Transparent by design." />
          <div className="mt-12 grid gap-px border border-[#FF5A1F]/22 bg-[#FF5A1F]/22 md:grid-cols-3">
            {[
              [ShieldCheck, "No false scarcity", "No fake countdowns, invented seat limits, or hidden price jumps."],
              [Sparkles, "Show the value", "Every price sits beside the learning, practice, mock, and analytics access it includes."],
              [Check, "A clear exit", "The demonstration policy includes a seven-day refund window; final terms appear again before any future live checkout."],
            ].map(([Icon, title, body]) => {
              const FeatureIcon = Icon;
              return (
                <article className="bg-[#0E0D10] p-7 sm:p-9" key={title as string}>
                  <FeatureIcon aria-hidden="true" className="text-[#FF8A3D]" size={26} strokeWidth={1.6} />
                  <h2 className="mt-9 font-display text-2xl font-bold">{title as string}</h2>
                  <p className="mt-4 leading-7 text-[#C7C5CC]">{body as string}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] space-y-3 px-5 py-10 text-sm leading-6 text-[#C7C5CC]/70 sm:px-8 lg:px-14">
          <p>Projected AIR, mastery scores, ranks, testimonials, and progress figures shown in this demonstration are illustrative model outputs, not predictions, typical results, or guarantees.</p>
          <p>{platform.name} is an independent educational platform and is not affiliated with, endorsed by, or sponsored by the National Testing Agency (NTA), the JEE Apex Board, or the IITs. JEE, JEE Main and JEE Advanced are their respective owners&apos; marks.</p>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
