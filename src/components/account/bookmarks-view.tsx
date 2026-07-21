"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  BookmarkX,
  BookOpen,
  Clock3,
  FlaskConical,
  Search,
} from "lucide-react";

import { resolveTopicState } from "@/components/learning/progress-utils";
import { useApp } from "@/components/providers/app-provider";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SectionHeader } from "@/components/ui/section-header";
import { curriculum } from "@/data/platform";
import type { Chapter, LearningStatus, Subject, SubjectId, Topic } from "@/types/platform";

interface TopicRecord {
  subject: Subject;
  chapter: Chapter;
  topic: Topic;
}

type SubjectFilter = "all" | SubjectId;

const topicRecords: TopicRecord[] = curriculum.flatMap((subject) =>
  subject.chapters.flatMap((chapter) =>
    chapter.topics.map((topic) => ({ subject, chapter, topic })),
  ),
);

const filters: Array<{ id: SubjectFilter; label: string }> = [
  { id: "all", label: "All subjects" },
  { id: "physics", label: "Physics" },
  { id: "chemistry", label: "Chemistry" },
  { id: "mathematics", label: "Mathematics" },
];

function topicRoute({ chapter, subject, topic }: TopicRecord) {
  return `/learn/${subject.id}/${chapter.slug}/${topic.slug}`;
}

function statusTone(status: LearningStatus): BadgeTone {
  if (status === "completed") return "success";
  if (status === "in-progress") return "warning";
  if (status === "locked") return "danger";
  return "neutral";
}

function statusLabel(status: LearningStatus) {
  if (status === "completed") return "Completed";
  if (status === "in-progress") return "In progress";
  if (status === "locked") return "Locked";
  return "Not started";
}

export function BookmarksView() {
  const { bookmarkedTopicIds, toggleBookmark, topicProgress } = useApp();
  const [filter, setFilter] = useState<SubjectFilter>("all");
  const [query, setQuery] = useState("");

  const saved = useMemo(
    () =>
      topicRecords.filter(({ topic }) =>
        bookmarkedTopicIds.includes(topic.id) || bookmarkedTopicIds.includes(topic.slug),
      ),
    [bookmarkedTopicIds],
  );
  const normalizedQuery = query.trim().toLowerCase();
  const visible = saved.filter(({ chapter, subject, topic }) => {
    const matchesSubject = filter === "all" || subject.id === filter;
    const matchesQuery = !normalizedQuery ||
      `${topic.title} ${chapter.title} ${subject.name} ${topic.tags.join(" ")}`
        .toLowerCase()
        .includes(normalizedQuery);
    return matchesSubject && matchesQuery;
  });

  function removeBookmark(topic: Topic) {
    if (bookmarkedTopicIds.includes(topic.id)) toggleBookmark(topic.id);
    if (bookmarkedTopicIds.includes(topic.slug)) toggleBookmark(topic.slug);
  }

  return (
    <div className="content-shell pb-28 pt-8 lg:pb-14 lg:pt-10">
      <SectionHeader
        action={<Badge tone="brand">{saved.length} saved</Badge>}
        description="Keep difficult concepts close without creating another backlog. Saved topics update immediately across the concept library on this device."
        kicker="Review shelf · synced locally"
        level={2}
        title="The ideas worth another pass."
      />

      <div className="mt-8 border border-[#FF5A1F]/22 bg-[#161418] p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(260px,1fr)_auto] lg:items-center">
          <label className="flex min-h-12 items-center gap-3 border border-white/10 bg-[#0E0D10] px-4 focus-within:border-[#FF5A1F]">
            <Search aria-hidden="true" className="shrink-0 text-[#FF8A3D]" size={17} />
            <span className="sr-only">Search bookmarks</span>
            <input
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#C7C5CC]/70"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search saved concepts…"
              type="search"
              value={query}
            />
          </label>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter bookmarks by subject">
            {filters.map((option) => (
              <button
                aria-pressed={filter === option.id}
                className={`min-h-11 border px-3 text-xs font-bold transition ${
                  filter === option.id
                    ? "border-[#FF5A1F] bg-[#FF5A1F]/10 text-white"
                    : "border-white/10 text-[#C7C5CC]/80 hover:border-white/25 hover:text-white"
                }`}
                key={option.id}
                onClick={() => setFilter(option.id)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {visible.length ? (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((record) => {
            const { chapter, subject, topic } = record;
            const state = resolveTopicState(topic, topicProgress);
            return (
              <Card className="group flex h-full flex-col overflow-hidden p-0" key={topic.id}>
                <div className="brand-grid border-b border-[#FF5A1F]/18 bg-[#0E0D10] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid size-11 place-items-center border border-[#FF5A1F]/28 font-mono text-xs font-semibold text-[#FF8A3D]">
                      {subject.code}
                    </span>
                    <button
                      aria-label={`Remove ${topic.title} from bookmarks`}
                      className="grid size-11 place-items-center border border-[#FF5A1F]/35 bg-[#FF5A1F]/10 text-[#FF8A3D] transition hover:border-[#E0483C]/55 hover:bg-[#E0483C]/10 hover:text-[#E0483C]"
                      onClick={() => removeBookmark(topic)}
                      type="button"
                    >
                      <Bookmark aria-hidden="true" size={16} />
                    </button>
                  </div>
                  <p className="mt-7 font-mono text-[11px] uppercase tracking-[.15em] text-[#C7C5CC]/70">
                    {subject.name} · {chapter.title}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-semibold text-white">{topic.title}</h3>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-sm leading-6 text-[#C7C5CC]">{topic.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge tone={statusTone(state.status)}>{statusLabel(state.status)}</Badge>
                    <Badge tone="neutral">{topic.difficulty}</Badge>
                  </div>
                  <div className="mt-5 flex items-center gap-4 text-xs text-[#C7C5CC]/70">
                    <span className="flex items-center gap-1.5"><Clock3 aria-hidden="true" size={13} /> {topic.estimatedMinutes} min</span>
                    {topic.simulationIds?.length ? <span className="flex items-center gap-1.5 text-[#3DE0D0]"><FlaskConical aria-hidden="true" size={13} /> Optional simulation</span> : null}
                  </div>
                  {state.progress > 0 ? <Progress className="mt-5" showValue value={state.progress} /> : null}
                  <Link className="mt-6 flex min-h-11 items-center justify-between border-t border-white/8 pt-4 text-sm font-bold text-[#FF8A3D] hover:text-[#FF5A1F]" href={topicRoute(record)}>
                    {state.progress > 0 ? "Continue concept" : "Open concept"}
                    <ArrowRight aria-hidden="true" size={16} />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 grid min-h-[25rem] place-items-center border border-[#FF5A1F]/22 bg-[#161418] px-6 text-center">
          <div>
            {saved.length ? (
              <Search aria-hidden="true" className="mx-auto text-[#FF8A3D]" size={34} strokeWidth={1.4} />
            ) : (
              <BookmarkX aria-hidden="true" className="mx-auto text-[#FF8A3D]" size={34} strokeWidth={1.4} />
            )}
            <h3 className="mt-5 font-display text-2xl font-semibold">
              {saved.length ? "No saved topic matches that filter." : "Your review shelf is empty."}
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#C7C5CC]/80">
              {saved.length
                ? "Try another subject or clear the search."
                : "Bookmark a concept when it deserves a deliberate second pass. It will appear here immediately."}
            </p>
            <Link className="button-primary mt-6" href="/learn">
              <BookOpen aria-hidden="true" size={17} /> Browse the concept library
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
