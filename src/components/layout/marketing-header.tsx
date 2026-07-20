"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, LogOut, Menu, Settings, UserRound } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { useApp } from "@/components/providers/app-provider";

const links = [
  { href: "/#notes", label: "Visual notes" },
  { href: "/#simulations", label: "Simulations" },
  { href: "/#educators", label: "Educators" },
  { href: "/#videos", label: "Videos" },
  { href: "/#faqs", label: "FAQs" },
];

function AccountMenu() {
  const { signOut, user } = useApp();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Open account menu"
        className="flex min-h-11 items-center gap-2 border border-white/12 bg-[#161418] px-2.5 transition hover:border-[#FF5A1F]/45"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="grid size-8 place-items-center bg-[#FF5A1F] text-xs font-bold text-[#0E0D10]">
          {user?.initials || user?.name?.charAt(0) || "U"}
        </span>
        <span className="hidden max-w-28 truncate text-sm font-semibold lg:block">{user?.firstName || "Account"}</span>
        <ChevronDown className={`hidden text-[#C7C5CC] transition lg:block ${open ? "rotate-180" : ""}`} size={14} />
      </button>

      {open ? (
        <div className="absolute right-0 top-[52px] z-[70] w-64 border border-[#FF5A1F]/24 bg-[#161418] p-2 shadow-2xl" role="menu">
          <div className="border-b border-white/8 px-3 py-3">
            <p className="truncate text-sm font-semibold text-white">{user?.name || "Student"}</p>
            <p className="mt-1 truncate text-xs text-[#C7C5CC]/70">{user?.email}</p>
          </div>
          <Link className="mt-2 flex min-h-11 items-center gap-3 px-3 text-sm text-[#C7C5CC] hover:bg-white/5 hover:text-white" href="/profile" onClick={() => setOpen(false)} role="menuitem">
            <UserRound size={17} /> Profile
          </Link>
          <Link className="flex min-h-11 items-center gap-3 px-3 text-sm text-[#C7C5CC] hover:bg-white/5 hover:text-white" href="/settings" onClick={() => setOpen(false)} role="menuitem">
            <Settings size={17} /> Settings
          </Link>
          <button
            className="flex min-h-11 w-full items-center gap-3 px-3 text-sm text-[#E0483C] hover:bg-[#E0483C]/8"
            onClick={() => {
              setOpen(false);
              signOut();
            }}
            role="menuitem"
            type="button"
          >
            <LogOut size={17} /> Log out
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function MarketingHeader() {
  const { hydrated, isAuthenticated, signOut, user } = useApp();

  return (
    <header className="sticky top-0 z-50 h-[74px] border-b border-[#FF5A1F]/20 bg-[#0E0D10]/92 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-14">
        <Logo href="/" />
        <nav aria-label="Primary navigation" className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link className="flex min-h-11 items-center text-sm font-semibold text-[#C7C5CC] transition-colors hover:text-white" href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {!hydrated ? <div aria-hidden="true" className="hidden h-11 w-28 border border-white/8 sm:block" /> : isAuthenticated ? (
            <AccountMenu />
          ) : (
            <div className="hidden items-center gap-3 sm:flex">
              <Link className="button-ghost" href="/login?returnTo=%2F">Sign in</Link>
              <Link className="button-outline" href="/signup">Explore free</Link>
            </div>
          )}

          <details className="group relative lg:hidden">
            <summary aria-label="Open navigation" className="grid size-11 cursor-pointer list-none place-items-center border border-[#FF5A1F]/30 text-white marker:hidden">
              <Menu aria-hidden="true" size={21} strokeWidth={1.7} />
            </summary>
            <div className="absolute right-0 top-[54px] w-[min(88vw,320px)] border border-[#FF5A1F]/25 bg-[#161418] p-4 shadow-2xl">
              <nav aria-label="Mobile navigation" className="grid">
                {links.map((link) => <Link className="border-b border-white/8 px-3 py-4 font-semibold text-[#C7C5CC] hover:text-white" href={link.href} key={link.href}>{link.label}</Link>)}
                {hydrated && isAuthenticated ? (
                  <div className="mt-4 border-t border-white/8 pt-3 sm:hidden">
                    <p className="px-3 py-2 text-sm font-semibold">{user?.name}</p>
                    <Link className="flex min-h-11 items-center gap-3 px-3 text-sm text-[#C7C5CC]" href="/profile"><UserRound size={17} /> Profile</Link>
                    <Link className="flex min-h-11 items-center gap-3 px-3 text-sm text-[#C7C5CC]" href="/settings"><Settings size={17} /> Settings</Link>
                    <button className="flex min-h-11 w-full items-center gap-3 px-3 text-sm text-[#E0483C]" onClick={signOut} type="button"><LogOut size={17} /> Log out</button>
                  </div>
                ) : hydrated ? (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:hidden">
                    <Link className="button-ghost justify-center" href="/login?returnTo=%2F">Sign in</Link>
                    <Link className="button-outline justify-center" href="/signup">Explore free</Link>
                  </div>
                ) : null}
              </nav>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
