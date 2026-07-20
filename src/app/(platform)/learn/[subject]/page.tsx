import { notFound } from "next/navigation";

import { SubjectOverview } from "@/components/learning/learning-catalog";
import { curriculum } from "@/data/platform";

export function generateStaticParams() {
  return curriculum.map((subject) => ({ subject: subject.id }));
}

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject: subjectSlug } = await params;
  const subject = curriculum.find((candidate) => candidate.id === subjectSlug);
  if (!subject) notFound();

  return <SubjectOverview subject={subject} />;
}
