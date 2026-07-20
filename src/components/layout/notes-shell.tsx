"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, LockKeyhole } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { useApp } from "@/components/providers/app-provider";

export function NotesShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { hydrated, isAuthenticated, onboardingComplete } = useApp();

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) router.replace(`/login?returnTo=${encodeURIComponent(pathname)}`);
    else if (!onboardingComplete) router.replace(`/onboarding?returnTo=${encodeURIComponent(pathname)}`);
  }, [hydrated, isAuthenticated, onboardingComplete, pathname, router]);

  if (!hydrated || !isAuthenticated || !onboardingComplete) {
    return <main className="grid min-h-screen place-items-center bg-[#0E0D10]"><Logo compact /></main>;
  }

  return (
    <div className="learning-surface min-h-screen bg-[#0E0D10] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0E0D10]">
        <div className="mx-auto flex h-16 max-w-[1460px] items-center justify-between gap-4 px-4 sm:px-7 lg:px-10">
          <Link className="flex min-h-11 items-center gap-2 text-sm font-semibold text-[#C7C5CC] hover:text-white" href="/learn">
            <ArrowLeft size={17} /> Notes library
          </Link>
          <Logo href="/dashboard" />
          <div className="flex items-center gap-2 text-xs text-[#C7C5CC]/75">
            <LockKeyhole size={14} className="text-[#3DE08A]" />
            <span className="hidden sm:inline">Protected reader</span>
          </div>
        </div>
      </header>
      <main id="main-content">{children}</main>
    </div>
  );
}
