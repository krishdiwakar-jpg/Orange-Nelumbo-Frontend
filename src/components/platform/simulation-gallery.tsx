"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Atom, Clock3, FlaskConical, LockKeyhole, Play, Sigma } from "lucide-react";

import { simulations } from "@/data/platform";

const icons = { physics: Atom, chemistry: FlaskConical, mathematics: Sigma };

export function SimulationGallery() {
  const [filter, setFilter] = useState<"all" | "physics" | "chemistry" | "mathematics">("all");
  const filtered = simulations.filter((simulation) => filter === "all" || simulation.subjectId === filter);

  return (
    <div className="content-shell pb-28 pt-10 lg:pb-16 lg:pt-12">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Interactive simulations</h2>
          <p className="mt-3 max-w-2xl text-[#C7C5CC]">Change one variable, predict the result, and see how the model responds.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["all", "physics", "chemistry", "mathematics"] as const).map((item) => (
            <button className={`min-h-11 border px-4 text-sm font-semibold capitalize ${filter === item ? "border-[#FF5A1F] bg-[#FF5A1F]/8 text-white" : "border-white/10 text-[#C7C5CC]/80"}`} key={item} onClick={() => setFilter(item)} type="button">{item}</button>
          ))}
        </div>
      </div>

      <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((simulation) => {
          const Icon = icons[simulation.subjectId];
          const live = simulation.availability === "live";
          return (
            <article className={`group relative overflow-hidden border bg-[#161418] p-6 ${live ? "border-[#FF5A1F]/45 shadow-[0_0_50px_rgba(255,90,31,.08)]" : "border-[#FF5A1F]/18"}`} key={simulation.id}>
              <div className="relative flex items-start justify-between">
                <div className="grid size-12 place-items-center border border-[#FF5A1F]/25 text-[#FF8A3D]"><Icon size={22} /></div>
                <span className={`flex items-center gap-2 text-xs font-semibold ${live ? "text-[#3DE08A]" : "text-[#C7C5CC]/70"}`}>{live ? <><span className="size-2 bg-[#3DE08A]" />Available</> : <><LockKeyhole size={12} />Coming soon</>}</span>
              </div>
              <h3 className="mt-8 font-display text-2xl font-semibold">{simulation.title}</h3>
              <p className="mt-3 min-h-20 text-sm leading-6 text-[#C7C5CC]/80">{simulation.description}</p>
              <div className="mt-6 flex items-center justify-between border-t border-white/8 pt-5">
                <span className="flex items-center gap-2 text-xs text-[#C7C5CC]/70"><Clock3 size={13} />{simulation.estimatedMinutes} min</span>
                <Link className={`inline-flex min-h-11 items-center gap-2 text-sm font-bold ${live ? "text-[#FF8A3D]" : "text-[#C7C5CC]/70"}`} href={`/simulations/${simulation.slug}`}>{live ? <><Play size={15} />Launch</> : <>Preview <ArrowRight size={15} /></>}</Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
