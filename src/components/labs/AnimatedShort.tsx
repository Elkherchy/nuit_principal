"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { markModuleCompletion, unlockBadge, updateScore } from "../../lib/localStorageUtils";

const SCENES = [
  {
    id: "locks",
    title: "Les verrous",
    description: "Big Tech installe des cadenas sur chaque ordinateur du lycée.",
    color: "from-slate-900 to-slate-700",
    icon: "🔒",
  },
  {
    id: "penguin",
    title: "Arrivée du pingouin",
    description: "Un pingouin lumineux traverse le ciel avec une clé USB magique.",
    color: "from-sky-900 to-emerald-700",
    icon: "🐧",
  },
  {
    id: "village",
    title: "Village uni",
    description: "Le village répare, partage et allume des néons verts.",
    color: "from-emerald-900 to-lime-700",
    icon: "🏫",
  },
  {
    id: "tower",
    title: "Chute de la tour",
    description: "La tour Big Tech s&rsquo;effondre en brique de Lego.",
    color: "from-rose-900 to-orange-700",
    icon: "🏰",
  },
  {
    id: "cheer",
    title: "Libération",
    description: "Étudiants, robots et pingouins chantent sur la place centrale.",
    color: "from-purple-900 to-indigo-700",
    icon: "🎉",
  },
];

export function AnimatedShort() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    if (sceneIndex >= SCENES.length - 1) {
      const frame = requestAnimationFrame(() => {
        setPlaying(false);
        unlockBadge("movie");
        markModuleCompletion("movie");
        markModuleCompletion("labs");
        updateScore({ creativityScore: 95 });
      });
      return () => cancelAnimationFrame(frame);
    }
    const timer = setTimeout(() => setSceneIndex((prev) => prev + 1), 2000);
    return () => clearTimeout(timer);
  }, [playing, sceneIndex]);

  const play = () => {
    setSceneIndex(0);
    setPlaying(true);
  };

  const scene = SCENES[sceneIndex];

  return (
    <section className="rounded-3xl border border-cyan-200/40 bg-slate-900/80 p-6 text-white shadow-xl">
      <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Interactive Animated Short</p>
      <h2 className="mt-2 text-3xl font-semibold">60 secondes de résistance</h2>
      <p className="mt-2 text-sm text-white/70">Clique sur &quot;Play&quot; et regarde les scènes SVG s&rsquo;animer automatiquement.</p>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/70">
        <span>Scène {sceneIndex + 1} / {SCENES.length}</span>
        <span>{scene.title}</span>
        <button
          onClick={play}
          className="rounded-full border border-white/30 px-4 py-1 text-xs uppercase tracking-wide text-white"
        >
          {playing ? "Lecture..." : "Play"}
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4">
        <motion.div
          key={scene.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className={`flex flex-col items-center justify-center rounded-3xl bg-gradient-to-br ${scene.color} p-8 text-center`}
        >
          <motion.div
            animate={{ rotate: playing ? [0, 5, -5, 0] : 0 }}
            transition={{ repeat: playing ? Infinity : 0, duration: 1.2 }}
            className="text-6xl"
          >
            {scene.icon}
          </motion.div>
          <p className="mt-4 text-lg font-semibold">{scene.title}</p>
          <p className="text-sm text-white/80">{scene.description}</p>
        </motion.div>
      </div>
    </section>
  );
}

