import { ImageSource, DefaultLoader, Gif } from "excalibur";

// It is convenient to put your resources in one place
export const Resources = {
  // Add your game images here as you create them
  // Sword: new ImageSource("./images/sword.png") // Vite public/ directory serves the root images
  Ratou: new Gif("./images/ratou.gif"), // Animated GIF using Gif class
} as const; // the 'as const' is a neat typescript trick to get strong typing on your resources.
// So when you type Resources.Ratou -> Gif

// We build a loader and add all of our resources to the boot loader
// You can build your own loader by extending DefaultLoader
export const loader = new DefaultLoader();

// Add resources when you have them
for (const res of Object.values(Resources)) {
  loader.addResource(res);
}
