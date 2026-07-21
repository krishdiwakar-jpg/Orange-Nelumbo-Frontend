"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export interface SecuredNoteConfig {
  slug: string;
  chunkCount: number;
  headings: string[];
  simulationSlug: string;
  simulationTitle: string;
}

const estimatedChunkHeight = 1080;

export function SecuredNoteReader({ note }: { note: SecuredNoteConfig }) {
  const [activeChunk, setActiveChunk] = useState(0);
  const [heights, setHeights] = useState<Record<number, number>>({});
  const wrappers = useRef<Array<HTMLElement | null>>([]);
  const frames = useRef<Array<HTMLIFrameElement | null>>([]);
  const mounted = useMemo(() => {
    const indexes = [activeChunk - 1, activeChunk, activeChunk + 1, activeChunk + 2];
    return new Set(indexes.filter((index) => index >= 0 && index < note.chunkCount));
  }, [activeChunk, note.chunkCount]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data as { type?: string; chunkIndex?: number; height?: number };
      if (data.type !== "orange-note-height" || !Number.isInteger(data.chunkIndex) || typeof data.height !== "number") return;
      const index = data.chunkIndex as number;
      if (event.source !== frames.current[index]?.contentWindow) return;
      const height = Math.max(320, Math.min(5200, Math.ceil(data.height)));
      setHeights((current) => (current[index] === height ? current : { ...current, [index]: height }));
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = Number((visible.target as HTMLElement).dataset.chunkIndex);
        if (Number.isInteger(index)) setActiveChunk(index);
      },
      { rootMargin: "-18% 0px -52%", threshold: [0, 0.15, 0.35, 0.6] },
    );
    wrappers.current.forEach((element) => element && observer.observe(element));
    return () => observer.disconnect();
  }, [note.chunkCount]);

  return (
    <div className="py-8 sm:py-10">
      <div className="sticky top-16 z-20 mb-5 border border-white/10 bg-[#0E0D10]/94 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="font-semibold text-white">{note.headings[activeChunk]}</span>
          <span className="shrink-0 text-[#C7C5CC]">{activeChunk + 1} / {note.chunkCount}</span>
        </div>
        <div className="mt-3 h-1 overflow-hidden bg-white/8"><div className="h-full bg-[#D8794A] transition-[width] duration-300" style={{ width: `${((activeChunk + 1) / note.chunkCount) * 100}%` }} /></div>
      </div>

      <div className="grid gap-5">
        {Array.from({ length: note.chunkCount }, (_, index) => {
          const height = heights[index] ?? estimatedChunkHeight;
          const isMounted = mounted.has(index);
          return (
            <section
              aria-label={`Note section ${index + 1}: ${note.headings[index]}`}
              className="overflow-hidden border border-white/9 bg-[#161418]"
              data-chunk-index={index}
              id={`secured-note-section-${index + 1}`}
              key={index}
              ref={(element) => { wrappers.current[index] = element; }}
              style={{ minHeight: height }}
            >
              {isMounted ? (
                <iframe
                  className="block w-full border-0 bg-[#161418]"
                  loading={index <= activeChunk + 1 ? "eager" : "lazy"}
                  ref={(element) => { frames.current[index] = element; }}
                  sandbox="allow-scripts"
                  src={`/api/secured-notes/${note.slug}/chunks/${index}`}
                  style={{ height }}
                  title={`${note.headings[index]} — protected note chunk ${index + 1}`}
                />
              ) : <div aria-hidden="true" className="size-full animate-pulse bg-[#161418]" style={{ height }} />}
            </section>
          );
        })}
      </div>
    </div>
  );
}
