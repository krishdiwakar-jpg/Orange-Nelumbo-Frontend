"use client";

import Link from "next/link";
import { ArrowRight, FlaskConical, GraduationCap, LockKeyhole } from "lucide-react";

import { useApp } from "@/components/providers/app-provider";

export function SimulationAccessGate({ children, fullscreen = false }: { children: React.ReactNode; fullscreen?: boolean }) {
  const { hydrated, hasFullAccess, user } = useApp();
  const hasSimulationPlan = user?.activePlanId === "simulations" || hasFullAccess;

  if (!hydrated) {
    return <div className={fullscreen ? "grid h-full place-items-center text-sm text-[#C7C5CC]" : "content-shell py-16 text-sm text-[#C7C5CC]"}>Checking simulation access…</div>;
  }

  if (hasSimulationPlan) return children;

  return (
    <div className={fullscreen ? "h-full overflow-y-auto p-5 sm:p-8" : "content-shell pb-28 pt-10 lg:pb-16 lg:pt-14"}>
      <section className="brand-grid border border-[#FF5A1F]/30 bg-[#161418] p-7 sm:p-10">
        <span className="grid size-14 place-items-center border border-[#FF5A1F]/30 bg-[#0E0D10] text-[#FF8A3D]"><LockKeyhole size={25} /></span>
        <h2 className="mt-7 max-w-3xl font-display text-4xl font-bold sm:text-5xl">This simulation is part of the complete lab.</h2>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#C7C5CC]">Upgrade to Notes + Simulations to use every live control and graph. Five public demos remain open without changing your plan.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link className="button-primary justify-center" href="/checkout?plan=simulations">View purchase flow <ArrowRight size={17} /></Link>
          <Link className="button-ghost justify-center" href="/free-simulations"><FlaskConical size={17} /> Open free demos</Link>
        </div>
        <div className="mt-8 flex items-start gap-3 border border-[#3DE0D0]/25 bg-[#0E0D10] p-4 text-sm leading-6 text-[#C7C5CC]"><GraduationCap className="mt-0.5 shrink-0 text-[#3DE0D0]" size={18} /><span>Verified educators receive the full simulation library without purchasing a plan. The educator demo includes temporary full access while verification is pending.</span></div>
      </section>
    </div>
  );
}
