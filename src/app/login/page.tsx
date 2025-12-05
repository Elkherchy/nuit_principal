"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = login(form);
    if (!result.success) {
      setError(result.message ?? "Connexion impossible");
      return;
    }
    router.push("/village");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
      <p className="text-sm uppercase tracking-[0.4em] text-emerald-300">Village NIRD</p>
      <h1 className="mt-2 text-3xl font-semibold">Connexion résistante</h1>
      <p className="mt-1 text-sm text-white/70">
        Retrouve ta progression, tes badges et tes idées dans le village numérique.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm">
          <span>Nom de gaulois</span>
          <input
            type="text"
            value={form.username}
            onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-white"
          />
        </label>
        <label className="block text-sm">
          <span>Mot de passe secret</span>
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-white"
          />
        </label>
        {error && <p className="text-xs text-rose-300">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 px-6 py-3 text-center text-sm font-semibold text-slate-900"
        >
          Se connecter
        </button>
      </form>
      <p className="mt-4 text-xs text-white/60">
        Pas encore membre ? <Link href="/register" className="text-emerald-300">Créer un compte</Link>
      </p>
    </div>
  );
}
