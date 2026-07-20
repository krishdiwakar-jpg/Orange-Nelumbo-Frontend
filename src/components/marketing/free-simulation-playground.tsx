"use client";

import { useMemo, useState } from "react";
import { Activity, Atom, ChevronRight, Orbit, Play, RotateCcw, Sigma, Waves } from "lucide-react";

type DemoSlug = "vertical-throw" | "projectile-range" | "simple-harmonic-motion" | "electric-field-mapper" | "function-grapher";

const demos: Array<{ slug: DemoSlug; title: string; subject: string; prompt: string; label: string; min: number; max: number; step: number; initial: number; unit: string; icon: typeof Activity }> = [
  { slug: "vertical-throw", title: "Vertical throw", subject: "Physics", prompt: "How does launch speed change time to the apex?", label: "Launch speed", min: 5, max: 20, step: 1, initial: 10, unit: "m/s", icon: Activity },
  { slug: "projectile-range", title: "Projectile range", subject: "Physics", prompt: "Which launch angle creates the greatest range?", label: "Launch angle", min: 15, max: 75, step: 5, initial: 45, unit: "°", icon: Orbit },
  { slug: "simple-harmonic-motion", title: "Spring oscillator", subject: "Physics", prompt: "Watch displacement and energy trade places.", label: "Amplitude", min: 20, max: 90, step: 5, initial: 60, unit: "%", icon: Waves },
  { slug: "electric-field-mapper", title: "Electric field", subject: "Physics", prompt: "Move two charges and read the field between them.", label: "Charge separation", min: 70, max: 190, step: 10, initial: 130, unit: "px", icon: Atom },
  { slug: "function-grapher", title: "Function grapher", subject: "Mathematics", prompt: "Change the coefficient and watch the curve respond.", label: "Coefficient a", min: -3, max: 3, step: 0.5, initial: 1, unit: "", icon: Sigma },
];

function SimulationVisual({ slug, value, revision }: { slug: DemoSlug; value: number; revision: number }) {
  const graphPath = useMemo(() => {
    if (slug !== "function-grapher") return "";
    return Array.from({ length: 61 }, (_, index) => {
      const x = -3 + index / 10;
      const px = 35 + index * 7.5;
      const py = Math.max(18, Math.min(282, 150 - value * x * x * 13));
      return `${index ? "L" : "M"}${px.toFixed(1)} ${py.toFixed(1)}`;
    }).join(" ");
  }, [slug, value]);

  if (slug === "vertical-throw") {
    const duration = Math.max(1.8, value / 4.5);
    return <svg className="size-full" viewBox="0 0 520 320" aria-label="Animated vertical throw"><defs><filter id="demoGlow"><feGaussianBlur stdDeviation="7" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><line x1="260" x2="260" y1="42" y2="267" stroke="#C7C5CC" strokeDasharray="5 7" opacity=".45"/><line x1="80" x2="440" y1="270" y2="270" stroke="#C7C5CC" opacity=".4"/><circle key={revision} cx="260" cy="258" fill="#F5D9A8" filter="url(#demoGlow)" r="12"><animate attributeName="cy" values="258;48;258" dur={`${duration}s`} repeatCount="indefinite" calcMode="spline" keySplines=".25 .7 .35 1;.65 0 .75 .3" /></circle><text x="286" y="56" fill="#3DE0D0" fontFamily="JetBrains Mono" fontSize="11">v = 0 at apex</text><text x="88" y="294" fill="#C7C5CC" fontFamily="JetBrains Mono" fontSize="10">launch level</text></svg>;
  }
  if (slug === "projectile-range") {
    const radians = (value * Math.PI) / 180;
    const peak = 245 - Math.sin(radians) * 175;
    const end = 110 + Math.sin(2 * radians) * 330;
    const path = `M70 255 Q${end / 2 + 35} ${peak} ${end} 255`;
    return <svg className="size-full" viewBox="0 0 520 320" aria-label="Animated projectile trajectory"><line x1="50" x2="475" y1="255" y2="255" stroke="#C7C5CC" opacity=".35"/><path d={path} fill="none" stroke="#FF5A1F" strokeDasharray="5 7" strokeWidth="2"/><circle key={`${revision}-${value}`} cx="0" cy="0" fill="#F5D9A8" r="10"><animateMotion path={path} dur="3.2s" repeatCount="indefinite" /></circle><text x="60" y="292" fill="#C7C5CC" fontFamily="JetBrains Mono" fontSize="10">θ = {value}°</text><text x="365" y="40" fill="#3DE0D0" fontFamily="JetBrains Mono" fontSize="10">R ∝ sin 2θ</text></svg>;
  }
  if (slug === "simple-harmonic-motion") {
    const left = 260 - value * 1.45, right = 260 + value * 1.45;
    return <svg className="size-full" viewBox="0 0 520 320" aria-label="Animated spring oscillator"><line x1="44" x2="476" y1="160" y2="160" stroke="#C7C5CC" opacity=".25"/><path d="M50 160 l18 -18 l18 36 l18 -36 l18 36 l18 -36 l18 36 l18 -36 l18 36 l18 -18" fill="none" stroke="#3DE0D0" strokeWidth="3"/><rect key={`${revision}-${value}`} x="205" y="125" width="55" height="70" fill="#FF5A1F"><animate attributeName="x" values={`${left};${right};${left}`} dur="2.8s" repeatCount="indefinite" /></rect><path d="M70 262 Q260 220 450 262" fill="none" stroke="#FF8A3D" strokeOpacity=".55"/><text x="52" y="290" fill="#C7C5CC" fontFamily="JetBrains Mono" fontSize="10">kinetic ↔ potential energy</text></svg>;
  }
  if (slug === "electric-field-mapper") {
    const left = 260 - value / 2, right = 260 + value / 2;
    return <svg className="size-full" viewBox="0 0 520 320" aria-label="Electric field map"><defs><radialGradient id="positive"><stop stopColor="#FF8A3D"/><stop offset="1" stopColor="#FF5A1F"/></radialGradient></defs>{[-90,-60,-30,0,30,60,90].map((offset) => <path key={offset} d={`M${left} 160 C${left + value*.32} ${160+offset} ${right-value*.32} ${160+offset} ${right} 160`} fill="none" stroke={offset===0?"#3DE0D0":"#FF8A3D"} strokeOpacity={offset===0?.9:.38} />)}<circle cx={left} cy="160" r="22" fill="url(#positive)"/><circle cx={right} cy="160" r="22" fill="#3DE0D0"/><text x={left-5} y="166" fill="#0E0D10" fontWeight="700">+</text><text x={right-4} y="165" fill="#0E0D10" fontWeight="700">−</text><circle cx="260" cy="160" r="5" fill="#FAF8F2" className="sim-pulse"/><text x="188" y="286" fill="#C7C5CC" fontFamily="JetBrains Mono" fontSize="10">field strength ∝ 1 / r²</text></svg>;
  }
  return <svg className="size-full" viewBox="0 0 520 320" aria-label="Interactive function graph">{Array.from({length:9},(_,i)=><line key={`v${i}`} x1={35+i*56} x2={35+i*56} y1="18" y2="282" stroke="#2A262E"/>)}{Array.from({length:7},(_,i)=><line key={`h${i}`} x1="35" x2="485" y1={18+i*44} y2={18+i*44} stroke="#2A262E"/>)}<line x1="35" x2="485" y1="150" y2="150" stroke="#C7C5CC" opacity=".55"/><line x1="260" x2="260" y1="18" y2="282" stroke="#C7C5CC" opacity=".55"/><path d={graphPath} fill="none" stroke="#3DE08A" strokeWidth="3"/><text x="52" y="44" fill="#3DE0D0" fontFamily="JetBrains Mono" fontSize="11">f(x) = {value}x²</text></svg>;
}

export function FreeSimulationPlayground({ initialSlug = "vertical-throw" }: { initialSlug?: string }) {
  const initial = demos.find((demo) => demo.slug === initialSlug) ?? demos[0];
  const [activeSlug, setActiveSlug] = useState<DemoSlug>(initial.slug);
  const [values, setValues] = useState<Record<DemoSlug, number>>(() => Object.fromEntries(demos.map((demo) => [demo.slug, demo.initial])) as Record<DemoSlug, number>);
  const [revision, setRevision] = useState(0);
  const active = demos.find((demo) => demo.slug === activeSlug) ?? demos[0];
  const ActiveIcon = active.icon;

  return (
    <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
      <nav aria-label="Choose a demo simulation" className="border border-[#FF5A1F]/24 bg-[#161418] p-2">
        {demos.map((demo, index) => {
          const Icon = demo.icon;
          const selected = demo.slug === activeSlug;
          return <button aria-pressed={selected} className={`group flex min-h-20 w-full items-center gap-4 border-l-2 px-4 text-left transition ${selected ? "border-[#FF5A1F] bg-[#FF5A1F]/9 text-white" : "border-transparent text-[#C7C5CC] hover:bg-white/[.035] hover:text-white"}`} key={demo.slug} onClick={() => setActiveSlug(demo.slug)} type="button"><span className={`grid size-10 shrink-0 place-items-center border ${selected ? "border-[#FF5A1F]/50 text-[#FF8A3D]" : "border-white/10"}`}><Icon size={18}/></span><span className="min-w-0"><span className="block font-mono text-[10px] text-[#C7C5CC]/60">0{index+1} / {demo.subject}</span><span className="mt-1 block truncate text-sm font-bold">{demo.title}</span></span><ChevronRight className="ml-auto shrink-0 opacity-45" size={16}/></button>;
        })}
      </nav>

      <section className="overflow-hidden border border-[#FF5A1F]/28 bg-[#161418] shadow-[0_0_70px_rgba(255,90,31,.07)]">
        <header className="flex flex-wrap items-start justify-between gap-5 border-b border-white/9 p-5 sm:p-7">
          <div className="flex items-start gap-4"><span className="grid size-12 place-items-center border border-[#FF5A1F]/35 text-[#FF8A3D]"><ActiveIcon size={22}/></span><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-[#3DE08A]">Playable demo · no sign-in</p><h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">{active.title}</h2><p className="mt-2 text-sm leading-6 text-[#C7C5CC]">{active.prompt}</p></div></div>
          <button className="button-ghost" onClick={() => setRevision((current) => current + 1)} type="button"><RotateCcw size={16}/> Replay</button>
        </header>
        <div className="grid lg:grid-cols-[1fr_280px]">
          <div className="brand-grid relative min-h-[390px] bg-[#0E0D10]"><SimulationVisual revision={revision} slug={active.slug} value={values[active.slug]}/></div>
          <aside className="border-t border-white/9 p-5 lg:border-l lg:border-t-0 sm:p-6">
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#FF8A3D]">Control one variable</p>
            <label className="mt-7 block"><span className="flex items-baseline justify-between gap-4 text-sm font-bold"><span>{active.label}</span><span className="font-mono text-[#3DE0D0]">{values[active.slug]}{active.unit}</span></span><input className="mt-5 w-full accent-[#FF5A1F]" min={active.min} max={active.max} step={active.step} type="range" value={values[active.slug]} onChange={(event) => setValues((current) => ({...current,[active.slug]:Number(event.target.value)}))}/><span className="mt-2 flex justify-between font-mono text-[10px] text-[#C7C5CC]/60"><span>{active.min}{active.unit}</span><span>{active.max}{active.unit}</span></span></label>
            <div className="mt-8 border-l-2 border-[#3DE0D0] bg-[#3DE0D0]/5 p-4"><p className="text-xs font-bold text-[#3DE0D0]">Try this</p><p className="mt-2 text-sm leading-6 text-[#C7C5CC]">Move the control slowly. Predict the change before the visual catches up.</p></div>
            <button className="button-primary mt-6 w-full" onClick={() => setRevision((current) => current + 1)} type="button"><Play size={16}/> Run again</button>
          </aside>
        </div>
      </section>
    </div>
  );
}

export { demos as freeSimulationDemos };
