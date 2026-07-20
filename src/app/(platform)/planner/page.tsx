import type { Metadata } from "next";

import { PlannerView } from "@/components/platform/planner-view";

export const metadata: Metadata = { title: "Adaptive planner" };

export default function PlannerPage() {
  return <PlannerView />;
}
