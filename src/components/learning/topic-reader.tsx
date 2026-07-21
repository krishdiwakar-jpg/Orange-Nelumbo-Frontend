"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpenCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  FlaskConical,
  Lightbulb,
  Printer,
  ShieldAlert,
  Sparkles,
  Target,
} from "lucide-react";

import { useApp } from "@/components/providers/app-provider";
import {
  learningPath,
  resolveTopicState,
  statusLabel,
} from "@/components/learning/progress-utils";
import { VerticalThrowLab } from "@/components/learning/vertical-throw-lab";
import { SecuredNoteReader, type SecuredNoteConfig } from "@/components/learning/secured-note-reader";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { simulationForId, simulationPath } from "@/lib/simulation-routing";
import type {
  Chapter,
  Lesson,
  LessonCallout,
  LessonSection,
  Subject,
  Topic,
} from "@/types/platform";

function calloutStyle(tone: LessonCallout["tone"]) {
  if (tone === "warning") return { border: "border-[#E0483C]", icon: ShieldAlert, text: "text-[#E0483C]" };
  if (tone === "success") return { border: "border-[#3DE08A]", icon: CheckCircle2, text: "text-[#3DE08A]" };
  if (tone === "tip") return { border: "border-[#F6C344]", icon: Lightbulb, text: "text-[#F6C344]" };
  return { border: "border-[#3DE0D0]", icon: Sparkles, text: "text-[#3DE0D0]" };
}

function GravityPhaseDiagram() {
  return (
    <figure className="mt-7 overflow-hidden border border-[#FF5A1F]/24 bg-[#0E0D10] p-3 sm:p-5">
      <svg aria-labelledby="gravity-phase-title" className="h-auto w-full" role="img" viewBox="0 0 760 300">
        <title id="gravity-phase-title">A ball rising, at the apex and falling while gravity remains downward</title>
        <defs>
          <marker id="phase-cyan" markerHeight="7" markerWidth="7" orient="auto" refX="6" refY="3.5" viewBox="0 0 7 7"><path d="M0 0L7 3.5L0 7Z" fill="#3DE0D0" /></marker>
          <marker id="phase-orange" markerHeight="7" markerWidth="7" orient="auto" refX="6" refY="3.5" viewBox="0 0 7 7"><path d="M0 0L7 3.5L0 7Z" fill="#FF5A1F" /></marker>
        </defs>
        <line stroke="#2A262E" strokeWidth="2" x1="40" x2="720" y1="250" y2="250" />
        <path d="M150 230C150 120 150 70 150 55M610 55C610 70 610 120 610 230" fill="none" stroke="#C7C5CC" strokeDasharray="5 7" strokeOpacity=".45" />
        {[
          { x: 150, y: 150, label: "GOING UP", velocityY: 78, velocityLabel: "+v" },
          { x: 380, y: 55, label: "AT THE APEX", velocityY: 55, velocityLabel: "v = 0" },
          { x: 610, y: 150, label: "COMING DOWN", velocityY: 224, velocityLabel: "−v" },
        ].map((phase) => (
          <g key={phase.label}>
            <circle cx={phase.x} cy={phase.y} fill="#F5D9A8" r="14" />
            {phase.label !== "AT THE APEX" ? <line markerEnd="url(#phase-cyan)" stroke="#3DE0D0" strokeWidth="3" x1={phase.x} x2={phase.x} y1={phase.y + (phase.label === "GOING UP" ? -20 : 20)} y2={phase.velocityY} /> : null}
            <line markerEnd="url(#phase-orange)" stroke="#FF5A1F" strokeWidth="3" x1={phase.x - 38} x2={phase.x - 38} y1={phase.y - 10} y2={phase.y + 48} />
            <text fill="#FF8A3D" fontFamily="JetBrains Mono" fontSize="11" x={phase.x - 66} y={phase.y + 32}>g</text>
            <text fill="#3DE0D0" fontFamily="JetBrains Mono" fontSize="11" textAnchor="middle" x={phase.x} y={phase.label === "COMING DOWN" ? 242 : phase.velocityY - 9}>{phase.velocityLabel}</text>
            <text fill="#C7C5CC" fontFamily="JetBrains Mono" fontSize="10" textAnchor="middle" x={phase.x} y="284">{phase.label}</text>
          </g>
        ))}
        <text fill="#E0483C" fontFamily="JetBrains Mono" fontSize="11" x="405" y="59">g is not zero here</text>
      </svg>
      <figcaption className="border-t border-white/8 px-2 pt-3 font-mono text-[11px] uppercase leading-5 tracking-[.11em] text-[#C7C5CC]/70">
        Fig 01 — velocity changes continuously; the downward acceleration does not.
      </figcaption>
    </figure>
  );
}

function VelocityTimeDiagram() {
  return (
    <figure className="mt-7 overflow-hidden border border-[#FF5A1F]/24 bg-[#0E0D10] p-3 sm:p-5">
      <svg aria-labelledby="velocity-time-title" className="h-auto w-full" role="img" viewBox="0 0 760 280">
        <title id="velocity-time-title">Velocity-time graph of a vertical throw</title>
        <line stroke="#C7C5CC" x1="80" x2="700" y1="140" y2="140" />
        <line stroke="#C7C5CC" x1="80" x2="80" y1="245" y2="28" />
        <line stroke="#3DE0D0" strokeWidth="4" x1="80" x2="625" y1="52" y2="220" />
        <circle cx="80" cy="52" fill="#FFB020" r="5" />
        <circle cx="352" cy="136" fill="#FFB020" r="5" />
        <circle cx="625" cy="220" fill="#FFB020" r="5" />
        <text fill="#C7C5CC" fontFamily="JetBrains Mono" fontSize="11" x="55" y="25">v</text>
        <text fill="#C7C5CC" fontFamily="JetBrains Mono" fontSize="11" x="708" y="155">t</text>
        <text fill="#FFB020" fontFamily="JetBrains Mono" fontSize="11" x="96" y="48">+u at t = 0</text>
        <text fill="#FFB020" fontFamily="JetBrains Mono" fontSize="11" textAnchor="middle" x="352" y="118">APEX</text>
        <text fill="#C7C5CC" fontFamily="JetBrains Mono" fontSize="10" textAnchor="middle" x="352" y="164">t = u/g · v = 0</text>
        <text fill="#FFB020" fontFamily="JetBrains Mono" fontSize="11" textAnchor="end" x="620" y="246">−u at t = 2u/g</text>
        <text fill="#FF5A1F" fontFamily="JetBrains Mono" fontSize="11" x="500" y="186">slope = −g everywhere</text>
      </svg>
      <figcaption className="border-t border-white/8 px-2 pt-3 font-mono text-[11px] uppercase leading-5 tracking-[.11em] text-[#C7C5CC]/70">
        Fig 02 — equation A drawn: one straight line through zero, never a curve and never a bounce.
      </figcaption>
    </figure>
  );
}

function LessonCallouts({ callouts }: { callouts: LessonCallout[] }) {
  return (
    <div className="mt-7 space-y-4">
      {callouts.map((callout) => {
        const style = calloutStyle(callout.tone);
        const Icon = style.icon;
        return (
          <aside className={`border-l-2 ${style.border} bg-[#161418] px-5 py-4 sm:px-6`} key={callout.title}>
            <div className="flex items-center gap-3">
              <Icon className={style.text} size={18} />
              <p className={`font-mono text-[11px] uppercase tracking-[.16em] ${style.text}`}>{callout.title}</p>
            </div>
            <p className="mt-3 text-sm leading-7 text-[#C7C5CC]">{callout.body}</p>
          </aside>
        );
      })}
    </div>
  );
}

function LessonSectionBlock({ section }: { section: LessonSection }) {
  return (
    <section className="scroll-mt-28 border-t border-[#FF5A1F]/18 py-10 sm:py-14" id={section.id}>
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-sm font-semibold text-[#FF8A3D]">{String(section.number).padStart(2, "0")}</span>
        <h2 className="font-display text-3xl font-bold tracking-[-.02em] sm:text-4xl">{section.title}</h2>
      </div>
      <p className="mt-3 max-w-2xl text-base leading-7 text-[#C7C5CC]/80">{section.subtitle}</p>

      {section.paragraphs?.length ? (
        <div className="mt-7 space-y-5 text-[1.02rem] leading-8 text-[#DAD8DE]">
          {section.paragraphs.map((paragraph) => <p className="max-w-[72ch]" key={paragraph}>{paragraph}</p>)}
        </div>
      ) : null}

      {section.id === "gravity-basic-theory" ? <GravityPhaseDiagram /> : null}

      {section.keyPoints?.length ? (
        <div className="mt-7 grid gap-px border border-white/8 bg-white/8 sm:grid-cols-3">
          {section.keyPoints.map((point, index) => (
            <div className="bg-[#161418] p-5" key={point}>
              <span className="font-mono text-[11px] uppercase tracking-[.15em] text-[#FF8A3D]">Signal {String(index + 1).padStart(2, "0")}</span>
              <p className="mt-3 text-sm leading-6 text-[#C7C5CC]">{point}</p>
            </div>
          ))}
        </div>
      ) : null}

      {section.definitions?.length ? (
        <div className="mt-7 grid border-l border-t border-white/10 sm:grid-cols-2 xl:grid-cols-3">
          {section.definitions.map((definition) => (
            <div className="border-b border-r border-white/10 bg-[#161418] p-5" key={`${definition.symbol}-${definition.term}`}>
              <span className="font-display text-3xl font-bold italic text-[#FFB020]">{definition.symbol}</span>
              <h3 className="mt-4 text-lg font-bold">{definition.term}</h3>
              <p className="mt-2 text-sm leading-6 text-[#C7C5CC]/80">{definition.meaning}</p>
            </div>
          ))}
        </div>
      ) : null}

      {section.formulas?.length ? (
        <div className="mt-7 border border-[#FF5A1F]/24 bg-[#161418] px-5 sm:px-7">
          {section.formulas.map((formula) => (
            <div className="grid gap-4 border-b border-white/8 py-6 last:border-0 sm:grid-cols-[84px_1fr]" key={formula.step}>
              <div className="font-mono text-[11px] uppercase tracking-[.14em] text-[#C7C5CC]/70">Step {String(formula.step).padStart(2, "0")}</div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-display text-xl font-semibold italic text-white sm:text-2xl">{formula.expression}</p>
                  {formula.label ? <Badge tone={formula.formulaSheet ? "warning" : "neutral"}>{formula.label}{formula.formulaSheet ? " · formula sheet" : ""}</Badge> : null}
                </div>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#C7C5CC]">{formula.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {section.id === "gravity-derivation" ? <VelocityTimeDiagram /> : null}

      {section.specialCases?.length ? (
        <div className="mt-7 border border-[#FF5A1F]/24 bg-[#161418] px-5 sm:px-7">
          {section.specialCases.map((item) => (
            <article className="grid gap-4 border-b border-white/8 py-6 last:border-0 sm:grid-cols-[92px_1fr]" key={item.conceptId}>
              <Badge className="self-start" tone="brand">{item.conceptId}</Badge>
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="font-display text-xl font-bold text-[#FFB020]">{item.title}</h3>
                  {item.expression ? <code className="font-mono text-sm text-[#3DE0D0]">{item.expression}</code> : null}
                </div>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#C7C5CC]">{item.summary}</p>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[.14em] text-[#FF8A3D]">Trigger · {item.trigger}</p>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {section.examples?.length ? (
        <div className="mt-7 space-y-5">
          {section.examples.map((example, index) => (
            <article className="border border-[#FF5A1F]/24 bg-[#161418]" key={example.title}>
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 bg-[#0E0D10] px-5 py-4 sm:px-6">
                <div className="flex flex-wrap gap-2">{example.conceptIds.map((id) => <Badge key={id} tone="brand">{id}</Badge>)}</div>
                <span className="font-mono text-[11px] uppercase tracking-[.13em] text-[#C7C5CC]/70">{example.pyqReference}</span>
              </header>
              <div className="p-5 sm:p-7">
                <div className="flex items-start gap-4"><span className="font-mono text-sm text-[#FF8A3D]">{String(index + 1).padStart(2, "0")}</span><h3 className="font-display text-2xl font-bold">{example.title}</h3></div>
                <p className="sr-only">{example.figureAlt}</p>
                <div className="mt-6 grid gap-px border border-white/8 bg-white/8 md:grid-cols-2">
                  {[
                    ["The setup", example.setup, "text-[#C7C5CC]"],
                    ["How to attack", example.approach, "text-[#3DE0D0]"],
                    ["The trap", example.trap, "text-[#E0483C]"],
                    ["The line that finishes it", example.finishingLine, "text-[#3DE08A]"],
                  ].map(([label, body, colour]) => (
                    <div className="bg-[#0E0D10] p-5" key={label}>
                      <p className={`font-mono text-[11px] uppercase tracking-[.14em] ${colour}`}>{label}</p>
                      <p className="mt-3 text-sm leading-6 text-[#C7C5CC]">{body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {section.lab ? <div className="mt-8"><VerticalThrowLab lab={section.lab} /></div> : null}
      {section.callouts?.length ? <LessonCallouts callouts={section.callouts} /> : null}
    </section>
  );
}

function GenericTopicBody({ chapter, subject, topic }: { chapter: Chapter; subject: Subject; topic: Topic }) {
  return (
    <div>
      <section className="border-t border-[#FF5A1F]/18 py-10 sm:py-14" id="concept-briefing">
        <div className="flex items-baseline gap-4"><span className="font-mono text-sm text-[#FF8A3D]">01</span><h2 className="font-display text-3xl font-bold sm:text-4xl">Concept briefing</h2></div>
        <p className="mt-3 text-[#C7C5CC]/80">The chapter map for this concept is ready for focused preview.</p>
        <Card className="mt-7" variant="priority">
          <Badge tone="brand">{subject.name} · {chapter.title}</Badge>
          <h3 className="mt-5 font-display text-2xl font-bold">What this topic unlocks</h3>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[#C7C5CC]">{topic.description} Work through the vocabulary and dependencies below, then mark this preview complete when you can explain each connection without looking.</p>
          <div className="mt-7 grid gap-px border border-white/8 bg-white/8 sm:grid-cols-2 lg:grid-cols-3">
            {topic.tags.map((tag, index) => (
              <div className="bg-[#0E0D10] p-5" key={tag}><span className="font-mono text-[11px] text-[#FF8A3D]">0{index + 1}</span><p className="mt-3 font-semibold capitalize">{tag}</p></div>
            ))}
          </div>
        </Card>
      </section>
      <section className="border-t border-[#FF5A1F]/18 py-10 sm:py-14" id="study-sequence">
        <div className="flex items-baseline gap-4"><span className="font-mono text-sm text-[#FF8A3D]">02</span><h2 className="font-display text-3xl font-bold sm:text-4xl">Study sequence</h2></div>
        <div className="mt-7 grid border-l border-t border-white/10 sm:grid-cols-2">
          {[
            ["Map", "Write the governing objects, variables and constraints."],
            ["Derive", "Build the central relation from definitions before using a result."],
            ["Visualise", "Sketch the limiting cases and make one prediction."],
            ["Retrieve", "Close the note and explain the mechanism in five lines."],
          ].map(([title, body], index) => (
            <div className="border-b border-r border-white/10 bg-[#161418] p-6" key={title}><p className="font-mono text-[11px] uppercase tracking-[.15em] text-[#FF8A3D]">Step 0{index + 1}</p><h3 className="mt-4 text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-[#C7C5CC]/80">{body}</p></div>
          ))}
        </div>
      </section>
      <section className="border-y border-[#FF5A1F]/18 py-10 sm:py-14" id="full-note">
        <div className="flex items-start gap-4"><FileText className="mt-1 shrink-0 text-[#FF8A3D]" size={22} /><div><h2 className="font-display text-2xl font-bold">Full typeset note is in production</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-[#C7C5CC]">This route already supports progress, bookmarks and chapter navigation. The complete derivation, PYQ ladder and lab will replace this preview without changing your saved state.</p></div></div>
      </section>
    </div>
  );
}

export function TopicReader({
  chapter,
  lesson,
  securedNote,
  subject,
  topic,
}: {
  chapter: Chapter;
  lesson?: Lesson;
  securedNote?: SecuredNoteConfig;
  subject: Subject;
  topic: Topic;
}) {
  const { bookmarkedTopicIds, setTopicProgress, toggleBookmark, topicProgress } = useApp();
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
  const learningSequence = subject.chapters.flatMap((itemChapter) =>
    itemChapter.topics.flatMap((itemTopic) => {
      const topicStep = {
        kind: "topic" as const,
        chapter: itemChapter,
        href: learningPath(subject, itemChapter, itemTopic),
        label: itemTopic.title,
        topic: itemTopic,
      };
      const simulationSteps = (itemTopic.simulationIds ?? []).flatMap((simulationId) => {
        const simulation = simulationForId(simulationId);
        return simulation
          ? [{
              kind: "simulation" as const,
              chapter: itemChapter,
              href: simulationPath(simulation.id),
              label: simulation.shortTitle,
              topic: itemTopic,
            }]
          : [];
      });
      return [topicStep, ...simulationSteps];
    }),
  );
  const currentIndex = learningSequence.findIndex((item) => item.kind === "topic" && item.topic.id === topic.id);
  const previous = currentIndex > 0 ? learningSequence[currentIndex - 1] : undefined;
  const next = currentIndex >= 0 && currentIndex < learningSequence.length - 1 ? learningSequence[currentIndex + 1] : undefined;
  const toc = securedNote
    ? securedNote.headings.map((heading, index) => ({ id: `secured-note-section-${index + 1}`, label: heading, number: index + 1 }))
    : lesson
      ? lesson.sections.map((section) => ({ id: section.id, label: section.title, number: section.number }))
      : [
          { id: "concept-briefing", label: "Concept briefing", number: 1 },
          { id: "study-sequence", label: "Study sequence", number: 2 },
          { id: "full-note", label: "Full note", number: 3 },
        ];
  const badgeTone: BadgeTone = state.status === "completed" ? "success" : state.status === "in-progress" ? "warning" : "neutral";

  function toggleComplete() {
    if (state.status === "completed") {
      setTopicProgress(topic.slug, { progress: 90, status: "in-progress" });
    } else {
      setTopicProgress(topic.slug, { progress: 100, status: "completed" });
    }
  }

  return (
    <div className="pb-28 lg:pb-14">
      <header className="hero-grid border-b border-[#FF5A1F]/18 px-5 py-8 sm:px-7 lg:px-10 xl:px-12">
        <div className="mx-auto max-w-[1380px]">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#C7C5CC]/70 sm:text-sm">
            <Link className="hover:text-[#FF8A3D]" href="/learn">Learn</Link><ChevronRight size={14} />
            <Link className="hover:text-[#FF8A3D]" href={learningPath(subject)}>{subject.name}</Link><ChevronRight size={14} />
            <Link className="hover:text-[#FF8A3D]" href={learningPath(subject, chapter)}>{chapter.title}</Link><ChevronRight size={14} />
            <span className="text-[#C7C5CC]">{topic.title}</span>
          </div>
          <div className="mt-8 grid items-end gap-8 xl:grid-cols-[1fr_auto]">
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge tone="brand">{lesson?.unitCode ?? `${subject.code} · ${chapter.title}`}</Badge>
                <Badge tone={badgeTone}>{state.progress > 0 && state.status !== "completed" ? `${state.progress}% read` : statusLabel(state.status)}</Badge>
                {lesson ? <Badge tone="cyan">{lesson.conceptRange}</Badge> : securedNote ? <Badge tone="success">Full visual note</Badge> : <Badge tone="neutral">Preview note</Badge>}
              </div>
              <h1 className="mt-6 max-w-5xl font-display text-3xl font-bold tracking-[-.02em] sm:text-4xl lg:text-[2.75rem]">{lesson?.title ?? topic.title}</h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[#C7C5CC] sm:text-lg">{lesson?.summary ?? topic.description}</p>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[.12em] text-[#C7C5CC]/70">
                <span className="flex items-center gap-2"><Clock3 size={14} /> {lesson?.estimatedMinutes ?? topic.estimatedMinutes} min</span>
                <span>{lesson?.readingLevel ?? topic.difficulty}</span>
                {topic.simulationIds?.length ? <span className="flex items-center gap-2 text-[#3DE0D0]"><FlaskConical size={14} /> Interactive lab</span> : null}
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row xl:justify-end">
              <Button aria-pressed={bookmarked} onClick={toggleTopicBookmark} variant="ghost"><Bookmark size={17} /> {bookmarked ? "Bookmarked" : "Bookmark"}</Button>
              {!securedNote ? <Button onClick={() => window.print()} variant="ghost"><Printer size={17} /> Print / PDF</Button> : null}
              <Button onClick={toggleComplete} variant={state.status === "completed" ? "secondary" : "primary"}>{state.status === "completed" ? <><Check size={17} /> Completed</> : <><BookOpenCheck size={17} /> Mark complete</>}</Button>
            </div>
          </div>
          <Progress className="mt-8 max-w-2xl" showValue size="md" value={state.progress} />
        </div>
      </header>

      <div className="mx-auto grid max-w-[1320px] gap-8 px-5 sm:px-7 lg:px-10 xl:grid-cols-[220px_minmax(0,860px)] xl:justify-center xl:px-12">
        <aside className="order-first border-b border-white/8 py-6 xl:sticky xl:top-[74px] xl:h-[calc(100vh-74px)] xl:overflow-y-auto xl:border-b-0 xl:border-r xl:py-9 xl:pr-6">
          <p className="font-mono text-[11px] uppercase tracking-[.17em] text-[#C7C5CC]/70">On this page</p>
          <nav aria-label="Lesson sections" className="mt-4 flex gap-2 overflow-x-auto pb-2 xl:grid xl:overflow-visible">
            {toc.map((item) => (
              <a className="flex min-h-11 shrink-0 items-center gap-3 border-l-2 border-transparent px-3 text-sm text-[#C7C5CC]/80 transition hover:border-[#FF5A1F] hover:bg-white/[.03] hover:text-white" href={`#${item.id}`} key={item.id}>
                <span className="font-mono text-[11px] text-[#FF8A3D]">{String(item.number).padStart(2, "0")}</span>{item.label}
              </a>
            ))}
          </nav>
          <div className="mt-7 hidden border border-[#FF5A1F]/20 bg-[#161418] p-4 xl:block">
            <p className="font-mono text-[11px] uppercase tracking-[.14em] text-[#FF8A3D]">Chapter · topics</p>
            <p className="mt-2 font-display text-lg font-bold">{chapter.title}</p>
            <div className="mt-4 grid gap-1">
              {chapter.topics.map((item) => {
                const itemState = resolveTopicState(item, topicProgress);
                const active = item.id === topic.id;
                return (
                  <div key={item.id}>
                    <Link className={`flex items-center gap-3 border-l-2 px-3 py-2.5 text-xs ${active ? "border-[#FF5A1F] bg-[#FF5A1F]/8 text-white" : "border-transparent text-[#C7C5CC]/70 hover:text-white"}`} href={learningPath(subject, chapter, item)}>
                      <span className={`grid size-4 shrink-0 place-items-center border ${itemState.status === "completed" ? "border-[#3DE08A] bg-[#3DE08A] text-[#0E0D10]" : active ? "border-[#FF8A3D]" : "border-[#55505C]"}`}>{itemState.status === "completed" ? <Check size={10} strokeWidth={3} /> : null}</span>
                      <span>{item.title}</span>
                    </Link>
                    {(item.simulationIds ?? []).map((simulationId) => {
                      const simulation = simulationForId(simulationId);
                      if (!simulation) return null;
                      return (
                        <Link className="ml-5 flex items-center gap-2 border-l border-[#3DE0D0]/30 px-3 py-2 text-[11px] text-[#3DE0D0]/80 hover:bg-[#3DE0D0]/5 hover:text-[#3DE0D0]" href={simulationPath(simulation.id)} key={simulation.id}>
                          <FlaskConical size={12} /> {simulation.shortTitle}
                        </Link>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        <article className="min-w-0">
          {securedNote
            ? <SecuredNoteReader note={securedNote} />
            : lesson
              ? lesson.sections.map((section) => <LessonSectionBlock key={section.id} section={section} />)
              : <GenericTopicBody chapter={chapter} subject={subject} topic={topic} />}

          <section className="py-10 sm:py-14">
            <Card variant="priority">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  <p className="mono-kicker">Close the loop</p>
                  <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">Can you explain the mechanism without the note?</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[#C7C5CC]">Mark this concept complete only when the central relation, its limiting case and the common trap all feel retrievable.</p>
                </div>
                <Button onClick={toggleComplete} size="lg" variant={state.status === "completed" ? "secondary" : "primary"}>{state.status === "completed" ? <><Check size={17} /> Completed</> : <><Target size={17} /> Mark complete</>}</Button>
              </div>
            </Card>
          </section>

          <nav aria-label="Adjacent topics" className="grid border-l border-t border-white/10 sm:grid-cols-2">
            {previous ? (
              <Link className="group border-b border-r border-white/10 bg-[#161418] p-5 transition hover:bg-[#1E1B20] sm:p-6" href={previous.href}>
                <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.14em] text-[#C7C5CC]/70"><ArrowLeft size={14} /> Previous {previous.kind === "simulation" ? "simulation" : "concept"}</span>
                <span className="mt-4 block font-display text-xl font-bold group-hover:text-[#FF8A3D]">{previous.label}</span>
                <span className="mt-2 block text-xs text-[#C7C5CC]/70">{previous.chapter.title}</span>
              </Link>
            ) : <div className="hidden border-b border-r border-white/10 sm:block" />}
            {next ? (
              <Link className="group border-b border-r border-white/10 bg-[#161418] p-5 text-right transition hover:bg-[#1E1B20] sm:p-6" href={next.href}>
                <span className="flex items-center justify-end gap-2 font-mono text-[11px] uppercase tracking-[.14em] text-[#C7C5CC]/70">Next {next.kind === "simulation" ? "simulation" : "concept"} <ArrowRight size={14} /></span>
                <span className="mt-4 block font-display text-xl font-bold group-hover:text-[#FF8A3D]">{next.label}</span>
                <span className="mt-2 block text-xs text-[#C7C5CC]/70">{next.chapter.title}</span>
              </Link>
            ) : (
              <Link className="group border-b border-r border-white/10 bg-[#161418] p-5 text-right transition hover:bg-[#1E1B20] sm:p-6" href={learningPath(subject)}>
                <span className="flex items-center justify-end gap-2 font-mono text-[11px] uppercase tracking-[.14em] text-[#C7C5CC]/70">Subject complete <ArrowRight size={14} /></span>
                <span className="mt-4 block font-display text-xl font-bold group-hover:text-[#FF8A3D]">Return to {subject.name}</span>
              </Link>
            )}
          </nav>
          <p className="py-8 text-xs leading-5 text-[#C7C5CC]">
            Orange Nelumbo is an independent educational platform and is not affiliated with, endorsed by, or sponsored by the National Testing Agency (NTA), the JEE Apex Board, or the IITs. JEE, JEE Main and JEE Advanced are their respective owners&apos; marks.
          </p>
        </article>

      </div>
    </div>
  );
}
