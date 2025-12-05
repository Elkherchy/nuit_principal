"use client";

import { useState } from "react";
import type { Institution, InstitutionMetricId } from "../data/institutions";
import { METRIC_META } from "../lib/metrics";

type ComparisonExportButtonProps = {
  focus: Institution;
  reference: Institution;
  suggestions: string[];
  metrics: InstitutionMetricId[];
};

export function ComparisonExportButton({
  focus,
  reference,
  suggestions,
  metrics,
}: ComparisonExportButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const handleExport = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt" });
      const padding = 40;
      let cursorY = padding;

      doc.setFontSize(16);
      doc.text("Observatoire NIRD – Rapport comparatif", padding, cursorY);

      cursorY += 30;
      doc.setFontSize(12);
      doc.text(`Établissement A : ${focus.name}`, padding, cursorY);
      cursorY += 18;
      doc.text(`Établissement B : ${reference.name}`, padding, cursorY);

      cursorY += 24;
      doc.setFontSize(12);
      metrics.forEach((metric) => {
        const meta = METRIC_META[metric];
        const valueA = focus.metrics[metric];
        const valueB = reference.metrics[metric];
        doc.text(
          `${meta.label} — ${valueA}% vs ${valueB}% ${
            meta.invert ? "(bas = mieux)" : ""
          }`,
          padding,
          cursorY,
        );
        cursorY += 16;
      });

      cursorY += 10;
      doc.setFontSize(13);
      doc.text("Actions proposées :", padding, cursorY);
      cursorY += 18;
      doc.setFontSize(11);
      suggestions.forEach((suggestion) => {
        doc.text(`• ${suggestion}`, padding, cursorY, { maxWidth: 520 });
        cursorY += 14;
      });

      cursorY += 18;
      doc.setFontSize(10);
      doc.text(
        "Rapport généré depuis l'Observatoire NIRD – Village Numérique Résistant.",
        padding,
        cursorY,
      );

      const fileName = `nird-observatoire-${focus.id}-vs-${reference.id}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("Export PDF error", error);
      alert("Impossible de générer le PDF. Réessaie dans un instant.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={downloading}
      className="w-full rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-emerald-300 disabled:opacity-50"
    >
      {downloading ? "Génération en cours..." : "Exporter la comparaison en PDF"}
    </button>
  );
}

export default ComparisonExportButton;

