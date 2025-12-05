export type BadgeId =
  | "atelier"
  | "linux"
  | "libre"
  | "bigtech"
  | "eco"
  | "forge"
  | "labs"
  | "comic"
  | "city"
  | "surveillancePlus"
  | "resurrection"
  | "escape"
  | "impact"
  | "adventure"
  | "potion"
  | "movie"
  | "observatoire"
  | "mission";

export type ProgressState = {
  badges: BadgeId[];
  completedModules: string[];
};

export type CommunityIdea = {
  name: string;
  idea: string;
  category: "idee" | "atelier" | "ressource" | "temoignage";
  link?: string;
  impact?: string;
  tags?: string[];
  email?: string;
  timestamp: number;
};

export type NirdScore = {
  bigTechScore: number;
  ecoScore: number;
  autonomyScore: number;
  privacyScore: number;
  inclusionScore: number;
  creativityScore: number;
  durabilityScore: number;
};

const PROGRESS_KEY = "nird_progress";
const IDEAS_KEY = "nird_ideas";
const SCORE_KEY = "nird_score";
const SESSION_KEY = "nird_session";

const defaultProgress: ProgressState = {
  badges: [],
  completedModules: [],
};

const defaultScore: NirdScore = {
  bigTechScore: 0,
  ecoScore: 0,
  autonomyScore: 0,
  privacyScore: 0,
  inclusionScore: 0,
  creativityScore: 0,
  durabilityScore: 0,
};

const isBrowser = () => typeof window !== "undefined";

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const getUserSuffix = () => {
  if (!isBrowser()) return "guest";
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return "guest";
    const session = JSON.parse(raw) as { id?: string };
    return session?.id ?? "guest";
  } catch {
    return "guest";
  }
};

const resolveKey = (key: string) => `${key}_${getUserSuffix()}`;

const readStore = <T>(key: string, fallback: T): T => {
  if (!isBrowser()) return fallback;
  const scopedKey = resolveKey(key);
  const raw = window.localStorage.getItem(scopedKey) ?? window.localStorage.getItem(key);
  return safeParse(raw, fallback);
};

const writeStore = <T>(key: string, value: T) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(resolveKey(key), JSON.stringify(value));
};

export const getProgress = (): ProgressState => readStore(PROGRESS_KEY, defaultProgress);

export const unlockBadge = (badgeId: BadgeId) => {
  const progress = getProgress();
  if (progress.badges.includes(badgeId)) return progress;
  const updated: ProgressState = {
    ...progress,
    badges: [...progress.badges, badgeId],
  };
  writeStore(PROGRESS_KEY, updated);
  return updated;
};

export const markModuleCompletion = (moduleId: string) => {
  const progress = getProgress();
  if (progress.completedModules.includes(moduleId)) return progress;
  const updated: ProgressState = {
    ...progress,
    completedModules: [...progress.completedModules, moduleId],
  };
  writeStore(PROGRESS_KEY, updated);
  return updated;
};

export const resetProgress = () => {
  writeStore(PROGRESS_KEY, defaultProgress);
  writeStore(SCORE_KEY, defaultScore);
};

export const getIdeas = (): CommunityIdea[] => {
  const raw = readStore<Array<Partial<CommunityIdea>>>(IDEAS_KEY, []);
  return raw.map((idea) => ({
    name: idea.name ?? "Anonyme",
    idea: idea.idea ?? "",
    category: (idea.category ?? "idee") as CommunityIdea["category"],
    link: idea.link,
    impact: idea.impact,
    tags: idea.tags,
    email: idea.email,
    timestamp: idea.timestamp ?? Date.now(),
  }));
};

export const saveIdea = (idea: CommunityIdea) => {
  const current = getIdeas();
  const updated = [idea, ...current].slice(0, 40);
  writeStore(IDEAS_KEY, updated);
  return updated;
};

export const getScore = (): NirdScore => readStore(SCORE_KEY, defaultScore);

export const updateScore = (partial: Partial<NirdScore>) => {
  const score = getScore();
  const updated: NirdScore = { ...score, ...partial };
  writeStore(SCORE_KEY, updated);
  return updated;
};
