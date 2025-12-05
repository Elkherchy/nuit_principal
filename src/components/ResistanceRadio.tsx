"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MEDIA_RESOURCES } from "../data/missions";

const STORAGE_KEY = "nird_media_progress";

type MediaProgress = Record<string, boolean>;

const isBrowser = () => typeof window !== "undefined";

export function ResistanceRadio() {
  const [progress, setProgress] = useState<MediaProgress>({});

  useEffect(() => {
    if (!isBrowser()) return;
    let frame: number | null = null;
    const load = () => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          setProgress(JSON.parse(raw) as MediaProgress);
        }
      } catch {
        // ignore
      }
    };
    frame = requestAnimationFrame(load);
    return () => {
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const toggle = (id: string) => {
    setProgress((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (isBrowser()) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <p className="text-sm uppercase tracking-[0.4em] text-cyan-300">Radio Résistance</p>
      <h2 className="mt-2 text-3xl font-semibold text-white">Témoignages, podcasts, vidéos</h2>
      <p className="mt-2 text-sm text-white/70">
        Une playlist pirate qui regroupe les meilleurs reportages sur l&rsquo;obsolescence, Linux et les communs numériques.
      </p>
      <div className="mt-4 space-y-4">
        {MEDIA_RESOURCES.map((resource) => (
          <motion.article
            key={resource.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-lg font-semibold text-white">{resource.title}</p>
                <p className="text-xs uppercase tracking-[0.4em] text-white/40">
                  {resource.source} · {resource.duration}
                </p>
              </div>
              <button
                onClick={() => toggle(resource.id)}
                className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.4em] ${
                  progress[resource.id] ? "border-emerald-300 text-emerald-200" : "border-white/20 text-white/60"
                }`}
              >
                {progress[resource.id] ? "Écouté" : "À écouter"}
              </button>
            </div>
            <p className="mt-2 text-white/70 italic">“{resource.quote}”</p>
            <a
              href={resource.link}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-xs font-semibold text-cyan-300 underline"
            >
              Ouvrir le témoignage ↗
            </a>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export default ResistanceRadio;

