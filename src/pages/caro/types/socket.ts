// src/types/socket.ts
export interface Player {
  id: string;
  mark: 'X' | 'O';
}

export interface GameState {
  board: string[][];
  players: Player[];
  currentTurn: string;
}

export interface GameOverData {
  winner: string;
  board: string[][];
}
