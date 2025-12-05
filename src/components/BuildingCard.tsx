"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { BuildingDefinition } from "../data/buildings";

interface Props {
  building: BuildingDefinition;
  isCompleted?: boolean;
  hasBadge?: boolean;
}

export function BuildingCard({ building, isCompleted, hasBadge }: Props) {
  const Icon = building.icon;
  return (
    <motion.div
      whileHover={{ y: -6, rotate: -1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Link
        href={building.path}
        className={`group relative flex h-full flex-col justify-between rounded-3xl border border-white/20 bg-gradient-to-br ${building.accent} p-5 text-slate-900 shadow-lg shadow-emerald-900/10 transition duration-300 hover:shadow-2xl`}
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/70 text-slate-900">
            <Icon size={28} />
          </span>
          <div>
            <p className="text-sm uppercase tracking-wide text-white/80">{building.title}</p>
            <p className="text-xs text-white/70">{building.intro}</p>
          </div>
        </div>
        <p className="mt-4 text-base font-medium text-white/95">{building.summary}</p>
        <div className="mt-5 flex items-center justify-between text-sm text-white/80">
          <span className="font-semibold">Entrer</span>
          <span className="text-xs uppercase tracking-wide">
            {isCompleted ? "Module complété" : "Découvrir"}
          </span>
        </div>
        {hasBadge && (
          <span className="absolute -right-2 -top-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-600 shadow-lg">
            Badge gagné
          </span>
        )}
      </Link>
    </motion.div>
  );
}
