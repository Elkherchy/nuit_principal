const GAME_OVER_LINES = [
  "Le serpent s'est mordu le code.",
  "Flux interrompu : collision fatale.",
  "Packet dropped. Relance le tunnel.",
  "Debug time! Le serpent a trouvé un mur logique.",
  "L'IA t'observe... et rit un peu.",
];

const FUN_EVENTS = [
  "Scan holographique enclenché.",
  "Champ magnétique calibré.",
  "Slow-mo quantique activé.",
  "Ghost mode : aucun log ne te trahira.",
  "Boost neural téléchargé.",
];

export function randomGameOverMessage() {
  return GAME_OVER_LINES[Math.floor(Math.random() * GAME_OVER_LINES.length)];
}

export function randomFunEvent() {
  return FUN_EVENTS[Math.floor(Math.random() * FUN_EVENTS.length)];
}


