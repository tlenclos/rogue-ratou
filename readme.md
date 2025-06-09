# Rogue Ratou - Roguelike Platformer

A roguelike platformer game built with TypeScript and Excalibur.js.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

## Controls

- **Arrow Keys** or **WASD**: Move left/right
- **Space** or **Up Arrow**: Jump

## Project Structure

- `src/main.ts` - Game engine initialization and configuration
- `src/level.ts` - Main game scene with basic platformer mechanics
- `src/resources.ts` - Asset loading and resource management
- `src/style.css` - Game styling
- `.cursor/rules` - Cursor AI coding conventions for this project

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run serve` - Preview production build
- `npm run test` - Run integration tests

## Next Steps

Following the Cursor rules in `.cursor/rules`, you can:

1. Create proper Actor classes in `src/actors/` (Player, Enemy, etc.)
2. Add sprite assets and update `resources.ts`
3. Implement procedural level generation
4. Add game states (menu, game over)
5. Implement inventory and RPG mechanics
