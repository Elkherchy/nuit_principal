"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { markModuleCompletion, unlockBadge, updateScore } from "../../lib/localStorageUtils";

type Potion = {
  id: string;
  label: string;
  description: string;
  color: string;
  effects: {
    autonomy: number;
    inclusion: number;
    durability: number;
  };
};

const POTIONS: Potion[] = [
  {
    id: "liberte",
    label: "Potion de Liberté",
    description: "Dissout les licences toxiques.",
    color: "from-sky-400 to-blue-500",
    effects: { autonomy: 20, inclusion: 0, durability: 5 },
  },
  {
    id: "durabilite",
    label: "Potion de Durabilité",
    description: "Répare les circuits épuisés.",
    color: "from-emerald-400 to-lime-500",
    effects: { autonomy: 5, inclusion: 0, durability: 20 },
  },
  {
    id: "inclusion",
    label: "Potion d’Inclusion",
    description: "Chaque élève contribue.",
    color: "from-pink-400 to-rose-500",
    effects: { autonomy: 0, inclusion: 20, durability: 5 },
  },
  {
    id: "anti-bigtech",
    label: "Potion Sans Big Tech",
    description: "Repousse les popups et trackers.",
    color: "from-amber-400 to-orange-500",
    effects: { autonomy: 10, inclusion: 5, durability: 5 },
  },
];

export function PotionLab() {
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("Ajoute 2 ou 3 potions pour infuser ton badge.");

  const toggle = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const brew = () => {
    if (selected.length < 2) {
      setMessage("Choisis au moins deux potions.");
      return;
    }
    const totals = selected.reduce(
      (acc, id) => {
        const potion = POTIONS.find((item) => item.id === id);
        if (!potion) return acc;
        acc.autonomy += potion.effects.autonomy;
        acc.inclusion += potion.effects.inclusion;
        acc.durability += potion.effects.durability;
        return acc;
      },
      { autonomy: 0, inclusion: 0, durability: 0 }
    );
    setMessage(
      `Potion fusionnée : +${totals.autonomy} autonomie, +${totals.inclusion} inclusion, +${totals.durability} durabilité.`
    );
    unlockBadge("potion");
    markModuleCompletion("potion");
    markModuleCompletion("labs");
    updateScore({
      autonomyScore: totals.autonomy,
      inclusionScore: totals.inclusion,
      durabilityScore: totals.durability,
    });
  };

  return (
    <section className="rounded-3xl border border-purple-200/40 bg-slate-900/80 p-6 text-white shadow-xl">
      <p className="text-sm uppercase tracking-[0.3em] text-purple-300">Libre Software Potion Lab</p>
      <h2 className="mt-2 text-3xl font-semibold">Assemble tes potions open source</h2>
      <p className="mt-2 text-sm text-white/70">Chaque combinaison déclenche une animation et débloque des badges secrets.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {POTIONS.map((potion) => (
          <button
            key={potion.id}
            onClick={() => toggle(potion.id)}
            className={`rounded-3xl border px-4 py-3 text-left transition ${
              selected.includes(potion.id) ? "border-purple-300 bg-purple-300/20" : "border-white/10 bg-white/5"
            }`}
          >
            <p className="text-sm font-semibold">{potion.label}</p>
            <p className="text-xs text-white/70">{potion.description}</p>
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <motion.div
          animate={{ rotate: selected.length * 90, scale: 1 + selected.length * 0.05 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="size-28 rounded-full bg-gradient-to-r from-fuchsia-400 to-indigo-500 text-center text-4xl leading-[112px]"
        >
          ⚗️
        </motion.div>
        <button
          onClick={brew}
          className="rounded-full bg-gradient-to-r from-fuchsia-400 to-indigo-500 px-6 py-3 text-sm font-semibold text-slate-900"
        >
          Infuser
        </button>
        <p className="text-sm text-white/80">{message}</p>
      </div>
    </section>
  );
}

