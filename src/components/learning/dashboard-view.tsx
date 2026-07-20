"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  Check,
  ChevronRight,
  Clock3,
  FlaskConical,
  Flame,
  Gauge,
  Target,
  TimerReset,
} from "lucide-react";

import { useApp } from "@/components/providers/app-provider";
import { resolveChapterProgress, resolveSubjectProgress, resolveTopicState } from "@/components/learning/progress-utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  allChapters,
  allTopics,
  analytics,
  curriculum,
  plannerItems,
  studentProfile,
} from "@/data/platform";

const missionDate = "2026-07-18";

function daysUntil(date: string) {
  const target = new Date(`${date}T00:00:00`).getTime();
  const now = Date.now();
  return Math.max(0, Math.ceil((target - now) / 86_400_000));
}

export function DashboardView() {
  const {
    completedPlannerItemIds,
    topicProgress,
    togglePlannerItem,
    user,
  } = useApp();
  const student = user ?? studentProfile;
  const continueTopic = allTopics.find((topic) => topic.slug === "motion-under-gravity")!;
  const continueState = resolveTopicState(continueTopic, topicProgress);
  const completedTopics = allTopics.filter(
    (topic) => resolveTopicState(topic, topicProgress).status === "completed",
  ).length;
  const completedChapters = allChapters.filter(
    (chapter) => resolveChapterProgress(chapter, topicProgress).completed === chapter.topics.length,
  ).length;
  const missions = plannerItems.filter((item) => item.date === missionDate).slice(0, 3);
  const nextTopics = curriculum
    .flatMap((subject) =>
      subject.chapters.flatMap((chapter) =>
        chapter.topics.map((topic) => ({ chapter, subject, topic })),
      ),
    )
    .filter(({ topic }) => resolveTopicState(topic, topicProgress).status !== "completed")
    .slice(0, 4);

  return (
    <div className="pb-28 lg:pb-14">
      <section className="hero-grid border-b border-[#FF5A1F]/18 px-5 py-8 sm:px-7 sm:py-10 lg:px-10 xl:px-12">
        <div className="mx-auto max-w-[1380px]">
          <div className="grid items-end gap-7 xl:grid-cols-[1fr_auto]">
            <div>
              <p className="mono-kicker">Mission cycle · 18 July 2026</p>
              <h2 className="mt-4 max-w-4xl font-display text-4xl font-bold tracking-[-.02em] sm:text-5xl xl:text-[3.5rem]">
                Good evening, {student.firstName}.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#C7C5CC] sm:text-lg">
                Finish the idea you started, then use a short recall set to prove it stayed. Today&apos;s plan is deliberately small.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 xl:justify-end">
              <Badge tone="brand">{student.targetExam} · {student.targetYear}</Badge>
              <Badge tone="cyan">{daysUntil(student.examDate)} days to target</Badge>
            </div>
          </div>

          <div className="mt-8 grid border-l border-t border-white/10 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { icon: BookOpen, label: "Topics complete", value: `${completedTopics} / ${allTopics.length}`, accent: "text-[#FF8A3D]" },
              { icon: Target, label: "Chapters complete", value: `${completedChapters} / ${allChapters.length}`, accent: "text-[#3DE0D0]" },
              { icon: Flame, label: "Reading streak", value: `${student.readingStreak} days`, accent: "text-[#FF8A3D]" },
              { icon: Gauge, label: "Current mock rank", value: analytics.summary.currentRank.toLocaleString("en-IN"), accent: "text-[#3DE0D0]" },
            ].map(({ accent, icon: Icon, label, value }) => (
              <div className="border-b border-r border-white/10 bg-[#161418]/82 p-5 sm:p-6" key={label}>
                <div className="flex items-center justify-between gap-4">
                  <p className="font-mono text-[11px] uppercase tracking-[.18em] text-[#C7C5CC]/70">{label}</p>
                  <Icon aria-hidden="true" className={accent} size={18} strokeWidth={1.6} />
                </div>
                <p className={`mt-5 font-mono text-2xl font-semibold ${accent}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1460px] gap-8 px-5 py-8 sm:px-7 lg:px-10 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,.75fr)] xl:px-12">
        <div className="min-w-0 space-y-10">
          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="mono-kicker">Resume signal</p>
                <h3 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Continue where you stopped</h3>
              </div>
              <Link className="hidden items-center gap-2 text-sm font-bold text-[#FF8A3D] hover:text-[#FF5A1F] sm:flex" href="/learn">
                Concept library <ArrowRight size={16} />
              </Link>
            </div>
            <Card className="overflow-hidden p-0" variant="priority">
              <div className="grid lg:grid-cols-[1fr_280px]">
                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="brand">Physics · Kinematics</Badge>
                    <Badge tone="warning">In progress</Badge>
                  </div>
                  <h4 className="mt-6 font-display text-3xl font-bold sm:text-4xl">Motion under gravity</h4>
                  <p className="mt-3 max-w-2xl leading-7 text-[#C7C5CC]">
                    Up and down are mirror images. Return to the derivation ladder, then test the apex rule in the live lab.
                  </p>
                  <div className="mt-7 max-w-xl">
                    <Progress aria-label="Motion under gravity reading progress" label="Lesson progress" showValue size="md" value={continueState.progress} />
                  </div>
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Link className="button-primary justify-center" href="/learn/physics/kinematics/motion-under-gravity">
                      Resume lesson <ArrowRight size={17} />
                    </Link>
                    <Link className="button-ghost justify-center" href="/simulations/vertical-throw">
                      <FlaskConical size={17} /> Open lab
                    </Link>
                  </div>
                </div>
                <div className="brand-grid relative min-h-64 border-t border-[#FF5A1F]/18 bg-[#0E0D10] p-6 lg:min-h-0 lg:border-l lg:border-t-0">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,90,31,.15),transparent_42%)]" />
                  <div className="relative flex h-full min-h-52 items-center justify-center">
                    <div className="relative h-44 w-28">
                      <div className="absolute bottom-2 left-1/2 h-36 border-l border-dashed border-[#C7C5CC]" />
                      <span className="absolute bottom-1 left-1/2 size-5 -translate-x-1/2 bg-[#F5D9A8]" />
                      <span className="absolute left-1/2 top-3 size-5 -translate-x-1/2 bg-[#F5D9A8] shadow-[0_0_28px_rgba(255,138,61,.35)]" />
                      <span className="absolute right-0 top-1/2 font-mono text-[11px] uppercase tracking-[.12em] text-[#3DE0D0]">v = 0</span>
                      <span className="absolute -left-3 top-8 h-16 border-l-2 border-[#FF5A1F] after:absolute after:-bottom-1 after:-left-[5px] after:size-2 after:rotate-45 after:border-b-2 after:border-r-2 after:border-[#FF5A1F]" />
                    </div>
                  </div>
                  <p className="relative text-center font-mono text-[11px] uppercase tracking-[.16em] text-[#C7C5CC]/70">a = −g throughout</p>
                </div>
              </div>
            </Card>
          </section>

          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="mono-kicker">Subject telemetry</p>
                <h3 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Your three workbenches</h3>
              </div>
              <span className="hidden font-mono text-[11px] uppercase tracking-[.14em] text-[#C7C5CC]/70 sm:block">Binary completion · no vanity score</span>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {curriculum.map((subject, index) => {
                const progress = resolveSubjectProgress(subject, topicProgress);
                const subjectAccent = index === 1 ? "cyan" : index === 2 ? "success" : "brand";
                return (
                  <Link href={`/learn/${subject.id}`} key={subject.id}>
                    <Card className="h-full p-5 sm:p-6" interactive>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-mono text-[11px] uppercase tracking-[.18em] text-[#FF8A3D]">{subject.code}</p>
                          <h4 className="mt-3 font-display text-2xl font-bold">{subject.name}</h4>
                        </div>
                        <ChevronRight className="text-[#C7C5CC]/70" size={19} />
                      </div>
                      <p className="mt-4 min-h-20 text-sm leading-6 text-[#C7C5CC]/80">{subject.shortDescription}</p>
                      <Progress className="mt-5" showValue tone={subjectAccent} value={progress.progress} />
                      <p className="mt-3 font-mono text-[11px] uppercase tracking-[.13em] text-[#C7C5CC]/70">{progress.completed} / {progress.total} topics complete</p>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>

          <section>
            <div className="mb-4">
              <p className="mono-kicker">Queue</p>
              <h3 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Up next</h3>
            </div>
            <div className="border-l border-t border-white/10">
              {nextTopics.map(({ chapter, subject, topic }, index) => {
                const state = resolveTopicState(topic, topicProgress);
                return (
                  <Link
                    className="group grid gap-4 border-b border-r border-white/10 bg-[#161418] p-5 transition hover:border-[#FF5A1F]/38 hover:bg-[#1E1B20] sm:grid-cols-[44px_1fr_auto] sm:items-center"
                    href={`/learn/${subject.id}/${chapter.slug}/${topic.slug}`}
                    key={topic.id}
                  >
                    <span className="grid size-10 place-items-center border border-[#FF5A1F]/24 font-mono text-xs text-[#FF8A3D]">{String(index + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="block font-semibold text-white">{topic.title}</span>
                      <span className="mt-1 block text-xs text-[#C7C5CC]/70">{subject.name} · {chapter.title} · {topic.estimatedMinutes} min</span>
                    </span>
                    <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.12em] text-[#C7C5CC]/80 group-hover:text-[#FF8A3D]">
                      {state.progress > 0 ? `${state.progress}% read` : "Start"} <ArrowRight size={14} />
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="min-w-0 space-y-6">
          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="mono-kicker">Today</p>
                <h3 className="mt-2 font-display text-2xl font-bold">Mission list</h3>
              </div>
              <CalendarCheck className="text-[#FF8A3D]" size={20} />
            </div>
            <Card className="p-0">
              {missions.map((item, index) => {
                const complete = completedPlannerItemIds.includes(item.id) || item.status === "completed";
                return (
                  <div className={`flex gap-4 p-5 ${index ? "border-t border-white/8" : ""}`} key={item.id}>
                    <button
                      aria-label={`${complete ? "Mark incomplete" : "Mark complete"}: ${item.title}`}
                      className={`grid size-11 shrink-0 place-items-center border ${complete ? "border-[#3DE08A] bg-[#3DE08A] text-[#0E0D10]" : "border-[#C7C5CC] text-transparent hover:border-[#FF8A3D]"}`}
                      onClick={() => togglePlannerItem(item.id)}
                      type="button"
                    >
                      <Check size={14} strokeWidth={3} />
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-semibold ${complete ? "text-[#C7C5CC]/70 line-through" : "text-white"}`}>{item.title}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#C7C5CC]/70">
                        <span className="flex items-center gap-1"><Clock3 size={12} /> {item.durationMinutes} min</span>
                        {item.startTime ? <span>{item.startTime}</span> : null}
                      </div>
                    </div>
                  </div>
                );
              })}
              <Link className="flex min-h-12 items-center justify-center gap-2 border-t border-white/8 text-sm font-bold text-[#FF8A3D] hover:bg-white/[.03]" href="/planner">
                Open full planner <ArrowRight size={15} />
              </Link>
            </Card>
          </section>

          <Card variant="subtle">
            <div className="flex items-center justify-between gap-4">
              <Badge tone="warning">Focus signal</Badge>
              <TimerReset className="text-[#F6C344]" size={19} />
            </div>
            <h3 className="mt-5 font-display text-xl font-bold">{analytics.focusTopics[0].topic}</h3>
            <p className="mt-2 font-mono text-3xl font-semibold text-[#F6C344]">{analytics.focusTopics[0].accuracy}%</p>
            <p className="mt-4 text-sm leading-6 text-[#C7C5CC]">{analytics.focusTopics[0].recommendation}</p>
            <Link className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#FF8A3D] hover:text-[#FF5A1F]" href="/learn/physics/kinematics/relative-motion">
              Review weak link <ArrowRight size={15} />
            </Link>
          </Card>

          <Card>
            <div className="flex items-center justify-between gap-4">
              <p className="mono-kicker">Weekly evidence</p>
              <span className="size-2 bg-[#3DE08A] shadow-[0_0_12px_#3DE08A]" />
            </div>
            <div className="mt-6 grid grid-cols-7 items-end gap-2" style={{ height: 112 }}>
              {analytics.weeklyQuestions.map((point) => (
                <div className="flex h-full flex-col justify-end gap-2" key={point.label}>
                  <div className="w-full bg-[#FF5A1F]" style={{ height: `${Math.max(12, point.value)}%` }} />
                  <span className="text-center font-mono text-[11px] text-[#C7C5CC]/70">{point.label.slice(0, 1)}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-4">
              <span className="text-xs text-[#C7C5CC]/70">Questions attempted</span>
              <span className="font-mono text-sm text-[#3DE0D0]">{analytics.summary.questionsAttempted}</span>
            </div>
          </Card>

          <div className="grid grid-cols-2 border-l border-t border-white/10">
            <Link className="border-b border-r border-white/10 bg-[#161418] p-5 transition hover:bg-[#1E1B20]" href="/practice">
              <Target className="text-[#FF8A3D]" size={20} />
              <span className="mt-4 block text-sm font-bold">Practice</span>
              <span className="mt-1 block text-xs text-[#C7C5CC]/70">Prove recall</span>
            </Link>
            <Link className="border-b border-r border-white/10 bg-[#161418] p-5 transition hover:bg-[#1E1B20]" href="/simulations">
              <FlaskConical className="text-[#3DE0D0]" size={20} />
              <span className="mt-4 block text-sm font-bold">The lab</span>
              <span className="mt-1 block text-xs text-[#C7C5CC]/70">See it move</span>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
