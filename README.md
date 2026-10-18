# Sanctum — 3D Wizard's Chess

**A playable 3D chess duel inside a Gothic cathedral.** Marble and obsidian pieces stand on a monumental stone altar. Captures shatter into shards. Profiles, ELO, and sanctuary orders persist in the browser.

The client lives in [`wizards-chess-3d/`](./wizards-chess-3d).

[![Three.js](https://img.shields.io/badge/Three.js-0.160-000000?logo=threedotjs&logoColor=white)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![chess.js](https://img.shields.io/badge/chess.js-legal%20moves-2E8B57)](https://github.com/jhlywa/chess.js)
[![Tone.js](https://img.shields.io/badge/Tone.js-synthesized%20audio-FF6B35)](https://tonejs.github.io/)

---

## Why Sanctum

Standard 2D chess UIs hide the ritual of the board. Sanctum treats every match as a **cathedral rite**: a recessed mortar bed of 64 chiseled tiles, bronze trim, crypt dais tiers, corner bastion turrets, and braziers that flicker while you think. Rules stay orthodox FIDE chess. Presentation is wizard warfare.

---

## Features

### The cathedral & altar
- **Gothic nave** with perimeter columns, crypt floor, atmospheric fog, and a backlit rose window.
- **Multi-tiered stone altar**: curb frame, bronze molding, three stepped dais tiers, and a recessed mortar bed under the squares.
- **64 beveled tiles** with marble-light and obsidian-dark materials; legal squares glow green, captures glow crimson, the selected piece glows gold.
- **Corner bastions** with bronze bowls, cone flames, and animated point lights.

### Sculpted pieces
- Procedural **Marble (White)** vs **Obsidian (Black)** meshes — pedestal, trim ring, body, and type-specific crown (pawn sphere, rook battlement, knight cone, bishop octahedron, queen torus knot, king faceted jewel).
- Idle **crown rotation** so the board feels alive between moves.
- On capture, the fallen piece **explodes into 34 dodecahedral shards** with gravity, bounce, and spin (`ShatterPhysics`).

### Rules & opponents
- **Legal-move engine** via `chess.js`: checks, checkmate, draws, promotions (default queen), undo.
- **AI Adept** — 2-ply material evaluation with center bonuses (`d4`/`d5`/`e4`/`e5`) and light noise so games are not identical.
- **AI Novice** — random legal play with a bias toward captures.
- **2P Pass** — hot-seat on one machine; Grand Hall rooms force this mode locally.

### Competitive layer
- **Wizard Registry** — name (24 chars), one of four sanctuary orders, persistent ELO / wins / games / pieces shattered.
- **Online Grand Hall** — host a table (6-character code) or challenge listed rooms. Rooms persist in `localStorage` (seeded tables plus your hosted codes).
- **Hall of Champions** — local leaderboard mixing your profile with legendary NPC grandmasters.
- Outcome math: **+24 ELO** on a White checkmate win, **−16** on a loss, floor **800**.

### HUD & presentation
- Dual **player cards** (crest, name, faction, ELO, clock face) with an **active-turn gold border**.
- Center **status pill** (turn, check, checkmate) and a **move ticker** of the last eight SAN plies.
- Single-level **Material Design 3 dock**: New Duel, Undo, camera cycle, mode, Registry, Grand Hall, Champions, audio mute.
- Glassmorphism HUD, Cinzel display type, Plus Jakarta Sans UI, JetBrains Mono clocks, cinematic vignette.

### Audio
Synthesized in the browser with **Tone.js** (no sample packs):
| Cue | Sound |
|---|---|
| Select | High chime (`C5`) |
| Quiet move | Brown-noise stone slide + low membrane impact |
| Capture / shatter | Deep hit + metallic shatter |
| Check | Open triad (`E4`–`B4`–`E5`) |

Audio starts after the first user gesture (browser autoplay policy).

### Camera
Orbit (damped), then cycle **White / Black / Top**. Polar angle is clamped so you cannot clip through the crypt floor. Distance range: 5–18 units.

---

## Sanctuary orders

Pledge in the Registry. Order changes your crest icon and faction line on the Marble card.

| Order | Crest | Character |
|---|---|---|
| **Order of Marble** | Shield | Ivory & gold defenders |
| **Obsidian Cabal** | Skull | Volcanic stone & flame |
| **Astral Sanctum** | Spark | Celestial tacticians |
| **Golden Griffin** | Flame | Grand cathedral vanguard |

---

## How to play

1. Click a piece you control. Legal destinations highlight.
2. Click a destination to move. Captures trigger shatter VFX and shatter audio.
3. Against AI, Obsidian replies after a short delay. In 2P / room mode, both sides play from the same machine.
4. **Undo** rewinds one ply in 2P, or your move plus the AI reply in AI modes.
5. **New Duel** resets the board without wiping your registry stats.

Check and checkmate are announced in the status pill. Checkmate records a match on your profile.

---

## Quick start

Requires **Node.js 18+**.

```bash
git clone https://github.com/tahanawab4848/Chess.git
cd Chess/wizards-chess-3d
npm install
npm run dev
```

Vite opens **http://localhost:3000**.

| Script | Purpose |
|---|---|
| `npm run dev` | Local server, port **3000**, auto-open |
| `npm run build` | Production bundle to `wizards-chess-3d/dist` (`base: './'` for static hosts) |
| `npm run preview` | Serve the production build |

Deploy `dist/` to GitHub Pages, Vercel, or Netlify. Relative `base` keeps assets working on project pages.

---

## Tech stack

| Layer | Library | Role |
|---|---|---|
| Bundler | **Vite 5** | ES modules, HMR, production build |
| 3D | **Three.js 0.160** | Scene, lights, shadows, OrbitControls, raycasting |
| Rules | **chess.js** | FEN, legal moves, SAN history, game-over flags |
| Audio | **Tone.js** | Noise / membrane / metal / poly synths |
| Persistence | **localStorage** | Profile, rooms, shatter counts (`SanctuaryService`) |
| UI | Custom MD3 | Glass HUD, Cinzel + Jakarta + JetBrains Mono, Material Symbols |

Firebase is **not required** to play. The sanctuary service is structured so a realtime backend can replace the storage keys later.

**Storage keys**
- `sanctum_wizard_profile_v1` — name, order, icon, elo, wins, games, shatters
- `sanctum_active_rooms_v1` — hosted tables (capped at 10)

---

## Architecture

```text
Chess/
├── README.md
└── wizards-chess-3d/
    ├── index.html              # HUD, dock, registry / hall / champions modals
    ├── package.json
    ├── vite.config.js          # port 3000, relative base, sourcemaps
    └── src/
        ├── main.js             # App loop, click → move → AI → VFX
        ├── styles/main.css
        ├── audio/SoundEngine.js
        ├── game/
        │   ├── ChessController.js   # chess.js wrapper + capture lists
        │   └── AIController.js      # novice / adept / 2p
        ├── services/SanctuaryService.js
        ├── ui/UIManager.js
        └── world/
            ├── SceneManager.js      # camera, raycast, board sync, presets
            ├── CathedralBuilder.js
            ├── AltarBoardBuilder.js
            ├── PieceFactory.js
            └── ShatterPhysics.js
```

**Flow:** `SceneManager` raycasts tiles → `WizardsChessApp.handleSquareClick` → `ChessController.makeMove` → shatter + audio → `syncBoard` from `chess.board()` → optional `AIController.chooseMove`.

---

## Controls (dock)

| Control | Action |
|---|---|
| **New Duel** | Reset position and highlights |
| **Undo** | Take back last ply (and AI reply in AI modes) |
| **Orbit / White / Black / Top** | Camera presets |
| **AI Adept → AI Novice → 2P Pass** | Opponent mode |
| **Registry** | Name, order, career stats |
| **Grand Hall** | Host or challenge a table |
| **Champions** | ELO ranking |
| **Audio** | Mute synthesized cathedral FX |

Drag on the canvas to orbit. Scroll to zoom.

---

## Roadmap notes

What is solid today: legal 3D chess, AI, shatter VFX, local profiles, lobby UI.

What the Grand Hall does **not** do yet: live networked clocks, remote move sync, or Firebase matchmaking. Room codes currently tag a local 2P duel and persist the table list on this machine.

---

## License & credits

Source in this repository. Built with [Three.js](https://threejs.org/), [chess.js](https://github.com/jhlywa/chess.js), [Tone.js](https://tonejs.github.io/), and [Vite](https://vitejs.dev/). Fonts: **Cinzel**, **Plus Jakarta Sans**, **JetBrains Mono**, and **Material Symbols Rounded**.
