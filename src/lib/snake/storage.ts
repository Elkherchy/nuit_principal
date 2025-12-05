import { STORAGE_KEYS } from "./constants";

interface StoredScore {
  score: number;
  date: string;
}

const isBrowser = typeof window !== "undefined";

function readJson<T>(key: string): T | null {
  if (!isBrowser) return null;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore errors
  }
}

export function getHighScore(): StoredScore | null {
  return readJson<StoredScore>(STORAGE_KEYS.highScore);
}

export function persistHighScore(score: number) {
  if (!isBrowser) return;
  const payload: StoredScore = {
    score,
    date: new Date().toISOString(),
  };
  writeJson(STORAGE_KEYS.highScore, payload);
}

export function getGamesPlayed() {
  if (!isBrowser) return 0;
  const stored = window.localStorage.getItem(STORAGE_KEYS.gamesPlayed);
  return stored ? Number(stored) || 0 : 0;
}

export function bumpGamesPlayed() {
  if (!isBrowser) return 0;
  const next = getGamesPlayed() + 1;
  window.localStorage.setItem(STORAGE_KEYS.gamesPlayed, next.toString());
  return next;
}


