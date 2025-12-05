"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { getScore, type NirdScore } from "../lib/localStorageUtils";

const DEFAULT_SCORE: NirdScore = {
  bigTechScore: 0,
  ecoScore: 0,
  autonomyScore: 0,
  privacyScore: 0,
  inclusionScore: 0,
  creativityScore: 0,
  durabilityScore: 0,
};

const METRICS: { id: keyof NirdScore; label: string; color: string; suffix?: string }[] = [
  { id: "autonomyScore", label: "Autonomie", color: "from-emerald-300 to-emerald-600", suffix: "pts" },
  { id: "privacyScore", label: "Vie privée", color: "from-sky-300 to-indigo-500", suffix: "pts" },
  { id: "ecoScore", label: "CO₂ évité", color: "from-lime-200 to-green-500", suffix: "kg" },
  { id: "bigTechScore", label: "Trackers bloqués", color: "from-rose-300 to-fuchsia-500" },
  { id: "inclusionScore", label: "Inclusion", color: "from-pink-300 to-rose-500", suffix: "pts" },
  { id: "durabilityScore", label: "Durabilité", color: "from-amber-300 to-orange-500", suffix: "pts" },
  { id: "creativityScore", label: "Créativité", color: "from-purple-300 to-indigo-500", suffix: "pts" },
];

export function NirdScorePanel() {
  const [score, setScore] = useState<NirdScore>(DEFAULT_SCORE);

  const refresh = useCallback(() => {
    setScore(getScore());
  }, []);

  useEffect(() => {
    const handler = () => refresh();
    const frame = requestAnimationFrame(() => refresh());
    window.addEventListener("storage", handler);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("storage", handler);
    };
  }, [refresh]);

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-white">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">NIRD Score</p>
          <h2 className="text-2xl font-semibold">Indicateurs cumulés</h2>
        </div>
        <button onClick={refresh} className="rounded-full border border-white/30 px-4 py-2 text-xs uppercase tracking-wide">
          Rafraîchir
        </button>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {METRICS.map((metric) => {
          const value = score[metric.id] ?? 0;
          const normalized = Math.min(100, Math.abs(value));
          return (
            <div key={metric.id} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>{metric.label}</span>
                <span>
                  {value} {metric.suffix ?? ""}
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${normalized}%` }}
                  transition={{ duration: 0.6 }}
                  className={`h-2 rounded-full bg-gradient-to-r ${metric.color}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

