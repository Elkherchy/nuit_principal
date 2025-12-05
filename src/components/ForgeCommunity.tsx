"use client";

import { useEffect, useMemo, useState } from "react";
import { COMMUNITY_PROJECTS } from "../data/projects";
import {
  getIdeas,
  markModuleCompletion,
  saveIdea,
  unlockBadge,
  type CommunityIdea,
} from "../lib/localStorageUtils";

export function ForgeCommunity() {
  const [ideas, setIdeas] = useState<CommunityIdea[]>([]);
  const [form, setForm] = useState({ name: "", idea: "", email: "", category: "idee", link: "", impact: "" });
  const [message, setMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<CommunityIdea["category"] | "all">("all");

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) {
        setIdeas(getIdeas());
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name || !form.idea || !form.category) {
      setMessage("Merci de préciser ton nom, la contribution et la catégorie.");
      return;
    }
    const newEntry: CommunityIdea = {
      name: form.name,
      idea: form.idea,
      email: form.email || undefined,
      category: form.category as CommunityIdea["category"],
      link: form.link || undefined,
      impact: form.impact || undefined,
      tags: [form.category],
      timestamp: Date.now(),
    };
    setIdeas(saveIdea(newEntry));
    setForm({ name: "", idea: "", email: "", category: "idee", link: "", impact: "" });
    setMessage("Contribution ajoutée ! Merci pour la communauté NIRD.");
    unlockBadge("forge");
    markModuleCompletion("forge");
  };

  const filteredIdeas = useMemo(
    () => (filter === "all" ? ideas : ideas.filter((idea) => idea.category === filter)),
    [ideas, filter]
  );

  const stats = useMemo(() => {
    return ideas.reduce(
      (acc, idea) => {
        acc[idea.category] = (acc[idea.category] ?? 0) + 1;
        return acc;
      },
      {} as Record<CommunityIdea["category"], number>
    );
  }, [ideas]);

  return (
    <section className="rounded-3xl border border-violet-200/40 bg-slate-900/80 p-6 text-white">
      <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Forge communautaire</p>
      <h2 className="mt-2 text-3xl font-semibold">Partage une action concrète</h2>
      <p className="mt-1 text-sm text-white/70">Idées, recyclage, ressources libres et témoignages sont stockés localement (aucune donnée externe).</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          {COMMUNITY_PROJECTS.map((project) => (
            <div key={project.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-lg font-semibold">{project.title}</p>
              <p className="text-sm text-white/70">{project.description}</p>
              <p className="text-xs uppercase tracking-wide text-white/50">Porté par {project.owner}</p>
            </div>
          ))}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-xs text-white/70">
            <p className="text-white/50">Statistiques locales :</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["idee", "atelier", "ressource", "temoignage"] as CommunityIdea["category"][]).map((category) => (
                <span key={category} className="rounded-full border border-white/10 px-3 py-1">
                  {category} : {stats[category] ?? 0}
                </span>
              ))}
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-4">
          <label className="block text-sm">
            <span>Nom ou équipe</span>
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-white"
            />
          </label>
          <label className="block text-sm">
            <span>Catégorie</span>
            <select
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-white"
            >
              <option value="idee">Idée / pratique</option>
              <option value="atelier">Reconditionnement</option>
              <option value="ressource">Ressource libre</option>
              <option value="temoignage">Témoignage</option>
            </select>
          </label>
          <label className="block text-sm">
            <span>Contribution</span>
            <textarea
              value={form.idea}
              onChange={(event) => setForm((prev) => ({ ...prev, idea: event.target.value }))}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-white"
              rows={4}
            />
          </label>
          <label className="block text-sm">
            <span>Impact mesuré (CO₂, inclusion...)</span>
            <input
              type="text"
              value={form.impact}
              onChange={(event) => setForm((prev) => ({ ...prev, impact: event.target.value }))}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-white"
            />
          </label>
          <label className="block text-sm">
            <span>Lien vers ressource (optionnel)</span>
            <input
              type="url"
              value={form.link}
              onChange={(event) => setForm((prev) => ({ ...prev, link: event.target.value }))}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-white"
            />
          </label>
          <label className="block text-sm">
            <span>Email (optionnel)</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-white"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-violet-400 to-indigo-500 px-6 py-3 text-sm font-semibold text-slate-900"
          >
            Je veux contribuer
          </button>
          {message && <p className="text-xs text-violet-200">{message}</p>}
        </form>
      </div>

      <div className="mt-6 space-y-3 text-sm">
        <div className="flex flex-wrap gap-2 text-xs">
          {(["all", "idee", "atelier", "ressource", "temoignage"] as const).map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`rounded-full border px-3 py-1 ${
                filter === category ? "border-violet-300 bg-violet-300/20" : "border-white/20 text-white/70"
              }`}
            >
              {category === "all" ? "Tout voir" : category}
            </button>
          ))}
        </div>
        {filteredIdeas.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white/70">
            Les prochaines idées apparaîtront ici.
          </p>
        ) : (
          filteredIdeas.map((idea) => (
            <div key={idea.timestamp} className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center justify-between text-xs uppercase tracking-wide text-white/50">
                <span>{idea.name}</span>
                <span>{idea.category}</span>
              </div>
              <p className="mt-1 text-white">{idea.idea}</p>
              {idea.impact && <p className="text-xs text-emerald-200">Impact : {idea.impact}</p>}
              {idea.link && (
                <a href={idea.link} target="_blank" rel="noreferrer" className="text-xs text-cyan-300 underline">
                  Ressource
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
