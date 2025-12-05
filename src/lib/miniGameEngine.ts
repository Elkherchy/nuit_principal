export type ThreatCard = {
  id: string;
  label: string;
  damage: number;
  hint: string;
};

export type FaultComponent = {
  id: string;
  label: string;
  clue: string;
  fix: string;
};

const BASE_THREATS: Omit<ThreatCard, "id">[] = [
  {
    label: "Popup d'abonnement forcé",
    damage: 2,
    hint: "Bloquer les notifications abusives",
  },
  {
    label: "Tracker publicitaire furtif",
    damage: 3,
    hint: "Activer les protections renforcées",
  },
  {
    label: "Contrat propriétaire opaque",
    damage: 4,
    hint: "Privilégier les licences libres",
  },
  {
    label: "Verrouillage de compte",
    damage: 3,
    hint: "Diversifier les services",
  },
  {
    label: "Obsolescence programmée",
    damage: 5,
    hint: "Réemploi et pièces génériques",
  },
];

const FAULTS: FaultComponent[] = [
  {
    id: "cpu",
    label: "CPU",
    clue: "Les diagnostics montrent 5% d'utilisation stable",
    fix: "Inutile de changer le processeur, il est encore vaillant.",
  },
  {
    id: "ram",
    label: "RAM",
    clue: "Un seul slot est occupé mais aucun crash mémoire",
    fix: "Ajoute une barrette si besoin, mais rien n'est cassé.",
  },
  {
    id: "disk",
    label: "Disque",
    clue: "SMART indique 98% de santé, juste un système saturé",
    fix: "Nettoyage ou passage à un SSD récupéré.",
  },
  {
    id: "os",
    label: "Système",
    clue: "Windows 8 met 4 minutes à démarrer",
    fix: "Installer une distribution GNU/Linux légère relance la machine.",
  },
];

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const createThreatCard = (): ThreatCard => {
  const base = BASE_THREATS[randomBetween(0, BASE_THREATS.length - 1)];
  return { ...base, id: uid() };
};

export const createAtelierPuzzle = () => {
  const solution = FAULTS.find((fault) => fault.id === "os") ?? FAULTS[0];
  const options = [...FAULTS];
  return { solution, options };
};

export const threatWaveSize = 12;
