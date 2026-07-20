import type { Metadata } from "next";
import { Suspense } from "react";

import { PracticeSession } from "@/components/platform/practice-session";

export const metadata: Metadata = { title: "Practice session" };

export default function PracticeSessionPage() {
  return <Suspense fallback={<div className="content-shell py-12 text-[#C7C5CC]/70">Preparing question set…</div>}><PracticeSession /></Suspense>;
}
