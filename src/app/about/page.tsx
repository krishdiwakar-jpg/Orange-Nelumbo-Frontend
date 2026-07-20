import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Eye, FlaskConical, Focus } from "lucide-react";

import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingHeader } from "@/components/layout/marketing-header";

export const metadata: Metadata = { title: "About", description: "Why Orange Nelumbo is building visual learning tools for JEE." };

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0E0D10] text-white">
      <MarketingHeader />
      <main id="main-content">
        <section className="hero-grid border-b border-[#FF5A1F]/22">
          <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-14 lg:py-28">
            <h1 className="max-w-4xl font-display text-4xl font-bold leading-tight tracking-[-.03em] sm:text-5xl lg:text-6xl">Difficult concepts should be easier to see.</h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-[#C7C5CC]">Orange Nelumbo is building a focused JEE learning library around visual notes, interactive simulations, and—next—visual-first video lectures.</p>
          </div>
        </section>

        <section className="section-shell">
          <div>
            <h2 className="max-w-3xl font-display text-4xl font-bold sm:text-5xl">We are reducing the distance between a formula and its meaning.</h2>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {[
                [Eye, "Make it visible", "Use diagrams, motion, and spatial explanation wherever words alone create friction."],
                [Focus, "Keep it focused", "Remove dashboard noise and keep each screen centred on the student’s immediate learning task."],
                [FlaskConical, "Let students test it", "Turn passive reading into exploration through small, purposeful simulations."],
              ].map(([Icon, title, copy]) => {
                const ItemIcon = Icon as typeof Eye;
                return <article className="border border-[#FF5A1F]/22 bg-[#161418] p-7" key={title as string}><ItemIcon className="text-[#FF8A3D]" size={26} /><h3 className="mt-8 text-2xl font-bold">{title as string}</h3><p className="mt-4 leading-7 text-[#C7C5CC]">{copy as string}</p></article>;
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-white/8 bg-[#161418]">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-end lg:px-14 lg:py-20">
            <div><BookOpen className="text-[#FF8A3D]" size={30} /><h2 className="mt-7 max-w-3xl font-display text-4xl font-bold sm:text-5xl">Start with one concept. See if it clicks.</h2><p className="mt-5 max-w-2xl text-lg leading-8 text-[#C7C5CC]">The current demo includes sample visual notes and simulations across Physics, Chemistry, and Mathematics.</p></div>
            <Link className="button-primary" href="/signup">Explore the library <ArrowRight size={17} /></Link>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
