import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { SampleNotesBrowser } from "@/components/marketing/sample-notes-browser";

export default async function SampleNotesPage({ searchParams }: { searchParams: Promise<{ note?: string }> }) {
  const { note } = await searchParams;
  return <div className="min-h-screen bg-[#0E0D10] text-white"><MarketingHeader/><main id="main-content"><section className="hero-grid border-b border-[#FF5A1F]/20"><div className="mx-auto max-w-[1328px] px-5 pb-14 pt-20 sm:px-8 lg:px-14 lg:pb-18 lg:pt-24"><h1 className="max-w-4xl font-display text-[clamp(2.7rem,6vw,5.2rem)] font-bold leading-[1.02] tracking-[-.035em]">Notes that show the idea before compressing it.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-[#C7C5CC]">Browse samples across Physics, Chemistry, and Mathematics. Each preview keeps the visual, formula, and key ideas in one readable unit.</p></div></section><section className="section-shell"><SampleNotesBrowser initialSlug={note}/></section><section className="border-t border-white/8 bg-[#161418]"><div className="mx-auto flex max-w-[1328px] flex-col items-start justify-between gap-6 px-5 py-14 sm:px-8 lg:flex-row lg:items-center lg:px-14"><div><h2 className="font-display text-3xl font-bold">Continue with the full note library.</h2><p className="mt-3 text-[#C7C5CC]">Open protected, distraction-free note pages after signing in.</p></div><Link className="button-primary" href="/signup">Explore membership <ArrowRight size={17}/></Link></div></section></main><MarketingFooter/></div>;
}
