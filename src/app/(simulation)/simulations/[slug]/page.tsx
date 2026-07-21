import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Clock3, FlaskConical, LockKeyhole } from "lucide-react";

import { FullscreenSimulationShell } from "@/components/layout/fullscreen-simulation-shell";
import { FreeSimulationPlayground } from "@/components/marketing/free-simulation-playground";
import { SimulationLab } from "@/components/platform/simulation-lab";
import { FrontendActionButton } from "@/components/ui/frontend-action-button";
import { curriculum, getSimulation } from "@/data/platform";
import { learningPath } from "@/components/learning/progress-utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: getSimulation(slug)?.shortTitle ?? "Simulation" };
}

export default async function SimulationPage({ params }: Props) {
  const { slug } = await params;
  const simulation = getSimulation(slug);
  if (!simulation) notFound();

  const subject = curriculum.find((item) => item.id === simulation.subjectId);
  const chapter = subject?.chapters.find((item) => item.id === simulation.chapterId);
  const topic = chapter?.topics.find((item) => item.id === simulation.topicId);
  const subjectTopics = subject?.chapters.flatMap((itemChapter) =>
    itemChapter.topics.map((itemTopic) => ({ chapter: itemChapter, topic: itemTopic })),
  ) ?? [];
  const topicIndex = topic ? subjectTopics.findIndex((item) => item.topic.id === topic.id) : -1;
  const next = topicIndex >= 0 ? subjectTopics[topicIndex + 1] : undefined;
  const backHref = subject && chapter && topic ? learningPath(subject, chapter, topic) : "/simulations";
  const nextHref = subject && next ? learningPath(subject, next.chapter, next.topic) : subject ? learningPath(subject) : undefined;

  const shellProps = {
    backHref,
    backLabel: topic ? `Back to ${topic.title}` : "All simulations",
    nextHref,
    nextLabel: next ? `Next: ${next.topic.title}` : `Return to ${subject?.name ?? "library"}`,
    title: simulation.shortTitle,
  };

  if (simulation.availability === "live" && slug === "extrema-integral-functions") {
    return (
      <FullscreenSimulationShell {...shellProps}>
        <iframe
          className="block size-full border-0 bg-[#F5F0E8]"
          sandbox="allow-scripts"
          src="/api/secured-simulations/extrema-integral-functions"
          title="Accumulation Bench interactive simulation"
        />
      </FullscreenSimulationShell>
    );
  }

  if (simulation.availability === "live" && slug === "vertical-throw") {
    return <FullscreenSimulationShell {...shellProps}><SimulationLab fullscreen simulation={simulation} /></FullscreenSimulationShell>;
  }

  if (simulation.availability === "live") {
    return <FullscreenSimulationShell {...shellProps}><FreeSimulationPlayground fullscreen initialSlug={slug} /></FullscreenSimulationShell>;
  }

  return (
    <FullscreenSimulationShell {...shellProps}>
      <div className="h-full overflow-y-auto p-5 sm:p-8">
        <section className="brand-grid mx-auto max-w-6xl border border-[#FF5A1F]/25 bg-[#161418] p-7 sm:p-10">
          <div className="grid max-w-4xl gap-8 lg:grid-cols-[1fr_auto]">
            <div><p className="mono-kicker">{simulation.subjectId} · Coming soon</p><h2 className="mt-5 font-display text-4xl font-bold sm:text-5xl">{simulation.title}</h2><p className="mt-5 text-lg leading-8 text-[#C7C5CC]">{simulation.description}</p></div>
            <div className="grid size-20 place-items-center border border-[#FF5A1F]/25 bg-[#0E0D10]"><LockKeyhole className="text-[#FF8A3D]" size={30} /></div>
          </div>
          <div className="mt-9 grid gap-3 md:grid-cols-3">{simulation.learningObjectives.map((objective) => <div className="flex gap-3 border border-white/9 bg-[#0E0D10] p-4" key={objective}><Check className="mt-1 shrink-0 text-[#3DE08A]" size={15} /><p className="text-sm leading-6 text-[#C7C5CC]">{objective}</p></div>)}</div>
          <div className="mt-9 flex flex-wrap items-center gap-4"><FrontendActionButton doneLabel="Notification saved on this device" idleLabel="Notify me when live" /><span className="flex items-center gap-2 font-mono text-[11px] text-[#C7C5CC]/70"><Clock3 size={14} />{simulation.estimatedMinutes} min lab</span></div>
        </section>
        <div className="mx-auto mt-6 max-w-6xl border border-white/9 bg-[#0E0D10] p-5"><p className="flex items-center gap-3 font-semibold"><FlaskConical className="text-[#3DE0D0]" size={19} /> Meanwhile, try any of the live demos.</p><Link className="mt-3 inline-flex text-sm font-bold text-[#FF8A3D]" href="/free-simulations">Open free simulations →</Link></div>
      </div>
    </FullscreenSimulationShell>
  );
}
