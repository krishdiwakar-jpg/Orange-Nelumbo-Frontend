import Link from "next/link";
import { ArrowRight, BookOpen, PlayCircle } from "lucide-react";

export default function VideosPage() {
  return (
    <div className="content-shell pb-28 pt-10 lg:pb-16 lg:pt-14">
      <section className="hero-grid overflow-hidden border border-[#FF5A1F]/24 bg-[#161418] px-6 py-12 sm:px-10 sm:py-16 lg:px-14">
        <div className="max-w-3xl">
          <span className="grid size-14 place-items-center border border-[#FF5A1F]/35 bg-[#0E0D10] text-[#FF8A3D]"><PlayCircle size={27} /></span>
          <h2 className="mt-8 font-display text-4xl font-bold sm:text-5xl">Video lectures are coming next.</h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#C7C5CC] sm:text-lg">
            We are building concise, visual-first lectures that connect directly to each note and simulation. The library will appear here when the first series is ready.
          </p>
          <Link className="button-primary mt-8" href="/learn"><BookOpen size={17} /> Explore visual notes <ArrowRight size={17} /></Link>
        </div>
      </section>
    </div>
  );
}
