"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Bookmark, FlaskConical } from "lucide-react";

import { learningPath, resolveTopicState } from "@/components/learning/progress-utils";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/components/providers/app-provider";
import { allTopics, curriculum, simulations, studentProfile } from "@/data/platform";

export function DashboardView() {
  const { bookmarkedTopicIds, topicProgress, user } = useApp();
  const student = user ?? studentProfile;
  const continueTopic = allTopics.find((topic) => topic.slug === "motion-under-gravity") ?? allTopics[0];
  const continueState = resolveTopicState(continueTopic, topicProgress);
  const subject = curriculum.find((item) => item.chapters.some((chapter) => chapter.topics.some((topic) => topic.id === continueTopic.id))) ?? curriculum[0];
  const chapter = subject.chapters.find((item) => item.topics.some((topic) => topic.id === continueTopic.id)) ?? subject.chapters[0];
  const liveSimulations = simulations.filter((item) => item.availability === "live");

  return (
    <div className="pb-28 lg:pb-16">
      <section className="hero-grid border-b border-[#FF5A1F]/18 px-5 py-10 sm:px-7 lg:px-10 xl:px-12">
        <div className="mx-auto max-w-[1380px]">
          <h2 className="max-w-3xl font-display text-4xl font-bold sm:text-5xl">Welcome back, {student.firstName}.</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#C7C5CC] sm:text-lg">
            Pick up a visual note, test the idea in a simulation, or browse a new chapter.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Link className="group border border-[#FF5A1F]/22 bg-[#161418] p-5 transition hover:border-[#FF5A1F]/55" href="/learn">
              <BookOpen className="text-[#FF8A3D]" size={22} />
              <h3 className="mt-5 text-xl font-bold">Visual notes</h3>
              <p className="mt-2 text-sm leading-6 text-[#C7C5CC]/80">Clear theory, diagrams, derivations, and exam-focused examples.</p>
            </Link>
            <Link className="group border border-[#FF5A1F]/22 bg-[#161418] p-5 transition hover:border-[#FF5A1F]/55" href="/simulations">
              <FlaskConical className="text-[#3DE0D0]" size={22} />
              <h3 className="mt-5 text-xl font-bold">Simulations</h3>
              <p className="mt-2 text-sm leading-6 text-[#C7C5CC]/80">Change variables and watch the underlying relationship respond.</p>
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1460px] gap-10 px-5 py-10 sm:px-7 lg:px-10 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,.7fr)] xl:px-12">
        <div className="min-w-0 space-y-10">
          <section>
            <div className="mb-5 flex items-end justify-between gap-4">
              <h3 className="font-display text-2xl font-bold sm:text-3xl">Continue reading</h3>
              <Link className="text-sm font-bold text-[#FF8A3D]" href="/learn">View all notes</Link>
            </div>
            <Card className="overflow-hidden p-0" variant="priority">
              <div className="grid lg:grid-cols-[1fr_250px]">
                <div className="p-6 sm:p-8">
                  <p className="text-sm font-semibold text-[#FF8A3D]">{subject.name} · {chapter.title}</p>
                  <h4 className="mt-3 font-display text-3xl font-bold">{continueTopic.title}</h4>
                  <p className="mt-3 max-w-2xl leading-7 text-[#C7C5CC]">{continueTopic.description}</p>
                  <Progress className="mt-6 max-w-xl" showValue value={continueState.progress} />
                  <Link className="button-primary mt-7" href={learningPath(subject, chapter, continueTopic)}>Open note <ArrowRight size={17} /></Link>
                </div>
                <div className="brand-grid grid min-h-52 place-items-center border-t border-[#FF5A1F]/18 bg-[#0E0D10] lg:border-l lg:border-t-0">
                  <BookOpen className="text-[#FF8A3D]" size={46} strokeWidth={1.2} />
                </div>
              </div>
            </Card>
          </section>

          <section>
            <h3 className="font-display text-2xl font-bold sm:text-3xl">Browse by subject</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {curriculum.map((item) => (
                <Link href={learningPath(item)} key={item.id}>
                  <Card className="h-full" interactive>
                    <span className="grid size-11 place-items-center border border-[#FF5A1F]/30 text-sm font-bold text-[#FF8A3D]">{item.code}</span>
                    <h4 className="mt-6 text-2xl font-bold">{item.name}</h4>
                    <p className="mt-3 text-sm leading-6 text-[#C7C5CC]/80">{item.shortDescription}</p>
                    <p className="mt-6 flex items-center gap-2 text-sm font-bold text-[#FF8A3D]">Explore notes <ArrowRight size={15} /></p>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section>
            <div className="mb-5 flex items-center justify-between"><h3 className="font-display text-2xl font-bold">Live simulations</h3><FlaskConical className="text-[#3DE0D0]" size={20} /></div>
            <Card className="p-0">
              {liveSimulations.slice(0, 3).map((simulation, index) => (
                <Link className={`block p-5 transition hover:bg-white/[.03] ${index ? "border-t border-white/8" : ""}`} href={`/simulations/${simulation.slug}`} key={simulation.id}>
                  <p className="font-semibold">{simulation.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[#C7C5CC]/75">{simulation.description}</p>
                </Link>
              ))}
              <Link className="flex min-h-12 items-center justify-center gap-2 border-t border-white/8 text-sm font-bold text-[#FF8A3D]" href="/simulations">All simulations <ArrowRight size={15} /></Link>
            </Card>
          </section>

          <Card variant="subtle">
            <div className="flex items-center gap-3"><Bookmark className="text-[#FF8A3D]" size={19} /><h3 className="text-xl font-bold">Saved notes</h3></div>
            <p className="mt-3 text-sm leading-6 text-[#C7C5CC]/80">You have {bookmarkedTopicIds.length} note{bookmarkedTopicIds.length === 1 ? "" : "s"} bookmarked for quick access.</p>
            <Link className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#FF8A3D]" href="/bookmarks">Open bookmarks <ArrowRight size={15} /></Link>
          </Card>
        </aside>
      </div>
    </div>
  );
}
