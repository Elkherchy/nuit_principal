"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { markModuleCompletion, unlockBadge, updateScore } from "../../lib/localStorageUtils";

type Action = {
  id: string;
  label: string;
  details: string;
  impact: string;
  value: number;
};

const ACTIONS: Action[] = [
  {
    id: "spyware",
    label: "Retirer les spywares",
    details: "Analyse complète, suppression des barres d&rsquo;outils et pilotes douteux.",
    impact: "Vie privée",
    value: 12,
  },
  {
    id: "hardware",
    label: "Nettoyer le hardware",
    details: "Soufflette, pâte thermique, remplacement ventilateur.",
    impact: "Durabilité",
    value: 10,
  },
  {
    id: "disk",
    label: "Cloner / Sauver les données",
    details: "Copie sécurisée sur disque externe libre.",
    impact: "Inclusion",
    value: 8,
  },
  {
    id: "install",
    label: "Installer Linux",
    details: "Choix d&rsquo;une distribution légère, pilotes open source.",
    impact: "Liberté",
    value: 20,
  },
  {
    id: "apps",
    label: "Ajouter apps libres",
    details: "Suite bureautique, montage, apprentissage.",
    impact: "Pédagogie",
    value: 10,
  },
  {
    id: "privacy",
    label: "Configurer la vie privée",
    details: "Pare-feu, DNS libres, comptes séparés.",
    impact: "Vie privée",
    value: 8,
  },
  {
    id: "training",
    label: "Former les élèves",
    details: "Mini ateliers d&rsquo;onboarding et d&rsquo;accessibilité.",
    impact: "Inclusion",
    value: 10,
  },
];

export function LinuxResurrectionMachine() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [log, setLog] = useState<string[]>([]);

  const progress = useMemo(() => Math.round((completed.length / ACTIONS.length) * 100), [completed.length]);
  const co2Saved = 12 + completed.length * 2;
  const budgetSaved = 200 + completed.length * 15;

  useEffect(() => {
    if (completed.length === ACTIONS.length) {
      unlockBadge("resurrection");
      markModuleCompletion("resurrection");
      markModuleCompletion("linux");
      updateScore({
        durabilityScore: 80,
        ecoScore: co2Saved,
      });
    }
  }, [completed.length, co2Saved]);

  const handleAction = (action: Action) => {
    if (completed.includes(action.id)) return;
    setCompleted((prev) => [...prev, action.id]);
    setLog((prev) => [`✔ ${action.label} – ${action.impact}`, ...prev].slice(0, 6));
  };

  return (
    <section className="rounded-3xl border border-cyan-200/40 bg-slate-900/80 p-6 text-white shadow-xl">
      <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Linux Resurrection Machine</p>
      <h2 className="mt-2 text-3xl font-semibold">Ramène un PC Windows fatigué à la vie</h2>
      <p className="mt-2 text-sm text-white/70">
        Clique sur chaque étape pour remplir la jauge. Quand tout est vert, la machine renaît et tu gagnes ton badge Obélix.
      </p>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs uppercase tracking-wide text-white/60">
          <span>Progression</span>
          <span>{progress}%</span>
        </div>
        <div className="mt-2 h-3 rounded-full bg-white/10">
          <div className="h-3 rounded-full bg-gradient-to-r from-sky-400 to-emerald-400" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {ACTIONS.map((action) => (
          <motion.button
            key={action.id}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleAction(action)}
            className={`rounded-3xl border p-4 text-left ${
              completed.includes(action.id) ? "border-emerald-300 bg-emerald-300/20" : "border-white/10 bg-white/5"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{action.label}</p>
                <p className="text-xs text-white/60">{action.details}</p>
              </div>
              <span className="text-xs uppercase tracking-wide text-white/70">{action.impact}</span>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
          <p>Félicitations ! Tu as sauvé <strong>{co2Saved} kg de CO₂</strong> et <strong>{budgetSaved} €</strong>.</p>
          <p className="text-xs text-white/60">
            Bonus : amélioration des scores durabilité et vie privée pour l&rsquo;ensemble du village.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-black/40 p-4 font-mono text-xs text-emerald-200">
          {log.length === 0 ? <p>$ machine prête à être réparée</p> : log.map((line, index) => <p key={index}>$ {line}</p>)}
        </div>
      </div>
    </section>
  );
}

