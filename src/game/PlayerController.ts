import { Actor, Engine, Keys, vec } from "excalibur";

export enum PlayerAbility {
  NONE = "none",
  MOVEMENT = "movement",
  MOVEMENT_AND_JUMP = "movement_and_jump",
}

export class PlayerController {
  private player: Actor;
  private abilities: PlayerAbility;
  private jumpsRemaining: number = 2;
  private maxJumps: number = 2;
  private jumpForce: number = -300;
  private speed: number = 150;

  constructor(player: Actor, abilities: PlayerAbility) {
    this.player = player;
    this.abilities = abilities;
  }

  public setupPlayerControls(): void {
    switch (this.abilities) {
      case PlayerAbility.NONE:
        this.setupNoMovement();
        break;
      case PlayerAbility.MOVEMENT:
        this.setupMovementOnly();
        break;
      case PlayerAbility.MOVEMENT_AND_JUMP:
        this.setupMovementAndJump();
        break;
    }
  }

  private setupNoMovement(): void {
    this.player.onPreUpdate = () => {
      // Player is frozen - no movement allowed
      this.player.vel.x = 0;
    };
  }

  private setupMovementOnly(): void {
    this.player.onPreUpdate = (engine: Engine) => {
      this.handleHorizontalMovement(engine);
      this.handleBoundaryChecking();
    };
  }

  private setupMovementAndJump(): void {
    // Enable collision events for jump reset
    this.player.on("postcollision", (evt) => {
      if (evt.contact.normal.y <= 1) {
        this.jumpsRemaining = this.maxJumps;
      }
    });

    this.player.onPreUpdate = (engine: Engine) => {
      this.handleHorizontalMovement(engine);
      this.handleJumping(engine);
      this.handleBoundaryChecking();
    };
  }

  private handleHorizontalMovement(engine: Engine): void {
    // Horizontal movement
    if (
      engine.input.keyboard.isHeld(Keys.ArrowLeft) ||
      engine.input.keyboard.isHeld(Keys.KeyA)
    ) {
      this.player.vel.x = -this.speed;
    } else if (
      engine.input.keyboard.isHeld(Keys.ArrowRight) ||
      engine.input.keyboard.isHeld(Keys.KeyD)
    ) {
      this.player.vel.x = this.speed;
    } else {
      this.player.vel.x = 0;
    }
  }

  private handleJumping(engine: Engine): void {
    // Double jump logic
    if (
      (engine.input.keyboard.wasPressed(Keys.Space) ||
        engine.input.keyboard.wasPressed(Keys.ArrowUp)) &&
      this.jumpsRemaining > 0
    ) {
      this.player.vel.y = this.jumpForce;
      this.jumpsRemaining--;
    }
  }

  private handleBoundaryChecking(): void {
    const screenWidth = 800;
    const screenHeight = 600;
    const playerHalfWidth = this.player.width / 2;
    const playerHalfHeight = this.player.height / 2;

    // Left boundary
    if (this.player.pos.x - playerHalfWidth < 0) {
      this.player.pos.x = playerHalfWidth;
      this.player.vel.x = 0;
    }
    // Right boundary
    if (this.player.pos.x + playerHalfWidth > screenWidth) {
      this.player.pos.x = screenWidth - playerHalfWidth;
      this.player.vel.x = 0;
    }
    // Top boundary
    if (this.player.pos.y - playerHalfHeight < 0) {
      this.player.pos.y = playerHalfHeight;
      this.player.vel.y = 0;
    }
    // Bottom boundary
    if (this.player.pos.y + playerHalfHeight > screenHeight) {
      this.player.pos.y = screenHeight - playerHalfHeight;
      this.player.vel.y = 0;
      this.jumpsRemaining = this.maxJumps;
    }
  }
}
