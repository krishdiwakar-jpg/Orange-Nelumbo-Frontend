"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Bookmark, Check, ChevronLeft, ChevronRight, Clock3, Grid3X3, Loader2, LogOut, X } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { getMockQuestions, isCorrectAnswer } from "@/components/platform/mock-question-utils";
import { useApp } from "@/components/providers/app-provider";
import { readDeviceJson, removeDeviceItem, writeDeviceJson } from "@/lib/device-storage";
import type { MockTest } from "@/types/platform";

function formatTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

export function MockAttempt({ mock }: { mock: MockTest }) {
  const router = useRouter();
  const { hydrated, isAuthenticated, onboardingComplete, user } = useApp();
  const questions = useMemo(() => getMockQuestions(mock), [mock]);
  const initialRemaining = Math.max(1, Math.min(mock.durationMinutes, 180) * 60 - 147);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [marked, setMarked] = useState<string[]>([]);
  const [remaining, setRemaining] = useState(initialRemaining);
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [attemptReady, setAttemptReady] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLButtonElement | null>(null);
  const question = questions[current];
  const attemptStorageKey = `orange-nelumbo:mock:${user?.id ?? "guest"}:${mock.slug}`;
  const resultStorageKey = `orange-nelumbo:last-mock-result:${user?.id ?? "guest"}`;

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) router.replace(`/login?returnTo=${encodeURIComponent(`/mocks/${mock.slug}/attempt`)}`);
    else if (!onboardingComplete) router.replace(`/onboarding?returnTo=${encodeURIComponent(`/mocks/${mock.slug}/attempt`)}`);
  }, [hydrated, isAuthenticated, mock.slug, onboardingComplete, router]);

  useEffect(() => {
    if (!hydrated) return;
    const parsed = readDeviceJson<{
      answers?: Record<string, string[]>;
      endsAt?: number;
      marked?: string[];
      remaining?: number;
    } | null>(attemptStorageKey, null);
    const savedRemaining = Number.isFinite(parsed?.remaining)
      ? Math.max(0, Number(parsed?.remaining))
      : initialRemaining;
    const restoredEndsAt = Number.isFinite(parsed?.endsAt)
      ? Number(parsed?.endsAt)
      : Date.now() + savedRemaining * 1000;
    const questionIds = new Set(questions.map((item) => item.id));
    const restoredAnswers = parsed?.answers && typeof parsed.answers === "object"
      ? Object.fromEntries(
          Object.entries(parsed.answers).flatMap(([id, selections]) =>
            questionIds.has(id) && Array.isArray(selections)
              ? [[id, selections.filter((selection): selection is string => typeof selection === "string")]]
              : [],
          ),
        )
      : {};
    const restoredMarked = Array.isArray(parsed?.marked)
      ? parsed.marked.filter((id): id is string => typeof id === "string" && questionIds.has(id))
      : [];

    queueMicrotask(() => {
      setAnswers(restoredAnswers);
      setMarked(restoredMarked);
      setEndsAt(restoredEndsAt);
      setRemaining(Math.max(0, Math.ceil((restoredEndsAt - Date.now()) / 1000)));
      setAttemptReady(true);
    });
  }, [attemptStorageKey, hydrated, initialRemaining, questions]);

  useEffect(() => {
    if (!attemptReady || endsAt === null) return;
    const timer = window.setInterval(() => {
      setRemaining(Math.max(0, Math.ceil((endsAt - Date.now()) / 1000)));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [attemptReady, endsAt]);

  useEffect(() => {
    if (!hydrated || !attemptReady || endsAt === null) return;
    writeDeviceJson(attemptStorageKey, { answers, marked, endsAt });
  }, [answers, attemptReady, attemptStorageKey, endsAt, hydrated, marked]);

  useEffect(() => {
    if (remaining > 0) return;
    const expiryTimer = window.setTimeout(() => setConfirming(true), 0);
    return () => window.clearTimeout(expiryTimer);
  }, [remaining]);

  useEffect(() => {
    if (!confirming) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusables = Array.from(dialog.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter((element) => !element.hasAttribute("disabled"));
    focusables[0]?.focus();
    const handleDialogKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) {
        event.preventDefault();
        setConfirming(false);
        return;
      }
      if (event.key !== "Tab" || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handleDialogKey);
    return () => {
      document.removeEventListener("keydown", handleDialogKey);
      (returnFocusRef.current ?? previous)?.focus();
    };
  }, [confirming, submitting]);

  const answeredCount = Object.values(answers).filter((value) => value.length).length;
  const correctCount = useMemo(() => questions.reduce((total, item) => {
    const selected = answers[item.id] ?? [];
    return total + (selected.length && isCorrectAnswer(item, selected) ? 1 : 0);
  }, 0), [answers, questions]);
  const incorrectCount = answeredCount - correctCount;
  const score = useMemo(() => questions.reduce((total, item) => {
    const selected = answers[item.id] ?? [];
    if (!selected.length) return total;
    return total + (isCorrectAnswer(item, selected) ? item.marks.correct : item.marks.incorrect);
  }, 0), [answers, questions]);

  const selectOption = (id: string) => {
    if (remaining === 0) return;
    setAnswers((currentAnswers) => {
      const existing = currentAnswers[question.id] ?? [];
      const next = question.type === "multiple-correct" ? existing.includes(id) ? existing.filter((item) => item !== id) : [...existing, id] : [id];
      return { ...currentAnswers, [question.id]: next };
    });
  };

  const setNumericalAnswer = (value: string) => {
    if (remaining === 0) return;
    setAnswers((currentAnswers) => ({ ...currentAnswers, [question.id]: value.trim() ? [value] : [] }));
  };

  const toggleMarked = () => setMarked((items) => items.includes(question.id) ? items.filter((id) => id !== question.id) : [...items, question.id]);

  const markAndAdvance = () => {
    setMarked((items) => items.includes(question.id) ? items : [...items, question.id]);
    if (current === questions.length - 1) setConfirming(true);
    else setCurrent((value) => value + 1);
  };

  const saveAndAdvance = () => {
    if (current === questions.length - 1) setConfirming(true);
    else setCurrent((value) => value + 1);
  };

  const openConfirmation = (event: React.MouseEvent<HTMLButtonElement>) => {
    returnFocusRef.current = event.currentTarget;
    setConfirming(true);
  };

  const submit = () => {
    setSubmitting(true);
    const result = { slug: mock.slug, score, maxMarks: questions.length * 4, answered: answeredCount, correct: correctCount, incorrect: incorrectCount, total: questions.length, completedAt: new Date().toISOString(), answers };
    writeDeviceJson(resultStorageKey, result);
    removeDeviceItem(attemptStorageKey);
    window.setTimeout(() => router.push(`/results/${mock.slug}?score=${score}&answered=${answeredCount}&correct=${correctCount}&incorrect=${incorrectCount}&total=${questions.length}`), 500);
  };

  if (!hydrated || !isAuthenticated) return <main className="grid min-h-screen place-items-center bg-[#0E0D10] text-[#C7C5CC]/70"><Loader2 className="animate-spin" /></main>;

  return (
    <main className="min-h-screen bg-[#0E0D10] text-white" id="main-content">
      <div aria-hidden={confirming || undefined}>
        <header className="sticky top-0 z-30 flex h-[74px] items-center justify-between border-b border-[#FF5A1F]/20 bg-[#161418] px-4 sm:px-6">
        <div className="flex items-center gap-5"><Logo compact href="/dashboard" /><div className="hidden h-8 w-px bg-white/10 sm:block" /><div className="hidden sm:block"><p className="font-semibold">{mock.name}</p><p className="mt-1 font-mono text-[11px] tracking-[.12em] text-[#C7C5CC]/70">DEMO PAPER · AUTO-SAVED</p></div></div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 items-center gap-2 border border-[#FF5A1F]/25 bg-[#0E0D10] px-3 font-mono text-sm text-[#FF8A3D]"><Clock3 size={16} /> {formatTime(remaining)}</div>
          <button aria-label="Submit test" className="button-outline flex px-3" onClick={openConfirmation} type="button"><span className="hidden sm:inline">Submit test</span><span className="sm:hidden">Submit</span></button>
          <button aria-label="Exit test" className="grid size-11 place-items-center border border-white/10 text-[#C7C5CC]/80 hover:text-white" onClick={() => router.push(`/mocks/${mock.slug}`)} type="button"><LogOut size={18} /></button>
        </div>
        </header>

        <div className="grid min-h-[calc(100vh-74px)] lg:grid-cols-[1fr_330px]">
        <section className="p-4 sm:p-7 lg:p-10">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 pb-5">
              <div><p className="mono-kicker">Physics · {question.concept}</p><p className="mt-2 font-mono text-xs text-[#C7C5CC]/70">Question {current + 1} of {questions.length} · +4 / −1</p></div>
              <button className={`flex min-h-11 items-center gap-2 border px-4 text-sm font-semibold ${marked.includes(question.id) ? "border-[#F6C344] bg-[#F6C344]/8 text-[#F6C344]" : "border-white/10 text-[#C7C5CC]/80"}`} onClick={toggleMarked} type="button"><Bookmark size={16} /> {marked.includes(question.id) ? "Marked" : "Mark for review"}</button>
            </div>
            <article className="py-8 sm:py-10">
              <h1 className="font-display text-2xl font-semibold leading-[1.4] sm:text-3xl">{question.prompt}</h1>
              {question.type === "numerical" ? (
                <label className="mt-9 block max-w-md" htmlFor={`mock-numerical-${question.id}`}>
                  <span className="block text-sm font-semibold text-[#C7C5CC]">Numerical answer</span>
                  <span className="mt-2 block text-xs leading-5 text-[#C7C5CC]/70">Enter the numerical value. Decimals are accepted.</span>
                  <input
                    className="mt-3 min-h-[62px] w-full border border-white/10 bg-[#161418] px-4 font-mono text-xl text-white outline-none focus:border-[#FF5A1F] disabled:opacity-60"
                    disabled={remaining === 0}
                    id={`mock-numerical-${question.id}`}
                    inputMode="decimal"
                    onChange={(event) => setNumericalAnswer(event.target.value)}
                    step="any"
                    type="number"
                    value={answers[question.id]?.[0] ?? ""}
                  />
                </label>
              ) : (
                <div className="mt-9 grid gap-3">
                  {question.options.map((option) => {
                  const selected = (answers[question.id] ?? []).includes(option.id);
                  return <button aria-pressed={selected} className={`grid min-h-[62px] grid-cols-[38px_1fr] items-center gap-3 border px-4 text-left ${selected ? "border-[#FF5A1F] bg-[#FF5A1F]/8" : "border-white/10 bg-[#161418] hover:border-[#FF5A1F]/40"}`} disabled={remaining === 0} key={option.id} onClick={() => selectOption(option.id)} type="button"><span className={`grid size-8 place-items-center border font-mono text-xs ${selected ? "border-[#FF5A1F] bg-[#FF5A1F] text-[#0E0D10]" : "border-white/12 text-[#C7C5CC]/70"}`}>{selected ? <Check size={15} /> : option.id.toUpperCase()}</span><span className="text-base text-[#C7C5CC]">{option.label}</span></button>;
                  })}
                </div>
              )}
            </article>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-6">
              <button className="button-ghost" disabled={current === 0} onClick={() => setCurrent((value) => Math.max(0, value - 1))} type="button"><ChevronLeft size={17} /> Previous</button>
              <div className="flex w-full flex-wrap justify-end gap-3 sm:w-auto"><button className="button-outline" onClick={markAndAdvance} type="button">{current === questions.length - 1 ? "Mark & review" : "Mark & next"}</button><button className="button-primary" onClick={saveAndAdvance} type="button">{current === questions.length - 1 ? "Review & submit" : "Save & next"} <ChevronRight size={17} /></button></div>
            </div>
          </div>
        </section>

        <aside className="hidden border-l border-[#FF5A1F]/20 bg-[#161418] p-6 lg:block">
          <div className="flex items-center justify-between"><p className="mono-kicker">Question map</p><Grid3X3 className="text-[#FF8A3D]" size={19} /></div>
          <div className="mt-6 grid grid-cols-5 gap-2">
            {questions.map((item, index) => {
              const answered = Boolean(answers[item.id]?.length);
              const flagged = marked.includes(item.id);
              return <button aria-label={`Question ${index + 1}${answered ? ", answered" : ""}${flagged ? ", marked" : ""}`} className={`grid aspect-square place-items-center border font-mono text-xs ${index === current ? "border-[#FF5A1F] bg-[#FF5A1F] text-[#0E0D10]" : flagged ? "border-[#F6C344] text-[#F6C344]" : answered ? "border-[#3DE08A] bg-[#3DE08A]/8 text-[#3DE08A]" : "border-white/10 text-[#C7C5CC]/70"}`} key={item.id} onClick={() => setCurrent(index)} type="button">{index + 1}</button>;
            })}
          </div>
          <div className="mt-8 space-y-3 border-t border-white/8 pt-6 text-xs text-[#C7C5CC]/80"><p className="flex items-center gap-3"><span className="size-3 bg-[#3DE08A]" /> Answered · {answeredCount}</p><p className="flex items-center gap-3"><span className="size-3 border border-[#F6C344]" /> Marked · {marked.length}</p><p className="flex items-center gap-3"><span className="size-3 border border-white/20" /> Unanswered · {questions.length - answeredCount}</p></div>
          <div className="mt-8 border border-white/9 bg-[#0E0D10] p-4"><p className="font-semibold">Demo paper</p><p className="mt-2 text-xs leading-5 text-[#C7C5CC]/70">This shortened front-end paper demonstrates answering, review flags, autosave, submission, and results.</p></div>
          <button className="button-outline mt-6 w-full" onClick={openConfirmation} type="button">Submit test</button>
        </aside>
        </div>
      </div>

      {confirming && (
        <div aria-labelledby="submit-dialog-title" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-black/78 p-4 backdrop-blur-sm" role="dialog">
          <div className="w-full max-w-lg border border-[#FF5A1F]/30 bg-[#161418] p-6 sm:p-8" ref={dialogRef}>
            <div className="flex items-start justify-between gap-4"><div className="grid size-12 place-items-center border border-[#F6C344]/35 text-[#F6C344]"><AlertTriangle size={22} /></div><button aria-label="Close submit dialog" className="grid size-11 place-items-center text-[#C7C5CC]/70 hover:text-white" onClick={() => setConfirming(false)} type="button"><X size={19} /></button></div>
            <h2 className="mt-6 font-display text-3xl font-semibold" id="submit-dialog-title">Submit this paper?</h2>
            <p className="mt-3 leading-7 text-[#C7C5CC]">You answered {answeredCount} of {questions.length} questions and marked {marked.length} for review. Submission ends this demo attempt.</p>
            <div className="mt-7 grid grid-cols-3 border border-white/9 bg-[#0E0D10]">{[['ANSWERED',answeredCount],['MARKED',marked.length],['LEFT',questions.length-answeredCount]].map(([label,value])=><div className="border-r border-white/8 p-4 text-center last:border-0" key={label}><p className="font-mono text-xl">{value}</p><p className="mt-1 font-mono text-[11px] tracking-[.12em] text-[#C7C5CC]/70">{label}</p></div>)}</div>
            <div className="mt-7 flex justify-end gap-3"><button className="button-ghost" onClick={() => setConfirming(false)} type="button">Keep working</button><button className="button-primary" disabled={submitting} onClick={submit} type="button">{submitting ? <><Loader2 className="animate-spin" size={16} /> Submitting</> : "Submit paper"}</button></div>
          </div>
        </div>
      )}
    </main>
  );
}
