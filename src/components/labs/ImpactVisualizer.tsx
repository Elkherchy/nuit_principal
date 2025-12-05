"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { markModuleCompletion, unlockBadge, updateScore } from "../../lib/localStorageUtils";

type ImpactResult = {
  co2: number;
  waste: number;
  money: number;
  freedom: number;
  trackers: number;
};

export function ImpactVisualizer() {
  const [pcCount, setPcCount] = useState(30);
  const [repairs, setRepairs] = useState(18);
  const [linuxRatio, setLinuxRatio] = useState(80);
  const [result, setResult] = useState<ImpactResult | null>(null);

  const simulate = () => {
    const co2 = Math.round((repairs * 12 + pcCount * 0.8) * (linuxRatio / 100));
    const waste = Math.round(repairs * 4.5);
    const money = Math.round(pcCount * (linuxRatio / 100) * 120 + repairs * 60);
    const freedom = Math.min(100, 20 + linuxRatio * 0.6);
    const trackers = Math.round((linuxRatio / 100) * pcCount * 3);
    const payload: ImpactResult = { co2, waste, money, freedom, trackers };
    setResult(payload);
    unlockBadge("impact");
    markModuleCompletion("impact");
    markModuleCompletion("eco");
    updateScore({
      ecoScore: co2,
      autonomyScore: Math.round(freedom),
      privacyScore: Math.min(100, trackers / 2),
    });
  };

  return (
    <section className="rounded-3xl border border-lime-200/40 bg-slate-900/80 p-6 text-white shadow-xl">
      <p className="text-sm uppercase tracking-[0.3em] text-lime-300">Impact Visualizer</p>
      <h2 className="mt-2 text-3xl font-semibold">Mesure ton impact NIRD en direct</h2>
      <p className="mt-2 text-sm text-white/70">
        Ajuste les curseurs pour voir les économies de CO₂, de budget et de liberté logicielle. Les flux se mettent à jour instantanément.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Slider label={`Parc informatique : ${pcCount} PC`} value={pcCount} min={10} max={120} onChange={setPcCount} />
        <Slider label={`PC réparés : ${repairs}`} value={repairs} min={0} max={pcCount} onChange={setRepairs} />
        <Slider label={`Adoption Linux : ${linuxRatio}%`} value={linuxRatio} min={10} max={100} onChange={setLinuxRatio} />
      </div>

      <button
        onClick={simulate}
        className="mt-6 rounded-full bg-gradient-to-r from-lime-300 to-emerald-500 px-6 py-3 text-sm font-semibold text-slate-900"
      >
        Calculer l&rsquo;impact
      </button>

      {result && (
        <div className="mt-6 grid gap-4 md:grid-cols-5">
          <Metric label="CO₂ évité" unit="kg" value={result.co2} color="from-emerald-300 to-emerald-500" />
          <Metric label="Déchets évités" unit="kg" value={result.waste} color="from-lime-300 to-lime-500" />
          <Metric label="Budget sauvé" unit="€" value={result.money} color="from-amber-300 to-orange-500" />
          <Metric label="Score liberté" unit="pts" value={result.freedom} color="from-sky-300 to-indigo-500" />
          <Metric label="Trackers bloqués" unit="" value={result.trackers} color="from-rose-300 to-pink-500" />
        </div>
      )}
    </section>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="text-sm">
      <span>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 w-full accent-emerald-400"
      />
    </label>
  );
}

function Metric({ label, unit, value, color }: { label: string; unit: string; value: number; color: string }) {
  const normalized = Math.min(100, Math.abs(value)) || 1;
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
      <p className="text-xs uppercase tracking-wide text-white/60">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">
        {value} {unit}
      </p>
      <div className="mt-3 h-2 rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${normalized}%` }}
          className={`h-2 rounded-full bg-gradient-to-r ${color}`}
        />
      </div>
    </div>
  );
}

