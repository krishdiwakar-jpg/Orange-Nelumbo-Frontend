import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Logo } from "@/components/brand/logo";

export default function NotFound() {
  return (
    <main id="main-content" className="hero-grid grid min-h-screen place-items-center bg-[#0E0D10] px-5 text-white">
      <div className="max-w-2xl border border-[#FF5A1F]/25 bg-[#161418]/90 p-8 sm:p-12">
        <Logo href="/" />
        <p className="kicker mt-12">404 — Off trajectory</p>
        <h1 className="mt-5 font-display text-5xl font-bold tracking-[-.02em]">This path has no next concept.</h1>
        <p className="mt-5 text-lg leading-8 text-[#C7C5CC]">The page moved, the link is incomplete, or the route never existed. Return to the learning library.</p>
        <Link className="button-primary mt-8 inline-flex" href="/"><ArrowLeft size={17} /> Back home</Link>
      </div>
    </main>
  );
}
