import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Atom, Check, FlaskConical, GraduationCap, Orbit, Play, Sigma, Waves } from "lucide-react";

import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingHeader } from "@/components/layout/marketing-header";

export const metadata: Metadata = {
  title: "JEE Simulations Lab",
  description: "Explore Orange Nelumbo's interactive JEE Simulations Lab and play five free Physics and Mathematics demos.",
};

const demoLabs = [
  { slug: "vertical-throw", title: "Vertical throw", subject: "Physics", description: "Launch a body, pause at the apex, and read velocity and acceleration together.", icon: Orbit, accent: "#D8794A" },
  { slug: "projectile-range", title: "Projectile range", subject: "Physics", description: "Change speed and angle, then compare the path and horizontal range.", icon: Play, accent: "#D6A75B" },
  { slug: "simple-harmonic-motion", title: "Spring oscillator", subject: "Physics", description: "Watch kinetic and potential energy exchange through one complete cycle.", icon: Waves, accent: "#4D8F88" },
  { slug: "electric-field-mapper", title: "Electric field mapper", subject: "Physics", description: "Move charges and observe how the field direction and strength respond.", icon: Atom, accent: "#6FAF8B" },
  { slug: "function-grapher", title: "Function grapher", subject: "Mathematics", description: "Move a coefficient and see the curve transform without losing the equation.", icon: Sigma, accent: "#8C79A8" },
];

const labMethod = [
  { title: "Predict", description: "Pause before the run and decide what should change." },
  { title: "Control", description: "Move one variable so the cause stays visible." },
  { title: "Connect", description: "Read the motion, graph, and equation as the same relationship." },
];

export default function SimulationLabPage() {
  return (
    <div className="min-h-screen bg-[#0E0D10] text-white">
      <MarketingHeader />
      <main id="main-content">
        <section className="hero-grid overflow-hidden border-b border-[#D8794A]/24">
          <div className="mx-auto grid min-h-[650px] max-w-[1440px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:px-14 lg:py-20">
            <div>
              <h1 className="max-w-3xl font-display text-5xl font-bold leading-[.96] tracking-[-.04em] sm:text-6xl">A simulation lab for ideas that need to move.</h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-[#C7C5CC]">Change a value, make a prediction, and watch the equation become visible. Five labs are free; the full library is included with Notes + Simulations and Complete Library.</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link className="button-primary justify-center" href="/free-simulations">Play five free labs <ArrowRight aria-hidden="true" size={17} /></Link>
                <Link className="button-ghost justify-center" href="/courses/notes-and-simulations">See full lab access</Link>
              </div>
            </div>

            <div aria-label="Animated preview of a projectile lab" className="brand-grid relative min-h-[470px] overflow-hidden border border-[#D8794A]/28 bg-[#161418] p-6 sm:p-8" role="img">
              <div className="flex items-center justify-between border-b border-white/8 pb-5"><span className="font-semibold">Projectile range</span><span className="text-sm text-[#C7C5CC]">θ = 45°</span></div>
              <div className="relative mt-7 h-64 overflow-hidden border-b border-l border-white/15">
                <svg aria-hidden="true" className="absolute inset-0 size-full" preserveAspectRatio="none" viewBox="0 0 620 260">
                  <path d="M15 244 Q310 -30 605 244" fill="none" stroke="#D8794A" strokeDasharray="8 8" strokeWidth="3" />
                  <path d="M15 244 Q310 -30 605 244" fill="none" opacity=".14" stroke="#F3EEE7" strokeWidth="16" />
                  <circle className="sim-orbit-dot" cx="310" cy="107" fill="#F0C879" r="10" />
                </svg>
                <div className="absolute bottom-4 left-4 border border-white/10 bg-[#0E0D10]/90 px-3 py-2 text-sm text-[#DAD8DE]">Range = 63.8 m</div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {["Speed 25 m/s", "Angle 45°", "Gravity 9.8"].map((label) => <div className="border border-white/10 bg-[#0E0D10] p-3 text-center text-sm text-[#C7C5CC]" key={label}>{label}</div>)}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
            <h2 className="font-display text-4xl font-bold sm:text-5xl">Try the lab before choosing a course.</h2>
            <p className="max-w-2xl text-lg leading-8 text-[#C7C5CC]">Each public demo is complete enough to explore the interaction pattern. No sign-in is required for these five.</p>
          </div>
          <div className="mt-12 grid gap-px border border-white/10 bg-white/10 md:grid-cols-2 xl:grid-cols-5">
            {demoLabs.map(({ slug, title, subject, description, icon: Icon, accent }, index) => (
              <Link className={`group flex min-h-[330px] flex-col bg-[#161418] p-6 transition-colors hover:bg-[#1E1B20] ${index === demoLabs.length - 1 ? "md:col-span-2 xl:col-span-1" : ""}`} href={`/free-simulations?demo=${slug}`} key={slug}>
                <Icon aria-hidden="true" size={24} strokeWidth={1.5} style={{ color: accent }} />
                <div className="mt-auto">
                  <p className="text-sm font-semibold" style={{ color: accent }}>{subject}</p>
                  <h3 className="mt-3 font-display text-xl font-bold">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#C7C5CC]">{description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#D8794A]">Play free demo <ArrowRight className="transition-transform group-hover:translate-x-1" size={15} /></span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-y border-white/8 bg-[#161418]">
          <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
            <h2 className="font-display text-4xl font-bold">One simple learning loop</h2>
            <div className="mt-10 grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
              {labMethod.map((step, index) => <article className="min-h-60 bg-[#0E0D10] p-7 sm:p-8" key={step.title}><span className="font-mono text-sm text-[#D8794A]">0{index + 1}</span><h3 className="mt-10 font-display text-2xl font-bold">{step.title}</h3><p className="mt-4 leading-7 text-[#C7C5CC]">{step.description}</p></article>)}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:px-14 lg:py-24">
          <div>
            <FlaskConical aria-hidden="true" className="text-[#D8794A]" size={30} strokeWidth={1.5} />
            <h2 className="mt-7 max-w-3xl font-display text-4xl font-bold sm:text-5xl">Unlock every live simulation with the visual course.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#C7C5CC]">Notes + Simulations combines every visual note with the full interactive lab library, live graphs, prediction prompts, and new labs added during the year.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link className="button-primary justify-center" href="/courses/notes-and-simulations">View course details <ArrowRight aria-hidden="true" size={17} /></Link><Link className="button-outline justify-center" href="/checkout?plan=simulations">Choose the course</Link></div>
          </div>
          <ul className="border-t border-white/10">
            {["Every live Physics, Chemistry, and Mathematics lab", "Variable controls with instant visual feedback", "Graphs, readouts, and guided prediction prompts", "New simulation releases during the plan year"].map((feature) => <li className="flex gap-4 border-b border-white/10 py-5 text-[#DAD8DE]" key={feature}><Check className="mt-1 shrink-0 text-[#6FAF8B]" size={17} />{feature}</li>)}
          </ul>
        </section>

        <section className="border-y border-[#5F8D83]/25 bg-[#5F8D83]/6">
          <div className="mx-auto grid max-w-[1440px] gap-7 px-5 py-12 sm:px-8 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:px-14">
            <div className="grid size-14 place-items-center border border-[#6FAF8B]/30 text-[#6FAF8B]"><GraduationCap aria-hidden="true" size={27} /></div>
            <div><h2 className="font-display text-2xl font-bold">Educator access follows a separate path.</h2><p className="mt-2 leading-7 text-[#C7C5CC]">The educator demo can open the complete live simulation library without purchasing a student course while verification is pending.</p></div>
            <Link className="button-outline justify-center" href="/login?role=educator&returnTo=%2Fsimulations">Educator login</Link>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
