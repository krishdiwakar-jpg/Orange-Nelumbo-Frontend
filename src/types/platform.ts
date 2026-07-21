export type SubjectId = "physics" | "chemistry" | "mathematics";

export type LearningStatus =
  | "completed"
  | "in-progress"
  | "not-started"
  | "locked";

export type ContentAvailability = "live" | "preview" | "coming-soon";

export type Difficulty =
  | "Foundation"
  | "JEE Main"
  | "JEE Advanced"
  | "Main + Advanced";

export interface Topic {
  id: string;
  slug: string;
  title: string;
  description: string;
  order: number;
  estimatedMinutes: number;
  difficulty: Difficulty;
  status: LearningStatus;
  progress: number;
  availability: ContentAvailability;
  lessonSlug?: string;
  simulationIds?: string[];
  tags: string[];
}

export interface Chapter {
  id: string;
  slug: string;
  title: string;
  description: string;
  order: number;
  classLevel: "Class 11" | "Class 12" | "Class 11 + 12";
  examWeightage: "Low" | "Medium" | "High";
  topics: Topic[];
}

export interface Subject {
  id: SubjectId;
  code: "PHY" | "CHM" | "MAT";
  name: string;
  shortDescription: string;
  description: string;
  accent: string;
  icon: string;
  chapters: Chapter[];
}

export interface LessonDefinition {
  symbol: string;
  term: string;
  meaning: string;
}

export interface FormulaStep {
  step: number;
  expression: string;
  label?: string;
  explanation: string;
  formulaSheet?: boolean;
}

export interface LessonCallout {
  tone: "note" | "tip" | "warning" | "success";
  title: string;
  body: string;
}

export interface SpecialCase {
  conceptId: string;
  title: string;
  summary: string;
  trigger: string;
  expression?: string;
}

export interface WorkedExample {
  conceptIds: string[];
  pyqReference: string;
  title: string;
  setup: string;
  approach: string;
  trap: string;
  finishingLine: string;
  figureAlt: string;
}

export interface LessonLabPreset {
  id: string;
  label: string;
  conceptId: string;
  launchSpeed: number;
  groundOffset?: number;
  secondLaunchSpeed?: number;
}

export interface LessonLab {
  simulationId: string;
  title: string;
  summary: string;
  model: string;
  controls: Array<{
    id: string;
    label: string;
    unit: string;
    min: number;
    max: number;
    step: number;
    initialValue: number;
  }>;
  readouts: Array<{ id: string; label: string; unit: string }>;
  presets: LessonLabPreset[];
  prediction: {
    prompt: string;
    options: string[];
    correctOption: number;
    explanation: string;
  };
}

export type LessonSectionKind =
  | "theory"
  | "definitions"
  | "derivation"
  | "special-cases"
  | "worked-examples"
  | "lab";

export interface LessonSection {
  id: string;
  number: number;
  kind: LessonSectionKind;
  title: string;
  subtitle: string;
  paragraphs?: string[];
  keyPoints?: string[];
  definitions?: LessonDefinition[];
  formulas?: FormulaStep[];
  specialCases?: SpecialCase[];
  examples?: WorkedExample[];
  callouts?: LessonCallout[];
  figureAlts?: string[];
  lab?: LessonLab;
}

export interface Lesson {
  id: string;
  slug: string;
  subjectId: SubjectId;
  chapterId: string;
  topicId: string;
  unitCode: string;
  conceptRange: string;
  title: string;
  eyebrow: string;
  summary: string;
  estimatedMinutes: number;
  readingLevel: Difficulty;
  sections: LessonSection[];
  relatedQuestionIds: string[];
  relatedSimulationIds: string[];
}

export interface SimulationControl {
  id: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  initialValue: number;
}

export interface Simulation {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  subjectId: SubjectId;
  chapterId: string;
  topicId?: string;
  description: string;
  learningObjectives: string[];
  availability: "live" | "coming-soon";
  estimatedMinutes: number;
  format: "canvas" | "graph" | "3d" | "interactive-model";
  controls?: SimulationControl[];
  accent: string;
}

export interface QuestionOption {
  id: string;
  label: string;
}

export interface PracticeQuestion {
  id: string;
  subjectId: SubjectId;
  chapterId: string;
  topicId: string;
  difficulty: Difficulty;
  type: "single-correct" | "multiple-correct" | "numerical";
  source: string;
  prompt: string;
  options: QuestionOption[];
  correctOptionIds: string[];
  numericalAnswer?: number;
  answerTolerance?: number;
  explanation: string;
  concept: string;
  estimatedSeconds: number;
  marks: { correct: number; incorrect: number; unattempted: number };
}

export interface MockTest {
  id: string;
  slug: string;
  name: string;
  kind: "Full Length" | "Part Test" | "Chapter Test" | "Speed Drill" | "All India Mock";
  description: string;
  subjects: SubjectId[];
  questionCount: number;
  durationMinutes: number;
  maxMarks: number;
  difficulty: Difficulty;
  status: "available" | "locked" | "upcoming" | "completed";
  startsAt?: string;
  registrationClosesAt?: string;
  registeredCount?: number;
  attempt?: {
    score: number;
    rank?: number;
    percentile?: number;
    completedAt: string;
  };
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  maxScore: number;
  city: string;
  isCurrentUser?: boolean;
}

export interface AnalyticsPoint {
  label: string;
  value: number;
}

export interface SubjectAccuracy {
  subjectId: SubjectId;
  attempted: number;
  correct: number;
  accuracy: number;
}

export interface AnalyticsData {
  rankTrend: AnalyticsPoint[];
  weeklyQuestions: AnalyticsPoint[];
  weeklyStudyMinutes: AnalyticsPoint[];
  subjectAccuracy: SubjectAccuracy[];
  strongestTopics: Array<{ topic: string; accuracy: number }>;
  focusTopics: Array<{ topic: string; accuracy: number; recommendation: string }>;
  summary: {
    questionsAttempted: number;
    accuracy: number;
    currentRank: number;
    percentile: number;
    studyMinutes: number;
  };
}

export interface Plan {
  id: "notes" | "simulations" | "complete";
  name: string;
  eyebrow: string;
  price: number;
  billingPeriod: "year";
  description: string;
  features: string[];
  exclusions: string[];
  cta: string;
  highlighted?: boolean;
  active?: boolean;
  savings?: string;
}

export interface Notification {
  id: string;
  type: "study" | "test" | "achievement" | "announcement" | "billing";
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  href?: string;
  actionLabel?: string;
}

export interface PlannerItem {
  id: string;
  date: string;
  startTime?: string;
  title: string;
  description: string;
  type: "lesson" | "practice" | "mock" | "revision" | "break";
  subjectId?: SubjectId;
  durationMinutes: number;
  status: "completed" | "scheduled" | "missed";
  href?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  detail: string;
  outcome: string;
  rating: 4 | 5;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "Learning" | "Practice" | "Plans" | "Account";
}

export interface StudentProfile {
  id: string;
  name: string;
  firstName: string;
  initials: string;
  email: string;
  city: string;
  targetExam: "JEE Main" | "JEE Advanced";
  targetYear: number;
  examDate: string;
  activePlanId: Plan["id"];
  readingStreak: number;
  joinedAt: string;
}
