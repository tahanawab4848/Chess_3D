const PIECE_VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

export class AIController {
  constructor(difficulty = 'adept') {
    this.difficulty = difficulty; // 'novice' | 'adept' | '2p'
  }

  cycleMode() {
    const modes = ['adept', 'novice', '2p'];
    const next = (modes.indexOf(this.difficulty) + 1) % modes.length;
    this.difficulty = modes[next];
    return this.difficulty;
  }

  chooseMove(chessInstance) {
    const moves = chessInstance.moves({ verbose: true });
    if (!moves.length) return null;

    if (this.difficulty === 'novice') {
      const captures = moves.filter(m => m.captured);
      if (captures.length && Math.random() > 0.4) {
        return captures[Math.floor(Math.random() * captures.length)];
      }
      return moves[Math.floor(Math.random() * moves.length)];
    }

    // Adept Minimax 2-ply with capture & center prioritization
    let bestMove = moves[0];
    let bestScore = -Infinity;

    for (const move of moves) {
      chessInstance.move(move);
      const score = -this.evaluateBoard(chessInstance, chessInstance.turn());
      chessInstance.undo();

      const centerBonus = ['d4', 'd5', 'e4', 'e5'].includes(move.to) ? 25 : 0;
      const total = score + centerBonus + (Math.random() * 12 - 6);

      if (total > bestScore) {
        bestScore = total;
        bestMove = move;
      }
    }

    return bestMove;
  }

  evaluateBoard(chess, perspectiveColor) {
    let score = 0;
    const board = chess.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (!piece) continue;
        const val = PIECE_VALUES[piece.type] || 0;
        score += piece.color === perspectiveColor ? val : -val;
      }
    }
    return score;
  }
}
