"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpenCheck,
  CalendarDays,
  Check,
  Clock3,
  Flame,
  MapPin,
  Save,
  ShieldCheck,
  Target,
  UserRound,
} from "lucide-react";

import {
  useApp,
  type ClassLevel,
  type OnboardingProfile,
  type StudyWindow,
  type TargetExam,
} from "@/components/providers/app-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SectionHeader } from "@/components/ui/section-header";
import { plans, studentProfile } from "@/data/platform";
import type { SubjectId } from "@/types/platform";

const targetExams: TargetExam[] = ["JEE Main", "JEE Advanced"];
const targetYears = [2027, 2028, 2029];
const classLevels: ClassLevel[] = ["Class 11", "Class 12", "Dropper"];
const dailyGoals = [30, 60, 90, 120];
const studyWindows: StudyWindow[] = ["Morning", "Afternoon", "Evening", "Flexible"];
const subjects: Array<{ id: SubjectId; label: string; code: string }> = [
  { id: "physics", label: "Physics", code: "PHY" },
  { id: "chemistry", label: "Chemistry", code: "CHM" },
  { id: "mathematics", label: "Mathematics", code: "MAT" },
];

function formatJoinedAt(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

function OptionButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={`min-h-11 border px-4 text-left text-sm font-bold transition ${
        active
          ? "border-[#FF5A1F] bg-[#FF5A1F]/10 text-white"
          : "border-white/10 bg-[#0E0D10] text-[#C7C5CC]/80 hover:border-white/25 hover:text-white"
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export function ProfileView() {
  const { completeOnboarding, onboardingProfile, user } = useApp();
  const student = user ?? { ...studentProfile, onboardingComplete: true };
  const sourceProfile = useMemo<OnboardingProfile>(
    () =>
      onboardingProfile ?? {
        targetExam: student.targetExam,
        targetYear: student.targetYear,
        classLevel: "Class 12",
        dailyGoalMinutes: 90,
        focusSubjects: ["physics", "mathematics"],
        studyWindow: "Evening",
        city: student.city,
      },
    [onboardingProfile, student.city, student.targetExam, student.targetYear],
  );
  const [draft, setDraft] = useState<OnboardingProfile>(sourceProfile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const profileTimer = window.setTimeout(() => setDraft(sourceProfile), 0);

    return () => window.clearTimeout(profileTimer);
  }, [sourceProfile]);

  const hasChanges = JSON.stringify(draft) !== JSON.stringify(sourceProfile);
  const activePlan = plans.find((plan) => plan.id === student.activePlanId) ?? plans[0];

  function toggleSubject(subjectId: SubjectId) {
    setSaved(false);
    setDraft((current) => {
      const alreadySelected = current.focusSubjects.includes(subjectId);
      const next = alreadySelected
        ? current.focusSubjects.filter((id) => id !== subjectId)
        : [...current.focusSubjects, subjectId];
      return { ...current, focusSubjects: next.length ? next : current.focusSubjects };
    });
  }

  function saveProfile() {
    completeOnboarding(draft);
    setSaved(true);
  }

  return (
    <div className="content-shell pb-28 pt-8 lg:pb-14 lg:pt-10">
      <SectionHeader
        action={<Badge tone={student.isDemo ? "warning" : "success"}>{student.isDemo ? "Demo student" : "Local student"}</Badge>}
        description="Your target and study rhythm shape recommendations across the planner and dashboard. Changes are saved to this browser-only profile."
        kicker="Student record · editable locally"
        level={2}
        title="A profile built around the attempt ahead."
      />

      <div className="mt-8 grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <Card className="overflow-hidden p-0" variant="priority">
            <div className="brand-grid border-b border-[#FF5A1F]/20 bg-[#0E0D10] p-6">
              <div className="grid size-20 place-items-center border border-[#FF5A1F]/50 bg-[#FF5A1F] font-mono text-2xl font-bold text-[#0E0D10]">
                {student.initials}
              </div>
              <h2 className="mt-6 font-display text-2xl font-semibold">{student.name}</h2>
              <p className="mt-2 truncate text-sm text-[#C7C5CC]/80">{student.email}</p>
            </div>
            <div className="divide-y divide-white/8">
              <div className="flex items-center gap-3 p-5">
                <Target aria-hidden="true" className="text-[#FF8A3D]" size={18} />
                <div><p className="text-xs text-[#C7C5CC]/70">Target</p><p className="mt-1 text-sm font-semibold">{student.targetExam} · {student.targetYear}</p></div>
              </div>
              <div className="flex items-center gap-3 p-5">
                <MapPin aria-hidden="true" className="text-[#3DE0D0]" size={18} />
                <div><p className="text-xs text-[#C7C5CC]/70">Study city</p><p className="mt-1 text-sm font-semibold">{student.city || "Not added"}</p></div>
              </div>
              <div className="flex items-center gap-3 p-5">
                <Flame aria-hidden="true" className="text-[#FF8A3D]" size={18} />
                <div><p className="text-xs text-[#C7C5CC]/70">Reading streak</p><p className="mt-1 text-sm font-semibold">{student.readingStreak} days</p></div>
              </div>
              <div className="flex items-center gap-3 p-5">
                <CalendarDays aria-hidden="true" className="text-[#C7C5CC]" size={18} />
                <div><p className="text-xs text-[#C7C5CC]/70">Workspace started</p><p className="mt-1 text-sm font-semibold">{formatJoinedAt(student.joinedAt)}</p></div>
              </div>
            </div>
          </Card>

          <Card className="p-6" id="plan" variant="subtle">
            <p className="mono-kicker">Active access</p>
            <h3 className="mt-4 font-display text-xl font-semibold">{activePlan.name}</h3>
            <p className="mt-2 text-sm leading-6 text-[#C7C5CC]/80">{activePlan.description}</p>
            <Badge className="mt-5" tone="success">Active on this demo</Badge>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck aria-hidden="true" className="text-[#3DE0D0]" size={20} />
              <p className="font-mono text-[11px] uppercase tracking-[.16em] text-[#3DE0D0]">Prototype account</p>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#C7C5CC]/80">
              Identity fields are read-only because no secure account backend is connected. Study preferences remain editable on this device.
            </p>
          </Card>
        </aside>

        <Card className="p-5 sm:p-7 lg:p-9">
          <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-6">
            <div>
              <p className="mono-kicker">Learning profile</p>
              <h2 className="mt-3 font-display text-2xl font-semibold">Personalise the recommendation engine</h2>
            </div>
            <UserRound aria-hidden="true" className="hidden text-[#FF8A3D] sm:block" size={24} strokeWidth={1.5} />
          </div>

          <section className="border-b border-white/8 py-7" aria-labelledby="identity-heading">
            <h3 className="font-display text-lg font-semibold" id="identity-heading">Identity</h3>
            <p className="mt-2 text-sm text-[#C7C5CC]/80">Displayed throughout your local workspace.</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Input disabled label="Full name" name="profile-name" value={student.name} />
              <Input disabled label="Email address" name="profile-email" type="email" value={student.email} />
            </div>
            <Input
              containerClassName="mt-5"
              hint="Used only in sample profile and leaderboard context."
              label="Study city"
              name="profile-city"
              onChange={(event) => {
                setDraft((current) => ({ ...current, city: event.target.value }));
                setSaved(false);
              }}
              placeholder="Kota"
              value={draft.city}
            />
          </section>

          <section className="border-b border-white/8 py-7" aria-labelledby="target-heading">
            <div className="flex items-center gap-3">
              <Target aria-hidden="true" className="text-[#FF8A3D]" size={19} />
              <h3 className="font-display text-lg font-semibold" id="target-heading">Exam target</h3>
            </div>
            <div className="mt-5 grid gap-6 lg:grid-cols-3">
              <fieldset>
                <legend className="mb-3 text-xs font-bold text-[#C7C5CC]">Exam</legend>
                <div className="grid gap-2">
                  {targetExams.map((exam) => <OptionButton active={draft.targetExam === exam} key={exam} onClick={() => { setDraft((current) => ({ ...current, targetExam: exam })); setSaved(false); }}>{exam}</OptionButton>)}
                </div>
              </fieldset>
              <fieldset>
                <legend className="mb-3 text-xs font-bold text-[#C7C5CC]">Year</legend>
                <div className="grid gap-2">
                  {targetYears.map((year) => <OptionButton active={draft.targetYear === year} key={year} onClick={() => { setDraft((current) => ({ ...current, targetYear: year })); setSaved(false); }}>JEE {year}</OptionButton>)}
                </div>
              </fieldset>
              <fieldset>
                <legend className="mb-3 text-xs font-bold text-[#C7C5CC]">Academic stage</legend>
                <div className="grid gap-2">
                  {classLevels.map((level) => <OptionButton active={draft.classLevel === level} key={level} onClick={() => { setDraft((current) => ({ ...current, classLevel: level })); setSaved(false); }}>{level}</OptionButton>)}
                </div>
              </fieldset>
            </div>
          </section>

          <section className="border-b border-white/8 py-7" aria-labelledby="rhythm-heading">
            <div className="flex items-center gap-3">
              <Clock3 aria-hidden="true" className="text-[#3DE0D0]" size={19} />
              <h3 className="font-display text-lg font-semibold" id="rhythm-heading">Study rhythm</h3>
            </div>
            <div className="mt-5 grid gap-6 lg:grid-cols-2">
              <fieldset>
                <legend className="mb-3 text-xs font-bold text-[#C7C5CC]">Daily focused-study target</legend>
                <div className="grid grid-cols-2 gap-2">
                  {dailyGoals.map((minutes) => <OptionButton active={draft.dailyGoalMinutes === minutes} key={minutes} onClick={() => { setDraft((current) => ({ ...current, dailyGoalMinutes: minutes })); setSaved(false); }}>{minutes} minutes</OptionButton>)}
                </div>
              </fieldset>
              <fieldset>
                <legend className="mb-3 text-xs font-bold text-[#C7C5CC]">Best study window</legend>
                <div className="grid grid-cols-2 gap-2">
                  {studyWindows.map((window) => <OptionButton active={draft.studyWindow === window} key={window} onClick={() => { setDraft((current) => ({ ...current, studyWindow: window })); setSaved(false); }}>{window}</OptionButton>)}
                </div>
              </fieldset>
            </div>
          </section>

          <section className="py-7" aria-labelledby="focus-heading">
            <div className="flex items-center gap-3">
              <BookOpenCheck aria-hidden="true" className="text-[#FF8A3D]" size={19} />
              <h3 className="font-display text-lg font-semibold" id="focus-heading">Priority subjects</h3>
            </div>
            <p className="mt-2 text-sm text-[#C7C5CC]/80">Choose at least one. This reorders recommendations; it does not hide the other subjects.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {subjects.map((subject) => {
                const active = draft.focusSubjects.includes(subject.id);
                return (
                  <button
                    aria-pressed={active}
                    className={`relative min-h-24 border p-4 text-left transition ${active ? "border-[#FF5A1F] bg-[#FF5A1F]/10" : "border-white/10 bg-[#0E0D10] hover:border-white/25"}`}
                    key={subject.id}
                    onClick={() => toggleSubject(subject.id)}
                    type="button"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[.16em] text-[#FF8A3D]">{subject.code}</span>
                    <span className="mt-3 block font-display text-base font-semibold">{subject.label}</span>
                    {active ? <Check aria-hidden="true" className="absolute right-3 top-3 text-[#3DE08A]" size={16} /> : null}
                  </button>
                );
              })}
            </div>
          </section>

          <div className="flex flex-col gap-3 border-t border-white/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p aria-live="polite" className={`text-sm ${saved ? "text-[#3DE08A]" : "text-[#C7C5CC]/70"}`}>
              {saved ? "Profile preferences saved on this device." : hasChanges ? "You have unsaved changes." : "Your local profile is up to date."}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              {hasChanges ? <Button onClick={() => { setDraft(sourceProfile); setSaved(false); }} variant="ghost">Discard</Button> : null}
              <Button disabled={!hasChanges} onClick={saveProfile} variant="primary">
                <Save aria-hidden="true" className="size-4" /> Save profile
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
