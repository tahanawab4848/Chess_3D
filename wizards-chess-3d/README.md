# ♟️ Sanctum — 3D Wizard's Chess

A playable **3D Wizard's Chess** web application set inside a Gothic Cathedral sanctuary, built with **Three.js**, **chess.js**, **Tone.js**, and **Material Design 3**.

## ✨ Features
- **Monumental Gothic Stone Chess Altar**: Multi-tiered crypt steps, recessed mortar bed, 64 chiseled stone tiles, corner bastion turrets, and flickering fire braziers.
- **Marble vs. Obsidian Sculpted Pieces**: Custom 3D procedural geometries with rotating crowns and polyhedral shatter physics on capture.
- **Competitive Platform**:
  - **Wizard Registry**: Customize Wizard Name, pledge to one of 4 Sanctuary Orders, and track persistent ELO, wins, and shattered piece counts.
  - **Online Grand Hall**: Host or join challenge rooms via room codes.
  - **Hall of Champions**: Global ELO leaderboard.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production (GitHub Pages / Vercel / Netlify)
npm run build
```

The Vite dev server launches at `http://localhost:3000`.

## 📁 Project Structure

```text
wizards-chess-3d/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.js
    ├── styles/
    │   └── main.css
    ├── audio/
    │   └── SoundEngine.js
    ├── game/
    │   ├── ChessController.js
    │   └── AIController.js
    ├── services/
    │   └── SanctuaryService.js
    ├── ui/
    │   └── UIManager.js
    └── world/
        ├── SceneManager.js
        ├── CathedralBuilder.js
        ├── AltarBoardBuilder.js
        ├── PieceFactory.js
        └── ShatterPhysics.js
```

## ☁️ Upload & Deploy to GitHub

```bash
git init
git add .
git commit -m "feat: initial modular release of Sanctum 3D Wizard's Chess"
git branch -M main
git remote add origin https://github.com/<your-username>/wizards-chess-3d.git
git push -u origin main
```

Profiles, ELO, and lobby rooms persist in **localStorage** (Firebase-ready service layer).
