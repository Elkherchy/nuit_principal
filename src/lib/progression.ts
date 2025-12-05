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
  IconPalette,
  IconBuildingCommunity,
  IconShieldCheck,
  IconDeviceDesktopCheck,
  IconKey,
  IconChartHistogram,
  IconBook,
  IconFlask,
  IconMovie,
  IconStars,
} from "@tabler/icons-react";
import type { BadgeId } from "./localStorageUtils";

export type BadgeDefinition = {
  id: BadgeId;
  title: string;
  description: string;
  reward: string;
  color: string;
  icon: ComponentType<{ size?: number; className?: string }>;
};

export const BADGES: BadgeDefinition[] = [
  {
    id: "atelier",
    title: "Réparateur du Village",
    description: "Diagnostique et ressuscite les PC fatigués.",
    reward: "+15 points d'autonomie matérielle",
    color: "from-emerald-300 via-emerald-500 to-teal-500",
    icon: IconTools,
  },
  {
    id: "linux",
    title: "Admin Linux Niveau 12",
    description: "Guide les élèves vers une installation Linux sereine.",
    reward: "Terminal mystique déverrouillé",
    color: "from-sky-300 via-blue-500 to-indigo-500",
    icon: IconTerminal2,
  },
  {
    id: "libre",
    title: "Sage du Libre",
    description: "Connait les incontournables logiciels ouverts.",
    reward: "Accès à la bibliothèque secrète",
    color: "from-amber-200 via-orange-400 to-rose-400",
    icon: IconBooks,
  },
  {
    id: "bigtech",
    title: "Bouclier Numérique",
    description: "Repousse les assauts des plateformes prédatrices.",
    reward: "Village protégé pendant 24h",
    color: "from-rose-300 via-red-500 to-fuchsia-500",
    icon: IconShieldLock,
  },
  {
    id: "eco",
    title: "Éco-Guerrier",
    description: "Optimise l'énergie et réduit les émissions.",
    reward: "+20 points de résilience écologique",
    color: "from-lime-200 via-green-500 to-emerald-600",
    icon: IconLeaf,
  },
  {
    id: "forge",
    title: "Forgeron Libre",
    description: "Fait pousser de nouvelles idées contributives.",
    reward: "Invitation au conseil du village",
    color: "from-purple-200 via-violet-500 to-indigo-600",
    icon: IconHammer,
  },
  {
    id: "labs",
    title: "Explorateur du Studio",
    description: "Débloque les expériences secrètes du village.",
    reward: "Accès permanent aux laboratoires créatifs",
    color: "from-cyan-200 via-sky-400 to-indigo-500",
    icon: IconStars,
  },
  {
    id: "comic",
    title: "Auteur BD Résistant",
    description: "Crée une BD anti Big Tech personnalisée.",
    reward: "Gagne l'imprimerie libre",
    color: "from-pink-200 via-rose-400 to-purple-500",
    icon: IconPalette,
  },
  {
    id: "city",
    title: "Architecte NIRD",
    description: "Construit un campus résistant et équilibré.",
    reward: "Blueprints partagés avec le réseau",
    color: "from-emerald-200 via-teal-400 to-cyan-500",
    icon: IconBuildingCommunity,
  },
  {
    id: "surveillancePlus",
    title: "Dompteur de BigTech",
    description: "Nettoie les trackers, cookies et popups toxiques.",
    reward: "Bouclier vie privée +20",
    color: "from-red-200 via-rose-400 to-fuchsia-500",
    icon: IconShieldCheck,
  },
  {
    id: "resurrection",
    title: "Réparateur d’Obélix-PC",
    description: "Sauve un vieux PC en transition libre.",
    reward: "Sauvetage CO₂ et budget",
    color: "from-amber-200 via-amber-400 to-amber-600",
    icon: IconDeviceDesktopCheck,
  },
  {
    id: "escape",
    title: "Maître de l’Escape NIRD",
    description: "Résout les énigmes contre la dépendance Big Tech.",
    reward: "Clé cryptée du campus",
    color: "from-indigo-200 via-blue-400 to-violet-600",
    icon: IconKey,
  },
  {
    id: "impact",
    title: "Éco-Héro",
    description: "Visualise l'impact CO₂, budget et liberté.",
    reward: "Certification climat du village",
    color: "from-lime-200 via-green-400 to-emerald-600",
    icon: IconChartHistogram,
  },
  {
    id: "adventure",
    title: "Gaulois Libre",
    description: "Choisit toujours l'option souveraine.",
    reward: "Confiance du lycée Carnot",
    color: "from-orange-200 via-rose-400 to-red-500",
    icon: IconBook,
  },
  {
    id: "potion",
    title: "Alchimiste du Libre",
    description: "Assemble les potions open source parfaites.",
    reward: "Laboratoire partagé",
    color: "from-purple-200 via-fuchsia-400 to-indigo-500",
    icon: IconFlask,
  },
  {
    id: "movie",
    title: "Réalisateur NIRD",
    description: "Anime le court-métrage de la résistance.",
    reward: "Projection publique au forum",
    color: "from-slate-200 via-cyan-400 to-blue-600",
    icon: IconMovie,
  },
  {
    id: "observatoire",
    title: "Analyste NIRD",
    description: "Compare les établissements et identifie les leviers d'action.",
    reward: "Accès à l'observatoire stratégique",
    color: "from-cyan-200 via-blue-500 to-violet-600",
    icon: IconDeviceAnalytics,
  },
  {
    id: "mission",
    title: "Stratège Résistant",
    description: "Valide les missions et interviews du Village.",
    reward: "Accès au quartier tactique",
    color: "from-red-200 via-orange-400 to-yellow-500",
    icon: IconChecklist,
  },
];

export const BADGE_MAP = BADGES.reduce<Record<BadgeId, BadgeDefinition>>((acc, badge) => {
  acc[badge.id] = badge;
  return acc;
}, {} as Record<BadgeId, BadgeDefinition>);

export const getBadgeDefinition = (id: BadgeId) => BADGE_MAP[id];
