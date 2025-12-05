"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { markModuleCompletion, unlockBadge, updateScore } from "../../lib/localStorageUtils";

type ThreatType = "cookie" | "popup" | "ad" | "tracker";

type Threat = {
  id: string;
  type: ThreatType;
  label: string;
  hint: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
};

const TARGET_CLEANED = 12;

const THREAT_LIBRARY: Record<ThreatType, { label: string; hint: string; color: string }> = {
  cookie: { label: "Cookie espion", hint: "Il suit la souris", color: "bg-amber-300/80 border-amber-200" },
  popup: { label: "Popup interminable", hint: "Tombe du ciel", color: "bg-rose-400/80 border-rose-200" },
  ad: { label: "Super pub rebondissante", hint: "Bosse partout", color: "bg-indigo-400/80 border-indigo-200" },
  tracker: { label: "Super tracker", hint: "Imite ta trajectoire", color: "bg-emerald-400/80 border-emerald-200" },
};

const TYPES: ThreatType[] = ["cookie", "popup", "ad", "tracker"];

const random = (min: number, max: number) => Math.random() * (max - min) + min;

const createThreat = (type: ThreatType): Threat => {
  const base = THREAT_LIBRARY[type];
  return {
    id: `${type}-${Math.random().toString(36).slice(2)}`,
    type,
    label: base.label,
    hint: base.hint,
    x: random(5, 85),
    y: random(5, 70),
    vx: random(-1.5, 1.5),
    vy: random(0.6, 1.5),
    size: random(40, 70),
  };
};

const spawnThreats = () => Array.from({ length: TARGET_CLEANED }).map((_, index) => createThreat(TYPES[index % TYPES.length]));

export function SurveillanceSimulator() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [pointer, setPointer] = useState({ x: 50, y: 50 });
  const [running, setRunning] = useState(false);
  const [cleaned, setCleaned] = useState(0);
  const [timer, setTimer] = useState(45);
  const [status, setStatus] = useState<"idle" | "won" | "lost">("idle");

  const start = () => {
    setThreats(spawnThreats());
    setPointer({ x: 50, y: 50 });
    setRunning(true);
    setCleaned(0);
    setTimer(45);
    setStatus("idle");
  };

  useEffect(() => {
    if (!running) return;
    const moveInterval = setInterval(() => {
      setThreats((prev) =>
        prev.map((threat) => {
          const { type } = threat;
          let { x, y, vx, vy } = threat;
          if (type === "cookie") {
            vx += (pointer.x - x) * 0.02;
            vy += (pointer.y - y) * 0.02;
          }
          if (type === "tracker") {
            x = pointer.x * 0.9 + random(-2, 2);
            y = pointer.y * 0.9 + random(-2, 2);
          } else {
            x += vx;
            y += vy;
          }
          if (type === "popup" && y > 90) {
            y = 0;
          }
          if (x <= 2 || x >= 90) vx *= -1;
          if (y <= 2 || y >= 80) vy *= type === "popup" ? 1 : -1;
          return { ...threat, x: Math.max(2, Math.min(90, x)), y: Math.max(2, Math.min(80, y)), vx, vy };
        })
      );
    }, 120);
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setRunning(false);
          setStatus("lost");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      clearInterval(moveInterval);
      clearInterval(countdown);
    };
  }, [pointer, running]);

  useEffect(() => {
    if (running && cleaned >= TARGET_CLEANED) {
      const frame = requestAnimationFrame(() => {
        setRunning(false);
        setStatus("won");
        unlockBadge("surveillancePlus");
        markModuleCompletion("surveillancePlus");
        markModuleCompletion("bigtech");
        updateScore({ bigTechScore: cleaned, privacyScore: Math.min(100, cleaned * 8) });
      });
      return () => cancelAnimationFrame(frame);
    }
    return undefined;
  }, [cleaned, running]);

  const handleClean = (id: string) => {
    if (!running) return;
    setThreats((prev) => prev.filter((threat) => threat.id !== id));
    setCleaned((prev) => prev + 1);
  };

  const scoreboard = useMemo(
    () => [
      { label: "Trackers nettoyés", value: cleaned },
      { label: "Objectif", value: TARGET_CLEANED },
      { label: "Chrono", value: `${timer}s` },
    ],
    [cleaned, timer]
  );

  return (
    <section className="rounded-3xl border border-rose-200/40 bg-slate-900/80 p-6 text-white shadow-xl">
      <p className="text-sm uppercase tracking-[0.3em] text-rose-300">Tour Big Tech 2.0</p>
      <h2 className="mt-2 text-3xl font-semibold">Simulateur Big Tech Surveillance</h2>
      <p className="mt-2 text-sm text-white/70">
        Balaye les cookies espions, popups façon Tetris et pubs rebondissantes. Clique pour nettoyer chaque menace avant la fin du chrono.
      </p>

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-white/70">
        {scoreboard.map((entry) => (
          <span key={entry.label} className="rounded-full border border-white/20 px-3 py-1">
            {entry.label} : <span className="font-semibold text-white"> {entry.value}</span>
          </span>
        ))}
      </div>

      <div
        className="relative mt-4 h-72 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-800 to-slate-900"
        onPointerMove={(event) => {
          const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width) * 100;
          const y = ((event.clientY - rect.top) / rect.height) * 100;
          setPointer({ x, y });
        }}
      >
        {threats.map((threat) => (
          <motion.button
            key={threat.id}
            onClick={() => handleClean(threat.id)}
            whileTap={{ scale: 0.9 }}
            className={`absolute rounded-2xl border ${THREAT_LIBRARY[threat.type].color} px-3 py-2 text-xs font-semibold text-slate-900 shadow-lg`}
            style={{ left: `${threat.x}%`, top: `${threat.y}%`, width: threat.size, height: threat.size }}
          >
            <span>{threat.label}</span>
            <span className="block text-[10px] text-slate-800">{threat.hint}</span>
          </motion.button>
        ))}
        <motion.div
          className="pointer-events-none absolute size-6 rounded-full border border-emerald-300"
          animate={{ x: `${pointer.x}%`, y: `${pointer.y}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={start}
          className="rounded-full bg-gradient-to-r from-rose-400 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-slate-900"
        >
          {running ? "Partie en cours..." : "Lancer la vague"}
        </button>
        {status === "won" && <span className="text-sm text-emerald-300">Badge &quot;Dompteur de BigTech&quot; débloqué !</span>}
        {status === "lost" && <span className="text-sm text-rose-300">Le village attend une nouvelle tentative.</span>}
      </div>
    </section>
  );
}

