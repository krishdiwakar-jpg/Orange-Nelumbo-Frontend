import Link from "next/link";
import {
  ArrowRight,
  Atom,
  BookOpen,
  Check,
  ChevronDown,
  FlaskConical,
  GraduationCap,
  Orbit,
  Play,
  Quote,
  Sigma,
  Sparkles,
  Waves,
} from "lucide-react";

import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { HeroSimulationCanvas } from "@/components/marketing/hero-simulation-canvas";
import { testimonials } from "@/data/platform";

const demoSimulations = [
  { slug: "vertical-throw", number: "01", title: "Vertical throw", subject: "Physics", copy: "Launch, pause at the apex, and return.", icon: Orbit, color: "#FF8A3D" },
  { slug: "projectile-range", number: "02", title: "Projectile range", subject: "Physics", copy: "Change the angle and trace the range.", icon: Play, color: "#F5D9A8" },
  { slug: "simple-harmonic-motion", number: "03", title: "Spring oscillator", subject: "Physics", copy: "Watch kinetic and potential energy trade.", icon: Waves, color: "#3DE0D0" },
  { slug: "electric-field-mapper", number: "04", title: "Electric field", subject: "Physics", copy: "Separate charges and read the field.", icon: Atom, color: "#3DE08A" },
  { slug: "function-grapher", number: "05", title: "Function grapher", subject: "Mathematics", copy: "Move a coefficient and reshape the curve.", icon: Sigma, color: "#B48CFF" },
];

const notePreviews = [
  { slug: "motion-under-gravity", subject: "Physics", chapter: "Kinematics", title: "Motion under gravity", formula: "v² = u² + 2as", icon: Atom, color: "#FF8A3D" },
  { slug: "electric-field-potential", subject: "Physics", chapter: "Electrostatics", title: "Electric field & potential", formula: "E = −dV / dr", icon: Atom, color: "#3DE0D0" },
  { slug: "chemical-bonding", subject: "Chemistry", chapter: "Inorganic", title: "Chemical bonding", formula: "SN = σ + LP", icon: FlaskConical, color: "#3DE08A" },
  { slug: "entropy-spontaneity", subject: "Chemistry", chapter: "Thermodynamics", title: "Entropy & spontaneity", formula: "ΔG = ΔH − TΔS", icon: FlaskConical, color: "#F6C344" },
  { slug: "integration-accumulation", subject: "Mathematics", chapter: "Calculus", title: "Integration as accumulation", formula: "∫ f(x)dx", icon: Sigma, color: "#B48CFF" },
];

const utilitySteps = [
  { title: "See the mechanism", copy: "Begin with a visual note that reveals what the equation is describing." },
  { title: "Change one variable", copy: "Use a simulation to isolate a cause and observe its effect." },
  { title: "Retrieve the idea", copy: "Close the note and explain the relationship in your own words." },
  { title: "Revisit the weak link", copy: "Return only to the connection that did not hold—not the whole chapter." },
];

const heatRows = [
  { name: "Motion", cells: [1, .75, .55, .28] },
  { name: "Forces", cells: [.72, 1, .78, .36] },
  { name: "Energy", cells: [.48, .82, 1, .52] },
  { name: "Rotation", cells: [.28, .56, .86, 1] },
  { name: "Electrostatics", cells: [.62, .92, .64, .42] },
  { name: "Optics", cells: [.36, .58, .74, .88] },
];

const homePlans = [
  { name: "Notes", price: "₹4,999", description: "A focused visual notebook across Physics, Chemistry, and Mathematics.", features: ["Complete visual note library", "Five public sample notes", "Protected full-page reader", "Bookmarks and reading progress"], cta: "Choose Notes" },
  { name: "Notes + Simulations", price: "₹6,999", description: "Connect every important relationship with a model you can control.", features: ["Everything in Notes", "Complete simulation library", "Variable controls and live graphs", "New labs added through the year"], cta: "Choose the visual plan", featured: true },
  { name: "Complete Library", price: "₹9,999", description: "The complete notes and simulations collection, organised into guided visual sequences.", features: ["Everything in Notes + Simulations", "Curated concept maps", "Educator-curated visual sequences", "All library additions this year"], cta: "Choose Complete" },
];

const homeFaqs = [
  { question: "What can I use on Orange Nelumbo today?", answer: "Visual notes and interactive simulations are available across Physics, Chemistry, and Mathematics." },
  { question: "Can I try anything without signing in?", answer: "Yes. Five simulations and five note previews are public, so you can understand the learning experience before creating an account." },
  { question: "Are these resources for JEE Main and Advanced?", answer: "Yes. The library builds the shared foundation first, then shows the deeper derivations, edge cases, and connections relevant to JEE Advanced." },
  { question: "Is there an adaptive engine or test platform?", answer: "No. Orange Nelumbo is intentionally focused on visual notes and simulations. It does not claim to be an adaptive practice engine." },
  { question: "How does educator access work?", answer: "Invited educators receive a separate login for exclusive academic resources and contributor material. Student and educator accounts stay distinct." },
  { question: "Do notes open inside the dashboard?", answer: "No. Notes open on a dedicated reader page, keeping the learning layout focused and making it possible to add stronger content-protection controls." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0E0D10] text-white">
      <MarketingHeader />
      <main id="main-content">
        <section className="hero-grid overflow-hidden border-b border-[#FF5A1F]/20">
          <div className="mx-auto grid min-h-[720px] max-w-[1440px] items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[.92fr_1.08fr] lg:px-14 lg:py-20">
            <div>
              <h1 className="max-w-4xl font-display text-[clamp(3.15rem,5.45vw,5rem)] font-extrabold uppercase leading-[.84] tracking-[-.065em]">
                <span className="block">JEE prep</span>
                <span className="block">that makes</span>
                <span className="text-gradient block">hard ideas</span>
                <span className="relative inline-block pb-3">
                  feel clear.
                  <svg aria-hidden="true" className="pointer-events-none absolute -bottom-1 left-[-1%] h-5 w-[104%] overflow-visible" preserveAspectRatio="none" viewBox="0 0 430 22">
                    <path d="M3 13 C86 2 151 18 229 15 C301 12 356 3 417 9" fill="none" stroke="#FF8A3D" strokeLinecap="round" strokeWidth="4" />
                    <circle cx="425" cy="9" fill="#FF8A3D" r="5" />
                  </svg>
                </span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-[#C7C5CC] sm:text-xl">Learn Physics, Chemistry, and Mathematics through visual notes and interactive simulations built for understanding—not information overload.</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link className="button-primary justify-center" href="/free-simulations">Explore free simulations <ArrowRight size={18}/></Link><Link className="button-ghost justify-center" href="/sample-notes">Preview visual notes</Link></div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#C7C5CC]/80"><span className="flex items-center gap-2"><Check className="text-[#3DE08A]" size={15}/> Visual notes</span><span className="flex items-center gap-2"><Check className="text-[#3DE08A]" size={15}/> Interactive simulations</span></div>
            </div>
            <HeroSimulationCanvas />
          </div>
        </section>

        <section className="section-shell" id="simulations">
          <div>
            <div className="section-heading"><h2 className="max-w-3xl font-display text-4xl font-bold sm:text-5xl">A lab that turns formulas into behaviour.</h2><div><p className="text-lg leading-8 text-[#C7C5CC]">Play with five free simulations. Change one input, predict the outcome, and see the relationship respond.</p><Link className="button-outline mt-7" href="/free-simulations">Explore free simulations <ArrowRight size={17}/></Link></div></div>
            <div className="mt-12 grid gap-px border border-[#FF5A1F]/20 bg-[#FF5A1F]/20 md:grid-cols-2 xl:grid-cols-5">
              {demoSimulations.map(({ slug, title, subject, copy, icon: Icon, color }, index) => <Link className={`group min-h-64 bg-[#161418] p-6 transition hover:bg-[#1E1B20] ${index === demoSimulations.length - 1 ? "md:col-span-2 xl:col-span-1" : ""}`} href={`/free-simulations?demo=${slug}`} key={slug}><div className="flex justify-end"><Icon size={20} style={{ color }}/></div><div className="mt-16"><p className="text-[11px] font-semibold text-[#C7C5CC]/65">{subject}</p><h3 className="mt-3 font-display text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-[#C7C5CC]">{copy}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#FF8A3D]">Play demo <ArrowRight className="transition group-hover:translate-x-1" size={15}/></span></div></Link>)}
            </div>
          </div>
        </section>

        <section className="border-y border-white/8 bg-[#161418]" id="notes">
          <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-14 lg:py-28">
            <div className="section-heading"><h2 className="max-w-3xl font-display text-4xl font-bold sm:text-5xl">Preview the logic before opening the full note.</h2><div><p className="text-lg leading-8 text-[#C7C5CC]">Five sample notes show how diagrams, relationships, and retention points fit together across all three subjects.</p><Link className="button-primary mt-7" href="/sample-notes">Browse sample notes <ArrowRight size={17}/></Link></div></div>
            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              {notePreviews.map(({ slug, subject, chapter, title, formula, icon: Icon, color }, index) => <Link className={`note-paper group overflow-hidden border border-white/10 transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,0,0,.3)] ${index === notePreviews.length - 1 ? "md:col-span-2 xl:col-span-1" : ""}`} href={`/sample-notes?note=${slug}`} key={slug}><div className="h-2" style={{ background: color }}/><div className="p-5"><div className="flex items-center justify-between"><Icon size={20} style={{ color }}/><BookOpen className="text-[#5E5962]" size={17}/></div><p className="mt-10 text-[11px] font-semibold text-[#514C55]">{subject} · {chapter}</p><h3 className="mt-3 min-h-14 font-display text-lg font-bold">{title}</h3><div className="mt-5 border-l-2 border-[#FF5A1F] bg-[#FF5A1F]/10 p-3 font-display text-lg font-semibold text-[#241F25]">{formula}</div><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#742608]">Open preview <ArrowRight size={15}/></span></div></Link>)}
            </div>
          </div>
        </section>

        <section className="section-shell" id="marginal-utility">
          <div className="grid items-center gap-12 lg:grid-cols-[1.03fr_.97fr] lg:gap-16">
            <div className="brand-grid border border-[#FF5A1F]/22 bg-[#161418] p-6 sm:p-9">
              <h3 className="font-display text-2xl font-bold">Useful understanding</h3>
              <div className="relative mt-8 min-h-[360px] border-l border-b border-white/20">
                <svg aria-label="A diminishing curve showing the value of focused study actions" className="absolute inset-0 size-full" preserveAspectRatio="none" viewBox="0 0 600 360"><defs><linearGradient id="utilityFill" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#FF5A1F" stopOpacity=".35"/><stop offset="1" stopColor="#FF5A1F" stopOpacity=".02"/></linearGradient></defs><path d="M0 340 C75 175 150 98 245 60 C350 20 470 14 600 11 L600 360 L0 360Z" fill="url(#utilityFill)"/><path d="M0 340 C75 175 150 98 245 60 C350 20 470 14 600 11" fill="none" stroke="#FF8A3D" strokeWidth="5"/><line x1="145" x2="145" y1="0" y2="360" stroke="#3DE0D0" strokeDasharray="6 8" opacity=".75"/><circle className="sim-pulse" cx="145" cy="104" fill="#3DE0D0" r="8"/></svg>
                <div className="absolute left-[27%] top-[17%] max-w-44 border border-[#3DE0D0]/35 bg-[#0E0D10]/90 p-3 text-xs leading-5 text-[#C7C5CC]">The next focused connection adds more than another hour of passive rereading.</div>
                <span className="absolute -bottom-9 right-0 text-xs font-medium text-[#C7C5CC]/60">Study effort →</span>
              </div>
            </div>
            <div>
              <h2 className="max-w-2xl font-display text-4xl font-bold sm:text-5xl">Make every extra minute earn its place.</h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#C7C5CC]">Marginal utility is simply the usefulness of your next study action. It is not an adaptive score. It is a way to move from seeing, to testing, to remembering without repeating the entire chapter.</p>
              <div className="mt-9 border-t border-[#FF5A1F]/25">{utilitySteps.map((step, index) => <details className="group border-b border-[#FF5A1F]/20" key={step.title} open={index === 0}><summary className="flex min-h-18 cursor-pointer list-none items-center gap-5 py-5 marker:hidden"><span className="text-xs font-semibold text-[#FF8A3D]">{index + 1}</span><span className="font-display text-xl font-bold">{step.title}</span><ChevronDown className="ml-auto text-[#FF8A3D] transition group-open:rotate-180" size={18}/></summary><p className="pb-6 pl-10 text-sm leading-7 text-[#C7C5CC]">{step.copy}</p></details>)}</div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/8 bg-[#161418]" id="concept-map">
          <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[.78fr_1.22fr] lg:px-14 lg:py-28">
            <div><h2 className="max-w-xl font-display text-4xl font-bold sm:text-5xl">See the chapter before you enter it.</h2><p className="mt-6 max-w-lg text-lg leading-8 text-[#C7C5CC]">A concept map exposes the dependencies between topics. The heat view makes strong connections visible, so a chapter feels like a system rather than a list.</p><div className="mt-8 flex flex-wrap gap-5 text-xs text-[#C7C5CC]"><span className="flex items-center gap-2"><i className="size-3 bg-[#FF5A1F]"/> Strong dependency</span><span className="flex items-center gap-2"><i className="size-3 bg-[#FF5A1F]/45"/> Supporting link</span><span className="flex items-center gap-2"><i className="size-3 bg-[#FF5A1F]/15"/> Light connection</span></div></div>
            <div className="overflow-x-auto border border-[#FF5A1F]/22 bg-[#0E0D10] p-5 sm:p-7">
              <div className="min-w-[620px]"><div className="grid grid-cols-[150px_repeat(4,1fr)] gap-2 pb-3 text-[11px] font-semibold text-[#C7C5CC]/65"><span>Concept</span><span>Foundation</span><span>Connect</span><span>Apply</span><span>Revisit</span></div>{heatRows.map((row) => <div className="grid grid-cols-[150px_repeat(4,1fr)] gap-2 border-t border-white/7 py-2" key={row.name}><span className="flex items-center text-sm font-bold">{row.name}</span>{row.cells.map((strength, index) => <div aria-label={`${row.name} ${["foundation", "connection", "application", "revision"][index]} strength ${Math.round(strength * 100)} percent`} className="concept-heat-cell min-h-14 border border-[#FF5A1F]/18" key={index} style={{ "--heat": strength } as React.CSSProperties}><span className="text-[11px] font-semibold text-white/70">{Math.round(strength * 100)}</span></div>)}</div>)}</div>
            </div>
          </div>
        </section>

        <section className="section-shell" id="pricing">
          <div><div className="section-heading"><h2 className="max-w-3xl font-display text-4xl font-bold sm:text-5xl">Choose how much of the visual library you need.</h2><p className="text-lg leading-8 text-[#C7C5CC]">Three clear annual plans. No adaptive engine, no unrelated test-prep features, and no hidden product layer.</p></div>
            <div className="mt-12 grid gap-5 lg:grid-cols-3">{homePlans.map((plan) => <article className={`relative flex min-h-[560px] flex-col border p-7 sm:p-8 ${plan.featured ? "border-[#FF5A1F] bg-[#1E1B20] shadow-[0_0_70px_rgba(255,90,31,.12)]" : "border-white/10 bg-[#161418]"}`} key={plan.name}>{plan.featured ? <span className="absolute right-0 top-0 bg-[#FF5A1F] px-4 py-2 text-xs font-bold text-[#0E0D10]">Most visual</span> : null}<h3 className="font-display text-2xl font-bold">{plan.name}</h3><p className="mt-6"><span className="font-display text-4xl font-bold">{plan.price}</span><span className="ml-2 text-sm text-[#C7C5CC]">/ year</span></p><p className="mt-5 min-h-20 leading-7 text-[#C7C5CC]">{plan.description}</p><ul className="mt-7 space-y-4">{plan.features.map((feature) => <li className="flex gap-3 text-sm leading-6 text-[#C7C5CC]" key={feature}><Check className="mt-1 shrink-0 text-[#3DE08A]" size={16}/>{feature}</li>)}</ul><Link className={`${plan.featured ? "button-primary" : "button-outline"} mt-auto justify-center`} href="/signup">{plan.cta}</Link></article>)}</div>
          </div>
        </section>

        <section className="overflow-hidden border-y border-[#FF5A1F]/20 bg-[#FF5A1F]" id="educators">
          <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-16 text-[#0E0D10] sm:px-8 lg:grid-cols-[1fr_auto] lg:px-14 lg:py-20">
            <div className="flex max-w-4xl items-start gap-6"><span className="grid size-14 shrink-0 place-items-center border border-[#0E0D10]/30"><GraduationCap size={27}/></span><div><h2 className="font-display text-3xl font-bold text-[#0E0D10] sm:text-5xl">Educators get a separate door.</h2><p className="mt-5 max-w-2xl text-lg leading-8 text-[#0E0D10]/75">Use educator login for exclusive academic content, contributor resources, and material prepared specifically for invited teachers.</p></div></div>
            <Link className="button-dark" href="/login?role=educator&returnTo=%2Fdashboard">Educator login <ArrowRight size={17}/></Link>
          </div>
        </section>

        <section className="section-shell" id="testimonials">
          <div><div className="section-heading"><h2 className="max-w-3xl font-display text-4xl font-bold sm:text-5xl">What changes when the concept becomes visible.</h2><p className="text-lg leading-8 text-[#C7C5CC]">Students describe the shift from memorising isolated results to seeing how the ideas connect.</p></div><div className="mt-12 grid gap-5 lg:grid-cols-3">{testimonials.slice(0, 3).map((item, index) => <figure className={`border p-7 sm:p-8 ${index === 1 ? "border-[#FF5A1F]/55 bg-[#1E1B20]" : "border-white/10 bg-[#161418]"}`} key={item.id}><Quote className="text-[#FF8A3D]" size={25}/><blockquote className="mt-7 font-display text-xl leading-8">“{item.quote}”</blockquote><figcaption className="mt-8 border-t border-white/9 pt-5"><p className="font-bold">{item.name}</p><p className="mt-1 text-sm text-[#C7C5CC]">{item.detail}</p></figcaption></figure>)}</div></div>
        </section>

        <section className="border-t border-white/8 bg-[#161418]" id="faqs">
          <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[.72fr_1.28fr] lg:px-14 lg:py-28">
            <div className="lg:sticky lg:top-28 lg:self-start"><Sparkles className="text-[#FF8A3D]" size={28}/><h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">Questions answered. Try the idea next.</h2><p className="mt-5 max-w-md text-lg leading-8 text-[#C7C5CC]">Start with five simulations and five note previews. No sign-in is needed for either.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row lg:items-start"><Link className="button-primary justify-center" href="/free-simulations">Start with a simulation <ArrowRight size={17}/></Link><Link className="button-ghost justify-center" href="/sample-notes">Open a note</Link></div></div>
            <div className="border-t border-[#FF5A1F]/25">{homeFaqs.map((item, index) => <details className="group border-b border-[#FF5A1F]/20" key={item.question} open={index === 0}><summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-5 font-display text-lg font-bold marker:hidden sm:text-xl"><span>{item.question}</span><ChevronDown className="shrink-0 text-[#FF8A3D] transition group-open:rotate-180" size={20}/></summary><p className="max-w-3xl pb-6 pr-8 leading-7 text-[#C7C5CC]">{item.answer}</p></details>)}</div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
