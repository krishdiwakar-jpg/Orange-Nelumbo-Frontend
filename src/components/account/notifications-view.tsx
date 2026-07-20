"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Bell,
  BookOpen,
  CheckCheck,
  ChevronRight,
  CreditCard,
  FlaskConical,
  Megaphone,
  Target,
  Trophy,
  X,
  type LucideIcon,
} from "lucide-react";

import { notificationStorageKey, useDeviceState } from "@/components/account/use-device-state";
import { useApp } from "@/components/providers/app-provider";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { notifications } from "@/data/platform";
import type { Notification } from "@/types/platform";

type InboxFilter = "all" | "unread";

interface NotificationDeviceState {
  readById: Record<string, boolean>;
  dismissedIds: string[];
}

const defaultState: NotificationDeviceState = {
  readById: Object.fromEntries(notifications.map((notification) => [notification.id, notification.read])),
  dismissedIds: [],
};

const typeMeta: Record<
  Notification["type"],
  { label: string; icon: LucideIcon; tone: BadgeTone; accent: string }
> = {
  study: { label: "Study", icon: BookOpen, tone: "brand", accent: "text-[#FF8A3D]" },
  test: { label: "Test", icon: Target, tone: "warning", accent: "text-[#F6C344]" },
  achievement: { label: "Milestone", icon: Trophy, tone: "success", accent: "text-[#3DE08A]" },
  announcement: { label: "Update", icon: Megaphone, tone: "cyan", accent: "text-[#3DE0D0]" },
  billing: { label: "Plan", icon: CreditCard, tone: "neutral", accent: "text-[#C7C5CC]" },
};

function normaliseNotificationState(value: unknown, fallback: NotificationDeviceState) {
  if (!value || typeof value !== "object") return fallback;
  const candidate = value as Partial<NotificationDeviceState>;
  const storedRead =
    candidate.readById && typeof candidate.readById === "object" ? candidate.readById : {};
  return {
    readById: { ...fallback.readById, ...storedRead },
    dismissedIds: Array.isArray(candidate.dismissedIds)
      ? candidate.dismissedIds.filter((id): id is string => typeof id === "string")
      : [],
  };
}

function notificationRoute(notification: Notification) {
  if (notification.id === "notification-mock-registration") return "/mocks/all-india-mock-12";
  if (notification.href?.startsWith("/notes/")) return notification.href.replace("/notes/", "/learn/");
  if (notification.href === "/settings/billing") return "/settings#plan";
  return notification.href ?? "/notifications";
}

function notificationTime(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(new Date(iso));
}

export function NotificationsView() {
  const { user } = useApp();
  const userId = user?.id ?? "preview";
  const [filter, setFilter] = useState<InboxFilter>("all");
  const [state, setState, storageReady] = useDeviceState(
    notificationStorageKey(userId),
    defaultState,
    normaliseNotificationState,
  );

  const available = useMemo(
    () => notifications.filter((notification) => !state.dismissedIds.includes(notification.id)),
    [state.dismissedIds],
  );
  const unreadCount = available.filter((notification) => !state.readById[notification.id]).length;
  const visible = filter === "unread"
    ? available.filter((notification) => !state.readById[notification.id])
    : available;

  function setRead(id: string, read: boolean) {
    setState((current) => ({
      ...current,
      readById: { ...current.readById, [id]: read },
    }));
  }

  function markAllRead() {
    setState((current) => ({
      ...current,
      readById: {
        ...current.readById,
        ...Object.fromEntries(available.map((notification) => [notification.id, true])),
      },
    }));
  }

  function dismiss(id: string) {
    setState((current) => ({
      ...current,
      dismissedIds: current.dismissedIds.includes(id)
        ? current.dismissedIds
        : [...current.dismissedIds, id],
    }));
  }

  return (
    <div className="content-shell pb-28 pt-8 lg:pb-14 lg:pt-10">
      <SectionHeader
        action={
          unreadCount > 0 ? (
            <Button disabled={!storageReady} onClick={markAllRead} size="sm" variant="secondary">
              <CheckCheck aria-hidden="true" className="size-4" />
              Mark all read
            </Button>
          ) : null
        }
        description="Study prompts, test windows, plan notices, and product updates. Read state is stored only in this browser for the preview."
        kicker="Signal inbox · device local"
        level={2}
        title="Only the alerts that change your next move."
      />

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section aria-labelledby="notification-list-title" className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-4 border border-[#FF5A1F]/22 bg-[#161418] px-4 py-3 sm:px-5">
            <div className="flex gap-2" role="group" aria-label="Filter notifications">
              {(["all", "unread"] as InboxFilter[]).map((option) => (
                <button
                  key={option}
                  aria-pressed={filter === option}
                  className={`min-h-11 border px-4 text-xs font-bold capitalize transition ${
                    filter === option
                      ? "border-[#FF5A1F] bg-[#FF5A1F]/10 text-white"
                      : "border-white/10 text-[#C7C5CC]/80 hover:border-white/25 hover:text-white"
                  }`}
                  onClick={() => setFilter(option)}
                  type="button"
                >
                  {option} {option === "unread" ? `(${unreadCount})` : `(${available.length})`}
                </button>
              ))}
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[.15em] text-[#C7C5CC]/70" id="notification-list-title">
              IST · newest first
            </p>
          </div>

          {visible.length ? (
            <div className="border-x border-b border-[#FF5A1F]/22">
              {visible.map((notification) => {
                const meta = typeMeta[notification.type];
                const Icon = meta.icon;
                const read = Boolean(state.readById[notification.id]);
                return (
                  <article
                    className={`group grid gap-4 border-b border-white/8 p-5 last:border-b-0 sm:grid-cols-[48px_minmax(0,1fr)_auto] sm:p-6 ${
                      read ? "bg-[#161418]" : "bg-[#1E1B20]"
                    }`}
                    key={notification.id}
                  >
                    <div className={`grid size-11 place-items-center border border-white/10 bg-[#0E0D10] ${meta.accent}`}>
                      <Icon aria-hidden="true" size={19} strokeWidth={1.6} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone={meta.tone}>{meta.label}</Badge>
                        {!read ? <span className="size-2 bg-[#FF5A1F] shadow-[0_0_10px_rgba(255,90,31,.75)]" aria-label="Unread" /> : null}
                        <time className="font-mono text-[11px] uppercase tracking-[.12em] text-[#C7C5CC]/70" dateTime={notification.createdAt}>
                          {notificationTime(notification.createdAt)}
                        </time>
                      </div>
                      <h3 className="mt-3 font-display text-lg font-semibold text-white">{notification.title}</h3>
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-[#C7C5CC]">{notification.body}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
                        {notification.href ? (
                          <Link
                            className="inline-flex min-h-11 items-center gap-2 text-xs font-bold text-[#FF8A3D] hover:text-[#FF5A1F]"
                            href={notificationRoute(notification)}
                            onClick={() => setRead(notification.id, true)}
                          >
                            {notification.actionLabel ?? "Open"} <ChevronRight aria-hidden="true" size={14} />
                          </Link>
                        ) : null}
                        <button
                          className="min-h-11 text-xs font-semibold text-[#C7C5CC]/80 hover:text-white"
                          onClick={() => setRead(notification.id, !read)}
                          type="button"
                        >
                          Mark {read ? "unread" : "read"}
                        </button>
                      </div>
                    </div>
                    <button
                      aria-label={`Dismiss ${notification.title}`}
                      className="grid size-11 place-items-center border border-white/8 text-[#C7C5CC]/70 transition hover:border-[#E0483C]/45 hover:text-[#E0483C]"
                      onClick={() => dismiss(notification.id)}
                      type="button"
                    >
                      <X aria-hidden="true" size={16} />
                    </button>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="grid min-h-80 place-items-center border-x border-b border-[#FF5A1F]/22 bg-[#161418] px-6 text-center">
              <div>
                <Bell aria-hidden="true" className="mx-auto text-[#FF8A3D]" size={34} strokeWidth={1.4} />
                <h3 className="mt-5 font-display text-2xl font-semibold">{filter === "unread" ? "You are all caught up." : "Inbox cleared on this device."}</h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#C7C5CC]/80">
                  {filter === "unread"
                    ? "There are no unread prompts. Your next study block is still available in the planner."
                    : "Dismissed preview alerts remain hidden in this browser until the demo is reset."}
                </p>
              </div>
            </div>
          )}
        </section>

        <aside className="space-y-5">
          <Card className="p-6" variant="priority">
            <p className="mono-kicker">Inbox status</p>
            <p className="mt-5 font-mono text-4xl font-semibold text-[#FF8A3D]">{unreadCount}</p>
            <p className="mt-2 text-sm text-[#C7C5CC]">unread signal{unreadCount === 1 ? "" : "s"}</p>
            <div className="mt-5 h-1.5 bg-[#2A262E]">
              <div
                className="h-full bg-[#FF5A1F] transition-[width]"
                style={{ width: `${available.length ? ((available.length - unreadCount) / available.length) * 100 : 100}%` }}
              />
            </div>
          </Card>
          <Card className="p-6" variant="subtle">
            <div className="flex items-center gap-3">
              <FlaskConical aria-hidden="true" className="text-[#3DE0D0]" size={20} />
              <p className="font-mono text-[11px] uppercase tracking-[.16em] text-[#3DE0D0]">Demo transparency</p>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#C7C5CC]/80">
              These are sample alerts. No email, SMS, push service, or backend inbox is connected yet.
            </p>
            <Link className="mt-5 inline-flex text-xs font-bold text-[#FF8A3D]" href="/settings">
              Notification preferences →
            </Link>
          </Card>
        </aside>
      </div>
    </div>
  );
}
