"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { createThreatCard, threatWaveSize, type ThreatCard } from "../lib/miniGameEngine";
import { markModuleCompletion, unlockBadge, updateScore } from "../lib/localStorageUtils";

const TARGET_BLOCKED = 8;

type TimerRefs = {
  interval?: NodeJS.Timeout;
  finish?: NodeJS.Timeout;
  timeouts: Record<string, NodeJS.Timeout>;
};

export function MiniGameBigTech() {
  const [threats, setThreats] = useState<ThreatCard[]>([]);
  const [blocked, setBlocked] = useState(0);
  const [breached, setBreached] = useState(0);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const timers = useRef<TimerRefs>({ timeouts: {} });
  const blockedRef = useRef(0);

  const clearThreatTimer = useCallback((id: string) => {
    const timeout = timers.current.timeouts[id];
    if (timeout) {
      clearTimeout(timeout);
      delete timers.current.timeouts[id];
    }
  }, []);

  const clearAllTimers = useCallback(() => {
    if (timers.current.interval) {
      clearInterval(timers.current.interval);
      timers.current.interval = undefined;
    }
    if (timers.current.finish) {
      clearTimeout(timers.current.finish);
      timers.current.finish = undefined;
    }
    Object.keys(timers.current.timeouts).forEach((key) => {
      clearThreatTimer(key);
    });
  }, [clearThreatTimer]);

  const stopGame = useCallback(() => {
    clearAllTimers();
    setThreats([]);
    setRunning(false);
    setFinished(true);
    const finalBlocked = blockedRef.current;
    updateScore({ bigTechScore: finalBlocked });
    if (finalBlocked >= TARGET_BLOCKED) {
      unlockBadge("bigtech");
      markModuleCompletion("bigtech");
    }
  }, [clearAllTimers]);

  const spawnThreats = useCallback(
    (count: number) => {
      let spawned = 0;
      setThreats([]);
      timers.current.interval = setInterval(() => {
        spawned += 1;
        const threat = createThreatCard();
        setThreats((prev) => [...prev, threat]);
        const timeout = setTimeout(() => {
          setThreats((prev) => prev.filter((item) => item.id !== threat.id));
          setBreached((b) => b + threat.damage);
          clearThreatTimer(threat.id);
        }, 3500);
        timers.current.timeouts[threat.id] = timeout;
        if (spawned >= count) {
          if (timers.current.interval) {
            clearInterval(timers.current.interval);
            timers.current.interval = undefined;
          }
          timers.current.finish = setTimeout(stopGame, 4200);
        }
      }, 900);
    },
    [clearThreatTimer, stopGame]
  );

  const startGame = useCallback(() => {
    clearAllTimers();
    setBlocked(0);
    setBreached(0);
    blockedRef.current = 0;
    setFinished(false);
    setRunning(true);
    spawnThreats(threatWaveSize);
  }, [clearAllTimers, spawnThreats]);

  const handleBlock = useCallback(
    (id: string) => {
      if (!running) return;
      clearThreatTimer(id);
      setThreats((prev) => prev.filter((item) => item.id !== id));
      setBlocked((b) => {
        const next = b + 1;
        blockedRef.current = next;
        return next;
      });
    },
    [clearThreatTimer, running]
  );

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  return (
    <section className="rounded-3xl border border-rose-200/40 bg-slate-900/80 p-6 text-white">
      <p className="text-sm uppercase tracking-[0.3em] text-rose-300">Tour Big Tech</p>
      <h2 className="mt-2 text-3xl font-semibold">Repousse les attaques propriétaires</h2>
      <p className="mt-2 text-white/80">Clique sur chaque intrusion avant qu&rsquo;elle ne fasse des dégâts.</p>

      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="rounded-3xl border border-white/10 bg-white/10 px-4 py-2">
          Bloquées : {blocked}
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/10 px-4 py-2">
          Dégâts : {breached}
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/10 px-4 py-2">
          Objectif : {TARGET_BLOCKED} menaces
        </div>
      </div>

      <button
        onClick={startGame}
        disabled={running}
        className="mt-5 rounded-full bg-gradient-to-r from-rose-400 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-slate-900 disabled:opacity-40"
      >
        {running ? "Vague en cours" : "Lancer la vague"}
      </button>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {threats.map((threat) => (
          <motion.button
            key={threat.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleBlock(threat.id)}
            className="rounded-3xl border border-white/10 bg-white/10 p-4 text-left text-sm"
          >
            <p className="font-semibold">{threat.label}</p>
            <p className="text-white/70">{threat.hint}</p>
          </motion.button>
        ))}
      </div>

      {finished && (
        <div className="mt-4 rounded-3xl border border-white/10 bg-white/10 p-4 text-sm text-center">
          <p>
            Résultat : {blocked} menaces stoppées, {breached} points de dégâts.
          </p>
          <p className="text-xs text-white/70">
            {blocked >= TARGET_BLOCKED
              ? "Badge &quot;Bouclier Numérique&quot; obtenu !"
              : "Réessaie pour débloquer le badge."}
          </p>
        </div>
      )}
    </section>
  );
}
