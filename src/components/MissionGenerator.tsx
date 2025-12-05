"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { MISSIONS, type Mission } from "../data/missions";
import { unlockBadge, markModuleCompletion } from "../lib/localStorageUtils";

const themeLabels: Record<Mission["theme"], string> = {
  linux: "Linux",
  reemploi: "Réemploi",
  privacy: "Vie privée",
  community: "Communauté",
  eco: "Sobriété",
  labs: "NIRD Labs",
};

export function MissionGenerator() {
  const [mission, setMission] = useState<Mission | null>(null);
  const [history, setHistory] = useState<Mission[]>([]);

  const handleGenerate = () => {
    const pool = MISSIONS.filter((item) => !history.some((past) => past.id === item.id));
    const nextPool = pool.length > 0 ? pool : MISSIONS;
    const pick = nextPool[Math.floor(Math.random() * nextPool.length)];
    setMission(pick);
    setHistory((prev) => {
      const next = [pick, ...prev];
      return next.slice(0, 5);
    });
    unlockBadge("mission");
    markModuleCompletion("missions");
  };

  const themeBadge = useMemo(() => {
    if (!mission) return null;
    return themeLabels[mission.theme] ?? mission.theme;
  }, [mission]);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <p className="text-sm uppercase tracking-[0.4em] text-amber-300">Mission Generator</p>
      <h2 className="mt-2 text-3xl font-semibold text-white">Reçois ton brief secret</h2>
      <p className="mt-2 text-sm text-white/70">
        Les druides de la Forge t&rsquo;envoient une mission unique. Accomplis-la, partage la preuve et gagne de la notoriété au village.
      </p>
      <button
        onClick={handleGenerate}
        className="mt-4 rounded-full bg-gradient-to-r from-amber-300 to-rose-400 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:scale-[1.01]"
      >
        Générer un brief héroïque
      </button>
      {mission && (
        <motion.div
          key={mission.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 rounded-3xl border border-amber-300/40 bg-amber-300/10 p-4 text-sm text-white/80"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">{mission.title}</h3>
            <span className="rounded-full border border-white/40 px-3 py-1 text-xs uppercase tracking-[0.4em] text-white/70">
              {themeBadge}
            </span>
          </div>
          <p className="mt-2">{mission.description}</p>
          <p className="mt-2 text-white">Action demandée :</p>
          <p className="text-white/90">{mission.action}</p>
        </motion.div>
      )}
      {history.length > 0 && (
        <div className="mt-5">
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Historique</p>
          <ul className="mt-2 space-y-1 text-xs text-white/70">
            {history.map((item) => (
              <li key={item.id}>• {item.title}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default MissionGenerator;

