# Campus Quest 3D

Campus Quest 3D is a polished, lightweight browser game where players build a custom student avatar and complete campus career missions in an interactive low-poly 3D world.

## Features

- Full Three.js campus world: dorms, library, career center, student union, tech lab, internship fair, park, sidewalks
- Third-person movement with WASD / arrow controls and smooth follow camera
- Collision handling for buildings and world boundaries
- Mission progression system with six structured tasks
- Career Points scoring and dynamic energy bar
- Pet companion system (cat/dog) with follow behavior, idle animation, and name labels
- Modern UI overlay: HUD, mission tracker, pause menu, settings panel, leaderboard
- Character creator with live 3D preview and persistent localStorage profile saves
- Browser-only architecture with no backend required

## Tech Stack

- React
- Vite
- JavaScript
- Three.js
- LocalStorage API
- GitHub Pages (`gh-pages`)

## Screenshots

Add screenshots here:

- `docs/screenshots/character-creator.png`
- `docs/screenshots/campus-gameplay.png`
- `docs/screenshots/mission-hud.png`

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build and Deploy to GitHub Pages

This project is preconfigured with:

- `vite.config.js` base path: `/campus-quest-3d/`
- Deploy scripts in `package.json`

Commands:

```bash
npm run build
npm run deploy
```

Ensure your GitHub repository name is `campus-quest-3d` for the base path to match.

## Portfolio Description

Campus Quest 3D demonstrates 3D gameplay engineering for the web: custom procedural character creation, camera and movement systems, collision logic, mission progression, and persistence architecture in a production-style React + Three.js application.

## Resume Bullet

Developed and deployed Campus Quest 3D, an interactive Three.js browser game featuring character customization, pet companions, third-person movement, collision detection, mission progression, and persistent localStorage saves.
