import type { Institution } from "../data/institutions";
import { DEFAULT_INSTITUTIONS } from "../data/institutions";

const CUSTOM_KEY = "nird_custom_institutions";

const isBrowser = () => typeof window !== "undefined";

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export function getCustomInstitutions(): Institution[] {
  if (!isBrowser()) return [];
  const raw = window.localStorage.getItem(CUSTOM_KEY);
  return safeParse<Institution[]>(raw, []);
}

export function saveCustomInstitution(institution: Institution) {
  if (!isBrowser()) return;
  const current = getCustomInstitutions();
  const filtered = current.filter((item) => item.id !== institution.id);
  const next = [institution, ...filtered].slice(0, 6);
  window.localStorage.setItem(CUSTOM_KEY, JSON.stringify(next));
}

export function getAllInstitutions(): Institution[] {
  return [...DEFAULT_INSTITUTIONS, ...getCustomInstitutions()];
}


