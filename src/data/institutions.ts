export type InstitutionMetricId =
  | "linux"
  | "libreSuite"
  | "reemploi"
  | "cloudDependence"
  | "sovereignty"
  | "inclusion"
  | "co2";

export type Institution = {
  id: string;
  name: string;
  type: "Lycée" | "Collège" | "Campus" | "Fablab";
  location: string;
  description: string;
  metrics: Record<InstitutionMetricId, number>;
  actions: string[];
};

export const DEFAULT_INSTITUTIONS: Institution[] = [
  {
    id: "carnot",
    name: "Lycée Carnot – NIRD",
    type: "Lycée",
    location: "Dijon",
    description:
      "Pilote historique du programme NIRD : migration massive vers Linux, ateliers de réemploi, gouvernance partagée.",
    metrics: {
      linux: 85,
      libreSuite: 90,
      reemploi: 80,
      cloudDependence: 25,
      sovereignty: 88,
      inclusion: 82,
      co2: 78,
    },
    actions: [
      "Sensibilisation annuelle aux communs numériques",
      "Maintenance communautaire des postes",
      "Partage des scripts d'installation avec le réseau académique",
    ],
  },
  {
    id: "neoTech",
    name: "Lycée Néotech Corporate",
    type: "Lycée",
    location: "Paris",
    description:
      "Équipement dernier cri mais verrouillé : contrats exclusifs Big Tech, cloud privatif américain, faible culture libre.",
    metrics: {
      linux: 12,
      libreSuite: 15,
      reemploi: 10,
      cloudDependence: 88,
      sovereignty: 20,
      inclusion: 46,
      co2: 32,
    },
    actions: [
      "Négocier la fin des clauses d'exclusivité",
      "Former une équipe mixte IT + enseignants pour tester des alternatives",
      "Ouvrir un atelier de reconditionnement pour les clubs",
    ],
  },
  {
    id: "transition",
    name: "Collège des Rivières en transition",
    type: "Collège",
    location: "Lorient",
    description:
      "Équipe motivée mais ressources limitées : beaucoup de réemploi artisanal et d'événements familles-écoles.",
    metrics: {
      linux: 55,
      libreSuite: 65,
      reemploi: 88,
      cloudDependence: 45,
      sovereignty: 60,
      inclusion: 74,
      co2: 70,
    },
    actions: [
      "Structurer une forge interne pour partager les images système",
      "Mettre en commun les achats de clés USB bootables",
      "Documenter la procédure d'accueil numérique pour les familles",
    ],
  },
  {
    id: "metropole",
    name: "Campus Métropole Data",
    type: "Campus",
    location: "Lyon",
    description:
      "Grosse infrastructure virtualisée, mais dépendance forte à un cloud propriétaire et à des outils SaaS imposés.",
    metrics: {
      linux: 35,
      libreSuite: 40,
      reemploi: 30,
      cloudDependence: 78,
      sovereignty: 42,
      inclusion: 58,
      co2: 55,
    },
    actions: [
      "Déployer un cloud souverain local (Proxmox / Nextcloud)",
      "Créer une brigade réemploi pour le parc administratif",
      "Allouer du temps de formation aux admins pour l'automatisation libre",
    ],
  },
];


