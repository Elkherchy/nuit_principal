import {
  GRID_SIZE,
  INITIAL_SPEED_MS,
  SPEED_STEP_MS,
  FRUITS_PER_LEVEL,
  MAX_SPEED_LEVEL,
  FRUIT_GROWTH,
  FRUIT_VALUES,
  FRUIT_SPAWN_CHANCES,
  FRUIT_LIFETIME_MS,
  POWER_UP_DURATION,
  FRUIT_COLORS,
  POWER_UP_COLORS,
  PARTICLE_COLORS,
  MAX_COMBO_MULTIPLIER,
  TOXIC_AVOID_TARGET,
} from "./constants";
import type {
  ActivePowerUps,
  Direction,
  Fruit,
  FruitType,
  GameRuntime,
  Particle,
  Position,
  PowerUpPickup,
  PowerUpType,
  StepSnapshot,
} from "./types";
import { randomFunEvent, randomGameOverMessage } from "./messages";

const randomId = () => Math.random().toString(36).slice(2, 9);

interface InitOptions {
  gridSize?: number;
  bestScore: number;
  fxEnabled: boolean;
  now?: number;
}

export function initGameRuntime({
  gridSize = GRID_SIZE,
  bestScore,
  fxEnabled,
  now = performance.now(),
}: InitOptions): GameRuntime {
  const center = Math.floor(gridSize / 2);
  const snake: Position[] = [
    { x: center + 1, y: center },
    { x: center, y: center },
    { x: center - 1, y: center },
  ];
  const fruit = spawnFruit(gridSize, snake, null, now);
  return {
    snake,
    direction: "right",
    pendingDirection: "right",
    gridSize,
    fruit,
    pendingGrowth: 0,
    score: 0,
    status: "running",
    comboChain: 0,
    comboMultiplier: 1,
    avoidedToxic: 0,
    fruitCounter: 0,
    powerUpPickup: null,
    activePowerUps: {},
    particles: [],
    lastTick: now,
    baseSpeed: INITIAL_SPEED_MS,
    speedLevel: 0,
    fxEnabled,
    bestScore,
    lastFruitType: fruit.type,
    message: undefined,
  };
}

export function queueDirection(state: GameRuntime, direction: Direction) {
  if (state.status !== "running") return;
  if (isOpposite(state.direction, direction)) return;
  state.pendingDirection = direction;
}

export function stepGame(state: GameRuntime, now: number): StepSnapshot {
  if (state.status !== "running") {
    return snapshot(state);
  }

  pruneExpiredPowerUps(state.activePowerUps, now);
  if (state.powerUpPickup && state.powerUpPickup.expiresAt <= now) {
    state.powerUpPickup = null;
    state.message = "Power-up volatilisé.";
  }

  if (state.fruit.expiresAt <= now) {
    if (state.fruit.type === "toxic") {
      state.avoidedToxic += 1;
      if (state.avoidedToxic % TOXIC_AVOID_TARGET === 0) {
        state.comboChain += 2;
        state.message = "Combo bonus : toxique esquivé.";
      } else {
        state.message = "ToX dodge.";
      }
    } else {
      state.comboChain = Math.max(0, state.comboChain - 1);
      state.message = "Paquet périmé, nouveau spawn.";
    }
    state.fruit = spawnFruit(state.gridSize, state.snake, state.powerUpPickup, now);
  }

  const nextHead = getNextHead(state.snake[0], state.pendingDirection);
  state.direction = state.pendingDirection;

  if (hitsWall(nextHead, state.gridSize)) {
    return kill(state, randomGameOverMessage());
  }

  const collidedIndex = state.snake.findIndex((segment) => positionsEqual(segment, nextHead));
  const ghostActive = isPowerUpActive(state.activePowerUps, "ghost", now);
  if (collidedIndex !== -1 && !ghostActive) {
    return kill(state, randomGameOverMessage());
  }

  state.snake.unshift(nextHead);
  if (state.pendingGrowth > 0) {
    state.pendingGrowth -= 1;
  } else {
    state.snake.pop();
  }

  if (isPowerUpActive(state.activePowerUps, "magnet", now)) {
    attractFruitTowardsHead(state);
  }

  let eventMessage: string | undefined;
  if (positionsEqual(nextHead, state.fruit.position)) {
    eventMessage = handleFruitCollection(state, now);
  }

  if (state.powerUpPickup && positionsEqual(nextHead, state.powerUpPickup.position)) {
    eventMessage = activatePowerUp(state, state.powerUpPickup.type, now);
    state.powerUpPickup = null;
  }

  updateParticles(state);
  state.lastTick = now;
  return snapshot(state, eventMessage);
}

export function computeSpeedInterval(state: GameRuntime, now: number) {
  const base = state.baseSpeed - Math.min(state.speedLevel, MAX_SPEED_LEVEL) * SPEED_STEP_MS;
  let interval = Math.max(65, base);
  if (isPowerUpActive(state.activePowerUps, "slowmo", now)) {
    interval *= 1.5;
  }
  if (isPowerUpActive(state.activePowerUps, "speed", now)) {
    interval *= 0.75;
  }
  return interval;
}

export function renderGame(
  ctx: CanvasRenderingContext2D,
  state: GameRuntime,
  canvasSize: number,
) {
  const cellSize = canvasSize / state.gridSize;
  ctx.clearRect(0, 0, canvasSize, canvasSize);

  const background = ctx.createLinearGradient(0, 0, canvasSize, canvasSize);
  background.addColorStop(0, "#030712");
  background.addColorStop(1, "#050f1f");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  ctx.strokeStyle = "rgba(94, 234, 212, 0.08)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= state.gridSize; i += 1) {
    const offset = i * cellSize;
    ctx.beginPath();
    ctx.moveTo(offset, 0);
    ctx.lineTo(offset, canvasSize);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, offset);
    ctx.lineTo(0 + canvasSize, offset); // ensure proper line
    ctx.stroke();
  }

  drawFruit(ctx, state.fruit, cellSize);

  if (state.powerUpPickup) {
    drawPowerUp(ctx, state.powerUpPickup, cellSize);
  }

  state.snake.forEach((segment, index) => {
    const intensity = 1 - index / (state.snake.length + 5);
    drawSnakeCell(
      ctx,
      segment,
      cellSize,
      `rgba(94,234,212,${0.85 * intensity})`,
      index === 0,
    );
  });

  if (state.fxEnabled) {
    drawParticles(ctx, state.particles, cellSize);
  }
}

function handleFruitCollection(state: GameRuntime, now: number) {
  const type = state.fruit.type;
  state.lastFruitType = type;
  const growth = FRUIT_GROWTH[type];
  if (growth >= 0) {
    state.pendingGrowth += growth;
  } else {
    shrinkSnake(state, Math.abs(growth));
  }

  if (state.fxEnabled) {
    spawnParticles(state, type, state.fruit.position);
  }

  if (type === "toxic") {
    state.comboChain = Math.max(0, state.comboChain - 2);
  } else {
    state.comboChain += 1;
  }
  const speedBonus = state.speedLevel * 3;
  state.comboMultiplier = computeComboMultiplier(state, now);
  const deltaScore = Math.round((FRUIT_VALUES[type] + speedBonus) * state.comboMultiplier) || 0;
  state.score = Math.max(0, state.score + deltaScore);
  state.avoidedToxic = type === "toxic" ? 0 : state.avoidedToxic;
  state.fruitCounter += 1;
  state.speedLevel = Math.min(MAX_SPEED_LEVEL, Math.floor(state.fruitCounter / FRUITS_PER_LEVEL));
  maybeSpawnPowerUp(state, now);
  state.fruit = spawnFruit(state.gridSize, state.snake, state.powerUpPickup, now);
  return type === "golden" ? "Packet doré avalé !" : "Flux synchronisé.";
}

function activatePowerUp(state: GameRuntime, type: PowerUpType, now: number) {
  state.activePowerUps[type] = now + POWER_UP_DURATION[type];
  state.message = randomFunEvent();
  return `Power-up ${type} en ligne`;
}

function computeComboMultiplier(state: GameRuntime, now: number) {
  let multiplier = 1 + Math.floor(state.comboChain / 4);
  if (isPowerUpActive(state.activePowerUps, "speed", now)) {
    multiplier += 1;
  }
  return Math.min(MAX_COMBO_MULTIPLIER, multiplier);
}

function maybeSpawnPowerUp(state: GameRuntime, now: number) {
  if (state.powerUpPickup) return;
  const chance = 0.35 - state.speedLevel * 0.02;
  if (Math.random() < chance) {
    state.powerUpPickup = spawnPowerUp(
      state.gridSize,
      state.snake,
      state.fruit.position,
      now,
    );
  }
}

function spawnFruit(
  gridSize: number,
  occupied: Position[],
  powerUp: PowerUpPickup | null,
  now: number,
): Fruit {
  const type = randomFruitType();
  const position = randomFreePosition(gridSize, occupied, powerUp?.position);
  return {
    position,
    type,
    expiresAt: now + FRUIT_LIFETIME_MS[type],
  };
}

function spawnPowerUp(
  gridSize: number,
  occupied: Position[],
  fruitPosition: Position,
  now: number,
): PowerUpPickup {
  const types: PowerUpType[] = ["slowmo", "speed", "magnet", "ghost"];
  const type = types[Math.floor(Math.random() * types.length)];
  const position = randomFreePosition(gridSize, occupied, fruitPosition);
  return {
    position,
    type,
    expiresAt: now + 8000,
  };
}

function randomFruitType(): FruitType {
  const roll = Math.random();
  let cumulative = 0;
  for (const type of Object.keys(FRUIT_SPAWN_CHANCES) as FruitType[]) {
    cumulative += FRUIT_SPAWN_CHANCES[type];
    if (roll <= cumulative) return type;
  }
  return "normal";
}

function randomFreePosition(
  gridSize: number,
  occupied: Position[],
  forbidden?: Position,
) {
  let attempts = 0;
  while (attempts < 60) {
    const position = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };
    const taken =
      occupied.some((cell) => positionsEqual(cell, position)) ||
      (forbidden && positionsEqual(forbidden, position));
    if (!taken) return position;
    attempts += 1;
  }
  return { x: 0, y: 0 };
}

function attractFruitTowardsHead(state: GameRuntime) {
  const head = state.snake[0];
  const fruit = state.fruit;
  const distance =
    Math.abs(head.x - fruit.position.x) + Math.abs(head.y - fruit.position.y);
  if (distance > 4 || distance === 0) {
    return;
  }
  const deltaX = Math.sign(head.x - fruit.position.x);
  const deltaY = Math.sign(head.y - fruit.position.y);
  const candidate: Position = {
    x: fruit.position.x + deltaX,
    y: fruit.position.y + deltaY,
  };
  if (!hitsWall(candidate, state.gridSize)) {
    const blocked = state.snake.some((segment) => positionsEqual(segment, candidate));
    if (!blocked) {
      fruit.position = candidate;
    }
  }
}

function shrinkSnake(state: GameRuntime, amount: number) {
  for (let i = 0; i < amount; i += 1) {
    if (state.snake.length > 3) {
      state.snake.pop();
    }
  }
}

function pruneExpiredPowerUps(active: ActivePowerUps, now: number) {
  (Object.keys(active) as PowerUpType[]).forEach((key) => {
    const expiresAt = active[key];
    if (!expiresAt || expiresAt <= now) {
      delete active[key];
    }
  });
}

function isPowerUpActive(active: ActivePowerUps, type: PowerUpType, now: number) {
  const expiresAt = active[type];
  return Boolean(expiresAt && expiresAt > now);
}

function updateParticles(state: GameRuntime) {
  state.particles = state.particles
    .map((particle) => ({
      ...particle,
      life: particle.life - 1,
      position: {
        x: particle.position.x + particle.velocity.x,
        y: particle.position.y + particle.velocity.y,
      },
    }))
    .filter((particle) => particle.life > 0);
}

function spawnParticles(state: GameRuntime, type: FruitType, origin: Position) {
  const particles: Particle[] = Array.from({ length: 8 }).map(() => ({
    id: randomId(),
    position: { ...origin },
    velocity: {
      x: (Math.random() - 0.5) * 0.6,
      y: (Math.random() - 0.5) * 0.6,
    },
    life: 18 + Math.floor(Math.random() * 10),
    maxLife: 24,
    color: PARTICLE_COLORS[type],
  }));
  state.particles = [...state.particles, ...particles];
}

function drawFruit(
  ctx: CanvasRenderingContext2D,
  fruit: Fruit,
  cellSize: number,
) {
  const padding = cellSize * 0.15;
  ctx.fillStyle = FRUIT_COLORS[fruit.type];
  ctx.shadowColor = FRUIT_COLORS[fruit.type];
  ctx.shadowBlur = 18;
  drawRoundedRect(
    ctx,
    fruit.position.x * cellSize + padding,
    fruit.position.y * cellSize + padding,
    cellSize - padding * 2,
    cellSize - padding * 2,
    6,
  );
  ctx.shadowBlur = 0;
}

function drawPowerUp(
  ctx: CanvasRenderingContext2D,
  pickup: PowerUpPickup,
  cellSize: number,
) {
  const radius = (cellSize * 0.9) / 2;
  const cx = pickup.position.x * cellSize + cellSize / 2;
  const cy = pickup.position.y * cellSize + cellSize / 2;
  const color = POWER_UP_COLORS[pickup.type];
  ctx.save();
  ctx.fillStyle = `${color}88`;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#050b13";
  ctx.font = `${Math.round(cellSize * 0.35)}px monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(symbolForPowerUp(pickup.type), cx, cy);
  ctx.restore();
}

function drawSnakeCell(
  ctx: CanvasRenderingContext2D,
  position: Position,
  cellSize: number,
  color: string,
  head: boolean,
) {
  ctx.fillStyle = color;
  ctx.shadowColor = "rgba(94,234,212,0.5)";
  ctx.shadowBlur = head ? 22 : 10;
  const padding = head ? cellSize * 0.1 : cellSize * 0.18;
  drawRoundedRect(
    ctx,
    position.x * cellSize + padding,
    position.y * cellSize + padding,
    cellSize - padding * 2,
    cellSize - padding * 2,
    6,
  );
  ctx.shadowBlur = 0;
}

function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  cellSize: number,
) {
  particles.forEach((particle) => {
    ctx.fillStyle = particle.color;
    ctx.globalAlpha = particle.life / particle.maxLife;
    const size = (cellSize * 0.15 * particle.life) / particle.maxLife;
    ctx.beginPath();
    ctx.arc(
      particle.position.x * cellSize + cellSize / 2,
      particle.position.y * cellSize + cellSize / 2,
      Math.max(1, size),
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.globalAlpha = 1;
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

function symbolForPowerUp(type: PowerUpType) {
  switch (type) {
    case "slowmo":
      return "🐢";
    case "speed":
      return "⚡";
    case "magnet":
      return "🧲";
    case "ghost":
      return "🌀";
    default:
      return "?";
  }
}

function positionsEqual(a: Position, b: Position) {
  return a.x === b.x && a.y === b.y;
}

function getNextHead(head: Position, direction: Direction): Position {
  switch (direction) {
    case "up":
      return { x: head.x, y: head.y - 1 };
    case "down":
      return { x: head.x, y: head.y + 1 };
    case "left":
      return { x: head.x - 1, y: head.y };
    case "right":
    default:
      return { x: head.x + 1, y: head.y };
  }
}

function hitsWall(position: Position, gridSize: number) {
  return (
    position.x < 0 ||
    position.y < 0 ||
    position.x >= gridSize ||
    position.y >= gridSize
  );
}

function isOpposite(a: Direction, b: Direction) {
  return (
    (a === "up" && b === "down") ||
    (a === "down" && b === "up") ||
    (a === "left" && b === "right") ||
    (a === "right" && b === "left")
  );
}

function kill(state: GameRuntime, message: string): StepSnapshot {
  state.status = "over";
  state.message = message;
  return snapshot(state, message);
}

function snapshot(state: GameRuntime, eventMessage?: string): StepSnapshot {
  const message = eventMessage ?? state.message;
  state.message = undefined;
  return {
    status: state.status,
    score: state.score,
    comboMultiplier: state.comboMultiplier,
    comboChain: state.comboChain,
    avoidedToxic: state.avoidedToxic,
    speedLevel: state.speedLevel,
    fruit: state.fruit,
    powerUpPickup: state.powerUpPickup,
    activePowerUps: { ...state.activePowerUps },
    lastFruitType: state.lastFruitType,
    message,
  };
}


