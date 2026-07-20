import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingHeader } from "@/components/layout/marketing-header";

export const metadata: Metadata = { title: "Pricing", description: "Choose an Orange Nelumbo visual learning plan." };

const plans = [
  { name: "Notes", price: "₹4,999", copy: "Visual notes across Physics, Chemistry, and Mathematics.", features: ["Complete visual note library", "Protected full-page reader", "Bookmarks and reading progress", "New notes during the plan year"] },
  { name: "Notes + Simulations", price: "₹6,999", copy: "Add interactive models that make equations visible.", features: ["Everything in Notes", "Complete simulation library", "Variable controls and live graphs", "New labs during the plan year"], featured: true },
  { name: "Complete Library", price: "₹9,999", copy: "The complete collection, including lectures as released.", features: ["Everything in Notes + Simulations", "Video lectures as released", "Educator-curated sequences", "All library additions this year"] },
];

export default function PricingPage() {
  return <div className="min-h-screen bg-[#0E0D10] text-white"><MarketingHeader/><main id="main-content"><section className="hero-grid border-b border-[#FF5A1F]/22"><div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-14 lg:py-24"><h1 className="max-w-4xl font-display text-4xl font-bold sm:text-6xl">Three plans. One visual way to learn.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-[#C7C5CC]">Choose notes, add simulations, or include future video lectures. Every plan stays focused on the learning library.</p></div></section><section className="section-shell"><div className="grid gap-5 lg:grid-cols-3">{plans.map((plan) => <article className={`relative flex min-h-[520px] flex-col border p-7 sm:p-9 ${plan.featured ? "border-[#FF5A1F] bg-[#1E1B20]" : "border-white/10 bg-[#161418]"}`} key={plan.name}>{plan.featured ? <span className="absolute right-0 top-0 bg-[#FF5A1F] px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[.14em] text-[#0E0D10]">Most visual</span> : null}<h2 className="font-display text-2xl font-bold">{plan.name}</h2><p className="mt-6"><span className="font-display text-4xl font-bold">{plan.price}</span><span className="ml-2 text-sm text-[#C7C5CC]">/ year</span></p><p className="mt-5 min-h-16 leading-7 text-[#C7C5CC]">{plan.copy}</p><ul className="mt-7 space-y-4">{plan.features.map((feature) => <li className="flex gap-3 text-sm leading-6 text-[#C7C5CC]" key={feature}><Check className="mt-1 shrink-0 text-[#3DE08A]" size={16}/>{feature}</li>)}</ul><Link className={`${plan.featured ? "button-primary" : "button-outline"} mt-auto justify-center`} href="/signup">Choose {plan.name} <ArrowRight size={16}/></Link></article>)}</div></section></main><MarketingFooter/></div>;
}
