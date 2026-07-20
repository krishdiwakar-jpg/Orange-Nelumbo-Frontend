import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingHeader } from "@/components/layout/marketing-header";

export const metadata: Metadata = { title: "Access", description: "Explore the current Orange Nelumbo JEE learning demo." };

export default function PricingPage() {
  return <div className="min-h-screen bg-[#0E0D10] text-white"><MarketingHeader /><main id="main-content">
    <section className="hero-grid border-b border-[#FF5A1F]/22"><div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-14 lg:py-24"><h1 className="max-w-4xl font-display text-4xl font-bold sm:text-5xl">Explore the current learning demo.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-[#C7C5CC]">Public pricing is not final. The demo is focused on showing the visual notes and simulation experience.</p></div></section>
    <section className="section-shell"><div className="mx-auto max-w-3xl border border-[#FF5A1F]/30 bg-[#161418] p-7 sm:p-10"><h2 className="text-3xl font-bold">Demo access</h2><ul className="mt-7 space-y-4">{["Visual notes across Physics, Chemistry, and Mathematics","Available interactive simulations","Bookmarks and device-local reading progress","Preview of the future video lecture area"].map(item=><li className="flex gap-3 text-[#C7C5CC]" key={item}><Check className="mt-1 shrink-0 text-[#3DE08A]" size={16}/>{item}</li>)}</ul><Link className="button-primary mt-9" href="/signup">Explore free <ArrowRight size={17}/></Link></div></section>
  </main><MarketingFooter /></div>;
}
