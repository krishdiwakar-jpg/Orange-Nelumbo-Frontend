import { notFound } from "next/navigation";

import { ChapterOverview } from "@/components/learning/learning-catalog";
import { curriculum } from "@/data/platform";

export function generateStaticParams() {
  return curriculum.flatMap((subject) =>
    subject.chapters.map((chapter) => ({
      chapter: chapter.slug,
      subject: subject.id,
    })),
  );
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ chapter: string; subject: string }>;
}) {
  const { chapter: chapterSlug, subject: subjectSlug } = await params;
  const subject = curriculum.find((candidate) => candidate.id === subjectSlug);
  const chapter = subject?.chapters.find((candidate) => candidate.slug === chapterSlug);
  if (!subject || !chapter) notFound();

  return <ChapterOverview chapter={chapter} subject={subject} />;
}
