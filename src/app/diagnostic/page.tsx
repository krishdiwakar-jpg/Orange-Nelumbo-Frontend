import type { Metadata } from "next";

import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { DiagnosticExperience } from "@/components/marketing/diagnostic-experience";

export const metadata: Metadata = {
  title: "Free JEE diagnostic sample",
  description:
    "Try a five-question JEE diagnostic sample and see an immediate, directional subject-gap map.",
};

export default function DiagnosticPage() {
  return (
    <div className="min-h-screen bg-[#0E0D10] text-white">
      <MarketingHeader />
      <DiagnosticExperience />
      <MarketingFooter />
    </div>
  );
}
