import { practiceQuestions } from "@/data/platform";
import type { MockTest, PracticeQuestion } from "@/types/platform";

export function getMockQuestions(mock: MockTest): PracticeQuestion[] {
  let candidates = practiceQuestions.filter((question) => mock.subjects.includes(question.subjectId));
  if (mock.slug === "mechanics-part-test") {
    candidates = candidates.filter((question) => ["phy-kinematics", "phy-laws-motion", "phy-rotational"].includes(question.chapterId));
  }
  if (mock.slug === "chemical-bonding-chapter-test") {
    candidates = candidates.filter((question) => question.chapterId === "chm-chemical-bonding");
  }
  if (mock.slug === "calculus-speed-drill") {
    candidates = candidates.filter((question) => question.chapterId === "mat-calculus");
  }
  return candidates.slice(0, 9);
}

export function isCorrectAnswer(question: PracticeQuestion, selected: string[]) {
  if (question.type === "numerical") {
    const value = Number(selected[0]);
    return Number.isFinite(value) && Math.abs(value - (question.numericalAnswer ?? Number.NaN)) <= (question.answerTolerance ?? 0);
  }
  return selected.length === question.correctOptionIds.length && selected.every((id) => question.correctOptionIds.includes(id));
}

export function formatAnswer(question: PracticeQuestion, selected: string[]) {
  if (!selected.length) return "Not attempted";
  if (question.type === "numerical") return selected[0];
  return selected.map((id) => question.options.find((option) => option.id === id)?.label ?? id.toUpperCase()).join(", ");
}

export function formatCorrectAnswer(question: PracticeQuestion) {
  if (question.type === "numerical") return String(question.numericalAnswer ?? "—");
  return question.correctOptionIds.map((id) => question.options.find((option) => option.id === id)?.label ?? id.toUpperCase()).join(", ");
}
