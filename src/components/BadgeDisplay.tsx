"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BADGES } from "../lib/progression";
import type { ProgressState } from "../lib/localStorageUtils";
import { getProgress, resetProgress } from "../lib/localStorageUtils";

const emptyProgress: ProgressState = {
  badges: [],
  completedModules: [],
};

export function BadgeDisplay() {
  const [progress, setProgress] = useState<ProgressState>(emptyProgress);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) {
        setProgress(getProgress());
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleReset = () => {
    resetProgress();
    setProgress(emptyProgress);
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 text-white">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Badges NIRD</p>
          <h2 className="text-2xl font-semibold">Collection du Village</h2>
        </div>
        <button
          onClick={handleReset}
          className="rounded-full border border-white/30 px-4 py-2 text-xs uppercase tracking-wider text-white/80 transition hover:bg-white/10"
        >
          Réinitialiser
        </button>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BADGES.map((badge) => {
          const Icon = badge.icon;
          const earned = progress.badges.includes(badge.id);
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: earned ? 1 : 0.96 }}
              transition={{ delay: 0.05 }}
              className={`rounded-3xl border border-white/10 bg-gradient-to-br ${badge.color} p-4 text-slate-900 shadow-xl ${earned ? "opacity-100" : "opacity-50 grayscale"}`}
            >
              <div className="flex items-center gap-3">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-white/80">
                  <Icon size={28} />
                </span>
                <div>
                  <p className="text-sm font-semibold">{badge.title}</p>
                  <p className="text-xs text-slate-800">{badge.description}</p>
                </div>
              </div>
              <p className="mt-4 text-sm font-medium text-slate-800">{badge.reward}</p>
              <p className="text-xs uppercase tracking-wide text-slate-700">
                {earned ? "Débloqué" : "À gagner"}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
