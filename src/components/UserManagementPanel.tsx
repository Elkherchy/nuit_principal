"use client";

import { useEffect, useState } from "react";
import { authStore, type UserRole } from "../lib/auth";
import { fragmentRoleLabel } from "../lib/userMeta";

type EditableUser = {
  id: string;
  username: string;
  role: UserRole;
  organization?: string;
};

const roleOptions: { id: UserRole; label: string }[] = [
  { id: "eleve", label: "Élève" },
  { id: "enseignant", label: "Enseignant" },
  { id: "direction", label: "Direction" },
  { id: "collectivite", label: "Collectivité" },
  { id: "partenaire", label: "Partenaire" },
];

export function UserManagementPanel() {
  const [users, setUsers] = useState<EditableUser[]>([]);

  const refresh = () => {
    const list = authStore.getUsers();
    setUsers(
      list.map((user) => ({
        id: user.id,
        username: user.username,
        role: user.role,
        organization: user.organization,
      })),
    );
  };

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      refresh();
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleUpdate = (userId: string, payload: Partial<EditableUser>) => {
    authStore.updateUser(userId, payload);
    refresh();
  };

  if (users.length === 0) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
        Aucun autre compte local pour le moment.
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <p className="text-sm uppercase tracking-[0.4em] text-white/50">Gestion locale</p>
      <h2 className="mt-2 text-2xl font-semibold text-white">Équipe connectée sur ce navigateur</h2>
      <div className="mt-4 space-y-3 text-sm text-white/80">
        {users.map((user) => (
          <div key={user.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-white">{user.username}</p>
                <p className="text-xs text-white/60">{fragmentRoleLabel(user.role)}</p>
              </div>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <label className="text-xs uppercase tracking-[0.3em] text-white/50">
                Rôle
                <select
                  value={user.role}
                  onChange={(event) => handleUpdate(user.id, { role: event.target.value as UserRole })}
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-white"
                >
                  {roleOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs uppercase tracking-[0.3em] text-white/50">
                Organisation
                <input
                  type="text"
                  value={user.organization ?? ""}
                  onChange={(event) => handleUpdate(user.id, { organization: event.target.value })}
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-white"
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default UserManagementPanel;

