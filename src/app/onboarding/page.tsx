"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpenCheck, Check, Clock3, Target } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import {
  useApp,
  type ClassLevel,
  type OnboardingProfile,
  type StudyWindow,
  type TargetExam,
} from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { safeReturnTo } from "@/lib/navigation";
import type { SubjectId } from "@/types/platform";

const steps = [
  { title: "Choose the target", description: "Set the exam and academic stage that shape your plan.", icon: Target },
  { title: "Set a workable rhythm", description: "Pick a daily target you can sustain on ordinary days.", icon: Clock3 },
  { title: "Tune your starting point", description: "Tell us where to focus first. You can change this later.", icon: BookOpenCheck },
];

const targetExams: TargetExam[] = ["JEE Main", "JEE Advanced"];
const classLevels: ClassLevel[] = ["Class 11", "Class 12", "Dropper"];
const dailyGoals = [30, 60, 90, 120];
const studyWindows: StudyWindow[] = ["Morning", "Afternoon", "Evening", "Flexible"];
const subjectChoices: Array<{ id: SubjectId; label: string; code: string }> = [
  { id: "physics", label: "Physics", code: "PHY" },
  { id: "chemistry", label: "Chemistry", code: "CHM" },
  { id: "mathematics", label: "Mathematics", code: "MAT" },
];

const initialProfile: OnboardingProfile = {
  targetExam: "JEE Advanced",
  targetYear: 2027,
  classLevel: "Class 12",
  dailyGoalMinutes: 90,
  focusSubjects: ["physics", "mathematics"],
  studyWindow: "Evening",
  city: "",
};

function ChoiceButton({
  selected,
  title,
  description,
  onClick,
}: {
  selected: boolean;
  title: string;
  description?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`group relative min-h-24 border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ignition focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian ${
        selected
          ? "border-ignition bg-ignition/10 text-paper"
          : "border-steel bg-graphite/55 text-titanium hover:border-titanium hover:bg-graphite"
      }`}
    >
      <span className={`block font-display text-base font-bold ${selected ? "text-paper" : "text-inherit"}`}>{title}</span>
      {description ? <span className="mt-1 block text-xs leading-5 text-titanium">{description}</span> : null}
      <span
        className={`absolute right-3 top-3 flex size-5 items-center justify-center border ${
          selected ? "border-ignition bg-ignition text-obsidian" : "border-steel"
        }`}
      >
        {selected ? <Check aria-hidden="true" className="size-3.5" strokeWidth={3} /> : null}
      </span>
    </button>
  );
}

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = safeReturnTo(searchParams.get("returnTo"));
  const { hydrated, user, isAuthenticated, onboardingComplete, completeOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<OnboardingProfile>(initialProfile);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) router.replace(`/login?returnTo=${encodeURIComponent(returnTo)}`);
    else if (onboardingComplete) router.replace(returnTo);
  }, [hydrated, isAuthenticated, onboardingComplete, returnTo, router]);

  const StepIcon = steps[step].icon;
  const examYears = useMemo(() => [2027, 2028, 2029], []);

  function toggleSubject(subjectId: SubjectId) {
    setProfile((current) => {
      const selected = current.focusSubjects.includes(subjectId);
      const next = selected
        ? current.focusSubjects.filter((id) => id !== subjectId)
        : [...current.focusSubjects, subjectId];
      return { ...current, focusSubjects: next.length ? next : current.focusSubjects };
    });
  }

  function finish() {
    completeOnboarding(profile);
    router.replace(returnTo);
  }

  if (!hydrated || !user || onboardingComplete) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-obsidian text-paper">
        <div className="size-8 animate-spin rounded-full border-2 border-steel border-t-ignition" aria-label="Loading profile" />
      </main>
    );
  }

  return (
    <main id="main-content" className="relative min-h-screen overflow-hidden bg-obsidian px-5 py-6 text-paper sm:px-8 lg:px-12 lg:py-9">
      <div className="brand-grid pointer-events-none absolute inset-0 opacity-25" />
      <div className="pointer-events-none absolute -right-40 -top-52 size-[36rem] rounded-full border border-ignition/10" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <header className="flex items-center justify-between gap-5">
          <Logo className="text-paper" href="/" />
          <p className="hidden font-mono text-xs uppercase tracking-[0.14em] text-titanium sm:block">
            Profile setup · {step + 1} / {steps.length}
          </p>
        </header>

        <div className="mt-10 grid gap-8 lg:mt-16 lg:grid-cols-[minmax(0,0.7fr)_minmax(560px,1.3fr)] lg:gap-16">
          <aside className="lg:pt-3">
            <p className="mono-kicker text-ignition">Welcome, {user.firstName}</p>
            <h1 className="mt-5 max-w-lg font-display text-4xl font-bold leading-[1.04] tracking-[-.02em] sm:text-5xl">
              Turn the syllabus into a plan you can actually follow.
            </h1>
            <p className="mt-5 max-w-md leading-7 text-titanium">
              Three quick choices personalise the front-end demo. They stay on this device and can be reset anytime.
            </p>

            <div className="mt-8 max-w-md">
              <Progress value={step + 1} max={steps.length} tone="brand" size="sm" />
              <div className="mt-6 space-y-4">
                {steps.map((item, index) => {
                  const Icon = item.icon;
                  const active = index === step;
                  const complete = index < step;
                  return (
                    <div key={item.title} className="flex items-start gap-3">
                      <span
                        className={`flex size-8 shrink-0 items-center justify-center border ${
                          complete
                            ? "border-cyan bg-cyan text-obsidian"
                            : active
                              ? "border-ignition text-ignition"
                              : "border-steel text-titanium"
                        }`}
                      >
                        {complete ? <Check aria-hidden="true" className="size-4" /> : <Icon aria-hidden="true" className="size-4" />}
                      </span>
                      <div>
                        <p className={`text-sm font-bold ${active || complete ? "text-paper" : "text-titanium"}`}>{item.title}</p>
                        <p className="mt-1 text-xs leading-5 text-titanium">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          <Card className="border-steel bg-carbon p-5 sm:p-8 lg:p-10">
            <div className="flex size-11 items-center justify-center border border-ignition/40 bg-ignition/10 text-ignition">
              <StepIcon aria-hidden="true" className="size-5" />
            </div>
            <p className="mt-6 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-ignition">Step {step + 1}</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-paper sm:text-3xl">{steps[step].title}</h2>
            <p className="mt-2 text-sm leading-6 text-titanium">{steps[step].description}</p>

            {step === 0 ? (
              <div className="mt-8 space-y-7">
                <fieldset>
                  <legend className="mb-3 text-sm font-bold text-paper">Primary exam target</legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {targetExams.map((exam) => (
                      <ChoiceButton
                        key={exam}
                        selected={profile.targetExam === exam}
                        title={exam}
                        description={exam === "JEE Main" ? "Speed, coverage, and accuracy" : "Depth, combinations, and edge cases"}
                        onClick={() => setProfile((current) => ({ ...current, targetExam: exam }))}
                      />
                    ))}
                  </div>
                </fieldset>

                <div className="grid gap-7 sm:grid-cols-2">
                  <fieldset>
                    <legend className="mb-3 text-sm font-bold text-paper">Academic stage</legend>
                    <div className="grid gap-2">
                      {classLevels.map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setProfile((current) => ({ ...current, classLevel: level }))}
                          className={`border px-4 py-3 text-left text-sm font-bold transition ${
                            profile.classLevel === level
                              ? "border-ignition bg-ignition/10 text-paper"
                              : "border-steel bg-graphite/50 text-titanium hover:border-titanium"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset>
                    <legend className="mb-3 text-sm font-bold text-paper">Target year</legend>
                    <div className="grid gap-2">
                      {examYears.map((year) => (
                        <button
                          key={year}
                          type="button"
                          onClick={() => setProfile((current) => ({ ...current, targetYear: year }))}
                          className={`border px-4 py-3 text-left font-mono text-sm font-bold transition ${
                            profile.targetYear === year
                              ? "border-ignition bg-ignition/10 text-paper"
                              : "border-steel bg-graphite/50 text-titanium hover:border-titanium"
                          }`}
                        >
                          JEE {year}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                </div>
              </div>
            ) : null}

            {step === 1 ? (
              <div className="mt-8 space-y-8">
                <fieldset>
                  <legend className="mb-3 text-sm font-bold text-paper">Daily focused-study target</legend>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {dailyGoals.map((minutes) => (
                      <ChoiceButton
                        key={minutes}
                        selected={profile.dailyGoalMinutes === minutes}
                        title={`${minutes} min`}
                        description={minutes === 90 ? "Recommended" : undefined}
                        onClick={() => setProfile((current) => ({ ...current, dailyGoalMinutes: minutes }))}
                      />
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="mb-3 text-sm font-bold text-paper">When do you usually study best?</legend>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {studyWindows.map((window) => (
                      <button
                        key={window}
                        type="button"
                        onClick={() => setProfile((current) => ({ ...current, studyWindow: window }))}
                        className={`border px-3 py-4 text-center text-sm font-bold transition ${
                          profile.studyWindow === window
                            ? "border-ignition bg-ignition/10 text-paper"
                            : "border-steel bg-graphite/50 text-titanium hover:border-titanium"
                        }`}
                      >
                        {window}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <div className="border-l-2 border-cyan bg-cyan/5 px-4 py-3 text-sm leading-6 text-titanium">
                  Your plan will start with about <strong className="text-paper">{Math.max(1, Math.round(profile.dailyGoalMinutes / 30))} focused blocks</strong> per day.
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="mt-8 space-y-8">
                <fieldset>
                  <legend className="mb-3 text-sm font-bold text-paper">Subjects to prioritise first</legend>
                  <p className="mb-4 text-xs leading-5 text-titanium">Choose one or more. This only changes your recommended queue.</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {subjectChoices.map((subject) => (
                      <ChoiceButton
                        key={subject.id}
                        selected={profile.focusSubjects.includes(subject.id)}
                        title={subject.label}
                        description={subject.code}
                        onClick={() => toggleSubject(subject.id)}
                      />
                    ))}
                  </div>
                </fieldset>
                <Input
                  label="Study city (optional)"
                  name="city"
                  autoComplete="address-level2"
                  placeholder="Kota"
                  value={profile.city}
                  onChange={(event) => setProfile((current) => ({ ...current, city: event.target.value }))}
                  hint="Used only to personalise sample profile details on this device."
                />
                <div className="border border-steel bg-graphite/55 p-4">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-cyan">Your starting setup</p>
                  <p className="mt-3 text-sm leading-6 text-titanium">
                    {profile.targetExam} {profile.targetYear} · {profile.classLevel} · {profile.dailyGoalMinutes} minutes daily · {profile.studyWindow.toLowerCase()} study window
                  </p>
                </div>
              </div>
            ) : null}

            <div className="mt-10 flex flex-col-reverse gap-3 border-t border-steel pt-6 sm:flex-row sm:items-center sm:justify-between">
              {step > 0 ? (
                <Button type="button" variant="ghost" size="md" onClick={() => setStep((current) => current - 1)}>
                  <ArrowLeft aria-hidden="true" className="size-4" />
                  Back
                </Button>
              ) : (
                <button type="button" className="text-sm font-semibold text-titanium hover:text-paper" onClick={finish}>
                  Use recommended setup
                </button>
              )}

              {step < steps.length - 1 ? (
                <Button type="button" variant="primary" size="lg" onClick={() => setStep((current) => current + 1)}>
                  Continue
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Button>
              ) : (
                <Button type="button" variant="primary" size="lg" onClick={finish}>
                  Open my dashboard
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-obsidian text-paper">
          <div className="size-8 animate-spin rounded-full border-2 border-steel border-t-ignition" aria-label="Loading profile" />
        </main>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}
