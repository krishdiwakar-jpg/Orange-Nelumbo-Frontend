"use client";

import { useState } from "react";
import { Atom, BookOpen, ChevronRight, FlaskConical, Sigma } from "lucide-react";

type NotePreview = {
  slug: string;
  subject: "Physics" | "Chemistry" | "Mathematics";
  title: string;
  chapter: string;
  summary: string;
  formula: string;
  ideas: string[];
  accent: string;
};

const notes: NotePreview[] = [
  {
    slug: "motion-under-gravity",
    subject: "Physics",
    title: "Motion under gravity",
    chapter: "Kinematics",
    summary: "Read velocity, displacement, and time as one connected picture.",
    formula: "v² = u² + 2as",
    ideas: ["Acceleration stays downward", "Velocity becomes zero only at the apex", "Equal levels have equal speed magnitude"],
    accent: "#FF8A3D",
  },
  {
    slug: "electric-field-potential",
    subject: "Physics",
    title: "Electric field & potential",
    chapter: "Electrostatics",
    summary: "Connect field direction, work, and equipotential surfaces visually.",
    formula: "E = −dV / dr",
    ideas: ["Field points down the potential gradient", "No work along an equipotential", "Closer lines mean a stronger field"],
    accent: "#3DE0D0",
  },
  {
    slug: "chemical-bonding",
    subject: "Chemistry",
    title: "Chemical bonding",
    chapter: "Inorganic Chemistry",
    summary: "Move from electron pairs to shape without memorising disconnected tables.",
    formula: "SN = σ bonds + lone pairs",
    ideas: ["Electron domains repel", "Lone pairs occupy more space", "Shape follows minimum repulsion"],
    accent: "#3DE08A",
  },
  {
    slug: "entropy-spontaneity",
    subject: "Chemistry",
    title: "Entropy & spontaneity",
    chapter: "Thermodynamics",
    summary: "See how enthalpy and entropy compete as temperature changes.",
    formula: "ΔG = ΔH − TΔS",
    ideas: ["Negative ΔG is spontaneous", "Temperature changes the entropy term", "Spontaneous does not mean fast"],
    accent: "#F6C344",
  },
  {
    slug: "integration-accumulation",
    subject: "Mathematics",
    title: "Integration as accumulation",
    chapter: "Integral Calculus",
    summary: "Treat an integral as a growing total before reaching for a rule.",
    formula: "∫ f(x)dx = F(x) + C",
    ideas: ["Area can be signed", "The antiderivative is a family", "Definite integrals measure net change"],
    accent: "#B48CFF",
  },
];

const subjectIcon = { Physics: Atom, Chemistry: FlaskConical, Mathematics: Sigma };

function NoteDiagram({ note }: { note: NotePreview }) {
  if (note.slug === "chemical-bonding") {
    return <svg aria-label="Molecular geometry diagram" className="size-full" viewBox="0 0 520 240"><line x1="260" x2="145" y1="120" y2="65" stroke={note.accent} strokeWidth="3"/><line x1="260" x2="375" y1="120" y2="65" stroke={note.accent} strokeWidth="3"/><line x1="260" x2="260" y1="120" y2="210" stroke={note.accent} strokeWidth="3"/><circle cx="260" cy="120" r="28" fill="#FF5A1F"/><circle cx="145" cy="65" r="18" fill={note.accent}/><circle cx="375" cy="65" r="18" fill={note.accent}/><circle cx="260" cy="210" r="18" fill={note.accent}/><text x="245" y="126" fill="#0E0D10" fontWeight="700">AX₃</text></svg>;
  }
  if (note.subject === "Mathematics") {
    return <svg aria-label="Area under a curve" className="size-full" viewBox="0 0 520 240"><defs><linearGradient id="noteArea" x1="0" x2="0" y1="0" y2="1"><stop stopColor={note.accent} stopOpacity=".48"/><stop offset="1" stopColor={note.accent} stopOpacity=".04"/></linearGradient></defs><line x1="55" x2="470" y1="205" y2="205" stroke="#C7C5CC" opacity=".4"/><line x1="75" x2="75" y1="25" y2="215" stroke="#C7C5CC" opacity=".4"/><path d="M75 205 C150 190 165 80 255 105 C340 128 365 42 455 55 L455 205Z" fill="url(#noteArea)"/><path d="M75 205 C150 190 165 80 255 105 C340 128 365 42 455 55" fill="none" stroke={note.accent} strokeWidth="4"/></svg>;
  }
  return <svg aria-label="Concept relationship diagram" className="size-full" viewBox="0 0 520 240"><line x1="55" x2="465" y1="190" y2="190" stroke="#C7C5CC" opacity=".35"/><path d="M70 185 Q260 22 450 185" fill="none" stroke={note.accent} strokeDasharray="7 8" strokeWidth="3"/><circle cx="70" cy="185" fill="#F5D9A8" r="13"/><circle cx="260" cy="60" fill="#F5D9A8" r="13"/><circle cx="450" cy="185" fill="#F5D9A8" r="13"/><text x="225" y="28" fill={note.accent} fontFamily="JetBrains Mono" fontSize="12">turning point</text></svg>;
}

export function SampleNotesBrowser({ initialSlug = "motion-under-gravity" }: { initialSlug?: string }) {
  const initial = notes.find((note) => note.slug === initialSlug) ?? notes[0];
  const [activeSlug, setActiveSlug] = useState(initial.slug);
  const active = notes.find((note) => note.slug === activeSlug) ?? notes[0];
  const ActiveIcon = subjectIcon[active.subject];

  return (
    <div className="grid gap-5 xl:grid-cols-[310px_minmax(0,1fr)]">
      <nav aria-label="Choose a sample note" className="border border-[#FF5A1F]/24 bg-[#161418] p-2">
        {notes.map((note) => {
          const Icon = subjectIcon[note.subject];
          const selected = note.slug === activeSlug;
          return <button aria-pressed={selected} className={`group flex min-h-20 w-full items-center gap-4 border-l-2 px-4 text-left transition ${selected ? "border-[#FF5A1F] bg-[#FF5A1F]/9 text-white" : "border-transparent text-[#C7C5CC] hover:bg-white/[.035] hover:text-white"}`} key={note.slug} onClick={() => setActiveSlug(note.slug)} type="button"><span className="grid size-10 shrink-0 place-items-center border border-white/10" style={{ color: note.accent }}><Icon size={18}/></span><span className="min-w-0"><span className="block text-[11px] font-medium text-[#C7C5CC]/65">{note.subject}</span><span className="mt-1 block truncate text-sm font-bold">{note.title}</span></span><ChevronRight className="ml-auto shrink-0 opacity-45" size={16}/></button>;
        })}
      </nav>

      <article className="note-paper overflow-hidden border border-[#FF5A1F]/24 shadow-[0_28px_80px_rgba(0,0,0,.24)]">
        <header className="flex flex-wrap items-start justify-between gap-5 border-b border-[#161418]/12 px-6 py-6 sm:px-9">
          <div className="flex items-start gap-4"><span className="grid size-11 place-items-center border border-[#161418]/15" style={{ color: active.accent }}><ActiveIcon size={21}/></span><div><p className="text-xs font-semibold text-[#5C5860]">{active.subject} · {active.chapter}</p><h2 className="mt-2 font-display text-2xl font-bold text-[#161418] sm:text-3xl">{active.title}</h2></div></div>
          <span className="flex items-center gap-2 text-xs font-semibold text-[#514C55]"><BookOpen size={15}/> Preview 1 of 5</span>
        </header>
        <div className="grid lg:grid-cols-[1.05fr_.95fr]">
          <div className="border-b border-[#161418]/12 p-6 sm:p-9 lg:border-b-0 lg:border-r">
            <p className="max-w-xl text-base leading-7 text-[#4A454D]">{active.summary}</p>
            <div className="mt-7 min-h-[220px] border border-[#161418]/12 bg-white"><NoteDiagram note={active}/></div>
            <div className="mt-6 border-l-4 border-[#FF5A1F] bg-[#FF5A1F]/8 p-5"><p className="text-xs font-semibold text-[#8A2F0A]">Core relationship</p><p className="mt-3 font-display text-2xl font-semibold text-[#161418] sm:text-3xl">{active.formula}</p></div>
          </div>
          <aside className="p-6 sm:p-9">
            <h3 className="font-display text-xl font-bold text-[#161418]">Three ideas to retain</h3>
            <ol className="mt-6 space-y-5">{active.ideas.map((idea, index) => <li className="flex gap-4" key={idea}><span className="grid size-7 shrink-0 place-items-center bg-[#161418] font-mono text-[10px] text-white">0{index + 1}</span><p className="pt-0.5 text-sm leading-6 text-[#4A454D]">{idea}</p></li>)}</ol>
            <div className="mt-9 border-t border-[#161418]/12 pt-6"><p className="text-xs font-semibold text-[#8A2F0A]">Preview format</p><p className="mt-3 text-sm leading-6 text-[#4A454D]">Each note can add its own visual, relationship, and retention list without changing this layout.</p></div>
          </aside>
        </div>
      </article>
    </div>
  );
}

export { notes as sampleNotes };
