import {
  DefaultLoader,
  Engine,
  ExcaliburGraphicsContext,
  Scene,
  SceneActivationContext,
  Actor,
  Color,
  vec,
  CollisionType,
} from "excalibur";
import { Player } from "./player";
import { DeathModal } from "./ui/DeathModal";
import { VictoryModal } from "./ui/VictoryModal";
import { PlatformManager } from "./game/PlatformManager";
import { PlayerController } from "./game/PlayerController";
import { LEVEL_CONFIGS, GAME_CONSTANTS } from "./game/LevelConfig";

export class MyLevel extends Scene {
  private currentLevel = 1;
  private playerRect!: Actor;
  private fallingRock!: Actor;
  private levelText!: Actor;
  private deathModal!: DeathModal;
  private victoryModal!: VictoryModal;
  private platformManager!: PlatformManager;
  private playerController!: PlayerController;
  private arrowTimeout?: number;
  private arrowWaveTimeouts: number[] = [];
  private victoryPortal!: Actor;
  private hasWon = false;

  override onInitialize(engine: Engine): void {
    // Scene.onInitialize is where we recommend you perform the composition for your game
    const player = new Player();
    this.add(player); // Actors need to be added to a scene to be drawn

    // Create a simple player rectangle
    this.playerRect = new Actor({
      pos: vec(
        GAME_CONSTANTS.PLAYER_START_POSITION.x,
        GAME_CONSTANTS.PLAYER_START_POSITION.y
      ),
      width: 32,
      height: 32,
      color: Color.Green,
      collisionType: CollisionType.Active,
    });

    // Create level text
    this.levelText = new Actor({
      pos: vec(400, 50),
      width: 200,
      height: 30,
      color: Color.Transparent,
    });

    // Initialize managers
    this.platformManager = new PlatformManager(this);

    this.add(this.playerRect);
    this.createDeathModal();
    this.setupLevel();
  }

  private createDeathModal(): void {
    this.deathModal = new DeathModal(this);

    // Set up callback for when "Next Life" is clicked
    this.deathModal.onNextLife(() => {
      if (this.currentLevel < 3) {
        this.currentLevel++;
      }

      this.setupLevel();
    });
  }

  private createVictoryModal(): void {
    this.victoryModal = new VictoryModal(this);

    // Set up callback for when "Play Again" is clicked
    this.victoryModal.onRestart(() => {
      console.log("🔄 Restarting game from Level 1!");
      this.currentLevel = 1;
      this.setupLevel();
    });
  }

  private clearTimeouts(): void {
    if (this.arrowTimeout) {
      clearTimeout(this.arrowTimeout);
      this.arrowTimeout = undefined;
    }

    // Clear all arrow wave timeouts
    this.arrowWaveTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    this.arrowWaveTimeouts = [];
  }

  private createArrow(): void {
    console.log("Creating arrow");

    // Create multiple waves of arrows at different heights
    this.createArrowWave(0); // First wave immediately

    // Additional waves with delays - store timeout IDs
    this.arrowWaveTimeouts.push(
      window.setTimeout(() => this.createArrowWave(1), 1500),
      window.setTimeout(() => this.createArrowWave(2), 3000),
      window.setTimeout(() => this.createArrowWave(3), 4500)
    );
  }

  private createArrowWave(waveIndex: number): void {
    // Safety check: only create arrows if we're still in level 2 or 3
    if (this.currentLevel < 2) {
      return;
    }

    const arrowHeights = [
      GAME_CONSTANTS.PLAYER_START_POSITION.y, // Ground level (520)
      400, // First platform level
      350, // Slightly above first platform
      320, // Near second platform level
    ];

    const arrowY =
      arrowHeights[waveIndex] || GAME_CONSTANTS.PLAYER_START_POSITION.y;

    // Create arrow from the left
    const leftArrow = new Actor({
      pos: vec(-50, arrowY),
      width: 30,
      height: 8,
      color: Color.Yellow,
      collisionType: CollisionType.Active,
    });
    leftArrow.vel.x = 150;

    // Create arrow from the right
    const rightArrow = new Actor({
      pos: vec(850, arrowY),
      width: 30,
      height: 8,
      color: Color.Yellow,
      collisionType: CollisionType.Active,
    });
    rightArrow.vel.x = -150;

    // Handle collisions for both arrows
    this.playerRect.on("precollision", (evt) => {
      if (evt.other.owner === leftArrow || evt.other.owner === rightArrow) {
        console.log("Player hit by arrow!");
        this.playerDeath();
      }
    });

    // Add arrows to scene
    this.add(leftArrow);
    this.add(rightArrow);

    console.log(`Arrow wave ${waveIndex + 1} launched at height ${arrowY}!`);
  }

  private createFallingRock(): void {
    // Create falling rock - consistent across all levels
    this.fallingRock = new Actor({
      pos: vec(400, -50), // Always starts centered above screen
      width: 40,
      height: 40,
      color: Color.Red,
      collisionType: CollisionType.Active, // Change back to Active so it has proper physics
    });

    // Rock falls down - consistent speed across all levels
    this.fallingRock.vel.y = 200;

    // Store rock's intended velocity to prevent player from affecting it
    let rockIntendedVel = vec(0, 200);

    // Prevent player from pushing the rock
    this.fallingRock.on("precollision", (evt) => {
      if (evt.other.owner === this.playerRect) {
        // Store current velocity before collision
        rockIntendedVel = this.fallingRock.vel.clone();
      }
    });

    this.fallingRock.on("postcollision", (evt) => {
      if (evt.other.owner === this.playerRect) {
        // Restore rock's velocity - player can't push it
        this.fallingRock.vel = rockIntendedVel;
      }
    });

    // Stop rock when it hits the ground or platforms
    this.fallingRock.on("postcollision", (evt) => {
      // Check if rock hit something from above (landing on ground/platform)
      if (evt.contact.normal.y < -0.5) {
        console.log("Rock hit ground, stopping movement");
        // Stop the rock's movement
        this.fallingRock.vel.y = 0;
        this.fallingRock.acc.y = 0;
        // Update intended velocity so rock stays stopped
        rockIntendedVel = vec(0, 0);
      }
    });

    // Launch arrows after rock has fallen
    if (this.currentLevel >= 2 && !this.arrowTimeout) {
      this.arrowTimeout = window.setTimeout(() => {
        // Check if we're still in the same level before creating arrows
        if (this.currentLevel >= 2) {
          this.createArrow();
        }
      }, GAME_CONSTANTS.ARROW_DELAY_MS);
    }

    // Handle collision between player and rock - only die if rock falls on player from above
    this.playerRect.on("precollision", (evt) => {
      if (evt.other.owner === this.fallingRock) {
        // Check if rock is falling on player from above
        const rockY = this.fallingRock.pos.y;
        const playerY = this.playerRect.pos.y;
        const rockIsAbove = rockY < playerY - 10; // Rock must be above player
        const rockIsFalling = this.fallingRock.vel.y > 0; // Rock must be moving downward

        if (rockIsAbove && rockIsFalling) {
          this.playerDeath();
        }
      }
    });

    // Add rock to scene
    this.add(this.fallingRock);
  }

  private setupLevel(): void {
    // Reset victory state for new level
    this.hasWon = false;

    // Clear any pending arrow timeout to prevent arrows from previous level
    this.clearTimeouts();

    // Clear any existing actors except player, text, and modal elements
    this.actors.forEach((actor) => {
      if (
        actor !== this.playerRect &&
        actor !== this.levelText &&
        actor.z < 100
      ) {
        // Don't remove modal elements
        this.remove(actor);
      }
    });

    // Get level configuration
    const levelConfig = LEVEL_CONFIGS[this.currentLevel];

    // Display console message
    console.log(levelConfig.consoleMessage);

    // Reset player position and properties
    this.playerRect.pos = vec(
      GAME_CONSTANTS.PLAYER_START_POSITION.x,
      GAME_CONSTANTS.PLAYER_START_POSITION.y
    );
    this.playerRect.vel = vec(0, 0);
    this.playerRect.acc = vec(0, 800); // Add gravity
    this.playerRect.color = levelConfig.playerColor;

    // Set up player controller with appropriate abilities
    this.playerController = new PlayerController(
      this.playerRect,
      levelConfig.playerAbility
    );
    this.playerController.setupPlayerControls();

    // Create platforms (same for all levels)
    this.platformManager.createStandardPlatforms();

    // Create falling rock (same for all levels)
    this.createFallingRock();

    // Create victory portal in top right corner
    this.createVictoryPortal();
  }

  private createVictoryPortal(): void {
    // Create blue portal in top right corner
    this.victoryPortal = new Actor({
      pos: vec(750, 140), // Top right corner
      width: 60,
      height: 80,
      color: Color.Blue,
      collisionType: CollisionType.Passive, // Use Passive so it doesn't affect physics
    });

    // Add collision detection for victory
    this.playerRect.on("precollision", (evt) => {
      if (evt.other.owner === this.victoryPortal) {
        this.gameVictory();
      }
    });

    // Add portal to scene
    this.add(this.victoryPortal);
  }

  private gameVictory(): void {
    // Prevent multiple victory triggers
    if (this.hasWon) {
      return;
    }

    console.log("🎉 VICTORY! You have mastered the roguelike platformer!");

    // Mark that player has won
    this.hasWon = true;

    // Clear all timeouts
    this.clearTimeouts();

    // Stop player movement
    this.playerRect.vel = vec(0, 0);
    this.playerRect.acc = vec(0, 0);

    // Change player color to indicate victory
    this.playerRect.color = Color.Yellow;

    // Create and show victory modal only when winning
    this.createVictoryModal();
    this.victoryModal.show();
  }

  private playerDeath(): void {
    console.log("💀 You died! But you learned something...");

    // Clear any pending arrow timeout when player dies
    this.clearTimeouts();

    // Flash player red briefly
    this.playerRect.color = Color.Red;

    // Set unlock message based on current level
    const levelConfig = LEVEL_CONFIGS[this.currentLevel];
    this.deathModal.unlockedSkill = levelConfig.deathMessage;

    // Show death modal
    this.deathModal.show();
  }

  override onPreLoad(loader: DefaultLoader): void {
    // Add any scene specific resources to load
  }

  override onActivate(context: SceneActivationContext<unknown>): void {
    // Called when Excalibur transitions to this scene
  }

  override onDeactivate(context: SceneActivationContext): void {
    // Called when Excalibur transitions away from this scene
    // Clear any pending timeouts when leaving the scene
    this.clearTimeouts();
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    // Called before anything updates in the scene
  }

  override onPostUpdate(engine: Engine, elapsedMs: number): void {
    // Called after everything updates in the scene
  }

  override onPreDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
    // Called before Excalibur draws to the screen
  }

  override onPostDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
    // Called after Excalibur draws to the screen
  }
}
