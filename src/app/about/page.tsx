import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BrainCircuit, Crosshair, Heart, Radar, Rocket, ScanSearch } from "lucide-react";

import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { curriculumTotals, platform } from "@/data/platform";

export const metadata: Metadata = {
  title: "About",
  description: "Why Orange Nelumbo is building a precise, adaptive preparation platform for serious JEE aspirants.",
};

const values = [
  {
    title: "Precise",
    body: "Every recommendation should point to a concept, a behaviour, or a measurable pattern - never a vague promise.",
    icon: Crosshair,
  },
  {
    title: "Adaptive",
    body: "The plan changes with the student. Read state, accuracy, time, confidence, and mock review all shape what returns next.",
    icon: BrainCircuit,
  },
  {
    title: "Relentless",
    body: "Learning moves forward in deliberate loops: diagnose, study, practise, pressure-test, review, and repeat.",
    icon: Rocket,
  },
  {
    title: "Human",
    body: "Behind every data point is a student carrying ambition and pressure. The system stays calm, honest, and encouraging.",
    icon: Heart,
  },
] as const;

const operatingLoop = [
  ["01", "Map the starting point", "A diagnostic turns a broad syllabus into a specific concept map."],
  ["02", "Build understanding", "Structured lessons, derivations, and visual labs make the model clear."],
  ["03", "Target the weak link", "Practice returns at the concept and difficulty where performance breaks."],
  ["04", "Test under pressure", "Mocks add timing, switching cost, and uncertainty, then feed the next plan."],
] as const;

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0E0D10] text-white">
      <MarketingHeader />
      <main id="main-content">
        <section className="hero-grid border-b border-[#FF5A1F]/22">
          <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:items-end lg:px-14 lg:py-28">
            <div>
              <p className="kicker">01 - Brand foundation</p>
              <h1 className="mt-7 max-w-4xl font-display text-[clamp(3rem,6vw,3.5rem)] font-bold leading-none tracking-[-.02em]">
                We engineered prep for the moment that <span className="text-gradient">matters.</span>
              </h1>
            </div>
            <div className="border-l border-[#FF5A1F]/35 pl-6 sm:pl-8">
              <p className="text-lg leading-8 text-[#C7C5CC]">
                JEE is not a test of how much a student has seen. It is a test of how precisely they can perform under pressure. {platform.name} exists to make that performance trainable.
              </p>
              <Link className="button-outline mt-8" href="/diagnostic">
                Start the sample <ArrowRight aria-hidden="true" size={17} />
              </Link>
            </div>
          </div>
        </section>

        <section className="section-shell bg-[#161418]">
          <SectionHeader
            description="Not another content dump. A guidance system that turns evidence into the next useful action."
            kicker="02 - Why we exist"
            title="The shortest honest path to mastery."
          />
          <div className="mt-14 grid gap-px border border-[#FF5A1F]/22 bg-[#FF5A1F]/22 lg:grid-cols-3">
            {[
              ["Mission", "Build an adaptive JEE preparation platform that maps performance in real time and engineers the fastest possible path to mastery."],
              ["Vision", "A world where an ambitious student can reach escape velocity through talent, effort, and the right feedback at the right moment."],
              ["Position", "Mission control for serious aspirants: calm enough to trust, exact enough to act on, and human enough to keep going."],
            ].map(([title, body]) => (
              <article className="bg-[#0E0D10] p-7 sm:p-9" key={title}>
                <p className="kicker">{title}</p>
                <p className="mt-7 text-lg leading-8 text-[#C7C5CC]">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell">
          <SectionHeader
            description="The personality stays consistent across a lesson, mock review, progress report, or support message."
            kicker="03 - How we work"
            title="Precise. Adaptive. Relentless. Human."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {values.map(({ body, icon: Icon, title }) => (
              <Card as="article" interactive key={title}>
                <Icon aria-hidden="true" className="text-[#FF8A3D]" size={27} strokeWidth={1.6} />
                <h2 className="mt-10 font-display text-3xl font-bold">{title}</h2>
                <p className="mt-4 max-w-xl leading-7 text-[#C7C5CC]">{body}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="section-shell border-y border-white/8 bg-[#161418]">
          <div className="grid gap-14 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
            <div>
              <Badge tone="cyan">Front-end preview</Badge>
              <h2 className="mt-7 font-display text-4xl font-bold tracking-[-.02em] sm:text-5xl">A complete learning loop, visible now.</h2>
              <p className="mt-6 text-lg leading-8 text-[#C7C5CC]">
                The current product is a browser-based demonstration with realistic sample data. It includes {curriculumTotals.subjects} subjects, {curriculumTotals.chapters} mapped chapters, and {curriculumTotals.topics} topic records. No live backend, payment, or real academic profile is connected.
              </p>
              <div className="mt-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[.12em] text-[#3DE0D0]">
                <Radar aria-hidden="true" size={18} strokeWidth={1.6} /> Engine model online
              </div>
            </div>
            <div className="divide-y divide-[#FF5A1F]/22 border-y border-[#FF5A1F]/22">
              {operatingLoop.map(([number, title, body]) => (
                <article className="grid gap-4 py-7 sm:grid-cols-[64px_1fr] sm:py-8" key={number}>
                  <span className="font-mono text-xs text-[#FF5A1F]">{number}</span>
                  <div>
                    <h3 className="font-display text-2xl font-semibold">{title}</h3>
                    <p className="mt-3 leading-7 text-[#C7C5CC]">{body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="hero-grid border-b border-[#FF5A1F]/22">
          <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-8 px-5 py-16 sm:px-8 md:flex-row md:items-end lg:px-14 lg:py-20">
            <div>
              <div className="flex items-center gap-3 text-[#FF8A3D]"><ScanSearch aria-hidden="true" size={22} strokeWidth={1.6} /><span className="kicker">Know exactly what is holding your rank back.</span></div>
              <h2 className="mt-5 max-w-4xl font-display text-4xl font-bold tracking-[-.02em] sm:text-5xl">Your next useful action should never be a guess.</h2>
            </div>
            <Link className="button-primary shrink-0" href="/signup">Start free <ArrowRight aria-hidden="true" size={17} /></Link>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-5 py-8 text-sm leading-6 text-[#C7C5CC]/70 sm:px-8 lg:px-14">
          <p>{platform.name} is an independent educational platform and is not affiliated with, endorsed by, or sponsored by the National Testing Agency (NTA), the JEE Apex Board, or the IITs. JEE, JEE Main and JEE Advanced are their respective owners&apos; marks.</p>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
