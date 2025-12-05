"use client";

import { useState } from "react";
import { markModuleCompletion, unlockBadge, updateScore } from "../lib/localStorageUtils";

const HOURS_PER_WEEK = 18;
const CO2_PER_KWH = 0.055; // kg/kWh

const computeKwh = (watts: number, years: number) =>
  ((watts / 1000) * HOURS_PER_WEEK * 52) * years;

export function EcoSimulator() {
  const [pcCount, setPcCount] = useState(12);
  const [years, setYears] = useState(5);
  const [reuseRate, setReuseRate] = useState(60);
  const [linuxRatio, setLinuxRatio] = useState(80);
  const [result, setResult] = useState<{ kwh: number; co2: number; saved: number } | null>(null);

  const simulate = () => {
    const windowsWatts = 85;
    const linuxWatts = 55;
    const windowsKwh = computeKwh(windowsWatts, years) * pcCount;
    const linuxKwh = computeKwh(
      windowsWatts - (windowsWatts - linuxWatts) * (linuxRatio / 100),
      years
    ) * pcCount;
    const reuseBonus = pcCount * (reuseRate / 100) * 120;
    const savedKwh = windowsKwh - linuxKwh + reuseBonus;
    const savedCo2 = savedKwh * CO2_PER_KWH;

    setResult({ kwh: Math.max(savedKwh, 0), co2: Math.max(savedCo2, 0), saved: reuseBonus });
    updateScore({ ecoScore: Math.round(savedCo2) });
    unlockBadge("eco");
    markModuleCompletion("eco");
  };

  return (
    <section className="rounded-3xl border border-lime-200/40 bg-slate-900/80 p-6 text-white">
      <p className="text-sm uppercase tracking-[0.3em] text-lime-300">Salle des Éco-Délégués</p>
      <h2 className="mt-2 text-3xl font-semibold">Simule ta réduction d&rsquo;empreinte</h2>
      <div className="mt-6 space-y-4">
        <Slider
          label={`Parc informatique : ${pcCount} PC`}
          value={pcCount}
          min={4}
          max={60}
          onChange={(value) => setPcCount(Number(value))}
        />
        <Slider
          label={`Horizon : ${years} ans`}
          value={years}
          min={1}
          max={8}
          onChange={(value) => setYears(Number(value))}
        />
        <Slider
          label={`Réemploi réussi : ${reuseRate}%`}
          value={reuseRate}
          min={0}
          max={100}
          onChange={(value) => setReuseRate(Number(value))}
        />
        <Slider
          label={`Ratio Linux installé : ${linuxRatio}%`}
          value={linuxRatio}
          min={20}
          max={100}
          onChange={(value) => setLinuxRatio(Number(value))}
        />
      </div>
      <button
        onClick={simulate}
        className="mt-6 w-full rounded-full bg-gradient-to-r from-lime-300 to-emerald-500 px-6 py-3 text-center text-sm font-semibold text-slate-900"
      >
        Calculer mon impact
      </button>
      {result && (
        <div className="mt-4 rounded-3xl border border-white/10 bg-white/10 p-4 text-sm">
          <p>
            Énergie économisée : <strong>{Math.round(result.kwh)} kWh</strong>
          </p>
          <p>
            CO₂ évité : <strong>{Math.round(result.co2)} kg</strong>
          </p>
          <p>
            Bonus réemploi : {Math.round(result.saved)} kWh convertis
          </p>
          <p className="mt-2 text-xs text-white/70">Badge &quot;Éco-Guerrier&quot; verrouillé automatiquement.</p>
        </div>
      )}
    </section>
  );
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: string) => void;
}

function Slider({ label, value, min, max, onChange }: SliderProps) {
  return (
    <label className="block text-sm">
      <span className="text-white/80">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full accent-emerald-400"
      />
    </label>
  );
}
