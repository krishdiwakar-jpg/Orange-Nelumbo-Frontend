import { notFound } from "next/navigation";

import { TopicReader } from "@/components/learning/topic-reader";
import { curriculum, lessons } from "@/data/platform";

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
  const lesson = topic.lessonSlug
    ? lessons.find((candidate) => candidate.slug === topic.lessonSlug)
    : undefined;

  return <TopicReader chapter={chapter} lesson={lesson} subject={subject} topic={topic} />;
}
