import type { Metadata } from "next";
import { Suspense } from "react";

import { PracticeView } from "@/components/platform/practice-view";

export const metadata: Metadata = { title: "Targeted practice" };

export default function PracticePage() {
  return (
    <Suspense fallback={<div className="content-shell py-12 text-sm text-[#C7C5CC]">Loading practice…</div>}>
      <PracticeView />
    </Suspense>
  );
}
