"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Clock3, Flag, Lightbulb, RotateCcw, X } from "lucide-react";

import { useApp } from "@/components/providers/app-provider";
import { practiceQuestions } from "@/data/platform";
import type { PracticeQuestion } from "@/types/platform";

function QuestionCard({
  question,
  index,
  total,
  onDone,
}: {
  question: PracticeQuestion;
  index: number;
  total: number;
  onDone: (correct: boolean) => void;
}) {
  const { recordQuestionAttempt } = useApp();
  const [selected, setSelected] = useState<string[]>([]);
  const [numericalValue, setNumericalValue] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [flagged, setFlagged] = useState(false);

  const toggle = (id: string) => {
    if (revealed) return;
    setSelected((current) => question.type === "multiple-correct" ? current.includes(id) ? current.filter((item) => item !== id) : [...current, id] : [id]);
  };

  const numerical = Number(numericalValue);
  const correct = question.type === "numerical"
    ? Number.isFinite(numerical) && Math.abs(numerical - (question.numericalAnswer ?? Number.NaN)) <= (question.answerTolerance ?? 0)
    : selected.length === question.correctOptionIds.length && selected.every((id) => question.correctOptionIds.includes(id));
  const hasAnswer = question.type === "numerical" ? numericalValue.trim().length > 0 && Number.isFinite(numerical) : selected.length > 0;

  const submit = () => {
    if (!hasAnswer) return;
    setRevealed(true);
    recordQuestionAttempt(question.id, question.type === "numerical" ? numericalValue.trim() : selected);
  };

  return (
    <article className="border border-[#FF5A1F]/22 bg-[#161418]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-5 py-4 sm:px-7">
        <div className="flex items-center gap-4"><span className="font-mono text-xs text-[#FF8A3D]">Q {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span><span className="border border-white/10 px-2 py-1 font-mono text-[11px] uppercase tracking-[.1em] text-[#C7C5CC]/70">{question.difficulty}</span></div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#C7C5CC]/70"><span className="flex items-center gap-2"><Clock3 size={13} /> {question.estimatedSeconds}s target</span><button aria-label={flagged ? "Remove question flag" : "Flag question"} aria-pressed={flagged} className={`grid size-11 place-items-center border ${flagged ? "border-[#F6C344] bg-[#F6C344]/8 text-[#F6C344]" : "border-transparent text-[#C7C5CC]/70 hover:border-[#F6C344]/35 hover:text-[#F6C344]"}`} onClick={() => setFlagged((value) => !value)} type="button"><Flag size={16} /></button></div>
      </div>
      <div className="p-5 sm:p-8">
        <p className="font-mono text-[11px] uppercase tracking-[.16em] text-[#3DE0D0]">{question.concept} · {question.source}</p>
        <h2 className="mt-5 max-w-3xl font-display text-2xl font-semibold leading-[1.35] sm:text-3xl">{question.prompt}</h2>
        {question.type === "numerical" ? (
          <label className="mt-8 block max-w-md" htmlFor={`numerical-${question.id}`}>
            <span className="block text-sm font-semibold text-[#C7C5CC]">Numerical answer</span>
            <span className="mt-2 block text-xs leading-5 text-[#C7C5CC]/70">Enter a number. Decimals are accepted.</span>
            <div className={`mt-3 flex min-h-[58px] items-center border bg-[#0E0D10] px-4 ${revealed ? correct ? "border-[#3DE08A]" : "border-[#E0483C]" : "border-white/10 focus-within:border-[#FF5A1F]"}`}>
              <input
                className="min-w-0 flex-1 bg-transparent font-mono text-xl text-white outline-none"
                disabled={revealed}
                id={`numerical-${question.id}`}
                inputMode="decimal"
                onChange={(event) => setNumericalValue(event.target.value)}
                step="any"
                type="number"
                value={numericalValue}
              />
              <span className="font-mono text-sm text-[#C7C5CC]/70">NUM</span>
            </div>
          </label>
        ) : (
          <div className="mt-8 grid gap-3">
            {question.options.map((option) => {
            const isSelected = selected.includes(option.id);
            const isCorrect = revealed && question.correctOptionIds.includes(option.id);
            const isWrong = revealed && isSelected && !isCorrect;
            return (
              <button
                aria-pressed={isSelected}
                className={`grid min-h-[58px] w-full grid-cols-[38px_1fr] items-center gap-3 border px-4 text-left transition ${isCorrect ? "border-[#3DE08A] bg-[#3DE08A]/7" : isWrong ? "border-[#E0483C] bg-[#E0483C]/7" : isSelected ? "border-[#FF5A1F] bg-[#FF5A1F]/8" : "border-white/10 bg-[#0E0D10] hover:border-[#FF5A1F]/40"}`}
                disabled={revealed}
                key={option.id}
                onClick={() => toggle(option.id)}
                type="button"
              >
                <span className={`grid size-8 place-items-center border font-mono text-xs ${isCorrect ? "border-[#3DE08A] bg-[#3DE08A] text-[#0E0D10]" : isWrong ? "border-[#E0483C] bg-[#E0483C] text-white" : isSelected ? "border-[#FF5A1F] text-[#FF8A3D]" : "border-white/12 text-[#C7C5CC]/70"}`}>{isCorrect ? <Check size={15} /> : isWrong ? <X size={15} /> : option.id.toUpperCase()}</span>
                <span className="text-base text-[#C7C5CC]">{option.label}</span>
              </button>
            );
            })}
          </div>
        )}

        {revealed && (
          <div className={`mt-7 border-l-2 p-5 ${correct ? "border-[#3DE08A] bg-[#3DE08A]/7" : "border-[#E0483C] bg-[#E0483C]/7"}`}>
            <div className="flex items-center gap-3"><Lightbulb size={18} className={correct ? "text-[#3DE08A]" : "text-[#E0483C]"} /><p className="font-semibold">{correct ? "Correct. Keep the reasoning." : "Not yet. Repair the concept now."}</p></div>
            <p className="mt-3 leading-7 text-[#C7C5CC]">{question.explanation}</p>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[.12em] text-[#C7C5CC]/70">Marks: {correct ? `+${question.marks.correct}` : question.marks.incorrect}</p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-white/8 pt-6">
          {!revealed ? <button className="button-primary" disabled={!hasAnswer} onClick={submit} type="button">Check answer <ArrowRight size={16} /></button> : <button className="button-primary" onClick={() => onDone(correct)} type="button">{index + 1 === total ? "Finish set" : "Next question"} <ArrowRight size={16} /></button>}
        </div>
      </div>
    </article>
  );
}

export function PracticeSession() {
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject");
  const topic = searchParams.get("topic");
  const questions = useMemo(() => {
    const filtered = practiceQuestions.filter((question) => (!subject || question.subjectId === subject) && (!topic || question.topicId === topic));
    if (filtered.length) return filtered.slice(0, 5);
    return topic ? [] : practiceQuestions.slice(0, 5);
  }, [subject, topic]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);

  const done = (correct: boolean) => {
    if (correct) setScore((value) => value + 1);
    if (index + 1 === questions.length) setFinished(true);
    else { setIndex((value) => value + 1); setSessionKey((value) => value + 1); }
  };

  const restart = () => { setIndex(0); setScore(0); setFinished(false); setSessionKey((value) => value + 1); };

  if (questions.length === 0) {
    return (
      <div className="content-shell grid min-h-[calc(100vh-74px)] place-items-center pb-28 pt-10 lg:pb-10">
        <div className="brand-grid w-full max-w-2xl border border-[#FF5A1F]/30 bg-[#161418] p-7 text-center sm:p-10">
          <Flag className="mx-auto text-[#FF8A3D]" size={32} strokeWidth={1.6} />
          <p className="mono-kicker mt-6">Question bank preview</p>
          <h2 className="mt-4 font-display text-3xl font-bold">This concept drill is being prepared.</h2>
          <p className="mx-auto mt-4 max-w-lg leading-7 text-[#C7C5CC]">No dummy questions are seeded for this exact topic yet. Choose a live concept or open the mixed smart drill.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3"><Link className="button-ghost" href="/practice">Choose another concept</Link><Link className="button-primary" href="/practice/session">Open mixed drill <ArrowRight size={16}/></Link></div>
        </div>
      </div>
    );
  }

  if (finished) {
    const percent = Math.round((score / questions.length) * 100);
    return (
      <div className="content-shell grid min-h-[calc(100vh-74px)] place-items-center pb-28 pt-10 lg:pb-10">
        <div className="brand-grid w-full max-w-3xl border border-[#FF5A1F]/30 bg-[#161418] p-7 text-center sm:p-12">
          <p className="mono-kicker">Set complete</p>
          <div className="mx-auto mt-8 grid size-36 place-items-center border border-[#FF5A1F]/30 bg-[#0E0D10]">
            <div><p className="font-mono text-4xl text-[#3DE0D0]">{percent}%</p><p className="mt-1 font-mono text-[11px] tracking-[.12em] text-[#C7C5CC]/70">ACCURACY</p></div>
          </div>
          <h2 className="mt-8 font-display text-3xl font-bold">{percent >= 80 ? "Concept held under recall." : "The gap is now specific."}</h2>
          <p className="mx-auto mt-4 max-w-xl text-[#C7C5CC]">You answered {score} of {questions.length} correctly. The adaptive planner will use this signal for your next sequence.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><button className="button-ghost" onClick={restart} type="button"><RotateCcw size={16} /> Try another set</button><Link className="button-primary" href="/analytics">View analytics <ArrowRight size={16} /></Link></div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-shell pb-28 pt-8 lg:pb-14 lg:pt-10">
      <div className="mb-7 flex items-center justify-between gap-4">
        <Link className="flex min-h-11 items-center gap-2 text-sm font-semibold text-[#C7C5CC]/80 hover:text-white" href="/practice"><ArrowLeft size={17} /> Exit session</Link>
        <div className="flex-1 px-4 sm:max-w-sm"><div className="h-1.5 bg-[#2A262E]"><div className="h-full bg-[#FF5A1F]" style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div></div>
        <p className="hidden font-mono text-[11px] text-[#C7C5CC]/70 sm:block">SMART DRILL · {questions.length} Q</p>
      </div>
      <QuestionCard index={index} key={`${questions[index].id}-${sessionKey}`} onDone={done} question={questions[index]} total={questions.length} />
    </div>
  );
}
