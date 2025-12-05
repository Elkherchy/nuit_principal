"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { markModuleCompletion, unlockBadge, updateScore } from "../../lib/localStorageUtils";

type PuzzleChoice = {
  id: string;
  label: string;
};

type Puzzle =
  | {
      id: string;
      title: string;
      description: string;
      type: "choice";
      options: PuzzleChoice[];
      answer: string;
    }
  | {
      id: string;
      title: string;
      description: string;
      type: "input";
      placeholder: string;
      answer: string;
    }
  | {
      id: string;
      title: string;
      description: string;
      type: "multi";
      options: PuzzleChoice[];
      answers: string[];
    };

const PUZZLES: Puzzle[] = [
  {
    id: "alternative",
    title: "Alternative cachée",
    description: "Trouve l&rsquo;application libre qui remplace un traitement de texte Big Tech.",
    type: "choice",
    options: [
      { id: "drive", label: "Google Docs" },
      { id: "libreoffice", label: "LibreOffice" },
      { id: "notion", label: "Notion" },
    ],
    answer: "libreoffice",
  },
  {
    id: "wifi",
    title: "Porte Wi-Fi verrouillée",
    description: "Entre la commande libre qui permet d&rsquo;analyser un réseau pour l&rsquo;auditer.",
    type: "input",
    placeholder: "Indice : commence par air...",
    answer: "aircrack-ng",
  },
  {
    id: "privacy",
    title: "Tablette espionne",
    description: "Clique sur les outils qui respectent la vie privée.",
    type: "multi",
    options: [
      { id: "peertube", label: "PeerTube" },
      { id: "nextcloud", label: "Nextcloud" },
      { id: "adtrack", label: "Ad Track Ultra" },
      { id: "megaAds", label: "MegaAds" },
    ],
    answers: ["peertube", "nextcloud"],
  },
];

export function DigitalEscapeRoom() {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [status, setStatus] = useState<"idle" | "playing" | "success" | "failed">("idle");
  const [timer, setTimer] = useState(150);

  const startRoom = () => {
    setStatus("playing");
    setTimer(150);
    setAnswers({});
  };

  useEffect(() => {
    if (status !== "playing") return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setStatus("failed");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  const handleChoice = (puzzleId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [puzzleId]: optionId }));
  };

  const handleInput = (puzzleId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [puzzleId]: value }));
  };

  const toggleMulti = (puzzleId: string, optionId: string) => {
    setAnswers((prev) => {
      const existing = (prev[puzzleId] as string[]) ?? [];
      const next = existing.includes(optionId) ? existing.filter((item) => item !== optionId) : [...existing, optionId];
      return { ...prev, [puzzleId]: next };
    });
  };

  const handleValidate = () => {
    const success = PUZZLES.every((puzzle) => {
      const value = answers[puzzle.id];
      if (puzzle.type === "choice" || puzzle.type === "input") {
        return typeof value === "string" && value.trim().toLowerCase() === puzzle.answer.toLowerCase();
      }
      if (puzzle.type === "multi") {
        const arr = Array.isArray(value) ? value : [];
        return (
          arr.length === puzzle.answers.length &&
          puzzle.answers.every((answer) => arr.includes(answer))
        );
      }
      return false;
    });
    if (success) {
      setStatus("success");
      unlockBadge("escape");
      updateScore({ privacyScore: 70 });
      markModuleCompletion("escape");
      markModuleCompletion("labs");
    } else {
      setStatus("failed");
    }
  };

  return (
    <section className="rounded-3xl border border-indigo-200/40 bg-slate-900/80 p-6 text-white shadow-xl">
      <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Digital Escape Room</p>
      <h2 className="mt-2 text-3xl font-semibold">Échappe-toi de la dépendance Big Tech</h2>
      <p className="mt-2 text-sm text-white/70">
        Trois énigmes pour prouver ta résilience : alternative libre, commande réseau et outils respectueux. Tu as 150 secondes.
      </p>

      <div className="mt-4 flex items-center gap-4 text-xs text-white/70">
        <span className="rounded-full border border-white/20 px-3 py-1">Timer : {timer}s</span>
        <span className="rounded-full border border-white/20 px-3 py-1">Statut : {status}</span>
        <button
          onClick={startRoom}
          className="ml-auto rounded-full border border-white/30 px-4 py-1 text-xs uppercase tracking-wide text-white"
        >
          {status === "playing" ? "Recommencer" : "Démarrer"}
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {PUZZLES.map((puzzle) => (
          <div key={puzzle.id} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm">
            <p className="text-xs uppercase tracking-wide text-white/60">{puzzle.title}</p>
            <p className="text-white">{puzzle.description}</p>
            {puzzle.type === "choice" && (
              <div className="mt-3 space-y-2">
                {puzzle.options.map((option) => (
                  <button
                    key={option.id}
                    disabled={status !== "playing"}
                    onClick={() => handleChoice(puzzle.id, option.id)}
                    className={`w-full rounded-2xl border px-3 py-2 text-left ${
                      answers[puzzle.id] === option.id ? "border-indigo-300 bg-indigo-300/20" : "border-white/10"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
            {puzzle.type === "input" && (
              <input
                type="text"
                disabled={status !== "playing"}
                placeholder={puzzle.placeholder}
                value={(answers[puzzle.id] as string) ?? ""}
                onChange={(event) => handleInput(puzzle.id, event.target.value)}
                className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-white"
              />
            )}
            {puzzle.type === "multi" && (
              <div className="mt-3 flex flex-wrap gap-2">
                {puzzle.options.map((option) => {
                  const selected = Array.isArray(answers[puzzle.id]) && (answers[puzzle.id] as string[]).includes(option.id);
                  return (
                    <button
                      key={option.id}
                      disabled={status !== "playing"}
                      onClick={() => toggleMulti(puzzle.id, option.id)}
                      className={`rounded-full border px-3 py-1 text-xs ${
                        selected ? "border-emerald-300 bg-emerald-300/20" : "border-white/10"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          disabled={status !== "playing"}
          onClick={handleValidate}
          className="rounded-full bg-gradient-to-r from-indigo-400 to-rose-500 px-6 py-3 text-sm font-semibold text-slate-900 disabled:opacity-40"
        >
          Valider les solutions
        </motion.button>
        {status === "success" && <p className="text-sm text-emerald-300">Bravo ! Badge &quot;Escape&quot; gagné.</p>}
        {status === "failed" && <p className="text-sm text-rose-300">Encore une tentative ? Les indices t&rsquo;attendent.</p>}
      </div>
    </section>
  );
}

