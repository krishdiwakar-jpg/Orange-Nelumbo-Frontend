import { notFound } from "next/navigation";

import { TopicReader } from "@/components/learning/topic-reader";
import { curriculum, lessons } from "@/data/platform";

export function generateStaticParams() {
  return curriculum.flatMap((subject) =>
    subject.chapters.flatMap((chapter) =>
      chapter.topics.map((topic) => ({ subject: subject.id, chapter: chapter.slug, topic: topic.slug })),
    ),
  );
}

export default async function NotePage({ params }: { params: Promise<{ subject: string; chapter: string; topic: string }> }) {
  const slugs = await params;
  const subject = curriculum.find((item) => item.id === slugs.subject);
  const chapter = subject?.chapters.find((item) => item.slug === slugs.chapter);
  const topic = chapter?.topics.find((item) => item.slug === slugs.topic);
  if (!subject || !chapter || !topic) notFound();
  const lesson = topic.lessonSlug ? lessons.find((item) => item.slug === topic.lessonSlug) : undefined;
  return <TopicReader chapter={chapter} lesson={lesson} subject={subject} topic={topic} />;
}
