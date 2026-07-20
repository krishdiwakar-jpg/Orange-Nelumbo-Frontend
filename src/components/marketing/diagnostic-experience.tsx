"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Atom,
  BarChart3,
  Beaker,
  Check,
  Clock3,
  RotateCcw,
  Sigma,
  Sparkles,
  Target,
} from "lucide-react";

import { practiceQuestions } from "@/data/platform";
import type { PracticeQuestion, SubjectId } from "@/types/platform";

const diagnosticQuestionIds = [
  "q-phy-001",
  "q-chm-001",
  "q-mat-002",
  "q-phy-004",
  "q-chm-003",
] as const;

const diagnosticQuestions = diagnosticQuestionIds
  .map((id) => practiceQuestions.find((question) => question.id === id))
  .filter((question): question is PracticeQuestion => Boolean(question));

const subjectMeta: Record<
  SubjectId,
  { label: string; icon: typeof Atom; recommendation: string }
> = {
  physics: {
    label: "Physics",
    icon: Atom,
    recommendation: "Revisit the governing law, then solve a short untimed concept set.",
  },
  chemistry: {
    label: "Chemistry",
    icon: Beaker,
    recommendation: "Repair the sign or structure rule before moving to mixed questions.",
  },
  mathematics: {
    label: "Mathematics",
    icon: Sigma,
    recommendation: "Refresh the standard result, then practise recognizing when it applies.",
  },
};

type Stage = "intro" | "questions" | "results";

export function DiagnosticExperience() {
  const [stage, setStage] = useState<Stage>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQuestion = diagnosticQuestions[questionIndex];
  const selectedOption = currentQuestion ? answers[currentQuestion.id] : undefined;

  const subjectResults = useMemo(
    () =>
      (Object.keys(subjectMeta) as SubjectId[]).map((subjectId) => {
        const questions = diagnosticQuestions.filter(
          (question) => question.subjectId === subjectId,
        );
        const correct = questions.filter((question) =>
          question.correctOptionIds.includes(answers[question.id]),
        ).length;
        const missedConcepts = questions
          .filter(
            (question) =>
              !question.correctOptionIds.includes(answers[question.id]),
          )
          .map((question) => question.concept);

        return {
          subjectId,
          correct,
          total: questions.length,
          percentage: questions.length
            ? Math.round((correct / questions.length) * 100)
            : 0,
          missedConcepts,
        };
      }),
    [answers],
  );

  const totalCorrect = subjectResults.reduce(
    (sum, subject) => sum + subject.correct,
    0,
  );

  const start = () => {
    setQuestionIndex(0);
    setAnswers({});
    setStage("questions");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const finishOrAdvance = () => {
    if (!selectedOption) return;
    if (questionIndex === diagnosticQuestions.length - 1) {
      setStage("results");
    } else {
      setQuestionIndex((index) => index + 1);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (stage === "intro") {
    return (
      <main id="main-content">
        <section className="hero-grid border-b border-[#FF5A1F]/22">
          <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:px-14 lg:py-24">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="ui-badge ui-badge--brand">Free diagnostic sample</span>
                <span className="font-mono text-[11px] uppercase tracking-[.16em] text-[#C7C5CC]/70">
                  No account required
                </span>
              </div>
              <h1 className="mt-7 max-w-4xl font-display text-[clamp(3rem,6vw,3.5rem)] font-bold leading-none tracking-[-.02em]">
                Find the first gap worth <span className="text-gradient">fixing.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#C7C5CC]">
                Try a shortened five-question sample across Physics, Chemistry, and Mathematics. Get an immediate directional gap map before creating an account.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button className="button-primary justify-center" onClick={start} type="button">
                  Start 5-question sample <ArrowRight aria-hidden="true" size={17} />
                </button>
                <span className="flex min-h-11 items-center gap-2 font-mono text-[11px] uppercase tracking-[.12em] text-[#C7C5CC]/80">
                  <Clock3 aria-hidden="true" size={16} /> About 5 minutes
                </span>
              </div>
            </div>

            <aside className="border border-[#FF5A1F]/30 bg-[#161418] p-6 sm:p-8" aria-label="Diagnostic sample overview">
              <div className="flex items-center justify-between border-b border-white/8 pb-5">
                <p className="kicker">Sample telemetry</p>
                <Target aria-hidden="true" className="text-[#FF8A3D]" size={24} strokeWidth={1.6} />
              </div>
              <div className="mt-7 grid grid-cols-3 gap-px bg-[#FF5A1F]/20">
                {[
                  ["05", "questions"],
                  ["03", "subjects"],
                  ["00", "forms"],
                ].map(([value, label]) => (
                  <div className="bg-[#0E0D10] px-3 py-5 text-center" key={label}>
                    <p className="font-mono text-2xl text-[#3DE0D0]">{value}</p>
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[.12em] text-[#C7C5CC]/70">{label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-7 space-y-4">
                {[
                  "One answer per question",
                  "Foundation to JEE-level concepts",
                  "Instant subject and concept signal",
                ].map((item) => (
                  <div className="flex items-center gap-3 text-sm text-[#C7C5CC]" key={item}>
                    <span className="grid size-6 shrink-0 place-items-center border border-[#3DE08A]/35 text-[#3DE08A]">
                      <Check aria-hidden="true" size={13} />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="section-shell bg-[#161418]">
          <div className="grid gap-px border border-[#FF5A1F]/22 bg-[#FF5A1F]/22 md:grid-cols-3">
            {[
              [BarChart3, "Answer honestly", "No penalty, timer, or rank theatre. This sample is most useful when you answer from recall."],
              [Sparkles, "Read the signal", "See which sampled concepts held and which one should return to your study queue first."],
              [Target, "Continue with context", "Create a dummy account or open the student demo to explore the complete learning loop."],
            ].map(([Icon, title, body], index) => {
              const FeatureIcon = Icon as typeof Target;
              return (
                <article className="bg-[#0E0D10] p-7 sm:p-9" key={String(title)}>
                  <div className="flex items-center justify-between">
                    <FeatureIcon aria-hidden="true" className="text-[#FF8A3D]" size={24} strokeWidth={1.6} />
                    <span className="font-mono text-[11px] text-[#C7C5CC]/70">0{index + 1}</span>
                  </div>
                  <h2 className="mt-9 font-display text-2xl font-semibold">{String(title)}</h2>
                  <p className="mt-4 leading-7 text-[#C7C5CC]">{String(body)}</p>
                </article>
              );
            })}
          </div>
          <p className="mt-7 max-w-4xl text-sm leading-6 text-[#C7C5CC]/70">
            This is a shortened front-end sample, not a full diagnostic, predicted rank, or counselling assessment. Its result is directional and is not saved to a real student profile.
          </p>
        </section>
      </main>
    );
  }

  if (stage === "results") {
    const signal = totalCorrect >= 4
      ? "Strong starting signal"
      : totalCorrect >= 2
        ? "A mixed signal with clear leverage"
        : "Core concepts should return first";

    return (
      <main id="main-content">
        <section className="hero-grid border-b border-[#FF5A1F]/22">
          <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8 lg:px-14 lg:py-20">
            <div className="flex flex-wrap items-center justify-between gap-5">
              <div>
                <p className="kicker">Diagnostic sample complete</p>
                <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold tracking-[-.02em] sm:text-[3.5rem]">{signal}.</h1>
              </div>
              <div className="grid size-36 place-items-center border border-[#FF5A1F]/35 bg-[#161418] text-center">
                <div>
                  <p className="font-mono text-4xl text-[#3DE0D0]">{totalCorrect}/{diagnosticQuestions.length}</p>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-[.14em] text-[#C7C5CC]/70">sample score</p>
                </div>
              </div>
            </div>

            <div className="mt-12 grid gap-px border border-[#FF5A1F]/22 bg-[#FF5A1F]/22 lg:grid-cols-3">
              {subjectResults.map((result) => {
                const meta = subjectMeta[result.subjectId];
                const Icon = meta.icon;
                const held = result.correct === result.total;
                return (
                  <article className="bg-[#161418] p-6 sm:p-8" key={result.subjectId}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Icon aria-hidden="true" className="text-[#FF8A3D]" size={22} strokeWidth={1.6} />
                        <h2 className="font-display text-xl font-semibold">{meta.label}</h2>
                      </div>
                      <span className="font-mono text-sm text-[#3DE0D0]">{result.correct}/{result.total}</span>
                    </div>
                    <div className="mt-6 h-1.5 bg-[#2A262E]" aria-hidden="true">
                      <div className="h-full bg-[#FF5A1F]" style={{ width: `${result.percentage}%` }} />
                    </div>
                    <p className="mt-6 font-mono text-[11px] uppercase tracking-[.13em] text-[#C7C5CC]/70">
                      {held ? "Sampled concepts held" : "First gap to revisit"}
                    </p>
                    <p className="mt-3 min-h-12 text-sm leading-6 text-[#C7C5CC]">
                      {held ? "No gap surfaced in this small sample." : result.missedConcepts.join(" · ")}
                    </p>
                    <p className="mt-5 border-l border-[#FF5A1F]/45 pl-4 text-sm leading-6 text-[#C7C5CC]/80">
                      {held ? "Add harder mixed practice to verify the signal." : meta.recommendation}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="mt-10 grid gap-8 border border-[#FF5A1F]/30 bg-[#FF5A1F] p-7 text-[#0E0D10] sm:p-9 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[.17em]">Next step // build the full map</p>
                <h2 className="mt-4 max-w-3xl font-display text-3xl font-bold tracking-[-.02em] sm:text-4xl">Turn this first signal into a complete study loop.</h2>
                <p className="mt-4 max-w-2xl leading-7 text-[#0E0D10]/75">The current platform is a front-end demonstration. Create a dummy account or open the student demo; no payment or real academic record is involved.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#0E0D10] px-5 font-bold text-white transition hover:bg-[#1E1B20]" href="/signup">
                  Create dummy account <ArrowRight aria-hidden="true" size={16} />
                </Link>
                <Link className="inline-flex min-h-11 items-center justify-center border border-[#0E0D10]/35 px-5 font-bold transition hover:bg-[#0E0D10]/8" href="/login?demo=1">
                  Open student demo
                </Link>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <button className="button-ghost" onClick={start} type="button">
                <RotateCcw aria-hidden="true" size={16} /> Retake sample
              </button>
              <p className="max-w-2xl text-right text-xs leading-5 text-[#C7C5CC]/70">Results are based on five sample questions and should not be treated as a predicted score, rank, or complete readiness assessment.</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main id="main-content" className="hero-grid">
      <section className="mx-auto max-w-[1100px] px-5 py-10 sm:px-8 lg:px-14 lg:py-14">
        <div className="mb-8 flex items-center justify-between gap-4">
          <button
            className="flex min-h-11 items-center gap-2 text-sm font-semibold text-[#C7C5CC]/80 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF5A1F]"
            onClick={() => questionIndex === 0 ? setStage("intro") : setQuestionIndex((index) => index - 1)}
            type="button"
          >
            <ArrowLeft aria-hidden="true" size={17} /> {questionIndex === 0 ? "Exit sample" : "Previous"}
          </button>
          <span className="font-mono text-[11px] uppercase tracking-[.14em] text-[#C7C5CC]/70">Short diagnostic sample</span>
        </div>

        <div className="border border-[#FF5A1F]/25 bg-[#161418]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 px-5 py-5 sm:px-8">
            <div>
              <p className="font-mono text-xs text-[#FF8A3D]">QUESTION {String(questionIndex + 1).padStart(2, "0")} / {String(diagnosticQuestions.length).padStart(2, "0")}</p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[.14em] text-[#C7C5CC]/70">{subjectMeta[currentQuestion.subjectId].label} · {currentQuestion.difficulty}</p>
            </div>
            <span className="flex items-center gap-2 font-mono text-[11px] text-[#C7C5CC]/70"><Clock3 aria-hidden="true" size={14} /> {currentQuestion.estimatedSeconds}s target</span>
          </div>

          <div className="h-1 bg-[#2A262E]" aria-hidden="true">
            <div className="h-full bg-[#FF5A1F] transition-[width] duration-300" style={{ width: `${((questionIndex + 1) / diagnosticQuestions.length) * 100}%` }} />
          </div>

          <div className="p-5 sm:p-8 lg:p-10">
            <p className="font-mono text-[11px] uppercase tracking-[.16em] text-[#3DE0D0]">{currentQuestion.concept}</p>
            <fieldset className="mt-5">
              <legend className="max-w-4xl font-display text-2xl font-semibold leading-[1.35] sm:text-3xl">{currentQuestion.prompt}</legend>
              <div className="mt-8 grid gap-3">
                {currentQuestion.options.map((option) => {
                  const checked = selectedOption === option.id;
                  return (
                    <label
                      className={`grid min-h-[60px] cursor-pointer grid-cols-[38px_1fr] items-center gap-3 border px-4 text-left transition focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#FF5A1F] ${checked ? "border-[#FF5A1F] bg-[#FF5A1F]/8" : "border-white/10 bg-[#0E0D10] hover:border-[#FF5A1F]/40"}`}
                      key={option.id}
                    >
                      <input
                        checked={checked}
                        className="sr-only"
                        name={currentQuestion.id}
                        onChange={() => setAnswers((current) => ({ ...current, [currentQuestion.id]: option.id }))}
                        type="radio"
                        value={option.id}
                      />
                      <span className={`grid size-8 place-items-center border font-mono text-xs ${checked ? "border-[#FF5A1F] bg-[#FF5A1F] text-[#0E0D10]" : "border-white/12 text-[#C7C5CC]/70"}`}>
                        {checked ? <Check aria-hidden="true" size={15} /> : option.id.toUpperCase()}
                      </span>
                      <span className="text-base text-[#C7C5CC]">{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-t border-white/8 pt-6">
              <p aria-live="polite" className="text-sm text-[#C7C5CC]/70">{selectedOption ? "Answer selected. You can continue." : "Select one answer to continue."}</p>
              <button className="button-primary" disabled={!selectedOption} onClick={finishOrAdvance} type="button">
                {questionIndex === diagnosticQuestions.length - 1 ? "See my gap map" : "Next question"} <ArrowRight aria-hidden="true" size={16} />
              </button>
            </div>
          </div>
        </div>
        <p className="mt-5 text-center text-xs leading-5 text-[#C7C5CC]/70">Answers stay in this browser page and are used only to generate the sample result below.</p>
      </section>
    </main>
  );
}
