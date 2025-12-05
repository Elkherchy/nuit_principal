"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BUILDINGS } from "../data/buildings";
import { BADGES } from "../lib/progression";
import type { ProgressState } from "../lib/localStorageUtils";
import { getProgress } from "../lib/localStorageUtils";
import { BuildingCard } from "./BuildingCard";

const defaultProgress: ProgressState = {
  badges: [],
  completedModules: [],
};

const SKY_CYCLE = [
  {
    id: "dawn",
    label: "Aube pastel",
    gradient: "from-slate-900 via-sky-900 to-slate-950",
    overlay: "bg-amber-300/15",
    stars: false,
  },
  {
    id: "day",
    label: "Midi solaire",
    gradient: "from-sky-900 via-emerald-900 to-slate-900",
    overlay: "bg-emerald-300/15",
    stars: false,
  },
  {
    id: "sunset",
    label: "Crépuscule flamboyant",
    gradient: "from-indigo-900 via-rose-900 to-slate-950",
    overlay: "bg-pink-500/20",
    stars: false,
  },
  {
    id: "night",
    label: "Nuit étoilée",
    gradient: "from-slate-950 via-purple-950 to-black",
    overlay: "bg-violet-500/20",
    stars: true,
  },
] as const;

type NpcState = {
  id: string;
  label: string;
  emoji: string;
  offset: number;
  altitude: number;
  direction: "left" | "right";
  speed: number;
};

export function VillageMap() {
  const [progress, setProgress] = useState<ProgressState>(defaultProgress);
  const [cycle, setCycle] = useState(0);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [npcs, setNpcs] = useState<NpcState[]>([
    { id: "students", label: "Élèves libres", emoji: "🧑‍💻", offset: 8, altitude: 25, direction: "right", speed: 2.2 },
    { id: "penguin", label: "Pingouin Linux", emoji: "🐧", offset: 55, altitude: 45, direction: "left", speed: 1.6 },
    { id: "robot", label: "Robot réparateur", emoji: "🤖", offset: 30, altitude: 60, direction: "right", speed: 1.1 },
  ]);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) {
        setProgress(getProgress());
      }
    });
    const handler = () => setProgress(getProgress());
    window.addEventListener("storage", handler);
    return () => {
      cancelled = true;
      window.removeEventListener("storage", handler);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCycle((prev) => (prev + 1) % SKY_CYCLE.length);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const x = ((event.clientX / window.innerWidth) - 0.5) * 18;
      const y = ((event.clientY / window.innerHeight) - 0.5) * 10;
      setParallax({ x, y });
    };
    window.addEventListener("pointermove", handler);
    return () => window.removeEventListener("pointermove", handler);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setNpcs((prev) =>
        prev.map((npc) => {
          const directionFactor = npc.direction === "right" ? 1 : -1;
          let nextOffset = npc.offset + npc.speed * directionFactor;
          let nextDirection = npc.direction;
          if (nextOffset >= 92) {
            nextOffset = 92;
            nextDirection = "left";
          }
          if (nextOffset <= 2) {
            nextOffset = 2;
            nextDirection = "right";
          }
          return { ...npc, offset: nextOffset, direction: nextDirection };
        })
      );
    }, 900);
    return () => clearInterval(interval);
  }, []);

  const currentSky = SKY_CYCLE[cycle];
  const badgesTotal = BADGES.length;
  const completionPercent = Math.round((progress.badges.length / badgesTotal) * 100);
  const buildingCount = BUILDINGS.length;

  return (
    <section className={`relative overflow-hidden rounded-3xl bg-gradient-to-b ${currentSky.gradient} p-8 text-white shadow-2xl`}>
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{ transform: `translate(${parallax.x}px, ${parallax.y}px)` }}
      >
        <div className={`absolute inset-0 blur-3xl ${currentSky.overlay}`} />
        {currentSky.stars && (
          <div className="absolute inset-0 opacity-40">
            <div className="absolute inset-0 bg-[radial-gradient(circle,#e0f2fe_1px,transparent_1px)] bg-[length:90px_90px]" />
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col gap-2 pb-6"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Village Numérique Résistant</p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold">Choisis ta mission</h1>
          <span className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-wide text-white/70">
            {currentSky.label}
          </span>
        </div>
        <p className="text-slate-200">
          {buildingCount} bâtiments, {badgesTotal} badges. Chaque module débloque une compétence pour résister aux Big Tech.
        </p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
          <span>
            {progress.badges.length} / {badgesTotal} badges
          </span>
          <span>Progression globale : {completionPercent}%</span>
          <span>NPC actifs : {npcs.length}</span>
        </div>
      </motion.div>

      <div className="relative z-10 grid gap-6 md:grid-cols-3">
        {BUILDINGS.map((building) => (
          <BuildingCard
            key={building.id}
            building={building}
            isCompleted={progress.completedModules.includes(building.id)}
            hasBadge={progress.badges.includes(building.id)}
          />
        ))}
      </div>

      <div className="relative z-10 mt-6 h-32 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        {npcs.map((npc) => (
          <motion.div
            key={npc.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute flex flex-col items-center text-xs text-white/80"
            style={{ left: `${npc.offset}%`, top: `${npc.altitude}%` }}
          >
            <span className="text-xl drop-shadow">{npc.emoji}</span>
            <span className="rounded-full bg-slate-900/70 px-2 py-0.5 backdrop-blur">{npc.label}</span>
          </motion.div>
        ))}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-950/80 via-slate-900/60 to-transparent" />
      </div>
    </section>
  );
}
