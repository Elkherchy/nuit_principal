import type { ComponentType } from "react";
import {
  IconChecklist,
  IconDeviceAnalytics,
  IconHammer,
  IconBooks,
  IconTerminal2,
  IconLeaf,
  IconShieldLock,
  IconTools,
  IconSparkles,
} from "@tabler/icons-react";
import type { BadgeId } from "../lib/localStorageUtils";

export type BuildingDefinition = {
  id: BadgeId;
  title: string;
  summary: string;
  path: string;
  intro: string;
  row: number;
  col: number;
  accent: string;
  icon: ComponentType<{ size?: number; className?: string }>;
};

export const BUILDINGS: BuildingDefinition[] = [
  {
    id: "atelier",
    title: "Atelier Réemploi",
    summary: "Répare, teste et redonne vie aux machines.",
    path: "/village/atelier",
    intro: "L'atelier bourdonne de tournevis libres et de pièces réemployées.",
    row: 1,
    col: 2,
    accent: "from-emerald-200 to-emerald-500",
    icon: IconTools,
  },
  {
    id: "linux",
    title: "Maison Linux",
    summary: "Installation guidée et humoristique de GNU/Linux.",
    path: "/village/linux",
    intro: "Une odeur de liberté flotte : ici on compile en paix.",
    row: 2,
    col: 1,
    accent: "from-blue-200 to-indigo-500",
    icon: IconTerminal2,
  },
  {
    id: "libre",
    title: "Bibliothèque Libre",
    summary: "Quiz express sur les logiciels pédagogiques libres.",
    path: "/village/libre",
    intro: "Silence relatif : on débat surtout sur les licences.",
    row: 2,
    col: 3,
    accent: "from-amber-200 to-orange-500",
    icon: IconBooks,
  },
  {
    id: "bigtech",
    title: "Tour de Surveillance",
    summary: "Mini tower defense contre les intrusions Big Tech.",
    path: "/village/bigtech",
    intro: "Les guetteurs repoussent popups et notifications douteuses.",
    row: 3,
    col: 2,
    accent: "from-rose-200 to-pink-500",
    icon: IconShieldLock,
  },
  {
    id: "eco",
    title: "Salle des Éco-Délégués",
    summary: "Comparer consommation, CO₂ et gains de durabilité.",
    path: "/village/eco",
    intro: "Graphiques et plantes cohabitent harmonieusement.",
    row: 3,
    col: 1,
    accent: "from-lime-200 to-green-500",
    icon: IconLeaf,
  },
  {
    id: "forge",
    title: "Forge de la Communauté",
    summary: "Déposer des idées et rejoindre les chantiers ouverts.",
    path: "/village/forge",
    intro: "Ça cliquette, ça discute RFC et budgets partagés.",
    row: 1,
    col: 3,
    accent: "from-purple-200 to-violet-500",
    icon: IconHammer,
  },
  {
    id: "labs",
    title: "Studio Résistant",
    summary: "BD dynamiques, city-builder et laboratoire secret.",
    path: "/labs",
    intro: "Des murs lumineux abritent les expériences NIRD les plus folles.",
    row: 2,
    col: 2,
    accent: "from-cyan-200 to-indigo-500",
    icon: IconSparkles,
  },
  {
    id: "observatoire",
    title: "Observatoire NIRD",
    summary: "Comparer les établissements et définir un plan d'action.",
    path: "/observatoire",
    intro: "Des analystes comparent les villages et partagent leurs tactiques.",
    row: 1,
    col: 1,
    accent: "from-cyan-200 to-violet-500",
    icon: IconDeviceAnalytics,
  },
  {
    id: "mission",
    title: "Quartier des Missions",
    summary: "Briefings secrets, radio libre et mur d'évidence.",
    path: "/missions",
    intro: "Une radio pirate diffuse les témoignages des résistants.",
    row: 3,
    col: 3,
    accent: "from-rose-200 to-amber-500",
    icon: IconChecklist,
  },
];
