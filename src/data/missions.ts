export type MissionTheme = "linux" | "reemploi" | "privacy" | "community" | "eco" | "labs";

export type Mission = {
  id: string;
  title: string;
  description: string;
  theme: MissionTheme;
  action: string;
};

export const MISSIONS: Mission[] = [
  {
    id: "linux-squad",
    title: "Linux Squad",
    description: "Propose une session d&rsquo;installation express pour 5 postes dans une salle info.",
    theme: "linux",
    action: "Préparer une clé USB, convaincre un prof de faire un test.",
  },
  {
    id: "privacy-patrol",
    title: "Privacy Patrol",
    description: "Cartographie les cookies et popups toxiques sur le portail de ton établissement.",
    theme: "privacy",
    action: "Capture 3 écrans et partage-les au conseil numérique.",
  },
  {
    id: "eco-dragon",
    title: "Dragon de la sobriété",
    description: "Mesure l&rsquo;empreinte CO₂ approximative de la salle des profs.",
    theme: "eco",
    action: "Compare la consommation actuelle avec un scénario Linux + veille.",
  },
  {
    id: "forge-bard",
    title: "Barde de la Forge",
    description: "Interviewe un club local sur ses besoins numériques.",
    theme: "community",
    action: "Publie le témoignage dans la Forge de la Communauté.",
  },
  {
    id: "hack-labs",
    title: "Explorateur des Labs",
    description: "Raconte une nouvelle mission pour le Potion Lab ou la BD dynamique.",
    theme: "labs",
    action: "Ajoute ton idée dans le Studio Résistant.",
  },
  {
    id: "repair-hero",
    title: "Réparateur Fantastique",
    description: "Sauve un poste considéré comme obsolète par la vie scolaire.",
    theme: "reemploi",
    action: "Documente la réparation, photo avant/après, partage sur l’observatoire.",
  },
];

export type MediaResource = {
  id: string;
  title: string;
  type: "video" | "audio" | "article";
  duration: string;
  source: string;
  link: string;
  quote: string;
};

export const MEDIA_RESOURCES: MediaResource[] = [
  {
    id: "fr3-linux",
    title: "Windows 11 : l’alternative libre",
    type: "video",
    duration: "2 min",
    source: "France 3 Alpes",
    link: "https://video.echirolles.fr/w/hVykGUtRZqRen6eiutqRvQ",
    quote: "Les lycéens montrent comment Linux allonge la vie des PC scolaires.",
  },
  {
    id: "france-inter",
    title: "Obsolescence programmée vs logiciels libres",
    type: "audio",
    duration: "4 min",
    source: "France Inter – Grand reportage",
    link: "https://www.radiofrance.fr/franceinter/podcasts/le-grand-reportage-de-france-inter/le-grand-reportage-du-mardi-14-octobre-2025-4136495",
    quote: "Changer de logiciel plutôt que de jeter les machines.",
  },
  {
    id: "france-info",
    title: "Logiciel obsolète = matériel à la benne ?",
    type: "video",
    duration: "3 min",
    source: "France Info",
    link: "https://www.youtube.com/watch?v=76T8oubek-c",
    quote: "Le coût écologique d’un simple changement de version.",
  },
  {
    id: "back-market",
    title: "L’Ordinateur Obsolète",
    type: "video",
    duration: "1 min",
    source: "Back Market",
    link: "https://www.youtube.com/watch?v=S6GLqkhykmA",
    quote: "Humour noir sur la vie d’un PC promis à la déchetterie.",
  },
  {
    id: "cafepeda",
    title: "Voyage au centre du libre éducatif",
    type: "article",
    duration: "Lecture 6 min",
    source: "Café Pédagogique",
    link: "https://www.cafepedagogique.net/2025/04/27/bruay-labuissiere-voyage-au-centre-du-libre-educatif/",
    quote: "Le lycée Carnot raconte sa stratégie NIRD.",
  },
  {
    id: "carnot-video",
    title: "Linux, c’est facile !",
    type: "video",
    duration: "5 min",
    source: "Élèves du lycée Carnot",
    link: "https://tube-numerique-educatif.apps.education.fr/w/3LXem3XK4asbwZa5R1qGkW",
    quote: "Démonstration pas-à-pas par les élèves eux-mêmes.",
  },
];


