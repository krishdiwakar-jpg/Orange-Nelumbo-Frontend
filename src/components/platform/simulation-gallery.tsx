"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Atom, Clock3, FlaskConical, GraduationCap, LockKeyhole, Play, Sigma } from "lucide-react";

import { useApp } from "@/components/providers/app-provider";
import { simulations } from "@/data/platform";

const icons = { physics: Atom, chemistry: FlaskConical, mathematics: Sigma };

export function SimulationGallery() {
  const { hasFullAccess, user } = useApp();
  const [filter, setFilter] = useState<"all" | "physics" | "chemistry" | "mathematics">("all");
  const filtered = simulations.filter((simulation) => filter === "all" || simulation.subjectId === filter);
  const hasSimulationPlan = user?.activePlanId === "simulations" || hasFullAccess;

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

      {user?.role === "educator" ? (
        <div className="mt-7 flex items-start gap-4 border border-[#3DE0D0]/30 bg-[#161418] p-5">
          <GraduationCap className="mt-0.5 shrink-0 text-[#3DE0D0]" size={21} />
          <div><p className="font-semibold">Educator demo access is active.</p><p className="mt-1 text-sm leading-6 text-[#C7C5CC]">All live simulations are unlocked without a purchase while backend verification is represented as pending.</p></div>
        </div>
      ) : null}

      <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((simulation) => {
          const Icon = icons[simulation.subjectId];
          const live = simulation.availability === "live";
          const accessible = live && hasSimulationPlan;
          return (
            <article className={`group relative overflow-hidden border bg-[#161418] p-6 ${live ? "border-[#FF5A1F]/45" : "border-[#FF5A1F]/18"}`} key={simulation.id}>
              <div className="relative flex items-start justify-between">
                <div className="grid size-12 place-items-center border border-[#FF5A1F]/25 text-[#FF8A3D]"><Icon size={22} /></div>
                <span className={`flex items-center gap-2 text-xs font-semibold ${accessible ? "text-[#3DE08A]" : "text-[#C7C5CC]/70"}`}>{!live ? <><LockKeyhole size={12} />Coming soon</> : accessible ? <><span className="size-2 bg-[#3DE08A]" />Available</> : <><LockKeyhole size={12} />Plan required</>}</span>
              </div>
              <h3 className="mt-8 font-display text-2xl font-semibold">{simulation.title}</h3>
              <p className="mt-3 min-h-20 text-sm leading-6 text-[#C7C5CC]/80">{simulation.description}</p>
              <div className="mt-6 flex items-center justify-between border-t border-white/8 pt-5">
                <span className="flex items-center gap-2 text-xs text-[#C7C5CC]/70"><Clock3 size={13} />{simulation.estimatedMinutes} min</span>
                <Link className={`inline-flex min-h-11 items-center gap-2 text-sm font-bold ${accessible ? "text-[#FF8A3D]" : "text-[#C7C5CC]/70"}`} href={!live ? `/simulations/${simulation.slug}` : accessible ? `/simulations/${simulation.slug}` : "/checkout?plan=simulations"}>{!live ? <>Preview <ArrowRight size={15} /></> : accessible ? <><Play size={15} />Launch</> : <>Unlock <ArrowRight size={15} /></>}</Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
