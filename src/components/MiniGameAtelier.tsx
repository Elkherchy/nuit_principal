"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { createAtelierPuzzle } from "../lib/miniGameEngine";
import { markModuleCompletion, unlockBadge } from "../lib/localStorageUtils";

export function MiniGameAtelier() {
  const puzzle = useMemo(() => createAtelierPuzzle(), []);
  const [feedback, setFeedback] = useState<string>("Devine ce qui cloche vraiment.");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [attempts, setAttempts] = useState(0);

  const handleChoice = (choiceId: string) => {
    if (status === "success") return;
    setAttempts((a) => a + 1);
    if (choiceId === puzzle.solution.id) {
      setStatus("success");
      setFeedback(puzzle.solution.fix);
      unlockBadge("atelier");
      markModuleCompletion("atelier");
    } else {
      setStatus("error");
      const option = puzzle.options.find((item) => item.id === choiceId);
      setFeedback(option ? `${option.label} semble intact. Cherche ailleurs !` : "Ce n&rsquo;est pas ça...");
    }
  };

  return (
    <section className="rounded-3xl border border-emerald-200/40 bg-slate-900/80 p-6 text-white">
      <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Mini-jeu diagnostic</p>
      <h2 className="mt-2 text-3xl font-semibold text-white">Répare le PC &quot;obsolète&quot;</h2>
      <p className="mt-2 text-slate-200">
        Observe les indices laissés par l&rsquo;équipe technique et identifie le composant qu&rsquo;il faut vraiment changer.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {puzzle.options.map((option) => (
          <motion.button
            key={option.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleChoice(option.id)}
            className={`rounded-3xl border border-white/10 p-4 text-left transition ${
              option.id === puzzle.solution.id && status === "success"
                ? "bg-emerald-400 text-slate-900"
                : "bg-white/5"
            }`}
          >
            <p className="text-lg font-semibold">{option.label}</p>
            <p className="text-sm text-white/70">{option.clue}</p>
          </motion.button>
        ))}
      </div>
      <div
        className={`mt-6 rounded-3xl border border-white/10 p-4 text-sm ${
          status === "success" ? "bg-emerald-400/20 text-emerald-100" : "bg-white/5 text-slate-200"
        }`}
      >
        <p>{feedback}</p>
        <p className="mt-2 text-xs uppercase tracking-wide text-white/60">Tentatives : {attempts}</p>
      </div>
      {status === "success" && (
        <p className="mt-4 rounded-full bg-white/10 px-4 py-2 text-center text-sm font-semibold text-emerald-200">
          Badge &quot;Réparateur du Village&quot; débloqué !
        </p>
      )}
    </section>
  );
}
