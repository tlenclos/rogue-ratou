import { Actor, Color, vec, CollisionType, Scene } from "excalibur";

export class PlatformManager {
  private scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  public createStandardPlatforms(): void {
    // Create ground platform
    const ground = new Actor({
      pos: vec(400, 570),
      width: 800,
      height: 60,
      color: Color.Gray,
      collisionType: CollisionType.Fixed,
    });

    // Create left platform
    const platform1 = new Actor({
      pos: vec(200, 400),
      width: 200,
      height: 20,
      color: Color.Brown,
      collisionType: CollisionType.Fixed,
    });

    // Create right platform
    const platform2 = new Actor({
      pos: vec(580, 300),
      width: 200,
      height: 20,
      color: Color.Brown,
      collisionType: CollisionType.Fixed,
    });

    // Add platforms to scene
    this.scene.add(ground);
    this.scene.add(platform1);
    this.scene.add(platform2);
  }
}
