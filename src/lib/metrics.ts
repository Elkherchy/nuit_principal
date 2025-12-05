import type { InstitutionMetricId } from "../data/institutions";

export const METRIC_ORDER: InstitutionMetricId[] = [
  "linux",
  "libreSuite",
  "reemploi",
  "cloudDependence",
  "sovereignty",
  "inclusion",
  "co2",
];

export const METRIC_META: Record<
  InstitutionMetricId,
  { label: string; helper: string; invert?: boolean; unit?: string }
> = {
  linux: {
    label: "% Postes Linux",
    helper: "Libère les postes des licences coûteuses.",
  },
  libreSuite: {
    label: "% Suites libres",
    helper: "LibreOffice, OnlyOffice, Collabora…",
  },
  reemploi: {
    label: "% Réemploi / reconditionnement",
    helper: "Matériel prolongé au lieu d'être jeté.",
  },
  cloudDependence: {
    label: "Dépendance cloud propriétaire",
    helper: "Plus c'est bas, plus vous êtes souverains.",
    invert: true,
  },
  sovereignty: {
    label: "Souveraineté / hébergement UE",
    helper: "Capacité à auto-héberger, contrôler les données.",
  },
  inclusion: {
    label: "Inclusion & accessibilité",
    helper: "Prêts de matériel, ateliers familles, UX inclusive.",
  },
  co2: {
    label: "Sobriété CO₂ (score)",
    helper: "Économie estimée sur 12 mois.",
    unit: "pts",
  },
};

export function metricLabel(metric: InstitutionMetricId) {
  return METRIC_META[metric]?.label ?? metric;
}


