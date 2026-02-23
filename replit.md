# replit.md

## Overview

Sales Coin Catcher is a simple browser-based arcade game built as a 100% static site using HTML, CSS, and vanilla JavaScript. The player controls a salesperson character who moves left and right to catch falling "good" items (3C coins worth +3 points, Quotes worth +10, Banknotes worth +25) while avoiding "bad" items (Meetings, Spam, No-shows, Admin work) that cost a life. The game features progressive difficulty (speed and spawn rate increase every 20 seconds), character selection (Vinny, Charlie, Daryll), high score tracking via localStorage, and mobile support via touch controls.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Tech Stack
- **Frontend**: Pure HTML5, CSS3, and vanilla JavaScript — no frameworks, no build tools, no external libraries
- **Rendering**: HTML5 Canvas (`<canvas>` element) for game rendering using 2D context
- **Server**: Minimal Node.js HTTP server (`server.js`) used only for local development file serving on Replit. The game itself requires no server and runs as a static site.

### Project Structure
- `index.html` — Main HTML page containing the game container, UI overlays (start screen, game over screen), canvas element, and mobile controls
- `style.css` — All styling including responsive layout, overlay screens, character selection UI, and mobile control buttons
- `game.js` — All game logic including player movement, item spawning/falling, collision detection, scoring, lives, levels, and canvas rendering
- `server.js` — Simple static file server for development (serves files from the project root on port 5000)
- `package.json` — Minimal; only defines a `dev` script to run the static server

### Game Architecture
- **Game Loop**: Uses `requestAnimationFrame` for the main game loop with canvas-based rendering
- **Character System**: Three selectable characters defined as configuration objects with visual properties (suit color, tie color, skin color, hair style). Characters are drawn procedurally on canvas, not with image assets.
- **Item System**: Items fall from the top of the screen. Good items (3C coin, Quote, Banknote) award points; bad items (Meeting, Spam, No-show, Admin) cost lives. Items are drawn as simple shapes with text labels on canvas.
- **Difficulty Progression**: Every 20 seconds, falling speed and spawn rate increase, and a level indicator increments.
- **Controls**: Desktop uses arrow keys; mobile uses on-screen buttons and touch dragging.
- **State Management**: Game state (score, lives, level, active items, player position) is managed with plain JavaScript variables. High scores are persisted in `localStorage`.

### Key Design Decisions
1. **No dependencies**: The entire game uses zero external libraries or frameworks. This keeps it maximally portable — it can run by simply opening `index.html` in a browser.
2. **Canvas rendering**: All game visuals (player character, falling items, effects) are drawn procedurally on an HTML5 Canvas rather than using DOM elements or sprite images. This gives smooth animation and simple collision detection.
3. **Static file server**: The Node.js server exists only for Replit compatibility. It serves static files and has no API endpoints or backend logic.

### Important Notes
- The `index.html` file appears to be truncated — it's missing closing tags and the full mobile controls section. The game.js file also appears truncated, containing only character definitions without the full game loop, item spawning, collision detection, or rendering logic. These need to be completed.
- The `style.css` file is also truncated, missing media queries and additional styling rules.
- No database is needed. All persistence (high scores) uses browser `localStorage`.
- The game is designed to also deploy to GitHub Pages as a fully static site.

## External Dependencies

- **None**. This project intentionally has zero external dependencies — no npm packages, no CDN scripts, no external APIs, no databases.
- The only Node.js usage is the built-in `http`, `fs`, and `path` modules in `server.js` for local file serving.
- High score persistence uses the browser's built-in `localStorage` API.