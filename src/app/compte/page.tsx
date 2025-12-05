"use client";

import { useAuth } from "../../context/AuthContext";
import UserProfilePanel from "../../components/UserProfilePanel";
import UserManagementPanel from "../../components/UserManagementPanel";

export default function ComptePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 text-white">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <p className="text-sm uppercase tracking-[0.4em] text-emerald-300">Centre utilisateur</p>
        <h1 className="mt-2 text-4xl font-semibold">
          {user ? `Bienvenue ${user.username}` : "Connecte-toi pour personnaliser ton profil"}
        </h1>
        <p className="mt-2 text-sm text-white/70">
          Ici tu peux suivre les rôles, mettre à jour ton organisation et piloter les comptes locaux (utile pendant la Nuit
          de l&rsquo;Info).
        </p>
      </section>
      <div className="grid gap-6 lg:grid-cols-2">
        <UserProfilePanel />
        <UserManagementPanel />
      </div>
    </div>
  );
}


