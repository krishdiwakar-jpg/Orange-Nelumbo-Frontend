import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BarChart3, Check, Clock3, RotateCcw, Target, Trophy, X } from "lucide-react";

import { MockReview } from "@/components/platform/mock-review";
import { getMockQuestions } from "@/components/platform/mock-question-utils";
import { analytics, mockTests } from "@/data/platform";

export const metadata: Metadata = { title: "Mock result" };

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    answered?: string;
    correct?: string;
    incorrect?: string;
    score?: string;
    total?: string;
  }>;
};

function finiteNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export default async function ResultPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;
  const mock = mockTests.find((item) => item.slug === slug);
  if (!mock) notFound();

  const currentAttempt = query.total !== undefined;
  if (mock.status === "upcoming" || (mock.status !== "completed" && !currentAttempt)) notFound();
  const total = currentAttempt ? getMockQuestions(mock).length : mock.questionCount;
  const answered = Math.min(total, Math.max(0, Math.round(finiteNumber(query.answered, total))));
  const fallbackAccuracy = analytics.summary.accuracy;
  const correct = currentAttempt
    ? Math.min(answered, Math.max(0, Math.round(finiteNumber(query.correct, 0))))
    : Math.round((answered * fallbackAccuracy) / 100);
  const incorrect = currentAttempt
    ? Math.min(answered - correct, Math.max(0, Math.round(finiteNumber(query.incorrect, answered - correct))))
    : answered - correct;
  const score = currentAttempt ? correct * 4 - incorrect : (mock.attempt?.score ?? 214);
  const max = currentAttempt ? total * 4 : mock.maxMarks;
  const accuracy = answered ? Math.round((correct / answered) * 100) : 0;

  return (
    <div className="content-shell pb-28 pt-8 lg:pb-14 lg:pt-10">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="mono-kicker">Submission analysed</p>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">The score is the start of review.</h2>
          <p className="mt-3 text-[#C7C5CC]">{mock.name} · illustrative front-end result</p>
        </div>
        <Link className="button-outline" href={`/mocks/${slug}/attempt?demo=1`}><RotateCcw size={16}/> Reattempt demo</Link>
      </div>

      <section className="brand-grid mt-9 grid gap-8 border border-[#FF5A1F]/30 bg-[#161418] p-7 lg:grid-cols-[.7fr_1.3fr] lg:items-center lg:p-10">
        <div className="border border-[#FF5A1F]/25 bg-[#0E0D10] p-7 text-center">
          <Trophy className="mx-auto text-[#F6C344]" size={30}/>
          <p className="mt-6 font-mono text-5xl text-[#FF8A3D]">{score}<span className="text-lg text-[#C7C5CC]">/{max}</span></p>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[.14em] text-[#C7C5CC]">Total score</p>
        </div>
        <div>
          <p className="mono-kicker">Outcome signal</p>
          <h3 className="mt-4 font-display text-3xl font-semibold">{accuracy >= 75 ? "Good recall. Timing is the next lever." : "The concept gaps are now visible."}</h3>
          <p className="mt-4 max-w-2xl leading-7 text-[#C7C5CC]">Your next plan prioritises relative motion, entropy signs, and conic conversions before another mixed paper.</p>
          <div className="mt-7 grid grid-cols-3 border-y border-white/8 py-5">
            {[["ACCURACY", `${accuracy}%`], ["ANSWERED", `${answered}/${total}`], ["PROJECTED AIR", mock.attempt?.rank ? mock.attempt.rank.toLocaleString("en-IN") : "4,120"]].map(([label, value]) => (
              <div className="border-r border-white/8 px-3 last:border-0" key={label}>
                <p className="font-mono text-[11px] tracking-[.12em] text-[#C7C5CC]">{label}</p>
                <p className="mt-2 font-mono text-sm text-[#3DE0D0]">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-7 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <section className="border border-[#FF5A1F]/22 bg-[#161418] p-6">
          <div className="flex items-center justify-between"><div><p className="mono-kicker">Subject split</p><h3 className="mt-2 font-display text-2xl font-semibold">Where marks moved</h3></div><BarChart3 className="text-[#3DE0D0]" size={23}/></div>
          <div className="mt-7 space-y-6">{analytics.subjectAccuracy.map((item) => <div key={item.subjectId}><div className="flex items-center justify-between"><p className="capitalize font-semibold">{item.subjectId}</p><p className="font-mono text-xs text-[#3DE0D0]">{item.accuracy}%</p></div><div className="mt-3 h-1.5 bg-[#2A262E]"><div className="h-full bg-[#FF5A1F]" style={{width:`${item.accuracy}%`}}/></div></div>)}</div>
        </section>
        <section className="border border-[#FF5A1F]/22 bg-[#161418] p-6">
          <p className="mono-kicker">Review queue</p>
          <div className="mt-6 space-y-4">{analytics.focusTopics.map((item) => <article className="border-l-2 border-[#E0483C] bg-[#0E0D10] p-4" key={item.topic}><div className="flex items-center justify-between"><p className="font-semibold">{item.topic}</p><span className="font-mono text-xs text-[#E0483C]">{item.accuracy}%</span></div><p className="mt-2 text-xs leading-5 text-[#C7C5CC]">{item.recommendation}</p></article>)}</div>
          <Link className="button-primary mt-6" href="/planner">Open planner <ArrowRight size={16}/></Link>
        </section>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-3">
        {[[Check, "Correct decisions", correct, "#3DE08A"], [X, "Incorrect decisions", incorrect, "#E0483C"], [Clock3, "Unattempted", Math.max(0, total - answered), "#F6C344"]].map(([Icon, label, value, color]) => {
          const ItemIcon = Icon as typeof Target;
          return <div className="border border-white/9 bg-[#161418] p-5" key={label as string}><ItemIcon style={{color:color as string}} size={20}/><p className="mt-5 font-mono text-2xl">{value as number}</p><p className="mt-1 text-sm text-[#C7C5CC]">{label as string}</p></div>;
        })}
      </div>

      <MockReview mock={mock} />
      <p className="mt-7 text-sm leading-6 text-[#C7C5CC]">Projected AIR is a model estimate, not a prediction. Student results are illustrative, not typical or guaranteed.</p>
    </div>
  );
}
