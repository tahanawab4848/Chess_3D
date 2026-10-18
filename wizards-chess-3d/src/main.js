import * as THREE from 'three';
import { ChessController } from './game/ChessController.js';
import { AIController } from './game/AIController.js';
import { SoundEngine } from './audio/SoundEngine.js';
import { SanctuaryService } from './services/SanctuaryService.js';
import { SceneManager } from './world/SceneManager.js';
import { UIManager } from './ui/UIManager.js';

class WizardsChessApp {
  constructor() {
    this.chess = new ChessController();
    this.ai = new AIController('adept');
    this.sound = new SoundEngine();
    this.sanctuary = new SanctuaryService();
    this.selectedSquare = null;

    this.sceneManager = new SceneManager(
      document.getElementById('canvas-container'),
      (sq) => this.handleSquareClick(sq)
    );

    this.ui = new UIManager(this.sanctuary, {
      onNewGame: () => this.startNewGame(),
      onUndo: () => this.undoMove(),
      onCamera: () => {
        const name = this.sceneManager.cycleCameraPreset();
        document.getElementById('camera-label').textContent = name;
      },
      onMode: () => {
        const mode = this.ai.cycleMode();
        const labels = { adept: 'AI Adept', novice: 'AI Novice', '2p': '2P Pass' };
        document.getElementById('mode-label').textContent = labels[mode];
      },
      onAudio: () => {
        const on = this.sound.toggle();
        document.getElementById('audio-icon').textContent = on ? 'volume_up' : 'volume_off';
      },
      onJoinRoom: (room) => {
        document.getElementById('b-name').textContent = room.host;
        document.getElementById('b-order').textContent = room.order;
        document.getElementById('b-elo').textContent = `${room.elo} ELO`;
        const badge = document.getElementById('room-badge');
        badge.textContent = `ROOM ${room.code}`;
        badge.classList.remove('hidden');
        this.ai.difficulty = '2p';
        document.getElementById('mode-label').textContent = 'Online Duel';
        this.startNewGame();
      }
    });

    this.startNewGame();
    this.clock = new THREE.Clock();
    this.loop();
  }

  startNewGame() {
    this.chess.reset();
    this.selectedSquare = null;
    this.sceneManager.syncBoard(this.chess.getBoard());
    this.sceneManager.highlightSquares(null, []);
    this.ui.updateStatus(this.chess.getStatus(), this.chess.capturedWhite, this.chess.capturedBlack);
  }

  undoMove() {
    this.chess.undo();
    if (this.ai.difficulty !== '2p') this.chess.undo();
    this.selectedSquare = null;
    this.sceneManager.syncBoard(this.chess.getBoard());
    this.sceneManager.highlightSquares(null, []);
    this.ui.updateStatus(this.chess.getStatus(), this.chess.capturedWhite, this.chess.capturedBlack);
  }

  handleSquareClick(square) {
    const status = this.chess.getStatus();
    if (status.isGameOver) return;

    if (this.selectedSquare) {
      const move = this.chess.makeMove(this.selectedSquare, square);
      if (move) {
        this.executeMoveEffects(move);
        this.selectedSquare = null;
        this.sceneManager.highlightSquares(null, []);

        if (!this.chess.getStatus().isGameOver && this.ai.difficulty !== '2p' && this.chess.getTurn() === 'b') {
          setTimeout(() => this.triggerAIMove(), 550);
        }
        return;
      }
    }

    const legal = this.chess.getLegalMoves(square);
    if (legal.length > 0) {
      this.selectedSquare = square;
      this.sound.playSelect();
      this.sceneManager.highlightSquares(square, legal);
    } else {
      this.selectedSquare = null;
      this.sceneManager.highlightSquares(null, []);
    }
  }

  triggerAIMove() {
    const aiMove = this.ai.chooseMove(this.chess.chess);
    if (!aiMove) return;
    const move = this.chess.makeMove(aiMove.from, aiMove.to);
    if (move) this.executeMoveEffects(move);
  }

  executeMoveEffects(move) {
    if (move.captured) {
      const capturedColor = move.color === 'w' ? 'b' : 'w';
      this.sceneManager.triggerCaptureShatter(move.to, capturedColor);
      this.sound.playShatter();
      if (move.color === 'w') {
        this.sanctuary.recordShatter();
        this.ui.refreshProfileHUD();
      }
    } else {
      this.sound.playMove();
    }

    this.sceneManager.syncBoard(this.chess.getBoard());
    const st = this.chess.getStatus();
    if (st.inCheck) this.sound.playCheck();
    if (st.isCheckmate) {
      this.sanctuary.recordMatchOutcome(move.color === 'w');
      this.ui.refreshProfileHUD();
    }
    this.ui.updateStatus(st, this.chess.capturedWhite, this.chess.capturedBlack);
  }

  loop() {
    requestAnimationFrame(() => this.loop());
    const dt = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();
    this.sceneManager.animate(dt, elapsed);
  }
}

new WizardsChessApp();
