import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, DatabaseZap, ReceiptText, ShieldCheck } from "lucide-react";

import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { Badge } from "@/components/ui/badge";
import { plans, platform } from "@/data/platform";

export const metadata: Metadata = {
  title: "Demo checkout complete",
  description: "Confirmation for the Orange Nelumbo front-end checkout simulation.",
  robots: { index: false, follow: false },
};

interface SuccessPageProps {
  searchParams: Promise<{ plan?: string | string[]; receipt?: string | string[]; coupon?: string | string[] }>;
}

const formatPrice = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const requestedPlan = Array.isArray(params.plan) ? params.plan[0] : params.plan;
  const rawReceipt = Array.isArray(params.receipt) ? params.receipt[0] : params.receipt;
  const rawCoupon = Array.isArray(params.coupon) ? params.coupon[0] : params.coupon;
  const selectedPlan = plans.find((plan) => plan.id === requestedPlan) ?? plans.find((plan) => plan.id === "complete") ?? plans[0];
  const couponApplied = rawCoupon?.toUpperCase() === "MASTERY10";
  const discount = couponApplied ? Math.round(selectedPlan.price * 0.1) : 0;
  const total = selectedPlan.price - discount;
  const receipt = (rawReceipt ?? "DEMO-PREVIEW").replace(/[^a-z0-9-]/gi, "").slice(0, 32) || "DEMO-PREVIEW";

  return (
    <div className="min-h-screen bg-[#0E0D10] text-white">
      <MarketingHeader />
      <main id="main-content">
        <section className="hero-grid border-b border-[#FF5A1F]/22">
          <div className="mx-auto grid max-w-[1200px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[.86fr_1.14fr] lg:items-center lg:py-28">
            <div>
              <div className="grid size-20 place-items-center border border-[#3DE08A]/45 bg-[#3DE08A]/7">
                <CheckCircle2 aria-hidden="true" className="text-[#3DE08A]" size={39} strokeWidth={1.5} />
              </div>
              <Badge className="mt-8" tone="success">Demo payment approved</Badge>
              <h1 className="mt-6 font-display text-[clamp(3rem,6vw,3.5rem)] font-bold leading-none tracking-[-.02em]">Demo access is active. <span className="text-gradient">No real payment happened.</span></h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#C7C5CC]">The demo gateway approved the test card and updated access in this browser. No real card, identity, or order data was transmitted or stored.</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link className="button-primary" href={selectedPlan.id === "notes" ? "/learn" : "/simulations"}>Open included content <ArrowRight aria-hidden="true" size={17} /></Link>
                <Link className="button-ghost" href="/pricing">Return to pricing</Link>
              </div>
            </div>

            <section aria-labelledby="receipt-heading" className="border border-[#FF5A1F]/35 bg-[#161418] p-6 sm:p-8">
              <div className="flex items-start justify-between gap-6 border-b border-white/8 pb-6">
                <div>
                  <p className="kicker">Front-end receipt</p>
                  <h2 className="mt-3 font-display text-3xl font-bold" id="receipt-heading">{selectedPlan.name} annual plan</h2>
                </div>
                <ReceiptText aria-hidden="true" className="text-[#FF8A3D]" size={28} strokeWidth={1.6} />
              </div>
              <dl className="mt-7 space-y-5 text-sm">
                <div className="flex justify-between gap-6"><dt className="text-[#C7C5CC]/80">Reference</dt><dd className="font-mono text-[#3DE0D0]">{receipt}</dd></div>
                <div className="flex justify-between gap-6"><dt className="text-[#C7C5CC]/80">Plan price</dt><dd className="font-mono">{formatPrice.format(selectedPlan.price)}</dd></div>
                {couponApplied ? <div className="flex justify-between gap-6"><dt className="text-[#C7C5CC]/80">Demo coupon</dt><dd className="font-mono text-[#3DE08A]">-{formatPrice.format(discount)}</dd></div> : null}
                <div className="flex justify-between gap-6 border-t border-white/8 pt-5 text-lg font-bold"><dt>Simulated total</dt><dd className="font-mono text-[#FF8A3D]">{formatPrice.format(total)}</dd></div>
              </dl>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="border border-[#3DE08A]/30 bg-[#3DE08A]/5 p-4"><ShieldCheck aria-hidden="true" className="text-[#3DE08A]" size={20} /><p className="mt-3 text-sm font-semibold">No real charge</p></div>
                <div className="border border-[#3DE0D0]/30 bg-[#3DE0D0]/5 p-4"><DatabaseZap aria-hidden="true" className="text-[#3DE0D0]" size={20} /><p className="mt-3 text-sm font-semibold">Local demo access updated</p></div>
              </div>
              <p className="mt-6 text-xs leading-5 text-[#C7C5CC]/70">This reference is a demo receipt only. It is not proof of a real purchase, payment, enrolment, or subscription.</p>
            </section>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] space-y-3 px-5 py-10 text-sm leading-6 text-[#C7C5CC]/70 sm:px-8">
          <p>No rank, score, selection, or admission outcome is guaranteed. Projected AIR is a model estimate, not a prediction.</p>
          <p>{platform.name} is an independent educational platform and is not affiliated with, endorsed by, or sponsored by the National Testing Agency (NTA), the JEE Apex Board, or the IITs. JEE, JEE Main and JEE Advanced are their respective owners&apos; marks.</p>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
