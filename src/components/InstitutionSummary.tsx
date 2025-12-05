"use client";

import { motion } from "framer-motion";
import type { Institution, InstitutionMetricId } from "../data/institutions";
import { metricLabel } from "../lib/metrics";

const positiveMetrics: InstitutionMetricId[] = ["linux", "libreSuite", "reemploi", "sovereignty", "inclusion", "co2"];
const negativeMetrics: InstitutionMetricId[] = ["cloudDependence"];

type SummaryProps = {
  focus: Institution;
  reference: Institution;
  suggestions: string[];
};

export default function InstitutionSummary({ focus, reference, suggestions }: SummaryProps) {
  const strengths = positiveMetrics.filter(
    (metric) => focus.metrics[metric] >= reference.metrics[metric] + 8,
  );
  const gaps = [
    ...positiveMetrics.filter(
      (metric) => reference.metrics[metric] - focus.metrics[metric] >= 8,
    ),
    ...negativeMetrics.filter(
      (metric) => focus.metrics[metric] - reference.metrics[metric] >= 8,
    ),
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3 text-sm text-white/80"
      >
        <p>
          <span className="font-semibold text-white">{focus.name}</span> se situe actuellement à{" "}
          <strong>{focus.metrics.linux}%</strong> de postes Linux et{" "}
          <strong>{focus.metrics.reemploi}%</strong> de réemploi. En face,{" "}
          <strong>{reference.name}</strong> affiche {reference.metrics.linux}% de Linux et{" "}
          {reference.metrics.reemploi}% de réemploi.
        </p>
        {strengths.length > 0 && (
          <p>
            ✅ Points forts :{" "}
            <span className="text-emerald-300">
              {strengths
                .map((metric) => metricLabel(metric))
                .join(" · ")}
            </span>
          </p>
        )}
        {gaps.length > 0 && (
          <p>
            ⚡ Axes de progression :{" "}
            <span className="text-amber-300">
              {gaps
                .map((metric) => metricLabel(metric))
                .join(" · ")}
            </span>
          </p>
        )}
        <ul className="list-disc space-y-1 pl-5 text-xs text-white/70">
          {suggestions.map((suggestion) => (
            <li key={suggestion}>{suggestion}</li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

