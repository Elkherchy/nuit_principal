"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { markModuleCompletion, unlockBadge } from "../lib/localStorageUtils";

const steps = [
  {
    id: "motivation",
    title: "Pourquoi installer Linux ?",
    options: [
      "Se libérer des licences coûteuses",
      "Booster un vieux PC",
      "Comprendre les pingouins",
    ],
  },
  {
    id: "flavor",
    title: "Choisis ta saveur",
    options: ["Debian éducative", "Ubuntu LTS", "Fedora design"],
  },
  {
    id: "setup",
    title: "Dernière préparation",
    options: ["Créer une clé USB bootable", "Faire une sauvegarde", "Respirer"],
  },
];

const installScript = [
  "Démarrage de l'installateur...",
  "Détection du matériel pédagogique... OK",
  "Partitionnement éthique... OK",
  "Installation des paquets libres essentiels...",
  "Nettoyage des traces propriétaires...",
  "Ajout des applications NIRD...",
  "Configuration des comptes élèves...",
  "Installation terminée !",
];

export function LinuxSimulation() {
  const [stepIndex, setStepIndex] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [installing, setInstalling] = useState(false);
  const [completed, setCompleted] = useState(false);
  const timers = useRef<NodeJS.Timeout[]>([]);

  const currentStep = steps[stepIndex];

  const handleOption = (option: string) => {
    if (!currentStep) return;
    setChoices((prev) => {
      const cloned = [...prev];
      cloned[stepIndex] = option;
      return cloned;
    });
    if (stepIndex < steps.length - 1) {
      setStepIndex((prev) => prev + 1);
    }
  };

  const startInstall = () => {
    setInstalling(true);
    setLogs([]);
    setCompleted(false);
    timers.current.forEach(clearTimeout);
    timers.current = [];

    installScript.forEach((line, idx) => {
      const timer = setTimeout(() => {
        setLogs((prev) => [...prev, line]);
        if (idx === installScript.length - 1) {
          setInstalling(false);
          setCompleted(true);
          unlockBadge("linux");
          markModuleCompletion("linux");
        }
      }, idx * 600);
      timers.current.push(timer);
    });
  };

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const summary = useMemo(
    () =>
      steps.map((step, idx) => ({
        title: step.title,
        choice: choices[idx],
      })),
    [choices]
  );

  return (
    <section className="rounded-3xl border border-indigo-200/40 bg-slate-900/80 p-6 text-white">
      <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Maison Linux</p>
      <h2 className="mt-2 text-3xl font-semibold">Installation guidée et humoristique</h2>
      {currentStep ? (
        <div className="mt-4">
          <p className="text-lg font-semibold">{currentStep.title}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {currentStep.options.map((option) => (
              <motion.button
                key={option}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleOption(option)}
                className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/90 transition hover:border-white/40"
              >
                {option}
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-3xl border border-white/10 bg-black/40 p-4 text-sm text-white/80">
          <p>Tu es prêt.e ! Lance l&rsquo;installation pour recevoir ton badge.</p>
        </div>
      )}

      <div className="mt-6 rounded-3xl border border-white/10 bg-black/40 p-4 text-sm">
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Checklist</p>
        <ul className="mt-3 space-y-2">
          {summary.map((item) => (
            <li key={item.title} className="flex items-center justify-between text-white/80">
              <span>{item.title}</span>
              <span className="text-white font-semibold">{item.choice ?? "..."}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <motion.button
          whileTap={{ scale: 0.95 }}
          disabled={installing}
          onClick={startInstall}
          className="rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 px-6 py-3 text-center text-sm font-semibold text-slate-900 disabled:opacity-40"
        >
          {installing ? "Installation..." : "Lancer la simulation"}
        </motion.button>
      </div>

      <div className="mt-6 rounded-3xl border border-sky-200/40 bg-black/60 p-4 font-mono text-xs text-emerald-200">
        {logs.length === 0 ? (
          <p>$ prêt à lancer l&rsquo;installation</p>
        ) : (
          logs.map((line, idx) => <p key={idx}>$ {line}</p>)
        )}
      </div>

      {completed && (
        <p className="mt-4 rounded-full bg-white/10 px-4 py-2 text-center text-sm font-semibold text-sky-200">
          Badge &quot;Guerrier du Libre&quot; débloqué !
        </p>
      )}
    </section>
  );
}
