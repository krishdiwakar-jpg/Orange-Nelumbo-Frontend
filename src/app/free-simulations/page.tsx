import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { FreeSimulationPlayground } from "@/components/marketing/free-simulation-playground";

export default async function FreeSimulationsPage({ searchParams }: { searchParams: Promise<{ demo?: string }> }) {
  const { demo } = await searchParams;
  return <div className="min-h-screen bg-[#0E0D10] text-white"><MarketingHeader/><main id="main-content"><section className="hero-grid border-b border-[#FF5A1F]/20"><div className="mx-auto max-w-[1328px] px-5 pb-14 pt-20 sm:px-8 lg:px-14 lg:pb-18 lg:pt-24"><p className="font-mono text-xs uppercase tracking-[.18em] text-[#3DE08A]">Free · no sign-in</p><h1 className="mt-5 max-w-4xl font-display text-[clamp(2.7rem,6vw,5.2rem)] font-bold leading-[.98] tracking-[-.045em]">Five ideas you can move, test, and see.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-[#C7C5CC]">Change one variable, predict what happens, and use the visual response to connect the formula with its behaviour.</p></div></section><section className="section-shell"><FreeSimulationPlayground initialSlug={demo}/></section><section className="border-t border-white/8 bg-[#161418]"><div className="mx-auto flex max-w-[1328px] flex-col items-start justify-between gap-6 px-5 py-14 sm:px-8 lg:flex-row lg:items-center lg:px-14"><div><h2 className="font-display text-3xl font-bold">Ready for the complete library?</h2><p className="mt-3 text-[#C7C5CC]">Keep the demos free. Join when you want the full notes and simulation collection.</p></div><Link className="button-primary" href="/signup">Create an account <ArrowRight size={17}/></Link></div></section></main><MarketingFooter/></div>;
}
