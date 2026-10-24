# GameBox

GameBox is a responsive browser-game platform built with Next.js, React, TypeScript, Tailwind CSS, and a small authoritative WebSocket room server. It contains exactly six games: Tic-Tac-Toe, Connect Four, Color Clash, Trivia, Draw & Guess, and Snake Arena.

## Run locally

Requirements: Node.js 20+ and pnpm.

```sh
pnpm install
pnpm dev
```

Open <http://localhost:3000>. The custom Node server starts Next.js and the WebSocket room server together. Run `pnpm typecheck`, `pnpm test`, and `pnpm build` for checks. Use `pnpm start` after a production build.

## Games

- **Tic-Tac-Toe:** three AI difficulty levels, same-device play, and server-validated online rooms.
- **Connect Four:** gravity-based 7×6 board, AI, same-device play, and server-validated online rooms.
- **Color Clash:** an original UNO-style game with a shuffled 108-card deck, bots, private pass-and-play hands, and private multiplayer hands.
- **Trivia:** offline category and level hub, timed solo and pass-and-play quizzes, saved local progress, Random Quiz and Mixed Trivia, plus configured online trivia rooms.
- **Draw & Guess:** online rooms with drawer-only secret words, synced canvas strokes, color/brush controls, clear and undo, timed rounds, and server-scored guesses.
- **Snake Arena:** offline solo and same-device keyboard modes plus server-ticked multiplayer rooms with authoritative movement and collisions.

Each game has its own page at `/games/<game-id>` with offline and online options. Draw & Guess is online-only. The online system uses one reusable room transport, while each room is permanently bound to a game type and rejects cross-game joins.

## Online rooms

The server owns room membership, turns, scoring, game timers, card rules, question answers, drawing secrets, and snake collisions. Player-specific room views hide other Color Clash hands and keep Draw & Guess words from guessers. Room sessions can reconnect using a private local token. Rooms are stored in memory and are cleared when the server process restarts; horizontal scaling needs a shared room store and coordinated transport.

## Offline and install

The PWA manifest and service worker cache the launcher, game routes, icon, and same-origin assets as they are requested. Offline pages and solo/same-device games work after a successful online visit has cached their app assets. Multiplayer requires a network connection. Install prompts and service workers require HTTPS or localhost.

## Music

The compact player offers five original synthesized loops: GameBox Chill, Pixel Adventure, Neon Drive, Cozy Arcade, and Midnight Game. Playback starts only after a user action, and selected track and volume are stored locally.

## Architecture

- `src/app`: routes, metadata, and styling.
- `src/components`: launcher, game UIs, trivia progression, music player, and shared online room UI.
- `src/games`: central registry and bundled trivia bank.
- `src/lib/rooms.ts`: room/player transport contracts.
- `src/server/room-engine.mjs`: in-memory authoritative room rules and private player views.
- `server.mjs`: same-origin HTTP and WebSocket server.
- `public/art`: original lightweight SVG game illustrations.
- `public/music`: five original looping WAV tracks. `scripts/generate-music.py` recreates them using only Python's standard library.
- `public/sw.js` and `public/manifest.webmanifest`: installable PWA shell and offline caching.
