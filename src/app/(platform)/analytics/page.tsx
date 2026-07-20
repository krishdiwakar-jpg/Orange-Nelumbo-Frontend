import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownRight, ArrowRight, BarChart3, BrainCircuit, Clock3, Crosshair, Target, TrendingUp } from "lucide-react";

import { AnalyticsRangeToggle } from "@/components/platform/analytics-range-toggle";
import { analytics } from "@/data/platform";

export const metadata: Metadata = { title: "Performance analytics" };

function linePoints(values: number[], width = 660, height = 250) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return values.map((value, index) => {
    const x = 30 + (index / Math.max(values.length - 1, 1)) * (width - 60);
    const y = 25 + ((max - value) / Math.max(max - min, 1)) * (height - 55);
    return `${x},${y}`;
  }).join(" ");
}

export default function AnalyticsPage() {
  const rankValues = analytics.rankTrend.map((point) => point.value);
  const questionMax = Math.max(...analytics.weeklyQuestions.map((point) => point.value));
  return (
    <div className="content-shell pb-28 pt-8 lg:pb-14 lg:pt-10">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div><p className="mono-kicker">06 — Performance telemetry</p><h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">Every mark has a cause.</h2><p className="mt-3 max-w-2xl text-[#C7C5CC]">Separate knowledge gaps from time loss, selection errors, and unstable recall.</p></div>
        <AnalyticsRangeToggle />
      </div>

      <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          [Target, "Questions", analytics.summary.questionsAttempted.toLocaleString("en-IN"), "+68 this week", "#FF8A3D"],
          [Crosshair, "Accuracy", `${analytics.summary.accuracy}%`, "+4.1% in 30 days", "#3DE0D0"],
          [TrendingUp, "Projected AIR", analytics.summary.currentRank.toLocaleString("en-IN"), "↓ 5,519 since Jan", "#3DE08A"],
          [Clock3, "Focused time", `${Math.floor(analytics.summary.studyMinutes / 60)}h ${analytics.summary.studyMinutes % 60}m`, "12h target", "#F6C344"],
        ].map(([Icon,label,value,meta,color])=>{const MetricIcon=Icon as typeof Target;return <article className="border border-[#FF5A1F]/22 bg-[#161418] p-6" key={label as string}><div className="flex items-center justify-between"><p className="mono-kicker">{label as string}</p><MetricIcon size={19} style={{color:color as string}}/></div><p className="mt-7 font-mono text-3xl">{value as string}</p><p className="mt-2 flex items-center gap-2 text-xs text-[#C7C5CC]/70"><ArrowDownRight className="text-[#3DE08A]" size={14}/>{meta as string}</p></article>})}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
        <section className="border border-[#FF5A1F]/22 bg-[#161418] p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="mono-kicker">Rank trajectory</p><h3 className="mt-2 font-display text-2xl font-semibold">9,800 → 4,281</h3></div><div className="font-mono text-[11px] text-[#3DE0D0]">−56% IN 7 MONTHS</div></div>
          <div className="mt-6 overflow-hidden border border-white/8 bg-[#0E0D10] p-3">
            <svg aria-label="Projected rank trend from January to July" className="w-full" viewBox="0 0 660 280">
              {[40,90,140,190,240].map((y)=><line key={y} x1="30" x2="630" y1={y} y2={y} stroke="#2A262E"/>) }
              <defs><linearGradient id="rankArea" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#FF5A1F" stopOpacity=".25"/><stop offset="1" stopColor="#FF5A1F" stopOpacity="0"/></linearGradient></defs>
              <polyline fill="none" points={linePoints(rankValues)} stroke="#FF5A1F" strokeWidth="4"/>
              {analytics.rankTrend.map((point,index)=>{const coords=linePoints(rankValues).split(' ')[index].split(',');return <g key={point.label}><circle cx={coords[0]} cy={coords[1]} fill={index===analytics.rankTrend.length-1?'#3DE0D0':'#FF5A1F'} r={index===analytics.rankTrend.length-1?6:3}/><text x={coords[0]} y="270" fill="#C7C5CC" fontFamily="JetBrains Mono" fontSize="10" textAnchor="middle">{point.label.toUpperCase()}</text></g>})}
            </svg>
          </div>
          <p className="mt-4 text-sm text-[#C7C5CC]/70">Projected AIR is a model estimate derived from current mock performance. It is not a prediction or guarantee.</p>
        </section>

        <section className="border border-[#FF5A1F]/22 bg-[#161418] p-5 sm:p-7">
          <div className="flex items-center justify-between"><div><p className="mono-kicker">Weekly volume</p><h3 className="mt-2 font-display text-2xl font-semibold">412 questions</h3></div><BarChart3 className="text-[#3DE0D0]" size={22}/></div>
          <div className="mt-8 flex h-56 items-end gap-3 border-b border-white/10 px-2">
            {analytics.weeklyQuestions.map((point,index)=><div className="flex h-full flex-1 flex-col justify-end gap-2" key={point.label}><span className="text-center font-mono text-[11px] text-[#C7C5CC]/70">{point.value}</span><div className="relative bg-[#2A262E]" style={{height:`${(point.value/questionMax)*78}%`}}><div className={`absolute inset-x-0 top-0 h-1 ${index===3?'bg-[#3DE0D0]':'bg-[#FF5A1F]'}`}/></div><span className="pb-2 text-center font-mono text-[11px] text-[#C7C5CC]/70">{point.label.toUpperCase()}</span></div>)}
          </div>
          <p className="mt-5 text-sm leading-6 text-[#C7C5CC]/80">Thursday carried the most useful practice: 84 attempts at 79% accuracy.</p>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <section className="border border-[#FF5A1F]/22 bg-[#161418] p-6"><p className="mono-kicker">Subject accuracy</p><div className="mt-7 space-y-7">{analytics.subjectAccuracy.map((item)=><div key={item.subjectId}><div className="flex items-center justify-between"><div><p className="capitalize font-semibold">{item.subjectId}</p><p className="mt-1 text-xs text-[#C7C5CC]/70">{item.correct} correct / {item.attempted} attempted</p></div><p className="font-mono text-sm text-[#3DE0D0]">{item.accuracy}%</p></div><div className="mt-3 h-1.5 bg-[#2A262E]"><div className="h-full bg-gradient-to-r from-[#FF5A1F] to-[#FF8A3D]" style={{width:`${item.accuracy}%`}}/></div></div>)}</div></section>
        <section className="border border-[#FF5A1F]/22 bg-[#161418] p-6"><div className="flex items-center justify-between"><div><p className="mono-kicker">Focus queue</p><h3 className="mt-2 font-display text-2xl font-semibold">Three gaps worth repairing now</h3></div><BrainCircuit className="text-[#FF8A3D]" size={24}/></div><div className="mt-6 divide-y divide-white/8 border-y border-white/8">{analytics.focusTopics.map((item,index)=><article className="grid gap-4 py-5 sm:grid-cols-[36px_1fr_auto] sm:items-start" key={item.topic}><span className="font-mono text-xs text-[#FF5A1F]">0{index+1}</span><div><h4 className="font-semibold">{item.topic}</h4><p className="mt-2 text-sm leading-6 text-[#C7C5CC]/80">{item.recommendation}</p></div><span className="font-mono text-xs text-[#E0483C]">{item.accuracy}%</span></article>)}</div><Link className="button-primary mt-6" href="/planner">Open planner <ArrowRight size={16}/></Link></section>
      </div>
    </div>
  );
}
