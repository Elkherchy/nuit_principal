export type QuizQuestion = {
  id: string;
  title: string;
  description: string;
  options: { id: string; label: string }[];
  answer: string;
  tip: string;
};

export const LIBRE_QUIZ: QuizQuestion[] = [
  {
    id: "suite",
    title: "LibreOffice",
    description: "Quel module permet de créer des présentations ?",
    options: [
      { id: "writer", label: "Writer" },
      { id: "impress", label: "Impress" },
      { id: "calc", label: "Calc" },
    ],
    answer: "impress",
    tip: "Impress exporte directement en PDF ou HTML5, utile en classe.",
  },
  {
    id: "navigateur",
    title: "Firefox",
    description: "Quel avantage clé pour un établissement scolaire ?",
    options: [
      { id: "profiles", label: "Profils synchronisés et modulables" },
      { id: "vpn", label: "VPN intégré illimité" },
      { id: "minage", label: "Miner de la crypto pour financer la cantine" },
    ],
    answer: "profiles",
    tip: "Les profils permettent de séparer les usages élèves / administratifs.",
  },
  {
    id: "graphisme",
    title: "Inkscape",
    description: "Quel format vectoriel ouvert manipule-t-il nativement ?",
    options: [
      { id: "svg", label: "SVG" },
      { id: "psd", label: "PSD" },
      { id: "docx", label: "DOCX" },
    ],
    answer: "svg",
    tip: "Le SVG reste éditable dans le temps et léger pour le web.",
  },
  {
    id: "elearning",
    title: "Moodle",
    description: "Quelle fonctionnalité favorise la pédagogie active ?",
    options: [
      { id: "atelier", label: "Atelier peer-review" },
      { id: "pub", label: "Insertion de pubs ciblées" },
      { id: "lootbox", label: "Loot boxes pédagogiques" },
    ],
    answer: "atelier",
    tip: "L'activité Atelier permet aux élèves d'évaluer leurs pairs.",
  },
  {
    id: "navigateur2",
    title: "Firefox + modules",
    description: "Quel module aide à bloquer les traqueurs tiers ?",
    options: [
      { id: "uBlock", label: "uBlock Origin" },
      { id: "fortune", label: "Cookie Fortunes" },
      { id: "skins", label: "Skins Payants" },
    ],
    answer: "uBlock",
    tip: "uBlock Origin protège sans consommer trop de ressources.",
  },
  {
    id: "suite2",
    title: "LibreOffice + format",
    description: "Quel format ouvert est recommandé pour les documents ?",
    options: [
      { id: "odf", label: "ODF / ODT" },
      { id: "rtf", label: "RTF propriétaire" },
      { id: "pptx", label: "PPTX uniquement" },
    ],
    answer: "odf",
    tip: "L'ODF reste interopérable avec de nombreuses suites bureautiques.",
  },
];
