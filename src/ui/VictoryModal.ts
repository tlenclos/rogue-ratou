import { Actor, Color, Scene, vec, Font, FontUnit, Text } from "excalibur";

export class VictoryModal {
  private scene: Scene;
  private isVisible = false;
  private modalElements: Actor[] = [];
  private modalBackground!: Actor;
  private restartCallback?: () => void;

  constructor(scene: Scene) {
    this.scene = scene;
    this.createModalElements();
  }

  private createModalElements(): void {
    // Semi-transparent background overlay
    this.modalBackground = new Actor({
      pos: vec(400, 300),
      width: 800,
      height: 600,
      color: Color.fromHex("#000000"),
      z: 100,
    });
    this.modalBackground.graphics.opacity = 0.8;

    // Main modal container
    const modalContainer = new Actor({
      pos: vec(400, 300),
      width: 500,
      height: 300,
      color: Color.fromHex("#2a2a2a"),
      z: 101,
    });

    // Victory title
    const titleActor = new Actor({
      pos: vec(400, 200),
      z: 102,
    });

    const titleFont = new Font({
      family: "Courier New",
      size: 36,
      unit: FontUnit.Px,
      color: Color.Yellow,
    });

    const titleText = new Text({
      text: "🎉 VICTORY! 🎉",
      font: titleFont,
    });

    titleActor.graphics.use(titleText);

    // Victory message line 1
    const message1Actor = new Actor({
      pos: vec(400, 260),
      z: 102,
    });

    const messageFont = new Font({
      family: "Courier New",
      size: 16,
      unit: FontUnit.Px,
      color: Color.White,
    });

    const message1Text = new Text({
      text: "You have mastered the roguelike platformer!",
      font: messageFont,
    });

    message1Actor.graphics.use(message1Text);

    // Victory message line 2
    const message2Actor = new Actor({
      pos: vec(400, 285),
      z: 102,
    });

    const message2Text = new Text({
      text: "Death taught you movement, jumping, and survival!",
      font: messageFont,
    });

    message2Actor.graphics.use(message2Text);

    // Restart button
    const restartButton = new Actor({
      pos: vec(400, 380),
      width: 200,
      height: 50,
      color: Color.Green,
      z: 102,
    });

    const buttonFont = new Font({
      family: "Courier New",
      size: 20,
      unit: FontUnit.Px,
      color: Color.White,
    });

    const buttonText = new Text({
      text: "🔄 Play Again",
      font: buttonFont,
    });

    restartButton.graphics.use(buttonText);

    // Button hover effects
    restartButton.on("pointerenter", () => {
      restartButton.color = Color.fromHex("#90EE90");
    });

    restartButton.on("pointerleave", () => {
      restartButton.color = Color.Green;
    });

    // Button click handler
    restartButton.on("pointerup", () => {
      this.hide();
      if (this.restartCallback) {
        this.restartCallback();
      }
    });

    restartButton.pointer.useGraphicsBounds = true;

    // Store all modal elements
    this.modalElements = [
      this.modalBackground,
      modalContainer,
      titleActor,
      message1Actor,
      message2Actor,
      restartButton,
    ];

    // Add all elements to scene
    this.modalElements.forEach((element) => {
      this.scene.add(element);
    });

    // Hide initially
    this.hide();
  }

  public show(): void {
    if (this.isVisible) return;

    this.isVisible = true;
    this.modalElements.forEach((element) => {
      element.graphics.visible = true;
    });

    console.log("🎉 Victory modal displayed!");
  }

  public hide(): void {
    if (!this.isVisible) return;

    this.isVisible = false;
    this.modalElements.forEach((element) => {
      element.graphics.visible = false;
    });
  }

  public onRestart(callback: () => void): void {
    this.restartCallback = callback;
  }

  public destroy(): void {
    this.modalElements.forEach((element) => {
      this.scene.remove(element);
    });
    this.modalElements = [];
  }
}
