import Board from "@/pages/caro/components/Board";
import "./caro.scss";
import { useEffect, useState } from "react";
import { Button, InputNumber } from "antd";

const Caro = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [boardSize, setBoardSize] = useState<number>(24);
  const [size, setSize] = useState<number>(boardSize);
  const [board, setBoard] = useState<(string | null)[][]>(
    Array(boardSize).fill(null).map(() => Array(boardSize).fill(null))
  );
  const [isXNext, setIsXNext] = useState<boolean>(false);
  const [winner, setWinner] = useState<string | null>(null);

  function checkWinner() {

  }

  function handleCreateNewGame(size: number) {
    setLoading(true);
    setBoard(Array(size).fill(null).map(() => Array(size).fill(null)));
    const timeoutId = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timeoutId);
  }

  function handleClick(row: number, col: number) {
    if (board[row][col] || winner) return;

    const newBoard = board.map((row) => [...row]);
    newBoard[row][col] = isXNext ? "X" : "O";

    setBoard(newBoard);
    setIsXNext((prev) => !prev);
  }

  useEffect(() => {
    handleCreateNewGame(boardSize)
  }, [boardSize]);

  return (
    <div className="caro">
      <div className="flex items-center gap-3">
        <InputNumber
          className="w-[134px]"
          value={size}
          min={18}
          max={36}
          addonAfter={
            <div className="cursor-pointer" onClick={() => setBoardSize(size)}>
              Setup
            </div>
          }
          onChange={(e) => setSize(e ?? 24)}
        />

        <Button type="primary" onClick={() => handleCreateNewGame(boardSize)}>New Game</Button>
      </div>

      <p>Is next player: {isXNext ? "X" : "O"}</p>

      <Board loading={loading} board={board} onClick={handleClick} />
    </div>
  )
}

export default Caro