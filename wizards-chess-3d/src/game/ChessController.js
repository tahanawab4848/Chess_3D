import { Chess } from 'chess.js';

export class ChessController {
  constructor() {
    this.chess = new Chess();
    this.capturedWhite = [];
    this.capturedBlack = [];
  }

  reset() {
    this.chess.reset();
    this.capturedWhite = [];
    this.capturedBlack = [];
  }

  getBoard() {
    return this.chess.board();
  }

  getTurn() {
    return this.chess.turn(); // 'w' or 'b'
  }

  getLegalMoves(square) {
    return this.chess.moves({ square, verbose: true });
  }

  makeMove(from, to, promotion = 'q') {
    try {
      const move = this.chess.move({ from, to, promotion });
      if (move && move.captured) {
        if (move.color === 'w') {
          this.capturedBlack.push(move.captured);
        } else {
          this.capturedWhite.push(move.captured);
        }
      }
      return move;
    } catch {
      return null;
    }
  }

  undo() {
    const move = this.chess.undo();
    if (move && move.captured) {
      if (move.color === 'w') this.capturedBlack.pop();
      else this.capturedWhite.pop();
    }
    return move;
  }

  getStatus() {
    return {
      inCheck: this.chess.inCheck(),
      isCheckmate: this.chess.isCheckmate(),
      isDraw: this.chess.isDraw(),
      isGameOver: this.chess.isGameOver(),
      turn: this.chess.turn(),
      history: this.chess.history(),
      fen: this.chess.fen()
    };
  }
}
