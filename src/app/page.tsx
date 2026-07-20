import Link from "next/link";
import {
  ArrowRight,
  Atom,
  BarChart3,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronDown,
  FlaskConical,
  Gauge,
  MoveUpRight,
  Play,
  Sigma,
  Sparkles,
  Target,
  TimerReset,
  Trophy,
} from "lucide-react";

import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingHeader } from "@/components/layout/marketing-header";

const flow = [
  {
    number: "01",
    title: "Learn the concept",
    detail: "Structured notes, derivations, visual proofs, and exam-pattern traps — without the content dump.",
    icon: BookOpen,
  },
  {
    number: "02",
    title: "See it move",
    detail: "Manipulate live simulations until the equation becomes something you can predict, not memorise.",
    icon: Atom,
  },
  {
    number: "03",
    title: "Prove the recall",
    detail: "Solve targeted questions at the exact concept and difficulty where your performance drops.",
    icon: BrainCircuit,
  },
  {
    number: "04",
    title: "Pressure-test it",
    detail: "Mocks recreate time, switching cost, and uncertainty — then return a precise rank map.",
    icon: Gauge,
  },
];

const plans = [
  {
    name: "Notes",
    price: "₹4,999",
    label: "Structured foundation",
    features: ["All PCM notes", "Concept visualisations", "Reading planner", "Progress tracking"],
  },
  {
    name: "Complete",
    price: "₹9,999",
    label: "The full adaptive engine",
    features: ["Everything in Notes", "Targeted practice", "12 full mocks", "Rank map + analytics"],
    featured: true,
  },
  {
    name: "Practice",
    price: "₹6,999",
    label: "For revision mode",
    features: ["Topic drills", "Practice mocks", "AIR challenges", "Detailed solutions"],
  },
];

const faqs = [
  [
    "Is this for JEE Main or JEE Advanced?",
    "Both. Your target and current level shape the question mix, planner intensity, and mock recommendations. You can change the target any time.",
  ],
  [
    "What makes the learning flow adaptive?",
    "Your read state, practice accuracy, response time, confidence, and mock performance feed a front-end rank map that chooses what should return next.",
  ],
  [
    "Can I try it without paying?",
    "Yes. The dummy experience includes onboarding, a diagnostic, sample notes, a live simulation, practice, and an illustrative result report. No card is required.",
  ],
  [
    "Does the platform guarantee a rank?",
    "No. Projected AIR is an illustrative model estimate, not a prediction or guarantee. It is designed to make gaps and progress easier to act on.",
  ],
];

function RankTrajectory() {
  return (
    <svg aria-label="Illustrative projected rank trajectory" className="h-full w-full" viewBox="0 0 620 420">
      <defs>
        <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#FF5A1F" stopOpacity=".28" />
          <stop offset="1" stopColor="#FF5A1F" stopOpacity="0" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {[70, 140, 210, 280, 350].map((y) => (
        <line key={y} stroke="#2A262E" strokeWidth="1" x1="50" x2="590" y1={y} y2={y} />
      ))}
      {[50, 158, 266, 374, 482, 590].map((x) => (
        <line key={x} stroke="#2A262E" strokeWidth="1" x1={x} x2={x} y1="40" y2="370" />
      ))}
      <path d="M50 86 C150 130 180 127 240 186 S355 216 410 276 S520 316 590 338 L590 370 L50 370Z" fill="url(#area)" />
      <path d="M50 86 C150 130 180 127 240 186 S355 216 410 276 S520 316 590 338" fill="none" stroke="#FF5A1F" strokeWidth="4" />
      <path d="M50 126 C155 159 206 173 266 215 S392 246 448 299 S536 326 590 342" fill="none" stroke="#3DE0D0" strokeDasharray="7 9" strokeWidth="2" />
      <circle cx="590" cy="338" fill="#FF5A1F" filter="url(#glow)" r="7" />
      <circle cx="590" cy="342" fill="#3DE0D0" r="3" />
      <text fill="#C7C5CC" fontFamily="JetBrains Mono" fontSize="12" x="50" y="397">WEEK 01</text>
      <text fill="#C7C5CC" fontFamily="JetBrains Mono" fontSize="12" textAnchor="end" x="590" y="397">WEEK 12</text>
    </svg>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0E0D10] text-white">
      <MarketingHeader />
      <main id="main-content">
        <section className="hero-grid relative isolate overflow-hidden border-b border-[#FF5A1F]/20">
          <div className="absolute -right-36 -top-36 size-[520px] rounded-full bg-[#FF5A1F]/12 blur-[110px]" />
          <div className="mx-auto grid min-h-[calc(100svh-108px)] max-w-[1440px] items-center gap-16 px-5 py-20 sm:px-8 lg:grid-cols-[1.04fr_.96fr] lg:px-14 lg:py-24">
            <div className="relative z-10">
              <p className="kicker">01 — Adaptive JEE engine</p>
              <h1 className="mt-7 max-w-[790px] font-display text-[clamp(3rem,6vw,3.5rem)] font-bold leading-none tracking-[-.02em]">
                Know your <span className="text-gradient">weak point.</span>
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-8 text-[#C7C5CC] sm:text-xl">
                The platform reads your performance in real time and targets exactly what is holding your rank back.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link className="button-primary" href="/signup">
                  Build my rank map <ArrowRight aria-hidden="true" size={18} />
                </Link>
                <Link className="button-ghost" href="/login?demo=1">
                  <Play aria-hidden="true" size={17} /> Preview the platform
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 font-mono text-[11px] uppercase tracking-[.13em] text-[#C7C5CC]/80">
                <span className="flex items-center gap-2"><Check size={14} className="text-[#3DE08A]" /> No card required</span>
                <span className="flex items-center gap-2"><Check size={14} className="text-[#3DE08A]" /> PCM mapped</span>
                <span className="flex items-center gap-2"><Check size={14} className="text-[#3DE08A]" /> JEE Main + Advanced</span>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-[620px]">
              <div className="absolute inset-10 rounded-full border border-[#FF5A1F]/20 orbit-spin" />
              <div className="absolute inset-24 rounded-full border border-[#3DE0D0]/14 orbit-spin-reverse" />
              <div className="relative border border-[#FF5A1F]/24 bg-[#161418]/88 p-4 shadow-[0_0_100px_rgba(255,90,31,.10)] backdrop-blur sm:p-6">
                <div className="flex items-center justify-between border-b border-white/8 pb-4">
                  <div>
                    <p className="kicker">Projected AIR · model estimate</p>
                    <p className="mt-2 font-mono text-3xl font-semibold text-[#3DE0D0]">4,120 → 890</p>
                  </div>
                  <div className="grid size-14 place-items-center border border-[#FF5A1F]/30 bg-[#0E0D10]">
                    <Target aria-hidden="true" className="text-[#FF8A3D]" size={25} strokeWidth={1.6} />
                  </div>
                </div>
                <div className="aspect-[1.48] w-full pt-5">
                  <RankTrajectory />
                </div>
                <div className="grid grid-cols-3 border-t border-white/8 pt-4">
                  {[['ACCURACY','78.4%'],['VELOCITY','1.42×'],['WEAK LINKS','06']].map(([label, value]) => (
                    <div className="border-r border-white/8 px-3 last:border-0" key={label}>
                      <p className="font-mono text-[11px] tracking-[.16em] text-[#C7C5CC]/70">{label}</p>
                      <p className="mt-2 font-mono text-sm text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-7 -left-4 hidden items-center gap-3 border border-[#FF5A1F]/25 bg-[#0E0D10] px-4 py-3 shadow-2xl sm:flex">
                <span className="size-2 bg-[#3DE08A] shadow-[0_0_16px_#3DE08A]" />
                <span className="font-mono text-[11px] tracking-[.15em] text-[#C7C5CC]">ENGINE ACTIVE · PLAN UPDATED</span>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/8 bg-[#161418]">
          <div className="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-y divide-white/8 px-5 sm:px-8 md:grid-cols-4 md:divide-y-0 lg:px-14">
            {[
              ["32", "mapped topics"],
              ["10", "interactive labs"],
              ["12", "full mock papers"],
              ["24/7", "adaptive planning"],
            ].map(([value, label]) => (
              <div className="px-5 py-8 sm:px-7" key={label}>
                <p className="font-mono text-2xl font-semibold text-[#FF8A3D]">{value}</p>
                <p className="mt-2 text-sm text-[#C7C5CC]/80">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section-shell" id="engine">
          <div className="section-heading">
            <div>
              <p className="kicker">02 — Why we exist</p>
              <h2 className="mt-5 max-w-3xl font-display text-4xl font-bold tracking-[-.02em] sm:text-5xl lg:text-[3.5rem]">
                JEE is precision under pressure.
              </h2>
            </div>
            <p className="max-w-xl text-lg leading-8 text-[#C7C5CC]">
              Most prep counts hours and chapters. We measure the decisions that change your outcome — concept recall, question selection, time, and recovery.
            </p>
          </div>
          <div className="mt-14 grid border-l border-t border-[#FF5A1F]/22 md:grid-cols-3">
            {[
              [BrainCircuit, "Adaptive", "Your plan changes with every answer. The next task is chosen from evidence, not a fixed timetable."],
              [TimerReset, "Relentless", "Weak concepts return before they decay. Strong concepts move into maintenance, not repetition."],
              [Sparkles, "Human", "Behind every metric is a student betting on their future. Feedback stays specific, calm, and on your side."],
            ].map(([Icon, title, copy]) => {
              const FeatureIcon = Icon as typeof BrainCircuit;
              return (
                <article className="group border-b border-r border-[#FF5A1F]/22 bg-[#161418] p-7 transition hover:bg-[#1E1B20] sm:p-9" key={title as string}>
                  <FeatureIcon aria-hidden="true" className="text-[#FF8A3D]" size={28} strokeWidth={1.5} />
                  <h3 className="mt-10 font-display text-2xl font-bold">{title as string}</h3>
                  <p className="mt-4 leading-7 text-[#C7C5CC]">{copy as string}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="section-shell border-y border-white/8 bg-[#161418]" id="study-flow">
          <div className="grid gap-14 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <p className="kicker">03 — Study flow</p>
              <h2 className="mt-5 font-display text-4xl font-bold tracking-[-.02em] sm:text-5xl">
                One loop. Every chapter.
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-8 text-[#C7C5CC]">
                Reading becomes useful only when you can retrieve, transfer, and execute. Every topic closes that loop.
              </p>
              <Link className="button-outline mt-8 inline-flex" href="/signup">
                See your study path <MoveUpRight size={17} />
              </Link>
            </div>
            <div className="divide-y divide-[#FF5A1F]/22 border-y border-[#FF5A1F]/22">
              {flow.map(({ number, title, detail, icon: Icon }) => (
                <article className="grid gap-5 py-7 sm:grid-cols-[72px_1fr_auto] sm:items-center sm:py-9" key={number}>
                  <p className="font-mono text-sm text-[#FF5A1F]">{number}</p>
                  <div>
                    <h3 className="font-display text-2xl font-semibold">{title}</h3>
                    <p className="mt-2 max-w-xl leading-7 text-[#C7C5CC]">{detail}</p>
                  </div>
                  <div className="grid size-12 place-items-center border border-[#FF5A1F]/25 text-[#FF8A3D]">
                    <Icon aria-hidden="true" size={22} strokeWidth={1.5} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell">
          <div className="section-heading">
            <div>
              <p className="kicker">04 — Your cockpit</p>
              <h2 className="mt-5 font-display text-4xl font-bold tracking-[-.02em] sm:text-5xl">
                See the lever. Pull it.
              </h2>
            </div>
            <p className="max-w-xl text-lg leading-8 text-[#C7C5CC]">
              The dashboard ranks work by impact. Continue what matters, understand why, and watch the gap close.
            </p>
          </div>
          <div className="mt-14 grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
            <article className="hero-grid border border-[#FF5A1F]/25 bg-[#161418] p-6 sm:p-8">
              <div className="flex flex-col justify-between gap-7 border-b border-white/8 pb-7 sm:flex-row sm:items-end">
                <div>
                  <p className="kicker">Priority sequence · Physics</p>
                  <h3 className="mt-4 font-display text-3xl font-semibold">Rotational motion</h3>
                  <p className="mt-2 text-[#C7C5CC]">Your largest rank lever. 24 targeted problems queued.</p>
                </div>
                <div className="font-mono text-sm text-[#3DE0D0]">MASTERY 62%</div>
              </div>
              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                {[
                  ["READ", "Torque & angular momentum", "18 min", BookOpen],
                  ["SIMULATE", "Rolling vs sliding", "12 min", FlaskConical],
                  ["PRACTISE", "Pure rolling constraints", "24 Q", Target],
                ].map(([label, title, meta, Icon]) => {
                  const ItemIcon = Icon as typeof BookOpen;
                  return (
                    <div className="border border-white/9 bg-[#0E0D10]/85 p-5" key={label as string}>
                      <ItemIcon className="text-[#FF8A3D]" size={19} strokeWidth={1.5} />
                      <p className="mt-8 font-mono text-[11px] tracking-[.18em] text-[#C7C5CC]/70">{label as string}</p>
                      <p className="mt-2 font-semibold">{title as string}</p>
                      <p className="mt-3 font-mono text-[11px] text-[#3DE0D0]">{meta as string}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                <div className="h-1.5 min-w-[220px] flex-1 bg-[#2A262E]">
                  <div className="h-full w-[62%] bg-gradient-to-r from-[#FF5A1F] to-[#FF8A3D]" />
                </div>
                <Link className="button-primary" href="/login?demo=1">
                  Continue <ArrowRight size={17} />
                </Link>
              </div>
            </article>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              <article className="border border-[#FF5A1F]/22 bg-[#161418] p-6">
                <div className="flex items-center justify-between">
                  <p className="kicker">Today</p>
                  <span className="font-mono text-xs text-[#3DE08A]">03 / 05</span>
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold">82 focused minutes</h3>
                <div className="mt-5 h-1.5 bg-[#2A262E]"><div className="h-full w-[60%] bg-[#3DE08A]" /></div>
                <p className="mt-4 text-sm leading-6 text-[#C7C5CC]/80">Two tasks remain to protect your 47-day streak.</p>
              </article>
              <article className="border border-[#FF5A1F]/22 bg-[#161418] p-6">
                <div className="flex items-center justify-between">
                  <p className="kicker">Rank lever</p>
                  <BarChart3 className="text-[#FF8A3D]" size={20} />
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold">+18 marks</h3>
                <p className="mt-3 text-sm leading-6 text-[#C7C5CC]/80">Available in rotational mechanics and electrostatics this cycle.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section-shell border-y border-white/8 bg-[#161418]">
          <div className="section-heading">
            <div>
              <p className="kicker">05 — PCM telemetry</p>
              <h2 className="mt-5 font-display text-4xl font-bold tracking-[-.02em] sm:text-5xl">Three subjects. One rank.</h2>
            </div>
            <p className="max-w-xl text-lg leading-8 text-[#C7C5CC]">Balance is engineered across accuracy, time, and transfer — not equal hours for every subject.</p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              [Atom, "Physics", "71%", "Rotational motion", "24 targeted"],
              [FlaskConical, "Chemistry", "78%", "Thermodynamics", "Review in 2d"],
              [Sigma, "Mathematics", "69%", "Definite integrals", "18 targeted"],
            ].map(([Icon, subject, accuracy, focus, next]) => {
              const SubjectIcon = Icon as typeof Atom;
              const width = accuracy as string;
              return (
                <article className="border border-[#FF5A1F]/22 bg-[#0E0D10] p-7" key={subject as string}>
                  <div className="flex items-center justify-between">
                    <SubjectIcon className="text-[#FF8A3D]" size={25} strokeWidth={1.5} />
                    <span className="font-mono text-sm text-[#3DE0D0]">{accuracy as string}</span>
                  </div>
                  <h3 className="mt-10 font-display text-2xl font-semibold">{subject as string}</h3>
                  <p className="mt-2 text-sm text-[#C7C5CC]/80">Weakest active cluster</p>
                  <p className="mt-1 font-semibold">{focus as string}</p>
                  <div className="mt-6 h-1.5 bg-[#2A262E]"><div className="h-full bg-[#FF5A1F]" style={{ width }} /></div>
                  <p className="mt-4 font-mono text-[11px] tracking-[.12em] text-[#C7C5CC]/70">{next as string}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="section-shell" id="plans">
          <div className="section-heading">
            <div>
              <p className="kicker">06 — Plans</p>
              <h2 className="mt-5 font-display text-4xl font-bold tracking-[-.02em] sm:text-5xl">Choose your engine.</h2>
            </div>
            <p className="max-w-xl text-lg leading-8 text-[#C7C5CC]">Every price is inclusive of all taxes. The free diagnostic requires no card. No artificial countdowns.</p>
          </div>
          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                className={`relative flex flex-col border p-7 sm:p-8 ${plan.featured ? "border-[#FF5A1F] bg-[#1E1B20] shadow-[0_0_70px_rgba(255,90,31,.1)]" : "border-[#FF5A1F]/22 bg-[#161418]"}`}
                key={plan.name}
              >
                {plan.featured && <span className="absolute right-0 top-0 bg-[#FF5A1F] px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-[.14em] text-[#0E0D10]">Most complete</span>}
                <p className="kicker">{plan.name}</p>
                <p className="mt-8 font-display text-4xl font-bold">{plan.price}<span className="ml-1 text-base font-medium text-[#C7C5CC]/80">/ year</span></p>
                <p className="mt-3 text-[#C7C5CC]">{plan.label}</p>
                <ul className="mt-8 flex-1 space-y-4 border-t border-white/8 pt-7">
                  {plan.features.map((feature) => (
                    <li className="flex items-center gap-3 text-sm text-[#C7C5CC]" key={feature}>
                      <Check className="text-[#3DE08A]" size={15} /> {feature}
                    </li>
                  ))}
                </ul>
                <Link className={plan.featured ? "button-primary mt-9 justify-center" : "button-outline mt-9 justify-center"} href={`/checkout?plan=${plan.name.toLowerCase()}`}>
                  Choose {plan.name}
                </Link>
              </article>
            ))}
          </div>
          <p className="mt-5 text-center text-sm text-[#C7C5CC]/70">Student results are illustrative, not typical or guaranteed. Refund policy applies to paid plans.</p>
        </section>

        <section className="section-shell border-y border-white/8 bg-[#161418]">
          <div className="grid gap-14 lg:grid-cols-[.85fr_1.15fr] lg:items-start lg:gap-20">
            <div>
              <p className="kicker">07 — Student signal</p>
              <h2 className="mt-5 font-display text-4xl font-bold tracking-[-.02em] sm:text-5xl">Progress you can explain.</h2>
              <p className="mt-6 text-lg leading-8 text-[#C7C5CC]">No vanity streaks without evidence. Students see the concept, behaviour, and decision behind every change.</p>
              <div className="mt-9 grid grid-cols-2 gap-4">
                <div className="border border-[#FF5A1F]/22 bg-[#0E0D10] p-5"><p className="font-mono text-3xl text-[#FF8A3D]">+23</p><p className="mt-2 text-sm text-[#C7C5CC]/80">marks across 8 mocks</p></div>
                <div className="border border-[#FF5A1F]/22 bg-[#0E0D10] p-5"><p className="font-mono text-3xl text-[#3DE0D0]">1.4×</p><p className="mt-2 text-sm text-[#C7C5CC]/80">faster question selection</p></div>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {[
                ["Aarav · JEE Advanced ’27", "I stopped revising everything equally. The rank map showed exactly why rotational mechanics was costing me marks."],
                ["Meera · JEE Main ’27", "The simulation made projectile motion click. Practice right after it showed me whether the intuition survived a real question."],
                ["Ishaan · JEE Advanced ’26", "Mock review finally feels actionable. I can separate a concept miss from a rushed decision or a bad question choice."],
                ["Diya · JEE Main ’27", "The planner adjusts around school without pretending every day is perfect. I always know the next useful task."],
              ].map(([name, quote]) => (
                <figure className="border border-[#FF5A1F]/22 bg-[#0E0D10] p-6" key={name}>
                  <Trophy className="text-[#FF8A3D]" size={20} strokeWidth={1.5} />
                  <blockquote className="mt-7 leading-7 text-[#C7C5CC]">“{quote}”</blockquote>
                  <figcaption className="mt-6 font-mono text-[11px] uppercase tracking-[.12em] text-[#C7C5CC]/70">{name}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell">
          <div className="grid gap-14 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
            <div>
              <p className="kicker">08 — FAQs</p>
              <h2 className="mt-5 font-display text-4xl font-bold tracking-[-.02em] sm:text-5xl">Ask directly.</h2>
              <p className="mt-6 text-lg leading-8 text-[#C7C5CC]">Clear answers for students and families making a serious decision.</p>
            </div>
            <div className="border-t border-[#FF5A1F]/22">
              {faqs.map(([question, answer], index) => (
                <details className="group border-b border-[#FF5A1F]/22" key={question} open={index === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-xl font-semibold marker:hidden">
                    <span><span className="mr-4 font-mono text-[11px] text-[#FF5A1F]">Q{index + 1}</span>{question}</span>
                    <ChevronDown className="shrink-0 text-[#FF8A3D] transition group-open:rotate-180" size={20} />
                  </summary>
                  <p className="max-w-2xl pb-7 pl-9 leading-7 text-[#C7C5CC]">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="hero-grid border-t border-[#FF5A1F]/22 bg-[#161418]">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 sm:px-8 md:grid-cols-[1fr_auto] md:items-end lg:px-14 lg:py-24">
            <div>
              <p className="kicker">09 — Ignition</p>
              <h2 className="mt-5 max-w-4xl font-display text-4xl font-bold tracking-[-.02em] sm:text-[3.5rem]">Your next rank lever is already in the data.</h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#C7C5CC]">Try the five-question diagnostic sample. Leave with an initial concept signal, whether or not you subscribe.</p>
            </div>
            <Link className="button-primary" href="/diagnostic">Take the sample <ArrowRight size={18} /></Link>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
