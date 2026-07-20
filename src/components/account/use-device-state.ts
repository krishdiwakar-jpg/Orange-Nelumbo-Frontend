"use client";

import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";

import { readDeviceJson, writeDeviceJson } from "@/lib/device-storage";

type NormaliseStoredValue<T> = (value: unknown, fallback: T) => T;

/**
 * Small device-preference store for this front-end-only prototype.
 * Product records should move to a backend once one exists.
 */
export function useDeviceState<T>(
  key: string,
  initialValue: T,
  normalise?: NormaliseStoredValue<T>,
): [T, Dispatch<SetStateAction<T>>, boolean] {
  const initialValueRef = useRef(initialValue);
  const normaliseRef = useRef(normalise);
  const [value, setValue] = useState(initialValue);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      const parsed = readDeviceJson<unknown>(key, initialValueRef.current);
      if (cancelled) return;
      setValue(
        normaliseRef.current
          ? normaliseRef.current(parsed, initialValueRef.current)
          : (parsed as T),
      );
      setLoadedKey(key);
    });
    return () => {
      cancelled = true;
    };
  }, [key]);

  useEffect(() => {
    if (loadedKey !== key) return;
    writeDeviceJson(key, value);
  }, [key, loadedKey, value]);

  return [value, setValue, loadedKey === key];
}

export function notificationStorageKey(userId: string) {
  return `orange-nelumbo:notifications:${userId}:v1`;
}

export function settingsStorageKey(userId: string) {
  return `orange-nelumbo:settings:${userId}:v1`;
}
