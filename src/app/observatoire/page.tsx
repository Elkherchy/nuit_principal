"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ComparisonChart } from "../../components/ComparisonChart";
import { ComparisonExportButton } from "../../components/ComparisonExportButton";
import { InstitutionForm } from "../../components/InstitutionForm";
import { InstitutionSelector } from "../../components/InstitutionSelector";
import InstitutionSummary from "../../components/InstitutionSummary";
import type { Institution } from "../../data/institutions";
import { DEFAULT_INSTITUTIONS } from "../../data/institutions";
import { getCustomInstitutions, saveCustomInstitution } from "../../lib/institutions";
import { markModuleCompletion, unlockBadge, updateScore } from "../../lib/localStorageUtils";
import { METRIC_ORDER } from "../../lib/metrics";

export default function ObservatoirePage() {
  const [institutions, setInstitutions] = useState<Institution[]>(DEFAULT_INSTITUTIONS);
  const [selectedIds, setSelectedIds] = useState<string[]>([DEFAULT_INSTITUTIONS[0].id, DEFAULT_INSTITUTIONS[1].id]);
  const [analysisCount, setAnalysisCount] = useState(0);

  useEffect(() => {
    const custom = getCustomInstitutions();
    if (custom.length === 0) return;
    const frame = requestAnimationFrame(() => {
      setInstitutions((prev) => {
        const existingIds = new Set(prev.map((inst) => inst.id));
        const additions = custom.filter((inst) => !existingIds.has(inst.id));
        return [...prev, ...additions];
      });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const selectedInstitutions = useMemo(() => {
    const map = new Map(institutions.map((inst) => [inst.id, inst]));
    const chosen = selectedIds.map((id) => map.get(id)).filter(Boolean) as Institution[];
    if (chosen.length === 2) {
      return chosen;
    }
    return institutions.slice(0, 2);
  }, [institutions, selectedIds]);

  const handleSaveCustom = (institution: Institution) => {
    saveCustomInstitution(institution);
    setInstitutions((prev) => {
      const others = prev.filter((item) => item.id !== institution.id);
      return [...others, institution];
    });
    setSelectedIds((prev) => [institution.id, prev[1] ?? DEFAULT_INSTITUTIONS[0].id]);
  };

  const generateSuggestions = (focus: Institution, reference: Institution) => {
    const ideas: string[] = [];
    if (reference.metrics.linux - focus.metrics.linux >= 10) {
      ideas.push("Planifier une session d'installation Linux pour 10 postes pilotes.");
    }
    if (reference.metrics.reemploi - focus.metrics.reemploi >= 10) {
      ideas.push("Créer un atelier mensuel de reconditionnement avec les élèves.");
    }
    if (focus.metrics.cloudDependence - reference.metrics.cloudDependence >= 15) {
      ideas.push("Migrer un service critique vers une alternative libre hébergée en interne.");
    }
    if (reference.metrics.inclusion - focus.metrics.inclusion >= 10) {
      ideas.push("Organiser une permanence numérique pour les familles et renforcer l'accessibilité.");
    }
    if (ideas.length === 0) {
      ideas.push("Capitaliser sur vos points forts et documenter vos pratiques pour la Forge NIRD.");
    }
    return ideas;
  };

  const suggestionList = useMemo(() => {
    if (selectedInstitutions.length !== 2) return [];
    return generateSuggestions(selectedInstitutions[0], selectedInstitutions[1]);
  }, [selectedInstitutions]);

  const handleAnalyse = () => {
    const nextCount = analysisCount + 1;
    setAnalysisCount(nextCount);
    unlockBadge("observatoire");
    markModuleCompletion("observatoire");
    const [a, b] = selectedInstitutions;
    const autonomyDelta = Math.max(0, a.metrics.sovereignty - b.metrics.sovereignty);
    updateScore({ creativityScore: 20 + nextCount * 2, autonomyScore: autonomyDelta });
  };

  return (
    <div className="space-y-8 text-white">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm uppercase tracking-[0.4em] text-cyan-300">Observatoire NIRD</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">
            Compare deux établissements, repère les leviers et bâtis un plan d’action.
          </h1>
          <p className="mt-3 text-base text-white/80">
            Cet observatoire met en miroir autonomie logicielle, sobriété, inclusion et dépendance aux Big Tech. Ajoute ton propre établissement, analyse les écarts et récupère des actions concrètes.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/70">
            <span className="rounded-full border border-white/20 px-3 py-1">Linux / Libre</span>
            <span className="rounded-full border border-white/20 px-3 py-1">Réemploi & CO₂</span>
            <span className="rounded-full border border-white/20 px-3 py-1">Souveraineté</span>
            <span className="rounded-full border border-white/20 px-3 py-1">Inclusion</span>
          </div>
        </motion.div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <InstitutionSelector institutions={institutions} selectedIds={selectedIds} onChange={setSelectedIds} />
          <button
            onClick={handleAnalyse}
            className="w-full rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-lime-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          >
            Lancer l’analyse comparée
          </button>
          <ComparisonChart institutions={selectedInstitutions} metrics={METRIC_ORDER} />
        </div>
        <div className="space-y-6">
          <InstitutionForm onSave={handleSaveCustom} />
          {selectedInstitutions.length === 2 && (
            <div className="space-y-4">
              <InstitutionSummary
                focus={selectedInstitutions[0]}
                reference={selectedInstitutions[1]}
                suggestions={suggestionList}
              />
              <ComparisonExportButton
                focus={selectedInstitutions[0]}
                reference={selectedInstitutions[1]}
                suggestions={suggestionList}
                metrics={METRIC_ORDER}
              />
            </div>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/80">
        <h2 className="text-lg font-semibold text-white">Comment lire les scores ?</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>Linux / Suites libres / Réemploi / Souveraineté / Inclusion / CO₂ : score 0-100, plus c’est haut plus l’établissement est aligné NIRD.</li>
          <li>Dépendance cloud propriétaire : score 0-100, mais bas = mieux.</li>
          <li>Chaque analyse alimente ton badge “Analyste NIRD” et le NIRD Score global.</li>
        </ul>
      </section>
    </div>
  );
}


