import type { FruitType, PowerUpType } from "./types";

export const GRID_SIZE = 25;
export const CANVAS_SIZE = 640;
export const INITIAL_SPEED_MS = 150;
export const SPEED_STEP_MS = 6;
export const FRUITS_PER_LEVEL = 4;
export const MAX_SPEED_LEVEL = 6;
export const MAX_COMBO_MULTIPLIER = 6;

export const POWER_UP_DURATION: Record<PowerUpType, number> = {
  slowmo: 6000,
  speed: 4500,
  magnet: 7000,
  ghost: 3200,
};

export const FRUIT_VALUES: Record<FruitType, number> = {
  normal: 10,
  golden: 50,
  toxic: -20,
};

export const FRUIT_GROWTH: Record<FruitType, number> = {
  normal: 1,
  golden: 3,
  toxic: -2,
};

export const FRUIT_SPAWN_CHANCES: Record<FruitType, number> = {
  normal: 0.7,
  golden: 0.2,
  toxic: 0.1,
};

export const FRUIT_LIFETIME_MS: Record<FruitType, number> = {
  normal: 9000,
  golden: 7000,
  toxic: 6000,
};

export const TOXIC_AVOID_TARGET = 3;

export const FRUIT_COLORS: Record<FruitType, string> = {
  normal: "#3bf2a5",
  golden: "#facc15",
  toxic: "#c084fc",
};

export const POWER_UP_COLORS: Record<PowerUpType, string> = {
  slowmo: "#38bdf8",
  speed: "#fb923c",
  magnet: "#f472b6",
  ghost: "#a78bfa",
};

export const STORAGE_KEYS = {
  highScore: "hiddenSnakeHighScore",
  gamesPlayed: "hiddenSnakeGamesPlayed",
};

export const PARTICLE_COLORS: Record<FruitType, string> = {
  normal: "rgba(59, 242, 165, 0.8)",
  golden: "rgba(250, 204, 21, 0.85)",
  toxic: "rgba(192, 132, 252, 0.85)",
};


