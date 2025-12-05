"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authStore, type AuthUser, type UserRole } from "../lib/auth";

export type AuthContextValue = {
  user: AuthUser;
  status: "loading" | "ready";
  login: (payload: { username: string; password: string }) => { success: boolean; message?: string };
  register: (payload: { username: string; password: string; email?: string; role?: UserRole; organization?: string }) => {
    success: boolean;
    message?: string;
  };
  updateProfile: (updates: { role?: UserRole; organization?: string }) => { success: boolean; message?: string };
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [status, setStatus] = useState<"loading" | "ready">("loading");

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      setUser(authStore.getSession());
      setStatus("ready");
    });
    const unsubscribe = authStore.subscribe((session) => {
      if (!cancelled) {
        setUser(session);
      }
    });
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  const value: AuthContextValue = useMemo(
    () => ({
      user,
      status,
      login: ({ username, password }) => {
        const result = authStore.login({ username, password });
        if (!result.success) return { success: false, message: result.message ?? "Connexion impossible" };
        setUser({
          id: result.user!.id,
          username: result.user!.username,
          role: result.user!.role,
          organization: result.user!.organization,
        });
        return { success: true };
      },
      register: ({ username, password, email, role, organization }) => {
        const result = authStore.register({ username, password, email, role, organization });
        if (!result.success) {
          return { success: false, message: result.message ?? "Inscription impossible" };
        }
        setUser({
          id: result.user!.id,
          username: result.user!.username,
          role: result.user!.role,
          organization: result.user!.organization,
        });
        return { success: true };
      },
      updateProfile: ({ role, organization }) => {
        if (!user) return { success: false, message: "Aucun utilisateur connecté" };
        const result = authStore.updateUser(user.id, { role, organization });
        if (!result.success) {
          return { success: false, message: result.message ?? "Mise à jour impossible" };
        }
        setUser((prev) =>
          prev
            ? {
                ...prev,
                role: result.user!.role,
                organization: result.user!.organization,
              }
            : prev
        );
        return { success: true };
      },
      logout: () => {
        authStore.logout();
        setUser(null);
      },
    }),
    [status, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
