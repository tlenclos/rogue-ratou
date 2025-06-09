import {
  Actor,
  Color,
  Engine,
  Font,
  FontUnit,
  Scene,
  Text,
  vec,
} from "excalibur";
import { Resources } from "./resources";

export class MenuScene extends Scene {
  private playButton!: Actor;
  private titleText!: Actor;

  override onInitialize(engine: Engine): void {
    // Create dark background
    const background = new Actor({
      pos: vec(400, 300),
      width: 800,
      height: 600,
      color: Color.fromHex("#1a1a1a"),
    });
    this.add(background);

    // Create title text
    this.titleText = new Actor({
      pos: vec(400, 150),
    });

    const titleFont = new Font({
      family: "Courier New",
      size: 48,
      unit: FontUnit.Px,
      color: Color.White,
    });

    const titleTextComponent = new Text({
      text: "ROGUE RATOU",
      font: titleFont,
    });

    this.titleText.graphics.use(titleTextComponent);
    this.add(this.titleText);

    // Create subtitle
    const subtitleActor = new Actor({
      pos: vec(400, 220),
    });

    const subtitleFont = new Font({
      family: "Courier New",
      size: 24,
      unit: FontUnit.Px,
      color: Color.Gray,
    });

    const subtitleText = new Text({
      text: "A Roguelike Platformer",
      font: subtitleFont,
    });

    subtitleActor.graphics.use(subtitleText);
    this.add(subtitleActor);

    // Create instructions
    const instructionsActor = new Actor({
      pos: vec(400, 280),
    });

    const instructionsFont = new Font({
      family: "Courier New",
      size: 16,
      unit: FontUnit.Px,
      color: Color.Yellow,
    });

    const instructionsText = new Text({
      text: "Learn through death. Each death unlocks new abilities.",
      font: instructionsFont,
    });

    instructionsActor.graphics.use(instructionsText);
    this.add(instructionsActor);

    // Create ratou character image (positioned with more space before play button)
    const ratouActor = new Actor({
      pos: vec(280, 400),
      width: 64,
      height: 64,
    });

    // Use the ratou animated GIF from resources
    const ratouAnimation = Resources.Ratou.toAnimation();
    if (ratouAnimation) {
      ratouActor.graphics.use(ratouAnimation);
    }

    this.add(ratouActor);

    // Create play button
    this.playButton = new Actor({
      pos: vec(400, 400),
      width: 200,
      height: 60,
      color: Color.Green,
    });

    // Add button text
    const buttonFont = new Font({
      family: "Courier New",
      size: 24,
      unit: FontUnit.Px,
      color: Color.White,
    });

    const buttonText = new Text({
      text: "PLAY",
      font: buttonFont,
    });

    this.playButton.graphics.use(buttonText);

    // Add hover effect
    this.playButton.on("pointerenter", () => {
      this.playButton.color = Color.fromHex("#90EE90");
    });

    this.playButton.on("pointerleave", () => {
      this.playButton.color = Color.Green;
    });

    // Handle button click
    this.playButton.on("pointerup", () => {
      console.log("🎮 Starting game...");
      engine.goToScene("game");
    });

    // Enable pointer events for the button
    this.playButton.pointer.useGraphicsBounds = true;

    this.add(this.playButton);

    // Add controls instructions at bottom
    const controlsActor = new Actor({
      pos: vec(400, 520),
    });

    const controlsFont = new Font({
      family: "Courier New",
      size: 14,
      unit: FontUnit.Px,
      color: Color.Gray,
    });

    const controlsText = new Text({
      text: "Controls: Arrow Keys/WASD to move, Space to jump",
      font: controlsFont,
    });

    controlsActor.graphics.use(controlsText);
    this.add(controlsActor);
  }
}
