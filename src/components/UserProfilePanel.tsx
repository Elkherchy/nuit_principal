"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../lib/auth";
import { fragmentRoleLabel } from "../lib/userMeta";

const roleOptions: { id: UserRole; label: string }[] = [
  { id: "eleve", label: "Élève / étudiant" },
  { id: "enseignant", label: "Enseignant·e / formateur·rice" },
  { id: "direction", label: "Direction / Chef d'établissement" },
  { id: "collectivite", label: "Collectivité / DSI" },
  { id: "partenaire", label: "Partenaire / association" },
];

export function UserProfilePanel() {
  const { user, updateProfile } = useAuth();
  const [role, setRole] = useState<UserRole>(user?.role ?? "eleve");
  const [organization, setOrganization] = useState(user?.organization ?? "");
  const [notice, setNotice] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
        Connecte-toi pour accéder à ton centre de contrôle.
      </div>
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <p className="text-sm uppercase tracking-[0.4em] text-emerald-300">Profil</p>
      <h2 className="mt-2 text-3xl font-semibold text-white">{user.username}</h2>
      <p className="text-sm text-white/70">Badge actuel : {fragmentRoleLabel(user.role)}</p>
      <form
        className="mt-4 space-y-4 text-sm"
        onSubmit={(event) => {
          event.preventDefault();
          const result = updateProfile({ role, organization });
          if (!result.success) {
            setNotice(result.message ?? "Mise à jour impossible");
            return;
          }
          setNotice("Profil mis à jour !");
        }}
      >
        <label className="block">
          <span>Rôle</span>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value as UserRole)}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-white"
          >
            {roleOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span>Établissement / organisation</span>
          <input
            type="text"
            value={organization}
            onChange={(event) => setOrganization(event.target.value)}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-white"
            placeholder="Lycée Carnot, Ville de Lyon, etc."
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-6 py-3 text-sm font-semibold text-slate-900"
        >
          Sauvegarder
        </button>
        {notice && <p className="text-xs text-emerald-200">{notice}</p>}
      </form>
    </section>
  );
}

export default UserProfilePanel;

