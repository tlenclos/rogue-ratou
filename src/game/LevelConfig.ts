import { Color } from "excalibur";
import { PlayerAbility } from "./PlayerController";

export interface LevelConfiguration {
  playerColor: Color;
  playerAbility: PlayerAbility;
  consoleMessage: string;
  deathMessage: string;
}

export const LEVEL_CONFIGS: Record<number, LevelConfiguration> = {
  1: {
    playerColor: Color.Green,
    playerAbility: PlayerAbility.NONE,
    consoleMessage:
      "🎮 Level 1: You can't move! A rock will fall and kill you.",
    deathMessage: "You can now move with ARROW KEYS!",
  },
  2: {
    playerColor: Color.Blue,
    playerAbility: PlayerAbility.MOVEMENT,
    consoleMessage:
      "🎮 Level 2: You can move! Avoid the falling rock and the arrow!",
    deathMessage: "You can now jump with SPACE!",
  },
  3: {
    playerColor: Color.Purple,
    playerAbility: PlayerAbility.MOVEMENT_AND_JUMP,
    consoleMessage:
      "🎮 Level 3: You can move AND jump! Master all the obstacles!",
    deathMessage: "You have mastered all abilities!",
  },
};

export const GAME_CONSTANTS = {
  PLAYER_START_POSITION: { x: 400, y: 520 },
  SCREEN_WIDTH: 800,
  SCREEN_HEIGHT: 600,
  ARROW_DELAY_MS: 1000,
};
