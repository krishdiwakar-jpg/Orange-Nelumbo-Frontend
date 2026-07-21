import type { Plan } from "@/types/platform";

export interface CourseProduct {
  slug: string;
  planId: Plan["id"];
  name: string;
  promise: string;
  summary: string;
  idealFor: string;
  accent: string;
  stats: Array<{ value: string; label: string }>;
  outcomes: string[];
  modules: Array<{ title: string; description: string }>;
  coverage: Array<{ subject: string; description: string }>;
}

export const courseProducts: CourseProduct[] = [
  {
    slug: "visual-notes",
    planId: "notes",
    name: "Visual Notes",
    promise: "Build the concept before memorising the formula.",
    summary: "A complete visual note library for Physics, Chemistry, and Mathematics, designed for focused reading and revision.",
    idealFor: "Students who want one clear, structured source for theory, derivations, and exam-ready revision.",
    accent: "#F2B04B",
    stats: [
      { value: "3", label: "JEE subjects" },
      { value: "32", label: "mapped chapters" },
      { value: "1 year", label: "library access" },
    ],
    outcomes: [
      "See how definitions, diagrams, and derivations connect.",
      "Revise from compact retention points without losing the reasoning.",
      "Keep bookmarks and reading progress in one focused workspace.",
    ],
    modules: [
      { title: "Visual concept notes", description: "Layered explanations, diagrams, definitions, and formula relationships." },
      { title: "Worked reasoning", description: "Step-by-step derivations and representative JEE applications." },
      { title: "Protected note reader", description: "Every note opens on a separate, distraction-free learning page." },
      { title: "Revision system", description: "Bookmarks, progress markers, and printable revision-ready lessons." },
    ],
    coverage: [
      { subject: "Physics", description: "Mechanics, electricity, waves, optics, and modern physics through diagrams and derivations." },
      { subject: "Chemistry", description: "Physical relationships, inorganic structures, and organic reaction logic." },
      { subject: "Mathematics", description: "Algebra, calculus, coordinate geometry, and vector reasoning." },
    ],
  },
  {
    slug: "notes-and-simulations",
    planId: "simulations",
    name: "Notes + Simulations",
    promise: "Read the relationship, then control it yourself.",
    summary: "The complete visual note library plus interactive labs with adjustable variables, live motion, and responsive graphs.",
    idealFor: "Students who understand faster when they can test a prediction and watch the result change in real time.",
    accent: "#D8794A",
    stats: [
      { value: "All notes", label: "included" },
      { value: "Live", label: "interactive labs" },
      { value: "1 year", label: "library access" },
    ],
    outcomes: [
      "Turn abstract formulas into visible, controllable behaviour.",
      "Test predictions by changing one variable at a time.",
      "Connect graphs, equations, and physical or chemical models.",
    ],
    modules: [
      { title: "Everything in Visual Notes", description: "Full Physics, Chemistry, and Mathematics visual note access." },
      { title: "Interactive simulation lab", description: "Manipulate values and observe immediate visual and numerical feedback." },
      { title: "Guided predictions", description: "Pause before each run, make a prediction, and compare it with the model." },
      { title: "New lab releases", description: "Access additional live simulations added during the plan year." },
    ],
    coverage: [
      { subject: "Physics", description: "Motion, oscillation, fields, circuits, optics, and other variable-driven models." },
      { subject: "Chemistry", description: "Titration, equilibrium, molecular geometry, kinetics, and thermodynamic relationships." },
      { subject: "Mathematics", description: "Functions, transformations, calculus, vectors, and geometric constructions." },
    ],
  },
  {
    slug: "complete-visual-library",
    planId: "complete",
    name: "Complete Visual Library",
    promise: "Move from one clear concept to the next with the full visual system.",
    summary: "Notes, simulations, curated concept maps, and educator-designed visual sequences in one complete annual library.",
    idealFor: "Students who want the entire Orange Nelumbo learning collection and a guided way to connect chapters.",
    accent: "#5F8D83",
    stats: [
      { value: "Everything", label: "in one plan" },
      { value: "3", label: "connected subjects" },
      { value: "1 year", label: "priority access" },
    ],
    outcomes: [
      "See prerequisite and cross-chapter relationships through concept maps.",
      "Follow educator-curated sequences when a topic spans multiple chapters.",
      "Receive every library addition released during the plan year.",
    ],
    modules: [
      { title: "Everything in Notes + Simulations", description: "The complete visual note and interactive lab libraries." },
      { title: "Curated concept maps", description: "Heat-map style views that reveal dependencies and useful next concepts." },
      { title: "Educator visual sequences", description: "Purposeful paths assembled around difficult, connected JEE ideas." },
      { title: "Priority library additions", description: "Access all new learning tools and content added during the plan year." },
    ],
    coverage: [
      { subject: "Physics", description: "A connected path from mechanics through electricity, optics, and modern physics." },
      { subject: "Chemistry", description: "Linked physical, inorganic, and organic frameworks with visual anchors." },
      { subject: "Mathematics", description: "Concept chains across algebra, calculus, coordinate geometry, and vectors." },
    ],
  },
];

export function getCourseProduct(slug: string) {
  return courseProducts.find((product) => product.slug === slug);
}
