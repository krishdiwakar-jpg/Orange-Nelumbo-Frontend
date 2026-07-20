import Link from "next/link";
import { ArrowRight, Atom, BookOpen, Check, FlaskConical, PlayCircle, Sigma } from "lucide-react";

import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingHeader } from "@/components/layout/marketing-header";

const subjects = [
  { name: "Physics", icon: Atom, copy: "Diagrams, physical intuition, derivations, and interactive models." },
  { name: "Chemistry", icon: FlaskConical, copy: "Visual structures, reaction logic, trends, and concise revision maps." },
  { name: "Mathematics", icon: Sigma, copy: "Step-by-step reasoning, geometric meaning, and worked patterns." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0E0D10] text-white">
      <MarketingHeader />
      <main id="main-content">
        <section className="hero-grid border-b border-[#FF5A1F]/20">
          <div className="mx-auto grid min-h-[690px] max-w-[1440px] items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:px-14">
            <div>
              <h1 className="max-w-4xl font-display text-[clamp(2.8rem,6vw,5.4rem)] font-bold leading-[.98] tracking-[-.045em]">
                JEE concepts made <span className="text-gradient">visible.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#C7C5CC] sm:text-xl">
                Learn Physics, Chemistry, and Mathematics through visual notes and interactive simulations built for understanding—not information overload.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link className="button-primary justify-center" href="/signup">Explore the library <ArrowRight size={18} /></Link>
                <Link className="button-ghost justify-center" href="/login?demo=1">Open demo</Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#C7C5CC]/80">
                <span className="flex items-center gap-2"><Check size={15} className="text-[#3DE08A]" /> Visual notes</span>
                <span className="flex items-center gap-2"><Check size={15} className="text-[#3DE08A]" /> Interactive simulations</span>
                <span className="flex items-center gap-2"><Check size={15} className="text-[#3DE08A]" /> Video lectures coming soon</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[580px]">
              <div className="brand-grid border border-[#FF5A1F]/26 bg-[#161418] p-5 shadow-[0_0_90px_rgba(255,90,31,.10)] sm:p-7">
                <div className="flex items-center justify-between border-b border-white/9 pb-5">
                  <div><p className="text-sm font-semibold text-[#FF8A3D]">Physics · Kinematics</p><h2 className="mt-2 text-2xl font-bold">Motion under gravity</h2></div>
                  <BookOpen className="text-[#FF8A3D]" size={24} />
                </div>
                <div className="mt-7 rounded-full border border-[#FF5A1F]/20 p-8 sm:p-12">
                  <div className="relative mx-auto h-56 max-w-[300px]">
                    <div className="absolute inset-y-3 left-1/2 border-l border-dashed border-[#C7C5CC]/45" />
                    <span className="absolute bottom-0 left-1/2 size-8 -translate-x-1/2 rounded-full bg-[#F5D9A8]" />
                    <span className="absolute left-1/2 top-0 size-8 -translate-x-1/2 rounded-full bg-[#F5D9A8] shadow-[0_0_30px_rgba(255,138,61,.35)]" />
                    <span className="absolute right-1 top-2 text-sm font-semibold text-[#3DE0D0]">v = 0 at the top</span>
                    <span className="absolute left-2 top-20 text-sm text-[#FF8A3D]">g stays downward</span>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="border border-white/9 bg-[#0E0D10] p-4"><p className="text-sm text-[#C7C5CC]">A visual note explains the idea.</p></div>
                  <div className="border border-white/9 bg-[#0E0D10] p-4"><p className="text-sm text-[#C7C5CC]">A simulation lets you test it.</p></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell" id="notes">
          <div>
            <div className="section-heading">
              <h2 className="max-w-3xl font-display text-4xl font-bold sm:text-5xl">Notes designed to help you see the logic.</h2>
              <p className="max-w-xl text-lg leading-8 text-[#C7C5CC]">Each topic brings together diagrams, definitions, derivations, formulas, and common mistakes in one focused reading experience.</p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {subjects.map(({ name, icon: Icon, copy }) => (
                <article className="border border-[#FF5A1F]/22 bg-[#161418] p-7" key={name}>
                  <span className="grid size-12 place-items-center border border-[#FF5A1F]/30 text-[#FF8A3D]"><Icon size={22} /></span>
                  <h3 className="mt-8 text-2xl font-bold">{name}</h3>
                  <p className="mt-3 leading-7 text-[#C7C5CC]">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/8 bg-[#161418]" id="simulations">
          <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:px-14 lg:py-24">
            <div>
              <FlaskConical className="text-[#3DE0D0]" size={34} />
              <h2 className="mt-7 font-display text-4xl font-bold sm:text-5xl">Move a variable. Watch the concept respond.</h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-[#C7C5CC]">Simulations turn formulas into behaviour. Predict first, adjust the inputs, and build intuition you can carry into a question.</p>
              <Link className="button-outline mt-8" href="/login?returnTo=%2Fsimulations">Explore simulations <ArrowRight size={17} /></Link>
            </div>
            <div className="border border-[#FF5A1F]/22 bg-[#0E0D10] p-6 sm:p-8">
              <div className="flex items-center justify-between"><h3 className="text-2xl font-bold">Vertical throw</h3><span className="text-sm font-semibold text-[#3DE08A]">Live</span></div>
              <div className="mt-8 h-2 bg-[#2A262E]"><div className="h-full w-[62%] bg-[#FF5A1F]" /></div>
              <div className="mt-4 flex justify-between text-sm text-[#C7C5CC]"><span>Launch speed</span><span className="font-semibold text-white">9.8 m/s</span></div>
              <div className="mt-10 grid grid-cols-3 gap-px bg-white/10">
                {[["Time", "2.00 s"], ["Velocity", "−9.80 m/s"], ["Height", "0.00 m"]].map(([label, value]) => <div className="bg-[#161418] p-4" key={label}><p className="text-xs text-[#C7C5CC]/70">{label}</p><p className="mt-2 text-sm font-bold text-[#3DE0D0] sm:text-base">{value}</p></div>)}
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell" id="videos">
          <div className="hero-grid grid gap-10 border border-[#FF5A1F]/24 bg-[#161418] p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end lg:p-14">
            <div>
              <PlayCircle className="text-[#FF8A3D]" size={34} />
              <h2 className="mt-7 max-w-3xl font-display text-4xl font-bold sm:text-5xl">Visual-first video lectures are coming.</h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#C7C5CC]">Videos will connect directly to the same notes and simulations, so every topic stays part of one clear learning path.</p>
            </div>
            <Link className="button-primary justify-center" href="/signup">Start with the notes <ArrowRight size={17} /></Link>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
