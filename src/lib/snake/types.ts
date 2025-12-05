export type Direction = "up" | "down" | "left" | "right";

export interface Position {
  x: number;
  y: number;
}

export type FruitType = "normal" | "golden" | "toxic";

export interface Fruit {
  position: Position;
  type: FruitType;
  expiresAt: number;
}

export type PowerUpType = "slowmo" | "speed" | "magnet" | "ghost";

export interface PowerUpPickup {
  position: Position;
  type: PowerUpType;
  expiresAt: number;
}

export interface ActivePowerUps {
  slowmo?: number;
  speed?: number;
  magnet?: number;
  ghost?: number;
}

export type GameStatus = "idle" | "running" | "paused" | "over";

export interface Particle {
  id: string;
  position: Position;
  velocity: { x: number; y: number };
  life: number;
  maxLife: number;
  color: string;
}

export interface GameRuntime {
  snake: Position[];
  direction: Direction;
  pendingDirection: Direction;
  gridSize: number;
  fruit: Fruit;
  pendingGrowth: number;
  score: number;
  status: GameStatus;
  comboChain: number;
  comboMultiplier: number;
  avoidedToxic: number;
  fruitCounter: number;
  powerUpPickup: PowerUpPickup | null;
  activePowerUps: ActivePowerUps;
  particles: Particle[];
  lastTick: number;
  baseSpeed: number;
  speedLevel: number;
  fxEnabled: boolean;
  bestScore: number;
  lastFruitType: FruitType;
  message?: string;
}

export interface StepSnapshot {
  status: GameStatus;
  score: number;
  comboMultiplier: number;
  comboChain: number;
  avoidedToxic: number;
  speedLevel: number;
  fruit: Fruit;
  powerUpPickup: PowerUpPickup | null;
  activePowerUps: ActivePowerUps;
  lastFruitType: FruitType;
  message?: string;
}


