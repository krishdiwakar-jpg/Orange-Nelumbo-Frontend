"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  Check,
  ChevronRight,
  Circle,
  Clock3,
  FlaskConical,
  Layers3,
  LockKeyhole,
  Search,
  Sparkles,
} from "lucide-react";

import { useApp } from "@/components/providers/app-provider";
import {
  learningPath,
  resolveChapterProgress,
  resolveSubjectProgress,
  resolveTopicState,
  statusLabel,
} from "@/components/learning/progress-utils";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SectionHeader } from "@/components/ui/section-header";
import { allTopics, curriculum } from "@/data/platform";
import type { Chapter, LearningStatus, Subject, Topic } from "@/types/platform";

function statusTone(status: LearningStatus): BadgeTone {
  if (status === "completed") return "success";
  if (status === "in-progress") return "warning";
  if (status === "locked") return "danger";
  return "neutral";
}

function TopicStateIcon({ status }: { status: LearningStatus }) {
  if (status === "completed") {
    return <span className="grid size-7 place-items-center bg-[#3DE08A] text-[#0E0D10]"><Check size={15} strokeWidth={3} /></span>;
  }
  if (status === "in-progress") {
    return <span className="grid size-7 place-items-center border border-[#FF8A3D] text-[#FF8A3D]"><span className="size-2 bg-[#FF8A3D]" /></span>;
  }
  if (status === "locked") {
    return <span className="grid size-7 place-items-center border border-[#C7C5CC] text-[#C7C5CC]/70"><LockKeyhole size={13} /></span>;
  }
  return <span className="grid size-7 place-items-center border border-[#55505C] text-[#55505C]"><Circle size={13} /></span>;
}

function TopicRow({ chapter, subject, topic }: { chapter: Chapter; subject: Subject; topic: Topic }) {
  const { bookmarkedTopicIds, toggleBookmark, topicProgress } = useApp();
  const state = resolveTopicState(topic, topicProgress);
  const bookmarked = bookmarkedTopicIds.includes(topic.slug) || bookmarkedTopicIds.includes(topic.id);

  function toggleTopicBookmark() {
    if (!bookmarked) {
      toggleBookmark(topic.id);
      return;
    }
    if (bookmarkedTopicIds.includes(topic.id)) toggleBookmark(topic.id);
    if (bookmarkedTopicIds.includes(topic.slug)) toggleBookmark(topic.slug);
  }

  return (
    <div className="group grid gap-4 border-b border-white/8 px-4 py-4 last:border-b-0 sm:grid-cols-[32px_1fr_auto] sm:items-center sm:px-5">
      <TopicStateIcon status={state.status} />
      <Link className="min-w-0" href={learningPath(subject, chapter, topic)}>
        <span className="block font-semibold text-white transition group-hover:text-[#FF8A3D]">{topic.title}</span>
        <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#C7C5CC]/70">
          <span>{topic.estimatedMinutes} min</span>
          <span>{topic.difficulty}</span>
          {topic.simulationIds?.length ? <span className="flex items-center gap-1 text-[#3DE0D0]"><FlaskConical size={12} /> Live model</span> : null}
        </span>
      </Link>
      <div className="flex items-center gap-2 sm:justify-end">
        <Badge tone={statusTone(state.status)}>{state.progress > 0 && state.status !== "completed" ? `${state.progress}%` : statusLabel(state.status)}</Badge>
        <button
          aria-label={`${bookmarked ? "Remove" : "Add"} bookmark for ${topic.title}`}
          aria-pressed={bookmarked}
          className={`grid size-11 place-items-center border transition ${bookmarked ? "border-[#FF5A1F] bg-[#FF5A1F]/10 text-[#FF8A3D]" : "border-white/10 text-[#C7C5CC]/70 hover:border-[#FF5A1F]/40 hover:text-[#FF8A3D]"}`}
          onClick={toggleTopicBookmark}
          type="button"
        >
          <Bookmark size={16} />
        </button>
        <Link aria-label={`Open ${topic.title}`} className="grid size-11 place-items-center border border-white/10 text-[#C7C5CC]/70 transition hover:border-[#FF5A1F]/40 hover:text-[#FF8A3D]" href={learningPath(subject, chapter, topic)}>
          <ChevronRight size={17} />
        </Link>
      </div>
    </div>
  );
}

export function LearningOverview() {
  const { bookmarkedTopicIds, topicProgress } = useApp();
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const searchableTopics = useMemo(
    () =>
      curriculum.flatMap((subject) =>
        subject.chapters.flatMap((chapter) =>
          chapter.topics.map((topic) => ({ chapter, subject, topic })),
        ),
      ),
    [],
  );
  const results = normalized
    ? searchableTopics.filter(({ chapter, subject, topic }) =>
        `${topic.title} ${chapter.title} ${subject.name} ${topic.tags.join(" ")}`
          .toLowerCase()
          .includes(normalized),
      )
    : [];
  const bookmarked = searchableTopics.filter(({ topic }) =>
    bookmarkedTopicIds.includes(topic.slug) || bookmarkedTopicIds.includes(topic.id),
  );
  const inProgress = searchableTopics.find(
    ({ topic }) => resolveTopicState(topic, topicProgress).status === "in-progress",
  );

  return (
    <div className="pb-28 lg:pb-14">
      <section className="hero-grid border-b border-[#FF5A1F]/18 px-5 py-10 sm:px-7 lg:px-10 xl:px-12">
        <div className="mx-auto max-w-[1380px]">
          <SectionHeader
            description="Move from subject to chapter to concept. Each note follows the same evidence-first sequence: idea, notation, derivation, exam patterns and a model you can interrogate."
            kicker="Concept library · PCM"
            level={2}
            title="Learn the idea. See the mechanism."
          />
          <label className="mt-8 flex min-h-14 max-w-3xl items-center gap-3 border border-[#FF5A1F]/28 bg-[#0E0D10] px-4 focus-within:border-[#FF5A1F] focus-within:shadow-[0_0_24px_rgba(255,90,31,.10)]">
            <Search aria-hidden="true" className="shrink-0 text-[#FF8A3D]" size={19} />
            <span className="sr-only">Search concepts</span>
            <input
              className="min-h-12 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#C7C5CC]/70"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a concept, chapter, formula or tag…"
              type="search"
              value={query}
            />
            <span className="hidden font-mono text-[11px] uppercase tracking-[.14em] text-[#55505C] sm:block">{allTopics.length} topics</span>
          </label>

          {normalized ? (
            <div className="mt-4 max-w-3xl border border-white/10 bg-[#161418]">
              <p className="border-b border-white/8 px-5 py-3 font-mono text-[11px] uppercase tracking-[.16em] text-[#C7C5CC]/70">{results.length} matching concepts</p>
              {results.slice(0, 8).map(({ chapter, subject, topic }) => (
                <Link className="group flex items-center justify-between gap-4 border-b border-white/8 px-5 py-4 last:border-0 hover:bg-white/[.03]" href={learningPath(subject, chapter, topic)} key={topic.id}>
                  <span>
                    <span className="block font-semibold group-hover:text-[#FF8A3D]">{topic.title}</span>
                    <span className="mt-1 block text-xs text-[#C7C5CC]/70">{subject.name} · {chapter.title}</span>
                  </span>
                  <ArrowRight className="shrink-0 text-[#C7C5CC]/70 group-hover:text-[#FF8A3D]" size={16} />
                </Link>
              ))}
              {results.length === 0 ? <p className="px-5 py-8 text-sm text-[#C7C5CC]/80">No matching concept. Try a subject, chapter or formula keyword.</p> : null}
            </div>
          ) : null}
        </div>
      </section>

      <div className="mx-auto max-w-[1460px] space-y-12 px-5 py-9 sm:px-7 lg:px-10 xl:px-12">
        {inProgress ? (
          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="mono-kicker">Continue</p>
                <h3 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Your active concept</h3>
              </div>
              <Badge tone="warning">{resolveTopicState(inProgress.topic, topicProgress).progress}% read</Badge>
            </div>
            <Card className="p-0" variant="priority">
              <div className="grid gap-0 lg:grid-cols-[1fr_300px]">
                <div className="p-6 sm:p-8">
                  <p className="font-mono text-[11px] uppercase tracking-[.17em] text-[#FF8A3D]">{inProgress.subject.name} · {inProgress.chapter.title}</p>
                  <h4 className="mt-4 font-display text-3xl font-bold">{inProgress.topic.title}</h4>
                  <p className="mt-3 max-w-2xl leading-7 text-[#C7C5CC]">{inProgress.topic.description}</p>
                  <Progress className="mt-6 max-w-xl" showValue size="md" value={resolveTopicState(inProgress.topic, topicProgress).progress} />
                  <Link className="button-primary mt-7" href={learningPath(inProgress.subject, inProgress.chapter, inProgress.topic)}>
                    Resume concept <ArrowRight size={17} />
                  </Link>
                </div>
                <div className="brand-grid grid min-h-48 place-items-center border-t border-[#FF5A1F]/18 bg-[#0E0D10] p-7 lg:border-l lg:border-t-0">
                  <div className="text-center">
                    <BookOpen className="mx-auto text-[#FF8A3D]" size={36} strokeWidth={1.35} />
                    <p className="mt-4 font-mono text-[11px] uppercase tracking-[.17em] text-[#C7C5CC]/70">Return to the exact section</p>
                  </div>
                </div>
              </div>
            </Card>
          </section>
        ) : null}

        <section>
          <div className="mb-5">
            <p className="mono-kicker">Three disciplines</p>
            <h3 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Choose a workbench</h3>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {curriculum.map((subject, index) => {
              const progress = resolveSubjectProgress(subject, topicProgress);
              return (
                <Link href={learningPath(subject)} key={subject.id}>
                  <Card className="h-full overflow-hidden p-0" interactive>
                    <div className="brand-grid border-b border-[#FF5A1F]/18 bg-[#0E0D10] p-6">
                      <div className="flex items-center justify-between gap-4">
                        <span className="grid size-12 place-items-center border border-[#FF5A1F]/30 font-mono text-sm font-semibold text-[#FF8A3D]">{subject.code}</span>
                        <span className="font-mono text-[11px] uppercase tracking-[.14em] text-[#C7C5CC]/70">0{index + 1} / 03</span>
                      </div>
                      <h4 className="mt-9 font-display text-3xl font-bold">{subject.name}</h4>
                    </div>
                    <div className="p-6">
                      <p className="min-h-20 text-sm leading-6 text-[#C7C5CC]">{subject.description}</p>
                      <Progress className="mt-5" showValue tone={index === 1 ? "cyan" : index === 2 ? "success" : "brand"} value={progress.progress} />
                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/8 pt-4 text-xs text-[#C7C5CC]/70">
                        <span>{subject.chapters.length} chapters</span>
                        <span>{progress.completed}/{progress.total} topics</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {bookmarked.length ? (
          <section>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="mono-kicker">Saved signals</p>
                <h3 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Bookmarked concepts</h3>
              </div>
              <Badge tone="brand">{bookmarked.length} saved</Badge>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {bookmarked.map(({ chapter, subject, topic }) => (
                <Link href={learningPath(subject, chapter, topic)} key={topic.id}>
                  <Card className="h-full" interactive>
                    <div className="flex items-start justify-between gap-4">
                      <Bookmark className="text-[#FF8A3D]" size={18} />
                      <span className="font-mono text-[11px] uppercase tracking-[.12em] text-[#C7C5CC]/70">{subject.code}</span>
                    </div>
                    <h4 className="mt-6 font-display text-xl font-bold">{topic.title}</h4>
                    <p className="mt-2 text-sm text-[#C7C5CC]/70">{chapter.title} · {topic.estimatedMinutes} min</p>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

export function SubjectOverview({ subject }: { subject: Subject }) {
  const { topicProgress } = useApp();
  const progress = resolveSubjectProgress(subject, topicProgress);

  return (
    <div className="pb-28 lg:pb-14">
      <section className="hero-grid border-b border-[#FF5A1F]/18 px-5 py-9 sm:px-7 lg:px-10 xl:px-12">
        <div className="mx-auto max-w-[1380px]">
          <Link className="inline-flex items-center gap-2 text-sm font-bold text-[#C7C5CC]/80 hover:text-[#FF8A3D]" href="/learn"><ArrowLeft size={16} /> All subjects</Link>
          <div className="mt-8 grid items-end gap-8 lg:grid-cols-[1fr_320px]">
            <div>
              <p className="mono-kicker">{subject.code} · Subject workbench</p>
              <h2 className="mt-4 font-display text-5xl font-bold tracking-[-.02em] sm:text-[3.5rem]">{subject.name}</h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#C7C5CC]">{subject.description}</p>
            </div>
            <Card className="p-5" variant="subtle">
              <div className="flex items-end justify-between gap-4">
                <div><p className="font-mono text-[11px] uppercase tracking-[.16em] text-[#C7C5CC]/70">Subject progress</p><p className="mt-2 font-mono text-3xl font-semibold text-[#3DE0D0]">{progress.progress}%</p></div>
                <span className="text-right text-xs leading-5 text-[#C7C5CC]/70">{progress.completed} of {progress.total}<br />topics complete</span>
              </div>
              <Progress className="mt-5" size="md" tone="cyan" value={progress.progress} />
            </Card>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1460px] px-5 py-9 sm:px-7 lg:px-10 xl:px-12">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div><p className="mono-kicker">Chapter map</p><h3 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Build in order</h3></div>
          <span className="hidden font-mono text-[11px] uppercase tracking-[.13em] text-[#C7C5CC]/70 sm:block">{subject.chapters.length} mapped chapters</span>
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          {subject.chapters.map((chapter) => {
            const chapterProgress = resolveChapterProgress(chapter, topicProgress);
            return (
              <Card className="overflow-hidden p-0" key={chapter.id}>
                <div className="flex items-start justify-between gap-5 border-b border-white/8 bg-[#0E0D10] p-5 sm:p-6">
                  <div>
                    <div className="flex flex-wrap gap-2"><Badge tone="brand">Chapter {String(chapter.order).padStart(2, "0")}</Badge><Badge tone="neutral">{chapter.classLevel}</Badge><Badge tone="cyan">{chapter.examWeightage} weight</Badge></div>
                    <Link href={learningPath(subject, chapter)}><h4 className="mt-5 font-display text-2xl font-bold transition hover:text-[#FF8A3D]">{chapter.title}</h4></Link>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#C7C5CC]/80">{chapter.description}</p>
                  </div>
                  <Layers3 className="shrink-0 text-[#FF8A3D]" size={22} strokeWidth={1.4} />
                </div>
                <div className="p-5 sm:p-6">
                  <Progress label={`${chapterProgress.completed} of ${chapterProgress.total} topics complete`} showValue value={chapterProgress.progress} />
                  <div className="mt-5 grid gap-2">
                    {chapter.topics.slice(0, 4).map((topic) => {
                      const state = resolveTopicState(topic, topicProgress);
                      return (
                        <Link className="flex min-h-11 items-center gap-3 border border-white/8 px-3 text-sm transition hover:border-[#FF5A1F]/35 hover:bg-white/[.025]" href={learningPath(subject, chapter, topic)} key={topic.id}>
                          <TopicStateIcon status={state.status} />
                          <span className="min-w-0 flex-1 truncate">{topic.title}</span>
                          <ChevronRight className="shrink-0 text-[#C7C5CC]/70" size={15} />
                        </Link>
                      );
                    })}
                  </div>
                  <Link className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#FF8A3D] hover:text-[#FF5A1F]" href={learningPath(subject, chapter)}>Open chapter <ArrowRight size={15} /></Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ChapterOverview({ chapter, subject }: { chapter: Chapter; subject: Subject }) {
  const { topicProgress } = useApp();
  const progress = resolveChapterProgress(chapter, topicProgress);
  const nextTopic = chapter.topics.find((topic) => resolveTopicState(topic, topicProgress).status !== "completed") ?? chapter.topics[0];

  return (
    <div className="pb-28 lg:pb-14">
      <section className="hero-grid border-b border-[#FF5A1F]/18 px-5 py-9 sm:px-7 lg:px-10 xl:px-12">
        <div className="mx-auto max-w-[1380px]">
          <div className="flex flex-wrap items-center gap-2 text-sm text-[#C7C5CC]/70">
            <Link className="hover:text-[#FF8A3D]" href="/learn">Learn</Link><ChevronRight size={14} />
            <Link className="hover:text-[#FF8A3D]" href={learningPath(subject)}>{subject.name}</Link><ChevronRight size={14} />
            <span className="text-[#C7C5CC]">{chapter.title}</span>
          </div>
          <div className="mt-8 grid items-end gap-8 lg:grid-cols-[1fr_340px]">
            <div>
              <div className="flex flex-wrap gap-2"><Badge tone="brand">Chapter {String(chapter.order).padStart(2, "0")}</Badge><Badge tone="neutral">{chapter.classLevel}</Badge><Badge tone="cyan">{chapter.examWeightage} exam weight</Badge></div>
              <h2 className="mt-5 font-display text-4xl font-bold tracking-[-.02em] sm:text-[3.5rem]">{chapter.title}</h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#C7C5CC]">{chapter.description}</p>
            </div>
            <Card variant="subtle">
              <div className="flex items-center justify-between gap-4"><span className="font-mono text-[11px] uppercase tracking-[.15em] text-[#C7C5CC]/70">Chapter progress</span><span className="font-mono text-xl text-[#3DE0D0]">{progress.progress}%</span></div>
              <Progress className="mt-4" size="md" tone="cyan" value={progress.progress} />
              <p className="mt-3 text-xs text-[#C7C5CC]/70">{progress.completed} of {progress.total} topics complete</p>
            </Card>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1460px] gap-8 px-5 py-9 sm:px-7 lg:px-10 xl:grid-cols-[minmax(0,1fr)_320px] xl:px-12">
        <section>
          <div className="mb-5"><p className="mono-kicker">Concept sequence</p><h3 className="mt-2 font-display text-2xl font-bold sm:text-3xl">{chapter.topics.length} topics, one dependency chain</h3></div>
          <Card className="p-0">
            {chapter.topics.map((topic) => <TopicRow chapter={chapter} key={topic.id} subject={subject} topic={topic} />)}
          </Card>
        </section>

        <aside className="space-y-5">
          <Card variant="priority">
            <Badge tone="warning">Recommended next</Badge>
            <h3 className="mt-5 font-display text-2xl font-bold">{nextTopic.title}</h3>
            <p className="mt-3 text-sm leading-6 text-[#C7C5CC]">{nextTopic.description}</p>
            <div className="mt-5 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[.12em] text-[#C7C5CC]/70"><span className="flex items-center gap-1"><Clock3 size={13} /> {nextTopic.estimatedMinutes} min</span><span>{nextTopic.difficulty}</span></div>
            <Link className="button-primary mt-6 justify-center" href={learningPath(subject, chapter, nextTopic)}>Open topic <ArrowRight size={16} /></Link>
          </Card>
          <Card>
            <div className="flex items-center justify-between gap-4"><p className="mono-kicker">How to use it</p><Sparkles className="text-[#FF8A3D]" size={18} /></div>
            <ol className="mt-5 space-y-4 text-sm leading-6 text-[#C7C5CC]">
              <li className="flex gap-3"><span className="font-mono text-[#FF8A3D]">01</span><span>Read for the mechanism, not the formula list.</span></li>
              <li className="flex gap-3"><span className="font-mono text-[#FF8A3D]">02</span><span>Predict the diagram or lab before running it.</span></li>
              <li className="flex gap-3"><span className="font-mono text-[#FF8A3D]">03</span><span>Mark complete only after the checkpoint feels obvious.</span></li>
            </ol>
          </Card>
        </aside>
      </div>
    </div>
  );
}
