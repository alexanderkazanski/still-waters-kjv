import { useCallback, useEffect, useState } from "react";
import { dayKey } from "./verses";

const FAVORITES_KEY = "stillwaters.favorites";
const STREAK_KEY = "stillwaters.streak";
const REMINDER_KEY = "stillwaters.reminder";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(read<string[]>(FAVORITES_KEY, []));
  }, []);

  const toggle = useCallback((reference: string) => {
    setFavorites((prev) => {
      const next = prev.includes(reference)
        ? prev.filter((r) => r !== reference)
        : [reference, ...prev];
      write(FAVORITES_KEY, next);
      return next;
    });
  }, []);

  return { favorites, toggle, isFavorite: (r: string) => favorites.includes(r) };
}

type Streak = { last: string; days: number; total: number };

export function useStreak() {
  const [streak, setStreak] = useState<Streak>({ last: "", days: 0, total: 0 });

  useEffect(() => {
    const stored = read<Streak>(STREAK_KEY, { last: "", days: 0, total: 0 });
    const today = dayKey();
    if (stored.last === today) {
      setStreak(stored);
      return;
    }
    const yesterday = dayKey(new Date(Date.now() - 86400000));
    const next: Streak = {
      last: today,
      days: stored.last === yesterday ? stored.days + 1 : 1,
      total: stored.total + 1,
    };
    write(STREAK_KEY, next);
    setStreak(next);
  }, []);

  return streak;
}

export function useReminder() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(read<string | null>(REMINDER_KEY, null));
  }, []);

  const save = useCallback((value: string | null) => {
    write(REMINDER_KEY, value);
    setTime(value);
  }, []);

  return { time, save };
}
