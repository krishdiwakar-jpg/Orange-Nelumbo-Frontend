"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  listDeviceKeys,
  readDeviceItem,
  readDeviceJson,
  removeDeviceItem,
  writeDeviceJson,
} from "@/lib/device-storage";
import type { LearningStatus, SubjectId } from "@/types/platform";

const APP_STORAGE_KEY = "orange-nelumbo:app:v1";
const ACCOUNT_STORAGE_KEY = "orange-nelumbo:accounts:v1";
const USER_STATE_PREFIX = "orange-nelumbo:user:v1:";

export type AppTheme = "light" | "dark" | "system";
export type TargetExam = "JEE Main" | "JEE Advanced";
export type ClassLevel = "Class 11" | "Class 12" | "Dropper";
export type StudyWindow = "Morning" | "Afternoon" | "Evening" | "Flexible";

export interface AppUser {
  id: string;
  name: string;
  firstName: string;
  initials: string;
  email: string;
  city: string;
  targetExam: TargetExam;
  targetYear: number;
  examDate: string;
  activePlanId: "notes" | "complete" | "practice";
  readingStreak: number;
  joinedAt: string;
  onboardingComplete: boolean;
  isDemo?: boolean;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignUpInput extends LoginInput {
  name: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  user?: AppUser;
}

export interface OnboardingProfile {
  targetExam: TargetExam;
  targetYear: number;
  classLevel: ClassLevel;
  dailyGoalMinutes: number;
  focusSubjects: SubjectId[];
  studyWindow: StudyWindow;
  city: string;
}

export interface TopicProgressEntry {
  status: LearningStatus;
  progress: number;
  updatedAt: string;
}

interface PersistedAppState {
  user: AppUser | null;
  onboardingProfile: OnboardingProfile | null;
  topicProgress: Record<string, TopicProgressEntry>;
  bookmarkedTopicIds: string[];
  completedPlannerItemIds: string[];
  questionAttempts: Record<string, string[]>;
  theme: AppTheme;
}

interface StoredAccount {
  user: AppUser;
  /** Dummy-only credential. Never use this browser-only store for real auth. */
  password: string;
}

export interface AppContextValue extends PersistedAppState {
  hydrated: boolean;
  isAuthenticated: boolean;
  onboardingComplete: boolean;
  login: (input: LoginInput) => Promise<AuthResult>;
  signIn: (input: LoginInput) => Promise<AuthResult>;
  signUp: (input: SignUpInput) => Promise<AuthResult>;
  loginAsDemo: () => Promise<AuthResult>;
  requestPasswordReset: (email: string) => Promise<AuthResult>;
  logout: () => void;
  signOut: () => void;
  completeOnboarding: (profile: OnboardingProfile) => void;
  setTopicProgress: (
    topicId: string,
    value: number | Partial<Pick<TopicProgressEntry, "progress" | "status">>,
  ) => void;
  toggleBookmark: (topicId: string) => void;
  togglePlannerItem: (itemId: string) => void;
  recordQuestionAttempt: (questionId: string, selectedOptionIds: string | string[]) => void;
  resetDemo: () => void;
  setTheme: (theme: AppTheme) => void;
}

const DEMO_USER: AppUser = {
  id: "student-aarav-demo",
  name: "Aarav Sharma",
  firstName: "Aarav",
  initials: "AS",
  email: "aarav@orangenelumbo.com",
  city: "Kota",
  targetExam: "JEE Advanced",
  targetYear: 2027,
  examDate: "2027-05-23",
  activePlanId: "notes",
  readingStreak: 47,
  joinedAt: "2026-05-20",
  onboardingComplete: true,
  isDemo: true,
};

const DEMO_TOPIC_PROGRESS: Record<string, TopicProgressEntry> = {
  "phy-kin-motion-straight": {
    status: "completed",
    progress: 100,
    updatedAt: "2026-07-17T12:30:00.000Z",
  },
  "phy-kin-motion-gravity": {
    status: "in-progress",
    progress: 64,
    updatedAt: "2026-07-18T11:20:00.000Z",
  },
  "phy-nlm-newtons-laws": {
    status: "completed",
    progress: 100,
    updatedAt: "2026-07-16T14:10:00.000Z",
  },
  "mat-calc-limits": {
    status: "completed",
    progress: 100,
    updatedAt: "2026-07-15T09:40:00.000Z",
  },
};

function createInitialState(): PersistedAppState {
  return {
    user: null,
    onboardingProfile: null,
    topicProgress: { ...DEMO_TOPIC_PROGRESS },
    bookmarkedTopicIds: ["phy-kin-motion-gravity", "mat-algebra-complex"],
    completedPlannerItemIds: ["planner-2026-07-17-bonding"],
    questionAttempts: {},
    theme: "dark",
  };
}

function createDemoState(theme: AppTheme = "dark"): PersistedAppState {
  return {
    user: { ...DEMO_USER },
    onboardingProfile: {
      targetExam: "JEE Advanced",
      targetYear: 2027,
      classLevel: "Class 12",
      dailyGoalMinutes: 90,
      focusSubjects: ["physics", "mathematics"],
      studyWindow: "Evening",
      city: "Kota",
    },
    topicProgress: { ...DEMO_TOPIC_PROGRESS },
    bookmarkedTopicIds: ["phy-kin-motion-gravity", "mat-algebra-complex"],
    completedPlannerItemIds: ["planner-2026-07-17-bonding"],
    questionAttempts: {},
    theme,
  };
}

function createEmptyUserState(user: AppUser, theme: AppTheme = "dark"): PersistedAppState {
  return {
    user,
    onboardingProfile: null,
    topicProgress: {},
    bookmarkedTopicIds: [],
    completedPlannerItemIds: [],
    questionAttempts: {},
    theme,
  };
}

function userStateKey(userId: string) {
  return `${USER_STATE_PREFIX}${userId}`;
}

function normaliseEmail(email: string) {
  return email.trim().toLowerCase();
}

function isEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clampProgress(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function initialsFromName(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function firstNameFromName(name: string) {
  return name.trim().split(/\s+/)[0] || "Student";
}

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `student-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function normaliseUser(value: unknown): AppUser | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<AppUser>;
  if (
    typeof candidate.id !== "string" ||
    typeof candidate.name !== "string" ||
    typeof candidate.email !== "string" ||
    !isEmail(candidate.email)
  ) {
    return null;
  }

  const name = candidate.name.trim() || "Student";
  const targetExam: TargetExam = candidate.targetExam === "JEE Main" ? "JEE Main" : "JEE Advanced";
  const targetYear = Number.isFinite(candidate.targetYear) ? Number(candidate.targetYear) : 2027;

  return {
    id: candidate.id,
    name,
    firstName: typeof candidate.firstName === "string" ? candidate.firstName : firstNameFromName(name),
    initials: typeof candidate.initials === "string" ? candidate.initials : initialsFromName(name),
    email: normaliseEmail(candidate.email),
    city: typeof candidate.city === "string" ? candidate.city : "",
    targetExam,
    targetYear,
    examDate: typeof candidate.examDate === "string" ? candidate.examDate : `${targetYear}-05-23`,
    activePlanId:
      candidate.activePlanId === "complete" || candidate.activePlanId === "practice"
        ? candidate.activePlanId
        : "notes",
    readingStreak: Number.isFinite(candidate.readingStreak) ? Math.max(0, Number(candidate.readingStreak)) : 0,
    joinedAt: typeof candidate.joinedAt === "string" ? candidate.joinedAt : new Date().toISOString(),
    onboardingComplete: candidate.onboardingComplete === true,
    isDemo: candidate.isDemo === true || undefined,
  };
}

function normaliseOnboardingProfile(value: unknown): OnboardingProfile | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<OnboardingProfile>;
  const focusSubjects = Array.isArray(candidate.focusSubjects)
    ? candidate.focusSubjects.filter(
        (subject): subject is SubjectId =>
          subject === "physics" || subject === "chemistry" || subject === "mathematics",
      )
    : [];
  const classLevel =
    candidate.classLevel === "Class 11" || candidate.classLevel === "Dropper"
      ? candidate.classLevel
      : "Class 12";
  const studyWindow =
    candidate.studyWindow === "Morning" ||
    candidate.studyWindow === "Afternoon" ||
    candidate.studyWindow === "Flexible"
      ? candidate.studyWindow
      : "Evening";

  return {
    targetExam: candidate.targetExam === "JEE Main" ? "JEE Main" : "JEE Advanced",
    targetYear: Number.isFinite(candidate.targetYear) ? Number(candidate.targetYear) : 2027,
    classLevel,
    dailyGoalMinutes: Number.isFinite(candidate.dailyGoalMinutes)
      ? Math.max(15, Math.min(240, Number(candidate.dailyGoalMinutes)))
      : 90,
    focusSubjects: focusSubjects.length ? focusSubjects : ["physics", "mathematics"],
    studyWindow,
    city: typeof candidate.city === "string" ? candidate.city : "",
  };
}

function normaliseStringArray(value: unknown, fallback: string[]) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : fallback;
}

function normaliseTopicProgress(
  value: unknown,
  fallback: Record<string, TopicProgressEntry>,
): Record<string, TopicProgressEntry> {
  if (!value || typeof value !== "object") return fallback;

  return Object.fromEntries(
    Object.entries(value).flatMap(([id, entry]) => {
      if (!entry || typeof entry !== "object") return [];
      const candidate = entry as Partial<TopicProgressEntry>;
      const status =
        candidate.status === "completed" ||
        candidate.status === "in-progress" ||
        candidate.status === "locked"
          ? candidate.status
          : "not-started";
      const progress = Number.isFinite(candidate.progress) ? clampProgress(Number(candidate.progress)) : 0;
      return [[id, {
        status,
        progress,
        updatedAt: typeof candidate.updatedAt === "string" ? candidate.updatedAt : new Date(0).toISOString(),
      }]];
    }),
  );
}

function normaliseQuestionAttempts(value: unknown): Record<string, string[]> {
  if (!value || typeof value !== "object") return {};
  return Object.fromEntries(
    Object.entries(value).flatMap(([id, answers]) => {
      const valid = normaliseStringArray(answers, []);
      return valid.length ? [[id, valid]] : [];
    }),
  );
}

function readAccounts(): StoredAccount[] {
  const parsed = readDeviceJson<unknown>(ACCOUNT_STORAGE_KEY, []);
  if (!Array.isArray(parsed)) return [];
  return parsed.flatMap((value) => {
    if (!value || typeof value !== "object") return [];
    const candidate = value as Partial<StoredAccount>;
    const user = normaliseUser(candidate.user);
    return user && typeof candidate.password === "string" ? [{ user, password: candidate.password }] : [];
  });
}

function writeAccounts(accounts: StoredAccount[]) {
  return writeDeviceJson(ACCOUNT_STORAGE_KEY, accounts);
}

function updateStoredAccountUser(user: AppUser) {
  const accounts = readAccounts();
  const index = accounts.findIndex((account) => account.user.id === user.id);
  if (index === -1) return;
  accounts[index] = { ...accounts[index], user };
  writeAccounts(accounts);
}

function restoreState(raw: string | null, fallback: PersistedAppState = createInitialState()): PersistedAppState {
  if (!raw) return fallback;

  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return fallback;
    const parsed = value as Partial<PersistedAppState>;
    return {
      user: parsed.user === null ? null : (normaliseUser(parsed.user) ?? fallback.user),
      onboardingProfile:
        parsed.onboardingProfile === null
          ? null
          : (normaliseOnboardingProfile(parsed.onboardingProfile) ?? fallback.onboardingProfile),
      topicProgress: normaliseTopicProgress(parsed.topicProgress, fallback.topicProgress),
      bookmarkedTopicIds: normaliseStringArray(parsed.bookmarkedTopicIds, fallback.bookmarkedTopicIds),
      completedPlannerItemIds: normaliseStringArray(
        parsed.completedPlannerItemIds,
        fallback.completedPlannerItemIds,
      ),
      questionAttempts: normaliseQuestionAttempts(parsed.questionAttempts),
      theme: "dark",
    };
  } catch {
    return fallback;
  }
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedAppState>(createInitialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      let restored = createInitialState();
      try {
        const sessionState = restoreState(readDeviceItem(APP_STORAGE_KEY));
        restored = sessionState.user
          ? restoreState(readDeviceItem(userStateKey(sessionState.user.id)), sessionState)
          : sessionState;
      } finally {
        if (!cancelled) {
          setState(restored);
          setHydrated(true);
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeDeviceJson(APP_STORAGE_KEY, state);
    if (state.user) writeDeviceJson(userStateKey(state.user.id), state);
  }, [hydrated, state]);

  useEffect(() => {
    if (!hydrated) return;
    const reconcileSession = (event: StorageEvent) => {
      if (event.key !== APP_STORAGE_KEY) return;
      setState(restoreState(event.newValue));
    };
    window.addEventListener("storage", reconcileSession);
    return () => window.removeEventListener("storage", reconcileSession);
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated) return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const dark = state.theme === "dark" || (state.theme === "system" && media.matches);
      document.documentElement.classList.toggle("dark", dark);
      document.documentElement.dataset.theme = dark ? "dark" : "light";
    };

    applyTheme();
    media.addEventListener("change", applyTheme);
    return () => media.removeEventListener("change", applyTheme);
  }, [hydrated, state.theme]);

  const login = useCallback(async (input: LoginInput): Promise<AuthResult> => {
    const email = normaliseEmail(input.email);
    if (!isEmail(email) || !input.password) {
      return { success: false, message: "Enter a valid email and password." };
    }

    if (email === DEMO_USER.email && input.password === "orange2027") {
      setState((current) =>
        restoreState(readDeviceItem(userStateKey(DEMO_USER.id)), createDemoState(current.theme)),
      );
      return { success: true, message: "Welcome back, Aarav.", user: DEMO_USER };
    }

    const account = readAccounts().find((item) => item.user.email === email);
    if (!account || account.password !== input.password) {
      return {
        success: false,
        message: "Those details do not match a saved dummy account. Try demo access instead.",
      };
    }

    setState((current) => restoreState(
      readDeviceItem(userStateKey(account.user.id)),
      createEmptyUserState(account.user, current.theme),
    ));
    return { success: true, message: `Welcome back, ${account.user.firstName}.`, user: account.user };
  }, []);

  const signUp = useCallback(async (input: SignUpInput): Promise<AuthResult> => {
    const name = input.name.trim();
    const email = normaliseEmail(input.email);

    if (name.length < 2) {
      return { success: false, message: "Tell us the name you would like to use." };
    }
    if (!isEmail(email)) {
      return { success: false, message: "Enter a valid email address." };
    }
    if (input.password.length < 8) {
      return { success: false, message: "Use at least 8 characters for your password." };
    }

    const accounts = readAccounts();
    if (accounts.some((account) => account.user.email === email) || email === DEMO_USER.email) {
      return { success: false, message: "A dummy account with this email already exists." };
    }

    const user: AppUser = {
      id: makeId(),
      name,
      firstName: firstNameFromName(name),
      initials: initialsFromName(name),
      email,
      city: "",
      targetExam: "JEE Advanced",
      targetYear: 2027,
      examDate: "2027-05-23",
      activePlanId: "notes",
      readingStreak: 0,
      joinedAt: new Date().toISOString(),
      onboardingComplete: false,
    };

    const persisted = writeAccounts([...accounts, { user, password: input.password }]);
    setState((current) => createEmptyUserState(user, current.theme));
    return {
      success: true,
      message: persisted
        ? "Your dummy account is ready."
        : "Your dummy account is ready for this visit; browser storage is unavailable.",
      user,
    };
  }, []);

  const loginAsDemo = useCallback(async (): Promise<AuthResult> => {
    setState((current) =>
      restoreState(readDeviceItem(userStateKey(DEMO_USER.id)), createDemoState(current.theme)),
    );
    return { success: true, message: "Demo workspace loaded.", user: DEMO_USER };
  }, []);

  const requestPasswordReset = useCallback(async (emailValue: string): Promise<AuthResult> => {
    const email = normaliseEmail(emailValue);
    if (!isEmail(email)) {
      return { success: false, message: "Enter a valid email address." };
    }
    return {
      success: true,
      message: `A dummy reset link has been prepared for ${email}. No email was actually sent.`,
    };
  }, []);

  const logout = useCallback(() => {
    setState((current) => ({ ...current, user: null }));
  }, []);

  const completeOnboarding = useCallback((profile: OnboardingProfile) => {
    setState((current) => {
      if (!current.user) return current;
      const user: AppUser = {
        ...current.user,
        city: profile.city.trim(),
        targetExam: profile.targetExam,
        targetYear: profile.targetYear,
        examDate: `${profile.targetYear}-05-23`,
        onboardingComplete: true,
      };
      updateStoredAccountUser(user);
      return { ...current, user, onboardingProfile: profile };
    });
  }, []);

  const setTopicProgress = useCallback(
    (
      topicId: string,
      value: number | Partial<Pick<TopicProgressEntry, "progress" | "status">>,
    ) => {
      setState((current) => {
        const previous = current.topicProgress[topicId];
        const progress = clampProgress(
          typeof value === "number" ? value : (value.progress ?? previous?.progress ?? 0),
        );
        const status =
          typeof value === "object" && value.status
            ? value.status
            : progress >= 100
              ? "completed"
              : progress > 0
                ? "in-progress"
                : "not-started";
        return {
          ...current,
          topicProgress: {
            ...current.topicProgress,
            [topicId]: { progress, status, updatedAt: new Date().toISOString() },
          },
        };
      });
    },
    [],
  );

  const toggleBookmark = useCallback((topicId: string) => {
    setState((current) => ({
      ...current,
      bookmarkedTopicIds: current.bookmarkedTopicIds.includes(topicId)
        ? current.bookmarkedTopicIds.filter((id) => id !== topicId)
        : [...current.bookmarkedTopicIds, topicId],
    }));
  }, []);

  const togglePlannerItem = useCallback((itemId: string) => {
    setState((current) => ({
      ...current,
      completedPlannerItemIds: current.completedPlannerItemIds.includes(itemId)
        ? current.completedPlannerItemIds.filter((id) => id !== itemId)
        : [...current.completedPlannerItemIds, itemId],
    }));
  }, []);

  const recordQuestionAttempt = useCallback(
    (questionId: string, selectedOptionIds: string | string[]) => {
      const selected = Array.isArray(selectedOptionIds)
        ? [...new Set(selectedOptionIds)]
        : [selectedOptionIds];
      setState((current) => ({
        ...current,
        questionAttempts: { ...current.questionAttempts, [questionId]: selected },
      }));
    },
    [],
  );

  const resetDemo = useCallback(() => {
    const userId = state.user?.id;
    if (!userId) return;

    const removablePrefixes = [
      `orange-nelumbo:mock:${userId}:`,
      `orange-nelumbo:action:${userId}:`,
    ];
    const removableKeys = new Set([
      `orange-nelumbo:last-mock-result:${userId}`,
      `orange-nelumbo:notifications:${userId}:v1`,
      `orange-nelumbo:settings:${userId}:v1`,
    ]);
    listDeviceKeys().forEach((key) => {
      if (removableKeys.has(key) || removablePrefixes.some((prefix) => key.startsWith(prefix))) {
        removeDeviceItem(key);
      }
    });

    setState((current) => {
      if (!current.user || current.user.id !== userId) return current;
      if (current.user.isDemo) return createDemoState(current.theme);
      return {
        ...createEmptyUserState(current.user, current.theme),
        onboardingProfile: current.onboardingProfile,
      };
    });
  }, [state.user]);

  const setTheme = useCallback((theme: AppTheme) => {
    setState((current) => ({ ...current, theme }));
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      hydrated,
      isAuthenticated: Boolean(state.user),
      onboardingComplete: Boolean(state.user?.onboardingComplete),
      login,
      signIn: login,
      signUp,
      loginAsDemo,
      requestPasswordReset,
      logout,
      signOut: logout,
      completeOnboarding,
      setTopicProgress,
      toggleBookmark,
      togglePlannerItem,
      recordQuestionAttempt,
      resetDemo,
      setTheme,
    }),
    [
      completeOnboarding,
      hydrated,
      login,
      loginAsDemo,
      logout,
      recordQuestionAttempt,
      requestPasswordReset,
      resetDemo,
      setTheme,
      setTopicProgress,
      signUp,
      state,
      toggleBookmark,
      togglePlannerItem,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used inside AppProvider.");
  }
  return context;
}
