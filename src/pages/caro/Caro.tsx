import Board from "@/pages/caro/components/Board";
import "./caro.scss";
import { useEffect, useState } from "react";
import { Button, InputNumber } from "antd";

export interface ICell {
  value: string | null;
  isWin: boolean;
}

const Caro = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [boardSize, setBoardSize] = useState<number>(24);
  const [size, setSize] = useState<number>(boardSize);
  const [board, setBoard] = useState<ICell[][]>(
    Array.from({ length: boardSize }, () =>
      Array.from({ length: boardSize }, () => ({
        value: null,
        isWin: false
      }))
    )
  );
  const [isXNext, setIsXNext] = useState<boolean>(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [winningLine, setWinningLine] = useState<number[][]>([]);
  const directions = [
    [
      [0, -1],
      [0, 1],
    ], // Ngang
    [
      [-1, 0],
      [1, 0],
    ], // Doc
    [
      [1, -1],
      [-1, 1],
    ], // Cheo phai
    [
      [-1, -1],
      [1, 1]
    ] // Cheo trai
  ]

  function checkWinner(board: ICell[][], row: number, col: number) {
    let count = 1;
    let winningArr = [];
    let currentUser = board[row][col].value;
    if (!currentUser) return;

    for (const direction of directions) {
      count = 1;
      for (const [dx, dy] of direction) {
        winningArr = [];
        winningArr.push([row, col]);
        let rowTemp = row + dx;
        let colTemp = col + dy;

        while (
          rowTemp >= 0 &&
          rowTemp < boardSize &&
          colTemp >= 0 &&
          colTemp < boardSize &&
          currentUser === board[rowTemp][colTemp].value
        ) {
          winningArr.push([rowTemp, colTemp]);
          count++;
          rowTemp = rowTemp + dx;
          colTemp = colTemp + dy;
        }

        if (count >= 5) {
          setWinningLine(winningArr);
          return true;
        }
      }
    }

    return false;
  }

  function handleCreateNewGame(size: number) {
    setLoading(true);
    setBoard(
      Array.from({ length: size }, () =>
        Array.from({ length: size }, () => ({
          value: null,
          isWin: false
        }))
      ));
    setWinner(null);
    setIsXNext(false);
    const timeoutId = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timeoutId);
  }

  function handleClick(row: number, col: number) {
    if (board[row][col].value || winner) return;

    const newBoard = board.map((row) => [...row]);
    newBoard[row][col].value = isXNext ? "X" : "O";

    if (checkWinner(newBoard, row, col)) {
      setWinner(newBoard[row][col].value);
    }

    setBoard(newBoard);
    setIsXNext((prev) => !prev);
  }

  useEffect(() => {
    handleCreateNewGame(boardSize)
  }, [boardSize]);

  useEffect(() => {
    const newBoard = board.map((row, rowIndex) => {
      return row.map((cell, colIndex) => {
        return {
          ...cell,
          isWin: winningLine.some((e) => e[0] === rowIndex && e[1] === colIndex),
        }
      })
    })
    setBoard(newBoard);
  }, [winningLine])

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

      <p className={`p-2 rounded-md ${winner ? 'bg-[#d9ffd6]' : ''}`}>
        {winner ? `Winner: ${winner}` : `Next player is: ${isXNext ? "X" : "O"}`}
      </p>

      <Board loading={loading} board={board} onClick={handleClick} />
    </div>
  )
}

export default Caro