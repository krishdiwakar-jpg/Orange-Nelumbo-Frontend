"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Lightbulb, X } from "lucide-react";

import { formatAnswer, formatCorrectAnswer, getMockQuestions, isCorrectAnswer } from "@/components/platform/mock-question-utils";
import { useApp } from "@/components/providers/app-provider";
import { readDeviceJson } from "@/lib/device-storage";
import type { MockTest } from "@/types/platform";

interface StoredMockResult {
  slug: string;
  answers: Record<string, string[]>;
}

export function MockReview({ mock }: { mock: MockTest }) {
  const { hydrated, user } = useApp();
  const [storedResult, setStoredResult] = useState<StoredMockResult | null>(null);
  const [checked, setChecked] = useState(false);
  const questions = useMemo(() => getMockQuestions(mock), [mock]);

  useEffect(() => {
    if (!hydrated || !user) return;
    let cancelled = false;
    queueMicrotask(() => {
      const parsed = readDeviceJson<StoredMockResult | null>(
        `orange-nelumbo:last-mock-result:${user.id}`,
        null,
      );
      if (cancelled) return;
      setStoredResult(parsed?.slug === mock.slug ? parsed : null);
      setChecked(true);
    });
    return () => {
      cancelled = true;
    };
  }, [hydrated, mock.slug, user]);

  if (!checked) return null;

  if (!storedResult) {
    return (
      <section className="mt-7 border border-white/9 bg-[#161418] p-6">
        <p className="mono-kicker">Detailed review</p>
        <h3 className="mt-3 font-display text-2xl font-semibold">No answer map is stored for this result.</h3>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#C7C5CC]">Historical sample results show aggregate performance only. Complete this demo paper on this device to unlock question-by-question solutions.</p>
      </section>
    );
  }

  return (
    <section className="mt-7 border border-[#FF5A1F]/22 bg-[#161418] p-5 sm:p-7">
      <p className="mono-kicker">Detailed review</p>
      <h3 className="mt-3 font-display text-2xl font-semibold">Question-by-question solutions</h3>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#C7C5CC]">Your selected answers and explanations are restored from this browser only.</p>
      <div className="mt-6 divide-y divide-white/8 border-y border-white/8">
        {questions.map((question, index) => {
          const selected = storedResult.answers[question.id] ?? [];
          const correct = selected.length > 0 && isCorrectAnswer(question, selected);
          return (
            <details className="group" key={question.id}>
              <summary className="flex min-h-14 cursor-pointer list-none items-center gap-4 py-3 text-left">
                <span className={`grid size-9 shrink-0 place-items-center border ${correct ? "border-[#3DE08A] text-[#3DE08A]" : "border-[#E0483C] text-[#E0483C]"}`}>
                  {correct ? <Check aria-hidden="true" size={16} /> : <X aria-hidden="true" size={16} />}
                </span>
                <span className="min-w-0 flex-1"><span className="block font-mono text-[11px] text-[#FF8A3D]">QUESTION {String(index + 1).padStart(2, "0")}</span><span className="mt-1 block truncate text-sm font-semibold">{question.concept}</span></span>
                <ChevronDown aria-hidden="true" className="shrink-0 text-[#C7C5CC] transition group-open:rotate-180" size={18} />
              </summary>
              <div className="pb-6 pl-0 sm:pl-[52px]">
                <p className="text-base leading-7 text-white">{question.prompt}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="border border-white/9 bg-[#0E0D10] p-4"><p className="font-mono text-[11px] tracking-[.14em] text-[#C7C5CC]">YOUR ANSWER</p><p className={`mt-2 text-sm ${correct ? "text-[#3DE08A]" : "text-[#E0483C]"}`}>{formatAnswer(question, selected)}</p></div>
                  <div className="border border-[#3DE08A]/25 bg-[#3DE08A]/5 p-4"><p className="font-mono text-[11px] tracking-[.14em] text-[#C7C5CC]">CORRECT ANSWER</p><p className="mt-2 text-sm text-[#3DE08A]">{formatCorrectAnswer(question)}</p></div>
                </div>
                <div className="mt-4 border-l-2 border-[#3DE0D0] bg-[#0E0D10] p-4"><p className="flex items-center gap-2 font-semibold"><Lightbulb aria-hidden="true" className="text-[#3DE0D0]" size={17}/> Why</p><p className="mt-2 text-sm leading-6 text-[#C7C5CC]">{question.explanation}</p></div>
              </div>
            </details>
          );
        })}
      </div>
    </section>
  );
}
