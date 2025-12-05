"use client";

import { useEffect, useMemo, useState } from "react";
import type { ExecutiveScenario, ExecutiveProjection } from "../types/executive";

const defaultScenario: ExecutiveScenario = {
  pcCount: 220,
  linuxTarget: 60,
  licenseCost: 160,
  cloudSpend: 3200,
  supportSpend: 2200,
  hardwareReplacementRate: 0.3,
  hardwareCost: 650,
  energyPerPc: 45,
  carbonPerPc: 32,
};

const numberFormatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

type Props = {
  onChange: (payload: { scenario: ExecutiveScenario; projection: ExecutiveProjection }) => void;
};

export function ExecutiveCalculator({ onChange }: Props) {
  const [form, setForm] = useState<ExecutiveScenario>(defaultScenario);

  const projection = useMemo<ExecutiveProjection>(() => {
    const linuxRatio = form.linuxTarget / 100;
    const licenseSavings = form.pcCount * linuxRatio * form.licenseCost;
    const cloudSavings = form.cloudSpend * linuxRatio * 0.65;
    const supportSavings = form.supportSpend * linuxRatio * 0.7;
    const hardwareSavings = form.pcCount * form.hardwareReplacementRate * form.hardwareCost * linuxRatio * 0.5;
    const energySavings = form.pcCount * form.energyPerPc * linuxRatio * 0.35;
    const avoidedCO2 = form.pcCount * form.carbonPerPc * linuxRatio * 0.6;
    const totalSavings = licenseSavings + cloudSavings + supportSavings + hardwareSavings + energySavings;
    return {
      licenseSavings,
      cloudSavings,
      supportSavings,
      hardwareSavings,
      energySavings,
      totalSavings,
      avoidedCO2,
    };
  }, [form]);

  useEffect(() => {
    onChange({ scenario: form, projection });
  }, [form, projection, onChange]);

  const handleChange = <K extends keyof ExecutiveScenario>(field: K, value: number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <p className="text-sm uppercase tracking-[0.4em] text-cyan-300">Calculateur exécutif</p>
      <h2 className="mt-2 text-3xl font-semibold text-white">Estime instantanément tes économies</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <NumberField
          label="Parc total (PC)"
          value={form.pcCount}
          min={20}
          max={2000}
          onChange={(value) => handleChange("pcCount", value)}
        />
        <NumberField
          label="Objectif Linux (%)"
          value={form.linuxTarget}
          min={10}
          max={100}
          onChange={(value) => handleChange("linuxTarget", value)}
        />
        <NumberField
          label="Coût licence / an (€)"
          value={form.licenseCost}
          min={20}
          max={400}
          onChange={(value) => handleChange("licenseCost", value)}
        />
        <NumberField
          label="Dépenses cloud mensuelles (€)"
          value={form.cloudSpend}
          min={0}
          max={10000}
          step={100}
          onChange={(value) => handleChange("cloudSpend", value)}
        />
        <NumberField
          label="Contrats support propriétaires (€ / an)"
          value={form.supportSpend}
          min={0}
          max={15000}
          step={100}
          onChange={(value) => handleChange("supportSpend", value)}
        />
        <NumberField
          label="% de remplacement matériel / an"
          value={form.hardwareReplacementRate * 100}
          min={5}
          max={80}
          onChange={(value) => handleChange("hardwareReplacementRate", value / 100)}
        />
        <NumberField
          label="Coût moyen d&rsquo;un PC (€)"
          value={form.hardwareCost}
          min={200}
          max={1200}
          onChange={(value) => handleChange("hardwareCost", value)}
        />
        <NumberField
          label="Coût énergie par poste (€/an)"
          value={form.energyPerPc}
          min={10}
          max={120}
          onChange={(value) => handleChange("energyPerPc", value)}
        />
        <NumberField
          label="Empreinte CO₂ par poste (kg/an)"
          value={form.carbonPerPc}
          min={5}
          max={80}
          onChange={(value) => handleChange("carbonPerPc", value)}
        />
      </div>
      <div className="mt-4 grid gap-3 text-sm text-white/70 md:grid-cols-2">
        <SummaryCard label="Économies totales estimées" value={`≈ ${numberFormatter.format(Math.round(projection.totalSavings))} € / an`} accent="from-emerald-300 to-cyan-400" />
        <SummaryCard label="CO₂ évité" value={`${numberFormatter.format(Math.round(projection.avoidedCO2))} kg / an`} accent="from-lime-300 to-green-500" />
      </div>
    </section>
  );
}

type NumberFieldProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
};

function NumberField({ label, value, min, max, step = 1, onChange }: NumberFieldProps) {
  return (
    <label className="text-xs uppercase tracking-[0.3em] text-white/40">
      {label}
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-white"
      />
    </label>
  );
}

type SummaryCardProps = {
  label: string;
  value: string;
  accent: string;
};

function SummaryCard({ label, value, accent }: SummaryCardProps) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-gradient-to-r ${accent} p-4 text-slate-900`}>
      <p className="text-xs uppercase tracking-[0.3em] text-slate-700">{label}</p>
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export default ExecutiveCalculator;

