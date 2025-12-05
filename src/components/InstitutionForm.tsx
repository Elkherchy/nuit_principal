"use client";

import { useState } from "react";
import type { Institution, InstitutionMetricId } from "../data/institutions";

const metricFields: { id: InstitutionMetricId; label: string; helper: string }[] = [
  { id: "linux", label: "% Postes Linux", helper: "Pourcentage de postes sous GNU/Linux." },
  { id: "libreSuite", label: "% Suites libres", helper: "LibreOffice, OnlyOffice, etc." },
  { id: "reemploi", label: "% Réemploi", helper: "Part du matériel reconditionné." },
  { id: "cloudDependence", label: "% Dépendance Cloud propriétaire", helper: "Plus c'est bas, mieux c'est." },
  { id: "sovereignty", label: "Score Souveraineté", helper: "Auto-hébergement, maîtrise des données." },
  { id: "inclusion", label: "Score Inclusion", helper: "Accessibilité, prêts de matériel, médiation." },
  { id: "co2", label: "Score Sobriété CO₂", helper: "0-100, économies réalisées." },
];

const defaultState: Institution = {
  id: "",
  name: "",
  type: "Lycée",
  location: "",
  description: "",
  metrics: {
    linux: 40,
    libreSuite: 40,
    reemploi: 40,
    cloudDependence: 60,
    sovereignty: 40,
    inclusion: 40,
    co2: 40,
  },
  actions: [],
};

type InstitutionFormProps = {
  onSave: (institution: Institution) => void;
};

export function InstitutionForm({ onSave }: InstitutionFormProps) {
  const [form, setForm] = useState<Institution>(defaultState);
  const [note, setNote] = useState<string | null>(null);

  const handleChange = (field: keyof Institution, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleMetricChange = (metric: InstitutionMetricId, value: number) => {
    setForm((prev) => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [metric]: value,
      },
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setNote("Merci d'indiquer un nom d'établissement.");
      return;
    }
    const payload: Institution = {
      ...form,
      id: form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 32) || `custom-${Date.now()}`,
      actions: [
        "Organiser un audit NIRD trimestriel.",
        "Publier un plan d'action dans la Forge.",
        "Associer éco-délégués et direction aux décisions.",
      ],
    };
    onSave(payload);
    setForm(defaultState);
    setNote("Établissement ajouté. Sélectionne-le ensuite dans la liste 🔍");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5">
      <div>
        <p className="text-sm uppercase tracking-[0.4em] text-white/50">Mon établissement</p>
        <p className="text-base text-white/70">Décris rapidement ton campus pour le comparer.</p>
      </div>
      <label className="block text-sm text-white/80">
        Nom
        <input
          type="text"
          value={form.name}
          onChange={(event) => handleChange("name", event.target.value)}
          className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-white"
          required
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-white/80">
          Type
          <select
            value={form.type}
            onChange={(event) => handleChange("type", event.target.value)}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-white"
          >
            <option value="Lycée">Lycée</option>
            <option value="Collège">Collège</option>
            <option value="Campus">Campus</option>
            <option value="Fablab">Fablab</option>
          </select>
        </label>
        <label className="text-sm text-white/80">
          Ville / Région
          <input
            type="text"
            value={form.location}
            onChange={(event) => handleChange("location", event.target.value)}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-white"
          />
        </label>
      </div>
      <label className="block text-sm text-white/80">
        Pitch rapide
        <textarea
          value={form.description}
          onChange={(event) => handleChange("description", event.target.value)}
          rows={3}
          className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-white"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        {metricFields.map((metric) => (
          <label key={metric.id} className="text-xs text-white/60">
            {metric.label}
            <input
              type="range"
              min={0}
              max={100}
              value={form.metrics[metric.id]}
              onChange={(event) => handleMetricChange(metric.id, Number(event.target.value))}
              className="mt-1 w-full accent-emerald-400"
            />
            <div className="flex items-center justify-between text-[0.75rem] text-white/70">
              <span>{metric.helper}</span>
              <span className="text-white font-semibold">{form.metrics[metric.id]}%</span>
            </div>
          </label>
        ))}
      </div>
      <button
        type="submit"
        className="w-full rounded-full bg-gradient-to-r from-emerald-300 to-cyan-400 px-4 py-3 text-sm font-semibold text-slate-900"
      >
        Enregistrer mon établissement
      </button>
      {note && <p className="text-xs text-emerald-200">{note}</p>}
    </form>
  );
}

export default InstitutionForm;


