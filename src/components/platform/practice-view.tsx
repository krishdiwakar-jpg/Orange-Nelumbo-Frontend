"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Atom, BarChart3, Check, ChevronRight, FlaskConical, LockKeyhole, Sigma, Trophy, Zap } from "lucide-react";

import { analytics, curriculum, mockTests, practiceQuestions } from "@/data/platform";

const tabs = ["Topic practice", "Practice mocks", "All India Mock", "Analytics"] as const;
type Tab = (typeof tabs)[number];

const subjectIcons = { physics: Atom, chemistry: FlaskConical, mathematics: Sigma };

export function PracticeView() {
  const searchParams = useSearchParams();
  const requestedSubject = searchParams.get("subject");
  const requestedChapter = searchParams.get("chapter");
  const [tab, setTab] = useState<Tab>("Topic practice");
  const [subject, setSubject] = useState<"all" | "physics" | "chemistry" | "mathematics">(
    requestedSubject === "physics" || requestedSubject === "chemistry" || requestedSubject === "mathematics" ? requestedSubject : "all",
  );
  const [chapterFilter, setChapterFilter] = useState<string | null>(requestedChapter);

  const topicRows = useMemo(() => {
    return curriculum.flatMap((subjectItem) =>
      subjectItem.chapters.flatMap((chapter) =>
        chapter.topics
          .filter((topic) => topic.availability !== "coming-soon")
          .map((topic) => ({ subject: subjectItem, chapter, topic, questionCount: practiceQuestions.filter((question) => question.topicId === topic.id).length })),
      ),
    ).filter((row) => (subject === "all" || row.subject.id === subject) && (!chapterFilter || row.chapter.id === chapterFilter || row.chapter.slug === chapterFilter));
  }, [chapterFilter, subject]);

  const completedMock = mockTests.find((mock) => mock.status === "completed");
  const upcomingMock = mockTests.find((mock) => mock.kind === "All India Mock" && mock.status === "upcoming");

  return (
    <div className="content-shell pb-28 pt-8 lg:pb-14 lg:pt-10">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="mono-kicker">03 — Retrieval engine</p>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">Turn recognition into recall.</h2>
          <p className="mt-3 max-w-2xl text-[#C7C5CC]">Target a concept, mix a chapter, or recreate exam pressure. Every answer feeds the next recommendation.</p>
        </div>
        <Link className="button-primary" href="/practice/session"><Zap size={17} /> Start smart drill</Link>
      </div>

      <div className="mt-9 overflow-x-auto border-b border-[#FF5A1F]/22">
        <div className="flex min-w-max gap-1" role="tablist" aria-label="Practice modes">
          {tabs.map((item) => (
            <button aria-selected={tab === item} className={`min-h-12 border-b-2 px-5 text-sm font-bold transition ${tab === item ? "border-[#FF5A1F] text-white" : "border-transparent text-[#C7C5CC]/70 hover:text-white"}`} key={item} onClick={() => setTab(item)} role="tab" type="button">{item}</button>
          ))}
        </div>
      </div>

      {tab === "Topic practice" && (
        <div className="mt-7 grid gap-6 xl:grid-cols-[1fr_330px]">
          <section>
            <div className="mb-5 flex flex-wrap gap-2">
              {(["all", "physics", "chemistry", "mathematics"] as const).map((item) => (
                <button aria-pressed={subject === item} className={`min-h-11 border px-4 text-sm font-semibold capitalize ${subject === item ? "border-[#FF5A1F] bg-[#FF5A1F]/10 text-white" : "border-white/10 text-[#C7C5CC]/80 hover:border-[#FF5A1F]/35 hover:text-white"}`} key={item} onClick={() => { setSubject(item); setChapterFilter(null); }} type="button">{item === "all" ? "All subjects" : item}</button>
              ))}
            </div>
            <div className="border border-[#FF5A1F]/22 bg-[#161418]">
              <div className="grid grid-cols-[1fr_auto] border-b border-white/8 px-5 py-4 sm:grid-cols-[1.2fr_.8fr_110px_auto] sm:px-6">
                <p className="font-mono text-[11px] uppercase tracking-[.16em] text-[#C7C5CC]/70">Concept</p>
                <p className="hidden font-mono text-[11px] uppercase tracking-[.16em] text-[#C7C5CC]/70 sm:block">Chapter</p>
                <p className="hidden font-mono text-[11px] uppercase tracking-[.16em] text-[#C7C5CC]/70 sm:block">Questions</p>
                <span />
              </div>
              <div className="divide-y divide-white/8">
                {topicRows.slice(0, 12).map(({ subject: subjectItem, chapter, topic, questionCount }) => {
                  const Icon = subjectIcons[subjectItem.id];
                  return (
                    <article className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-5 sm:grid-cols-[1.2fr_.8fr_110px_auto] sm:px-6" key={topic.id}>
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="grid size-10 shrink-0 place-items-center border border-[#FF5A1F]/20 text-[#FF8A3D]"><Icon size={17} strokeWidth={1.5} /></div>
                        <div className="min-w-0"><p className="truncate font-semibold">{topic.title}</p><p className="mt-1 font-mono text-[11px] uppercase tracking-[.12em] text-[#C7C5CC]/70">{subjectItem.code} · {topic.difficulty}</p></div>
                      </div>
                      <p className="hidden text-sm text-[#C7C5CC]/80 sm:block">{chapter.title}</p>
                      <p className={`hidden font-mono text-xs sm:block ${questionCount ? "text-[#3DE0D0]" : "text-[#C7C5CC]/70"}`}>{questionCount ? `${questionCount} Q` : "Preview"}</p>
                      {questionCount ? <Link aria-label={`Practise ${topic.title}`} className="grid size-11 place-items-center border border-white/10 text-[#C7C5CC] hover:border-[#FF5A1F] hover:text-[#FF8A3D]" href={`/practice/session?subject=${subjectItem.id}&topic=${topic.id}`}><ChevronRight size={18} /></Link> : <span aria-label={`${topic.title} practice is not yet available`} className="grid size-11 place-items-center border border-white/8 text-[#C7C5CC]/70" role="img"><LockKeyhole size={16}/></span>}
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
          <aside className="space-y-5">
            <div className="brand-grid border border-[#FF5A1F]/30 bg-[#161418] p-6">
              <p className="mono-kicker">Recommended next</p>
              <h3 className="mt-5 font-display text-2xl font-semibold">Physics mixed drill</h3>
              <p className="mt-3 text-sm leading-6 text-[#C7C5CC]/80">Available seeded questions · Mixed difficulty · browser local</p>
              <div className="mt-5 h-1.5 bg-[#2A262E]"><div className="h-full w-[46%] bg-[#E0483C]" /></div>
              <div className="mt-6 flex items-center justify-between"><span className="font-mono text-[11px] text-[#E0483C]">ACCURACY 46%</span><Link className="text-xs font-bold text-[#FF8A3D]" href="/practice/session?subject=physics">Start →</Link></div>
            </div>
            <div className="border border-white/9 bg-[#161418] p-6">
              <div className="flex items-center justify-between"><p className="mono-kicker">This week</p><BarChart3 className="text-[#3DE0D0]" size={19} /></div>
              <div className="mt-6 grid grid-cols-2 gap-5"><div><p className="font-mono text-2xl">412</p><p className="mt-1 text-xs text-[#C7C5CC]/70">attempted</p></div><div><p className="font-mono text-2xl text-[#3DE0D0]">72%</p><p className="mt-1 text-xs text-[#C7C5CC]/70">accuracy</p></div></div>
            </div>
          </aside>
        </div>
      )}

      {tab === "Practice mocks" && (
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {mockTests.filter((mock) => mock.kind !== "All India Mock").map((mock, index) => (
            <article className="border border-[#FF5A1F]/22 bg-[#161418] p-6" key={mock.id}>
              <div className="flex items-center justify-between"><span className="mono-kicker">{mock.kind}</span>{mock.status === "locked" ? <LockKeyhole className="text-[#C7C5CC]/70" size={18} /> : <Check className="text-[#3DE08A]" size={18} />}</div>
              <h3 className="mt-6 font-display text-2xl font-semibold">{mock.name}</h3>
              <p className="mt-3 text-sm leading-6 text-[#C7C5CC]/80">{mock.description}</p>
              <div className="mt-6 flex flex-wrap gap-4 font-mono text-[11px] uppercase tracking-[.1em] text-[#C7C5CC]/70"><span>{mock.questionCount} questions</span><span>{mock.durationMinutes} min</span><span>{mock.maxMarks} marks</span></div>
              <div className="mt-7 border-t border-white/8 pt-5">{index === 0 ? <Link className="button-outline inline-flex" href={`/mocks/${mock.slug}`}>View test <ArrowRight size={16} /></Link> : <button className="button-ghost" disabled type="button"><LockKeyhole size={15} /> Complete plan required</button>}</div>
            </article>
          ))}
        </div>
      )}

      {tab === "All India Mock" && upcomingMock && (
        <div className="mt-7 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
          <section className="brand-grid border border-[#FF5A1F]/30 bg-[#161418] p-7 sm:p-9">
            <div className="flex items-center justify-between"><p className="mono-kicker">Live ranked paper</p><Trophy className="text-[#F6C344]" size={24} /></div>
            <h3 className="mt-8 max-w-xl font-display text-4xl font-bold">{upcomingMock.name}</h3>
            <p className="mt-4 max-w-xl text-lg leading-8 text-[#C7C5CC]">{upcomingMock.description}</p>
            <div className="mt-8 grid grid-cols-3 border border-white/9 bg-[#0E0D10]">
              {[['STARTS','02 AUG · 09:00'],['DURATION','180 MIN'],['REGISTERED',upcomingMock.registeredCount?.toLocaleString('en-IN') ?? '—']].map(([label,value])=><div className="border-r border-white/8 p-4 last:border-0" key={label}><p className="font-mono text-[11px] tracking-[.14em] text-[#C7C5CC]/70">{label}</p><p className="mt-2 font-mono text-xs text-white sm:text-sm">{value}</p></div>)}
            </div>
            <Link className="button-primary mt-8 inline-flex" href={`/mocks/${upcomingMock.slug}`}>View mock details <ArrowRight size={17} /></Link>
          </section>
          <section className="border border-[#FF5A1F]/22 bg-[#161418] p-7">
            <p className="mono-kicker">Previous signal</p>
            <h3 className="mt-5 font-display text-2xl font-semibold">{completedMock?.name}</h3>
            <div className="mt-7 grid grid-cols-2 gap-4"><div className="border border-white/8 bg-[#0E0D10] p-4"><p className="font-mono text-2xl text-[#FF8A3D]">{completedMock?.attempt?.score}</p><p className="mt-1 text-xs text-[#C7C5CC]/70">score / 300</p></div><div className="border border-white/8 bg-[#0E0D10] p-4"><p className="font-mono text-2xl text-[#3DE0D0]">#{completedMock?.attempt?.rank}</p><p className="mt-1 text-xs text-[#C7C5CC]/70">all India rank</p></div></div>
            <Link className="button-outline mt-7 inline-flex" href={`/results/${completedMock?.slug}`}>Review result</Link>
          </section>
        </div>
      )}

      {tab === "Analytics" && (
        <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[['Questions',analytics.summary.questionsAttempted.toString(),'This week'],['Accuracy',`${analytics.summary.accuracy}%`,'+4% vs last week'],['Projected AIR',analytics.summary.currentRank.toLocaleString('en-IN'),'Model estimate'],['Study time',`${Math.round(analytics.summary.studyMinutes/60)}h`,'Focused time']].map(([label,value,meta])=><article className="border border-[#FF5A1F]/22 bg-[#161418] p-6" key={label}><p className="mono-kicker">{label}</p><p className="mt-6 font-mono text-3xl text-[#3DE0D0]">{value}</p><p className="mt-2 text-xs text-[#C7C5CC]/70">{meta}</p></article>)}
          <Link className="button-outline md:col-span-2 xl:col-span-4" href="/analytics">Open full analytics <ArrowRight size={17} /></Link>
        </div>
      )}
    </div>
  );
}
