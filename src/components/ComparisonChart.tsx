"use client";

import { motion } from "framer-motion";
import type { Institution, InstitutionMetricId } from "../data/institutions";
import { METRIC_META } from "../lib/metrics";

type ComparisonChartProps = {
  institutions: Institution[];
  metrics?: InstitutionMetricId[];
};

export function ComparisonChart({
  institutions,
  metrics = Object.keys(METRIC_META) as InstitutionMetricId[],
}: ComparisonChartProps) {
  return (
    <div className="space-y-4">
      {metrics.map((metric) => {
        const meta = METRIC_META[metric];
        const maxValue = meta.invert
          ? Math.max(...institutions.map((item) => 100 - item.metrics[metric]))
          : Math.max(...institutions.map((item) => item.metrics[metric]));
        return (
          <div key={metric} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">{meta.label}</p>
                <p className="text-xs text-white/60">{meta.helper}</p>
              </div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                {meta.invert ? "Bas = mieux" : "Haut = mieux"}
              </p>
            </div>
            <div className="mt-3 space-y-2">
              {institutions.map((institution) => {
                const rawValue = institution.metrics[metric];
                const normalized = meta.invert ? 100 - rawValue : rawValue;
                const width = maxValue === 0 ? 0 : (normalized / maxValue) * 100;
                return (
                  <div key={institution.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-white/70">
                      <span>{institution.name}</span>
                      <span className="text-white font-semibold">
                        {rawValue}
                        {meta.unit ? ` ${meta.unit}` : "%"}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ duration: 0.6 }}
                        className="h-2 rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-indigo-400"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ComparisonChart;


