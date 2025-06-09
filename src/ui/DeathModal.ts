import { Actor, Color, Font, FontUnit, Scene, Text, vec } from "excalibur";

export class DeathModal {
  private modalElements: Actor[] = [];
  private modalBackground!: Actor;
  private deathModal!: Actor;
  private nextLifeButton!: Actor;
  private skillMessage!: Actor;
  private isVisible = false;
  private scene: Scene;
  private onNextLifeCallback?: () => void;
  public unlockedSkill: string = "You can now jump with SPACE!";

  constructor(scene: Scene) {
    this.scene = scene;
    this.createModal();
  }

  private createModal(): void {
    // Create modal background (semi-transparent overlay)
    this.modalBackground = new Actor({
      pos: vec(400, 300),
      width: 800,
      height: 600,
      color: Color.fromHex("#000000"),
      z: 100, // High z-index to appear on top
    });
    this.modalBackground.graphics.opacity = 0.8;

    // Create modal container
    this.deathModal = new Actor({
      pos: vec(400, 300),
      width: 500,
      height: 300,
      color: Color.fromHex("#2a2a2a"),
      z: 101,
    });

    // Death title
    const deathTitle = new Actor({
      pos: vec(400, 200),
      z: 102,
    });

    const titleFont = new Font({
      family: "Courier New",
      size: 32,
      unit: FontUnit.Px,
      color: Color.Red,
    });

    const titleText = new Text({
      text: "YOU DIED",
      font: titleFont,
    });

    deathTitle.graphics.use(titleText);

    // Death message
    const deathMessage = new Actor({
      pos: vec(400, 260),
      z: 102,
    });

    const messageFont = new Font({
      family: "Courier New",
      size: 16,
      unit: FontUnit.Px,
      color: Color.Yellow,
    });

    const messageText = new Text({
      text: "BUT you unlocked a new skill in the after life:",
      font: messageFont,
    });

    deathMessage.graphics.use(messageText);

    // Skill unlock message
    this.skillMessage = new Actor({
      pos: vec(400, 290),
      z: 102,
    });

    const skillFont = new Font({
      family: "Courier New",
      size: 18,
      unit: FontUnit.Px,
      color: Color.Green,
    });

    const skillText = new Text({
      text: this.unlockedSkill,
      font: skillFont,
    });

    this.skillMessage.graphics.use(skillText);

    // Next life button
    this.nextLifeButton = new Actor({
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

    const buttonTextComponent = new Text({
      text: "Next Life",
      font: buttonFont,
    });

    this.nextLifeButton.graphics.use(buttonTextComponent);

    // Button hover effects
    this.nextLifeButton.on("pointerenter", () => {
      this.nextLifeButton.color = Color.fromHex("#90EE90");
    });

    this.nextLifeButton.on("pointerleave", () => {
      this.nextLifeButton.color = Color.Green;
    });

    // Button click handler
    this.nextLifeButton.on("pointerup", () => {
      if (this.isVisible) {
        this.hide();

        if (this.onNextLifeCallback) {
          this.onNextLifeCallback();
        }
      }
    });

    this.nextLifeButton.pointer.useGraphicsBounds = true;

    // Store references to modal elements for show/hide
    this.modalElements = [
      this.modalBackground,
      this.deathModal,
      deathTitle,
      deathMessage,
      this.skillMessage,
      this.nextLifeButton,
    ];

    // Add all modal elements to scene but hide them initially
    this.modalElements.forEach((element) => {
      this.scene.add(element);
    });

    this.hide();
  }

  private updateSkillText(): void {
    const skillFont = new Font({
      family: "Courier New",
      size: 18,
      unit: FontUnit.Px,
      color: Color.Green,
    });

    const skillText = new Text({
      text: this.unlockedSkill,
      font: skillFont,
    });

    this.skillMessage.graphics.use(skillText);
  }

  public show(): void {
    this.isVisible = true;
    this.updateSkillText(); // Update the skill text before showing
    this.modalElements.forEach((element) => {
      element.graphics.visible = true;
    });
  }

  public hide(): void {
    this.isVisible = false;
    this.modalElements.forEach((element) => {
      element.graphics.visible = false;
    });
  }

  public onNextLife(callback: () => void): void {
    this.onNextLifeCallback = callback;
  }

  public destroy(): void {
    this.modalElements.forEach((element) => {
      this.scene.remove(element);
    });
    this.modalElements = [];
  }

  public get visible(): boolean {
    return this.isVisible;
  }
}
