import type { TopicProgressEntry } from "@/components/providers/app-provider";
import type { Chapter, LearningStatus, Subject, Topic } from "@/types/platform";

export interface ResolvedTopicState {
  progress: number;
  status: LearningStatus;
}

export function resolveTopicState(
  topic: Topic,
  progressMap: Record<string, TopicProgressEntry>,
): ResolvedTopicState {
  const stored = progressMap[topic.slug] ?? progressMap[topic.id];
  return {
    progress: stored?.progress ?? topic.progress,
    status: stored?.status ?? topic.status,
  };
}

export function resolveChapterProgress(
  chapter: Chapter,
  progressMap: Record<string, TopicProgressEntry>,
) {
  const states = chapter.topics.map((topic) => resolveTopicState(topic, progressMap));
  const completed = states.filter((state) => state.status === "completed").length;
  const progress = Math.round(
    states.reduce((total, state) => total + state.progress, 0) / Math.max(states.length, 1),
  );

  return { completed, progress, total: chapter.topics.length };
}

export function resolveSubjectProgress(
  subject: Subject,
  progressMap: Record<string, TopicProgressEntry>,
) {
  const topics = subject.chapters.flatMap((chapter) => chapter.topics);
  const states = topics.map((topic) => resolveTopicState(topic, progressMap));
  const completed = states.filter((state) => state.status === "completed").length;
  const progress = Math.round(
    states.reduce((total, state) => total + state.progress, 0) / Math.max(states.length, 1),
  );

  return { completed, progress, total: topics.length };
}

export function learningPath(subject: Subject, chapter?: Chapter, topic?: Topic) {
  const base = `/learn/${subject.id}`;
  if (!chapter) return base;
  const chapterPath = `${base}/${chapter.slug}`;
  return topic ? `/notes/${subject.id}/${chapter.slug}/${topic.slug}` : chapterPath;
}

export function statusLabel(status: LearningStatus) {
  switch (status) {
    case "completed":
      return "Completed";
    case "in-progress":
      return "In progress";
    case "locked":
      return "Locked";
    default:
      return "Not started";
  }
}
