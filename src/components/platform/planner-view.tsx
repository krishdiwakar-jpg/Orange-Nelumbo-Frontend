"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, CalendarDays, Check, ChevronLeft, ChevronRight, Clock3, Coffee, Sparkles, Target, Trophy } from "lucide-react";

import { useApp } from "@/components/providers/app-provider";
import { plannerItems } from "@/data/platform";
import type { PlannerItem } from "@/types/platform";

const baseDates = ["2026-07-17", "2026-07-18", "2026-07-19", "2026-07-20", "2026-07-21", "2026-07-22", "2026-07-23"];

function shiftDate(date: string, offsetDays: number) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + offsetDays);
  return value.toISOString().slice(0, 10);
}

function describeDate(date: string) {
  const value = new Date(`${date}T12:00:00Z`);
  return {
    date,
    day: new Intl.DateTimeFormat("en-IN", { weekday: "short", timeZone: "UTC" }).format(value),
    number: new Intl.DateTimeFormat("en-IN", { day: "2-digit", timeZone: "UTC" }).format(value),
    month: new Intl.DateTimeFormat("en-IN", { month: "long", timeZone: "UTC" }).format(value),
  };
}

const typeMeta: Record<PlannerItem["type"], { label: string; icon: typeof BookOpen; color: string }> = {
  lesson: { label: "Learn", icon: BookOpen, color: "#FF8A3D" },
  practice: { label: "Practice", icon: Target, color: "#3DE0D0" },
  mock: { label: "Mock", icon: Trophy, color: "#F6C344" },
  revision: { label: "Review", icon: Sparkles, color: "#3DE08A" },
  break: { label: "Break", icon: Coffee, color: "#C7C5CC" },
};

function routeFor(item: PlannerItem) {
  if (!item.href) return "/dashboard";
  return item.href.replace(/^\/notes/, "/learn").replace(/^\/practice\/results/, "/results");
}

export function PlannerView() {
  const { completedPlannerItemIds, togglePlannerItem } = useApp();
  const [selectedDate, setSelectedDate] = useState("2026-07-18");
  const [weekOffset, setWeekOffset] = useState(0);
  const days = useMemo(() => baseDates.map((date) => describeDate(shiftDate(date, weekOffset * 7))), [weekOffset]);

  const selectedItems = useMemo(() => plannerItems.filter((item) => item.date === selectedDate), [selectedDate]);
  const plannedMinutes = selectedItems.reduce((sum, item) => sum + item.durationMinutes, 0);
  const completedMinutes = selectedItems.reduce(
    (sum, item) => sum + (item.status === "completed" || completedPlannerItemIds.includes(item.id) ? item.durationMinutes : 0),
    0,
  );
  const selectedDay = days.find((day) => day.date === selectedDate) ?? days[1];
  const weekRange = `${days[0].number} ${days[0].month === days[6].month ? "" : `${days[0].month} `}–${days[6].number} ${days[6].month}`;

  function moveWeek(direction: -1 | 1) {
    const nextOffset = weekOffset + direction;
    setWeekOffset(nextOffset);
    setSelectedDate(shiftDate(baseDates[0], nextOffset * 7));
  }

  return (
    <div className="content-shell pb-28 pt-8 lg:pb-14 lg:pt-10">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="mono-kicker">02 — Adaptive week</p>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">Protect the work that moves your rank.</h2>
          <p className="mt-3 max-w-2xl text-[#C7C5CC]">The engine balances retrieval, new concepts, practice, and recovery around your available time.</p>
        </div>
        <div className="flex items-center border border-[#FF5A1F]/22 bg-[#161418]">
          <button aria-label="Previous week" className="grid size-11 place-items-center border-r border-white/8 text-[#C7C5CC]/80 hover:text-white" onClick={() => moveWeek(-1)} type="button"><ChevronLeft size={18} /></button>
          <div aria-live="polite" className="min-w-32 px-5 text-center"><p className="font-mono text-[11px] tracking-[.16em] text-[#C7C5CC]/70">WEEK {29 + weekOffset}</p><p className="mt-1 text-sm font-semibold">{weekRange}</p></div>
          <button aria-label="Next week" className="grid size-11 place-items-center border-l border-white/8 text-[#C7C5CC]/80 hover:text-white" onClick={() => moveWeek(1)} type="button"><ChevronRight size={18} /></button>
        </div>
      </div>

      <div className="mt-9 overflow-x-auto">
        <div className="grid min-w-[350px] grid-cols-7 border-l border-t border-[#FF5A1F]/22">
          {days.map((day) => {
          const items = plannerItems.filter((item) => item.date === day.date);
          const active = selectedDate === day.date;
          const complete = items.length > 0 && items.every((item) => item.status === "completed" || completedPlannerItemIds.includes(item.id));
          return (
            <button
              aria-pressed={active}
              className={`relative min-h-[86px] border-b border-r border-[#FF5A1F]/22 p-2 text-center transition sm:min-h-[104px] ${active ? "bg-[#FF5A1F] text-[#0E0D10]" : "bg-[#161418] hover:bg-[#1E1B20]"}`}
              key={day.date}
              onClick={() => setSelectedDate(day.date)}
              type="button"
            >
              <span className={`block font-mono text-[11px] uppercase tracking-[.14em] ${active ? "text-[#3A2418]" : "text-[#C7C5CC]/70"}`}>{day.day}</span>
              <span className="mt-2 block font-mono text-xl font-semibold sm:text-2xl">{day.number}</span>
              <span className={`mx-auto mt-2 block h-1 w-8 ${complete ? "bg-[#3DE08A]" : items.length ? active ? "bg-[#0E0D10]" : "bg-[#FF8A3D]" : "bg-transparent"}`} />
            </button>
          );
          })}
        </div>
      </div>

      <div className="mt-7 grid gap-6 xl:grid-cols-[1fr_340px]">
        <section aria-labelledby="day-plan-title" className="border border-[#FF5A1F]/22 bg-[#161418]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 px-5 py-5 sm:px-7">
            <div>
              <p className="mono-kicker">{selectedDay.day} · {selectedDay.number} {selectedDay.month}</p>
              <h3 className="mt-2 font-display text-2xl font-semibold" id="day-plan-title">{selectedItems.length ? `${selectedItems.length} precision blocks` : "Recovery buffer"}</h3>
            </div>
            <div className="font-mono text-xs text-[#3DE0D0]">{completedMinutes} / {plannedMinutes || 45} MIN</div>
          </div>
          {selectedItems.length > 0 ? (
            <div className="divide-y divide-white/8">
              {selectedItems.map((item) => {
                const meta = typeMeta[item.type];
                const Icon = meta.icon;
                const done = item.status === "completed" || completedPlannerItemIds.includes(item.id);
                return (
                  <article className={`grid gap-4 px-5 py-6 sm:grid-cols-[70px_1fr_auto] sm:items-center sm:px-7 ${done ? "opacity-65" : ""}`} key={item.id}>
                    <div>
                      <p className="font-mono text-sm text-[#C7C5CC]">{item.startTime ?? "FLEX"}</p>
                      <p className="mt-1 font-mono text-[11px] text-[#C7C5CC]/70">{item.durationMinutes} MIN</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="grid size-11 shrink-0 place-items-center border" style={{ borderColor: `${meta.color}55`, color: meta.color }}><Icon size={19} strokeWidth={1.6} /></div>
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-[.16em]" style={{ color: meta.color }}>{meta.label}{item.subjectId ? ` · ${item.subjectId}` : ""}</p>
                        <h4 className={`mt-2 text-base font-semibold ${done ? "line-through" : ""}`}>{item.title}</h4>
                        <p className="mt-1 max-w-2xl text-sm leading-6 text-[#C7C5CC]/80">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:justify-end">
                      {!done && item.href && <Link className="button-ghost min-h-11 px-4 text-xs" href={routeFor(item)}>Open</Link>}
                      <button aria-label={done ? `Mark ${item.title} incomplete` : `Complete ${item.title}`} className={`grid size-11 place-items-center border ${done ? "border-[#3DE08A] bg-[#3DE08A] text-[#0E0D10]" : "border-white/12 text-[#C7C5CC]/70 hover:border-[#3DE08A] hover:text-[#3DE08A]"}`} onClick={() => togglePlannerItem(item.id)} type="button"><Check size={18} /></button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="grid min-h-64 place-items-center px-6 text-center">
              <div><Coffee className="mx-auto text-[#FF8A3D]" size={30} strokeWidth={1.4} /><h4 className="mt-5 font-display text-2xl font-semibold">No hard blocks scheduled.</h4><p className="mt-3 max-w-md text-[#C7C5CC]/80">Use the buffer for recovery, backlog, or a short mixed-recall set. The planner protects empty space on purpose.</p></div>
            </div>
          )}
        </section>

        <aside className="space-y-5">
          <div className="border border-[#FF5A1F]/22 bg-[#161418] p-6">
            <div className="flex items-center justify-between"><p className="mono-kicker">Daily load</p><CalendarDays className="text-[#FF8A3D]" size={20} /></div>
            <p className="mt-6 font-mono text-4xl font-semibold">{plannedMinutes}<span className="ml-2 text-sm text-[#C7C5CC]/70">MIN</span></p>
            <div className="mt-5 h-1.5 bg-[#2A262E]"><div className="h-full bg-[#FF5A1F]" style={{ width: `${Math.min(100, (completedMinutes / Math.max(plannedMinutes, 1)) * 100)}%` }} /></div>
            <p className="mt-4 text-sm leading-6 text-[#C7C5CC]/80">Target range: 75–120 focused minutes. Breaks are not counted.</p>
          </div>
          <div className="border border-[#3DE0D0]/22 bg-[#161418] p-6">
            <div className="flex items-center gap-3"><span className="size-2 bg-[#3DE0D0]" /><p className="font-mono text-[11px] uppercase tracking-[.16em] text-[#3DE0D0]">Engine note</p></div>
            <p className="mt-5 font-display text-xl font-semibold">Physics carries 52% of today&apos;s load.</p>
            <p className="mt-3 text-sm leading-6 text-[#C7C5CC]/80">Recent mock errors show a higher return on mechanics work than another broad chemistry revision.</p>
          </div>
          <div className="border border-white/9 bg-[#0E0D10] p-5">
            <p className="flex items-center gap-2 text-sm font-semibold"><Clock3 className="text-[#FF8A3D]" size={17} /> Study window</p>
            <p className="mt-3 text-sm text-[#C7C5CC]/80">Weekdays 18:00–21:00 · Weekends flexible</p>
            <Link className="mt-4 inline-flex text-xs font-bold text-[#FF8A3D]" href="/settings">Adjust availability →</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
