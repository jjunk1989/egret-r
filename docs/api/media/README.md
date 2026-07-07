# Egret Engine R — Vite Game Template

## Quick Start

```bash
# Copy this template
cp -r templates/vite-game my-game
cd my-game

# Install dependencies
npm install

# Link local packages (development)
npm link ../../packages/core ../../packages/eui ../../packages/game ../../packages/tween

# Start dev server
npm run dev
```

## Project Structure

```
my-game/
├── index.html          # Entry HTML
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
├── package.json
└── src/
    └── main.ts         # Game entry point
```

## Usage with Published Packages

```bash
npm install @egret-r/core @egret-r/eui @egret-r/game @egret-r/tween
```

Then add `@egret-r/*` to your `vite.config.ts` optimizeDeps if needed.

## Building for Production

```bash
npm run build
```

Output will be in `dist/`.