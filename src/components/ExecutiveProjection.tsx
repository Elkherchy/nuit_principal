"use client";

import { motion } from "framer-motion";
import type { ExecutiveProjection } from "../types/executive";

type Props = {
  projection: ExecutiveProjection | null;
};

const numberFormatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

export function ExecutiveProjectionCard({ projection }: Props) {
  if (!projection) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
        Renseigne ton parc pour générer un plan d&rsquo;économies.
      </section>
    );
  }

  const rows = [
    { label: "Licences propriétaires", value: projection.licenseSavings },
    { label: "SaaS / Cloud fermés", value: projection.cloudSavings },
    { label: "Contrats de support", value: projection.supportSavings },
    { label: "Renouvellement matériel", value: projection.hardwareSavings },
    { label: "Énergie économisée", value: projection.energySavings },
  ];

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <p className="text-sm uppercase tracking-[0.4em] text-white/50">Projection financière</p>
      <h2 className="mt-2 text-3xl font-semibold text-white">Où partent les économies ?</h2>
      <div className="mt-4 space-y-3 text-sm text-white/80">
        {rows.map((row) => (
          <motion.div
            key={row.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3"
          >
            <p>{row.label}</p>
            <p className="font-semibold text-white">≈ {numberFormatter.format(Math.round(row.value))} €</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default ExecutiveProjectionCard;

