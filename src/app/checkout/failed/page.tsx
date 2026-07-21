import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleX, CreditCard, RotateCcw, ShieldCheck } from "lucide-react";

import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { Badge } from "@/components/ui/badge";
import { plans } from "@/data/platform";

export const metadata: Metadata = {
  title: "Demo payment declined",
  description: "Declined result for the Orange Nelumbo demo payment gateway.",
  robots: { index: false, follow: false },
};

interface FailedPageProps {
  searchParams: Promise<{ plan?: string | string[]; reason?: string | string[] }>;
}

export default async function CheckoutFailedPage({ searchParams }: FailedPageProps) {
  const params = await searchParams;
  const requestedPlan = Array.isArray(params.plan) ? params.plan[0] : params.plan;
  const selectedPlan = plans.find((plan) => plan.id === requestedPlan) ?? plans.find((plan) => plan.id === "complete") ?? plans[0];

  return (
    <div className="min-h-screen bg-[#0E0D10] text-white">
      <MarketingHeader />
      <main id="main-content">
        <section className="hero-grid border-b border-[#FF5A1F]/22">
          <div className="mx-auto grid min-h-[70vh] max-w-[1200px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:py-28">
            <div>
              <div className="grid size-20 place-items-center border border-[#E0483C]/40 bg-[#E0483C]/7">
                <CircleX aria-hidden="true" className="text-[#E88279]" size={39} strokeWidth={1.5} />
              </div>
              <Badge className="mt-8" tone="warning">Demo payment declined</Badge>
              <h1 className="mt-6 font-display text-[clamp(3rem,6vw,3.5rem)] font-bold leading-none tracking-[-.02em]">
                Nothing was charged. <span className="text-[#E88279]">Try the flow again.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#C7C5CC]">
                The demo gateway returned a card-declined response. Your existing access has not changed and no payment data was stored.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link className="button-primary" href={`/checkout?plan=${selectedPlan.id}`}>
                  Retry demo payment <RotateCcw aria-hidden="true" size={17} />
                </Link>
                <Link className="button-ghost" href="/pricing">Choose another plan</Link>
              </div>
            </div>

            <section aria-labelledby="decline-heading" className="border border-[#E0483C]/30 bg-[#161418] p-6 sm:p-8">
              <div className="flex items-start justify-between gap-6 border-b border-white/8 pb-6">
                <div>
                  <p className="text-sm font-semibold text-[#E88279]">Gateway response</p>
                  <h2 className="mt-3 font-display text-3xl font-bold" id="decline-heading">Payment could not be approved</h2>
                </div>
                <CreditCard aria-hidden="true" className="text-[#E88279]" size={28} strokeWidth={1.6} />
              </div>
              <dl className="mt-7 space-y-5 text-sm">
                <div className="flex justify-between gap-6"><dt className="text-[#C7C5CC]/80">Plan</dt><dd className="font-semibold">{selectedPlan.name}</dd></div>
                <div className="flex justify-between gap-6"><dt className="text-[#C7C5CC]/80">Reason</dt><dd className="font-mono text-[#E88279]">card_declined</dd></div>
                <div className="flex justify-between gap-6 border-t border-white/8 pt-5"><dt className="text-[#C7C5CC]/80">Amount charged</dt><dd className="font-mono text-[#3DE08A]">INR 0</dd></div>
              </dl>
              <div className="mt-7 border border-[#3DE08A]/25 bg-[#3DE08A]/5 p-4">
                <ShieldCheck aria-hidden="true" className="text-[#3DE08A]" size={20} />
                <p className="mt-3 text-sm font-semibold">No real transaction was attempted</p>
                <p className="mt-2 text-sm leading-6 text-[#C7C5CC]">Use the approval test card on the retry screen to preview the successful state.</p>
              </div>
              <Link className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#FF8A3D] hover:text-white" href={`/checkout?plan=${selectedPlan.id}`}>
                Return to checkout <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </section>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
