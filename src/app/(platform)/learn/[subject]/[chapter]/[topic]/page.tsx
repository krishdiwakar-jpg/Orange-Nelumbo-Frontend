import { notFound, redirect } from "next/navigation";

import { curriculum } from "@/data/platform";

const topicAliases: Record<string, string> = {
  "definite-integrals": "integration",
};

export function generateStaticParams() {
  return curriculum.flatMap((subject) =>
    subject.chapters.flatMap((chapter) =>
      chapter.topics.map((topic) => ({
        chapter: chapter.slug,
        subject: subject.id,
        topic: topic.slug,
      })),
    ),
  );
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ chapter: string; subject: string; topic: string }>;
}) {
  const {
    chapter: chapterSlug,
    subject: subjectSlug,
    topic: topicSlug,
  } = await params;
  const subject = curriculum.find((candidate) => candidate.id === subjectSlug);
  const chapter = subject?.chapters.find((candidate) => candidate.slug === chapterSlug);
  const resolvedTopicSlug = topicAliases[topicSlug] ?? topicSlug;
  const topic = chapter?.topics.find((candidate) => candidate.slug === resolvedTopicSlug);
  if (!subject || !chapter || !topic) notFound();
  redirect(`/notes/${subject.id}/${chapter.slug}/${topic.slug}`);
}
