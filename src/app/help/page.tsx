import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CreditCard, LifeBuoy, UserRound } from "lucide-react";

import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { faqs, platform } from "@/data/platform";
import type { FaqItem } from "@/types/platform";

export const metadata: Metadata = {
  title: "Help centre",
  description: "Answers about learning, practice, plans, accounts, and the Orange Nelumbo front-end preview.",
};

const categoryOrder: FaqItem["category"][] = ["Learning", "Practice", "Plans", "Account"];

const categoryIcons = {
  Learning: BookOpen,
  Practice: LifeBuoy,
  Plans: CreditCard,
  Account: UserRound,
} as const;

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#0E0D10] text-white">
      <MarketingHeader />
      <main id="main-content">
        <section className="hero-grid border-b border-[#FF5A1F]/22">
          <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-14 lg:py-28">
            <p className="kicker">01 - Help centre</p>
            <h1 className="mt-7 max-w-5xl font-display text-[clamp(3rem,6vw,3.5rem)] font-bold leading-none tracking-[-.02em]">
              Ask directly. <span className="text-gradient">Get a precise answer.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#C7C5CC]">Start with the topic that matches your question. This preview uses browser-local sample data and a demonstration sign-in flow.</p>
            <nav aria-label="Help categories" className="mt-10 flex flex-wrap gap-3">
              {categoryOrder.map((category) => <a className="button-ghost" href={`#${category.toLowerCase()}`} key={category}>{category}</a>)}
            </nav>
          </div>
        </section>

        <section className="section-shell">
          <SectionHeader description="Clear answers for students and families making a serious decision." kicker="02 - Common questions" title="Everything essential, in one place." />
          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            {categoryOrder.map((category) => {
              const Icon = categoryIcons[category];
              const items = faqs.filter((faq) => faq.category === category);
              return (
                <Card as="section" id={category.toLowerCase()} key={category}>
                  <div className="flex items-center gap-4 border-b border-[#FF5A1F]/22 pb-6">
                    <Icon aria-hidden="true" className="text-[#FF8A3D]" size={24} strokeWidth={1.6} />
                    <div><p className="kicker">{String(items.length).padStart(2, "0")} entries</p><h2 className="mt-2 font-display text-3xl font-bold">{category}</h2></div>
                  </div>
                  <div className="divide-y divide-[#FF5A1F]/18">
                    {items.map((faq, index) => (
                      <details className="group" key={faq.id} open={index === 0}>
                        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-lg font-semibold marker:hidden">
                          {faq.question}<span aria-hidden="true" className="font-mono text-[#FF8A3D] transition-transform group-open:rotate-45">+</span>
                        </summary>
                        <p className="max-w-[65ch] pb-6 leading-7 text-[#C7C5CC]">{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="section-shell border-y border-white/8 bg-[#161418]">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="kicker">03 - Still need help?</p>
              <h2 className="mt-5 max-w-3xl font-display text-4xl font-bold tracking-[-.02em] sm:text-5xl">Tell us the exact point where you are stuck.</h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#C7C5CC]">The contact form is a transparent front-end demonstration. It confirms the interaction on screen but does not send an email.</p>
            </div>
            <Link className="button-primary" href="/contact">Open contact form <ArrowRight aria-hidden="true" size={17} /></Link>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] space-y-3 px-5 py-10 text-sm leading-6 text-[#C7C5CC]/70 sm:px-8 lg:px-14">
          <p>Support reference: {platform.supportEmail}. This address is shown as product copy in the current front-end demonstration.</p>
          <p>{platform.name} is an independent educational platform and is not affiliated with, endorsed by, or sponsored by the National Testing Agency (NTA), the JEE Apex Board, or the IITs. JEE, JEE Main and JEE Advanced are their respective owners&apos; marks.</p>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
