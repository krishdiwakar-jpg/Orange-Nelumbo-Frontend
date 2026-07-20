import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, FlaskConical, UserRound } from "lucide-react";

import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingHeader } from "@/components/layout/marketing-header";

export const metadata: Metadata = { title: "Help centre", description: "Help with Orange Nelumbo notes, simulations, and accounts." };

const topics = [
  [BookOpen, "Visual notes", "Notes open in a dedicated reader so the learning document stays separate from the rest of the app. Your reading progress and bookmarks remain available."],
  [FlaskConical, "Simulations", "Live simulations let you change inputs and observe the result. Upcoming simulations are clearly marked and cannot be launched yet."],
  [UserRound, "Profile and settings", "Profile, notifications, and preferences are grouped under Account and kept separate from the learning library."],
] as const;

export default function HelpPage() {
  return <div className="min-h-screen bg-[#0E0D10] text-white"><MarketingHeader /><main id="main-content">
    <section className="hero-grid border-b border-[#FF5A1F]/22"><div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-14 lg:py-24"><h1 className="font-display text-4xl font-bold sm:text-5xl">How can we help?</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-[#C7C5CC]">Quick answers about the learning library and your account.</p></div></section>
    <section className="section-shell"><div className="grid gap-5 md:grid-cols-3">{topics.map(([Icon,title,copy])=><article className="border border-[#FF5A1F]/22 bg-[#161418] p-7 sm:p-8" key={title}><Icon className="text-[#FF8A3D]" size={25}/><h2 className="mt-7 text-2xl font-bold">{title}</h2><p className="mt-4 leading-7 text-[#C7C5CC]">{copy}</p></article>)}</div></section>
    <section className="border-y border-white/8 bg-[#161418]"><div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-8 px-5 py-16 sm:px-8 md:flex-row md:items-end lg:px-14"><div><h2 className="font-display text-3xl font-bold sm:text-4xl">Still need help?</h2><p className="mt-4 max-w-2xl text-lg leading-8 text-[#C7C5CC]">Tell us which note, simulation, or account screen is causing trouble.</p></div><Link className="button-primary" href="/contact">Contact us <ArrowRight size={17}/></Link></div></section>
  </main><MarketingFooter /></div>;
}
