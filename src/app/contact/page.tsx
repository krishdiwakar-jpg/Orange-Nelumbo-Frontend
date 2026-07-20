import type { Metadata } from "next";
import { Clock3, Mail, MessageSquareText, ShieldAlert } from "lucide-react";

import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { Card } from "@/components/ui/card";
import { platform } from "@/data/platform";

import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Orange Nelumbo about learning, practice, plans, or the front-end preview.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0E0D10] text-white">
      <MarketingHeader />
      <main id="main-content">
        <section className="hero-grid border-b border-[#FF5A1F]/22">
          <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-14 lg:py-28">
            <p className="kicker">01 - Contact</p>
            <h1 className="mt-7 max-w-5xl font-display text-[clamp(3rem,6vw,3.5rem)] font-bold leading-none tracking-[-.02em]">Help starts with the <span className="text-gradient">real question.</span></h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#C7C5CC]">Be specific and calm. Tell us what you were trying to do, what happened, and what you expected instead.</p>
          </div>
        </section>

        <section className="section-shell">
          <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
            <div>
              <p className="kicker">02 - Before you send</p>
              <h2 className="mt-5 font-display text-4xl font-bold tracking-[-.02em]">This form is deliberately a demo.</h2>
              <p className="mt-6 leading-7 text-[#C7C5CC]">There is no backend or support inbox connected yet. Submission shows an accessible success state in this browser only.</p>
              <div className="mt-9 grid gap-4">
                <Card>
                  <Mail aria-hidden="true" className="text-[#FF8A3D]" size={22} strokeWidth={1.6} />
                  <p className="mt-5 font-semibold">Reference address</p>
                  <p className="mt-2 font-mono text-sm text-[#3DE0D0]">{platform.supportEmail}</p>
                </Card>
                <Card>
                  <Clock3 aria-hidden="true" className="text-[#FF8A3D]" size={22} strokeWidth={1.6} />
                  <p className="mt-5 font-semibold">Planned support window</p>
                  <p className="mt-2 text-sm leading-6 text-[#C7C5CC]">Weekdays, 9:00 AM-6:00 PM IST. No live response service is active in this preview.</p>
                </Card>
                <Card>
                  <ShieldAlert aria-hidden="true" className="text-[#F6C344]" size={22} strokeWidth={1.6} />
                  <p className="mt-5 font-semibold">Urgent wellbeing support</p>
                  <p className="mt-2 text-sm leading-6 text-[#C7C5CC]">This platform is not an emergency or counselling service. If a student is in immediate danger, contact local emergency services and a trusted adult.</p>
                </Card>
              </div>
            </div>
            <div>
              <div className="mb-6 flex items-center gap-3"><MessageSquareText aria-hidden="true" className="text-[#FF8A3D]" size={22} strokeWidth={1.6} /><p className="kicker">Front-end message flow</p></div>
              <ContactForm />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] space-y-3 border-t border-white/8 px-5 py-10 text-sm leading-6 text-[#C7C5CC]/70 sm:px-8 lg:px-14">
          <p>{platform.name} is an independent educational platform and is not affiliated with, endorsed by, or sponsored by the National Testing Agency (NTA), the JEE Apex Board, or the IITs. JEE, JEE Main and JEE Advanced are their respective owners&apos; marks.</p>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
