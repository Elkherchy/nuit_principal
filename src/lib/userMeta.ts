"use client";

import type { UserRole } from "./auth";

export const ROLE_LABELS: Record<UserRole, string> = {
  eleve: "Élève",
  enseignant: "Enseignant·e",
  direction: "Direction",
  collectivite: "Collectivité",
  partenaire: "Partenaire",
};

export const fragmentRoleLabel = (role: UserRole | undefined) => ROLE_LABELS[role ?? "eleve"];


