"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { markModuleCompletion, unlockBadge, updateScore } from "../../lib/localStorageUtils";

type CategoryId = "reconditionnement" | "libres" | "inclusion" | "privacy";

type BuildingOption = {
  id: string;
  label: string;
  emoji: string;
  description: string;
  points: Record<CategoryId, number>;
};

const GRID_SIZE = 4;
const TARGET_INDEX = 80;

const BUILDINGS: BuildingOption[] = [
  {
    id: "atelier",
    label: "Reconditionnement atelier",
    emoji: "🛠️",
    description: "Répare les PC et collecte des pièces.",
    points: { reconditionnement: 20, libres: 5, inclusion: 5, privacy: 0 },
  },
  {
    id: "linux-room",
    label: "Salle Linux",
    emoji: "🐧",
    description: "Postes préinstallés en GNU/Linux.",
    points: { reconditionnement: 5, libres: 15, inclusion: 5, privacy: 5 },
  },
  {
    id: "bibliotheque",
    label: "Bibliothèque Libre",
    emoji: "📚",
    description: "Fonds documentaire libre et partagé.",
    points: { reconditionnement: 0, libres: 10, inclusion: 10, privacy: 0 },
  },
  {
    id: "recyclerie",
    label: "Recyclerie",
    emoji: "♻️",
    description: "Réemploi et dons solidaires.",
    points: { reconditionnement: 15, libres: 0, inclusion: 10, privacy: 0 },
  },
  {
    id: "mur",
    label: "Mur Anti-BigTech",
    emoji: "🛡️",
    description: "Bloque trackers et popups.",
    points: { reconditionnement: 0, libres: 5, inclusion: 0, privacy: 20 },
  },
  {
    id: "tour",
    label: "Tour de Vie Privée",
    emoji: "🏰",
    description: "Sensibilisation et VPN libres.",
    points: { reconditionnement: 0, libres: 5, inclusion: 0, privacy: 15 },
  },
  {
    id: "atelier-open",
    label: "Atelier open-source",
    emoji: "🔧",
    description: "Assemblage, scripts et support.",
    points: { reconditionnement: 10, libres: 10, inclusion: 5, privacy: 5 },
  },
];

const CATEGORIES: { id: CategoryId; label: string; color: string }[] = [
  { id: "reconditionnement", label: "Réemploi", color: "from-amber-200 to-amber-500" },
  { id: "libres", label: "Logiciels libres", color: "from-cyan-200 to-sky-500" },
  { id: "inclusion", label: "Inclusion", color: "from-pink-200 to-rose-500" },
  { id: "privacy", label: "Vie privée", color: "from-emerald-200 to-green-500" },
];

export function VillageBuilder() {
  const [selectedId, setSelectedId] = useState<string | null>(BUILDINGS[0].id);
  const [grid, setGrid] = useState<(BuildingOption | null)[]>(() => Array(GRID_SIZE * GRID_SIZE).fill(null));
  const awardedRef = useRef(false);

  const stats = useMemo(() => {
    return grid.reduce<Record<CategoryId, number>>(
      (acc, building) => {
        if (!building) return acc;
        CATEGORIES.forEach((category) => {
          acc[category.id] += building.points[category.id];
        });
        return acc;
      },
      { reconditionnement: 0, libres: 0, inclusion: 0, privacy: 0 }
    );
  }, [grid]);

  const nirdIndex = useMemo(
    () => Object.values(stats).reduce((total, value) => total + value, 0),
    [stats]
  );

  useEffect(() => {
    if (!awardedRef.current && nirdIndex >= TARGET_INDEX) {
      awardedRef.current = true;
      unlockBadge("city");
      unlockBadge("labs");
      markModuleCompletion("city");
      markModuleCompletion("labs");
      updateScore({ autonomyScore: Math.min(100, nirdIndex) });
    }
  }, [nirdIndex]);

  const handleCellClick = (index: number) => {
    setGrid((prev) => {
      const next = [...prev];
      if (!selectedId) {
        next[index] = null;
        return next;
      }
      if (next[index]) return prev;
      const building = BUILDINGS.find((item) => item.id === selectedId);
      if (!building) return prev;
      next[index] = building;
      return next;
    });
  };

  const handleClear = () => {
    setGrid(Array(GRID_SIZE * GRID_SIZE).fill(null));
    setSelectedId(BUILDINGS[0].id);
    awardedRef.current = false;
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-white shadow-xl">
      <p className="text-sm uppercase tracking-[0.3em] text-teal-300">Build-Your-Own Resistant Village</p>
      <h2 className="mt-2 text-3xl font-semibold">Compose ton campus autonome</h2>
      <p className="mt-2 text-sm text-white/70">
        Glisse-dépose mentalement (clique) les bâtiments sur la grille. Chaque construction rapporte des points NIRD. Vise un index supérieur à {TARGET_INDEX}.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          {BUILDINGS.map((building) => (
            <button
              key={building.id}
              onClick={() => setSelectedId(building.id)}
              className={`flex w-full items-start gap-3 rounded-3xl border px-4 py-3 text-left transition ${
                selectedId === building.id ? "border-teal-300 bg-white/10" : "border-white/10 bg-white/5"
              }`}
            >
              <span className="text-2xl">{building.emoji}</span>
              <div>
                <p className="text-sm font-semibold">{building.label}</p>
                <p className="text-xs text-white/70">{building.description}</p>
              </div>
            </button>
          ))}
          <button
            onClick={() => setSelectedId(null)}
            className={`w-full rounded-3xl border px-4 py-3 text-sm font-semibold ${
              selectedId === null ? "border-rose-300 bg-rose-300/20 text-rose-100" : "border-white/10 text-white/70"
            }`}
          >
            Mode gomme
          </button>
          <button onClick={handleClear} className="w-full rounded-3xl border border-white/20 px-4 py-3 text-sm text-white/80">
            Réinitialiser la grille
          </button>
        </div>

        <div>
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            }}
          >
            {grid.map((cell, index) => (
              <motion.button
                key={index}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleCellClick(index)}
                className="aspect-square rounded-2xl border border-white/10 bg-white/5 text-2xl text-white/80"
              >
                {cell?.emoji ?? "·"}
              </motion.button>
            ))}
          </div>
          <p className="mt-3 text-sm text-white/60">
            Sélectionne un bâtiment puis clique sur une case vide. Choisis le mode gomme pour libérer une case.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-white/60">Tableau NIRD</p>
        {CATEGORIES.map((category) => (
          <div key={category.id}>
            <div className="flex items-center justify-between text-xs text-white/70">
              <span>{category.label}</span>
              <span>{stats[category.id]} pts</span>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-white/10">
              <div
                className={`h-2 rounded-full bg-gradient-to-r ${category.color}`}
                style={{ width: `${Math.min(100, stats[category.id])}%` }}
              />
            </div>
          </div>
        ))}
        <p className="text-sm font-semibold text-white">
          NIRD Index : {nirdIndex} / 120
          {nirdIndex >= TARGET_INDEX && <span className="ml-2 text-emerald-300">Objectif atteint !</span>}
        </p>
      </div>
    </section>
  );
}

