"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, FlaskConical } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { useApp } from "@/components/providers/app-provider";

export function FullscreenSimulationShell({
  backHref,
  backLabel,
  children,
  nextHref,
  nextLabel,
  title,
}: {
  backHref: string;
  backLabel: string;
  children: React.ReactNode;
  nextHref?: string;
  nextLabel?: string;
  title: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { hydrated, isAuthenticated, onboardingComplete } = useApp();

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) router.replace(`/login?returnTo=${encodeURIComponent(pathname)}`);
    else if (!onboardingComplete) router.replace(`/onboarding?returnTo=${encodeURIComponent(pathname)}`);
  }, [hydrated, isAuthenticated, onboardingComplete, pathname, router]);

  if (!hydrated || !isAuthenticated || !onboardingComplete) {
    return <main className="grid h-dvh place-items-center bg-[#0E0D10]"><Logo compact /></main>;
  }

  return (
    <div className="learning-surface flex h-dvh min-h-0 flex-col overflow-hidden bg-[#0E0D10] text-white">
      <header className="relative z-40 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#0E0D10]/96 px-3 sm:px-5">
        <Link className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#C7C5CC] hover:text-white" href={backHref}>
          <ArrowLeft size={17} /> <span className="hidden sm:inline">{backLabel}</span><span className="sm:hidden">Back</span>
        </Link>
        <div className="pointer-events-none absolute left-1/2 flex max-w-[48vw] -translate-x-1/2 items-center gap-2 text-center">
          <FlaskConical className="hidden shrink-0 text-[#3DE0D0] sm:block" size={16} />
          <span className="truncate text-sm font-semibold">{title}</span>
        </div>
        {nextHref ? (
          <Link className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#FF8A3D] hover:text-[#FFB06E]" href={nextHref}>
            <span className="hidden sm:inline">{nextLabel ?? "Next topic"}</span><span className="sm:hidden">Next</span> <ArrowRight size={17} />
          </Link>
        ) : <Logo compact href="/dashboard" />}
      </header>
      <main className="min-h-0 flex-1 overflow-hidden" id="main-content">{children}</main>
    </div>
  );
}
