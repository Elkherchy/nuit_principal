"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CANVAS_SIZE } from "../lib/snake/constants";
import {
  computeSpeedInterval,
  initGameRuntime,
  queueDirection,
  renderGame,
  stepGame,
} from "../lib/snake/game-logic";
import type { Direction, GameRuntime, StepSnapshot } from "../lib/snake/types";
import {
  bumpGamesPlayed,
  getGamesPlayed,
  getHighScore,
  persistHighScore,
} from "../lib/snake/storage";

type HiddenSnakeGameProps = {
  open: boolean;
  triggerLabel?: string;
  onClose: () => void;
};

type UiSnapshot = StepSnapshot & {
  bestScore: number;
};

const defaultSnapshot: UiSnapshot = {
  status: "idle",
  score: 0,
  comboMultiplier: 1,
  comboChain: 0,
  avoidedToxic: 0,
  speedLevel: 0,
  fruit: { position: { x: 0, y: 0 }, type: "normal", expiresAt: 0 },
  powerUpPickup: null,
  activePowerUps: {},
  lastFruitType: "normal",
  message: undefined,
  bestScore: 0,
};

const directionMap: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  W: "up",
  z: "up",
  Z: "up",
  s: "down",
  S: "down",
  q: "left",
  Q: "left",
  a: "left",
  A: "left",
  d: "right",
  D: "right",
};

export function HiddenSnakeGame({ open, triggerLabel, onClose }: HiddenSnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const runtimeRef = useRef<GameRuntime | null>(null);
  const animationRef = useRef<number | null>(null);

  const [snapshot, setSnapshot] = useState<UiSnapshot>(defaultSnapshot);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [fxEnabled, setFxEnabled] = useState(true);
  const [lastTrigger, setLastTrigger] = useState(triggerLabel);
  const [powerTimestamp, setPowerTimestamp] = useState(0);

  useEffect(() => {
    setLastTrigger(triggerLabel);
  }, [triggerLabel]);

  useEffect(() => {
    setGamesPlayed(getGamesPlayed());
    const stored = getHighScore();
    if (stored?.score) {
      setSnapshot((prev) => ({ ...prev, bestScore: stored.score }));
    }
  }, []);

  useEffect(() => {
    if (runtimeRef.current) {
      runtimeRef.current.fxEnabled = fxEnabled;
    }
  }, [fxEnabled]);

  const configureCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const ratio = window.devicePixelRatio ?? 1;
    canvasRef.current.width = CANVAS_SIZE * ratio;
    canvasRef.current.height = CANVAS_SIZE * ratio;
    canvasRef.current.style.width = `${CANVAS_SIZE}px`;
    canvasRef.current.style.height = `${CANVAS_SIZE}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);
    ctxRef.current = ctx;
  }, []);

  const handleGameOver = useCallback(
    (score: number) => {
      const stored = getHighScore();
      const best = stored?.score ?? snapshot.bestScore;
      if (score > best) {
        persistHighScore(score);
        setSnapshot((prev) => ({ ...prev, bestScore: score }));
        if (runtimeRef.current) {
          runtimeRef.current.bestScore = score;
        }
      }
      const played = bumpGamesPlayed();
      setGamesPlayed(played);
    },
    [snapshot.bestScore],
  );

  const startLoop = useCallback(() => {
    const loop = (time: number) => {
      const runtime = runtimeRef.current;
      if (!runtime || !ctxRef.current) {
        animationRef.current = requestAnimationFrame(loop);
        return;
      }
      const interval = computeSpeedInterval(runtime, time);
      if (time - runtime.lastTick >= interval) {
        const nextSnapshot = stepGame(runtime, time);
        renderGame(ctxRef.current, runtime, CANVAS_SIZE);
        setSnapshot((prev) => ({
          ...prev,
          ...nextSnapshot,
          bestScore: Math.max(prev.bestScore, runtime.bestScore),
        }));
        if (nextSnapshot.status === "over") {
          handleGameOver(runtime.score);
        }
      } else {
        renderGame(ctxRef.current, runtime, CANVAS_SIZE);
      }
      animationRef.current = requestAnimationFrame(loop);
    };
    animationRef.current = requestAnimationFrame(loop);
  }, [handleGameOver]);

  const stopLoop = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = null;
  }, []);

  const bootstrapGame = useCallback(() => {
    const stored = getHighScore();
    const runtime = initGameRuntime({
      bestScore: stored?.score ?? snapshot.bestScore,
      fxEnabled,
      now: performance.now(),
    });
    runtimeRef.current = runtime;
    setSnapshot((prev) => ({
      ...prev,
      ...defaultSnapshot,
      status: runtime.status,
      fruit: runtime.fruit,
      lastFruitType: runtime.lastFruitType,
      activePowerUps: {},
      powerUpPickup: null,
      message: "Flux amorcé.",
      bestScore: stored?.score ?? prev.bestScore,
    }));
    configureCanvas();
    if (ctxRef.current && runtimeRef.current) {
      renderGame(ctxRef.current, runtimeRef.current, CANVAS_SIZE);
    }
    stopLoop();
    startLoop();
  }, [configureCanvas, fxEnabled, snapshot.bestScore, startLoop, stopLoop]);

  const handleClose = useCallback(() => {
    stopLoop();
    runtimeRef.current = null;
    setSnapshot((prev) => ({ ...prev, status: "idle" }));
    onClose();
  }, [onClose, stopLoop]);

  const togglePause = useCallback(() => {
    const runtime = runtimeRef.current;
    if (!runtime) return;
    runtime.status = runtime.status === "paused" ? "running" : "paused";
    setSnapshot((prev) => ({ ...prev, status: runtime.status }));
  }, []);

  const restartGame = useCallback(() => {
    bootstrapGame();
  }, [bootstrapGame]);

  const handleDirectionChange = useCallback((direction: Direction) => {
    if (!runtimeRef.current) return;
    queueDirection(runtimeRef.current, direction);
  }, []);

  useEffect(() => {
    if (!open) {
      stopLoop();
      runtimeRef.current = null;
      return;
    }
    bootstrapGame();
    return () => {
      stopLoop();
    };
  }, [open, bootstrapGame, stopLoop]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
        return;
      }
      if (event.key === "p" || event.key === "P") {
        event.preventDefault();
        togglePause();
        return;
      }
      if (event.key === " " && snapshot.status === "over") {
        event.preventDefault();
        restartGame();
        return;
      }
      const direction = directionMap[event.key];
      if (direction) {
        event.preventDefault();
        handleDirectionChange(direction);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClose, handleDirectionChange, open, restartGame, snapshot.status, togglePause]);

  useEffect(() => {
    if (!open) {
      setPowerTimestamp(0);
      return;
    }
    let frame: number;
    const update = () => {
      setPowerTimestamp(performance.now());
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [open]);

  const activePowerUps = useMemo(() => {
    return Object.entries(snapshot.activePowerUps).map(([name, timeout]) => ({
      name,
      remaining: Math.max(0, Math.round(((timeout ?? 0) - powerTimestamp) / 1000)),
    }));
  }, [powerTimestamp, snapshot.activePowerUps]);

  const statusBadge =
    snapshot.status === "paused"
      ? "En pause"
      : snapshot.status === "over"
        ? "Game Over"
        : "En ligne";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur" />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-6xl rounded-3xl border border-slate-700/60 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950/90 p-6 shadow-2xl">
          <header className="mb-6 flex flex-col gap-3 border-b border-slate-700/70 pb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Hidden Snake+</p>
              <h2 className="text-2xl font-semibold text-white">Laboratoire clandestin AUTOCUT</h2>
              {lastTrigger ? (
                <p className="text-xs uppercase tracking-wide text-emerald-300">Trigger : {lastTrigger}</p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={togglePause}
                className="rounded-full border border-slate-600 px-4 py-2 text-sm text-slate-200 transition hover:border-emerald-300 hover:text-emerald-200"
              >
                {snapshot.status === "paused" ? "Reprendre" : "Pause"}
              </button>
              <button
                onClick={restartGame}
                className="rounded-full border border-slate-600 px-4 py-2 text-sm text-slate-200 transition hover:border-emerald-300 hover:text-emerald-200"
              >
                Relancer
              </button>
              <button
                onClick={() => setFxEnabled((prev) => !prev)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  fxEnabled ? "border-emerald-400/70 text-emerald-200" : "border-slate-600 text-slate-200"
                }`}
              >
                FX {fxEnabled ? "ON" : "OFF"}
              </button>
              <button
                onClick={handleClose}
                className="rounded-full bg-rose-500/80 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500"
              >
                Quitter
              </button>
            </div>
          </header>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,640px)_1fr]">
            <div className="relative flex justify-center rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <canvas
                ref={canvasRef}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                className="h-[min(70vh,640px)] w-[min(95vw,640px)] rounded-2xl bg-black/70 shadow-inner"
              />
              {snapshot.status === "over" && (
                <div className="absolute inset-4 flex flex-col items-center justify-center rounded-2xl border border-rose-500/40 bg-slate-950/90 text-center">
                  <p className="text-xl font-semibold text-rose-200">Game Over</p>
                  <p className="mt-4 text-5xl font-bold text-white">{snapshot.score}</p>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Score</p>
                  <button
                    onClick={restartGame}
                    className="mt-6 rounded-full bg-emerald-400/90 px-5 py-2 font-semibold text-slate-950 shadow-lg transition hover:bg-emerald-400"
                  >
                    Relancer
                  </button>
                </div>
              )}
            </div>
            <div className="space-y-6">
              <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>Status</span>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-wide text-emerald-200">
                    {statusBadge}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-lg text-slate-400">Score</p>
                    <p className="text-3xl font-bold text-white">{snapshot.score}</p>
                  </div>
                  <div>
                    <p className="text-lg text-slate-400">Best</p>
                    <p className="text-3xl font-bold text-emerald-300">{snapshot.bestScore}</p>
                  </div>
                  <div>
                    <p className="text-lg text-slate-400">Combo</p>
                    <p className="text-3xl font-bold text-cyan-300">x{snapshot.comboMultiplier.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-lg text-slate-400">Niveau</p>
                    <p className="text-3xl font-bold text-indigo-300">{snapshot.speedLevel}</p>
                  </div>
                </div>
                {snapshot.message && (
                  <p className="mt-4 rounded-xl border border-slate-700/40 bg-slate-900/60 px-3 py-2 text-sm text-slate-200">
                    {snapshot.message}
                  </p>
                )}
              </section>
              <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <h3 className="text-sm uppercase tracking-[0.4em] text-slate-500">Power-ups</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {activePowerUps.length === 0 && (
                    <span className="rounded-full border border-slate-800 px-3 py-1 text-xs text-slate-400">
                      Aucun actif
                    </span>
                  )}
                  {activePowerUps.map((power) => (
                    <span
                      key={power.name}
                      className="rounded-full border border-emerald-400/40 px-3 py-1 text-xs text-emerald-200"
                    >
                      {power.name} · {power.remaining}s
                    </span>
                  ))}
                </div>
                {snapshot.powerUpPickup && (
                  <p className="mt-3 text-xs text-slate-400">
                    Pickup disponible : {snapshot.powerUpPickup.type}
                  </p>
                )}
              </section>
              <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm uppercase tracking-[0.4em] text-slate-500">Contrôles</h3>
                  <span className="text-xs text-slate-500">{gamesPlayed} runs</span>
                </div>
                <ul className="mt-3 space-y-1 text-sm text-slate-300">
                  <li>Flèches / ZQSD / WASD pour diriger le flux</li>
                  <li>P : Pause · Esc : quitter</li>
                  <li>Espace : relancer après Game Over</li>
                </ul>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-slate-400">
                  <div className="rounded-lg border border-slate-800/70 px-2 py-1">🐢 Slow-mo : temporise le temps</div>
                  <div className="rounded-lg border border-slate-800/70 px-2 py-1">⚡ Speed : multiplicateur boosté</div>
                  <div className="rounded-lg border border-slate-800/70 px-2 py-1">🧲 Magnet : attire les paquets</div>
                  <div className="rounded-lg border border-slate-800/70 px-2 py-1">🌀 Ghost : traverse ton code</div>
                  <div className="rounded-lg border border-slate-800/70 px-2 py-1">🍏 Normal : +10 / +1 longueur</div>
                  <div className="rounded-lg border border-slate-800/70 px-2 py-1">✨ Doré : +50 / +3 longueur</div>
                  <div className="rounded-lg border border-slate-800/70 px-2 py-1">☢ Toxique : -20 / -2 mais combo esquive</div>
                </div>
              </section>
              <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <h3 className="text-sm uppercase tracking-[0.4em] text-slate-500">Touches tactiles</h3>
                <div className="mt-3 grid grid-cols-3 gap-2 text-slate-200">
                  <div />
                  <button
                    onClick={() => handleDirectionChange("up")}
                    className="rounded-xl border border-slate-700/70 bg-slate-900/60 py-3 text-sm"
                  >
                    ↑
                  </button>
                  <div />
                  <button
                    onClick={() => handleDirectionChange("left")}
                    className="rounded-xl border border-slate-700/70 bg-slate-900/60 py-3 text-sm"
                  >
                    ←
                  </button>
                  <div />
                  <button
                    onClick={() => handleDirectionChange("right")}
                    className="rounded-xl border border-slate-700/70 bg-slate-900/60 py-3 text-sm"
                  >
                    →
                  </button>
                  <div />
                  <button
                    onClick={() => handleDirectionChange("down")}
                    className="rounded-xl border border-slate-700/70 bg-slate-900/60 py-3 text-sm"
                  >
                    ↓
                  </button>
                  <div />
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HiddenSnakeGame;


