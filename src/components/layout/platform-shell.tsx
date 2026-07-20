"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Bookmark,
  BookOpen,
  ChevronDown,
  CircleHelp,
  FlaskConical,
  House,
  LogOut,
  Menu,
  PlaySquare,
  Search,
  Settings,
  UserRound,
  X,
} from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { useApp } from "@/components/providers/app-provider";

const mainNavigation = [
  { href: "/dashboard", label: "Home", icon: House },
  { href: "/learn", label: "Visual notes", icon: BookOpen },
  { href: "/simulations", label: "Simulations", icon: FlaskConical },
  { href: "/videos", label: "Video lectures", icon: PlaySquare },
];

const utilityNavigation = [
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
];

const accountNavigation = [
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help centre", icon: CircleHelp },
];

const searchItems = [
  { title: "Motion under gravity", meta: "Physics · Visual note", href: "/notes/physics/kinematics/motion-under-gravity" },
  { title: "Vertical throw", meta: "Physics · Simulation", href: "/simulations/vertical-throw" },
  { title: "Rotational motion", meta: "Physics · Visual note", href: "/learn/physics/rotational-motion" },
  { title: "Chemical bonding", meta: "Chemistry · Visual note", href: "/learn/chemistry/chemical-bonding" },
  { title: "Integration", meta: "Mathematics · Visual note", href: "/notes/mathematics/calculus/integration" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`));
}

function pageTitle(pathname: string) {
  const segment = pathname.split("/").filter(Boolean)[0] ?? "dashboard";
  const titles: Record<string, string> = {
    dashboard: "Learning home",
    learn: "Visual notes",
    videos: "Video lectures",
    simulations: "Simulations",
    bookmarks: "Saved notes",
    notifications: "Notifications",
    profile: "Student profile",
    settings: "Settings",
  };
  return titles[segment] ?? "Orange Nelumbo";
}

export function PlatformShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { hydrated, isAuthenticated, onboardingComplete, user, signOut } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [desktopNavigation, setDesktopNavigation] = useState(false);
  const [query, setQuery] = useState("");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const sidebarReturnFocusRef = useRef<HTMLElement | null>(null);
  const searchDialogRef = useRef<HTMLDivElement>(null);
  const searchReturnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    const currentPath = `${pathname}${window.location.search}`;
    if (!isAuthenticated) router.replace(`/login?returnTo=${encodeURIComponent(currentPath)}`);
    else if (!onboardingComplete) router.replace(`/onboarding?returnTo=${encodeURIComponent(currentPath)}`);
  }, [hydrated, isAuthenticated, onboardingComplete, pathname, router]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const updateNavigationMode = () => setDesktopNavigation(media.matches);
    updateNavigationMode();
    media.addEventListener("change", updateNavigationMode);
    return () => media.removeEventListener("change", updateNavigationMode);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setAccountOpen(false);
        setSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!sidebarOpen || desktopNavigation) return;
    const sidebar = sidebarRef.current;
    if (!sidebar) return;
    const returnFocusTarget = sidebarReturnFocusRef.current ?? menuButtonRef.current;
    const focusables = Array.from(
      sidebar.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])'),
    ).filter((element) => !element.hasAttribute("disabled"));
    focusables[0]?.focus();
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", trapFocus);
    return () => {
      document.removeEventListener("keydown", trapFocus);
      returnFocusTarget?.focus();
    };
  }, [desktopNavigation, sidebarOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const dialog = searchDialogRef.current;
    if (!dialog) return;
    searchReturnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusables = Array.from(dialog.querySelectorAll<HTMLElement>('button, [href], input, [tabindex]:not([tabindex="-1"])')).filter((element) => !element.hasAttribute("disabled"));
    const focusTimer = window.setTimeout(() => focusables[0]?.focus(), 0);
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", trapFocus);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", trapFocus);
      searchReturnFocusRef.current?.focus();
    };
  }, [searchOpen]);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return searchItems;
    return searchItems.filter((item) => `${item.title} ${item.meta}`.toLowerCase().includes(normalized));
  }, [query]);

  if (!hydrated || !isAuthenticated) {
    return (
      <main className="hero-grid grid min-h-screen place-items-center bg-[#0E0D10] text-white">
        <div className="grid justify-items-center gap-5">
          <Logo compact />
          <div className="h-1 w-36 overflow-hidden bg-[#2A262E]">
            <div className="h-full w-1/2 animate-pulse bg-[#FF5A1F]" />
          </div>
          <p className="text-sm text-[#C7C5CC]/70">Opening your library…</p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0D10] text-white">
      {sidebarOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          type="button"
        />
      )}

      <aside
        aria-hidden={searchOpen || (!desktopNavigation && !sidebarOpen) || undefined}
        className={`fixed inset-y-0 left-0 z-50 flex w-[278px] flex-col border-r border-[#FF5A1F]/20 bg-[#161418] transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        inert={searchOpen || (!desktopNavigation && !sidebarOpen)}
        ref={sidebarRef}
      >
        <div className="flex h-[74px] items-center justify-between border-b border-white/8 px-5">
          <Logo href="/dashboard" />
          <button aria-label="Close navigation" className="grid size-11 place-items-center text-[#C7C5CC] lg:hidden" onClick={() => setSidebarOpen(false)} type="button">
            <X size={20} />
          </button>
        </div>
        <div className="scrollbar-thin flex-1 overflow-y-auto px-3 py-5">
          <p className="px-3 text-xs font-semibold text-[#C7C5CC]/60">Learning</p>
          <nav aria-label="Platform navigation" className="mt-3 grid gap-1">
            {mainNavigation.map(({ href, label, icon: Icon }) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={`group flex min-h-11 items-center gap-3 border-l-2 px-3 text-sm font-semibold transition ${active ? "border-[#FF5A1F] bg-[#FF5A1F]/9 text-white" : "border-transparent text-[#C7C5CC]/80 hover:bg-white/[.035] hover:text-white"}`}
                  href={href}
                  key={href}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon aria-hidden="true" className={active ? "text-[#FF8A3D]" : "text-[#C7C5CC]/70 group-hover:text-[#FF8A3D]"} size={18} strokeWidth={1.6} />
                  {label}
                </Link>
              );
            })}
          </nav>
          <p className="mt-7 px-3 text-xs font-semibold text-[#C7C5CC]/60">Your library</p>
          <nav aria-label="Utility navigation" className="mt-3 grid gap-1">
            {utilityNavigation.map(({ href, label, icon: Icon }) => (
              <Link className={`flex min-h-11 items-center gap-3 border-l-2 px-3 text-sm font-semibold transition ${isActive(pathname, href) ? "border-[#FF5A1F] bg-[#FF5A1F]/9 text-white" : "border-transparent text-[#C7C5CC]/80 hover:text-white"}`} href={href} key={href} onClick={() => setSidebarOpen(false)}>
                <Icon aria-hidden="true" size={18} strokeWidth={1.6} /> {label}
              </Link>
            ))}
          </nav>
          <p className="mt-7 px-3 text-xs font-semibold text-[#C7C5CC]/60">Account</p>
          <nav aria-label="Account navigation" className="mt-3 grid gap-1">
            {accountNavigation.map(({ href, label, icon: Icon }) => (
              <Link className={`flex min-h-11 items-center gap-3 border-l-2 px-3 text-sm font-semibold transition ${isActive(pathname, href) ? "border-[#FF5A1F] bg-[#FF5A1F]/9 text-white" : "border-transparent text-[#C7C5CC]/80 hover:text-white"}`} href={href} key={href} onClick={() => setSidebarOpen(false)}>
                <Icon aria-hidden="true" size={18} strokeWidth={1.6} /> {label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <div aria-hidden={searchOpen || undefined} className="lg:pl-[278px]">
        <header className="sticky top-0 z-30 flex h-[74px] items-center justify-between border-b border-[#FF5A1F]/18 bg-[#0E0D10]/92 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button aria-label="Open navigation" className="grid size-11 shrink-0 place-items-center border border-white/10 text-[#C7C5CC] lg:hidden" onClick={(event) => { sidebarReturnFocusRef.current = event.currentTarget; setSidebarOpen(true); }} ref={menuButtonRef} type="button">
              <Menu size={20} />
            </button>
            <div className="min-w-0">
              <h1 className="truncate font-display text-lg font-semibold sm:text-xl">{pageTitle(pathname)}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="hidden min-h-11 min-w-[220px] items-center gap-3 border border-white/10 bg-[#161418] px-4 text-left text-sm text-[#C7C5CC]/70 hover:border-[#FF5A1F]/35 md:flex" onClick={() => setSearchOpen(true)} type="button">
              <Search size={16} /> Search notes and simulations
              <kbd className="ml-auto border border-white/10 px-1.5 py-0.5 font-mono text-[11px]">⌘ K</kbd>
            </button>
            <button aria-label="Search" className="grid size-11 place-items-center border border-white/10 text-[#C7C5CC] md:hidden" onClick={() => setSearchOpen(true)} type="button"><Search size={18} /></button>
            <Link aria-label="Notifications" className="relative grid size-11 place-items-center border border-white/10 text-[#C7C5CC] hover:border-[#FF5A1F]/35 hover:text-white" href="/notifications">
              <Bell size={18} />
              <span className="absolute right-2 top-2 size-2 bg-[#FF5A1F]" />
            </Link>
            <div className="relative">
              <button aria-expanded={accountOpen} className="flex min-h-11 items-center gap-2 border border-white/10 bg-[#161418] px-2.5 text-left hover:border-[#FF5A1F]/35" onClick={() => setAccountOpen((value) => !value)} type="button">
                <span className="grid size-7 place-items-center bg-[#FF5A1F] font-mono text-xs font-bold text-[#0E0D10]">{(user?.name ?? "A").charAt(0)}</span>
                <span className="hidden max-w-28 truncate text-sm font-semibold xl:block">{user?.name ?? "Aarav"}</span>
                <ChevronDown className="hidden text-[#C7C5CC]/70 xl:block" size={14} />
              </button>
              {accountOpen && (
                <div className="absolute right-0 top-[52px] w-60 border border-[#FF5A1F]/22 bg-[#161418] p-2 shadow-2xl">
                  <div className="border-b border-white/8 px-3 py-3">
                    <p className="font-semibold">{user?.name ?? "Aarav Sharma"}</p>
                    <p className="mt-1 truncate text-xs text-[#C7C5CC]/70">{user?.email ?? "aarav@example.com"}</p>
                  </div>
                  <Link className="mt-2 flex min-h-11 items-center gap-3 px-3 text-sm text-[#C7C5CC] hover:bg-white/5 hover:text-white" href="/profile"><UserRound size={17} /> Profile</Link>
                  <Link className="flex min-h-11 items-center gap-3 px-3 text-sm text-[#C7C5CC] hover:bg-white/5 hover:text-white" href="/settings"><Settings size={17} /> Settings</Link>
                  <button className="flex min-h-11 w-full items-center gap-3 px-3 text-sm text-[#E0483C] hover:bg-[#E0483C]/8" onClick={() => signOut()} type="button"><LogOut size={17} /> Sign out</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main id="main-content" className="min-h-[calc(100vh-74px)]">{children}</main>
        <footer className="border-t border-white/8 px-5 py-7 text-xs leading-5 text-[#C7C5CC] sm:px-8">
          Orange Nelumbo is an independent educational platform and is not affiliated with, endorsed by, or sponsored by the National Testing Agency (NTA), the JEE Apex Board, or the IITs. JEE, JEE Main and JEE Advanced are their respective owners&apos; marks.
        </footer>
      </div>

      <nav aria-hidden={searchOpen || undefined} aria-label="Mobile primary navigation" className="fixed inset-x-0 bottom-0 z-30 grid h-[66px] grid-cols-5 border-t border-[#FF5A1F]/20 bg-[#161418]/96 backdrop-blur lg:hidden">
        {[
          mainNavigation[0],
          mainNavigation[1],
          mainNavigation[2],
          utilityNavigation[0],
          accountNavigation[0],
        ].map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link className={`grid place-items-center content-center gap-1 text-[11px] font-semibold ${active ? "text-[#FF8A3D]" : "text-[#C7C5CC]/70"}`} href={href} key={href}>
              <Icon size={18} strokeWidth={1.7} />
              <span>{label === "Visual notes" ? "Notes" : label}</span>
            </Link>
          );
        })}
      </nav>

      {searchOpen && (
        <div aria-labelledby="concept-search-title" aria-modal="true" className="fixed inset-0 z-[80] bg-black/78 p-4 backdrop-blur-sm" role="dialog">
          <button aria-label="Close search" className="absolute inset-0 size-full cursor-default" onClick={() => setSearchOpen(false)} type="button" />
          <div className="relative mx-auto mt-[8vh] max-w-2xl border border-[#FF5A1F]/30 bg-[#161418] shadow-[0_0_90px_rgba(255,90,31,.12)]" ref={searchDialogRef}>
            <h2 className="sr-only" id="concept-search-title">Search notes and simulations</h2>
            <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
              <Search className="text-[#FF8A3D]" size={20} />
              <input autoFocus className="h-full min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-[#C7C5CC]/70" onChange={(event) => setQuery(event.target.value)} placeholder="Search a note, chapter, or simulation…" value={query} />
              <button aria-label="Close search" className="grid size-11 place-items-center text-[#C7C5CC]/70 hover:text-white" onClick={() => setSearchOpen(false)} type="button"><X size={19} /></button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              <p className="px-3 py-3 font-mono text-[11px] uppercase tracking-[.18em] text-[#C7C5CC]/70">{query ? `${results.length} results` : "Suggested"}</p>
              {results.map((item) => (
                <Link className="group flex items-center justify-between gap-4 border-l-2 border-transparent px-3 py-4 hover:border-[#FF5A1F] hover:bg-white/[.035]" href={item.href} key={item.href} onClick={() => setSearchOpen(false)}>
                  <div>
                    <p className="font-semibold group-hover:text-white">{item.title}</p>
                    <p className="mt-1 text-xs text-[#C7C5CC]/70">{item.meta}</p>
                  </div>
                  <span className="font-mono text-xs text-[#FF8A3D]">↗</span>
                </Link>
              ))}
              {results.length === 0 && <p className="px-3 py-10 text-center text-sm text-[#C7C5CC]/70">No result found. Try a subject or chapter name.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
