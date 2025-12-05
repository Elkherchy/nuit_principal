"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { markModuleCompletion, unlockBadge, updateScore } from "../../lib/localStorageUtils";

type StoryChoice = {
  id: string;
  label: string;
  next: string;
  effects: Partial<StoryStats>;
};

type StoryNode = {
  id: string;
  title: string;
  text: string;
  choices: StoryChoice[];
  ending?: boolean;
  outcome?: string;
};

type StoryStats = {
  autonomy: number;
  inclusion: number;
  privacy: number;
};

const STORY: Record<string, StoryNode> = {
  start: {
    id: "start",
    title: "Conseil de crise",
    text: "Vous êtes le directeur du lycée Carnot. Big Tech débarque avec Windows 12 Corporate Ultra Platinum. Que faites-vous ?",
    choices: [
      { id: "linux", label: "Résister avec Linux", next: "linuxPlan", effects: { autonomy: 20, privacy: 10 } },
      { id: "teachers", label: "Convaincre les enseignants", next: "teacherPlan", effects: { inclusion: 15 } },
      { id: "recycle", label: "Recycler une salle info", next: "recyclePlan", effects: { autonomy: 5, privacy: 5 } },
    ],
  },
  linuxPlan: {
    id: "linuxPlan",
    title: "Maison Linux",
    text: "Le pingouin géant attire la presse locale. Big Tech tente un chantage sur les licences.",
    choices: [
      { id: "contract", label: "Refuser les contrats opaques", next: "victory", effects: { autonomy: 20, privacy: 20 } },
      { id: "hybrid", label: "Proposer un mode hybride", next: "hybridA", effects: { inclusion: 10 } },
    ],
  },
  teacherPlan: {
    id: "teacherPlan",
    title: "Campagne de convainc",
    text: "Les profs hésitent : certains aiment leurs logiciels propriétaires.",
    choices: [
      { id: "formation", label: "Organiser des ateliers libres", next: "victory", effects: { autonomy: 10, inclusion: 20 } },
      { id: "laisser", label: "Laisser chacun décider", next: "stall", effects: { privacy: -5 } },
    ],
  },
  recyclePlan: {
    id: "recyclePlan",
    title: "Recyclerie clandestine",
    text: "Des parents proposent d&rsquo;offrir des PC reconditionnés.",
    choices: [
      { id: "atelier", label: "Ouvrir un atelier permanent", next: "victory", effects: { autonomy: 15, privacy: 5 } },
      { id: "report", label: "Reporter pour audit", next: "stall", effects: { autonomy: -5 } },
    ],
  },
  hybridA: {
    id: "hybridA",
    title: "Mode hybride",
    text: "Big Tech accepte un compromis mais garde des trackers cachés.",
    choices: [
      { id: "monitor", label: "Monitorer les trackers", next: "victory", effects: { privacy: 15 } },
      { id: "ignore", label: "Ignorer, on verra bien", next: "stall", effects: { privacy: -10 } },
    ],
  },
  victory: {
    id: "victory",
    title: "Victoire NIRD",
    text: "Le village entier célèbre l&rsquo;autonomie numérique retrouvée.",
    choices: [],
    ending: true,
    outcome: "Gaulois Libre",
  },
  stall: {
    id: "stall",
    title: "Statu quo dangereux",
    text: "Big Tech gagne du terrain faute de décision claire.",
    choices: [],
    ending: true,
    outcome: "Village en sursis",
  },
};

export function NarrativeAdventure() {
  const [currentId, setCurrentId] = useState("start");
  const [history, setHistory] = useState<string[]>([]);
  const [stats, setStats] = useState<StoryStats>({ autonomy: 40, inclusion: 40, privacy: 40 });
  const currentNode = STORY[currentId];

  const handleChoice = (choice: StoryChoice) => {
    const nextStats: StoryStats = {
      autonomy: Math.max(0, stats.autonomy + (choice.effects.autonomy ?? 0)),
      inclusion: Math.max(0, stats.inclusion + (choice.effects.inclusion ?? 0)),
      privacy: Math.max(0, stats.privacy + (choice.effects.privacy ?? 0)),
    };
    setStats(nextStats);
    setHistory((prev) => [...prev, choice.label]);
    setCurrentId(choice.next);
    const nextNode = STORY[choice.next];
    if (nextNode.ending) {
      if (nextNode.outcome === "Gaulois Libre") {
        unlockBadge("adventure");
        markModuleCompletion("adventure");
        markModuleCompletion("labs");
        updateScore({ autonomyScore: nextStats.autonomy, inclusionScore: nextStats.inclusion, privacyScore: nextStats.privacy });
      }
    }
  };

  const reset = () => {
    setCurrentId("start");
    setHistory([]);
    setStats({ autonomy: 40, inclusion: 40, privacy: 40 });
  };

  return (
    <section className="rounded-3xl border border-orange-200/40 bg-slate-900/80 p-6 text-white shadow-xl">
      <p className="text-sm uppercase tracking-[0.3em] text-orange-300">Narrative Adventure</p>
      <h2 className="mt-2 text-3xl font-semibold">Vous êtes le directeur du lycée Carnot</h2>
      <p className="mt-2 text-sm text-white/70">Choisis chaque option avec sagesse pour gagner le badge &quot;Gaulois Libre&quot;.</p>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Stat label="Autonomie" value={stats.autonomy} color="from-amber-300 to-orange-500" />
        <Stat label="Inclusion" value={stats.inclusion} color="from-pink-300 to-rose-500" />
        <Stat label="Vie privée" value={stats.privacy} color="from-sky-300 to-indigo-500" />
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm">
        <p className="text-xs uppercase tracking-wide text-white/60">{currentNode.title}</p>
        <p className="mt-2 text-white">{currentNode.text}</p>
        <div className="mt-4 flex flex-col gap-2">
          {currentNode.choices.length === 0 ? (
            <div className="space-y-2">
              <p>
                Fin : <span className="font-semibold">{currentNode.outcome}</span>
              </p>
              <button onClick={reset} className="rounded-full border border-white/30 px-4 py-2 text-xs uppercase tracking-wide">
                Rejouer
              </button>
            </div>
          ) : (
            currentNode.choices.map((choice) => (
              <motion.button
                whileTap={{ scale: 0.96 }}
                key={choice.id}
                onClick={() => handleChoice(choice)}
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-left text-sm text-white/90"
              >
                {choice.label}
              </motion.button>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4 text-xs text-white/70">
        <p className="text-white/60">Historique des décisions :</p>
        {history.length === 0 ? <p>En attente de choix...</p> : <p>{history.join(" → ")}</p>}
      </div>
    </section>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm">
      <div className="flex items-center justify-between text-xs text-white/60">
        <span>{label}</span>
        <span>{value} pts</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, value)}%` }}
          className={`h-2 rounded-full bg-gradient-to-r ${color}`}
        />
      </div>
    </div>
  );
}

