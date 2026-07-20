/**
 * Resilient browser storage for the front-end-only demo.
 *
 * localStorage can throw in private/restricted contexts or when its quota is
 * exhausted. The in-memory mirror keeps the current visit usable in those
 * cases; callers can use the boolean return value to tell whether a write was
 * also persisted to the browser.
 */
const memoryStorage = new Map<string, string>();

export function readDeviceItem(key: string): string | null {
  if (typeof window === "undefined") return memoryStorage.get(key) ?? null;

  try {
    return window.localStorage.getItem(key) ?? memoryStorage.get(key) ?? null;
  } catch {
    return memoryStorage.get(key) ?? null;
  }
}

export function writeDeviceItem(key: string, value: string): boolean {
  memoryStorage.set(key, value);
  if (typeof window === "undefined") return false;

  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeDeviceItem(key: string): boolean {
  memoryStorage.delete(key);
  if (typeof window === "undefined") return false;

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function listDeviceKeys(): string[] {
  const keys = new Set(memoryStorage.keys());
  if (typeof window === "undefined") return [...keys];

  try {
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (key) keys.add(key);
    }
  } catch {
    // The in-memory keys are still safe to return.
  }

  return [...keys];
}

export function readDeviceJson<T>(key: string, fallback: T): T {
  const raw = readDeviceItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeDeviceJson(key: string, value: unknown): boolean {
  try {
    return writeDeviceItem(key, JSON.stringify(value));
  } catch {
    return false;
  }
}
