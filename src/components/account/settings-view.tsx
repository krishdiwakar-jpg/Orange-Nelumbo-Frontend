"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  BellRing,
  BookOpenCheck,
  CalendarClock,
  Check,
  ChevronRight,
  CreditCard,
  Database,
  FlaskConical,
  LogOut,
  Mail,
  Monitor,
  Moon,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

import { PreferenceToggle } from "@/components/account/preference-toggle";
import {
  notificationStorageKey,
  settingsStorageKey,
  useDeviceState,
} from "@/components/account/use-device-state";
import { useApp, type AppTheme, type OnboardingProfile, type StudyWindow } from "@/components/providers/app-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { plans, platform } from "@/data/platform";
import { removeDeviceItem } from "@/lib/device-storage";

interface DeviceSettings {
  studyReminders: boolean;
  mockAlerts: boolean;
  weeklySummary: boolean;
  productAnnouncements: boolean;
}

const defaultSettings: DeviceSettings = {
  studyReminders: true,
  mockAlerts: true,
  weeklySummary: true,
  productAnnouncements: false,
};

const themeOptions: Array<{ id: AppTheme; label: string; description: string; icon: typeof Moon }> = [
  { id: "dark", label: "Dark", description: "Use the preview's high-contrast lab canvas.", icon: Moon },
];

const studyWindows: StudyWindow[] = ["Morning", "Afternoon", "Evening", "Flexible"];

function normaliseSettings(value: unknown, fallback: DeviceSettings) {
  if (!value || typeof value !== "object") return fallback;
  const candidate = value as Partial<DeviceSettings>;
  return {
    studyReminders: typeof candidate.studyReminders === "boolean" ? candidate.studyReminders : fallback.studyReminders,
    mockAlerts: typeof candidate.mockAlerts === "boolean" ? candidate.mockAlerts : fallback.mockAlerts,
    weeklySummary: typeof candidate.weeklySummary === "boolean" ? candidate.weeklySummary : fallback.weeklySummary,
    productAnnouncements: typeof candidate.productAnnouncements === "boolean" ? candidate.productAnnouncements : fallback.productAnnouncements,
  };
}

export function SettingsView() {
  const router = useRouter();
  const {
    completeOnboarding,
    onboardingProfile,
    resetDemo,
    setTheme,
    signOut,
    theme,
    user,
  } = useApp();
  const userId = user?.id ?? "preview";
  const isDemoUser = user?.isDemo === true;
  const [preferences, setPreferences, storageReady] = useDeviceState(
    settingsStorageKey(userId),
    defaultSettings,
    normaliseSettings,
  );
  const [resetArmed, setResetArmed] = useState(false);
  const [message, setMessage] = useState("");
  const activePlan = plans.find((plan) => plan.id === user?.activePlanId) ?? plans[0];
  const studyProfile = useMemo<OnboardingProfile>(
    () =>
      onboardingProfile ?? {
        targetExam: user?.targetExam ?? "JEE Advanced",
        targetYear: user?.targetYear ?? 2027,
        classLevel: "Class 12",
        dailyGoalMinutes: 90,
        focusSubjects: ["physics", "mathematics"],
        studyWindow: "Evening",
        city: user?.city ?? "",
      },
    [onboardingProfile, user?.city, user?.targetExam, user?.targetYear],
  );

  function updatePreference<Key extends keyof DeviceSettings>(key: Key, value: DeviceSettings[Key]) {
    setPreferences((current) => ({ ...current, [key]: value }));
    setMessage("Preferences saved on this device.");
  }

  function updateStudyProfile(patch: Partial<OnboardingProfile>) {
    completeOnboarding({ ...studyProfile, ...patch });
    setMessage("Study rhythm updated locally.");
  }

  function confirmReset() {
    resetDemo();
    setPreferences(defaultSettings);
    removeDeviceItem(notificationStorageKey(userId));
    setResetArmed(false);
    setMessage(
      isDemoUser
        ? "The Aarav sample workspace and demo inbox were reset."
        : "Your local progress and preview preferences were reset; your dummy profile was kept.",
    );
  }

  function handleSignOut() {
    signOut();
    router.replace("/login");
  }

  return (
    <div className="content-shell pb-28 pt-8 lg:pb-14 lg:pt-10">
      <SectionHeader
        action={<Badge tone="warning">Front-end preview</Badge>}
        description="Tune appearance, reminders, study rhythm, and sample data. Every control below is local to this browser; no messages or account changes leave the device."
        kicker="Workspace controls · device local"
        level={2}
        title="Make the system quieter and more useful."
      />

      {message ? (
        <div aria-live="polite" className="mt-6 flex items-center gap-3 border border-[#3DE08A]/30 bg-[#3DE08A]/7 px-4 py-3 text-sm text-[#B7F4CE]">
          <Check aria-hidden="true" className="size-4 shrink-0 text-[#3DE08A]" /> {message}
        </div>
      ) : null}

      <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="space-y-6">
          <Card className="p-5 sm:p-7">
            <div className="flex items-start gap-4 border-b border-white/8 pb-5">
              <span className="grid size-11 shrink-0 place-items-center border border-[#FF5A1F]/30 bg-[#FF5A1F]/8 text-[#FF8A3D]"><Monitor aria-hidden="true" size={20} /></span>
              <div><h2 className="font-display text-xl font-semibold">Appearance</h2><p className="mt-2 text-sm leading-6 text-[#C7C5CC]/80">This front-end preview currently ships with one tested, high-contrast dark canvas.</p></div>
            </div>
            <div className="mt-5 grid max-w-sm gap-3">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const active = theme === option.id;
                return (
                  <button
                    aria-pressed={active}
                    className={`relative min-h-32 border p-4 text-left transition ${active ? "border-[#FF5A1F] bg-[#FF5A1F]/10" : "border-white/10 bg-[#0E0D10] hover:border-white/25"}`}
                    key={option.id}
                    onClick={() => { setTheme(option.id); setMessage(`${option.label} appearance preference saved.`); }}
                    type="button"
                  >
                    <Icon aria-hidden="true" className={active ? "text-[#FF8A3D]" : "text-[#C7C5CC]/70"} size={21} />
                    <span className="mt-5 block font-display text-base font-semibold">{option.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-[#C7C5CC]/80">{option.description}</span>
                    {active ? <Check aria-hidden="true" className="absolute right-3 top-3 text-[#3DE08A]" size={16} /> : null}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-5 sm:p-7">
            <div className="flex items-start gap-4 border-b border-white/8 pb-5">
              <span className="grid size-11 shrink-0 place-items-center border border-[#3DE0D0]/30 bg-[#3DE0D0]/8 text-[#3DE0D0]"><BellRing aria-hidden="true" size={20} /></span>
              <div><h2 className="font-display text-xl font-semibold">Notification preferences</h2><p className="mt-2 text-sm leading-6 text-[#C7C5CC]/80">These switches change preview preferences only. Email, SMS, and push delivery are not connected.</p></div>
            </div>
            <PreferenceToggle checked={preferences.studyReminders} description="Surface the next planned lesson or revision block in the sample inbox." disabled={!storageReady} icon={BookOpenCheck} label="Study reminders" onChange={(value) => updatePreference("studyReminders", value)} />
            <PreferenceToggle checked={preferences.mockAlerts} description="Keep registration windows and mock start-time prompts enabled." disabled={!storageReady} icon={Target} label="Mock test alerts" onChange={(value) => updatePreference("mockAlerts", value)} />
            <PreferenceToggle checked={preferences.weeklySummary} description="Store a preference for a weekly accuracy and study-time recap." disabled={!storageReady} icon={Sparkles} label="Weekly progress summary" onChange={(value) => updatePreference("weeklySummary", value)} />
            <PreferenceToggle checked={preferences.productAnnouncements} description="Include new simulations and platform feature announcements." disabled={!storageReady} icon={Mail} label="Product announcements" onChange={(value) => updatePreference("productAnnouncements", value)} />
          </Card>

          <Card className="p-5 sm:p-7">
            <div className="flex items-start gap-4 border-b border-white/8 pb-5">
              <span className="grid size-11 shrink-0 place-items-center border border-[#F6C344]/30 bg-[#F6C344]/8 text-[#F6C344]"><CalendarClock aria-hidden="true" size={20} /></span>
              <div><h2 className="font-display text-xl font-semibold">Study rhythm</h2><p className="mt-2 text-sm leading-6 text-[#C7C5CC]/80">Shared with your profile and used by the front-end planner.</p></div>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <fieldset>
                <legend className="mb-3 text-xs font-bold text-[#C7C5CC]">Daily focused-study target</legend>
                <div className="grid grid-cols-2 gap-2">
                  {[30, 60, 90, 120].map((minutes) => (
                    <button aria-pressed={studyProfile.dailyGoalMinutes === minutes} className={`min-h-11 border px-3 text-sm font-bold ${studyProfile.dailyGoalMinutes === minutes ? "border-[#FF5A1F] bg-[#FF5A1F]/10 text-white" : "border-white/10 bg-[#0E0D10] text-[#C7C5CC]/80 hover:border-white/25"}`} key={minutes} onClick={() => updateStudyProfile({ dailyGoalMinutes: minutes })} type="button">{minutes} min</button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="mb-3 text-xs font-bold text-[#C7C5CC]">Preferred study window</legend>
                <div className="grid grid-cols-2 gap-2">
                  {studyWindows.map((window) => (
                    <button aria-pressed={studyProfile.studyWindow === window} className={`min-h-11 border px-3 text-sm font-bold ${studyProfile.studyWindow === window ? "border-[#FF5A1F] bg-[#FF5A1F]/10 text-white" : "border-white/10 bg-[#0E0D10] text-[#C7C5CC]/80 hover:border-white/25"}`} key={window} onClick={() => updateStudyProfile({ studyWindow: window })} type="button">{window}</button>
                  ))}
                </div>
              </fieldset>
            </div>
          </Card>

          <Card className="p-5 sm:p-7">
            <div className="flex items-start gap-4 border-b border-white/8 pb-5">
              <span className="grid size-11 shrink-0 place-items-center border border-[#E0483C]/30 bg-[#E0483C]/8 text-[#E0483C]"><Database aria-hidden="true" size={20} /></span>
              <div><h2 className="font-display text-xl font-semibold">Preview data</h2><p className="mt-2 text-sm leading-6 text-[#C7C5CC]/80">Reset this user&apos;s progress, planner checks, bookmarks, attempts, and route-local preferences.</p></div>
            </div>
            <div className="mt-6 flex flex-col gap-4 border border-[#E0483C]/25 bg-[#E0483C]/5 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{isDemoUser ? "Reset the Aarav demo" : "Reset local sample progress"}</p>
                <p className="mt-1 text-xs leading-5 text-[#C7C5CC]">This affects only this browser and can be done again anytime.</p>
              </div>
              <div className="flex shrink-0 gap-2">
                {resetArmed ? <Button onClick={() => setResetArmed(false)} variant="ghost">Cancel</Button> : null}
                <Button onClick={() => resetArmed ? confirmReset() : setResetArmed(true)} variant="danger">
                  <RotateCcw aria-hidden="true" className="size-4" /> {resetArmed ? "Confirm reset" : "Reset demo"}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <aside className="space-y-5">
          <Card className="p-6" id="plan" variant="priority">
            <div className="flex items-center justify-between gap-4"><p className="mono-kicker">Current plan</p><CreditCard aria-hidden="true" className="text-[#FF8A3D]" size={20} /></div>
            <h2 className="mt-5 font-display text-2xl font-semibold">{activePlan.name}</h2>
            <p className="mt-3 text-sm leading-6 text-[#C7C5CC]">{activePlan.description}</p>
            <Badge className="mt-5" tone="success">Preview active</Badge>
            <Link className="mt-6 flex min-h-11 items-center justify-between border-t border-white/8 pt-4 text-sm font-bold text-[#FF8A3D]" href="/pricing">Compare access <ChevronRight aria-hidden="true" size={16} /></Link>
          </Card>

          <Card className="p-6" variant="subtle">
            <div className="flex items-center gap-3"><FlaskConical aria-hidden="true" className="text-[#3DE0D0]" size={20} /><p className="font-mono text-[11px] uppercase tracking-[.16em] text-[#3DE0D0]">Demo transparency</p></div>
            <p className="mt-4 text-sm leading-6 text-[#C7C5CC]/80">No backend, payment processor, outbound notification service, or secure account database is connected.</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3"><ShieldCheck aria-hidden="true" className="text-[#3DE08A]" size={20} /><p className="font-display text-lg font-semibold">Session controls</p></div>
            <p className="mt-3 text-sm leading-6 text-[#C7C5CC]/80">Signing out removes the active local session but keeps this browser&apos;s sample preferences.</p>
            <Button className="mt-5" fullWidth onClick={handleSignOut} variant="secondary"><LogOut aria-hidden="true" className="size-4" /> Sign out</Button>
          </Card>

          <Card className="p-6">
            <p className="font-mono text-[11px] uppercase tracking-[.15em] text-[#C7C5CC]/70">Need help?</p>
            <p className="mt-3 text-sm leading-6 text-[#C7C5CC]/80">Browse common account and learning questions or contact the sample support address.</p>
            <Link className="mt-4 inline-flex text-xs font-bold text-[#FF8A3D]" href="/help">Help centre →</Link>
            <p className="mt-3 text-xs text-[#C7C5CC]/70">{platform.supportEmail}</p>
          </Card>
        </aside>
      </div>
    </div>
  );
}
