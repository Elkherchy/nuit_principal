"use client";

import { nanoid } from "nanoid";

export type UserRole = "eleve" | "enseignant" | "direction" | "collectivite" | "partenaire";

type StoredUser = {
  id: string;
  username: string;
  email?: string;
  password: string;
  createdAt: number;
  avatar?: string;
  role: UserRole;
  organization?: string;
};

type Session = {
  id: string;
  username: string;
  role: UserRole;
  organization?: string;
};

const USERS_KEY = "nird_users";
const SESSION_KEY = "nird_session";

const isBrowser = () => typeof window !== "undefined";

const DEFAULT_ROLE: UserRole = "eleve";

const readUsers = (): StoredUser[] => {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<StoredUser>[]) : [];
    return parsed.map((user) => ({
      id: user.id ?? nanoid(6),
      username: user.username ?? "gaulois",
      email: user.email,
      password: user.password ?? "",
      createdAt: user.createdAt ?? Date.now(),
      avatar:
        user.avatar ??
        `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(user.username ?? "gaulois")}`,
      role: user.role ?? DEFAULT_ROLE,
      organization: user.organization,
    }));
  } catch {
    return [];
  }
};

const writeUsers = (users: StoredUser[]) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const readSession = (): Session | null => {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    const session = raw ? (JSON.parse(raw) as Partial<Session>) : null;
    if (!session) return null;
    return {
      id: session.id ?? "",
      username: session.username ?? "gaulois",
      role: session.role ?? DEFAULT_ROLE,
      organization: session.organization,
    };
  } catch {
    return null;
  }
};

const writeSession = (session: Session | null) => {
  if (!isBrowser()) return;
  if (!session) {
    window.localStorage.removeItem(SESSION_KEY);
  } else {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
};

const subscribers = new Set<(session: Session | null) => void>();

const notify = (session: Session | null) => {
  subscribers.forEach((cb) => cb(session));
};

export const authStore = {
  getUsers: readUsers,
  getSession: readSession,
  subscribe: (cb: (session: Session | null) => void) => {
    subscribers.add(cb);
    return () => subscribers.delete(cb);
  },
  register: ({
    username,
    email,
    password,
    role = DEFAULT_ROLE,
    organization,
  }: {
    username: string;
    email?: string;
    password: string;
    role?: UserRole;
    organization?: string;
  }) => {
    if (!username || !password) {
      return { success: false, message: "Identifiants incomplets" };
    }
    const users = readUsers();
    if (users.some((user) => user.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, message: "Nom déjà utilisé" };
    }
    const newUser: StoredUser = {
      id: nanoid(8),
      username,
      email,
      password,
      createdAt: Date.now(),
      avatar: `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(username)}`,
      role,
      organization,
    };
    writeUsers([newUser, ...users].slice(0, 50));
    writeSession({
      id: newUser.id,
      username: newUser.username,
      role: newUser.role,
      organization: newUser.organization,
    });
    notify({
      id: newUser.id,
      username: newUser.username,
      role: newUser.role,
      organization: newUser.organization,
    });
    return { success: true, user: newUser };
  },
  login: ({ username, password }: { username: string; password: string }) => {
    const users = readUsers();
    const user = users.find((item) => item.username.toLowerCase() === username.toLowerCase());
    if (!user || user.password !== password) {
      return { success: false, message: "Identifiants incorrects" };
    }
    const session: Session = {
      id: user.id,
      username: user.username,
      role: user.role ?? DEFAULT_ROLE,
      organization: user.organization,
    };
    writeSession(session);
    notify(session);
    return { success: true, user };
  },
  logout: () => {
    writeSession(null);
    notify(null);
  },
  updateUser: (userId: string, updates: Partial<Pick<StoredUser, "role" | "organization" | "email">>) => {
    const users = readUsers();
    const user = users.find((item) => item.id === userId);
    if (!user) return { success: false, message: "Utilisateur introuvable" };
    const updatedUser: StoredUser = { ...user, ...updates, role: updates.role ?? user.role ?? DEFAULT_ROLE };
    const nextUsers = users.map((item) => (item.id === userId ? updatedUser : item));
    writeUsers(nextUsers);
    const session = readSession();
    if (session?.id === userId) {
      const nextSession: Session = {
        ...session,
        role: updatedUser.role,
        organization: updatedUser.organization,
      };
      writeSession(nextSession);
      notify(nextSession);
    } else {
      notify(readSession());
    }
    return { success: true, user: updatedUser };
  },
};

export type AuthUser = Session | null;

export const getCurrentUser = (): AuthUser => authStore.getSession();
